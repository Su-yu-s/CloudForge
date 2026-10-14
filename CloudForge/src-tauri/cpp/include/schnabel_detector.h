#pragma once

#include "detected_shape.h"
#include <vector>

class SchnabelDetector {
public:
    struct Params {
        float epsilon = 0.0f;
        float bitmapEpsilon = 0.0f;
        float epsilonRatio = 0.002f;
        float bitmapEpsilonRatio = 0.001f;
        unsigned supportPoints = 500;
        float maxNormalDevDeg = 20.0f;
        float probability = 0.008f;
        bool enablePlane = true;
        bool enableSphere = true;
        bool enableCylinder = true;
        bool enableCone = true;
        bool enableTorus = true;
        bool allowFitting = true;
        bool allowSimplification = false;
        int randomSeed = -1;
    };

    static std::vector<DetectedShape> detect(const PointCloudT::Ptr& inputCloud,
                                             PointCloudT::Ptr& remaining,
                                             const Params& params);

    /**
     * 新接口：直接读取 float (*points)[3]，不经过 SimplePointCloud 输入包装。
     * remaining_indices：未归入任何形状的内点下标（不拷贝坐标）。
     */
    static std::vector<DetectedShape> detectFromPoints(const float (*points)[3],
                                                       int point_num,
                                                       std::vector<unsigned>& remaining_indices,
                                                       const Params& params,
                                                       const unsigned* subset_indices = nullptr,
                                                       int subset_count = 0);
};
