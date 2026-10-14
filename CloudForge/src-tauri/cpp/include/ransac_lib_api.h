#pragma once

/**
 * Resurfacer / 外部系统调用接口（不依赖 Qt、不依赖 SimplePointCloud 输入）
 *
 * 输入：float (*points)[3] + point_num，仅读取指针，不在 API 边界拷贝整云。
 * 输出：形状类型、拟合系数、内点下标（避免再拷贝百万级坐标）。
 */

#include <cstdint>

#ifdef _WIN32
#  ifdef RANSAC_CORE_EXPORTS
#    define RANSAC_API __declspec(dllexport)
#  elif defined(RANSAC_CORE_DLL)
#    define RANSAC_API __declspec(dllimport)
#  else
#    define RANSAC_API
#  endif
#else
#  define RANSAC_API
#endif

#ifdef __cplusplus
extern "C" {
#endif

/** 与 Resurfacer 一致：points[i][0/1/2] = x,y,z */
typedef struct RansacInputCloud {
    const float (*points)[3];
    int point_num;
} RansacInputCloud;

typedef enum RansacShapeType {
    RANSAC_SHAPE_PLANE = 0,
    RANSAC_SHAPE_SPHERE = 1,
    RANSAC_SHAPE_CYLINDER = 2,
    RANSAC_SHAPE_CONE = 3,
    RANSAC_SHAPE_TORUS = 4,
    RANSAC_SHAPE_UNKNOWN = 5
} RansacShapeType;

typedef enum RansacScenePreset {
    /** 城市/室外/园区：仅平面 + 严格过滤 */
    RANSAC_PRESET_OUTDOOR_PLANES = 0,
    /** 机械零件：平面+柱+球+锥+环 */
    RANSAC_PRESET_MECHANICAL_FULL = 1
} RansacScenePreset;

typedef struct RansacDetectParams {
    RansacScenePreset preset;
    /** 0 = 使用库内默认；>0 覆盖最小内点数 */
    int min_inlier_count;
} RansacDetectParams;

typedef struct RansacShapeItem {
    RansacShapeType type;
    int inlier_count;
    /** 长度 inlier_count，下标对应输入 points 中的点序号 */
    int* inlier_indices;
    /** 拟合参数，含义见文档 / getDescription */
    float* coefficients;
    int coefficient_count;
    /** 现代局部优化质量指标；不改变 AI 标签或置信度 */
    double rmse;
    double robust_sigma;
    double soft_score;
} RansacShapeItem;

typedef struct RansacDetectOutput {
    RansacShapeItem* shapes;
    int shape_count;
    int* remaining_indices;
    int remaining_count;
    /** 统计：输入点数 / 内点总数 */
    int input_point_count;
    int inlier_point_sum;
} RansacDetectOutput;

/**
 * 特征识别（Schnabel RANSAC）
 * @return 0 成功；<0 失败（参数非法等）
 * @note output 内指针由库分配，须调用 ransac_free_output 释放
 */
RANSAC_API int ransac_detect(const RansacInputCloud* input,
                             const RansacDetectParams* params,
                             RansacDetectOutput* output);

/**
 * 对 AI/实例分割选出的一个点集做几何精拟合。
 * selected_indices 对应原始 input->points 下标，仅复制下标、不复制整云坐标。
 * primitive_hint 是可选几何先验；UNKNOWN 表示自动尝试五类基元。
 * AI 的 semantic_id、instance_id、confidence 由调用方保管，本接口绝不修改。
 */
RANSAC_API int ransac_refine_instance(const RansacInputCloud* input,
                                      const int* selected_indices,
                                      int selected_count,
                                      RansacShapeType primitive_hint,
                                      const RansacDetectParams* params,
                                      RansacDetectOutput* output);

RANSAC_API void ransac_free_output(RansacDetectOutput* output);

/** 将 type 转为英文名称（静态缓冲区，线程不安全） */
RANSAC_API const char* ransac_shape_type_name(RansacShapeType type);

#ifdef __cplusplus
}
#endif
