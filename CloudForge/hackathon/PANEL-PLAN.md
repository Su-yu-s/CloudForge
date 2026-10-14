# CloudForge 控制台面板方案（AGH 侧栏融合）· 历史设计稿

> ⚠️ **本文已被 [`cloudforge-panel/PANEL-AGH.md`](cloudforge-panel/PANEL-AGH.md) 取代**，保留作为设计溯源。
> 下面第 1 节"无全屏面板 slot"的结论**已过时**：当前 AGH 构建提供官方右栏 DSH 槽
> `rightbar` / `rightbar.session`（`packages/web-client/src/dsh-slot-catalog.ts:183-184`），
> 面板已迁到该槽，不再用 `position:fixed` 覆盖层，也不再需要"把大视口交给外部窗口"。
> 实际形态、服务契约、传输预算、12 个实现陷阱与复现步骤，一律以 PANEL-AGH.md 为准。

> 目标：在 AGH Web 工作台内嵌入 CloudForge 控制台——对话流（左）+ 专业软件窗口（右）+
> AGH 侧栏控制台（实时状态），三屏联动。参照 AGH Devices 面板的交互形态。

## 一、机制调研结论（已验证）

| 事实 | 依据 |
|---|---|
| AGH 当前构建支持 9 种 UI slot：sidebar/topbar/trace/transcript/composer/approval/empty-state/settings-pane/conversation | `agnes.mjs` bundle 与 `region-slots.ts` |
| **无全屏面板 slot**——Devices 全屏面板来自其他构建，当前版本做不到 | 同上 |
| `ui:sidebar` 槽可被插件**完全替换**（较小 priority 优先） | `docs/develop/frontend.zh-CN.md`："示例替换内置侧栏" |
| client entry 是浏览器原生 ESM，可携带打包产物与第三方库（Three.js/React） | frontend.zh-CN.md："需要 React/第三方库时应生成可独立加载的浏览器产物" |
| services 通道（daemon 端 query 服务 ↔ 浏览器 client）已在 panel 骨架中设计 | `cloudforge-panel/extensions/` |
| workbench 命令可向当前会话发预置指令（反向驱动智能体） | panel 骨架 `cloudforge.analyze` 命令 |

## 二、方案总览（两层次）

### L1 · CloudForge 控制台侧栏（替换内置侧栏）

用 `ui:sidebar` 槽（priority 抢占内置侧栏）+ 打包 ESM client。单列布局，自上而下：

```
┌─────────────────────────┐
│ ☁ CloudForge      ● 就绪 │   ← 状态头（空闲/执行中/交付）
├─────────────────────────┤
│ WORKFLOWS               │
│ ▸ demo.pcd    检测 ✓ 验证 ✓│   ← 工作流列表（阶段徽章）
│ ▸ cloud_bin_0 探测中…    │
├─────────────────────────┤
│ 验证摘要                 │
│ RMSE 1.9mm · σ 1.15mm   │   ← 三指标 + FreeCAD 校验徽章
│ FreeCAD bbox ✓ 3.41m    │
├─────────────────────────┤
│ ARTIFACTS               │
│ 📦 skeleton.step        │   ← 产物卡
│   [FreeCAD打开][GUI打开] │
│ 📄 竣工核验清单.md        │
├─────────────────────────┤
│ [▶ 一键分析] [🖥 预览]    │   ← 快捷动作（驱动会话）
└─────────────────────────┘
```

### L2 · 双窗口联动编排

智能体在 CAD 交付后**自主启动 FreeCAD/CloudForge**（已实现），侧栏显示"已打开（PID）"状态卡。
演示画面：**左 AGH 会话 + 右 FreeCAD/CloudForge 贴靠**——与 Devices 面板截图的并排形态一致。

## 三、数据流（三层）

1. **文件层（已有）**：runtime 服务扫工作区产物（`result.json`、`suite-result.json`、骨架 STEP）→
   `cloudforge_panel.report` 服务返回结构化摘要 → client 轮询刷新（5s）。
2. **会话层（增强）**：client 经 `ctx.agnes.sessions` 订阅当前会话的工具调用事件
   （cloudforge_detect 完成 → Workflows 列表实时打勾）。
3. **动作层（已有）**：client 的 workbench 命令 / 面板按钮 → `session.prompt()` 反向驱动智能体。

## 四、实施里程碑（每步独立可演示）

| 里程碑 | 内容 | 工作量 | 风险 |
|---|---|---|---|
| M1 | panel 恢复上线：services 通道在新 AGH 版本下跑通（当年 pre-alpha 缺陷探路） | 0.5 天 | 低（插件重装机制已验证可用） |
| M2 | 控制台侧栏：状态头 + Workflows + 验证摘要 + 产物卡 | 1 天 | 低（数据源全部为文件 JSON） |
| M3 | 视口增强：sidebar 内嵌迷你 Three.js 点云视图（可选，视 sidebar 渲染能力） | 1 天 | 中（slot 渲染 text vs DOM 待实施验证） |
| M4 | 按钮联动 + 演示剧本集成 | 0.5 天 | 低 |

## 五、风险与对策

- **services 授权**（当年搁置原因）：AGH 已更新（17:24 插件重装走通 services 注册）。M1 即探路，失败则侧栏降级为
  "一键分析命令 + 文件摘要"，控制台主体不依赖 services（文件层轮询仍可用）。
- **sidebar 宽度（220px）**：单列布局按窄栏设计；大视口由 FreeCAD/CloudForge 外部窗口承担（已自动化）。
- **slot 渲染限制**：M3 前先做一个 HTML 渲染探针；不行则 M3 砍掉，图形交给外部窗口。

## 六、演示剧本融合

评委视角三屏：**左** AGH 会话（智能体干活，含审批交互）· **右** FreeCAD/CloudForge（成品）·
**侧栏** CloudForge 控制台（实时状态与产物）。串词："专业软件不是被 AGH 取代，而是被 AGH 编排。"
