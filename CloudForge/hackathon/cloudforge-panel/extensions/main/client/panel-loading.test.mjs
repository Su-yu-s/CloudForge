// Dependency stubs keep lifecycle tests independent of a browser, GPU and daemon.
// Run with: node --experimental-vm-modules --test extensions/main/client/panel-loading.test.mjs
import assert from 'node:assert/strict'
import test from 'node:test'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import { createData } from './data.js'
import { buildPrimitive } from './geometry.js'
import { splitInliers } from './cloud-processing.js'

class Element {
  constructor(tag) {
    this.tagName = tag
    this.dataset = {}
    this.children = []
    this.listeners = new Map()
    this.classList = {
      toggle() {},
      remove() {},
    }
  }
  appendChild(child) { this.children.push(child); return child }
  replaceChildren(...children) { this.children = children }
  addEventListener(name, fn) { this.listeners.set(name, fn) }
  querySelector(selector) {
    const key = /^\[data-cf="(.+)"\]$/.exec(selector)?.[1]
    for (const child of this.children) {
      if (child?.dataset?.cf === key) return child
      const result = child?.querySelector?.(selector)
      if (result) return result
    }
    return null
  }
}

function el(tag, attrs = {}, children = []) {
  const node = new Element(tag)
  Object.assign(node, attrs)
  if (attrs.dataset) node.dataset = { ...attrs.dataset }
  for (const child of [].concat(children)) node.appendChild(child)
  return node
}
const ui = {
  el,
  icon: () => el('svg'),
  num: (n) => String(n ?? '—'), pct: (n) => `${n * 100}%`, mm: String, ms: String,
  typeCn: String, esc: String, fmtSize: String,
}

function preferences(initialRail = false) {
  let rail = initialRail
  let w = 0
  const subscribers = new Set()
  return {
    bind() {}, rail: () => rail, widthStep: () => w,
    subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn) },
    patch(next) {
      rail = next.rail ?? rail
      w = next.w ?? w
      for (const fn of subscribers) fn({ rail, w })
    },
  }
}

async function sourceModule(file, imports, globals = {}, beforeDynamicImport = async () => {}) {
  const context = vm.createContext({
    window: {}, sessionStorage: { getItem() {}, setItem() {} },
    setTimeout, clearTimeout, AbortController, Float32Array, performance, document: { createElement: (tag) => el(tag) },
    ...globals,
  })
  function dependency(name) {
    const exports = imports[name]
    assert.ok(exports, `unexpected dependency: ${name}`)
    return new vm.SyntheticModule(Object.keys(exports), function () {
      for (const [key, value] of Object.entries(exports)) this.setExport(key, value)
    }, { context })
  }
  const linker = async (name) => {
    if (name === './lazy-tab.js') {
      const lazy = new vm.SourceTextModule(await readFile(new URL('./lazy-tab.js', import.meta.url), 'utf8'), { context })
      await lazy.link(linker)
      return lazy
    }
    return dependency(name)
  }
  const source = await readFile(new URL(file, import.meta.url), 'utf8')
  const module = new vm.SourceTextModule(source, {
    context,
    async importModuleDynamically(name) {
      await beforeDynamicImport(name)
      const imported = dependency(name)
      await imported.link(() => {})
      await imported.evaluate()
      return imported
    },
  })
  await module.link(linker)
  await module.evaluate()
  return { namespace: module.namespace, context }
}

async function settle() {
  for (let i = 0; i < 20; i++) await Promise.resolve()
  await new Promise((resolve) => setTimeout(resolve, 0))
  for (let i = 0; i < 20; i++) await Promise.resolve()
}

function deferred() {
  let resolve
  const promise = new Promise((res) => { resolve = res })
  return { resolve, promise }
}

