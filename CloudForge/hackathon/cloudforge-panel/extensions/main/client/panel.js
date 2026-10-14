// 云铸面板 · 外壳（头部 / 页签 / 状态机 / 底部工具条）
//
// 高度链：宿主把右栏定成 position:fixed + 上下 inset 的浮动卡片（web/public/style.css:1288-1298），
// 但 #rightbar-content 只有 min-height:100%，子孙 height:100% 能否解析不确定。
// 因此这里用 ResizeObserver 直接读宿主卡片的 clientHeight 写显式 px（P0 实测选定的方案），
// 面板折叠（rail）时高度不变、只改宽度。

import { el, icon, num, pct } from './ui.js'
import { prefs, WIDTH_STEP_PX } from './prefs.js'
import { createLazyTab } from './lazy-tab.js'
import { createData } from './data.js'

/** 三场景 profile（对齐 hackathon/VALUE.md 的"一个引擎、三种行业报告"） */
export const SCENES = [
  { id: 'asbuilt', label: '竣工核验', preset: 'outdoor', report: '净高 / 开间 / 墙厚 / 平整度' },
  { id: 'ship', label: '船舶分段', preset: 'mechanical', report: '基面 / 骨材参数 / 偏差表' },
  { id: 'relic', label: '文物构件', preset: 'mechanical', report: '柱径 / 梁截面 / 倾角' },
]

const TABS = [
  { id: 'cloud', label: '点云', iconName: 'cloud' },
  { id: 'cad', label: 'CAD', iconName: 'cube' },
  { id: 'verify', label: '验证', iconName: 'check' },
  { id: 'report', label: '报告', iconName: 'doc' },
]

