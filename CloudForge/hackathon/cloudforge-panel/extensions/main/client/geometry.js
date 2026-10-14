// 云铸面板 · 几何基元构造：result.json 的 coefficients → 可渲染的网格描述
//
// 尺寸来源必须与 hackathon/cli/main.cpp 的 `cad` 子命令一致，否则 CAD 页预览与 STEP 交付物对不上：
//   Plane  矩形板：内点在 (u,v) 的 bbox → box(du,dv,t)，厚 t = max(0.005, 2*rmse)（main.cpp:966-972）
//   Cylinder 沿轴投影内点求 [tmin,tmax] → circle(r).extrude(tmax-tmin)（main.cpp:780-795）
//   Cone    k=tan(halfAngle)，r1=max(tmin*k,1e-4)、r2=max(tmax*k,1e-4) → loft 截锥（main.cpp:990-1006）
//   Torus   CLI 的 cad 也跳过导出（main.cpp:1008-1011），此处只用包围盒线框 + "近似"标注
//
// 本模块是纯数学，不引 three.js：返回 position / quaternion / scale，由 viewer.js 组装 BufferGeometry。

const EPS = 1e-9

function norm3(v) {
  const l = Math.hypot(v[0], v[1], v[2])
  return l < EPS ? [0, 0, 1] : [v[0] / l, v[1] / l, v[2] / l]
}
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]]
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]]
const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s]
const mid = (a, b) => mul(add(a, b), 0.5)

/** 三个坐标轴里取与 n 最不对齐的那个，叉出正交基（与 cli/main.cpp:754-759 同法） */
function perpendicularBasis(n) {
  const ax = Math.abs(n[0]), ay = Math.abs(n[1]), az = Math.abs(n[2])
  const seed = ax < ay && ax < az ? [1, 0, 0] : ay < az ? [0, 1, 0] : [0, 0, 1]
  const u = norm3(cross(n, seed))
  const v = cross(n, u)
  return { u, v }
}

/** 由正交基（列向量 u,v,n）求四元数（Shepperd 分支法，避免开根号溢出） */
function quatFromBasis(u, v, n) {
  const m00 = u[0], m01 = v[0], m02 = n[0]
  const m10 = u[1], m11 = v[1], m12 = n[1]
  const m20 = u[2], m21 = v[2], m22 = n[2]
  const tr = m00 + m11 + m22
  if (tr > 0) {
    const S = Math.sqrt(tr + 1) * 2
    return [(m21 - m12) / S, (m02 - m20) / S, (m10 - m01) / S, 0.25 * S]
  }
  if (m00 > m11 && m00 > m22) {
    const S = Math.sqrt(1 + m00 - m11 - m22) * 2
    return [0.25 * S, (m01 + m10) / S, (m02 + m20) / S, (m21 - m12) / S]
  }
  if (m11 > m22) {
    const S = Math.sqrt(1 + m11 - m00 - m22) * 2
    return [(m01 + m10) / S, 0.25 * S, (m12 + m21) / S, (m02 - m20) / S]
  }
  const S = Math.sqrt(1 + m22 - m00 - m11) * 2
  return [(m02 + m20) / S, (m12 + m21) / S, 0.25 * S, (m10 - m01) / S]
}

/** 把 +Y 轴旋到 dir 的四元数 */
function quatFromYAxis(dir) {
  const a = norm3(dir)
  const d = a[1]
  if (d > 1 - 1e-8) return [0, 0, 0, 1]
  if (d < -1 + 1e-8) return [0, 0, 1, 0]
  const axis = cross([0, 1, 0], a)
  const s = Math.hypot(axis[0], axis[1], axis[2])
  const angle = Math.atan2(s, d)
  const k = angle / 2 / s
  return [axis[0] * k, axis[1] * k, axis[2] * k, Math.cos(angle / 2)]
}

