import { execFile } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, statSync, writeFileSync } from 'node:fs'
import { delimiter, dirname, isAbsolute, join, resolve } from 'node:path'
import { readCloudFile } from './cloud-io.mjs'
import { extractJson } from './jsonout.mjs'

const JOB_TTL = 30 * 60 * 1000
const JOB_TIMEOUT = 10 * 60 * 1000
const JOB_LIMIT = 64
const DEFLECTION = 0.005
const readJson = (file) => { try { return JSON.parse(readFileSync(file, 'utf8')) } catch { return null } }
const pathKey = (file) => process.platform === 'win32' ? file.toLowerCase() : file
const failText = (error) => String(error?.message || error || 'CAD 生成失败').slice(0, 600)

export function fileIdentity(file) {
  const path = realpathSync(resolve(file))
  const st = statSync(path)
  if (!st.isFile() || !st.size) throw new Error(`文件为空或不是文件：${path}`)
  return { path, size: st.size, mtimeMs: st.mtimeMs }
}

export function sameIdentity(a, b) {
  return Boolean(a && b && pathKey(a.path) === pathKey(b.path) && a.size === b.size && a.mtimeMs === b.mtimeMs)
}

function executable(name) {
  if (isAbsolute(name)) return existsSync(name) ? name : null
  const extensions = process.platform === 'win32' ? (process.env.PATHEXT || '.EXE;.CMD').split(';') : ['']
  for (const dir of (process.env.PATH || '').split(delimiter)) {
    if (!dir) continue
    for (const ext of ['', ...extensions]) {
      const candidate = resolve(dir, name + ext)
      try { if (statSync(candidate).isFile()) return candidate } catch { /* next candidate */ }
    }
  }
  return null
}

function simpleRun(exe, args, timeout = 12000) {
  return new Promise((done) => execFile(exe, args, { windowsHide: true, timeout, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }, maxBuffer: 1024 * 1024 }, (err, stdout, stderr) => done({ err, stdout: String(stdout || ''), stderr: String(stderr || '') })))
}

/** Find an interpreter that can actually import CadQuery, rather than only answering --version. */
export async function findCadPython(run = simpleRun, room = false, workspace = process.cwd()) {
  const localPython = process.platform === 'win32'
    ? join(workspace, '.venv-cad', 'Scripts', 'python.exe')
    : join(workspace, '.venv-cad', 'bin', 'python')
  const configured = process.env.CLOUDFORGE_PYTHON
  const override = configured && /[\\/]/.test(configured) ? resolve(workspace, configured) : configured
  const names = [override, localPython, 'python', 'py', 'python3'].filter(Boolean)
  const seen = new Set()
  for (const name of names) {
    const exe = executable(name)
    if (!exe || seen.has(pathKey(exe))) continue
    seen.add(pathKey(exe))
    const prefix = /(?:^|[\\/])py(?:\.exe)?$/i.test(exe) ? ['-3'] : []
    const probe = room ? 'import cadquery, numpy, scipy; print("CLOUDFORGE_CAD_READY")' : 'import cadquery; print("CLOUDFORGE_CAD_READY")'
    const result = await run(exe, [...prefix, '-c', probe], 12000)
    if (!result.err && result.stdout.includes('CLOUDFORGE_CAD_READY')) return { exe, prefix }
  }
  throw new Error(room
    ? '未找到可用的 CadQuery / NumPy / SciPy Python 环境。请配置 CLOUDFORGE_PYTHON 指向已安装这些依赖的解释器，再重新生成。'
    : '未找到可用的 CadQuery Python 环境。请配置 CLOUDFORGE_PYTHON 指向已安装 CadQuery 的解释器，再重试。')
}

function stopChild(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') {
    const taskkill = join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe')
    execFile(taskkill, ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
  }
  try { child.kill() } catch { /* already closed */ }
}

