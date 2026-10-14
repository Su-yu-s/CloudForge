#include "point_cloud_generator.h"
#include "point_cloud_io.h"
#include <random>
#include <cmath>
#include <iostream>
#include <chrono>
#include <cstdio>
#include <cctype>
#include <algorithm>
#include <unordered_set>
#include <unordered_map>
#include <cwctype>
#include <filesystem>
#include <cstring>
#include <vector>
#include <string>
#include <limits>

#ifdef _WIN32
#ifndef NOMINMAX
#define NOMINMAX
#endif
#include <windows.h>
#endif

#ifndef M_PI
#define M_PI 3.14159265358979323846
#endif

namespace {

PointCloudLoadMeta g_lastLoadMeta;

#ifdef _WIN32
FILE* openFile(const std::wstring& path, const wchar_t* mode)
{
    return _wfopen(path.c_str(), mode);
}

std::wstring toLowerExt(const std::wstring& path)
{
    auto dotPos = path.rfind(L'.');
    if (dotPos == std::wstring::npos) {
        return L"";
    }
    std::wstring ext = path.substr(dotPos);
    for (auto& c : ext) {
        c = static_cast<wchar_t>(std::towlower(c));
    }
    return ext;
}

std::wstring utf8ToWide(const std::string& utf8)
{
    if (utf8.empty()) {
        return L"";
    }
    int len = MultiByteToWideChar(CP_UTF8, 0, utf8.c_str(), -1, nullptr, 0);
    if (len <= 0) {
        return L"";
    }
    std::wstring wide(static_cast<size_t>(len), L'\0');
    if (MultiByteToWideChar(CP_UTF8, 0, utf8.c_str(), -1, wide.data(), len) <= 0) {
        return L"";
    }
    wide.pop_back();
    return wide;
}

std::string wideToUtf8Extended(const std::wstring& wpath)
{
    if (wpath.empty()) {
        return "";
    }
    std::filesystem::path absPath = std::filesystem::absolute(std::filesystem::path(wpath));
    const std::wstring w = absPath.wstring();
    int len = WideCharToMultiByte(CP_UTF8, 0, w.c_str(), -1, nullptr, 0, nullptr, nullptr);
    if (len <= 0) {
        return "";
    }
    std::string utf8(static_cast<size_t>(len), '\0');
    if (WideCharToMultiByte(CP_UTF8, 0, w.c_str(), -1, utf8.data(), len, nullptr, nullptr) <= 0) {
        return "";
    }
    utf8.pop_back();
    // QFileDialog returns native Windows paths with forward slashes.  The
    // extended-length prefix (\\?\) only accepts backslashes, otherwise
    // std::ifstream/fopen report a misleading "cannot parse" failure.
    std::replace(utf8.begin(), utf8.end(), '/', '\\');
    if (utf8.size() >= 2 && utf8[1] == ':') {
        return "\\\\?\\" + utf8;
    }
    if (utf8.size() >= 2 && utf8[0] == '\\' && utf8[1] == '\\') {
        return "\\\\?\\UNC" + utf8.substr(1);
    }
    return utf8;
}
#else
FILE* openFile(const std::string& path, const char* mode)
{
    return fopen(path.c_str(), mode);
}

std::string toLowerExt(const std::string& path)
{
    auto dotPos = path.rfind('.');
    if (dotPos == std::string::npos) {
        return "";
    }
    std::string ext = path.substr(dotPos);
    for (auto& c : ext) {
        c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    }
    return ext;
}
#endif

} // namespace

PointCloudT::Ptr PointCloudGenerator::generateSyntheticCloud() {
    // 混合多个熵源确保 MSVC 下每次生成的点云不同
    std::seed_seq seq{
        static_cast<unsigned int>(std::chrono::high_resolution_clock::now()
            .time_since_epoch().count()),
        static_cast<unsigned int>(std::random_device{}()),
        static_cast<unsigned int>(
            reinterpret_cast<std::size_t>(&seq))
    };
    std::mt19937 rng(seq);

    PointCloudT::Ptr cloud(new PointCloudT);

    // ---- 随机几何体参数 ----

    // 1. 地面平面 - always present, random size
    float groundHalf = std::uniform_real_distribution<float>(2.0f, 4.5f)(rng);
    int groundN = std::uniform_int_distribution<int>(3000, 5500)(rng);
    addPlane(cloud, -groundHalf, groundHalf, -groundHalf, groundHalf, 0.0f, groundN, 0.01f, rng);

    // 2. 倾斜平面 - always present, random position/tilt/size
    int tiltedN = std::uniform_int_distribution<int>(1200, 3000)(rng);
    {
        float cx = std::uniform_real_distribution<float>(-2.0f, 2.0f)(rng);
        float cy = std::uniform_real_distribution<float>(-2.0f, 2.0f)(rng);
        float cz = std::uniform_real_distribution<float>(1.0f, 3.5f)(rng);
        float ax = std::uniform_real_distribution<float>(-0.6f, 0.6f)(rng);
        float ay = std::uniform_real_distribution<float>(-0.6f, 0.6f)(rng);
        float half = std::uniform_real_distribution<float>(0.5f, 1.5f)(rng);
        std::uniform_real_distribution<float> distX(-half, half);
        std::uniform_real_distribution<float> distY(-half, half);
        std::normal_distribution<float> noise(0.0f, 0.01f);
        for (int i = 0; i < tiltedN; ++i) {
            PointT p;
            p.x = cx + distX(rng);
            p.y = cy + distY(rng);
            p.z = cz + ax * (p.x - cx) + ay * (p.y - cy) + noise(rng);
            cloud->points.push_back(p);
        }
    }

    // 3. 球体 - 1~3个, random positions/radii
    int numSpheres = std::uniform_int_distribution<int>(1, 3)(rng);
    int spherePoints = 0;
    for (int i = 0; i < numSpheres; ++i) {
        float sx = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float sy = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float sr = std::uniform_real_distribution<float>(0.2f, 0.7f)(rng);
        float sz = std::uniform_real_distribution<float>(sr + 0.3f, 3.0f)(rng);
        int sn = std::uniform_int_distribution<int>(800, 2200)(rng);
        addSphere(cloud, sx, sy, sz, sr, sn, 0.01f, rng);
        spherePoints += sn;
    }

    // 4. 圆柱体 - 1~2个
    int numCylinders = std::uniform_int_distribution<int>(1, 2)(rng);
    int cylinderPoints = 0;
    for (int i = 0; i < numCylinders; ++i) {
        float cx = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float cy = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float czMin = std::uniform_real_distribution<float>(0.2f, 1.0f)(rng);
        float czMax = czMin + std::uniform_real_distribution<float>(1.0f, 2.5f)(rng);
        float cr = std::uniform_real_distribution<float>(0.15f, 0.5f)(rng);
        int cn = std::uniform_int_distribution<int>(800, 2200)(rng);
        addCylinder(cloud, cx, cy, czMin, czMax, cr, cn, 0.01f, rng);
        cylinderPoints += cn;
    }

    // 5. 锥体 - 0~2个
    int numCones = std::uniform_int_distribution<int>(0, 2)(rng);
    int conePoints = 0;
    for (int i = 0; i < numCones; ++i) {
        float ax = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float ay = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float az = std::uniform_real_distribution<float>(0.1f, 1.0f)(rng);
        float ha = std::uniform_real_distribution<float>(0.15f, 0.5f)(rng);
        float ht = std::uniform_real_distribution<float>(0.8f, 2.0f)(rng);
        int cn = std::uniform_int_distribution<int>(600, 1800)(rng);
        addCone(cloud, ax, ay, az, ha, ht, cn, 0.01f, rng);
        conePoints += cn;
    }

    // 6. 圆环 - 0~2个
    int numTori = std::uniform_int_distribution<int>(0, 2)(rng);
    int torusPoints = 0;
    for (int i = 0; i < numTori; ++i) {
        float tx = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float ty = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float tz = std::uniform_real_distribution<float>(0.5f, 2.5f)(rng);
        float majR = std::uniform_real_distribution<float>(0.3f, 0.8f)(rng);
        float minR = std::uniform_real_distribution<float>(0.08f, 0.25f)(rng);
        int tn = std::uniform_int_distribution<int>(600, 1800)(rng);
        addTorus(cloud, tx, ty, tz, majR, minR, tn, 0.01f, rng);
        torusPoints += tn;
    }

    // 7. 直线 - 0~2条
    int numLines = std::uniform_int_distribution<int>(0, 2)(rng);
    int linePoints = 0;
    for (int i = 0; i < numLines; ++i) {
        float lx = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float ly = std::uniform_real_distribution<float>(-3.0f, 3.0f)(rng);
        float lz = std::uniform_real_distribution<float>(0.5f, 3.5f)(rng);
        float len = std::uniform_real_distribution<float>(1.5f, 4.0f)(rng);
        // 随机三维方向
        float ddx = std::uniform_real_distribution<float>(-1.0f, 1.0f)(rng);
        float ddy = std::uniform_real_distribution<float>(-1.0f, 1.0f)(rng);
        float ddz = std::uniform_real_distribution<float>(-0.5f, 0.5f)(rng);
        int ln = std::uniform_int_distribution<int>(400, 1000)(rng);
        addLine(cloud, lx, ly, lz, ddx, ddy, ddz, len, ln, 0.01f, rng);
        linePoints += ln;
    }

    // 8. 随机噪声
    int noiseN = std::uniform_int_distribution<int>(300, 800)(rng);
    addNoise(cloud, noiseN, -4.5f, 4.5f, rng);

    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return cloud;
}