test('first screen refreshes only the visible tab; collapse and expand reuse it', async () => {
  const prefs = preferences()
  const events = []
  const instances = {}
  const calls = []
  let gatedReport = null
  const factory = (id) => ({ data, state }) => {
    const tab = {
      el: el('section'), refreshes: 0, activates: 0, deactivates: 0,
      setReload() {}, cancelRefresh() {}, render() {}, renderFooter() {}, destroy() {},
      activate() { this.activates++; this.viewer ??= {} },
      deactivate() { this.deactivates++ },
      async refresh() {
        this.refreshes++
        if (id === 'cloud') { state.sceneCache = await data.scene(state.workflow.dir); await data.cloudPage('cloud.ply', 0) }
        if (id === 'verify') await data.suite()
        if (id === 'report') await data.trace()
        events.push(`ready:${id}`)
      },
    }
    instances[id] = tab
    return tab
  }
  const { namespace, context } = await sourceModule('./panel.js', {
    './ui.js': ui,
    './prefs.js': { prefs, WIDTH_STEP_PX: 48 },
    './data.js': { createData },
    './tabs/cloud.js': { createCloudTab: factory('cloud') },
    './tabs/cad.js': { createCadTab: factory('cad') },
    './tabs/verify.js': { createVerifyTab: factory('verify') },
    './tabs/report.js': { createReportTab: factory('report') },
  })
  const panel = namespace.mountPanel(el('host'), { agnes: { services: { async call(name) {
    calls.push(name)
    if (name === 'cloudforge.report') {
      if (gatedReport) return gatedReport.promise
      return { workflows: [{ dir: 'run', name: 'run', points: 2, shapes: 1 }] }
    }
    return { ok: true }
  } } } })
  await settle()
  assert.deepEqual(calls, ['cloudforge.report', 'cloudforge.scene', 'cloudforge.cloud'])
  assert.deepEqual(events, ['ready:cloud'])
  assert.equal(instances.cloud.activates, 1, 'progress and final render must not reactivate the viewer')
  const viewer = instances.cloud.viewer
  prefs.patch({ rail: true })
  prefs.patch({ rail: false })
  prefs.patch({ w: 2 })
  await settle()
  assert.equal(instances.cloud.viewer, viewer)
  assert.equal(instances.cloud.refreshes, 1)
  assert.equal(instances.cloud.activates, 2)
  assert.equal(instances.cloud.deactivates, 1)
  context.window.__CF_DEBUG.selectTab('verify')
  await settle()
  assert.equal(calls.at(-1), 'cloudforge.suite')
  assert.equal(instances.verify.refreshes, 1)
  context.window.__CF_DEBUG.selectTab('report')
  await settle()
  assert.equal(calls.at(-1), 'cloudforge.trace')
  context.window.__CF_DEBUG.selectTab('cloud')
  await settle()
  assert.equal(instances.cloud.refreshes, 1, 'returning to a clean tab must reuse the loaded cloud')
  await context.window.__CF_DEBUG.reload()
  assert.equal(instances.cloud.refreshes, 2, 'explicit refresh must reload current files')
  assert.equal(instances.verify.refreshes, 1, 'hidden tabs remain deferred after refresh')
  const beforeBurst = calls.filter((name) => name === 'cloudforge.report').length
  gatedReport = deferred()
  const burst = context.window.__CF_DEBUG.reload()
  assert.equal(context.window.__CF_DEBUG.reload(), burst)
  assert.equal(context.window.__CF_DEBUG.reload(), burst)
  const gated = gatedReport
  gatedReport = null
  gated.resolve({ workflows: [{ dir: 'run', name: 'run', points: 2, shapes: 1 }] })
  await burst
  assert.equal(calls.filter((name) => name === 'cloudforge.report').length - beforeBurst, 2, 'a burst queues only one reread to catch newer files')
  assert.equal(instances.cloud.refreshes, 3, 'intermediate reports in a refresh burst must not download the same cloud again')
  panel.destroy()
})