/** PLY with only little-endian XYZ; never recenter, reorder, or filter points. */
export function writeNormalized(file, parsed) {
  if (parsed.kind !== 'points' || !parsed.count) throw new Error('源文件没有可建模点云')
  const head = Buffer.from(`ply\nformat binary_little_endian 1.0\nelement vertex ${parsed.count}\nproperty float x\nproperty float y\nproperty float z\nend_header\n`, 'ascii')
  const payload = Buffer.allocUnsafe(parsed.count * 12)
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < parsed.count * 3; i++) {
    const value = parsed.positions[i]
    if (!Number.isFinite(value)) throw new Error(`点云第 ${Math.floor(i / 3) + 1} 个点包含非有限坐标，请先清理源文件`)
    payload.writeFloatLE(value, i * 4)
    const axis = i % 3
    min[axis] = Math.min(min[axis], value)
    max[axis] = Math.max(max[axis], value)
  }
  const span = Math.max(...max.map((value, axis) => value - min[axis]))
  if (!Number.isFinite(span) || span <= 0) throw new Error('点云没有有效空间尺寸，无法生成 CAD')
  writeFileSync(file, Buffer.concat([head, payload]), { flag: 'wx' })
  return { points: parsed.count, bboxMin: min, bboxMax: max, span }
}

function planeRoute(result) {
  const shapes = result.shapes || []
  const count = shapes.length
  if (!count) throw new Error('检测没有获得可重建的几何基元')
  const planes = shapes.filter((shape) => shape.type === 'Plane')
  const inliers = shapes.reduce((sum, shape) => sum + (Number(shape.inlier_count) || 0), 0)
  const planeInliers = planes.reduce((sum, shape) => sum + (Number(shape.inlier_count) || 0), 0)
  const horizontal = planes.some((shape) => {
    const c = shape.coefficients || []
    const norm = Math.hypot(c[0], c[1], c[2])
    return norm > 0 && Math.abs(c[2] / norm) >= 0.5
  })
  return horizontal && planes.length / count >= 0.90 && planeInliers / Math.max(1, inliers) >= 0.90 ? 'room-skeleton' : 'primitive-cad'
}

function copyDetection(sourceDir, destination, identity, count) {
  const result = readJson(join(sourceDir, 'result.json'))
  const meta = readJson(join(sourceDir, 'run.meta.json'))
  if (!sameIdentity(meta?.sourceIdentity, identity) || !result || result.input_point_count !== count) return null
  const recorded = result.source_cloud || meta?.cloud
  if (!recorded) return null
  try { if (pathKey(realpathSync(resolve(sourceDir, recorded))) !== pathKey(identity.path)) return null } catch { return null }
  const shapes = result.shapes
  if (!Array.isArray(shapes) || !shapes.length) return null
  for (const shape of shapes) {
    if (!Number.isSafeInteger(shape.id) || shape.id < 0 || !existsSync(join(sourceDir, 'indices', `shape_${shape.id}.txt`))) return null
  }
  mkdirSync(join(destination, 'indices'))
  for (const name of readdirSync(join(sourceDir, 'indices'))) {
    if (/^(?:shape_\d+|remaining)\.txt$/.test(name)) copyFileSync(join(sourceDir, 'indices', name), join(destination, 'indices', name))
  }
  return { ...result, source_cloud: identity.path }
}

