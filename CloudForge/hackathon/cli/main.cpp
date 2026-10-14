// cloudforge-cli — 点云几何核心的命令行入口（供 AGH 智能体插件以子进程方式调用）
//
// 子命令：
//   info   <cloud>                                   点云元信息（点数/包围盒/格式诊断）
//   detect <cloud> [--preset outdoor|mechanical]     RANSAC 基元检测（含精拟合指标）
//          [--min-inlier N] [--output DIR]
//   refine <cloud> --indices FILE [--hint TYPE]      对点子集做精拟合（<50 点拒绝）
//          [--output DIR]
//   synth  <out.pcd> [--scene plane-cylinder]        生成已知真值的合成点云（验证用）
//   verify --truth FILE --result FILE [--tol R]      检测结果 vs 真值的误差判定
//
// 输出全部为单行/缩进 JSON（ASCII），退出码：0 成功，1 用法错误，2 业务失败。
// 系数语义与 ransac_lib_api.h 一致；TXT/STL 加载后质心居中（库行为），info 会标注。

#include "point_cloud_generator.h"
#include "ransac_lib_api.h"

#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <filesystem>
#include <fstream>
#include <iostream>
#include <map>
#include <random>
#include <set>
#include <sstream>
#include <string>
#include <vector>

#ifdef _WIN32
#include <windows.h>
#endif

namespace fs = std::filesystem;

// ---------- 极简 JSON（生成 + 解析），只覆盖本项目自身格式 ----------

static std::string jesc(const std::string& s) {
    std::string out;
    for (char c : s) {
        switch (c) {
        case '"': out += "\\\""; break;
        case '\\': out += "\\\\"; break;
        case '\n': out += "\\n"; break;
        case '\r': out += "\\r"; break;
        case '\t': out += "\\t"; break;
        default:
            if (static_cast<unsigned char>(c) < 0x20) {
                char buf[8];
                std::snprintf(buf, sizeof(buf), "\\u%04x", c);
                out += buf;
            } else {
                out += c;
            }
        }
    }
    return out;
}

// fs::path → UTF-8 字符串（u8string 每个元素即一个 UTF-8 码元，逐个拷贝即可）
static std::string pathToUtf8(const fs::path& p) {
    auto u = p.u8string();
    return std::string(u.begin(), u.end());
}

static std::string jnum(double v) {
    if (!std::isfinite(v)) return "null";
    char buf[32];
    std::snprintf(buf, sizeof(buf), "%.9g", v);
    return buf;
}

struct Json {
    enum Type { NUL, BOOL, NUM, STR, ARR, OBJ } type = NUL;
    bool b = false;
    double num = 0;
    std::string str;
    std::vector<Json> arr;
    std::vector<std::pair<std::string, Json>> obj;  // 保持插入序

    const Json* find(const std::string& key) const {
        if (type != OBJ) return nullptr;
        for (auto& kv : obj)
            if (kv.first == key) return &kv.second;
        return nullptr;
    }
    double getNum(const std::string& key, double def = 0) const {
        const Json* j = find(key);
        return (j && j->type == NUM) ? j->num : def;
    }
};

struct JsonParser {
    const std::string& s;
    size_t i = 0;
    explicit JsonParser(const std::string& src) : s(src) {}

    void skipWs() { while (i < s.size() && (s[i] == ' ' || s[i] == '\t' || s[i] == '\n' || s[i] == '\r')) ++i; }
    bool fail() { return false; }

    bool parse(Json& out) {
        skipWs();
        if (i >= s.size()) return fail();
        char c = s[i];
        if (c == '{') return parseObj(out);
        if (c == '[') return parseArr(out);
        if (c == '"') { out.type = Json::STR; return parseStr(out.str); }
        if (c == 't' && s.compare(i, 4, "true") == 0) { i += 4; out.type = Json::BOOL; out.b = true; return true; }
        if (c == 'f' && s.compare(i, 5, "false") == 0) { i += 5; out.type = Json::BOOL; out.b = false; return true; }
        if (c == 'n' && s.compare(i, 4, "null") == 0) { i += 4; out.type = Json::NUL; return true; }
        return parseNum(out);
    }
    bool parseObj(Json& out) {
        out.type = Json::OBJ;
        ++i; skipWs();
        if (i < s.size() && s[i] == '}') { ++i; return true; }
        while (true) {
            skipWs();
            if (i >= s.size() || s[i] != '"') return fail();
            std::string key;
            if (!parseStr(key)) return false;
            skipWs();
            if (i >= s.size() || s[i] != ':') return fail();
            ++i;
            Json val;
            if (!parse(val)) return false;
            out.obj.emplace_back(key, std::move(val));
            skipWs();
            if (i < s.size() && s[i] == ',') { ++i; continue; }
            if (i < s.size() && s[i] == '}') { ++i; return true; }
            return fail();
        }
    }
    bool parseArr(Json& out) {
        out.type = Json::ARR;
        ++i; skipWs();
        if (i < s.size() && s[i] == ']') { ++i; return true; }
        while (true) {
            Json val;
            if (!parse(val)) return false;
            out.arr.push_back(std::move(val));
            skipWs();
            if (i < s.size() && s[i] == ',') { ++i; continue; }
            if (i < s.size() && s[i] == ']') { ++i; return true; }
            return fail();
        }
    }
    bool parseStr(std::string& out) {
        ++i;  // 跳过开头 "
        while (i < s.size()) {
            char c = s[i++];
            if (c == '"') return true;
            if (c == '\\' && i < s.size()) {
                char e = s[i++];
                switch (e) {
                case '"': out += '"'; break;
                case '\\': out += '\\'; break;
                case '/': out += '/'; break;
                case 'n': out += '\n'; break;
                case 'r': out += '\r'; break;
                case 't': out += '\t'; break;
                case 'u': {
                    if (i + 4 > s.size()) return fail();
                    unsigned code = std::strtoul(s.substr(i, 4).c_str(), nullptr, 16);
                    i += 4;
                    // UTF-8 编码（BMP 内足够，本 CLI 自产 JSON 均为 ASCII）
                    if (code < 0x80) out += static_cast<char>(code);
                    else if (code < 0x800) {
                        out += static_cast<char>(0xC0 | (code >> 6));
                        out += static_cast<char>(0x80 | (code & 0x3F));
                    } else {
                        out += static_cast<char>(0xE0 | (code >> 12));
                        out += static_cast<char>(0x80 | ((code >> 6) & 0x3F));
                        out += static_cast<char>(0x80 | (code & 0x3F));
                    }
                    break;
                }
                default: return fail();
                }
            } else {
                out += c;
            }
        }
        return fail();
    }
    bool parseNum(Json& out) {
        char* end = nullptr;
        double v = std::strtod(s.c_str() + i, &end);
        if (end == s.c_str() + i) return fail();
        i = static_cast<size_t>(end - s.c_str());
        out.type = Json::NUM;
        out.num = v;
        return true;
    }
};

