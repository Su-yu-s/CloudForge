#include "ransac_detector.h"
#include "modern_ransac_refiner.h"

#include <algorithm>
#include <cfloat>
#include <cmath>
#include <iostream>

#ifdef _WIN32
#include <windows.h>
static bool _console_utf8_init = false;
static void initConsoleUTF8() {
    if (!_console_utf8_init) {
        SetConsoleOutputCP(CP_UTF8);
        SetConsoleCP(CP_UTF8);
        _console_utf8_init = true;
    }
}
#else
#define initConsoleUTF8() do {} while(0)
#endif

namespace {

constexpr size_t kDetectDirectLimit = 950000;
constexpr size_t kDetectTargetPoints = 900000;

void appendInliersToRemaining(const DetectedShape& shape, PointCloudT::Ptr& remaining) {
    if (!shape.inliers || !remaining) {
        return;
    }
    remaining->points.insert(remaining->points.end(),
                             shape.inliers->points.begin(),
                             shape.inliers->points.end());
}

float inlierSpan(const DetectedShape& shape) {
    if (!shape.inliers || shape.inliers->points.empty()) {
        return 0.f;
    }
    float xMin = FLT_MAX, yMin = FLT_MAX, zMin = FLT_MAX;
    float xMax = -FLT_MAX, yMax = -FLT_MAX, zMax = -FLT_MAX;
    for (const auto& p : shape.inliers->points) {
        xMin = std::min(xMin, p.x); xMax = std::max(xMax, p.x);
        yMin = std::min(yMin, p.y); yMax = std::max(yMax, p.y);
        zMin = std::min(zMin, p.z); zMax = std::max(zMax, p.z);
    }
    return std::max({xMax - xMin, yMax - yMin, zMax - zMin, 0.f});
}

float inlierSpanFromPoints(const float (*points)[3],
                           const std::vector<unsigned>& indices) {
    if (!points || indices.empty()) {
        return 0.f;
    }
    float xMin = FLT_MAX, yMin = FLT_MAX, zMin = FLT_MAX;
    float xMax = -FLT_MAX, yMax = -FLT_MAX, zMax = -FLT_MAX;
    for (unsigned idx : indices) {
        const float x = points[idx][0];
        const float y = points[idx][1];
        const float z = points[idx][2];
        xMin = std::min(xMin, x); xMax = std::max(xMax, x);
        yMin = std::min(yMin, y); yMax = std::max(yMax, y);
        zMin = std::min(zMin, z); zMax = std::max(zMax, z);
    }
    return std::max({xMax - xMin, yMax - yMin, zMax - zMin, 0.f});
}

float estimateSpanFromPoints(const float (*points)[3], int point_num, size_t maxSamples = 4000,
                             const unsigned* subset_indices = nullptr, int subset_count = 0) {
    if (!points || point_num <= 0) {
        return 1.f;
    }
    const bool useSubset = subset_indices && subset_count > 0;
    const int count = useSubset ? subset_count : point_num;
    const int step = std::max(1, count / static_cast<int>(maxSamples));
    float xMin = FLT_MAX, yMin = FLT_MAX, zMin = FLT_MAX;
    float xMax = -FLT_MAX, yMax = -FLT_MAX, zMax = -FLT_MAX;
    int valid = 0;
    for (int i = 0; i < count; i += step) {
        const unsigned idx = useSubset ? subset_indices[i] : static_cast<unsigned>(i);
        if (idx >= static_cast<unsigned>(point_num)) continue;
        xMin = std::min(xMin, points[idx][0]); xMax = std::max(xMax, points[idx][0]);
        yMin = std::min(yMin, points[idx][1]); yMax = std::max(yMax, points[idx][1]);
        zMin = std::min(zMin, points[idx][2]); zMax = std::max(zMax, points[idx][2]);
        ++valid;
    }
    if (valid == 0) return 1.f;
    return std::max({xMax - xMin, yMax - yMin, zMax - zMin, 1e-4f});
}

void appendIndicesToRemaining(const DetectedShape& shape, std::vector<unsigned>& remaining) {
    if (!shape.inlierIndices.empty()) {
        remaining.insert(remaining.end(),
                         shape.inlierIndices.begin(),
                         shape.inlierIndices.end());
    }
}

} // namespace

