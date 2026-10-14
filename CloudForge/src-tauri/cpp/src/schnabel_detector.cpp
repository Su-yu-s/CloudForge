#include "schnabel_detector.h"

#include <RansacShapeDetector.h>
#include <PlanePrimitiveShapeConstructor.h>
#include <SpherePrimitiveShapeConstructor.h>
#include <CylinderPrimitiveShapeConstructor.h>
#include <ConePrimitiveShapeConstructor.h>
#include <TorusPrimitiveShapeConstructor.h>
#include <PlanePrimitiveShape.h>
#include <SpherePrimitiveShape.h>
#include <CylinderPrimitiveShape.h>
#include <ConePrimitiveShape.h>
#include <TorusPrimitiveShape.h>

#include <cmath>
#include <iostream>
#include <limits>
#include <vector>

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace {

PointCloudT::Ptr extractInlierCloud(const PointCloudT::Ptr& source,
                                    const std::vector<unsigned>& indices) {
    auto cloud = PointCloudT::Ptr(new PointCloudT);
    cloud->points.reserve(indices.size());
    for (unsigned idx : indices) {
        if (idx < source->points.size()) {
            cloud->points.push_back(source->points[idx]);
        }
    }
    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return cloud;
}

DetectedShape::Type mapIdentifier(size_t id) {
    switch (id) {
        case 0: return DetectedShape::PLANE;
        case 1: return DetectedShape::SPHERE;
        case 2: return DetectedShape::CYLINDER;
        case 3: return DetectedShape::CONE;
        case 4: return DetectedShape::TORUS;
        default: return DetectedShape::UNKNOWN;
    }
}

ModelCoefficients::Ptr coeffsFromShape(const PrimitiveShape* shape) {
    auto coeffs = ModelCoefficients::Ptr(new ModelCoefficients);
    switch (shape->Identifier()) {
        case 0: {
            const auto* plane = static_cast<const PlanePrimitiveShape*>(shape);
            const Plane& p = plane->Internal();
            const Vec3f& n = p.getNormal();
            float d = p.SignedDistToOrigin();
            coeffs->values = {n[0], n[1], n[2], d};
            break;
        }
        case 1: {
            const auto* sphere = static_cast<const SpherePrimitiveShape*>(shape);
            const Sphere& s = sphere->Internal();
            const Vec3f& c = s.Center();
            coeffs->values = {c[0], c[1], c[2], s.Radius()};
            break;
        }
        case 2: {
            const auto* cyl = static_cast<const CylinderPrimitiveShape*>(shape);
            const Cylinder& c = cyl->Internal();
            const Vec3f& pos = c.AxisPosition();
            const Vec3f& dir = c.AxisDirection();
            coeffs->values = {pos[0], pos[1], pos[2], dir[0], dir[1], dir[2], c.Radius()};
            break;
        }
        case 3: {
            const auto* cone = static_cast<const ConePrimitiveShape*>(shape);
            const Cone& c = cone->Internal();
            const Vec3f& center = c.Center();
            const Vec3f& dir = c.AxisDirection();
            coeffs->values = {center[0], center[1], center[2], dir[0], dir[1], dir[2], c.Angle()};
            break;
        }
        case 4: {
            const auto* torus = static_cast<const TorusPrimitiveShape*>(shape);
            const Torus& t = torus->Internal();
            const Vec3f& c = t.Center();
            const Vec3f& n = t.AxisDirection();
            coeffs->values = {t.MinorRadius(), t.MajorRadius(),
                              c[0], c[1], c[2], n[0], n[1], n[2]};
            break;
        }
        default:
            break;
    }
    return coeffs;
}

} // namespace

