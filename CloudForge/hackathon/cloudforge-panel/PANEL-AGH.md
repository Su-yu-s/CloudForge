# CloudForge 右栏面板 · AGH 集成说明（PANEL-AGH）

> 本文是**实现约束与复现步骤**的权威说明，回答"这个面板在 AGH 里到底怎么跑起来的"。
> 早期设计稿见 [`../PANEL-PLAN.md`](../PANEL-PLAN.md)，其中"AGH 无全屏面板 slot"的结论**已过时**（见 §1）。
> 不依赖 AGH 的离线预览台见 [`tools/`](tools/)。

## 1. 形态：注册 `workbench.panel`，自己做右侧浮动卡片

旧版面板用 `position:fixed` 盖在 `body` 上，会与宿主自己的
`[data-agnes-region="rightbar"]` 浮层卡片（`packages/web/public/style.css:1288-1298`）位置打架。
本版仍是自己做浮层卡片，但**挂载点换成宿主为客户端模块预留的槽**：

```jsonc
// hackathon/cloudforge-panel/extensions/main/agnes.client.json
{ "client": {
  "entry": "./client/index.js",
  "styles": ["./client/index.css"],
  "slots": ["workbench.panel"],                // 只声明真正注册的槽，否则 reconcile 报 unsupported-slot
  "slotCatalogVersion": "dsh-client-slots/v1", // 缺这一项 client-module.ts:174 直接拒
  "services": [ /* 12 个，见 §3 */ ],
  "projections": [] } }
```

| 事实 | 依据 |
|---|---|
| `workbench.panel` 是 `{kind:'list', scope:'session-maybe'}` 的 legacy 客户端模块槽 | `web-client/src/slots.ts:44,167-171` |
| 宿主把 `panelContainer` 定为 `#main-content`，在里面建 `<div data-agnes-slot-mount="workbench.panel">` 并渲染 `SlotOutlet({hideWhenEmpty:true})` | `web/src/app.ts:244`、`web/src/client-modules/boot.ts:160-176` |
| 该挂载点只是普通流容器，**没有任何右栏样式** | 实测：`#main-content` 内一个 `div.cf-host` |
| `session-maybe` ⇒ 草稿态（无活动会话）也会挂载 | 槽声明 |
| **`rightbar.session` 不可用**：它是宿主自有的会话右栏，已被内置单元占用，第三方注册不产生渲染 | `web/src/region-slots.ts:796,859`；实测右栏 416px 内只有 `[data-agnes-region-unit=rightbar]` 的"扩展面板/暂无指南" |
| 右栏页签 `sidebar.right.pane.tab` 的 `tabId` 是封闭联合 `'document' \| 'guide'`，没有第三方页签入口 | `web-client/src/slots.ts:83-92` |
| `slots` 必须 public 且在目录里，否则注册抛错 | `web-client/src/client-module.ts:170-180` |

因为挂载点不给右栏样式，**宽度/定位/高度都由面板 CSS 自己负责**（A1 方案）：
`position:fixed; top:72px; right:16px; width:min(26rem,100vw-2rem);
height:calc(100dvh - 72px - 16px)`，1rem 圆角浮层卡片。
高度用一条 CSS `calc` 解决，**没有 JS 高度链**——写 `element.style` 会被 CSP 拦（见 §6）。

**面板不改宿主宽度、不拖拽、不归零折叠**：宽度就是 `min(26rem, …)` ≈ 416px。
折叠是面板**内部**收成 44px 轨道（`data-rail="1"`）。
注意它会浮在宿主右栏卡片之上（宿主右栏默认只有"暂无指南"）；收成轨道后基本不挡事。

## 2. 组件形态：React 只出一个容器，子树全命令式

AGH 的插槽渲染器把 component 当 React 组件调用
（`web-client/src/outlet.tsx:269 createElement(Comp, props)`），返回 DOM 节点会直接报错。
所以 `client/index.js` 只用 `createElement` 出**一个 `div.cf-host`**，整个面板子树命令式构建——
three.js 需要真实 DOM 节点与 canvas，交给 React 更麻烦。`'react'` 是 AGH import map
放行的 8 个裸标识符之一（`web/public/index.html:18-31`）。

⚠️ **挂载时序陷阱**：`ref` 回调触发时容器**还没插入 DOM**，此时
`node.closest('[data-agnes-region="rightbar"]')` 返回 `null`、`clientHeight` 为 `0`。
高度链必须惰性解析并在挂载后补测（`client/panel.js` 的 `findAside()` + `requestAnimationFrame`）。

高度取值要用 `clientHeight` **减去 padding**（宿主卡片 `padding:1rem`），否则宿主
`overflow:auto` 会多出一截外层滚动条。

## 3. 服务：20 个声明（白名单即通道）