RansacDetector::RansacDetector(const Config& config) : config_(config) {}

void RansacDetector::applyPresetMinInliers(size_t pointCount) {
    if (config_.preset == Config::Preset::Architecture) {
        if (pointCount > 400000) {
            config_.minInlierCount = std::max(
                800, static_cast<int>(pointCount / 800));
        } else if (pointCount > 40000) {
            config_.minInlierCount = std::max(
                300, static_cast<int>(pointCount / 400));
        } else {
            config_.minInlierCount = std::max(config_.minInlierCount, 200);
        }
        return;
    }

    if (pointCount > 400000) {
        config_.minInlierCount = std::max(
            150, static_cast<int>(pointCount / 6000));
    } else if (pointCount > 40000) {
        config_.minInlierCount = std::max(
            80, static_cast<int>(pointCount / 5000));
    }
}

void RansacDetector::autoTuneParameters(const PointCloudT::Ptr& cloud) {
    if (!cloud || cloud->points.size() < 10) {
        return;
    }

    float xMin = FLT_MAX, yMin = FLT_MAX, zMin = FLT_MAX;
    float xMax = -FLT_MAX, yMax = -FLT_MAX, zMax = -FLT_MAX;
    const int sampleStep = std::max(1, static_cast<int>(cloud->points.size()) / 2500);

    for (int i = 0; i < static_cast<int>(cloud->points.size()); i += sampleStep) {
        const auto& p = cloud->points[static_cast<size_t>(i)];
        xMin = std::min(xMin, p.x); xMax = std::max(xMax, p.x);
        yMin = std::min(yMin, p.y); yMax = std::max(yMax, p.y);
        zMin = std::min(zMin, p.z); zMax = std::max(zMax, p.z);
    }

    const float dx = xMax - xMin, dy = yMax - yMin, dz = zMax - zMin;
    const float maxArea = std::max({dx * dy, dx * dz, dy * dz});
    const double resolution =
        std::sqrt(maxArea) / std::sqrt(static_cast<double>(cloud->points.size()));
    const double scale = resolution * 2.0;

    config_.planeDistThreshold    = std::max(config_.planeDistThreshold, scale * 1.0);
    config_.sphereDistThreshold   = std::max(config_.sphereDistThreshold, scale * 1.2);
    config_.cylinderDistThreshold = std::max(config_.cylinderDistThreshold, scale * 1.5);
    config_.coneDistThreshold     = std::max(config_.coneDistThreshold, scale * 1.8);
    config_.torusDistThreshold    = std::max(config_.torusDistThreshold, scale * 1.5);
    config_.lineDistThreshold     = std::max(config_.lineDistThreshold, scale * 1.0);
    config_.clusterTolerance      = std::max(config_.clusterTolerance, resolution * 4.0);
    config_.normalSearchRadius    = std::max(config_.normalSearchRadius, resolution * 3.0);

    config_.clusterTolerance      = std::min(config_.clusterTolerance, 3.0);
    config_.normalSearchRadius    = std::min(config_.normalSearchRadius, 3.0);
    config_.planeDistThreshold    = std::min(config_.planeDistThreshold, 2.0);
    config_.sphereDistThreshold   = std::min(config_.sphereDistThreshold, 2.5);
    config_.cylinderDistThreshold = std::min(config_.cylinderDistThreshold, 3.0);
    config_.coneDistThreshold     = std::min(config_.coneDistThreshold, 3.5);
    config_.torusDistThreshold    = std::min(config_.torusDistThreshold, 3.0);
    config_.lineDistThreshold     = std::min(config_.lineDistThreshold, 2.0);

    const float bboxSpan = std::max({dx, dy, dz, 1e-4f});
    config_.cylinderRadiusMin = std::min(config_.cylinderRadiusMin, static_cast<double>(bboxSpan * 0.002));
    config_.cylinderRadiusMax = std::min(config_.cylinderRadiusMax, static_cast<double>(bboxSpan * 2.5));
    config_.sphereRadiusMax   = std::min(config_.sphereRadiusMax, static_cast<double>(bboxSpan * 0.8));
    config_.coneAngleMax      = std::min(config_.coneAngleMax, 1.35);

    std::cout << u8"[自动调参] 估算点云分辨率: " << resolution
              << u8", planeDist=" << config_.planeDistThreshold << std::endl;
}

