# viewer

## Summary
该 Qt OpenGL viewer 是一个纯点渲染器：所有内容（底云、形状内点、剩余点）都是 GL_POINTS 圆形软边点，用单一 shader（uniform 颜色 + 亮度 + alpha）绘制；形状没有任何网格/线框几何，只按 7 色调色板给内点着色。相机是四元数 trackball（eye=center+R*(0,0,dist)，透视 45°），左键旋转、中/右键平移、滚轮缩放。取景中心为点云质心、距离=span*1.5。无坐标轴/网格/包围盒，唯一 HUD 是顶部 34px 任务状态条（文本+不定进度条）。viewModeGroup 在 main_window.cpp：原始/语义/实例/几何 4 个互斥按钮，分别切 setPointCloud 与不同 showDetectionResults 数据。选中反馈=点大小+1、alpha 变 1、关深度测试最后绘制，其余形状淡到 alpha 0.18。

## Contracts
- setPointCloud(cloud: {x,y,z}[]) — 原始视图：清空形状/剩余/高亮/solo，center=质心，span=采样包围盒最大边(≤5000采样)，distance=span*1.5，base云颜色#56606E，bg/remaining禁用
- showDetectionResults(shapes: {inliers:{x,y,z}[]}[], remaining, baseCloud) — 检测视图：base禁用；bg=整个baseCloud颜色#B2B8C2(α0.45)；shape_i=palette[i%7]的inliers点云(α0.94)；remaining=#808996；remainingVisible=true，highlight=-1；仅当baseCloud指针(场景)变化时重新取景
- setShapeVisible(i, visible) — 切换形状显隐；若恰好剩1个可见→soloMode=true且自动highlight该形状
- setRemainingVisible(v) / setHighlightIndex(i)(越界归-1) / showAllShapes()(全显+remaining显示+取消高亮) / showOnlyShape(i)(只显示i+隐藏remaining+高亮i+solo)
- clear() — 释放全部GPU云与CPU引用；pause/resumeRendering() — 原Qt为30ms脏标记定时器，Three.js用rAF等价
- setTaskActive(active, msg) / setTaskMessage(msg) — 顶部34px悬浮HUD(白卡#fff/边#e1e4e8/圆角7，文字12px #59616b，2px不定进度条轨#e5e7ea块#2d3137)
- fitToCloud() — 保留当前旋转，center=质心、distance=span*1.5；setFrontView=identity；setSideView=Ry(90°)；setTopView=Rx(-90°)；setZUpView=fromDirection(-4,-6,4),up(0,0,1)（只改旋转，不动距离/中心）
- objectColor(i) — 静态7色调色板 #e85d5d,#5e6ad2,#29a9a0,#b05ac8,#db8e2f,#35a66f,#74859b，i%7；形状颜色唯一来源
- DetectedShape 契约：viewer 只读 shapes[i].inliers（点数组），形状参数(平面法线/球心半径/柱轴等)被完全忽略——Three.js 端同样无需形状几何 mesh
- 点云容量契约：>850000 点时按 step=n/750000 等距抽稀上传（约75万上限）
- viewModeGroup(位于 main_window.cpp:552-603)：4 个互斥按钮 原始(0)/语义(1)/实例(2)/几何(3)；0→setPointCloud(当前云)；1/2→showDetectionResults(AI显示形状,空remaining,AI云)，1仅语义任务、2仅实例任务可用；3→showDetectionResults(所选实例的精修shapes/remaining)，需存在该实例精修结果；检测完成后自动切到1(语义)或2(实例)；旁边有'回到全景'工具按钮→fitToCloud（'框选'与'更多'按钮已隐藏）

## Details
# PointCloudViewerWidget → Three.js 复刻规格

## 0. 架构要点（照抄即可）
- 场景里一切都是 **GL_POINTS 点云**，没有任何 mesh/线框/几何体。每朵点云 = 一个 Three.js `Points` + 独立 `ShaderMaterial`（uniform 提供 uColor/uPointSize/uBrightness/uAlpha）。
- 每朵云单一颜色（uniform），不做逐点着色。原 cpp 把颜色 float 也写进 VBO（每点 6 float）但 shader 根本没绑 aCol 属性——纯浪费，Three.js 端只传 position 即可。
- 渲染循环：Qt 用 30ms QTimer + `_dirty` 脏标记；Three.js 用 rAF 或"按需渲染"等价。
- `glDepthFunc(GL_LEQUAL)`，标准 src-alpha 混合，画布不透明（renderer alpha:false）。

## 1. 点渲染 Shader（逐行复刻）
```glsl
// vertex
uniform mat4 projectionMatrix, modelViewMatrix; // three 自带
uniform float uPointSize; uniform vec3 uColor; varying vec3 vCol;
void main(){ gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0);
  gl_PointSize = uPointSize; vCol = uColor; }        // 注意：固定像素大小，无透视衰减(sizeAttenuation=false 语义)
// fragment
uniform float uBrightness, uAlpha; varying vec3 vCol;
void main(){
  vec2 d = gl_PointCoord - 0.5; float r2 = dot(d,d);
  if (r2 > 0.25) discard;                             // 圆点，半径0.5
  float alpha = 1.0 - smoothstep(0.08, 0.25, r2);     // 实心核 r<0.283，向外软边到 r=0.5
  vec3 col = pow(clamp(vCol*uBrightness,0.0,1.0), vec3(0.88)); // gamma 0.88 提亮
  fragColor = vec4(col, alpha*uAlpha);
}
```
Three.js 实现要点：`material.transparent=true`；`gl_PointSize` 直接用 `gl_PointSize = uPointSize`（three 的 ShaderMaterial 需自己写，不能靠 sizeAttenuation）。

## 2. 各云与颜色常量（全部 RGB 值）
| 元素 | RGB | Hex | 点大小 | brightness | alpha | 深度写入 |
|---|---|---|---|---|---|---|
| 画布背景 | 247,247,248 | #F7F7F8（纯色，无渐变） | - | - | - | - |
| 原始视图整云（setPointCloud 的 base） | 86,96,110 | #56606E | 2 | 1.0 | 1.0 | 是 |
| 检测视图底云（bg = 检测前整云） | 178,184,194 | #B2B8C2 | 2 | 1.0 | 无选中 0.45 / 有选中 0.18 | **否**(depthMask off) |
| 形状 i 内点 | objectColor(i%7)，见下 | | 3 | 1.0 | 无选中 0.94；有其他选中 0.18；被选中 1.0 | 是 |
| 剩余点 remaining | 128,137,150 | #808996 | 2 | 0.88 | 0.85 | 是 |

形状调色板（`objectColor(index)`，`index % 7`，唯一在用的调色板）：
```
0 #e85d5d (232,93,93)   1 #5e6ad2 (94,106,210)  2 #29a9a0 (41,169,160)
3 #b05ac8 (176,90,200)  4 #db8e2f (219,142,47)  5 #35a66f (53,166,111)
6 #74859b (116,133,155)
```
⚠️ 头文件里的 `COLORS[10][3]`（#EF4444/#10B981/#3B82F6/#F59E0B/#A855F7/#00D9FF/#EC4899/#22C55E/#6366F1/#FB923C，Tailwind 色）**在 cpp 中定义但从未使用（死代码）**，移植时不要用它。`_bgPointSize` 也是死变量。

## 3. 形状几何可视化
- **没有任何形状几何绘制**。平面/球/柱/锥/环一律只画其 `inliers` 内点，按调色板着色。DetectedShape 的参数（法线/中心/半径等）viewer 完全不读。
- 无坐标轴、无地面网格、无包围盒、无图例。屏幕上的唯一叠加层是顶部任务状态条（见 §7）。

## 4. 绘制顺序（paintGL 精确序列，映射 three 的 renderOrder/depthWrite）
1. bg 底云（depthWrite=false，先画；仅 showDetectionResults 后启用）
2. base 整云（仅原始视图启用；showDetectionResults 会禁用 base）
3. 形状云：先画所有未选中的可见形状（alpha 见表）；**最后单独一遍画选中形状**：`depthTest=false`（穿透视口内一切，始终可读）+ 点大小+1 + alpha=1.0
4. remaining（最后画，depthTest 正常，被形状正确遮挡）

## 5. 相机（trackball 轨道相机，非 OrbitControls）
- 投影：`PerspectiveCamera(fov=45°, aspect=w/h, near=spanHint*0.001, far=spanHint*20)`。
- 位姿模型：`eye = center + q*(0,0,distance)`，`up = q*(0,1,0)`，lookAt(center)。q 为累计四元数。identity 时相机在 center 正 +Z 处看向 -Z（即正视图，Y 向上）。
- 自适应取景：`center = 点云质心`（**均值**，不是包围盒中心）；`spanHint = 采样包围盒最大边`（至多采样 5000 点，stride=n/5000；返回 max(dx,dy,dz,1e-4)）；`distance = spanHint*1.5`。setPointCloud/showDetectionResults(新场景)/fitToCloud 都执行此取景。
- 旋转（左键拖拽）：arcball。屏幕点→球面 `v=(2x/w-1, 1-2y/h, sqrt(max(0,1-x²-y²)))` 归一化；`dot(v0,v1)<0.9999` 时 `q = quatFromAxisAngle(cross(v0,v1).normalized(), acos(dot)) * q`（**左乘 = 屏幕/世界空间旋转**，trackball 手感）。
- 平移（中键或右键拖拽）：`s = spanHint/width * 2`（世界单位/像素）；`center += q*(s,0,0)*dx + q*(0,-s,0)*dy`。
- 缩放（滚轮）：`deltaY>0 ? distance*=0.9 : distance*=1.1`（每个滚轮事件乘一次，不做像素归一）；clamp `[spanHint*0.1, spanHint*30]`。
- setFrontView：q=identity（相机 +Z 看 -Z，up=+Y）。setSideView：q=绕Y轴+90°（相机移到 +X，up 仍 +Y）。setTopView：q=绕X轴-90°（相机在 +Y 上方俯视，屏幕 up=世界 -Z）。setZUpView：q=QQuaternion::fromDirection((-4,-6,4),(0,0,1))——相机方位在 (-4,-6,+4) 方向、世界 Z 向上（等距视角，给 Z-up 数据用）。这些视图函数**只改旋转，不改 distance/center**。fitToCloud 保留当前旋转，只重置 center/span/distance。

## 6. viewModeGroup（定义在 main_window.cpp:552-603，viewer 之外的 segmented 控件）
4 个互斥 checkable 按钮：**0 原始 / 1 语义 / 2 实例 / 3 几何**（默认 0 勾选）：
- 0 原始：`viewer.setPointCloud(_currentCloud)`——整云单色 #56606E。可用条件 idle && hasCloud。
- 1 语义：`showAiResults()`→`showDetectionResults(_aiDisplayShapes, 空remaining, _aiResult.cloud)`，形状按语义类别着色。仅当 task=="semantic_segmentation" 且有实例时可用。
- 2 实例：同上但 task=="instance_segmentation"，按实例着色。
- 3 几何：`showSelectedGeometry()`→`showDetectionResults(所选实例精修.shapes, .remaining, _aiResult.cloud)`。仅当该实例有精修结果可用。
- 检测完成后自动切到 1（语义）或 2（实例）。旁边工具条还有"回到全景"按钮→`fitToCloud()`；"框选"/"更多"两个按钮 `hide()` 不可见。

## 7. HUD / 叠加层
仅一个顶部状态条（QFrame，objectName viewerStatusBar，geometry(0,0,width,34)，初始隐藏）：
- 卡片：白底 #ffffff、边框 1px #e1e4e8、圆角 7px；内容 margins(12,0,12,0) spacing 12。
- 文本 label：#59616b、12px。进度条：高 2px、无文字、range(0,0)=busy 呼吸条；槽 #e5e7ea、块 #2d3137、圆角 1px。
- `setTaskActive(active,msg)`：active 时 show+raise+设文本；否则 hide。`setTaskMessage(msg)`：仅可见时更新文本。Three.js：绝对定位在画布顶部的 HTML overlay 即可。

## 8. 公有接口语义（Three.js 组件 API 设计）
- `setPointCloud(cloud)`：进入原始视图。清空 shapes/remaining/高亮/solo；取景（质心+span+dist=1.5span）；base 上传 #56606E；bg/remaining 禁用。
- `showDetectionResults(shapes, remaining, baseCloud)`：进入检测视图。base 禁用；bg=baseCloud 整云 #B2B8C2；shape_i=其 inliers 着 palette[i%7]；remaining=#808996 且 remainingVisible=true；highlight=-1；solo=false；**仅当 baseCloud 引用变化（新场景）才重新取景**。
- `setShapeVisible(i,visible)`：切换形状显隐；若恰好只剩 1 个可见 → soloMode=true 且自动 highlight 该形状（selected 状态与可见性联动）。
- `setRemainingVisible(bool)`；`setHighlightIndex(i)`（越界归 -1）。
- `showAllShapes()`：全可见 + remaining 显示 + 取消高亮/solo。`showOnlyShape(i)`：只显 i + remaining 隐藏 + highlight=i + solo。
- `clear()`：释放全部 GPU 云与 CPU 引用。`pauseRendering()/resumeRendering()`：启停 30ms 脏刷新循环（Three.js 端可让 rAF 常驻，等效）。
- `setTaskActive/setTaskMessage`：HUD。`fitToCloud/setFrontView/setSideView/setTopView/setZUpView`：见 §5。
- `highlightIndex()` getter；`objectColor(index)` 静态调色板函数。

## 9. 抽稀
上传时若 n>850,000：`step=max(1, floor(n/750000))`，等距取点，上限约 75 万点。

## 10. 常量速查
FOV 45°；near=span*0.001；far=span*20；distance 初值 span*1.5，clamp [0.1span, 30span]；旋转阈值 dot<0.9999；平移速率 2*span/width px→世界；滚轮 0.9/1.1；点大小 base/bg/remaining=2px、shape=3px、highlighted=4px；抽稀 850k→750k；状态条高 34px；gamma 0.88；软边 smoothstep(0.08,0.25,r²)；圆点 discard r²>0.25。

## Risks
- 相机不是 OrbitControls：旋转是屏幕空间 arcball 四元数左乘（trackball 手感），up 向量随旋转更新；直接套 OrbitControls 交互手感会不同。要么自写 trackball（~30行），要么接受差异
- 点大小是固定像素（gl_PointSize，无透视衰减），且实际是 2/2/3/4px 而非头文件默认 4/4/6——必须用自定义 ShaderMaterial 写 gl_PointSize，PointsMaterial + sizeAttenuation:false 也要逐云 uniform，不如直接抄 shader
- 取景中心是点云质心（均值）而非包围盒中心，偏心点云的取景和 Three.js 常见 bbox.center().getBoundingSphere 写法会不一致，照抄均值
- COLORS[10] 调色板（Tailwind 色）是死代码，正确调色板是 objectColor 的 7 色；_bgPointSize 同为死变量
- 选中形状 depthTest=false 且最后绘制——会穿透一切可见；Three.js 端记得 material.depthTest=false 并控制 renderOrder，否则效果不对
- bg 底云 depthWrite=false 且 alpha 随选中态 0.45→0.18；所有云都要 transparent=true，注意 three 对透明对象按距离排序可能与指定绘制顺序冲突，用 renderOrder 强制
- fromDirection((-4,-6,4),(0,0,1)) 的 Z-up 视图：QQuaternion::fromDirection 把 (0,0,1) 转到该方向，Three.js 端用 setFromUnitVectors(new Vector3(0,0,1), dir.normalize()) 等价，但 three 相机默认朝 -Z，套用时注意正负号
- 滚轮每事件乘 0.9/1.1，不做 deltaY 归一化；触控板平滑滚动在 web 上会触发大量小事件，可能需要按事件而非按像素计数
- soloMode 副作用：可见性剩 1 个时自动高亮该形状—— Three.js 状态管理需复刻此联动，否则'仅显示'与'高亮'会脱节
- 原始视图与检测视图互斥切换靠 base.enabled/bg.enabled 开关而非重建场景；showDetectionResults 仅在 baseCloud 引用变化时重取景——用弱引用/uuid 判断'同一场景'