import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { readCloudFile } from './cloud-io.mjs'
import { fileIdentity, sameIdentity, writeNormalized } from './cad-generation.mjs'
import { extractJson } from './jsonout.mjs'

const JOB_TTL = 30 * 60 * 1000
const JOB_TIMEOUT = 10 * 60 * 1000
const JOB_LIMIT = 64
const failText = (error) => String(error?.message || error || '点云检测失败').slice(0, 600)
const readJson = (file) => { try { return JSON.parse(readFileSync(file, 'utf8')) } catch { return null } }
const portablePath = (base, file) => relative(base, file).replaceAll('\\', '/') || '.'

function writeJson(file, value) {
  // Publish complete metadata last so the workflow list never exposes partial detection output.
  const temp = `${file}.${randomUUID()}.tmp`
  writeFileSync(temp, JSON.stringify(value, null, 1), { flag: 'wx' })
  renameSync(temp, file)
}

function stopChild(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    execFile(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
  }
  try { child.kill() } catch { /* already closed */ }
}

function validateResult(dir, result, count) {
  if (!result || result.ok === false || result.input_point_count !== count || !Array.isArray(result.shapes)) {
    throw new Error('检测结果与源点云点数不一致，无法安全显示。请重新构建支持 --preserve-points 的 cloudforge-cli')
  }
  if (result.shape_count !== result.shapes.length) throw new Error('检测结果的几何基元数量不完整，请重新检测')
  const ids = new Set()
  for (const shape of result.shapes) {
    if (!Number.isSafeInteger(shape.id) || shape.id < 0 || ids.has(shape.id)
      || !Number.isSafeInteger(shape.inlier_count) || shape.inlier_count < 0 || shape.inlier_count > count
      || !existsSync(join(dir, 'indices', `shape_${shape.id}.txt`))) {
      throw new Error('检测结果缺少有效的基元内点索引，请重新检测')
    }
    ids.add(shape.id)
  }
  if (!Number.isSafeInteger(result.remaining_count) || result.remaining_count < 0 || result.remaining_count > count
    || (result.remaining_count > 0 && !existsSync(join(dir, 'indices', 'remaining.txt')))) {
    throw new Error('检测结果缺少有效的剩余点索引，请重新检测')
  }
}