void RansacDetector::autoTuneParametersFromPoints(const float (*points)[3], int point_num,
                                                  const unsigned* subset_indices,
                                                  int subset_count) {
    const bool useSubset = subset_indices && subset_count > 0;
    const int count = useSubset ? subset_count : point_num;
    if (!points || point_num < 10 || count < 10) {
        return;
    }

    float xMin = FLT_MAX, yMin = FLT_MAX, zMin = FLT_MAX;
    float xMax = -FLT_MAX, yMax = -FLT_MAX, zMax = -FLT_MAX;
    const int sampleStep = std::max(1, count / 2500);

    int sampled = 0;
    for (int i = 0; i < count; i += sampleStep) {
        const unsigned idx = useSubset ? subset_indices[i] : static_cast<unsigned>(i);
        if (idx >= static_cast<unsigned>(point_num)) continue;
        xMin = std::min(xMin, points[idx][0]); xMax = std::max(xMax, points[idx][0]);
        yMin = std::min(yMin, points[idx][1]); yMax = std::max(yMax, points[idx][1]);
        zMin = std::min(zMin, points[idx][2]); zMax = std::max(zMax, points[idx][2]);
        ++sampled;
    }
    if (sampled < 10) return;

    const float dx = xMax - xMin, dy = yMax - yMin, dz = zMax - zMin;
    const float maxArea = std::max({dx * dy, dx * dz, dy * dz});
    const double resolution =
        std::sqrt(maxArea) / std::sqrt(static_cast<double>(count));
    const double scale = resolution * 2.0;

    config_.planeDistThreshold    = std::max(config_.planeDistThreshold, scale * 1.0);
    config_.sphereDistThreshold   = std::max(config_.sphereDistThreshold, scale * 1.2);
    config_.cylinderDistThreshold = std::max(config_.cylinderDistThreshold, scale * 1.5);
    config_.coneDistThreshold     = std::max(config_.coneDistThreshold, scale * 1.8);
    config_.torusDistThreshold    = std::max(config_.torusDistThreshold, scale * 1.5);
    config_.lineDistThreshold     = std::max(config_.lineDistThreshold, scale * 1.0);
    config_.clusterTolerance      = std::max(config_.clusterTolerance, resolution * 4.0);
    config_.normalSearchRadius    = std::max(config_.normalSearchRadius, resolution * 3.0);

    config_.clusterTolerance      = std::min(config_.clusterTolerance, 3.0);
    config_.normalSearchRadius    = std::min(config_.normalSearchRadius, 3.0);
    config_.planeDistThreshold    = std::min(config_.planeDistThreshold, 2.0);
    config_.sphereDistThreshold   = std::min(config_.sphereDistThreshold, 2.5);
    config_.cylinderDistThreshold = std::min(config_.cylinderDistThreshold, 3.0);
    config_.coneDistThreshold     = std::min(config_.coneDistThreshold, 3.5);
    config_.torusDistThreshold    = std::min(config_.torusDistThreshold, 3.0);
    config_.lineDistThreshold     = std::min(config_.lineDistThreshold, 2.0);

    const float bboxSpan = std::max({dx, dy, dz, 1e-4f});
    config_.cylinderRadiusMin = std::min(config_.cylinderRadiusMin, static_cast<double>(bboxSpan * 0.002));
    config_.cylinderRadiusMax = std::min(config_.cylinderRadiusMax, static_cast<double>(bboxSpan * 2.5));
    config_.sphereRadiusMax   = std::min(config_.sphereRadiusMax, static_cast<double>(bboxSpan * 0.8));
    config_.coneAngleMax      = std::min(config_.coneAngleMax, 1.35);
}

