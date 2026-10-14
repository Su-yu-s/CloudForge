//! C++ 核心（cloudforge_core 静态库）的 FFI 绑定与安全封装。
//! 结构体布局必须与 cpp/shim/cloudforge_shim.h 严格一致。

#![allow(non_snake_case)]

use std::ffi::{c_char, c_void, CStr};

#[repr(C)]
#[derive(Clone, Copy, Default, Debug)]
pub struct CloudForgeLoadMetaOut {
    pub file_size_bytes: u64,
    pub txt_stream_downsampled: i32,
    pub output_point_count: u32,
    pub txt_load_phase: u8,
    pub txt_load_progress_percent: u8,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, serde::Serialize)]
pub struct CloudForgeDetectConfig {
    pub preset: i32,
    pub min_inlier_count: i32,
}

#[repr(C)]
pub struct CloudForgeShapeOut {
    pub shape_type: i32,
    pub inlier_count: i32,
    pub inlier_indices: *mut i32,
    pub coefficients: *mut f32,
    pub coefficient_count: i32,
    pub rmse: f64,
    pub robust_sigma: f64,
    pub soft_score: f64,
    pub refinement_iterations: i32,
    pub description: *mut c_char,
}

#[repr(C)]
#[derive(Clone, Copy, Default, Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct CloudForgeStatsOut {
    pub loaded_points: u64,
    pub detect_points: u64,
    pub inlier_sum: u64,
    pub remaining_points: u64,
    pub progressive_passes: i32,
    pub refined_shapes: i32,
    pub median_rmse: f64,
    pub median_noise_sigma: f64,
}

#[repr(C)]
pub struct CloudForgeDetectResult {
    pub shapes: *mut CloudForgeShapeOut,
    pub shape_count: i32,
    pub remaining_indices: *mut i32,
    pub remaining_count: i32,
    pub stats: CloudForgeStatsOut,
}

extern "C" {
    fn cloudforge_load_start(path: *const c_char) -> i32;
    fn cloudforge_load_poll(meta: *mut CloudForgeLoadMetaOut) -> i32;
    fn cloudforge_load_take_points(out: *mut *mut f32) -> i32;
    fn cloudforge_generate_demo(out: *mut *mut f32) -> i32;
    fn cloudforge_save_pcd(points: *const f32, count: i32, path: *const c_char) -> i32;
    fn cloudforge_detect(
        points: *const f32,
        count: i32,
        cfg: *const CloudForgeDetectConfig,
        out: *mut CloudForgeDetectResult,
    ) -> i32;
    fn cloudforge_refine_subset(
        points: *const f32,
        count: i32,
        subset: *const i32,
        subset_count: i32,
        hint: i32,
        cfg: *const CloudForgeDetectConfig,
        out: *mut CloudForgeDetectResult,
    ) -> i32;
    fn cloudforge_free_result(out: *mut CloudForgeDetectResult);
    fn cloudforge_free_buffer(p: *mut c_void);
}

/* ---------------- 安全封装：拷回 Rust 所有权后立刻释放 C 侧内存 ---------------- */

/// 归一化后的检测结果（serde 直接发给前端；类型中文名由前端按 type_id 映射）
#[derive(serde::Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ShapeData {
    #[serde(rename = "type")]
    pub type_id: i32,
    pub inlier_count: u32,
    pub inlier_indices: Vec<u32>,
    pub coefficients: Vec<f32>,
    pub rmse: f64,
    pub robust_sigma: f64,
    pub soft_score: f64,
    pub description: String,
}

#[derive(serde::Serialize, Clone, Debug)]
pub struct DetectData {
    pub shapes: Vec<ShapeData>,
    #[serde(rename = "remainingIndices")]
    pub remaining_indices: Vec<u32>,
    pub stats: CloudForgeStatsOut,
}

