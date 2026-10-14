// 云铸面板 · 点云/网格文件解析（零依赖，仅用 Node 内置 fs）
// 支持三种实测格式（其余明确报错，不静默降级）：
//   1. PLY  ascii 1.0                    —— demo_model_cloud.ply（120,000 点）
//   2. PLY  binary_little_endian 1.0     —— livingroom cloud_bin_0.ply（196,133 点，31 B/点，含 RGB+法向+曲率）
//   3. PCD  DATA binary                  —— demo.pcd / part.pcd（65,000 点，12 B/点）
//   4. STL  ascii / binary               —— CAD 预览网格
//
// 关键约定：binary 一律**按 property/field 表算 stride 与偏移**取 x/y/z，
// 绝不能假设 xyz 连续——livingroom 那份每点 31 字节且 xyz 是前 12 字节，
// 但换一份带前置属性的文件就会整体错位。

import { closeSync, openSync, readFileSync, readSync, statSync } from 'node:fs'

const PLY_SCALARS = {
  char: 1, int8: 1,
  uchar: 1, uint8: 1,
  short: 2, int16: 2,
  ushort: 2, uint16: 2,
  int: 4, int32: 4,
  uint: 4, uint32: 4,
  float: 4, float32: 4,
  double: 8, float64: 8,
}

const PLY_READERS = {
  char: 'readInt8', int8: 'readInt8', uchar: 'readUInt8', uint8: 'readUInt8',
  short: 'readInt16LE', int16: 'readInt16LE', ushort: 'readUInt16LE', uint16: 'readUInt16LE',
  int: 'readInt32LE', int32: 'readInt32LE', uint: 'readUInt32LE', uint32: 'readUInt32LE',
  float: 'readFloatLE', float32: 'readFloatLE', double: 'readDoubleLE', float64: 'readDoubleLE',
}

const PCD_SCALARS = { I: 1, U: 1, F: 4 }

class CloudFormatError extends Error {
  constructor(message, detail) {
    super(message)
    this.name = 'CloudFormatError'
    this.detail = detail
  }
}

function readHeaderLines(read, firstBytes) {
  // 返回 { header: string, dataOffset: number }；header 以 end_header 行结束
  const buf = firstBytes ?? Buffer.alloc(0)
  const text = buf.toString('latin1')
  const idx = text.indexOf('end_header')
  if (idx < 0) throw new CloudFormatError('PLY 头部缺少 end_header')
  const nl = text.indexOf('\n', idx)
  if (nl < 0) throw new CloudFormatError('PLY 头部缺少 end_header 换行')
  return { header: text.slice(0, nl), dataOffset: nl + 1 }
}