`ctx.agnes.services.call(name, input)` 是浏览器→后端唯一通道，硬约束
（`packages/protocol/gen/ts/extension-service.ts:8`）：

| 约束 | 值 |
|---|---|
| `maxResultBytes` | ≤ 1,048,576 |
| `timeoutMs` | ≤ 30,000 |
| `kind` | 仅 `'query'` \| `'effect'` |
| `outputSchema` | 必填，且**每次调用都校验**（`ext-host/service-invocation.ts:169-170`） |

| 服务 | kind | 用途 |
|---|---|---|
| `cloudforge.report` | query | 工作流 / 交付物 / 套件摘要总览 |
| `cloudforge.pickcloud` | query | 原生文件选择任务启动 |
| `cloudforge.pickstatus` | query | 原生文件选择进度与结果 |
| `cloudforge.cloud` | query | 点云分页（uint16 量化） |
| `cloudforge.cloudmeta` | query | 点云元信息（格式诊断） |
| `cloudforge.scene` | query | 检测结果（形状 / 系数 / 覆盖统计） |
| `cloudforge.mesh` | query | 网格分页；STEP 复用同源 STL，或后台通过 CadQuery / FreeCAD 生成预览 |
| `cloudforge.verify` | query | 兼容旧入口，仅提示使用 AGH 会话验证，不直接执行 CLI |
| `cloudforge.suite` | query | 回归套件 + 鲁棒性网格 |
| `cloudforge.trace` | query | 解析 AGH 事件 JSONL → 执行链（离线摘要/兜底） |
| `cloudforge.run` | effect | 面板调 CLI（写操作） |
| `cloudforge.preview` | effect | 拉起 FreeCAD / CloudForge GUI |
| `cloudforge.export` | effect | 调 AGH 官方 `agnes export` 导出执行记录 |
| `cloudforge.exportstatus` | query | 导出进度（导出是异步的，见 §5） |
| `cloudforge.cad` | effect | 从当前点云启动检测、重建与同源 STEP/STL 交付 |
| `cloudforge.cadstatus` | query | CAD 生成阶段、结果路径与错误 |
| `cloudforge.detect` | effect | 点云页直接启动当前文件的本地检测 |
| `cloudforge.detectstatus` | query | 点云检测阶段、结果目录与错误 |
| `cloudforge.verifyrequest` | effect | 固定当前文件、参考和阈值，准备 AGH 验证请求 |
| `cloudforge.verifystatus` | query | 当前请求的状态、核验范围和实际工具结果 |

浏览器侧还要过 `agnes.client.json` 的 `services` 白名单，少一个就抛
`client service is unavailable`（`client-module.ts:83-84`）。

### 传输预算（为什么是 65,536 点/批）

base64 要 ×4/3，于是：

```
uint16 量化 xyz = 6 B/点 → 65,536 点 = 393,216 B → base64 524,288 字符 ≈ 512 KB ✓
196,133 点（livingroom）→ 3 批（65536 + 65536 + 65061）
三角汤 9 分量/面 = 18 B/面 → 65,536 面 = 1,179,648 B → base64 超限，故 mesh 同样按 65,536 面分页
```

量化精度：`span/65535`。livingroom span 3.4075 m → **0.052 mm**，远细于 `robust_sigma`（mm 级）。

## 4. 写操作：effect 必须注册成命令

`services.call` 只能到 query。写操作走命令系统（`client-module.ts:114-130`）：

```js
ctx.commands.registerEffect({ id: 'cloudforge.detect', title: '重跑检测', service: 'cloudforge.run' })
await ctx.commands.execute('cloudforge.detect', { op: 'detect', args: [...] })
  // → executeOwned → authorize → window.confirm → POST /api/client-modules/effect
```

- 命令 id 必须匹配 `/^[a-z][a-z0-9.-]{0,127}$/`（`web-client/src/services.ts:144`）
- **授权是浏览器原生 `window.confirm`**，固定文案（`web/src/app.ts:240-243`）：
  `是否允许插件 … 执行命令"重跑检测"（服务：cloudforge.run）？`
- `executeOwned` 是 owner-scoped，只能执行本 row 注册的命令

## 5. turn-end 自动刷新

AGH **没有**自定义事件总线。实时链路是
`ctx.session.projection.subscribe()` + `projection.read().opState`，`opState` 由非 null 回 null 即一轮结束
（`web-client/src/services.ts:246-299`）。`client/data.js` 的 `onTurnEnd()` 实现了这个判据。

导出 AGH 执行记录走**官方命令**，不自研格式：

```
agnes export <sessionId> --raw -o <file>       # JSONL，与 hackathon/evidence/*.json 同格式
agnes export <sessionId> --html --raw -o <f>   # 自包含 HTML
```

