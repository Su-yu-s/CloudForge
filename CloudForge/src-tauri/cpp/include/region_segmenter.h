#pragma once

#include "analysis_config.h"

class RegionSegmenter {
public:
    struct Params {
        size_t maxWorkingPoints = 220000;
        float normalRadiusRatio = 0.008f;
        float growRadiusRatio = 0.012f;
        float minNormalDot = 0.965f;
        unsigned minRegionPoints = 400;
        int maxRegions = 120;
    };

    static Params paramsForScene(SceneType scene, size_t pointCount, float span);

    static AnalysisResult segment(const PointCloudT::Ptr& inputCloud,
                                    SceneType scene);
};
