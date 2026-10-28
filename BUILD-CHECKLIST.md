# CloudForge 工作区安装与运行 — 历史错误清单（Checklist）

> **历史记录（2026-10-12）。** 当前安装、构建与运行步骤以根目录 [README.md](README.md) 和 [复现指南.md](复现指南.md) 为准；本文保留当时的排错过程与补丁说明。

> 生成时间：2026-10-12 18:40 ｜ 环境：Windows + Git Bash + MSVC 14.44.35207 + Windows SDK 10.0.26100 + CMake 4.3.0 + Node 24.21.0 + pnpm 10.34.5 + Rust 1.99.0
> 规则遵循：**未修改任何仓库源码**；问题仅以清单 + 独立补丁文件形式交付（补丁：`CloudForge/fix-m-randomseed.patch`，已通过 `git apply --check` 验证可干净应用）。

## 一、总体状态

| 组件 | 安装 | 构建 | 运行 |
|---|---|---|---|
| CloudForge 前端（npm） | ✅ 57 包（npm ci） | ✅ Vite v7.3.6 | ✅ http://localhost:5183/ |
| agnes-harness（pnpm monorepo） | ✅ 429 包（pnpm 10.34.5 + Node 24.21.0） | ✅ CLI build:local + 原生模块 | ✅ http://127.0.0.1:4177/（标题 Agnes Harness） |
| C++ 构建链（ransac_sd + cloudforge_core） | ✅ ransac_sd 已补齐 | ⚠️ QRANSAC_SD 库成功；cloudforge_core 被 E1 阻塞（补丁后已验证可完整构建） | ⛔ tauri dev 待 E1 解决 |

## 二、错误清单

### E1【阻塞】schnabel_detector.cpp 引用不存在的 `m_randomSeed` 成员
- **现象**：`error C2039: "m_randomSeed": 不是 "RansacShapeDetector::Options" 的成员`，位置 `src-tauri/cpp/src/schnabel_detector.cpp` 第 170、355 行。
- **根因**：CloudCompare 版 qRANSAC_SD 的 `RansacShapeDetector::Options` 无 `m_randomSeed` 字段（已核对其头文件确认）；随机种子实际由上一行 `std::srand(params.randomSeed)` 生效，该赋值多余。
- **影响**：`cloudforge_core.lib` 无法编译 → `npm run tauri dev` / `tauri build` 在 C++ 阶段必然失败（Rust 侧无问题）。
- **处置**：未改源码。已生成独立补丁 `CloudForge/fix-m-randomseed.patch`（删除两行赋值），并在临时目录验证：**应用补丁后 cloudforge_core.lib + QRANSAC_SD_PRIM_SHAPES_LIB.lib 均构建成功**。
- **待用户操作**：`git apply CloudForge/fix-m-randomseed.patch` 后重试 `npm run tauri dev`。

### E2【已解决】环境变量大小写重复导致 MSBuild / 原生进程创建失败
- **现象**：MSBuild 报 `System.ArgumentException: 已添加项。字典中的关键字:"HTTPS_PROXY"所添加的关键字:"https_proxy"`，CL.exe 无法启动；agnes 的 Windows 分离进程创建同样因此失败（daemon child exited before readiness）。
- **根因**：本环境同时注入 `HTTPS_PROXY` 与 `https_proxy`（WorkBuddy 本地代理），.NET/原生代码用大小写不敏感字典构建环境块时冲突。
- **处置**：构建/启动命令前执行 `unset https_proxy http_proxy`（保留大写变体维持网络）。**后续所有 cmake/cargo/agnes serve 命令都需带上此操作**。

### E3【已绕过】reg.exe 被安全策略黑名单拦截
- **现象**：agnes `build:local` 调用 VsDevCmd.bat 时间接启动 reg.exe，被沙箱拦截（Program Blacklist，不可批准）。
- **根因**：`packages/system-node/scripts/build-native.mjs` 在未设 `VCToolsInstallDir` 时走 vswhere + VsDevCmd 注册表查询路径。
- **处置**：预设 `VCToolsInstallDir` + PATH/INCLUDE/LIB（MSVC 环境），走脚本自带的"已处于开发环境"分支，直接调 cl.exe 编译原生模块成功。**未启动 reg.exe，未尝试其他等价绕过**。若用户需要完整 VsDevCmd 路径，需在安全中心将 reg.exe 移出黑名单。

### E4【已解决】Node 版本不满足 agnes-harness 要求
- **要求**：`engines: node >=24.10` + `packageManager: pnpm@10.34.5`；系统原有 Node 22.22.2 / 20.20.2。
- **处置**：安装 Node 24.21.0 至 `%USERPROFILE%\.workbuddy\binaries\node\versions\24.21.0\`；pnpm 经 `npm exec --package=pnpm@10.34.5` 运行；Node 24 头文件 + node.lib 已放入 node-gyp 缓存（`%LOCALAPPDATA%\node-gyp\Cache\24.21.0\`）供原生模块编译。

### E5【提示】ransac_sd 未随仓库分发
- 第三方库（波恩大学 PrimitiveShapes 1.1，仅研究用途、无再分发授权），仓库 gitignore。
- **处置**：已从 CloudCompare 仓库（`plugins/core/Standard/qRANSAC_SD/extern/RANSAC_SD`）获取并补齐至 `src-tauri/cpp/third_party/ransac_sd/`（CMake 目标名 QRANSAC_SD_PRIM_SHAPES_LIB 与构建脚本期望一致）。

### E6【提示】CloudForge npm ci 报告 1 个 high severity 漏洞
- `npm audit` 可查详情；本次未执行 `npm audit fix`（避免未经确认的依赖变更）。

## 三、运行中的服务与复现命令

| 服务 | 地址 | 启动命令（关键：先 unset 小写代理变量） |
|---|---|---|
| CloudForge 前端 | http://localhost:5183/ | `cd CloudForge && npm run dev` |
| AGH 智能体服务 | http://127.0.0.1:4177/ | `cd CloudForge && unset https_proxy http_proxy && node ../agnes-harness/packages/cli/dist/local/agnes.mjs serve` |
| CloudForge 桌面端（tauri dev） | — | 待 E1 补丁应用后：`cd CloudForge && unset https_proxy http_proxy && npm run tauri dev` |

后续使用注意：
1. AGH 需在 **CloudForge 目录**下启动（工作区 = 该仓库，Skill 与演示数据在其中）；浏览器打开后需配置 Agnes 模型才能创建会话。
2. 正式构建必须走 `npm run tauri build`（勿用裸 `cargo build --release`，见仓库 README 警告）。
3. AI 识别功能依赖 WSL Ubuntu 分割环境（`/opt/cloudforge-venv`），本机未验证。

## 2026-10-13 更新：CAD 生成入口的 CLI 依赖

本次已移除 `schnabel_detector.cpp` 两处对不存在的 `Options.m_randomSeed` 字段赋值，
保留原有 `std::srand(params.randomSeed)`。E1 的源码构建阻塞已解决。
使用 VS 2022 x64 / Windows SDK 10.0.26100.0 完成 `cloudforge-cli` Release 构建，产物为
`CloudForge\hackathon\cli\build\Release\cloudforge-cli.exe`。
此次只构建和更新 AGH 插件，未执行检测、CAD 转换或页面检验。
