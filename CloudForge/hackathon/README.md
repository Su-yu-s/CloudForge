# 云铸 —— 从百万点云到实体参数的智造引擎

2026 年江苏省高校 AI+科学与工程创新实践黑客松参赛作品。
用 Agnes + AGH 打造"云铸"智能体：自主规划点云分割、拟合几何基元、验证误差并重试，
把三维扫描逆向建模从数小时压缩到一次对话，输出可复核的参数报告。

- **主赛道**：D. 工程设计与数字世界
- **具体方向**：D3. 3D 设计与空间智能
- **完整参赛规划**：见 [PLAN.md](PLAN.md)

## 架构

```
Agnes Harness（AGH 智能体底座：会话 / 审批 / 轨迹留证）
  ├─ cloudforge-tools 插件（cloudforge-tools/，本目录）— 6 个智能体工具
  │    └─ 子进程调用 ↓
  ├─ cloudforge-cli（cli/）— C++17 命令行壳
  │    └─ 静态链接 CloudForge/src-tauri/cpp 核心库（qRANSAC_SD 检测 + LO-RANSAC 精拟合，零改动）
  └─ .agh/skills/cloud-casting（仓库根）— 云铸工作流 Skill（指导智能体规划/反馈/验证）
```

## 组件

| 目录 | 内容 |
|---|---|
| [cli/](cli/) | `cloudforge-cli.exe`：info / detect / refine / synth / verify / cad 六个子命令，JSON 输出 |
| [cloudforge-tools/](cloudforge-tools/) | AGH 后端插件（零依赖 index.mjs）+ 工具级自测 tools.test.mjs |
| [cloudforge-panel/](cloudforge-panel/) | **AGH 右栏控制台**（点云 / CAD / 验证 / 报告四页签）。集成约束见 [PANEL-AGH.md](cloudforge-panel/PANEL-AGH.md)，离线预览台 `node hackathon/cloudforge-panel/tools/preview.mjs` |
| [panel evidence/](evidence/panel/) | 面板截图（STEP→STL 预览 + 模型信息） |
| [demo-data/](demo-data/) | 演示数据产物（Redwood livingroom1 检测结果、合成件 CAD 导出等） |
| [PLAN.md](PLAN.md) | 参赛规划与里程碑 |
| 仓库根 `.agh/skills/cloud-casting/` | AGH 工作区 Skill（智能体工作流说明书） |

## 从零搭建（评委 / 队友复现路径）

前置：Node.js ≥ 24.10、pnpm 10.34.5、CMake ≥ 3.15、MSVC（含 C++ 工具集）。
**逐步骤的详细版（含前置、踩坑、验证）见 [ONBOARDING.md](ONBOARDING.md)。**

```sh
# 1. 构建 AGH（源码：github.com/AgnesAI-Labs/agnes-harness，不在本仓库内）
git clone https://github.com/AgnesAI-Labs/agnes-harness.git && cd agnes-harness
git checkout a6b8319 && pnpm install --frozen-lockfile && pnpm --filter @agnes/cli build:local

# 2. 构建 cloudforge-cli
cd CloudForge
cmake -S hackathon/cli -B hackathon/cli/build
cmake --build hackathon/cli/build --config Release

# 3. 启动 AGH（必须在 CloudForge 目录：工作区 = 本仓库，Skill 与演示数据都在其中）
node ../agnes-harness/packages/cli/dist/local/agnes.mjs serve

# 4. 安装插件（幂等，自动 inspect→install→trust→enable）
#    脚本自己按 AGH_ROOT 找框架仓库，**不用**先复制进 agnes-harness
$env:AGH_ROOT = "E:/C++/Point/agnes-harness"
node $env:AGH_ROOT/node_modules/tsx/dist/cli.mjs hackathon/agh-scripts/install-package.mts "file:./hackathon/cloudforge-panel" "cloudforge-panel"

# 5. 打开 http://127.0.0.1:4177 → 配置 Agnes 模型 → 创建会话，发送：
#    使用 cloud-casting 流程分析 <点云路径>
```

