# core-contracts

## Summary
RANSAC_GUI 核心库（与 CloudForge/src-tauri/cpp 逐字节一致）是一条「Schnabel qRANSAC_SD 检测 → 误检过滤 → ModernRansacRefiner 鲁棒精拟合」流水线：FFI 层 ransac_detect/ransac_refine_instance 只收 float(*points)[3] 并只回传下标与 float 系数（PLANE=4/SPHERE=4/CYLINDER=7/CONE=7/TORUS=8 个，注意 TORUS 是 minorR 在前、CONE 前 3 个是顶点）；preset 只在两处起实际作用（启用哪些基元 + minInlierCount 按点数分档），其余阈值全部由点云分辨率自动调参和多轮衰减决定；加载侧 TXT/STL 会做质心居中、大 TXT（≥24MiB）走流式体素降到约 90 万点；输出内存全部由 ransac_free_output 释放（new[]/delete[] 必须留在同一 DLL 内）。

## Contracts
- RansacShapeType: PLANE=0 SPHERE=1 CYLINDER=2 CONE=3 TORUS=4 UNKNOWN=5（FFI 无 LINE）；preset: OUTDOOR_PLANES=0 MECHANICAL_FULL=1
- coefficients 布局（f32，检测后会被 refiner 原地改写）: PLANE[nx,ny,nz,d]｜SPHERE[cx,cy,cz,r]｜CYLINDER[px,py,pz,ax,ay,az,r]｜CONE[apexX,apexY,apexZ,ax,ay,az,halfAngle(rad)]｜TORUS[minorR,majorR,cx,cy,cz,nx,ny,nz]
- RansacInputCloud{const float(*points)[3]; int point_num}（只读，不持有）；RansacDetectParams{preset; int min_inlier_count(0=默认)}
- RansacShapeItem{type,inlier_count,int* inlier_indices,float* coefficients,int coefficient_count,double rmse,robust_sigma,soft_score}
- RansacDetectOutput{shapes,shape_count,int* remaining_indices,remaining_count,int input_point_count,inlier_point_sum}
- int ransac_detect(input,params,output)：0 成功；-1 参数非法；-3 分配失败（已自清理）；point_num<100 → 成功+0 形状
- int ransac_refine_instance(input,sel,sel_count,hint,params,output)：-1 非法或 sel_count<50；-2 有效下标<50；UNKNOWN hint=自动五类
- void ransac_free_output(output)：delete[] 每个 shapes[i].inlier_indices/coefficients、shapes、remaining_indices 并 memset 清零；Rust 禁止直接 free，new[]/delete[] 必须同库配对
- const char* ransac_shape_type_name(type)：静态字面量 Plane/Sphere/Cylinder/Cone/Torus/Unknown，无需释放
- Schnabel Params 注入值：Arch→仅平面/epsRatio .004/bmpRatio .008/18°/p=.005(n>80万)else.008/support=max(minInlier,max(800,n/500))；Full→五类/22°/p=.006(>80万)/.010(>20万)/else.008；公共 epsRatio .005/bmp .01/support=max(120,max(minInlier,min(n/1万,600)))
- min_inlier_count 默认逻辑：Arch n>40万→max(800,n/800)，n>4万→max(300,n/400)，否则 max(现值,200)；Full n>40万→max(150,n/6000)，n>4万→max(80,n/5000)，否则 100
- lastLoadMeta{fileSizeBytes,txtStreamDownsampled,outputPointCount,txtBytesScanned,progress%,phase 0/1/2}：仅 TXT(大小+点数+进度)与 BIN(大小+点数)填充，PLY/PCD/STL/OBJ 全零；txtStreamDownsampled 门控后处理（跳过去重/二次体素/限制）

## Details
# FFI 数据契约精读报告（RANSAC_GUI 核心库）

文件来源：`E:/C++/Point/RANSAC_GUI/{src,include}`，与 `E:/C++/Point/CloudForge/src-tauri/cpp/{src,include}` 逐文件 diff 确认完全一致（SAME）。第三方 qRANSAC_SD 位于 `third_party/ransac_sd`，编译定义 `POINTSWITHINDEX`（CMakeLists.txt:55，PUBLIC）。

