# CloudForge

> **参赛交付说明（黑客松评审请先读这里）**
> 本仓库是 2026 年江苏省高校 AI+科学与工程创新实践黑客松参赛作品**「云铸——从百万点云到实体参数的智造引擎」**（本科生组 · 主赛道 D · 方向 D3）。
>
> | 想看什么 | 打开哪个文件 |
> |---|---|
> | 项目总览、目录结构、三层架构 | [`PROJECT.md`](PROJECT.md) |
> | **完整参赛方案**（问题价值 / 技术方案 / 验证 / 已知边界 / 交接指南） | [`hackathon/SOLUTION.md`](hackathon/SOLUTION.md) |
> | 参赛作品说明与复现路径 | [`hackathon/README.md`](hackathon/README.md) |
> | 独立完成声明与第三方素材披露 | [`hackathon/declaration.md`](hackathon/declaration.md) |
> | AGH 智能体插件（6 个工具） | [`hackathon/cloudforge-tools/`](hackathon/cloudforge-tools/) |
> | 智能体工作流 Skill | [`.agh/skills/cloud-casting/SKILL.md`](.agh/skills/cloud-casting/SKILL.md) |
>
> 作品主线是 **AGH 智能体 + C++ 几何核心**：智能体规划、工具执行、误差验证与重试，
> 推理仅使用 Agnes 模型。下方 README 描述的是承载它的桌面端程序（参赛前既有工程的复刻版）。

RANSAC 点云几何检测工作台的 Tauri 2 + Vue 3 复刻版（原版为 Qt Widgets，见 `E:/C++/Point/RANSAC_GUI`）。

## 架构

```
src/                    Vue 3 + Vite 前端（Glass UI 设计系统，设计稿不在本仓库）
  viewer.ts             Three.js 点云渲染器（逐条复刻 Qt OpenGL 视图契约）
  store.ts              全局状态与工作流（对齐 main_window.cpp 行为）
src-tauri/
  cpp/include|src       C++ 核心算法库（自 RANSAC_GUI 原样拷贝，零改动）
  cpp/third_party       eigen 5.0.1 + ransac_sd（qRANSAC_SD）
  cpp/shim/             新增的 C ABI 胶水（唯一新 C++ 代码，不碰算法）
  src/ffi.rs            FFI 绑定 + 安全封装（含冒烟测试）
  src/ai.rs             CloudForge WSL 子进程运行器（wsl.exe + CLOUDFORGE_EVENT 解析）
  src/result_reader.rs  schema v1 输出读取器（run.json/instances.json/labeled_cloud.ply）
  src/localizer.rs      类别英→中本地化表（约 230 条）
  src/commands.rs       Tauri 命令层（点云经 ipc::Response 以 f32 原始字节传输）
```

数据流：C++ 核心库（静态链接进 Rust 进程）→ Tauri 命令 → Vue 前端。
检测/精拟合在 spawn_blocking 中跑原生代码；点云走二进制 IPC，不序列化 JSON。

## 开发

```bash
npm install          # 前端依赖
npm run tauri dev    # 开发运行（首次会编译 C++ 核心 + Rust 依赖，需 MSVC + CMake）
cargo test --release -p cloudforge   # FFI 冒烟测试（合成场景全链路）
npm run tauri build  # 正式构建（--no-bundle 可只出 exe、跳过 NSIS 安装包）
```

> ⚠️ **正式构建必须走 `tauri build`，不要用裸 `cargo build --release`**：tauri 的 build.rs 以
> `dev = !custom_protocol` 判定运行模式，`custom-protocol` 特性只有 `tauri build` 会启用。
> 裸 `cargo build` 编出的 exe 会去连 `devUrl`（http://localhost:5183），双击打开只显示
> "localhost 拒绝连接"。判别方法：二进制内含内嵌资源路径（`assets/index-*.js`）才是生产版。
> （`src-tauri/Cargo.toml` 的 `[features] custom-protocol` 勿删。）

前置条件：Rust (MSVC)、Node 24、CMake、Visual Studio（含 C++ 工具集）。

AI 识别依赖 WSL Ubuntu 中的分割环境（`/opt/cloudforge-venv` + `/mnt/e/C++/Point/CloudForge-Neural`），
输入要求：室内模型为带 RGB 的 PLY/PCD，NuScenes 为 float32 N×5 的 .bin。
该分割环境是**第三方开源模型**（非本仓库内容、不随本仓库分发，也**不在本作品的 AGH 执行链路与演示中**），
第三方素材披露见 [`hackathon/declaration.md`](hackathon/declaration.md)。

## 设计

UI 采用 Glass UI 设计系统（设计稿在工作室内部文档中，不在本仓库）：
白灰画布 + 毛玻璃分层 + 语义色点缀 + SVG 描边图标；布局结构与 Qt 版一致
（48px 顶栏 / 220px 侧栏 / 中央视图 / 328px 检查器 / 28px 状态栏）。

## 第三方组件与许可

仓库根 [`LICENSE`](LICENSE)（Apache-2.0）**仅覆盖本项目的自有代码**。第三方组件各自适用其原始许可：

| 组件 | 位置 | 许可 | 是否随仓库分发 |
|---|---|---|---|
| Eigen 5 | `src-tauri/cpp/third_party/eigen-5.0.1/` | MPL2 / BSD / Apache-2.0（见其 `COPYING.*`） | ✅ |
| qRANSAC_SD (PrimitiveShapes 1.1, Schnabel & Wahl, Uni Bonn) | `src-tauri/cpp/third_party/ransac_sd/` | **仅研究用途，未授予再分发权利** | ❌ 已 gitignore，复现构建需自行获取，见 [`third_party/README.md`](src-tauri/cpp/third_party/README.md) |
| 点云分割模型（LitePT，ETH/牛津/苏黎世大学，MIT） | 仓库外（WSL 环境） | MIT | ❌ 不随仓库分发；本作品未将其接入 AGH 执行链路与演示 |

完整第三方素材清单与独立完成声明见 [`hackathon/declaration.md`](hackathon/declaration.md)。
