// 云铸面板 · 传输解码：base64 → uint16 → 反量化成 Float32Array
//
// 后端按包围盒把坐标量化成 uint16 下发（见 lib/quantize.mjs）：
//   real = origin[axis] + q * scale[axis]
// 精度：livingroom span 3.4075 m / 65535 = 0.052 mm，远细于 robust_sigma（mm 级）。

export function decodeUint16(base64) {
  const bin = atob(String(base64 ?? ''))
  const n = bin.length >> 1
  const out = new Uint16Array(n)
  for (let i = 0; i < n; i++) out[i] = bin.charCodeAt(i * 2) | (bin.charCodeAt(i * 2 + 1) << 8)
  return out
}

/** uint16 → Float32Array（xyz 扁平） */
export function dequantize(u16, origin, scale) {
  const n = u16.length
  const out = new Float32Array(n)
  const ox = origin[0], oy = origin[1], oz = origin[2]
  const sx = scale[0], sy = scale[1], sz = scale[2]
  for (let i = 0; i < n; i += 3) {
    out[i] = ox + u16[i] * sx
    out[i + 1] = oy + u16[i + 1] * sy
    out[i + 2] = oz + u16[i + 2] * sz
  }
  return out
}

/** 一步到位：服务载荷 → Float32Array */
export function decodePositions(page) {
  if (!page || page.encoding !== 'uint16') return null
  return dequantize(decodeUint16(page.positions), page.origin, page.scale)
}

/** 三角汤：每 9 个 float 构成一个三角面 */
export function decodeTriangles(page) {
  const pos = decodePositions(page)
  if (!pos) return null
  const triCount = Math.floor(pos.length / 9)
  return { positions: pos, triCount }
}