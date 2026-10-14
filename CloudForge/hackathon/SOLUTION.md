# 云铸 · 参赛完整方案

**云铸——从百万点云到实体参数的智造引擎**
2026 年江苏省高校 AI+科学与工程创新实践黑客松 · 本科生组
主赛道 D. 工程设计与数字世界 · 方向 D3. 3D 设计与空间智能

> 方案版本：2026-10-04 ｜ 状态：技术主线已全部打通，待 Agnes 模型 Key 收尾端到端
> 本文档为总纲；分文档索引见 §9。

---

## 1. 作品概述

**一句话**：用 Agnes + AGH 打造"云铸"智能体——自主规划点云分析、拟合几何基元、验证误差并重试，
把三维扫描逆向建模从数小时压缩到一次对话，输出可复核的参数报告与可编辑的 CAD 模型。

**名字的由来**：点云（云）经智能体铸造（铸）为实体参数；对齐"焊卫者/阀匠"式的行业双关命名传统。

**解决的核心问题**：三维激光扫描的**采集**已快至单站 2 分钟，但**后处理**（点云 → 几何参数）
仍是行业断层——人工逐面拟合、主观误差大、"难以形成有效标准值"。云铸在断层上架桥：
可审计的自动化（每个基元带 RMSE/噪声σ/软评分三重证据）。

## 2. 问题价值（评分 20%）

### 2.1 政策锚点（江苏省在地性）

- 《江苏省智能建造发展实施方案（试行）》（省住建厅 2023.1）明确要求「开展**三维数字化竣工验收备案**」
  「制定 **BIM 交付标准**」——云铸输出的结构化参数报告（含 schema 版本与系数语义）正是
  竣工备案与交付标准所需的内容形态；
- 南京、苏州均为住建部首批 **24 个智能建造试点城市**；南京市实施意见（2023.5）要求
  「BIM 智能审查…竣工验收管理制度」。

### 2.2 江苏本地案例（数字自带冲击力）

| 案例 | 数字 | 与云铸的关系 |
|---|---|---|
| 苏州古城数字化 | 8 处文保建筑采集 **278.3 亿**点 | 点云不是档案，参数才是——云铸是从点云到参数的翻译器 |
| 南京城墙 | 现存长度 **22728.98 m** 由三维扫描确定 | 全维度数字档案的下一块拼图 = 参数级结构化提取 |
| 船舶制造（江苏第一大产业） | 单结构测量传统上 **10 小时级**（现代重工案例） | 分段合拢面/外板检测/法兰测量全是点云→参数问题 |

### 2.3 路演 30 秒开场（定稿）

> 苏州古城给 8 栋文保建筑扫了 278 亿个点的点云——但点云不是档案，**参数才是**。
> 修复师傅需要的是"这根柱的直径、这面墙的倾斜"，不是数字海洋。
> 江苏省的智能建造方案里写着"三维数字化竣工备案"，备案要的是参数，不是点云。
> 云铸做的就一件事：**把点云变成可复核的参数**——智能体读扫描、拟合基元、验证误差、
> 交付报告和 CAD 模型，每一步可审计。采集很快的时代，我们补上了"出参数"这块短板。

### 2.4 一个引擎 × 三种行业报告（场景 Profile 化，问题价值 ×3）

| 场景 | 预设 | 报告语义 |
|---|---|---|
| 竣工核验（主推） | outdoor_planes | 净高/开间/墙厚/平整度 → 可归档"三维竣工备案附件" |
| 船舶分段 | mechanical_full | 基面/骨材参数 + 偏差表 → 分段精度检测单 |
| 文物构件 | mechanical_full | 构件参数卡（柱径/梁截面/倾角）→ 数字档案条目 |

## 3. 技术方案

### 3.1 三层架构

