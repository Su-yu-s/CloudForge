#include "detected_shape.h"

#include <iomanip>
#include <sstream>

std::string DetectedShape::getTypeName() const {
    switch (type) {
        case PLANE:    return u8"平面";
        case SPHERE:   return u8"球体";
        case CYLINDER: return u8"圆柱体";
        case CONE:     return u8"锥体";
        case TORUS:    return u8"圆环";
        case CIRCLE3D: return u8"三维圆";
        case ELLIPSE3D: return u8"三维椭圆";
        case NORMAL_PLANE: return u8"法向平面";
        case PERP_PLANE: return u8"正交平面";
        case LINE:     return u8"直线";
        default:       return u8"未知";
    }
}

std::string DetectedShape::getTypeNameEN() const {
    switch (type) {
        case PLANE:    return "Plane";
        case SPHERE:   return "Sphere";
        case CYLINDER: return "Cylinder";
        case CONE:     return "Cone";
        case TORUS:    return "Torus";
        case CIRCLE3D: return "Circle3D";
        case ELLIPSE3D: return "Ellipse3D";
        case NORMAL_PLANE: return "NormalPlane";
        case PERP_PLANE: return "PerpPlane";
        case LINE:     return "Line";
        default:       return "Unknown";
    }
}

std::string DetectedShape::getDescription() const {
    std::ostringstream oss;
    oss << std::fixed << std::setprecision(4);

    if (!coefficients || coefficients->values.empty()) {
        return getTypeName() + u8" (无系数)";
    }

    const auto& v = coefficients->values;
    switch (type) {
        case PLANE:
            oss << u8"平面: " << v[0] << "x + " << v[1] << "y + "
                << v[2] << "z + " << v[3] << " = 0";
            break;
        case SPHERE:
            oss << u8"球体: 中心=(" << v[0] << ", " << v[1] << ", " << v[2]
                << u8"), 半径=" << v[3];
            break;
        case CYLINDER:
            oss << u8"圆柱体: 轴点=(" << v[0] << ", " << v[1] << ", " << v[2]
                << u8"), 轴向=(" << v[3] << ", " << v[4] << ", " << v[5]
                << u8"), 半径=" << v[6];
            break;
        case CONE:
            oss << u8"锥体: 顶点=(" << v[0] << ", " << v[1] << ", " << v[2]
                << u8"), 轴向=(" << v[3] << ", " << v[4] << ", " << v[5]
                << u8"), 半角=" << v[6] << u8" rad";
            break;
        case TORUS:
            if (v.size() >= 8) {
                oss << u8"圆环: 中心=(" << v[2] << ", " << v[3] << ", " << v[4]
                    << u8"), 法线=(" << v[5] << ", " << v[6] << ", " << v[7]
                    << u8"), R=" << v[1] << ", r=" << v[0];
            } else {
                oss << u8"圆环 (参数不完整)";
            }
            break;
        case LINE:
            oss << u8"直线: 点=(" << v[0] << ", " << v[1] << ", " << v[2]
                << u8"), 方向=(" << v[3] << ", " << v[4] << ", " << v[5] << ")";
            break;
        default:
            oss << u8"未知形状";
    }
    oss << " [" << inlierCount << u8" 个内点]";
    if (rmse > 0.0) {
        oss << u8"\n自适应 LO-RANSAC: RMSE=" << rmse
            << u8", 噪声σ=" << robustSigma
            << u8", 软评分=" << softScore;
    }
    return oss.str();
}
