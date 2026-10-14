// 云铸面板 · 验证页签
// 当前模型的核验由本会话 AGH 组织并调用正式工具，面板只准备任务和读取结果。
// 合成回归与鲁棒性网格是可折叠的历史证据，不作为当前文件的通过结论。

import { el, num, mmOrDash } from '../ui.js'
import { pickNativeFile } from '../pick.js'

const GROUPS = [
  { id: 'normal', label: '常规链路' },
  { id: 'boundary', label: '边界条件' },
  { id: 'failure', label: '失败路径' },
]

export function createVerifyTab({ ctx, data, state }) {
  const root = el('section', { class: 'cf-pane', dataset: { pane: 'verify' } })
  const scroll = el('div', { class: 'cf-scroll' })
  root.appendChild(scroll)

  const currentBox = el('div', { class: 'cf-list' })
  const sourceLabel = el('div', { class: 'cf-cloud-source' })
  const scopeNote = el('div', { class: 'cf-note' }, '由当前 AGH 会话组织核验并调用 CloudForge 工具；没有匹配真值时，只报告模型检查，不宣称真实精度已验证。')
  const tolerance = el('input', { type: 'number', min: '0.001', max: '1000', step: '1', value: '5', 'aria-label': '参数容差（毫米）' })
  const angle = el('input', { type: 'number', min: '0.001', max: '90', step: '1', value: '2', 'aria-label': '角度容差（度）' })
  const thresholdRow = el('div', { class: 'cf-verify-thresholds' }, [
    el('label', {}, ['参数容差（mm） ', tolerance]), el('label', {}, ['角度容差（°） ', angle]),
  ])
  const referenceLabel = el('div', { class: 'cf-note' })
  const referenceBtn = el('button', { class: 'cf-btn-sm', text: '选择真值 JSON' })
  const clearReferenceBtn = el('button', { class: 'cf-btn-sm', text: '清除参考' })
  const referenceStatus = el('span', { class: 'cf-pick-note', role: 'status', 'aria-live': 'polite' })
  const referenceControls = el('div', { class: 'cf-foot-row' }, [referenceBtn, clearReferenceBtn])
  const referenceNote = el('div', { class: 'cf-note', text: '真值 JSON 应对应当前点云，使用相同单位和坐标系，并包含标准 shapes。用户选定的参考由 AGH 工具检查与对比。' })
  const runBtn = el('button', { class: 'cf-primary-btn', text: '让 AGH 验证当前模型' })
  const progress = el('div', { class: 'cf-note', role: 'status', 'aria-live': 'polite' })
  const retryBtn = el('button', { class: 'cf-btn-sm hidden', text: '重试查询进度' })
  const resumeBtn = el('button', { class: 'cf-btn-sm hidden', text: '继续交给 AGH' })
  const historyBox = el('div', { class: 'cf-note hidden' })
  const suiteBox = el('div', { class: 'cf-list' })
  const checkBox = el('div', { class: 'cf-list' })
  const heatBox = el('div', {})
  const verdictBox = el('div', { class: 'cf-note' })

  scroll.appendChild(title('当前点云与 CAD 核验'))
  currentBox.append(sourceLabel, scopeNote, thresholdRow, referenceLabel, referenceControls, referenceStatus, referenceNote, runBtn, progress, retryBtn, resumeBtn, historyBox)
  scroll.appendChild(currentBox)
  scroll.appendChild(checkBox)
  const historical = el('details', {}, [el('summary', { class: 'cf-group-title', text: '算法回归证据（历史基准，不代表当前文件）' })])
  historical.append(title('回归套件'), suiteBox, title('鲁棒性网格 · 噪声 σ × 保留率'), heatBox, verdictBox)
  scroll.appendChild(historical)

  let visible = false
  let destroyed = false
  let currentKey = null
  let recovering = false
  let submitting = null
  let controller = null
  let polling = null
  let recoveryError = null
  let historicalLoaded = false
  let referenceBaseKey = null
  let truthPath = null
  let referenceKind = 'none'
  let pickingReference = false
  let savedSelection = null
  const jobs = new Map()
  const storageKey = `cf:${ctx.session?.sessionId ?? 'default'}:verify-jobs`
  const selectionKey = `cf:${ctx.session?.sessionId ?? 'default'}:verify-reference`
  try {
    savedSelection = JSON.parse(sessionStorage.getItem(selectionKey) || 'null')
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || '[]')
    for (const job of Array.isArray(saved) ? saved.slice(-10) : []) {
      if (job && typeof job.key === 'string' && typeof job.id === 'string') {
        // 页面重载不等价于提交失败；先恢复后台状态，再决定是否可继续交互。
        job.sending = false
        job.pollError = null
        jobs.set(job.key, job)
      }
    }
  } catch { /* 私密模式不影响后台请求恢复 */ }

  runBtn.addEventListener('click', () => void startVerify())
  referenceBtn.addEventListener('click', () => void selectReference())
  clearReferenceBtn.addEventListener('click', () => {
    if (pickingReference || submitting || pending(currentJob())) return
    truthPath = null
    referenceKind = 'none'
    saveSelection(context())
    renderCurrent(); state.notify?.()
  })
  for (const input of [tolerance, angle]) input.addEventListener('change', () => {
    saveSelection(context())
    renderCurrent(); state.notify?.()
  })
  historical.addEventListener('toggle', () => {
    if (!historical.open || historicalLoaded || destroyed) return
    historicalLoaded = true
    void data.suite().then((value) => {
      if (destroyed) return
      state.suite = value
      renderSuite(); renderHeat()
    }).catch((error) => {
      if (destroyed) return
      historicalLoaded = false
      verdictBox.textContent = `历史基准读取失败：${String(error.message || error)}`
    })
  })
  retryBtn.addEventListener('click', () => {
    const job = currentJob()
    recoveryError = null
    if (job) { job.pollError = null; void resumePolling(job) }
    else void recover()
    renderCurrent()
  })
  resumeBtn.addEventListener('click', () => {
    const job = currentJob()
    if (job?.request) void handoff(job)
    else void startVerify({ retry: true })
  })

  const pathKey = (value) => String(value || '').replace(/\\/g, '/').replace(/\/$/, '').toLowerCase()
  const samePath = (a, b) => !!a && !!b && pathKey(a) === pathKey(b)
  const basename = (value) => String(value || '').split(/[\\/]/).pop()
  function context() {
    const source = state.cloudOverride || state.cloudPath || state.sceneCache?.sourceCloud || state.sceneCache?.source_cloud || state.workflow?.sourceCloud || null
    const wf = state.workflow
    const wfSource = wf?.sourceCloud || state.sceneCache?.sourceCloud || state.sceneCache?.source_cloud
    const resultDir = wf && (samePath(source, wfSource) || !state.cloudOverride && !wfSource) ? wf.dir : null
    const value = { sourceCloud: source, resultDir, sceneId: state.sceneId, sessionId: ctx.session?.sessionId || null }
    value.baseKey = JSON.stringify([pathKey(source), pathKey(resultDir), value.sceneId, value.sessionId])
    if (referenceBaseKey !== value.baseKey) {
      referenceBaseKey = value.baseKey
      // 参考只属于捕获的源与工作流，切换到其他输入时清除旧参考。
      truthPath = resultDir && typeof wf?.truthPath === 'string' ? wf.truthPath : null
      referenceKind = truthPath ? 'workflow' : 'none'
      if (savedSelection?.baseKey === value.baseKey) {
        truthPath = typeof savedSelection.truthPath === 'string' && savedSelection.truthPath ? savedSelection.truthPath : null
        referenceKind = truthPath ? savedSelection.referenceKind === 'workflow' ? 'workflow' : 'user' : 'none'
        if (Number(savedSelection.parameterMm) > 0 && Number(savedSelection.parameterMm) <= 1000) tolerance.value = String(savedSelection.parameterMm)
        if (Number(savedSelection.angleDeg) > 0 && Number(savedSelection.angleDeg) <= 90) angle.value = String(savedSelection.angleDeg)
      }
      savedSelection = null
      referenceStatus.textContent = ''
      referenceStatus.classList.remove('on')
    }
    value.truthPath = truthPath
    value.referenceKind = referenceKind
    value.thresholds = { parameter_tolerance_m: Number(tolerance.value) / 1000, angle_tolerance_deg: Number(angle.value) }
    value.key = JSON.stringify([value.baseKey, pathKey(truthPath), value.thresholds.parameter_tolerance_m, value.thresholds.angle_tolerance_deg])
    return value
  }
  function saveSelection(captured) {
    try { sessionStorage.setItem(selectionKey, JSON.stringify({ baseKey: captured.baseKey, truthPath, referenceKind, parameterMm: Number(tolerance.value), angleDeg: Number(angle.value) })) } catch { /* 忽略 */ }
  }
  async function selectReference() {
    const captured = context()
    if (destroyed || pickingReference || submitting || pending(currentJob())) return
    pickingReference = true
    let accepted = false
    const choosing = pickNativeFile({ data, exts: ['json'], btn: referenceBtn, statusEl: referenceStatus, onPicked: (picked) => {
      if (destroyed || context().key !== captured.key || context().baseKey !== captured.baseKey) return
      accepted = true
      truthPath = picked.path
      referenceKind = 'user'
      saveSelection(captured)
      renderCurrent(); state.notify?.()
    } })
    renderCurrent(); state.notify?.()
    try { await choosing } finally {
      pickingReference = false
      if (!destroyed) {
        if (!accepted && context().key !== captured.key) {
          referenceStatus.textContent = '当前模型或参数已改变，本次选择未用于当前模型'
          referenceStatus.classList.add('on')
        }
        renderCurrent(); state.notify?.()
        if (visible) void recover()
      }
    }
  }
  function validThresholds(value) {
    return Number.isFinite(value.parameter_tolerance_m) && value.parameter_tolerance_m > 0 && value.parameter_tolerance_m <= 1
      && Number.isFinite(value.angle_tolerance_deg) && value.angle_tolerance_deg > 0 && value.angle_tolerance_deg <= 90
  }
  function statusInput(captured, job) {
    return {
      job: job?.id || undefined, session_id: captured.sessionId,
      source_cloud: captured.sourceCloud, result_dir: captured.resultDir || undefined,
      scene_id: captured.sceneId || undefined, truth_path: captured.truthPath || '',
      ...captured.thresholds,
    }
  }
  function currentJob() { return jobs.get(context().key) || null }
  function save() {
    try { sessionStorage.setItem(storageKey, JSON.stringify([...jobs.values()].slice(-10))) } catch { /* 忽略 */ }
  }
  function statusLabel(job) {
    const labels = { queued: '等待 AGH 调用验证工具', running: 'AGH 正在执行验证', pass: 'PASS · 当前模型检查通过', fail: 'FAIL · 当前模型检查未通过', partial: '检查已完成 · 缺少真实精度参考', error: '验证执行失败', stale: '输入已改变 · 该结果已失效' }
    return labels[job?.state] || '验证未运行'
  }
  function pending(job) { return !!job && !job.done && !['error', 'stale', 'pass', 'fail', 'partial'].includes(job.state) }
  function renderCurrent() {
    if (destroyed) return
    const captured = context()
    if (currentKey !== captured.key) {
      currentKey = captured.key
      recoveryError = null
      controller?.abort()
      if (visible) void recover()
    }
    const job = jobs.get(captured.key)
    const busy = submitting || pending(job)
    sourceLabel.textContent = captured.sourceCloud ? `当前点云：${basename(captured.sourceCloud)}` : '请先在点云页选择要验证的文件'
    sourceLabel.title = captured.sourceCloud || ''
    runBtn.disabled = !captured.sourceCloud || !captured.resultDir || !captured.sessionId || !validThresholds(captured.thresholds) || busy || recovering || pickingReference
    runBtn.textContent = busy ? statusLabel(job) : job?.done ? '重新验证当前模型' : '让 AGH 验证当前模型'
    tolerance.disabled = angle.disabled = busy || pickingReference
    referenceBtn.disabled = clearReferenceBtn.disabled = busy || pickingReference
    clearReferenceBtn.disabled ||= !captured.truthPath
    referenceLabel.textContent = captured.truthPath ? `精度参考：${basename(captured.truthPath)}（${captured.referenceKind === 'workflow' ? '当前工作流显式真值' : '用户选定参考'}）` : '精度参考：未选择；仅执行模型检查'
    referenceLabel.title = captured.truthPath || ''
    progress.textContent = !captured.sessionId ? '请打开一个 AGH 会话后提交验证。' : !captured.resultDir ? '当前点云没有匹配的检测结果，请先在点云页“开始检测”，再提交验证。' : !validThresholds(captured.thresholds) ? '参数容差应大于 0 且不超过 1000 mm；角度容差应大于 0 且不超过 90°' : recoveryError || job?.prepareError || job?.sendError || job?.pollError || job?.stage || statusLabel(job)
    retryBtn.classList.toggle('hidden', !(recoveryError || job?.pollError))
    resumeBtn.classList.toggle('hidden', !job || job.done || job.sending || !(job.prepareError || job.sendError || job.canResume))
    resumeBtn.textContent = job?.prepareError ? '重试准备验证任务' : '继续交给 AGH'
    const previous = [...jobs.values()].filter((item) => item.key !== captured.key).at(-1)
    historyBox.classList.toggle('hidden', !previous)
    historyBox.textContent = previous ? `历史任务：${basename(previous.sourceCloud)} · 参考 ${basename(previous.truthPath) || '无'} · ${statusLabel(previous)}。恢复该点云、工作流、参考和阈值可查看；历史结果不会覆盖当前模型。` : ''
    renderChecks()
  }

  function applyStatus(job, value) {
    if (!value || value.ok === false && !value.done) throw new Error(value?.reason || value?.error || '暂未取得验证状态')
    job.state = value.state || value.status || job.state
    job.done = Boolean(value.done || ['pass', 'fail', 'partial', 'error', 'stale'].includes(job.state))
    job.request = value.request || job.request
    job.stage = value.reason || value.stage || value.summary || statusLabel(job)
    job.result = value.result || job.result
    job.reportPath = value.reportPath || job.reportPath
    job.verifyPath = value.verifyPath || job.verifyPath
    if (job.done) { job.canResume = false; job.sendError = null; job.prepareError = null }
    job.pollError = null
    save()
    if (context().key === job.key) { renderCurrent(); state.notify?.() }
  }

  async function recover() {
    const captured = context()
    if (destroyed || !visible || !captured.sourceCloud || !captured.resultDir || !captured.sessionId || !validThresholds(captured.thresholds) || recovering || submitting || pickingReference) return
    const saved = jobs.get(captured.key)
    if (saved?.id && pending(saved)) { void resumePolling(saved); return }
    recovering = true
    try {
      const value = await data.verifyStatus(statusInput(captured, saved))
      if (destroyed || !visible || context().key !== captured.key) return
      if (value?.job) {
        const job = saved || { ...captured, id: value.job, requestId: value.job, state: 'queued', done: false }
        jobs.set(captured.key, job)
        applyStatus(job, value)
        if (pending(job)) void resumePolling(job)
      } else if (value?.ok === false) throw new Error(value.reason || value.error || '验证任务恢复失败')
    } catch (error) {
      if (!destroyed && context().key === captured.key) recoveryError = `状态读取失败：${String(error.message || error)}`
    } finally {
      recovering = false
      if (!destroyed) {
        renderCurrent(); state.notify?.()
        if (visible && context().key !== captured.key) void recover()
      }
    }
  }

  async function startVerify({ retry = false } = {}) {
    const captured = context()
    const old = jobs.get(captured.key)
    if (destroyed || submitting || pickingReference || !captured.sourceCloud || !captured.resultDir || !captured.sessionId || !retry && pending(old)) return
    const parameterTolerance = Number(tolerance.value) / 1000
    const angleTolerance = Number(angle.value)
    if (!validThresholds({ parameter_tolerance_m: parameterTolerance, angle_tolerance_deg: angleTolerance })) {
      progress.textContent = '参数容差应大于 0 且不超过 1000 mm；角度容差应大于 0 且不超过 90°'
      return
    }
    const job = retry && old?.prepareError ? old : { ...captured, requestId: crypto.randomUUID(), id: null, state: 'queued', done: false, thresholds: { parameter_tolerance_m: parameterTolerance, angle_tolerance_deg: angleTolerance } }
    job.prepareError = job.sendError = null
    job.stage = '正在准备当前模型的验证任务…'
    submitting = job
    jobs.set(captured.key, job)
    renderCurrent(); state.notify?.()
    try {
      const value = await data.runEffect('cloudforge.verify.agh', {
        source_cloud: job.sourceCloud, result_dir: job.resultDir || undefined,
        session_id: job.sessionId, scene_id: job.sceneId, request_id: job.requestId,
        truth_path: job.truthPath || '',
        ...job.thresholds,
      })
      if (destroyed) return
      if (!value?.job || !value?.request || value.ok === false && !value.done) throw new Error(value?.reason || value?.error || '未能准备验证任务')
      job.id = value.job
      job.request = value.request
      job.actualTruthPath = value.truthPath || null
      job.cadPath = value.cadPath || null
      applyStatus(job, value)
      if (submitting === job) submitting = null
      if (!job.done) await handoff(job)
    } catch (error) {
      if (!destroyed) {
        job.prepareError = `验证尚未开始：${String(error.message || error)}`
        job.stage = job.prepareError
        save()
      }
    } finally {
      if (submitting === job) submitting = null
      if (!destroyed) { renderCurrent(); state.notify?.() }
    }
  }

  function taskPrompt(job) {
    return [
      '请组织并执行 CloudForge 当前模型验证。用户已在控制台点击“让 AGH 验证当前模型”。',
      `固定任务文件（相对 CloudForge 项目根目录）：${JSON.stringify(job.request)}`,
      `当前点云：${JSON.stringify(job.sourceCloud)}；检测目录：${JSON.stringify(job.resultDir)}；场景：${JSON.stringify(job.sceneId)}。`,
      `精度参考：${JSON.stringify(job.truthPath)}（${job.referenceKind === 'user' ? '用户选定参考，需核实适用范围与关联' : job.referenceKind === 'workflow' ? '当前工作流显式真值' : '未提供真值'}）；参数容差 ${job.thresholds.parameter_tolerance_m} m，角度容差 ${job.thresholds.angle_tolerance_deg}°。`,
      '执行顺序：1. 读取任务 JSON，调用 cloudforge_cloud_info 检查任务中的点云；2. 调用 cloudforge_verify_current，参数 request 严格使用上述任务文件路径，由该工具执行实际核验并保存结构化结果和报告；3. 读取工具返回的 verificationResultPath / reportPath，解释每项实际检查、异常和建议。',
      '不要把验证改成其他点云或合成案例，不要用算法回归绿勾代替当前模型核验，不要编造通过。没有匹配真值时必须说明尚未验证真实精度；CAD 不存在或无法校验时如实报告。',
      '任务文件的来源、CAD、真值、阈值已固定；已完成的同一 request 直接读取结果，避免重复执行。若工具不可用、执行失败或等待权限，明确告诉用户，并保持该任务待处理。',
      '完成后按当前场景解释 PASS / FAIL / 缺少参考，不把 missing-reference 说成 PASS；页面将自动读取同一任务的结果。',
    ].join('\n')
  }

  async function handoff(job) {
    if (destroyed || job.sending || job.done || !job.request || ctx.session?.sessionId !== job.sessionId) return
    job.sending = true
    job.canResume = false
    job.sendError = null
    job.stage = '正在将验证任务提交到当前 AGH 会话…'
    renderCurrent(); state.notify?.()
    if (visible && context().key === job.key) void resumePolling(job)
    try {
      const receipt = await data.prompt(taskPrompt(job), { handoff: true, sessionId: job.sessionId, commandId: `cloudforge-verify-${job.requestId}` })
      if (destroyed) return
      if (!job.done && job.state !== 'running') job.stage = receipt.queued ? '已加入 AGH 下一轮，等待 AGH 调用验证工具' : '正在请求 AGH 执行，等待验证工具启动'
      save(); renderCurrent(); state.notify?.()
      if (receipt.completion) {
        const result = await receipt.completion
        if (!destroyed && !job.done && job.state !== 'running') {
          job.canResume = true
          job.stage = result?.reason === 'completed' ? 'AGH 本轮已结束，尚未取得工具验证结果；可继续交给 AGH' : `AGH 本轮已停止（${result?.reason || '未知原因'}），验证仍待执行`
        }
      }
    } catch (error) {
      if (!destroyed && !job.done) job.sendError = `AGH 提交状态待确认：${String(error.message || error)}。可查询状态后继续同一任务。`
    } finally {
      job.sending = false
      save()
      if (!destroyed) { renderCurrent(); state.notify?.() }
    }
  }

  function delay(ms, signal) {
    return new Promise((resolve, reject) => {
      const onAbort = () => { clearTimeout(timer); signal.removeEventListener('abort', onAbort); reject(signal.reason) }
      const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve() }, ms)
      signal.addEventListener('abort', onAbort, { once: true })
      if (signal.aborted) onAbort()
    })
  }
  function resumePolling(job) {
    if (destroyed || !visible || !job?.id || job.done || job.pollError || polling) return polling
    const activeController = new AbortController()
    controller = activeController
    const { signal } = activeController
    polling = (async () => {
      let failures = 0
      while (!signal.aborted && !destroyed && visible && context().key === job.key && !job.done) {
        try {
          const value = await data.verifyStatus(statusInput(job, job), { signal })
          signal.throwIfAborted()
          applyStatus(job, value)
          failures = 0
          if (job.done) return
          // 排队确认不是工具调用；恢复后空闲的会话可继续同一请求。
          if (job.state === 'queued' && !job.sending) {
            const projection = await data.projection()
            signal.throwIfAborted()
            const view = projection?.value || projection
            if (view && 'opState' in view && !view.opState) job.canResume = true
            renderCurrent()
          }
          await delay(1500, signal)
        } catch (error) {
          if (signal.aborted || destroyed) return
          if (++failures >= 3) throw error
          await delay(1500, signal)
        }
      }
    })().catch((error) => {
      if (!destroyed && !signal.aborted) { job.pollError = `进度暂未更新：${String(error.message || error)}`; renderCurrent(); state.notify?.() }
    }).finally(() => {
      if (controller === activeController) controller = null
      polling = null
      if (!destroyed && visible) {
        if (context().key !== job.key) void recover()
        else if (signal.aborted && pending(job) && !job.pollError) void resumePolling(job)
      }
    })
    return polling
  }

  function title(t) {
    return el('div', { class: 'cf-group-title', text: t })
  }

  function renderSuite() {
    suiteBox.replaceChildren()
    const suite = state.suite?.suite
    if (!suite) {
      suiteBox.appendChild(el('div', { class: 'cf-empty' }, '未找到 hackathon/tests/results/suite-result.json'))
      return
    }
    const head = el('div', { class: 'cf-kv' }, [
      el('span', { text: '总计' }),
      el('span', { class: 'mono', text: `${suite.passed}/${suite.total} 通过${suite.failed ? ` · ${suite.failed} 失败` : ''}` }),
    ])
    suiteBox.appendChild(head)
    for (const g of GROUPS) {
      const items = (suite.results ?? []).filter((r) => r.group === g.id)
      if (!items.length) continue
      const sub = el('div', { class: 'cf-sub-title' }, `${g.label} · ${items.filter((i) => i.pass).length}/${items.length}`)
      suiteBox.appendChild(sub)
      for (const item of items) {
        const dot = el('span', { class: `cf-dot-ico ${item.pass ? 'ok' : 'err'}`, text: item.pass ? '✓' : '✗' })
        const row = el('div', { class: 'cf-check', title: item.detail ?? '' }, [
          dot,
          el('span', { class: 'cf-check-name', text: item.name }),
        ])
        if (item.detail) row.appendChild(el('span', { class: 'cf-check-val', text: item.detail }))
        suiteBox.appendChild(row)
      }
    }
  }

  function renderChecks() {
    checkBox.replaceChildren()
    const job = currentJob()
    const v = job?.result
    if (job?.state === 'stale') {
      checkBox.appendChild(el('div', { class: 'cf-empty' }, '点云、检测结果或交付物已改变。之前的验证结论不适用于当前输入，请重新验证。'))
      return
    }
    if (!v) {
      checkBox.appendChild(el('div', { class: 'cf-empty' }, pending(job) ? '等待 AGH 实际调用验证工具；准备任务或加入下一轮还不代表验证完成。' : '提交当前模型后，这里显示实际检查结果与报告。'))
      return
    }
    checkBox.appendChild(
      el('div', { class: 'cf-kv' }, [
        el('span', { text: '结论' }),
        el('span', { class: `mono ${job.state === 'pass' ? 'ok-text' : job.state === 'fail' || job.state === 'error' ? 'err-text' : ''}`, text: statusLabel(job) }),
      ]),
    )
    if (v.summary) checkBox.appendChild(el('div', { class: 'cf-note', text: v.summary }))
    checkBox.appendChild(el('div', { class: 'cf-note', text: v.precisionVerified ? '真实精度：已使用匹配真值对比' : '真实精度：尚未验证；现有检查不等同于与标准答案一致' }))
    if (v.thresholds) checkBox.appendChild(el('div', { class: 'cf-kv' }, [
      el('span', { text: '本次阈值' }),
      el('span', { class: 'mono', text: `参数 ${mmOrDash(v.thresholds.parameterToleranceM ?? v.thresholds.parameter_tolerance_m)} · 角度 ${v.thresholds.angleToleranceDeg ?? v.thresholds.angle_tolerance_deg ?? '—'}°` }),
    ]))
    const labels = { pass: '通过', fail: '未通过', skipped: '未执行', 'missing-reference': '缺少参考', error: '执行失败' }
    for (const c of v.checks ?? []) {
      const pass = c.status === 'pass'
      const fail = c.status === 'fail' || c.status === 'error'
      const row = el('div', { class: 'cf-check' }, [
        el('span', { class: `cf-dot-ico ${pass ? 'ok' : fail ? 'err' : ''}`, text: pass ? '✓' : fail ? '✗' : '—' }),
        el('span', { class: 'cf-check-name', text: c.label || c.name || c.id || '检查项' }),
        el('span', { class: 'cf-check-val', text: `${labels[c.status] || c.status || '未确认'}${c.summary ? ` · ${c.summary}` : ''}` }),
      ])
      if (c.metrics) row.title = `${c.summary || ''}\n${JSON.stringify(c.metrics, null, 2)}`
      const shapeId = (c.shapeIds || []).find((id) => Number.isSafeInteger(id) && id >= 0 && (state.sceneCache?.shapes || []).some((shape) => shape.id === id))
      if (shapeId != null) {
        row.classList.add('clickable')
        row.title += `\n点击定位检测基元 #${shapeId}`
        row.addEventListener('click', () => {
          if (context().key !== job.key) return
          state.pendingHighlight = shapeId
          window.__CF_DEBUG?.selectTab?.('cloud')
          state.message = `已定位检测基元 #${shapeId}`
        })
      }
      checkBox.appendChild(row)
    }
    for (const [name, path] of [['结构化结果', job.verifyPath], ['验证报告', job.reportPath]]) {
      if (path) checkBox.appendChild(el('div', { class: 'cf-kv' }, [el('span', { text: name }), el('span', { class: 'mono', text: path, title: path })]))
    }
    if (v.executor?.tool) checkBox.appendChild(el('div', { class: 'cf-note', text: `执行工具：${v.executor.tool}。详细工具调用与解释可在当前 AGH 会话查看。` }))
  }

  /** 哨兵值：云铸用 1e+30 表示「未检出 / 拟合失控」，不是真实测量值。
 *  必须先判掉再格式化——Number.prototype.toFixed 对 ≥1e21 的数会**回退成指数记法**
 *  （(1e+30*1000).toFixed(2) === "1.0000000000000001e+33"），界面上就会出现这串天文数字。 */