void PointCloudGenerator::addPlane(PointCloudT::Ptr cloud,
                                   float xMin, float xMax,
                                   float yMin, float yMax,
                                   float z, int numPoints, float noise,
                                   std::mt19937& rng) {
    std::uniform_real_distribution<float> distX(xMin, xMax);
    std::uniform_real_distribution<float> distY(yMin, yMax);
    std::normal_distribution<float> distNoise(0.0f, noise);

    for (int i = 0; i < numPoints; ++i) {
        PointT p;
        p.x = distX(rng);
        p.y = distY(rng);
        p.z = z + distNoise(rng);
        cloud->points.push_back(p);
    }
}

void PointCloudGenerator::addSphere(PointCloudT::Ptr cloud,
                                    float cx, float cy, float cz,
                                    float radius, int numPoints, float noise,
                                    std::mt19937& rng) {
    std::uniform_real_distribution<float> distTheta(0.0f, static_cast<float>(M_PI));
    std::uniform_real_distribution<float> distPhi(0.0f, static_cast<float>(2.0 * M_PI));
    std::normal_distribution<float> distNoise(0.0f, noise);

    for (int i = 0; i < numPoints; ++i) {
        float theta = distTheta(rng);
        float phi = distPhi(rng);
        float r = radius + distNoise(rng);
        PointT p;
        p.x = cx + r * std::sin(theta) * std::cos(phi);
        p.y = cy + r * std::sin(theta) * std::sin(phi);
        p.z = cz + r * std::cos(theta);
        cloud->points.push_back(p);
    }
}

void PointCloudGenerator::addCylinder(PointCloudT::Ptr cloud,
                                      float cx, float cy, float czMin, float czMax,
                                      float radius, int numPoints, float noise,
                                      std::mt19937& rng) {
    std::uniform_real_distribution<float> distAngle(0.0f, static_cast<float>(2.0 * M_PI));
    std::uniform_real_distribution<float> distZ(czMin, czMax);
    std::normal_distribution<float> distNoise(0.0f, noise);

    for (int i = 0; i < numPoints; ++i) {
        float angle = distAngle(rng);
        float r = radius + distNoise(rng);
        PointT p;
        p.x = cx + r * std::cos(angle);
        p.y = cy + r * std::sin(angle);
        p.z = distZ(rng);
        cloud->points.push_back(p);
    }
}

void PointCloudGenerator::addNoise(PointCloudT::Ptr cloud, int numPoints,
                                   float rangeMin, float rangeMax,
                                   std::mt19937& rng) {
    std::uniform_real_distribution<float> dist(rangeMin, rangeMax);

    for (int i = 0; i < numPoints; ++i) {
        PointT p;
        p.x = dist(rng);
        p.y = dist(rng);
        p.z = dist(rng);
        cloud->points.push_back(p);
    }
}

bool PointCloudGenerator::saveToPCD(const PointCloudT::Ptr& cloud, const std::wstring& filename)
{
#ifdef _WIN32
    const std::string path = wideToUtf8Extended(filename);
    if (!PointCloudIO::savePCDBinary(cloud, path)) {
        std::cerr << u8"[生成器] 保存PCD文件失败" << std::endl;
        return false;
    }
#else
    std::string narrow(filename.begin(), filename.end());
    if (!PointCloudIO::savePCDBinary(cloud, narrow)) {
        return false;
    }
#endif
    return true;
}

bool PointCloudGenerator::saveToPCD(const PointCloudT::Ptr& cloud, const std::string& filename)
{
#ifdef _WIN32
    return saveToPCD(cloud, utf8ToWide(filename));
#else
    PointCloudT::Ptr c = cloud;
    return PointCloudIO::savePCDBinary(cloud, filename);
#endif
}

static PointCloudT::Ptr loadFromOBJImpl(const std::wstring& filename);

static PointCloudT::Ptr loadFromPCDImpl(const std::wstring& filename)
{
#ifdef _WIN32
    const std::string path = wideToUtf8Extended(filename);
    PointCloudT::Ptr cloud;
    if (!PointCloudIO::loadPCD(path, cloud)) {
        std::cerr << u8"[生成器] 无法打开/解析PCD文件" << std::endl;
        return nullptr;
    }
    return cloud;
#else
    std::string narrow(filename.begin(), filename.end());
    PointCloudT::Ptr cloud;
    if (!PointCloudIO::loadPCD(narrow, cloud)) {
        return nullptr;
    }
    return cloud;
#endif
}

static PointCloudT::Ptr loadFromPLYImpl(const std::wstring& filename)
{
#ifdef _WIN32
    const std::string path = wideToUtf8Extended(filename);
    PointCloudT::Ptr cloud;
    if (!PointCloudIO::loadPLY(path, cloud)) {
        std::cerr << u8"[生成器] 无法打开/解析PLY文件" << std::endl;
        return nullptr;
    }
    return cloud;
#else
    std::string narrow(filename.begin(), filename.end());
    PointCloudT::Ptr cloud;
    if (!PointCloudIO::loadPLY(narrow, cloud)) {
        return nullptr;
    }
    return cloud;
#endif
}

PointCloudT::Ptr PointCloudGenerator::loadFromFile(const std::wstring& filename)
{
    g_lastLoadMeta = {};
    const std::wstring ext = toLowerExt(filename);
    if (ext == L".txt") {
        return loadFromTXT(filename);
    }
    if (ext == L".stl") {
        return loadFromSTL(filename);
    }
    if (ext == L".ply") {
        return loadFromPLYImpl(filename);
    }
    if (ext == L".obj") {
        return loadFromOBJImpl(filename);
    }
    if (ext == L".bin") {
        return loadFromNuScenesBIN(filename);
    }
    return loadFromPCDImpl(filename);
}

