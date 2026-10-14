# 面板卡在“连接中…”——根因与修复

> **历史记录，保留原样。** 下文命令里的 `agnes-harness/scripts-tmp/cf-panel-*.mjs` 是当时
> 为复现这个 bug 临时写的两个无头复现脚本，只存在于本机框架仓库里、未随作品提供，
> 也未随之后的重构保留。**日常安装与自检请用 [`../agh-scripts/`](../agh-scripts/)**
> （`install-package.mts` / `probe-roster.mts` / `probe-assets.mts` / `probe-workspace.mts`），
> 它们按 `AGH_ROOT` 自定位框架仓库，无需复制。当前形态与复现步骤见
> [`PANEL-AGH.md`](PANEL-AGH.md)。

## 一句话根因
`mount()` 收尾调用的 `applyCollapsed()` 里，`root.querySelector('.cf-head-main')` 取到 `null`，接着读 `.style` 抛 `TypeError`。异常沿 `applyCollapsed → mount → start → apply` 一路冒泡：面板 DOM 在抛错前已经 `appendChild` 到 `body`（所以看得见、收展按钮也在），但 `renderData(root, {})` 和 `setInterval(tick, 8000)` 全都没执行到。于是数据区永远是 `mount()` 里写死的“连接中…”那一行。

## 判断依据

**1. 代码层面：`.cf-head-main` 只被读、从未被写**
全仓 `grep cf-head-main` 只有一处（`client/index.js` 的 `applyCollapsed`）。`mount()` 里那个标题 div 是用 `head.appendChild(h('div', ...))` 直接建的，全程没给它 `className`。选择器必然落空。

**2. 无头复现，六条现象逐条对上**
脚本 `agnes-harness/scripts-tmp/cf-panel-repro.mjs` 用 happy-dom 复刻了 `web-client/src/client-module.ts` 注入的 `ctx` 形状（注入 `slots/agnes/commands/session` 后调用 `mod.apply(ctx, config)`，`ctx.agnes.services.call` 已就绪）。对修复前版本输出：

| 观测项 | 值 | 对应现象 |
|---|---|---|
| applyError | `TypeError: Cannot read properties of null (reading 'style')` at `applyCollapsed:41` ← `mount:197` | 异常真身 |
| panelMounted | `true` | 面板本体在 |
| bodyTextAfterApply | `连接中…` | 数据区卡住 |
| serviceBridgeSet | `true` | `window.__CF_SERVICE` 有值 → 手动 call 能成功 |
| setIntervalCalls | `[]` | `tick` 从未注册 |
| serviceCalls | `[]` | 轮询从未真正发生 |

所以“既不是刷新失败、也不是数据”完全自洽：`tick` 压根没跑，`catch` 里的“刷新失败:…”逻辑没有任何机会执行。

**3. 排除“AGH 模块子系统 fail-closed idle”这条最强怀疑**
`packages/web-client/src/client-module.ts:52-146` 里 `apply` 是正常被调用的（`inject` 完 `slots/agnes/commands/session/theme/locale` 后执行 `return mod.apply(ctx as ClientContext, config)`），`ctx.agnes.services` 的门面也已冻结就绪。反证：若无此链路，`window.__CF_SERVICE` 不会存在、手动 `call('cloudforge.report')` 不可能成功。面板能被 `mount` 出来本身也说明模块已加载、`apply` 已执行。**面板链路是通的，断点在自己代码里的这一行空指针。**

## 顺带发现：`__CF_DEBUG` 其实一直不存在
仓库、`~/.agh/data/profiles/local-dev/packages/`、`~/.agh/data/daemon/client-modules/…/sha256-7d0a…/` 三份副本逐字节相同，**都没有 `__CF_DEBUG`**。也就是说之前在 Console 里敲 `window.__CF_DEBUG.tick()` 只会得到 `undefined` 报错——这条假失败反而掩盖了真问题。本次已把钩子正式写进代码。

另外，`agnes.client.json` 的 `services` 只声明了 `cloudforge.report`。`client-module.ts:83-84` 会校验 `config.services.includes(name)`，所以两个“打开/预览”按钮走的 `cloudforge.preview` 会被门面直接拦成 `client service is unavailable`——一并补上。

## 修改文件

**1. `hackathon/cloudforge-panel/extensions/main/client/index.js`**
- `mount()`：标题 div 补 `className = 'cf-head-main'`（补上缺失的选择器锚点）。
- `mount()`：已存在 `#cf-console` 时 `return existing`（原来裸 `return` 返回 `undefined`，会让 `renderData(undefined, {})` 再抛一次）。
- `applyCollapsed()`：入口判空 + 三处查询都加存在性判断，任何节点缺失都不再抛。
- `start()`：新增 `window.__CF_DEBUG = { root, mount, renderData, tick, state }`；首次 `renderData` 包 `try/catch`，出错直接显形到面板而不是静默。

**2. `hackathon/cloudforge-panel/extensions/main/agnes.client.json`**
- `services` 增加 `"cloudforge.preview"`。

## 验证步骤

**A. 无头回归（已跑通）**
```bash
cd E:/C++/Point/agnes-harness
node scripts-tmp/cf-panel-repro.mjs        "E:/C++/Point/CloudForge/hackathon/cloudforge-panel/extensions/main/client/index.js"
node scripts-tmp/cf-panel-verify-debug.mjs "E:/C++/Point/CloudForge/hackathon/cloudforge-panel/extensions/main/client/index.js"
```
期望：`applyError=null`、`setIntervalCalls=[8000]`、`workflowRendered=true`、三段标题（工作流/验证/交付物）都在；收展在 `320px ↔ 40px` 之间切换且 `headMain` 显示/隐藏正确；`__CF_DEBUG` 的 `tick/renderData/root/state` 齐全，`renderData(undefined)` 不抛。

**B. 装回 AGH（需 daemon 在跑）**
```bash
# 注意：file: 引用按当前目录解析，CWD 必须是 CloudForge 仓库根
cd E:/C++/Point/CloudForge
pnpm exec tsx E:/C++/Point/agnes-harness/scripts-tmp/install-package.mts file:./hackathon/cloudforge-panel cloudforge-panel
```
安装脚本会走 inspect → install → trust → enable，并按内容哈希重算 `sha256-<rev>` 目录与 `_client-modules.json` 注册表——**只改仓库文件、不重装，浏览器拿到的还是旧 sha 副本，不会生效。**

**C. 浏览器端确认**
1. 重启 AGH web（4177）→ 硬刷新（Ctrl+Shift+R）。
2. 数据区应出现“工作流 / 验证 / 交付物”三段，工作流行带形状徽标与点数/内点/耗时。
3. 若仍不动，Console：`__CF_DEBUG.state()` 看 `hasHeadMain / hasBody / serviceBound`；`__CF_DEBUG.tick()` 手动拉一次。
4. 预览按钮连通性：`__CF_SERVICE.call('cloudforge.preview', { target: 'cloudforge', file: 'E:/tmp/demo/x.step' })` 不应再报 `client service is unavailable`。

## 环境现状提醒
当前 AGH **没有在运行**，而 `~/.agh/data/daemon/discovery.json` 仍是 `"ready": true`、`owner.pid: 20608`（进程已不存在）——正是“daemon 卡/残留”那一类坑。重启前先按既定约束处理：清 4177 端口残留、清卡在 starting 的 daemon、必要时 `icacls` 修 `~/.agh` ACL。
