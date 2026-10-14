// 云铸面板 · 极简 DOM 工具 + 格式化
// 不引框架：面板外壳由 React 出容器 div，内部全部命令式构建（three.js 需要真实 DOM 节点）
//
// **不要用 inline style**：宿主文档的 CSP 是 `style-src 'self' 'nonce-…'`
// （web-server/src/server.ts:291/611），既没有 'unsafe-inline'，nonce 也不适用于 style 属性，
// 所以 `el.style.x = …`、`setAttribute('style', …)`、`cssText` 全部会被浏览器拦掉并刷 console 错误。
// 动态数值一律走 data-* 属性 + CSS 规则（宽度用 <progress> 的 value/max 属性）。

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(attrs)) {
    if (v === undefined || v === null || v === false) continue
    if (k === 'class') node.className = String(v)
    else if (k === 'text') node.textContent = String(v)
    else if (k === 'html') node.innerHTML = String(v)
    else if (k === 'style') throw new Error('CSP 禁止 inline style，请改用 class 或 data-* 属性')
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v)
    else if (k === 'dataset') for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = String(dv)
    else node.setAttribute(k, String(v))
  }
  for (const c of [].concat(children)) {
    if (c === null || c === undefined || c === false) continue
    node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c)
  }
  return node
}

export const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]))

export const num = (n) => (typeof n === 'number' && Number.isFinite(n) ? n.toLocaleString('en-US') : '—')

/** 米 → 毫米（几何面板统一用 mm 展示，量级直观） */
export const mm = (m, digits = 2) =>
  typeof m === 'number' && Number.isFinite(m) ? `${(m * 1000).toFixed(digits)} mm` : '—'

/** verify 用：1e+30 是"未匹配"的哨兵值，必须显示成 — 而不是天文数字 */
export const mmOrDash = (m, digits = 3) =>
  typeof m === 'number' && Number.isFinite(m) && m < 1e29 ? `${(m * 1000).toFixed(digits)} mm` : '—'

export const pct = (v, digits = 1) =>
  typeof v === 'number' && Number.isFinite(v) ? `${(v * 100).toFixed(digits)}%` : '—'

export const ms = (v) => (typeof v === 'number' && Number.isFinite(v) ? `${v} ms` : '—')

export const fmtSize = (n) =>
  !n ? '—' : n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`

export const shortPath = (p, max = 46) => {
  const s = String(p ?? '')
  return s.length <= max ? s : `…${s.slice(-(max - 1))}`
}

export const basename = (p) => String(p ?? '').split(/[\\/]/).pop()

/** 几何类型中文名（与 Qt 版 spec/ui-mainwindow.md §3 一致） */
export const TYPE_CN = {
  Plane: '平面',
  Sphere: '球体',
  Cylinder: '圆柱体',
  Cone: '圆锥体',
  Torus: '圆环',
  Circle: '三维圆',
  Ellipse: '三维椭圆',
  PlaneNormal: '法向平面',
  OrthoPlane: '正交平面',
  Line: '直线',
  Unknown: '未知',
}
export const typeCn = (t) => TYPE_CN[t] ?? t ?? '未知'

/** 描边 SVG 图标（24 视框，stroke=currentColor） */
const ICONS = {
  refresh: 'M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5',
  collapse: 'M9 18l6-6-6-6',
  expand: 'M15 6l-6 6 6 6',
  play: 'M5 3l14 9-14 9V3z',
  cloud: 'M4 15c2-1 4-5 6-5s3 4 5 4 3-2 5-3',
  cube: 'M12 2l8 4.6v9.2L12 22l-8-6.2V6.6L12 2zM12 2v20M4 6.6l8 4.6 8-4.6',
  check: 'M9 12l2 2 4-4M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18z',
  doc: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h5',
  fit: 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5',
  top: 'M12 3v18M5 10l7-7 7 7',
  front: 'M3 12h18M6 8l-3 4 3 4M18 8l3 4-3 4',
  iso: 'M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z',
  download: 'M12 3v12M7 11l5 5 5-5M4 21h16',
  external: 'M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
}
export function icon(name, size = 14) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('width', String(size))
  svg.setAttribute('height', String(size))
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '1.7')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  p.setAttribute('d', ICONS[name] ?? ICONS.cloud)
  svg.appendChild(p)
  return svg
}

/** 一次性的 CSS 类替换：把 [data-cf="xxx"] 绑到回调 */
export function on(root, selector, event, handler) {
  root.querySelectorAll(selector).forEach((n) => n.addEventListener(event, handler))
}