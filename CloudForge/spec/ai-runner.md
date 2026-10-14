# ai-runner

## Summary
GUI 通过 wsl.exe 启动 `bash -lc "source /opt/cloudforge-venv/bin/activate && cd /mnt/e/C++/Point/CloudForge-Neural && exec python tools/cloudforge_infer.py <wsl输入路径> --profile <profile> --output-dir <wsl输出目录>"`（非 nuscenes-semantic 追加 --grid-size/--input-unit/--up-axis，*-instances 再追加 --instance-merge-distance 0）；stderr 逐行解析 `CLOUDFORGE_EVENT {json}` 事件驱动 progressChanged，其余行进诊断日志；成功后 CloudForgeResultReader 读取 run.json + labeled_cloud.ply(binary_little_endian PLY) + instances.json/semantic_histogram 构建实例列表，类别名经 230 条英→中映射表本地化，未命中回退「类别 N/未知类别」。main_gui.cpp 提供 5 个回归/自检 CLI 入口。

## Contracts
- 进程启动：`wsl.exe -d {dist} -- bash -lc {CMD}`， SeparateChannels；CMD=`source '{venv}'/bin/activate && cd '{root}' && exec python tools/cloudforge_infer.py '{wsl输入}' --profile '{profile}' --output-dir '{wsl输出}'`，非 nuscenes 追加 ` --grid-size {0.3f格式} --input-unit '{unit}' --up-axis '{axis}'`，*-instances 再追加 ` --instance-merge-distance 0`
- windowsToWslPath: 绝对路径正斜杠化后 `E:/x` → `/mnt/e/x`（盘符小写，其余原样）；shellQuote: `'`→`'\''` 后单引号包裹
- 默认值：dist=Ubuntu, litePtRoot=/mnt/e/C++/Point/CloudForge-Neural, venvRoot=/opt/cloudforge-venv, profile=scannet200-instances, unit=m, upAxis=auto, gridSize=0.02；输出根=E:/C++/Point/CloudForge/outputs；运行目录=gui_<安全文件名>_<yyyyMMdd_HHmmss_zzz>
- stderr 进度协议：行前缀 `CLOUDFORGE_EVENT ` + JSON 对象 {stage|phase, progress}；phaseText 映射 13 个键（validation/normals/orientation/model_load/model/postprocessing/inference/tile_inference/tile_fusion/postprocess/export/complete/oom_retry→中文），未命中原样透传
- run.json 契约：schema_version==1, status=='success', task∈{semantic_segmentation, instance_segmentation}, config(路径), selected_up_axis, input_points/valid_points/invalid_points, total_elapsed_seconds(缺省回落 elapsed_seconds)；point_labels.bin 大小==input_points*12、source_index.bin 大小==valid_points*8（只校验不解析）
- instances.json（仅实例任务）：schema_version==1，instances[] 字段 instance_id/semantic_id/class_name(默认"object")/score/points/bbox_min_m/bbox_max_m；语义任务用 run.json semantic_histogram[]（semantic_id/class_name默认"unknown"/points）
- labeled_cloud.ply：binary_little_endian，vertex 属性必含 x,y,z,source_index(float32/int32/uint32)，实例任务+instance_id，语义任务+semantic_id+confidence（均4字节）；逐点按 label_id 归组，逐实例重算 pointCount/平均置信度(语义)/minmax包围盒
- 完整错误串（中文原文）："输出不完整，缺少: %1"、"CloudForge 输出协议不受支持或推理状态不是 success"、"标签或源索引二进制文件大小与 run.json 不一致"、"实例输出缺少有效的 instances.json"、"标注点云必须是 cloudforge schema v1 的 binary_little_endian PLY"、"标注点云点数 %1 与 run.json 的有效点数 %2 不一致"、"AI 推理已取消"、"进程失败（退出码 %1）"、"无法启动 wsl.exe: %1"
- toChinese：key = trim→lower→'-'→' '→simplified；查表约 230 条；未命中 semanticId>=0 ? "类别 %1" : "未知类别"
- CLI：--check-plane-subset（双平行平面划分回归，退出0/2）、--check-localization CLASS [ID]、--run-litept IN OUT、--check-litept-output DIR、--check-litept-refine DIR [IDX]、--check-cloud FILE、--check-ui-workflow DIR ART、--render-cloud/--render-litept-output/--screenshot
- profile 反推（读结果后）：config 路径小写含 scannet200→scannet200-instances / structured3d→structured3d-semantic / nuscenes→nuscenes-semantic / scannet+instance→scannet-instances / scannet→scannet-semantic

