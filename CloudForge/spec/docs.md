# docs

## Summary
Qt 原版是一个"AI 识别 + 手选实例 + RANSAC 精拟合"两段式点云分析 GUI：CloudForge（WSL Python）负责语义/实例分割并输出 schema v1 产物（JSON+二进制下标），用户在中文实例列表里选中一个对象后，C 接口 ransac_refine_instance() 只读该实例的点索引做五类基元（平面/球/圆柱/圆锥/圆环面）的渐进 LO-RANSAC 精拟合，两者严格串联——AI 决定"是什么"，RANSAC 决定"精确几何参数"，且绝不改写 AI 的类别/ID/置信度。文档给出了完整的 UI 规格（三栏 220/328/48px、4/8/12/16 间距节奏）、性能基准（20 万~30 万点、推理 0.85~1.04s、后端总时长 2.7~3.39s）、可复现性约束（固定随机种子、SHA-256 基准）和坐标系/单位约定（CloudForge 归一化 Z-up，米制 RMSE），这些全部是 Tauri2+Vue3 复刻必须遵守的契约。

## Contracts
- C API：int ransac_refine_instance(const RansacInputCloud* input, const int* selected_indices, int selected_count, RansacShapeType primitive_hint, const RansacDetectParams* params, RansacDetectOutput* output)（include/ransac_lib_api.h）；只复制下标不复制整幅点云坐标；调用后必须 ransac_free_output()；primitive_hint 可选（墙/门/窗→PLANE，不确定→UNKNOWN 自动比较五类基元）；inlier_indices 指向原始点云
- cloudforge schema v1 产物五件套：run.json（含耗时）、instances.json（实例元数据）、point_labels.bin、source_index.bin、labeled_cloud.ply；缺失或 schema≠1 判推理失败，不显示部分结果
- AI 实例 JSON 最少字段：semantic_id / semantic_name / instance_id / confidence / point_indices（紧凑下标数组，大点云不逐点写冗长 JSON）/ 可选 primitive_hint
- 进度协议：stderr 增量扫描 'CLOUDFORGE_EVENT ' 前缀的 JSON 行；其余 stderr 为诊断输出
- 调用方式：QProcess 执行 wsl.exe -d Ubuntu -- bash -lc '<激活 venv>; cd /mnt/e/C++/Point/CloudForge-Neural; python tools/cloudforge_infer.py --input <per-run PCD> --profile <p> --output <新建时间戳目录>'（输出目录永远新建，不需要 --overwrite-output）
- QSettings 持久化键 litept/*：distribution=Ubuntu、wslRoot=/mnt/e/C++/Point/CloudForge-Neural、venvRoot=/opt/cloudforge-venv、profile=scannet200-instances
- 导出 objects.json 按对象组织：原类别/instance_id/置信度、几何系数、米制 RMSE、原文件点索引、坐标系信息；复现性基准 SHA-256=83F82F3EAE0E81A9B572899BA8B261DAA49B638BA582D119A5C159E5D1B59D32
- 输入约定：室内模型必须 PLY/PCD 且带 RGB；NuScenes 用 float32 N×5 BIN；单位 m/cm/mm、向上轴 auto/手动；采样 20mm 标准 / 10mm 细节

## Details
# 产品完整规格（Qt 原版 → Tauri2+Vue3 复刻依据）

## 1. 用户故事 / 端到端工作流（设计意图）

1. 加载带 RGB 的点云（PLY/PCD；NuScenes 用 float32 N×5 BIN）。
2. 选择 AI 配置：五个 profile —— ScanNet200 室内实例（默认）、ScanNet 室内实例、ScanNet 室内语义、Structured3D 室内语义、NuScenes 室外语义。
3. 设置推理参数：采样精度（标准 20 mm / 细节 10 mm，默认 20 mm）、输入单位（m/cm/mm，需转发到室内语义后端）、向上轴（自动/手动）。默认关闭"靠距离合并相邻同类实例"（避免两个柜子被合成一个对象）；跨分块重叠一致性融合保持原逻辑。
4. 点击识别 → GUI 写入单次运行的输入 PCD → QProcess 调 wsl.exe → WSL Ubuntu 的 /opt/cloudforge-venv 里跑 tools/cloudforge_infer.py → stderr 增量扫描 `CLOUDFORGE_EVENT` JSON 行更新进度条/状态栏 → 完成后校验并读取 schema v1 产物。
5. 右侧中文实例列表展示（blanket→毛毯、printer→打印机；未知类别显示"类别+语义ID"，不回退英文）。
6. 点击实例 → 高亮该实例、其余淡显；从原始/几何视图点击实例可切回实例视图；同场景切换视图不重置缩放；AI 输出用 Z-up 初始斜视角。
7. 点击"精拟合选中实例" → RANSAC 只读该实例点索引做几何精拟合，结果挂在该对象下，保留 CloudForge 类别、实例 ID、置信度。
8. 顶部导出 JSON，按对象组织。

## 2. AI 与 RANSAC 协作关系（串联，非替代）

```
原始点云 → AI 语义/实例分割 → {semantic_id, instance_id, confidence, point_indices[]}
→ 用户选择一个实例 → RANSAC 只读取该实例 point_indices[] 做几何精拟合
→ {primitive_type, coefficients, inlier_indices, RMSE, sigma, soft_score}
→ GUI 合并显示 AI 标签 + 置信度 + 几何参数 + 尺寸
```

- AI 决定"是什么"；RANSAC 决定"平面、轴、半径、角度等精确参数"。RANSAC 不修改 AI 的语义类别/实例编号/置信度，几何质量作为独立软指标返回，不回写 AI confidence。
- 六条协作改进：① 在实例内部拟合（防背景/相邻物体污染）；② AI 类别仅作可选 primitive_hint（墙/门/窗提示 PLANE，不确定传 UNKNOWN 自动比较五类基元）；③ 阈值和噪声尺度由选中实例自身估计（局部尺度，不受全房间包围盒影响）；④ 渐进小模型发现（AI 掩码不完整时在未解释点继续搜索，但指定 hint 时只返回最佳单模型）；⑤ 五类 LO-IRLS 精化降 AI 边界误分点影响；⑥ 软质量指标独立返回。
- 两个 RANSAC 入口统一要求有效 AI 实例选择，无选择时不回退全场景检测；语义类别区域可能含多个物体，不作为独立实例精拟合。旧的非实例整场景接口仅保留为显式 fallback/调试，且保持原时间种子行为。

## 3. RANSAC 算法（Adaptive Progressive LO-RANSAC）

qRANSAC_SD（Schnabel 2007）仍负责五类基元（平面/球/圆柱/圆锥/圆环面）假设生成；外层升级为：
1. 渐进式多模型发现：每轮只处理未解释点，逐轮降低最小支持度、收紧距离阈值，提升小平面召回。
2. 自适应尺度：按点云分辨率和场景尺度自动设初始容差；每模型用残差 MAD 估计独立噪声尺度。
3. 局部鲁棒优化：五类基元最多 7 轮 Tukey biweight IRLS；平面加权 PCA，球加权最小二乘，圆柱/圆锥/圆环面用带轴向归一化、正半径、角度约束的阻尼非线性最小二乘。
4. 软评分：截断尺度内高斯软评分，GUI 同时显示 RMSE、鲁棒噪声 sigma、软评分。
5. 停止条件：无新模型 / 剩余点不足 / 达到最大模型数 / 最大轮数。
- 明确不宣称是 MAGSAC++/Graph-Cut RANSAC/Progressive-X 逐行复现；OpenCV USAC_MAGSAC 只面向 2D 对应问题，不能替换 3D 基元估计器。
- 回归入口：`RANSAC_GUI\out\detect_cli.exe --synthetic`，无需外部文件。

## 4. Qt GUI 布局与视觉（复刻 UI 尺寸依据）

- 三栏：左栏 220 px、右检查器 328 px、顶栏 48 px（Qt 逻辑像素）；中性浅灰/白；中文实例列表、百分比置信度、对象详情。参考视觉：`E:/C++/Point/LitePT-main/litept-linear-light-demo.html`（黑白灰编辑器风格，但 Qt 版不宣称逐像素一致）。
- 移除工作区日志模块，后台诊断仍收集；进度显示在状态栏和视图任务提示。
- 右侧几何内容随结果增高并滚动；选中高亮/其余淡显；修正过 OpenGL 透明度合成导致的黑色异常色图案（Web 复刻注意透明度排序）。
- UI 精修规范：4/8/12/16 px 间距节奏；统一字体层级、按钮高度、圆角、边框、状态色；覆盖 hover/pressed/checked/disabled/focus/busy 六态；验收要求空状态三栏层级清晰、原有结构与功能入口不变。

## 5. 实测性能基准（WSL GPU 推理）

| 样例/权重 | 有效点 | 采样点 | 候选实例 | 推理 | 后端总时长 |
|---|---|---|---|---|---|
| livingroom / ScanNet 20mm | 196,133 | 26,889 | 4 | 0.85s | 2.71s |
| livingroom / ScanNet 10mm | 196,133 | 94,764 | 7 | 1.04s | 2.72s |
| office / ScanNet200 20mm | 276,559 | 37,226 | 8 | 0.89s | 3.39s |

- 时间来自 run.json，不含 Qt 点击、WSL 启动、Python 导入时间，不得宣称所有输入 30 秒内完成。
- office 输入 276,871 点中 312 无效点被过滤，保留原始索引映射。

## 6. 实测精拟合结果（回归基线）

- 办公"复印机 #1"（ScanNet200 20mm）：33,065 点，9 个平面，22,195 内点，10,870 未拟合，各平面 RMSE 1.42–4.37 mm。连续两个独立进程 objects.json SHA-256 = `83F82F3EAE0E81A9B572899BA8B261DAA49B638BA582D119A5C159E5D1B59D32`。
- 客厅"椅子 #2"：23,671 点，7 平面，11,031 内点，12,640 未拟合，内点全部来自所选实例。
- 已知边界：无人工真值故无语义准确率/IoU 数据；10mm 保留更多点但改变椅子/沙发/床类预测，实例更多≠更准；固定种子只解决重复性不解决几何正确性；小物体/曲面/稀疏对象可能无可靠平面（允许结果，不造面强通过）；尺寸是 AI 对象轴对齐包围盒粗测，非窗框净尺寸，不能交付施工下料。

## 7. 超级能力 spec 三份补充要点

- WSL 集成设计（2026-09-09）：不嵌 Python/PyTorch/CUDA/权重；QProcess 异步；唯一入口 tools/cloudforge_infer.py；输出目录按"文件名+时间戳"在 CloudForge/outputs 下新建（永远不需要 --overwrite-output）；AI 按钮无点云时禁用、推理中再禁用；启动前校验含 RGB；失败保留 GUI 状态并给可读错误；CloudForge 输入校验错误（如 XYZ-only PCD）直接呈现不造色；产物残缺判整体失败不显示部分结果；可取消，取消的部分输出保留诊断但不导入。实现单元 CloudForgeProcessRunner 负责命令构造/进程生命周期/取消/输出收集/事件解析。
- Qt UI 精修设计（2026-09-09）：只改 gui/ 下样式，不动业务逻辑，不加新功能/新页面/动画。
- 中文化设计（2026-09-10）：仅展示层转换，输出协议、instances.json、英文标识、导出文件全部不变；首版覆盖 ScanNet200 全部 + ScanNet20 + Structured3D + NuScenes 类别。

## 8. 验证体系（复刻后应对标）

- Python unittest 18 项（含室内实例/语义单位转发、五配置就绪检查）。
- CTest `object_plane_subset`：两个相隔 0.3m 的合成平面+对象外干扰点，验证≥2 独立平面、低残差、内点/剩余点不重复且完整覆盖选择集、无对象外点混入，连续三次通过。
- 12 项 Qt 流程检查×2 场景：无选择保护、真实鼠标事件切行、渲染图像变化、透明度、对象身份保持、精拟合范围、对象导出、切视图后再点击、搜索、清空失效、长文本布局。

## Risks
- 进程桥接差异：QProcess→Tauri 需用 tauri-plugin-shell/Command 或 Rust std::process 异步 spawn wsl.exe，且要增量流式读 stderr 解析 CLOUDFORGE_EVENT 行（不是等进程结束再读），取消需 kill 进程树（wsl.exe 下还有 bash/python 子进程）
- 索引映射是最容易踩的坑：GUI 显示点云有去重/降采样，CloudForge 的 point_indices 是原始文件下标，必须经 labeled_cloud.ply 的 source_index/instance_id 映射到有效点位置，直接把原始下标用到显示点云会错位；RANSAC 返回的 inlier_indices 也要能映射回原始索引用于导出
- 坐标系陷阱：所有几何系数属于 CloudForge 归一化 Z-up 坐标系，不是原扫描坐标系；RMSE 是米制但系数不是世界坐标；导出必须显式写坐标系信息，UI 不能把包围盒尺寸当真实测量交付
- 单位传递：m/cm/mm 选项必须转发到室内语义后端（历史上漏过），不只影响显示
- 性能约束：20 万~30 万点量级；AI 元数据用紧凑下标数组而非逐点 JSON；前端渲染大点云需要降采样显示 + 原始索引映射层；推理总时长 2.7~3.4s 不含 WSL 启动和 Python 导入（冷启动可能多好几秒），不要承诺固定时限
- 业务规则必须复刻：无实例选择时不回退全场景检测；精拟合前过滤无效点并保留索引映射；新文件/重新识别/清空时清理旧对象测量；指定 primitive_hint 时只返回最佳单模型
- 随机种子：实例精拟合固定种子（同机同版本可重复），整场景旧接口保持时间种子；跨平台不承诺位级一致——Tauri 复刻如果换 RNG 实现会失去与原 objects.json 的 SHA-256 对齐能力
- 输入校验不许造假：无 RGB 数据不得伪造颜色，任意二进制不得当 NuScenes 输入，XYZ-only PCD 直接报错
- 渲染细节：原版修过 OpenGL 透明度合成黑块问题，WebGL/Three.js 复刻需注意透明排序与淡显（其余对象半透明）实现；同场景切换几何/实例视图不重置相机
- 中文化只在展示层：协议与导出保持英文标识，未知类别显示'类别+语义ID'，不能把翻译写回数据
- 默认值清单：profile=scannet200-instances、采样 20mm、关闭靠距离合并相邻同类实例、向上轴自动