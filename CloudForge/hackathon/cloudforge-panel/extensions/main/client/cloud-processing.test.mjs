import assert from 'node:assert/strict'
import test from 'node:test'
import { pointDistance } from './geometry.js'
import { splitInliers } from './cloud-processing.js'

test('all geometric subsets exactly match the existing distance rule and point order', async () => {
  const positions = Float32Array.from([0, 0, 0, 0.5, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0.05, 2, 0, 3])
  const shapes = [
    { type: 'Plane', coefficients: [0, 0, 1, 0], robust_sigma: 0 },
    { type: 'Cylinder', coefficients: [0, 0, 0, 0, 0, 2, 1], robust_sigma: 0.001 },
    { type: 'Sphere', coefficients: [0, 0, 0, 1], robust_sigma: 0.2 },
    { type: 'Cone', coefficients: [0, 0, 0, 0, 0, 1, Math.PI / 4], robust_sigma: 0.004 },
    { type: 'Unknown', coefficients: [], robust_sigma: 1 },
  ]
  const expected = shapes.map((shape) => {
    const points = []
    const tolerance = Math.min(2.5 * (shape.robust_sigma || 0.002), 0.05)
    for (let j = 0; j < positions.length; j += 3) {
      if (pointDistance(shape, ...positions.subarray(j, j + 3)) <= tolerance) points.push(...positions.subarray(j, j + 3))
    }
    return points.length ? Float32Array.from(points) : null
  })
  assert.deepEqual(await splitInliers(positions, shapes), expected)
})

test('large computations yield for input handling and an aborted computation stops', async () => {
  const positions = new Float32Array(6144 * 3)
  const shapes = [{ type: 'Plane', coefficients: [0, 0, 1, 0] }]
  let ticks = 0
  let yields = 0
  const subsets = await splitInliers(positions, shapes, { now: () => ticks++ * 8, async yieldTask() { yields++ } })
  assert.ok(yields >= 3, 'the UI must receive execution time during a large exact split')
  assert.deepEqual(subsets[0], positions)
  const controller = new AbortController()
  let cancelledYields = 0
  await assert.rejects(splitInliers(positions, shapes, {
    signal: controller.signal,
    now: () => ticks++ * 8,
    async yieldTask() { cancelledYields++; controller.abort() },
  }), { name: 'AbortError' })
  assert.equal(cancelledYields, 1)
})
