/**
 * CloudForge Rust FFI shim 实现。
 * 只做胶水：复刻 Qt GUI 侧对核心库的调用序列，核心算法（include/ src/）零改动。
 *
 * 加载管线（对齐 main_window.cpp::loadPointCloudFile）：
 *   loadFromFile → preprocess(cloud, !txtStreamDownsampled, 0) → >900000 点时 limitPointsForDisplay(900000)
 */

#include "cloudforge_shim.h"

#include "point_cloud.h"
#include "point_cloud_generator.h"
#include "point_cloud_io.h"
#include "ransac_detector.h"
#include "detected_shape.h"

#include <windows.h>

#include <atomic>
#include <cstring>
#include <mutex>
#include <new>
#include <string>
#include <thread>
#include <vector>

namespace {

std::wstring utf8ToWide(const char* s) {
    if (!s) return std::wstring();
    const int n = MultiByteToWideChar(CP_UTF8, 0, s, -1, nullptr, 0);
    if (n <= 1) return std::wstring();
    std::wstring wide(static_cast<size_t>(n) - 1, L'\0');
    MultiByteToWideChar(CP_UTF8, 0, s, -1, &wide[0], n);
    return wide;
}

char* dupUtf8(const std::string& s) {
    const size_t n = s.size() + 1;
    char* p = new char[n];
    std::memcpy(p, s.c_str(), n);
    return p;
}

float* cloudToFloats(const PointCloudT::Ptr& cloud, int32_t* count) {
    const int32_t n = static_cast<int32_t>(cloud->size());
    float* pts = new float[static_cast<size_t>(n) * 3];
    for (int32_t i = 0; i < n; ++i) {
        pts[static_cast<size_t>(i) * 3 + 0] = cloud->points[static_cast<size_t>(i)].x;
        pts[static_cast<size_t>(i) * 3 + 1] = cloud->points[static_cast<size_t>(i)].y;
        pts[static_cast<size_t>(i) * 3 + 2] = cloud->points[static_cast<size_t>(i)].z;
    }
    *count = n;
    return pts;
}

/* ---------- 异步加载状态（复刻 QFutureWatcher + 进度轮询模型） ---------- */

struct LoadState {
    std::mutex m;
    PointCloudT::Ptr cloud;
    PointCloudLoadMeta meta;
    int status = 0; /* 0=idle 1=running 2=done -1=failed */
    std::atomic<bool> started{false};
};
LoadState g_load;

void loadWorker(std::wstring path) {
    PointCloudT::Ptr raw = PointCloudGenerator::loadFromFile(path);
    const bool streamDownsampled = PointCloudGenerator::lastLoadMeta().txtStreamDownsampled;
    PointCloudT::Ptr cloud;
    if (raw && !raw->empty()) {
        // 对齐 GUI：大 TXT 流式加载时跳过去重
        cloud = PointCloudGenerator::preprocess(raw, !streamDownsampled, 0.0f);
        if (cloud && cloud->size() > 900000) {
            cloud = PointCloudGenerator::limitPointsForDisplay(cloud, 900000);
        }
    }
    std::lock_guard<std::mutex> lk(g_load.m);
    g_load.cloud = cloud;
    g_load.meta = PointCloudGenerator::lastLoadMeta();
    g_load.status = (cloud && !cloud->empty()) ? 2 : -1;
}

/* ---------- 检测结果拷贝（镜像 ransac_lib_api.cpp::copyOutput，加 description） ---------- */

int32_t copyDetectResult(const std::vector<DetectedShape>& shapes,
                         const std::vector<unsigned>& remaining,
                         const RansacDetector::DetectStats& stats,
                         CloudForgeDetectResult* out) {
    if (!out) return -1;
    std::memset(out, 0, sizeof(*out));
    out->shape_count = static_cast<int32_t>(shapes.size());
    out->remaining_count = static_cast<int32_t>(remaining.size());
    out->stats.loaded_points = stats.loadedPoints;
    out->stats.detect_points = stats.detectPoints;
    out->stats.inlier_sum = stats.inlierSum;
    out->stats.remaining_points = stats.remainingPoints;
    out->stats.progressive_passes = stats.progressivePasses;
    out->stats.refined_shapes = stats.refinedShapes;
    out->stats.median_rmse = stats.medianRmse;
    out->stats.median_noise_sigma = stats.medianNoiseSigma;

    try {
        if (out->shape_count > 0) {
            out->shapes = new CloudForgeShapeOut[static_cast<size_t>(out->shape_count)]{};
            for (int32_t i = 0; i < out->shape_count; ++i) {
                const DetectedShape& src = shapes[static_cast<size_t>(i)];
                CloudForgeShapeOut& dst = out->shapes[i];
                dst.type = static_cast<int32_t>(src.type);
                dst.inlier_count = src.inlierCount;
                dst.rmse = src.rmse;
                dst.robust_sigma = src.robustSigma;
                dst.soft_score = src.softScore;
                dst.refinement_iterations = src.refinementIterations;

                if (dst.inlier_count > 0 && !src.inlierIndices.empty()) {
                    dst.inlier_indices = new int32_t[static_cast<size_t>(dst.inlier_count)];
                    for (int32_t j = 0; j < dst.inlier_count; ++j) {
                        dst.inlier_indices[j] =
                            static_cast<int32_t>(src.inlierIndices[static_cast<size_t>(j)]);
                    }
                }
                if (src.coefficients && !src.coefficients->values.empty()) {
                    dst.coefficient_count =
                        static_cast<int32_t>(src.coefficients->values.size());
                    dst.coefficients =
                        new float[static_cast<size_t>(dst.coefficient_count)];
                    for (int32_t k = 0; k < dst.coefficient_count; ++k) {
                        dst.coefficients[k] = src.coefficients->values[static_cast<size_t>(k)];
                    }
                }
                dst.description = dupUtf8(src.getDescription());
            }
        }
        if (out->remaining_count > 0) {
            out->remaining_indices = new int32_t[static_cast<size_t>(out->remaining_count)];
            for (int32_t i = 0; i < out->remaining_count; ++i) {
                out->remaining_indices[i] = static_cast<int32_t>(remaining[static_cast<size_t>(i)]);
            }
        }
    } catch (...) {
        cloudforge_free_result(out);
        return -3;
    }
    return 0;
}

RansacDetector::Config makeConfig(const CloudForgeDetectConfig* cfg) {
    RansacDetector::Config config;
    if (cfg) {
        config.preset = (cfg->preset == 1) ? RansacDetector::Config::Preset::Full
                                           : RansacDetector::Config::Preset::Architecture;
        if (cfg->min_inlier_count > 0) config.minInlierCount = cfg->min_inlier_count;
    }
    return config;
}

} // namespace

