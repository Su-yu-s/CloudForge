// 「选择文件」共享流程：点云页签与 CAD 页签都弹**系统原生**文件对话框。
//
// 为什么由服务端弹：浏览器 <input type="file"> 出于安全只给文件内容不给磁盘
// 路径，而面板的载入服务（cloudforge.cloud / cloudforge.mesh）认的是服务端
// 绝对路径。daemon 与用户同机同桌面，后端优先复用原生文件选择助手；
// 助手不可用时回退 PowerShell/Windows Forms，均使用系统对话框获取真实路径。
//
// 为什么两阶段：AGH 服务 timeoutMs 硬上限 30s，用户在对话框里停留多久不受
// 控制，在 handler 里 await 等用户选完会被超时切断。所以 pickcloud 只负责
// 弹框并返回轮询 id，结果由 pickstatus 轮询取回（与 exportTrace 同一模式）。
//
// 异常路径全覆盖：取消（对话框空结果）/ 无效文件（扩展名按会话白名单、
// 不存在、空文件，由服务端校验）/ 对话框启动失败 / 轮询超时。
// 全部显示在调用方给的状态位（span.cf-pick-note）上。

import { fmtSize } from './ui.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const noteTimers = new WeakMap()
const activePickers = new WeakMap()
const STATUS_RETRY_DELAYS = [200, 400, 800]

function clearNoteTimer(statusEl) {
  const timer = noteTimers.get(statusEl)
  if (timer !== undefined) clearTimeout(timer)
  noteTimers.delete(statusEl)
}

/**
 * 发起一次原生文件选择。
 *
 * @param {object} opts
 * @param {object} opts.data      面板数据通道（需要 pickCloud / pickStatus）
 * @param {string[]} [opts.exts]  扩展名白名单，如 ['step','stp','stl']；缺省 ply/pcd
 * @param {HTMLButtonElement} opts.btn      触发按钮：期间禁用并改文案，防重复点击
 * @param {HTMLElement} opts.statusEl       状态位：进度/结果/错误都显示在这里
 * @param {(r: {path,name,size}) => void} [opts.onPicked] 选中合法文件后的回调
 */
export function pickNativeFile({ data, exts, btn, statusEl, onPicked }) {
  if (activePickers.has(data)) return activePickers.get(data)
  const showNote = (text) => {
    clearNoteTimer(statusEl)
    statusEl.textContent = text
    statusEl.classList.toggle('on', !!text)
  }
  const operation = (async () => {
    if (btn.disabled) return
    btn.disabled = true
    const prevText = btn.textContent
    btn.textContent = '打开中…'
    showNote('正在打开系统文件对话框…')
    const startedAt = Date.now()
    const deadline = startedAt + 10 * 60 * 1000
    let releaseReads = () => {}
    try {
      // 显示和选择期间暂停普通读取，让开始请求和串行状态查询先发送。
      releaseReads = data.holdReads?.() || releaseReads
      if (!data.sessionId?.()) {
        btn.textContent = '准备会话…'
        showNote('正在为当前工作区准备会话…')
      }
      const selectedSession = await data.ensureSession()
      btn.textContent = '打开中…'
      showNote('正在打开系统文件对话框…')
      const begin = await data.pickCloud(exts?.length ? exts : undefined)
      const id = begin?.id
      if (!id) throw new Error(begin?.error || '未能启动系统文件对话框')
      // 首次立即查询；启动前 2 秒每 200ms，随后每 800ms 查询。
      // 以实际时间限制 10 分钟，避免慢 RPC 将等待时间无限拉长。
      let statusFailures = 0
      while (Date.now() < deadline) {
        let r
        try {
          r = await data.pickStatus(id)
          statusFailures = 0
        } catch (e) {
          const retryDelay = STATUS_RETRY_DELAYS[statusFailures++]
          const remaining = deadline - Date.now()
          if (remaining <= 0) break
          if (retryDelay !== undefined) {
            showNote('连接暂时中断，正在重试查询文件对话框状态…')
            await sleep(Math.min(retryDelay, remaining))
            continue
          }
          showNote(`状态查询失败：${String(e?.message ?? e)}；请关闭系统文件对话框后重试`)
          return
        }
        if (r?.state === 'starting' || r?.state === 'pending') {
          const starting = r.state === 'starting'
          btn.textContent = starting ? '打开中…' : '选择中…'
          showNote(starting ? '正在打开系统文件对话框…' : '请在系统文件对话框中选择文件…')
          const remaining = deadline - Date.now()
          if (remaining <= 0) break
          await sleep(Math.min(Date.now() - startedAt < 2000 ? 200 : 800, remaining))
          continue
        }
        if (r?.state === 'picked') {
          if (data.sessionId() !== selectedSession) throw new Error('会话已切换，本次选择未用于当前会话')
          showNote(`已选择 ${r.name}（${fmtSize(r.size)}）`)
          // 格式真伪由调用方的载入流程裁决（解析失败在那里报错），这里只报"选中"
          // 换源会立即请求点云/CAD 读取，先释放暂停，避免等待自身的选择流程。
          releaseReads()
          onPicked?.(r)
          return
        }
        if (r?.state === 'cancelled') { showNote('已取消选择'); return }
        if (r?.state === 'invalid') { showNote(`无效文件：${r.reason ?? ''}${r.path ? `（${r.path}）` : ''}`); return }
        if (r?.state === 'expired') { showNote('对话框超时未确认，已自动放弃'); return }
        if (r?.state === 'unknown') { showNote('选择会话已失效，请重试'); return }
        showNote(`选择失败：${r?.error ?? r?.state ?? '未知错误'}`)
        return
      }
      showNote('等待超过 10 分钟，已放弃轮询（若对话框还开着请直接关闭）')
    } catch (e) {
      showNote(`选择失败：${String(e?.message ?? e)}`)
    } finally {
      // 成功、取消、无效文件、连接失败和超时都恢复普通读取；重复释放无副作用。
      releaseReads()
      btn.disabled = false
      btn.textContent = prevText
      // 结果停留 30s 供用户看清，然后自动收起；新选择会重置这个定时器
      clearNoteTimer(statusEl)
      const timer = setTimeout(() => {
        statusEl.classList.remove('on')
        statusEl.textContent = ''
        noteTimers.delete(statusEl)
      }, 30000)
      noteTimers.set(statusEl, timer)
    }
  })()
  activePickers.set(data, operation)
  void operation.finally(() => {
    if (activePickers.get(data) === operation) activePickers.delete(data)
  })
  return operation
}