static bool readTextFile(const fs::path& p, std::string& out) {
    std::ifstream f(p, std::ios::binary);
    if (!f) return false;
    std::ostringstream ss;
    ss << f.rdbuf();
    out = ss.str();
    return true;
}

// ---------- 通用辅助 ----------

static std::string lowerExt(const fs::path& p) {
    std::string e = p.extension().string();
    for (auto& c : e) c = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
    return e;
}

// TXT 与 STL 加载后质心居中（核心库固定行为，见 spec/core-contracts.md §3.3/3.4）
static bool formatCentersCloud(const std::string& ext) {
    return ext == ".txt" || ext == ".stl";
}

static const char* shapeTypeName(RansacShapeType t) {
    const char* n = ransac_shape_type_name(t);
    return n ? n : "Unknown";
}

static RansacShapeType parseHint(const std::string& s, bool& ok) {
    ok = true;
    if (s == "plane" || s == "PLANE") return RANSAC_SHAPE_PLANE;
    if (s == "sphere" || s == "SPHERE") return RANSAC_SHAPE_SPHERE;
    if (s == "cylinder" || s == "CYLINDER") return RANSAC_SHAPE_CYLINDER;
    if (s == "cone" || s == "CONE") return RANSAC_SHAPE_CONE;
    if (s == "torus" || s == "TORUS") return RANSAC_SHAPE_TORUS;
    if (s == "unknown" || s == "UNKNOWN" || s == "auto") return RANSAC_SHAPE_UNKNOWN;
    ok = false;
    return RANSAC_SHAPE_UNKNOWN;
}

static void emitShapesJson(std::ostringstream& o, const RansacDetectOutput* out) {
    o << "  \"shape_count\": " << out->shape_count << ",\n";
    o << "  \"inlier_point_sum\": " << out->inlier_point_sum << ",\n";
    o << "  \"remaining_count\": " << out->remaining_count << ",\n";
    o << "  \"shapes\": [\n";
    for (int k = 0; k < out->shape_count; ++k) {
        const RansacShapeItem& sh = out->shapes[k];
        o << "    {\"id\": " << k
          << ", \"type\": \"" << shapeTypeName(sh.type) << "\""
          << ", \"type_id\": " << static_cast<int>(sh.type)
          << ", \"inlier_count\": " << sh.inlier_count
          << ", \"rmse\": " << jnum(sh.rmse)
          << ", \"robust_sigma\": " << jnum(sh.robust_sigma)
          << ", \"soft_score\": " << jnum(sh.soft_score)
          << ", \"coefficients\": [";
        for (int c = 0; c < sh.coefficient_count; ++c) {
            if (c) o << ", ";
            o << jnum(sh.coefficients[c]);
        }
        o << "]";
        o << "}";
        if (k + 1 < out->shape_count) o << ",";
        o << "\n";
    }
    o << "  ]";
}

static void saveDetectOutput(const fs::path& dir, const RansacDetectOutput* out, const std::string& sourceCloud) {
    fs::create_directories(dir);
    fs::create_directories(dir / "indices");
    std::ostringstream o;
    o << "{\n  \"ok\": true,\n";
    o << "  \"source_cloud\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(sourceCloud)))) << "\",\n";
    o << "  \"input_point_count\": " << out->input_point_count << ",\n";
    emitShapesJson(o, out);
    o << "\n}\n";
    std::ofstream f(dir / "result.json", std::ios::binary);
    f << o.str();

    for (int k = 0; k < out->shape_count; ++k) {
        const RansacShapeItem& sh = out->shapes[k];
        std::ofstream idx(dir / "indices" / ("shape_" + std::to_string(k) + ".txt"), std::ios::binary);
        for (int m = 0; m < sh.inlier_count; ++m) idx << sh.inlier_indices[m] << "\n";
    }
    if (out->remaining_count > 0) {
        std::ofstream rem(dir / "indices" / "remaining.txt", std::ios::binary);
        for (int m = 0; m < out->remaining_count; ++m) rem << out->remaining_indices[m] << "\n";
    }
}

static bool loadCloudOrReport(const std::string& pathStr, PointCloudT::Ptr& cloud, std::string& err) {
    fs::path p = fs::absolute(fs::u8path(pathStr));
    if (!fs::exists(p)) {
        err = "file not found: " + p.u8string();
        return false;
    }
    cloud = PointCloudGenerator::loadFromFile(p.wstring());
    if (!cloud || cloud->empty()) {
        err = "failed to load point cloud (0 points): " + p.u8string();
        return false;
    }
    return true;
}

static int printUsage() {
    std::cerr
        << "Usage:\n"
        << "  cloudforge-cli info <cloud>\n"
        << "  cloudforge-cli detect <cloud> [--preset outdoor|mechanical] [--min-inlier N] [--output DIR] [--preserve-points]\n"
        << "  cloudforge-cli refine <cloud> --indices FILE [--hint plane|sphere|cylinder|cone|torus|unknown] [--output DIR]\n"
        << "  cloudforge-cli synth <out.pcd> [--scene plane-cylinder]\n"
        << "  cloudforge-cli verify --truth FILE --result FILE [--tol R] [--angle-deg A]\n"
        << "  cloudforge-cli cad <cloud> --result DIR/result.json --out model.py [--step M.step] [--union]\n";
    return 1;
}

// ---------- 子命令 ----------