## Details
# CloudForge AI 子进程集成 — Rust 端口规格

源文件：`E:/C++/Point/RANSAC_GUI/gui/src/litept_integration.cpp`（447 行）、`gui/include/litept_integration.h`（82 行）、`gui/src/litept_class_localizer.cpp`（259 行）、`gui/include/litept_class_localizer.h`、`gui/src/main_gui.cpp`（230 行）、`gui/src/main_window.cpp`（调用侧节选）。

---

## 1. CloudForgeProcessRunner::start — WSL 命令行构造（原文）

### 1.1 进程启动

```cpp
_process.start("wsl.exe", {"-d", config.distribution, "--", "bash", "-lc", command});
```

- `QProcess::SeparateChannels`（stdout/stderr 分离）。**不设置任何环境变量**（无 setProcessEnvironment）。
- `bash -lc` 是**登录 shell**。
- `exec python` 使 bash 被 python 替换，退出码即 python 退出码。

### 1.2 command 模板（bash -lc 的整条命令）

```
source {VENV}/bin/activate && cd {ROOT} && exec python tools/cloudforge_infer.py {INPUT} --profile {PROFILE} --output-dir {OUTPUT}
```

各占位符均经 `shellQuote()`（见 1.4），VENV/ROOT 为 WSL 侧路径直接引用，INPUT/OUTPUT 先经 `windowsToWslPath()` 转换再引用：

```
source %1/bin/activate && cd %2 && exec python tools/cloudforge_infer.py %3 --profile %4 --output-dir %5
```
实参顺序：`shellQuote(config.venvRoot), shellQuote(config.litePtRoot), shellQuote(windowsToWslPath(windowsInputPath)), shellQuote(config.profile), shellQuote(windowsToWslPath(windowsOutputDir))`。

### 1.3 条件追加参数

- **仅当 `config.profile != "nuscenes-semantic"`** 时追加：
  ```
   --grid-size %1 --input-unit %2 --up-axis %3
  ```
  - grid-size 格式：`QString::arg(gridSize, 0, 'f', 3)` → 固定 3 位小数，默认 `0.020`。
  - input-unit、up-axis 经 shellQuote。
- **仅当 `config.profile.endsWith("-instances")`** 再追加（注释原文：`// Adjacent cabinets must retain their independently predicted identities.`）：
  ```
   --instance-merge-distance 0
  ```

### 1.4 windowsToWslPath（原文规则）

```cpp
QString normalized = QDir::fromNativeSeparators(QFileInfo(path).absoluteFilePath());
if (normalized.size() >= 3 && normalized[1] == ':' && normalized[2] == '/') {
    const QChar drive = normalized[0].toLower();
    return QString("/mnt/%1/%2").arg(drive, normalized.mid(3));
}
return normalized;
```
即：转绝对路径 + 正斜杠；`E:/C++/Point/x.ply` → `/mnt/e/C++/Point/x.ply`（盘符小写，其余原样保留，不做 URL 转义）。非盘符路径原样返回。

### 1.5 shellQuote（原文规则）

```cpp
escaped.replace("'", "'\\''");   // 单引号 → '\''（POSIX 标准转义）
return "'" + escaped + "'";      // 整体单引号包裹
```

### 1.6 CloudForgeRunnerConfig 默认值（头文件原文）

