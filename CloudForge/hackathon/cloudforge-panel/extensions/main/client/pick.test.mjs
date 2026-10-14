import assert from 'node:assert/strict'
import test from 'node:test'
import { pickNativeFile } from './pick.js'

function controls() {
  const classes = new Set()
  return {
    btn: { disabled: false, textContent: '选择文件' },
    statusEl: {
      textContent: '',
      classList: {
        toggle(name, enabled) { enabled ? classes.add(name) : classes.delete(name) },
        remove(name) { classes.delete(name) },
        contains(name) { return classes.has(name) },
      },
    },
  }
}

function defer() {
  let resolve
  let reject
  const promise = new Promise((res, rej) => { resolve = res; reject = rej })
  return { promise, resolve, reject }
}

async function flush() {
  // Let the RPC continuations and timer continuation update the controls.
  for (let i = 0; i < 8; i++) await Promise.resolve()
}

function clock(t) {
  t.mock.timers.enable({ apis: ['Date', 'setTimeout'], now: 0 })
}

test('immediate feedback, startup readiness, first query and duplicate click', async (t) => {
  clock(t)
  const ui = controls()
  const begin = defer()
  const picked = []
  let starts = 0
  let queries = 0
  const states = [
    { state: 'starting' },
    { state: 'pending' },
    { state: 'picked', path: 'E:/cloud.ply', name: 'cloud.ply', size: 2048 },
  ]
  const data = {
    pickCloud(exts) { starts++; assert.deepEqual(exts, ['ply']); return begin.promise },
    async pickStatus(id) { assert.equal(id, 'picker-1'); queries++; return states.shift() },
  }
  const opts = { ...ui, data, exts: ['ply'], onPicked: (r) => picked.push(r) }
  const run = pickNativeFile(opts)
  assert.equal(ui.btn.disabled, true)
  assert.equal(ui.btn.textContent, '打开中…')
  assert.equal(ui.statusEl.textContent, '正在打开系统文件对话框…')
  await pickNativeFile(opts)
  assert.equal(starts, 1)

  begin.resolve({ id: 'picker-1', state: 'starting' })
  await flush()
  assert.equal(queries, 1, 'the first status query must not wait for a timer')
  assert.equal(ui.btn.textContent, '打开中…')
  t.mock.timers.tick(199)
  await flush()
  assert.equal(queries, 1)
  t.mock.timers.tick(1)
  await flush()
  assert.equal(ui.btn.textContent, '选择中…')
  assert.equal(ui.statusEl.textContent, '请在系统文件对话框中选择文件…')
  t.mock.timers.tick(200)
  await run
  assert.equal(picked.length, 1)
  assert.equal(picked[0].path, 'E:/cloud.ply')
  assert.equal(ui.statusEl.textContent, '已选择 cloud.ply（2 KB）')
  assert.equal(ui.btn.disabled, false)
  assert.equal(ui.btn.textContent, '选择文件')
})

test('polling slows after startup and timeout is based on elapsed time', async (t) => {
  clock(t)
  const ui = controls()
  let queries = 0
  let finish = false
  const data = {
    async pickCloud() { return { id: 'picker-2' } },
    async pickStatus() { queries++; return { state: finish ? 'cancelled' : 'pending' } },
  }
  const run = pickNativeFile({ ...ui, data })
  await flush()
  for (let i = 0; i < 10; i++) {
    t.mock.timers.tick(200)
    await flush()
  }
  const afterStartup = queries
  t.mock.timers.tick(799)
  await flush()
  assert.equal(queries, afterStartup)
  finish = true
  t.mock.timers.tick(1)
  await run
  assert.equal(ui.statusEl.textContent, '已取消选择')

  data.pickStatus = async () => {
    // A slow RPC consumes the whole wait budget without requiring 750 polls.
    t.mock.timers.tick(10 * 60 * 1000)
    return { state: 'pending' }
  }
  await pickNativeFile({ ...ui, data })
  assert.match(ui.statusEl.textContent, /等待超过 10 分钟/)
  assert.equal(ui.btn.disabled, false)
})

