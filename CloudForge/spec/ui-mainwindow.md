# ui-mainwindow

## Summary
主窗口是一个三栏桌面布局（220px 左侧导航栏 + 中央 3D 视图 + 328px 右侧检查器，顶部 48px 工具条，底部 28px 状态栏），核心流程为：加载点云(pcd/ply/txt/stl/obj/bin，>90万点显示降采样) → 运行 CloudForge AI 识别(WSL 子进程，5 种 profile) → 右侧树选实例 → RANSAC 精拟合(平面/多种几何两档) → 导出 JSON。所有状态由 _busy + updateControlStates 集中启停，QSettings 持久化 7 个键，两段叠加样式表（第二段覆盖第一段）决定了最终观感。

## Contracts
- CloudForgeRunnerConfig: {distribution='Ubuntu', litePtRoot='/mnt/e/C++/Point/CloudForge-Neural', venvRoot='/opt/cloudforge-venv', profile='scannet200-instances', inputUnit='m', upAxis='auto', gridSize=0.02}；前3项+profile 运行时回写 QSettings
- AI profile 枚举（data id / 显示名）: scannet200-instances='ScanNet200 · 室内实例'；scannet-instances='ScanNet · 室内实例'；scannet-semantic='ScanNet · 室内语义'；structured3d-semantic='Structured3D · 室内语义'；nuscenes-semantic='NuScenes · 室外语义'。接受后缀：nuscenes→bin，其余→ply/pcd。task 字符串：'instance_segmentation' / 'semantic_segmentation'
- LitePtInferenceResult（前端需建模）: task, cloud, validPoints, invalidPoints, elapsedSeconds, selectedUpAxis, profileName, configPath, instances[{className, semanticId, instanceId, confidence(0-1), pointCount, pointPositions:uint[], sourceIndices, bboxMin/bboxMax(QVector3D), cloud}]
- 精拟合请求契约: {presetIndex:0|1, aiIndex, selectedPointPositions} → 结果 {aiIndex, error, shapes[{type(11类枚举), coefficients, inlierIndices(⊂选中点集), inlierCount, rmse, inliers, softScore}], remaining, stats}；instance.pointPositions.length<50 拒绝
- 导出 JSON schema: {schema_version:1, litept_output:string, coordinate_frame:'CloudForge normalized Z-up', unit:'m', input_up_axis:string, objects:[{instance_id, semantic_id, class_name, confidence, point_count, geometry:[{type:英文类型名, coefficients:float[], rmse_m:float, source_indices:int[](原始文件索引=instance.sourceIndices 映射)}]}]}
- QSettings(org='RANSAC', app='RANSAC PointCloud Tool') 键: lastSaveDir, lastLoadDir, litept/profile, litept/wslDistribution, litept/wslRoot, litept/venvRoot（litept/windowsOutputRoot 只读，默认 E:/C++/Point/CloudForge/outputs）
- 3D 视图组件 API 面: setPointCloud, showDetectionResults(shapes,remaining,baseCloud), setShapeVisible(i,bool), setRemainingVisible(bool), setHighlightIndex(i), showAllShapes, fitToCloud, setZUpView, setTaskActive(busy,msg), setTaskMessage(msg), pauseRendering/resumeRendering, clear, static objectColor(i), highlightIndex()；实例颜色=objectColor(i)，几何类型颜色=HSV(i*0.618034 %1, 0.62, 0.90)
- 加载管线契约: loadFromFile → preprocess(cloud, !streamDownsampled, 0.0f) → 超900000点 limitPointsForDisplay(900000)；LoadResult{cloud, success, streamDownsampled, sourceBytes}
- 文件过滤器字符串（原样）: 打开='点云文件 (*.pcd *.ply *.txt *.stl *.obj *.bin);;PCD (*.pcd);;PLY (*.ply);;NuScenes BIN (*.bin);;TXT (*.txt);;STL (*.stl);;OBJ (*.obj);;所有文件 (*)'；保存='PCD 文件 (*.pcd)'；导出='对象测量 (*.json)'
- CLI/回归模式（main_gui.cpp，前端可对应 e2e 测试）: --check-plane-subset, --check-localization <class> [id], --run-litept IN OUT, --check-litept-refine DIR [i], --check-litept-output DIR, --check-cloud FILE, --check-ui-workflow OUT ART(15项检查), --render-cloud, --render-litept-output, --screenshot

## Details
# RANSAC_GUI 主窗口前端复刻规格（源自 gui/src/main_window.cpp 1706 行 + main_window.h + main_gui.cpp）

## 0. 全局

- 窗口标题：`RANSAC 点云几何体检测`；minimumSize 1280×820；初始 resize 1440×900。
- main_gui.cpp：QSurfaceFormat OpenGL 3.3 CoreProfile、depth 24、samples 4；Fusion 风格；QApplication organizationName="RANSAC"，applicationName="RANSAC PointCloud Tool"（QSettings 存储位置由此决定）。
- main_gui.cpp 还含 CLI 自检模式（不影响 GUI 复刻）：`--check-plane-subset`、`--check-localization <类名> [id]`、`--run-litept IN OUT`、`--check-litept-refine DIR [i]`、`--check-litept-output DIR`、`--check-cloud FILE`、`--check-ui-workflow OUT ART`、`--render-cloud IN PNG`、`--render-litept-output DIR PNG`、`--screenshot PNG`。其中 `--check-ui-workflow` 是 UI 回归（见 §12）。

### 样式（注意：setupUI 里连续设置了两个 setStyleSheet，第二个追加并覆盖第一个；下面给“最终生效值”）

