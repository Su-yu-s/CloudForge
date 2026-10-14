//! CloudForgeResultReader 端口：读取 CloudForge schema v1 输出目录。
//! 契约：run.json（协议校验+二进制大小校验）→ instances.json（实例任务）/
//! semantic_histogram（语义任务）→ labeled_cloud.ply（binary_little_endian，
//! 逐点重分组、重算 pointCount/置信度均值/包围盒）。

use std::collections::HashMap;
use std::path::Path;

#[derive(serde::Serialize, Clone, Debug)]
pub struct AiInstance {
    #[serde(rename = "instanceId")]
    pub instance_id: i32,
    #[serde(rename = "semanticId")]
    pub semantic_id: i32,
    #[serde(rename = "className")]
    pub class_name: String,
    /// 中文显示名（CloudForgeClassLocalizer 规则，展示层专用；协议数据仍是英文）
    #[serde(rename = "classNameCN")]
    pub class_name_cn: String,
    pub confidence: f64,
    #[serde(rename = "pointCount")]
    pub point_count: u32,
    #[serde(rename = "bboxMin")]
    pub bbox_min: [f64; 3],
    #[serde(rename = "bboxMax")]
    pub bbox_max: [f64; 3],
    /// 标注云（labeled_cloud.ply / 当前展示云）中的点序号
    #[serde(rename = "pointPositions")]
    pub point_positions: Vec<u32>,
    /// 原始输入文件中的点索引（导出 JSON 时映射用）
    #[serde(rename = "sourceIndices")]
    pub source_indices: Vec<u32>,
}

#[derive(serde::Serialize, Clone, Debug)]
pub struct AiResult {
    pub task: String,
    #[serde(rename = "configPath")]
    pub config_path: String,
    #[serde(rename = "selectedUpAxis")]
    pub selected_up_axis: String,
    #[serde(rename = "inputPoints")]
    pub input_points: u32,
    #[serde(rename = "validPoints")]
    pub valid_points: u32,
    #[serde(rename = "invalidPoints")]
    pub invalid_points: u32,
    #[serde(rename = "elapsedSeconds")]
    pub elapsed_seconds: f64,
    pub instances: Vec<AiInstance>,
    /// 标注云全部点（N*3 f32），作为 AI 视图的 base 云
    #[serde(skip)]
    pub cloud_points: Vec<f32>,
}

fn read_json(path: &Path) -> Result<serde_json::Value, String> {
    let text = std::fs::read_to_string(path)
        .map_err(|e| format!("无法读取 {}: {e}", path.display()))?;
    serde_json::from_str(&text).map_err(|e| format!("JSON 格式无效 {}: {e}", path.display()))
}

/// config 路径 → profile 名（main_window::loadCloudForgeOutputDirectory 反推规则）
pub fn infer_profile(config_path: &str, task: &str) -> String {
    let p = config_path.to_lowercase();
    if p.contains("scannet200") {
        "scannet200-instances".into()
    } else if p.contains("structured3d") {
        "structured3d-semantic".into()
    } else if p.contains("nuscenes") {
        "nuscenes-semantic".into()
    } else if p.contains("scannet") && task == "instance_segmentation" {
        "scannet-instances".into()
    } else if p.contains("scannet") {
        "scannet-semantic".into()
    } else {
        String::new()
    }
}

