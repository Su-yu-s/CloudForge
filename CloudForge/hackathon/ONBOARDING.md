# 队友上手指南：从零跑通「AGH 智能体 → cloudforge-tools → cloudforge-cli」

面向**第一次拿到本项目**的队友，目标是在自己机器上把比赛的执行链路跑通。
只想知道怎么用、不打算装环境的，直接跳到 §7。

全程大约 20 分钟（不含下载）。

---

## 0. 先拿到什么

**代码（二选一）**

| 方式 | 说明 |
|---|---|
| **公开仓库（推荐）** `git clone https://github.com/Su-yu-s/CloudForge.git` | 完整源码与演示数据；⚠️ **不含 `ransac_sd`**（波恩大学原版，只授权研究用途、未授予再分发权利）。需按 `src-tauri/cpp/third_party/README.md` 自行获取后放入，否则 CLI 构建会直接报错 |
| **参赛包 zip（由队伍另行分发）** `云铸-参赛包-CloudForge.zip`（约 6.3 MB） | 解压即用。含全部源码、演示数据，以及**构建必需的第三方库 `ransac_sd`** |

**另外两件不在包里，需自己准备**

- **AGH 框架本体**：从官方仓库克隆（见 §3）——它是比赛指定的智能体底座，不属于本作品代码；
- **Agnes 模型 Key**：进比赛官方群领取。**没有 Key 智能体无法推理**（但 §7 的工具链自测不需要 Key）。

---

## 1. 环境前置

| 组件 | 要求 | 用途 |
|---|---|---|
| Node.js | ≥ 24.10 | AGH 的运行要求 |
| pnpm | 10.34.5 | `npm i -g pnpm@10.34.5` |
| CMake | ≥ 3.15 | 构建 C++ 核心 |
| Visual Studio | 含 C++ 工具集（MSVC） | 编译 CLI |
| Python 3.12 + cadquery | 可选 | 只有执行 CAD 导出（STEP/STL）时才需要；建议使用项目 `.venv-cad`（`pip install cadquery`） |

> AGH 官方只在 macOS 上做过验收，Windows 需要一些额外处理；本指南以 Windows 为准，坑见 §8。

---

## 2. 构建 cloudforge-cli（约 1 分钟）

```sh
cd <你的路径>\CloudForge
cmake -S hackathon/cli -B hackathon/cli/build
cmake --build hackathon/cli/build --config Release
hackathon\cli\build\Release\cloudforge-cli.exe        # 能打印用法即为成功
```

---

## 3. 构建随仓 AGH 框架（`agnes-harness/`）

```sh
cd <仓库根>\agnes-harness
pnpm install --frozen-lockfile
pnpm --filter @agnes/cli build:local
```

随仓 `agnes-harness/` 已包含本项目的 Windows 配套修复；不要另行检出旧上游 commit `a6b8319`。上游仓库为 `AgnesAI-Labs/agnes-harness`，仅作对照参考。

**可能遇到**：`serve` 启动报缺少 native 模块 `agnes-system.node` —— 从 CLI 快照拷到
`packages/system-node/dist/native/`，或跑 `pnpm --filter @agnes/system-node build:native`。
详见 `hackathon/SOLUTION.md` §10.5 第 3 条。

---

## 4. 安装 cloudforge-tools 插件

AGH 的插件治理是 inspect → install → trust → enable 四步。**我们随包提供了脚本**，
把四步串成幂等流程（可反复覆盖安装）：

```sh
# 脚本自己按 AGH_ROOT 找框架仓库（默认找同级的 ../agnes-harness），不用复制进 agnes-harness
export AGH_ROOT=/path/to/agnes-harness        # Windows PowerShell: $env:AGH_ROOT = (Resolve-Path ..\agnes-harness).Path

cd <CloudForge>
pnpm exec tsx hackathon/agh-scripts/install-package.mts
```

看到 `DONE: package installed, trusted and enabled` 即成功。脚本**在 CloudForge 目录执行**
（默认包路径是相对 daemon 工作区的相对路径），且 **daemon 必须已按 §5 从 CloudForge 目录启动**。

卸载用 `pnpm exec tsx hackathon/agh-scripts/remove-package.mts cloudforge-tools`。
诊断三连（只读）：

```sh
pnpm exec tsx hackathon/agh-scripts/probe-roster.mts        # 名册：entryUrl / slots / services
pnpm exec tsx hackathon/agh-scripts/probe-workspace.mts     # 工作区 / profile / 模型
pnpm exec tsx hackathon/agh-scripts/probe-assets.mts <integrity>   # 逐资源（含 1 MiB 预算校验）
```

