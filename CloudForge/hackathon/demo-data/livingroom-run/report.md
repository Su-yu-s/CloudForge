# CloudForge 最新检测结果 · CAD / STEP / verify 报告

## 结论

- 已选取工作区内最新的 CloudForge 检测结果：`hackathon/demo-data/livingroom-run/result.json`。
- 检测结果共 38 个 Plane，源点云为 `data/livingroom1-fragments-ply/cloud_bin_0.ply`（通过同目录 `info.json` 确认），点数 196,133，包围盒 span 约 3.407 m。
- 因全部形状为 Plane，已按 cloud-casting 规则走“建筑剖面骨架”路线（floor/ceil + 竖直墙），生成 CadQuery 模型并导出 STEP：`hackathon/demo-data/livingroom-run/livingroom-latest.step`。
- STEP 生成成功：14 个 solids，bbox 约 `2.91 x 1.60 x 1.53 m`，文件 837,027 bytes；bbox 未超过点云 span 的 1.5 倍（3.407 × 1.5 = 5.111 m），通过尺寸合理性检查。
- 已尝试执行 FreeCAD verify 流程，但当前环境未安装 FreeCAD（`hackathon/tools/find-freecad.py` 无可用候选路径），因此 `freecad-verify.py` 的 OpenCASCADE 二次验证未能执行；该验证缺口已在“验证结果”中如实说明。
- 已补充使用工作区现有 CadQuery/预览证据：`livingroom-latest.step.preview.stl.json` 显示 STEP 预览网格有 14 solids、体积 1.123177 m³、bbox `2.9140625 x 1.5954449 x 1.5270369 m`，可作为当前环境下的替代 verify 结果。
- 已将 FreeCAD 自动预览流程执行：`find-freecad.py` 返回 `freecad_exe: null`；由于无可执行 GUI，无法按工具链自动打开 STEP。该限制已纳入下方验证结果。

## 输入概况

- 检测结果：`hackathon/demo-data/livingroom-run/result.json`
- 源点云：`data/livingroom1-fragments-ply/cloud_bin_0.ply`
- 点云信息（来自 `info.json`）：
  - `points`: 196,133
  - `format`: ply
  - `centered`: false
  - `bbox_min`: `[0.55859375, 0.83203125, 0.566637158]`
  - `bbox_max`: `[3.96608973, 2.42747617, 2.55859375]`
  - `span`: 3.40749598 m

## 检测证据

- 形状数量：38
- 内点总数：159,812
- 剩余点数：36,321
- 形状类型：38 × Plane
- 主要证据指标（前 5 个 shape）：
  - id 0: Plane, inlier 31,939, rmse 0.0034919, robust_sigma 0.0010971, soft_score 0.83267
  - id 1: Plane, inlier 43,507, rmse 0.0114682, robust_sigma 0.0035712, soft_score 0.79232
  - id 2: Plane, inlier 14,113, rmse 0.0088373, robust_sigma 0.0045863, soft_score 0.84658
  - id 3: Plane, inlier 5,452, rmse 0.0150097, robust_sigma 0.0020033, soft_score 0.80522
  - id 4: Plane, inlier 7,857, rmse 0.0037050, robust_sigma 0.0019955, soft_score 0.86103

## CAD / STEP 交付

- 导出路径：`hackathon\demo-data\livingroom-run\livingroom-latest.step`
- 导出方式：`python hackathon/tools/room-skeleton.py hackathon/demo-data/livingroom-run/result.json hackathon/demo-data/livingroom-run/livingroom-latest.step 800`
- 模型统计：14 solids（12 个 wall 实体 + floor + ceil）
- 模型 bbox：`2.91 x 1.60 x 1.53 m`
- 文件大小：837,027 bytes
- 生成说明：STEP 为“建筑剖面式骨架”（全高隔墙 + 地板 + 顶棚），坐标系与源点云一致（centered=false，未质心居中）。
- 已知告警：生成过程打印字体告警（`mstmc.ttf` not a TrueType or OpenType font），不影响 STEP 几何写出。

## 验证结果（verify）

- 尺寸合理性检查：通过。STEP bbox `2.91 x 1.60 x 1.53 m` 均在点云 span（3.407 m）×1.5 的限制内。
- 替代 verify（当前环境可用）：`livingroom-latest.step.preview.stl.json` 显示：
  - `ok`: true
  - `solids`: 14
  - `volume_m3`: 1.123176719269972
  - `bbox_m`: `[2.9140625, 1.5954449176791639, 1.5270369052890003]`
  - `facets`: 756、`points`: 1218、`stl_bytes`: 37884
- FreeCAD 二次验证：未执行。原因：当前机器未安装 FreeCAD / freecadcmd，`find-freecad.py` 无候选路径，因此 `freecad-verify.py` 无法通过 OpenCASCADE 再读 STEP。
- 自动预览：未执行。原因同上（无 FreeCAD GUI 可定位与启动）。
- 依赖环境：本次运行前缺少 `cadquery`，已通过 `python -m pip install cadquery` 安装成功，之后完成 STEP 导出与预览证据生成。

## 可复核命令

```powershell
cd CloudForge
python hackathon/tools/find-freecad.py
python hackathon/tools/room-skeleton.py hackathon/demo-data/livingroom-run/result.json hackathon/demo-data/livingroom-run/livingroom-latest.step 800
```

如后续安装 FreeCAD，可再执行：

```powershell
# 先定位 FreeCAD 路径（找到后替换实际路径）
python hackathon/tools/find-freecad.py
# 用 freecadcmd 跑二次验证（示例：假设找到 E:\FreeCAD\bin\freecadcmd.exe）
E:\FreeCAD\bin\freecadcmd.exe hackathon/tools/freecad-verify.py hackathon/demo-data/livingroom-run/livingroom-latest.step
python hackathon/tools/preview-freecad.py <freecad_exe> hackathon\demo-data\livingroom-run\livingroom-latest.step
```
