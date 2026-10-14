#pragma once

#include "point_cloud.h"
#include <random>
#include <string>
#include <cstdint>

struct PointCloudLoadMeta {
    uint64_t fileSizeBytes = 0;
    bool txtStreamDownsampled = false;
    size_t outputPointCount = 0;
    /** 大 TXT 加载进度（后台线程写入，GUI 轮询） */
    uint64_t txtBytesScanned = 0;
    uint8_t txtLoadProgressPercent = 0;
    /** 0=扫描 1=导出体素 2=完成 */
    uint8_t txtLoadPhase = 0;
};

class PointCloudGenerator {
public:
    static PointCloudT::Ptr generateSyntheticCloud();

    static void addPlane(PointCloudT::Ptr cloud,
                         float xMin, float xMax,
                         float yMin, float yMax,
                         float z, int numPoints, float noise,
                         std::mt19937& rng);

    static void addSphere(PointCloudT::Ptr cloud,
                          float cx, float cy, float cz,
                          float radius, int numPoints, float noise,
                          std::mt19937& rng);

    static void addCylinder(PointCloudT::Ptr cloud,
                            float cx, float cy, float czMin, float czMax,
                            float radius, int numPoints, float noise,
                            std::mt19937& rng);

    static void addCone(PointCloudT::Ptr cloud,
                        float apexX, float apexY, float apexZ,
                        float halfAngle, float height, int numPoints, float noise,
                        std::mt19937& rng);

    static void addTorus(PointCloudT::Ptr cloud,
                         float cx, float cy, float cz,
                         float majorR, float minorR, int numPoints, float noise,
                         std::mt19937& rng);

    static void addLine(PointCloudT::Ptr cloud,
                        float x0, float y0, float z0,
                        float dx, float dy, float dz,
                        float length, int numPoints, float noise,
                        std::mt19937& rng);

    static void addNoise(PointCloudT::Ptr cloud, int numPoints,
                         float rangeMin, float rangeMax,
                         std::mt19937& rng);

    static bool saveToPCD(const PointCloudT::Ptr& cloud, const std::string& filename);
    static bool saveToPCD(const PointCloudT::Ptr& cloud, const std::wstring& filename);
    static PointCloudT::Ptr loadFromFile(const std::wstring& filename);
    static PointCloudT::Ptr loadFromFile(const std::string& filename);
    static PointCloudT::Ptr loadFromTXT(const std::wstring& filename);
    static PointCloudT::Ptr loadFromSTL(const std::wstring& filename);
    static PointCloudT::Ptr loadFromNuScenesBIN(const std::wstring& filename);

    static const PointCloudLoadMeta& lastLoadMeta();

    static PointCloudT::Ptr preprocess(const PointCloudT::Ptr& cloud,
                                       bool removeDuplicates = true,
                                       float voxelLeafSize = 0.0f);
    static PointCloudT::Ptr removeDuplicatePoints(const PointCloudT::Ptr& cloud, float tolerance = 1e-6f);
    static PointCloudT::Ptr voxelDownsample(const PointCloudT::Ptr& cloud, float leafSize);

    static PointCloudT::Ptr downsampleToPointCount(const PointCloudT::Ptr& cloud,
                                                   size_t maxPoints);
    static float estimateSpanSampled(const PointCloudT::Ptr& cloud, size_t maxSamples = 4000);
    static PointCloudT::Ptr limitPointsForDisplay(const PointCloudT::Ptr& cloud,
                                                  size_t maxPoints = 850000);
};