## 1. 形状类型与 coefficients 布局

### 1.1 类型枚举

`DetectedShape::Type`（detected_shape.h，内部 11+1 类）：
PLANE=0, SPHERE, CYLINDER, CONE, TORUS, CIRCLE3D, ELLIPSE3D, NORMAL_PLANE, PERP_PLANE, LINE, UNKNOWN, TYPE_COUNT。

**FFI 层 `RansacShapeType`（ransac_lib_api.h）只有 6 个值**：PLANE=0, SPHERE=1, CYLINDER=2, CONE=3, TORUS=4, UNKNOWN=5。toApiType() 把 LINE 及其它全部折叠成 UNKNOWN；fromApiType() 反向映射 UNKNOWN→UNKNOWN。**FFI 边界永远不会出现 LINE**。

### 1.2 coefficients 布局（float 数组，单位 = 点云坐标单位，角度 = 弧度）

填充点：`schnabel_detector.cpp` 的 `coeffsFromShape()`（从 qRANSAC_SD `PrimitiveShape::Internal()` 提取）；之后 `modern_ransac_refiner.cpp` **原地改写为精拟合后的值**。

| 类型 | 个数 | 分量含义 |
|---|---|---|
| PLANE | 4 | v0..v2 = 单位法向量 n；v3 = d = `Plane::SignedDistToOrigin()`（有符号距离）。平面方程 n·p + d = 0 |
| SPHERE | 4 | v0..v2 = 球心；v3 = 半径 |
| CYLINDER | 7 | v0..v2 = 轴上一点（`Cylinder::AxisPosition()`）；v3..v5 = 轴方向（refiner 归一化为单位向量）；v6 = 半径 |
| CONE | 7 | v0..v2 = **顶点**（`Cone::Center()` 返回 apex，描述文本称"顶点"）；v3..v5 = 轴方向（归一化）；v6 = **半角，弧度**（refiner 限幅 [0.005, 1.55]） |
| TORUS | 8 | **v0 = 管半径 minorRadius r，v1 = 主半径 majorRadius R**（注意顺序：r 在前！），v2..v4 = 中心，v5..v7 = 轴法线（归一化） |
| LINE | 6 | v0..v2 = 点；v3..v5 = 方向（仅 GUI 内部/合成数据用，FFI 不可达） |

### 1.3 getDescription() 输出格式原文（detected_shape.cpp）

全部数字用 `std::fixed << std::setprecision(4)`（固定 4 位小数）：

- 无系数时：`getTypeName() + " (无系数)"`（如 `平面 (无系数)`）
- PLANE：`平面: {v0}x + {v1}y + {v2}z + {v3} = 0`（例：`平面: 0.0000x + 0.0000y + 1.0000z + -0.5000 = 0`，注意 d 可直接为负号拼接）
- SPHERE：`球体: 中心=({v0}, {v1}, {v2}), 半径={v3}`
- CYLINDER：`圆柱体: 轴点=({v0}, {v1}, {v2}), 轴向=({v3}, {v4}, {v5}), 半径={v6}`
- CONE：`锥体: 顶点=({v0}, {v1}, {v2}), 轴向=({v3}, {v4}, {v5}), 半角={v6} rad`
- TORUS（v.size()≥8）：`圆环: 中心=({v2}, {v3}, {v4}), 法线=({v5}, {v6}, {v7}), R={v1}, r={v0}`（文本中 R 先、r 后，与数组顺序相反）；<8 个系数时输出 `圆环 (参数不完整)`
- LINE：`直线: 点=({v0}, {v1}, {v2}), 方向=({v3}, {v4}, {v5})`
- default：`未知形状`
- 尾巴（所有类型）：` [{inlierCount} 个内点]`
- 当 `rmse > 0.0` 追加一行：`\n自适应 LO-RANSAC: RMSE={rmse}, 噪声σ={robustSigma}, 软评分={softScore}`