test('cloud preview appears before the complete load and reuses its viewer after hiding', async () => {
  const remaining = deferred()
  const snapshots = []
  let viewers = 0
  const viewer = {
    mode: 'detect', visible: false, stage: { resize() {}, faceNormal() {} },
    setMode(mode) { this.mode = mode }, setRemaining() {}, fit() {}, highlight() {}, focusShape() {}, dispose() {},
    setBase(positions) { snapshots.push(Array.from(positions)) },
    setShapes(shapes) { this.shapes = shapes },
  }
  const { namespace } = await sourceModule('./tabs/cloud.js', {
    '../ui.js': ui,
    '../viewer.js': { createCloudViewer: () => { viewers++; return viewer }, PALETTE: [1, 2, 3] },
    '../geometry.js': { buildPrimitive },
    '../cloud-processing.js': { splitInliers },
    '../pick.js': { pickNativeFile() {} },
  })
  const state = { workflow: { dir: 'run', name: 'run' }, message: '' }
  let reads = 0
  const data = {
    async scene() { reads++; return { ok: true, sourceCloud: 'cloud.ply', input_point_count: 2, shapes: [{ id: 0, type: 'Plane', coefficients: [0, 0, 1, 0] }] } },
    async loadCloud(path, { onPage, signal }) {
      await onPage(Float32Array.from([1, 2, 0]), 1, { total: 2, bbox_min: [0, 0, 0], bbox_max: [3, 4, 0], span: 4 })
      await remaining.promise
      signal.throwIfAborted()
      return { positions: Float32Array.from([1, 2, 0, 3, 4, 0]), bbox: { min: [0, 0, 0], max: [3, 4, 0] }, span: 4 }
    },
  }
  const tab = namespace.createCloudTab({ ctx: {}, data, state })
  tab.activate()
  const load = tab.refresh()
  assert.equal(tab.refresh(), load, 'overlapping requests must share the same cloud load')
  await settle()
  assert.deepEqual(snapshots, [[1, 2, 0]], 'the first page must be visible while the rest is still pending')
  assert.equal(state.progress.loaded, 1)
  remaining.resolve()
  await load
  assert.deepEqual(snapshots.at(-1), [1, 2, 0, 3, 4, 0])
  assert.deepEqual(Array.from(viewer.shapes[0].positions), [1, 2, 0, 3, 4, 0])
  assert.equal(viewer.mode, 'detect')
  tab.deactivate()
  assert.equal(viewer.visible, false)
  tab.activate()
  assert.equal(viewer.visible, true)
  assert.equal(viewers, 1)
  assert.equal(reads, 1)
  tab.destroy()
})

test('cancelled cloud responses cannot populate a destroyed viewer', async () => {
  const lateScene = deferred()
  let viewers = 0
  let pointLoads = 0
  const { namespace } = await sourceModule('./tabs/cloud.js', {
    '../ui.js': ui,
    '../viewer.js': { createCloudViewer: () => { viewers++; return {} }, PALETTE: [1] },
    '../geometry.js': { buildPrimitive },
    '../cloud-processing.js': { splitInliers },
    '../pick.js': { pickNativeFile() {} },
  })
  const state = { workflow: { dir: 'old-run', name: 'old' }, message: '' }
  const tab = namespace.createCloudTab({ ctx: {}, state, data: {
    scene: () => lateScene.promise,
    async loadCloud() { pointLoads++ },
  } })
  const load = tab.refresh()
  tab.destroy()
  lateScene.resolve({ ok: true, sourceCloud: 'old.ply' })
  await load
  assert.equal(viewers, 0)
  assert.equal(pointLoads, 0)
  assert.equal(state.sceneCache, undefined)
})

test('the complete panel shell mounts while the heavy cloud module is still unavailable', async () => {
  const heavyModule = deferred()
  const imports = []
  const services = []
  let created = 0
  const factory = () => {
    created++
    return { el: el('section'), activate() {}, deactivate() {}, render() {}, refresh() {}, renderFooter() {}, setReload() {}, destroy() {} }
  }
  const { namespace } = await sourceModule('./panel.js', {
    './ui.js': ui,
    './prefs.js': { prefs: preferences(), WIDTH_STEP_PX: 48 },
    './data.js': { createData },
    './tabs/cloud.js': { createCloudTab: factory },
  }, {}, async (name) => {
    imports.push(name)
    await heavyModule.promise
  })
  const host = el('host')
  const panel = namespace.mountPanel(host, { agnes: { services: { async call(name) {
    services.push(name)
    return { workflows: [{ dir: 'run', name: 'run', points: 2, shapes: 1 }] }
  } } } })
  await settle()
  assert.equal(host.children[0], panel.root)
  assert.equal(panel.root.id, 'cf-console')
  assert.equal(panel.root.children[0].tagName, 'header')
  assert.equal(panel.root.children[1].tagName, 'nav')
  assert.deepEqual(imports, ['./tabs/cloud.js'])
  assert.equal(created, 0, 'neither a GPU viewer nor a tab instance may block the shell')
  assert.deepEqual(services, ['cloudforge.report'], 'workspace reads proceed while the 3D module loads')
  heavyModule.resolve()
  await settle()
  assert.equal(created, 1)
  panel.destroy()
})