```
┌──────────────────────────────────────────────────────────┐
│ Agnes Harness（智能体底座：会话/规划/审批/轨迹留证）        │
│  ├─ cloudforge-tools 插件 v0.2.0（6 个工具，见 §3.2）          │
│  └─ cloud-casting Skill（.agh/skills/，工作流手册）         │
└─────────────────────┬────────────────────────────────────┘
                      │ 子进程 JSON 协议
┌─────────────────────▼────────────────────────────────────┐
│ cloudforge-cli.exe（命令行壳，C++17，零第三方依赖）             │
└─────────────────────┬────────────────────────────────────┘
                      │ 静态链接（算法零改动）
┌─────────────────────▼────────────────────────────────────┐
│ C++ 核心库：qRANSAC_SD 检测（平面/球/圆柱/锥/环）           │
│           + ModernRansacRefiner 精拟合（IRLS/MAGSAC 软评分）│
└──────────────────────────────────────────────────────────┘
旁路：CloudForge GUI（Tauri 桌面版）＝人机复核界面（纯几何算法，无模型调用）
```

### 3.2 六个智能体工具

| 工具 | 功能 | 审批 |
|---|---|---|
| `cloudforge_cloud_info` | 点云元信息（点数/包围盒/格式诊断） | 免审批（只读） |
| `cloudforge_detect` | RANSAC 基元检测 + 精拟合指标 | 需审批（写目录） |
| `cloudforge_refine` | 点子集精拟合（<50 点核心拒绝） | 需审批 |
| `cloudforge_synth` | 生成已知真值合成点云（验证基准） | 需审批 |
| `cloudforge_verify` | 结果 vs 真值判定（圆柱↔圆锥泛化匹配） | 免审批（只读） |
| `cloudforge_cad_export` | 检测结果 → 可执行 CadQuery 脚本 → STEP 模型 | 需审批 |

### 3.3 工作流闭环（对应比赛"≥3 连续步骤"要求）

① **规划**：依 Skill 侦察（cloud_info 判断场景与规模）→ ② **调用**：detect（按场景选预设）→
③ **反馈处理**：检查 RMSE/软评分/内点率，对不合格形状 refine 重试或如实放弃 →
④ **结果验证**：verify 判定 + 报告复核；可选 ⑤ **CAD 交付**（cad_export → STEP）。
全程留痕于 AGH 轨迹视图（导出即提交证据）。

### 3.4 模型合规

智能体规划/决策/报告生成**全部使用 Agnes 模型**（唯一模型调用）；C++ 核心为确定性几何算法
（非模型）；本地 WSL 分割环境为**第三方开源模型**（LitePT，MIT，**非本队自研**），
**不接入作品执行链路、不进演示**（见 §8 与 declaration.md §四）。

## 4. 已完成工作（截至 2026-10-04，全部实测验证）

| 项 | 内容 | 验证结果 |
|---|---|---|
| AGH 底座 | Windows 源码构建 + Web 工作台 + 插件治理流程（inspect/install/trust/enable） | 服务运行正常；官方仅验收过 macOS，Windows 坑全部趟平 |
| cloudforge-cli | 六子命令 CLI（info/detect/refine/synth/verify/cad），静态链接现有核心 | 编译通过，JSON 契约稳定 |
| cloudforge-tools 插件 | 零依赖 JS 插件，6 工具注册，v0.2.0 已安装运行 | `trusted=true, running`；工具级自测 **7/7 PASS** |
| 合成基准验证 | 65000 点（平面 z=0 + 圆柱 r=0.05m） | 平面误差 **1.6e-05 m**、法向角 0.006°；圆柱泛化匹配误差 **0.68 mm** |
| 真实数据验证 | Redwood 客厅 196133 点 | **1.0 s 检出 43 平面，内点覆盖 82.3%** |
| CAD 导出链路 | 检测 → CadQuery 代码 → 执行 → STEP | 模型 bbox **0.600×0.600×0.206** vs 真值（0.6×0.6×0.2）吻合 |
| 测试三件套 | 正常 3 + 边界 3 + 失败 5 | **11/11 PASS**（`tests/results/suite-result.json`） |
| 鲁棒性边界扫描 | 噪声 σ×降采样 12 工况网格（CLI 新增 --noise/--downsample） | **可信域明确：σ≤2mm 且 ≥50% 点数稳定 PASS；σ≥10mm 无检出如实 FAIL**（`results/robustness.json`） |
| Skill 场景化 | 竣工核验/船舶分段/文物构件三 profile + 三份行业报告模板（含净高/开间换算规则） | 已写入 cloud-casting Skill |
| 文档体系 | PROJECT/PLAN/SOLUTION/README/RUN/IDEAS/VALUE/declaration 八份 | 齐备 |
| 参赛包 | 桌面 `云铸-参赛包-CloudForge.zip` | ⏳ 本轮改动后需重打 |

