//! CloudForgeProcessRunner 端口：wsl.exe 子进程、CLOUDFORGE_EVENT 进度解析、取消。
//! 事件：ai://progress {phase, progress(0..1)}、ai://log {line}、ai://done {ok, outputDir?, error?, result?}

use serde::Serialize;
use std::io::{BufRead, BufReader};
use std::os::windows::process::CommandExt;
use std::process::{Child, Command, Stdio};
use std::sync::atomic::{AtomicBool, Ordering};
use std::sync::{Arc, Mutex};
use tauri::{AppHandle, Emitter, Manager};

use crate::result_reader::{self, AiResult};

const CREATE_NO_WINDOW: u32 = 0x0800_0000;

#[derive(serde::Deserialize, Clone, Debug)]
pub struct AiConfig {
    #[serde(rename = "profile")]
    pub profile: String,
    #[serde(rename = "gridSize", default = "default_grid")]
    pub grid_size: f64,
    #[serde(rename = "inputUnit", default = "default_m")]
    pub input_unit: String,
    #[serde(rename = "upAxis", default = "default_auto")]
    pub up_axis: String,
    #[serde(rename = "wslDistribution", default = "default_dist")]
    pub distribution: String,
    #[serde(rename = "wslRoot", default = "default_root")]
    pub wsl_root: String,
    #[serde(rename = "venvRoot", default = "default_venv")]
    pub venv_root: String,
    #[serde(rename = "outputRoot", default = "default_out")]
    pub output_root: String,
}
fn default_grid() -> f64 { 0.02 }
fn default_m() -> String { "m".into() }
fn default_auto() -> String { "auto".into() }
fn default_dist() -> String { "Ubuntu".into() }
fn default_root() -> String { "/mnt/e/C++/Point/CloudForge".into() }
fn default_venv() -> String { "/opt/cloudforge-venv".into() }
fn default_out() -> String { "E:/C++/Point/CloudForge/outputs".into() }

#[derive(Default)]
pub struct AiState {
    pid: Mutex<Option<u32>>,
    cancelled: AtomicBool,
}

#[derive(Serialize, Clone)]
struct ProgressPayload<'a> {
    phase: &'a str,
    progress: f64,
}

#[derive(Serialize, Clone)]
struct LogPayload<'a> {
    line: &'a str,
}

#[derive(Serialize, Clone)]
struct DonePayload {
    ok: bool,
    #[serde(rename = "outputDir")]
    output_dir: Option<String>,
    error: Option<String>,
    result: Option<AiResult>,
    #[serde(rename = "profileName")]
    profile_name: Option<String>,
}

fn phase_text(phase: &str) -> &str {
    match phase {
        "validation" => "校验输入",
        "normals" => "估计法向",
        "orientation" => "统一坐标",
        "model_load" | "model" => "加载模型",
        "postprocessing" | "postprocess" => "实例后处理",
        "inference" => "AI 推理",
        "tile_inference" => "分块推理",
        "tile_fusion" => "融合分块",
        "export" => "导出结果",
        "complete" => "完成",
        "oom_retry" => "显存恢复重试",
        other => other,
    }
}

/// E:/x/y → /mnt/e/x/y（盘符小写；非盘符路径原样返回，复刻原行为）
fn windows_to_wsl_path(path: &str) -> String {
    let normalized = path.replace('\\', "/");
    let bytes = normalized.as_bytes();
    if bytes.len() >= 3 && bytes[1] == b':' && bytes[2] == b'/' {
        format!("/mnt/{}{}", (normalized.as_bytes()[0] as char).to_ascii_lowercase(), &normalized[2..])
    } else {
        normalized
    }
}

fn shell_quote(s: &str) -> String {
    format!("'{}'", s.replace('\'', "'\\''"))
}