| 字段 | 默认值 |
|---|---|
| distribution | `"Ubuntu"` |
| litePtRoot | `"/mnt/e/C++/Point/CloudForge-Neural"` |
| venvRoot | `"/opt/cloudforge-venv"` |
| profile | `"scannet200-instances"` |
| inputUnit | `"m"` |
| upAxis | `"auto"` |
| gridSize | `0.02` |

### 1.7 main_window.cpp 的设置持久化与输出目录约定（QSettings 键）

- `litept/wslDistribution` 默认 `"Ubuntu"`；`litept/wslRoot` 默认 `"/mnt/e/C++/Point/CloudForge-Neural"`；`litept/venvRoot` 默认 `"/opt/cloudforge-venv"`；`litept/profile` 默认 `"scannet200-instances"`；`litept/windowsOutputRoot` 默认 `"E:/C++/Point/CloudForge/outputs"`。
- UI 选项：profile 下拉 `{"scannet200-instances","scannet-instances","scannet-semantic","structured3d-semantic","nuscenes-semantic"}`；质量 `0.02`（标准 · 20 mm 采样）/`0.01`（细节 · 10 mm 采样）；单位 `"m"/"cm"/"mm"`；up-axis `"auto","z","-z","y","-y","x","-x"`。`nuscenes-semantic` 时质量/单位/up-axis 禁用（且只接受 float32 N×5 的 .bin 输入；室内模型要求带真实 RGB 的 PLY/PCD）。
- 输出目录：
  ```cpp
  QDir().mkpath(outputRoot);
  QString safeBase = _sourceBaseName;                       // 输入文件名（去扩展名）
  safeBase.replace(QRegularExpression("[^A-Za-z0-9_-]+"), "_");
  if (safeBase.isEmpty()) safeBase = "cloud";
  const QString runName = QString("gui_%1_%2")
      .arg(safeBase, QDateTime::currentDateTime().toString("yyyyMMdd_HHmmss_zzz"));
  _lastAiOutputDir = QDir(outputRoot).filePath(runName);
  ```
  即 `gui_<安全名>_<yyyyMMdd_HHmmss_zzz 毫秒3位>`，如 `gui_room_20260916_142530_123`。启动日志：`"启动 CloudForge [%1]: %2 → %3"`。

---

## 2. 进度解析（stderr 逐行）

stderr 缓冲按 `'\n'` 切行；结束时 flush 残行。每行 `QString::fromUtf8(...).trimmed()` 后：

- **事件行**：前缀原文 `CLOUDFORGE_EVENT `（注意尾部一个空格）。取前缀后的剩余文本按 UTF-8 解析为 JSON 对象：
  ```cpp
  const QString phase = object.value("stage").toString(object.value("phase").toString());
  emit progressChanged(phaseText(phase), object.value("progress").toDouble());
  ```
  即 `stage` 字段优先，其次 `phase` 字段；`progress` 为 double（0..1）。
- **其余非空行**：追加进 `_diagnostics`（以 `'\n'` 连接），并 `emit logLine(line)`。
- 空行跳过。

### phaseText 映射表（原文全量）

| phase 键 | 显示文本 |
|---|---|
| `validation` | `校验输入` |
| `normals` | `估计法向` |
| `orientation` | `统一坐标` |
| `model_load` | `加载模型` |
| `model` | `加载模型` |
| `postprocessing` | `实例后处理` |
| `inference` | `AI 推理` |
| `tile_inference` | `分块推理` |
| `tile_fusion` | `融合分块` |
| `postprocess` | `实例后处理` |
| `export` | `导出结果` |
| `complete` | `完成` |
| `oom_retry` | `显存恢复重试` |
| 未命中 | phase 原样返回 |

GUI 侧格式化：`"AI 识别 · %1 · %2%"`（progress×100 取整 0 位）。

### stdout

每次 readyRead 将整块 `fromUtf8(readAllStandardOutput()).trimmed()`，非空则**整块作为一条** `logLine(text)`（不逐行切分）。

