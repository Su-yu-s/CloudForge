# 第三方组件（third_party）

本目录下的代码**不是本作品的原创代码**，各自适用其原始许可，与仓库根 `LICENSE`（Apache-2.0，仅覆盖本项目自有代码）无关。

| 组件 | 是否随仓库分发 | 许可 | 说明 |
|---|---|---|---|
| `eigen-5.0.1/` | ✅ 是 | MPL2 / BSD / Apache-2.0 等（见其 `COPYING.*`、`LICENSE`） | Eigen 5 头文件库，CMake 以 `target_include_directories` 引入 |
| `ransac_sd/` | ❌ **否**（已加入 `.gitignore`） | **仅授权研究用途**（"may be used for research purposes only"，见其 `ReadMe.txt`），未授予再分发权利 | qRANSAC_SD 原始实现，见下方获取方式 |

## ransac_sd 不属于本仓库分发范围的原因

`ransac_sd` 是 Ruwen Schnabel 与 Roland Wahl（波恩大学）2006–2009 年的原始实现，用于论文：

> R. Schnabel, R. Wahl, R. Klein, *Efficient RANSAC for Point-Cloud Shape Detection*,
> Computer Graphics Forum, Vol. 26, No. 2, pp. 214–226, 2007.

其 `ReadMe.txt` 明确写明 **"This software may be used for research purposes only."**——只授权研究用途，**没有授予再分发权利**。因此本仓库不包含它，避免超出授权范围公开分发；这不影响其在本作品（学术/竞赛研究用途）中按原许可使用。

## 复现构建：如何补齐 ransac_sd

克隆仓库后，从上述论文的官方发布渠道（波恩大学计算机图形学组页面 / 论文页附带的 PrimitiveShapes 1.1 源码包）获取 `ransac_sd` 源码，放到：

```
src-tauri/cpp/third_party/ransac_sd/
├── CMakeLists.txt
├── RansacShapeDetector.h / .cpp
├── Plane*/Sphere*/Cylinder*/Cone*/Torus*PrimitiveShape*.{h,cpp}
├── MiscLib/
├── GfxTL/
└── ...（其余文件，保持原包完整）
```

随后 CMake 会在配置阶段通过 `add_subdirectory(third_party/ransac_sd ...)` 自动纳入构建；若该目录缺失，配置阶段会直接报错（这是预期行为，避免静默产出不完整的库）。

校验：补齐后 `cmake -S hackathon/cli -B hackathon/cli/build && cmake --build hackathon/cli/build --config Release` 应能产出 `cloudforge-cli.exe`。