因服务超时上限 30s 而整轮 export 可能更久，`cloudforge.export` 采用**启动即返回 + query 轮询**
两段式（`job` id → `cloudforge.exportstatus`）。默认加 `--raw`：参赛证据要保留
`toolUseId` / 审批策略等原始字段，脱敏后无法核查。

## 6. 资产与 CSP 约束

| 约束 | 后果 | 对策 |
|---|---|---|
| `script-src 'self'`（无 `unsafe-inline`） | 不能写 `<style>` / `eval` | CSS 走 descriptor `styles`（同源 `<link>`） |
| `style-src 'self' 'nonce-…'`——**只有 index.html 带 nonce**，`/plugins/*` 是裸 `'self'`（`web-server/src/server.ts:291/611`） | `element.style.x=`、`cssText`、`setAttribute('style')` 全被浏览器拦，每处刷一条 console error（实测首屏 87 条） | 离散值 → class / `data-*`；连续宽度 → `<progress>` 的 `value`/`max` **属性**。`el()` 遇到 `style:` 直接 throw，免得静默违规 |
| `script-src` 无 `'wasm-unsafe-eval'` | 不能用 Draco / Basis / OCCT.js | PLY/PCD/STL 自己在 Node 端解 |
| `/plugins` 只服务 `.js/.mjs/.css/.map` | 拿不到 `.wasm` / `.glb` / 图片 | 三维数据走后端服务（base64 + 分页） |
| 单文件 ≤ 4 MiB，整包 ≤ 16 MiB | 快照能收下，但**发不出来** | 见下一行 |
| **每个 client 资源的 RPC 结果 JSON ≤ 1 MiB**（`packages/protocol/src/package-admin.ts:605` 的 `inspectJsonData(value, 1048576)`），base64 又涨 4/3 | 原始字节必须 ≲ 780 KB。`three.core.js` 1,403,455 B → base64 1,871,272 B，daemon 抛 `RESULT_INVALID: expected bounded strict JSON data`，web 层统一变成**一个光秃秃的 404**（同目录其它文件全 200，极难定位） | esbuild 压到 381,420 B（base64 508,560 B，占预算 49%）。压缩只换内容、**不改文件名**，因为 `three.module.js` 里是 `from './three.core.js'` |
| 资产快照**硬过滤**只收以 `.` 开头的相对引用（`daemon/src/packages/client-modules.ts:780`） | 裸 `three` 不会被收集 → 浏览器白屏 | 两个 addon 的 `from 'three'` 改成 `from '../../three.module.js'` |
| import map 只放行 8 个裸标识符 | 不能 `import * as THREE from 'three'` | 同上 |

three 副本落在 `client/vendor/`，**已 minify**（`three.core.js` 381 KB + `three.module.js` 341 KB +
`OrbitControls.js` 38 KB），随包分发，MIT 许可头保留在文件头，披露见 [`../declaration.md`](../declaration.md)。
重新压缩：

```powershell
esbuild client\vendor\three.core.js   --minify --format=esm --target=es2022 --outfile=three.core.min.js
esbuild client\vendor\three.module.js --minify --format=esm --target=es2022 --outfile=three.module.min.js
# 然后覆盖回原文件名（import 说明符写死了 './three.core.js'）
```

## 7. 视觉与交互契约（对齐 `src/viewer.ts`）

| 项 | 值 |
|---|---|
| 底云 / 检测底云 / remaining | `0x56606e` / `0xb2b8c2` / `0x808996` |
| 形状色 | `PALETTE[i % 7]` |
| 选中 | alpha 1.0 · size 4 · `depthTest=false` · `renderOrder=900`；未选 alpha 0.18 |
| 绘制顺序 | 底云 0 → 形状 2+i → remaining 1000 → 叠加网格 500+i |
| 取景 | center=质心 · `distance=span*1.5` · `near=span*0.001` · `far=span*20` |
| 缩放夹取 | `[span*0.1, span*30]` |
| 降采样 | >850,000 点抽稀到 ~750,000 |
| 坐标系 | Z-up（PLY/PCD 保留原采集坐标系 `centered=false`），`camera.up=(0,0,1)` |

内点着色**不额外请求** `indices/shape_k.txt`（38 个形状要 38 次调用），而按几何距离就地筛：
`|n·p+d| ≤ 2.5·robust_sigma`（平面）、`|到轴距 − r| ≤ 2.5σ`（圆柱），与 RANSAC 自身判据同源。
实测校验：livingroom shape_1 距离筛得 43,276 点，真实 `inlier_count` 43,558（吻合 99.3%）。

几何网格叠加的尺寸来源与 `hackathon/cli/main.cpp` 的 `cad` 子命令一致
（平面 `t = max(0.005, 2·rmse)`、圆柱沿轴投影 `[tmin,tmax]`、圆锥 `k=tan(halfAngle)`），
否则 CAD 页与 STEP 交付物对不上。Torus 用包围盒线框 + "近似"标注（CLI 的 `cad` 也不导出该类型）。

