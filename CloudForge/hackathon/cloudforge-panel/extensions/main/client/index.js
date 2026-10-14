// CloudForge 控制台 · 客户端入口（AGH client module）
//
// 槽位选择（踩过坑才定下来的，勿改）：
//   宿主给客户端模块的官方挂载点是 **workbench.panel**——web/src/app.ts:244 把
//   panelContainer 定为 #main-content，web/src/client-modules/boot.ts:160-176 在里面
//   建 <div data-agnes-slot-mount="workbench.panel"> 并渲染 SlotOutlet({hideWhenEmpty:true})。
//   它的声明是 { kind:'list', scope:'session-maybe' }（web-client/src/slots.ts:167-171），
//   所以草稿态（没有活动会话）也会挂载——这正是我们要的，面板不该因为没开会话就消失。
//
//   **不要用 rightbar.session**：那是宿主自有的会话右栏区域（region-slots.ts:796/859），
//   已被内置单元占用（网页实测：rightbar 416px 里只有 [data-agnes-region-unit=rightbar]
//   的"扩展面板/暂无指南"页签），第三方注册进去不会得到渲染；而右栏页签
//   sidebar.right.pane.tab 的 tabId 是封闭联合 'document' | 'guide'（slots.ts:83-92），
//   没有第三方页签入口。
//
// 为什么外壳是 React：AGH 的插槽渲染器把 component 当 React 组件调用
// （web-client/src/outlet.tsx:269 createElement(Comp, props)），返回 DOM 节点会直接报错。
// 所以这里只用 createElement 出**一个容器 div**，整个面板子树命令式构建——
// three.js 需要真实 DOM 节点与 canvas，交给 React 反而更麻烦。
//
// 'react' 是 AGH import map 允许的裸标识符之一（web/public/index.html:18-31）。

import { createElement, useEffect, useState } from 'react'
import { mountPanel } from './panel.js'
import { prefs } from './prefs.js'

const SLOT = 'workbench.panel'
const SLOT_CATALOG = 'dsh-client-slots/v1'

// 折叠开关放在会话头栏的 **corner** 槽（行末右对齐），不是 utilities。
// utilities 排在 lineage/actions 之后、corner 之前，当前面板只占一个槽时，
// 按钮会被顶到行首（实测 x=288），夹在空行里读起来像渲染残留而不是控件。
// corner 是行末，语义上也就是「这一行右侧的操作」。
//
// ⚠ 仍**无法**放到 AGH 那颗按钮的位置：宿主那颗 #sidebar-toggle 在 topbar 里
// （slot: ui:topbar），而 DSH 槽目录里没有任何 topbar.* 可扩展槽，
// 想进去只能去改宿主 DOM，那比位置不理想更脆弱。
const SLOT_HEADER_CORNER = 'conversation.session.header.corner'

let instance = null
let hostNode = null
let applyStartedAt = null

// React 在 ref 身份变化时先调用旧 ref(null)，会销毁并重新加载整个三维面板。
// 用稳定的回调保留 viewer 和数据，宿主的会话状态更新无需重新初始化。
function attachPanel(node) {
  if (node === hostNode) return
  if (instance) {
    try {
      instance.destroy()
    } catch {
      /* 卸载期异常不影响宿主 */
    }
    instance = null
  }
  hostNode = node
  if (node) instance = mountPanel(node, currentCtx, { applyStartedAt })
}

function CloudForgePanel() {
  return createElement('div', {
    className: 'cf-host',
    ref: attachPanel,
  })
}

let currentCtx = null

/** 会话头栏里的折叠开关。
 *
 * 刻意**不复用**宿主 #sidebar-toggle 的样式定义，而是直接挂宿主自己的 `.icon-button` 类
 * （web/public/style.css 已定义：28×28、border-radius 50%、透明底、0.14s 过渡），
 * 这样外观与宿主那颗「收起导航」逐像素一致，也自动跟随宿主明暗主题。
 * 语义照抄宿主模式：aria-label + aria-expanded 随状态翻转（对比 shell.ts:17-19）。
 *
 * 这棵树由宿主的 SlotOutlet 渲染，与面板那棵树不是同一棵，所以状态必须走共享 store
 * （prefs.js）；宿主点按钮 → store → 面板订阅者更新，反之亦然。
 */