工具级自测（不经模型，直接验证 CLI 调用链）：

```sh
node hackathon/cloudforge-tools/tools.test.mjs   # 预期 ALL PASS（7/7）
```

### 右栏控制台（`cloudforge-panel`）

面板挂在宿主官方右栏槽 `rightbar.session`，**需要有活动会话**。四个页签：

| 页签 | 内容 |
|---|---|
| 点云 | 真实点云视口（three r180）+ HUD + 四种视图模式 + 几何网格叠加（coefficients → 半透明实体）+ 形状清单（内点数 / RMSE / σ / 软评分，点击高亮并相机聚焦） |
| CAD | STEP→STL 预览 + 网格覆盖误差自检 + 体积/包围盒 + 交付物卡（FreeCAD 打开 / GUI 预览） |
| 验证 | 回归套件 11 项（normal/boundary/failure 三组）+ 现跑 `cloudforge verify` + 鲁棒性 12 格热力 |
| 报告 | 智能体报告原文 + 场景换算（净高/开间/墙厚/平整度）+ **AGH 执行链**（plan→call→verify 三步 + `agnes-3.0-flash`）+ 导出记录 |

改前端不必先开 AGH 会话，用离线预览台（加载真实 client 与真实后端 handler，只把
`react` 换成 shim、`services.call` 换成同源 fetch，并复刻 1 MiB 响应校验）：

```sh
node hackathon/cloudforge-panel/tools/preview.mjs   # http://127.0.0.1:5199/
```

集成约束、服务白名单、传输预算与已知实现陷阱：[`cloudforge-panel/PANEL-AGH.md`](cloudforge-panel/PANEL-AGH.md)。

## 六个智能体工具

| 工具 | 功能 | 审批 |
|---|---|---|
| `cloudforge_cloud_info` | 点云元信息：点数/包围盒/格式诊断 | 免审批（只读） |
| `cloudforge_detect` | RANSAC 基元检测，返回系数 + RMSE/噪声σ/软评分 | 需审批（写输出目录） |
| `cloudforge_refine` | 点子集鲁棒精拟合（<50 点由核心拒绝） | 需审批 |
| `cloudforge_synth` | 生成已知真值合成点云（验证基准） | 需审批 |
| `cloudforge_verify` | 结果 vs 真值误差判定（支持圆柱↔圆锥泛化匹配） | 免审批（只读） |
| `cloudforge_cad_export` | 检测结果 → 可执行 CadQuery 脚本 → 可编辑参数化 CAD 模型（STEP） | 需审批 |

## 已验证结果（合成基准）

65000 点合成场景（平面 z=0 + 圆柱 r=0.05m）：

- 平面：参数误差 **1.6e-05 m**，法向角误差 **0.006°**（exact 匹配）
- 圆柱：经圆锥泛化匹配，等效半径误差 **0.68 mm**，轴向角误差 **0.05°**
- 边界：40168 内点精拟合 → 1 个平面；10 个点 → 核心拒绝（rc=-1，正确失败路径）
- 真实数据：Redwood livingroom1 片段 196133 点，1.0 秒检出 43 个平面，内点覆盖 82.3%
- **CAD 交付**：检测产物 → CadQuery 脚本 → 执行生成 STEP，模型 bbox 0.600×0.600×0.206
  与真值零件（0.6×0.6×0.2）吻合；测试三件套 **11/11 PASS**（`tests/results/suite-result.json`）

## 许可与声明

- 本作品代码随获奖开源要求发布；`CloudForge/src-tauri/cpp/third_party/ransac_sd`
  为 Schnabel 等 qRANSAC_SD 原作，保留其原始许可与声明
- 智能体推理使用 Agnes 模型（比赛模型调用合规要求）；C++ 核心为本地算法，无外部模型调用
