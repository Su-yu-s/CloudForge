#include "point_cloud_io.h"

#include <algorithm>
#include <cctype>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <fstream>
#include <sstream>
#include <string>
#include <vector>

namespace {

std::string trim(const std::string& s) {
    size_t b = 0;
    while (b < s.size() && std::isspace(static_cast<unsigned char>(s[b]))) {
        ++b;
    }
    size_t e = s.size();
    while (e > b && std::isspace(static_cast<unsigned char>(s[e - 1]))) {
        --e;
    }
    return s.substr(b, e - b);
}

bool parseHeaderLine(const std::string& line, std::string& key, std::string& value) {
    const auto pos = line.find(' ');
    if (pos == std::string::npos) {
        return false;
    }
    key = trim(line.substr(0, pos));
    value = trim(line.substr(pos + 1));
    return true;
}

std::vector<std::string> splitWords(const std::string& value) {
    std::istringstream input(value);
    std::vector<std::string> result;
    std::string word;
    while (input >> word) result.push_back(word);
    return result;
}

double readLittleEndianScalar(const char* data, char type, int size) {
    if (type == 'F' && size == 4) {
        float value = 0.f;
        std::memcpy(&value, data, sizeof(value));
        return value;
    }
    if (type == 'F' && size == 8) {
        double value = 0.0;
        std::memcpy(&value, data, sizeof(value));
        return value;
    }
    if (type == 'I') {
        if (size == 1) return *reinterpret_cast<const int8_t*>(data);
        if (size == 2) { int16_t v; std::memcpy(&v, data, 2); return v; }
        if (size == 4) { int32_t v; std::memcpy(&v, data, 4); return v; }
    }
    if (type == 'U') {
        if (size == 1) return *reinterpret_cast<const uint8_t*>(data);
        if (size == 2) { uint16_t v; std::memcpy(&v, data, 2); return v; }
        if (size == 4) { uint32_t v; std::memcpy(&v, data, 4); return v; }
    }
    return 0.0;
}

struct PlyProperty {
    std::string name;
    char type = 0;
    int size = 0;
    int offset = 0;
};

bool decodePlyType(const std::string& type, char& category, int& size) {
    if (type == "char" || type == "int8") { category = 'I'; size = 1; return true; }
    if (type == "uchar" || type == "uint8") { category = 'U'; size = 1; return true; }
    if (type == "short" || type == "int16") { category = 'I'; size = 2; return true; }
    if (type == "ushort" || type == "uint16") { category = 'U'; size = 2; return true; }
    if (type == "int" || type == "int32") { category = 'I'; size = 4; return true; }
    if (type == "uint" || type == "uint32") { category = 'U'; size = 4; return true; }
    if (type == "float" || type == "float32") { category = 'F'; size = 4; return true; }
    if (type == "double" || type == "float64") { category = 'F'; size = 8; return true; }
    return false;
}

} // namespace