**踩坑记录（AGH pre-alpha Windows 适配，作品差异化壁垒）**：
包管理 CLI 强制 TTY → 改走官方管理 SDK 经 named pipe 直调；native 模块仅打包在 CLI 快照内 →
拷贝 `agnes-system.node`；journal 私有 ACL 失效 → memoryJournal；enabled 包更新须
disable→remove→install→trust→enable；daemon 授权仅授予本地 pipe 连接；
**用户目录被第三方工具（Codex 沙箱组）注入 ACL 导致 daemon 私有目录校验失败** →
`icacls ~/.agh /remove:g SU\CodexSandboxUsers` 修复（此坑会复发，已写进交接文档）；
profile 用户层是 fragment（只允许 policy 等字段），ceiling 加 `services` 须用纯 fragment 写法。

**已解除的"已知边界"（原 §4 的 AGH Windows 面板激活缺陷）**：本节原记载"AGH 前端面板在本机
Windows 实例无法激活，官方最小示例同样失败，判定为 AGH pre-alpha 缺陷"。**该结论已推翻**：

- 当前 AGH 构建提供官方右栏 DSH 槽 `rightbar` / `rightbar.session`
  （`packages/web-client/src/dsh-slot-catalog.ts:183-184`），面板已迁到该槽并**实测挂载成功**；
- 当时的现象是**面板自身的一处空指针**：`mount()` 收尾调用的 `applyCollapsed()` 里
  `querySelector('.cf-head-main')` 取到 `null`，读 `.style` 抛 `TypeError`，冒泡打断
  `mount → start`，于是 `renderData` 与 `setInterval(tick)` 都没执行，数据区永远停在
  `mount()` 写死的"连接中…"；根因与完整无头复现见
  [`cloudforge-panel/ROOTCAUSE-connecting.md`](cloudforge-panel/ROOTCAUSE-connecting.md)；
- `services` 能力上限问题也早已通过 `~/.agh/profiles/local-dev/profile.yaml` 的
  `capabilityCeiling` 加 `services` 解决。

因此云铸面板（`hackathon/cloudforge-panel/`）**从"未来工作"转为演示主线组件**，
四页签（点云 / CAD / 验证 / 报告）与合规执行链留证均已跑通。实现约束见
[`cloudforge-panel/PANEL-AGH.md`](cloudforge-panel/PANEL-AGH.md)。

## 5. 待完成工作与排期（提交截止 10.15 12:00）

| 日期 | 任务 | 状态 |
|---|---|---|
| 10.04–05 | **报名（截止 10.10 12:00）+ 进官方群拿 Agnes Key** → 配置模型、端到端跑通、AGH 轨迹导出留证 | ⏳ 阻塞于 Key |
| 10.06 | Skill 场景化：三行业 profile + 报告模板 | ✅ 已完成 |
| 10.07–08 | 云铸面板（AGH 右栏控制台） | ✅ 已跑通：迁到宿主官方右栏槽 `rightbar.session`，四页签（点云/CAD/验证/报告）+ 合规执行链留证。原记录的「AGH Windows 面板激活缺陷」已定位为面板自身空指针（见 ROOTCAUSE-connecting.md） |
| 10.09 | 量化价值对比表：实测人工拟合 3 个平面计时 → ×41 换算表 | 🔶 实测方案已写（tests/manual-baseline.md，约 15 分钟人工操作） |
| 10.10 | 技术纵深：鲁棒性边界工况扫描（噪声×降采样网格） | ✅ 已完成（12 工况落盘） |
| 10.11–13 | 演示视频（分镜见 §6.3） | 待做 |
| 10.14 | 技术文档终稿 + 提交预演 | 待做 |
| 10.15 上午 | 提交（预留缓冲） | — |

**砍单原则**：时间不足先砍批量评测 → 面板，**保**：端到端轨迹、价值表、CAD 导出、场景化。

## 6. 演示设计