---

## 3. logLine / completed / cancel / 诊断

- **logLine**：stdout 整块（见上）；stderr 的非 `CLOUDFORGE_EVENT` 行逐条。GUI 侧加前缀 `"CloudForge: %1"` 写日志。
- **errorOccurred(FailedToStart)**：`_diagnostics += "无法启动 wsl.exe: %1"（QProcess::errorString）`，然后 `completed(false, _outputDir, _diagnostics)`。
- **finished(exitCode, exitStatus)**：先把残余 stderr flush 进解析器。`success = !_cancelled && exitStatus == NormalExit && exitCode == 0`。
  - `_cancelled` → error = `"AI 推理已取消"`。
  - 非 success → error = `"进程失败（退出码 %1）"`；若 `_diagnostics.trimmed()` 非空，追加 `"\n" + 诊断`。
  - `completed(success, _outputDir, error)`。
- **cancel()**：若在运行：`_cancelled = true; _process.kill();`（kill 的是 wsl.exe，Linux 侧 python 随会话终止——移植时注意 Windows 上杀 wsl.exe 的语义）。
- start 时重置：清空 `_stderrBuffer`、`_diagnostics`、`_cancelled=false`、`_outputDir=windowsOutputDir`；若已在运行则直接 return。
- GUI 完成后状态文案：语义任务 `"语义识别完成；精拟合独立对象需使用实例模型"`；实例任务 `"AI 识别完成；请选择实例后执行 RANSAC 精拟合"`。读取失败状态 `"AI 结果读取失败"`。

---

## 4. CloudForgeResultReader::read(outputDir) — 输出目录完整格式

### 4.1 必需文件（缺失即失败）

`run.json`、`point_labels.bin`、`source_index.bin`、`labeled_cloud.ply`。错误：`"输出不完整，缺少: %1"`（%1=绝对文件路径）。

### 4.2 run.json（JSON 对象，UTF-8）

| 字段 | 用途 |
|---|---|
| `task` | 字符串；必须为 `"semantic_segmentation"` 或 `"instance_segmentation"` |
| `config` | 字符串 → `configPath`（用于反推 profile） |
| `schema_version` | 必须 `== 1` |
| `status` | 必须 `== "success"` |
| `selected_up_axis` | 字符串 → `selectedUpAxis` |
| `input_points` / `valid_points` / `invalid_points` | int |
| `total_elapsed_seconds` | double；缺失时回落 `elapsed_seconds`，再缺失 0.0 |

不满足（schema/task/status）→ `"输出协议不受支持或推理状态不是 success"`。

**二进制大小校验**（只校验，从不读取内容）：`point_labels.bin` 大小 == `input_points * 12`；`source_index.bin` 大小 == `valid_points * 8`；`input_points >= 0`、`valid_points >= 0`。否则 `"标签或源索引二进制文件大小与 run.json 不一致"`。

### 4.3 instances.json（仅 instance_segmentation 任务）

- 必须存在、是 JSON 对象、`schema_version == 1`，否则 `"实例输出缺少有效的 instances.json"`（若文件缺失且 error 为空，填该消息）。
- `instances` 为 JSON 数组，每条记录字段：
  - `instance_id`: int（默认 -1）→ instanceId
  - `semantic_id`: int（默认 -1）→ semanticId
  - `class_name`: string（默认 `"object"`）→ className
  - `score`: double → confidence
  - `points`: int → pointCount（初值，随后被 PLY 实际计数覆盖）
  - `bbox_min_m` / `bbox_max_m`: 3 元素数字数组 → QVector3D（非 3 元素则为 (0,0,0)）
- 以 `instance_id` 建 `instanceLookup: map<int, usize索引>`。

### 4.4 语义任务（semantic_segmentation）

不读 instances.json，读 run.json 的 `semantic_histogram` 数组；每条：`semantic_id`（默认 -1）、`class_name`（默认 `"unknown"`）、`points`；instanceId 固定 -1；confidence 初值 0（随后由 PLY confidence 平均覆盖）。以 `semantic_id` 建 `semanticLookup`。

