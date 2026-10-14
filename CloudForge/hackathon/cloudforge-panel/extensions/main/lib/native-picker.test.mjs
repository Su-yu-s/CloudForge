import assert from 'node:assert/strict'
import { EventEmitter } from 'node:events'
import { mkdtempSync, rmdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { createNativePicker, WINDOWS_PICKER_SCRIPT } from './native-picker.mjs'
import { runtime, SERVICES } from '../index.mjs'

function harness() {
  const children = []
  const scheduled = new Set()
  const timers = {
    setTimeout(callback, ms) {
      const timer = { callback, ms, unref() {} }
      scheduled.add(timer)
      return timer
    },
    clearTimeout(timer) { scheduled.delete(timer) },
  }
  const picker = createNativePicker({
    workspace: tmpdir(), platform: 'win32', timers,
    spawnProcess(exe, args, options) {
      const child = new EventEmitter()
      child.exe = exe
      child.args = args
      child.options = options
      child.killed = false
      child.unref = () => {}
      child.kill = () => { child.killed = true }
      child.sent = []
      for (const key of ['stdin', 'stdout', 'stderr']) {
        child[key] = new EventEmitter()
        child[key].setEncoding = () => {}
        child[key].destroy = () => { child[key].destroyed = true }
      }
      child.stdin.write = (line, encoding, callback) => { child.sent.push(JSON.parse(line)); callback() }
      child.event = (message) => child.stdout.emit('data', JSON.stringify(message) + '\n')
      children.push(child)
      return child
    },
  })
  return { picker, children, scheduled }
}

test('begin is immediate, reports initialization honestly and reuses the STA process', (t) => {
  const { picker, children, scheduled } = harness()
  t.after(() => picker.dispose())
  assert.equal(children.length, 0)
  const first = picker.begin()
  assert.deepEqual(Object.keys(first).sort(), ['id', 'ok'])
  assert.deepEqual(picker.status(first), { state: 'starting' })
  const child = children[0]
  assert.ok(child.args.includes('-NoProfile'))
  assert.ok(child.args.includes('-STA'))
  assert.equal(child.options.windowsHide, true)
  child.event({ event: 'ready' })
  assert.equal(child.sent[0].id, first.id)
  assert.deepEqual(picker.status(first), { state: 'starting' })
  child.event({ event: 'shown', id: first.id })
  assert.deepEqual(picker.status(first), { state: 'pending' })
  assert.equal(picker.begin().ok, false)
  child.event({ event: 'result', id: first.id, state: 'cancelled' })
  assert.deepEqual(picker.status(first), { state: 'cancelled' })
  assert.deepEqual(picker.status(first), { state: 'unknown' })
  assert.ok([...scheduled].some((timer) => timer.ms === 15 * 60 * 1000), 'ready helpers stay idle for 15 minutes')
  const next = picker.begin(['.STEP', 'stp', "ply'; throw 'oops"])
  assert.equal(children.length, 1)
  assert.equal(child.sent[1].id, next.id)
  assert.match(child.sent[1].filter, /\*\.step;\*\.stp/)
  assert.doesNotMatch(child.sent[1].filter, /throw/)
  assert.ok(![...scheduled].some((timer) => timer.ms === 15 * 60 * 1000), 'an active selection cancels the idle timer')
})

test('selected files keep Unicode paths and get extension/existence/size validation', (t) => {
  const dir = mkdtempSync(join(tmpdir(), 'cf-picker-test-'))
  const { picker, children } = harness()
  const cloud = join(dir, "点云 O'Brien.ply")
  const empty = join(dir, 'empty.ply')
  t.after(() => {
    picker.dispose()
    rmSync(cloud, { force: true })
    rmSync(empty, { force: true })
    rmdirSync(dir)
  })
  writeFileSync(cloud, 'ply\n')
  writeFileSync(empty, '')
  const cases = [
    [cloud, 'picked'],
    [empty, 'invalid'],
    [join(dir, 'missing.ply'), 'invalid'],
    [join(dir, 'other.exe'), 'invalid'],
    ['E:/'.padEnd(8192, 'a') + '.ply', 'invalid'],
    ['E:/' + '点'.repeat(2800) + '.ply', 'invalid'],
  ]
  for (const [path, expected] of cases) {
    const request = picker.begin()
    const child = children[0]
    if (children.length === 1 && child.sent.length === 0) child.event({ event: 'ready' })
    // Split JSON lines must reassemble before interpreting a result.
    const line = JSON.stringify({ event: 'result', id: request.id, state: 'picked', path }) + '\n'
    child.stdout.emit('data', line.slice(0, 5))
    child.stdout.emit('data', line.slice(5))
    const result = picker.status(request)
    assert.equal(result.state, expected)
    if (Buffer.byteLength(path, 'utf8') > 8192) {
      assert.equal(result.path, undefined, 'oversized paths must not be echoed into the service response')
      assert.match(result.reason, /路径过长/)
      assert.ok(Buffer.byteLength(JSON.stringify(result), 'utf8') < 16384)
    } else assert.equal(result.path, path)
    if (expected === 'picked') {
      assert.equal(result.name, "点云 O'Brien.ply")
      assert.equal(result.size, 4)
    }
  }
})

test('spawn errors, closed helper and startup timeouts end pending states', (t) => {
  for (const failure of ['spawn', 'close', 'timeout']) {
    const { picker, children, scheduled } = harness()
    t.after(() => picker.dispose())
    const request = picker.begin()
    const child = children[0]
    if (failure === 'spawn') child.emit('error', new Error('ENOENT'))
    else if (failure === 'close') child.emit('close', 1)
    else [...scheduled].find((timer) => timer.ms === 15000).callback()
    const result = picker.status(request)
    assert.equal(result.state, 'failed')
    assert.ok(result.error)
    assert.equal(child.killed, true)
    assert.equal(child.stdin.destroyed, true)
    assert.equal(picker.begin().ok, true)
    assert.equal(children.length, 2)
    assert.equal(picker.status(request).state, 'unknown')
  }
})

test('idle/expiry and plugin disposal stop helpers and release timers', (t) => {
  const { picker, children, scheduled } = harness()
  t.after(() => picker.dispose())
  let request = picker.begin()
  children[0].event({ event: 'ready' })
  children[0].event({ event: 'result', id: request.id, state: 'cancelled' })
  Array.from(scheduled).find((timer) => timer.ms === 15 * 60 * 1000).callback()
  assert.equal(children[0].killed, true)
  request = picker.begin()
  assert.equal(children.length, 2)
  Array.from(scheduled).find((timer) => timer.ms === 1800000).callback()
  assert.equal(picker.status(request).state, 'expired')
  assert.equal(children[1].killed, true)
  request = picker.begin()
  picker.dispose()
  assert.equal(children[2].killed, true)
  assert.equal(scheduled.size, 0)
  assert.equal(picker.status(request).state, 'unknown')
  const registered = []
  const dispose = runtime.apply({ services: { register(spec) { registered.push(spec) } } })
  assert.equal(registered.length, SERVICES.length)
  assert.equal(typeof dispose, 'function')
  dispose()
})

test('Windows helper parses without showing a native dialog', { skip: process.platform !== 'win32' }, () => {
  const exe = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  const parser = '[Console]::InputEncoding = New-Object System.Text.UTF8Encoding($false); $tokens=$null; $errors=$null; [void][System.Management.Automation.Language.Parser]::ParseInput([Console]::In.ReadToEnd(), [ref]$tokens, [ref]$errors); if ($errors.Count) { $errors | ForEach-Object { [Console]::Error.WriteLine($_.Message) }; exit 1 }'
  const result = spawnSync(exe, ['-NoProfile', '-NonInteractive', '-Command', parser], {
    input: WINDOWS_PICKER_SCRIPT, encoding: 'utf8', windowsHide: true, timeout: 15000,
  })
  assert.equal(result.status, 0, String(result.error || result.stderr))
})

test('Windows helper initializes WinForms and owner properties without displaying windows', { skip: process.platform !== 'win32' }, () => {
  const exe = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  // 在任何 Show/Activate/ShowDialog 之前主动抛出标记，验证实际构造与属性绑定。
  const marker = 'headless-owner-construction-complete'
  const script = WINDOWS_PICKER_SCRIPT.replace('[void]$owner.Show()', `throw '${marker}'`)
  assert.notEqual(script, WINDOWS_PICKER_SCRIPT)
  const result = spawnSync(exe, [
    '-NoProfile', '-STA', '-NonInteractive', '-EncodedCommand', Buffer.from(script, 'utf16le').toString('base64'),
  ], {
    input: JSON.stringify({ id: 'headless-test', filter: '点云 (*.ply)|*.ply', directory: tmpdir() }) + '\n',
    encoding: 'utf8', windowsHide: true, timeout: 15000,
  })
  assert.equal(result.status, 0, String(result.error || result.stderr))
  const events = result.stdout.trim().split(/\r?\n/).map((line) => JSON.parse(line))
  assert.equal(events[0].event, 'ready')
  assert.equal(events[1].state, 'failed')
  assert.equal(events[1].error, marker)
})