/// 构造 bash -lc 命令（与 CloudForgeProcessRunner::start 逐字对齐）
pub fn build_command(cfg: &AiConfig, input_path: &str, output_dir: &str) -> String {
    let mut cmd = format!(
        "source {v}/bin/activate && cd {r} && exec python tools/cloudforge_infer.py {i} --profile {p} --output-dir {o}",
        v = shell_quote(&cfg.venv_root),
        r = shell_quote(&cfg.wsl_root),
        i = shell_quote(&windows_to_wsl_path(input_path)),
        p = shell_quote(&cfg.profile),
        o = shell_quote(&windows_to_wsl_path(output_dir)),
    );
    if cfg.profile != "nuscenes-semantic" {
        cmd.push_str(&format!(
            " --grid-size {:.3} --input-unit {u} --up-axis {a}",
            cfg.grid_size,
            u = shell_quote(&cfg.input_unit),
            a = shell_quote(&cfg.up_axis),
        ));
    }
    if cfg.profile.ends_with("-instances") {
        // Adjacent cabinets must retain their independently predicted identities.
        cmd.push_str(" --instance-merge-distance 0");
    }
    cmd
}

/// 生成输出运行目录：{outputRoot}/gui_{safeBase}_{yyyyMMdd_HHmmss_zzz}
pub fn make_output_dir(cfg: &AiConfig, source_path: &str) -> std::io::Result<std::path::PathBuf> {
    std::fs::create_dir_all(&cfg.output_root)?;
    let base = std::path::Path::new(source_path)
        .file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("cloud");
    let safe: String = base
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() || c == '_' || c == '-' { c } else { '_' })
        .collect();
    let safe = if safe.is_empty() { "cloud".to_string() } else { safe };
    let ts = chrono::Local::now().format("%Y%m%d_%H%M%S_%3f");
    Ok(std::path::Path::new(&cfg.output_root).join(format!("gui_{safe}_{ts}")))
}

