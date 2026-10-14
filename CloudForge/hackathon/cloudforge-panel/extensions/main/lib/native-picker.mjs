// 原生文件选择保持 begin/status 两阶段；优先复用独立 STA Common Item Dialog helper。
import { spawn } from 'node:child_process'
import { randomUUID } from 'node:crypto'
import { existsSync, statSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'

// 只引用系统程序集，不通过 Add-Type 编译 C#，也不修改 Windows 的焦点策略。
export const WINDOWS_PICKER_SCRIPT = String.raw`
$ErrorActionPreference = 'Stop'
$utf8 = New-Object System.Text.UTF8Encoding($false)
[Console]::InputEncoding = $utf8
[Console]::OutputEncoding = $utf8
Add-Type -AssemblyName System.Windows.Forms
[System.Windows.Forms.Application]::EnableVisualStyles()
# 预加载类型及默认属性；仅实例化/销毁组件，不创建可见窗口或激活桌面。
$warmDialog = $null
$warmOwner = $null
try {
  $warmDialog = New-Object System.Windows.Forms.OpenFileDialog
  $warmOwner = New-Object System.Windows.Forms.Form
} finally {
  if ($null -ne $warmDialog) { $warmDialog.Dispose() }
  if ($null -ne $warmOwner) { $warmOwner.Dispose() }
}
function Send-Event($value) {
  [Console]::WriteLine(($value | ConvertTo-Json -Compress))
  [Console]::Out.Flush()
}
Send-Event @{ event = 'ready' }
while ($null -ne ($line = [Console]::ReadLine())) {
  $request = $null
  $owner = $null
  $dialog = $null
  try {
    $request = $line | ConvertFrom-Json
    $dialog = New-Object System.Windows.Forms.OpenFileDialog
    $dialog.Title = '选择文件'
    $dialog.Filter = $request.filter
    $dialog.InitialDirectory = $request.directory
    $dialog.RestoreDirectory = $true
    $dialog.CheckFileExists = $true

    # 对话框归属于这次用户点击的隐形顶层窗口，确保浏览器不会把它挡住。
    # owner 随选择完成销毁；不设置全局置顶、注册表或周期性抢焦点。
    $owner = New-Object System.Windows.Forms.Form
    $owner.Text = 'CloudForge 文件选择'
    $owner.ShowInTaskbar = $false
    $owner.ShowIcon = $false
    $owner.FormBorderStyle = [System.Windows.Forms.FormBorderStyle]::FixedToolWindow
    $owner.StartPosition = [System.Windows.Forms.FormStartPosition]::Manual
    $owner.Size = New-Object System.Drawing.Size(1, 1)
    $screen = [System.Windows.Forms.Screen]::FromPoint([System.Windows.Forms.Cursor]::Position).WorkingArea
    $owner.Location = New-Object System.Drawing.Point(($screen.Left + [int]($screen.Width / 2)), ($screen.Top + [int]($screen.Height / 2)))
    $owner.Opacity = 0
    $owner.TopMost = $true
    [void]$owner.Show()
    [void]$owner.Activate()
    Send-Event @{ event = 'shown'; id = $request.id }
    if ($dialog.ShowDialog($owner) -eq [System.Windows.Forms.DialogResult]::OK) {
      # 仅记忆实际本地盘目录；UNC/映射网络盘仍可主动选择。
      $isLocal = $false
      try {
        if ($dialog.FileName -match '^[A-Za-z]:[\\/]') {
          $drive = [System.IO.DriveInfo]::new([System.IO.Path]::GetPathRoot($dialog.FileName))
          $isLocal = $drive.DriveType -in @([System.IO.DriveType]::Fixed, [System.IO.DriveType]::Removable, [System.IO.DriveType]::CDRom, [System.IO.DriveType]::Ram)
        }
      } catch { # 未能确认盘类型时不记忆，选择结果仍然返回。
      }
      Send-Event @{ event = 'result'; id = $request.id; state = 'picked'; path = $dialog.FileName; local = $isLocal }
    } else {
      Send-Event @{ event = 'result'; id = $request.id; state = 'cancelled' }
    }
  } catch {
    Send-Event @{ event = 'result'; id = $request.id; state = 'failed'; error = $_.Exception.Message }
  } finally {
    if ($null -ne $dialog) { $dialog.Dispose() }
    if ($null -ne $owner) { $owner.Dispose() }
  }
}
`

const TERMINAL_TTL_MS = 30 * 60 * 1000
const STARTUP_TIMEOUT_MS = 15000
const IDLE_TIMEOUT_MS = 15 * 60 * 1000
const MAX_PATH_BYTES = 8 * 1024

function extensions(extParam) {
  const list = (Array.isArray(extParam) && extParam.length ? extParam : ['ply', 'pcd'])
    .map((e) => String(e).replace(/^\./, '').trim().toLowerCase())
    .filter((e) => /^[a-z0-9]{1,8}$/.test(e))
    .slice(0, 8)
  return list.length ? [...new Set(list)] : ['ply', 'pcd']
}

/** 创建实例不启动进程；warm 准备 COM/组件，begin 才请求显示对话框。 */
export function createNativePicker({
  workspace,
  platform = process.platform,
  spawnProcess = spawn,
  now = Date.now,
  timers = { setTimeout, clearTimeout },
} = {}) {
  const systemExe = join(process.env.SystemRoot ?? 'C:\\Windows', 'System32', 'WindowsPowerShell', 'v1.0', 'powershell.exe')
  const powershell = existsSync(systemExe) ? systemExe : 'powershell.exe'
  // 相对工作区查找可复现的构建产物；未构建时保留 PowerShell 兼容回退。
  const nativeExe = typeof workspace === 'string'
    ? join(workspace, 'hackathon', 'cli', 'build', 'Release', 'cloudforge-picker.exe')
    : null
  // 初始目录在插件创建时验证一次，点击路径不再同步访问文件系统。
  let initialDirectory = '.'
  try { if (typeof workspace === 'string' && statSync(workspace).isDirectory()) initialDirectory = workspace } catch { /* 保留当前目录 */ }
  let lastDirectory = initialDirectory
  const entries = new Map()
  let worker = null
  let activeId = null

  function timer(callback, ms) {
    const handle = timers.setTimeout(callback, ms)
    handle?.unref?.()
    return handle
  }

  function stopWorker() {
    const previous = worker
    if (!previous) return
    worker = null
    timers.clearTimeout(previous.idleTimer)
    timers.clearTimeout(previous.startupTimer)
    process.removeListener('exit', previous.onParentExit)
    previous.child.stdin?.destroy()
    previous.child.stdout?.destroy()
    previous.child.stderr?.destroy()
    try { previous.child.kill() } catch { /* 进程已退出 */ }
  }

  function retainIdleWorker(current) {
    if (!current || worker !== current || activeId) return
    timers.clearTimeout(current.idleTimer)
    current.idleTimer = timer(() => {
      if (worker === current && !activeId) stopWorker()
    }, IDLE_TIMEOUT_MS)
  }

  function finish(entry, result) {
    if (entry.result) return
    timers.clearTimeout(entry.startTimer)
    timers.clearTimeout(entry.expiryTimer)
    entry.result = result
    if (activeId === entry.id) activeId = null
    retainIdleWorker(worker)
  }

  function failWorker(current, error) {
    if (worker !== current) return
    stopWorker()
    const entry = entries.get(activeId)
    if (entry) finish(entry, { state: 'failed', error: `无法打开文件对话框：${error}` })
  }

  function sendRequest(entry) {
    const current = worker
    if (!current?.ready || entry.sent || entry.result) return
    entry.sent = true
    // 请求数据通过 JSON stdin 传输，不把路径或筛选条件拼进 PowerShell 代码。
    const command = JSON.stringify({
      id: entry.id,
      filter: `支持的格式 (*.${entry.exts.join(';*.')})|*.${entry.exts.join(';*.')}|所有文件 (*.*)|*.*`,
      directory: lastDirectory,
    })
    try {
      current.child.stdin.write(command + '\n', 'utf8', (error) => {
        if (error) failWorker(current, error.message)
      })
    } catch (error) {
      failWorker(current, error.message)
    }
  }

  function receive(current, message) {
    if (worker !== current) return
    if (message.event === 'ready') {
      current.ready = true
      timers.clearTimeout(current.startupTimer)
      const entry = entries.get(activeId)
      if (entry) sendRequest(entry)
      else retainIdleWorker(current)
      return
    }
    const entry = entries.get(message.id)
    if (!entry || activeId !== entry.id || entry.result) return
    if (message.event === 'shown') {
      entry.state = 'pending'
      timers.clearTimeout(entry.startTimer)
    } else if (message.event === 'result') {
      if (message.state === 'picked' && typeof message.path === 'string') {
        finish(entry, { state: 'picked', path: message.path, local: message.local === true })
      } else if (message.state === 'cancelled') {
        finish(entry, { state: 'cancelled' })
      } else {
        finish(entry, { state: 'failed', error: `文件对话框失败：${String(message.error || '没有返回有效结果').slice(0, 300)}` })
      }
    }
  }

  function startWorker() {
    // 只在 worker 准备阶段检查可执行文件，已预热的点击只写 stdin。
    // 原生 helper 直接初始化 Shell COM；缺失构建产物时再用 WinForms。
    const useNative = nativeExe && existsSync(nativeExe)
    const executable = useNative ? nativeExe : powershell
    const args = useNative ? [] : [
      '-NoLogo', '-NoProfile', '-STA', '-NonInteractive', '-EncodedCommand',
      Buffer.from(WINDOWS_PICKER_SCRIPT, 'utf16le').toString('base64'),
    ]
    const child = spawnProcess(executable, args, {
      cwd: initialDirectory, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'],
    })
    const current = { child, ready: false, stdout: '', stderr: '', idleTimer: null, startupTimer: null }
    worker = current
    child.unref?.()
    for (const stream of [child.stdin, child.stdout, child.stderr]) stream.unref?.()
    current.onParentExit = stopWorker
    process.once('exit', current.onParentExit)
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      current.stdout += chunk
      let newline
      while ((newline = current.stdout.indexOf('\n')) >= 0) {
        const line = current.stdout.slice(0, newline).trim()
        current.stdout = current.stdout.slice(newline + 1)
        if (!line) continue
        try { receive(current, JSON.parse(line)) } catch { /* 非协议诊断行交由退出状态处理 */ }
      }
      if (current.stdout.length > 16384) failWorker(current, '文件选择进程返回了异常输出')
    })
    child.stderr.on('data', (chunk) => { current.stderr = (current.stderr + chunk).slice(-1000) })
    child.stdin.on('error', (error) => failWorker(current, error.message))
    child.on('error', (error) => failWorker(current, error.message))
    // 用 close 等待 stdout 被读完，避免把最后一个有效结果误判为进程退出。
    child.on('close', (code) => failWorker(current, current.stderr.trim() || `文件选择进程已退出（${code ?? '未知状态'}）`))
    current.startupTimer = timer(() => failWorker(current, '文件选择组件初始化超时'), STARTUP_TIMEOUT_MS)
  }

  // 预加载不发送任何选择请求，异步初始化失败也不会阻断插件或工作台加载。
  function warm() {
    if (platform !== 'win32') return false
    try {
      if (!worker) startWorker()
      if (worker.ready) retainIdleWorker(worker)
      return true
    } catch {
      stopWorker()
      return false
    }
  }

  function begin(extParam) {
    if (platform !== 'win32') return { ok: false, error: '系统文件选择目前仅支持 Windows' }
    for (const [id, entry] of entries) {
      if (entry.result && now() - entry.startedAt > TERMINAL_TTL_MS) entries.delete(id)
    }
    if (activeId) return { ok: false, error: '已有文件对话框正在打开，请先完成选择或取消' }
    const id = randomUUID()
    const entry = { id, startedAt: now(), exts: extensions(extParam), state: 'starting', result: null, sent: false }
    entries.set(id, entry)
    activeId = id
    entry.startTimer = timer(() => {
      stopWorker()
      finish(entry, { state: 'failed', error: '文件对话框启动超时，请重试' })
    }, STARTUP_TIMEOUT_MS)
    entry.expiryTimer = timer(() => {
      stopWorker()
      finish(entry, { state: 'expired' })
    }, TERMINAL_TTL_MS)
    try {
      if (!worker) startWorker()
      timers.clearTimeout(worker.idleTimer)
      sendRequest(entry)
    } catch (error) {
      stopWorker()
      finish(entry, { state: 'failed', error: `无法启动文件对话框：${error.message}` })
    }
    return { ok: true, id }
  }

  function status(input) {
    const id = String(input?.id ?? '')
    const entry = entries.get(id)
    if (!entry) return { state: 'unknown' }
    if (!entry.result) return { state: entry.state }
    entries.delete(id)
    const result = entry.result
    if (result.state !== 'picked') return result
    const path = result.path
    // pickstatus 的服务响应预算是 16 KiB；超长路径不回传，预留名称/原因等字段空间。
    if (Buffer.byteLength(path, 'utf8') > MAX_PATH_BYTES) {
      return { state: 'invalid', reason: '文件路径过长（最多支持 8 KiB UTF-8），请选择更短的路径' }
    }
    const extRe = new RegExp(`\\.(${entry.exts.join('|')})$`, 'i')
    if (!extRe.test(path)) return { state: 'invalid', path, reason: `只支持 .${entry.exts.join(' / .')} 文件` }
    let st
    try { st = statSync(path) } catch { return { state: 'invalid', path, reason: '文件不存在或不可读' } }
    if (!st.isFile()) return { state: 'invalid', path, reason: '不是常规文件' }
    if (st.size === 0) return { state: 'invalid', path, reason: '文件为空' }
    if (result.local && /^[a-z]:[\\/]/i.test(path)) lastDirectory = dirname(path)
    return { state: 'picked', path, name: basename(path), size: st.size }
  }

  function dispose() {
    stopWorker()
    for (const entry of entries.values()) {
      timers.clearTimeout(entry.startTimer)
      timers.clearTimeout(entry.expiryTimer)
    }
    entries.clear()
    activeId = null
  }

  return { warm, begin, status, dispose }
}