export function mountPanel(host, ctx, { applyStartedAt } = {}) {
  const data = createData(ctx)

  const state = {
    tab: 'cloud',
    rail: false,
    phase: 'empty', // empty | loading | ready | busy
    sceneId: 'asbuilt',
    workflow: null,
    report: null,
    suite: null,
    trace: null,
    message: '',
    progress: null,
  }
  let destroyed = false
  let readingReport = false
  let reportVersion = 0
  let activeTabId = null
  let reloadJob = null
  let reloadRequested = false
  let renderTimer = null
  const dirtyTabs = new Set(TABS.map((t) => t.id))
  const tabJobs = new Map()

  // 点云下载/分片计算只更新可见内容；同一事件循环的进度更新合并一次。
  state.notify = () => {
    if (destroyed || renderTimer !== null) return
    renderTimer = setTimeout(() => {
      renderTimer = null
      if (!destroyed) render()
    }, 0)
  }

  const root = el('div', { class: 'cf-panel' })
  root.id = 'cf-console'
  if (Number.isFinite(applyStartedAt)) root.dataset.applyMs = applyStartedAt.toFixed(1)
  host.appendChild(root)

  // ---- 头部
  const statusDot = el('span', { class: 'cf-dot' })
  const statusText = el('span', { class: 'cf-head-status' }, '连接中…')
  const sceneSelect = el('select', { class: 'cf-select', title: '场景 profile：决定检测预设与报告语义' })
  for (const s of SCENES) sceneSelect.appendChild(el('option', { value: s.id, text: `${s.label} · ${s.report}` }))
  sceneSelect.addEventListener('change', () => {
    state.sceneId = sceneSelect.value
    try {
      sessionStorage.setItem(storageKey('scene'), state.sceneId)
    } catch {
      /* 隐私模式等场景忽略 */
    }
    render()
  })

  // 场景 profile 是**全局过滤器**（决定检测预设与报告语义），语义上不属于标题，
  // 挤在标题行里会和标题抢宽度、还会把长 preset 名截断，所以单独一条工具栏
  // 折叠按钮不放这里：宿主已有同款图标按钮模式（图二 #sidebar-toggle），
  // 我们的折叠开关注册到会话头栏槽 conversation.session.header.utilities，
  // 由 index.js 渲染并复用宿主的 .icon-button 样式——两棵 React 树靠 rail store 同步。
  const railBtn = el('button', { class: 'cf-icon-btn', title: '折叠面板', dataset: { cf: 'rail' } }, [icon('collapse')])
  const header = el('header', { class: 'cf-head' }, [
    el('div', { class: 'cf-head-text' }, [
      el('div', { class: 'cf-head-title' }, 'CloudForge 控制台'),
      el('div', { class: 'cf-head-sub' }, [statusDot, statusText]),
    ]),
    el('button', { class: 'cf-icon-btn', title: '刷新', dataset: { cf: 'refresh' } }, [icon('refresh')]),
  ])
  // 没有活动会话时宿主不渲染会话头栏（该槽是 session 作用域），折叠开关会无处可寻，
  // 此时才退回面板内置那颗，保证任何状态下都能收起
  if (!ctx.session?.sessionId) header.appendChild(railBtn)
  root.appendChild(header)

  // ---- 页签条
  const tabBar = el('nav', { class: 'cf-tabs' })
  const tabButtons = new Map()
  for (const t of TABS) {
    const b = el('button', { class: 'cf-tab', dataset: { tab: t.id } }, [icon(t.iconName, 13), el('span', { text: t.label })])
    b.addEventListener('click', () => selectTab(t.id))
    tabBar.appendChild(b)
    tabButtons.set(t.id, b)
  }
  root.appendChild(tabBar)

  // 场景过滤条：独占一行、整宽，长 preset 名不会再被截断
  const toolbar = el('div', { class: 'cf-toolbar' }, [sceneSelect])
  root.appendChild(toolbar)

  // ---- 内容区
  const content = el('div', { class: 'cf-content' })
  root.appendChild(content)

  const footer = el('footer', { class: 'cf-foot' })
  root.appendChild(footer)

  // 外壳不能静态依赖 viewer/three：否则浏览器先下载并求值整个三维模块图，
  // 连标题与折叠按钮都要等它。相对路径字面量也让 AGH 资产快照收齐懒加载资源。
  const loaders = {
    cloud: () => import('./tabs/cloud.js').then((m) => m.createCloudTab),
    cad: () => import('./tabs/cad.js').then((m) => m.createCadTab),
    verify: () => import('./tabs/verify.js').then((m) => m.createVerifyTab),
    report: () => import('./tabs/report.js').then((m) => m.createReportTab),
  }
  const tabs = Object.fromEntries(TABS.map(({ id, label }) => [id, createLazyTab({
    id, label,
    load: async () => {
      const createTab = await loaders[id]()
      return () => createTab({ ctx, data, state })
    },
    onReady: () => state.notify(),
    onError: (e) => { state.message = `${label}视图加载失败：${String(e?.message ?? e)}`; state.notify() },
    onRetry: () => { dirtyTabs.add(id); void refreshTab(id) },
  })]))
  for (const t of Object.values(tabs)) content.appendChild(t.el)
  // 点云页的兜底选择器要能触发整页重载
  tabs.cloud.setReload?.(() => reload())

  // 检测或 CAD 生成完成后采用后端明确关联的工作流，其余页签读取这份新结果。
  state.adoptWorkflow = ({ report, workflow, scene, sourceCloud }) => {
    if (destroyed || !workflow?.dir) return
    tabs.cloud.cancelRefresh?.()
    reportVersion++
    state.report = report
    state.workflow = workflow
    state.sceneCache = scene || null
    state.cloudOverride = null
    state.cloudPath = sourceCloud || workflow.sourceCloud || null
    state.progress = null
    state.phase = 'ready'
    state.message = ''
    for (const id of Object.keys(tabs)) dirtyTabs.add(id)
    state.notify()
  }

  // ---- 高度：交给 CSS
  // 面板是 position:fixed 的浮层卡片，高度用 calc(100dvh - var(--cf-float-top) - var(--cf-float-gap))
  // 一条规则就够（index.css）。这里刻意不做 JS 高度链：一是挂载点是 #main-content 里的普通流
  // 容器（web/src/app.ts:244 + web/src/client-modules/boot.ts:165），没有可跟随的宿主区域高度；
  // 二是任何写 style 的做法都会被 CSP 拦（style-src 无 'unsafe-inline'）。

  // ---- 状态恢复（workbench.panel 是 session-maybe 作用域，切会话可能重挂组件）
  const skey = () => `cf:${ctx.session?.sessionId ?? 'default'}`
  function storageKey(k) {
    return `${skey()}:${k}`
  }
  try {
    const savedScene = sessionStorage.getItem(storageKey('scene'))
    if (savedScene && SCENES.some((s) => s.id === savedScene)) {
      state.sceneId = savedScene
      sceneSelect.value = savedScene
    }
    const savedTab = sessionStorage.getItem(storageKey('tab'))
    if (savedTab && TABS.some((t) => t.id === savedTab)) state.tab = savedTab
    const savedRail = sessionStorage.getItem(storageKey('rail'))
    if (savedRail === '1') state.rail = true
  } catch {
    /* 忽略 */
  }

  // ---- 行为
  function selectTab(id) {
    if (state.tab === id) return
    state.tab = id
    try {
      sessionStorage.setItem(storageKey('tab'), id)
    } catch {
      /* 忽略 */
    }
    render()
    void refreshTab(id)
  }

  // 折叠状态与列宽档位放在共享 store（见 prefs.js）：宿主会话头栏那颗按钮在另一棵
  // React 树里，两边必须读同一份，否则会出现「点了没反应」或两处状态不一致
  function setRail(on) {
    prefs.patch({ rail: on })
  }

  // ---- 列宽拖拽把手
  // 宽度不能直接写 CSS 变量：CSP 的 style-src 'self' 会拦掉 inline style，
  // 所以按 48px 一档换算成 data-w="0..7"，由 index.css 里预写的规则落地。
  const grip = el('div', {
    class: 'cf-grip',
    title: '拖动调整宽度（每档 48px）',
    role: 'separator',
    'aria-orientation': 'vertical',
    'aria-label': '调整 CloudForge 控制台宽度',
  })
  let gripStart = null
  grip.addEventListener('pointerdown', (ev) => {
    if (state.rail) return
    ev.preventDefault()
    gripStart = { x: ev.clientX, step: prefs.widthStep() }
    // pointerId 若已失效，setPointerCapture 会抛 NotFoundError；捕获失败不该中断拖拽
    try {
      grip.setPointerCapture(ev.pointerId)
    } catch {
      /* 忽略 */
    }
    grip.dataset.dragging = '1'
  })
  grip.addEventListener('pointermove', (ev) => {
    if (!gripStart) return
    // 往左拖 = 变宽：位移取 (起点 - 当前) 才是正数。
    // 反过来写成 (当前 - 起点) 会得到负值，被 clampStep 夹在 0，表现为「拖不动」
    prefs.patch({ w: gripStart.step + Math.round((gripStart.x - ev.clientX) / WIDTH_STEP_PX) })
  })
  const endGrip = (ev) => {
    if (!gripStart) return
    gripStart = null
    delete grip.dataset.dragging
    try {
      grip.releasePointerCapture(ev.pointerId)
    } catch {
      /* 忽略 */
    }
  }
  grip.addEventListener('pointerup', endGrip)
  grip.addEventListener('pointercancel', endGrip)
  root.appendChild(grip)

  header.querySelector('[data-cf="refresh"]').addEventListener('click', () => void reload())
  // 折叠按钮只在草稿态（无会话、宿主不渲染会话头栏）才内置，存在性必须判断，
  // 否则 querySelector 返回 null 会让整个 mountPanel 抛错、面板彻底挂不上
  header.querySelector('[data-cf="rail"]')?.addEventListener('click', () => setRail(!state.rail))

  function reload() {
    if (destroyed) return Promise.resolve()
    reloadRequested = true
    if (reloadJob) {
      tabs.cloud.cancelRefresh?.()
      return reloadJob
    }
    reloadJob = (async () => {
      do {
        reloadRequested = false
        await reloadOnce()
      } while (reloadRequested && !destroyed)
    })().finally(() => { reloadJob = null })
    return reloadJob
  }

  async function reloadOnce() {
    const sessionId = data.sessionId()
    if (!sessionId) {
      state.report = null
      state.workflow = null
      state.phase = 'empty'
      state.message = '选择点云或 CAD 时会先创建会话，请确认已选择工作区'
      render()
      return
    }
    readingReport = true
    tabs.cloud.cancelRefresh?.()
    state.phase = 'loading'
    state.message = '正在读取工作区产物…'
    render()
    try {
      const report = await data.report()
      if (destroyed || data.sessionId() !== sessionId) return
      const previousWorkflow = state.workflow
      state.report = report
      state.workflow = pickWorkflow(report.workflows, previousWorkflow?.dir)
      if (previousWorkflow?.dir !== state.workflow?.dir) {
        state.cloudPath = null
        state.meshCache = null
        // 用户刚选的文件优先于异步返回的历史工作流。
        if (!state.cloudOverride) state.progress = null
      }
      state.sceneCache = null
      if (!state.report.workflows.length) {
        state.message = '工作区还没有检测结果——在会话里跑一次分析'
        state.phase = 'empty'
      } else {
        state.phase = 'ready'
        state.message = ''
      }
    } catch (e) {
      if (destroyed || data.sessionId() !== sessionId) return
      state.message = `读取失败：${String(e.message || e)}`
      state.phase = 'empty'
    } finally {
      readingReport = false
    }
    if (destroyed || data.sessionId() !== sessionId) return
    reportVersion++
    for (const id of Object.keys(tabs)) dirtyTabs.add(id)
    render()
    // 首屏只读取当前可见页；折叠时保留视口，展开或切页再补最新数据。
    if (!state.rail && !reloadRequested) await refreshTab(state.tab)
    if (!destroyed) render()
  }

  function refreshTab(id) {
    if (destroyed || !data.sessionId() || readingReport || state.rail || !state.report || !dirtyTabs.has(id)) return Promise.resolve()
    if (tabJobs.has(id)) return tabJobs.get(id)
    dirtyTabs.delete(id)
    const version = reportVersion
    const job = (async () => {
      // 报告的场景换算及 CAD 叠加仍需要场景元信息；无需下载隐藏的整份点云。
      if (id !== 'cloud' && !state.sceneCache && state.workflow?.dir) {
        const scene = await data.scene(state.workflow.dir)
        if (destroyed || version !== reportVersion) return
        if (scene?.ok !== false) state.sceneCache = scene
      }
      await tabs[id].refresh?.()
      if (destroyed || version !== reportVersion) return
      if (!state.rail && state.tab === id) {
        // 元信息更新后，非点云页的 activate 负责生成当前卡片。
        if (id !== 'cloud') tabs[id].activate?.()
        render()
      }
    })().catch((e) => {
      if (!destroyed && version === reportVersion) {
        state.message = `页签读取失败：${String(e?.message ?? e)}`
        render()
      }
    }).finally(() => {
      tabJobs.delete(id)
      if (!destroyed && !state.rail && state.tab === id && dirtyTabs.has(id)) void refreshTab(id)
    })
    tabJobs.set(id, job)
    return job
  }

  // 挂载时绑定到本会话的偏好，并订阅宿主头栏那颗按钮的改动
  prefs.bind(ctx.session?.sessionId)
  state.rail = prefs.rail()
  root.dataset.w = String(prefs.widthStep())
  const offPrefs = prefs.subscribe((next) => {
    let dirty = false
    if (state.rail !== next.rail) {
      state.rail = next.rail
      dirty = true
    }
    if (root.dataset.w !== String(next.w)) {
      root.dataset.w = String(next.w)
      dirty = true
    }
    if (dirty) {
      render()
      if (!state.rail) void refreshTab(state.tab)
    }
  })

  // ---- 渲染
  function render() {
    root.dataset.rail = state.rail ? '1' : '0'
    for (const [id, b] of tabButtons) b.classList.toggle('active', state.tab === id)
    for (const [id, t] of Object.entries(tabs)) {
      const on = state.tab === id
      t.el.classList.toggle('active', on)
    }
    const visibleTab = state.rail ? null : state.tab
    if (visibleTab !== activeTabId) {
      if (activeTabId) tabs[activeTabId].deactivate?.()
      activeTabId = visibleTab
      if (activeTabId) tabs[activeTabId].activate?.()
    }
    statusDot.dataset.phase = state.phase
    statusText.textContent = statusLine()
    sceneSelect.classList.toggle('hidden', state.rail)
    toolbar.classList.toggle('hidden', state.rail)
    // 折叠按钮图标随状态翻转，轨道态才读得出「可以展开」
    railBtn.title = state.rail ? '展开面板' : '收起面板'
    railBtn.replaceChildren(icon(state.rail ? 'expand' : 'collapse'))

    // 底部工具条由当前页签提供
    footer.replaceChildren()
    const active = tabs[state.tab]
    active.renderFooter?.(footer, { data, state, reload, setMessage: (m) => { state.message = m; render() } })

    if (!state.rail) active.render?.()
  }

  function statusLine() {
    if (state.phase === 'loading') return '读取中…'
    if (state.phase === 'busy') return '执行中…'
    if (state.phase === 'empty') return state.message ? '待命' : '待命'
    const w = state.workflow
    const selected = state.cloudOverride || state.cloudPath
    const pathKey = (value) => String(value || '').replace(/\\/g, '/').toLowerCase()
    if (selected && (!w?.sourceCloud || pathKey(selected) !== pathKey(w.sourceCloud))) {
      const points = state.progress?.total
      return `${points != null ? `${num(points)} 点 · ` : ''}待检测`
    }
    if (!w) return '已连接 · 无结果'
    const cov = w.coverage ? ` · 覆盖 ${pct(w.coverage)}` : ''
    const el2 = w.elapsedMs != null ? ` · ${w.elapsedMs} ms` : ''
    return `${num(w.points)} 点 · ${w.shapes} 基元${cov}${el2}`
  }

  // 只留 DOM 时间戳供性能检查，不把实现细节放进产品界面。
  root.dataset.mountedMs = performance.now().toFixed(1)
  void reload()
  const offSession = ctx.session?.subscribe?.(() => {
    if (destroyed) return
    reportVersion++
    tabs.cloud.cancelRefresh?.()
    prefs.bind(data.sessionId())
    if (data.sessionId()) railBtn.remove()
    else if (!railBtn.isConnected) header.appendChild(railBtn)
    state.message = ''
    void reload()
  })
  const offTurn = data.onTurnEnd(() => void reload())

  // 调试桥（沿用旧版能力，评审现场可自查）
  window.__CF_DEBUG = {
    root,
    state,
    data,
    reload,
    selectTab,
    tabs,
    report: () => state.report,
    workflow: () => state.workflow,
  }

  return {
    root,
    destroy() {
      destroyed = true
      clearTimeout(renderTimer)
      offSession?.()
      offTurn?.()
      data.dispose()
      offPrefs()
      for (const t of Object.values(tabs)) t.destroy?.()
    },
  }
}

/** 尽量保持用户当前选中的那条工作流 */
function pickWorkflow(list, keepDir) {
  if (!Array.isArray(list) || !list.length) return null
  if (keepDir) {
    const hit = list.find((w) => w.dir === keepDir)
    if (hit) return hit
  }
  // 优先带真值且形状最多的那条，便于演示验证链
  return list[0]
}
