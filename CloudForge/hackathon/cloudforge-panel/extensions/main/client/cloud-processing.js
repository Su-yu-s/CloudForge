import { pointDistance } from './geometry.js'

const SIGMA_K = 2.5
const SIGMA_CAP = 0.05

/** 精确沿用几何判据与输入顺序；分片让出主线程，不抽样点云。 */
export async function splitInliers(positions, shapes, { signal, yieldTask = () => new Promise((resolve) => setTimeout(resolve, 0)), now = () => performance.now() } = {}) {
  const out = []
  const count = Math.floor(positions.length / 3)
  let sliceStart = now()
  for (const shape of shapes) {
    signal?.throwIfAborted()
    const tolerance = Math.min(SIGMA_K * (shape.robust_sigma || 0.002), SIGMA_CAP)
    const picked = []
    for (let i = 0; i < count; i++) {
      const j = i * 3
      if (pointDistance(shape, positions[j], positions[j + 1], positions[j + 2]) <= tolerance) {
        picked.push(positions[j], positions[j + 1], positions[j + 2])
      }
      // 不在每个点上读时钟；最多每 2048 个点检查一次 8ms 时间片。
      if ((i + 1) % 2048 === 0 && now() - sliceStart >= 8) {
        await yieldTask()
        signal?.throwIfAborted()
        sliceStart = now()
      }
    }
    out.push(picked.length >= 3 ? Float32Array.from(picked) : null)
    if (now() - sliceStart >= 8) {
      await yieldTask()
      signal?.throwIfAborted()
      sliceStart = now()
    }
  }
  return out
}