### 4.5 labeled_cloud.ply（binary_little_endian，schema v1）

- 逐行读文本头：首行 trimmed 必须 == `"ply"`，否则 `"标注点云不是 PLY 文件"`。
- `format binary_little_endian ` 前缀 → littleEndian=true。
- `element ` 行：按空格切 3 段，`parts[1]=="vertex"` 时记录 `vertexCount=parts[2]`。
- `property `（仅 vertex 元素内）：3 段，`parts[1]=="list"` 拒绝 → `"标注点云包含不支持的顶点属性"`。类型宽度表：`char/int8/uchar/uint8`→1；`short/int16/ushort/uint16`→2；`int/int32/uint/uint32/float/float32`→4；`double/float64/int64/uint64`→8；未知 → `"标注点云包含未知 PLY 类型: %1"`。属性按声明顺序累计 offset，recordSize 累加。
- `end_header` 结束头部。
- 校验（否则 `"标注点云必须是 cloudforge schema v1 的 binary_little_endian PLY"`）：littleEndian；vertexCount>=0；recordSize>0；存在属性 `x,y,z,source_index`；instance 任务须有 `instance_id`，semantic 任务须有 `semantic_id` **和** `confidence`；上述属性类型宽度均必须为 4。
- vertexCount > u32::MAX → `"标注点云点数超出 GUI 支持范围"`。
- **二进制主体**：每点 recordSize 字节小端序。float32 读 x,y,z（bit reinterpret，非数值转换）；labelId = 语义任务读 `semantic_id`(int32 LE) / 实例任务读 `instance_id`(int32 LE)；`source_index`(uint32 LE)；语义任务再读 `confidence`(float32)。
- **instances 构建**：每点按 labelId 查表命中则：`pointPositions.push_back(点在 PLY 中的序号 usize)`、`sourceIndices.push_back(source_index u32)`、`instance.cloud->points.push_back(该点)`；语义任务累加 confidence。查表未命中的点只进整体 cloud。
- **收尾**：整体 cloud：width=点数, height=1, is_dense=false（PCL 语义，Rust 端仅记录点数）。每实例：`pointCount = pointPositions.len()`（覆盖 JSON 值）；语义任务且 count>0 → `confidence = 累加和 / count`；**只要实例非空，bboxMin/bboxMax 一律由实例自身点云 min/max 重算**（覆盖 instances.json 的 bbox）。实例 cloud 同样 width/height/is_dense。
- `validPoints > 0 && cloud点数 != validPoints` → `"标注点云点数 %1 与 run.json 的有效点数 %2 不一致"`。
- 所有错误消息中文原文见上；JSON 读取失败消息：`"无法读取 %1: %2"`、`"JSON 格式无效 %1: %2"`；PLY 打不开：`"无法读取标注点云: %1"`；截断：`"标注点云在第 %1 个点处截断"`。

### 4.6 profile 反推（main_window::loadLitePtOutputDirectory）

`configPath.toLower()` 包含：`scannet200` → `"scannet200-instances"`；`structured3d` → `"structured3d-semantic"`；`nuscenes` → `"nuscenes-semantic"`；`scannet` 且 task==instance_segmentation → `"scannet-instances"`；`scannet` → `"scannet-semantic"`。up_axis 即 run.json 的 `selected_up_axis` 原样字符串（合法值 auto/z/-z/y/-y/x/-x）。

---

## 5. CloudForgeClassLocalizer::toChinese(className, semanticId=-1)

规范化：`trim().toLower()` → 把 `'-'` 替换为 `' '` → `QString::simplified()`（合并连续空白为单空格并去首尾）。查下表；未命中兜底：`semanticId >= 0 ? "类别 %1"(semanticId) : "未知类别"`（注释原文：Never leak an untranslated English model label into the Chinese UI.）。