SchnabelDetector::Params RansacDetector::buildSchnabelParamsForCount(size_t n, float span) const {
    SchnabelDetector::Params params;
    (void)span;

    // CloudCompare 默认：epsilon = 0.5% scale，bitmap = 1% scale
    params.epsilon = 0.f;
    params.bitmapEpsilon = 0.f;
    params.epsilonRatio = 0.005f;
    params.bitmapEpsilonRatio = 0.01f;

    const int support = std::max(
        config_.minInlierCount,
        std::min(static_cast<int>(n / 10000), 600));
    params.supportPoints = static_cast<unsigned>(std::max(120, support));

    if (config_.preset == Config::Preset::Architecture) {
        params.enablePlane = true;
        params.enableSphere = false;
        params.enableCylinder = false;
        params.enableCone = false;
        params.enableTorus = false;
        params.supportPoints = static_cast<unsigned>(std::max(
            config_.minInlierCount,
            static_cast<int>(std::max<size_t>(800, n / 500))));
        params.epsilonRatio = 0.004f;
        params.bitmapEpsilonRatio = 0.008f;
        params.maxNormalDevDeg = 18.f;
        params.probability = (n > 800000) ? 0.005f : 0.008f;
    } else {
        params.enablePlane = true;
        params.enableSphere = true;
        params.enableCylinder = true;
        params.enableCone = true;
        params.enableTorus = true;
        if (n > 800000) {
            params.probability = 0.006f;
        } else if (n > 200000) {
            params.probability = 0.010f;
        } else {
            params.probability = 0.008f;
        }
        params.maxNormalDevDeg = 22.f;
    }

    std::cout << u8"[Schnabel参数] span=" << span
              << u8" support=" << params.supportPoints
              << u8" epsRatio=" << params.epsilonRatio
              << u8" preset="
              << (config_.preset == Config::Preset::Architecture ? u8"游乐场/大场景" : u8"全几何体")
              << std::endl;
    return params;
}

SchnabelDetector::Params RansacDetector::buildSchnabelParams(const PointCloudT::Ptr& cloud) const {
    const size_t n = cloud ? cloud->points.size() : 0;
    const float span = cloud ? PointCloudGenerator::estimateSpanSampled(cloud, 4000) : 1.f;
    return buildSchnabelParamsForCount(n, span);
}

std::vector<DetectedShape> RansacDetector::filterShapesIndices(
    std::vector<DetectedShape>&& shapes,
    std::vector<unsigned>& remaining_indices,
    float span,
    const float (*points)[3]) const {
    if (shapes.empty() || span <= 0.f) {
        return std::move(shapes);
    }

    std::vector<DetectedShape> kept;
    kept.reserve(shapes.size());
    size_t rejected = 0;

    for (auto& shape : shapes) {
        bool drop = false;

        if (shape.inlierCount < config_.minInlierCount) {
            drop = true;
        }

        const float patchSpan = points && !shape.inlierIndices.empty()
            ? inlierSpanFromPoints(points, shape.inlierIndices)
            : inlierSpan(shape);
        if (!drop && patchSpan > 0.f && patchSpan < span * 0.0008f
            && shape.inlierCount < config_.minInlierCount * 2) {
            drop = true;
        }

        if (!drop && shape.coefficients && !shape.coefficients->values.empty()) {
            const auto& v = shape.coefficients->values;
            switch (shape.type) {
            case DetectedShape::CYLINDER:
                if (v.size() >= 7) {
                    const float radius = v[6];
                    if (radius < span * 0.004f) {
                        drop = true;
                    } else if (patchSpan > radius * 35.f && radius < span * 0.012f) {
                        drop = true;
                    }
                }
                break;
            case DetectedShape::SPHERE:
                if (v.size() >= 4 && v[3] < span * 0.003f) {
                    drop = true;
                }
                break;
            case DetectedShape::TORUS:
                if (v.size() >= 2 && v[0] < span * 0.0015f) {
                    drop = true;
                }
                break;
            case DetectedShape::PLANE:
                if (config_.preset == Config::Preset::Architecture
                    && shape.inlierCount < config_.minInlierCount) {
                    drop = true;
                }
                break;
            default:
                break;
            }
        }

        if (drop) {
            appendIndicesToRemaining(shape, remaining_indices);
            ++rejected;
        } else {
            kept.push_back(std::move(shape));
        }
    }

    if (rejected > 0) {
        std::cout << u8"[过滤] 剔除疑似误检 " << rejected << u8" 个, 保留 "
                  << kept.size() << u8" 个" << std::endl;
    }
    return kept;
}