### 1.4 类型名对照表

| Type | getTypeName()（中文，UTF-8） | getTypeNameEN() |
|---|---|---|
| PLANE | 平面 | Plane |
| SPHERE | 球体 | Sphere |
| CYLINDER | 圆柱体 | Cylinder |
| CONE | 锥体 | Cone |
| TORUS | 圆环 | Torus |
| CIRCLE3D | 三维圆 | Circle3D |
| ELLIPSE3D | 三维椭圆 | Ellipse3D |
| NORMAL_PLANE | 法向平面 | NormalPlane |
| PERP_PLANE | 正交平面 | PerpPlane |
| LINE | 直线 | Line |
| default | 未知 | Unknown |

`ransac_shape_type_name(RansacShapeType)` 返回静态字符串字面量：Plane/Sphere/Cylinder/Cone/Torus/Unknown（头文件注释说"静态缓冲区，线程不安全"，实际是不可变的字面量）。

## 2. ransac_lib_api.cpp 的 preset→参数映射

### 2.1 makeConfig()（ransac_lib_api.cpp:33-54）

- `RANSAC_PRESET_MECHANICAL_FULL(=1)` → `RansacDetector::Config::Preset::Full`
- `RANSAC_PRESET_OUTDOOR_PLANES(=0)` 及**任何其它值、params==NULL** → `Preset::Architecture`
- `params->min_inlier_count > 0` 时覆盖 `cfg.minInlierCount`；**0 = 用库内默认（100）**
- 特例：`ransac_refine_instance` 中 params==NULL 时先 makeConfig 得到 Architecture，随后**强制改为 Full**（ransac_lib_api.cpp:142）

### 2.2 Config 结构体默认值（ransac_detector.h:28-59，两 preset 共享的基底）

planeDistThreshold=0.025, sphereDistThreshold=0.03, cylinderDistThreshold=0.05, maxIterations=8000, normalSearchRadius=0.10, minInlierCount=100, maxShapesToDetect=15, maxCylinders=3, maxSpheres=3, maxPlanes=10, sphereRadiusMin=0.05, sphereRadiusMax=2.0, cylinderRadiusMin=0.05, cylinderRadiusMax=1.5, coneDistThreshold=0.07, maxCones=3, coneAngleMin=0.1, coneAngleMax=1.2, torusDistThreshold=0.06, maxTori=2, lineDistThreshold=0.03, maxLines=3, clusterTolerance=0.12, minClusterSize=80, maxClusterSize=10000, minInlierRatio=0.20。（其中距离阈值会被 autoTune 按点云分辨率抬升，见 2.5。）

### 2.3 preset 在 buildSchnabelParamsForCount(n, span) 中的实际差异（ransac_detector.cpp:232-283）

公共基底：epsilon=0、bitmapEpsilon=0（→ 用 ratio×scale）、epsilonRatio=0.005、bitmapEpsilonRatio=0.01、supportPoints = max(120, max(minInlierCount, min(n/10000, 600)))。

| 字段 | OUTDOOR_PLANES (Architecture) | MECHANICAL_FULL (Full) |
|---|---|---|
| enablePlane | true | true |
| enableSphere/Cylinder/Cone/Torus | **全 false** | 全 true |
| epsilonRatio | **0.004** | 0.005 |
| bitmapEpsilonRatio | **0.008** | 0.01 |
| maxNormalDevDeg | **18.0°** | **22.0°** |
| probability | n>800000 ? 0.005 : 0.008 | n>800000→0.006；n>200000→0.010；否则 0.008 |
| supportPoints | max(minInlierCount, max(800, n/500)) | 公式基底（见上） |

### 2.4 默认 min_inlier_count 逻辑（applyPresetMinInliers，ransac_detector.cpp:104-125；n = 检测输入点数）

