# 云铸 — 2026 江苏省高校 AI+科学与工程创新实践黑客松 参赛规划

> **本文档为规划与里程碑记录。完整参赛方案（总纲 + 交接指南）见 [SOLUTION.md](SOLUTION.md)。**
>
> **云铸——从百万点云到实体参数的智造引擎**
> 用 Agnes + AGH 打造"云铸"智能体：自主规划点云分割、拟合几何基元、验证误差并重试，
> 把三维扫描逆向建模从数小时压缩到一次对话，输出可复核的参数报告。

赛道：主赛道 D. 工程设计与数字世界；具体方向 D3. 3D 设计与空间智能。
**组别：本科生组**（评分大头 = 任务完成度 25% + AGH 执行闭环 20% + 问题价值 20%）。

## 技术边界决策（2026-10-03 定）

**主线不接入 WSL 分割环境（第三方开源模型 LitePT，MIT，非本队自研）**，理由：
1. 合规零争议：作品 = Agnes 模型（智能决策）+ 纯本地算法（几何计算），完全规避「仅限 Agnes 模型」的声明解释成本；
2. 评委复现简单：无需 WSL/Python/模型权重，也无权重开源许可问题（ScanNet 训练数据限制）；
3. 本科组技术深度仅占 10%，RANSAC 核心（渐进多轮检测、autoTune、IRLS 精拟合、MAGSAC 软评分）已足够支撑；
4. 省下 1–2 天投给视频、轨迹留证、文档（直接对分）。

**保留动作**：演示视频里用 CloudForge GUI（Tauri）展示几何检测→精拟合→参数复核的人机界面（纯算法、无模型调用），
说明其与 AGH 工具链出自同一 C++ 核心库，故事完整但主线不依赖。

---

## 1. 比赛硬性要求对照

| 比赛要求 | 本方案如何满足 |
|---|---|
| 以 Agnes Harness（AGH）为智能体运行与执行底座 | 全部业务能力做成 AGH 后端插件工具，智能体在 AGH 会话中驱动 |
| ≥3 个连续步骤（规划→调用→反馈→验证） | Skill 指导规划；调用 detect/refine 工具；检查 RMSE/内点率决定重试；verify 工具+报告复核收尾 |
| 模型调用仅限 Agnes 模型 | 规划/决策/报告全走 Agnes 模型（官方群领 Key）；C++ RANSAC 是算法非模型，WSL 分割为本地推理（提交时声明） |
| ≥1 条工具/设备调用链 | info → detect → refine → report 完整链，AGH 轨迹视图留证 |
| 测试样例三件套 | 正常=合成真值点云误差表；边界=小点数/大点云；失败=损坏 PLY/格式错误 |
| 获奖须开源 | 交付物独立目录 hackathon/；开源范围=本队自有代码（Apache-2.0），第三方按各自原始许可处理，qRANSAC_SD 因不可再分发不随公开仓库（声明 §五） |

## 2. 融合架构

```
┌─ AGH（智能体底座，TypeScript monorepo，Node 24.10+，pnpm）
│   ├─ Web 工作台 / CLI（会话、审批、轨迹记录——比赛要的执行记录就在这）
│   ├─ cloudforge-tools 插件（我们开发，hackathon/cloudforge-tools/）
│   │    registerTool() × 6 → child_process 调 cloudforge-cli.exe / wsl.exe
│   └─ .agh/skills/reverse-engineering/SKILL.md（工作流方法，指导智能体规划）
│
├─ cloudforge-cli.exe（M1 新增，C++17，静态链接 src-tauri/cpp 核心库）
│    子命令：info / detect / refine / report / verify（无 GUI、无 Tauri 依赖）
│
└─ CloudForge GUI（Tauri，已有）— 演示时人机复核界面，视频里同步渲染
     （未接入）本地部署的第三方开源分割模型（见声明），不进入作品执行链路
```

数据流：智能体在 AGH 会话拿到用户请求（点云文件路径 + 需求）→
按 Skill 规划 → 依次调工具 → 每步结果留在 AGH 轨迹 → 最终产出参数报告（JSON + Markdown）。

## 3. AGH 工具清单（cloudforge-tools 插件）

参照 examples/packages/hot-tool-plugin：普通 Cordis 对象、`inject: ['extension']`、
TypeBox 参数（手写 kind 标记免依赖）、返回 `{ content:[{type:'text'}], structured }`。

| 工具名 | 功能 | meta 声明 |
|---|---|---|
| `cloudforge_cloud_info` | 点云元信息：点数、包围盒、格式诊断（PLY/PCD/TXT/STL/OBJ/BIN） | 只读、免审批 |
| `cloudforge_detect` | RANSAC 基元检测（preset: outdoor_planes / mechanical_full），输出形状列表+系数+RMSE/σ/软评分 | 写输出目录、需审批一次 |
| `cloudforge_refine` | 对指定实例/形状内点做精拟合（hint 可指定类型） | 同上 |
| `cloudforge_report` | 汇总检测结果 → 结构化参数报告（JSON + Markdown：平面方程、圆柱半径、误差指标） | 写报告文件 |
| `cloudforge_verify` | 验证：与合成真值对比 / 内点率阈值检查，返回 PASS/FAIL + 证据 | 只读 |
| `cloudforge_segment`（增强） | 调 WSL 实例分割（Windows 下 wsl.exe 子进程） | 写输出目录、耗时声明 |

