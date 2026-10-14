#pragma once

#include <cstdint>
#include <memory>
#include <vector>

/** 轻量点类型，替代 PCL PointXYZ */
struct Point3f {
    float x = 0.f;
    float y = 0.f;
    float z = 0.f;

    Point3f() = default;
    Point3f(float x_, float y_, float z_) : x(x_), y(y_), z(z_) {}
};

struct ModelCoefficients {
    using Ptr = std::shared_ptr<ModelCoefficients>;
    std::vector<float> values;
};

struct PointIndices {
    using Ptr = std::shared_ptr<PointIndices>;
    std::vector<int> indices;
};

/** 轻量点云容器（命名避免与 qRANSAC_SD 的 PointCloud 冲突） */
struct SimplePointCloud {
    using Ptr = std::shared_ptr<SimplePointCloud>;

    std::vector<Point3f> points;
    uint32_t width = 0;
    uint32_t height = 1;
    bool is_dense = false;

    void clear() {
        points.clear();
        width = 0;
        height = 1;
    }

    size_t size() const { return points.size(); }
    bool empty() const { return points.empty(); }

    void resize(size_t n) {
        points.resize(n);
        width = static_cast<uint32_t>(n);
        height = 1;
    }

    SimplePointCloud& operator+=(const SimplePointCloud& other) {
        points.insert(points.end(), other.points.begin(), other.points.end());
        width = static_cast<uint32_t>(points.size());
        return *this;
    }
};

using PointT = Point3f;
using PointCloudT = SimplePointCloud;