- Architecture：n>400000 → `max(800, n/800)`；n>40000 → `max(300, n/400)`；否则 `max(当前值, 200)`
- Full：n>400000 → `max(150, n/6000)`；n>40000 → `max(80, n/5000)`；否则保持当前值（默认 100 或 API 覆盖值）

### 2.5 自动调参（autoTuneParametersFromPoints，采样 ≤2500 点估 bbox）

resolution = sqrt(max{dx·dy, dx·dz, dy·dz}) / sqrt(count)；scale = 2×resolution。各阈值 = clamp(max(默认, k×scale), 上限)：plane k=1.0 上限 2.0；sphere k=1.2 上限 2.5；cylinder k=1.5 上限 3.0；cone k=1.8 上限 3.5；torus k=1.5 上限 3.0；line k=1.0 上限 2.0。clusterTolerance = min(max(0.12, 4×resolution), 3.0)；normalSearchRadius = min(max(0.10, 3×resolution), 3.0)。bboxSpan=max{dx,dy,dz,1e-4}：cylinderRadiusMin=min(0.05, span×0.002)、cylinderRadiusMax=min(1.5, span×2.5)、sphereRadiusMax=min(2.0, span×0.8)、coneAngleMax=min(1.2, 1.35)（=1.2，实际不变）。

### 2.6 渐进多轮检测（Progressive-X 风格）

- maxPasses：Architecture=8，Full=6；maxShapes：Architecture=500，Full=maxShapesToDetect×20=300
- 循环条件：活跃点数 > max(100, minInlierCount/2)
- 第 pass>0 轮：supportPoints = max(max(100, minInlierCount/3), round(support×0.72^pass))；epsilonRatio ×= max(0.62, 1−0.07×pass)；bitmapEpsilonRatio ×= max(0.70, 1−0.05×pass)
- 子集路径（refine_instance）每轮 randomSeed=pass（保证同一 AI 目标可复现）；全云路径 randomSeed=−1
- 检测级大云降采样：>950000 点（kDetectDirectLimit）→ 步长抽样到 ≤900000 点（kDetectTargetPoints），仅下标不拷贝坐标

### 2.7 filterShapesIndices 误检过滤（drop → 下标并入 remaining）

① inlierCount < minInlierCount；② patchSpan < span×0.0008 且 inlierCount < 2×minInlierCount；③ CYLINDER：半径 v6 < span×0.004，或 (patchSpan > 半径×35 且 半径 < span×0.012)；④ SPHERE：v3 < span×0.003；⑤ TORUS：v0(minor) < span×0.0015；⑥ PLANE（仅 Architecture）：inlierCount < minInlierCount（与①重复）。

## 3. 文件 IO

### 3.1 PointCloudIO（point_cloud_io.cpp，仅 3 个函数）

- **savePCDBinary**：写 PCD v0.7 头（VERSION 0.7 / FIELDS x y z / SIZE 4 4 4 / TYPE F F F / COUNT 1 1 1 / WIDTH n / HEIGHT 1 / VIEWPOINT 0 0 0 1 0 0 0 / POINTS n / DATA binary），数据为逐点 3×float32。
- **loadPCD**：解析头键 FIELDS(FIELD)/SIZE/TYPE/COUNT/POINTS/DATA；**支持 DATA binary 与 ascii，binary_compressed 直接失败**；必须含名为 x/y/z 的字段；标量小端 F4/F8/I1/I2/I4/U1/U2/U4；记录步长 = Σ(size×count)；ascii 按空白分词取第 xToken/yToken/zToken 个；binary 逐记录读，非有限(x,y,z)丢弃。
- **loadPLY**：首行必须恰为 "ply"；format 仅支持 ascii 与 binary_little_endian（**大端不支持**）；必须有 `element vertex N`；vertex 内 `property <type> <name>`（**出现 list 属性即失败**）；必须含名为 x/y/z 的属性（法线/颜色可选，忽略）；二进制按声明类型紧包记录读；ascii 按空白分词取对应列。二进制路径过滤非有限点，**ascii 路径不过滤**。成功条件：点数>0。