static int cmdInfo(const std::string& file) {
    PointCloudT::Ptr cloud;
    std::string err;
    if (!loadCloudOrReport(file, cloud, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }
    float mn[3] = {1e30f, 1e30f, 1e30f}, mx[3] = {-1e30f, -1e30f, -1e30f};
    for (const auto& pt : cloud->points)
        for (int a = 0; a < 3; ++a) {
            float v = (&pt.x)[a];
            if (!std::isfinite(v)) continue;
            if (v < mn[a]) mn[a] = v;
            if (v > mx[a]) mx[a] = v;
        }
    float span = std::max({mx[0] - mn[0], mx[1] - mn[1], mx[2] - mn[2]});
    std::string ext = lowerExt(file);
    const PointCloudLoadMeta& meta = PointCloudGenerator::lastLoadMeta();

    std::ostringstream o;
    o << "{\n";
    o << "  \"ok\": true,\n";
    o << "  \"file\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(file)))) << "\",\n";
    o << "  \"format\": \"" << jesc(ext.empty() ? "(none)" : ext.substr(1)) << "\",\n";
    o << "  \"points\": " << cloud->size() << ",\n";
    o << "  \"centered\": " << (formatCentersCloud(ext) ? "true" : "false") << ",\n";
    o << "  \"txt_stream_downsampled\": " << (meta.txtStreamDownsampled ? "true" : "false") << ",\n";
    o << "  \"bbox_min\": [" << jnum(mn[0]) << ", " << jnum(mn[1]) << ", " << jnum(mn[2]) << "],\n";
    o << "  \"bbox_max\": [" << jnum(mx[0]) << ", " << jnum(mx[1]) << ", " << jnum(mx[2]) << "],\n";
    o << "  \"span\": " << jnum(span) << "\n";
    o << "}\n";
    std::cout << o.str();
    return 0;
}

static int cmdDetect(int argc, char** argv) {
    std::string file;
    int preset = RANSAC_PRESET_MECHANICAL_FULL;
    std::string presetName = "mechanical_full";
    int minInlier = 0;
    std::string outDir;
    bool preservePoints = false; // 面板索引需对应原始预览，保持已校验输入的点数和顺序。
    double noiseSigma = -1.0;   // <0 = 不加噪
    double downsample = 1.0;    // <1 = 随机保留比例（鲁棒性扫描用）
    for (int i = 0; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--preset" && i + 1 < argc) {
            presetName = argv[++i];
            preset = (presetName == "outdoor") ? RANSAC_PRESET_OUTDOOR_PLANES : RANSAC_PRESET_MECHANICAL_FULL;
            if (presetName == "outdoor") presetName = "outdoor_planes";
        } else if (a == "--min-inlier" && i + 1 < argc) {
            minInlier = std::atoi(argv[++i]);
        } else if (a == "--output" && i + 1 < argc) {
            outDir = argv[++i];
        } else if (a == "--noise" && i + 1 < argc) {
            noiseSigma = std::atof(argv[++i]);
        } else if (a == "--downsample" && i + 1 < argc) {
            downsample = std::atof(argv[++i]);
        } else if (a == "--preserve-points") {
            preservePoints = true;
        } else if (file.empty()) {
            file = a;
        }
    }
    if (file.empty()) return printUsage();
    if (preservePoints && (noiseSigma > 0 || downsample < 1.0)) {
        std::cout << "{\"ok\": false, \"error\": \"--preserve-points cannot be combined with noise or downsample\"}\n";
        return 2;
    }

    PointCloudT::Ptr cloud;
    std::string err;
    if (!loadCloudOrReport(file, cloud, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }
    if (!preservePoints && !formatCentersCloud(lowerExt(file)))
        cloud = PointCloudGenerator::preprocess(cloud, true, 0.0f);

    // 鲁棒性扫描注：噪声注入与随机降采样在检测前施加（固定种子，同工况可复现）
    if (noiseSigma > 0 || downsample < 1.0) {
        std::mt19937 rng(20260315);
        if (noiseSigma > 0) {
            std::normal_distribution<float> gauss(0.0f, static_cast<float>(noiseSigma));
            for (auto& p : cloud->points) {
                p.x += gauss(rng);
                p.y += gauss(rng);
                p.z += gauss(rng);
            }
        }
        if (downsample < 1.0 && downsample > 0) {
            std::uniform_real_distribution<double> uni(0.0, 1.0);
            std::vector<Point3f> kept;
            kept.reserve(static_cast<size_t>(cloud->size() * downsample));
            for (const auto& p : cloud->points)
                if (uni(rng) < downsample) kept.push_back(p);
            cloud->points = std::move(kept);
            cloud->width = static_cast<uint32_t>(cloud->points.size());
        }
    }

    RansacInputCloud input;
    input.points = reinterpret_cast<const float (*)[3]>(cloud->points.data());
    input.point_num = static_cast<int>(cloud->size());

    RansacDetectParams params;
    params.preset = static_cast<RansacScenePreset>(preset);
    params.min_inlier_count = minInlier;

    RansacDetectOutput output;
    std::memset(&output, 0, sizeof(output));

    auto t0 = std::chrono::steady_clock::now();
    int rc = ransac_detect(&input, &params, &output);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now() - t0).count();

    if (rc != 0) {
        ransac_free_output(&output);
        std::cout << "{\"ok\": false, \"error\": \"ransac_detect returned " << rc << "\", \"points\": "
                  << cloud->size() << "}\n";
        return 2;
    }

    std::ostringstream o;
    o << "{\n  \"ok\": true,\n";
    o << "  \"file\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(file)))) << "\",\n";
    o << "  \"preset\": \"" << presetName << "\",\n";
    o << "  \"source_cloud\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(file)))) << "\",\n";
    o << "  \"points\": " << cloud->size() << ",\n";
    if (noiseSigma > 0 || downsample < 1.0)
        o << "  \"perturbation\": {\"noise_sigma\": " << jnum(noiseSigma > 0 ? noiseSigma : 0)
          << ", \"downsample\": " << jnum(downsample) << "},\n";
    o << "  \"elapsed_ms\": " << ms << ",\n";
    emitShapesJson(o, &output);
    o << "\n}\n";
    std::cout << o.str();

    if (!outDir.empty()) saveDetectOutput(outDir, &output, file);
    ransac_free_output(&output);
    return 0;
}

