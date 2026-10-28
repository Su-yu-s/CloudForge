// 预览台用的 react shim：实现 client/index.js 用到的 createElement 与 hooks 占位。
// 之所以要它：client/index.js 里 `import { createElement, useEffect, useState } from 'react'`
// 是 AGH 的写法（react 在 AGH 的 import map 白名单里），预览台没有 import map。
export function useState(initial) {
  return [typeof initial === 'function' ? initial() : initial, () => {}]
}

export function useEffect() {
  /* 预览台只做一次静态挂载；订阅/清理由真实宿主负责。 */
}

export function createElement(tag, props, ...children) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(props ?? {})) {
    if (k === 'ref' && typeof v === 'function') {
      v(node)
    } else if (k === 'className' || k === 'class') {
      node.className = String(v)
    } else if (k === 'style' && typeof v === 'object') {
      Object.assign(node.style, v)
    } else if (k.startsWith('on') && typeof v === 'function') {
      node.addEventListener(k.slice(2).toLowerCase(), v)
    } else if (v !== undefined && v !== null && v !== false) {
      node.setAttribute(k, String(v))
    }
  }
  for (const c of children.flat()) {
    if (c === null || c === undefined || c === false) continue
    node.appendChild(typeof c === 'string' || typeof c === 'number' ? document.createTextNode(String(c)) : c)
  }
  return node
}

export default { createElement, useEffect, useState }