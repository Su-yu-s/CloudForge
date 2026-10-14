# 房间骨架重建：竖直墙水平投影凸包，从地面拉伸到顶棚，并加地板/顶棚。
# 兼容旧用法：python room-skeleton.py result.json [cloud.ply] out.step [min_inlier]
# 同一个模型同时写出 STEP 和 STL；可由后端传标准 XYZ binary_little_endian PLY，点序不得改变。
import argparse
import contextlib
import importlib.util
import json
import math
from pathlib import Path
import sys


def load_exporter():
    spec = importlib.util.spec_from_file_location("cloudforge_cad_preview", Path(__file__).with_name("cad-preview.py"))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def read_ply_xyz(path):
    import numpy as np

    data = Path(path).read_bytes()
    end = data.find(b"end_header")
    offset = data.find(b"\n", end) + 1 if end >= 0 else 0
    if not offset or end > 256 * 1024:
        raise ValueError("点云不是有效 PLY；请传入保持原点序的标准 XYZ PLY")
    header = data[:end].decode("ascii", errors="strict").splitlines()
    if not header or header[0].strip() != "ply":
        raise ValueError("房间重建需要 binary_little_endian PLY")
    scalar = {"float": "<f4", "float32": "<f4", "double": "<f8", "float64": "<f8",
              "char": "i1", "int8": "i1", "uchar": "u1", "uint8": "u1",
              "short": "<i2", "int16": "<i2", "ushort": "<u2", "uint16": "<u2",
              "int": "<i4", "int32": "<i4", "uint": "<u4", "uint32": "<u4"}
    count, fields, current = None, [], None
    elements = []
    little_endian = False
    for line in header[1:]:
        items = line.strip().split()
        if not items:
            continue
        if items[0] == "format":
            little_endian = len(items) >= 3 and items[1] == "binary_little_endian" and items[2] == "1.0"
        elif items[0] == "element":
            current = items[1]
            elements.append(current)
            if current == "vertex":
                count = int(items[2])
        elif items[0] == "property" and current == "vertex":
            if len(items) != 3 or items[1] not in scalar:
                raise ValueError("PLY 顶点属性不受支持，请使用标准 XYZ PLY")
            fields.append((items[2], scalar[items[1]]))
    if not little_endian or not elements or elements[0] != "vertex" or not count or count <= 0:
        raise ValueError("房间重建需要顶点位于首段的 binary_little_endian PLY")
    names = [name for name, _ in fields]
    if len(names) != len(set(names)) or not all(axis in names for axis in ("x", "y", "z")):
        raise ValueError("PLY 缺少唯一的 x/y/z 顶点属性")
    dtype = np.dtype(fields)
    if len(data) - offset < count * dtype.itemsize:
        raise ValueError("PLY 顶点数据不完整")
    rows = np.frombuffer(data, dtype=dtype, count=count, offset=offset)
    xyz = np.column_stack((rows["x"], rows["y"], rows["z"])).astype(np.float64)
    if not np.isfinite(xyz).all():
        raise ValueError("源点云包含非有限坐标，请清理点云后重新检测")
    return xyz