PointCloudT::Ptr PointCloudGenerator::loadFromFile(const std::string& filename)
{
#ifdef _WIN32
    return loadFromFile(utf8ToWide(filename));
#else
    return loadFromFile(std::wstring(filename.begin(), filename.end()));
#endif
}

const PointCloudLoadMeta& PointCloudGenerator::lastLoadMeta()
{
    return g_lastLoadMeta;
}

PointCloudT::Ptr PointCloudGenerator::loadFromNuScenesBIN(const std::wstring& filename)
{
#ifdef _WIN32
    FILE* fp = openFile(filename, L"rb");
#else
    std::string narrow(filename.begin(), filename.end());
    FILE* fp = openFile(narrow, "rb");
#endif
    if (!fp) {
        std::cerr << u8"[生成器] 无法打开 NuScenes BIN 文件" << std::endl;
        return nullptr;
    }

    if (std::fseek(fp, 0, SEEK_END) != 0) {
        std::fclose(fp);
        return nullptr;
    }
    const long byteCount = std::ftell(fp);
    if (byteCount <= 0 || byteCount % static_cast<long>(sizeof(float) * 5) != 0) {
        std::fclose(fp);
        std::cerr << u8"[生成器] BIN 不是 NuScenes float32 N×5 格式" << std::endl;
        return nullptr;
    }
    std::rewind(fp);

    PointCloudT::Ptr cloud(new PointCloudT);
    cloud->points.reserve(static_cast<size_t>(byteCount) / (sizeof(float) * 5));
    float record[5];
    while (std::fread(record, sizeof(float), 5, fp) == 5) {
        if (std::isfinite(record[0]) && std::isfinite(record[1]) && std::isfinite(record[2])) {
            cloud->points.emplace_back(record[0], record[1], record[2]);
        }
    }
    std::fclose(fp);
    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    g_lastLoadMeta.fileSizeBytes = static_cast<uint64_t>(byteCount);
    g_lastLoadMeta.outputPointCount = cloud->points.size();
    return cloud;
}

static PointCloudT::Ptr loadFromOBJImpl(const std::wstring& filename)
{
    FILE* fp = openFile(filename, L"r");
    if (!fp) {
        std::cerr << u8"[生成器] 无法打开OBJ文件" << std::endl;
        return nullptr;
    }

    PointCloudT::Ptr cloud(new PointCloudT);
    std::unordered_set<uint64_t> seen;
    char line[512];
    float vx, vy, vz;

    auto addPoint = [&](float x, float y, float z) {
        int xi = static_cast<int>(x * 1000000.f);
        int yi = static_cast<int>(y * 1000000.f);
        int zi = static_cast<int>(z * 1000000.f);
        uint64_t hash = (static_cast<uint64_t>(xi) << 42)
                      ^ (static_cast<uint64_t>(yi) << 21)
                      ^ static_cast<uint64_t>(zi);
        if (seen.insert(hash).second) {
            PointT p;
            p.x = x; p.y = y; p.z = z;
            cloud->points.push_back(p);
        }
    };

    while (fgets(line, sizeof(line), fp)) {
        if (line[0] == 'v' && line[1] == ' ') {
            if (sscanf(line + 2, "%f %f %f", &vx, &vy, &vz) == 3) {
                addPoint(vx, vy, vz);
            }
        }
    }
    fclose(fp);

    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return cloud;
}

PointCloudT::Ptr PointCloudGenerator::removeDuplicatePoints(const PointCloudT::Ptr& cloud, float tolerance) {
    if (!cloud || cloud->points.empty()) {
        return cloud;
    }
    const int scale = static_cast<int>(1.0f / tolerance);
    std::unordered_set<uint64_t> seen;
    auto result = PointCloudT::Ptr(new PointCloudT);
    result->points.reserve(cloud->points.size());

    for (const auto& p : cloud->points) {
        int xi = static_cast<int>(p.x * scale);
        int yi = static_cast<int>(p.y * scale);
        int zi = static_cast<int>(p.z * scale);
        uint64_t hash = (static_cast<uint64_t>(static_cast<uint32_t>(xi)) << 42)
                      ^ (static_cast<uint64_t>(static_cast<uint32_t>(yi)) << 21)
                      ^ static_cast<uint64_t>(static_cast<uint32_t>(zi));
        if (seen.insert(hash).second) {
            result->points.push_back(p);
        }
    }
    result->width = static_cast<uint32_t>(result->points.size());
    result->height = 1;
    result->is_dense = cloud->is_dense;
    return result;
}

PointCloudT::Ptr PointCloudGenerator::voxelDownsample(const PointCloudT::Ptr& cloud, float leafSize) {
    if (!cloud || cloud->points.empty() || leafSize <= 0.0f) {
        return cloud;
    }

    struct Acc {
        float sx = 0.f, sy = 0.f, sz = 0.f;
        int count = 0;
    };
    struct Key {
        int ix, iy, iz;
        bool operator==(const Key& o) const {
            return ix == o.ix && iy == o.iy && iz == o.iz;
        }
    };
    struct Hash {
        size_t operator()(const Key& k) const {
            return (static_cast<size_t>(static_cast<uint32_t>(k.ix)) << 42)
                 ^ (static_cast<size_t>(static_cast<uint32_t>(k.iy)) << 21)
                 ^ static_cast<size_t>(static_cast<uint32_t>(k.iz));
        }
    };

    const float inv = 1.0f / leafSize;
    std::unordered_map<Key, Acc, Hash> voxels;
    voxels.reserve(cloud->points.size() / 4 + 16);

    for (const auto& p : cloud->points) {
        Key k{
            static_cast<int>(std::floor(p.x * inv)),
            static_cast<int>(std::floor(p.y * inv)),
            static_cast<int>(std::floor(p.z * inv)),
        };
        auto& acc = voxels[k];
        acc.sx += p.x;
        acc.sy += p.y;
        acc.sz += p.z;
        ++acc.count;
    }

    auto filtered = PointCloudT::Ptr(new SimplePointCloud);
    filtered->points.reserve(voxels.size());
    for (const auto& entry : voxels) {
        const float n = static_cast<float>(entry.second.count);
        Point3f p;
        p.x = entry.second.sx / n;
        p.y = entry.second.sy / n;
        p.z = entry.second.sz / n;
        filtered->points.push_back(p);
    }
    filtered->width = static_cast<uint32_t>(filtered->points.size());
    filtered->height = 1;
    filtered->is_dense = cloud->is_dense;
    return filtered;
}

float PointCloudGenerator::estimateSpanSampled(const PointCloudT::Ptr& cloud,
                                               size_t maxSamples)
{
    if (!cloud || cloud->points.empty()) {
        return 1.0f;
    }
    const size_t n = cloud->points.size();
    const size_t step = std::max<size_t>(1, n / std::max<size_t>(1, maxSamples));
    float xMin = cloud->points[0].x;
    float xMax = xMin;
    float yMin = cloud->points[0].y;
    float yMax = yMin;
    float zMin = cloud->points[0].z;
    float zMax = zMin;
    for (size_t i = 0; i < n; i += step) {
        const auto& p = cloud->points[i];
        xMin = std::min(xMin, p.x);
        xMax = std::max(xMax, p.x);
        yMin = std::min(yMin, p.y);
        yMax = std::max(yMax, p.y);
        zMin = std::min(zMin, p.z);
        zMax = std::max(zMax, p.z);
    }
    return std::max({xMax - xMin, yMax - yMin, zMax - zMin, 1e-4f});
}