/** 解析 PLY，返回 { kind:'points', positions: Float32Array, count, format } */
function parsePly(file, stat) {
  const fd = openSync(file, 'r')
  try {
    const probeSize = Math.min(65536, stat.size)
    const probe = Buffer.alloc(probeSize)
    const got = readSync(fd, probe, 0, probeSize, 0)
    const { header, dataOffset } = readHeaderLines(null, probe.subarray(0, got))
    const lines = header.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)

    let format = null
    let vertexCount = 0
    let inVertex = false
    let vertexProps = []
    const scalarIndex = new Map()
    let cursor = 0
    for (const line of lines) {
      const tok = line.split(/\s+/)
      if (tok[0] === 'format') {
        format = tok[1]
      } else if (tok[0] === 'element') {
        inVertex = tok[1] === 'vertex'
        if (inVertex) vertexCount = Number.parseInt(tok[2], 10)
        else if (!vertexProps.length && Number(tok[2]) > 0)
          throw new CloudFormatError('PLY 顶点前含其他元素数据，暂不支持此布局')
      } else if (tok[0] === 'property' && inVertex) {
        if (tok[1] === 'list') {
          throw new CloudFormatError('PLY 顶点包含 list 属性，暂不支持此布局')
        } else {
          const size = PLY_SCALARS[tok[1]]
          if (!size) throw new CloudFormatError(`PLY 不支持的属性类型：${tok[1]}`)
          if (!scalarIndex.has(tok[2])) scalarIndex.set(tok[2], { offset: cursor, index: vertexProps.length, type: tok[1] })
          vertexProps.push(size)
          cursor += size
        }
      }
    }
    if (!format) throw new CloudFormatError('PLY 头部缺少 format')
    if (!Number.isSafeInteger(vertexCount) || vertexCount <= 0 || !scalarIndex.has('x') || !scalarIndex.has('y') || !scalarIndex.has('z'))
      throw new CloudFormatError('PLY 缺少 vertex element 或 x/y/z 属性')

    const xyz = ['x', 'y', 'z'].map((name) => scalarIndex.get(name))
    const positions = new Float32Array(vertexCount * 3)
    if (format.startsWith('ascii')) {
      const text = readFileSync(file, 'latin1')
      const body = text.slice(dataOffset)
      let vi = 0
      let p = 0
      while (vi < vertexCount) {
        while (p < body.length && (body[p] === '\n' || body[p] === '\r' || body[p] === ' ')) p++
        if (p >= body.length) break
        let e = p
        while (e < body.length && body[e] !== '\n' && body[e] !== '\r') e++
        const fields = body.slice(p, e).trim().split(/\s+/)
        if (fields.length < vertexProps.length) throw new CloudFormatError(`PLY ascii 第 ${vi + 1} 个顶点属性不足`)
        for (let axis = 0; axis < 3; axis++) positions[vi * 3 + axis] = Number(fields[xyz[axis].index])
        vi++
        p = e + 1
      }
      if (vi < vertexCount) throw new CloudFormatError(`PLY ascii 顶点不足：读到 ${vi}/${vertexCount}`)
      return { kind: 'points', positions, count: vertexCount, format: 'ply-ascii' }
    }

    if (format !== 'binary_little_endian')
      throw new CloudFormatError(`PLY 不支持的格式：${format}（仅支持 ascii / binary_little_endian）`)

    const stride = vertexProps.reduce((a, b) => a + (b ?? 0), 0)
    const need = dataOffset + stride * vertexCount
    if (stat.size < need)
      throw new CloudFormatError(`PLY 文件截断：需要 ${need} 字节，实际 ${stat.size}`)
    const raw = readFileSync(file)
    const base = raw.subarray(dataOffset)
    for (let i = 0; i < vertexCount; i++) {
      const off = i * stride
      for (let axis = 0; axis < 3; axis++) {
        const prop = xyz[axis]
        positions[i * 3 + axis] = base[PLY_READERS[prop.type]](off + prop.offset)
      }
    }
    return { kind: 'points', positions, count: vertexCount, format: 'ply-binary-le' }
  } finally {
    closeSync(fd)
  }
}