> 官方 CLI 路径（`agnes.mjs package inspect|install|trust|enable`）也可以，但它要求
> TTY 交互确认，在脚本/CI 环境里不可用——这正是我们改用 SDK 脚本的原因。
> 细节见 `hackathon/agh-scripts/README.md`。

---

## 5. 启动 AGH 并配置模型

```sh
cd <仓库根>\CloudForge             # ← 必须在 CloudForge 目录启动
node ..\agnes-harness\packages\cli\dist\local\agnes.mjs serve
```

浏览器打开 **http://127.0.0.1:4177**：

1. 首次进入配置 **Agnes 模型**（填 Key），以后不用再配；
2. 新建会话，工作区选 `CloudForge`。

> ⚠️ 一定要从 `CloudForge` 目录启动：会话工作区即本仓库，`cloud-casting` Skill 与演示数据
> 才能被智能体发现；否则相对路径解析错位，工具找不到 CLI。

---

## 6. 跑通第一次分析

先造一份已知真值的点云（不需要外部数据）：

```sh
cloudforge-cli.exe synth demo.pcd      # 生成 demo.pcd（65000 点）+ demo.truth.json（已知真值）
```

然后在工作台对话里发一句：

> 使用 cloud-casting 流程分析 <demo.pcd 的完整路径>

智能体会自主走：`cloudforge_cloud_info` 侦察 → `cloudforge_detect` 检测 → 按 RMSE/软评分决定
`cloudforge_refine` 重试 → 输出参数报告。**每一步工具调用与审批都留在轨迹视图里，可导出——这是比赛的执行证据。**

也可以直接用真实扫描数据（Redwood 室内片段等），路径换成你的文件即可。

---

## 7. 不装 AGH？也能验证工具链

这两个自测**不经过模型**，只验证「插件 → CLI」调用链，几分钟出结果：

```sh
cd <你的路径>\CloudForge
node hackathon/cloudforge-tools/tools.test.mjs   # 预期 ALL PASS（7/7）
node hackathon/tests/run-suite.mjs               # 预期 11/11 PASS（正常/边界/失败三组）
```

（需先完成 §2 构建 CLI。）

---

## 8. 常见坑（完整 13 条见 `hackathon/SOLUTION.md` §10.5）

1. **serve 必须在 CloudForge 目录启动**，否则 Skill 与插件相对路径错位；
2. **改了插件代码后**要重跑 §4 的安装脚本（它会 disable→remove→install→trust→enable）；
3. **装了 Codex 等工具**可能污染 `~/.agh` 的 ACL，导致 daemon 报 "Private directory validation failed" →
   `icacls "%USERPROFILE%\.agh" /remove:g SU\CodexSandboxUsers`；
4. **桌面端 GUI 构建**必须用 `npm run tauri build`，别用裸 `cargo build --release`
   （会编出连 dev 服务器、双击报"拒绝连接"的版本）；
5. **面板（`cloudforge-panel`）已可正常挂载**：它注册在宿主官方右栏槽 `rightbar.session`，
   需**有活动会话**且该 profile 的 `capabilityCeiling` 含 `services`（本机 fragment 已加）。
   改前端时可用离线预览台免去会话前置条件：`node hackathon/cloudforge-panel/tools/preview.mjs`；
   改完记得重装（见 §4）并硬刷新（Ctrl+Shift+R）。集成细节见
   [`cloudforge-panel/PANEL-AGH.md`](cloudforge-panel/PANEL-AGH.md)；
6. 用自动化浏览器打开 4177 若报 `SEMANTIC_REJECTED (-32011)`，那是
   `WORKSPACE_INVALID / not-found`（`workspacePackages: require-project-trust` 需先信任工作区），
   与面板无关。

---

## 9. 上手后先读这几篇

| 文档 | 内容 |
|---|---|
| `PROJECT.md` | 项目总览、目录结构、三层架构 |
| `hackathon/SOLUTION.md` | 完整参赛方案；§10 是交接指南（资产位置、SOP、踩坑速查） |
| `hackathon/RUN.md` | 四个入口的日常运行命令 |
| `hackathon/README.md` | 参赛说明与评委复现路径 |
| `hackathon/declaration.md` | 独立完成声明与第三方素材披露（对外材料，改动需谨慎） |
