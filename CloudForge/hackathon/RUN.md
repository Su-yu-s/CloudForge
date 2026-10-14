# 云铸运行指南

项目有四个入口，按用途区分。完整背景见 `PROJECT.md`，复现命令见 `README.md`。

## 入口 ①：AGH 智能体会话（比赛主战场）

**前置**：AGH 框架已构建（`E:\C++\Point\agnes-harness`）、cloudforge-tools 插件已安装、Agnes 模型已在工作台配置。

```sh
cd E:\C++\Point\CloudForge
node E:\C++\Point\agnes-harness\packages\cli\dist\local\agnes.mjs serve
```

> 必须在 `CloudForge` 目录下启动：会话工作区即本仓库，`cloud-casting` Skill 与演示数据才能被智能体发现。

1. 浏览器打开 **http://127.0.0.1:4177**（首次进入按提示配置 Agnes 模型，只需一次）；
2. 创建会话（工作区选 `CloudForge`）；
3. 发一句话，例如：

   > 使用 cloud-casting 流程分析 E:/C++/Point/data/livingroom1-fragments-ply/cloud_bin_0.ply

   智能体自主走：`cloudforge_cloud_info` 侦察 → `cloudforge_detect` 检测 → 按 RMSE/软评分决定
   `cloudforge_refine` 重试 → 输出参数报告。每步调用与审批留在轨迹视图（比赛执行证据，可导出）。

终端单命令模式（与 Web 同一后台，会话互通）：

```sh
node E:\C++\Point\agnes-harness\packages\cli\dist\local\agnes.mjs -p "使用 cloud-casting 流程分析 <点云路径>"
```

## 入口 ②：工具层直调（不经过智能体）

```sh
set CLI=E:\C++\Point\CloudForge\hackathon\cli\build\Release\cloudforge-cli.exe

%CLI% info   <点云文件>                                    # 点数/包围盒/格式诊断
%CLI% synth  out.pcd                                       # 生成已知真值合成点云 + truth.json
%CLI% detect <点云> --preset outdoor --output <目录>        # 平面反演（建筑）| mechanical（零件五类基元）
%CLI% refine <点云> --indices <下标.txt> --hint plane       # 点子集精拟合（<50 点拒绝）
%CLI% verify --truth <真值.json> --result <结果.json>       # 误差判定（圆柱↔圆锥泛化匹配）
%CLI% cad    <点云> --result <目录>\result.json --out model.py --union   # 检测→CadQuery 脚本
python model.py                                            # 执行导出 STEP（需 pip install cadquery）
```

全部输出 JSON（`"ok": true/false`），退出码 0 成功 / 1 用法错误 / 2 业务失败。

## 入口 ③：自测（不需要模型）

```sh
node hackathon/cloudforge-tools/tools.test.mjs   # 插件→CLI 调用链 7 项断言，预期 ALL PASS
node hackathon/tests/run-suite.mjs           # 三件套（正常/边界/失败），结果落 tests/results/
```

## 入口 ④：CloudForge GUI 桌面版（演示镜头）

```sh
cd E:\C++\Point\CloudForge
npm install        # 首次
npm run tauri dev  # 需 MSVC + CMake，首次编译 C++ 核心 + Rust 较久
```

**出正式可执行文件（双击运行）必须用 `tauri build`**：

```sh
npm run tauri build -- --no-bundle   # 只出 exe：src-tauri/target/release/cloudforge.exe
npm run tauri build                  # 连 NSIS 安装包一起出
```

⚠️ 不要用裸 `cargo build --release`：tauri 的 build.rs 按 `dev = !custom_protocol` 判定模式，
只有 `tauri build` 会启用 `custom-protocol` 特性，裸 cargo 编出的 exe 会去连 devUrl（localhost:5183），
双击只显示"localhost 拒绝连接"。

GUI 内可执行 AI 实例分割（WSL 模型，需 `/opt/cloudforge-venv` 环境）→ 选中实例 → RANSAC 精拟合，
用于演示视频的"人机复核"镜头。该分割模型为第三方开源模型，不在作品执行链路中（见 declaration.md）。

## 常见问题

- **serve 提示端口/daemon 冲突**：AGH daemon 单例，重复执行 serve 会附着到已运行实例，属正常；
- **插件更新后**：修改 `hackathon/cloudforge-tools/` 后重新运行安装脚本
  `pnpm exec tsx hackathon/agh-scripts/install-package.mts`（会走完整的 disable→remove→install→trust→enable；卸载用 `remove-package.mts <包 id>`）；
- **智能体不调工具**：在指令里明确提名（"使用 cloud-casting 流程…"），Skill 预加载依赖明确提名。