function PanelToggle() {
  const [on, setOn] = useState(prefs.rail())
  useEffect(() => prefs.subscribe((next) => setOn(next.rail)), [])
  const label = on ? '展开 CloudForge 控制台' : '收起 CloudForge 控制台'
  return createElement('button', {
    className: 'icon-button cf-toggle-fallback',
    type: 'button',
    'aria-label': label,
    'aria-expanded': String(!on),
    title: label,
    onClick: () => prefs.toggleRail(),
    children: chevron(on),
  })
}

/** 20×20 线性图标，与宿主 sidebar-toggle 的 viewBox 一致；展开态朝左、收起态朝右。
 *  必须用 createElement 造 React 元素：直接把 createElementNS 得到的 DOM 节点塞进
 *  children 会抛 "Objects are not valid as a React child"。 */
function chevron(on) {
  return createElement(
    'svg',
    {
      viewBox: '0 0 20 20',
      width: 16,
      height: 16,
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 1.6,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      'aria-hidden': 'true',
      focusable: 'false',
    },
    createElement('path', { d: on ? 'M12.5 7.5 8 12l4.5 4.5' : 'M7.5 7.5 12 12l-4.5 4.5' }),
  )
}

export function apply(ctx, config) {
  applyStartedAt = globalThis.performance?.now?.() ?? null
  currentCtx = ctx
  void config

  // effect 通道：services.call 只能到 query（web-client/src/client-module.ts:81-89），
  // 写操作必须注册成命令再 execute（client-module.ts:114-130），内部会走
  // POST /api/client-modules/effect，并由宿主用 window.confirm 做授权（web/src/app.ts:240-243）。
  // 命令 id 必须匹配 /^[a-z][a-z0-9.-]{0,127}$/（web-client/src/services.ts:144）。
  const commands = [
    { id: 'cloudforge.detect', title: '重跑检测', service: 'cloudforge.run' },
    { id: 'cloudforge.detect.start', title: '开始检测当前点云', service: 'cloudforge.detect' },
    { id: 'cloudforge.verify.agh', title: '交给 AGH 验证当前模型', service: 'cloudforge.verifyrequest' },
    { id: 'cloudforge.cad', title: '从当前点云生成 CAD', service: 'cloudforge.cad' },
    { id: 'cloudforge.preview', title: '在 FreeCAD / GUI 中打开', service: 'cloudforge.preview' },
    { id: 'cloudforge.export', title: '导出 AGH 执行记录', service: 'cloudforge.export' },
  ]
  const offs = []
  for (const c of commands) {
    try {
      offs.push(ctx.commands.registerEffect(c))
    } catch {
      /* 该服务不在本包白名单时跳过（例如旧宿主） */
    }
  }

  // 面板的 debug 桥要在挂载前也存在，便于从 Console 直接看状态
  window.__CF_PANEL = { ctx, mounted: () => instance }

  let dispose = null
  try {
    dispose = ctx.slots.register({ name: SLOT, id: 'cloudforge-panel', priority: 2 }, CloudForgePanel)
  } catch (e) {
    window.__CF_PANEL = { ctx, error: String((e && e.message) || e) }
    throw e
  }

// 折叠开关另注册到会话头栏的 corner 槽（宿主渲染，样式复用宿主的 .icon-button）。
  // 这个槽是 session 作用域，没有会话时宿主不会渲染它——面板内置那颗折叠按钮
  // 正是为这种草稿态兜底（见 panel.js）。
  let disposeToggle = null
  try {
    disposeToggle = ctx.slots.register(
      { name: SLOT_HEADER_CORNER, id: 'cloudforge-panel-toggle', priority: 2 },
      PanelToggle,
    )
  } catch {
    /* 旧宿主没有这个槽：面板内置的折叠按钮继续生效 */
  }
  window.__CF_PANEL.toggle = () => prefs.toggleRail()
  ctx.effect(() => () => {
    for (const off of offs) off?.()
    disposeToggle?.()
    dispose?.()
    if (instance) {
      try {
        instance.destroy()
      } catch {
        /* 忽略 */
      }
      instance = null
    }
  })
}
