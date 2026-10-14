import { el } from './ui.js'

/** 轻量页签外壳。模块加载完成后复用同一实例，切页/折叠不会重建三维视口。 */
export function createLazyTab({ id, label, load, onReady, onError, onRetry }) {
  const root = el('section', { class: 'cf-pane', dataset: { pane: id } })
  let instance = null
  let pending = null
  let refreshJob = null
  let reload = null
  let visible = false
  let destroyed = false

  function placeholder(error) {
    root.replaceChildren(el('div', { class: 'cf-blank', role: 'status' }, [
      el('div', { class: 'cf-blank-title', text: error ? `${label}视图未能加载` : `正在准备${label}视图…` }),
      el('div', { class: 'cf-blank-hint', text: error ? String(error?.message ?? error) : '工作台已打开，视图准备完成后自动显示' }),
    ]))
    if (error) {
      const retry = el('button', { class: 'cf-btn-sm', text: '重试' })
      retry.addEventListener('click', () => {
        void ensure().then(() => { if (!destroyed) onRetry?.() }).catch(() => {})
      })
      root.appendChild(retry)
    }
  }
  placeholder()

  function ensure() {
    if (destroyed) return Promise.resolve(null)
    if (instance) return Promise.resolve(instance)
    if (pending) return pending
    placeholder()
    pending = (async () => {
      const create = await load()
      // import 无法中止；卸载或切会话后，迟到的模块不能创建 viewer 或回写 DOM。
      if (destroyed) return null
      const tab = create()
      instance = tab
      tab.setReload?.(reload)
      root.replaceChildren(tab.el)
      // 实际页签嵌在代理页签内；外层决定显隐，内层保持原来的 cf-pane 布局。
      tab.el.classList.toggle('active', true)
      if (visible) tab.activate?.()
      tab.render?.()
      root.dataset.readyMs = performance.now().toFixed(1)
      onReady?.()
      return tab
    })().catch((error) => {
      try { instance?.destroy?.() } catch { /* 初始化失败时释放已创建的局部视口 */ }
      instance = null
      if (!destroyed) {
        placeholder(error)
        onError?.(error)
      }
      throw error
    }).finally(() => { pending = null })
    return pending
  }

  return {
    el: root,
    viewer: () => instance?.viewer?.(),
    state: () => instance?.state?.(),
    setReload(fn) { reload = fn; instance?.setReload?.(fn) },
    activate() {
      visible = true
      if (instance) instance.activate?.()
      else void ensure().catch(() => {})
    },
    deactivate() { visible = false; instance?.deactivate?.() },
    render() { instance?.render?.() },
    renderFooter(...args) { instance?.renderFooter?.(...args) },
    refresh() {
      if (refreshJob) return refreshJob
      refreshJob = ensure().then((tab) => destroyed ? undefined : tab?.refresh?.()).finally(() => { refreshJob = null })
      return refreshJob
    },
    cancelRefresh() { instance?.cancelRefresh?.() },
    destroy() { destroyed = true; visible = false; instance?.destroy?.(); instance = null },
  }
}