def rebuild(result_path, cloud_path, min_inlier):
    import numpy as np
    from scipy.spatial import ConvexHull, QhullError
    import cadquery as cq

    with Path(result_path).open(encoding="utf-8-sig") as fh:
        detection = json.load(fh)
    source = cloud_path or detection.get("source_cloud")
    if not source or not Path(source).is_file():
        raise ValueError("未提供可读取的源点云；检测结果中也没有 source_cloud")
    cloud = read_ply_xyz(source)
    span = float(np.ptp(cloud, axis=0).max())
    if not math.isfinite(span) or span <= 0:
        raise ValueError("源点云尺寸为空")
    walls, horizontals = [], []
    for shape in detection.get("shapes", []):
        if shape.get("type") != "Plane" or shape.get("inlier_count", 0) < min_inlier:
            continue
        coefficients = shape.get("coefficients", [])
        if len(coefficients) != 4 or any(not math.isfinite(float(v)) for v in coefficients):
            raise ValueError("检测平面包含无效系数")
        nx, ny, nz, _ = map(float, coefficients)
        length = math.sqrt(nx*nx + ny*ny + nz*nz)
        if length <= 1e-12:
            raise ValueError("检测平面法向量无效")
        sid = int(shape["id"])
        index_path = Path(result_path).parent / "indices" / ("shape_%d.txt" % sid)
        indices = [int(v) for v in index_path.read_text(encoding="utf-8").split()]
        if any(index < 0 or index >= len(cloud) for index in indices):
            raise ValueError("检测内点索引超出源点云范围，请使用同一份点云")
        if len(indices) < 3:
            continue
        points = cloud[indices]
        try:
            hull = points[ConvexHull(points[:, :2]).vertices, :2]
        except QhullError:
            continue
        if abs(nz / length) < 0.5:
            walls.append((sid, hull, points))
        else:
            horizontals.append((sid, float(points[:, 2].mean()), hull, points))
    if len(horizontals) < 2:
        raise ValueError("未检出独立地板与顶棚，当前结果不适合房间骨架路线")
    if not walls:
        raise ValueError("未检出有效竖直墙，当前结果不适合房间骨架路线")
    horizontals.sort(key=lambda item: item[1])
    floor, ceiling = horizontals[0], horizontals[-1]
    z0, z1 = float(floor[3][:, 2].min()), float(ceiling[3][:, 2].max())
    if z1 - z0 <= 1e-6 or z1 - z0 > span * 1.5:
        raise ValueError("地板与顶棚的高度异常，无法生成房间骨架")
    print("source cloud:", source)
    print("floor z=%.3f (id=%d), ceil z=%.3f (id=%d), %d walls" % (z0, floor[0], z1, ceiling[0], len(walls)))
    solids = []
    for wid, hull, _ in walls:
        area = 0.5 * abs(float(np.dot(hull[:, 0], np.roll(hull[:, 1], -1)) - np.dot(hull[:, 1], np.roll(hull[:, 0], -1))))
        if area < 0.02:
            continue
        solid = cq.Workplane("XY", origin=(0, 0, z0)).polyline([tuple(p) for p in hull]).close().extrude(z1 - z0).val()
        solids.append(solid)
        print("  wall id=%d: footprint area %.2f m2, %d vtx" % (wid, area, len(hull)))
    if not solids:
        raise ValueError("墙体轮廓均过小或退化，无法生成房间骨架")
    for label, horizontal in (("floor", floor), ("ceil", ceiling)):
        sid, zc, hull, _ = horizontal
        solid = cq.Workplane("XY", origin=(0, 0, zc - 0.03)).polyline([tuple(p) for p in hull]).close().extrude(0.06).val()
        solids.append(solid)
    return cq.Compound.makeCompound(solids), source, span


def main():
    parser = argparse.ArgumentParser(description="检测平面 → 建筑骨架 STEP/STL")
    parser.add_argument("result")
    parser.add_argument("paths", nargs="+")
    parser.add_argument("--stl")
    parser.add_argument("--deflection", type=float, default=0.005)
    parser.add_argument("--source-cloud")
    parser.add_argument("--source-span", type=float)
    parser.add_argument("--json", action="store_true")
    args = parser.parse_args()
    exporter = load_exporter()
    try:
        paths = list(args.paths)
        cloud = paths.pop(0) if Path(paths[0]).suffix.lower() in (".ply", ".pcd") else None
        if not paths or len(paths) > 2:
            raise ValueError("用法：result.json [cloud.ply] out.step [min_inlier]")
        step = Path(paths[0]).resolve()
        if step.suffix.lower() not in (".step", ".stp"):
            raise ValueError("CAD 输出路径必须使用 .step 或 .stp")
        min_inlier = int(paths[1]) if len(paths) > 1 else 800
        if min_inlier < 1:
            raise ValueError("最小内点数必须大于 0")
        stl = Path(args.stl).resolve() if args.stl else step.with_suffix(".stl")
        # With --json, stdout is exclusively the machine protocol. Existing
        # command-line callers retain their progress and completion messages.
        output = sys.stderr if args.json else sys.stdout
        with contextlib.redirect_stdout(output):
            model, input_cloud, span = rebuild(args.result, cloud, min_inlier)
            result = exporter.export_model(model, step, stl, args.deflection,
                route="architectural-skeleton", source=args.source_cloud or input_cloud,
                source_cloud=args.source_cloud or input_cloud,
                source_span=args.source_span if args.source_span is not None else span)
        if args.json:
            print(json.dumps(result, ensure_ascii=False, allow_nan=False))
        else:
            print("model bbox: %.2f x %.2f x %.2f, %d solids" % (*result["bbox_m"], result["solids"]))
            print("STEP written:", True, step.stat().st_size, "bytes")
            print("STL written:", True, result["stl_bytes"], "bytes")
        return 0
    except Exception as exc:
        failure = {"ok": False, "error": exporter.friendly_error(exc)}
        print(json.dumps(failure, ensure_ascii=False, allow_nan=False))
        return 1


if __name__ == "__main__":
    raise SystemExit(main())