- 全局字体：`"Segoe UI Variable","Microsoft YaHei UI"`，最终 font-size **13px**（第二张表覆盖 12px）。
- 根/主窗背景 `#f7f7f8`，文字 `#202123`。
- QLabel 默认色 `#676767`。
- QFrame#topBar：白底、border-bottom 1px `#e6e8eb`；QFrame#leftPanel：`#f9f9f9`、border-right 1px `#ececec`；QFrame#rightPanel：白底、border-left 1px `#ececec`。
- QPushButton：min-height 30px、白底、border 1px `#dfe2e6`、radius 6（第二表覆盖 7）；hover `#f6f7f8`；disabled 色 `#a3a8af` 底 `#f2f3f5`。
- `#primaryButton`（主按钮）：底 `#202328` 白字 600；hover `#34383e`；pressed `#111317`；disabled 底 `#e5e7ea` 字 `#9ca2aa`。
- `#ghostButton`：透明底无边框，字 `#626872`，hover 底 `#f1f2f4`。
- `#navButton`/`#navButtonActive`：min-height 31px、左对齐 padding-left 10px、无边框；active 底 `#e8eaed` 600 加粗。
- `#segmented`：白底 border `#dedede`（覆盖了 #eceef1 底）；`QToolButton#segment`：min-height 27px、radius 5、padding 0 11px；checked 白底 600 边框 `#d9dde1`。
- `QToolButton#viewerTool`：32×32 固定。
- QLineEdit：底 `#f7f7f9`、border `#ececec`、min-height 30、radius 6、padding 0 10px；disabled 同按钮。
- QComboBox：min-height 29px、12px、padding-left 8。
- QTreeWidget：白底 12px、item padding 5px 7px、selected `#f1f1f1`、hover `#f5f5f6`（右侧树另设 radius 0）。
- QScrollArea 白底无边框。QSplitter handle 1px `#e6e8eb`。
- QStatusBar：白底、字 `#68707a`、border-top 1px `#e6e8eb`。
- QTabWidget/TabBar、QGroupBox、QMenu/QMenuBar 等样式存在但菜单栏被隐藏（见下）。

## 1. setupUI() 完整布局树（对象名 / 文案 / 默认值 / 策略）