test('all terminal outcomes and RPC failures restore the button', async (t) => {
  clock(t)
  const cases = [
    [{ state: 'cancelled' }, '已取消选择'],
    [{ state: 'invalid', reason: '空文件', path: 'E:/empty.ply' }, '无效文件：空文件（E:/empty.ply）'],
    [{ state: 'expired' }, '对话框超时未确认，已自动放弃'],
    [{ state: 'unknown' }, '选择会话已失效，请重试'],
    [{ state: 'failed', error: '进程未启动' }, '选择失败：进程未启动'],
  ]
  for (const [result, expected] of cases) {
    const ui = controls()
    let picked = false
    await pickNativeFile({
      ...ui,
      data: { async pickCloud() { return { id: 'picker-3' } }, async pickStatus() { return result } },
      onPicked() { picked = true },
    })
    assert.equal(ui.statusEl.textContent, expected)
    assert.equal(ui.btn.disabled, false)
    assert.equal(ui.btn.textContent, '选择文件')
    assert.equal(picked, false)
  }
  for (const failure of ['begin', 'query']) {
    const ui = controls()
    let queries = 0
    const run = pickNativeFile({ ...ui, data: {
      async pickCloud() { if (failure === 'begin') throw new Error('连接失败'); return { id: 'picker-4' } },
      async pickStatus() { queries++; throw new Error('连接失败') },
    } })
    await flush()
    if (failure === 'query') {
      for (const delay of [200, 400, 800]) {
        assert.equal(ui.btn.disabled, true)
        const before = queries
        t.mock.timers.tick(delay - 1)
        await flush()
        assert.equal(queries, before)
        t.mock.timers.tick(1)
        await flush()
      }
      assert.equal(queries, 4, 'a failed status query gets at most three retries')
    }
    await run
    assert.equal(ui.statusEl.textContent, failure === 'begin' ? '选择失败：连接失败' : '状态查询失败：连接失败；请关闭系统文件对话框后重试')
    assert.equal(ui.btn.disabled, false)
    assert.equal(ui.btn.textContent, '选择文件')
  }

  // 一次成功查询会重置失败计数，后续瞬时故障仍从 200ms 重试开始。
  const ui = controls()
  let queries = 0
  const responses = [new Error('断网'), { state: 'pending' }, new Error('再次断网'), { state: 'cancelled' }]
  const recovery = pickNativeFile({ ...ui, data: {
    async pickCloud() { return { id: 'picker-recovery' } },
    async pickStatus() {
      queries++
      const result = responses.shift()
      if (result instanceof Error) throw result
      return result
    },
  } })
  await flush()
  assert.equal(queries, 1)
  t.mock.timers.tick(200)
  await flush()
  assert.equal(queries, 2)
  t.mock.timers.tick(200)
  await flush()
  assert.equal(queries, 3)
  t.mock.timers.tick(200)
  await flush()
  assert.equal(queries, 4)
  await recovery
  assert.equal(ui.statusEl.textContent, '已取消选择')
  assert.equal(ui.btn.disabled, false)
})

test('an earlier result timer cannot clear a new selection status', async (t) => {
  clock(t)
  const ui = controls()
  let waiting = false
  const data = {
    async pickCloud() { return { id: 'picker-5' } },
    async pickStatus() { return { state: waiting ? 'pending' : 'cancelled' } },
  }
  await pickNativeFile({ ...ui, data })
  t.mock.timers.tick(29000)
  waiting = true
  const nextRun = pickNativeFile({ ...ui, data })
  await flush()
  t.mock.timers.tick(1000)
  await flush()
  assert.equal(ui.statusEl.textContent, '请在系统文件对话框中选择文件…')
  assert.equal(ui.statusEl.classList.contains('on'), true)
  waiting = false
  t.mock.timers.tick(200)
  await nextRun
  t.mock.timers.tick(29999)
  assert.equal(ui.statusEl.textContent, '已取消选择')
  t.mock.timers.tick(1)
  assert.equal(ui.statusEl.textContent, '')
  assert.equal(ui.statusEl.classList.contains('on'), false)
})