static int cmdRefine(int argc, char** argv) {
    std::string file, indicesFile, outDir;
    std::string hintStr = "unknown";
    for (int i = 0; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--indices" && i + 1 < argc) indicesFile = argv[++i];
        else if (a == "--hint" && i + 1 < argc) hintStr = argv[++i];
        else if (a == "--output" && i + 1 < argc) outDir = argv[++i];
        else if (file.empty()) file = a;
    }
    if (file.empty() || indicesFile.empty()) return printUsage();

    bool hintOk = false;
    RansacShapeType hint = parseHint(hintStr, hintOk);
    if (!hintOk) {
        std::cout << "{\"ok\": false, \"error\": \"unknown hint: " << jesc(hintStr) << "\"}\n";
        return 1;
    }

    PointCloudT::Ptr cloud;
    std::string err;
    if (!loadCloudOrReport(file, cloud, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }

    std::ifstream idxFile(fs::u8path(indicesFile), std::ios::binary);
    if (!idxFile) {
        std::cout << "{\"ok\": false, \"error\": \"cannot open indices file: " << jesc(indicesFile) << "\"}\n";
        return 2;
    }
    std::vector<int> sel;
    std::string line;
    while (std::getline(idxFile, line)) {
        if (!line.empty() && line[0] == '#') continue;
        int v = std::atoi(line.c_str());
        if (line.find_first_not_of(" \t\r") == std::string::npos) continue;
        sel.push_back(v);
    }

    auto reportFail = [&](int rc) {
        std::cout << "{\"ok\": false, \"error\": \"ransac_refine_instance returned " << rc
                  << "\", \"selected\": " << sel.size() << "}\n";
        return 2;
    };

    if (sel.empty()) {
        std::cout << "{\"ok\": false, \"error\": \"empty selection\", \"selected\": 0}\n";
        return 2;
    }

    RansacInputCloud input;
    input.points = reinterpret_cast<const float (*)[3]>(cloud->points.data());
    input.point_num = static_cast<int>(cloud->size());

    RansacDetectParams params;
    params.preset = RANSAC_PRESET_MECHANICAL_FULL;
    params.min_inlier_count = 0;

    RansacDetectOutput output;
    std::memset(&output, 0, sizeof(output));

    auto t0 = std::chrono::steady_clock::now();
    int rc = ransac_refine_instance(&input, sel.data(), static_cast<int>(sel.size()), hint, &params, &output);
    auto ms = std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::steady_clock::now() - t0).count();

    if (rc != 0) return reportFail(rc);  // <50 点等：库返回 -1/-2（边界样例依据）

    std::ostringstream o;
    o << "{\n  \"ok\": true,\n";
    o << "  \"file\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(file)))) << "\",\n";
    o << "  \"hint\": \"" << shapeTypeName(hint) << "\",\n";
    o << "  \"selected\": " << sel.size() << ",\n";
    o << "  \"elapsed_ms\": " << ms << ",\n";
    emitShapesJson(o, &output);
    o << "\n}\n";
    std::cout << o.str();

    if (!outDir.empty()) saveDetectOutput(outDir, &output, file);
    ransac_free_output(&output);
    return 0;
}

static int cmdSynth(int argc, char** argv) {
    std::string outFile;
    std::string scene = "plane-cylinder";
    for (int i = 0; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--scene" && i + 1 < argc) scene = argv[++i];
        else if (outFile.empty()) outFile = a;
    }
    if (outFile.empty() || scene != "plane-cylinder") {
        std::cerr << "synth: only --scene plane-cylinder is supported\n";
        return printUsage();
    }

    PointCloudT::Ptr cloud = std::make_shared<SimplePointCloud>();
    std::mt19937 rng(42);
    // 真值：平面 z=0（区域 0..0.6m）+ 圆柱（轴点 (0.35,0.35,0) 轴向 +Z，半径 0.05m）
    PointCloudGenerator::addPlane(cloud, 0.0f, 0.6f, 0.0f, 0.6f, 0.0f, 50000, 0.002f, rng);
    PointCloudGenerator::addCylinder(cloud, 0.35f, 0.35f, 0.0f, 0.2f, 0.05f, 15000, 0.002f, rng);
    {
        const fs::path parent = fs::path(outFile).parent_path();
        if (!parent.empty()) {
            std::error_code ec;
            fs::create_directories(parent, ec);
        }
    }
    if (!PointCloudGenerator::saveToPCD(cloud, outFile)) {
        std::cout << "{\"ok\": false, \"error\": \"failed to write PCD: " << jesc(outFile) << "\"}\n";
        return 2;
    }
    fs::path truth = fs::path(outFile).replace_extension(".truth.json");
    std::ofstream tf(truth, std::ios::binary);
    tf << "{\n"
       << "  \"scene\": \"plane-cylinder\",\n"
       << "  \"points\": " << cloud->size() << ",\n"
       << "  \"shapes\": [\n"
       << "    {\"id\": 0, \"type\": \"Plane\", \"coefficients\": [0, 0, 1, 0],\n"
       << "     \"note\": \"normal n, d: n.p + d = 0\"},\n"
       << "    {\"id\": 1, \"type\": \"Cylinder\", \"coefficients\": [0.35, 0.35, 0, 0, 0, 1, 0.05],\n"
       << "     \"note\": \"axis point px py pz, axis ax ay az, radius\"}\n"
       << "  ]\n"
       << "}\n";

    std::cout << "{\n  \"ok\": true,\n  \"file\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(outFile))))
              << "\",\n  \"truth_file\": \"" << jesc(pathToUtf8(fs::absolute(truth)))
              << "\",\n  \"points\": " << cloud->size() << ",\n  \"scene\": \"" << scene << "\"\n}\n";
    return 0;
}

// ---------- verify：结果 vs 真值 ----------

struct TruthShape {
    std::string type;
    std::vector<double> coeffs;
};

