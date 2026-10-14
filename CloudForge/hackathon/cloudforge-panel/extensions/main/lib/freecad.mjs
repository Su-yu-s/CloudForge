// STEP previews reuse a paired generated STL or tessellate through CadQuery / FreeCAD.
// Every cache belongs to one STEP identity and deflection; no shared preview.stl.
import { execFile } from 'node:child_process'
import { existsSync, statSync, writeFileSync, readFileSync } from 'node:fs'
import { basename, join, resolve } from 'node:path'
import { extractJson } from './jsonout.mjs'
import { fileIdentity, sameIdentity, findCadPython } from './cad-generation.mjs'

const conversions = new Map()
const children = new Set()
let disposed = false
let freecadCache = null

function stopChild(child) {
  if (!child?.pid) return
  if (process.platform === 'win32') execFile(join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true }, () => {})
  try { child.kill() } catch { /* already gone */ }
}
function runProcess(exe, args, timeoutMs = 12000) {
  return new Promise((done) => {
    if (disposed) return done({ err: new Error('CAD 预览已中止'), stdout: '', stderr: '', code: -1 })
    const child = execFile(exe, args, { timeout: timeoutMs, windowsHide: true, env: { ...process.env, PYTHONUTF8: '1', PYTHONIOENCODING: 'utf-8' }, maxBuffer: 8 * 1024 * 1024 }, (err, stdout, stderr) => {
      children.delete(child)
      done({ err, stdout: String(stdout || ''), stderr: String(stderr || ''), code: err ? err.code ?? -1 : 0 })
    })
    children.add(child)
    const killTimer = setTimeout(() => stopChild(child), timeoutMs)
    child.once('close', () => clearTimeout(killTimer))
  })
}

async function firstWorkingPython(root) {
  const localPython = process.platform === 'win32' ? join(root, '.venv-cad', 'Scripts', 'python.exe') : join(root, '.venv-cad', 'bin', 'python')
  const configured = process.env.CLOUDFORGE_PYTHON
  const override = configured && /[\\/]/.test(configured) ? resolve(root, configured) : configured
  for (const exe of [override, localPython, 'python', 'py', 'python3'].filter(Boolean)) {
    const args = /(?:^|[\\/])py(?:\.exe)?$/i.test(exe) ? ['-3', '--version'] : ['--version']
    const r = await runProcess(exe, args, 10000)
    if (!r.err) return exe
  }
  return null
}

/** FreeCAD remains available for independent verification and external opening. */
export async function locateFreecad(root) {
  if (freecadCache && Date.now() - freecadCache.at < 60000) return freecadCache.data
  const python = await firstWorkingPython(root)
  if (!python) return { ok: false, error: 'python 不可用' }
  const script = join(root, 'hackathon', 'tools', 'find-freecad.py')
  if (!existsSync(script)) return { ok: false, error: 'find-freecad.py 缺失' }
  const args = /(?:^|[\\/])py(?:\.exe)?$/i.test(python) ? ['-3', script] : [script]
  const r = await runProcess(python, args, 15000)
  const data = extractJson(r.stdout) ?? { ok: false, error: 'FreeCAD 探测无输出' }
  freecadCache = { at: Date.now(), data }
  return data
}

function cachedPreview(stl, identity, deflection, previewScale) {
  if (!existsSync(stl)) return null
  const side = readStlMeta(stl)
  const stat = statSync(stl)
  if (stat.size <= 84 || !sameIdentity(side?.sourceIdentity, identity) || side?.deflection !== deflection || (side?.previewScale ?? side?.step_to_preview_scale) !== previewScale) return null
  if (side.stlIdentity && !sameIdentity(side.stlIdentity, fileIdentity(stl))) return null
  return { ...side, ok: true, stl, cached: true, stl_bytes: stat.size }
}