PointCloudT::Ptr PointCloudGenerator::downsampleToPointCount(const PointCloudT::Ptr& cloud,
                                                             size_t maxPoints)
{
    if (!cloud || cloud->points.empty() || cloud->points.size() <= maxPoints) {
        return cloud;
    }

    const size_t n = cloud->points.size();
    const float span = estimateSpanSampled(cloud);

    auto uniformSample = [&]() -> PointCloudT::Ptr {
        const size_t step = std::max<size_t>(1, (n + maxPoints - 1) / maxPoints);
        auto out = PointCloudT::Ptr(new SimplePointCloud);
        out->points.reserve(maxPoints);
        for (size_t i = 0; i < n; i += step) {
            out->points.push_back(cloud->points[i]);
        }
        out->width = static_cast<uint32_t>(out->points.size());
        out->height = 1;
        out->is_dense = cloud->is_dense;
        return out;
    };

    // 表面点云（STL 等）用体素叶 ≈ cbrt(体积) 会严重欠采样，改为二分搜索叶大小
    const size_t minTarget = maxPoints * 8 / 10;
    const size_t maxTarget = maxPoints * 11 / 10;
    float lo = std::max(span * 1e-6f, 1e-6f);
    float hi = span * 0.2f;
    PointCloudT::Ptr best;
    size_t bestCount = 0;

    for (int iter = 0; iter < 14; ++iter) {
        const float mid = (lo + hi) * 0.5f;
        auto ds = voxelDownsample(cloud, mid);
        const size_t count = ds ? ds->points.size() : 0;
        if (count > maxTarget) {
            lo = mid;
            if (count <= n && count > bestCount) {
                best = ds;
                bestCount = count;
            }
        } else {
            hi = mid;
            if (count >= minTarget && count <= maxTarget) {
                return ds;
            }
            if (count >= bestCount) {
                best = ds;
                bestCount = count;
            }
        }
    }

    if (best && bestCount >= minTarget) {
        if (bestCount <= maxTarget) {
            return best;
        }
        // 略超上限：均匀抽稀到 maxPoints
        const size_t step = std::max<size_t>(1, (bestCount + maxPoints - 1) / maxPoints);
        auto out = PointCloudT::Ptr(new SimplePointCloud);
        out->points.reserve(maxPoints);
        for (size_t i = 0; i < bestCount; i += step) {
            out->points.push_back(best->points[i]);
        }
        out->width = static_cast<uint32_t>(out->points.size());
        out->height = 1;
        out->is_dense = cloud->is_dense;
        return out;
    }

    // 体素无法达到目标（薄壳/稀疏面）→ 均匀步长，保证约 maxPoints 点
    return uniformSample();
}

PointCloudT::Ptr PointCloudGenerator::limitPointsForDisplay(const PointCloudT::Ptr& cloud,
                                                            size_t maxPoints)
{
    if (!cloud || cloud->points.empty() || cloud->points.size() <= maxPoints) {
        return cloud;
    }
    // 大 TXT 已是体素结果，勿再走二分体素（数百万点时会卡死数分钟）
    if (g_lastLoadMeta.txtStreamDownsampled) {
        const size_t n = cloud->points.size();
        const size_t step = std::max<size_t>(1, (n + maxPoints - 1) / maxPoints);
        auto out = PointCloudT::Ptr(new SimplePointCloud);
        out->points.reserve(maxPoints);
        for (size_t i = 0; i < n; i += step) {
            out->points.push_back(cloud->points[i]);
        }
        out->width = static_cast<uint32_t>(out->points.size());
        out->height = 1;
        out->is_dense = cloud->is_dense;
        return out;
    }
    return downsampleToPointCount(cloud, maxPoints);
}

PointCloudT::Ptr PointCloudGenerator::preprocess(const PointCloudT::Ptr& cloud,
                                                  bool removeDuplicates,
                                                  float voxelLeafSize) {
    if (!cloud || cloud->points.empty()) {
        return cloud;
    }
    PointCloudT::Ptr result = cloud;
    if (removeDuplicates && !g_lastLoadMeta.txtStreamDownsampled) {
        result = removeDuplicatePoints(result);
    }
    if (voxelLeafSize > 0.0f) {
        result = voxelDownsample(result, voxelLeafSize);
    } else if (g_lastLoadMeta.txtStreamDownsampled) {
        // 大 TXT 已在 loadFromTXT 流式体素到目标点数，不再二次体素
    } else if (result->points.size() > 350000) {
        // 超大点云：加载时轻量降采样，减轻显示与检测负担
        float xMin = result->points[0].x, xMax = result->points[0].x;
        float yMin = result->points[0].y, yMax = result->points[0].y;
        float zMin = result->points[0].z, zMax = result->points[0].z;
        const int step = std::max(1, static_cast<int>(result->points.size()) / 4000);
        for (int i = 0; i < static_cast<int>(result->points.size()); i += step) {
            const auto& p = result->points[static_cast<size_t>(i)];
            xMin = std::min(xMin, p.x); xMax = std::max(xMax, p.x);
            yMin = std::min(yMin, p.y); yMax = std::max(yMax, p.y);
            zMin = std::min(zMin, p.z); zMax = std::max(zMax, p.z);
        }
        float span = std::max({xMax - xMin, yMax - yMin, zMax - zMin, 0.001f});
        float autoLeaf = span / 1400.0f;
        result = voxelDownsample(result, autoLeaf);
    }
    return result;
}

void PointCloudGenerator::addCone(PointCloudT::Ptr cloud,
                                   float apexX, float apexY, float apexZ,
                                   float halfAngle, float height, int numPoints, float noise,
                                   std::mt19937& rng) {
    std::uniform_real_distribution<float> distH(0.0f, height);
    std::uniform_real_distribution<float> distAngle(0.0f, static_cast<float>(2.0 * M_PI));
    std::normal_distribution<float> distNoise(0.0f, noise);

    for (int i = 0; i < numPoints; ++i) {
        float h = distH(rng);
        float r = h * std::tan(halfAngle);
        float angle = distAngle(rng);
        PointT p;
        p.x = apexX + r * std::cos(angle) + distNoise(rng);
        p.y = apexY + r * std::sin(angle) + distNoise(rng);
        p.z = apexZ + h + distNoise(rng);
        cloud->points.push_back(p);
    }
}

void PointCloudGenerator::addTorus(PointCloudT::Ptr cloud,
                                    float cx, float cy, float cz,
                                    float majorR, float minorR, int numPoints, float noise,
                                    std::mt19937& rng) {
    std::uniform_real_distribution<float> distTheta(0.0f, static_cast<float>(2.0 * M_PI));
    std::uniform_real_distribution<float> distPhi(0.0f, static_cast<float>(2.0 * M_PI));
    std::normal_distribution<float> distNoise(0.0f, noise);

    for (int i = 0; i < numPoints; ++i) {
        float theta = distTheta(rng);
        float phi = distPhi(rng);
        float r = majorR + minorR * std::cos(phi);
        PointT p;
        p.x = cx + r * std::cos(theta) + distNoise(rng);
        p.y = cy + r * std::sin(theta) + distNoise(rng);
        p.z = cz + minorR * std::sin(phi) + distNoise(rng);
        cloud->points.push_back(p);
    }
}

void PointCloudGenerator::addLine(PointCloudT::Ptr cloud,
                                   float x0, float y0, float z0,
                                   float dx, float dy, float dz,
                                   float length, int numPoints, float noise,
                                   std::mt19937& rng) {
    std::uniform_real_distribution<float> distT(0.0f, length);
    std::normal_distribution<float> distNoise(0.0f, noise);

    float norm = std::sqrt(dx * dx + dy * dy + dz * dz);
    if (norm > 0) { dx /= norm; dy /= norm; dz /= norm; }

    for (int i = 0; i < numPoints; ++i) {
        float t = distT(rng);
        PointT p;
        p.x = x0 + dx * t + distNoise(rng);
        p.y = y0 + dy * t + distNoise(rng);
        p.z = z0 + dz * t + distNoise(rng);
        cloud->points.push_back(p);
    }
}