```
MainWindow (title="RANSAC 点云几何体检测")
└─ central QWidget#root; QVBoxLayout margins(0,0,0,0) spacing 0
   ├─ topBar QFrame#topBar fixedHeight 48; QHBoxLayout margins(0,0,12,0) spacing 7
   │  ├─ brandBox QWidget fixedWidth 220; HBox margins(14,0,12,0)
   │  │  ├─ mark QLabel "CF" #brandMark fixed 24×24 居中; 黑底白字 radius7 10px 700
   │  │  │   （品牌统改为 CloudForge：原版 Qt 为 "LP" / "LitePoint" / 面包屑前缀 "PointLab"）
   │  │  ├─ brandName QLabel "CloudForge" #brandName 13px 600 #202123
   │  │  └─ stretch
   │  ├─ _fileTitleLabel QLabel 默认"CloudForge  /  尚未打开点云" #breadcrumbLabel
   │  │   minWidth 0, sizePolicy (Ignored, Preferred), stretch 1（面包屑，可被压缩截断）
   │  ├─ searchBtn QPushButton "搜索  Ctrl K" #ghostButton → 聚焦结果搜索框；
   │  │   全局快捷键 Ctrl+K 同效（QShortcut）
   │  ├─ _exportBtn QPushButton "导出" → exportResults
   │  └─ _aiButton QPushButton "运行识别" #primaryButton, icon :/icons/play.svg → startAiRecognition
   │       （运行中文字变"取消 AI"=再次点击取消；结束后变"重新运行"）
   ├─ workspace QSplitter(Horizontal) stretch 0/1/0, sizes {224, 844, 336}
   │  ├─ _leftPanel QFrame#leftPanel fixedWidth 220; VBox margins(8,12,8,10) spacing 3
   │  │  ├─ title QLabel " PL   点云实验室" inline: 600 #202123 padding 8px
   │  │  ├─ workTitle QLabel "工作区" #sideSectionTitle (10px 600 #9298a1 padding 6/9/4/9)
   │  │  ├─ nav×4 QPushButton（icon :/icons/{grid,file,ai,chart}.svg）
   │  │  │   0 "概览"(#navButtonActive 默认高亮) → viewer.fitToCloud()
   │  │  │   1 "点云文件" → loadPointCloud()
   │  │  │   2 "AI 识别任务" → _aiProfileCombo.setFocus()
   │  │  │   3 "测量记录" → updateObjectDetails() + status "当前已精拟合 N 个对象"
   │  │  ├─ spacing 12
   │  │  ├─ dataTitle QLabel "点云数据" #sideSectionTitle
   │  │  ├─ _infoLabel QLabel "●  尚未加载文件" wordWrap #cloudInfo
   │  │  ├─ fileRow HBox: _loadBtn "打开点云" → loadPointCloud; _saveBtn "保存" → savePointCloud
   │  │  ├─ _generateBtn QPushButton（**隐藏**，槽 generatePointCloud）
   │  │  ├─ spacing 12
   │  │  ├─ modelTitle QLabel "识别设置" #sideSectionTitle
   │  │  ├─ _aiProfileCombo（默认选中 QSettings litept/profile，缺省第 0 项）
   │  │  │   items: "ScanNet200 · 室内实例"(scannet200-instances) / "ScanNet · 室内实例"(scannet-instances)
   │  │  │         / "ScanNet · 室内语义"(scannet-semantic) / "Structured3D · 室内语义"(structured3d-semantic)
   │  │  │         / "NuScenes · 室外语义"(nuscenes-semantic)
   │  │  │   currentIndexChanged → 写 QSettings litept/profile + updateControlStates()
   │  │  ├─ _qualityCombo tooltip "更密采样保留细节，但更耗显存与时间；不保证类别识别更准确"
   │  │  │   items: "标准 · 20 mm 采样"(data=0.02, 默认) / "细节 · 10 mm 采样"(data=0.01)
   │  │  ├─ _unitCombo items: "输入单位 · 米"(m,默认) / "输入单位 · 厘米"(cm) / "输入单位 · 毫米"(mm)
   │  │  ├─ _upAxisCombo items: "向上方向 · 自动"(auto,默认) / "向上方向 · z" / "-z" / "y" / "-y" / "x" / "-x"
   │  │  ├─ _clearBtn "清空工作区" → clearAll
   │  │  ├─ stretch
   │  │  ├─ env QLabel "●  本地处理\n    CloudForge · RANSAC" #environmentStatus（绿 #16785f）
   │  │  └─ collapse QPushButton "◧   折叠侧栏" #collapseButton
   │  │       点击: compact = width>60；隐藏侧栏内所有控件(除自身)；宽度 220↔58；
   │  │       brandBox 同步 220↔58；文本 "◧   折叠侧栏" ↔ "◧"
   │  ├─ centerPane QWidget; VBox margins(14,13,14,13) spacing 10
   │  │  ├─ viewTools HBox
   │  │  │  ├─ segmented QFrame#segmented; HBox margins(3,3,3,3) spacing 0
   │  │  │  │  └─ 4×QToolButton#segment checkable, QButtonGroup _viewModeGroup exclusive id 0..3:
   │  │  │  │     0 "原始"(默认 checked) / 1 "语义" / 2 "实例" / 3 "几何"
   │  │  │  │     点击(busy 时忽略): 0→showingAiResults=false + setPointCloud(_currentCloud)
   │  │  │  │     1/2→有 AI 云则 showAiResults()；3→showSelectedGeometry()；随后 updateControlStates()
   │  │  │  ├─ stretch
   │  │  │  ├─ fitTool QToolButton#viewerTool icon fit.svg 15×15 tooltip "回到全景" → fitToCloud
   │  │  │  ├─ pickTool QToolButton#viewerTool icon cursor.svg tooltip "框选" （**隐藏**）
   │  │  │  └─ moreTool QToolButton#viewerTool icon more.svg tooltip "更多" （**隐藏**）
   │  │  ├─ _viewerWidget PointCloudViewerWidget（stretch 1，3D 视图主体）
   │  │  └─ _sceneLabel QLabel "打开点云 · 选择模型 · 运行识别" inline 11px #676767 padding 4px 8px
   │  └─ rightPanel QFrame#rightPanel fixedWidth 328; VBox margins(0,0,0,0) spacing 0
   │     ├─ header QWidget fixedHeight 46; HBox margins(16,0,16,0)
   │     │  ├─ resultsTitle QLabel "识别结果" inline 13px 600 #202123
   │     │  ├─ stretch
   │     │  └─ _pointCountLabel QLabel "0 个实例" #countLabel inline: 透明底 #9b9b9b 11px
   │     └─ scroll QScrollArea widgetResizable, 横向滚动条 AlwaysOff, stretch 1
   │        └─ contents QWidget#inspectorContents 白底; VBox margins(16,12,16,16) spacing 10, SetMinimumSize
   │           ├─ _resultSearch QLineEdit placeholder "搜索实例…"（textChanged 按第 0 列不区分大小写过滤顶层行隐藏）
   │           ├─ _resultsTree QTreeWidget: 2 列、表头隐藏、rootIsDecorated=false、indentation 0、
   │           │   SelectRows + SingleSelection；col0 Stretch，col1 Fixed 65px 右对齐；stretchLastSection=false；
   │           │   minHeight 240 maxHeight 380； currentItemChanged 与 itemClicked 都 → onTreeItemSelected
   │           ├─ detailCard QFrame#objectDetails（border-top 1px #ececec）; VBox margins(0,16,0,0) spacing 12
   │           │  ├─ _selectionTitleLabel QLabel "未选择对象" #sectionTitle (17px 600)
   │           │  ├─ _detailLabel QLabel wordWrap 11px
   │           │  ├─ coarseTitle QLabel "LITEPT 粗测" #eyebrowLabel (11px 600 #757c85)
   │           │  ├─ _measurementLabel QLabel "选择实例后显示点数与包围盒" wordWrap inline 12px #50525b padding 4px 0
   │           │  ├─ geometryTitle QLabel "几何精拟合                                 RANSAC" #eyebrowLabel（原文含大量空格）
   │           │  ├─ _geometryLabel QLabel "尚未精拟合" wordWrap AlignTop|AlignLeft, Expanding/Minimum,
   │           │  │   inline: bg #f8f8fa border 1px #ececec radius 7 padding 11px 12px；
   │           │  │   动态 minHeight = max(52, heightForWidth(width))
   │           │  ├─ _detectPresetCombo QComboBox: "拟合平面"(idx0) / "拟合多种几何面"(idx1)
   │           │  └─ _measureBtn QPushButton "精拟合选中实例" #primaryButton → detectShapes
   │           └─ stretch
   ├─ _taskDrawer QTabWidget（**隐藏**），内含 _logText QTextEdit 只读，tab 名 "诊断"（日志抽屉，不在可见布局）
   └─ statusBar fixedHeight 28, 初始 showMessage "就绪 · 打开点云后选择模型运行"
```

### setupMenus()（菜单栏建好后 `menuBar()->hide()`，整体不可见，前端可忽略或做成隐藏菜单）
- 文件：加载点云 / 保存点云 / 分隔线 / 退出
- 帮助：关于 → QMessageBox 标题 "关于"，正文：
  "AI 分割 + RANSAC 几何精拟合\n\nAI: 负责语义类别、实例标签和置信度（接口已保留）\nRANSAC: 只对选中实例进行渐进发现、自适应尺度、LO 优化和软评分\n基元生成器: qRANSAC_SD\n支持: PCD / PLY / TXT / STL / OBJ"

### 隐藏控件汇总（复刻时决定去留）
_detectBtn（ QPushButton，同样连 detectShapes，唯一精拟合入口在右侧 _measureBtn）、_generateBtn、pickTool、moreTool、_taskDrawer/_logText、整个菜单栏。

## 2. 用户工作流精确步骤