## 8. 已知实现陷阱（都是本次实际踩过的）

| # | 陷阱 | 后果 | 修法 |
|---|---|---|---|
| 1 | 分页终止条件拿**块数**和**点数**比 | 无限翻页 | 用已载入**点数**：`loadedPoints >= page.total` |
| 2 | `splitInliers` 把**下标**当坐标塞进数组，且长度不能被 3 整除 | `BufferAttribute.count` 变小数 → three 越界读 `undefined` → NaN 半径，连报 27 次 | 收集 xyz 三元组；`toPoints` 再加一道 3 整除防御 |
| 3 | `parseStl` 把 `count` 设成**面数** | `boundsOf` 只扫 1/3 顶点 → 包围盒 Z 长 0.2056 m 只解出 0.1126 m，网格被量化截断 | `count` 用顶点数，面数另存 `faces` |
| 4 | `encodePage` 写死**每项 3 个分量** | 网格每面 9 分量只编码 1/3 顶点，三角汤残缺 | 加 `compsPerItem` 参数（点云 3 / 三角面 9） |
| 5 | `MeshPart.meshFromShape` 在复合体上退化 | STEP 形状 Z 长 0.2056 m，网格只有 0.0106 m，**预览缺一截却看不出来** | 改用 `Shape.tessellate()` 自己写二进制 STL，并输出 `coverage_error` 自检 |
| 6 | freecadcmd 脚本写 `if __name__ == "__main__"` 守卫 | 守卫不成立 → 脚本体不执行 → STEP 被当待打开文档，报 `File does not exist` | 顶层直接执行（同 `freecad-verify.py`） |
| 7 | freecadcmd 在 JSON 后追加上千行进度条 | `indexOf('{') + JSON.parse` 失败 | `lib/jsonout.mjs` 括号配平提取（正确跳过字符串与转义） |
| 8 | 产物 kind 正则 `/\.st[ep]$/` | 匹配不到 `.step`，STEP 全被标成 `report`，CAD 页看不到 STEP 卡 | `/\.(step\|stp)$/` |
| 9 | `result.json` **没有** `elapsed_ms`（只在 CLI stdout） | 面板耗时恒 `—` | `cloudforge.run` 落 `run.meta.json` 补齐 |
| 10 | 工作流只给布尔 `truth` | 客户端拼路径拼不对，verify 永远跑不起来 | 后端直接下发解析好的 `truthPath` |
| 11 | 场景无灯光 | Lambert 材质网格全黑 | `createStage` 里加 Ambient + 两盏 Directional |
| 12 | 叠加网格 38 个面同时半透明 | 点云被彻底盖住 | 未选中 opacity 0.06、选中 0.34；检测模式底云提到 0.45 |
| 13 | 注册到 `rightbar.session` | 面板**完全不出现**：宿主右栏 416px 里只有内置的"扩展面板/暂无指南"页签，第三方注册不产生渲染 | 改注册 `workbench.panel`（见 §1） |
| 14 | 直接 vendor 未压缩的 `three.core.js`（1,403,455 B） | 视口全白、只有 `three.core.js` 一个 404，其余资源 200 | 每个 client 资源 base64 后必须 ≤ 1 MiB，压缩后 381,420 B（见 §6） |
| 15 | 用 `element.style` / `setAttribute('style')` 传动态样式 | CSP 拦掉，每次一条 console error（首屏刷 87 条） | 离散值走 class/data-*，连续宽度走 `<progress>` 的 `value`/`max`（见 §6） |
| 16 | `source_cloud` 缺失时只给兜底选择器、不自动载入 | 面板打开是**空白视口**（0 draw call），而头部仍显示"196,133 点"，极具误导性 | 自动取最近候选并保留选择器；标签同时显示实际载入点数与检测输入点数 |
| 17 | `~/.agh` 的 ACL 被沙箱工具写入 `SU\CodexSandboxUsers` | daemon 报 `The credential store is unavailable`，浏览器侧 `config.get` 返 `SEMANTIC_REJECTED (-32011)`，工作区/模型/右栏全空 | `icacls "%USERPROFILE%\.agh" /remove:g SU\CodexSandboxUsers` 后重启 AGH |
| 18 | 用 PowerShell 的 `Get-Content`/`Set-Content` 改源码 | 它按 ANSI 读，UTF-8 中文被写成乱码（`收起` → `鏀惰捣`），且 `git checkout` 也救不回来 | 改文件一律用编辑工具；改完用 esbuild 解析一遍确认没坏 |
| 19 | 拖拽把手 `left:-4px` 放在 `overflow:hidden` 的面板里 | 外伸部分被裁掉，实际可命中区只剩一半 | 改成 `-4px` 起、`12px` 宽，落在面板内的条约 8px |
| 20 | 拖拽方向写成 `step + (当前x - 起点x)/48` | 往左拖得负值被 `clampStep` 夹在 0，表现为「拖不动」 | 位移取 `(起点x - 当前x)` 才是正数 |