/** Two-stage generation keeps long detect/OCC work outside the service's 30-second response window. */
export function createCadGeneration({ workspace, cli }) {
  const jobs = new Map()
  const requests = new Map()
  let active = null
  let disposed = false
  const prune = () => {
    const now = Date.now()
    for (const [id, job] of jobs) {
      if (job.done && now - job.finishedAt > JOB_TTL) { jobs.delete(id); if (job.requestId) requests.delete(job.requestId) }
    }
    while (jobs.size >= JOB_LIMIT) {
      const old = [...jobs.values()].find((job) => job.done)
      if (!old) break
      jobs.delete(old.job); if (old.requestId) requests.delete(old.requestId)
    }
  }
  const timer = setInterval(prune, 60000)
  timer.unref?.()
  const snapshot = (job) => ({
    ok: !job.error, started: true, job: job.job, done: job.done, stage: job.stage,
    sourceCloud: job.identity.path, resultDir: job.resultDir, elapsedMs: (job.finishedAt || Date.now()) - job.startedAt,
    ...(job.error ? { error: job.error } : {}), ...(job.step ? { step: job.step, stl: job.stl, route: job.route, meta: job.meta } : {}),
  })
  const assertSource = (job) => {
    if (disposed || job.cancelled) throw new Error('CAD 生成已中止')
    if (Date.now() - job.startedAt >= JOB_TIMEOUT) throw new Error('CAD 生成超时，请减小点云规模后重试')
    if (!sameIdentity(fileIdentity(job.identity.path), job.identity)) throw new Error('源点云在生成过程中发生变化，请重新生成')
  }
  const run = (job, exe, args, timeoutMs) => new Promise((done) => {
    if (disposed || job.cancelled) return done({ err: new Error('CAD 生成已中止'), stdout: '', stderr: '' })
    const remaining = JOB_TIMEOUT - (Date.now() - job.startedAt)
    const child = execFile(exe, args, { windowsHide: true, timeout: Math.max(1, Math.min(timeoutMs, remaining)), env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      job.child = null
      done({ err, stdout: String(stdout || ''), stderr: String(stderr || '') })
    })
    job.child = child
    const killTimer = setTimeout(() => stopChild(child), Math.max(1, Math.min(timeoutMs, remaining)))
    child.once('close', () => clearTimeout(killTimer))
  })
  const command = async (job, exe, args, timeoutMs) => {
    const output = await run(job, exe, args, timeoutMs)
    const parsed = extractJson(output.stdout)
    if (parsed?.exported === 0) throw new Error('未检测到可导出的几何形状，请调整检测预设或选择合适的点云')
    if (output.err || !parsed || parsed.ok === false) throw new Error(parsed?.error || output.stderr.slice(-500) || output.err?.message || '建模工具没有返回有效结果')
    assertSource(job)
    return parsed
  }
  async function generate(job) {
    try {
      assertSource(job)
      mkdirSync(job.resultDir, { recursive: false })
      writeFileSync(join(job.resultDir, 'cad.manifest.json'), JSON.stringify({ status: 'pending', sourceCloud: job.identity.path, sourceIdentity: job.identity, resultDir: job.resultDir }))
      const normalized = join(job.resultDir, 'source.xyz.ply')
      job.stage = '读取并标准化点云'
      const source = writeNormalized(normalized, readCloudFile(job.identity.path))
      assertSource(job)
      let result = job.sourceResult ? copyDetection(job.sourceResult, job.resultDir, job.identity, source.points) : null
      let detected = null
      if (!result) {
        job.stage = '检测点云几何基元'
        detected = await command(job, cli, ['detect', normalized, '--preserve-points', '--preset', job.preset, '--output', job.resultDir], 6 * 60 * 1000)
        result = readJson(join(job.resultDir, 'result.json'))
        if (!result || result.input_point_count !== source.points) throw new Error('检测结果点数与源点云不一致，无法安全重建')
      }
      result.source_cloud = job.identity.path
      writeFileSync(join(job.resultDir, 'result.json'), JSON.stringify(result, null, 1))
      writeFileSync(join(job.resultDir, 'run.meta.json'), JSON.stringify({ cloud: job.identity.path, sourceIdentity: job.identity, normalizedCloud: normalized, preset: job.preset, at: new Date().toISOString(), elapsed_ms: detected?.elapsed_ms ?? null, reusedDetection: Boolean(!detected), cli }, null, 1))
      const route = planeRoute(result)
      job.route = route
      job.stage = route === 'room-skeleton' ? '重建墙体、地板与顶棚' : '重建参数化几何实体'
      const python = await findCadPython((exe, args, timeout) => run(job, exe, args, timeout), route === 'room-skeleton', workspace)
      assertSource(job)
      const step = join(job.resultDir, 'model.step'), stl = join(job.resultDir, 'model.stl')
      const toolDir = join(workspace, 'hackathon', 'tools')
      let model
      if (route === 'room-skeleton') {
        model = await command(job, python.exe, [...python.prefix, join(toolDir, 'room-skeleton.py'), join(job.resultDir, 'result.json'), normalized, step, '800', '--stl', stl, '--deflection', String(DEFLECTION), '--source-cloud', job.identity.path, '--source-span', String(source.span), '--json'], 3 * 60 * 1000)
      } else {
        const script = join(job.resultDir, 'model.py')
        await command(job, cli, ['cad', normalized, '--result', join(job.resultDir, 'result.json'), '--out', script, '--step', step], 60000)
        job.stage = '导出 STEP 与预览网格'
        model = await command(job, python.exe, [...python.prefix, join(toolDir, 'cad-export-runner.py'), script, step, stl, String(DEFLECTION), '--source-cloud', job.identity.path, '--source-span', String(source.span)], 3 * 60 * 1000)
      }
      if (!existsSync(step) || !existsSync(stl) || statSync(stl).size <= 84) throw new Error('生成工具没有产出完整 STEP / STL 文件')
      assertSource(job)
      const meta = { status: 'ready', sourceCloud: job.identity.path, sourceIdentity: job.identity, resultDir: job.resultDir, step, stl, stepIdentity: fileIdentity(step), stlIdentity: fileIdentity(stl), units: 'm', stepCoordinateUnit: 'mm', previewUnits: 'm', previewScale: 0.001, route, scope: route === 'room-skeleton' ? '建筑骨架：墙体、地板与顶棚' : '检测到的参数化几何基元', deflection: DEFLECTION, generatedAt: new Date().toISOString(), model }
      writeFileSync(stl + '.json', JSON.stringify({ ...model, source: step, sourceCloud: job.identity.path, resultDir: job.resultDir, sourceIdentity: meta.stepIdentity, stlIdentity: meta.stlIdentity, engine: 'generated', previewScale: 0.001, previewUnits: 'm', stepCoordinateUnit: 'mm', route, deflection: DEFLECTION }, null, 1))
      writeFileSync(join(job.resultDir, 'cad.manifest.json'), JSON.stringify(meta, null, 1))
      job.step = step; job.stl = stl; job.meta = meta
      job.stage = '生成完成'
    } catch (error) {
      job.error = failText(error); job.stage = '生成失败'
      if (existsSync(job.resultDir)) {
        try { writeFileSync(join(job.resultDir, 'cad.manifest.json'), JSON.stringify({ status: 'failed', error: job.error, sourceCloud: job.identity.path, sourceIdentity: job.identity, resultDir: job.resultDir })) } catch { /* job status remains available */ }
      }
    }
    finally { job.done = true; job.finishedAt = Date.now(); if (active === job) active = null }
  }
  return {
    begin(input = {}) {
      if (disposed) return { ok: false, error: 'CAD 生成组件已卸载' }
      prune()
      const cloud = String(input.cloud || '')
      if (!cloud || cloud.length > 8192 || !/\.(ply|pcd)$/i.test(cloud)) return { ok: false, error: '请选择有效的 PLY / PCD 点云' }
      let identity
      try { identity = fileIdentity(resolve(workspace, cloud)) } catch (error) { return { ok: false, error: failText(error) } }
      if (!existsSync(cli)) return { ok: false, error: `cloudforge-cli 未构建：${cli}` }
      const preset = /^(outdoor|outdoor_planes)$/.test(String(input.preset || '')) ? 'outdoor' : 'mechanical'
      const requestId = String(input.request_id || '')
      if (requestId.length > 128) return { ok: false, error: '生成请求标识过长，请重新发起生成' }
      const sourceResult = input.result_dir ? resolve(workspace, String(input.result_dir)) : null
      const fingerprint = JSON.stringify([identity, preset, sourceResult])
      const previous = requestId && jobs.get(requests.get(requestId))
      if (previous) return previous.fingerprint === fingerprint ? snapshot(previous) : { ok: false, error: '同一请求标识对应了不同点云，请重新发起生成' }
      if (active) return active.fingerprint === fingerprint ? snapshot(active) : { ok: false, error: '另一个 CAD 正在生成，请等待完成后再生成' }
      mkdirSync(join(workspace, 'outputs'), { recursive: true })
      const id = randomUUID()
      const job = { job: id, identity, sourceResult, preset, requestId, fingerprint, done: false, startedAt: Date.now(), stage: '准备生成', resultDir: join(workspace, 'outputs', `cad-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)}-${id.slice(0, 8)}`) }
      jobs.set(id, job); if (requestId) requests.set(requestId, id)
      active = job
      setImmediate(() => void generate(job))
      return snapshot(job)
    },
    status(input = {}) {
      prune()
      const job = jobs.get(String(input.job || ''))
      return job ? snapshot(job) : { ok: false, done: true, error: 'CAD 生成任务不存在或已过期，请查看交付物', stage: '任务已过期' }
    },
    dispose() {
      disposed = true; clearInterval(timer)
      if (active) { active.cancelled = true; stopChild(active.child) }
    },
  }
}