### 2.1 生成点云（generatePointCloud — 按钮已隐藏但逻辑保留）
1. `_busy` 时忽略。log "正在生成合成点云..."；setBusy(true, "生成点云…")。
2. QtConcurrent 后台调 `PointCloudGenerator::generateSyntheticCloud()`（**无参数**，固定合成场景，参数不可调）。
3. onGenerateFinished：失败(空云) → setBusy(false) + logError "生成失败"。成功：清空 AI/精拟合/结果状态，`_sourceBaseName = "generated_yyyyMMdd_HHmmss"`，`_sourceFilePath` 清空；viewer task "更新视图…"；树清空、detail 清空；setPointCloud；updateObjectDetails；_pointCountLabel "0 个实例"；_sceneLabel "原始视图 · 请选择模型运行识别"；setBusy(false)；_infoLabel "●  合成测试点云\n    %1 个点"（样式 `padding:7px 9px;color:#50525b;font-weight:500;`）；视图按钮0 选中；log "生成完成: %1 个点"；_fileTitleLabel "CloudForge  /  Office sample  /  合成测试点云"。

### 2.2 加载点云（loadPointCloud → loadPointCloudFile）
1. 文件对话框：标题 "加载点云"，初始目录 `_lastLoadDir`（空则 cwd），过滤器原文：
   `点云文件 (*.pcd *.ply *.txt *.stl *.obj *.bin);;PCD (*.pcd);;PLY (*.ply);;NuScenes BIN (*.bin);;TXT (*.txt);;STL (*.stl);;OBJ (*.obj);;所有文件 (*)`
   对话框期间 viewer pauseRendering / resumeRendering。
2. 保存 `lastLoadDir` 到 QSettings；`_sourceBaseName = completeBaseName`；`_sourceFilePath = absoluteFilePath`；log "正在加载: %1"；setBusy(true, "读取点云…")；启动 1500ms 定时进度器。
3. 后台管线（LoadResult）：
   - `loadFromFile(path)`；失败或空 → success=false。
   - `preprocess(raw, !skipDedup, 0.0f)`，其中 `skipDedup = lastLoadMeta().txtStreamDownsampled`（即大 TXT 流式加载时**跳过去重**）；默认 voxelLeafSize=0（不下采样体素）。
   - 记录 streamDownsampled / sourceBytes。
   - 若点数 > 900000 → `limitPointsForDisplay(cloud, 900000)`（显示上限 90 万点，函数默认值 850000 未用到）。
4. 进度 tick（每 1.5s，仅 busy 且加载中）：读 lastLoadMeta；phase 0/1/2 → "扫描"/"生成点云"/"上传视图"；消息模板：
   `读取点云… %1% (%2 / %3 MB) · %4`（百分数 0 位小数、已完成 MB 与总 MB 均 0 位小数）。同时设 viewer task message 和状态栏。
5. onLoadFinished：停定时器。
   - 失败：清 _sourceFilePath；setBusy(false)；logError `加载失败（无法打开、格式无法识别或有效点数为 0；带引号 CSV 需使用新版程序）`；状态栏 "加载失败"。
   - 成功：重置全部 AI/精拟合状态（_aiResult={}、_objectRefinements.clear、_aiDisplayShapes/_detectedShapes 清、_remainingPoints 重建、_lastDetectStats={}、_detectionInputCloud 重置、_resultRunId/_lastResultDir 清、_selectedAiInstance=-1、_showingAiResults=false）；viewer task "上传视图…"；树清空、_detailLabel 清；setPointCloud；updateObjectDetails；_pointCountLabel "0 个实例"；_sceneLabel "原始视图 · 请选择模型运行识别"；setBusy(false)；按钮0 选中；
     _infoLabel `●  %1\n    %2 个点`（%1=文件名）+ 同上样式；log `加载完成: %1 个点`；_fileTitleLabel `CloudForge  /  Office sample  /  %1`；
     若 streamDownsampled 且 sourceBytes>0：log `大 TXT 流式加载（原文件约 %1 MB → 目标约 90 万点，实际 %2 点）`（%1 为 1 位小数 MB）。
     **streamDownsampled 含义**：TXT 文件过大时流式边读边降采样到约 90 万点；此时 preprocess 跳过去重。
   - emit pointCloudLoadCompleted(true/false)（CLI 截图模式用）。

### 2.3 保存点云（savePointCloud）
- busy 忽略；无云 → logWarning "没有可保存的点云"。
- 对话框标题 "保存点云"，目录 `_lastSaveDir`，过滤器 `PCD 文件 (*.pcd)`；期间暂停渲染；无 .pcd 后缀自动补（不区分大小写）；写 QSettings lastSaveDir；成功 log `已保存: %1`，失败 `保存失败: %1`。（走同步 saveToPCD，_saveWatcher 实际未使用。）

### 2.4 AI 识别（startAiRecognition，顶栏主按钮）
1. 若 `_litePtRunner->isRunning()`：当前按钮文字已是 "取消 AI" → logWarning "正在取消 CloudForge 推理…"，runner.cancel()，返回。
2. 守卫：无云或 `_sourceFilePath` 空 → logWarning "请先加载带真实 RGB 的 PLY 或 PCD 点云"；后缀校验 `selectedProfileAcceptsSuffix`：nuscenes-semantic 仅 `.bin`，其余 profile 仅 `.ply/.pcd`；不匹配 → logWarning "NuScenes 室外语义模型只接受 float32 N×5 的 .bin 点云" 或 "所选室内模型只接受带真实 RGB 的 PLY/PCD 点云"。
3. 组装 CloudForgeRunnerConfig（字段来源）：
   - distribution ← QSettings `litept/wslDistribution`（默认 "Ubuntu"）
   - litePtRoot ← `litept/wslRoot`（默认 "/mnt/e/C++/Point/CloudForge-Neural"）
   - venvRoot ← `litept/venvRoot`（默认 "/opt/cloudforge-venv"）
   - profile ← _aiProfileCombo.currentData；gridSize ← _qualityCombo.currentData (0.02/0.01)
   - inputUnit ← _unitCombo.currentData (m/cm/mm)；upAxis ← _upAxisCombo.currentData (auto/z/-z/y/-y/x/-x)
   - 并把 distribution/litePtRoot/venvRoot/profile **回写** QSettings。