function bboxCorners(bbox) {
  const [x0, y0, z0] = bbox.min
  const [x1, y1, z1] = bbox.max
  const out = []
  for (const x of [x0, x1]) for (const y of [y0, y1]) for (const z of [z0, z1]) out.push([x, y, z])
  return out
}

/** 把点云包围盒的 8 个角投到基 (u,v) 上，返回相对原点的 [umin,umax,vmin,vmax] */
function extentOnPlane(bbox, u, v, origin) {
  let umin = Infinity, umax = -Infinity, vmin = Infinity, vmax = -Infinity
  for (const c of bboxCorners(bbox)) {
    const d = sub(c, origin)
    const a = dot(d, u)
    const b = dot(d, v)
    if (a < umin) umin = a
    if (a > umax) umax = a
    if (b < vmin) vmin = b
    if (b > vmax) vmax = b
  }
  return [umin, umax, vmin, vmax]
}

/** 把包围盒角点投到轴上，返回相对 p0 的 [tmin,tmax] */
function extentOnAxis(bbox, axis, p0) {
  let tmin = Infinity, tmax = -Infinity
  for (const c of bboxCorners(bbox)) {
    const t = dot(sub(c, p0), axis)
    if (t < tmin) tmin = t
    if (t > tmax) tmax = t
  }
  return [tmin, tmax]
}

/**
 * 构造单个基元的网格描述。
 * @param {{type:string, rmse:number, coefficients:number[]}} shape
 * @param {{min:number[],max:number[]}} bbox 点云包围盒（用于给平面/圆柱/圆锥定尺寸）
 * @returns 描述对象；type=unknown 时返回 null
 */
export function buildPrimitive(shape, bbox) {
  const c = shape.coefficients ?? []
  const rmse = typeof shape.rmse === 'number' ? shape.rmse : 0.002
  const base = { id: shape.id, type: shape.type, rmse }

  if (shape.type === 'Plane' && c.length >= 4) {
    const n = norm3([c[0], c[1], c[2]])
    const d = c[3]
    const center = mid(bbox.min, bbox.max)
    const signed = dot(n, center) + d // 平面到点云中心的带符号距离
    const p0 = sub(center, mul(n, signed)) // 点云中心在平面上的投影
    const { u, v } = perpendicularBasis(n)
    const [umin, umax, vmin, vmax] = extentOnPlane(bbox, u, v, p0)
    const du = Math.max(umax - umin, 1e-3)
    const dv = Math.max(vmax - vmin, 1e-3)
    const t = Math.max(0.005, 2 * rmse) // 与 CLI cad 导出的板厚一致
    const midU = (umin + umax) / 2
    const midV = (vmin + vmax) / 2
    return {
      ...base,
      unit: 'box',
      position: add(p0, add(mul(u, midU), mul(v, midV))),
      quaternion: quatFromBasis(u, v, n),
      scale: [du, dv, t],
      dims: { du, dv, t },
      note: `法向 (${n.map((x) => x.toFixed(3)).join(', ')}) · d=${d.toFixed(4)}`,
    }
  }

  if (shape.type === 'Cylinder' && c.length >= 7) {
    const p0 = [c[0], c[1], c[2]]
    const axis = norm3([c[3], c[4], c[5]])
    const r = Math.abs(c[6])
    const [tmin, tmax] = extentOnAxis(bbox, axis, p0)
    const height = Math.max(tmax - tmin, 1e-3)
    return {
      ...base,
      unit: 'cylinder',
      position: add(p0, mul(axis, (tmin + tmax) / 2)),
      quaternion: quatFromYAxis(axis),
      scale: [2 * r, height, 2 * r],
      dims: { r, height },
      note: `r=${r.toFixed(4)} m · 高 ${(height * 1000).toFixed(1)} mm`,
    }
  }

  if (shape.type === 'Sphere' && c.length >= 4) {
    const r = Math.abs(c[3])
    return {
      ...base,
      unit: 'sphere',
      position: [c[0], c[1], c[2]],
      quaternion: [0, 0, 0, 1],
      scale: [2 * r, 2 * r, 2 * r],
      dims: { r },
      note: `r=${r.toFixed(4)} m`,
    }
  }

  if (shape.type === 'Cone' && c.length >= 7) {
    const apex = [c[0], c[1], c[2]]
    const axis = norm3([c[3], c[4], c[5]])
    const halfAngle = Math.abs(c[6])
    const k = Math.tan(halfAngle)
    const [tmin, tmax] = extentOnAxis(bbox, axis, apex)
    const r1 = Math.max(tmin * k, 1e-4)
    const r2 = Math.max(tmax * k, 1e-4)
    const height = Math.max(tmax - tmin, 1e-3)
    return {
      ...base,
      // 非等径截锥无法用 scale 从单位圆锥缩放出来，交给 viewer 用专用几何构造
      unit: 'frustum',
      radii: [r1, r2],
      position: add(apex, mul(axis, (tmin + tmax) / 2)),
      quaternion: quatFromYAxis(axis),
      scale: [1, height, 1],
      dims: { r1, r2, height },
      note: `半角 ${((halfAngle * 180) / Math.PI).toFixed(1)}° · 顶/底 r ${(r2 * 1000).toFixed(1)}/${(r1 * 1000).toFixed(1)} mm`,
    }
  }

  // Torus 等类型：CLI 的 cad 也不导出，只给包围盒线框 + 明示"近似"
  const r = Math.max(bbox.max[0] - bbox.min[0], bbox.max[1] - bbox.min[1], bbox.max[2] - bbox.min[2]) / 2
  return {
    ...base,
    unit: 'bbox',
    position: mid(bbox.min, bbox.max),
    quaternion: [0, 0, 0, 1],
    scale: [r * 2, r * 2, r * 2],
    dims: { r },
    note: `${shape.type} · 用包围盒近似（CLI cad 亦不导出该类型）`,
  }
}