### 6.1 演示主线（AGH 会话，3 分钟内完成）

1. 打开 AGH 工作台（云铸面板按钮或直接对话）；
2. 一句话："使用 cloud-casting 流程分析 E:/C++/Point/data/livingroom1-fragments-ply/cloud_bin_0.ply"；
3. 智能体走四阶段闭环，轨迹视图全程可见（审批弹窗出现时点"允许"——展示治理能力）；
4. 报告输出：43 个平面的参数清单 + 净高/墙体推断 + 误差证据；
5. CAD 炸点：切换合成零件数据 → detect → cad_export → 终端 `python model.py` →
   CAD 软件打开 STEP 旋转展示。

### 6.2 视频分镜（3–5 分钟）

| 段 | 内容 | 时长 |
|---|---|---|
| 开场 | 30 秒价值白（§2.3 脚本 + 苏州古城数字动画） | 0:00–0:30 |
| 架构 | 一页架构图 + "AGH 连接专业软件"合规叙事 | 0:30–1:00 |
| 主线 | AGH 会话端到端（含审批、轨迹特写） | 1:00–2:30 |
| 炸点 | CAD 导出：点云 → 代码 → STEP 在 CAD 软件旋转 | 2:30–3:30 |
| 严谨 | 测试三件套 11/11 + 合成基准误差表一闪 | 3:30–4:00 |
| 收尾 | GUI 人机复核镜头 + 价值表 + 团队 | 4:00–4:30 |

### 6.3 评委体验增强

- **云铸面板**：评委不打字，点按钮即触发全流程；
- 合成基准数据包随作品附带（synth 一键生成），评委可自测。

## 7. 提交材料清单（对照官方要求）

| 官方要求 | 对应材料 | 状态 |
|---|---|---|
| 基本信息 + 技术信息 | 报名表（组别：本科组；赛道 D；方向 D3） | ⏳ 报名时填 |
| 可运行作品 | 参赛包 zip（含 PROJECT.md 复现路径） | ✅ |
| 3–5 分钟演示视频 | 按 §6.2 分镜制作 | ⏳ |
| AGH 执行记录（轨迹） | 端到端会话轨迹导出 + 截图 | ⏳ 等 Key |
| ≥1 条工具/工具链调用记录 | cloud_info→detect→refine→verify→cad_export 全链 | ⏳ 随轨迹 |
| 测试样例（正常/边界/失败） | `tests/results/suite-result.json`（11/11 PASS） | ✅ |
| 成员声明 + 独立完成声明 | `hackathon/declaration.md`（模板，填名即用） | ✅ 模板 |
| 既有代码/第三方素材说明 | declaration.md §二/§三/§四（逐项列明来源与许可） | ✅ |
| 公开内容 / 开源承诺 | declaration.md §五（获奖 5 个工作日内开源） | ✅ |

## 8. 合规要点（对照官方通知逐条自查）

1. **AGH 执行底座** ✅：全部业务能力为 AGH 插件工具，智能体四阶段闭环；
2. **模型调用仅限 Agnes** ✅：智能体推理唯一使用 Agnes 模型；C++ 核心为确定性算法非模型；
   本地 WSL 分割环境是**第三方开源模型**（LitePT，MIT，arXiv:2512.13689，非本队自研），
   **未接入执行链路、不进演示**（declaration.md §四如实说明）；
3. **AGH 连接专业软件** ✅：cloudforge-cli 即被连接的算法库/专业软件，架构与条款原文同构；
4. **独立完成** ✅：智能体接入层（CLI 壳、插件、Skill、测试、演示）为赛事期间独立开发；
   C++ 几何核心为参赛前本队成果（其中基元检测基于第三方 qRANSAC_SD，已在声明中列明）；
5. **第三方开源组件**：qRANSAC_SD（仅限研究用途、不可再分发，公开仓库不含该目录并附获取说明）、
   Eigen（MPL2）、CadQuery（Apache-2.0）、AGH（Apache-2.0）、Tauri/Vue/Three.js（MIT）——全清单见 declaration.md；
6. **公开数据** ✅：Redwood 公开数据集 + 自产合成数据；
7. **获奖开源**：承诺 5 个工作日内开源赛事代码库。