4. 输出目录：outputRoot ← QSettings `litept/windowsOutputRoot`（默认 "E:/C++/Point/CloudForge/outputs"），mkpath；safeBase = _sourceBaseName 把 `[^A-Za-z0-9_-]+` 换 "_"，空则 "cloud"；runName = `gui_%1_%2`（safeBase, 时间戳 yyyyMMdd_HHmmss_zzz）；_lastAiOutputDir = outputRoot/runName。
5. 重置：_aiResult、_objectRefinements、_aiDisplayShapes、_selectedAiInstance=-1、_detectedShapes、_remainingPoints、_lastDetectStats、树清空、_showingAiResults=false；viewer setPointCloud(原始云)；按钮0 选中；updateObjectDetails；_pointCountLabel "识别中"；setBusy(true, "启动 CloudForge…")；**强制 _aiButton.setEnabled(true)** 并改文字 "取消 AI"；log `启动 CloudForge [%1]: %2 → %3`（combo 显示文本、源文件路径、输出目录）；runner.start(config, 源路径, 输出目录)。
6. 运行中信号：
   - progressChanged(phase, progress)：状态栏+viewer task = `AI 识别 · %1 · %2%`（百分比 0 位小数）。
   - logLine(line)：log "CloudForge: %1"。
7. onLitePtFinished(success, outputDir, error)：按钮文字一律改 "重新运行"。
   - 失败：setBusy(false)；_pointCountLabel "无识别结果"；logError(error)；状态栏取 error 第一行。
   - 读取失败（CloudForgeResultReader::read 失败）：同上，log `输出读取失败: %1`，状态栏 "AI 结果读取失败"。
   - 成功：parsed.profileName = 当前 profile；_aiResult = parsed；viewer.setZUpView()；showAiResults()；setBusy(false)；_lastResultDir=outputDir；log `AI 识别完成: %1 个%2，%3 个有效点，耗时 %4 秒`（%2= "语义类别"或"实例"，%4 1 位小数）；invalidPoints>0 时 log `已保留原始点索引映射；过滤无效点 %1 个`；状态栏：语义任务 → "语义识别完成；精拟合独立对象需使用实例模型"，实例任务 → "AI 识别完成；请选择实例后执行 RANSAC 精拟合"。

### 2.5 showAiResults / populateAiResultsTree（AI 结果展示）
- _aiDisplayShapes：每个 instance 造一个 DetectedShape（type=UNKNOWN，inliers=instance.cloud，inlierIndices=pointPositions，inlierCount=pointCount，softScore=confidence）。
- 切换分段按钮：语义→id1，实例→id2（setChecked）；viewer task "显示 AI 语义类别…"/"显示 AI 实例…"；viewer.showDetectionResults(_aiDisplayShapes, 空remaining, _aiResult.cloud)。
- 树重建（QSignalBlocker 包裹防触发选中）：每 instance 一行，name = CloudForgeClassLocalizer.toChinese(className, semanticId)：
  - 语义任务 col0：`%1\n类别区域 · %2 点`
  - 实例任务 col0：`%1 #%2\n%3 点%4`，%4 = confidence<0.5 时 " · 需核对" 否则空串
  - col1：`%1%`（confidence*100，1 位小数），右对齐垂直居中
  - item UserRole=index，kItemKindRole=AI；flags 仅 Enabled|Selectable（无 checkbox）；icon = 8×8 纯色块 `PointCloudViewerWidget::objectColor(i)`；行高 sizeHint 48；受搜索框过滤。
- _pointCountLabel：`%1 个语义类别` / `%1 个 AI 实例`。
- 恢复之前选中（previousSelection 有效则 setCurrentItem）；否则 _selectedAiInstance=-1 + updateObjectDetails。
- _sceneLabel：`识别结果 · %1 个有效点`。updateControlStates。

### 2.6 检测/精拟合（detectShapes，唯一入口 _measureBtn "精拟合选中实例"；_detectBtn 隐藏同槽）
1. 守卫：busy；`_aiResult.task != "instance_segmentation"` 或无云或未选中实例 → logWarning "请先运行实例模型，并在右侧选中一个 CloudForge 对象"；`instance.pointPositions.size() < 50` → logWarning "该对象少于 50 点，无法可靠拟合"。
2. 读参：presetIndex = _detectPresetCombo.currentIndex()（0="拟合平面"，1="拟合多种几何面"）；_detectTimer.start；setBusy(true, "精拟合选中对象…")。
3. 后台（QtConcurrent，捕获 cloud/selectedIndices/objectIndex/presetIndex）：
   - `RansacDetector::Config config; config.preset = (presetIndex==0 ? Preset::Architecture : Preset::Full);` 其余字段全用结构体默认值（见契约节）。
   - `detector.detectFromPointSubset(cloud点数组, 总点数, selectedIndices.data(), 选中数, presetIndex==0 ? PLANE : UNKNOWN)`。
   - 每个 shape 用 inlierIndices 从 cloud 重建 inliers 点云，并校验索引必须 ⊆ 选中集合，否则 throw "Geometry escaped its CloudForge object"；remaining 同理（"Remaining point escaped its CloudForge object"）；stats=lastDetectStats。异常进 result.error。
4. onDetectionFinished：setBusy(false)；error 非空 → logError 返回；`_objectRefinements[aiIndex]=result`；_selectedAiInstance=aiIndex；updateObjectDetails()；showSelectedGeometry()；updateControlStates()；状态栏 `选中对象精拟合完成 · %1 个几何面 · %2 秒`（%2 = _detectTimer.elapsed()/1000.0，1 位小数）。
5. showSelectedGeometry()：找 _objectRefinements[_selectedAiInstance]，无则返回；_showingAiResults=false；分段按钮3 "几何" setChecked；viewer.showDetectionResults(shapes, remaining, _aiResult.cloud)；_sceneLabel "几何视图 · 仅显示选中对象的拟合结果"。