namespace {

constexpr size_t kTxtBufferCap = 16 * 1024 * 1024;
constexpr uint64_t kTxtStreamThreshold = 24ULL * 1024 * 1024;
constexpr size_t kTxtTargetPoints = 900000;
constexpr size_t kTxtBootstrapPoints = 6000;
/** 大 TXT 最多解析的有效行数（7GB≈9000万行，步长≈4～5，仍覆盖绝大部分空间） */
constexpr uint64_t kTxtMaxParseLines = 22000000ULL;

uint64_t txtFileSizeBytes(const std::wstring& path)
{
    std::error_code ec;
    const auto sz = std::filesystem::file_size(std::filesystem::path(path), ec);
    return ec ? 0ULL : static_cast<uint64_t>(sz);
}

const char* skipAsciiSpaces(const char* p, const char* end)
{
    while (p < end) {
        const unsigned char c = static_cast<unsigned char>(*p);
        if (c == ' ' || c == '\t' || c == ',' || c == ';' || c == '"') {
            ++p;
            continue;
        }
        break;
    }
    return p;
}

/** 常见 "x y z" 行：比 strtof 快一个数量级；失败则走通用解析 */
const char* fastParseOneFloat(const char* p, const char* end, float& out)
{
    p = skipAsciiSpaces(p, end);
    if (p >= end) {
        return nullptr;
    }
    bool neg = false;
    if (*p == '-') {
        neg = true;
        ++p;
    } else if (*p == '+') {
        ++p;
    }
    if (p >= end) {
        return nullptr;
    }
    if (!(std::isdigit(static_cast<unsigned char>(*p)) || *p == '.')) {
        return nullptr;
    }

    double val = 0.0;
    double frac = 0.0;
    double fracDiv = 1.0;
    bool hasDot = false;
    while (p < end) {
        const char c = *p;
        if (c >= '0' && c <= '9') {
            if (hasDot) {
                fracDiv *= 10.0;
                frac = frac * 10.0 + static_cast<double>(c - '0');
            } else {
                val = val * 10.0 + static_cast<double>(c - '0');
            }
            ++p;
            continue;
        }
        if (c == '.' && !hasDot) {
            hasDot = true;
            ++p;
            continue;
        }
        break;
    }
    val += frac / fracDiv;
    if (p < end && (*p == 'e' || *p == 'E')) {
        return nullptr;
    }
    out = static_cast<float>(neg ? -val : val);
    return p;
}

bool parseQuotedCsv3(const char* begin, const char* end, float& x, float& y, float& z)
{
    const char* p = begin;
    auto readField = [&](float& v) -> bool {
        if (p >= end || *p != '"') {
            return false;
        }
        ++p;
        char* n = nullptr;
        v = std::strtof(p, &n);
        if (n == p || !std::isfinite(v)) {
            return false;
        }
        p = n;
        if (p < end && *p == '"') {
            ++p;
        }
        while (p < end && (*p == ',' || *p == ' ' || *p == '\t')) {
            ++p;
        }
        return true;
    };
  return readField(x) && readField(y) && readField(z);
}

bool parseLineFirst3Floats(const char* begin, const char* end, float& x, float& y, float& z)
{
    if (begin < end && *begin == '"') {
        if (parseQuotedCsv3(begin, end, x, y, z)) {
            return true;
        }
    }

    const char* p = fastParseOneFloat(begin, end, x);
    if (p) {
        p = fastParseOneFloat(p, end, y);
        if (p) {
            p = fastParseOneFloat(p, end, z);
            if (p && std::isfinite(x) && std::isfinite(y) && std::isfinite(z)) {
                return true;
            }
        }
    }

    const char* q = begin;
    float vals[3];
    int found = 0;
    while (q < end && found < 3) {
        while (q < end) {
            const unsigned char c = static_cast<unsigned char>(*q);
            if (c == '-' || c == '+' || (c >= '0' && c <= '9')) {
                break;
            }
            ++q;
        }
        if (q >= end) {
            break;
        }
        char* next = nullptr;
        const float v = std::strtof(q, &next);
        if (next == q) {
            ++q;
            continue;
        }
        vals[found++] = v;
        q = next;
    }
    if (found < 3) {
        return false;
    }
    x = vals[0];
    y = vals[1];
    z = vals[2];
    return std::isfinite(x) && std::isfinite(y) && std::isfinite(z);
}

struct TxtVoxelKey {
    int32_t x = 0;
    int32_t y = 0;
    int32_t z = 0;
    bool operator==(const TxtVoxelKey& o) const noexcept
    {
        return x == o.x && y == o.y && z == o.z;
    }
};

struct TxtVoxelKeyHash {
    size_t operator()(const TxtVoxelKey& k) const noexcept
    {
        return static_cast<size_t>(k.x) * 73856093u
             ^ static_cast<size_t>(k.y) * 19349663u
             ^ static_cast<size_t>(k.z) * 83492791u;
    }
};

TxtVoxelKey quantizeTxtPoint(float px, float py, float pz, float leaf)
{
    const float inv = 1.0f / leaf;
    auto q = [inv](float v) -> int32_t {
        return static_cast<int32_t>(std::floor(v * inv));
    };
    return {q(px), q(py), q(pz)};
}

struct TxtVoxelGrid {
    float leaf = 1.f;
    int32_t ox = 0;
    int32_t oy = 0;
    int32_t oz = 0;
    int32_t nx = 0;
    int32_t ny = 0;
    int32_t nz = 0;
    std::vector<double> sx;
    std::vector<double> sy;
    std::vector<double> sz;
    std::vector<uint32_t> cnt;
    std::vector<uint32_t> occupied;

    bool init(float xMin, float xMax, float yMin, float yMax, float zMin, float zMax, float leafIn)
    {
        leaf = leafIn;
        const float padX = (xMax - xMin) * 0.22f;
        const float padY = (yMax - yMin) * 0.22f;
        const float padZ = std::max(zMax - zMin, leaf) * 0.35f + leaf;
        const float inv = 1.f / leaf;
        auto q0 = [inv](float v) { return static_cast<int32_t>(std::floor(v * inv)); };
        const int32_t ix0 = q0(xMin - padX);
        const int32_t iy0 = q0(yMin - padY);
        const int32_t iz0 = q0(zMin - padZ);
        const int32_t ix1 = q0(xMax + padX);
        const int32_t iy1 = q0(yMax + padY);
        const int32_t iz1 = q0(zMax + padZ);
        ox = ix0;
        oy = iy0;
        oz = iz0;
        nx = ix1 - ix0 + 1;
        ny = iy1 - iy0 + 1;
        nz = iz1 - iz0 + 1;
        if (nx <= 0 || ny <= 0 || nz <= 0) {
            return false;
        }
        const uint64_t cells = static_cast<uint64_t>(nx) * static_cast<uint64_t>(ny)
                             * static_cast<uint64_t>(nz);
        constexpr uint64_t kMaxGridCells = 6000000ULL;
        if (cells > kMaxGridCells) {
            return false;
        }
        const size_t n = static_cast<size_t>(cells);
        sx.assign(n, 0.0);
        sy.assign(n, 0.0);
        sz.assign(n, 0.0);
        cnt.assign(n, 0u);
        occupied.clear();
        occupied.reserve(kTxtTargetPoints);
        return true;
    }

