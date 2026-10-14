#pragma once

#include "point_cloud.h"
#include <string>

namespace PointCloudIO {

bool savePCDBinary(const PointCloudT::Ptr& cloud, const std::string& path);
bool loadPCD(const std::string& path, PointCloudT::Ptr& cloud);
bool loadPLY(const std::string& path, PointCloudT::Ptr& cloud);

} // namespace PointCloudIO