## 9. 复现步骤

工具都在**本仓库** [`../agh-scripts/`](../agh-scripts/)，不依赖 agnes-harness 仓库的目录结构：
它们按 `AGH_ROOT`（或本仓库同级的 `../agnes-harness`）找到 AGH，再**动态 import** 官方 SDK。
上游仓库是 `AgnesAI-Labs/agnes-harness`，只读、不改。

```powershell
# 0) 若报 credential store is unavailable / SEMANTIC_REJECTED(-32011)：先修 ACL 再继续
icacls "$env:USERPROFILE\.agh" /remove:g SU\CodexSandboxUsers

# 0.5) 告诉脚本 AGH 在哪（若它不在本仓库同级目录才需要）
$env:AGH_ROOT = "E:/C++/Point/agnes-harness"

# 1) 装面板（CWD 必须是 CloudForge 仓库根：`file:` 源只接受 file:./ 相对路径）
cd E:\C++\Point\CloudForge
& E:\C++\Point\agnes-harness\node_modules\.bin\tsx.cmd hackathon\agh-scripts\install-package.mts "file:./hackathon/cloudforge-panel" "cloudforge-panel"

# 2) 名册自检：确认 entryUrl / slots / slotCatalogVersion 都在
& E:\C++\Point\agnes-harness\node_modules\.bin\tsx.cmd hackathon\agh-scripts\probe-roster.mts

# 3) 浏览器：硬刷新（Ctrl+Shift+R）后打开一个会话，右侧停靠列即出现控制台
#    再用另两个探针自检：
#      hackathon\agh-scripts\probe-roster.mts               # 名册：entryUrl / slots
#      hackathon\agh-scripts\probe-assets.mts <integrity>   # 逐资源：1 MiB 预算那关只有它看得见
#      hackathon\agh-scripts\probe-workspace.mts            # 工作区/profile/模型

# 4) 不依赖 AGH 的离线预览台（改前端时用，免去会话/工作区前置条件）
node hackathon/cloudforge-panel/tools/preview.mjs --port 5199
```

## 10. 离线预览台

`hackathon/cloudforge-panel/tools/preview.mjs` 起一个静态服务，加载**真实**的
`extensions/main/client/index.js` 与真实后端 handler，只做两处替换：

- `react` → 20 行的 `createElement` shim（`tools/react-shim.mjs`）
- `services.call` → 同源 `fetch('/svc/<name>')`，并**复刻 AGH 的 1 MiB 响应校验**

页面右侧用与真机同一套停靠列 CSS（`#main-content` 让位 + 绝对定位列 + `data-w` 分档），
所以宽度/折叠行为与真机一致。左侧诊断面板实时显示 `apply` 结果、槽注册、服务调用与 phase，
便于快速定位问题。

注意：预览台用的是普通浏览器 profile，而 AGH 右栏槽要求**活动会话 + 已信任工作区**。
用自动化浏览器打开 4177 时若报 `SEMANTIC_REJECTED (-32011)`，那是
`WORKSPACE_INVALID / not-found`（`local-dev` 的 `policy.workspacePackages: require-project-trust`
需要先信任工作区），与面板无关；在已配置好的工作台浏览器里打开即可。

## 11. Windows 原生文件选择

点云与 CAD 页签共用 `client/pick.js`。点击后立即显示“打开中…”，后台通过
`cloudforge.pickcloud` 返回选择任务 ID，再由 `cloudforge.pickstatus` 报告状态：
`starting` 表示正在准备窗口，`pending` 表示窗口进入选择流程，最终返回选中文件、取消或错误。
首次状态查询不等待定时器，开始两秒每 200 ms 查询，随后每 800 ms 查询；取消与失败都会恢复按钮。

Windows 默认使用独立的 `cloudforge-picker.exe`，不加载点云检测核心库。
在项目根目录构建：

```powershell
cmake -S hackathon/cli -B hackathon/cli/build -G "Visual Studio 17 2022" -A x64
cmake --build hackathon/cli/build --config Release --target cloudforge-picker --parallel 4
```

程序位置按项目根目录解析为 `hackathon/cli/build/Release/cloudforge-picker.exe`。
插件加载以及面板打开/刷新读取总览时，提前启动 STA helper，创建并配置
`IFileOpenDialog`，分别保留点云和 CAD 选择器；准备过程不调用 `Show`，不显示或激活窗口。
实际点击才发送 stdin JSON 请求并显示对应选择器，避免每次重新启动 PowerShell、加载
Windows Forms 和创建 COM 选择器。未构建原生程序时回退到原 PowerShell 选择器。
helper 初始化失败不会阻断面板加载，点击选择仍可重新启动；初始化超过 15 秒会回收。

