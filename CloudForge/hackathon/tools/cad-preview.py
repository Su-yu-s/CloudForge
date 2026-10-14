"""CadQuery STEP preview and shared same-model STEP/STL delivery.

CloudForge geometry and STL coordinates stay in metres. STEP uses a scaled
millimetre copy so external CAD applications receive the correct physical size.
"""
import argparse
import contextlib
import json
import math
import os
from pathlib import Path
import struct
import sys
import tempfile


def friendly_error(exc):
    if isinstance(exc, ModuleNotFoundError):
        return "缺少 CAD 导出依赖 %s，请安装到 CloudForge 使用的 Python 环境" % ("cadquery" if (exc.name or "").split(".")[0] in ("cadquery", "OCP") else (exc.name or "cadquery"))
    return str(exc).strip()[:400] or type(exc).__name__


def shape_info(model, source_span=None):
    import cadquery as cq

    if isinstance(model, cq.Workplane):
        values = model.vals()
        if not values or any(not isinstance(value, cq.Shape) for value in values):
            raise ValueError("重建结果为空或包含非几何对象")
        shape = values[0] if len(values) == 1 else cq.Compound.makeCompound(values)
    else:
        shape = model
    if not isinstance(shape, cq.Shape) or shape.isNull():
        raise ValueError("重建结果为空，无法导出 CAD")
    solids = shape.Solids()
    if not solids:
        raise ValueError("重建结果没有实体，无法导出 CAD")
    if not shape.isValid() or any(not solid.isValid() for solid in solids):
        raise ValueError("重建实体无效，请检查检测结果或拟合参数")
    bb = shape.BoundingBox()
    spans = [float(bb.xlen), float(bb.ylen), float(bb.zlen)]
    coords = [float(bb.xmin), float(bb.ymin), float(bb.zmin), float(bb.xmax), float(bb.ymax), float(bb.zmax)]
    if any(not math.isfinite(v) for v in spans + coords) or any(v <= 1e-12 for v in spans):
        raise ValueError("CAD 包围盒为空或包含非有限尺寸")
    if max(spans) > 1e6 or max(abs(v) for v in coords) > 1e9:
        raise ValueError("CAD 尺寸异常，请检查点云单位和检测参数")
    if source_span is not None:
        source_span = float(source_span)
        if not math.isfinite(source_span) or source_span <= 0:
            raise ValueError("源点云尺寸无效")
        if max(spans) > source_span * 1.5 + 1e-9:
            raise ValueError("CAD 尺寸超过源点云范围的 1.5 倍，请检查重建参数")
    volume = sum(float(s.Volume()) for s in solids)
    if not math.isfinite(volume) or volume <= 0:
        raise ValueError("CAD 实体体积无效")
    return shape, {"solids": len(solids), "volume_m3": volume, "bbox_m": spans}


