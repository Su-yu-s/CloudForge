// 云铸面板 · 传输编码：uint16 量化 / 分页 / LRU 缓存
//
// 为什么必须量化分页：AGH 服务返回有硬上限 maxResultBytes ≤ 1,048,576 字节
// （packages/protocol/gen/ts/extension-service.ts:8），而 base64 还要 ×4/3。
//   float32 xyz = 12 B/点 → 单次上限约 65,000 点
//   uint16 xyz  =  6 B/点 → 单次上限约 130,000 点
// 取 65,536 点/批：393,216 B 原始 → base64 524,288 字符 ≈ 512 KB，留足 JSON 字段余量。
// 196,133 点（livingroom）→ 3 批（65536 + 65536 + 65061）。
//
// 精度：uint16 在包围盒最长边上的分辨率为 span/65535。
// livingroom span 3.4075 m → 0.052 mm，远细于 robust_sigma（mm 级），肉眼无损。

import { statSync } from 'node:fs'
import { boundsOf, readCloudFile } from './cloud-io.mjs'

export const PAGE_LIMIT = 65536

const CACHE_MAX = 4
const CACHE_TTL_MS = 120000
/** @type {Map<string, {key:string, at:number, parsed:any}>} */
const cache = new Map()

function fileStamp(file) {
  try {
    const st = statSync(file)
    return `${file}|${st.size}|${st.mtimeMs}`
  } catch {
    return `${file}|missing`
  }
}

/** 取（并缓存）解析结果；key 含 size+mtime，文件一变自动失效 */
export function loadParsed(file) {
  const key = fileStamp(file)
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) {
    hit.at = Date.now()
    return hit.parsed
  }
  const parsed = readCloudFile(file)
  parsed.bounds = boundsOf(parsed.positions, parsed.count)
  parsed.key = key
  cache.set(key, { key, at: Date.now(), parsed })
  while (cache.size > CACHE_MAX) cache.delete(cache.keys().next().value)
  return parsed
}

export function cacheStats() {
  return { entries: cache.size, max: CACHE_MAX, ttlMs: CACHE_TTL_MS }
}

/**
 * 量化器：按包围盒把 float 映射到 uint16。scale/origin 随分页一起下发，客户端反量化。
 */
function makeQuantizer(bounds) {
  const origin = bounds.min
  const scale = [
    Math.max((bounds.max[0] - bounds.min[0]) / 65535, 1e-9),
    Math.max((bounds.max[1] - bounds.min[1]) / 65535, 1e-9),
    Math.max((bounds.max[2] - bounds.min[2]) / 65535, 1e-9),
  ]
  return { origin, scale }
}

/**
 * 把一段坐标量化成 base64。
 * @param compsPerItem 每项的分量数：点云=3(xyz)，三角面=9(3 顶点 × xyz)。
 *   这个参数不能省——写死 3 会让网格每面只编码 1/3 个顶点，
 *   客户端拿到的三角汤是残缺的，包围盒还会偏小（实测 Z 长 0.2056 m 只解出 0.1126 m）。
 */
function encodePage(positions, from, to, quant, compsPerItem) {
  const n = to - from
  const buf = Buffer.allocUnsafe(n * compsPerItem * 2)
  const { origin, scale } = quant
  const stride = compsPerItem
  for (let i = 0; i < n; i++) {
    const s = (from + i) * stride
    const d = i * stride * 2
    for (let a = 0; a < stride; a++) {
      let q = Math.round((positions[s + a] - origin[a % 3]) / scale[a % 3])
      if (q < 0) q = 0
      else if (q > 65535) q = 65535
      buf.writeUInt16LE(q, d + a * 2)
    }
  }
  return buf.toString('base64')
}

/**
 * 点云分页载荷（uint16 量化）。
 * @returns 供 AGH 服务直接返回的对象
 */
export function cloudPage(file, offset, limit) {
  const parsed = loadParsed(file)
  const total = parsed.count
  const from = Math.max(0, Math.min(total, Number(offset) || 0))
  const want = Math.max(1, Math.min(PAGE_LIMIT, Number(limit) || PAGE_LIMIT))
  const to = Math.min(total, from + want)
  const quant = makeQuantizer(parsed.bounds)
  return {
    file,
    format: parsed.format,
    kind: parsed.kind,
    total,
    offset: from,
    returned: to - from,
    bbox_min: parsed.bounds.min,
    bbox_max: parsed.bounds.max,
    span: parsed.bounds.span,
    encoding: 'uint16',
    origin: quant.origin,
    scale: quant.scale,
    components: 3,
    positions: encodePage(parsed.positions, from, to, quant, 3),
  }
}

/** 网格分页载荷（三角汤，uint16 量化；每面 3 顶点 × 3 分量 = 18 B/面） */
export function meshPage(file, offset, limit) {
  const parsed = loadParsed(file)
  if (parsed.kind !== 'mesh') throw new Error('该文件不是网格（STL）')
  // 分页以「面」为单位；包围盒由顶点数（parsed.count）算，别用 faces 当 count
  const total = parsed.faces ?? parsed.count / 3
  const from = Math.max(0, Math.min(total, Number(offset) || 0))
  const want = Math.max(1, Math.min(PAGE_LIMIT, Number(limit) || PAGE_LIMIT))
  const to = Math.min(total, from + want)
  const quant = makeQuantizer(parsed.bounds)
  return {
    file,
    format: parsed.format,
    total,
    offset: from,
    returned: to - from,
    bbox_min: parsed.bounds.min,
    bbox_max: parsed.bounds.max,
    encoding: 'uint16',
    origin: quant.origin,
    scale: quant.scale,
    components: 9,
    positions: encodePage(parsed.positions, from, to, quant, 9),
  }
}

/** 只读元信息（用于 HUD 与格式诊断，不传点） */
export function cloudMeta(file) {
  const parsed = loadParsed(file)
  return {
    file,
    format: parsed.format,
    kind: parsed.kind,
    points: parsed.kind === 'mesh' ? parsed.count : parsed.count,
    faces: parsed.faces ?? null,
    bbox_min: parsed.bounds.min,
    bbox_max: parsed.bounds.max,
    span: parsed.bounds.span,
    centered: false, // 云铸 CLI 仅对 TXT/STL 做质心居中；PLY/PCD 保留原采集坐标系
  }
}