## 9. 文档索引

| 文档 | 内容 |
|---|---|
| PROJECT.md（仓库根） | 项目总览：目录结构 / 架构 / 快速使用 |
| hackathon/SOLUTION.md | 本文档（总纲） |
| hackathon/PLAN.md | 规划与里程碑（含踩坑记录） |
| hackathon/README.md | 作品说明 + 评委从零复现命令 |
| hackathon/ONBOARDING.md | **队友上手指南**：从零构建 CLI / AGH / 插件 / 起服务 / 跑通第一次分析（可整篇转发） |
| hackathon/agh-scripts/ | AGH 包管理脚本（SDK 直调，绕开 CLI 的 TTY 交互）+ 使用说明 |
| hackathon/RUN.md | 四个入口的运行指南 + FAQ |
| hackathon/IDEAS.md | 提升创意清单（含执行状态） |
| hackathon/VALUE.md | 问题价值方案（政策/案例/量化表） |
| hackathon/declaration.md | 独立完成声明 + 第三方素材清单（模板） |
| .agh/skills/cloud-casting/SKILL.md | 云铸工作流 Skill（智能体工作手册） |

## 10. 工作交接指南（新会话 / 新成员从这里开始）

### 10.1 资产位置清单

| 项 | 路径 | 说明 |
|---|---|---|
| 参赛作品仓库 | `E:\C++\Point\CloudForge`（2026-10-04 由 LitePT-new 更名） | 所有赛事代码：`hackathon/`（作品层）+ `.agh/skills/`（工作流）+ `src-tauri/cpp/`（算法核心，**勿改动**）；仓库内全部绝对路径引用已同步 |
| AGH 框架源码 | `E:\C++\Point\agnes-harness` | 官方仓库克隆（commit a6b8319），已完成 `pnpm install` + `build:local`；`hackathon/agh-scripts/install-package.mts`（安装/覆盖）与 `hackathon/agh-scripts/remove-package.mts`（卸载）是我们的插件管理脚本 |
| 测试数据 | `E:\C++\Point\data` | Redwood livingroom1 / office1 片段（PLY 带颜色）、DemoColoredICP |
| 演示产物 | `CloudForge\hackathon\demo-data\` | `cad-test/`（合成件 + model.py + part.step）、`livingroom-run/`（43 平面检测结果） |
| 参赛包 | `%USERPROFILE%\Desktop\云铸-参赛包-CloudForge.zip` | ✅ **2026-10-04 已重打**（2253 文件，21.7 MB → 6.2 MB，包内自检无旧命名）。用 `python hackathon/pack-submission.py` 可复现，脚本自动排除 node_modules/target/build/dist 之外的构建产物与 `.test-run`/`.agh-home` |
| 测试结果 | `hackathon\tests\results\` | 三件套 suite-result.json（11/11）+ 鲁棒性 robustness.json，均含时间戳 |
| 旧目录 | ~~`E:\C++\Point\LitePT-new`~~ | ✅ **2026-10-04 内容已全部删除**（3.6 GB / 14414 文件）。更名前先完整复制迁移到 `CloudForge`，逐文件比对确认新仓库为超集（旧目录独有的只有 `.claude/`、已被取代的 `litept-panel`/`litept-tools`/`litept_shim`）。**遗留一个空目录**：它当时是本会话的工作目录，Windows 不允许删除进程的当前目录（`Device or resource busy`）→ 在**从 CloudForge 打开的新会话**里执行 `rmdir E:\C++\Point\LitePT-new` 即可收尾 |
| 旧构建产物 | — | ✅ **2026-10-04 已全清**：`src-tauri/target`（3.1 GB）与 `hackathon/cli/build`（31 MB）整体删除后从零重建；`cli/CMakeLists.txt` 的 `<BINARY_DIR>`/链接目标由 `litept_core_*` 改为 `cloudforge_core*`（旧名会让重新配置直接失败） |
| 同日修复 | `hackathon/cli/main.cpp`、`dist/` | ① CAD 生成器两处缺陷：非 `--union` 分支少一个右括号（生成的 Python 直接语法错误）、收尾 `bb = model.val()...` 对 `cq.Compound` 不存在 `.val()`；已修并两个分支实跑验证（bbox 0.600×0.600×0.206 与真值一致）。② `dist/` 是 9-17 的旧前端产物（`<title>LitePT</title>`），已 `npm run build` 重建 |
| AGH 侧清理 | `%USERPROFILE%\.agh` | ✅ 卸载调试对照包 `panel-min`（其 rowId 为 `ext:litept/panel-min`）；删除更名前旧工作区（`LitePT-new`）的技能注册与 LKG 缓存（旧 LKG 正文让智能体调用已不存在的 `litept_*` 工具）；`profile.yaml` 注释旧服务名改为 `cloudforge_panel.report`；清空 jiti 转译缓存。审计日志（`data/audit/*.jsonl`）按证据保留 |

### 10.2 当前已部署状态

- **AGH daemon**：运行中（PID 5196，http://127.0.0.1:4177 返回 200；2026-10-04 为清理技能缓存而重启过）；停止/启动用 `agh daemon stop|start`，或在 CloudForge 目录跑 SOP 里的 `serve`；
- **插件**：`cloudforge-tools@0.2.0` 与三个官方 helper 均 `trusted=true / enabled / actual=running`（六工具可用）；调试用 `panel-min` 已卸载；
- **profile fragment**：`~/.agh/profiles/local-dev/profile.yaml`（纯 policy fragment，capabilityCeiling 已含 services）；
- **Python**：本机 Python 3.13 + **cadquery 已安装**（执行 CAD 脚本用）；
- **CLI**：`hackathon\cli\build\Release\cloudforge-cli.exe`（六子命令 + --noise/--downsample 扰动参数）；
- **模型**：**尚未配置**——Agnes Key 未到位，端到端（智能体真实调用工具）还没跑过；
- **面板**：已安装并跑通（`rightbar.session` 槽 + 12 个服务），见 §4「已解除的已知边界」与 PANEL-AGH.md。

### 10.3 标准操作流程（SOP）

```sh
# ① 启动 AGH（必须 cd 到 CloudForge：工作区 = Skill 发现根）
cd E:\C++\Point\CloudForge
node E:\C++\Point\agnes-harness\packages\cli\dist\local\agnes.mjs serve
# → 浏览器 http://127.0.0.1:4177 → 设置里配置 Agnes 模型（Key 到位后一次性）

# ② 端到端（Key 配置后）：新会话发指令
#    "使用 cloud-casting 流程分析 E:/C++/Point/data/livingroom1-fragments-ply/cloud_bin_0.ply"
#    审批弹窗点允许；完成后导出轨迹视图 = 提交证据

# ③ 回归测试（任何改动后必跑）
node hackathon/cloudforge-tools/tools.test.mjs     # 预期 7/7 PASS
node hackathon/tests/run-suite.mjs             # 预期 11/11 PASS

# ④ 插件更新（改了 cloudforge-tools/ 后）：幂等脚本，自动 disable→remove→install→trust→enable
#    脚本按 AGH_ROOT 自定位框架仓库，不用复制进 agnes-harness；须在 CloudForge 目录执行
$env:AGH_ROOT = "E:/C++/Point/agnes-harness"
pnpm exec tsx hackathon/agh-scripts/install-package.mts             # 安装/覆盖（默认包路径 hackathon/cloudforge-tools，包 id cloudforge-tools）
pnpm exec tsx hackathon/agh-scripts/remove-package.mts cloudforge-tools   # 卸载（先 disable 再 remove）

# ⑤ 重建 CLI（改了 hackathon/cli/ 后）
cmake -S hackathon/cli -B hackathon/cli/build
cmake --build hackathon/cli/build --config Release
```

### 10.5 已知坑速查（AGH pre-alpha + Windows）

1. AGH 包管理 **CLI 命令要求 TTY 交互确认** → 一律走 `hackathon/agh-scripts/install-package.mts`（官方管理 SDK 直调，支持两参数：包路径 + 包 id）与 `hackathon/agh-scripts/remove-package.mts <包 id>`；
2. SDK 直调要点：unix transport（named pipe）+ `serverIdentity`（取 `~/.agh/data/daemon/discovery.json` 的 `owner`）+ `auth: {kind:'local'}` + `clientId` 必须用 `client.clientId()`（连接绑定）+ `source` 是 `{type:'file', ref:'file:./相对路径'}` 对象（相对 daemon 工作区）；
3. **native 模块**：已从 CLI 快照拷贝到 `packages/system-node/dist/native/agnes-system.node`（新克隆 AGH 需重做此步或跑 `build:native`）；
4. daemon 的包管理授权**只授予本地 pipe 连接**，WebSocket 被设计性拒绝（403/authority）——不要试图走 ws；
5. 更新已启用包必须走 **disable→remove→install→trust→enable** 全流程（脚本已内置）；
6. ⚠️ **Codex 沙箱 ACL 污染**（会复发）：本机其他 AI 工具（Codex）会往用户目录注入 `SU\CodexSandboxUsers` ACE，导致 daemon 启动报 "Private directory validation failed" → 修复：`icacls "%USERPROFILE%\.agh" /remove:g SU\CodexSandboxUsers`（只需处理 `~/.agh` 根，子目录已被 AGH 保护）；
7. ⚠️ **profile 用户层是 fragment**：`~/.agh/profiles/local-dev/profile.yaml` 只允许 `policy` / `packages` / `approvals` 等少量字段，**写 name/packages/seams 等完整字段会让 daemon 崩溃或装配失败**；加 capabilityCeiling 的正确写法见现文件（纯 policy fragment）；
8. ✅ **前端面板已可激活**（原记为「无法激活」）：真因是面板自身 `applyCollapsed()` 的空指针，加上旧版用 `position:fixed` 与宿主右栏浮层冲突。已迁到官方 `rightbar.session` 槽并实测挂载；后端插件（cloudforge-tools）始终正常；
9. 插件找 CLI 用环境变量 `CLOUDFORGE_CLI` 覆盖，默认 `hackathon/cli/build/Release/cloudforge-cli.exe`；
10. `serve` 必须从 `CloudForge` 启动，否则 `file:./hackathon/cloudforge-tools` 与 Skill 的相对解析错位；
11. CLI 输出全 ASCII JSON；`detect` 的 stdout 前缀可能含 Schnabel 中文日志行，插件按第一个 `{` 截取；
12. TXT/STL 点云加载后质心居中（库行为），报告需注明坐标系；`detect` 激活失败后包会卡 `actual=failed`，此时任何 enable 都被状态机拒绝——必须先 remove 再 install（脚本已内置）。
13. ⚠️ **桌面端必须用 `npm run tauri build` 构建**（2026-10-04 实测踩坑）：tauri 的 build.rs 用 `dev = !custom_protocol` 判定运行模式，只有 CLI 会启用 `custom-protocol` 特性。用裸 `cargo build --release` 编出的 `cloudforge.exe` 会去连 `devUrl`（http://localhost:5183），双击打开显示"localhost 拒绝连接"（WebView2 错误页）。判别方法：二进制里含内嵌资源路径（如 `assets/index-*.js`）才是生产版；`Cargo.toml` 的 `[features] custom-protocol` 勿删。

### 10.6 阻塞项与下一步（按序执行）

1. **【用户】报名**（10.10 12:00 截止）：组别本科组、赛道 D、方向 D3、项目名"云铸——从百万点云到实体参数的智造引擎"；**进官方群领 Agnes 模型 Key**；
2. **【接手人】Key 到位后**（对应 §5 排期）：配置模型 → 端到端跑通 → 轨迹导出留证 → Skill 场景化（10.06）→ 云铸面板（10.07–08）→ 价值表实测（10.09）→ 纵深二选一（10.10）→ 视频（10.11–13）→ 终稿与提交（10.14–15）。

### 10.7 关键约定

- 项目名统一用「**云铸**」（英文名 Cloud Casting；代码前缀 `cloudforge_` 保留不动）；
- 比赛三条红线：AGH 执行底座、仅 Agnes 模型调用、轨迹留证；获奖 5 个工作日内开源；
- 文档全中文，代码注释中文，CLI/代码输出 ASCII；
- `src-tauri/cpp/` 零改动是既定原则（声明与复现依赖此边界）。
