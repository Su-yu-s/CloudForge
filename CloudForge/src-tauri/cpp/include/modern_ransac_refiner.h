#pragma once

#include "detected_shape.h"
#include <vector>

/**
 * 现代鲁棒估计后端：
 * - MAD 自适应噪声尺度
 * - Tukey IRLS 局部优化（LO-RANSAC 思路）
 * - 截断高斯软评分（MAGSAC 风格，避免只按硬内点数排序）
 */
class ModernRansacRefiner {
public:
    struct Summary {
        int refinedShapes = 0;
        double medianRmse = 0.0;
        double medianNoiseSigma = 0.0;
    };

    static Summary refineCloud(std::vector<DetectedShape>& shapes, float sceneSpan);
    static Summary refineIndexed(std::vector<DetectedShape>& shapes,
                                 const float (*points)[3], int pointCount,
                                 float sceneSpan);
};
