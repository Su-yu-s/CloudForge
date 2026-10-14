# FreeCAD-independent cross-verify: read STEP via cadquery (OCP/OpenCASCADE)
# Same checks as freecad-verify.py: solid count, total volume, bbox
import json, os, sys
import cadquery as cq

files = sys.argv[1:] if len(sys.argv) > 1 else [
    r"E:\C++\Point\CloudForge\hackathon\demo-data\demo-part\demo_model.step",
    r"E:\C++\Point\CloudForge\hackathon\demo-data\livingroom-run\cad_export.step",
]
out = []
for path in files:
    if not os.path.exists(path):
        out.append({"file": os.path.basename(path), "ok": False, "error": "not found"})
        continue
    try:
        obj = cq.importers.importStep(path)
        # importStep returns a Workplane; .val() gets the underlying Shape
        sh = obj.val() if hasattr(obj, "val") else obj
        solids = sh.Solids() if hasattr(sh, "Solids") else []
        bb = sh.BoundingBox() if hasattr(sh, "BoundingBox") else obj.val().BoundingBox()
        vol = sum(s.Volume() for s in solids) if solids else 0.0
        out.append({
            "file": os.path.basename(path), "ok": True,
            "solids": len(solids),
            "volume_m3": round(vol, 6),
            "bbox_m": [round(bb.xlen, 3), round(bb.ylen, 3), round(bb.zlen, 3)],
        })
    except Exception as e:
        out.append({"file": os.path.basename(path), "ok": False, "error": str(e)[:160]})
print(json.dumps(out, ensure_ascii=False, indent=1))