std::vector<DetectedShape> RansacDetector::filterShapes(std::vector<DetectedShape>&& shapes,
                                                          PointCloudT::Ptr& remaining,
                                                          float span) const {
    if (shapes.empty() || span <= 0.f) {
        return std::move(shapes);
    }

    std::vector<DetectedShape> kept;
    kept.reserve(shapes.size());
  size_t rejected = 0;

    for (auto& shape : shapes) {
        bool drop = false;

        if (shape.inlierCount < config_.minInlierCount) {
            drop = true;
        }

        const float patchSpan = inlierSpan(shape);
        if (!drop && patchSpan > 0.f && patchSpan < span * 0.0008f
            && shape.inlierCount < config_.minInlierCount * 2) {
            drop = true;
        }

        if (!drop && shape.coefficients && !shape.coefficients->values.empty()) {
            const auto& v = shape.coefficients->values;
            switch (shape.type) {
            case DetectedShape::CYLINDER:
                if (v.size() >= 7) {
                    const float radius = v[6];
                    if (radius < span * 0.004f) {
                        drop = true;
                    } else if (patchSpan > radius * 35.f && radius < span * 0.012f) {
                        drop = true;
                    }
                }
                break;
            case DetectedShape::SPHERE:
                if (v.size() >= 4 && v[3] < span * 0.003f) {
                    drop = true;
                }
                break;
            case DetectedShape::TORUS:
                if (v.size() >= 2 && v[0] < span * 0.0015f) {
                    drop = true;
                }
                break;
            case DetectedShape::PLANE:
                if (config_.preset == Config::Preset::Architecture
                    && shape.inlierCount < config_.minInlierCount) {
                    drop = true;
                }
                break;
            default:
                break;
            }
        }

        if (drop) {
            appendInliersToRemaining(shape, remaining);
            ++rejected;
        } else {
            kept.push_back(std::move(shape));
        }
    }

    if (rejected > 0) {
        remaining->width = static_cast<uint32_t>(remaining->points.size());
        remaining->height = 1;
        std::cout << u8"[过滤] 剔除疑似误检 " << rejected << u8" 个, 保留 "
                  << kept.size() << u8" 个" << std::endl;
    }
    return kept;
}

std::vector<DetectedShape> RansacDetector::detect(const PointCloudT::Ptr& inputCloud) {
    std::vector<DetectedShape> shapes;
    if (!inputCloud || inputCloud->points.size() < 100) {
        remaining_.reset(new SimplePointCloud);
        stats_ = {};
        return shapes;
    }

    initConsoleUTF8();
    const size_t inputCount = inputCloud->points.size();

    PointCloudT::Ptr detectCloud = inputCloud;
    if (inputCount > kDetectDirectLimit) {
        detectCloud = PointCloudGenerator::downsampleToPointCount(inputCloud, kDetectTargetPoints);
        std::cout << u8"[检测] 大点云降采样: " << inputCount << u8" -> "
                  << detectCloud->points.size() << u8" 点" << std::endl;
    }

    remaining_.reset(new SimplePointCloud(*detectCloud));
    applyPresetMinInliers(detectCloud->points.size());

    autoTuneParameters(detectCloud);

    const float span = PointCloudGenerator::estimateSpanSampled(detectCloud, 4000);
    PointCloudT::Ptr workRemaining = detectCloud;
    const int maxPasses = (config_.preset == Config::Preset::Architecture) ? 8 : 6;
    const size_t maxShapes = (config_.preset == Config::Preset::Architecture)
        ? 500
        : static_cast<size_t>(config_.maxShapesToDetect * 20);

    // Progressive-X 风格的渐进发现：每轮只处理未解释点，并逐步降低
    // 最小支撑规模，以便先稳定发现大基元，再补回小基元。
    int pass = 0;
    while (workRemaining
           && workRemaining->points.size() > static_cast<size_t>(std::max(100, config_.minInlierCount / 2))
           && shapes.size() < maxShapes && pass < maxPasses) {
        SchnabelDetector::Params passParams = buildSchnabelParams(workRemaining);
        if (pass > 0) {
            const double supportScale = std::pow(0.72, pass);
            const unsigned supportFloor = static_cast<unsigned>(std::max(100, config_.minInlierCount / 3));
            passParams.supportPoints = std::max(
                supportFloor,
                static_cast<unsigned>(std::lround(passParams.supportPoints * supportScale)));
            passParams.epsilonRatio *= static_cast<float>(std::max(0.62, 1.0 - 0.07 * pass));
            passParams.bitmapEpsilonRatio *= static_cast<float>(std::max(0.70, 1.0 - 0.05 * pass));
        }
        PointCloudT::Ptr nextRemaining;
        auto more = SchnabelDetector::detect(workRemaining, nextRemaining, passParams);
        workRemaining = nextRemaining;
        if (more.empty()) {
            break;
        }
        shapes.insert(shapes.end(), more.begin(), more.end());
        ++pass;
    }

    remaining_ = workRemaining ? workRemaining : PointCloudT::Ptr(new SimplePointCloud);
    shapes = filterShapes(std::move(shapes), remaining_, span);
    const auto refinement = ModernRansacRefiner::refineCloud(shapes, span);

    stats_.loadedPoints = inputCount;
    stats_.detectPoints = detectCloud->points.size();
    stats_.remainingPoints = remaining_->points.size();
    stats_.inlierSum = 0;
    for (const auto& s : shapes) {
        stats_.inlierSum += static_cast<size_t>(std::max(0, s.inlierCount));
    }
    stats_.progressivePasses = pass;
    stats_.refinedShapes = refinement.refinedShapes;
    stats_.medianRmse = refinement.medianRmse;
    stats_.medianNoiseSigma = refinement.medianNoiseSigma;

    std::cout << u8"[Adaptive Progressive LO-RANSAC] 检出 " << shapes.size() << u8" 个几何体, 内点合计 "
              << stats_.inlierSum << u8", 未分类 " << stats_.remainingPoints
              << u8" 点 (检测输入 " << stats_.detectPoints << u8" / 显示 "
              << stats_.loadedPoints << u8", pass=" << pass
              << u8", refined=" << stats_.refinedShapes
              << u8", median RMSE=" << stats_.medianRmse << u8")" << std::endl;
    return shapes;
}

