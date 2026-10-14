#pragma once

#include "point_cloud.h"
#include <string>

struct DetectedShape {
    enum Type {
        PLANE, SPHERE, CYLINDER, CONE, TORUS,
        CIRCLE3D, ELLIPSE3D, NORMAL_PLANE, PERP_PLANE, LINE,
        UNKNOWN, TYPE_COUNT
    };

    Type type;
    ModelCoefficients::Ptr coefficients;
    PointCloudT::Ptr inliers;
    /** 内点在输入点云中的下标；detectFromPoints 路径优先填此项，避免拷贝坐标 */
    std::vector<unsigned> inlierIndices;
    int inlierCount;
    double rmse = 0.0;
    double robustSigma = 0.0;
    double softScore = 0.0;
    int refinementIterations = 0;

    std::string getTypeName() const;
    std::string getTypeNameEN() const;
    std::string getDescription() const;
};