### 3.2 PointCloudGenerator::loadFromFile（按小写扩展名分发）

`.txt`→loadFromTXT；`.stl`→loadFromSTL；`.ply`；`.obj`→loadFromOBJImpl；`.bin`→loadFromNuScenesBIN；**其它一律按 PCD 解析**。入口先 `g_lastLoadMeta = {}`。

### 3.3 TXT（loadFromTXT + loadFromTxtScan，point_cloud_generator.cpp:802-1601）

行解析（parseLineFirst3Floats）：**每行取前 3 个可解析数字为 x,y,z**。快速路径分隔符：空格、`\t`、`,`、`;`、`"`（skipAsciiSpaces）；快速浮点解析器接受 `[+-]digits[.digits]`、**拒绝科学计数法（e/E 触发回退）**；回退用 strtof 通用扫描（跳到首个 [-+0-9] 字符，接受科学计数法）。**没有显式头/注释规则**：任何解析不出 3 个有限浮点的行都静默跳过（计 skippedLines）——所以 "X Y Z" 表头、"# comment" 天然被忽略。CRLF 兼容，空行跳过。

- **小 TXT（fileSize < 24 MiB，kTxtStreamThreshold=24×1024×1024）**：整文件读入缓冲，reserve=min(fileSize/88, 8,000,000)，逐行解析，全部点直接进结果，不降采样。**解析 0 行则返回 nullptr（失败）**。
- **大 TXT（≥24 MiB，streamMode=true，meta.txtStreamDownsampled=true）**：
  - 行步长 computeTxtLineStride：estLines=fileSize/88；estLines > 22,000,000（kTxtMaxParseLines）→ stride=ceil(estLines/22M)，否则 1。
  - Windows 优先 CreateFileMappingW 内存映射（FILE_FLAG_SEQUENTIAL_SCAN），失败回退 16 MiB 分块 fread（kTxtBufferCap=16×1024×1024）。
  - 阶段 0：预扫 bbox，每 2000 行采样 1 行（kBboxSampleStride=2000）。
  - 主扫描：先攒 6000 点（kTxtBootstrapPoints）作 bootstrap 并累计 bbox，随后激活体素网格：leaf = spanXY / (√900000 × 2.0)（kTxtTargetPoints=900000，kLeafCoeff=2.0），下限 max(spanZ, spanXY)×1e-7；网格 X/Y 外扩 22%、Z 外扩 max(35%×spanZ, leaf)+leaf；**网格单元硬上限 6,000,000（kMaxGridCells），超限回退 unordered_map 体素累加器**；每体素 double 累加 xyz + 计数。
  - 导出（阶段 1，进度 90→95→96%）：占据体素质心输出，步长限幅，上限 990,000 点（900000×1.1；hash-map 路径步长到 900000）；输出 < 720,000（8/10 目标）打警告。
  - **质心居中：所有 TXT（大小文件都）将每点减去均值 xyz**。
  - 阶段 2 = 完成，进度 100%。
  - 进度元数据：每 16 MiB 块更新 txtBytesScanned/phase 0/percent=min(88, byteOff×88/fileSize)。

### 3.4 STL（loadFromSTL）

读 80 字节头；判 ASCII：头以 "solid" 开头且第 6 字节为空格/\n/\r。ASCII：逐行 `sscanf(line, " vertex %f %f %f")`。二进制：偏移 80 处 uint32 LE 三角形数，之后每条 50 字节记录（法线 3f + 3 顶点 9f + uint16 attr）。顶点按 1e-6 整数量化哈希去重（xi=x×1e6 截断，hash = xi<<42 ^ yi<<21 ^ zi）。**结果质心居中**。不写任何 lastLoadMeta 字段（outputPointCount 保持 0）。

### 3.5 NuScenes BIN（loadFromNuScenesBIN）

**文件大小必须为 20 字节（5×float32）的非零整数倍**，否则失败（"BIN 不是 NuScenes float32 N×5 格式"）。每条记录 x,y,z,intensity,ring —— 只读前 3 个 float32；xyz 非有限丢弃。**不做质心居中**。meta：fileSizeBytes 与 outputPointCount 被填充。

