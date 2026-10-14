# STEP → STL 转换 + 体积/包围盒复算（供 AGH 右栏面板 CAD 预览用）
# 用法: <FreeCAD>\bin\freecadcmd.exe hackathon\tools\step-to-stl.py <in.step> <out.stl> [linear_deflection]
#
# 三点注意事项（都来自 freecadcmd / OpenCASCADE 的实际行为，别改成常规 Python 写法）：
#   1) 顶层直接执行，不要写 if __name__ == "__main__" 守卫——freecadcmd 下该条件不成立，
#      守卫会让脚本体整段不执行，随后 STEP 路径被当成待打开文档而报 "File does not exist"。
#   2) freecadcmd 会把脚本自身放进 argv，必须过滤掉 .py 项，剩下的才是模型路径。
#   3) 用 Shape.tessellate() 自己写二进制 STL，不用 MeshPart.meshFromShape()：
#      后者在复合体（多实体）上会退化成只覆盖局部面的网格——demo_model.step 的形状包围盒
#      Z 长 0.2056 m，而 meshFromShape 的产物只有 0.0106 m，肉眼可见地缺了一截。
#      tessellate 直接返回 (points, facets)，写出的 STL 必然覆盖整个形状。
import json
import math
import os
import struct
import sys

args = [a for a in sys.argv[1:] if not a.lower().endswith(".py")]
if len(args) < 2:
    print(json.dumps({"ok": False, "error": "usage: step-to-stl.py <in.step> <out.stl> [deflection]"},
                     ensure_ascii=False))
else:
    src = os.path.abspath(args[0])
    dst = os.path.abspath(args[1])
    # 绝对线性偏差越小三角面越多：建筑尺度 0.05 m 足够，机械小件用 0.005~0.01 m
    deflection = float(args[2]) if len(args) > 2 else 0.02
    # FreeCAD imports ordinary STEP coordinates in mm. Legacy CloudForge STEP
    # used metre values under a mm declaration; callers explicitly pass 1 for it.
    preview_scale = float(args[3]) if len(args) > 3 else 1.0
    try:
        if not math.isfinite(preview_scale) or preview_scale <= 0 or not math.isfinite(deflection) or deflection <= 0:
            raise ValueError("invalid preview scale or deflection")
        import Part

        shape = Part.Shape()
        shape.read(src)
        bb = shape.BoundBox

        points, facets = shape.tessellate(deflection / preview_scale)

        # 二进制 STL：80 字节头 + uint32 面数 + 每面 50 字节
        tris = []
        for f in facets:
            a, b, c = points[f[0]], points[f[1]], points[f[2]]
            ux, uy, uz = b.x - a.x, b.y - a.y, b.z - a.z
            vx, vy, vz = c.x - a.x, c.y - a.y, c.z - a.z
            nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
            n = (nx * nx + ny * ny + nz * nz) ** 0.5 or 1.0
            nx, ny, nz = nx / n, ny / n, nz / n
            tris.append((nx, ny, nz, a, b, c))

        with open(dst, "wb") as fh:
            header = ("CloudForge preview STL; source=" + os.path.basename(src)).encode("ascii", "ignore")[:79]
            fh.write(header.ljust(80, b"\0"))
            fh.write(struct.pack("<I", len(tris)))
            for nx, ny, nz, a, b, c in tris:
                fh.write(struct.pack("<12fH", nx, ny, nz,
                                     a.x * preview_scale, a.y * preview_scale, a.z * preview_scale,
                                     b.x * preview_scale, b.y * preview_scale, b.z * preview_scale,
                                     c.x * preview_scale, c.y * preview_scale, c.z * preview_scale, 0))

        # 覆盖性自检：写出的网格必须与形状包围盒一致，否则预览会"缺一截"却看不出来
        zs = [p.z * preview_scale for p in points] or [0.0]
        xs = [p.x * preview_scale for p in points] or [0.0]
        ys = [p.y * preview_scale for p in points] or [0.0]
        mesh_span = [max(xs) - min(xs), max(ys) - min(ys), max(zs) - min(zs)]
        shape_span = [bb.XLength * preview_scale, bb.YLength * preview_scale, bb.ZLength * preview_scale]
        worst = 0.0
        for m, s in zip(mesh_span, shape_span):
            if s > 1e-9:
                worst = max(worst, abs(m - s) / s)
        print(json.dumps({
            "ok": True,
            "source": src,
            "stl": dst,
            "stl_bytes": os.path.getsize(dst),
            "facets": len(tris),
            "points": len(points),
            "solids": len(shape.Solids),
            "volume_m3": sum(s.Volume for s in shape.Solids) * preview_scale ** 3,
            "bbox_m": [round(v, 4) for v in shape_span],
            "mesh_span_m": [round(v, 4) for v in mesh_span],
            "coverage_error": round(worst, 4),
            "deflection": deflection,
            "preview_scale": preview_scale,
            "preview_coordinate_unit": "m",
        }, ensure_ascii=False))
    except Exception as exc:  # freecadcmd 会吞异常并继续，必须自己捕获并以 JSON 回报
        print(json.dumps({"ok": False, "error": str(exc)[:300], "source": src}, ensure_ascii=False))
