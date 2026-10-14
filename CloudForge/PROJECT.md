# 云铸 —— 项目总览

**云铸——从百万点云到实体参数的智造引擎**
2026 年江苏省高校 AI+科学与工程创新实践黑客松 · 本科生组 · 主赛道 D. 工程设计与数字世界 · 方向 D3. 3D 设计与空间智能

用 Agnes + AGH 打造"云铸"智能体：自主规划点云分析、拟合几何基元、验证误差并重试，
把三维扫描逆向建模从数小时压缩到一次对话，输出可复核的参数报告。

---

## 一、目录结构（本包即 `CloudForge` 仓库）

```
CloudForge/
├── PROJECT.md                  ← 本文件：总览（结构 / 架构 / 使用）
├── README.md                   ← 原项目技术说明（Tauri 2 + Vue 3 复刻版架构）
├── package.json / vite.config.ts / tsconfig.json / index.html
│
├── .agh/
│   └── skills/
│       └── cloud-casting/
│           └── SKILL.md        ★ 云铸工作流 Skill：AGH 智能体的"工作手册"
│                               （侦察→检测→反馈重试→验证报告四阶段闭环）
│
├── hackathon/                  ★ 参赛作品全部新增内容
│   ├── PLAN.md                 参赛规划：里程碑、时间表、技术边界决策、踩坑记录
│   ├── README.md               作品说明 + 评委复现路径（从零搭建命令）
│   ├── RUN.md                  运行指南：四个入口的日常启动方式
│   │
│   ├── cli/                    M1：cloudforge-cli —— C++ 核心的命令行壳
│   │   ├── CMakeLists.txt      引用 ../../src-tauri/cpp 静态库，核心零改动
│   │   └── main.cpp            六个子命令：info / detect / refine / synth / verify / cad
│   │                            （JSON 输出，零第三方依赖，含手写 mini-JSON 解析）
│   │
│   ├── cloudforge-tools/           M2：AGH 后端插件
│   │   ├── package.json        agnes.plugins 清单（inspect/install/trust/enable 可装）
│   │   ├── index.mjs           零依赖注册 6 个智能体工具（含 TypeBox 参数 Schema）
│   │   └── tools.test.mjs      工具级自测（mock extension API，7 项断言）
│   │
│   ├── tests/
│   │   └── run-suite.mjs       M4：测试三件套一键脚本（正常/边界/失败样例）
│   │
│   └── demo-data/
│       └── livingroom-run/     真实数据演示产物：Redwood 客厅扫描 19.6 万点
│                               检出 41 个平面（result.json + info.json + 内点下标）
│
├── src/                        Vue 3 前端（Glass UI 工作台，viewer.ts Three.js 渲染）
├── spec/                       核心契约规格（core-contracts / ai-runner / viewer 等 5 篇）
│
└── src-tauri/
    ├── cpp/                    ★ C++ 核心算法库（本作品的地基，来自原 RANSAC_GUI）
    │   ├── src|include/        qRANSAC_SD 检测 + ModernRansacRefiner 精拟合（LO-RANSAC/IRLS）
    │   ├── shim/               C ABI 胶水（ransac_detect / ransac_refine_instance FFI）
    │   └── third_party/        eigen 5.0.1 + ransac_sd（Schnabel 原作，保留原始许可）
    └── src/                    Tauri 命令层 + WSL 分割运行器（ai.rs，未接入执行链路）
```

> 已从包中剔除的生成物：`node_modules/`（129M，`npm install` 复原）、
> `src-tauri/target/`（3.4G Rust 构建产物）、`hackathon/cli/build/`（CMake 产物，CMake 一键重建）、
> `.claude/` 本地配置、废弃的 `hackathon/.agh-home/`。
> 前端产物 `dist/` **已包含**（2026-10-04 用 `npm run build` 重建，可直接被 `tauri build` 使用）；打包脚本见 `hackathon/pack-submission.py`。

## 二、架构（三层，自上而下）

