// 云铸面板 · 点云页签
// 视口 + HUD + 四视图模式 + 几何网格叠加 + 形状清单（点击高亮 / 显隐 / solo）
//
// 内点着色不额外请求 indices/shape_k.txt（38 个形状要 38 次调用），而是按几何距离就地筛：
// 判据 |n·p+d| ≤ 2.5·robust_sigma（平面）/ |到轴距 − r| ≤ 2.5σ（圆柱），与 RANSAC 自身判据同源。
// 实测校验：livingroom shape_1 距离筛得 43,276 点，真实 inlier_count 43,558（吻合 99.3%）。

import { el, icon, num, mm, pct, ms, typeCn, esc, fmtSize } from '../ui.js'
import { createCloudViewer, PALETTE } from '../viewer.js'
import { buildPrimitive } from '../geometry.js'
import { splitInliers } from '../cloud-processing.js'
import { pickNativeFile } from '../pick.js'

const keyPath = (path) => {
  const value = String(path || '').replace(/\\/g, '/').replace(/\/$/, '')
  return /^[a-z]:/i.test(value) ? value.toLowerCase() : value
}
const samePath = (a, b) => !!a && !!b && keyPath(a) === keyPath(b)
const fileName = (path) => String(path || '').split(/[\\/]/).pop()

const MODES = [
  { id: 'detect', label: '检测结果' },
  { id: 'raw', label: '原始' },
  { id: 'inliers', label: '内点' },
  { id: 'remaining', label: '剩余' },
]