### 3.6 OBJ（loadFromOBJImpl）

仅解析 `v ` 开头行（sscanf %f %f %f），1e-6 去重，不居中，不写 meta。

### 3.7 lastLoadMeta（PointCloudLoadMeta，point_cloud_generator.h:8-17；全局单例 g_lastLoadMeta）

| 字段 | 语义 |
|---|---|
| fileSizeBytes | 文件大小；仅 TXT 与 BIN 填写 |
| txtStreamDownsampled | 是否走了大 TXT 流式体素降采样（≥24 MiB）；**门控下游**：preprocess 跳过去重与自动体素、limitPointsForDisplay 用均匀抽稀而非二分体素 |
| outputPointCount | 最终点数；仅 TXT 与 BIN 填写（PLY/PCD/STL/OBJ 为 0） |
| txtBytesScanned | 已扫描字节数（后台线程写、GUI 轮询） |
| txtLoadProgressPercent | 0=扫描(≤88%)，90/95/96=导出各步，100=完成 |
| txtLoadPhase | **0=扫描 1=导出体素 2=完成**（加载返回后只剩 2） |

### 3.8 其它加载后处理常量

preprocess(removeDuplicates=true, voxelLeafSize=0)：去重公差 1e-6；>350,000 点且非大 TXT 时自动体素 leaf=span/1400（span 按 n/4000 步长采样）。downsampleToPointCount：体素叶二分 14 轮（lo=span×1e-6, hi=span×0.2），目标区间 [0.8×, 1.1×]maxPoints，失败回退均匀步长。limitPointsForDisplay 默认上限 850,000。

## 4. modern_ransac_refiner 的作用与指标

作用：Schnabel 检测+过滤后，对每个保留形状的内点做**鲁棒局部优化精拟合**（LO-RANSAC 的 local optimization 阶段），精拟合后的系数**原路写回** `coefficients->values`（float）。 plankar长度：7 轮 IRLS（Tukey M-估计）：

- PLANE：加权 PCA（协方差最小特征向量），法向符号与旧法向点积≥0；d=−n·质心。
- SPHERE：加权代数（Kåsa）4×4 LDLT 求解；radius²≤0 拒绝。
- CYLINDER/CONE/TORUS：7/8 参数数值 LM——中心差分雅可比（步长 max(1e-7, |x|×1e-5, span×1e-7)），阻尼 1e-6×(trace/n+1)，步长限幅 max(0.05, span×0.1)，每步最多 6 次半折回溯，代价不降才接受；每步归一化（轴单位化、CONE 半角 clamp[0.005,1.55] rad、圆柱半径 ≥1e-9、圆环 minor ≥1e-9 且 major ≥ minor+1e-9）。内点数 <4 不精拟合。

三个指标（对精拟合后的内点残差 r = 到该基元的有符号/绝对几何距离）：

- **rmse** = √(Σr²/n)：普通均方根几何距离，单位=点云单位。>0 时触发描述文本的第二行。
- **robustSigma** = 1.4826 × median(|r − median(r)|)（MAD→σ），下限 max(1e-9, span×1e-6)：内点噪声尺度的鲁棒估计（"噪声σ"）。
- **softScore** = (1/n) Σ exp(−0.5(r/σmax)²)，σmax = max(3σ, span×2e-4)：MAGSAC 风格截断高斯软内点占比，∈[0,1]，1.0 表示全部内点都在噪声水平。三者均为展示性指标，不改变 AI 标签/置信度。

Summary：refinedShapes（成功精拟合数）、medianRmse、medianNoiseSigma（对成功精拟合的形状取中位数），进 DetectStats。

## 5. SchnabelDetector::Params 全表（schnabel_detector.h:8-24）