    void insert(float x, float y, float z)
    {
        const float inv = 1.f / leaf;
        const int32_t ix = static_cast<int32_t>(std::floor(x * inv)) - ox;
        const int32_t iy = static_cast<int32_t>(std::floor(y * inv)) - oy;
        const int32_t iz = static_cast<int32_t>(std::floor(z * inv)) - oz;
        if (ix < 0 || iy < 0 || iz < 0 || ix >= nx || iy >= ny || iz >= nz) {
            return;
        }
        const size_t idx = static_cast<size_t>(ix)
            + static_cast<size_t>(iy) * static_cast<size_t>(nx)
            + static_cast<size_t>(iz) * static_cast<size_t>(nx) * static_cast<size_t>(ny);
        sx[idx] += static_cast<double>(x);
        sy[idx] += static_cast<double>(y);
        sz[idx] += static_cast<double>(z);
        if (cnt[idx] == 0) {
            occupied.push_back(static_cast<uint32_t>(idx));
        }
        ++cnt[idx];
    }

    void exportPoints(std::vector<PointT>& out, size_t maxPoints) const
    {
        if (occupied.empty()) {
            return;
        }
        size_t stride = 1;
        if (occupied.size() > maxPoints) {
            stride = (occupied.size() + maxPoints - 1) / maxPoints;
        }
        const size_t est = (occupied.size() + stride - 1) / stride;
        out.reserve(out.size() + est);
        for (size_t i = 0; i < occupied.size(); i += stride) {
            const uint32_t idx = occupied[i];
            const double n = static_cast<double>(cnt[idx]);
            out.emplace_back(
                static_cast<float>(sx[idx] / n),
                static_cast<float>(sy[idx] / n),
                static_cast<float>(sz[idx] / n));
        }
    }
};

class FastTxtScanner {
public:
    explicit FastTxtScanner(FILE* fp) : fp_(fp)
    {
        buf_.resize(kTxtBufferCap);
    }

    uint64_t bytesRead() const { return bytesRead_; }

    /** 跳过 count 条物理行（用 memchr 找 \\n，不构造行对象） */
    bool skipLines(size_t count)
    {
        while (count > 0) {
            while (pos_ < len_) {
                const void* found =
                    std::memchr(buf_.data() + pos_, '\n', len_ - pos_);
                if (!found) {
                    break;
                }
                pos_ = static_cast<const char*>(found) - buf_.data() + 1;
                --count;
            }
            if (count == 0) {
                return true;
            }
            if (!refillBuffer()) {
                return false;
            }
        }
        return true;
    }

    bool nextLine(const char*& lineStart, const char*& lineEnd)
    {
        lineStart = nullptr;
        lineEnd = nullptr;
        for (;;) {
            for (size_t i = pos_; i < len_; ++i) {
                if (buf_[i] != '\n') {
                    continue;
                }
                lineStart = buf_.data() + pos_;
                lineEnd = buf_.data() + i;
                pos_ = i + 1;
                if (lineEnd > lineStart && *(lineEnd - 1) == '\r') {
                    --lineEnd;
                }
                if (lineStart < lineEnd) {
                    return true;
                }
                // 空行：继续找下一行，不能 return false（否则会截断整个文件）
            }

            if (pos_ > 0 && pos_ < len_) {
                const size_t remain = len_ - pos_;
                std::memmove(buf_.data(), buf_.data() + pos_, remain);
                len_ = remain;
                pos_ = 0;
            } else if (pos_ >= len_) {
                pos_ = 0;
                len_ = 0;
            }

            if (!refillBuffer()) {
                if (pos_ < len_) {
                    lineStart = buf_.data() + pos_;
                    lineEnd = buf_.data() + len_;
                    pos_ = len_;
                    if (lineEnd > lineStart && *(lineEnd - 1) == '\r') {
                        --lineEnd;
                    }
                    return lineStart < lineEnd;
                }
                return false;
            }
        }
    }

private:
    bool refillBuffer()
    {
        if (pos_ > 0 && pos_ < len_) {
            const size_t remain = len_ - pos_;
            std::memmove(buf_.data(), buf_.data() + pos_, remain);
            len_ = remain;
            pos_ = 0;
        } else if (pos_ >= len_) {
            pos_ = 0;
            len_ = 0;
        }
        if (len_ >= kTxtBufferCap) {
            return false;
        }
        const size_t n = std::fread(buf_.data() + len_, 1, kTxtBufferCap - len_, fp_);
        if (n == 0) {
            return false;
        }
        bytesRead_ += n;
        len_ += n;
        return true;
    }

    FILE* fp_;
    std::vector<char> buf_;
    size_t len_ = 0;
    size_t pos_ = 0;
    uint64_t bytesRead_ = 0;
};

float computeStreamVoxelLeaf(float xMin, float xMax, float yMin, float yMax,
                             float zMin, float zMax, uint64_t /*fileSizeBytes*/)
{
    const float spanXY =
        std::max({xMax - xMin, yMax - yMin, 1e-4f});
    const float spanZ = std::max(zMax - zMin, 1e-4f);
    // 系数越大 → 叶越小 → 体素越多；2.0 在 ~6 万与数百万之间逼近 ~90 万
    constexpr float kLeafCoeff = 2.0f;
    const float leaf =
        spanXY / (std::sqrt(static_cast<float>(kTxtTargetPoints)) * kLeafCoeff);
    return std::max(leaf, std::max(spanZ, spanXY) * 1e-7f);
}

size_t computeTxtLineStride(uint64_t fileSizeBytes)
{
    if (fileSizeBytes < kTxtStreamThreshold) {
        return 1;
    }
    const uint64_t estLines = std::max<uint64_t>(1, fileSizeBytes / 88ULL);
    if (estLines <= kTxtMaxParseLines) {
        return 1;
    }
    return static_cast<size_t>(std::max<uint64_t>(1, estLines / kTxtMaxParseLines));
}

#ifdef _WIN32
class WinMappedTxt {
public:
    bool open(const std::wstring& path)
    {
        close();
        hFile_ = CreateFileW(path.c_str(), GENERIC_READ, FILE_SHARE_READ, nullptr,
                             OPEN_EXISTING, FILE_FLAG_SEQUENTIAL_SCAN, nullptr);
        if (hFile_ == INVALID_HANDLE_VALUE) {
            return false;
        }
        LARGE_INTEGER li{};
        if (GetFileSizeEx(hFile_, &li) == 0 || li.QuadPart <= 0) {
            close();
            return false;
        }
        size_ = static_cast<size_t>(li.QuadPart);
        hMap_ = CreateFileMappingW(hFile_, nullptr, PAGE_READONLY, 0, 0, nullptr);
        if (!hMap_) {
            close();
            return false;
        }
        data_ = static_cast<const char*>(MapViewOfFile(hMap_, FILE_MAP_READ, 0, 0, 0));
        if (!data_) {
            close();
            return false;
        }
        return true;
    }

    void close()
    {
        if (data_) {
            UnmapViewOfFile(data_);
            data_ = nullptr;
        }
        if (hMap_) {
            CloseHandle(hMap_);
            hMap_ = nullptr;
        }
        if (hFile_ != INVALID_HANDLE_VALUE) {
            CloseHandle(hFile_);
            hFile_ = INVALID_HANDLE_VALUE;
        }
        size_ = 0;
    }

    ~WinMappedTxt() { close(); }

