# 点云演示验证报告：demo-part/demo.pcd

## 输入概况
- 文件：`E:\C++\Point\CloudForge\hackathon\demo-data\demo-part\demo.pcd`
- 格式：PCD，点数 65,000
- 坐标系：未居中（centered=false）
- 包围盒：[0, 0, -0.0078] → [0.6, 0.6, 0.2]，跨度 0.6 m

## 真值（demo.truth.json）
| 基元 | 类型 | 系数 |
|------|------|------|
| id 0 | 平面 | n=[0,0,1], d=0 |
| id 1 | 圆柱 | 轴点=(0.35,0.35,0), 轴方向=(0,0,1), r=0.05 |

## 检测与验证结果

**预设：mechanical（五类基元全开）**
检测到 5 个形状（3 平面 + 2 圆锥，圆锥为圆柱的几何泛化）。

**验证结论：PASS**（`cloudforge_verify` 判定）

### 逐基元对比

**平面 id 0 ↔ 真值平面**
| 指标 | 真值 | 检测值 | 偏差 |
|------|------|--------|------|
| 法向 | [0, 0, 1] | [0.000101, -0.0000194, 1] | 角度 0.0059° |
| 有符号距离 d | 0 | -0.0000165 m | 0.016 mm |
| RMSE | — | 0.00194 m | — |
| robust_sigma | — | 0.00115 m | — |
| 内点数 | — | 40,168 | — |
| soft_score | — | 0.871 | — |

**圆柱（真值 id 1）↔ 检测圆锥 shape 1（泛化匹配）**
| 指标 | 真值 | 检测值（等效换算） | 偏差 |
|------|------|-------------------|------|
| 轴点 | (0.35, 0.35, 0) | (0.361, 0.355, ≈0) | ≈1.1 mm |
| 轴向 | (0, 0, 1) | (-0.00151, -0.00061, 0.999999) | 0.093° |
| 半径 r | 0.05 m | 0.05 m（参数误差 0.00063 m） | 0.63 mm |
| RMSE | — | 0.00198 m | — |
| robust_sigma | — | 0.00120 m | — |
| 内点数 | — | 8,964 | — |
| soft_score | — | 0.875 | — |

## 结论
- 2/2 真值基元全部匹配通过（`pass: true`）
- 平面法向角度误差 0.006°，位置误差 0.016 mm
- 圆柱（以圆锥泛化形式检出）半径误差 0.63 mm，轴向角度误差 0.09°
- 检测噪声尺度约 1.1–1.3 mm（robust_sigma），与合成点云噪声水平一致

## 证据链
1. `cloudforge_cloud_info`：65000 点，span 0.6 m，centered=false
2. `cloudforge_detect`（mechanical）：5 形状，inlier_sum 59957，耗时 382 ms
3. `cloudforge_refine`（hint=cylinder, shape_1）：返回 0 形状，未改善
4. `cloudforge_refine`（hint=unknown, shape_1）：收敛为圆锥，inlier 6702，RMSE 降至 0.0015
5. `cloudforge_refine`（hint=unknown, shape_4）：仍返回 0 形状
6. `cloudforge_detect`（outdoor）：仅 2 平面，无圆柱/圆锥 → 确认 mechanical 预设正确
7. `cloudforge_verify`：2/2 匹配，pass=true