/** 解析 PCD，返回 { kind:'points', positions, count, format } */
function parsePcd(file, stat) {
  const text = readFileSync(file, 'latin1')
  const dataIdx = text.search(/^DATA\s+/m)
  if (dataIdx < 0) throw new CloudFormatError('PCD 头部缺少 DATA')
  const header = text.slice(0, dataIdx)
  const dataToken = /^DATA\s+(\S+)\s*$/m.exec(text.slice(dataIdx))?.[1]
  if (!dataToken) throw new CloudFormatError('PCD 头部缺少 DATA 值')
  const fields = /^FIELDS\s+(.+)$/m.exec(header)?.[1]?.trim().split(/\s+/)
  const sizes = /^SIZE\s+(.+)$/m.exec(header)?.[1]?.trim().split(/\s+/).map(Number)
  const types = /^TYPE\s+(.+)$/m.exec(header)?.[1]?.trim().split(/\s+/)
  const counts = (/^COUNT\s+(.+)$/m.exec(header)?.[1]?.trim().split(/\s+/).map(Number)) ?? fields?.map(() => 1)
  const points = Number.parseInt(/^POINTS\s+(\d+)$/m.exec(header)?.[1] ?? '', 10)
  if (!fields || !sizes || !types || !points) throw new CloudFormatError('PCD 头部不完整（FIELDS/SIZE/TYPE/POINTS）')
  if (fields.length !== sizes.length || fields.length !== types.length || fields.length !== counts.length)
    throw new CloudFormatError('PCD FIELDS/SIZE/TYPE/COUNT 数量不一致')
  if (!Number.isSafeInteger(points) || points <= 0 || counts.some((n) => !Number.isSafeInteger(n) || n <= 0)
    || sizes.some((n) => !Number.isSafeInteger(n) || n <= 0))
    throw new CloudFormatError('PCD POINTS/SIZE/COUNT 必须是有效正整数')

  const stride = sizes.reduce((a, s, i) => a + s * (counts[i] ?? 1), 0)
  const offsets = []
  const columns = []
  let acc = 0
  let column = 0
  for (let i = 0; i < fields.length; i++) {
    offsets.push(acc)
    columns.push(column)
    acc += sizes[i] * (counts[i] ?? 1)
    column += counts[i]
  }
  const xi = fields.indexOf('x')
  const yi = fields.indexOf('y')
  const zi = fields.indexOf('z')
  if (xi < 0 || yi < 0 || zi < 0) throw new CloudFormatError('PCD 缺少 x/y/z 字段')
  if ([xi, yi, zi].some((i) => counts[i] !== 1)) throw new CloudFormatError('PCD x/y/z 必须是标量字段')

  const positions = new Float32Array(points * 3)
  const readOne = (dataBuf, base, off, fieldIdx) => {
    const t = types[fieldIdx]
    const size = sizes[fieldIdx]
    if (t === 'F' && size === 4) return dataBuf.readFloatLE(base + off)
    if (t === 'F' && size === 8) return dataBuf.readDoubleLE(base + off)
    if (t === 'U' && size === 1) return dataBuf.readUInt8(base + off)
    if (t === 'U' && size === 2) return dataBuf.readUInt16LE(base + off)
    if (t === 'U' && size === 4) return dataBuf.readUInt32LE(base + off)
    if (t === 'I' && size === 1) return dataBuf.readInt8(base + off)
    if (t === 'I' && size === 2) return dataBuf.readInt16LE(base + off)
    if (t === 'I' && size === 4) return dataBuf.readInt32LE(base + off)
    throw new CloudFormatError(`PCD 不支持的字段类型 ${t}${size}`)
  }

  // DATA 行结束处即数据体起点（按字节对齐，不做任何二次编码）
  const dataLineEnd = text.indexOf('\n', dataIdx)
  const bodyStart = dataLineEnd < 0 ? text.length : dataLineEnd + 1
  if (dataToken === 'binary') {
    const need = bodyStart + stride * points
    if (stat.size < need) throw new CloudFormatError(`PCD 文件截断：需要 ${need} 字节，实际 ${stat.size}`)
    // latin1 是字节保真的单字节编码：每个字符恰好对应一个字节，便于 readFloatLE 直接寻址
    const raw = Buffer.from(text, 'latin1')
    for (let i = 0; i < points; i++) {
      const base = bodyStart + i * stride
      positions[i * 3] = readOne(raw, base, offsets[xi], xi)
      positions[i * 3 + 1] = readOne(raw, base, offsets[yi], yi)
      positions[i * 3 + 2] = readOne(raw, base, offsets[zi], zi)
    }
    return { kind: 'points', positions, count: points, format: 'pcd-binary' }
  }
  if (dataToken === 'ascii') {
    const body = text.slice(bodyStart)
    const rows = body.trim().split(/\r?\n/)
    if (rows.length < points) throw new CloudFormatError(`PCD ascii 顶点不足：${rows.length}/${points}`)
    for (let i = 0; i < points; i++) {
      const f = rows[i].trim().split(/\s+/)
      if (f.length < column) throw new CloudFormatError(`PCD ascii 第 ${i + 1} 个点字段不足`)
      positions[i * 3] = Number(f[columns[xi]])
      positions[i * 3 + 1] = Number(f[columns[yi]])
      positions[i * 3 + 2] = Number(f[columns[zi]])
    }
    return { kind: 'points', positions, count: points, format: 'pcd-ascii' }
  }
  throw new CloudFormatError(`PCD 不支持的 DATA：${dataToken}（binary_compressed 需 LZF，本面板不支持，请先转 binary）`)
}