类别表原文（~230 条，JSON 不可用时 Rust 端直接搬这张表）：

wall=墙面, chair=椅子, floor=地面, table=桌子, door=门, couch=沙发, sofa=沙发, cabinet=柜子, shelf=搁架, desk=办公桌, office chair=办公椅, bed=床, pillow=枕头, sink=水槽, picture=装饰画, window=窗户, toilet=马桶, bookshelf=书架, bookcase=书柜, monitor=显示器, curtain=窗帘, book=书籍, armchair=扶手椅, coffee table=茶几, box=箱子, refrigerator=冰箱, lamp=灯具, kitchen cabinet=橱柜, towel=毛巾, clothes=衣物, tv=电视, nightstand=床头柜, counter=操作台, dresser=斗柜, stool=凳子, cushion=坐垫, plant=植物, ceiling=天花板, bathtub=浴缸, end table=边几, dining table=餐桌, keyboard=键盘, bag=包, backpack=背包, toilet paper=卫生纸, printer=打印机, tv stand=电视柜, whiteboard=白板, blanket=毛毯, shower curtain=浴帘, trash can=垃圾桶, closet=衣柜, stairs=楼梯, microwave=微波炉, stove=炉灶, shoe=鞋子, computer tower=电脑主机, bottle=瓶子, bin=收纳箱, ottoman=脚凳, bench=长凳, board=板材, washing machine=洗衣机, mirror=镜子, copier=复印机, basket=篮子, sofa chair=单人沙发, file cabinet=文件柜, fan=风扇, laptop=笔记本电脑, shower=淋浴间, paper=纸张, person=人员, paper towel dispenser=擦手纸盒, oven=烤箱, blinds=百叶窗, rack=置物架, plate=盘子, blackboard=黑板, piano=钢琴, suitcase=行李箱, rail=栏杆, radiator=暖气片, recycling bin=回收箱, container=容器, wardrobe=衣橱, soap dispenser=洗手液盒, telephone=电话, bucket=水桶, clock=时钟, stand=支架, light=灯, laundry basket=洗衣篮, pipe=管道, clothes dryer=烘干机, guitar=吉他, toilet paper holder=卫生纸架, seat=座椅, speaker=音箱, column=立柱, bicycle=自行车, ladder=梯子, bathroom stall=卫生间隔间, shower wall=淋浴墙, cup=杯子, jacket=外套, storage bin=储物箱, coffee maker=咖啡机, dishwasher=洗碗机, paper towel roll=擦手纸卷, machine=机器, mat=地垫, windowsill=窗台, bar=吧台, toaster=烤面包机, bulletin board=公告板, ironing board=熨衣板, fireplace=壁炉, soap dish=肥皂盒, kitchen counter=厨房操作台, doorframe=门框, toilet paper dispenser=卫生纸盒, mini fridge=小冰箱, fire extinguisher=灭火器, ball=球, hat=帽子, shower curtain rod=浴帘杆, water cooler=饮水机, paper cutter=切纸器, tray=托盘, shower door=淋浴门, pillar=柱子, ledge=台沿, toaster oven=小烤箱, mouse=鼠标, toilet seat cover dispenser=马桶坐垫纸盒, furniture=家具, otherfurniture=其他家具, otherstructure=其他结构, otherprop=其他物品, cart=推车, storage container=储物容器, scale=秤, tissue box=纸巾盒, light switch=灯开关, crate=板条箱, power outlet=电源插座, decoration=装饰品, sign=标牌, projector=投影仪, closet door=衣柜门, vacuum cleaner=吸尘器, candle=蜡烛, plunger=皮搋子, stuffed animal=毛绒玩具, headphones=耳机, dish rack=碗碟架, broom=扫帚, guitar case=吉他盒, range hood=抽油烟机, dustpan=簸箕, hair dryer=吹风机, water bottle=水瓶, handicap bar=无障碍扶手, purse=手提包, vent=通风口, shower floor=淋浴区地面, water pitcher=水壶, mailbox=邮箱, bowl=碗, paper bag=纸袋, alarm clock=闹钟, music stand=乐谱架, projector screen=投影幕, divider=隔断, laundry detergent=洗衣液, bathroom counter=卫生间台面, object=其他物体, bathroom vanity=浴室柜, closet wall=衣柜侧板, laundry hamper=脏衣篮, bathroom stall door=卫生间隔断门, ceiling light=顶灯, trash bin=垃圾箱, dumbbell=哑铃, stair rail=楼梯扶手, tube=管件, bathroom cabinet=浴室柜体, cd case=光盘盒, closet rod=衣柜挂杆, coffee kettle=咖啡壶, structure=结构件, shower head=淋浴喷头, keyboard piano=电子琴, case of water bottles=成箱瓶装水, coat rack=衣帽架, storage organizer=收纳架, folded chair=折叠椅, fire alarm=火灾报警器, power strip=插线板, calendar=日历, poster=海报, potted plant=盆栽, luggage=行李, mattress=床垫, beam=横梁, clutter=杂物, barrier=隔离栏, bus=公交车, car=汽车, construction_vehicle=工程车辆, construction vehicle=工程车辆, motorcycle=摩托车, pedestrian=行人, traffic_cone=交通锥, traffic cone=交通锥, trailer=拖车, truck=卡车, driveable_surface=可行驶路面, driveable surface=可行驶路面, other_flat=其他平面, other flat=其他平面, sidewalk=人行道, terrain=地形, manmade=人造结构, vegetation=植被

