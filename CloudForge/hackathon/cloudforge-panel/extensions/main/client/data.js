// 云铸面板 · 数据层
//
// AGH 没有自定义事件总线（v2.0 方案里的 DownstreamEvent/UpstreamEvent 一律不存在），真实通道只有三条：
//   面板 → 后端   ctx.agnes.services.call(name, input)   受 agnes.client.json 的 services 白名单约束
//   面板 → 智能体 ctx.session.commands.prompt / session.prompt
//   会话 → 面板   ctx.session.projection.subscribe + projection.read().opState（turn-end 自动刷新）
// effect（写操作）另走命令系统：registerEffect + commands.execute，内部是浏览器原生 confirm 授权。

import { decodePositions, decodeTriangles } from './decode.js'

export const PAGE = 65536

export function createData(ctx) {
  const service = ctx.agnes?.services
  const errors = []
  const pendingQueries = new Map()

  const reads = []
  const pickerRequests = []
  let inFlight = false
  let readHolds = 0
  let disposed = false
  const sessionId = () => ctx.session?.sessionId || null
  const assertSession = (id) => {
    if (disposed || !id || sessionId() !== id) throw new Error('会话已改变，请在当前会话重新操作')
  }

  // 普通读取最多一个在途，交互请求优先于尚未发送的读取。
  // 只安排发送顺序；每次仍通过宿主原有服务通道和权限校验。
  const drain = () => {
    if (inFlight) return
    const queue = pickerRequests.length ? pickerRequests : readHolds ? null : reads
    const item = queue?.shift()
    if (!item) return
    item.started = true
    item.signal?.removeEventListener('abort', item.onAbort)
    inFlight = true
    Promise.resolve().then(() => {
      item.signal?.throwIfAborted()
      return item.task()
    }).then(item.resolve, item.reject).finally(() => {
      inFlight = false
      drain()
    })
  }

  const schedule = (task, { signal, picker = false } = {}) => new Promise((resolve, reject) => {
    if (signal?.aborted) { reject(signal.reason); return }
    const queue = picker ? pickerRequests : reads
    const item = { task, resolve, reject, signal, started: false, onAbort: null }
    item.onAbort = () => {
      if (item.started) return
      const index = queue.indexOf(item)
      if (index >= 0) queue.splice(index, 1)
      signal.removeEventListener('abort', item.onAbort)
      reject(signal.reason)
      drain()
    }
    signal?.addEventListener('abort', item.onAbort, { once: true })
    queue.push(item)
    drain()
  })

  const holdReads = () => {
    readHolds++
    let released = false
    return () => {
      if (released) return
      released = true
      readHolds--
      drain()
    }
  }

  const call = async (name, input = {}, { signal } = {}) => {
    if (!service) throw new Error('无服务通道（工作台未注入 services）')
    const id = sessionId()
    if (!id) throw new Error('请先选择文件以准备当前会话')
    try {
      const result = await schedule(() => {
        assertSession(id)
        return service.call(name, input)
      }, {
        signal,
        picker: name === 'cloudforge.pickcloud' || name === 'cloudforge.pickstatus',
      })
      assertSession(id)
      return result
    } catch (e) {
      if (signal?.aborted) throw e
      const msg = String((e && e.message) || e)
      errors.push({ name, msg })
      throw new Error(msg)
    }
  }

  // 仅合并正在进行的相同读取；结束即删除，刷新仍会读取当前磁盘产物。
  // 每个调用方独立取消，全部调用方取消后才撤下尚未发送的共享请求。
  const query = (name, input = {}, { signal } = {}) => {
    if (signal?.aborted) return Promise.reject(signal.reason)
    const key = `${sessionId()}:${name}:${JSON.stringify(input)}`
    let entry = pendingQueries.get(key)
    if (!entry || entry.controller.signal.aborted) {
      entry = { controller: new AbortController(), users: 0, settled: false, promise: null }
      const current = entry
      current.promise = call(name, input, { signal: current.controller.signal }).finally(() => {
        current.settled = true
        if (pendingQueries.get(key) === current) pendingQueries.delete(key)
      })
      pendingQueries.set(key, current)
    }
    const current = entry
    return new Promise((resolve, reject) => {
      current.users++
      let finished = false
      const finish = (settle, value, cancelled = false) => {
        if (finished) return
        finished = true
        signal?.removeEventListener('abort', onAbort)
        current.users--
        if (cancelled && current.users === 0 && !current.settled) current.controller.abort(value)
        settle(value)
      }
      const onAbort = () => finish(reject, signal.reason, true)
      signal?.addEventListener('abort', onAbort, { once: true })
      current.promise.then((value) => finish(resolve, value), (error) => finish(reject, error))
      if (signal?.aborted) onAbort()
    })
  }

  const api = {
    errors,
    call,
    holdReads,
    sessionId,
    async ensureSession() {
      if (disposed) throw new Error('工作台已关闭，请重新打开后选择文件')
      const session = ctx.session
      if (typeof session?.ensureActive === 'function') {
        const id = await session.ensureActive()
        assertSession(id)
        return id
      }
      const id = sessionId()
      if (id) return id
      throw new Error('当前 AGH 版本不支持直接准备会话，请先发送第一条消息再选择文件')
    },
    dispose() {
      disposed = true
      for (const entry of pendingQueries.values()) entry.controller.abort(new DOMException('工作台已关闭', 'AbortError'))
    },

    report: () => query('cloudforge.report', {}),
    scene: (resultDir) => query('cloudforge.scene', { result_dir: resultDir }),
    suite: () => query('cloudforge.suite', {}),
    trace: (path) => query('cloudforge.trace', path ? { path } : {}),
    cloudMeta: (cloud) => query('cloudforge.cloudmeta', { cloud }),
    cadStatus: (job) => query('cloudforge.cadstatus', { job }),
    detectStatus: (job) => query('cloudforge.detectstatus', { job }),
    verifyStatus: (input = {}, { signal } = {}) => query('cloudforge.verifystatus', input, { signal }),
    /** 「选择文件」两阶段：先弹系统对话框（ext=扩展名白名单），再轮询结果 */
    pickCloud: (ext) => call('cloudforge.pickcloud', ext ? { ext } : {}),
    pickStatus: (id) => call('cloudforge.pickstatus', { id }),
    verify: (result, truth, opts = {}) => call('cloudforge.verify', { result, truth, ...opts }),

    /** 单页点云载荷 */
    cloudPage: (cloud, offset, limit = PAGE, { signal } = {}) => query('cloudforge.cloud', { cloud, offset, limit }, { signal }),

    /** 渐进加载：每页到货即回调，首屏 65,536 点（≈512 KB，服务端上限 1 MiB） */
    async loadCloud(cloud, { onPage, onProgress, signal } = {}) {
      const chunks = []
      let loadedPoints = 0
      let total = 0
      let first = null
      for (;;) {
        signal?.throwIfAborted()
        const page = await api.cloudPage(cloud, loadedPoints, PAGE, { signal })
        // 页面卸载或换源时，旧的 RPC 即使已返回也不能继续写视口或进度。
        signal?.throwIfAborted()
        if (page.ok === false) throw new Error(page.error || '点云读取失败')
        if (!first) {
          first = page
          total = page.total
        }
        const positions = decodePositions(page)
        if (positions && positions.length) {
          chunks.push(positions)
          loadedPoints += page.returned
        }
        await onPage?.(positions, loadedPoints, page)
        signal?.throwIfAborted()
        onProgress?.({ loaded: loadedPoints, total, format: page.format, bbox: { min: page.bbox_min, max: page.bbox_max }, span: page.span })
        // 用「已载入点数」而不是块数来终止，否则会无限翻页
        if (loadedPoints >= page.total) break
        if (page.returned === 0) break
      }
      return {
        positions: concat(chunks),
        count: total,
        format: first?.format,
        bbox: first ? { min: first.bbox_min, max: first.bbox_max } : null,
        span: first?.span ?? 0,
      }
    },

    /** 网格：STL 直读，STEP 的后台预览转换完成后再分页读取。 */
    async loadMesh(path, { onProgress, signal } = {}) {
      const tris = []
      let loadedFaces = 0
      let first = null
      const deadline = Date.now() + 180000
      for (;;) {
        signal?.throwIfAborted()
        const page = await query('cloudforge.mesh', { path, offset: loadedFaces, limit: PAGE }, { signal })
        signal?.throwIfAborted()
        if (page.pending) {
          if (Date.now() >= deadline) throw new Error('CAD 预览准备超时，请稍后重新载入')
          onProgress?.({ stage: page.stage || '正在准备 CAD 预览…' })
          await waitForNextPage(1000, signal)
          continue
        }
        if (page.ok === false) throw new Error(page.error || 'CAD 预览不可用')
        if (!first) first = page
        const decoded = decodeTriangles(page)
        if (decoded?.positions?.length) {
          tris.push(decoded.positions)
          loadedFaces += page.returned
        }
        onProgress?.({ loaded: loadedFaces, total: page.total })
        if (loadedFaces >= page.total || page.returned === 0) break
      }
      return {
        positions: concat(tris),
        triCount: first.total,
        source: first.source,
        originFile: first.originFile,
        sourceCloud: first.sourceCloud || first.converted?.sourceCloud || null,
        resultDir: first.resultDir || null,
        route: first.route || first.converted?.route || null,
        updatedMs: first.updatedMs || null,
        converted: first.converted,
        solid: first.solid,
        bbox: { min: first.bbox_min, max: first.bbox_max },
      }
    },

    /** effect：面板自己调 CLI（会弹 AGH 的原生授权 confirm） */
    runEffect: (commandId, input) => ctx.commands.execute(commandId, input),

    /** 向当前会话发预置指令（反向驱动智能体） */
    async prompt(text, { handoff = false, commandId, sessionId } = {}) {
      const sid = ctx.session?.sessionId
      const sessions = ctx.agnes?.sessions
      const s = sid && sessions ? sessions.get(sid) : null
      if (!s || typeof s.prompt !== 'function') throw new Error('需要一个已打开的会话')
      if (sessionId && sessionId !== sid) throw new Error('会话选择已改变，请在原会话继续验证')
      if (handoff) {
        // SDK prompt 的 Promise 表示整轮结束；followUp 的 seq 才是排队确认。
        // 与 AGH 宿主发送逻辑一致，忙时加入下一轮，空闲时启动当前会话。
        const projection = await s.projectUI()
        if (ctx.session?.sessionId !== sid) throw new Error('会话选择已改变，请重新提交验证')
        if (projection?.opState) {
          if (typeof s.followUp !== 'function') throw new Error('AGH 当前正在执行，请等待本轮结束再提交')
          const seq = await s.followUp(text, { commandId })
          return { accepted: true, queued: true, seq }
        }
        const completion = s.prompt(text)
        void completion.catch(() => {})
        // 调用方立即绑定 rejection，避免整轮运行期间阻塞验证进度轮询。
        return { accepted: null, queued: false, completion }
      }
      await s.prompt(text)
      return true
    },

    /**
     * turn-end 自动刷新：opState 由非 null 变回 null 即为一轮结束。
     * 订阅只给"有变化"，所以每次都要重新 read() 判断当前态。
     */
    onTurnEnd(handler) {
      const proj = ctx.session?.projection
      if (!proj?.subscribe || !proj?.read) return () => {}
      let wasBusy = false
      const off = proj.subscribe(() => {
        void Promise.resolve(proj.read())
          .then((t) => {
            const busy = Boolean(t && t.opState)
            if (wasBusy && !busy) handler({ upto: t?.upto ?? null, generation: t?.generation ?? null })
            wasBusy = busy
          })
          .catch(() => {})
      })
      return off
    },

    /** 只读当前投影（执行链卡片用） */
    projection: () => Promise.resolve(ctx.session?.projection?.read?.()).catch(() => null),
  }

  return api
}

function concat(chunks) {
  if (chunks.length === 0) return new Float32Array(0)
  if (chunks.length === 1) return chunks[0]
  let total = 0
  for (const c of chunks) total += c.length
  const out = new Float32Array(total)
  let off = 0
  for (const c of chunks) {
    out.set(c, off)
    off += c.length
  }
  return out
}


function waitForNextPage(ms, signal) {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer)
      signal?.removeEventListener('abort', onAbort)
      reject(signal?.reason || new DOMException('Aborted', 'AbortError'))
    }
    const timer = setTimeout(() => { signal?.removeEventListener('abort', onAbort); resolve() }, ms)
    signal?.addEventListener('abort', onAbort, { once: true })
    if (signal?.aborted) onAbort()
  })
}