/**
 * 点到基元的近似距离（用于"按几何距离"筛内点做高亮）。
 * 判据与 RANSAC 自身的距离判据同源：平面用带符号距，圆柱用"到轴距离 − 半径"。
 */
export function pointDistance(prim, x, y, z) {
  if (!prim) return Infinity
  const c = prim.coefficients ?? []
  if (prim.type === 'Plane' && c.length >= 4) {
    return Math.abs(c[0] * x + c[1] * y + c[2] * z + c[3])
  }
  if (prim.type === 'Cylinder' && c.length >= 7) {
    const p0 = [c[0], c[1], c[2]]
    const ax = [c[3], c[4], c[5]]
    const len = Math.hypot(ax[0], ax[1], ax[2]) || 1
    const a = [ax[0] / len, ax[1] / len, ax[2] / len]
    const d = [x - p0[0], y - p0[1], z - p0[2]]
    const t = d[0] * a[0] + d[1] * a[1] + d[2] * a[2]
    const px = p0[0] + a[0] * t - x
    const py = p0[1] + a[1] * t - y
    const pz = p0[2] + a[2] * t - z
    return Math.abs(Math.hypot(px, py, pz) - Math.abs(c[6]))
  }
  if (prim.type === 'Sphere' && c.length >= 4) {
    return Math.abs(Math.hypot(x - c[0], y - c[1], z - c[2]) - Math.abs(c[3]))
  }
  if (prim.type === 'Cone' && c.length >= 7) {
    const apex = [c[0], c[1], c[2]]
    const ax = [c[3], c[4], c[5]]
    const len = Math.hypot(ax[0], ax[1], ax[2]) || 1
    const a = [ax[0] / len, ax[1] / len, ax[2] / len]
    const d = [x - apex[0], y - apex[1], z - apex[2]]
    const t = d[0] * a[0] + d[1] * a[1] + d[2] * a[2]
    const radial = Math.hypot(d[0] - a[0] * t, d[1] - a[1] * t, d[2] - a[2] * t)
    return Math.abs(radial - Math.abs(t * Math.tan(c[6])))
  }
  return Infinity
}

export { quatFromYAxis, norm3 }