## 4. Skill 设计（.agh/skills/reverse-engineering/SKILL.md）

教智能体标准工作流：

1. 先 `cloudforge_cloud_info` 了解点云（点数、包围盒、单位推断）；
2. 按场景选 preset（建筑→outdoor_planes，机械零件→mechanical_full）调 `cloudforge_detect`；
3. **检查返回的 rmse / robust_sigma / soft_score / 内点率**：不合格的形状调 `cloudforge_refine`
   换 hint 或收紧参数重试（这是比赛"反馈处理"评分点）；
4. `cloudforge_report` 生成参数报告，`cloudforge_verify` 自检后向用户汇报，附证据数值。

## 5. 里程碑与时间表（今天 10.03，提交截止 10.15 12:00）

| 里程碑 | 内容 | 时间 | 验收标准 |
|---|---|---|---|
| **M0** | AGH Windows 构建跑通 | 10.03–10.04 | ✅ 完成：serve 启动（127.0.0.1:4177）、插件安装/信任/启用全流程走通 |
| **M1** | hackathon/cli：cloudforge-cli.exe | 10.05–10.06 | ✅ 完成：合成基准全链路 PASS（平面误差 0.016mm、圆柱泛化 0.68mm、<50 点拒绝） |
| **M2** | cloudforge-tools 插件 | 10.07–10.08 | ✅ 完成：trusted+running，工具级自测 6/6 PASS |
| **M3** | 工作流 Skill + 端到端 | 10.09–10.10 | 🔶 Skill 已写入 .agh/skills/cloud-casting；端到端等 Agnes 模型 Key |
| **M4** | 测试三件套 + AGH 轨迹导出 | 10.11–10.12 | 待做（正常/边界样例已在 CLI/自测中验证，需在 AGH 会话留证） |
| **M5** | 视频 + 文档 + 提交 | 10.13–10.15 | 待做 |

**已解决的关键障碍**（AGH pre-alpha Windows 未验收，以下均为踩坑记录）：
- 包管理 CLI 要求 TTY 交互确认 → 走官方管理 SDK（hackathon/agh-scripts/install-package.mts）经 named pipe 直调
- native 模块仅打包在 cli/dist/local 快照内 → 拷贝 agnes-system.node 到 packages/system-node/dist/native/
- SDK journal 的 Windows 私有 ACL 失效 → 改用 memoryJournal
- inspect/install 返回 receipt 需轮询 operation；source 参数是 {type,ref} 对象；clientId 必须绑定连接身份

并行事项：**报名（10.10 12:00 截止）+ 进官方群领 Agnes 模型 Key**。

## 6. 风险与对策

| 风险 | 对策 |
|---|---|
| AGH 官方只在 macOS 验收，Windows 未确认 | M0 第一时间实测；已有官方 start-local-windows.ps1；不行则 WSL2 里跑 AGH |
| AGH pre-alpha，插件 API 变动 | 锁定当前 commit；插件写成零依赖单文件，API 变了只改一处 |
| 本地第三方分割模型有合规灰区 | 主线只用 RANSAC 几何检测（纯算法零模型依赖），分割不接入执行链路也不进演示 |
| qRANSAC_SD 许可证：仅限研究用途、未授予再分发权利 | **已处置，且经评估不必替换**：竞赛属研究/教学用途，使用在授权范围内；公开仓库 gitignore 该目录并附获取说明，声明 §三/§五 已写明边界。替换面经实测**仅 `src/schnabel_detector.cpp`（440 行，接口返回自有 `DetectedShape`，不泄露第三方类型）**，可选后端 PCL（BSD-3，含 TORUS）或 CGAL Shape_detection（GPL-3）；但替换须重调参并重跑全部验证（11/11 测试、鲁棒性 12 工况、CAD 链），且核心将失去「算法零改动」这一既有资产的声明支点——故截至 10-04 决定保留，不为零收益付出 2–3 天 |
| 模型不会主动选工具 | Skill 明确工作流；description 写清楚工具适用场景；用"使用 reverse-engineering 流程处理 xxx.ply"的明确提名句式 |

## 7. AGH 备忘（本机已克隆）

- 仓库：`%TEMP%\agnes-harness`（建议正式开发时移到固定位置并保留 .git）
- 要求：Node ≥ 24.10，pnpm 10.34.5
- 构建：`pnpm install --frozen-lockfile && pnpm --filter @agnes/cli build:local`
- 启动：`node packages/cli/dist/local/agnes.mjs serve`；CLI 同底座 `agnes.mjs -p "..."`
- 插件安装：`agnes.mjs resources`/包管理流程 inspect→install→trust→enable（file: 协议本地包）
- 关键参考文件：examples/packages/hot-tool-plugin/index.mjs、docs/develop/backend.zh-CN.md、docs/guide/skills.zh-CN.md、docs/guide/security.zh-CN.md
