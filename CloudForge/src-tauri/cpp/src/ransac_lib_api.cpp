#include "ransac_lib_api.h"

#include "ransac_detector.h"

#include <cstring>
#include <new>
#include <vector>

namespace {

RansacShapeType toApiType(DetectedShape::Type t) {
    switch (t) {
    case DetectedShape::PLANE: return RANSAC_SHAPE_PLANE;
    case DetectedShape::SPHERE: return RANSAC_SHAPE_SPHERE;
    case DetectedShape::CYLINDER: return RANSAC_SHAPE_CYLINDER;
    case DetectedShape::CONE: return RANSAC_SHAPE_CONE;
    case DetectedShape::TORUS: return RANSAC_SHAPE_TORUS;
    default: return RANSAC_SHAPE_UNKNOWN;
    }
}

DetectedShape::Type fromApiType(RansacShapeType t) {
    switch (t) {
    case RANSAC_SHAPE_PLANE: return DetectedShape::PLANE;
    case RANSAC_SHAPE_SPHERE: return DetectedShape::SPHERE;
    case RANSAC_SHAPE_CYLINDER: return DetectedShape::CYLINDER;
    case RANSAC_SHAPE_CONE: return DetectedShape::CONE;
    case RANSAC_SHAPE_TORUS: return DetectedShape::TORUS;
    default: return DetectedShape::UNKNOWN;
    }
}

RansacDetector::Config makeConfig(const RansacDetectParams* params) {
    RansacDetector::Config cfg;
    if (!params) {
        cfg.preset = RansacDetector::Config::Preset::Architecture;
        return cfg;
    }

    switch (params->preset) {
    case RANSAC_PRESET_MECHANICAL_FULL:
        cfg.preset = RansacDetector::Config::Preset::Full;
        break;
    case RANSAC_PRESET_OUTDOOR_PLANES:
    default:
        cfg.preset = RansacDetector::Config::Preset::Architecture;
        break;
    }

    if (params->min_inlier_count > 0) {
        cfg.minInlierCount = params->min_inlier_count;
    }
    return cfg;
}

int copyOutput(const std::vector<DetectedShape>& shapes,
               const std::vector<unsigned>& remaining,
               const RansacDetector::DetectStats& stats,
               RansacDetectOutput* output) {
    if (!output) return -1;
    std::memset(output, 0, sizeof(*output));
    output->input_point_count = static_cast<int>(stats.loadedPoints);
    output->inlier_point_sum = static_cast<int>(stats.inlierSum);
    output->shape_count = static_cast<int>(shapes.size());
    output->remaining_count = static_cast<int>(remaining.size());

    try {
        if (output->shape_count > 0) {
            output->shapes = new RansacShapeItem[static_cast<size_t>(output->shape_count)]{};
            for (int i = 0; i < output->shape_count; ++i) {
                const DetectedShape& src = shapes[static_cast<size_t>(i)];
                RansacShapeItem& dst = output->shapes[i];
                dst.type = toApiType(src.type);
                dst.inlier_count = src.inlierCount;
                dst.rmse = src.rmse;
                dst.robust_sigma = src.robustSigma;
                dst.soft_score = src.softScore;

                if (dst.inlier_count > 0 && !src.inlierIndices.empty()) {
                    dst.inlier_indices = new int[static_cast<size_t>(dst.inlier_count)];
                    for (int j = 0; j < dst.inlier_count; ++j)
                        dst.inlier_indices[j] = static_cast<int>(src.inlierIndices[static_cast<size_t>(j)]);
                }
                if (src.coefficients && !src.coefficients->values.empty()) {
                    dst.coefficient_count = static_cast<int>(src.coefficients->values.size());
                    dst.coefficients = new float[static_cast<size_t>(dst.coefficient_count)];
                    for (int k = 0; k < dst.coefficient_count; ++k)
                        dst.coefficients[k] = src.coefficients->values[static_cast<size_t>(k)];
                }
            }
        }
        if (output->remaining_count > 0) {
            output->remaining_indices = new int[static_cast<size_t>(output->remaining_count)];
            for (int i = 0; i < output->remaining_count; ++i)
                output->remaining_indices[i] = static_cast<int>(remaining[static_cast<size_t>(i)]);
        }
    } catch (...) {
        ransac_free_output(output);
        return -3;
    }
    return 0;
}

} // namespace

extern "C" int ransac_detect(const RansacInputCloud* input,
                             const RansacDetectParams* params,
                             RansacDetectOutput* output) {
    if (!input || !input->points || input->point_num <= 0 || !output) {
        return -1;
    }

    RansacDetector detector(makeConfig(params));
    const std::vector<DetectedShape> shapes =
        detector.detectFromPoints(input->points, input->point_num);
    const std::vector<unsigned>& remaining = detector.lastRemainingIndices();
    const RansacDetector::DetectStats stats = detector.lastDetectStats();

    return copyOutput(shapes, remaining, stats, output);
}

extern "C" int ransac_refine_instance(const RansacInputCloud* input,
                                      const int* selected_indices,
                                      int selected_count,
                                      RansacShapeType primitive_hint,
                                      const RansacDetectParams* params,
                                      RansacDetectOutput* output) {
    if (!input || !input->points || input->point_num <= 0 || !selected_indices
        || selected_count < 50 || !output) {
        return -1;
    }

    std::vector<unsigned> indices;
    indices.reserve(static_cast<size_t>(selected_count));
    for (int i = 0; i < selected_count; ++i) {
        if (selected_indices[i] >= 0 && selected_indices[i] < input->point_num)
            indices.push_back(static_cast<unsigned>(selected_indices[i]));
    }
    if (indices.size() < 50) return -2;

    RansacDetector::Config cfg = makeConfig(params);
    if (!params) cfg.preset = RansacDetector::Config::Preset::Full;
    RansacDetector detector(cfg);
    const std::vector<DetectedShape> shapes = detector.detectFromPointSubset(
        input->points, input->point_num, indices.data(), static_cast<int>(indices.size()),
        fromApiType(primitive_hint));
    return copyOutput(shapes, detector.lastRemainingIndices(),
                      detector.lastDetectStats(), output);
}

extern "C" void ransac_free_output(RansacDetectOutput* output) {
    if (!output) {
        return;
    }

    if (output->shapes) {
        for (int i = 0; i < output->shape_count; ++i) {
            delete[] output->shapes[i].inlier_indices;
            delete[] output->shapes[i].coefficients;
        }
        delete[] output->shapes;
    }
    delete[] output->remaining_indices;

    std::memset(output, 0, sizeof(*output));
}

extern "C" const char* ransac_shape_type_name(RansacShapeType type) {
    switch (type) {
    case RANSAC_SHAPE_PLANE: return "Plane";
    case RANSAC_SHAPE_SPHERE: return "Sphere";
    case RANSAC_SHAPE_CYLINDER: return "Cylinder";
    case RANSAC_SHAPE_CONE: return "Cone";
    case RANSAC_SHAPE_TORUS: return "Torus";
    default: return "Unknown";
    }
}