就绪 helper 可空闲保留 15 分钟，打开/刷新面板时续期；以一个进程的内存换取点击响应，
空闲期间不轮询、不自动重启，也不会在选择过程中因续期而启动第二个进程或回收活动窗口。
文件选择框使用位于当前屏幕的置顶 owner，只有明确点击后才显示。
原生程序通过窗口可见状态报告 `pending`，不会更改浏览器或系统的全局窗口设置。
下次选择默认使用最近一次选择的本地目录，初次使用项目目录；目录准备不在点击路径上重复执行。
客户端将普通读取限制为一个在途请求，选择开始和状态查询优先于未发送的普通读取。
选择期间暂停队列中的点云/网格分页和后台查询，结束或失败后恢复；取消的旧分页不会再发送。
AGH 原有服务白名单、完整性与信任校验继续执行。
插件卸载时结束 helper 和活动对话框，父进程退出也执行清理。
未预加载完成或超过闲置保留期时，点击仍需等待初始化；页面不会在窗口准备完成前声称“已弹出”。

## 12. 面板首屏与展开性能

`client/index.js` 使用稳定的 React ref，宿主会话状态更新不会销毁并重新挂载整个
面板。页签数据按当前可见页加载，隐藏页在切换时再刷新；手动刷新和回合结束仍
重新读取当前产物。折叠时暂停三维视图，展开复用已有 viewer。

点云按页到货后显示首批坐标，不等待完整点云和所有几何内点计算。
完整载荷的几何距离筛选分时间片执行，并丢弃已取消或过期的刷新结果，
保持原有筛选阈值与坐标精度。CAD、验证与轨迹请求不再占用点云首屏的加载链路。

客户端修改后，在 CloudForge 仓库根执行：

```powershell
node hackathon/cloudforge-panel/tools/build-client.mjs
```

安装包的客户端入口为 `client/bundle/index.js`：轻量外壳及小依赖合并，页签使用
相对动态 chunks，三维库不阻塞外壳挂载。所有输出仍由 AGH 递归快照及校验。
单个 chunk 的原始内容限制为 750 KiB，为 base64 与 JSON 留出传输余量。
构建依赖沿用 CloudForge 前端安装的 esbuild；生成文件随插件一起更新。

## 13. 点云生成 CAD 与内嵌预览

生成入口需要先编译 C++ CLI。在项目根目录执行：

```powershell
cmake -S hackathon/cli -B hackathon/cli/build -G "Visual Studio 17 2022" -A x64
cmake --build hackathon/cli/build --config Release --target cloudforge-cli --parallel 4
```

Windows 默认路径为 `hackathon/cli/build/Release/cloudforge-cli.exe`，也可通过
`CLOUDFORGE_CLI` 显式指定。仅有 `src-tauri/cpp/build` 的核心库产物不能替代 CLI。
本机所用 RANSAC 库没有 `Options.m_randomSeed` 字段，核心源码保留已有的 `std::srand`
设置随机种子，并移除对不存在字段的重复赋值，以便兼容此库构建。

CAD 页提供“从当前点云生成 CAD”。输入使用点云页当前选择的 PLY/PCD 和场景预设，
生成服务通过 effect 命令启动，继续使用 AGH 原有授权通道。任务立即返回 ID，
`cloudforge.cadstatus` 串行轮询检测、重建、导出的当前阶段，长计算不占用 30 秒服务响应窗口。
切页或折叠暂停浏览器轮询，后台继续生成；卸载插件结束其活动子进程。

每次交付写入 `outputs/cad-<时间>-<任务ID>/`。仅复用有匹配源文件身份和点数的检测结果；
否则对实际选中的点云重新检测。PLY/PCD 按属性表解析，并标准化为不居中、不重排的 XYZ PLY，
让内点索引与建模输入保持对应。以平面为主且含水平面的检测采用墙体、地板、顶棚骨架路线，
其余采用 CLI 的参数化几何实体路线。此流程重建检测到的结构，页面说明模型范围。

同一个 CadQuery 模型同时导出 `model.step` 和米制预览 `model.stl`，并记录
`cad.manifest.json`、STL 元信息和源文件身份。导出检查空实体、无效几何、非有限坐标、
源点云跨度与 CAD 尺寸及网格覆盖。机械路线只执行本次 CLI 新生成模板的建模部分，
历史脚本的导出尾段不执行。

建模坐标按点云的米制保存，STEP 导出时转换为毫米数值，匹配 CadQuery 默认的
毫米单位声明，使外部 CAD 软件读取正确物理尺寸。预览网格保持米制，可直接与点云叠加。
已有普通 STEP 导入后从毫米换算为米；明确关联的旧 CloudForge 产物使用历史坐标比例，
相同比例写入缓存身份，避免错误复用。

