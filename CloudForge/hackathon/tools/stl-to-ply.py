# 将 STEP/STL 模型采样成点云（PLY），供 CloudForge GUI 加载
# 用法: python hackathon/tools/stl-to-ply.py <model.step|stl> [out.ply] [点数] [surface|edges]
#   surface: 表面均匀采样（板片呈实心态）  edges: 仅采网格边缘（CAD 线稿感）
# 依赖: pip install cadquery numpy
import sys, os, json
import cadquery as cq
import numpy as np

src = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + "_cloud.ply"
n_pts = int(sys.argv[3]) if len(sys.argv) > 3 else 50000
mode = sys.argv[4] if len(sys.argv) > 4 else "surface"

shape = cq.importers.importStep(src)
verts, tris = shape.val().tessellate(0.003)
V = np.array([(v.x, v.y, v.z) for v in verts])
T = np.array(tris, dtype=int)

# 三角形面积加权均匀采样；剔除细长面片（板片薄侧面、union 补缝面），只留主平面
a, b, c = V[T[:, 0]], V[T[:, 1]], V[T[:, 2]]
area = 0.5 * np.linalg.norm(np.cross(b - a, c - a), axis=1)
edges = np.stack([np.linalg.norm(a - b, axis=1),
                  np.linalg.norm(b - c, axis=1),
                  np.linalg.norm(c - a, axis=1)])
elong = edges.max(axis=0) / np.maximum(edges.min(axis=0), 1e-9)
keep = (elong < 8.0) & (area > 1e-6)
T, a, b, c, area = T[keep], a[keep], b[keep], c[keep], area[keep]
if mode == "edges":
    # 只采网格边：边去重后按长度加权均匀采样（CAD 线稿感）
    eset = set()
    for t in T:
        for i, j in ((0, 1), (1, 2), (2, 0)):
            eset.add((min(t[i], t[j]), max(t[i], t[j])))
    E = np.array(sorted(eset))
    L = np.linalg.norm(V[E[:, 0]] - V[E[:, 1]], axis=1)
    p = L / L.sum()
    counts = np.random.multinomial(n_pts, p)
    parts = []
    for e_i, k in enumerate(counts):
        if k == 0:
            continue
        t = np.random.rand(k, 1)
        parts.append(V[E[e_i, 0]] + (V[E[e_i, 1]] - V[E[e_i, 0]]) * t)
    samples = np.vstack(parts)[:n_pts]
else:
    # 表面均匀采样: u=sqrt(r1), v=r2*(1-u) 保证 u+v<=1
    p = area / area.sum()
    counts = np.random.multinomial(n_pts, p)
    parts = []
    for t_i, k in enumerate(counts):
        if k == 0:
            continue
        u = np.sqrt(np.random.rand(k, 1))
        v = np.random.rand(k, 1) * (1.0 - u)
        parts.append(a[t_i] + (b[t_i] - a[t_i]) * u + (c[t_i] - a[t_i]) * v)
    samples = np.vstack(parts)[:n_pts]

with open(out, "w") as f:
    f.write("ply\nformat ascii 1.0\ncomment surface-sampled from %s\n"
            % os.path.basename(src))
    f.write("element vertex %d\n" % len(samples))
    f.write("property float x\nproperty float y\nproperty float z\nend_header\n")
    for pt in samples:
        f.write("%.5f %.5f %.5f\n" % tuple(pt))
print(json.dumps({"ok": True, "src": src, "out": out, "points": len(samples),
                  "triangles": len(T)}))