std::vector<DetectedShape> SchnabelDetector::detect(const PointCloudT::Ptr& inputCloud,
                                                    PointCloudT::Ptr& remaining,
                                                    const Params& params) {
    std::vector<DetectedShape> results;
    remaining.reset(new PointCloudT);

    if (!inputCloud || inputCloud->points.empty()) {
        return results;
    }

    const size_t count = inputCloud->points.size();
    PointCloud cloud;
    cloud.reserve(count);

    Point pt;
    pt.normal[0] = 0.0f;
    pt.normal[1] = 0.0f;
    pt.normal[2] = 0.0f;

    float xMin = std::numeric_limits<float>::max();
    float yMin = std::numeric_limits<float>::max();
    float zMin = std::numeric_limits<float>::max();
    float xMax = -std::numeric_limits<float>::max();
    float yMax = -std::numeric_limits<float>::max();
    float zMax = -std::numeric_limits<float>::max();

    for (size_t i = 0; i < count; ++i) {
        const auto& p = inputCloud->points[i];
        pt.pos[0] = p.x;
        pt.pos[1] = p.y;
        pt.pos[2] = p.z;
#ifdef POINTSWITHINDEX
        pt.index = static_cast<unsigned>(i);
#endif
        cloud.push_back(pt);

        xMin = std::min(xMin, p.x);
        yMin = std::min(yMin, p.y);
        zMin = std::min(zMin, p.z);
        xMax = std::max(xMax, p.x);
        yMax = std::max(yMax, p.y);
        zMax = std::max(zMax, p.z);
    }

    cloud.setBBox(Vec3f(xMin, yMin, zMin), Vec3f(xMax, yMax, zMax));
    const float scale = cloud.getScale();

    float epsilon = params.epsilon;
    float bitmapEpsilon = params.bitmapEpsilon;
    if (scale > 0.0f) {
        if (epsilon <= 0.0f) {
            epsilon = params.epsilonRatio * scale;
        }
        if (bitmapEpsilon <= 0.0f) {
            bitmapEpsilon = params.bitmapEpsilonRatio * scale;
        }
    }

    unsigned minSupport = params.supportPoints;
    if (count < minSupport) {
        minSupport = static_cast<unsigned>(std::max<size_t>(50, count / 20));
    }

    if (params.randomSeed >= 0) std::srand(static_cast<unsigned>(params.randomSeed));
    cloud.calcNormals(0.01f * scale);

    RansacShapeDetector::Options options;
    options.m_epsilon = epsilon;
    options.m_bitmapEpsilon = bitmapEpsilon;
    options.m_normalThresh = std::cos(params.maxNormalDevDeg * static_cast<float>(M_PI) / 180.0f);
    options.m_probability = params.probability;
    options.m_minSupport = minSupport;
    options.m_allowSimplification = params.allowSimplification;
    options.m_fitting = params.allowFitting
        ? RansacShapeDetector::Options::LS_FITTING
        : RansacShapeDetector::Options::NO_FITTING;

    RansacShapeDetector detector(options);
    if (params.enablePlane) {
        detector.Add(new PlanePrimitiveShapeConstructor());
    }
    if (params.enableCylinder) {
        const float maxCylR = std::max(scale * 0.35f, epsilon * 80.f);
        detector.Add(new CylinderPrimitiveShapeConstructor(0.0f, maxCylR, std::numeric_limits<float>::max()));
    }
    if (params.enableCone) {
        detector.Add(new ConePrimitiveShapeConstructor(
            std::min(scale * 0.35f, std::numeric_limits<float>::max()),
            static_cast<float>(M_PI / 2.0),
            std::numeric_limits<float>::max()));
    }
    if (params.enableSphere) {
        detector.Add(new SpherePrimitiveShapeConstructor(0.0f, scale * 0.45f));
    }
    if (params.enableTorus) {
        detector.Add(new TorusPrimitiveShapeConstructor(
            false, 0.0f, 0.0f,
            scale * 0.35f, scale * 0.35f));
    }

    MiscLib::Vector<std::pair<MiscLib::RefCountPtr<PrimitiveShape>, size_t>> shapes;
    ::size_t unassigned = detector.Detect(cloud, 0, cloud.size(), &shapes);

    std::cout << u8"[Schnabel] 候选形状 " << shapes.size()
              << u8", 未分配点 " << unassigned
              << u8", minSupport=" << minSupport << std::endl;

    size_t cursor = count;
    std::vector<unsigned> rejectedIndices;

    auto origIndexAt = [&](size_t cloudIdx) -> unsigned {
#ifdef POINTSWITHINDEX
        return cloud[cloudIdx].index;
#else
        return static_cast<unsigned>(cloudIdx);
#endif
    };

    for (const auto& entry : shapes) {
        const PrimitiveShape* shape = entry.first;
        const size_t shapePointsCount = entry.second;
        const size_t shapeCloudIndex = cursor - 1;

        if (shapePointsCount < minSupport) {
            for (size_t j = 0; j < shapePointsCount; ++j) {
                rejectedIndices.push_back(origIndexAt(shapeCloudIndex - j));
            }
            cursor -= shapePointsCount;
            continue;
        }

        std::vector<unsigned> indices;
        indices.reserve(shapePointsCount);

        for (size_t j = 0; j < shapePointsCount; ++j) {
            indices.push_back(origIndexAt(shapeCloudIndex - j));
        }
        cursor -= shapePointsCount;

        DetectedShape detected;
        detected.type = mapIdentifier(shape->Identifier());
        detected.coefficients = coeffsFromShape(shape);
        detected.inliers = extractInlierCloud(inputCloud, indices);
        detected.inlierCount = static_cast<int>(detected.inliers->points.size());
        results.push_back(detected);
    }

    remaining->points.reserve(unassigned + rejectedIndices.size());
    for (size_t j = 0; j < unassigned; ++j) {
        const unsigned origIdx = origIndexAt(j);
        if (origIdx < inputCloud->points.size()) {
            remaining->points.push_back(inputCloud->points[origIdx]);
        }
    }
    for (unsigned origIdx : rejectedIndices) {
        if (origIdx < inputCloud->points.size()) {
            remaining->points.push_back(inputCloud->points[origIdx]);
        }
    }
    remaining->width = static_cast<uint32_t>(remaining->points.size());
    remaining->height = 1;
    remaining->is_dense = false;

    return results;
}

