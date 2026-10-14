# 内点凸包轮廓拉伸导出：每面墙按内点在平面上的真实分布轮廓（凸包）裁切
# 对比旧版（矩形 bbox 板）：墙不再相互穿透、贴合实际边界，含 L 形/斜边
# 用法: python hackathon/tools/cad-export-hull.py <result.json> <点云.ply> <out.step> [min_inlier] [ids如0,2,3]
import json, math, os, struct, sys, time
import numpy as np
from scipy.spatial import ConvexHull
import cadquery as cq

RES, PLY, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
MIN_INLIER = int(sys.argv[4]) if len(sys.argv) > 4 else 200
WANT_IDS = set(int(x) for x in sys.argv[5].split(",")) if len(sys.argv) > 5 else None
THICK = 0.05

# --- 读 PLY：按 header 实际属性布局定位 vertex 数据 ---
raw = open(PLY, "rb").read()
hend = raw.find(b"end_header")
hdr_text = raw[:hend].decode("ascii", "ignore").splitlines()
stride, vert_count, in_vertex = 0, 0, False
fmt = ""
for line in hdr_text:
    t = line.strip().split()
    if not t:
        continue
    if t[0] == "format":
        fmt = t[1]
    elif t[0] == "element":
        in_vertex = t[1] == "vertex"
        if in_vertex:
            vert_count = int(t[2])
    elif t[0] == "property" and in_vertex:
        stride += {"char": 1, "uchar": 1, "int8": 1, "uint8": 1,
                   "short": 2, "ushort": 2, "int16": 2, "uint16": 2,
                   "int": 4, "uint": 4, "int32": 4, "uint32": 4,
                   "float": 4, "float32": 4, "double": 8}[t[1]]
data_start = raw.find(b"\n", hend) + 1
if b"\r\n" in raw[hend:hend+2]:
    data_start = raw.find(b"\n", hend) + 1

def read_xyz(indices):
    out = np.empty((len(indices), 3), dtype=np.float64)
    for k, i in enumerate(indices):
        out[k] = struct.unpack_from("<fff", raw, data_start + i * stride)
    return out

# --- 每面：内点投影到平面局部基 → 凸包 → 拉伸 ---
d = json.load(open(RES))
shapes = d["shapes"]
solids, meta = [], []
for s in shapes:
    if WANT_IDS is not None and s["id"] not in WANT_IDS:
        continue
    if s["inlier_count"] < MIN_INLIER:
        continue
    nx, ny, nz, dd = s["coefficients"]
    nlen = math.sqrt(nx*nx + ny*ny + nz*nz)
    n = np.array([nx, ny, nz]) / nlen
    base = -(dd / nlen) * n
    a = np.array([1.0, 0, 0]) if abs(n[0]) < 0.9 else np.array([0, 1.0, 0])
    xu = np.cross(n, a); xu /= np.linalg.norm(xu)
    yv = np.cross(n, xu)
    idx = [int(x) for x in open(os.path.join(os.path.dirname(RES), "indices", "shape_%d.txt" % s["id"])).read().split()]
    pts = read_xyz(idx)
    rel = pts - base
    uv = np.stack([rel @ xu, rel @ yv], axis=1)
    if len(uv) < 3:
        continue
    hull = ConvexHull(uv)
    poly = uv[hull.vertices]
    area = 0.5 * abs(np.dot(poly[:, 0], np.roll(poly[:, 1], -1)) - np.dot(poly[:, 1], np.roll(poly[:, 0], -1)))
    if area < 0.05:
        continue
    wp = cq.Workplane(cq.Plane(origin=tuple(base), xDir=tuple(xu), normal=tuple(n)))
    solid = wp.polyline([tuple(p) for p in poly]).close().extrude(THICK).val()
    solid = solid.translate(cq.Vector(*(n * THICK / 2)))
    solids.append(solid)
    meta.append((s["id"], s["type"], len(poly), round(area, 2)))

print("exported", len(solids), "hull slabs")
model = cq.Compound.makeCompound(solids)
cq.exporters.export(model, OUT)
xs, ys, zs = [], [], []
for s in solids:
    for v in s.Vertices():
        xs.append(v.X); ys.append(v.Y); zs.append(v.Z)
print("model bbox: %.2f x %.2f x %.2f" % (max(xs)-min(xs), max(ys)-min(ys), max(zs)-min(zs)))
print("STEP written:", os.path.exists(OUT), os.path.getsize(OUT), "bytes")