    const char* data() const { return data_; }
    size_t size() const { return size_; }

private:
    HANDLE hFile_ = INVALID_HANDLE_VALUE;
    HANDLE hMap_ = nullptr;
    const char* data_ = nullptr;
    size_t size_ = 0;
};
#endif

PointCloudT::Ptr loadFromTxtScan(const char* data,
                                 size_t fileSize,
                                 bool streamMode,
                                 size_t lineStride,
                                 std::chrono::steady_clock::time_point loadT0)
{
    PointCloudT::Ptr cloud(new PointCloudT);
    const char* p = data;
    const char* const fileEnd = data + fileSize;

    float xMin = std::numeric_limits<float>::max();
    float yMin = std::numeric_limits<float>::max();
    float zMin = std::numeric_limits<float>::max();
    float xMax = -std::numeric_limits<float>::max();
    float yMax = -std::numeric_limits<float>::max();
    float zMax = -std::numeric_limits<float>::max();

    std::vector<PointT> bootstrap;
    bootstrap.reserve(kTxtBootstrapPoints);

    struct TxtVoxelAcc {
        float sx = 0.f;
        float sy = 0.f;
        float sz = 0.f;
        int count = 0;
    };
    std::unordered_map<TxtVoxelKey, TxtVoxelAcc, TxtVoxelKeyHash> voxels;
    TxtVoxelGrid voxelGrid;
    bool useVoxelGrid = false;
    float voxelLeaf = 0.0f;
    bool voxelActive = false;

    auto insertVoxel = [&](float x, float y, float z) {
        if (useVoxelGrid) {
            voxelGrid.insert(x, y, z);
            return;
        }
        const TxtVoxelKey key = quantizeTxtPoint(x, y, z, voxelLeaf);
        auto& acc = voxels[key];
        acc.sx += x;
        acc.sy += y;
        acc.sz += z;
        ++acc.count;
    };

    auto activateVoxelGrid = [&]() {
        voxelLeaf = computeStreamVoxelLeaf(
            xMin, xMax, yMin, yMax, zMin, zMax, g_lastLoadMeta.fileSizeBytes);
        useVoxelGrid = voxelGrid.init(xMin, xMax, yMin, yMax, zMin, zMax, voxelLeaf);
        if (!useVoxelGrid) {
            voxels.reserve(kTxtTargetPoints);
        }
        for (const auto& bp : bootstrap) {
            insertVoxel(bp.x, bp.y, bp.z);
        }
        bootstrap.clear();
        bootstrap.shrink_to_fit();
        voxelActive = true;
    };

    if (streamMode) {
        g_lastLoadMeta.txtLoadPhase = 0;
        const char* q = data;
        const char* const qEnd = data + fileSize;
        uint64_t bboxLine = 0;
        constexpr uint64_t kBboxSampleStride = 2000;
        while (q < qEnd) {
            const char* ls = q;
            const void* nf = std::memchr(q, '\n', static_cast<size_t>(qEnd - q));
            const char* le = nf ? static_cast<const char*>(nf) : qEnd;
            q = nf ? le + 1 : qEnd;
            if (le > ls && *(le - 1) == '\r') {
                --le;
            }
            if (ls >= le) {
                continue;
            }
            ++bboxLine;
            if ((bboxLine - 1) % kBboxSampleStride != 0) {
                continue;
            }
            float bx = 0.f;
            float by = 0.f;
            float bz = 0.f;
            if (!parseLineFirst3Floats(ls, le, bx, by, bz)) {
                continue;
            }
            xMin = std::min(xMin, bx);
            xMax = std::max(xMax, bx);
            yMin = std::min(yMin, by);
            yMax = std::max(yMax, by);
            zMin = std::min(zMin, bz);
            zMax = std::max(zMax, bz);
        }
    }

    if (!streamMode) {
        const size_t est = static_cast<size_t>(
            std::min<uint64_t>(g_lastLoadMeta.fileSizeBytes / 88ULL, 8'000'000ULL));
        cloud->points.reserve(std::max<size_t>(est, 4096));
    } else {
        voxels.reserve(kTxtTargetPoints);
    }

    size_t parsedLines = 0;
    size_t skippedLines = 0;
    size_t streamPhase2Parsed = 0;
    size_t lastProgressChunk = static_cast<size_t>(-1);

    while (p < fileEnd) {
        const char* lineStart = p;
        const void* nlFound = std::memchr(p, '\n', static_cast<size_t>(fileEnd - p));
        const char* nl = static_cast<const char*>(nlFound);
        const char* lineEnd = nl ? nl : fileEnd;
        p = nl ? nl + 1 : fileEnd;

        const size_t byteOff = static_cast<size_t>(lineStart - data);
        const size_t progChunk = byteOff / (16ULL * 1024 * 1024);
        if (progChunk != lastProgressChunk) {
            lastProgressChunk = progChunk;
            g_lastLoadMeta.txtBytesScanned = byteOff;
            g_lastLoadMeta.txtLoadPhase = 0;
            g_lastLoadMeta.txtLoadProgressPercent = static_cast<uint8_t>(
                std::min<uint64_t>(88ULL, (byteOff * 88ULL) / std::max<size_t>(1, fileSize)));
        }

        if (lineEnd > lineStart && *(lineEnd - 1) == '\r') {
            --lineEnd;
        }
        if (lineStart >= lineEnd) {
            continue;
        }

        float x = 0.f;
        float y = 0.f;
        float z = 0.f;
        if (!parseLineFirst3Floats(lineStart, lineEnd, x, y, z)) {
            ++skippedLines;
            continue;
        }
        ++parsedLines;

        if (!streamMode) {
            cloud->points.emplace_back(x, y, z);
            continue;
        }

        if (!voxelActive) {
            bootstrap.push_back(PointT{x, y, z});
            xMin = std::min(xMin, x);
            xMax = std::max(xMax, x);
            yMin = std::min(yMin, y);
            yMax = std::max(yMax, y);
            zMin = std::min(zMin, z);
            zMax = std::max(zMax, z);
            if (bootstrap.size() >= kTxtBootstrapPoints) {
                activateVoxelGrid();
            }
            continue;
        }

        insertVoxel(x, y, z);
        ++streamPhase2Parsed;

        if (lineStride > 1) {
            for (size_t sk = 0; sk < lineStride - 1 && p < fileEnd; ++sk) {
                const void* skipNl = std::memchr(p, '\n', static_cast<size_t>(fileEnd - p));
                if (!skipNl) {
                    p = fileEnd;
                    break;
                }
                p = static_cast<const char*>(skipNl) + 1;
            }
        }
    }

    g_lastLoadMeta.txtBytesScanned = fileSize;
    g_lastLoadMeta.txtLoadPhase = 1;
    g_lastLoadMeta.txtLoadProgressPercent = 90;

    if (streamMode) {
        if (!voxelActive) {
            for (const auto& pt : bootstrap) {
                cloud->points.push_back(pt);
            }
            std::cerr << u8"[生成器] 警告: 数据量不足，未能建立体素网格，仅 "
                      << cloud->points.size() << u8" 点" << std::endl;
        } else {
            constexpr size_t kExportCap = kTxtTargetPoints * 11 / 10;
            if (useVoxelGrid) {
                voxelGrid.exportPoints(cloud->points, kExportCap);
            } else {
                size_t stride = 1;
                if (voxels.size() > kExportCap) {
                    stride = (voxels.size() + kTxtTargetPoints - 1) / kTxtTargetPoints;
                }
                const size_t est = (voxels.size() + stride - 1) / stride;
                cloud->points.reserve(est);
                size_t vi = 0;
                for (const auto& entry : voxels) {
                    if ((vi++ % stride) != 0) {
                        continue;
                    }
                    const auto& acc = entry.second;
                    const float n = static_cast<float>(std::max(1, acc.count));
                    cloud->points.emplace_back(acc.sx / n, acc.sy / n, acc.sz / n);
                }
            }
            g_lastLoadMeta.txtLoadProgressPercent = 95;
            if (cloud->points.size() < kTxtTargetPoints * 8 / 10) {
                std::cerr << u8"[生成器] 警告: 输出点数偏少 ("
                          << cloud->points.size() << u8" < 目标 "
                          << kTxtTargetPoints << u8")，体素叶=" << voxelLeaf
                          << u8"，跨度 XY≈"
                          << (xMax - xMin) << u8"×" << (yMax - yMin)
                          << u8"，可调整 kLeafCoeff"
                          << std::endl;
            }
            const auto loadMs = std::chrono::duration_cast<std::chrono::milliseconds>(
                std::chrono::steady_clock::now() - loadT0);
            const uint64_t estTotalLines = std::max<uint64_t>(
                1, g_lastLoadMeta.fileSizeBytes / 88ULL);
            std::cerr << u8"[生成器] 大 TXT 快速加载: "
                      << (g_lastLoadMeta.fileSizeBytes / (1024 * 1024)) << u8" MB, 约 "
                      << estTotalLines << u8" 行, 步长 " << lineStride << u8", 解析 "
                      << parsedLines << u8" 行 (流式体素阶段 " << streamPhase2Parsed
                      << u8") → " << cloud->points.size() << u8" 点 (目标 "
                      << kTxtTargetPoints << u8"), 耗时 " << loadMs.count() << u8" ms"
                      << std::endl;
        }
    } else if (parsedLines == 0) {
        std::cerr << u8"[生成器] TXT 未解析到有效坐标行 (跳过 " << skippedLines
                  << u8" 行)" << std::endl;
        return nullptr;
    }

    if (cloud->points.empty()) {
        std::cerr << u8"[生成器] TXT 加载结果为空" << std::endl;
        return nullptr;
    }

    g_lastLoadMeta.txtLoadPhase = 1;
    g_lastLoadMeta.txtLoadProgressPercent = 96;

    {
        double sx = 0.0;
        double sy = 0.0;
        double sz = 0.0;
        for (const auto& p : cloud->points) {
            sx += p.x;
            sy += p.y;
            sz += p.z;
        }
        const size_t n = cloud->points.size();
        const float cx = static_cast<float>(sx / static_cast<double>(n));
        const float cy = static_cast<float>(sy / static_cast<double>(n));
        const float cz = static_cast<float>(sz / static_cast<double>(n));
        for (auto& pt : cloud->points) {
            pt.x -= cx;
            pt.y -= cy;
            pt.z -= cz;
        }
    }

    g_lastLoadMeta.outputPointCount = cloud->points.size();
    g_lastLoadMeta.txtLoadPhase = 2;
    g_lastLoadMeta.txtLoadProgressPercent = 100;
    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return cloud;
}

} // namespace