/** Start immediately; poll long-running local detection without involving a model turn. */
export function createDetection({ workspace, cli }) {
  const base = resolve(workspace)
  const executable = resolve(base, cli)
  const jobs = new Map()
  const requests = new Map()
  let active = null
  let disposed = false

  const forget = (job) => {
    jobs.delete(job.job)
    if (job.requestId && requests.get(job.requestId) === job.job) requests.delete(job.requestId)
  }
  const prune = () => {
    const now = Date.now()
    for (const job of jobs.values()) if (job.done && now - job.finishedAt > JOB_TTL) forget(job)
    while (jobs.size >= JOB_LIMIT) {
      const oldest = [...jobs.values()].find((job) => job.done)
      if (!oldest) break
      forget(oldest)
    }
  }
  const pruneTimer = setInterval(prune, 60000)
  pruneTimer.unref?.()

  const snapshot = (job) => ({
    ok: !job.error,
    started: true,
    job: job.job,
    done: job.done,
    stage: job.stage,
    sourceCloud: job.identity.path,
    resultDir: job.resultDir,
    elapsedMs: (job.finishedAt || Date.now()) - job.startedAt,
    ...(job.error ? { error: job.error } : {}),
  })
  const assertCurrent = (job) => {
    if (job.timedOut || Date.now() - job.startedAt >= JOB_TIMEOUT) throw new Error('点云检测超时，请选择较小的点云后重试')
    if (disposed || job.cancelled) throw new Error('点云检测已中止')
    if (!sameIdentity(fileIdentity(job.identity.path), job.identity)) throw new Error('源点云在检测过程中发生变化，请重新检测')
  }
  const metadata = (job, status, extra = {}) => ({
    cloud: portablePath(job.resultDir, job.identity.path),
    source_cloud: portablePath(job.resultDir, job.identity.path),
    sourceIdentity: job.identity,
    normalizedCloud: 'source.xyz.ply',
    preset: job.preset,
    at: new Date(job.startedAt).toISOString(),
    cli: portablePath(job.resultDir, executable),
    detectionStatus: status,
    elapsed_ms: null,
    ...extra,
  })
  const run = (job, args) => new Promise((done) => {
    assertCurrent(job)
    const remaining = Math.max(1, JOB_TIMEOUT - (Date.now() - job.startedAt))
    const child = execFile(executable, args, {
      cwd: base,
      windowsHide: true,
      encoding: 'utf8',
      timeout: remaining,
      maxBuffer: 8 * 1024 * 1024,
      env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' },
    }, (error, stdout, stderr) => {
      if (job.child === child) job.child = null
      done({ error, stdout: String(stdout || ''), stderr: String(stderr || '') })
    })
    job.child = child
  })

  async function detect(job) {
    try {
      assertCurrent(job)
      mkdirSync(job.resultDir, { recursive: false })
      writeJson(join(job.resultDir, 'run.meta.json'), metadata(job, 'pending'))
      job.stage = '读取并准备点云'
      const normalized = join(job.resultDir, 'source.xyz.ply')
      // The renderer and CLI consume the same Float32 coordinates in original point order.
      const source = writeNormalized(normalized, readCloudFile(job.identity.path))
      if (source.points < 100) throw new Error('点云点数不足，至少需要 100 个有效点才能开始检测')
      assertCurrent(job)
      job.stage = '检测几何基元'
      const output = await run(job, ['detect', normalized, '--preserve-points', '--preset', job.preset, '--output', job.resultDir])
      assertCurrent(job)
      const response = extractJson(output.stdout)
      if (output.error || !response || response.ok === false) {
        throw new Error(response?.error || output.stderr.slice(-500) || output.error?.message || '检测工具没有返回有效结果')
      }
      job.stage = '保存检测结果'
      const result = readJson(join(job.resultDir, 'result.json'))
      validateResult(job.resultDir, result, source.points)
      assertCurrent(job)
      const elapsed = Number.isFinite(response.elapsed_ms) && response.elapsed_ms >= 0 ? response.elapsed_ms : Date.now() - job.startedAt
      result.source_cloud = portablePath(job.resultDir, job.identity.path)
      result.sourceIdentity = job.identity
      result.preset = job.preset
      result.elapsed_ms = elapsed
      writeJson(join(job.resultDir, 'result.json'), result)
      // Only ready runs are discoverable; never mark an interrupted/modified source successful.
      assertCurrent(job)
      writeJson(join(job.resultDir, 'run.meta.json'), metadata(job, 'ready', {
        elapsed_ms: elapsed,
        completedAt: new Date().toISOString(),
        input_point_count: source.points,
      }))
      job.stage = '检测完成'
    } catch (error) {
      job.error = failText(error)
      job.stage = '检测失败'
      if (existsSync(job.resultDir)) {
        try { writeJson(join(job.resultDir, 'run.meta.json'), metadata(job, 'failed', { error: job.error, completedAt: new Date().toISOString() })) } catch { /* job status remains available */ }
      }
    } finally {
      clearTimeout(job.timeoutTimer)
      job.done = true
      job.finishedAt = Date.now()
      if (active === job) active = null
    }
  }

  return {
    begin(input = {}) {
      if (disposed) return { ok: false, error: '点云检测组件已卸载' }
      prune()
      const cloud = String(input.cloud || '')
      if (!cloud || cloud.length > 8192 || !/\.(ply|pcd)$/i.test(cloud)) return { ok: false, error: '请选择有效的 PLY / PCD 点云' }
      const rawPreset = String(input.preset || 'mechanical')
      if (!/^(mechanical|mechanical_full|outdoor|outdoor_planes)$/.test(rawPreset)) return { ok: false, error: '请选择有效的检测场景' }
      const preset = rawPreset.startsWith('outdoor') ? 'outdoor' : 'mechanical'
      const requestId = String(input.request_id || '')
      if (requestId.length > 128) return { ok: false, error: '检测请求标识过长，请重新开始检测' }
      let identity
      try { identity = fileIdentity(resolve(base, cloud)) } catch (error) { return { ok: false, error: failText(error) } }
      if (!existsSync(executable)) return { ok: false, error: `cloudforge-cli 未构建：${portablePath(base, executable)}。请先按 hackathon/cli 的构建说明生成 CLI` }
      const fingerprint = JSON.stringify([identity, preset])
      const previous = requestId && jobs.get(requests.get(requestId))
      if (previous) return previous.fingerprint === fingerprint ? snapshot(previous) : { ok: false, error: '同一请求标识对应了不同点云或场景，请重新开始检测' }
      if (active) return active.fingerprint === fingerprint ? snapshot(active) : { ok: false, error: '另一个点云正在检测，请等待完成后再开始' }
      try { mkdirSync(join(base, 'outputs'), { recursive: true }) } catch (error) { return { ok: false, error: failText(error) } }
      const id = randomUUID()
      const startedAt = Date.now()
      const job = {
        job: id,
        identity,
        preset,
        requestId,
        fingerprint,
        done: false,
        startedAt,
        stage: '准备检测',
        resultDir: join(base, 'outputs', `detect-${new Date(startedAt).toISOString().replace(/[:.]/g, '-').slice(0, 19)}-${id.slice(0, 8)}`),
      }
      jobs.set(id, job)
      if (requestId) requests.set(requestId, id)
      active = job
      job.timeoutTimer = setTimeout(() => { job.timedOut = true; stopChild(job.child) }, JOB_TIMEOUT)
      job.timeoutTimer.unref?.()
      setImmediate(() => void detect(job))
      return snapshot(job)
    },
    status(input = {}) {
      prune()
      const job = jobs.get(String(input.job || ''))
      return job ? snapshot(job) : { ok: false, done: true, error: '检测任务不存在或已过期，请重新开始检测', stage: '任务已过期' }
    },
    dispose() {
      disposed = true
      clearInterval(pruneTimer)
      if (active) { active.cancelled = true; clearTimeout(active.timeoutTimer); stopChild(active.child) }
    },
  }
}
