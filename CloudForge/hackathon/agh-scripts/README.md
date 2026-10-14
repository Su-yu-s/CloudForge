# AGH 包管理与诊断脚本（随作品提供）

这些脚本通过 **AGH 官方管理 SDK** 直调 daemon 完成插件包治理与诊断，是官方程序化管理路径。
上游框架仓库是 [`AgnesAI-Labs/agnes-harness`](https://github.com/AgnesAI-Labs/agnes-harness)（只读，不修改）。

| 脚本 | 作用 |
|---|---|
| `bootstrap.mts` | 共用引导：定位 AGH → 动态加载官方 SDK → 连本机 daemon |
| `install-package.mts` | 幂等安装/覆盖：disable → remove → inspect → install → trust → enable |
| `update-cloudforge-tools.mts` | 经完整性与能力哈希检查更新工具包，保留已安装包；未安装时 install → trust → enable |
| `remove-package.mts` | 卸载：disable（如已启用）→ remove |
| `probe-roster.mts` | 诊断：客户端模块名册（entryUrl / slots / slotCatalogVersion / services） |
| `probe-assets.mts` | 诊断：逐个读 client 资源，验证 daemon 能否返回（见下方「1 MiB 预算」） |
| `probe-workspace.mts` | 诊断：daemon 认哪些工作区、profile 解析、模型是否配好 |

## 为什么需要它们

AGH 的 CLI 包管理命令（`agh package …`）要求 **TTY 交互确认**（显示修订号与信任变更后要求人工确认），
在脚本/CI 等非交互环境中不可用。SDK 直调绕开交互，且把 disable→remove→install→trust→enable 串成幂等流程，
便于反复覆盖安装。

## 用法

**不需要**把脚本复制进 agnes-harness 仓库。`bootstrap.mts` 会自己找到框架：
按 `AGH_ROOT` 环境变量 → 本仓库同级的 `../agnes-harness` 依次找，
找到后用**动态 import** 加载 `packages/sdk/src/*.ts`（静态 import 只有放在框架树内才解析得了）。

```powershell
# 从 CloudForge 项目根目录执行；框架不在同级目录时指定实际位置
$env:AGH_ROOT = (Resolve-Path ../agnes-harness).Path
# 可选：默认 local-dev
$env:AGH_PROFILE = "local-dev"

$tsx = "../agnes-harness/node_modules/.bin/tsx.cmd"

# 装 / 卸
& $tsx hackathon\agh-scripts\install-package.mts "file:./hackathon/cloudforge-panel" "cloudforge-panel"
& $tsx hackathon\agh-scripts\remove-package.mts cloudforge-panel

# 已安装 CloudForge 工具包时，优先保留包并更新；不启动模型或实际核验
& $tsx hackathon\agh-scripts\update-cloudforge-tools.mts

# 诊断（只读）
& $tsx hackathon\agh-scripts\probe-roster.mts
& $tsx hackathon\agh-scripts\probe-workspace.mts
& $tsx hackathon\agh-scripts\probe-assets.mts <integrity>
```

`install-package.mts` 支持两个位置参数：`[包路径] [包 id]`，默认 `file:./hackathon/cloudforge-tools` 与
`cloudforge-tools`——**默认包路径是相对 daemon 工作区的相对路径，所以 daemon 必须从 CloudForge 目录启动**
（见 `hackathon/ONBOARDING.md` §5），否则相对解析会错位。

## 两个只有探针能看见的坑

**1. 每个 client 资源的 RPC 结果 JSON 硬上限 1 MiB。**
`packages/protocol/src/package-admin.ts:605` 的 `inspectJsonData(value, 1048576)`，base64 还要涨 4/3
⇒ 原始字节必须 ≲780 KB。超限时 daemon 抛 `RESULT_INVALID`，而 web 层把「未找到 / 拒绝 / 不可达」
统一变成**同一个空 body 的 404**，同目录其它文件却全是 200，肉眼极难定位。
`probe-assets.mts` 会把每个资源的 base64 长度与预算占比打出来。

**2. `probe-workspace.mts` 里 `config.get` 返回 -32011 是预期的。**
本探针的客户端**没有绑定任何工作区**。判断 daemon 是否健康要看 `workspace.list` 能否列出工作区
且 `available: true`。若浏览器侧也报 `SEMANTIC_REJECTED (-32011)` 且工作区列表空白，
先查 ACL 污染（见 `PANEL-AGH.md` 陷阱 #17）。

## 前提

- AGH daemon 正在运行（脚本读 `~/.agh/data/daemon/discovery.json` 取 socket 与 owner 身份）；
- 若 daemon 未运行，先按 `hackathon/ONBOARDING.md` 启动。

## 相关

- 面板集成全流程与 20 条踩坑：`hackathon/cloudforge-panel/PANEL-AGH.md`
- 官方 CLI 路径（真人终端里通常可用）：`agnes.mjs package inspect|install|trust|enable`