const SENTINEL = 1e21

/** 把可能是哨兵值的米制误差转成毫米；无结果返回 null（调用方显示 —）。 */
function errMm(v) {
  if (typeof v !== 'number' || !Number.isFinite(v) || Math.abs(v) >= SENTINEL) return null
  return v * 1000
}

function renderHeat() {
    heatBox.replaceChildren()
    const rb = state.suite?.robustness
    if (!rb?.grid?.length) {
      heatBox.appendChild(el('div', { class: 'cf-empty' }, '未找到 robustness.json'))
      verdictBox.textContent = ''
      return
    }
    const grid = el('div', { class: 'cf-heat' })
    for (const g of rb.grid) {
      const pass = g.verify_pass
      const plane = errMm(g.plane_err_m)
      const cyl = errMm(g.cyl_err_m)
      const cell = el('div', {
        class: `cf-heat-cell ${pass ? 'is-pass' : 'is-fail'}`,
        title:
          `噪声 σ=${(g.noise_sigma * 1000).toFixed(0)}mm · 保留 ${(g.keep_ratio * 100).toFixed(0)}% · ${num(g.points)} 点 · ${g.shapes} 形状\n` +
          `平面误差 ${plane != null ? plane.toFixed(3) + ' mm' : '未检出'} · 圆柱误差 ${cyl != null ? cyl.toFixed(3) + ' mm' : '未检出'}`,
      })
      // 主数值：平面误差。哨兵值显示「未检出」而不是 1e+33。
      cell.appendChild(el('b', { class: 'cf-heat-num', text: plane != null ? plane.toFixed(2) : '未检出' }))
      cell.appendChild(el('span', { class: 'cf-heat-unit', text: plane != null ? 'mm 平面' : '' }))
      cell.appendChild(
        el('span', {
          class: 'cf-heat-meta',
          text: `σ${(g.noise_sigma * 1000).toFixed(0)} · 保留${(g.keep_ratio * 100).toFixed(0)}%`,
        }),
      )
      grid.appendChild(cell)
    }
    heatBox.appendChild(grid)
    verdictBox.textContent = rb.verdict ?? ''
  }

  return {
    el: root,
    activate() {
      visible = true
      renderCurrent()
      void recover()
      renderSuite()
      renderHeat()
    },
    deactivate() { visible = false; controller?.abort() },
    render() { renderCurrent() },
    async refresh() {
      await recover()
      if (historical.open && !historicalLoaded) {
        try { state.suite = await data.suite(); historicalLoaded = true; renderSuite(); renderHeat() }
        catch (error) { verdictBox.textContent = `历史基准读取失败：${String(error.message || error)}` }
      }
    },
    renderFooter(foot) {
      const row = el('div', { class: 'cf-foot-row' })
      const job = currentJob()
      row.appendChild(el('span', { class: 'mono', text: statusLabel(job) }))
      row.appendChild(el('span', { class: 'spacer' }))
      const btn = el('button', { class: 'cf-btn-sm primary', text: runBtn.textContent })
      btn.disabled = runBtn.disabled
      btn.addEventListener('click', () => void startVerify())
      row.appendChild(btn)
      foot.appendChild(row)
      if (job?.pollError || job?.sendError || job?.prepareError) foot.appendChild(el('div', { class: 'cf-msg', text: job.pollError || job.sendError || job.prepareError }))
    },
    destroy() { destroyed = true; visible = false; controller?.abort() },
  }
}
