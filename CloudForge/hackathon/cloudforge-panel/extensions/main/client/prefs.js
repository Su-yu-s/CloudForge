// 面板偏好共享 store（折叠态 + 列宽档位）
//
// 为什么是模块级：面板挂在宿主为 workbench.panel 建的**独立 React root**，
// 而折叠开关要放进宿主的会话头栏槽 conversation.session.header.utilities——
// 那是**另一棵** React 树（region-slots.ts:1140-1169 ConversationSessionHeaderBuiltin）。
// 两棵树没有父子关系，但同属一个模块实例，于是用模块级 store 传递状态。
//
// 为什么宽度用「档位 + data-w 属性」而不是直接写 CSS 变量：
// 宿主 CSP 的 style-src 是 'self'（/plugins/* 资产路由连 nonce 都没有），
// setProperty('--x', …) 属于 inline style，会被浏览器拦掉并刷 console error。
// 所以宽度只能是 data-w="0..N" 配 index.css 里预写好的 N 条规则。

/** 档位定义：0 号即默认宽度，每档 +48px */
export const WIDTH_STEPS = 8
export const WIDTH_STEP_PX = 48

const listeners = new Set()

const store = {
  /** @type {string} */
  key: 'cf:default',
  /** @type {{rail: boolean, w: number}} */
  value: { rail: false, w: 0 },

  bind(sessionId) {
    this.key = `cf:${sessionId ?? 'default'}`
    let rail = false
    let w = 0
    try {
      rail = sessionStorage.getItem(`${this.key}:rail`) === '1'
      w = Number(sessionStorage.getItem(`${this.key}:w`) ?? '0') || 0
    } catch {
      /* 隐私模式等场景忽略 */
    }
    this.value = { rail, w: clampStep(w) }
    return this
  },

  get() {
    return this.value
  },

  rail() {
    return this.value.rail
  },

  widthStep() {
    return this.value.w
  },

  patch(next) {
    const merged = { ...this.value, ...next }
    const rail = !!merged.rail
    const w = clampStep(merged.w)
    if (rail === this.value.rail && w === this.value.w) return
    this.value = { rail, w }
    try {
      sessionStorage.setItem(`${this.key}:rail`, rail ? '1' : '0')
      sessionStorage.setItem(`${this.key}:w`, String(w))
    } catch {
      /* 忽略 */
    }
    for (const fn of [...listeners]) {
      try {
        fn(this.value)
      } catch {
        /* 单个订阅者出错不影响其它 */
      }
    }
  },

  toggleRail() {
    this.patch({ rail: !this.value.rail })
  },

  /** @returns {() => void} 退订函数 */
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
}

function clampStep(n) {
  const v = Math.round(Number(n) || 0)
  return v < 0 ? 0 : v > WIDTH_STEPS - 1 ? WIDTH_STEPS - 1 : v
}

export const prefs = store