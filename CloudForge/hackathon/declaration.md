# 独立完成声明与素材来源说明

**参赛作品**：云铸——从百万点云到实体参数的智造引擎
**赛道**：主赛道 D. 工程设计与数字世界（方向 D3. 3D 设计与空间智能）
**队伍**：____________（成员：____________，指导教师：____________）

## 一、独立完成声明

本作品由本队成员独立完成。成员分工如下：

| 成员 | 分工 |
|---|---|
| ____ | （智能体工作流设计 / 插件开发 / 测试验证 / 演示视频等，按实际填写） |
| ____ | |
| ____ | |

签署：____________ 日期：____________

## 二、既有代码说明（参赛前自研）

| 组件 | 来源与使用方式 |
|---|---|
| C++ 几何核心（`src-tauri/cpp/` 中的检测与精拟合算法） | **参赛前自研**（前作 RANSAC_GUI 项目的核心库，本队此前的课程/科研项目成果）。本作品将其静态链接为算法底座，赛事期间**未修改任何算法代码**；赛事期间新开发的为智能体接入层：`cloudforge-cli` 命令行壳、`cloudforge-tools` AGH 插件、`cloudforge-panel` AGH 右栏面板、`cloud-casting` 工作流 Skill、测试三件套与演示材料。 |

## 三、第三方开源组件清单

| 组件 | 许可 | 用途 |
|---|---|---|
| Agnes Harness（AGH） | Apache-2.0 | 比赛指定的智能体运行与执行底座 |
| Agnes 模型 | 比赛官方提供 | 智能体推理（唯一使用的模型） |
| qRANSAC_SD / PrimitiveShapes 1.1（R. Schnabel、R. Wahl，**波恩大学** University of Bonn） | **仅限研究用途**（"may be used for research purposes only"），未授予再分发权利 | 点云几何基元检测（`src-tauri/cpp/third_party/ransac_sd`），源码零修改，保留原始 ReadMe 声明 |
| Eigen 5.0.1 | MPL2 | 线性代数（精拟合求解） |
| CadQuery | Apache-2.0 | CAD 代码执行导出（STEP/STL） |
| Tauri 2 / Vue 3 / Vite / Three.js | MIT | 桌面工作台 GUI 与点云渲染 |
| Three.js r180（`three.module.js` / `three.core.js` / `OrbitControls.js`，MIT） | MIT | **AGH 右栏面板**的 WebGL 点云与 CAD 渲染。仓库内副本位于 `hackathon/tools/viewer/three/`，赛事期间又原样复制到 `hackathon/cloudforge-panel/extensions/main/client/vendor/`（AGH 的资产通道只接受同源相对引用，且不解析裸 `three` 标识符）；除把两个 addon 的 `from 'three'` 改为相对路径外**零修改**，原始许可头保留 |

> **关于 qRANSAC_SD 的使用与分发边界（如实说明）**：本作品在竞赛（属研究/教学用途）范围内使用该库，
> 在其"仅限研究用途"的授权范围内；因其**未授予再分发权利**，本队公开的开源仓库不包含该目录
> （已列入 `.gitignore`），并在 `src-tauri/cpp/third_party/README.md` 说明获取渠道、应放置路径与构建校验方式。
> 学术引用：R. Schnabel, R. Wahl, R. Klein, *Efficient RANSAC for Point-Cloud Shape Detection*,
> Computer Graphics Forum, Vol. 26, No. 2, pp. 214–226, 2007.

## 四、数据与模型说明

- **演示数据**：Redwood 室内扫描公开数据集（livingroom1 / office1 片段）与自行生成的合成点云，来源已在材料中注明；
- **模型调用合规**：作品中的智能体规划、工具决策与报告生成全部使用 Agnes 模型；
  C++ 核心为确定性几何算法（非模型）；
- **本地分割环境（未接入作品）**：本队本地 WSL 环境中部署有第三方开源模型
  LitePT（"Lighter Yet Stronger Point Transformer"，arXiv:2512.13689，项目主页 litept.github.io，
  MIT License，Copyright (c) 2025 Photogrammetry and Remote Sensing Lab），
  部署时仅做了最小适配（事件协议前缀与入口脚本重命名）。该模型**未接入本作品的
  AGH 智能体执行链路**，作品主线与演示均不依赖它，作品的所有模型调用仅使用 Agnes 模型。

## 五、开源承诺

如获奖，本队将在规定时限（5 个工作日）内开源赛事期间开发的代码库
（`hackathon/` 目录及智能体接入层），并保留上述第三方组件的原始许可声明。
本作品代码库**现已公开**：https://github.com/Su-yu-s/CloudForge

**开源范围（如实界定）**：

- **本队自有代码**：Apache-2.0，全部公开；
- **第三方组件**：按其各自原始许可处理，**不计入本队开源范围**。其中 qRANSAC_SD 因仅授权研究用途、
  未授予再分发权利，公开仓库不含该目录（已列入 `.gitignore`，并附获取说明使评委仍可完整复现构建）；
  其余组件（Eigen、Tauri / Vue 3 / Vite / Three.js、CadQuery 等）按其许可随仓库分发并保留原始声明。