/// 把 C 侧 CloudForgeDetectResult 拷贝为 DetectData 并释放 C 内存
unsafe fn owned_result(raw: CloudForgeDetectResult) -> DetectData {
    let shape_count = raw.shape_count.max(0) as usize;
    let shapes = if raw.shapes.is_null() || shape_count == 0 {
        Vec::new()
    } else {
        std::slice::from_raw_parts(raw.shapes, shape_count)
            .iter()
            .map(|s| {
                let n = s.inlier_count.max(0) as usize;
                ShapeData {
                    type_id: s.shape_type,
                    inlier_count: n as u32,
                    inlier_indices: if s.inlier_indices.is_null() || n == 0 {
                        Vec::new()
                    } else {
                        std::slice::from_raw_parts(s.inlier_indices, n)
                            .iter()
                            .map(|&i| i as u32)
                            .collect()
                    },
                    coefficients: if s.coefficients.is_null() || s.coefficient_count <= 0 {
                        Vec::new()
                    } else {
                        std::slice::from_raw_parts(s.coefficients, s.coefficient_count as usize)
                            .to_vec()
                    },
                    rmse: s.rmse,
                    robust_sigma: s.robust_sigma,
                    soft_score: s.soft_score,
                    description: if s.description.is_null() {
                        String::new()
                    } else {
                        CStr::from_ptr(s.description).to_string_lossy().into_owned()
                    },
                }
            })
            .collect()
    };

    let remaining_count = raw.remaining_count.max(0) as usize;
    let remaining = if raw.remaining_indices.is_null() || remaining_count == 0 {
        Vec::new()
    } else {
        std::slice::from_raw_parts(raw.remaining_indices, remaining_count)
            .iter()
            .map(|&i| i as u32)
            .collect()
    };

    let out = DetectData {
        shapes,
        remaining_indices: remaining,
        stats: raw.stats,
    };
    cloudforge_free_result(&raw as *const CloudForgeDetectResult as *mut CloudForgeDetectResult);
    out
}

pub fn detect(points: &[f32], cfg: &CloudForgeDetectConfig) -> Result<DetectData, String> {
    let count = (points.len() / 3) as i32;
    if count <= 0 {
        return Err("点云为空".into());
    }
    let mut raw = CloudForgeDetectResult {
        shapes: std::ptr::null_mut(),
        shape_count: 0,
        remaining_indices: std::ptr::null_mut(),
        remaining_count: 0,
        stats: CloudForgeStatsOut::default(),
    };
    let rc = unsafe { cloudforge_detect(points.as_ptr(), count, cfg, &mut raw) };
    if rc != 0 {
        unsafe { cloudforge_free_result(&mut raw) };
        return Err(format!("检测失败（错误码 {rc}）"));
    }
    Ok(unsafe { owned_result(raw) })
}

pub fn refine_subset(
    points: &[f32],
    subset: &[i32],
    hint: i32,
    cfg: &CloudForgeDetectConfig,
) -> Result<DetectData, String> {
    let count = (points.len() / 3) as i32;
    if count <= 0 || subset.is_empty() {
        return Err("选择集为空".into());
    }
    let mut raw = CloudForgeDetectResult {
        shapes: std::ptr::null_mut(),
        shape_count: 0,
        remaining_indices: std::ptr::null_mut(),
        remaining_count: 0,
        stats: CloudForgeStatsOut::default(),
    };
    let rc = unsafe {
        cloudforge_refine_subset(
            points.as_ptr(),
            count,
            subset.as_ptr(),
            subset.len() as i32,
            hint,
            cfg,
            &mut raw,
        )
    };
    if rc != 0 {
        unsafe { cloudforge_free_result(&mut raw) };
        return Err(format!("精拟合失败（错误码 {rc}）"));
    }
    Ok(unsafe { owned_result(raw) })
}

pub fn generate_demo() -> Result<Vec<f32>, String> {
    let mut ptr: *mut f32 = std::ptr::null_mut();
    let n = unsafe { cloudforge_generate_demo(&mut ptr) };
    if n <= 0 {
        unsafe { cloudforge_free_buffer(ptr as *mut c_void) };
        return Err(format!("生成失败（错误码 {n}）"));
    }
    let pts = unsafe { std::slice::from_raw_parts(ptr, n as usize * 3) }.to_vec();
    unsafe { cloudforge_free_buffer(ptr as *mut c_void) };
    Ok(pts)
}

pub fn save_pcd(points: &[f32], path: &str) -> Result<(), String> {
    let c_path = std::ffi::CString::new(path).map_err(|_| "路径包含非法字符".to_string())?;
    let count = (points.len() / 3) as i32;
    let rc = unsafe { cloudforge_save_pcd(points.as_ptr(), count, c_path.as_ptr()) };
    if rc != 0 {
        return Err(format!("保存失败（错误码 {rc}）"));
    }
    Ok(())
}