### 2.7 树选中（onTreeItemSelected）
- 守卫：busy、item 空、item kind≠AI（仅 AI 树行生效）。
- _selectedAiInstance = UserRole 值；若 !_showingAiResults：viewer.showDetectionResults(_aiDisplayShapes, {}, _aiResult.cloud)，_showingAiResults=true。
- 分段按钮按任务类型（1 语义 / 2 实例）setChecked；viewer.showAllShapes()；viewer.setHighlightIndex(index)；_sceneLabel "选中对象高亮 · 其余点云淡显"；updateObjectDetails()；updateControlStates()；状态栏："已选中实例；精拟合只处理此对象内的点"（实例任务）/ "已选中语义类别；该区域可能包含多个物体"（语义任务）。

### 2.8 updateObjectDetails（右侧详情区，随选中/精拟合变化）
- 无选中（或索引越界）：_selectionTitleLabel "未选择对象"；_measurementLabel "选择实例后显示点数与包围盒"；_detailLabel clear；_geometryLabel "尚未精拟合"。
- 有选中 object = _aiResult.instances[i]：
  - 标题：语义 → 类名；实例 → `Name #instanceId`。
  - _detailLabel：`AI 置信度 %1% · %2`（%1=confidence*100 一位小数；%2：语义→"类别区域，可能包含多个物体"；实例且 confidence<0.5→"低置信度 · 需核对类别"；否则 "已识别"）。
  - _measurementLabel（粗测）：`实例点数    %1\n\n包围盒 X    %2 mm\n包围盒 Y    %3 mm\n包围盒 Z    %4 mm\n\n坐标方向    %5 → Z-up`
    （size = (bboxMax-bboxMin)*1000，各轴 1 位小数 mm；%5 = _aiResult.selectedUpAxis 空则 "Z"）。
  - _geometryLabel（精拟合区）：
    - 无精拟合结果：语义 → "请切换实例模型以测量独立对象"；实例 → "尚未精拟合\n仅处理本对象内的点"。
    - 有结果且无 shapes："未找到可靠几何面；原始对象已保留"。
    - 有结果：行 = `%1 %2 · %3 点 · RMSE %4 mm`（%1=shape.getTypeName() 中文类型名，%2=同类序号 1 起，%3=inlier 数，%4=rmse*1000 两位小数），行间 "\n"；整体 =
      `本对象覆盖率 %1%\n%2\n\n包围盒为粗测；拟合残差不代表尺寸真值误差`（%1=覆盖率=去重覆盖点数/instance.pointCount*100 一位小数）。
  - 收尾 resizeGeometryDetails：_geometryLabel minHeight = max(52, heightForWidth(max(240,width)))。

### 2.9 清除（clearAll，"清空工作区"）
- busy 忽略；重置全部状态（同加载成功那组 + _sourceBaseName/_sourceFilePath/_lastAiOutputDir 清空）；_resultsTree.clear；viewer.clear()；_infoLabel.clear 且 styleSheet 清空；_detailLabel.clear；_fileTitleLabel "CloudForge  /  Office sample  /  尚未打开点云"；_selectionTitleLabel "未选择对象"；_measurementLabel "选择识别结果后显示三轴包围盒尺寸"（注意与初始文案"选择实例后显示点数与包围盒"不同）；_pointCountLabel "0 个对象"（也不同）；updateObjectDetails（会把 selectionTitle 等再刷一遍）；_sceneLabel "打开点云 · 选择模型 · 运行识别"；_exportBtn.setEnabled(false)；按钮0 选中；updateControlStates；log "已清除所有数据"；状态栏 "就绪"。

### 2.10 导出（exportResults → saveObjectResults）
- 守卫：busy 或 `_objectRefinements.empty()` → logWarning "请先选择一个 实例并完成精拟合"。
- 对话框：标题 "导出对象与精拟合结果"，默认文件名 `object_measurements.json`（位于 _lastLoadDir），过滤器 `对象测量 (*.json)`。
- saveObjectResults(path) 写 JSON（QSaveFile，Indented）：
  `{schema_version:1, litept_output:_lastAiOutputDir, coordinate_frame:"CloudForge normalized Z-up", unit:"m", input_up_axis:_aiResult.selectedUpAxis, objects:[{instance_id, semantic_id, class_name, confidence, point_count, geometry:[{type: getTypeNameEN(), coefficients:[...], rmse_m, source_indices:[原始文件中的索引]}]}]}`
  其中 shape.inlierIndices（CloudForge 云内位置）经 instance.pointPositions→sourceIndices 映射回原始点索引；映射失败返回 false。
- 成功：状态栏 `已导出对象、几何参数及原始点索引：%1`（完整路径）；失败 logError "导出失败，请检查目录权限"。
- 另有遗留 helper saveDetectionResultsToDir（写 base_input.pcd / base_shape_N_EN名.pcd / base_remaining_unclassified.pcd）与 shapeFileBaseName/resultOutputDir（`appDir/data/saved/{源名}/detect_{runId}`）——**当前代码路径未调用**（_saveWatcher 无 future，onSaveFinished 不会触发），复刻时可忽略。