std::vector<DetectedShape> RansacDetector::detectFromPoints(const float (*points)[3],
                                                            int point_num) {
    return detectFromPointSubset(points, point_num, nullptr, 0, DetectedShape::UNKNOWN);
}

std::vector<DetectedShape> RansacDetector::detectFromPointSubset(
    const float (*points)[3], int point_num,
    const unsigned* selected_indices, int selected_count,
    DetectedShape::Type primitiveHint) {
    std::vector<DetectedShape> shapes;
    remaining_indices_.clear();
    remaining_.reset(new SimplePointCloud);
    stats_ = {};

    const bool useSelectedSubset = selected_indices && selected_count > 0;
    if (!points || point_num < 100 || (useSelectedSubset && selected_count < 50)) {
        return shapes;
    }

    initConsoleUTF8();
    const size_t originalPointCount = static_cast<size_t>(point_num);
    std::vector<unsigned> selected;
    if (useSelectedSubset) {
        selected.reserve(static_cast<size_t>(selected_count));
        for (int i = 0; i < selected_count; ++i) {
            if (selected_indices[i] < static_cast<unsigned>(point_num))
                selected.push_back(selected_indices[i]);
        }
        if (selected.size() < 50) return shapes;
    }
    const size_t inputCount = useSelectedSubset ? selected.size() : originalPointCount;

    std::vector<unsigned> detectSubset;
    size_t detectCount = inputCount;

    if (inputCount > kDetectDirectLimit) {
        detectSubset.reserve(kDetectTargetPoints);
        const int step = std::max(1, static_cast<int>(inputCount / kDetectTargetPoints));
        for (size_t i = 0; i < inputCount && detectSubset.size() < kDetectTargetPoints; i += step) {
            detectSubset.push_back(useSelectedSubset ? selected[i] : static_cast<unsigned>(i));
        }
        detectCount = detectSubset.size();
        std::cout << u8"[检测] 大点云降采样: " << inputCount << u8" -> "
                  << detectCount << u8" 点 (仅下标，不拷贝坐标)" << std::endl;
    } else if (useSelectedSubset) {
        detectSubset = selected;
    }

    applyPresetMinInliers(inputCount);
    const unsigned* tuningSubset = useSelectedSubset ? selected.data() : nullptr;
    const int tuningSubsetCount = useSelectedSubset ? static_cast<int>(selected.size()) : 0;
    autoTuneParametersFromPoints(points, point_num, tuningSubset, tuningSubsetCount);

    const float span = estimateSpanFromPoints(
        points, point_num, 4000, tuningSubset, tuningSubsetCount);
    const bool hadInitialSubset = !detectSubset.empty();
    std::vector<unsigned> activeSubset = std::move(detectSubset);
    const int maxPasses = (config_.preset == Config::Preset::Architecture) ? 8 : 6;
    const size_t maxShapes = config_.preset == Config::Preset::Architecture
        ? 500 : static_cast<size_t>(config_.maxShapesToDetect * 20);
    int pass = 0;
    bool firstPass = true;
    while (pass < maxPasses && shapes.size() < maxShapes) {
        const size_t activeCount = firstPass
            ? detectCount : activeSubset.size();
        if (activeCount <= static_cast<size_t>(std::max(100, config_.minInlierCount / 2))) break;

        SchnabelDetector::Params passParams = buildSchnabelParamsForCount(activeCount, span);
        // Keep repeated measurement of the same AI object reproducible.
        passParams.randomSeed = useSelectedSubset ? pass : -1;
        if (primitiveHint != DetectedShape::UNKNOWN) {
            passParams.enablePlane = primitiveHint == DetectedShape::PLANE;
            passParams.enableSphere = primitiveHint == DetectedShape::SPHERE;
            passParams.enableCylinder = primitiveHint == DetectedShape::CYLINDER;
            passParams.enableCone = primitiveHint == DetectedShape::CONE;
            passParams.enableTorus = primitiveHint == DetectedShape::TORUS;
        }
        if (pass > 0) {
            const unsigned supportFloor = static_cast<unsigned>(std::max(100, config_.minInlierCount / 3));
            passParams.supportPoints = std::max(
                supportFloor,
                static_cast<unsigned>(std::lround(passParams.supportPoints * std::pow(0.72, pass))));
            passParams.epsilonRatio *= static_cast<float>(std::max(0.62, 1.0 - 0.07 * pass));
            passParams.bitmapEpsilonRatio *= static_cast<float>(std::max(0.70, 1.0 - 0.05 * pass));
        }

        std::vector<unsigned> passRemaining;
        const unsigned* activePtr = nullptr;
        int activeSubsetCount = 0;
        if (!firstPass || hadInitialSubset) {
            activePtr = activeSubset.data();
            activeSubsetCount = static_cast<int>(activeSubset.size());
        }
        auto more = SchnabelDetector::detectFromPoints(
            points, point_num, passRemaining, passParams, activePtr, activeSubsetCount);
        activeSubset = std::move(passRemaining);
        firstPass = false;
        if (more.empty()) break;
        // A primitive hint restricts shape type, never merges unrelated surfaces.
        shapes.insert(shapes.end(), more.begin(), more.end());
        ++pass;
    }
    remaining_indices_ = std::move(activeSubset);

    shapes = filterShapesIndices(std::move(shapes), remaining_indices_, span, points);
    const auto refinement = ModernRansacRefiner::refineIndexed(shapes, points, point_num, span);

    stats_.loadedPoints = originalPointCount;
    stats_.detectPoints = detectCount;
    stats_.remainingPoints = remaining_indices_.size();
    stats_.inlierSum = 0;
    for (const auto& s : shapes) {
        stats_.inlierSum += static_cast<size_t>(std::max(0, s.inlierCount));
    }
    stats_.progressivePasses = pass;
    stats_.refinedShapes = refinement.refinedShapes;
    stats_.medianRmse = refinement.medianRmse;
    stats_.medianNoiseSigma = refinement.medianNoiseSigma;

    std::cout << u8"[Adaptive Progressive LO-RANSAC/Points] 检出 " << shapes.size() << u8" 个几何体, 内点合计 "
              << stats_.inlierSum << u8", 未分类下标 " << stats_.remainingPoints
              << u8" (检测输入 " << stats_.detectPoints << u8" / 原始 "
              << stats_.loadedPoints << u8", pass=" << stats_.progressivePasses
              << u8", refined=" << stats_.refinedShapes << u8")" << std::endl;
    return shapes;
}