async function convertStep(root, stepPath, deflection, identity, previewScale) {
  // A generator-produced same-name STL is authoritative only with matching source metadata.
  const paired = stepPath.replace(/\.(step|stp)$/i, '.stl')
  for (const file of [paired, stepPath + '.preview.stl']) {
    const hit = cachedPreview(file, identity, deflection, previewScale)
    if (hit) return hit
  }
  const stlPath = stepPath + '.preview.stl'
  // Avoid replacing an unrelated user file. Our own stale cache may safely be regenerated.
  if (existsSync(stlPath) && !readStlMeta(stlPath)?.sourceIdentity) return { ok: false, error: `已有同名 STL 无来源记录，无法覆盖：${stlPath}` }
  let converted = null, cqError = ''
  const cqScript = join(root, 'hackathon', 'tools', 'cad-preview.py')
  if (existsSync(cqScript)) {
    try {
      const python = await findCadPython(runProcess, false, root)
      const r = await runProcess(python.exe, [...python.prefix, cqScript, stepPath, stlPath, String(deflection), '--scale', String(previewScale)], 25000)
      const parsed = extractJson(r.stdout)
      if (!r.err && parsed?.ok) converted = { ...parsed, engine: 'cadquery' }
      else if (parsed?.ok === false) return { ok: false, error: String(parsed.error || 'CAD 预览转换失败').slice(0, 600) }
      else cqError = (r.stderr || r.err?.message || 'CadQuery 转换没有返回有效输出').slice(0, 250)
    } catch (error) { cqError = String(error?.message || error).slice(0, 250) }
  }
  if (!converted) {
    const fc = await locateFreecad(root)
    if (!fc.ok || !fc.freecadcmd_exe) return { ok: false, error: `无法预览 STEP：${cqError || 'CadQuery 预览工具不可用'}；也未找到 FreeCAD。可先从当前点云生成配对 STEP / STL。` }
    const script = join(root, 'hackathon', 'tools', 'step-to-stl.py')
    if (!existsSync(script)) return { ok: false, error: 'step-to-stl.py 缺失' }
    const r = await runProcess(fc.freecadcmd_exe, [script, stepPath, stlPath, String(deflection), String(previewScale)], 25000)
    const parsed = extractJson(r.stdout)
    if (r.err || !parsed?.ok) return { ok: false, error: String(parsed?.error || r.stderr || r.err?.message || 'FreeCAD 转换没有返回有效输出').slice(0, 600) }
    converted = { ...parsed, engine: 'freecad' }
  }
  if (disposed) return { ok: false, error: 'CAD 预览已中止' }
  if (!existsSync(stlPath) || statSync(stlPath).size <= 84) return { ok: false, error: '转换未产出有效 STL' }
  if (!sameIdentity(identity, fileIdentity(stepPath))) return { ok: false, error: 'STEP 在转换期间发生变化，请重新预览' }
  const bbox = converted.bbox_m
  const span = Array.isArray(bbox) ? Math.max(...bbox) : 0
  if (!Number.isSafeInteger(converted.solids) || converted.solids <= 0 || !Number.isFinite(converted.volume_m3) || converted.volume_m3 <= 0 || !Array.isArray(bbox) || bbox.length !== 3 || bbox.some((value) => !Number.isFinite(value) || value <= 0) || !Number.isFinite(converted.coverage_error) || converted.coverage_error > Math.max(0.03, 2 * deflection / span)) return { ok: false, error: 'CAD 预览没有有效实体、尺寸或完整网格，请检查 STEP 文件' }
  const clean = { ...converted, previewScale, previewUnits: 'm', stepCoordinateUnit: 'mm', stl: stlPath, source: stepPath, sourceIdentity: identity, stlIdentity: fileIdentity(stlPath), deflection, cached: false }
  writeFileSync(stlPath + '.json', JSON.stringify(clean, null, 1), 'utf8')
  return clean
}

/** STEP → STL; trusted cache first, then CadQuery, finally FreeCAD. */
export function stepToStl(root, stepPath, deflection = 0.005, previewScale = 0.001) {
  if (disposed) return { ok: false, error: 'CAD 预览组件已卸载' }
  if (!Number.isFinite(deflection) || deflection <= 0 || deflection > 1) return { ok: false, error: '预览网格精度必须大于 0 且不超过 1 米' }
  if (![0.001, 1].includes(previewScale)) return { ok: false, error: '不支持的 STEP 预览单位换算' }
  let identity
  try { identity = fileIdentity(stepPath) } catch (error) { return { ok: false, error: String(error.message || error).slice(0, 300) } }
  const paired = identity.path.replace(/\.(step|stp)$/i, '.stl')
  for (const file of [paired, identity.path + '.preview.stl']) {
    const hit = cachedPreview(file, identity, deflection, previewScale)
    if (hit) return hit
  }
  const now = Date.now()
  for (const [key, entry] of conversions) {
    if (entry.finishedAt && now - entry.finishedAt > (entry.result?.ok ? 10 * 60 * 1000 : 10000)) conversions.delete(key)
  }
  const key = JSON.stringify([identity, deflection, previewScale])
  const previous = conversions.get(key)
  if (previous) {
    if (!previous.result || !previous.result.ok) return previous.result || { ok: true, pending: true, stage: '正在生成 CAD 预览网格' }
    conversions.delete(key) // completed output was removed or its sidecar changed; regenerate instead of serving stale paths
  }
  if ([...conversions.values()].filter((entry) => !entry.finishedAt).length >= 4) return { ok: false, error: 'CAD 预览转换繁忙，请稍后重试' }
  while (conversions.size >= 32) {
    const oldest = [...conversions].find(([, entry]) => entry.finishedAt)
    if (!oldest) break
    conversions.delete(oldest[0])
  }
  const entry = { startedAt: now, result: null, finishedAt: null }
  conversions.set(key, entry)
  setImmediate(() => {
    void convertStep(root, identity.path, deflection, identity, previewScale).then((result) => { entry.result = result }, (error) => { entry.result = { ok: false, error: String(error?.message || error).slice(0, 600) } }).finally(() => { entry.finishedAt = Date.now() })
  })
  return { ok: true, pending: true, stage: '正在生成 CAD 预览网格' }
}

export function disposePreviewConversions() {
  disposed = true
  for (const child of children) stopChild(child)
  children.clear()
  conversions.clear()
}

export function readStlMeta(stlPath) {
  try { return JSON.parse(readFileSync(stlPath + '.json', 'utf8')) } catch { return null }
}

export { basename, firstWorkingPython as locatePython }