test('collapsed startup does not import any view; expanding imports only the selected view', async () => {
  const prefs = preferences(true)
  const imports = []
  const { namespace } = await sourceModule('./panel.js', {
    './ui.js': ui,
    './prefs.js': { prefs, WIDTH_STEP_PX: 48 },
    './data.js': { createData },
    './tabs/cloud.js': { createCloudTab: () => ({ el: el('section'), activate() {}, refresh() {}, setReload() {}, render() {}, destroy() {} }) },
  }, {}, async (name) => { imports.push(name) })
  const panel = namespace.mountPanel(el('host'), { agnes: { services: { async call() { return { workflows: [] } } } } })
  await settle()
  assert.equal(panel.root.dataset.rail, '1')
  assert.deepEqual(imports, [])
  prefs.patch({ rail: false })
  await settle()
  assert.deepEqual(imports, ['./tabs/cloud.js'])
  panel.destroy()
})

test('a saved report tab loads without importing the 3D views', async () => {
  const imports = []
  const services = []
  const { namespace } = await sourceModule('./panel.js', {
    './ui.js': ui,
    './prefs.js': { prefs: preferences(), WIDTH_STEP_PX: 48 },
    './data.js': { createData },
    './tabs/report.js': { createReportTab: ({ data }) => ({ el: el('section'), activate() {}, refresh: () => data.trace(), render() {}, destroy() {} }) },
  }, { sessionStorage: { getItem: (key) => key.endsWith(':tab') ? 'report' : null, setItem() {} } }, async (name) => { imports.push(name) })
  const panel = namespace.mountPanel(el('host'), { agnes: { services: { async call(name) {
    services.push(name)
    if (name === 'cloudforge.report') return { workflows: [{ dir: 'run', name: 'run' }] }
    return { ok: true }
  } } } })
  await settle()
  assert.deepEqual(imports, ['./tabs/report.js'])
  assert.deepEqual(services, ['cloudforge.report', 'cloudforge.scene', 'cloudforge.trace'])
  panel.destroy()
})

test('lazy loading shares one instance, preserves reload, and respects a hidden view', async () => {
  const loading = deferred()
  let imports = 0
  let creates = 0
  let activates = 0
  let refreshes = 0
  let reload = null
  const { namespace } = await sourceModule('./lazy-tab.js', { './ui.js': ui })
  const tab = namespace.createLazyTab({ id: 'cloud', label: '点云', load() { imports++; return loading.promise } })
  const reloadCallback = () => {}
  tab.setReload(reloadCallback)
  tab.activate()
  const refreshing = tab.refresh()
  assert.equal(tab.refresh(), refreshing)
  tab.deactivate()
  loading.resolve(() => {
    creates++
    return { el: el('section'), activate() { activates++ }, refresh() { refreshes++ }, setReload(fn) { reload = fn } }
  })
  await refreshing
  assert.equal(imports, 1)
  assert.equal(creates, 1)
  assert.equal(activates, 0, 'a view hidden while its module loads must stay inactive')
  assert.equal(refreshes, 1)
  assert.equal(reload, reloadCallback)
  tab.activate()
  assert.equal(activates, 1)
  assert.equal(imports, 1)
  tab.destroy()
})

test('failed lazy imports show a retry and late imports do not recreate an unmounted view', async () => {
  const { namespace } = await sourceModule('./lazy-tab.js', { './ui.js': ui })
  let attempts = 0
  let retries = 0
  const tab = namespace.createLazyTab({ id: 'cloud', label: '点云', async load() {
    if (++attempts === 1) throw new Error('暂时无法读取视图资源')
    return () => ({ el: el('section'), activate() {}, render() {}, destroy() {} })
  }, onRetry() { retries++ } })
  await assert.rejects(tab.refresh(), /暂时无法读取/)
  const button = tab.el.children.at(-1)
  assert.equal(button.text, '重试')
  button.listeners.get('click')()
  await settle()
  assert.equal(attempts, 2)
  assert.equal(retries, 1)
  tab.destroy()

  const pending = deferred()
  let creates = 0
  const late = namespace.createLazyTab({ id: 'cad', label: 'CAD', load: () => pending.promise })
  late.activate()
  const completion = late.refresh()
  late.destroy()
  pending.resolve(() => { creates++; return { el: el('section') } })
  await completion
  assert.equal(creates, 0)
})
