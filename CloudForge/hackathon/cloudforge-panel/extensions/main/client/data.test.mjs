import assert from 'node:assert/strict'
import test from 'node:test'
import { createData } from './data.js'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { resolve, reject, promise }
}

function page(values, total) {
  const encoded = Buffer.alloc(values.length * 2)
  values.forEach((value, i) => encoded.writeUInt16LE(value, i * 2))
  return {
    ok: true, returned: values.length / 3, total, encoding: 'uint16', positions: encoded.toString('base64'),
    origin: [0, 0, 0], scale: [1, 1, 1], bbox_min: [0, 0, 0], bbox_max: [9, 9, 9], span: 9,
  }
}

test('simultaneous reads share an RPC, subsequent refresh rereads, writes remain separate', async () => {
  const first = deferred()
  let calls = 0
  const data = createData({ agnes: { services: { call() { calls++; return first.promise } } } })
  const one = data.scene('run')
  const two = data.scene('run')
  assert.equal(calls, 1)
  assert.equal(one, two)
  first.resolve({ ok: true })
  await one
  await data.scene('run')
  assert.equal(calls, 2, 'completed responses must not become a stale file cache')
  await Promise.all([data.pickCloud(), data.pickCloud()])
  assert.equal(calls, 4, 'a file dialog request must never be deduplicated')
})

test('failed shared queries can be retried', async () => {
  let calls = 0
  const data = createData({ agnes: { services: { async call() { if (++calls === 1) throw new Error('offline'); return { ok: true } } } } })
  await assert.rejects(data.report(), /offline/)
  assert.deepEqual(await data.report(), { ok: true })
  assert.equal(calls, 2)
})

test('first point page is delivered before the rest and complete coordinates are preserved', async () => {
  const allowNextPage = deferred()
  const events = []
  const data = createData({ agnes: { services: { async call(name, input) {
    assert.equal(name, 'cloudforge.cloud')
    events.push(`rpc:${input.offset}`)
    return input.offset === 0 ? page([1, 2, 3, 4, 5, 6], 3) : page([7, 8, 9], 3)
  } } } })
  const load = data.loadCloud('cloud.ply', { async onPage(positions, loaded) {
    events.push(`shown:${loaded}`)
    if (loaded === 2) await allowNextPage.promise
  } })
  for (let i = 0; i < 8; i++) await Promise.resolve()
  assert.deepEqual(events, ['rpc:0', 'shown:2'])
  allowNextPage.resolve()
  const result = await load
  assert.deepEqual(events, ['rpc:0', 'shown:2', 'rpc:2', 'shown:3'])
  assert.deepEqual(Array.from(result.positions), [1, 2, 3, 4, 5, 6, 7, 8, 9])
  assert.equal(result.count, 3)
})

test('cancelled point loads suppress late callbacks and further RPCs', async () => {
  const response = deferred()
  const controller = new AbortController()
  let calls = 0
  let callbacks = 0
  const data = createData({ agnes: { services: { call() { calls++; return response.promise } } } })
  const load = data.loadCloud('old.ply', { signal: controller.signal, onPage() { callbacks++ }, onProgress() { callbacks++ } })
  controller.abort()
  response.resolve(page([1, 2, 3], 2))
  await assert.rejects(load, { name: 'AbortError' })
  assert.equal(calls, 1)
  assert.equal(callbacks, 0)
  await assert.rejects(data.loadCloud('old.ply', { signal: controller.signal }), { name: 'AbortError' })
  assert.equal(calls, 1)
})
