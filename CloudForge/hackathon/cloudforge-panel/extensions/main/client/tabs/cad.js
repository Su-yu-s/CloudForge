// 云铸面板 · CAD 页签
// 当前点云建模、关联交付物自动预览、网格与实测点云对比。

import { el, icon, num, fmtSize } from '../ui.js'
import { createMeshViewer } from '../viewer.js'
import { pickNativeFile } from '../pick.js'

const keyPath = (path) => String(path || '').replace(/\\/g, '/').replace(/\/$/, '').toLowerCase()
const samePath = (a, b) => !!a && !!b && keyPath(a) === keyPath(b)
const fileName = (path) => String(path || '').split(/[\\/]/).pop()

export function createCadTab({ ctx, data, state }) {
  const root = el('section', { class: 'cf-pane', dataset: { pane: 'cad' } })
  let viewer = null
  let meshSpan = 1
  let currentPath = null
  let loadedPath = null
  let framedPath = null
  let workflowKey = keyPath(state.workflow?.dir)
  let sourceKey = keyPath(currentSource())
  let selectionKind = 'auto'
  let meshSource = null
  let meshResultDir = null
  let autoSignature = null
  let visible = false
  let destroyed = false
  let meshController = null
  let overlayController = null
  let pollController = null
  let polling = null

  const buildBox = el('div', { class: 'cf-cad-build' })
  const sourceLabel = el('div', { class: 'cf-cad-source' })
  const generateBtn = el('button', { class: 'cf-primary-btn', text: '从当前点云生成 CAD' })
  const buildNote = el('div', { class: 'cf-cad-scope' })
  const jobNote = el('div', { class: 'cf-cad-job', role: 'status', 'aria-live': 'polite' })
  const retryBtn = el('button', { class: 'cf-btn-sm hidden', text: '重试查询进度' })
  const showResultBtn = el('button', { class: 'cf-btn-sm hidden', text: '查看生成结果' })
  buildBox.append(sourceLabel, generateBtn, buildNote, jobNote, retryBtn, showResultBtn)
  root.appendChild(buildBox)
  generateBtn.addEventListener('click', () => void generate())
  retryBtn.addEventListener('click', () => {
    if (state.cadJob) state.cadJob.pollError = null
    renderBuild()
    void resumeJob()
  })

  showResultBtn.addEventListener('click', () => {
    const job = state.cadJob
    if (!job?.completedResult || destroyed) return
    job.forceOpen = true
    job.done = false
    job.pollError = null
    renderBuild()
    void resumeJob()
  })

  const viewport = el('div', { class: 'cf-viewer' })
  const tag = el('span', { class: 'cf-viewer-tag hidden' }, '尚未载入 CAD')
  const blankTitle = el('div', { class: 'cf-blank-title', text: '尚未载入 CAD' })
  const blankHint = el('div', { class: 'cf-blank-hint', text: '从当前点云生成 CAD，或选择已有 CAD 文件，即可在这里查看重建模型' })
  const blank = el('div', { class: 'cf-blank' }, [el('div', { class: 'cf-blank-mark' }, [icon('cube', 20)]), blankTitle, blankHint])
  viewport.append(blank, tag)
  root.appendChild(viewport)

  const toolbar = el('div', { class: 'cf-viewer-bar' })
  let wireOn = false
  const wireBtn = el('button', { class: 'cf-btn-xs' }, '线框')
  wireBtn.addEventListener('click', () => {
    wireOn = !wireOn
    viewer?.setWireframe(wireOn)
    wireBtn.classList.toggle('on', wireOn)
  })
  toolbar.appendChild(wireBtn)
  let overlayOn = false
  const overlayBtn = el('button', { class: 'cf-btn-xs', title: '叠加该 CAD 对应的原始点云' }, '叠加点云')
  overlayBtn.addEventListener('click', () => {
    if (overlayBtn.disabled) return
    overlayOn = !overlayOn
    overlayBtn.classList.toggle('on', overlayOn)
    if (overlayOn) void applyCloudOverlay()
    else {
      overlayController?.abort()
      viewer?.setCloudOverlay(null)
    }
  })
  toolbar.appendChild(overlayBtn)
  for (const [name, title] of [['fit', '恢复默认视图'], ['iso', '等轴视角']]) {
    const button = el('button', { class: name === 'fit' ? 'cf-btn-xs' : 'cf-icon-btn sm', title, 'aria-label': title }, [icon(name, 13)])
    if (name === 'fit') button.appendChild(el('span', { text: title }))
    button.addEventListener('click', () => {
      if (name === 'fit') viewer?.fit()
      else if (state.meshCache?.bbox) {
        const { min, max } = state.meshCache.bbox
        viewer?.stage.faceNormal([-0.55, -0.8, 0.45], min.map((value, i) => (value + max[i]) / 2), meshSpan)
      }
    })
    toolbar.appendChild(button)
  }
  root.appendChild(toolbar)

  const scroll = el('div', { class: 'cf-scroll' })
  const infoBox = el('div', { class: 'cf-list' })
  const artBox = el('div', { class: 'cf-list' })
  scroll.append(el('div', { class: 'cf-group-title', text: '模型信息' }), infoBox,
    el('div', { class: 'cf-group-title', text: '交付物' }), artBox)
  root.appendChild(scroll)

  function currentSource() {
    return state.cloudOverride || state.cloudPath || state.sceneCache?.sourceCloud || state.sceneCache?.source_cloud || state.workflow?.sourceCloud || null
  }

  function renderBuild() {
    const source = currentSource()
    const job = state.cadJob
    const busy = !!job && !job.done
    sourceLabel.textContent = source ? `当前点云：${fileName(source)}` : '请先在点云页选择要重建的点云'
    sourceLabel.title = source || ''
    generateBtn.disabled = !source || busy
    generateBtn.textContent = busy ? '正在生成 CAD…' : '从当前点云生成 CAD'
    buildNote.textContent = state.sceneId === 'asbuilt'
      ? '重建范围：墙体、地板、顶棚等建筑骨架；生成后自动预览，可叠加原始点云对比。'
      : '重建范围：已检测到的平面、圆柱等几何基元；生成后自动预览，可叠加原始点云对比。'
    jobNote.textContent = job?.pollError || job?.stage || ''
    jobNote.classList.toggle('hidden', !jobNote.textContent)
    retryBtn.classList.toggle('hidden', !job?.id || !job.pollError || job.done)
    showResultBtn.classList.toggle('hidden', !job?.savedOutsideContext || !job.done || !job.completedResult?.done || job.completedResult.ok === false)
    syncOverlayButton()
  }

  function ensureViewer() {
    if (!viewer) {
      viewer = createMeshViewer(viewport)
      viewer.visible = visible
    }
    return viewer
  }

  function clearMesh() {
    meshController?.abort()
    overlayController?.abort()
    viewer?.setMesh(null, 0, null)
    viewer?.setCloudOverlay(null)
    currentPath = loadedPath = framedPath = null
    meshSource = meshResultDir = null
    state.meshCache = null
    overlayOn = false
    overlayBtn.classList.remove('on')
    renderInfo(null)
  }

  function syncWorkflow() {
    const nextKey = keyPath(state.workflow?.dir)
    const nextSource = keyPath(currentSource())
    if (nextKey === workflowKey && nextSource === sourceKey) return
    workflowKey = nextKey
    sourceKey = nextSource
    selectionKind = 'auto'
    autoSignature = null
    clearMesh()
  }

  function linkedArtifacts() {
    const dir = state.workflow?.dir
    if (!dir) return []
    const source = currentSource()
    const artifacts = (state.report?.artifacts || [])
      .filter((artifact) => (artifact.kind === 'step' || artifact.kind === 'stl')
        && samePath(artifact.resultDir || artifact.dir, dir)
        && (!source || samePath(artifact.sourceCloud, source)))
    const family = (artifact) => keyPath(artifact.stepPath || artifact.path)
    const latest = new Map()
    for (const artifact of artifacts) latest.set(family(artifact), Math.max(latest.get(family(artifact)) || 0, artifact.updatedMs || 0))
    return artifacts.sort((a, b) => latest.get(family(b)) - latest.get(family(a))
      || Number(a.kind !== 'step') - Number(b.kind !== 'step') || (b.updatedMs || 0) - (a.updatedMs || 0))
  }

  function syncOverlayButton() {
    // 只有模型记录的源点云与当前点云一致才允许叠加，手动挑选的未关联模型不能猜来源。
    const allowed = !!loadedPath && samePath(meshSource, currentSource())
    overlayBtn.disabled = !allowed
    overlayBtn.title = allowed ? '叠加该 CAD 对应的原始点云' : '载入与当前点云关联的 CAD 后可叠加对比'
    if (!allowed && overlayOn) {
      overlayOn = false
      overlayController?.abort()
      viewer?.setCloudOverlay(null)
      overlayBtn.classList.remove('on')
    }
  }

  async function applyCloudOverlay() {
    overlayController?.abort()
    if (!visible || !overlayOn || !samePath(meshSource, currentSource())) return
    const controller = new AbortController()
    overlayController = controller
    const source = meshSource
    const path = loadedPath
    try {
      const loaded = await data.loadCloud(source, { signal: controller.signal })
      controller.signal.throwIfAborted()
      if (destroyed || !visible || !overlayOn || !samePath(path, loadedPath) || !samePath(source, currentSource())) return
      ensureViewer().setCloudOverlay(loaded.positions)
    } catch (error) {
      if (controller.signal.aborted || destroyed || !visible || !samePath(source, currentSource()) || !samePath(path, loadedPath)) return
      state.message = `点云叠加失败：${String(error.message || error)}`
      state.notify?.()
    }
  }

  function meshBbox(positions) {
    if (!positions?.length) return null
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i + 2 < positions.length; i += 3) {
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], positions[i + axis])
        max[axis] = Math.max(max[axis], positions[i + axis])
      }
    }
    return min.map((value, axis) => max[axis] - value)
  }

  function renderInfo(mesh) {
    infoBox.replaceChildren()
    blank.classList.toggle('hidden', !!mesh)
    tag.classList.toggle('hidden', !mesh && !meshController)
    if (!mesh) {
      infoBox.appendChild(el('div', { class: 'cf-empty' }, '生成或载入 CAD 后，显示模型尺寸与实体信息'))
      blankTitle.textContent = '尚未载入 CAD'
      blankHint.textContent = '从当前点云生成 CAD，或选择已有 CAD 文件，即可在这里查看重建模型'
      return
    }
    const box = mesh.clientBbox
    const rows = [
      ['文件', fileName(mesh.originFile || currentPath)],
      ['源点云', meshSource ? fileName(meshSource) : '未记录'],
      ['三角面', num(mesh.triCount)],
      ['包围盒', box ? `${box.map((value) => value.toFixed(3)).join(' × ')} m` : '—'],
      ['实体数', mesh.solid?.solids != null ? String(mesh.solid.solids) : '—'],
      ['体积', mesh.solid?.volume_m3 != null ? `${mesh.solid.volume_m3} m³` : '—'],
    ]
    for (const [name, value] of rows) infoBox.appendChild(el('div', { class: 'cf-kv' }, [el('span', { text: name }), el('span', { class: 'mono', text: value })]))
    const scope = mesh.route || mesh.converted?.route
    if (scope) infoBox.appendChild(el('div', { class: 'cf-note' }, scope === 'building'
      ? '建筑骨架模型：主要包含墙体、地板和顶棚。' : '几何基元模型：主要包含检测到的平面与规则曲面。'))
    const coverage = mesh.converted?.coverage_error ?? mesh.solid?.coverage_error
    if (coverage != null) infoBox.appendChild(el('div', { class: 'cf-kv' }, [el('span', { text: '模型覆盖误差' }),
      el('span', { class: `mono ${coverage < 0.02 ? 'ok-text' : 'err-text'}`, text: `${(coverage * 100).toFixed(2)}%` })]))
  }

  function renderArtifacts() {
    artBox.replaceChildren()
    const artifacts = linkedArtifacts()
    if (!artifacts.length) {
      artBox.appendChild(el('div', { class: 'cf-empty' }, '当前点云还没有关联的 CAD 交付物，可在上方生成'))
      return
    }
    for (const artifact of artifacts) {
      const card = el('div', { class: `cf-card${samePath(currentPath, artifact.path) ? ' active' : ''}` })
      card.append(el('div', { class: 'cf-card-title' }, [artifact.name]),
        el('div', { class: 'cf-card-meta' }, [`${artifact.kind.toUpperCase()} · ${fmtSize(artifact.size)}`]))
      const buttons = el('div', { class: 'cf-btn-row' })
      const preview = el('button', { class: 'cf-btn-sm primary', text: '预览' })
      preview.addEventListener('click', () => { selectionKind = 'manual'; void load(artifact.path, artifact) })
      const open = el('button', { class: 'cf-btn-sm', text: 'FreeCAD 打开' })
      open.addEventListener('click', () => void launch('freecad', artifact))
      const gui = el('button', { class: 'cf-btn-sm', text: 'GUI 预览', title: '在 CloudForge 桌面窗口查看 CAD 表面网格，可切换实体和线框' })
      gui.addEventListener('click', () => void launch('cloudforge', artifact))
      buttons.append(preview, open, gui)
      card.appendChild(buttons)
      artBox.appendChild(card)
    }
  }

  async function launch(target, artifact) {
    state.message = `正在打开 ${target === 'freecad' ? 'FreeCAD' : 'CloudForge GUI'}…`
    state.notify?.()
    try {
      const result = await data.runEffect('cloudforge.preview', { target, file: artifact.path })
      if (destroyed) return
      state.message = result?.alive
        ? (result.previewMode === 'cad-mesh' ? '已在 CloudForge GUI 打开 CAD 表面网格' : '已打开')
        : `启动失败：${result?.error || '未知错误'}，可手动打开文件`
    } catch (error) {
      if (destroyed) return
      state.message = `启动失败：${String(error.message || error).slice(0, 160)}`
    }
    state.notify?.()
  }

  async function load(path, association = {}, { force = false } = {}) {
    if (destroyed || !path) return
    if (!force && samePath(path, loadedPath)) return
    meshController?.abort()
    const controller = new AbortController()
    meshController = controller
    const { signal } = controller
    const expectedWorkflow = keyPath(state.workflow?.dir)
    const expectedSource = keyPath(currentSource())
    const isCurrent = () => !destroyed && visible && expectedWorkflow === keyPath(state.workflow?.dir)
      && expectedSource === keyPath(currentSource()) && samePath(currentPath, path)
    const shouldFit = !samePath(framedPath, path)
    if (!samePath(currentPath, path)) {
      viewer?.setMesh(null, 0, null)
      viewer?.setCloudOverlay(null)
      state.meshCache = null
      loadedPath = null
      renderInfo(null)
    }
    currentPath = path
    meshSource = association.sourceCloud || null
    meshResultDir = association.resultDir || association.dir || null
    renderArtifacts()
    const value = ensureViewer()
    value.visible = visible
    value.stage.resize()
    tag.classList.remove('hidden')
    tag.textContent = '正在载入 CAD…'
    blankTitle.textContent = '正在载入 CAD'
    state.message = '正在读取模型…'
    state.notify?.()
    try {
      const mesh = await data.loadMesh(path, { signal, onProgress: (progress) => {
        if (!signal.aborted && isCurrent()) tag.textContent = progress.stage || `载入三角面 ${num(progress.loaded)} / ${num(progress.total)}`
      } })
      signal.throwIfAborted()
      if (!isCurrent()) return
      mesh.clientBbox = meshBbox(mesh.positions)
      mesh.updatedMs = association.updatedMs || mesh.updatedMs
      meshSource = mesh.sourceCloud || mesh.converted?.sourceCloud || association.sourceCloud || null
      meshResultDir = mesh.resultDir || association.resultDir || association.dir || null
      value.setMesh(mesh.positions, mesh.triCount, mesh.bbox)
      value.setWireframe(wireOn)
      if (shouldFit) { value.fit(); framedPath = path }
      meshSpan = Math.max(...mesh.bbox.min.map((value, axis) => mesh.bbox.max[axis] - value), 1e-3)
      tag.textContent = `${fileName(path)} · ${num(mesh.triCount)} 三角面`
      loadedPath = path
      state.meshCache = mesh
      state.message = ''
      renderInfo(mesh)
      syncOverlayButton()
      if (overlayOn) void applyCloudOverlay()
    } catch (error) {
      if (signal.aborted || !isCurrent()) return
      state.message = `CAD 预览失败：${String(error.message || error)}`
      if (!loadedPath) {
        renderInfo(null)
        tag.classList.remove('hidden')
        tag.textContent = '预览暂不可用'
        blankTitle.textContent = 'CAD 预览暂不可用'
        blankHint.textContent = '交付文件仍可使用，请重试预览或在 FreeCAD 中打开'
      }
    } finally {
      if (meshController === controller) meshController = null
      if (isCurrent() && !signal.aborted) state.notify?.()
    }
  }

  function autoPreview() {
    if (!visible || destroyed) return
    syncWorkflow()
    if (selectionKind === 'manual') {
      if (currentPath && !samePath(currentPath, loadedPath) && !meshController) void load(currentPath, { sourceCloud: meshSource, resultDir: meshResultDir })
      return
    }
    const artifact = linkedArtifacts()[0]
    if (!artifact) return
    const signature = `${keyPath(artifact.path)}:${artifact.updatedMs || 0}`
    if (autoSignature === signature && (loadedPath || meshController)) return
    if (autoSignature === signature && !loadedPath) return
    autoSignature = signature
    void load(artifact.path, artifact, { force: !samePath(artifact.path, loadedPath) || artifact.updatedMs !== state.meshCache?.updatedMs })
  }

  async function generate() {
    if (destroyed || !currentSource() || state.cadJob && !state.cadJob.done) return
    const source = currentSource()
    const existingSource = state.sceneCache?.sourceCloud || state.sceneCache?.source_cloud || state.workflow?.sourceCloud
    const sameSource = samePath(source, existingSource)
    const job = {
      id: null, sourceCloud: source, done: false, stage: '正在准备生成…',
      workflowDir: state.workflow?.dir || null, sceneId: state.sceneId, requestId: crypto.randomUUID(), pollError: null,
    }
    state.cadJob = job
    renderBuild()
    state.notify?.()
    try {
      const result = await data.runEffect('cloudforge.cad', {
        cloud: source, ...(sameSource && state.workflow?.dir ? { result_dir: state.workflow.dir } : {}),
        preset: state.sceneId === 'asbuilt' ? 'outdoor' : 'mechanical', request_id: job.requestId,
      })
      if (destroyed || state.cadJob !== job) return
      if (!result || result.ok === false || !result.job) throw new Error(result?.error || '未能开始生成 CAD')
      job.id = result.job
      job.resultDir = result.resultDir
      job.stage = result.stage || '正在生成 CAD…'
      if (visible) { renderBuild(); void resumeJob() }
    } catch (error) {
      if (destroyed || state.cadJob !== job) return
      job.done = true
      job.stage = `生成未开始：${String(error.message || error)}`
      if (visible) renderBuild()
    }
    state.notify?.()
  }

  function delay(ms, signal) {
    return new Promise((resolve, reject) => {
      const onAbort = () => { clearTimeout(timer); reject(signal.reason || new DOMException('Aborted', 'AbortError')) }
      const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve() }, ms)
      signal.addEventListener('abort', onAbort, { once: true })
      if (signal.aborted) onAbort()
    })
  }

  async function adoptGenerated(job, result, signal) {
    const report = await data.report()
    signal.throwIfAborted()
    if (report?.ok === false) throw new Error(report.error || '生成结果暂未读到，可重试查询')
    const workflow = report.workflows?.find((item) => samePath(item.dir, result.resultDir))
    if (!workflow) throw new Error('CAD 已生成，工作流列表尚未更新，请重试查询')
    const scene = await data.scene(workflow.dir)
    signal.throwIfAborted()
    if (scene?.ok === false) throw new Error(scene.error || '生成结果暂不可读取')
    if (destroyed || !visible || state.cadJob !== job) return
    const contextUnchanged = keyPath(job.workflowDir) === keyPath(state.workflow?.dir)
      && samePath(job.sourceCloud, currentSource()) && job.sceneId === state.sceneId
    if (!contextUnchanged && !job.forceOpen) {
      state.report = report
      job.done = true
      job.savedOutsideContext = true
      job.stage = 'CAD 已生成；当前选择已改变，可点击查看生成结果'
      renderBuild()
      renderArtifacts()
      state.notify?.()
      return
    }
    job.savedOutsideContext = false
    job.forceOpen = false
    state.adoptWorkflow?.({ report, workflow, scene, sourceCloud: result.sourceCloud || job.sourceCloud })
    // 后端保存了 STEP 与同源预览，优先显示可交付的 CAD 文件。
    syncWorkflow()
    selectionKind = 'auto'
    const artifact = report.artifacts?.find((item) => samePath(item.path, result.step || result.stl)) || {
      path: result.step || result.stl, sourceCloud: result.sourceCloud || job.sourceCloud, resultDir: result.resultDir,
    }
    autoSignature = artifact.path ? `${keyPath(artifact.path)}:${artifact.updatedMs || 0}` : null
    job.done = true
    job.stage = 'CAD 已生成，正在打开预览…'
    renderBuild()
    renderArtifacts()
    if (!artifact.path) throw new Error('生成结果未返回 CAD 文件')
    await load(artifact.path, artifact)
    if (destroyed || signal.aborted || state.cadJob !== job) return
    job.stage = samePath(loadedPath, artifact.path) && state.meshCache
      ? 'CAD 已生成，可查看模型并叠加点云对比'
      : 'CAD 已生成，预览暂未加载，可重新载入或打开交付文件'
    renderBuild()
    state.notify?.()
  }

  function resumeJob() {
    const job = state.cadJob
    if (destroyed || !visible || !job?.id || job.done || job.pollError || polling) return polling || Promise.resolve()
    const controller = new AbortController()
    pollController = controller
    const { signal } = controller
    polling = (async () => {
      let failures = 0
      while (!signal.aborted && !destroyed && visible && state.cadJob === job) {
        try {
          const result = job.completedResult || await data.cadStatus(job.id)
          signal.throwIfAborted()
          if (result?.done) {
            job.completedResult = result
            if (result.ok === false) {
              job.done = true
              job.stage = `生成失败：${result.error || '未知错误'}`
              renderBuild()
              state.notify?.()
              return
            }
            await adoptGenerated(job, result, signal)
            return
          }
          if (result?.ok === false) throw new Error(result.error || '暂未取得生成进度')
          job.stage = result?.stage || '正在生成 CAD…'
          failures = 0
          renderBuild()
          await delay(1500, signal)
        } catch (error) {
          if (signal.aborted || destroyed) return
          failures++
          if (failures >= 3 || job.completedResult) throw error
          await delay(1200, signal)
        }
      }
    })().catch((error) => {
      if (signal.aborted || destroyed || state.cadJob !== job) return
      job.pollError = `进度暂未更新：${String(error.message || error)}`
      renderBuild()
      state.notify?.()
    }).finally(() => {
      if (pollController === controller) pollController = null
      polling = null
      if (!destroyed && visible && state.cadJob?.id && !state.cadJob.done && !state.cadJob.pollError && signal.aborted) void resumeJob()
    })
    return polling
  }

  const pickNote = el('span', { class: 'cf-pick-note' })
  const pickBtn = el('button', { class: 'cf-btn-sm', text: '选择 CAD', title: '选择已有 CAD 文件载入' })
  pickBtn.addEventListener('click', () => void pickNativeFile({
    data, exts: ['step', 'stp', 'stl'], btn: pickBtn, statusEl: pickNote,
    onPicked: (result) => {
      if (destroyed) return
      selectionKind = 'manual'
      void load(result.path)
    },
  }))
  const reloadBtn = el('button', { class: 'cf-btn-sm', text: '重新载入' })
  reloadBtn.addEventListener('click', () => {
    if (currentPath) void load(currentPath, { sourceCloud: meshSource, resultDir: meshResultDir }, { force: true })
    else { autoSignature = null; autoPreview() }
  })

  renderInfo(null)
  renderBuild()
  return {
    el: root,
    activate() {
      visible = true
      syncWorkflow()
      ensureViewer().visible = true
      viewer.stage.resize()
      renderArtifacts()
      renderBuild()
      autoPreview()
      if (overlayOn) void applyCloudOverlay()
      void resumeJob()
    },
    deactivate() {
      visible = false
      meshController?.abort()
      meshController = null
      overlayController?.abort()
      pollController?.abort()
      if (viewer) viewer.visible = false
      // 在重新展开时重新读取取消的网格；已完成的网格保持原来的视角。
      if (!loadedPath) autoSignature = null
    },
    render() { syncWorkflow(); renderBuild() },
    async refresh() {
      syncWorkflow()
      renderArtifacts()
      renderBuild()
      if (state.meshCache) renderInfo(state.meshCache)
      autoPreview()
    },
    cancelRefresh() { meshController?.abort(); overlayController?.abort() },
    renderFooter(foot, { state: currentState }) {
      const row = el('div', { class: 'cf-foot-row' })
      row.append(el('span', { class: 'mono', text: currentState.meshCache ? `${num(currentState.meshCache.triCount)} 三角面` : '未载入模型' }),
        el('span', { class: 'spacer' }), pickNote, pickBtn, reloadBtn)
      reloadBtn.disabled = !!meshController
      foot.appendChild(row)
      if (currentState.message) foot.appendChild(el('div', { class: 'cf-msg', text: currentState.message }))
    },
    destroy() {
      destroyed = true
      visible = false
      meshController?.abort()
      overlayController?.abort()
      pollController?.abort()
      viewer?.dispose()
      viewer = null
    },
  }
}