export function createCloudTab({ ctx, data, state }) {
  const root = el('section', { class: 'cf-pane', dataset: { pane: 'cloud' } })
  let reloadTab = async () => {}

  const detectBox = el('div', { class: 'cf-cloud-detect' })
  const sourceLabel = el('div', { class: 'cf-cloud-source' })
  const detectBtn = el('button', { class: 'cf-primary-btn', text: '开始检测' })
  const detectNote = el('div', { class: 'cf-cloud-scope', text: '按上方场景检测几何基元并统计覆盖率，完成后在本页显示结果。' })
  const jobNote = el('div', { class: 'cf-cloud-job hidden', role: 'status', 'aria-live': 'polite' })
  const retryBtn = el('button', { class: 'cf-btn-sm hidden', text: '重试查询进度' })
  const showResultBtn = el('button', { class: 'cf-btn-sm hidden', text: '查看检测结果' })
  detectBox.append(sourceLabel, detectBtn, detectNote, jobNote, retryBtn, showResultBtn)
  root.appendChild(detectBox)
  detectBtn.addEventListener('click', () => void startDetection())
  retryBtn.addEventListener('click', () => {
    const job = state.detectJob
    if (!job) return
    if (job.startError) { void startDetection({ retry: true }); return }
    job.pollError = null
    renderDetection()
    void resumeDetection()
  })
  showResultBtn.addEventListener('click', () => {
    const job = state.detectJob
    if (!job?.completedResult || destroyed) return
    job.forceOpen = true
    job.done = false
    job.pollError = null
    renderDetection()
    void resumeDetection()
  })

  const viewport = el('div', { class: 'cf-viewer' })
  const tag = el('span', { class: 'cf-viewer-tag' }, '尚未载入点云')
  const legend = el('div', { class: 'cf-legend' })
  viewport.appendChild(tag)
  viewport.appendChild(legend)
  root.appendChild(viewport)

  const toolbar = el('div', { class: 'cf-viewer-bar' })
  const modeBar = el('div', { class: 'cf-seg' })
  const modeButtons = new Map()
  for (const m of MODES) {
    const b = el('button', { class: 'cf-seg-btn', dataset: { mode: m.id }, text: m.label })
    b.addEventListener('click', () => {
      requestedMode = m.id
      viewer?.setMode(m.id)
      syncModes()
    })
    modeBar.appendChild(b)
    modeButtons.set(m.id, b)
  }
  toolbar.appendChild(modeBar)

  const overlayBtn = el('button', { class: 'cf-btn-xs', title: '把 coefficients 变成半透明实体网格' }, '几何叠加')
  // 与 viewer.js 的 overlayOn 保持一致：默认关闭。43 个面片叠加会把点云本体
  // 完全糊住，叠加是「按需」信息层而不是默认主体。
  let overlayOn = false
  overlayBtn.addEventListener('click', () => {
    overlayOn = !overlayOn
    viewer?.setOverlayVisible(overlayOn)
    overlayBtn.classList.toggle('on', overlayOn)
  })
  toolbar.appendChild(overlayBtn)

  for (const [name, title] of [
    ['fit', '恢复默认视图'],
    ['iso', '等轴视角'],
    ['top', '顶视图'],
    ['front', '前视图'],
  ]) {
    const b = el('button', { class: name === 'fit' ? 'cf-btn-xs' : 'cf-icon-btn sm', title, 'aria-label': title }, [icon(name, 13)])
    if (name === 'fit') b.appendChild(el('span', { text: title }))
    b.addEventListener('click', () => {
      if (!viewer) return
      if (name === 'fit') viewer.fit()
      else if (name === 'iso') viewer.stage.faceNormal([-0.55, -0.8, 0.45], centerOf(), spanOf())
      else if (name === 'top') viewer.stage.faceNormal([0, 0, 1], centerOf(), spanOf())
      else if (name === 'front') viewer.stage.faceNormal([0, -1, 0], centerOf(), spanOf())
    })
    toolbar.appendChild(b)
  }
  root.appendChild(toolbar)

  const listWrap = el('div', { class: 'cf-scroll' })
  const picker = el('div', { class: 'cf-picker' })
  const shapeList = el('div', { class: 'cf-list' })
  listWrap.appendChild(picker)
  listWrap.appendChild(shapeList)
  root.appendChild(listWrap)

  let viewer = null
  let scene = null
  let basePoints = null
  let bbox = null
  let span = 1
  let activeId = null
  let hidden = new Set()
  let requestedMode = 'detect'
  let visible = false
  let listDirty = true
  let loadController = null
  let loadJob = null
  let framedCloud = null
  let loadKey = null
  let destroyed = false
  let pollController = null
  let polling = null

  const centerOf = () => (bbox ? [(bbox.min[0] + bbox.max[0]) / 2, (bbox.min[1] + bbox.max[1]) / 2, (bbox.min[2] + bbox.max[2]) / 2] : [0, 0, 0])
  const spanOf = () => span

  function currentSource() {
    return state.cloudOverride || state.cloudPath || state.sceneCache?.sourceCloud || state.sceneCache?.source_cloud || state.workflow?.sourceCloud || null
  }

  function renderDetection() {
    const source = currentSource()
    const job = state.detectJob
    const busy = !!job && !job.done
    sourceLabel.textContent = source ? `当前点云：${fileName(source)}` : '请先选择要检测的点云'
    sourceLabel.title = source || ''
    detectBtn.disabled = !source || busy
    detectBtn.textContent = busy ? (job.startError || job.pollError ? '检测状态待确认' : '正在检测…') : '开始检测'
    const status = job?.startError || job?.pollError || job?.stage || ''
    jobNote.textContent = status ? `${fileName(job.sourceCloud)}：${status}` : ''
    jobNote.classList.toggle('hidden', !status)
    retryBtn.textContent = job?.startError ? '重试开始检测' : '重试查询进度'
    retryBtn.classList.toggle('hidden', !job || job.done || !(job.startError || job.id && job.pollError))
    showResultBtn.classList.toggle('hidden', !job?.savedOutsideContext || !job.done || !job.completedResult?.done || job.completedResult.ok === false)
  }

  async function startDetection({ retry = false } = {}) {
    const old = state.detectJob
    if (destroyed || (!retry && (!currentSource() || old && !old.done))) return
    if (retry && (!old?.startError || old.id)) return
    const job = retry ? old : {
      id: null, sourceCloud: currentSource(), workflowDir: state.workflow?.dir || null,
      sceneId: state.sceneId, requestId: crypto.randomUUID(), done: false,
    }
    job.startError = job.pollError = null
    job.stage = '正在准备检测…'
    state.detectJob = job
    renderDetection()
    state.notify?.()
    try {
      const result = await data.runEffect('cloudforge.detect.start', {
        cloud: job.sourceCloud, preset: job.sceneId === 'asbuilt' ? 'outdoor' : 'mechanical', request_id: job.requestId,
      })
      if (destroyed || state.detectJob !== job) return
      if (!result || !result.job || result.ok === false && !result.done) {
        job.done = true
        job.stage = `检测未开始：${result?.error || '未能取得检测任务'}`
      } else {
        job.id = result.job
        job.resultDir = result.resultDir
        job.stage = result.stage || '正在检测…'
        if (result.done) job.completedResult = result
        if (visible) void resumeDetection()
      }
    } catch (error) {
      if (destroyed || state.detectJob !== job) return
      const message = String(error.message || error)
      // 宿主在提交 effect 前拒绝的命令没有启动后台任务，恢复开始按钮。
      if (message === 'client command is not authorized: cloudforge.detect.start') {
        job.done = true
        job.stage = '检测未开始：本次操作未获授权'
      } else if (message === 'client command is not registered: cloudforge.detect.start') {
        job.done = true
        job.stage = '检测入口尚未加载，请刷新页面后重试'
      } else {
        // 请求可能已到达后台；使用同一 request_id 重试，不能提交并行任务。
        job.startError = `启动状态暂未确认：${message}`
      }
    }
    if (!destroyed && state.detectJob === job) { renderDetection(); state.notify?.() }
  }

  function detectionDelay(ms, signal) {
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        clearTimeout(timer)
        signal.removeEventListener('abort', onAbort)
        reject(signal.reason || new DOMException('Aborted', 'AbortError'))
      }
      const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve() }, ms)
      signal.addEventListener('abort', onAbort, { once: true })
      if (signal.aborted) onAbort()
    })
  }

  async function adoptDetection(job, result, signal) {
    const report = await data.report()
    signal.throwIfAborted()
    if (report?.ok === false) throw new Error(report.error || '检测结果暂未读到，可重试查询')
    const workflow = report.workflows?.find((item) => samePath(item.dir, result.resultDir))
    if (!workflow) throw new Error('检测已完成，工作流列表尚未更新，请重试查询')
    const detectedScene = await data.scene(workflow.dir)
    signal.throwIfAborted()
    if (detectedScene?.ok === false) throw new Error(detectedScene.error || '检测结果暂不可读取')
    if (destroyed || !visible || state.detectJob !== job) return
    const contextUnchanged = keyPath(job.workflowDir) === keyPath(state.workflow?.dir)
      && samePath(job.sourceCloud, currentSource()) && job.sceneId === state.sceneId
    if (!contextUnchanged && !job.forceOpen) {
      job.done = true
      job.savedOutsideContext = true
      job.stage = '检测已完成；当前选择已改变，可点击查看检测结果'
      renderDetection()
      state.notify?.()
      return
    }
    const sourceCloud = result.sourceCloud || workflow.sourceCloud || job.sourceCloud
    // 后台会将相对路径解析为完整路径；同一检测输入的视角沿用已有取景。
    if (samePath(framedCloud, job.sourceCloud) && samePath(currentSource(), job.sourceCloud)) framedCloud = sourceCloud
    job.savedOutsideContext = false
    job.forceOpen = false
    activeId = null
    hidden = new Set()
    viewer?.highlight(null)
    state.pendingHighlight = null
    state.adoptWorkflow?.({ report, workflow, scene: detectedScene, sourceCloud })
    job.done = true
    job.stage = `检测完成 · ${num(detectedScene.shape_count ?? workflow.shapes)} 基元` +
      (result.elapsedMs != null ? ` · ${ms(result.elapsedMs)}` : '')
    renderDetection()
    state.notify?.()
    // 检测任务已结束；切走页签只暂停查询，结果载入由独立的读取控制器负责。
    await refresh()
  }

  function resumeDetection() {
    const job = state.detectJob
    if (destroyed || !visible || !job?.id || job.done || job.pollError || polling) return polling || Promise.resolve()
    const controller = new AbortController()
    pollController = controller
    const { signal } = controller
    polling = (async () => {
      let failures = 0
      while (!signal.aborted && !destroyed && visible && state.detectJob === job) {
        try {
          const result = job.completedResult || await data.detectStatus(job.id)
          signal.throwIfAborted()
          if (result?.done) {
            job.completedResult = result
            if (result.ok === false) {
              job.done = true
              job.stage = `检测失败：${result.error || '未知错误'}`
              renderDetection()
              state.notify?.()
              return
            }
            await adoptDetection(job, result, signal)
            return
          }
          if (result?.ok === false) throw new Error(result.error || '暂未取得检测进度')
          job.stage = result?.stage || '正在检测…'
          failures = 0
          renderDetection()
          await detectionDelay(1500, signal)
        } catch (error) {
          if (signal.aborted || destroyed) return
          failures++
          if (failures >= 3 || job.completedResult) throw error
          await detectionDelay(1200, signal)
        }
      }
    })().catch((error) => {
      if (signal.aborted || destroyed || state.detectJob !== job) return
      job.pollError = `进度暂未更新：${String(error.message || error)}`
      renderDetection()
      state.notify?.()
    }).finally(() => {
      if (pollController === controller) pollController = null
      polling = null
      if (!destroyed && visible && state.detectJob?.id && !state.detectJob.done && !state.detectJob.pollError && (signal.aborted || state.detectJob !== job)) void resumeDetection()
    })
    return polling
  }

  // 检测完成或换源可以中止旧读取后直接读新结果；旧 Promise 的 finally 不能清掉新任务。
  function refresh() {
    const key = `${keyPath(state.workflow?.dir)}:${keyPath(state.cloudOverride || (!state.workflow ? state.cloudPath : null))}`
    if (loadJob && loadKey === key && !loadController?.signal.aborted) return loadJob
    loadKey = key
    const job = loadScene().finally(() => {
      if (loadJob === job) { loadJob = null; loadKey = null }
    })
    loadJob = job
    return job
  }

  function ensureViewer() {
    if (viewer) return viewer
    viewer = createCloudViewer(viewport, {
      onPickShape: (ray) => {
        const id = viewer.pickShapeId(ray)
        setActive(id === activeId ? null : id)
      },
    })
    viewer.visible = visible
    return viewer
  }

  function setActive(id, { focus = false } = {}) {
    activeId = id
    listDirty = true
    viewer?.highlight(id)
    renderList()
    if (id !== null) {
      const s = (scene?.shapes ?? []).find((x) => x.id === id)
      if (s) state.message = `#${id} ${typeCn(s.type)} · ${num(s.inlier_count)} 内点 · RMSE ${mm(s.rmse)} · σ ${mm(s.robust_sigma)}`
      // 选中/高亮不改用户的缩放与平移；仅「只看这个基元」明确要求取景。
      if (focus) viewer?.focusShape(id)
    } else if (state.message.startsWith('#')) {
      state.message = ''
    }
  }

  function syncModes() {
    for (const [id, b] of modeButtons) b.classList.toggle('on', id === requestedMode)
  }

  function renderLegend() {
    legend.replaceChildren()
    // data-pal 对应 index.css 里的 .cf-swatch[data-pal=…]，颜色写死在 CSS 里（CSP 禁 inline style）
    const rows = [
      ['base', '原始点云'],
      ['p0', '检测基元（按 id 循环 7 色）'],
      ['overlay', '几何叠加网格'],
      ['remaining', '未归类点'],
    ]
    for (const [pal, label] of rows) {
      legend.appendChild(
        el('div', { class: 'cf-legend-row' }, [
          el('i', { class: 'cf-swatch', dataset: { pal } }),
          el('span', { text: label }),
        ]),
      )
    }
  }

  function renderList() {
    if (!listDirty) return
    listDirty = false
    shapeList.replaceChildren()
    const shapes = scene?.shapes ?? []
    if (!shapes.length) {
      const detected = scene?.input_point_count != null || !!scene?.preset
      shapeList.appendChild(el('div', { class: 'cf-empty' }, detected
        ? '已完成检测，未检出几何基元，可切换场景后重试'
        : '暂无检测结果——选择点云后点击上方“开始检测”'))
      return
    }
    for (const s of shapes) {
      const row = el('div', {
        class: `cf-row${activeId === s.id ? ' active' : ''}${hidden.has(s.id) ? ' dim' : ''}`,
        dataset: { id: String(s.id) },
      })
      const sw = el('i', { class: 'cf-swatch', dataset: { pal: `p${s.id % PALETTE.length}` } })
      const name = el('div', { class: 'cf-row-main' }, [
        el('div', { class: 'cf-row-title' }, [
          el('span', { class: 'cf-badge', text: typeCn(s.type) }),
          el('span', { text: `#${s.id}` }),
        ]),
        el('div', { class: 'cf-row-meta' },
          `${num(s.inlier_count)} 内点 · RMSE ${mm(s.rmse)} · σ ${mm(s.robust_sigma)}`),
        // soft_score 分 21 档（每档 5%）：精确数值就印在上面的 meta 行，
        // 条形只要能看出健康度即可，这样不必用被 CSP 禁掉的 inline width
        el('div', { class: 'cf-bar' }, [
          el('i', { dataset: { score: String(Math.round(Math.min(1, Math.max(0, s.soft_score ?? 0)) * 20)) } }),
        ]),
      ])
      // 「只看这个」用图标而不是文字：43 行列表里每行都一个 "solo" 文字按钮，
      // 重复 43 次的文案会变成噪音；图标 + title 保留可发现性与悬停说明。
      const solo = el('button', { class: 'cf-btn-xs cf-solo', title: '只看这个基元', 'aria-label': `只看基元 #${s.id}` }, [icon('iso', 12)])
      solo.addEventListener('click', (ev) => {
        ev.stopPropagation()
        hidden = new Set(shapes.filter((x) => x.id !== s.id).map((x) => x.id))
        setActive(s.id, { focus: true })
      })
      row.appendChild(sw)
      row.appendChild(name)
      row.appendChild(solo)
      row.addEventListener('click', () => {
        if (hidden.has(s.id)) hidden.delete(s.id)
        setActive(activeId === s.id ? null : s.id)
      })
      shapeList.appendChild(row)
    }
  }

  function updateTag() {
    if (!scene) {
      tag.textContent = '尚未载入点云'
      return
    }
    // 点云名取实际载入的那份（source_cloud 缺失时可能是自动兜底或用户在兜底选择器里挑的）
    const cloudName = (state.cloudPath || scene.sourceCloud || scene.source_cloud || '').split(/[\\/]/).pop()
    // 点数取**实际载入的这份点云**，不是 result.json 里的 input_point_count：
    // 兜底载入时两者不同，只报后者会变成假数字
    const shown = basePoints ? Math.floor(basePoints.length / 3) : null
    const declared = scene.input_point_count
    const cov = declared ? scene.inlier_point_sum / declared : null
    tag.textContent =
      `${cloudName || '点云'} · ${num(shown ?? declared)} 点 · ${scene.shape_count} 基元` +
      (shown != null && declared && shown !== declared ? `（检测输入 ${num(declared)} 点）` : '') +
      (cov != null ? ` · 覆盖 ${pct(cov)}` : '') +
      (scene.elapsed_ms != null ? ` · ${ms(scene.elapsed_ms)}` : '')
  }

  /** 载入当前工作流的检测结果与点云（source_cloud 缺失时给兜底选择器，绝不把 phase 卡在 loading） */
  async function loadScene() {
    loadController?.abort()
    const controller = new AbortController()
    loadController = controller
    const { signal } = controller
    const wf = state.workflow
    const chosenCloud = state.cloudOverride || (!wf ? state.cloudPath : null)
    if (!wf && !chosenCloud) {
      scene = null
      basePoints = null
      bbox = null
      framedCloud = null
      state.sceneCache = null
      state.cloudPath = null
      state.progress = null
      listDirty = true
      viewer?.setShapes([])
      viewer?.setBase(new Float32Array(0), { min: [0, 0, 0], max: [0, 0, 0] })
      picker.replaceChildren()
      renderList()
      updateTag()
      state.phase = 'empty'
      return
    }
    state.phase = 'loading'
    let s
    try {
      s = wf ? await data.scene(wf.dir) : {
        shapes: [], shape_count: 0, source_cloud: chosenCloud, input_point_count: null,
        inlier_point_sum: null, candidateClouds: [],
      }
      signal.throwIfAborted()
      if (s.ok === false) throw new Error(s.error)
    } catch (e) {
      if (signal.aborted) return
      state.phase = 'empty'
      state.message = `读取检测结果失败：${String(e.message || e)}`
      return
    }
    const recordedCloud = s.sourceCloud || s.source_cloud
    if (chosenCloud && keyPath(chosenCloud) !== keyPath(recordedCloud)) {
      // 新选择的点云尚未检测，不能套用上一份点云的形状与覆盖率。
      s = { shapes: [], shape_count: 0, source_cloud: chosenCloud, input_point_count: null,
        inlier_point_sum: null, candidateClouds: s.candidateClouds || [] }
      activeId = null
      hidden = new Set()
      state.pendingHighlight = null
    }
    scene = s
    state.sceneCache = s // CAD 页要用源点云做叠加
    listDirty = true
    renderList()
    state.cloudPath = null
    let cloud = chosenCloud || s.sourceCloud || s.source_cloud
    // source_cloud 缺失时不留空白视口：自动取最近的一个候选（candidateClouds 已按目录就近排序），
    // 并保留选择器让用户换文件。内点仍按几何重投影切分，不用原输入的下标。
    const autoPicked = !cloud && !!s.candidateClouds?.length
    if (autoPicked) cloud = s.candidateClouds[0].path
    if (!cloud) {
      basePoints = null
      bbox = null
      framedCloud = null
      state.progress = null
      viewer?.setShapes([])
      viewer?.setBase(new Float32Array(0), { min: [0, 0, 0], max: [0, 0, 0] })
      state.phase = 'ready'
      state.message = `「${wf.name}」未记录源点云路径，请在下方选择要显示的点云`
      renderPicker(s.candidateClouds ?? [])
      renderList()
      updateTag()
      return
    }
    const v = ensureViewer()
    const shouldFit = !samePath(framedCloud, cloud)
    if (shouldFit) {
      activeId = null
      hidden = new Set()
      v.highlight(null)
    }
    v.setMode('raw')
    v.setShapes([])
    v.setRemaining(null)
    state.progress = { loaded: 0, total: null }
    state.notify?.()
    let previewShown = false
    try {
      const loaded = await data.loadCloud(cloud, {
        signal,
        onPage: async (positions, loadedCount, page) => {
          // 进度基准必须是**这份点云自己的** total：source_cloud 缺失时用户可能选了别的点云，
          // 拿 scene.input_point_count 当分母会出现 "250000 / 196133" 这种越界显示
          state.progress = { loaded: loadedCount, total: page.total }
          state.message = `载入点云 ${num(loadedCount)} / ${num(page.total)}`
          // 首批点到达即可看见轮廓，不等剩余 RPC 或数百万次内点距离判断。
          if (!previewShown && positions?.length) {
            previewShown = true
            basePoints = positions
            bbox = { min: page.bbox_min, max: page.bbox_max }
            span = page.span || 1
            state.cloudPath = cloud
            v.setBase(positions, bbox)
            // 新文件首批只取景一次；同文件刷新与后续分片保留用户视角。
            if (shouldFit) {
              v.fit()
              framedCloud = cloud
            }
            updateTag()
            // 给首批画面绘制与用户点击留下执行机会。
            if (visible) await new Promise((resolve) => setTimeout(resolve, 0))
          }
          state.notify?.()
        },
      })
      signal.throwIfAborted()
      basePoints = loaded.positions
      bbox = loaded.bbox ?? { min: [0, 0, 0], max: [0, 0, 0] }
      span = loaded.span || 1
      v.setBase(basePoints, bbox)
      updateTag()
      state.message = '点云已载入，正在生成检测着色…'
      state.notify?.()
      // 先给完整原始点云绘制机会，再分片计算；几何阈值与原实现相同。
      await new Promise((resolve) => setTimeout(resolve, 0))
      signal.throwIfAborted()
      const prims = (scene.shapes ?? []).map((sh) => buildPrimitive(sh, bbox))
      const subsets = await splitInliers(basePoints, scene.shapes ?? [], { signal })
      signal.throwIfAborted()
      v.setShapes(prims.map((prim, i) => ({ prim, positions: subsets[i] })))
      v.setRemaining(null)
      v.setMode(requestedMode)
      if (!previewShown && shouldFit && basePoints.length) {
        v.fit()
        framedCloud = cloud
      }
      syncModes()
      state.phase = 'ready'
      state.cloudPath = cloud
      if (autoPicked) {
        state.message = `result.json 未记录 source_cloud，已自动载入最近候选 ${cloud.split(/[\\/]/).pop()}（内点按几何重投影切分）`
        renderPicker(s.candidateClouds ?? [])
      } else {
        state.message = ''
        picker.replaceChildren()
      }
      // 验证页点某个 check 时会请求高亮对应形状
      if (state.pendingHighlight != null) {
        setActive(state.pendingHighlight)
        state.pendingHighlight = null
      }
    } catch (e) {
      if (signal.aborted) return
      state.phase = 'empty'
      state.message = `点云载入失败：${String(e.message || e)}`
    } finally {
      if (loadController === controller) state.notify?.()
    }
  }

  /** source_cloud 缺失时的兜底点云选择器 */
  function renderPicker(candidates) {
    picker.replaceChildren()
    if (!candidates?.length) {
      picker.appendChild(el('div', { class: 'cf-note', text: '工作区也没找到 .ply / .pcd，请先选择要检测的点云' }))
      return
    }
    const row = el('div', { class: 'cf-foot-row' })
    row.appendChild(el('span', { class: 'dim', text: '点云' }))
    const sel = el('select', { class: 'cf-select' })
    for (const c of candidates) sel.appendChild(el('option', { value: c.path, text: `${c.name}（${fmtSize(c.size)}）` }))
    sel.addEventListener('change', () => {
      if (!samePath(currentSource(), sel.value)) state.progress = null
      state.cloudOverride = sel.value
      void reloadTab()
    })
    row.appendChild(sel)
    picker.appendChild(row)
  }

  /**
   * 「选择点云」：弹系统原生文件对话框（资源管理器）。
   * 共享流程见 pick.js（两阶段 + 异常路径全覆盖），这里只挂点云特有的回调：
   * 选中后记入 cloudOverride 并重跑本页签，格式真伪由载入流程裁决
   * （CloudFormatError 会在那里报出）。
   */
  function pickCloudFile(btn, statusEl) {
    void pickNativeFile({
      data,
      exts: ['ply', 'pcd'],
      btn,
      statusEl,
      onPicked: (r) => {
        if (!samePath(currentSource(), r.path)) state.progress = null
        state.cloudOverride = r.path
        void reloadTab()
      },
    })
  }

  // 页签内复用同一选择控件；footer 重绘时保留禁用状态与打开中的提示。
  const pickNote = el('span', { class: 'cf-pick-note' })
  const openBtn = el('button', { class: 'cf-btn-sm', text: '选择点云', title: '弹出系统文件对话框，选择 .ply / .pcd 载入' })
  openBtn.addEventListener('click', () => void pickCloudFile(openBtn, pickNote))

  return {
    el: root,
    viewer: () => viewer,
    state: () => ({ scene, bbox, span, activeId, basePoints }),
    /** 面板外壳注入：点云选择器换源后要重跑本页签 */
    setReload(fn) {
      reloadTab = fn
    },

    activate() {
      visible = true
      ensureViewer()
      viewer.visible = true
      viewer.stage.resize()
      syncModes()
      renderDetection()
      void resumeDetection()
    },
    deactivate() {
      visible = false
      pollController?.abort()
      if (viewer) viewer.visible = false
    },

    render() {
      renderDetection()
      updateTag()
      renderList()
    },

    refresh,

    cancelRefresh() {
      loadController?.abort()
    },

    /** 底部工具条：来源 + 进度 + 视图模式 + 键盘提示 */
    renderFooter(foot, { state: st, data: dl, reload }) {
      const row = el('div', { class: 'cf-foot-row' })
      const wf = st.workflow
      const source = currentSource()
      const pendingSource = !!source && (!wf || !samePath(source, wf.sourceCloud))
      const points = pendingSource ? (st.progress?.total ?? (basePoints && samePath(source, framedCloud) ? basePoints.length / 3 : null)) : wf?.points
      const shapes = pendingSource ? (samePath(source, scene?.sourceCloud || scene?.source_cloud) ? scene?.shape_count ?? 0 : 0) : wf?.shapes ?? 0
      row.appendChild(el('span', { class: 'mono', text: pendingSource ? '当前点云 · 待检测' : wf ? wf.name : '无工作流' }))
      row.appendChild(el('span', { class: 'sep', text: '·' }))
      row.appendChild(el('span', { class: 'mono', text: `${num(points)} 点 / ${shapes} 基元` }))
      const spacer = el('span', { class: 'spacer' })
      row.appendChild(spacer)
      // 选择过程的状态位：默认隐藏，选择开始后显示进度/结果/错误，30s 无新事件自动收起
      row.appendChild(pickNote)
      row.appendChild(openBtn)
      const reloadBtn = el('button', { class: 'cf-btn-sm', text: '重新载入' })
      reloadBtn.addEventListener('click', () => void reload())
      row.appendChild(reloadBtn)
      foot.appendChild(row)

      if (st.progress && st.progress.total) {
        // 用 <progress> 的 value/max **属性**而不是 inline width：CSP 的 style-src 不含
        // 'unsafe-inline'，style 属性会被浏览器拦掉
        const p = document.createElement('progress')
        p.className = 'cf-progress'
        p.max = st.progress.total
        p.value = Math.min(st.progress.loaded, st.progress.total)
        foot.appendChild(p)
        foot.appendChild(
          el('div', { class: 'cf-foot-row' }, [
            el('span', { class: 'mono', text: `已载入 ${num(st.progress.loaded)} / ${num(st.progress.total)}` }),
            el('span', { class: 'spacer' }),
            el('span', { class: 'dim', text: 'uint16 量化 · 单批 65,536 点 · 服务端上限 1 MiB' }),
          ]),
        )
      }
      if (st.message) foot.appendChild(el('div', { class: 'cf-msg', text: st.message }))
    },

    destroy() {
      destroyed = true
      visible = false
      pollController?.abort()
      loadController?.abort()
      viewer?.dispose()
      viewer = null
    },
  }
}