extern "C" {

int32_t cloudforge_load_start(const char* path_utf8) {
    if (!path_utf8) return -1;
    bool expected = false;
    if (!g_load.started.compare_exchange_strong(expected, true)) return -2;
    {
        std::lock_guard<std::mutex> lk(g_load.m);
        g_load.status = 1;
        g_load.cloud.reset();
        g_load.meta = PointCloudLoadMeta{};
    }
    std::thread(loadWorker, utf8ToWide(path_utf8)).detach();
    return 0;
}

int32_t cloudforge_load_poll(CloudForgeLoadMetaOut* meta) {
    if (!meta) return -1;
    // running 时直接读核心库的全局 meta（后台线程在写，字段为原子兼容的 POD）
    const PointCloudLoadMeta& live = PointCloudGenerator::lastLoadMeta();
    meta->file_size_bytes = live.fileSizeBytes;
    meta->txt_stream_downsampled = live.txtStreamDownsampled ? 1 : 0;
    meta->output_point_count = live.outputPointCount;
    meta->txt_load_phase = live.txtLoadPhase;
    meta->txt_load_progress_percent = live.txtLoadProgressPercent;

    std::lock_guard<std::mutex> lk(g_load.m);
    if (g_load.status == 2 || g_load.status == -1) {
        const PointCloudLoadMeta& finalMeta = g_load.meta;
        meta->file_size_bytes = finalMeta.fileSizeBytes;
        meta->txt_stream_downsampled = finalMeta.txtStreamDownsampled ? 1 : 0;
        meta->output_point_count = finalMeta.outputPointCount;
        meta->txt_load_phase = finalMeta.txtLoadPhase;
        meta->txt_load_progress_percent = finalMeta.txtLoadProgressPercent;
    }
    // 翻译为头文件契约：-1 失败 / 0 进行中 / 1 完成
    //（内部 status: 0=idle 1=running 2=done -1=failed，不能直接外泄）
    switch (g_load.status) {
        case 2:  return 1;
        case -1: return -1;
        default: return 0;
    }
}

int32_t cloudforge_load_take_points(float** out_points) {
    if (!out_points) return -1;
    std::lock_guard<std::mutex> lk(g_load.m);
    if (g_load.status == 1) return -2; // 仍在加载
    int32_t count = -3;
    if (g_load.status == 2 && g_load.cloud && !g_load.cloud->empty()) {
        float* pts = cloudToFloats(g_load.cloud, &count);
        *out_points = pts;
    }
    // 无论成败都复位，允许失败后重试
    g_load.cloud.reset();
    g_load.status = 0;
    g_load.started.store(false);
    return count;
}

int32_t cloudforge_generate_demo(float** out_points) {
    if (!out_points) return -1;
    PointCloudT::Ptr cloud = PointCloudGenerator::generateSyntheticCloud();
    if (!cloud || cloud->empty()) return -2;
    int32_t count = 0;
    *out_points = cloudToFloats(cloud, &count);
    return count;
}

int32_t cloudforge_save_pcd(const float* points, int32_t count, const char* path_utf8) {
    if (!points || count <= 0 || !path_utf8) return -1;
    PointCloudT::Ptr cloud = std::make_shared<SimplePointCloud>();
    cloud->resize(static_cast<size_t>(count));
    for (int32_t i = 0; i < count; ++i) {
        cloud->points[static_cast<size_t>(i)] = Point3f(
            points[static_cast<size_t>(i) * 3 + 0],
            points[static_cast<size_t>(i) * 3 + 1],
            points[static_cast<size_t>(i) * 3 + 2]);
    }
    return PointCloudGenerator::saveToPCD(cloud, utf8ToWide(path_utf8)) ? 0 : -2;
}

int32_t cloudforge_detect(const float* points, int32_t count,
                      const CloudForgeDetectConfig* cfg, CloudForgeDetectResult* out) {
    if (!points || count <= 0 || !out) return -1;
    RansacDetector detector(makeConfig(cfg));
    const std::vector<DetectedShape> shapes =
        detector.detectFromPoints(reinterpret_cast<const float (*)[3]>(points), count);
    return copyDetectResult(shapes, detector.lastRemainingIndices(),
                            detector.lastDetectStats(), out);
}

int32_t cloudforge_refine_subset(const float* points, int32_t count,
                             const int32_t* subset, int32_t subset_count,
                             int32_t hint, const CloudForgeDetectConfig* cfg,
                             CloudForgeDetectResult* out) {
    if (!points || count <= 0 || !subset || subset_count <= 0 || !out) return -1;
    std::vector<unsigned> indices;
    indices.reserve(static_cast<size_t>(subset_count));
    for (int32_t i = 0; i < subset_count; ++i) {
        if (subset[i] >= 0 && subset[i] < count) {
            indices.push_back(static_cast<unsigned>(subset[i]));
        }
    }
    if (indices.size() < 50) return -2; // 对齐 ransac_refine_instance 的 50 点下限

    RansacDetector detector(makeConfig(cfg));
    const std::vector<DetectedShape> shapes = detector.detectFromPointSubset(
        reinterpret_cast<const float (*)[3]>(points), count, indices.data(),
        static_cast<int32_t>(indices.size()),
        hint < 0 ? DetectedShape::UNKNOWN : static_cast<DetectedShape::Type>(hint));
    return copyDetectResult(shapes, detector.lastRemainingIndices(),
                            detector.lastDetectStats(), out);
}

void cloudforge_free_result(CloudForgeDetectResult* out) {
    if (!out) return;
    if (out->shapes) {
        for (int32_t i = 0; i < out->shape_count; ++i) {
            delete[] out->shapes[i].inlier_indices;
            delete[] out->shapes[i].coefficients;
            delete[] out->shapes[i].description;
        }
        delete[] out->shapes;
    }
    delete[] out->remaining_indices;
    std::memset(out, 0, sizeof(*out));
}

void cloudforge_free_buffer(void* p) {
    delete[] reinterpret_cast<float*>(p);
}

} // extern "C"