namespace PointCloudIO {

bool savePCDBinary(const PointCloudT::Ptr& cloud, const std::string& path) {
    if (!cloud) {
        return false;
    }
    FILE* fp = fopen(path.c_str(), "wb");
    if (!fp) {
        return false;
    }

    const size_t n = cloud->points.size();
    fprintf(fp, "# .PCD v0.7 - Point Cloud Data file format\n");
    fprintf(fp, "VERSION 0.7\n");
    fprintf(fp, "FIELDS x y z\n");
    fprintf(fp, "SIZE 4 4 4\n");
    fprintf(fp, "TYPE F F F\n");
    fprintf(fp, "COUNT 1 1 1\n");
    fprintf(fp, "WIDTH %zu\n", n);
    fprintf(fp, "HEIGHT 1\n");
    fprintf(fp, "VIEWPOINT 0 0 0 1 0 0 0\n");
    fprintf(fp, "POINTS %zu\n", n);
    fprintf(fp, "DATA binary\n");

    for (const auto& p : cloud->points) {
        fwrite(&p.x, sizeof(float), 1, fp);
        fwrite(&p.y, sizeof(float), 1, fp);
        fwrite(&p.z, sizeof(float), 1, fp);
    }

    fclose(fp);
    return true;
}

bool loadPCD(const std::string& path, PointCloudT::Ptr& cloud) {
    std::ifstream in(path, std::ios::binary);
    if (!in) {
        return false;
    }

    std::string line;
    size_t points = 0;
    std::vector<std::string> fields;
    std::vector<int> sizes;
    std::vector<char> types;
    std::vector<int> counts;
    std::string dataEncoding;
    std::streampos dataPos = 0;

    while (std::getline(in, line)) {
        if (line.empty() || line[0] == '#') {
            continue;
        }
        std::string key;
        std::string value;
        if (!parseHeaderLine(line, key, value)) {
            continue;
        }
        if (key == "FIELDS" || key == "FIELD") {
            fields = splitWords(value);
        } else if (key == "SIZE") {
            for (const auto& word : splitWords(value)) sizes.push_back(std::stoi(word));
        } else if (key == "TYPE") {
            for (const auto& word : splitWords(value)) types.push_back(word.empty() ? 0 : word[0]);
        } else if (key == "COUNT") {
            for (const auto& word : splitWords(value)) counts.push_back(std::stoi(word));
        } else if (key == "POINTS") {
            points = static_cast<size_t>(std::stoul(value));
        } else if (key == "DATA") {
            dataEncoding = value;
            dataPos = in.tellg();
            break;
        }
    }

    if (points == 0 || fields.empty() || sizes.size() != fields.size()
        || types.size() != fields.size()) {
        return false;
    }
    if (counts.empty()) counts.assign(fields.size(), 1);
    if (counts.size() != fields.size() || dataEncoding == "binary_compressed") return false;

    int recordSize = 0;
    int tokenOffset = 0;
    int xOffset = -1, yOffset = -1, zOffset = -1;
    int xToken = -1, yToken = -1, zToken = -1;
    size_t xField = 0, yField = 0, zField = 0;
    for (size_t i = 0; i < fields.size(); ++i) {
        if (fields[i] == "x") { xOffset = recordSize; xToken = tokenOffset; xField = i; }
        if (fields[i] == "y") { yOffset = recordSize; yToken = tokenOffset; yField = i; }
        if (fields[i] == "z") { zOffset = recordSize; zToken = tokenOffset; zField = i; }
        recordSize += sizes[i] * counts[i];
        tokenOffset += counts[i];
    }
    if (xOffset < 0 || yOffset < 0 || zOffset < 0 || recordSize <= 0) return false;

    cloud = PointCloudT::Ptr(new SimplePointCloud);
    cloud->points.reserve(points);

    if (dataEncoding == "binary") {
        in.seekg(dataPos);
        std::vector<char> record(static_cast<size_t>(recordSize));
        for (size_t i = 0; i < points; ++i) {
            in.read(record.data(), recordSize);
            if (!in) break;
            Point3f p(
                static_cast<float>(readLittleEndianScalar(record.data() + xOffset, types[xField], sizes[xField])),
                static_cast<float>(readLittleEndianScalar(record.data() + yOffset, types[yField], sizes[yField])),
                static_cast<float>(readLittleEndianScalar(record.data() + zOffset, types[zField], sizes[zField])));
            if (std::isfinite(p.x) && std::isfinite(p.y) && std::isfinite(p.z)) cloud->points.push_back(p);
        }
    } else if (dataEncoding == "ascii") {
        while (std::getline(in, line) && cloud->points.size() < points) {
            if (line.empty()) {
                continue;
            }
            std::istringstream row(line);
            std::vector<double> values;
            double value = 0.0;
            while (row >> value) values.push_back(value);
            if (static_cast<int>(values.size()) <= std::max({xToken, yToken, zToken})) continue;
            Point3f p(static_cast<float>(values[static_cast<size_t>(xToken)]),
                      static_cast<float>(values[static_cast<size_t>(yToken)]),
                      static_cast<float>(values[static_cast<size_t>(zToken)]));
            if (std::isfinite(p.x) && std::isfinite(p.y) && std::isfinite(p.z)) cloud->points.push_back(p);
        }
    } else {
        return false;
    }

    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return !cloud->points.empty();
}

bool loadPLY(const std::string& path, PointCloudT::Ptr& cloud) {
    std::ifstream in(path, std::ios::binary);
    if (!in) {
        return false;
    }

    std::string line;
    if (!std::getline(in, line) || trim(line) != "ply") {
        return false;
    }

    enum class Format { Unknown, Ascii, BinaryLittleEndian } format = Format::Unknown;
    size_t vertexCount = 0;
    bool inVertexElement = false;
    int recordSize = 0;
    std::vector<PlyProperty> props;

    while (std::getline(in, line)) {
        line = trim(line);
        if (line.rfind("format ", 0) == 0) {
            if (line.find("ascii") != std::string::npos) format = Format::Ascii;
            else if (line.find("binary_little_endian") != std::string::npos) format = Format::BinaryLittleEndian;
        } else if (line.rfind("element vertex ", 0) == 0) {
            vertexCount = static_cast<size_t>(std::stoul(line.substr(15)));
            inVertexElement = true;
        } else if (line.rfind("element ", 0) == 0) {
            inVertexElement = false;
        } else if (line.rfind("property ", 0) == 0 && inVertexElement) {
            const auto words = splitWords(line);
            if (words.size() != 3 || words[1] == "list") return false;
            PlyProperty property;
            property.name = words[2];
            property.offset = recordSize;
            if (!decodePlyType(words[1], property.type, property.size)) return false;
            recordSize += property.size;
            props.push_back(property);
        } else if (line == "end_header") {
            break;
        }
    }
    if (vertexCount == 0 || format == Format::Unknown || recordSize <= 0) {
        return false;
    }

    int ix = -1, iy = -1, iz = -1;
    for (size_t i = 0; i < props.size(); ++i) {
        if (props[i].name == "x") ix = static_cast<int>(i);
        else if (props[i].name == "y") iy = static_cast<int>(i);
        else if (props[i].name == "z") iz = static_cast<int>(i);
    }
    if (ix < 0 || iy < 0 || iz < 0) {
        return false;
    }

    cloud = PointCloudT::Ptr(new SimplePointCloud);
    cloud->points.reserve(vertexCount);

    if (format == Format::Ascii) {
        for (size_t i = 0; i < vertexCount; ++i) {
            if (!std::getline(in, line)) {
                break;
            }
            std::istringstream iss(line);
            std::vector<double> vals;
            double v = 0.0;
            while (iss >> v) {
                vals.push_back(v);
            }
            if (static_cast<int>(vals.size()) <= std::max({ix, iy, iz})) {
                continue;
            }
            Point3f p;
            p.x = static_cast<float>(vals[static_cast<size_t>(ix)]);
            p.y = static_cast<float>(vals[static_cast<size_t>(iy)]);
            p.z = static_cast<float>(vals[static_cast<size_t>(iz)]);
            cloud->points.push_back(p);
        }
    } else {
        std::vector<char> record(static_cast<size_t>(recordSize));
        for (size_t i = 0; i < vertexCount; ++i) {
            in.read(record.data(), recordSize);
            if (!in) break;
            const auto& x = props[static_cast<size_t>(ix)];
            const auto& y = props[static_cast<size_t>(iy)];
            const auto& z = props[static_cast<size_t>(iz)];
            Point3f p(
                static_cast<float>(readLittleEndianScalar(record.data() + x.offset, x.type, x.size)),
                static_cast<float>(readLittleEndianScalar(record.data() + y.offset, y.type, y.size)),
                static_cast<float>(readLittleEndianScalar(record.data() + z.offset, z.type, z.size)));
            if (std::isfinite(p.x) && std::isfinite(p.y) && std::isfinite(p.z)) cloud->points.push_back(p);
        }
    }

    cloud->width = static_cast<uint32_t>(cloud->points.size());
    cloud->height = 1;
    cloud->is_dense = false;
    return !cloud->points.empty();
}

} // namespace PointCloudIO
