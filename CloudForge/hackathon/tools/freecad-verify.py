# 用 FreeCAD 内核（OpenCASCADE）交叉验证 cloudforge 导出的 STEP 文件
# 用法: <freecad 目录>\bin\freecadcmd.exe hackathon\tools\freecad-verify.py <a.step> [b.step ...]
# 不带参数时验证仓库根两份演示模型。第三方软件复核证据，可写入提交材料。
import sys, json, os
import Part

default_files = [
    r"E:\C++\Point\CloudForge\hackathon\demo-data\demo-part\demo_model.step",
    r"E:\C++\Point\CloudForge\hackathon\demo-data\livingroom-cad\livingroom_cad_export.step",
]
# freecadcmd 会把脚本自身放进 argv，过滤掉 .py 项，剩余的才是模型路径
files = [a for a in sys.argv[1:] if not a.lower().endswith(".py")] or default_files
out = []
for path in files:
    try:
        sh = Part.Shape()
        sh.read(path)
        bb = sh.BoundBox
        out.append({
            "file": os.path.basename(path), "ok": True,
            "solids": len(sh.Solids),
            "volume_m3": round(sum(s.Volume for s in sh.Solids), 6),
            "bbox_m": [round(bb.XLength, 3), round(bb.YLength, 3), round(bb.ZLength, 3)],
        })
    except Exception as e:
        out.append({"file": os.path.basename(path), "ok": False, "error": str(e)[:160]})
print(json.dumps(out, ensure_ascii=False, indent=1))