/** 解析 STL，返回 { kind:'mesh', positions: Float32Array(9 顶点/面), count: 顶点数, faces: 三角面数, format } */
function parseStl(file, stat) {
  const raw = readFileSync(file)
  const head = raw.subarray(0, 80).toString('latin1')
  const binaryCount = stat.size >= 84 ? raw.readUInt32LE(80) : 0
  const looksBinary =
    stat.size >= 84 && binaryCount > 0 && stat.size === 84 + binaryCount * 50
  if (looksBinary) {
    const positions = new Float32Array(binaryCount * 9)
    for (let t = 0; t < binaryCount; t++) {
      const base = 84 + t * 50 + 12 // 跳过法向 3×f32
      for (let v = 0; v < 3; v++) {
        positions[t * 9 + v * 3] = raw.readFloatLE(base + v * 12)
        positions[t * 9 + v * 3 + 1] = raw.readFloatLE(base + v * 12 + 4)
        positions[t * 9 + v * 3 + 2] = raw.readFloatLE(base + v * 12 + 8)
      }
    }
    // count 必须是**顶点数**，boundsOf 按 count 走点数组；面数另存 faces 供分页用
    return { kind: 'mesh', positions, count: binaryCount * 3, faces: binaryCount, format: 'stl-binary' }
  }
  if (!/^\s*solid/.test(head)) throw new CloudFormatError('STL 既非 binary（长度不符）也非 ascii')
  const text = raw.toString('latin1')
  const positions = []
  const re = /vertex\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)\s+(-?[\d.eE+-]+)/g
  let m
  while ((m = re.exec(text)) !== null) {
    positions.push(Number.parseFloat(m[1]), Number.parseFloat(m[2]), Number.parseFloat(m[3]))
  }
  const total = Math.floor(positions.length / 9)
  const out = new Float32Array(total * 9)
  out.set(positions.subarray(0, total * 9))
  if (total === 0) throw new CloudFormatError('STL 未读到三角面')
  return { kind: 'mesh', positions: out, count: total * 3, faces: total, format: 'stl-ascii' }
}

/** 统一入口：按扩展名分派 */
export function readCloudFile(file) {
  let stat
  try {
    stat = statSync(file)
  } catch {
    throw new CloudFormatError(`文件不存在：${file}`)
  }
  if (!stat.isFile()) throw new CloudFormatError(`不是文件：${file}`)
  if (stat.size === 0) throw new CloudFormatError(`空文件：${file}`)
  const lower = file.toLowerCase()
  if (lower.endsWith('.ply')) return parsePly(file, stat)
  if (lower.endsWith('.pcd')) return parsePcd(file, stat)
  if (lower.endsWith('.stl')) return parseStl(file, stat)
  throw new CloudFormatError(`不支持的扩展名：${file}`)
}

/** 包围盒与跨度（输入为 xyz 扁平数组） */
export function boundsOf(positions, count) {
  let minX = Infinity, minY = Infinity, minZ = Infinity
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity
  const step = count > 200000 ? 3 : 1
  for (let i = 0; i < count; i += step) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2]
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (z < minZ) minZ = z
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
    if (z > maxZ) maxZ = z
  }
  return {
    min: [minX, minY, minZ],
    max: [maxX, maxY, maxZ],
    span: Math.max(maxX - minX, maxY - minY, maxZ - minZ),
  }
}

export { CloudFormatError }
