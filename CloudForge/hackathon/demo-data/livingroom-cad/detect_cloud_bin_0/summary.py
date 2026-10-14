import json, math, os, struct

RES = r'E:\C++\Point\CloudForge\hackathon\demo-data\livingroom-cad\detect_cloud_bin_0\result.json'
d = json.load(open(RES))
ply = d['source_cloud']
print('source:', ply)
raw = open(ply, 'rb').read()
hend = raw.find(b'end_header')
stride = 0
inv = False
for line in raw[:hend].decode('ascii', 'ignore').splitlines():
    t = line.strip().split()
    if not t:
        continue
    if t[0] == 'element':
        inv = t[1] == 'vertex'
        if inv:
            verts = int(t[2])
    elif t[0] == 'property' and inv:
        stride += {'float': 4, 'float32': 4, 'double': 8, 'uchar': 1, 'uint8': 1, 'int': 4, 'uint': 4}[t[1]]
data = raw.find(b'\n', hend) + 1

def read(indices):
    out = []
    for i in indices:
        out.append(struct.unpack_from('<fff', raw, data + i * stride))
    return out

print('shape id type inlier centroid_xyz plane_value(n.c+d) z_min z_max')
for s in d['shapes']:
    idx = [int(x) for x in open(os.path.join(os.path.dirname(RES), 'indices', f'shape_{s["id"]}.txt')).read().split()]
    pts = read(idx)
    nx, ny, nz, dc = s['coefficients']
    xmean = sum(p[0] for p in pts) / len(pts)
    ymean = sum(p[1] for p in pts) / len(pts)
    zmean = sum(p[2] for p in pts) / len(pts)
    val = nx * xmean + ny * ymean + nz * zmean + dc
    zmin = min(p[2] for p in pts)
    zmax = max(p[2] for p in pts)
    xspan = max(p[0] for p in pts) - min(p[0] for p in pts)
    yspan = max(p[1] for p in pts) - min(p[1] for p in pts)
    print(f'{s["id"]:>3} {s["type"]:<6} {s["inlier_count"]:>6} c=({xmean:.3f},{zmean:.3f},{zmean:.3f}) val={val:+.4f} z=[{zmin:.3f},{zmax:.3f}] xy_span=({xspan:.2f},{yspan:.2f})')
