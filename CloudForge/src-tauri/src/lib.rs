mod ai;
mod commands;
mod cad_mesh;
mod ffi;
mod localizer;
mod result_reader;

use std::sync::{Arc, Mutex};

pub struct AppState {
    pub points: Mutex<Option<Arc<Vec<f32>>>>,
    pub source_path: Mutex<Option<String>>,
    pub source_name: Mutex<Option<String>>,
    pub launch_file: Mutex<Option<String>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            points: Mutex::new(None),
            source_path: Mutex::new(None),
            source_name: Mutex::new(None),
            launch_file: Mutex::new(None),
        }
    }
}

impl AppState {
    fn with_launch_file(path: Option<String>) -> Self {
        Self { launch_file: Mutex::new(path), ..Default::default() }
    }
}

/// 命令行打开：`cloudforge.exe <点云文件>` 把路径交给前端在启动后加载
fn launch_file_from_args() -> Option<String> {
    std::env::args().nth(1).filter(|a| {
        let p = std::path::Path::new(a);
        p.is_file()
            && matches!(
                p.extension().and_then(|e| e.to_str()).map(|e| e.to_ascii_lowercase()),
                Some(ref e) if matches!(e.as_str(), "pcd" | "ply" | "txt" | "stl" | "obj" | "bin")
            )
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let launch_file = launch_file_from_args();
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .manage(AppState::with_launch_file(launch_file))
        .manage(ai::AiState::default())
        .invoke_handler(tauri::generate_handler![
            commands::start_load,
            commands::load_cad_mesh,
            commands::take_cloud,
            commands::clear_cloud,
            commands::generate_demo,
            commands::save_cloud_pcd,
            commands::detect_shapes,
            commands::refine_instance,
            commands::write_text_file,
            commands::ai_start,
            commands::ai_cancel,
            commands::read_cloudforge_output,
            commands::get_launch_file,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
