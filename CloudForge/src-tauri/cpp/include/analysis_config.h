#pragma once

#include "detected_shape.h"
#include "ransac_detector.h"
#include <QString>
#include <vector>

/** 应用场景 */
enum class SceneType {
    CityOutdoor = 0,  // 城市 / 室外大场景
    Building,         // 建筑 / BIM
    Park,             // 园区 / 游乐场
    Mechanical        // 机械 / 零件
};

/** 分析层级 L1 / L2 / L3 */
enum class AnalysisLevel {
    L1_Geometric = 0, // RANSAC 几何基元
    L2_Region,        // 区域分割
    L3_Semantic       // AI 语义分割
};

struct AnalysisRequest {
    SceneType scene = SceneType::CityOutdoor;
    AnalysisLevel level = AnalysisLevel::L1_Geometric;
};

struct AnalysisResult {
    std::vector<DetectedShape> shapes;
    PointCloudT::Ptr remaining;
    RansacDetector::DetectStats stats;
    QString infoMessage;
    bool success = true;
};

const char* sceneTypeDisplayName(SceneType scene);
const char* analysisLevelDisplayName(AnalysisLevel level);
QString analysisSummary(const AnalysisRequest& req);