def export_model(model, step_path, stl_path, deflection=0.005, route="primitive-model", source=None, source_cloud=None, source_span=None, write_step=True, step_to_preview_scale=0.001):
    """Validate once, then derive both deliverables from this exact shape."""
    import cadquery as cq

    deflection = float(deflection)
    if not math.isfinite(deflection) or not 1e-6 <= deflection <= 1:
        raise ValueError("预览网格偏差必须在 0.000001–1 米之间")
    shape, info = shape_info(model, source_span)
    vertices, triangles = shape.tessellate(deflection)
    if not vertices or not triangles:
        raise ValueError("CAD 未产生可预览的三角网格")
    if len(triangles) > 2_000_000:
        raise ValueError("预览网格超过 200 万面，请提高网格偏差后重试")
    positions = [tuple(float(v) for v in p.toTuple()) for p in vertices]
    if any(not math.isfinite(v) or abs(v) > 1e9 for p in positions for v in p):
        raise ValueError("预览网格包含异常坐标")
    mesh_span = [max(p[axis] for p in positions) - min(p[axis] for p in positions) for axis in range(3)]
    if any(v <= 0 for v in mesh_span):
        raise ValueError("预览网格尺寸为空")
    errors = [abs(m - s) / s for m, s in zip(mesh_span, info["bbox_m"])]
    if any(abs(m - s) > max(s * 0.03, 2 * deflection) for m, s in zip(mesh_span, info["bbox_m"])):
        raise ValueError("预览网格未完整覆盖 CAD，请减小网格偏差后重试")

    step = Path(step_path).resolve()
    stl = Path(stl_path).resolve()
    if step == stl:
        raise ValueError("STEP 和 STL 输出路径不能相同")
    step.parent.mkdir(parents=True, exist_ok=True)
    stl.parent.mkdir(parents=True, exist_ok=True)
    pending = []
    try:
        step_tmp = None
        if write_step:
            fd, name = tempfile.mkstemp(prefix=".cloudforge-", suffix=".step", dir=step.parent)
            os.close(fd)
            step_tmp = Path(name)
            pending.append(step_tmp)
            # CadQuery releases without unit options interpret shape values as
            # millimetres. A copy converts metre values to true millimetres;
            # tessellation, volume and bounds continue using the metre shape.
            cq.exporters.export(shape.scale(1000.0), str(step_tmp), exportType="STEP")
            if step_tmp.stat().st_size <= 0:
                raise ValueError("STEP 导出为空")
        fd, name = tempfile.mkstemp(prefix=".cloudforge-", suffix=".stl", dir=stl.parent)
        stl_tmp = Path(name)
        pending.append(stl_tmp)
        facets = 0
        with os.fdopen(fd, "wb") as fh:
            fh.write(b"CloudForge same-model preview STL; coordinates in metres".ljust(80, b"\0"))
            fh.write(struct.pack("<I", 0))
            for indices in triangles:
                if len(indices) != 3 or any(i < 0 or i >= len(positions) for i in indices):
                    raise ValueError("预览网格索引无效")
                a, b, c = (positions[i] for i in indices)
                u = tuple(b[i] - a[i] for i in range(3))
                v = tuple(c[i] - a[i] for i in range(3))
                normal = (u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0])
                length = math.sqrt(sum(x*x for x in normal))
                if length <= 1e-30:
                    continue
                fh.write(struct.pack("<12fH", *(x / length for x in normal), *a, *b, *c, 0))
                facets += 1
            if not facets:
                raise ValueError("预览网格没有有效三角面")
            fh.seek(80)
            fh.write(struct.pack("<I", facets))
        result = {
            "ok": True, "step": str(step), "stl": str(stl), "facets": facets,
            "points": len(positions), "stl_bytes": stl_tmp.stat().st_size,
            **info, "mesh_span_m": mesh_span, "coverage_error": max(errors),
            "deflection": deflection, "route": route, "source": source or str(step),
            "source_cloud": source_cloud, "coordinate_unit": "m",
            "step_coordinate_unit": "mm", "preview_coordinate_unit": "m",
            "step_to_preview_scale": step_to_preview_scale,
        }
        fd, name = tempfile.mkstemp(prefix=".cloudforge-", suffix=".json", dir=stl.parent)
        meta_tmp = Path(name)
        pending.append(meta_tmp)
        with os.fdopen(fd, "w", encoding="utf-8") as fh:
            json.dump(result, fh, ensure_ascii=False, allow_nan=False, indent=2)
        if step_tmp is not None:
            os.replace(step_tmp, step)
        os.replace(stl_tmp, stl)
        os.replace(meta_tmp, Path(str(stl) + ".json"))
        return result
    finally:
        for path in pending:
            try:
                path.unlink(missing_ok=True)
            except OSError:
                pass


def main():
    parser = argparse.ArgumentParser(description="STEP → STL 预览（无需 FreeCAD）")
    parser.add_argument("step")
    parser.add_argument("stl")
    parser.add_argument("deflection", nargs="?", type=float, default=0.005)
    parser.add_argument("--scale", type=float, default=0.001, help="STEP 默认毫米导入结果到米的比例；仅旧 CloudForge 产物使用 1")
    args = parser.parse_args()
    try:
        with contextlib.redirect_stdout(sys.stderr):
            import cadquery as cq
            step = Path(args.step).resolve()
            if not step.is_file() or step.suffix.lower() not in (".step", ".stp"):
                raise ValueError("请选择存在的 STEP/STP 文件")
            if not math.isfinite(args.scale) or args.scale <= 0 or args.scale > 1000:
                raise ValueError("STEP 预览单位比例无效")
            model = cq.importers.importStep(str(step))
            if args.scale != 1:
                model = model.newObject([shape.scale(args.scale) for shape in model.vals()])
            result = export_model(model, step, args.stl, args.deflection, route="step-preview",
                source=str(step), write_step=False, step_to_preview_scale=args.scale)
    except Exception as exc:
        result = {"ok": False, "error": friendly_error(exc)}
    print(json.dumps(result, ensure_ascii=False, allow_nan=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())