pub fn read(output_dir: &str) -> Result<AiResult, String> {
    let dir = Path::new(output_dir);

    // 1. 必需文件
    let run_path = dir.join("run.json");
    let labels_path = dir.join("point_labels.bin");
    let source_path = dir.join("source_index.bin");
    let ply_path = dir.join("labeled_cloud.ply");
    for f in [&run_path, &labels_path, &source_path, &ply_path] {
        if !f.exists() {
            return Err(format!("CloudForge 输出不完整，缺少: {}", f.display()));
        }
    }

    // 2. run.json 协议校验
    let run = read_json(&run_path)?;
    let schema = run.get("schema_version").and_then(|v| v.as_i64()).unwrap_or(-1);
    let status = run.get("status").and_then(|v| v.as_str()).unwrap_or("");
    let task = run.get("task").and_then(|v| v.as_str()).unwrap_or("").to_string();
    if schema != 1 || status != "success" || (task != "semantic_segmentation" && task != "instance_segmentation") {
        return Err("CloudForge 输出协议不受支持或推理状态不是 success".into());
    }
    let config_path = run.get("config").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let selected_up_axis = run.get("selected_up_axis").and_then(|v| v.as_str()).unwrap_or("").to_string();
    let input_points = run.get("input_points").and_then(|v| v.as_i64()).unwrap_or(0);
    let valid_points = run.get("valid_points").and_then(|v| v.as_i64()).unwrap_or(0);
    let invalid_points = run.get("invalid_points").and_then(|v| v.as_i64()).unwrap_or(0);
    let elapsed = run
        .get("total_elapsed_seconds")
        .and_then(|v| v.as_f64())
        .or_else(|| run.get("elapsed_seconds").and_then(|v| v.as_f64()))
        .unwrap_or(0.0);
    if input_points < 0 || valid_points < 0 {
        return Err("CloudForge 标签或源索引二进制文件大小与 run.json 不一致".into());
    }

    // 3. 二进制大小校验（只校验不解析）
    let labels_len = std::fs::metadata(&labels_path).map_err(|e| format!("无法读取 {}: {e}", labels_path.display()))?.len();
    let source_len = std::fs::metadata(&source_path).map_err(|e| format!("无法读取 {}: {e}", source_path.display()))?.len();
    if labels_len != (input_points as u64) * 12 || source_len != (valid_points as u64) * 8 {
        return Err("CloudForge 标签或源索引二进制文件大小与 run.json 不一致".into());
    }

    // 4. 实例元数据（实例任务走 instances.json；语义任务走 run.json.semantic_histogram）
    let mut lookup: HashMap<i32, usize> = HashMap::new();
    let mut instances: Vec<AiInstance> = Vec::new();

    let is_instance = task == "instance_segmentation";
    if is_instance {
        let inst_path = dir.join("instances.json");
        if !inst_path.exists() {
            return Err("CloudForge 实例输出缺少有效的 instances.json".into());
        }
        let inst = read_json(&inst_path)?;
        if inst.get("schema_version").and_then(|v| v.as_i64()).unwrap_or(-1) != 1 {
            return Err("CloudForge 实例输出缺少有效的 instances.json".into());
        }
        let arr = inst.get("instances").and_then(|v| v.as_array()).cloned().unwrap_or_default();
        for it in &arr {
            let instance_id = it.get("instance_id").and_then(|v| v.as_i64()).unwrap_or(-1) as i32;
            let semantic_id = it.get("semantic_id").and_then(|v| v.as_i64()).unwrap_or(-1) as i32;
            let class_name = it.get("class_name").and_then(|v| v.as_str()).unwrap_or("object").to_string();
            let score = it.get("score").and_then(|v| v.as_f64()).unwrap_or(0.0);
            let bbox = |k: &str| -> [f64; 3] {
                it.get(k)
                    .and_then(|v| v.as_array())
                    .filter(|a| a.len() == 3) // 非 3 元素整组置零
                    .map(|a| {
                        [
                            a[0].as_f64().unwrap_or(0.0),
                            a[1].as_f64().unwrap_or(0.0),
                            a[2].as_f64().unwrap_or(0.0),
                        ]
                    })
                    .unwrap_or([0.0; 3])
            };
            let idx = instances.len();
            lookup.insert(instance_id, idx);
            instances.push(AiInstance {
                instance_id,
                semantic_id,
                class_name_cn: crate::localizer::to_chinese(&class_name, semantic_id),
                class_name,
                confidence: score,
                point_count: 0,
                bbox_min: bbox("bbox_min_m"),
                bbox_max: bbox("bbox_max_m"),
                point_positions: Vec::new(),
                source_indices: Vec::new(),
            });
        }
    } else {
        let arr = run.get("semantic_histogram").and_then(|v| v.as_array()).cloned().unwrap_or_default();
        for it in &arr {
            let semantic_id = it.get("semantic_id").and_then(|v| v.as_i64()).unwrap_or(-1) as i32;
            let class_name = it.get("class_name").and_then(|v| v.as_str()).unwrap_or("unknown").to_string();
            let idx = instances.len();
            lookup.insert(semantic_id, idx);
            instances.push(AiInstance {
                instance_id: -1,
                semantic_id,
                class_name_cn: crate::localizer::to_chinese(&class_name, semantic_id),
                class_name,
                confidence: 0.0,
                point_count: 0,
                bbox_min: [0.0; 3],
                bbox_max: [0.0; 3],
                point_positions: Vec::new(),
                source_indices: Vec::new(),
            });
        }
    }

    // 5. labeled_cloud.ply（binary_little_endian）
    let bytes = std::fs::read(&ply_path).map_err(|e| format!("无法读取标注点云: {e}"))?;
    // 首行必须恰为 "ply"
    let first_line = String::from_utf8_lossy(&bytes[..bytes.len().min(64)]);
    if !first_line.lines().next().map(|l| l.trim() == "ply").unwrap_or(false) {
        return Err("标注点云不是 PLY 文件".into());
    }
    let end_tag = b"end_header";
    let header_end = bytes
        .windows(end_tag.len())
        .position(|w| w == end_tag)
        .ok_or("标注点云不是 PLY 文件")?;
    let header_text = String::from_utf8_lossy(&bytes[..header_end + end_tag.len()]);
    let mut little_endian = false;
    let mut vertex_count: i64 = -1;
    let mut props: Vec<(String, usize, usize)> = Vec::new(); // (name, size, offset)
    let mut offset = 0usize;
    let mut in_vertex = false;
    for line in header_text.lines() {
        let line = line.trim();
        if let Some(rest) = line.strip_prefix("format ") {
            little_endian = rest.starts_with("binary_little_endian ");
        } else if let Some(rest) = line.strip_prefix("element ") {
            let parts: Vec<&str> = rest.split_whitespace().collect();
            in_vertex = parts.len() == 2 && parts[0] == "vertex";
            if in_vertex {
                vertex_count = parts[1].parse::<i64>().unwrap_or(-1);
            }
        } else if line.starts_with("property ") && in_vertex {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 3 {
                if parts[1] == "list" {
                    return Err("标注点云包含不支持的顶点属性".into());
                }
                let width = match parts[1] {
                    "char" | "int8" | "uchar" | "uint8" => 1,
                    "short" | "int16" | "ushort" | "uint16" => 2,
                    "int" | "int32" | "uint" | "uint32" | "float" | "float32" => 4,
                    "double" | "float64" | "int64" | "uint64" => 8,
                    other => return Err(format!("标注点云包含未知 PLY 类型: {other}")),
                };
                props.push((parts[2].to_string(), width, offset));
                offset += width;
            }
        }
    }
    let record_size = offset;
    let find = |name: &str| props.iter().find(|(n, w, _)| n == name && *w == 4).map(|(_, _, o)| *o);
    let need = ["x", "y", "z", "source_index"];
    for n in need {
        if find(n).is_none() {
            return Err("标注点云必须是 CloudForge schema v1 的 binary_little_endian PLY".into());
        }
    }
    if !is_instance && (find("semantic_id").is_none() || find("confidence").is_none()) {
        return Err("标注点云必须是 CloudForge schema v1 的 binary_little_endian PLY".into());
    }
    if is_instance && find("instance_id").is_none() {
        return Err("标注点云必须是 CloudForge schema v1 的 binary_little_endian PLY".into());
    }
    if !little_endian || vertex_count < 0 || record_size == 0 {
        return Err("标注点云必须是 CloudForge schema v1 的 binary_little_endian PLY".into());
    }

    let ox = find("x").unwrap();
    let oy = find("y").unwrap();
    let oz = find("z").unwrap();
    let osrc = find("source_index").unwrap();
    let olabel = if is_instance { find("instance_id").unwrap() } else { find("semantic_id").unwrap() };
    let oconf = find("confidence");

    let body = &bytes[header_end + end_tag.len()..];
    // 头后恰好一个换行（\r\n 或 \n）；多跳会把恰以 0x0A 开头的二进制点数据吞掉
    let skip = if body.starts_with(b"\r\n") { 2 } else if body.starts_with(b"\n") { 1 } else { 0 };
    let body = &body[skip..];
    let need_len = vertex_count as u64 * record_size as u64;
    if vertex_count as u64 > u32::MAX as u64 {
        return Err("标注点云点数超出 GUI 支持范围".into());
    }
    if (body.len() as u64) < need_len {
        return Err(format!(
            "标注点云在第 {} 个点处截断",
            body.len() / record_size.max(1)
        ));
    }

    let rd_f32 = |base: &[u8], off: usize| -> f32 {
        f32::from_le_bytes([base[off], base[off + 1], base[off + 2], base[off + 3]])
    };
    let rd_i32 = |base: &[u8], off: usize| -> i32 {
        i32::from_le_bytes([base[off], base[off + 1], base[off + 2], base[off + 3]])
    };
    let rd_u32 = |base: &[u8], off: usize| -> u32 {
        u32::from_le_bytes([base[off], base[off + 1], base[off + 2], base[off + 3]])
    };

    let mut cloud_points: Vec<f32> = Vec::with_capacity(vertex_count as usize * 3);
    let mut conf_sum: Vec<f64> = instances.iter().map(|_| 0.0).collect();
    for i in 0..vertex_count as usize {
        let base = &body[i * record_size..(i + 1) * record_size];
        let (x, y, z) = (rd_f32(base, ox), rd_f32(base, oy), rd_f32(base, oz));
        cloud_points.extend_from_slice(&[x, y, z]);
        let label = rd_i32(base, olabel);
        if let Some(&idx) = lookup.get(&label) {
            let inst = &mut instances[idx];
            inst.point_positions.push(i as u32);
            inst.source_indices.push(rd_u32(base, osrc));
            if let (Some(oc), false) = (oconf, is_instance) {
                conf_sum[idx] += rd_f32(base, oc) as f64;
            }
            // 包围盒一律由实例自身点云重算（覆盖 instances.json 的 bbox）
            let (fx, fy, fz) = (x as f64, y as f64, z as f64);
            if inst.point_positions.len() == 1 {
                inst.bbox_min = [fx, fy, fz];
                inst.bbox_max = [fx, fy, fz];
            } else {
                for ((mn, mx), v) in inst
                    .bbox_min
                    .iter_mut()
                    .zip(inst.bbox_max.iter_mut())
                    .zip([fx, fy, fz])
                {
                    *mn = mn.min(v);
                    *mx = mx.max(v);
                }
            }
        }
    }

    // 6. 收尾：pointCount 覆盖；语义任务置信度取均值
    for (i, inst) in instances.iter_mut().enumerate() {
        inst.point_count = inst.point_positions.len() as u32;
        if !is_instance && inst.point_count > 0 {
            inst.confidence = conf_sum[i] / inst.point_count as f64;
        }
    }

    if valid_points > 0 && cloud_points.len() / 3 != valid_points as usize {
        return Err(format!(
            "标注点云点数 {} 与 run.json 的有效点数 {} 不一致",
            cloud_points.len() / 3,
            valid_points
        ));
    }

    Ok(AiResult {
        task,
        config_path,
        selected_up_axis,
        input_points: input_points as u32,
        valid_points: valid_points as u32,
        invalid_points: invalid_points as u32,
        elapsed_seconds: elapsed,
        instances,
        cloud_points,
    })
}