/// 异步加载控制器：启动 → 轮询 → 取点
pub struct CloudLoader;

impl CloudLoader {
    pub fn start(path: &str) -> Result<(), String> {
        let c_path = std::ffi::CString::new(path).map_err(|_| "路径包含非法字符".to_string())?;
        let rc = unsafe { cloudforge_load_start(c_path.as_ptr()) };
        match rc {
            0 => Ok(()),
            -1 => Err("路径无效".into()),
            _ => Err("已有加载任务在进行".into()),
        }
    }

    pub fn poll() -> (i32, CloudForgeLoadMetaOut) {
        let mut meta = CloudForgeLoadMetaOut::default();
        let rc = unsafe { cloudforge_load_poll(&mut meta) };
        (rc, meta)
    }

    pub fn take_points() -> Result<Vec<f32>, String> {
        let mut ptr: *mut f32 = std::ptr::null_mut();
        let n = unsafe { cloudforge_load_take_points(&mut ptr) };
        if n <= 0 {
            unsafe { cloudforge_free_buffer(ptr as *mut c_void) };
            return Err(format!("点云不可用（错误码 {n}）"));
        }
        let pts = unsafe { std::slice::from_raw_parts(ptr, n as usize * 3) }.to_vec();
        unsafe { cloudforge_free_buffer(ptr as *mut c_void) };
        Ok(pts)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// FFI 冒烟测试：合成场景 → 检测，验证跨语言结构体布局与内存所有权
    #[test]
    fn detect_smoke() {
        let points = generate_demo().expect("生成合成点云失败");
        assert!(points.len() > 1000, "合成点云点数异常: {}", points.len() / 3);

        let cfg = CloudForgeDetectConfig { preset: 1, min_inlier_count: 0 };
        let result = detect(&points, &cfg).expect("检测失败");
        assert!(!result.shapes.is_empty(), "合成场景应检出至少一个形状");
        for s in &result.shapes {
            assert!(s.inlier_count > 0);
            assert_eq!(s.inlier_indices.len(), s.inlier_count as usize);
            assert!(!s.description.is_empty());
            for &i in &s.inlier_indices {
                assert!((i as usize) < points.len() / 3, "内点下标越界");
            }
        }
        let total: u64 =
            result.shapes.iter().map(|s| s.inlier_count as u64).sum::<u64>() + result.remaining_indices.len() as u64;
        assert_eq!(total as usize, points.len() / 3, "内点+剩余点应恰好覆盖全云");
    }

    /// 子集精拟合冒烟：把检出的第一个形状的内点当作"实例"再精拟合
    #[test]
    fn refine_subset_smoke() {
        let points = generate_demo().expect("生成合成点云失败");
        let cfg = CloudForgeDetectConfig { preset: 1, min_inlier_count: 0 };
        let first = detect(&points, &cfg).expect("检测失败").shapes.into_iter().next().expect("无形状");
        if (first.inlier_count as usize) < 50 {
            return; // 合成云形状足够大，保险起见跳过
        }
        let out = refine_subset(&points, &first.inlier_indices.iter().map(|&i| i as i32).collect::<Vec<_>>(), -1, &cfg)
            .expect("精拟合失败");
        assert!(!out.shapes.is_empty());
    }

    /// 真实文件加载冒烟：复现"点云文件无法导入"问题
    #[test]
    fn load_real_ply_smoke() {
        let path = "E:/C++/Point/data/livingroom1-fragments-ply/cloud_bin_0.ply";
        if !std::path::Path::new(path).exists() {
            return; // 数据不在时跳过
        }
        CloudLoader::start(path).expect("start 失败");
        loop {
            std::thread::sleep(std::time::Duration::from_millis(50));
            let (rc, meta) = CloudLoader::poll();
            if rc != 0 {
                assert_eq!(rc, 1, "加载失败：meta={meta:?}");
                let pts = CloudLoader::take_points().expect("take_points 失败");
                assert!(pts.len() >= 3, "点数为 0");
                println!("loaded {} points", pts.len() / 3);
                break;
            }
        }
    }
}