打开 CAD 页自动加载当前工作流最近的关联交付物，生成完成自动显示新模型。
生成期间切换了点云或工作流时，结果提供“查看生成结果”入口，保留用户当前选择。
网格和叠加点云的晚回调会被取消或忽略；同文件重载保留视角，换文件首次取景。

已有 STEP 优先复用身份匹配的同源 STL；缺少网格时通过 `cad-preview.py` 用本机 CadQuery
导入 STEP，FreeCAD 作为可用的回退内核。后台转换返回 pending 状态，浏览器继续查询，
完成后再分页读取网格。缓存按 STEP 身份和网格偏差分别记录，多个 STEP 不共享 `preview.stl`。
FreeCAD 外部打开与独立校验仍保留。运行依赖是已安装 CadQuery 的 Python 环境，
建筑骨架还需 NumPy/SciPy；可通过 `CLOUDFORGE_PYTHON` 指定解释器。

默认优先使用项目内 `.venv-cad`，该目录忽略提交。准备环境时执行：

```powershell
python -m venv .venv-cad
.venv-cad/Scripts/python.exe -m pip install -r hackathon/tools/requirements-cad.txt
```

环境安装由项目维护者执行，运行时缺少依赖会明确报错，生成入口不自动安装软件。

客户端改动需运行 §12 的打包命令，并连同服务声明更新插件。

## 14. 桌面 GUI 预览与可复现路径

“GUI 预览”打开 CloudForge 桌面窗口。STEP/STP 先使用身份匹配的同源 STL，
再交给桌面程序。STL 使用专门的三角网格入口，保留完整面片、原坐标与单位，
不通过点云加载器去重成稀疏顶点。支持二进制和 ASCII STL，文件最大 128 MiB、
100 万三角面；非法、截断或非有限坐标会明确报错。

桌面自动进入 CAD 预览：实体表面使用光照和轮廓线，可切换线框，初次载入自动全景。
滚轮缩放、左键旋转、右键/中键平移后保留视角，“回到全景”恢复完整模型。
侧栏显示三角面数量，隐藏点云 AI 识别与精拟合控件。点云文件继续原加载与识别流程。

准备桌面程序时，在项目根目录执行生产构建：

```powershell
npm run tauri build -- --no-bundle
```

默认查找 `src-tauri/target/release/cloudforge.exe`。源码中的脚本、`.venv-cad`、CLI 和
桌面程序均按项目根目录定位，不含开发者个人盘符路径。`CLOUDFORGE_EXE`、
`CLOUDFORGE_PYTHON`、`CLOUDFORGE_CLI` 可以指定自定义位置，相对路径按项目根目录解析。
运行时将文件路径解析为完整路径后传给窗口，避免原生进程工作目录改变导致找不到文件。

GUI 启动使用项目 Python 环境执行脚本，启动器通过固定 PowerShell 程序和 stdin JSON
传输路径，设置程序工作目录，并只检查本次返回的进程 ID。找不到程序、输入格式不支持或
启动进程退出时返回明确错误，不能借用已有同名进程声称打开成功。

## 15. 点云页开始检测

选择点云后，点击“开始检测”直接调用本地 CloudForge CLI。场景下拉框决定
`outdoor` 或 `mechanical` 预设，调用继续通过 AGH effect 命令授权通道，
命令 ID 为 `cloudforge.detect.start`。此操作不发起模型会话，也不自动导出 CAD。
原“检测”显示模式改名为“检测结果”，与启动动作区分。

`cloudforge.detect` 立即返回任务 ID，`cloudforge.detectstatus` 串行读取进度。
每次输出单独的 `outputs/detect-<时间>-<任务ID>/`，保存检测结果、内点索引与
`run.meta.json`。状态为 `pending/ready/failed`，只将 ready 结果加入工作流列表。
源点云引用按任务目录保存为相对路径，RPC 根据项目目录解析完整路径。

检测输入标准化为保序、未居中的有限 XYZ 坐标，CLI 使用 `--preserve-points` 跳过
默认去重与大文件降采样，保证内点索引对应预览中的点。既有 CLI 调用不带该参数时
继续原预处理。检测和 CAD 重建共享这一保序输入约定，修改 CLI 后需重新构建 §13 的产物。

检测完成后，页面采用对应的工作流、更新覆盖率和基元清单，保持同一源文件的视角。
期间换了点云、工作流或场景时，保留当前选择，并提供“查看检测结果”。隐藏点云页暂停
进度查询，重新显示后恢复；卸载插件中止其活动子进程。超时和查询失败明确显示原因，
可重新开始或恢复查询。选中尚未检测的新文件时，顶栏和页脚显示实际点数及待检测状态，
不继续展示上一文件的基元统计。

## 16. 当前模型验证由 AGH 组织与执行

