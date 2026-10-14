// Current-workspace verification. Invoked only by the registered AGH tool;
// the panel prepares immutable requests and reads results, never runs this engine.
import { createHash, randomUUID } from 'node:crypto'
import { existsSync, lstatSync, readFileSync, realpathSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { readCloudFile } from '../cloudforge-panel/extensions/main/lib/cloud-io.mjs'

const MiB = 1024 * 1024
const TIMEOUT = 240000
const terminal = new Set(['pass', 'fail', 'partial', 'error', 'stale'])
const active = new Map()
const key = (file) => process.platform === 'win32' ? file.toLowerCase() : file
const portable = (base, file) => relative(base, file).replaceAll('\\', '/') || '.'
const text = (error) => String(error?.message || error || 'Verification failed').slice(0, 700)

export function resolveProjectRoot(cwd) {
  // A session's selected project wins; environment overrides are explicit and portable.
  const candidates = [cwd, process.env.CLOUDFORGE_WORKSPACE, process.cwd(), dirname(fileURLToPath(import.meta.url))].filter(Boolean)
  for (const initial of candidates) {
    let dir = resolve(initial)
    for (;;) {
      if (existsSync(join(dir, 'hackathon', 'cli', 'CMakeLists.txt')) && existsSync(join(dir, 'src-tauri', 'Cargo.toml'))) return realpathSync(dir)
      if (existsSync(join(dir, 'CloudForge', 'hackathon', 'cli', 'CMakeLists.txt')) && existsSync(join(dir, 'CloudForge', 'src-tauri', 'Cargo.toml'))) return realpathSync(join(dir, 'CloudForge'))
      const parent = dirname(dir)
      if (parent === dir) break
      dir = parent
    }
  }
  throw new Error('CloudForge project root unavailable; open the CloudForge workspace or set CLOUDFORGE_WORKSPACE')
}

function readJson(file, limit) {
  const info = statSync(file)
  if (!info.isFile() || info.size <= 0 || info.size > limit) throw new Error(`JSON file exceeds its size budget or is empty: ${file}`)
  return JSON.parse(readFileSync(file, 'utf8'))
}
function optionalJson(file, limit = 256 * 1024) { try { return readJson(file, limit) } catch { return null } }
function atomic(file, value) {
  const temporary = `${file}.${randomUUID()}.tmp`
  try {
    writeFileSync(temporary, typeof value === 'string' ? value : JSON.stringify(value, null, 2), { flag: 'wx', encoding: 'utf8' })
    renameSync(temporary, file)
  } finally { try { unlinkSync(temporary) } catch { /* already published */ } }
}
function identity(file, limit) {
  const path = realpathSync(file), info = statSync(path)
  if (!info.isFile() || info.size <= 0 || info.size > limit) throw new Error(`File empty, missing, or beyond size budget: ${file}`)
  return { path, size: info.size, mtimeMs: info.mtimeMs }
}
function same(a, b) {
  return Boolean(a && b && typeof b.path === 'string' && key(a.path) === key(b.path) && a.size === b.size && a.mtimeMs === b.mtimeMs)
}
function selected(base, value, expected, limit) {
  if (typeof value !== 'string' || !value || value.length > 8192 || value.includes('\0')) throw new Error('Invalid selected file path')
  const file = resolve(base, value), actual = identity(file, limit)
  if (!same(actual, expected)) throw Object.assign(new Error(`Selected file changed since request preparation: ${value}`), { stale: true })
  return actual
}
function parseJsonOutput(output) {
  const raw = String(output || ''), start = raw.indexOf('{')
  if (start < 0) throw new Error('Verification command did not return JSON')
  return JSON.parse(raw.slice(start))
}
function finiteArray(values, length) { return Array.isArray(values) && values.length === length && values.every(Number.isFinite) }
function shapesSchema(value, truth = false) {
  if (!value || value.ok === false || !Array.isArray(value.shapes) || value.shapes.length > 20000 || (truth && value.shapes.length === 0)) throw new Error('Geometry JSON has no valid shapes array')
  const ids = new Set(), lengths = { Plane: 4, Sphere: 4, Cylinder: 7, Cone: 7, Torus: 8 }
  for (const shape of value.shapes) {
    if (!shape || !Number.isSafeInteger(shape.id) || shape.id < 0 || ids.has(shape.id) || !finiteArray(shape.coefficients, lengths[shape.type])) throw new Error('Invalid or duplicated geometry ID/type/coefficients')
    ids.add(shape.id)
    const c = shape.coefficients
    if (shape.type === 'Plane' && Math.hypot(...c.slice(0, 3)) < 1e-12) throw new Error('Plane normal is zero')
    if (['Cylinder', 'Cone'].includes(shape.type) && Math.hypot(...c.slice(3, 6)) < 1e-12) throw new Error('Geometry axis is zero')
    if ((shape.type === 'Sphere' && c[3] <= 0) || (shape.type === 'Cylinder' && c[6] <= 0) || (shape.type === 'Cone' && (c[6] <= 0 || c[6] >= Math.PI / 2))) throw new Error('Geometry radius or cone angle is invalid')
    if (!truth && (!Number.isSafeInteger(shape.inlier_count) || shape.inlier_count < 0 || !Number.isFinite(shape.rmse) || shape.rmse < 0 || !Number.isFinite(shape.robust_sigma) || shape.robust_sigma < 0 || !Number.isFinite(shape.soft_score))) throw new Error('Geometry fit statistics are invalid')
  }
}

function resultSource(base, resultFile, result, meta, source, info) {
  const recorded = result.sourceIdentity || meta?.sourceIdentity
  if (recorded) return same(source, recorded)
  for (const path of [result.source_cloud, result.sourceCloud, result.cloud, result.info?.file, meta?.source_cloud, meta?.cloud, info?.file]) {
    if (typeof path !== 'string' || !path) continue
    try { if (key(realpathSync(resolve(dirname(resultFile), path))) === key(source.path)) return true } catch { /* unresolvable source */ }
  }
  return false
}

function indexMetrics(dir, result, count, assertCurrent) {
  const covered = new Uint8Array(count)
  let listed = 0, totalBytes = 0
  const load = (name, expected) => {
    const path = join(dir, 'indices', name), info = statSync(path)
    totalBytes += info.size
    if (!info.isFile() || info.size > 64 * MiB || totalBytes > 512 * MiB) throw new Error('Point index files exceed the verification budget')
    const raw = readFileSync(path, 'utf8')
    let n = 0
    for (const line of raw.split(/\r?\n/)) {
      const value = line.trim()
      if (!value) continue
      if (!/^\d{1,10}$/.test(value)) throw new Error(`Invalid point index in ${name}`)
      const index = Number(value)
      if (!Number.isSafeInteger(index) || index >= count || covered[index]) throw new Error(`Out-of-range or repeated point index in ${name}`)
      covered[index] = 1
      n++
      if (n % 50000 === 0) assertCurrent()
    }
    if (n !== expected) throw new Error(`Point index count does not match result.json: ${name}`)
    listed += n
    return n
  }
  let inliers = 0
  for (const shape of result.shapes) inliers += load(`shape_${shape.id}.txt`, shape.inlier_count)
  if (!Number.isSafeInteger(result.remaining_count) || result.remaining_count < 0 || result.remaining_count > count) throw new Error('Invalid remaining point count')
  if (result.remaining_count > 0 || existsSync(join(dir, 'indices', 'remaining.txt'))) load('remaining.txt', result.remaining_count)
  if (result.inlier_point_sum !== undefined && result.inlier_point_sum !== inliers) throw new Error('Result inlier sum does not match index files')
  return { pointCount: count, inlierPoints: inliers, remainingPoints: result.remaining_count, indexedPoints: listed, unlistedPoints: count - listed, coverage: inliers / count,
    scope: 'Indices are validated against original point order. Unlisted points are reported explicitly; they may be unsampled by the geometric core.' }
}

function truthLinked(truthFile, truth, resultFile, result, meta, source, count, association) {
  const declaredCount = truth.points ?? truth.input_point_count
  if (declaredCount !== undefined && declaredCount !== count) return false
  if (truth.sourceIdentity) return same(source, truth.sourceIdentity)
  const declaredSources = [truth.sourceCloud, truth.source_cloud, truth.cloud].filter((path) => typeof path === 'string' && path)
  if (declaredSources.length) {
    return declaredSources.every((path) => {
      try { return key(realpathSync(resolve(dirname(truthFile), path))) === key(source.path) } catch { return false }
    })
  }
  // Both tags are accepted so requests prepared before the protocol spelling
  // was normalized remain executable. Selection never overrides a mismatched source.
  if (['explicit-selection', 'user-selected'].includes(association) && declaredCount === count) return true
  for (const path of [result.truth, result.truthPath, result.groundtruth, result.groundtruthPath, meta?.truth, meta?.truthPath, meta?.groundtruth, meta?.groundtruthPath]) {
    if (typeof path !== 'string' || !path) continue
    try { if (key(realpathSync(resolve(dirname(resultFile), path))) === key(truthFile) && declaredCount === count) return true } catch { /* missing association */ }
  }
  return false
}

function cadScale(base, cad, source, detection) {
  const parent = dirname(cad.path), manifest = optionalJson(join(parent, 'cad.manifest.json'))
  const previewFiles = [cad.path + '.preview.stl.json', cad.path + '.json', join(parent, 'model.stl.json')]
  const preview = previewFiles.map((file) => optionalJson(file)).find((value) => value && same(cad, value.sourceIdentity))
  const match = manifest && manifest.status === 'ready' && same(source, manifest.sourceIdentity)
    && (same(cad, manifest.stepIdentity) || same(cad, manifest.stlIdentity))
  if (!match) throw new Error('CAD has no matching ready manifest for this source cloud; regenerate CAD from the current source before verification')
  if (detection && typeof manifest.resultDir === 'string') {
    const resultDirectory = resolve(parent, manifest.resultDir)
    if (key(realpathSync(resultDirectory)) !== key(realpathSync(dirname(detection.path)))) throw new Error('CAD manifest refers to a different detection result; select its corresponding workflow')
  }
  const step = /\.(step|stp)$/i.test(cad.path)
  const unit = step ? manifest.stepCoordinateUnit || preview?.stepCoordinateUnit : manifest.previewUnits || manifest.units
  if (!step && unit !== 'm' && unit !== 'mm') throw new Error('STL coordinate unit is not recorded; its physical size cannot be verified')
  // OCP imports STEP into millimetres. Only an explicitly linked historical
  // CloudForge artifact may retain legacy numeric-metre STEP coordinates.
  const legacy = step && preview?.step_to_preview_scale === 1 && preview?.coordinate_unit === 'm' && same(cad, preview.sourceIdentity)
  return { scale: step ? (legacy ? 1 : 0.001) : unit === 'm' ? 1 : 0.001,
    basis: legacy ? 'Linked historical CloudForge STEP numeric-metre coordinates' : step ? 'STEP import millimetres converted to metres' : `Manifest STL ${unit} converted to metres`, manifest }
}

function reportMarkdown(result) {
  const lines = ['# 当前点云与 CAD 验证', '', `结论：${result.summary}`, '',
    `状态：${result.status}；真实精度验证：${result.precisionVerified ? '已使用匹配真值运行，详见检查项' : '尚未验证真实精度'}`, '',
    `当前点云：${result.sourceCloud}`, `检测结果：${result.resultPath || '未提供'}`, `CAD：${result.cadPath || '未提供'}`, `真值：${result.truthPath || '未提供'}`, '',
    '参数距离阈值单位为米；角度阈值单位为度。CAD 实体检查和包围盒合理性不等于点云对 CAD 全表面误差或真实尺寸精度认证。', '',
    `AGH 工具：${result.executor.tool}`, `会话：${result.executor.sessionKey}`, `实际执行目录：${result.executor.cwd}`, `工具调用标识：${result.executor.toolUseId}`, '',
    '以上是工具执行回执。可审计轨迹由 AGH 宿主记录；本文件不生成或替代 AGH trace。', '']
  for (const check of result.checks) {
    lines.push(`## ${check.label}`, '', `状态：${check.status}`, check.summary, '')
    if (check.metrics) lines.push('```json', JSON.stringify(check.metrics, null, 2), '```', '')
  }
  return lines.join('\n')
}

/** context must be the live AGH ToolContext, with host-owned exec and signal. */
export async function executeCurrentVerification({ workspace, request: requestRef, context }) {
  if (!context?.session?.key || !context.session.toolUseId || typeof context.exec !== 'function') throw new Error('A live AGH tool context is required; panel/background invocation is not supported')
  const base = realpathSync(resolve(workspace)), normalized = String(requestRef || '').replaceAll('\\', '/')
  if (!/^outputs\/verify-[A-Za-z0-9_.-]+\/request\.json$/.test(normalized) || isAbsolute(normalized)) throw new Error('request must be a project-relative outputs/verify-*/request.json path')
  const file = resolve(base, normalized), dir = dirname(file)
  // Refuse links on every writable path, including the outputs directory.
  for (const path of [join(base, 'outputs'), dir, file]) if (lstatSync(path).isSymbolicLink()) throw new Error('Verification request paths must not contain links')
  if (key(realpathSync(dir)) !== key(dir) || key(realpathSync(file)) !== key(file)) throw new Error('Verification request leaves its selected workspace')
  const request = readJson(file, 256 * 1024)
  if (request.schemaVersion !== 1 || typeof request.id !== 'string' || !/^[A-Za-z0-9_.-]{1,128}$/.test(request.id) || request.sessionId !== context.session.key) throw new Error('Verification request schema/session does not match this AGH conversation')
  const fingerprint = createHash('sha256').update(JSON.stringify(request)).digest('hex')
  const lock = join(dir, 'execution.lock.json')
  const statusFile = join(dir, 'status.json'), resultFile = join(dir, 'verify.json'), reportFile = join(dir, 'verify-report.md')
  const source = selected(base, request.sourceCloud, request.sourceIdentity, 512 * MiB)
  const detection = request.resultPath ? selected(base, request.resultPath, request.resultIdentity, 16 * MiB) : null
  const cad = request.cadPath ? selected(base, request.cadPath, request.cadIdentity, 256 * MiB) : null
  const truth = request.truthPath ? selected(base, request.truthPath, request.truthIdentity, 8 * MiB) : null
  const resultMeta = request.resultMetaPath ? selected(base, request.resultMetaPath, request.resultMetaIdentity, 256 * 1024) : null
  const cadManifest = request.cadManifestPath ? selected(base, request.cadManifestPath, request.cadManifestIdentity, 256 * 1024) : null
  const infoPath = detection ? join(dirname(detection.path), 'info.json') : null
  const sourceInfo = infoPath && existsSync(infoPath) ? identity(infoPath, 256 * 1024) : null
  const assertIdentities = () => {
    for (const [actual, limit] of [[source, 512 * MiB], [detection, 16 * MiB], [cad, 256 * MiB], [truth, 8 * MiB], [resultMeta, 256 * 1024], [cadManifest, 256 * 1024], [sourceInfo, 256 * 1024]]) {
      if (!actual) continue
      try { if (same(identity(actual.path, limit), actual)) continue } catch { /* deleted or changed */ }
      throw Object.assign(new Error('Input file changed during verification; create a new request for the current files'), { stale: true })
    }
    if (createHash('sha256').update(JSON.stringify(readJson(file, 256 * 1024))).digest('hex') !== fingerprint) throw Object.assign(new Error('Verification request changed during execution'), { stale: true })
  }
  const previous = optionalJson(resultFile, 512 * 1024)
  if (previous?.requestFingerprint === fingerprint && terminal.has(previous.status)) { assertIdentities(); return previous }
  if (active.has(key(file))) return active.get(key(file))
  const existing = optionalJson(lock)
  if (existsSync(lock)) {
    if (!existing || Date.now() - existing.startedAt < TIMEOUT + 30000) throw new Error('This verification request is already running; read its status instead of executing it again')
    unlinkSync(lock)
  }
  const started = Date.now()
  writeFileSync(lock, JSON.stringify({ id: request.id, requestFingerprint: fingerprint, startedAt: started, toolUseId: context.session.toolUseId }), { flag: 'wx' })
  const executor = { tool: 'cloudforge_verify_current', sessionKey: context.session.key, toolUseId: context.session.toolUseId, lane: context.session.lane,
    turn: context.session.turn, step: context.session.step, cwd: base, sessionCwd: context.cwd, workspaceRoot: context.session.workspaceRoot }
  const result = { schemaVersion: 1, id: request.id, jobId: request.id, requestFingerprint: fingerprint, sourceCloud: request.sourceCloud,
    resultPath: request.resultPath || null, cadPath: request.cadPath || null, truthPath: request.truthPath || null, sceneId: request.sceneId || null,
    thresholds: request.thresholds, status: 'running', checks: [], precisionVerified: false, summary: '', executor, startedAt: new Date(started).toISOString() }
  const status = (stage, done = false) => atomic(statusFile, { id: request.id, jobId: request.id, status: result.status, stage, done,
    startedAt: result.startedAt, updatedAt: new Date().toISOString(), ...(done ? { finishedAt: result.finishedAt, summary: result.summary, precisionVerified: result.precisionVerified,
      resultPath: portable(base, resultFile), reportPath: portable(base, reportFile) } : {}), ...(result.error ? { error: result.error } : {}) })
  const assertCurrent = () => {
    if (context.signal?.aborted) throw new Error('AGH verification was cancelled')
    if (Date.now() - started >= TIMEOUT) throw new Error('AGH verification exceeded the four-minute time budget')
  }
  const command = async (exe, args, timeout = 60000) => {
    assertCurrent(); assertIdentities()
    const remaining = context.lease?.remainingMs?.() ?? context.timeoutMs ?? TIMEOUT
    if (remaining <= 0) throw new Error('AGH tool execution deadline reached')
    const output = await context.exec([exe, ...args], { cwd: base, env: { PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }, timeoutMs: Math.max(1, Math.min(timeout, TIMEOUT - (Date.now() - started), remaining)) })
    assertCurrent(); assertIdentities()
    if (output.timedOut || output.truncated) throw new Error(output.timedOut ? 'Verification command timed out' : 'Verification command output was truncated')
    const data = parseJsonOutput(output.stdout)
    return { code: output.code, data }
  }
  const add = (id, label, state, summary, metrics, shapeIds) => result.checks.push({ id, label, status: state, summary, ...(metrics ? { metrics } : {}), ...(shapeIds ? { shapeIds } : {}) })
  const perform = async () => {
    try {
      status('AGH 正在读取当前点云')
      context.progress?.('验证当前点云、检测结果、CAD 与可用真值')
      const tolerance = request.thresholds?.parameterToleranceM ?? 0.005, angle = request.thresholds?.angleToleranceDeg ?? 2
      if (!Number.isFinite(tolerance) || tolerance <= 0 || tolerance > 1 || !Number.isFinite(angle) || angle <= 0 || angle > 90) throw new Error('Invalid verification thresholds (0 < distance <= 1 metre, 0 < angle <= 90 degrees)')
      result.thresholds = { parameterToleranceM: tolerance, angleToleranceDeg: angle }
      const cli = resolve(base, process.env.CLOUDFORGE_CLI || join('hackathon', 'cli', 'build', 'Release', 'cloudforge-cli.exe'))
      if (!existsSync(cli)) throw new Error('cloudforge-cli is not built; build hackathon/cli or configure CLOUDFORGE_CLI')
      const cloudInfo = await command(cli, ['info', source.path])
      if (cloudInfo.code !== 0 || cloudInfo.data.ok !== true) throw new Error(cloudInfo.data.error || 'Point-cloud metadata inspection failed')
      const parsed = readCloudFile(source.path)
      if (parsed.kind !== 'points' || !Number.isSafeInteger(parsed.count) || parsed.count <= 0 || parsed.count > 20000000 || parsed.positions.length !== parsed.count * 3) throw new Error('Point-cloud coordinates are missing or exceed the twenty-million-point verification budget')
      const low = [Infinity, Infinity, Infinity], high = [-Infinity, -Infinity, -Infinity]
      for (let i = 0; i < parsed.positions.length; i++) {
        const value = parsed.positions[i]
        if (!Number.isFinite(value)) throw new Error(`Point ${Math.floor(i / 3)} contains a non-finite coordinate`)
        low[i % 3] = Math.min(low[i % 3], value); high[i % 3] = Math.max(high[i % 3], value)
        if (i % 150000 === 0) assertCurrent()
      }
      const spans = high.map((value, axis) => value - low[axis]), span = Math.max(...spans)
      if (!Number.isFinite(span) || span <= 0 || cloudInfo.data.points !== parsed.count) throw new Error('Point-cloud size/count disagrees between the viewer and CLI')
      add('cloud', '当前点云完整性', 'pass', 'CLI 元信息与原序点云一致，已检查所有 XYZ 坐标为有限值。', { points: parsed.count, bbox_min_m: low, bbox_max_m: high, span_m: spans, coordinate_unit: 'm', scope: 'CloudForge 输入约定为米，未通过外部标尺确认真实单位。' })
      let detectionData = null, meta = null
      if (detection) {
        status('AGH 正在核对检测结果和内点索引')
        detectionData = readJson(detection.path, 16 * MiB); shapesSchema(detectionData)
        meta = resultMeta ? readJson(resultMeta.path, 256 * 1024) : optionalJson(join(dirname(detection.path), 'run.meta.json'))
        const info = sourceInfo ? readJson(sourceInfo.path, 256 * 1024) : null
        if (!resultSource(base, detection.path, detectionData, meta, source, info)) throw new Error('Detection result has no matching source identity/path; rerun detection on the current cloud')
        if (detectionData.input_point_count !== parsed.count || detectionData.shape_count !== detectionData.shapes.length) throw new Error('Detection result point/shape count is inconsistent')
        const metrics = indexMetrics(dirname(detection.path), detectionData, parsed.count, assertCurrent)
        add('detection', '检测结果与点云关联', 'pass', '源点云关联、几何参数、拟合统计和原序内点索引一致。', metrics)
        const poor = detectionData.shapes.filter((shape) => shape.rmse > tolerance)
        add('fit', '当前几何拟合误差', !detectionData.shapes.length ? 'skipped' : poor.length ? 'fail' : 'pass', !detectionData.shapes.length ? '当前检测未检出基元，无法计算基元拟合质量。' : poor.length ? `${poor.length} 个基元 RMSE 超过 ${tolerance * 1000} mm；这是内点拟合质量，不是真实尺寸精度。` : '各基元内点 RMSE 均在所选阈值内；该结果不代替真值对比。',
          { tolerance_m: tolerance, maximum_rmse_m: Math.max(0, ...detectionData.shapes.map((shape) => shape.rmse)), shapes: detectionData.shapes.length }, poor.map((shape) => shape.id))
      } else add('detection', '检测结果与点云关联', 'skipped', '当前未提供检测结果，不能核对几何参数、索引或拟合质量。')
      if (cad) {
        status('AGH 正在检查当前 CAD 实体和尺寸')
        try {
          const scale = cadScale(base, cad, source, detection)
          const python = process.env.CLOUDFORGE_PYTHON ? resolve(base, process.env.CLOUDFORGE_PYTHON) : join(base, '.venv-cad', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python')
          if (!existsSync(python)) throw new Error('CAD verification Python unavailable; install requirements-cad.txt in .venv-cad or configure CLOUDFORGE_PYTHON')
          const checked = await command(python, [join(base, 'hackathon', 'tools', 'cad-verify-current.py'), cad.path, '--scale', String(scale.scale)], 120000)
          if (checked.code !== 0 || checked.data.ok !== true) throw new Error(checked.data.error || 'CAD verification failed')
          const metrics = { ...checked.data, unitBasis: scale.basis }
          if (!finiteArray(metrics.bbox_min_m, 3) || !finiteArray(metrics.bbox_max_m, 3) || !finiteArray(metrics.bbox_m, 3)) throw new Error('CAD verification returned invalid metre dimensions')
          const margin = Math.max(span * 0.05, tolerance * 2)
          const reasonable = metrics.bbox_m.every((value, axis) => value <= spans[axis] * 1.5 + margin)
            && metrics.bbox_min_m.every((value, axis) => value >= low[axis] - margin)
            && metrics.bbox_max_m.every((value, axis) => value <= high[axis] + margin)
          add('cad', '当前 CAD 结构与尺寸', reasonable ? 'pass' : 'fail', reasonable ? '当前源关联的 CAD 已检查结构、单位和坐标范围；尚未计算点云对 CAD 全表面的距离误差。' : 'CAD 包围盒超出当前点云范围或坐标不对齐，请检查单位、源文件和重建参数。', metrics)
        } catch (error) {
          if (error.stale || context.signal?.aborted) throw error
          add('cad', '当前 CAD 结构与尺寸', 'error', text(error))
        }
      } else add('cad', '当前 CAD 结构与尺寸', 'skipped', '当前没有与所选点云明确关联的 CAD，未对其他模型或旧产物进行替代核验。')
      if (!truth) add('truth', '真值精度验证', 'missing-reference', '当前点云没有匹配真值，尚未验证真实精度；未切换到合成案例。')
      else if (!detection) add('truth', '真值精度验证', 'missing-reference', '已提供真值，但当前没有检测结果，无法运行参数精度对比。')
      else {
        status('AGH 正在运行当前结果的真值 verify')
        const truthData = readJson(truth.path, 8 * MiB); shapesSchema(truthData, true)
        if (!truthLinked(truth.path, truthData, detection.path, detectionData, meta, source, parsed.count, request.truthAssociation)) add('truth', '真值精度验证', 'missing-reference', '所选真值缺少与当前点云的明确关联，未运行其他案例的 verify。')
        else {
          const verified = await command(cli, ['verify', '--truth', truth.path, '--result', detection.path, '--tol', String(tolerance), '--angle-deg', String(angle)])
          if (verified.data.ok !== true || typeof verified.data.pass !== 'boolean' || !Array.isArray(verified.data.checks) || verified.data.total !== truthData.shapes.length
            || verified.data.checks.length !== truthData.shapes.length || verified.data.checks.some((check) => typeof check.pass !== 'boolean' || !Number.isFinite(check.param_error) || !Number.isFinite(check.angle_error_deg))
            || verified.data.pass !== verified.data.checks.every((check) => check.pass)
            || (verified.data.pass && verified.code !== 0) || (!verified.data.pass && verified.code !== 2)) throw new Error(verified.data.error || 'Truth verify failed to return a consistent result')
          result.precisionVerified = true
          const failed = verified.data.checks.filter((check) => !check.pass).map((check) => detectionData.shapes[check.matched_shape]?.id).filter(Number.isSafeInteger)
          const association = ['explicit-selection', 'user-selected'].includes(request.truthAssociation) ? '参考由用户为当前点云选定且点数一致；未通过源文件身份独立证明真值来源。' : '参考具有当前源文件的明确关联。'
          add('truth', '真值精度验证', verified.data.pass ? 'pass' : 'fail', (verified.data.pass ? '当前点云与所选真值的参数对比通过。' : '当前点云与所选真值的参数对比未通过；详见实际 CLI 误差和阈值。') + association, { ...verified.data, coordinate_unit: 'm', angle_unit: 'deg', referenceAssociation: request.truthAssociation || 'linked-source' }, failed)
        }
      }
      assertCurrent(); assertIdentities()
      result.status = result.checks.some((check) => check.status === 'error') ? 'error' : result.checks.some((check) => check.status === 'fail') ? 'fail'
        : result.precisionVerified && result.checks.every((check) => check.status === 'pass') ? 'pass' : 'partial'
      result.summary = ({ pass: '当前数据的全部所选检查通过，包括匹配真值的参数精度对比。', fail: '当前数据存在未通过的检查，请查看异常项；未替换为其他案例。',
        error: '部分核验无法执行，请查看依赖或文件关联错误。', partial: '已完成可执行的当前数据核验；缺少参考或交付物，尚不能宣称整体精度通过。' })[result.status]
    } catch (error) {
      result.status = error.stale ? 'stale' : 'error'; result.error = text(error)
      result.summary = error.stale ? '验证期间输入发生变化，结果已失效；请针对当前数据重新发起验证。' : `当前核验未完成：${result.error}`
      add('execution', 'AGH 执行状态', 'error', result.error)
    } finally {
      result.finishedAt = new Date().toISOString()
      // Recheck immediately before publication: no successful report for replaced inputs.
      try { assertIdentities() } catch (error) { result.status = 'stale'; result.error = text(error); result.summary = '输入文件已变化，核验结果失效；请重新发起。'; result.precisionVerified = false }
      try { atomic(reportFile, reportMarkdown(result)); atomic(resultFile, result); status(result.summary, true) }
      finally { try { unlinkSync(lock) } catch { /* already removed */ }; active.delete(key(file)) }
    }
    return result
  }
  const operation = Promise.resolve().then(perform)
  active.set(key(file), operation)
  return operation
}