PointCloudT::Ptr PointCloudGenerator::loadFromTXT(const std::wstring& filename)
{
    g_lastLoadMeta = {};
    g_lastLoadMeta.fileSizeBytes = txtFileSizeBytes(filename);
    if (g_lastLoadMeta.fileSizeBytes == 0) {
        std::cerr << u8"[生成器] 无法获取 TXT 文件大小或文件为空" << std::endl;
        return nullptr;
    }

    const auto loadT0 = std::chrono::steady_clock::now();
    const bool streamMode = g_lastLoadMeta.fileSizeBytes >= kTxtStreamThreshold;
    g_lastLoadMeta.txtStreamDownsampled = streamMode;
    const size_t lineStride = computeTxtLineStride(g_lastLoadMeta.fileSizeBytes);

#ifdef _WIN32
    if (streamMode) {
        WinMappedTxt mapped;
        if (mapped.open(filename)) {
            std::cerr << u8"[生成器] 大 TXT：内存映射扫描 ("
                      << (g_lastLoadMeta.fileSizeBytes / (1024 * 1024)) << u8" MB)"
                      << std::endl;
            return loadFromTxtScan(
                mapped.data(), mapped.size(), streamMode, lineStride, loadT0);
        }
        std::cerr << u8"[生成器] 内存映射失败，回退分块读取" << std::endl;
    }
#endif

    FILE* fp = openFile(filename, L"rb");
    if (!fp) {
        std::cerr << u8"[生成器] 无法打开TXT文件" << std::endl;
        return nullptr;
    }
    std::vector<char> fileBuf;
    try {
        fileBuf.resize(static_cast<size_t>(g_lastLoadMeta.fileSizeBytes));
    } catch (...) {
        std::fclose(fp);
        std::cerr << u8"[生成器] TXT 过大，无法分配读缓冲" << std::endl;
        return nullptr;
    }
    const size_t got =
        std::fread(fileBuf.data(), 1, fileBuf.size(), fp);
    std::fclose(fp);
    if (got == 0) {
        std::cerr << u8"[生成器] TXT 读取失败" << std::endl;
        return nullptr;
    }
    return loadFromTxtScan(fileBuf.data(), got, streamMode, lineStride, loadT0);
}

PointCloudT::Ptr PointCloudGenerator::loadFromSTL(const std::wstring& filename) {
    FILE* fp = openFile(filename, L"rb");
    if (!fp) {
        std::cerr << u8"[生成器] 无法打开STL文件" << std::endl;
        return nullptr;
    }

    char header[81] = {};
    fread(header, 1, 80, fp);
    header[80] = '\0';
    std::string hdr(header);
    bool isAscii = (hdr.size() >= 5 && hdr.substr(0, 5) == "solid"
                    && (hdr[5] == ' ' || hdr[5] == '\n' || hdr[5] == '\r'));

    PointCloudT::Ptr cloud(new PointCloudT);
    std::unordered_set<uint64_t> seen;

    auto addPoint = [&](float x, float y, float z) {
        int xi = static_cast<int>(x * 1000000.f);
        int yi = static_cast<int>(y * 1000000.f);
        int zi = static_cast<int>(z * 1000000.f);
        uint64_t hash = (static_cast<uint64_t>(xi) << 42)
                      ^ (static_cast<uint64_t>(yi) << 21)
                      ^ static_cast<uint64_t>(zi);
        if (seen.insert(hash).second) {
            PointT p;
            p.x = x; p.y = y; p.z = z;
            cloud->points.push_back(p);
        }
    };

    if (isAscii) {
        rewind(fp);
        char line[256];
        float vx, vy, vz;
        while (fgets(line, sizeof(line), fp)) {
            if (sscanf(line, " vertex %f %f %f", &vx, &vy, &vz) == 3) {
                addPoint(vx, vy, vz);
            }
        }
    } else {
        fseek(fp, 80, SEEK_SET);
        uint32_t triCount = 0;
        fread(&triCount, 4, 1, fp);
        struct Tri { float nx, ny, nz; float v1[3], v2[3], v3[3]; uint16_t attr; } tri;
        for (uint32_t i = 0; i < triCount; ++i) {
            fread(&tri, 50, 1, fp);
            addPoint(tri.v1[0], tri.v1[1], tri.v1[2]);
            addPoint(tri.v2[0], tri.v2[1], tri.v2[2]);
            addPoint(tri.v3[0], tri.v3[1], tri.v3[2]);
        }
    }

    fclose(fp);

    double sumX = 0, sumY = 0, sumZ = 0;
    for (const auto& p : cloud->points) {
        sumX += p.x; sumY += p.y; sumZ += p.z;
    }
    size_t n = cloud->points.size();
    if (n > 0) {
        float cx = static_cast<float>(sumX / n);
        float cy = static_cast<float>(sumY / n);
        float cz = static_cast<float>(sumZ / n);
        for (auto& p : cloud->points) {
            p.x -= cx; p.y -= cy; p.z -= cz;
        }
    }

    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return cloud;
}
