#pragma once

/**
 * CloudForge Rust FFI shim —— 在不动核心算法（include/ + src/）的前提下，
 * 把 Qt GUI 实际用到的那部分核心能力平铺成 C ABI。
 *
 * 内存约定：所有 *out 指针由本模块分配（new[]/new），调用方（Rust）在
 * 拷贝走数据后必须调用对应的 cloudforge_free_* 归还，禁止跨模块 free 其他指针。
 *
 * 约定：所有字符串均为 UTF-8（Windows 路径在 shim 内部转 UTF-16）。
 */

#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ------------------------------------------------------------------ */
/* 点云加载（异步，复刻 Qt 的 QFutureWatcher + 进度轮询模型）           */
/* ------------------------------------------------------------------ */

typedef struct CloudForgeLoadMetaOut {
    uint64_t file_size_bytes;
    int32_t txt_stream_downsampled; /* 大 TXT 流式降采样是否触发 */
    uint32_t output_point_count;
    uint8_t txt_load_phase;         /* 0=扫描 1=导出体素 2=完成 */
    uint8_t txt_load_progress_percent;
} CloudForgeLoadMetaOut;

/** 启动后台加载线程（loadFromFile 全格式：PLY/PCD/TXT/STL/BIN）。
 * @return 0 成功启动；-1 参数错误；-2 已有任务在跑 */
int32_t cloudforge_load_start(const char* path_utf8);

/** 轮询加载状态。
 * @return -1 失败/空闲；0 进行中；1 完成（点已就绪）
 * 失败或进行中时 meta 照常填充当前进度。 */
int32_t cloudforge_load_poll(CloudForgeLoadMetaOut* meta);

/** 取走加载完成的点（N*3 float，x,y,z 连续）。所有权移交调用方。
 * @return 点数；失败返回负数 */
int32_t cloudforge_load_take_points(float** out_points);

/* ------------------------------------------------------------------ */
/* 生成 / 保存                                                          */
/* ------------------------------------------------------------------ */

/** 生成内置合成场景（generateSyntheticCloud）。
 * @return 点数；*out_points 所有权移交 */
int32_t cloudforge_generate_demo(float** out_points);

/** 保存点云为二进制 PCD。
 * @return 0 成功；<0 失败 */
int32_t cloudforge_save_pcd(const float* points, int32_t count, const char* path_utf8);

/* ------------------------------------------------------------------ */
/* 检测 / 精拟合                                                        */
/* ------------------------------------------------------------------ */

typedef struct CloudForgeDetectConfig {
    int32_t preset;           /* 0=大场景仅平面(Architecture) 1=机械全形状(Full) */
    int32_t min_inlier_count; /* <=0 = 使用库内默认 */
} CloudForgeDetectConfig;

typedef struct CloudForgeShapeOut {
    int32_t type;             /* DetectedShape::Type 同值域 */
    int32_t inlier_count;
    int32_t* inlier_indices;  /* 长度 inlier_count，指向输入点云下标 */
    float* coefficients;
    int32_t coefficient_count;
    double rmse;
    double robust_sigma;
    double soft_score;
    int32_t refinement_iterations;
    char* description;        /* getDescription() 全文，UTF-8 */
} CloudForgeShapeOut;

typedef struct CloudForgeStatsOut {
    uint64_t loaded_points;
    uint64_t detect_points;
    uint64_t inlier_sum;
    uint64_t remaining_points;
    int32_t progressive_passes;
    int32_t refined_shapes;
    double median_rmse;
    double median_noise_sigma;
} CloudForgeStatsOut;

typedef struct CloudForgeDetectResult {
    CloudForgeShapeOut* shapes;
    int32_t shape_count;
    int32_t* remaining_indices;
    int32_t remaining_count;
    CloudForgeStatsOut stats;
} CloudForgeDetectResult;

/** 全云检测（RansacDetector::detectFromPoints，同步、阻塞调用）。
 * @return 0 成功；<0 参数错误 */
int32_t cloudforge_detect(const float* points, int32_t count,
                      const CloudForgeDetectConfig* cfg,
                      CloudForgeDetectResult* out);

/** 实例子集精拟合（RansacDetector::detectFromPointSubset）。
 * hint 为 DetectedShape::Type（-1 = UNKNOWN 自动尝试）。
 * @return 0 成功；-1 参数错误；-2 有效子集不足 */
int32_t cloudforge_refine_subset(const float* points, int32_t count,
                             const int32_t* subset, int32_t subset_count,
                             int32_t hint,
                             const CloudForgeDetectConfig* cfg,
                             CloudForgeDetectResult* out);

void cloudforge_free_result(CloudForgeDetectResult* out);
void cloudforge_free_buffer(void* p);

#ifdef __cplusplus
}
#endif