（表注释原文：Structured3D and outdoor profiles that are already available to CloudForge. 注意蛇形与空格两版键都收录，如 traffic_cone/traffic cone。）

---

## 6. main_gui.cpp 命令行参数

QSurfaceFormat：GL 3.3 Core、depth 24、samples 4；Fusion 风格；app 名 `"RANSAC PointCloud Tool"` / 组织 `"RANSAC"`。参数按序匹配（互斥，先命中先退出）：

1. **`--check-plane-subset`**（回归测试）：构造点云：两个平行 180×180 网格（plane 0/1，z = plane*0.3 + 0.0001*sin(x*13+y*7)，x,y 间距 0.005），全部网格点索引进入 `selected`（2×180×180=64800 个）；另加 500 个散点 `(i*0.01, 2.0, 0.15)` 不在 selected 中。调 `RansacDetector::detectFromPointSubset(..., DetectedShape::PLANE)`。判定 ok：`shapes.size() >= 2`；每个 shape 是 PLANE 且 `rmse < 0.001`；所有 shape 的 inlierIndices 与 `lastRemainingIndices()` 合并后恰好划分 selected（每个 id < selected.size()、无重复、总数 == selected.size()）。输出 `parallel planes=N partition=M passed=bool`，退出码 0（通过）/2。
2. **`--check-localization CLASS [SEMANTIC_ID]`**：打印 `toChinese(...)`，退出 0；缺参数 stderr `"Missing class name after --check-localization"` 退出 2。
3. **`--run-litept INPUT OUTPUT_DIR`**：启动 CloudForgeProcessRunner；progressChanged → stdout `"phase P%"`（×100）；logLine → stderr；completed 失败时 stderr 打 error；`app.exec()` 退出 0/2。缺参用法串 `"Usage: --run-litept INPUT OUTPUT_DIR"`。
4. **`--check-litept-refine DIR [INDEX]`**：`CloudForgeResultReader::read`，取第 INDEX 个实例（默认 0，clamp 到 [0, n-1]），以其实例的 pointPositions 对整体点云调 `ransac_refine_instance(..., RANSAC_PRESET_MECHANICAL_FULL, 0, RANSAC_SHAPE_UNKNOWN)`，stdout `"CloudForge -> RANSAC: rc=%d class=%s selected_points=%d shapes=%d"`，rc==0 退出 0 否则 2。
5. **`--check-litept-output DIR`**：只读结果，stdout `"CloudForge output OK: points=%d instances=%d up_axis=%s"`，退出 0/2。
6. **`--check-cloud FILE`**：加载→preprocess(true, 0.0)→limitPointsForDisplay(900000)，stdout `"Point cloud OK: points=%d"`，退出 0/2。
7. **`--check-ui-workflow DIR ARTIFACT_DIR`**：显示窗口，150ms 后 `runUiRegression(DIR, ARTIFACT_DIR)`（加载 输出、执行 UI 流程断言），退出 0/2。
8. **`--render-cloud INPUT SHOT` / `--render-litept-output DIR SHOT` / `--screenshot PATH`**：截图回归（loadLitePtOutputDirectory 失败退出 2；渲染 250/350ms 后 grab().save）。
9. 无参数：显示 MainWindow 主界面。