按[参赛指南的技术和提交要求](https://agnes-ai.feishu.cn/wiki/QNK6wKOD7ifkxHkJxoycb1MXnwl)，
AGH 应参与核心多步任务和外部工具调用，并保留可核查的实际执行记录。
验证页使用当前 AGH 会话完成读取输入、调用工具、解释结果和报告回写的闭环。

先选择点云并完成其检测，再在验证页设置参数容差（默认 5 mm）与角度容差（默认 2°）。
有真值时使用“选择真值 JSON”，参考应对应当前点云并采用相同坐标系、米单位和
CLI 的 `shapes` 格式；源文件身份或明确源引用必须匹配。仅具有匹配点数的用户参考
会被标明为用户选定，不能声称已独立证明参考来源。清除参考后可做基础核验。

“让 AGH 验证当前模型”先通过 `cloudforge.verifyrequest` effect 准备
`outputs/verify-<时间>-<任务ID>/request.json`，随后提交给当前会话。会话忙时加入下一轮；
空闲时等待 AGH 工具真正启动。AGH 应读取请求、调用正式工具 `cloudforge_verify_current`，
再读取报告、解释缺失项或失败项，不允许更换成其他点云或合成示例。

工具通过 AGH `ToolContext.exec` 执行 CLI 元信息读取、可用真值的实际 `verify`，以及
项目 Python 环境中的 CAD 检查。基础检查包括有限坐标、原点序索引、统计一致性、
拟合残差和明确同源 CAD 的实体有效性、单位、体积及包围盒范围。
缺少真值时 `precisionVerified=false`，结论为部分核验或已发现问题的 FAIL；不能显示真实精度 PASS。
CAD 实体和范围核验不能替代 CAD 全表面对点云距离测量，也不代表真实尺寸精度认证。

实际执行后写入同一任务目录的 `status.json`、`verify.json`、`verify-report.md`。
回执记录真实 AGH 会话与工具调用标识；完整可审计轨迹仍由 AGH 宿主保存，报告不伪造 trace。
请求绑定会话、源文件、检测结果、同源 CAD、真值、场景及阈值；输入变化会使旧结果失效。
页面重载从后台恢复匹配任务，切换模型不会显示其他任务的结果。历史回归与鲁棒性网格
折叠显示，并明确不代表当前模型验证通过。

复现时在项目根构建 CLI（§13）、准备 CAD Python 环境（§12），构建面板客户端后安装或更新
`hackathon/cloudforge-tools` 与 `hackathon/cloudforge-panel` 两个 AGH 包。
已有工具包可用 `hackathon/agh-scripts/update-cloudforge-tools.mts` 保留安装记录并更新。
在 AGH 选择实际使用的模型和 CloudForge 工作区，保留原有工具审批与工作区权限策略。
提交材料应记录实际模型名称、版本、用途、调用方式，并导出对应会话的真实 AGH 执行记录，
把任务目录中的请求、结果和报告一起归档。路径默认从项目根解析。

以下是用户复现步骤及预期行为，**本次实现没有执行这些案例或生成运行证据**：

| 情况 | 操作 | 应观察的真实行为 |
| --- | --- | --- |
| 正常 | 检测当前点云，选匹配真值，交给 AGH 验证 | AGH 工具调用与 CLI `verify` 有实际轨迹；按实际误差显示 PASS/FAIL |
| 边界 | 不选真值，交给 AGH 验证 | 基础模型检查可执行，但真实精度未验证，不显示整体精度 PASS |
| 失败 | 选另一份点云的真值，或请求准备后改变源文件 | 明确拒绝不匹配参考或标记结果失效，不验证其他示例 |
| 环境缺失 | CLI 或 CAD Python 依赖不可用 | 报告实际依赖错误/缺失检查，AGH 解释后可继续交互 |

录制演示时执行这些真实操作，并展示会话工具轨迹与结果的对应关系；不要将历史测试
或预期行为填成新一次执行的成功记录。

## 17. 新对话首次选择文件

AGH 的新对话起初是草稿，选择工作区与模型并不等于已经建立活动会话。
工作台的 `workbench.panel` 支持草稿挂载，但后端 query/effect 仍要求活动会话。
因此无会话时只显示待选择提示，不主动查询工作区报告。

用户点击“选择点云”或“选择 CAD”时，共享选择流程先调用宿主
`ctx.session.ensureActive()`，由宿主使用当前选定的工作区建立并挂接空会话，
同步当前模型及权限选择，然后打开原生文件对话框。此步骤不发送模型 prompt。
后台读取不会调用此入口，也不会悄悄创建任务。没有可用工作区或创建失败时显示具体原因，
保留用户草稿，允许重试；同一次创建过程复用请求，避免重复会话。

会话挂接后继续使用原有服务白名单、工作区信任与 effect 授权通道。
旧宿主没有此可选接口时，面板提示先在 AGH 中发送第一条消息建立会话。