/// 启动 AI 推理（立即返回；进度与结果经事件送达前端）
pub fn start(app: AppHandle, state: tauri::State<'_, AiState>, cfg: AiConfig, input_path: String) -> Result<String, String> {
    // 先建输出目录，再占位 pid：避免目录创建失败后占位残留导致后续永远"已有任务"
    let output_dir = make_output_dir(&cfg, &input_path)
        .map_err(|e| format!("无法创建输出目录: {e}"))?;
    let output_str = output_dir.to_string_lossy().to_string();
    {
        let mut pid = state.pid.lock().unwrap();
        if pid.is_some() {
            return Err("已有推理任务在运行".into());
        }
        pid.get_or_insert(0); // 占位，spawn 后写真实 pid
    }
    state.cancelled.store(false, Ordering::SeqCst);

    let cmd = build_command(&cfg, &input_path, &output_str);
    let child = Command::new("wsl.exe")
        .args(["-d", &cfg.distribution, "--", "bash", "-lc", &cmd])
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .creation_flags(CREATE_NO_WINDOW)
        .spawn()
        .map_err(|e| {
            // 启动失败要清掉占位 pid
            *state.pid.lock().unwrap() = None;
            format!("无法启动 wsl.exe: {e}")
        })?;
    *state.pid.lock().unwrap() = Some(child.id());

    let app2 = app.clone();
    let output_for_thread = output_str.clone();
    std::thread::spawn(move || {
        let (stdout, stderr, mut child) = split_child(child);
        let handle_out = std::thread::spawn(move || {
            // 按字节读行再 lossy 转 UTF-8：python 崩溃转储可能含非 UTF-8 字节
            let mut reader = BufReader::new(stdout);
            let mut buf: Vec<u8> = Vec::new();
            loop {
                buf.clear();
                match reader.read_until(b'\n', &mut buf) {
                    Ok(0) | Err(_) => break,
                    Ok(_) => {
                        let t = String::from_utf8_lossy(&buf).trim().to_string();
                        if !t.is_empty() {
                            let _ = app2.emit("ai://log", LogPayload { line: &t });
                        }
                    }
                }
            }
        });

        let mut diagnostics: Vec<String> = Vec::new();
        let reader = BufReader::new(stderr);
        for line in reader.lines() {
            let Ok(line) = line else { break };
            let trimmed = line.trim();
            if trimmed.is_empty() {
                continue;
            }
            if let Some(json_text) = trimmed.strip_prefix("CLOUDFORGE_EVENT ") {
                if let Ok(v) = serde_json::from_str::<serde_json::Value>(json_text) {
                    let phase = v
                        .get("stage")
                        .and_then(|x| x.as_str())
                        .or_else(|| v.get("phase").and_then(|x| x.as_str()))
                        .unwrap_or("");
                    let progress = v.get("progress").and_then(|x| x.as_f64()).unwrap_or(0.0);
                    let _ = app.emit("ai://progress", ProgressPayload { phase: phase_text(phase), progress });
                    continue;
                }
            }
            diagnostics.push(trimmed.to_string());
            let _ = app.emit("ai://log", LogPayload { line: trimmed });
        }
        let _ = handle_out.join();

        let st = app.state::<AiState>();
        let code = child.wait().ok().and_then(|s| s.code());
        let cancelled = st.cancelled.load(Ordering::SeqCst);
        *st.pid.lock().unwrap() = None;
        let mut payload = DonePayload {
            ok: false,
            output_dir: Some(output_for_thread.clone()),
            error: None,
            result: None,
            profile_name: Some(cfg.profile.clone()),
        };
        if cancelled {
            payload.error = Some("AI 推理已取消".into());
        } else if code != Some(0) {
            let mut err = format!("CloudForge 进程失败（退出码 {}）", code.unwrap_or(-1));
            let diag = diagnostics.join("\n");
            if !diag.trim().is_empty() {
                err.push('\n');
                err.push_str(&diag);
            }
            payload.error = Some(err);
        } else {
            match result_reader::read(&output_for_thread) {
                Ok(result) => {
                    let profile_name = result_reader::infer_profile(&result.config_path, &result.task);
                    // 主云切换为标注云（与 read_cloudforge_output 回看路径一致）：
                    // pointPositions/精拟合下标都基于 labeled_cloud.ply 的点序
                    if let Some(st) = app.try_state::<crate::AppState>() {
                        *st.points.lock().unwrap() = Some(Arc::new(result.cloud_points.clone()));
                    }
                    payload.ok = true;
                    payload.profile_name = Some(profile_name);
                    payload.result = Some(result);
                }
                Err(e) => {
                    payload.error = Some(format!("CloudForge 输出读取失败: {e}"));
                }
            }
        }
        let _ = app.emit("ai://done", payload);
    });

    Ok(output_str)
}

/// 取走 stdout/stderr 管道后再拿到 Child（等待线程需要 Child.wait）
fn split_child(mut child: Child) -> (Box<dyn std::io::Read + Send>, Box<dyn std::io::Read + Send>, Child) {
    let stdout: Box<dyn std::io::Read + Send> = match child.stdout.take() {
        Some(s) => Box::new(s),
        None => Box::new(std::io::empty()),
    };
    let stderr: Box<dyn std::io::Read + Send> = match child.stderr.take() {
        Some(s) => Box::new(s),
        None => Box::new(std::io::empty()),
    };
    (stdout, stderr, child)
}

/// 取消：杀 wsl.exe 进程树（taskkill /T，Linux 侧 python 随会话终止）
pub fn cancel(state: tauri::State<'_, AiState>) {
    state.cancelled.store(true, Ordering::SeqCst);
    if let Some(pid) = *state.pid.lock().unwrap() {
        let _ = Command::new("taskkill")
            .args(["/PID", &pid.to_string(), "/T", "/F"])
            .creation_flags(CREATE_NO_WINDOW)
            .spawn();
    }
}
