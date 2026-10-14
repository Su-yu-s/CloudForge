//! Tauri 命令层：前端 invoke 的全部入口。
//! 点云数据经 tauri::ipc::Response 以原始 f32 字节传输（百万点不序列化 JSON）。

use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager, State};
use tauri::ipc::Response;

use crate::ai::{self, AiConfig, AiState};
use crate::ffi;
use crate::AppState;

#[derive(Serialize, Clone)]
struct LoadProgress {
    phase: String,
    percent: u8,
    #[serde(rename = "doneMb")]
    done_mb: f64,
    #[serde(rename = "totalMb")]
    total_mb: f64,
}

#[derive(Serialize, Clone)]
struct LoadDone {
    ok: bool,
    count: usize,
    #[serde(rename = "streamDownsampled")]
    stream_downsampled: bool,
    #[serde(rename = "sourceBytes")]
    source_bytes: u64,
    error: Option<String>,
}

/// 启动后台加载；进度/结果经 load://progress、load://done 事件送达。
/// 对齐原版：失败不清旧点云（原 _currentCloud 不动），只清 source_path。
#[tauri::command]
pub fn start_load(app: AppHandle, state: State<'_, AppState>, path: String) -> Result<(), String> {
    let file_name = std::path::Path::new(&path)
        .file_name()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_string();
    let stem = std::path::Path::new(&file_name)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("")
        .to_string();

    *state.source_path.lock().unwrap() = Some(path.clone());
    *state.source_name.lock().unwrap() = Some(stem.clone());

    ffi::CloudLoader::start(&path)?;

    let app2 = app.clone();
    std::thread::spawn(move || loop {
        std::thread::sleep(std::time::Duration::from_millis(120));
        let (rc, meta) = ffi::CloudLoader::poll();
        if rc == 0 {
            let total_mb = meta.file_size_bytes as f64 / 1048576.0;
            let done_mb = if meta.txt_load_phase == 0 {
                meta.txt_load_progress_percent as f64 / 88.0 * total_mb
            } else {
                total_mb
            };
            let phase = match meta.txt_load_phase {
                0 => "扫描",
                1 => "生成点云",
                _ => "上传视图",
            };
            let _ = app2.emit(
                "load://progress",
                LoadProgress { phase: phase.into(), percent: meta.txt_load_progress_percent, done_mb, total_mb },
            );
            continue;
        }
        // 终态
        let st = app2.state::<AppState>();
        let mut payload = LoadDone {
            ok: false,
            count: 0,
            stream_downsampled: meta.txt_stream_downsampled != 0,
            source_bytes: meta.file_size_bytes,
            error: None,
        };
        match rc {
            1 => match ffi::CloudLoader::take_points() {
                Ok(points) => {
                    payload.ok = true;
                    payload.count = points.len() / 3;
                    *st.points.lock().unwrap() = Some(Arc::new(points));
                }
                Err(e) => payload.error = Some(e),
            },
            // 失败：复位 C++ 侧状态机（允许重试），清 source_path（对齐原版语义）
            _ => {
                let _ = ffi::CloudLoader::take_points();
                *st.source_path.lock().unwrap() = None;
                payload.error = Some("加载失败（无法打开、格式无法识别或有效点数为 0；带引号 CSV 需使用新版程序）".into());
            }
        }
        let _ = app2.emit("load://done", payload);
        break;
    });
    Ok(())
}

/// 取当前点云（f32 LE 原始字节，x,y,z 连续）
#[tauri::command]
pub fn take_cloud(state: State<'_, AppState>) -> Response {
    let bytes = match &*state.points.lock().unwrap() {
        Some(points) => points.iter().flat_map(|f| f.to_le_bytes()).collect::<Vec<u8>>(),
        None => Vec::new(),
    };
    Response::new(bytes)
}

/// 清空工作区时释放后端点云
#[tauri::command]
pub fn clear_cloud(state: State<'_, AppState>) {
    *state.points.lock().unwrap() = None;
    *state.source_path.lock().unwrap() = None;
    *state.source_name.lock().unwrap() = None;
}

#[derive(Serialize)]
pub struct GenerateInfo {
    count: usize,
    #[serde(rename = "sourceName")]
    source_name: String,
}

/// 生成合成测试点云（generateSyntheticCloud，参数固定）
#[tauri::command]
pub async fn generate_demo(state: State<'_, AppState>) -> Result<GenerateInfo, String> {
    let points = tauri::async_runtime::spawn_blocking(ffi::generate_demo)
        .await
        .map_err(|e| format!("{e}"))??;
    let count = points.len() / 3;
    let source_name = format!(
        "generated_{}",
        chrono::Local::now().format("%Y%m%d_%H%M%S")
    );
    *state.points.lock().unwrap() = Some(Arc::new(points));
    *state.source_name.lock().unwrap() = Some(source_name.clone());
    *state.source_path.lock().unwrap() = None;
    Ok(GenerateInfo { count, source_name })
}