### 2.11 showAllShapes / deselectAllShapes（槽，当前 UI 无对应按钮，且主要作用于旧 RANSAC 树）
- showAllShapes：setAllRecognizedChecked(Checked)（遍历顶层 section 行，文本以 "已识别"/"AI 实例"/"AI 语义类别" 开头的第一个，递归设子项勾选并 setShapeVisible）→ viewer.showAllShapes() → _detailLabel.clear。
- deselectAllShapes：setAllRecognizedChecked(Unchecked)（内部对 Unchecked 额外 setHighlightIndex(-1)）→ _detailLabel.clear。
- onTreeItemChanged（checkbox 勾选联动）：section 行忽略；category 行传播到子 shape 并 setShapeVisible，取消勾选时 setHighlightIndex(-1)；remaining 行 → viewer.setRemainingVisible；普通 shape 行 → setShapeVisible + 可见时高亮。注意：**populateResultsTree（含 "已识别 (N)"/分类/勾选框/"未识别 (N 点)" 的树）在当前 AI 流程中从未被调用**（_detectedShapes 恒为空），属遗留；现存活动树只有 populateAiResultsTree 的扁平实例列表。

## 3. 各标签的显示内容/更新时机（原文格式串汇总）

| 标签 | 位置 | 可能文本（全部原文） |
|---|---|---|
| _fileTitleLabel | 顶栏面包屑 | 初始 "CloudForge  /  尚未打开点云"；加载后 "CloudForge  /  Office sample  /  {文件名}"；生成后 "CloudForge  /  Office sample  /  合成测试点云"；加载 CloudForge 结果目录后 "CloudForge  /  CloudForge 结果  /  {目录名}"；清除后回初始 |
| _infoLabel | 左栏 | 初始 "●  尚未加载文件"；加载后 "●  {文件名}\n    {N} 个点"；生成后 "●  合成测试点云\n    {N} 个点"；AI 目录加载 "●  已加载 AI 结果\n    {N} 个点"；清除后清空 |
| _pointCountLabel | 右栏头 | "0 个实例"（初始/加载/生成后）、"识别中"（AI 运行）、"无识别结果"（AI 失败）、"{N} 个 AI 实例"、"{N} 个语义类别"、"0 个对象"（清除） |
| _sceneLabel | 视图下方 | "打开点云 · 选择模型 · 运行识别"（初始/清除）、"原始视图 · 请选择模型运行识别"（加载/生成后）、"识别结果 · {N} 个有效点"（AI 完成/加载 AI 目录）、"选中对象高亮 · 其余点云淡显"（树选中）、"几何视图 · 仅显示选中对象的拟合结果"（几何视图） |
| _selectionTitleLabel | 详情卡 | "未选择对象" / "{类名}"（语义） / "{类名} #{instanceId}" |
| _detailLabel | 详情卡 | "AI 置信度 {x.x}% · 类别区域，可能包含多个物体 / 低置信度 · 需核对类别 / 已识别"；无选中/清除时清空 |
| _measurementLabel | LITEPT 粗测 | 初始 "选择实例后显示点数与包围盒"；选中后 "实例点数    {N}\n\n包围盒 X    {x.x} mm\n包围盒 Y    {x.x} mm\n包围盒 Z    {x.x} mm\n\n坐标方向    {axis} → Z-up"；清除后 "选择识别结果后显示三轴包围盒尺寸" |
| _geometryLabel | 几何精拟合 | "尚未精拟合"；选中未拟合 "尚未精拟合\n仅处理本对象内的点"（实例）/"请切换实例模型以测量独立对象"（语义）；拟合后 "本对象覆盖率 {x.x}%\n{行…}\n\n包围盒为粗测；拟合残差不代表尺寸真值误差"，行 "{中文类型} {序号} · {N} 点 · RMSE {x.xx} mm"；无形状 "未找到可靠几何面；原始对象已保留" |
| 状态栏 | 底部 | 见 §6 |

几何类型中文名（kShapeCategories，RMSE 行与树用）：平面/圆柱体/球体/圆锥体/圆环/三维圆/三维椭圆/法向平面/正交平面/直线/未知。

## 4. setBusy / updateControlStates 启停矩阵

setBusy(busy, message)：置 _busy → updateControlStates() → viewer.setTaskActive(busy, message)；busy 时 setCursor(BusyCursor)+processEvents；非 busy unsetCursor 且 **状态栏强制 "就绪"**（因此成功后的状态文案必须在 setBusy(false) 之后再 updateStatus，现有代码正是如此排序）。

updateControlStates 依据（每次调用全量刷新）：
- idle=!_busy；hasCloud=当前云非空；hasAiSelection = task=="instance_segmentation" 且 _selectedAiInstance∈[0,instances.size)；hasAiInput = hasCloud 且 _sourceFilePath 非空 且 后缀被当前 profile 接受（nuscenes→bin，其余→ply/pcd）。

| 控件 | enabled 条件 |
|---|---|
| _generateBtn(隐藏) | idle |
| _loadBtn | idle |
| _saveBtn | idle && hasCloud |
| _detectBtn(隐藏) | idle && hasAiSelection |
| _measureBtn | idle && hasAiSelection |
| _detectPresetCombo | idle && hasAiSelection |
| _aiProfileCombo | idle |
| _qualityCombo | idle && profile≠nuscenes-semantic |
| _unitCombo | idle && profile≠nuscenes-semantic |
| _upAxisCombo | idle && profile≠nuscenes-semantic |
| _resultsTree | idle |
| _clearBtn | idle && hasCloud |
| _exportBtn | idle && _objectRefinements 非空 |
| _aiButton | (runner 运行中) ‖ (idle && hasAiInput)；tooltip：nuscenes → "使用 NuScenes 室外语义权重；输入必须为 float32 N×5 的 .bin"，否则 "使用所选 CloudForge 室内权重；输入必须为带真实 RGB 的 .ply 或 .pcd"；文字态 "运行识别"→"取消 AI"→"重新运行" |
| 分段按钮0 原始 | idle && hasCloud |
| 分段按钮1 语义 | idle && task=="semantic_segmentation" && instances 非空 |
| 分段按钮2 实例 | idle && task=="instance_segmentation" && instances 非空 |
| 分段按钮3 几何 | idle && _objectRefinements 含 _selectedAiInstance |

## 5. QSettings 持久化（org "RANSAC" / app "RANSAC PointCloud Tool"）

