import { randomUUID } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileIdentity, sameIdentity } from './cad-generation.mjs'

const MiB = 1024 * 1024
const PENDING_TTL = 30 * 60 * 1000
const RUNNING_TTL = 12 * 60 * 1000
const TERMINAL = new Set(['partial', 'pass', 'fail', 'error', 'stale'])
const JOB_NAME = /^verify-\d{4}-\d{2}-\d{2}T[\d-]+-[0-9a-f]{8}$/
const MAX_REQUESTS = 256
const portable = (base, path) => relative(base, path).replaceAll('\\', '/') || '.'
const errorText = (error) => String(error?.message || error || '无法准备当前模型验证').slice(0, 700)

function readJson(path, limit = 256 * 1024) {
  if (!existsSync(path)) return null
  const size = statSync(path).size
  if (size > limit) throw new Error(`验证文件超过读取预算：${path}`)
  const value = JSON.parse(readFileSync(path, 'utf8'))
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('验证文件不是有效对象')
  return value
}

function publishJson(path, value) {
  const temp = `${path}.${randomUUID()}.tmp`
  writeFileSync(temp, JSON.stringify(value, null, 2), { flag: 'wx' })
  renameSync(temp, path)
}

/** Only metadata explicitly attached to this result may associate a cloud or a truth file. */
export function declaredTruthPath(dir, result, meta = null) {
  let record = meta
  try { record ||= readJson(join(dir, 'run.meta.json')) } catch { return null }
  const raw = result?.truth_path || result?.truthPath || result?.truth || result?.groundtruth || result?.groundtruthPath || record?.truthPath || record?.truth_path || record?.truth || record?.groundtruth || record?.groundtruthPath
  if (typeof raw !== 'string' || !raw || raw.length > 8192) return null
  try { const file = resolve(dir, raw); return statSync(file).isFile() ? file : null } catch { return null }
}