/// 保存为二进制 PCD
#[tauri::command]
pub fn save_cloud_pcd(state: State<'_, AppState>, path: String) -> Result<(), String> {
    let points = state.points.lock().unwrap().clone().ok_or("没有可保存的点云")?;
    ffi::save_pcd(&points, &path)
}

fn arc_points(state: &State<'_, AppState>) -> Result<Arc<Vec<f32>>, String> {
    state.points.lock().unwrap().clone().ok_or_else(|| "没有点云".to_string())
}

/// RANSAC 全云检测（preset: 0=仅平面 1=多种几何）
#[tauri::command]
pub async fn detect_shapes(state: State<'_, AppState>, preset: i32) -> Result<ffi::DetectData, String> {
    let points = arc_points(&state)?;
    tauri::async_runtime::spawn_blocking(move || {
        let cfg = ffi::CloudForgeDetectConfig { preset, min_inlier_count: 0 };
        ffi::detect(&points, &cfg)
    })
    .await
    .map_err(|e| format!("{e}"))?
}

/// 精拟合选中实例（indices = 标注云内点序号；hint: -1=自动）
#[tauri::command]
pub async fn refine_instance(
    state: State<'_, AppState>,
    indices: Vec<u32>,
    hint: i32,
    preset: i32,
) -> Result<ffi::DetectData, String> {
    if indices.len() < 50 {
        return Err("该对象少于 50 点，无法可靠拟合".into());
    }
    let points = arc_points(&state)?;
    tauri::async_runtime::spawn_blocking(move || {
        let subset: Vec<i32> = indices.iter().map(|&i| i as i32).collect();
        let cfg = ffi::CloudForgeDetectConfig { preset, min_inlier_count: 0 };
        ffi::refine_subset(&points, &subset, hint, &cfg)
    })
    .await
    .map_err(|e| format!("{e}"))?
}

/// 导出/写任意文本文件（JSON 由前端组装）
#[tauri::command]
pub fn write_text_file(path: String, content: String) -> Result<(), String> {
    std::fs::write(&path, content).map_err(|e| format!("导出失败，请检查目录权限 ({e})"))
}

/// 启动 CloudForge AI 推理；返回输出目录
#[tauri::command]
pub fn ai_start(
    app: AppHandle,
    state: State<'_, AppState>,
    ai_state: State<'_, AiState>,
    config: AiConfig,
) -> Result<String, String> {
    let source_path = state.source_path.lock().unwrap().clone().ok_or("没有源文件")?;
    ai::start(app, ai_state, config, source_path)
}

#[tauri::command]
pub fn ai_cancel(ai_state: State<'_, AiState>) {
    ai::cancel(ai_state)
}

/// 取出命令行传入的启动文件路径（`cloudforge.exe <点云文件>`）；前端启动后调用一次
#[tauri::command]
pub fn get_launch_file(state: State<'_, AppState>) -> Option<String> {
    state.launch_file.lock().unwrap().take()
}

/// 读取已有 CloudForge 输出目录（浏览器式回看；复刻 loadCloudForgeOutputDirectory 的读取段）
#[tauri::command]
pub fn read_cloudforge_output(
    state: State<'_, AppState>,
    output_dir: String,
) -> Result<AiResultPlus, String> {
    let result = crate::result_reader::read(&output_dir)?;
    let count = result.cloud_points.len() / 3;
    *state.points.lock().unwrap() = Some(Arc::new(result.cloud_points.clone()));
    Ok(AiResultPlus {
        task: result.task.clone(),
        config_path: result.config_path.clone(),
        selected_up_axis: result.selected_up_axis.clone(),
        input_points: result.input_points,
        valid_points: result.valid_points,
        invalid_points: result.invalid_points,
        elapsed_seconds: result.elapsed_seconds,
        instances: result.instances.clone(),
        count,
    })
}

#[derive(Serialize)]
pub struct AiResultPlus {
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
    pub instances: Vec<crate::result_reader::AiInstance>,
    pub count: usize,
}

/// 加载 STL 的完整表面：每个三角面 9 个小端 f32，原始字节传输。
/// 独立于点云状态，读取和解析不阻塞 Tauri 命令线程。
#[tauri::command]
pub async fn load_cad_mesh(path: String) -> Result<Response, String> {
    let bytes = tauri::async_runtime::spawn_blocking(move || crate::cad_mesh::load(&path))
        .await
        .map_err(|e| format!("CAD 网格加载任务失败：{e}"))??;
    Ok(Response::new(bytes))
}