- `lastSaveDir`：保存对话框后写入。
- `lastLoadDir`：加载对话框选择后写入（无论成功）。
- `litept/profile`：AI profile 组合框变更时写入；启动时读（默认 "scannet200-instances"）；AI 启动时也回写。
- `litept/wslDistribution`（默认 "Ubuntu"）、`litept/wslRoot`（默认 "/mnt/e/C++/Point/CloudForge-Neural"）、`litept/venvRoot`（默认 "/opt/cloudforge-venv"）：每次 AI 启动时读取并回写（当前 UI 无编辑入口）。
- `litept/windowsOutputRoot`（默认 "E:/C++/Point/CloudForge/outputs"）：只读，无回写。

## 6. 状态栏 updateStatus 全部调用点与文案

- 构造完成："就绪"。
- 初始 statusBar："就绪 · 打开点云后选择模型运行"。
- setBusy(false) 一律 "就绪"。
- logWarning/logError 同时把消息推到状态栏（如 "没有可保存的点云"、"该对象少于 50 点，无法可靠拟合"、"请先选择一个 实例并完成精拟合" 等）。
- 加载失败："加载失败"；加载中进度 tick："读取点云… {pct}% ({done} / {total} MB) · {扫描|生成点云|上传视图}"。
- AI 进度："AI 识别 · {phase} · {pct}%"；AI 失败=error 首行；读取失败 "AI 结果读取失败"；AI 成功 "AI 识别完成；请选择实例后执行 RANSAC 精拟合" / "语义识别完成；精拟合独立对象需使用实例模型"。
- 加载 AI 目录："已加载 CloudForge 识别结果"。
- 树选中："已选中实例；精拟合只处理此对象内的点" / "已选中语义类别；该区域可能包含多个物体"。
- 精拟合完成："选中对象精拟合完成 · {N} 个几何面 · {s.s} 秒"。
- 导出成功："已导出对象、几何参数及原始点索引：{path}"。
- 测量记录 nav："当前已精拟合 {N} 个对象"。

## 7. 前端复刻需对齐的数字/默认值速查

- 布局：topBar 48px；左栏 220px（折叠 58px）；右栏 328px；splitter 初始 {224,844,336}；brandBox 220px；header 46px；_resultsTree 高 240–380、第2列 65px；状态栏 28px；窗口 1440×900（min 1280×820）。
- 显示点上限 900,000；精拟合最少点数 50；搜索快捷键 Ctrl+K；树行高 48；置信度阈值 0.5（" · 需核对"/"低置信度 · 需核对类别"）。
- 质量档：0.02m（默认）/0.01m；单位 m/cm/mm；up 轴 auto/z/-z/y/-y/x/-x。
- AI 运行名 `gui_{safeBase}_{yyyyMMdd_HHmmss_zzz}`；输出根 `E:/C++/Point/CloudForge/outputs`；合成云基名 `generated_{yyyyMMdd_HHmmss}`。
- 格式精度：包围盒 mm 1 位小数；RMSE mm 2 位小数；置信度 1 位小数百分比；覆盖率 1 位小数；耗时 1 位小数秒；TXT 进度 MB 0 位小数、流式日志 MB 1 位小数。

## Risks
- 样式是两张 setStyleSheet 叠加，第二张覆盖第一张（如 font 13px、按钮 30px/radius6、segmented 白底）——照第一张抄会错；上面已给生效值
- 隐藏/遗留元素易被误复刻：_detectBtn、_generateBtn、pickTool、moreTool、_taskDrawer、整个菜单栏均不可见；populateResultsTree（勾选框树）、onTreeItemChanged、saveDetectionResultsToDir、shapeFileBaseName/resultOutputDir、onSaveFinished、_saveWatcher 全是死代码（_saveWatcher 从未 setFuture）——别把勾选树当活功能
- _aiButton 是三态按钮：'运行识别'→运行中'取消 AI'（再点=取消而非新任务）→结束后'重新运行'；且运行中强制保持 enabled
- setBusy(false) 会把状态栏强制刷成 '就绪'，所有成功文案都在 setBusy(false) 之后调用 updateStatus —— 前端异步时序必须保持同样顺序，否则文案被吞
- _fileTitleLabel/…的文案有硬编码前缀 'CloudForge  /  Office sample  /  '（连加载 CloudForge 结果、合成云都各有一套），清除后 _measurementLabel/_pointCountLabel 文案与初始不同（'选择识别结果后显示三轴包围盒尺寸'/'0 个对象' vs '选择实例后显示点数与包围盒'/'0 个实例'）——别共用一个常量
- 语义任务 vs 实例任务会改变：可点分段按钮(1/2)、geometryLabel 文案、树行格式、完成状态文案；精拟合要求 task==instance_segmentation 且 ≥50 点
- _geometryLabel 高度由 heightForWidth 动态计算 minHeight≥52，否则长文本被裁（回归测试专门查此项）；wordWrap 必须
- _detectPresetCombo 当前无默认高亮联动且未持久化，索引 0/1 直接映射 Architecture/Full + PLANE/UNKNOWN 目标类型，前端只需传 0/1
- RansacDetector::Config 除 preset 外全走默认值（planeDistThreshold=0.025、minInlierCount=100、maxShapesToDetect=15 等）；前端不要凭空暴露这些参数
- 原生文件对话框期间 pauseRendering/resumeRendering —— WebGL 前端无需等价物，但注意加载/AI 运行期间 viewer 覆盖 task overlay（setTaskActive/setTaskMessage）
- 精拟合结果按 aiIndex 存 map，允许多个实例各自精拟合；导出 JSON 的 source_indices 依赖 instance.sourceIndices 映射，映射缺失直接失败（导出报错 '导出失败，请检查目录权限' 的另一种失败路径）
- QSettings 在 Windows 落注册表 HKCU\Software\RANSAC\RANSAC PointCloud Tool；前端用 localStorage 即可，但默认值语义要保持