std::vector<DetectedShape> SchnabelDetector::detectFromPoints(const float (*points)[3],
                                                              int point_num,
                                                              std::vector<unsigned>& remaining_indices,
                                                              const Params& params,
                                                              const unsigned* subset_indices,
                                                              int subset_count) {
    std::vector<DetectedShape> results;
    remaining_indices.clear();

    if (!points || point_num <= 0) {
        return results;
    }

    const bool useSubset = subset_indices != nullptr && subset_count > 0;
    const size_t iterCount = useSubset
        ? static_cast<size_t>(subset_count)
        : static_cast<size_t>(point_num);

    PointCloud cloud;
    cloud.reserve(iterCount);

    Point pt{};
    pt.normal[0] = 0.f;
    pt.normal[1] = 0.f;
    pt.normal[2] = 0.f;

    float xMin = std::numeric_limits<float>::max();
    float yMin = std::numeric_limits<float>::max();
    float zMin = std::numeric_limits<float>::max();
    float xMax = -std::numeric_limits<float>::max();
    float yMax = -std::numeric_limits<float>::max();
    float zMax = -std::numeric_limits<float>::max();

    for (size_t k = 0; k < iterCount; ++k) {
        const unsigned orig = useSubset ? subset_indices[k] : static_cast<unsigned>(k);
        if (orig >= static_cast<unsigned>(point_num)) {
            continue;
        }
        const float x = points[orig][0];
        const float y = points[orig][1];
        const float z = points[orig][2];
        pt.pos[0] = x;
        pt.pos[1] = y;
        pt.pos[2] = z;
#ifdef POINTSWITHINDEX
        pt.index = orig;
#endif
        cloud.push_back(pt);

        xMin = std::min(xMin, x);
        yMin = std::min(yMin, y);
        zMin = std::min(zMin, z);
        xMax = std::max(xMax, x);
        yMax = std::max(yMax, y);
        zMax = std::max(zMax, z);
    }

    if (cloud.size() == 0) {
        return results;
    }

    const size_t count = cloud.size();
    cloud.setBBox(Vec3f(xMin, yMin, zMin), Vec3f(xMax, yMax, zMax));
    const float scale = cloud.getScale();

    float epsilon = params.epsilon;
    float bitmapEpsilon = params.bitmapEpsilon;
    if (scale > 0.0f) {
        if (epsilon <= 0.0f) {
            epsilon = params.epsilonRatio * scale;
        }
        if (bitmapEpsilon <= 0.0f) {
            bitmapEpsilon = params.bitmapEpsilonRatio * scale;
        }
    }

    unsigned minSupport = params.supportPoints;
    if (count < minSupport) {
        minSupport = static_cast<unsigned>(std::max<size_t>(50, count / 20));
    }

    if (params.randomSeed >= 0) std::srand(static_cast<unsigned>(params.randomSeed));
    cloud.calcNormals(0.01f * scale);

    RansacShapeDetector::Options options;
    options.m_epsilon = epsilon;
    options.m_bitmapEpsilon = bitmapEpsilon;
    options.m_normalThresh = std::cos(params.maxNormalDevDeg * static_cast<float>(M_PI) / 180.0f);
    options.m_probability = params.probability;
    options.m_minSupport = minSupport;
    options.m_allowSimplification = params.allowSimplification;
    options.m_fitting = params.allowFitting
        ? RansacShapeDetector::Options::LS_FITTING
        : RansacShapeDetector::Options::NO_FITTING;

    RansacShapeDetector detector(options);
    if (params.enablePlane) {
        detector.Add(new PlanePrimitiveShapeConstructor());
    }
    if (params.enableCylinder) {
        const float maxCylR = std::max(scale * 0.35f, epsilon * 80.f);
        detector.Add(new CylinderPrimitiveShapeConstructor(0.0f, maxCylR, std::numeric_limits<float>::max()));
    }
    if (params.enableCone) {
        detector.Add(new ConePrimitiveShapeConstructor(
            std::min(scale * 0.35f, std::numeric_limits<float>::max()),
            static_cast<float>(M_PI / 2.0),
            std::numeric_limits<float>::max()));
    }
    if (params.enableSphere) {
        detector.Add(new SpherePrimitiveShapeConstructor(0.0f, scale * 0.45f));
    }
    if (params.enableTorus) {
        detector.Add(new TorusPrimitiveShapeConstructor(
            false, 0.0f, 0.0f,
            scale * 0.35f, scale * 0.35f));
    }

    MiscLib::Vector<std::pair<MiscLib::RefCountPtr<PrimitiveShape>, size_t>> shapes;
    const ::size_t unassigned = detector.Detect(cloud, 0, cloud.size(), &shapes);

    size_t cursor = count;
    std::vector<unsigned> rejectedIndices;

    auto origIndexAt = [&](size_t cloudIdx) -> unsigned {
#ifdef POINTSWITHINDEX
        return cloud[cloudIdx].index;
#else
        return static_cast<unsigned>(cloudIdx);
#endif
    };

    for (const auto& entry : shapes) {
        const PrimitiveShape* shape = entry.first;
        const size_t shapePointsCount = entry.second;
        const size_t shapeCloudIndex = cursor - 1;

        if (shapePointsCount < minSupport) {
            for (size_t j = 0; j < shapePointsCount; ++j) {
                rejectedIndices.push_back(origIndexAt(shapeCloudIndex - j));
            }
            cursor -= shapePointsCount;
            continue;
        }

        std::vector<unsigned> indices;
        indices.reserve(shapePointsCount);
        for (size_t j = 0; j < shapePointsCount; ++j) {
            indices.push_back(origIndexAt(shapeCloudIndex - j));
        }
        cursor -= shapePointsCount;

        DetectedShape detected;
        detected.type = mapIdentifier(shape->Identifier());
        detected.coefficients = coeffsFromShape(shape);
        detected.inlierIndices = std::move(indices);
        detected.inlierCount = static_cast<int>(detected.inlierIndices.size());
        results.push_back(std::move(detected));
    }

    remaining_indices.reserve(unassigned + rejectedIndices.size());
    for (size_t j = 0; j < unassigned; ++j) {
        remaining_indices.push_back(origIndexAt(j));
    }
    remaining_indices.insert(remaining_indices.end(),
                             rejectedIndices.begin(),
                             rejectedIndices.end());

    return results;
}