/** Prepare a durable request; only the AGH tool executes verification and publishes evidence. */
export function createVerificationHandoff({ workspace }) {
  const base = resolve(workspace)
  const outputs = join(base, 'outputs')
  let disposed = false
  const memo = new Map()
  let indexedAt = 0

  const boundedIdentity = (file, limit, label) => {
    const identity = fileIdentity(resolve(base, file))
    if (identity.size > limit) throw new Error(`${label}超过验证预算，请缩小文件后再验证`)
    return identity
  }
  const pathInput = (value, label, optional = false) => {
    if (optional && (value == null || value === '')) return null
    if (typeof value !== 'string' || !value.trim() || value.length > 8192 || value.includes('\0')) throw new Error(`${label}无效`)
    return resolve(base, value)
  }
  const activeRequest = (entry) => {
    const request = entry.request
    if (!request || request.schemaVersion !== 1 || request.id !== entry.id || request.jobId !== entry.id) throw new Error('验证请求标识不匹配')
    if (!request.sessionId || !request.sourceCloud || !request.resultPath || !request.resultDir || !Number.isFinite(Date.parse(request.createdAt))
      || !Number.isFinite(request.thresholds?.parameterToleranceM) || request.thresholds.parameterToleranceM <= 0 || request.thresholds.parameterToleranceM > 1
      || !Number.isFinite(request.thresholds?.angleToleranceDeg) || request.thresholds.angleToleranceDeg <= 0 || request.thresholds.angleToleranceDeg > 90) throw new Error('验证请求内容无效')
    if (!sameIdentity(entry.requestIdentity, fileIdentity(join(entry.dir, 'request.json')))) throw new Error('验证请求文件已改变，请重新发起')
    for (const [pathName, identityName] of [['sourceCloud', 'sourceIdentity'], ['resultPath', 'resultIdentity'], ['cadPath', 'cadIdentity'], ['truthPath', 'truthIdentity'], ['resultMetaPath', 'resultMetaIdentity'], ['cadManifestPath', 'cadManifestIdentity']]) {
      if (!request[pathName]) continue
      const actual = fileIdentity(resolve(base, request[pathName]))
      if (!sameIdentity(request[identityName], actual)) throw new Error('验证输入文件已改变，请重新发起当前模型验证')
    }
    return request
  }
  const entries = (force = false) => {
    // Service polling must not repeatedly scan unrelated workflow files.
    if (force || Date.now() - indexedAt > 5000) {
      let names = []
      try { names = readdirSync(outputs, { withFileTypes: true }).filter((e) => e.isDirectory() && JOB_NAME.test(e.name)).map((e) => e.name).sort().reverse().slice(0, MAX_REQUESTS) } catch { /* no requests yet */ }
      for (const name of names) {
        const dir = join(outputs, name)
        if (memo.has(dir)) continue
        try {
          const request = readJson(join(dir, 'request.json'))
          if (request?.schemaVersion === 1 && typeof request.id === 'string' && request.id === request.jobId) memo.set(dir, { id: request.id, dir, request, requestIdentity: fileIdentity(join(dir, 'request.json')) })
        } catch { /* an incomplete or invalid request is not eligible for recovery */ }
      }
      indexedAt = Date.now()
      while (memo.size > MAX_REQUESTS) memo.delete(memo.keys().next().value)
    }
    return [...memo.values()].sort((a, b) => String(b.request.createdAt).localeCompare(String(a.request.createdAt)))
  }
  const matchesContext = (request, input) => {
    if (input.session_id && request.sessionId !== input.session_id) return false
    if (input.source_cloud) {
      try { if (!sameIdentity(request.sourceIdentity, fileIdentity(pathInput(input.source_cloud, '当前点云')))) return false } catch { return false }
    }
    if (input.result_dir && resolve(base, request.resultDir) !== pathInput(input.result_dir, '当前检测目录')) return false
    if (input.scene_id && request.sceneId !== input.scene_id) return false
    if (Object.hasOwn(input, 'truth_path')) {
      if (input.truth_path === '') { if (request.truthPath) return false }
      else {
        try { if (!sameIdentity(request.truthIdentity, fileIdentity(pathInput(input.truth_path, '当前参考真值')))) return false } catch { return false }
      }
    }
    if (Object.hasOwn(input, 'parameter_tolerance_m') && request.thresholds?.parameterToleranceM !== input.parameter_tolerance_m) return false
    if (Object.hasOwn(input, 'angle_tolerance_deg') && request.thresholds?.angleToleranceDeg !== input.angle_tolerance_deg) return false
    return true
  }
  const snapshot = (entry) => {
    const request = entry.request
    const common = {
      job: entry.id, request: portable(base, join(entry.dir, 'request.json')),
      sourceCloud: request.sourceCloud, resultDir: request.resultDir, resultPath: request.resultPath,
      cadPath: request.cadPath || null, truthPath: request.truthPath || null,
      cadPreviewScale: request.cadPreviewScale, cadUnits: request.cadUnits, previewUnits: 'm',
      sessionId: request.sessionId, sceneId: request.sceneId || null, thresholds: request.thresholds,
      createdAt: request.createdAt,
    }
    try { activeRequest(entry) } catch (error) { return { ...common, ok: false, state: 'stale', pending: false, done: true, error: errorText(error), reason: '输入已变化，旧验证结果已失效' } }
    let status
    try { status = readJson(join(entry.dir, 'status.json')) } catch (error) { return { ...common, ok: false, state: 'error', pending: false, done: true, error: errorText(error) } }
    if (status && (status.id !== entry.id || status.jobId !== entry.id)) return { ...common, ok: false, state: 'error', pending: false, done: true, error: '验证状态标识不匹配' }
    let state = status?.status || 'queued'
    if (!TERMINAL.has(state) && state !== 'queued' && state !== 'running') return { ...common, ok: false, state: 'error', pending: false, done: true, error: '验证状态无效' }
    const age = Date.now() - Date.parse(state === 'running' ? (status?.startedAt || request.createdAt) : request.createdAt)
    if ((state === 'queued' && age > PENDING_TTL) || (state === 'running' && age > RUNNING_TTL)) return { ...common, ok: false, state: 'stale', pending: false, done: true, error: state === 'queued' ? '请求等待 AGH 执行已超时，请重新发起' : '验证执行已超时，请在 AGH 会话中查看工具调用后重试' }
    let result = null
    if (state === 'pass' || state === 'partial' || state === 'fail') {
      try {
        result = readJson(join(entry.dir, 'verify.json'), 512 * 1024)
        if (!result || result.schemaVersion !== 1 || result.id !== entry.id || result.status !== state
          || result.sourceCloud !== request.sourceCloud || result.resultPath !== request.resultPath
          || (result.cadPath || null) !== request.cadPath || (result.truthPath || null) !== request.truthPath
          || (result.sceneId || null) !== request.sceneId
          || result.thresholds?.parameterToleranceM !== request.thresholds.parameterToleranceM || result.thresholds?.angleToleranceDeg !== request.thresholds.angleToleranceDeg
          || result.executor?.tool !== 'cloudforge_verify_current' || result.executor?.sessionKey !== request.sessionId
          || (!request.truthPath && (state === 'pass' || result.precisionVerified))) throw new Error('缺少与当前 AGH 验证请求匹配的结果')
      } catch (error) { return { ...common, ok: false, state: 'error', pending: false, done: true, error: errorText(error) } }
    }
    const reportFile = ['verify-report.md', 'report.md'].map((name) => join(entry.dir, name)).find((file) => existsSync(file) && statSync(file).isFile())
    const reportPath = reportFile ? portable(base, reportFile) : null
    return {
      ...common, ok: state !== 'error' && state !== 'stale', state, pending: !TERMINAL.has(state), done: TERMINAL.has(state),
      stage: status?.stage || '等待 AGH 执行', reason: state === 'queued' ? '验证请求已准备，等待 AGH 调用 cloudforge_verify_current' : undefined,
      result, reportPath, verifyPath: result ? portable(base, join(entry.dir, 'verify.json')) : null,
      precisionVerified: result?.precisionVerified ?? false, summary: result?.summary ?? status?.summary ?? null,
      ...(status?.error ? { error: String(status.error).slice(0, 700) } : {}),
    }
  }
  const context = (input) => {
    const source = boundedIdentity(pathInput(input.source_cloud ?? input.cloud, '当前点云'), 512 * MiB, '点云')
    if (!/\.(ply|pcd)$/i.test(source.path)) throw new Error('当前验证需要有效的 PLY / PCD 点云')
    const resultDir = pathInput(input.result_dir, '当前检测目录')
    const resultIdentity = boundedIdentity(join(resultDir, 'result.json'), 16 * MiB, '检测结果')
    const result = readJson(resultIdentity.path, 16 * MiB)
    if (!Array.isArray(result?.shapes) || !Number.isSafeInteger(result.input_point_count) || result.input_point_count < 1) throw new Error('当前检测结果无效，请先检测当前点云')
    const meta = readJson(join(resultDir, 'run.meta.json'))
    const resultMetaIdentity = meta ? fileIdentity(join(resultDir, 'run.meta.json')) : null
    if (meta?.detectionStatus && meta.detectionStatus !== 'ready') throw new Error('当前检测尚未完成，请完成检测后再验证')
    const info = readJson(join(resultDir, 'info.json'))
    const linkedCloud = result.source_cloud || result.sourceCloud || meta?.source_cloud || meta?.cloud || info?.file
    if (typeof linkedCloud !== 'string' || !linkedCloud) throw new Error('当前检测没有记录源点云关联，请重新检测当前点云')
    if (!sameIdentity(source, fileIdentity(resolve(resultDir, linkedCloud)))) throw new Error('当前检测结果属于另一份点云，请先检测当前点云')
    if (meta?.sourceIdentity && !sameIdentity(source, meta.sourceIdentity)) throw new Error('点云已改变，当前检测结果已失效，请重新检测')
    const manifest = readJson(join(resultDir, 'cad.manifest.json'))
    const cadManifestIdentity = manifest ? fileIdentity(join(resultDir, 'cad.manifest.json')) : null
    if (manifest && manifest.status !== 'ready') throw new Error('当前 CAD 尚未生成完成，请等待生成完成后验证')
    let cad = null
    const selectedCad = pathInput(input.cad_path, '当前 CAD', true)
    if (manifest) {
      if (!sameIdentity(source, manifest.sourceIdentity) || resolve(base, manifest.resultDir || '') !== resultDir) throw new Error('CAD 清单与当前点云/检测目录不一致')
      const manifestStep = typeof manifest.step === 'string' ? resolve(resultDir, manifest.step) : null
      const manifestStl = typeof manifest.stl === 'string' ? resolve(resultDir, manifest.stl) : null
      if (!manifestStep || !manifestStl || dirname(manifestStep) !== resultDir || dirname(manifestStl) !== resultDir
        || !sameIdentity(manifest.stepIdentity, fileIdentity(manifestStep)) || !sameIdentity(manifest.stlIdentity, fileIdentity(manifestStl))) throw new Error('CAD 交付物发生变化，请重新生成')
      if (selectedCad && selectedCad !== manifestStep && selectedCad !== manifestStl) throw new Error('所选 CAD 与当前点云生成结果不匹配')
      cad = boundedIdentity(manifestStep, 256 * MiB, 'CAD')
    } else if (selectedCad) throw new Error('所选 CAD 缺少同源且完整的生成清单，请从当前点云重新生成 CAD')
    // An explicit empty path is the user's decision to clear the reference.
    const truthFile = Object.hasOwn(input, 'truth_path') ? pathInput(input.truth_path, '当前真值', true) : declaredTruthPath(resultDir, result, meta)
    const truth = truthFile ? boundedIdentity(truthFile, 8 * MiB, '真值') : null
    let truthAssociation = null
    if (truth) {
      const value = readJson(truth.path, 8 * MiB)
      if (!Array.isArray(value.shapes)) throw new Error('当前真值缺少 shapes 数组，无法做真实精度验证')
      const linked = value.source_cloud || value.cloud || value.sourceCloud
      let sameSource = sameIdentity(value.sourceIdentity, source)
      if (value.sourceIdentity && !sameSource) throw new Error('所选真值记录的源点云身份不匹配')
      if (!sameSource && typeof linked === 'string') {
        try { sameSource = sameIdentity(source, fileIdentity(resolve(dirname(truth.path), linked))) } catch { /* invalid source association */ }
        if (!sameSource) throw new Error('所选真值记录的源点云不匹配')
      }
      const count = value.points ?? value.input_point_count
      if (Number.isFinite(count) && count !== result.input_point_count) throw new Error('所选真值点数与当前点云检测不匹配')
      if (!sameSource && count !== result.input_point_count) throw new Error('所选真值缺少当前点云来源关联或匹配点数，不能用于当前模型')
      truthAssociation = sameSource ? 'source-identity' : input.truth_path ? 'explicit-selection' : 'declared-result'
    }
    const parameterToleranceM = input.parameter_tolerance_m ?? 0.005
    const angleToleranceDeg = input.angle_tolerance_deg ?? 2
    if (!Number.isFinite(parameterToleranceM) || parameterToleranceM <= 0 || parameterToleranceM > 1 || !Number.isFinite(angleToleranceDeg) || angleToleranceDeg <= 0 || angleToleranceDeg > 90) throw new Error('距离阈值必须大于 0 且不超过 1 米，角度阈值必须大于 0 且不超过 90°')
    const sessionId = String(input.session_id || '')
    const sceneId = input.scene_id == null ? null : String(input.scene_id)
    const requestId = String(input.request_id || '')
    if (!sessionId || sessionId.length > 160 || /[\r\n\0]/.test(sessionId) || (sceneId && sceneId.length > 256) || requestId.length > 128) throw new Error('验证会话或请求标识无效')
    const cadPreviewScale = cad ? Number(manifest.previewScale ?? (manifest.stepCoordinateUnit === 'm' ? 1 : 0.001)) : null
    if (cad && (!Number.isFinite(cadPreviewScale) || cadPreviewScale <= 0)) throw new Error('CAD 单位元数据无效，请重新生成')
    return { source, resultIdentity, resultDir, resultMetaIdentity, cadManifestIdentity, cad, truth, truthAssociation, cadPreviewScale, cadUnits: cad ? (manifest.stepCoordinateUnit || 'mm') : null, sessionId, sceneId, requestId, thresholds: { parameterToleranceM, angleToleranceDeg } }
  }
  return {
    begin(input = {}) {
      if (disposed) return { ok: false, error: '验证请求组件已卸载' }
      try {
        const current = context(input)
        const fingerprint = JSON.stringify([current.source, current.resultIdentity, current.resultMetaIdentity, current.cadManifestIdentity, current.cad, current.truth, current.truthAssociation, current.cadPreviewScale, current.cadUnits, current.sessionId, current.sceneId, current.thresholds])
        const all = entries(true)
        const previous = current.requestId && all.find((entry) => entry.request.sessionId === current.sessionId && entry.request.requestId === current.requestId)
        if (previous) return previous.request.fingerprint === fingerprint ? snapshot(previous) : { ok: false, error: '同一请求标识对应了不同文件或阈值，请重新发起验证' }
        const active = all.map((entry) => ({ entry, status: snapshot(entry) })).filter(({ status }) => status.pending)
        const same = active.find(({ entry }) => entry.request.fingerprint === fingerprint)
        if (same) return same.status
        if (active.length >= 16 || active.filter(({ entry }) => entry.request.sessionId === current.sessionId).length >= 4) return { ok: false, error: '待执行验证请求较多，请先在 AGH 中完成已有请求' }
        mkdirSync(outputs, { recursive: true })
        const id = randomUUID()
        const createdAt = new Date().toISOString()
        const dir = join(outputs, `verify-${createdAt.replace(/[:.]/g, '-').slice(0, 19)}-${id.slice(0, 8)}`)
        mkdirSync(dir)
        const request = {
          schemaVersion: 1, id, jobId: id, requestId: current.requestId, sessionId: current.sessionId, createdAt,
          sourceCloud: portable(base, current.source.path), sourceIdentity: current.source,
          resultDir: portable(base, current.resultDir), resultPath: portable(base, current.resultIdentity.path), resultIdentity: current.resultIdentity,
          resultMetaPath: current.resultMetaIdentity ? portable(base, current.resultMetaIdentity.path) : null, resultMetaIdentity: current.resultMetaIdentity,
          cadManifestPath: current.cadManifestIdentity ? portable(base, current.cadManifestIdentity.path) : null, cadManifestIdentity: current.cadManifestIdentity,
          cadPath: current.cad ? portable(base, current.cad.path) : null, cadIdentity: current.cad,
          truthPath: current.truth ? portable(base, current.truth.path) : null, truthIdentity: current.truth,
          truthAssociation: current.truthAssociation, cadPreviewScale: current.cadPreviewScale, cadUnits: current.cadUnits, previewUnits: 'm',
          sceneId: current.sceneId, thresholds: current.thresholds, fingerprint,
        }
        publishJson(join(dir, 'request.json'), request)
        publishJson(join(dir, 'status.json'), { id, jobId: id, status: 'queued', stage: '等待 AGH 执行', done: false, updatedAt: createdAt })
        const entry = { id, dir, request, requestIdentity: fileIdentity(join(dir, 'request.json')) }
        memo.set(dir, entry)
        return snapshot(entry)
      } catch (error) { return { ok: false, error: errorText(error) } }
    },
    status(input = {}) {
      if (disposed) return { ok: false, error: '验证请求组件已卸载' }
      try {
        if (!input.job && (!input.source_cloud || !input.result_dir)) return { ok: true, state: 'none', pending: false, done: false, result: null, reason: '请选择当前点云与检测结果后查看验证' }
        const all = entries()
        const entry = input.job ? all.find((item) => item.id === input.job) : all.find((item) => matchesContext(item.request, input))
        if (!entry) return { ok: true, state: 'none', pending: false, done: false, result: null, reason: '当前模型尚未交给 AGH 验证' }
        if (!matchesContext(entry.request, input)) return { ok: false, state: 'stale', pending: false, done: true, job: entry.id, error: '验证请求与当前点云、会话、参考或阈值不匹配，已停止显示' }
        return snapshot(entry)
      } catch (error) { return { ok: false, state: 'error', pending: false, done: true, error: errorText(error) } }
    },
    dispose() { disposed = true; memo.clear() },
  }
}