GUI 结果树显示规则：语义任务项名 `"%1\n类别区域 · %2 点"`；实例任务 `"%1 #%2\n%3 点%4"`，confidence<0.5 追加 `" · 需核对"`；置信度列 `"%1%"`（1 位小数）。

导出 JSON（供参考，main_window::exportAiResult）：`{"schema_version":1, "litept_output":<运行目录>, "coordinate_frame":"CloudForge normalized Z-up", "unit":"m", "input_up_axis":<selectedUpAxis>, "objects":[{"instance_id","semantic_id","class_name","confidence","point_count","geometry":...}]}`。

## Risks
- QProcess::kill 只杀 wsl.exe；Windows 端 TerminateProcess 后 WSL 内 python 的存活性依赖 wsl 会话终止行为，Rust 端取消要么用 taskkill /T 进程树，要么在 bash 命令里带信号转发
- bash -lc 是登录 shell，/etc/profile、~/.profile 会改 PATH/环境（如 CUDA、conda 初始化），移植后在无 -l 的 shell 下行为可能不同，必须保留 -lc
- gridSize 固定 %.3f 三位小数（0.020/0.010）；若未来出现 3 位以下精度会被截断，格式化必须保持一致
- shellQuote 只处理单引号，且输入/输出路径先转 WSL 路径再引号包裹——非盘符路径（UNC、相对路径）不会被转换，会以 POSIX 形式原样进 bash，移植时要复刻这一行为（包括其缺陷）或在调用前保证绝对盘符路径
- PLY 头解析假设 readLine 行为：Rust 需按 \n 切行并 trim \r\n；property 必须是标量（list 直接报错），属性顺序决定 offset，不能重排
- float32 读取是 bit reinterpret 而非解析；JSON 数值是 double→float 截断；bbox 最终永远由点云重算（instances.json 的 bbox 仅在实例点数为空时保留）——不要误以为 JSON bbox 是最终值
- instances.json 的 instance_id 可能重复/负值，lookup 用 map 覆盖；PLY 中未命中 label 的点不属于任何实例但仍在整体 cloud 中；instanceCount 不等于 cloud 点数总和
- run.json 的 point_labels.bin(12B/点) 与 source_index.bin(8B/点) 只做大小校验、从不读取——真实标签全部来自 labeled_cloud.ply；若 CloudForge 侧改变大小约定校验即误报
- confidence 语义分叉：实例任务=instances.json 的 score（不平均），语义任务=PLY confidence 按实例平均；class_name 缺省值两个任务不同（object/unknown）
- 启动前 main_window 有输入格式门禁（nuscenes 只收 float32 N×5 .bin，室内要带 RGB 的 PLY/PCD），这在 CloudForgeProcessRunner 之外，Rust 端要在调用 runner 前复刻
- phase 事件 stage 字段优先于 phase；progress 是 0..1 的 double，显示层 ×100；CLOUDFORGE_EVENT 前缀带尾随空格，正则别写丢
- --check-plane-subset 断言的是 selected 集合的精确划分（inlier+remaining 无重不漏且都在 selected 内），移植 RANSAC 时这是强约束回归，不是宽松 smoke test