static double angleBetween(const double* a, const double* b) {
    double dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    double n = std::sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]) *
               std::sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
    if (n < 1e-12) return 0.0;
    double c = dot / n;
    if (c > 1) c = 1;
    if (c < -1) c = -1;
    return std::acos(std::fabs(c));  // 平面法向符号无关
}

static bool loadJsonFile(const std::string& path, Json& out, std::string& err) {
    std::string text;
    if (!readTextFile(fs::u8path(path), text)) {
        err = "cannot open file: " + path;
        return false;
    }
    JsonParser p(text);
    if (!p.parse(out)) {
        err = "invalid JSON: " + path;
        return false;
    }
    return true;
}

static int cmdVerify(int argc, char** argv) {
    std::string truthFile, resultFile;
    double tol = 0.005, angleTolDeg = 2.0;
    for (int i = 0; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--truth" && i + 1 < argc) truthFile = argv[++i];
        else if (a == "--result" && i + 1 < argc) resultFile = argv[++i];
        else if (a == "--tol" && i + 1 < argc) tol = std::atof(argv[++i]);
        else if (a == "--angle-deg" && i + 1 < argc) angleTolDeg = std::atof(argv[++i]);
    }
    if (truthFile.empty() || resultFile.empty()) return printUsage();

    Json truth, result;
    std::string err;
    if (!loadJsonFile(truthFile, truth, err) || !loadJsonFile(resultFile, result, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }
    const Json* truthShapes = truth.find("shapes");
    const Json* resultShapes = result.find("shapes");
    if (!truthShapes || truthShapes->type != Json::ARR || !resultShapes || resultShapes->type != Json::ARR) {
        std::cout << "{\"ok\": false, \"error\": \"missing shapes array in truth or result\"}\n";
        return 2;
    }

    bool allPass = true;
    std::ostringstream checks;
    int matchedTotal = 0;
    checks << std::fixed;
    for (size_t t = 0; t < truthShapes->arr.size(); ++t) {
        const Json& ts = truthShapes->arr[t];
        std::string tType = ts.find("type") && ts.find("type")->type == Json::STR ? ts.find("type")->str : "";
        std::vector<double> tc;
        const Json* tCoef = ts.find("coefficients");
        if (tCoef && tCoef->type == Json::ARR)
            for (const Json& v : tCoef->arr) tc.push_back(v.num);

        // 在结果中找参数误差最小的匹配；圆柱真值允许匹配圆锥结果
        // （qRANSAC_SD 把近圆柱检出为半角很小的锥，锥是圆柱的几何泛化）
        double bestParamErr = 1e30, bestAngleErr = 1e30;
        int bestId = -1;
        const char* matchKind = "exact";
        for (size_t r = 0; r < resultShapes->arr.size(); ++r) {
            const Json& rs = resultShapes->arr[r];
            const Json* rType = rs.find("type");
            if (!rType || rType->type != Json::STR) continue;
            std::string rTypeStr = rType->str;
            bool exact = (rTypeStr == tType);
            bool generalized = (tType == "Cylinder" && rTypeStr == "Cone");
            if (!exact && !generalized) continue;
            std::vector<double> rc;
            const Json* rCoef = rs.find("coefficients");
            if (!rCoef || rCoef->type != Json::ARR) continue;
            for (const Json& v : rCoef->arr) rc.push_back(v.num);
            if (rc.size() != tc.size()) continue;

            double paramErr = 0, angleErr = 0;
            if (tType == "Plane") {
                // |d 差| 与法向夹角
                paramErr = std::fabs(rc[3] - tc[3]);
                angleErr = angleBetween(rc.data(), tc.data());
            } else if (tType == "Cylinder" && generalized) {
                // 真值 CYLINDER[px,py,pz,ax,ay,az,r] vs 结果 CONE[apex,ax,halfAngle]：
                // 在真值轴点高度处取锥的等效半径 d·tan(θ)，并检查轴点对锥轴的横向偏移
                double w[3] = {tc[0] - rc[0], tc[1] - rc[1], tc[2] - rc[2]};
                double un = std::sqrt(rc[3] * rc[3] + rc[4] * rc[4] + rc[5] * rc[5]);
                if (un < 1e-12) continue;
                double d = std::fabs(w[0] * rc[3] + w[1] * rc[4] + w[2] * rc[5]) / un;
                double rEq = d * std::tan(rc[6]);
                double along[3] = {rc[3] / un * d, rc[4] / un * d, rc[5] / un * d};
                double perp[3] = {w[0] - along[0], w[1] - along[1], w[2] - along[2]};
                double perpErr = std::sqrt(perp[0] * perp[0] + perp[1] * perp[1] + perp[2] * perp[2]);
                paramErr = std::max(std::fabs(rEq - tc[6]), perpErr);
                angleErr = angleBetween(rc.data() + 3, tc.data() + 3);
            } else if (tType == "Cylinder") {
                paramErr = std::fabs(rc[6] - tc[6]);                              // 半径差
                angleErr = angleBetween(rc.data() + 3, tc.data() + 3);            // 轴向夹角
                double cd = 0;
                for (int a = 0; a < 3; ++a) cd = std::max(cd, std::fabs(rc[a] - tc[a]));
                paramErr = std::max(paramErr, cd);
            } else if (tType == "Sphere") {
                paramErr = std::fabs(rc[3] - tc[3]);
                double cd = 0;
                for (int a = 0; a < 3; ++a) cd = std::max(cd, std::fabs(rc[a] - tc[a]));
                paramErr = std::max(paramErr, cd);
            } else {
                paramErr = 0;
                for (size_t a = 0; a < tc.size(); ++a) paramErr = std::max(paramErr, std::fabs(rc[a] - tc[a]));
            }
            if (paramErr < bestParamErr) {
                bestParamErr = paramErr;
                bestAngleErr = angleErr;
                bestId = static_cast<int>(r);
                matchKind = exact ? "exact" : "generalized";
            }
        }
        bool pass = bestId >= 0 && bestParamErr <= tol &&
                    bestAngleErr * 180.0 / 3.14159265358979 <= angleTolDeg;
        if (!pass) allPass = false;
        else ++matchedTotal;
        checks << "    {\"truth_id\": " << t << ", \"type\": \"" << tType
               << "\", \"matched_shape\": " << bestId
               << ", \"match\": \"" << (bestId >= 0 ? matchKind : "none") << "\""
               << ", \"param_error\": " << jnum(bestParamErr)
               << ", \"angle_error_deg\": " << jnum(bestAngleErr * 180.0 / 3.14159265358979)
               << ", \"pass\": " << (pass ? "true" : "false") << "}"
               << (t + 1 < truthShapes->arr.size() ? "," : "") << "\n";
    }

    std::ostringstream o;
    o << "{\n  \"ok\": true,\n  \"pass\": " << (allPass ? "true" : "false") << ",\n";
    o << "  \"matched\": " << matchedTotal << ", \"total\": " << truthShapes->arr.size() << ",\n";
    o << "  \"tolerance\": " << jnum(tol) << ", \"angle_tolerance_deg\": " << jnum(angleTolDeg) << ",\n";
    o << "  \"checks\": [\n" << checks.str() << "  ]\n}\n";
    std::cout << o.str();
    return allPass ? 0 : 2;
}

// ---------- cad：把检测结果生成为可执行的 CadQuery 代码（点云 → 可编辑 CAD 模型） ----------

struct Vec3 {
    double x = 0, y = 0, z = 0;
    double norm() const { return std::sqrt(x * x + y * y + z * z); }
    Vec3 normalized() const {
        double n = norm();
        return n < 1e-12 ? Vec3{} : Vec3{x / n, y / n, z / n};
    }
};
static Vec3 cross(const Vec3& a, const Vec3& b) {
    return Vec3{a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x};
}
static double dot3(const Vec3& a, const Vec3& b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
static Vec3 sub(const Vec3& a, const Vec3& b) { return Vec3{a.x - b.x, a.y - b.y, a.z - b.z}; }
static Vec3 add(const Vec3& a, const Vec3& b) { return Vec3{a.x + b.x, a.y + b.y, a.z + b.z}; }
static Vec3 scale(const Vec3& a, double s) { return Vec3{a.x * s, a.y * s, a.z * s}; }

// 与 n 正交的一个单位向量（取最不对齐的坐标轴做叉积，保证数值稳定）
static Vec3 anyPerpendicular(const Vec3& n) {
    Vec3 axis = (std::fabs(n.x) < std::fabs(n.y) && std::fabs(n.x) < std::fabs(n.z)) ? Vec3{1, 0, 0}
              : (std::fabs(n.y) <= std::fabs(n.z))                                  ? Vec3{0, 1, 0}
                                                                                    : Vec3{0, 0, 1};
    return cross(n, axis).normalized();
}

static std::vector<int> loadIndices(const fs::path& p) {
    std::vector<int> v;
    std::ifstream f(p, std::ios::binary);
    std::string line;
    while (std::getline(f, line)) {
        if (!line.empty() && line[0] == '#') continue;
        if (line.find_first_not_of(" \t\r") == std::string::npos) continue;
        v.push_back(std::atoi(line.c_str()));
    }
    return v;
}

static std::string v3(double x, double y, double z) {
    std::ostringstream o;
    o << "(" << jnum(x) << ", " << jnum(y) << ", " << jnum(z) << ")";
    return o.str();
}

// 内点沿单位轴 u 的投影范围 [tmin, tmax]；返回 false 表示内点过少
static bool projectRange(const PointCloudT& cloud, const std::vector<int>& idx, const Vec3& origin, const Vec3& u,
                         double& tmin, double& tmax) {
    bool first = true;
    tmin = tmax = 0;
    int used = 0;
    for (int i : idx) {
        if (i < 0 || i >= static_cast<int>(cloud.size())) continue;
        Vec3 p{cloud.points[i].x, cloud.points[i].y, cloud.points[i].z};
        double t = dot3(sub(p, origin), u);
        if (first) { tmin = tmax = t; first = false; }
        if (t < tmin) tmin = t;
        if (t > tmax) tmax = t;
        ++used;
    }
    return used >= 4;
}

// Andrew monotone chain 二维凸包，返回逆时针顶点序列
static std::vector<std::pair<double, double>> convexHull2D(std::vector<std::pair<double, double>> pts) {
    std::sort(pts.begin(), pts.end());
    pts.erase(std::unique(pts.begin(), pts.end()), pts.end());
    int n = (int)pts.size();
    if (n < 3) return pts;
    auto cross = [](const std::pair<double, double>& O, const std::pair<double, double>& A,
                    const std::pair<double, double>& B) {
        return (A.first - O.first) * (B.second - O.second) - (A.second - O.second) * (B.first - O.first);
    };
    std::vector<std::pair<double, double>> h(2 * n);
    int k = 0;
    for (int i = 0; i < n; ++i) {
        while (k >= 2 && cross(h[k - 2], h[k - 1], pts[i]) <= 0) --k;
        h[k++] = pts[i];
    }
    for (int i = n - 2, t = k + 1; i >= 0; --i) {
        while (k >= t && cross(h[k - 2], h[k - 1], pts[i]) <= 0) --k;
        h[k++] = pts[i];
    }
    h.resize(k - 1);
    return h;
}

static double polygonArea(const std::vector<std::pair<double, double>>& poly) {
    double a = 0;
    for (size_t i = 0; i < poly.size(); ++i) {
        const auto& p = poly[i];
        const auto& q = poly[(i + 1) % poly.size()];
        a += p.first * q.second - q.first * p.second;
    }
    return std::abs(a) / 2;
}

static int cmdCad(int argc, char** argv) {
    std::string file, resultFile, outPy, outStep, idsArg;
    bool fuse = false, hullMode = false;
    int minInlier = 200;
    std::set<int> wantIds;
    for (int i = 0; i < argc; ++i) {
        std::string a = argv[i];
        if (a == "--result" && i + 1 < argc) resultFile = argv[++i];
        else if (a == "--out" && i + 1 < argc) outPy = argv[++i];
        else if (a == "--step" && i + 1 < argc) outStep = argv[++i];
        else if (a == "--min-inlier" && i + 1 < argc) minInlier = std::atoi(argv[++i]);
        else if (a == "--ids" && i + 1 < argc) idsArg = argv[++i];
        else if (a == "--hull") hullMode = true;
        else if (a == "--union") fuse = true;
        else if (file.empty()) file = a;
    }
    if (!idsArg.empty()) {
        for (size_t p = 0; ; ) {
            size_t c = idsArg.find(',', p);
            std::string tok = idsArg.substr(p, c == std::string::npos ? std::string::npos : c - p);
            if (!tok.empty()) wantIds.insert(std::atoi(tok.c_str()));
            if (c == std::string::npos) break;
            p = c + 1;
        }
    }
    if (file.empty() || resultFile.empty() || outPy.empty()) {
        std::cerr << "Usage: cloudforge-cli cad <cloud> --result DIR/result.json --out model.py [--step model.step] [--ids 0,2,3] [--hull] [--union]\n";
        return 1;
    }

    PointCloudT::Ptr cloud;
    std::string err;
    if (!loadCloudOrReport(file, cloud, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }
    Json result;
    if (!loadJsonFile(resultFile, result, err)) {
        std::cout << "{\"ok\": false, \"error\": \"" << jesc(err) << "\"}\n";
        return 2;
    }
    const Json* shapes = result.find("shapes");
    if (!shapes || shapes->type != Json::ARR || shapes->arr.empty()) {
        std::cout << "{\"ok\": false, \"error\": \"no shapes in result\"}\n";
        return 2;
    }

    fs::path resultDir = fs::path(resultFile).parent_path();
    fs::path base = fs::path(outPy).replace_extension("");
    if (outStep.empty()) outStep = base.string() + ".step";
    {
        fs::path parent = fs::path(outPy).parent_path();
        if (!parent.empty()) {
            std::error_code ec;
            fs::create_directories(parent, ec);
        }
    }

    std::ostringstream py;
    py << "# Auto-generated by cloudforge-cli (YunZhu / Cloud Casting) — executable CadQuery model\n";
    py << "# Source detection: " << pathToUtf8(fs::absolute(fs::u8path(resultFile))) << "\n";
    py << "# Coordinate system: identical to the input point cloud (TXT/STL inputs are centroid-centered).\n";
    py << "# Requirements: pip install cadquery   ->   python " << pathToUtf8(fs::u8path(outPy)) << "\n";
    py << "import cadquery as cq\n\n";
    py << "solids = []\n";

    int exported = 0, skipped = 0;
    std::ostringstream skippedNotes;
    for (size_t s = 0; s < shapes->arr.size(); ++s) {
        const Json& sh = shapes->arr[s];
        if (!wantIds.empty() && !wantIds.count(static_cast<int>(s))) continue;
        std::string type = sh.find("type") && sh.find("type")->type == Json::STR ? sh.find("type")->str : "";
        const Json* coef = sh.find("coefficients");
        if (!coef || coef->type != Json::ARR) continue;
        std::vector<double> c;
        for (const Json& v : coef->arr) c.push_back(v.num);
        if (sh.getNum("inlier_count") < minInlier) {
            ++skipped;
            skippedNotes << type << "#" << s << ": inliers<" << minInlier << "\n";
            continue;
        }
        std::vector<int> idx = loadIndices(resultDir / "indices" / ("shape_" + std::to_string(s) + ".txt"));

        double rmse = sh.getNum("rmse");
        if (type == "Plane" && c.size() == 4) {
            Vec3 n{c[0], c[1], c[2]};
            n = n.normalized();
            Vec3 u = anyPerpendicular(n);
            Vec3 v = cross(n, u);
            // 内点投影到平面局部 2D 基求包围
            bool first = true;
            double umin = 0, umax = 0, vmin = 0, vmax = 0;
            int used = 0;
            Vec3 o = scale(n, -c[3]);
            if (hullMode) {
                // 凸包轮廓拉伸：每面按内点在平面内的真实分布裁切，避免矩形板相互穿透
                std::vector<std::pair<double, double>> uv;
                for (int i : idx) {
                    if (i < 0 || i >= static_cast<int>(cloud->size())) continue;
                    Vec3 p{cloud->points[i].x, cloud->points[i].y, cloud->points[i].z};
                    Vec3 d = sub(p, o);
                    uv.push_back({dot3(d, u), dot3(d, v)});
                }
                if ((int)uv.size() < 4) { ++skipped; skippedNotes << "Plane#" << s << ":<4 inliers\n"; continue; }
                auto hull = convexHull2D(std::move(uv));
                double area = polygonArea(hull);
                if ((int)hull.size() < 3 || area < 0.02) {
                    ++skipped; skippedNotes << "Plane#" << s << ": hull degenerate\n"; continue;
                }
                double t = std::max(0.005, 2.0 * rmse);
                Vec3 origin2 = add(o, scale(n, -t / 2));   // 拉伸沿 +n，下移半厚使板以平面对称
                py << "# shape " << s << ": Plane (hull, " << hull.size() << " vtx, area=" << jnum(area) << "), rmse=" << jnum(rmse) << "\n";
                py << "solids.append(cq.Workplane(cq.Plane(origin=" << v3(origin2.x, origin2.y, origin2.z)
                   << ", xDir=" << v3(u.x, u.y, u.z) << ", normal=" << v3(n.x, n.y, n.z)
                   << ")).polyline([";
                for (size_t hi = 0; hi < hull.size(); ++hi)
                    py << (hi ? ", " : "") << "(" << jnum(hull[hi].first) << ", " << jnum(hull[hi].second) << ")";
                py << "]).close().extrude(" << jnum(t) << "))\n\n";
                ++exported;
                continue;
            }
            for (int i : idx) {
                if (i < 0 || i >= static_cast<int>(cloud->size())) continue;
                Vec3 p{cloud->points[i].x, cloud->points[i].y, cloud->points[i].z};
                Vec3 d = sub(p, o);
                double a = dot3(d, u), b = dot3(d, v);
                if (first) { umin = umax = a; vmin = vmax = b; first = false; }
                if (a < umin) umin = a;
                if (a > umax) umax = a;
                if (b < vmin) vmin = b;
                if (b > vmax) vmax = b;
                ++used;
            }
            if (used < 4) { ++skipped; skippedNotes << "Plane#" << s << ":<4 inliers\n"; continue; }
            Vec3 center = add(add(o, scale(u, (umin + umax) / 2)), scale(v, (vmin + vmax) / 2));
            double du = std::max(umax - umin, 1e-4), dv = std::max(vmax - vmin, 1e-4);
            double t = std::max(0.005, 2.0 * rmse);
            Vec3 base3 = add(center, scale(n, t / 2));
            py << "# shape " << s << ": Plane, " << used << " inliers, rmse=" << jnum(rmse) << "\n";
            py << "solids.append(cq.Workplane(cq.Plane(origin=" << v3(base3.x, base3.y, base3.z)
               << ", xDir=" << v3(u.x, u.y, u.z) << ", normal=" << v3(n.x, n.y, n.z)
               << ")).box(" << jnum(du) << ", " << jnum(dv) << ", " << jnum(t) << "))\n\n";
            ++exported;
        } else if (type == "Cylinder" && c.size() == 7) {
            Vec3 ax{c[3], c[4], c[5]};
            ax = ax.normalized();
            Vec3 o{c[0], c[1], c[2]};
            double tmin, tmax;
            if (!projectRange(*cloud, idx, o, ax, tmin, tmax)) { ++skipped; continue; }
            if (tmax - tmin < 1e-4) tmax = tmin + 1e-4;
            Vec3 start = add(o, scale(ax, tmin));
            py << "# shape " << s << ": Cylinder r=" << jnum(c[6]) << ", h=" << jnum(tmax - tmin) << "\n";
            py << "solids.append(cq.Workplane(cq.Plane(origin=" << v3(start.x, start.y, start.z)
               << ", normal=" << v3(ax.x, ax.y, ax.z)
               << ")).circle(" << jnum(c[6]) << ").extrude(" << jnum(tmax - tmin) << "))\n\n";
            ++exported;
        } else if (type == "Sphere" && c.size() == 4) {
            py << "# shape " << s << ": Sphere r=" << jnum(c[3]) << "\n";
            py << "solids.append(cq.Workplane(\"XY\").sphere(" << jnum(c[3]) << ").translate("
               << v3(c[0], c[1], c[2]) << "))\n\n";
            ++exported;
        } else if (type == "Cone" && c.size() == 7) {
            Vec3 ax{c[3], c[4], c[5]};
            ax = ax.normalized();
            Vec3 apex{c[0], c[1], c[2]};
            double tmin, tmax;
            if (!projectRange(*cloud, idx, apex, ax, tmin, tmax)) { ++skipped; continue; }
            double k = std::tan(c[6]);
            double r1 = std::max(tmin * k, 1e-4), r2 = std::max(tmax * k, 1e-4), h = tmax - tmin;
            if (h < 1e-4) { ++skipped; continue; }
            Vec3 start = add(apex, scale(ax, tmin));
            py << "# shape " << s << ": Cone (truncated) r1=" << jnum(r1) << " r2=" << jnum(r2) << " h=" << jnum(h) << "\n";
            py << "solids.append(cq.Workplane(cq.Plane(origin=" << v3(start.x, start.y, start.z)
               << ", normal=" << v3(ax.x, ax.y, ax.z)
               << ")).circle(" << jnum(r1) << ").workplane(offset=" << jnum(h)
               << ").circle(" << jnum(r2) << ").loft(combine=False))\n\n";
            ++exported;
        } else {
            ++skipped;
            skippedNotes << type << "#" << s << ": unsupported for CAD export\n";
        }
    }

    if (fuse) {
        // 统一转 Shape 后多参一次布尔融合（OCC BOP），避免逐实体链式 fuse 的 O(n²) 超时
        py << "shapes = [s.val() for s in solids]\n";
        py << "model = shapes[0].fuse(*shapes[1:]) if len(shapes) > 1 else shapes[0]\n";
    } else {
        py << "model = cq.Compound.makeCompound([s.val() for s in solids]) if solids else cq.Workplane(\"XY\")\n";
    }
    py << "import os\n";
    py << "_step = r\"" << pathToUtf8(fs::absolute(fs::u8path(outStep))) << "\"\n";
    py << "os.makedirs(os.path.dirname(_step) or '.', exist_ok=True)\n";
    py << "cq.exporters.export(model, _step)\n";
    py << "bb = (model.val() if isinstance(model, cq.Workplane) else model).BoundingBox()\n";
    py << "print('CAD model OK: solids=%d bbox=%.3f x %.3f x %.3f' % (len(solids), bb.xlen, bb.ylen, bb.zlen))\n";
    py << "print('STEP ' + ('written: ' + _step if os.path.exists(_step) else 'MISSING'))\n";

    {
        std::ofstream f(fs::u8path(outPy), std::ios::binary);
        f << py.str();
    }

    std::ostringstream o;
    o << "{\n  \"ok\": true,\n  \"exported\": " << exported << ", \"skipped\": " << skipped << ",\n";
    if (!skippedNotes.str().empty()) o << "  \"skipped_notes\": \"" << jesc(skippedNotes.str()) << "\",\n";
    o << "  \"out_py\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(outPy)))) << "\",\n";
    o << "  \"step_target\": \"" << jesc(pathToUtf8(fs::absolute(fs::u8path(outStep)))) << "\",\n";
    o << "  \"usage\": \"python " << jesc(pathToUtf8(fs::u8path(outPy))) << "  (requires: pip install cadquery)\"\n";
    o << "}\n";
    std::cout << o.str();
    return exported > 0 ? 0 : 2;
}


int main(int argc, char** argv) {
#ifdef _WIN32
    SetConsoleOutputCP(CP_UTF8);
#endif
    if (argc < 2) return printUsage();
    std::string cmd = argv[1];
    if (cmd == "info") return argc >= 3 ? cmdInfo(argv[2]) : printUsage();
    if (cmd == "detect") return cmdDetect(argc - 2, argv + 2);
    if (cmd == "refine") return cmdRefine(argc - 2, argv + 2);
    if (cmd == "synth") return cmdSynth(argc - 2, argv + 2);
    if (cmd == "verify") return cmdVerify(argc - 2, argv + 2);
    if (cmd == "cad") return cmdCad(argc - 2, argv + 2);
    return printUsage();
}
