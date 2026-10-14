"""Inspect the selected CAD without modifying it; all reported geometry uses metres."""
import argparse
import contextlib
import json
import math
from pathlib import Path
import re
import struct
import sys

MAX_BYTES = 256 * 1024 * 1024
MAX_FACES = 2_000_000


def finite_bounds(points):
    low, high = [math.inf] * 3, [-math.inf] * 3
    for point in points:
        if len(point) != 3 or any(not math.isfinite(v) or abs(v) > 1e9 for v in point):
            raise ValueError("CAD contains non-finite or excessive coordinates")
        for axis, value in enumerate(point):
            low[axis], high[axis] = min(low[axis], value), max(high[axis], value)
    spans = [high[i] - low[i] for i in range(3)]
    if any(not math.isfinite(v) or v < 0 for v in spans) or max(spans) <= 1e-12:
        raise ValueError("CAD bounding box is empty")
    return {"bbox_min_m": low, "bbox_max_m": high, "bbox_m": spans}


def inspect_stl(path, scale):
    raw = path.read_bytes()
    faces = struct.unpack_from("<I", raw, 80)[0] if len(raw) >= 84 else 0
    binary = bool(faces and len(raw) == 84 + 50 * faces)
    if binary:
        if faces > MAX_FACES:
            raise ValueError("STL exceeds two million triangles")
        vertices = (tuple(scale * v for v in struct.unpack_from("<3f", raw, 84 + face * 50 + 12 + corner * 12))
                    for face in range(faces) for corner in range(3))
        bounds = finite_bounds(vertices)
    else:
        text = raw.decode("ascii", errors="strict")
        count = 0
        def vertices():
            nonlocal count
            for match in re.finditer(r"\bvertex\s+([^\s]+)\s+([^\s]+)\s+([^\s]+)", text, re.IGNORECASE):
                count += 1
                if count > MAX_FACES * 3:
                    raise ValueError("STL exceeds two million triangles")
                yield tuple(scale * float(v) for v in match.groups())
        bounds = finite_bounds(vertices())
        if not count or count % 3:
            raise ValueError("STL has no valid complete triangle list")
        faces = count // 3
    return {"ok": True, "kind": "mesh", "triangles": faces, "coordinate_unit": "m", **bounds,
            "scope": "Triangle coordinates and bounds only; STL does not prove CAD solid validity or closedness."}


def inspect_step(path, scale):
    import cadquery as cq
    model = cq.importers.importStep(str(path))
    values = model.vals()
    if not values or any(not isinstance(value, cq.Shape) for value in values):
        raise ValueError("STEP has no usable shape")
    shape = values[0] if len(values) == 1 else cq.Compound.makeCompound(values)
    if scale != 1:
        shape = shape.scale(scale)
    if shape.isNull() or not shape.isValid():
        raise ValueError("STEP shape is invalid")
    solids = shape.Solids()
    if not solids or any(not solid.isValid() for solid in solids):
        raise ValueError("STEP contains no valid solid or an invalid solid")
    volume = sum(float(solid.Volume()) for solid in solids)
    if not math.isfinite(volume) or volume <= 0:
        raise ValueError("STEP solid volume is invalid")
    box = shape.BoundingBox()
    bounds = finite_bounds([(float(box.xmin), float(box.ymin), float(box.zmin)),
                            (float(box.xmax), float(box.ymax), float(box.zmax))])
    return {"ok": True, "kind": "solid", "solids": len(solids), "volume_m3": volume,
            "coordinate_unit": "m", "import_to_m_scale": scale, **bounds,
            "scope": "B-rep validity, positive volume and bounds; this does not measure every cloud point against the CAD surface."}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("cad")
    parser.add_argument("--scale", type=float, required=True)
    args = parser.parse_args()
    try:
        path = Path(args.cad).resolve(strict=True)
        if not path.is_file() or not 0 < path.stat().st_size <= MAX_BYTES:
            raise ValueError("CAD must be a non-empty file at most 256 MiB")
        if not math.isfinite(args.scale) or args.scale not in (0.001, 1.0):
            raise ValueError("Unsupported CAD-to-metre scale")
        with contextlib.redirect_stdout(sys.stderr):
            if path.suffix.lower() in (".step", ".stp"):
                result = inspect_step(path, args.scale)
            elif path.suffix.lower() == ".stl":
                result = inspect_stl(path, args.scale)
            else:
                raise ValueError("Select a STEP, STP or STL CAD")
    except ModuleNotFoundError as exc:
        result = {"ok": False, "error": "CAD verification dependency missing: " + str(exc.name),
                  "dependencyMissing": True, "setup": "Install hackathon/tools/requirements-cad.txt into .venv-cad or configure CLOUDFORGE_PYTHON."}
    except Exception as exc:
        result = {"ok": False, "error": str(exc)[:600] or type(exc).__name__}
    print(json.dumps(result, ensure_ascii=False, allow_nan=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