| 字段 | struct 默认 | buildSchnabelParamsForCount 注入值 |
|---|---|---|
| epsilon | 0.0f | 0（≤0 → epsilonRatio×scale） |
| bitmapEpsilon | 0.0f | 0（≤0 → bitmapEpsilonRatio×scale） |
| epsilonRatio | 0.002f | 0.005（Architecture 0.004） |
| bitmapEpsilonRatio | 0.001f | 0.01（Architecture 0.008） |
| supportPoints | 500 (unsigned) | max(120, max(minInlierCount, min(n/10000,600)))；Arch：max(minInlierCount, max(800, n/500)) |
| maxNormalDevDeg | 20.0f | Arch 18.0 / Full 22.0 |
| probability | 0.008f | Arch：n>80万?0.005:0.008；Full：n>80万?0.006 / n>20万?0.010 / else 0.008 |
| enablePlane/Sphere/Cylinder/Cone/Torus | 全 true | Arch 仅 plane；Full 全 true；refine 子集 + hint≠UNKNOWN 时仅 hint 对应项 true |
| allowFitting | true | 不改（true→Options::LS_FITTING，false→NO_FITTING） |
| allowSimplification | false | 不改 |
| randomSeed | -1 (int) | 全云 −1；refine 子集 = pass 序号 |

运行期内部规则（detect / detectFromPoints 共用）：
- minSupport = supportPoints；若 count < minSupport → max(50, count/20)。
- scale = `PointCloud::getScale()` = bbox 三轴差的最大值（max-extent）；`cloud.calcNormals(0.01f×scale)`（qRANSAC_SD 内部 kNN=20 固定）。
- normalThresh = cos(maxNormalDevDeg×π/180)。
- 基元构造器边界（third_party/ransac_sd 头文件确认）：Plane 无界；Cylinder(minR=0, maxR=max(0.35×scale, 80×epsilon), maxLen=FLT_MAX)；Cone(maxConeRadius=min(0.35×scale, FLT_MAX), maxAngle=π/2, maxLen=FLT_MAX)；Sphere(minR=0, maxR=0.45×scale)；Torus(allowAppleShaped=false, minMinor=0, minMajor=0, maxMinor=0.35×scale, maxMajor=0.35×scale)。
- randomSeed≥0 时额外 `std::srand(seed)`（全局副作用）；同时传给 options.m_randomSeed。
- Identifier→类型：0=PLANE,1=SPHERE,2=CYLINDER,3=CONE,4=TORUS，其它 UNKNOWN（coefficients 为空）。
- 输出组装：Detect 返回的每形状点块从云尾反向回读（cursor 递减）；support < minSupport 的形状整块丢进 rejected；remaining_indices = 未分配点（云头部 unassigned 段）+ rejected。
- **下标回映射依赖 POINTSWITHINDEX**：`origIndexAt()` 在该宏下读 `Point.index`（detectFromPoints 已对每点写原始下标），否则返回云内偏移——子集路径会得到错误下标。构建系统已 `target_compile_definitions(ransac_core PUBLIC POINTSWITHINDEX)` 且 ransac_sd 自身 CMakeLists 也定义，移植必须保留。
- detectFromPoints 子集：越界 subset 下标静默跳过；count（有效点）<50 时由上层拒绝。

## 6. 所有权与释放规则