```
┌─────────────────────────────────────────────────────────────┐
│  Agnes Harness（AGH 智能体底座）                              │
│  会话管理 · 任务规划 · 工具审批 · 轨迹留证（比赛执行证据）      │
│                                                              │
│  ├─ cloudforge-tools 插件（hackathon/cloudforge-tools/）             │
│  │    6 个工具：cloud_info / detect / refine / synth / verify / cad_export │
│  └─ cloud-casting Skill（.agh/skills/）                       │
│       四阶段工作流：侦察 → 检测 → 反馈重试 → 验证报告          │
└──────────────────────┬──────────────────────────────────────┘
                       │ 子进程（JSON 协议）
┌──────────────────────▼──────────────────────────────────────┐
│  cloudforge-cli.exe（hackathon/cli/）                            │
│  无 GUI 命令行壳，输出结构化 JSON                              │
└──────────────────────┬──────────────────────────────────────┘
                       │ 静态链接（零改动）
┌──────────────────────▼──────────────────────────────────────┐
│  C++ 核心库（src-tauri/cpp/）                                 │
│  Schnabel qRANSAC_SD 基元检测（平面/球/圆柱/锥/环）            │
│  + ModernRansacRefiner 鲁棒精拟合（IRLS / MAGSAC 软评分）      │
│  质量指标：RMSE · robust_sigma（噪声σ）· soft_score            │
└─────────────────────────────────────────────────────────────┘

旁路：CloudForge GUI（Tauri 桌面版）—— 人机复核界面，
      本地部署的第三方开源分割模型未接入执行链路（见 declaration.md）。
```

**闭环如何满足比赛要求**（AGH 执行闭环 20% + 任务完成度 25%）：
智能体在 AGH 会话中：① 依 Skill 规划（cloud_info 侦察）→ ② 调 detect/refine →
③ 检查 RMSE/软评分决定重试策略（反馈处理）→ ④ verify 判定并出带证据的报告（结果验证）。
每步均记录在 AGH 轨迹视图，导出即提交材料。

## 三、如何使用（速查，详见 RUN.md）

```sh
# 0) 一次性构建（评委复现，完整命令见 hackathon/README.md）
npm install                                   # 前端依赖（GUI 用）
cmake -S hackathon/cli -B hackathon/cli/build # 构建 cloudforge-cli
cmake --build hackathon/cli/build --config Release
# AGH 框架单独从源码构建：github.com/AgnesAI-Labs/agnes-harness

# 1) 智能体主线（比赛演示）
cd CloudForge
node ../agnes-harness/packages/cli/dist/local/agnes.mjs serve   # 启动 AGH
#   → 浏览器 http://127.0.0.1:4177 → 配置 Agnes 模型 → 发指令：
#   "使用 cloud-casting 流程分析 E:/C++/Point/data/xxx.ply"

# 2) 工具层直调（不经过智能体）
hackathon\cli\build\Release\cloudforge-cli.exe info <点云文件>

# 3) 自测
node hackathon/cloudforge-tools/tools.test.mjs    # 插件工具链 6 项断言
node hackathon/tests/run-suite.mjs            # 三件套：正常/边界/失败样例

# 4) CloudForge GUI（Tauri 桌面版，演示镜头）
npm run tauri dev
```

## 四、比赛材料索引

| 材料 | 位置 | 状态 |
|---|---|---|
| 参赛规划与决策记录 | [hackathon/PLAN.md](hackathon/PLAN.md) | ✅ |
| 作品说明与复现路径 | [hackathon/README.md](hackathon/README.md) | ✅ |
| 运行指南 | [hackathon/RUN.md](hackathon/RUN.md) | ✅ |
| 工作流 Skill | [.agh/skills/cloud-casting/SKILL.md](.agh/skills/cloud-casting/SKILL.md) | ✅ |
| 插件与工具源码 | hackathon/cloudforge-tools/ · hackathon/cli/ | ✅ 已验证 |
| 真实数据演示产物 | hackathon/demo-data/ | ✅ |
| AGH 轨迹留证 | AGH 会话导出 | ⏳ 等 Agnes 模型 Key |
| 3–5 分钟演示视频 | — | ⏳ M5 |

## 五、许可与声明

- 本作品自有代码随获奖开源要求发布（Apache-2.0）
- `src-tauri/cpp/third_party/ransac_sd` 为 Schnabel 等 qRANSAC_SD 原作，保留其原始许可声明
- 智能体推理使用 Agnes 模型（符合比赛"模型调用仅限 Agnes 模型"要求）；
  C++ 核心为本地确定性算法，无任何外部模型调用