- `RansacDetectOutput` 由**调用方分配**（Rust 侧栈/Box 均可），库只填字段。库用 `new[]` 分配：`output->shapes`（RansacShapeItem[shape_count]，value-init 全零）、每个 `shapes[i].inlier_indices`（int[inlier_count]，仅当 inlier_count>0 且源 inlierIndices 非空）、每个 `shapes[i].coefficients`（float[coefficient_count]，仅当源系数非空）、`output->remaining_indices`（int[remaining_count]，仅当 >0）。
- `ransac_free_output(output)`：对 i<shape_count 逐个 `delete[] shapes[i].inlier_indices; delete[] shapes[i].coefficients;`，再 `delete[] shapes; delete[] remaining_indices;`，最后 memset 整个结构体为 0（可安全重复调用、可对全零结构调用、NULL 安全）。**Rust 侧绝不能用 Vec::from_raw_parts 直接回收——new[]/delete[] 必须与同一 DLL 的 CRT 配对**；正确做法是把结构体按 Copy 读出后调 ransac_free_output。
- 返回码：`ransac_detect`：0 成功；−1（input/output NULL、points NULL、point_num≤0）；−3（分配失败，此时 output 已被 ransac_free_output 清零）。point_num<100 不是错误——成功返回 0 形状。`ransac_refine_instance`：−1（参数空 / selected_count<50）；−2（过滤越界下标后有效数<50）；成功 0。注意它会把越界下标静默丢弃（>=point_num）。
- `input->points` 只读、调用后不留引用，Rust 的 Vec 可在调用后立即释放/复用。`ransac_shape_type_name` 返回静态字面量，不需释放。
- DetectStats 映射：output->input_point_count = stats.loadedPoints（=point_num 原始总数，即使子集精拟合也是原始数）；inlier_point_sum = Σ 保留形状的 inlierCount。

## 7. 相关外围头文件（GUI 层枚举，供 Rust 复刻 UI 参考）

- analysis_config.h：SceneType{CityOutdoor=0, Building, Park, Mechanical}；AnalysisLevel{L1_Geometric=0, L2_Region, L3_Semantic}；AnalysisRequest{scene, level 默认 CityOutdoor/L1}；AnalysisResult{shapes, remaining, stats, infoMessage, success=true}。
- region_segmenter.h（L2 区域分割，核心库仅有头）：Params{maxWorkingPoints=220000, normalRadiusRatio=0.008f, growRadiusRatio=0.012f, minNormalDot=0.965f, minRegionPoints=400(unsigned), maxRegions=120(int)}；paramsForScene(scene, pointCount, span) 与 segment() 的实现不在核心 src（GUI 侧）。

## Risks
- POINTSWITHINDEX 必须在编译 ransac_sd 时定义（构建系统 PUBLIC 定义），否则 detectFromPoints 子集路径的 inlier/remaining 下标会变成云内偏移而非原始下标——移植若重编译第三方库极易漏掉
- TORUS 系数顺序反直觉：[0]=minor r 在前、[1]=major R 在后，getDescription 却先打 R 后打 r；CONE 前 3 个是顶点(apex)不是中心；复刻展示层时两处都容易搞反
- coefficients 会被 ModernRansacRefiner 原地改写为精拟合值（float），且 rmse>0 才追加描述第二行——FFI 消费者拿到的不是 Schnabel 原始系数
- TXT 与 STL 加载后做质心居中（PLY/PCD/BIN/OBJ 不做）：所有系数（平面 d、球心等）都在居中坐标系里，回读原始坐标必须加回均值
- TXT 有两条行为完全不同的路径：≥24MiB 流式体素降到约 90 万点（>2200 万行还会隔行解析），<24MiB 全量解析；UI/进度/后处理必须按 meta.txtStreamDownsampled 分支，且大文件解析 0 行返回失败、小文件同理
- PLY 限制：仅 ascii 与 binary_little_endian，vertex 内出现 list 属性直接失败，ascii 路径不过滤非有限点（binary 过滤）；BIN 要求文件大小恰为 20 字节倍数；binary_compressed PCD 不支持
- 内存释放只能走 ransac_free_output（new[]/delete[] 同 CRT 配对）；Rust 直接 from_raw_parts 释放会踩跨 CRT 堆问题；inlier_indices/coefficients 在计数为 0 时是 NULL
- Architecture preset 最多 8 轮 × 500 形状上限，室外场景可能返回数百个平面；probability 是 qRANSAC_SD 提前终止参数不是置信度；randomSeed≥0 会调用全局 std::srand（副作用）
- 剩余两点易漏：remaining_indices = 未分配 + 支持不足被拒 + filterShapesIndices 过滤被拒三部分之和；ransac_refine_instance 有硬编码 50 点下限（API 边界与检测内部各检查一次，越界下标静默丢弃）