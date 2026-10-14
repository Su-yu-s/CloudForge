// 云铸面板 · AGH 执行链解析
//
// 数据源是 AGH 官方 `agnes export <sessionId>` 的产物（JSONL，每行一个 EventEnvelope：
// {seq, ts, id(ULID), type, lane, v, actor, data}），与 hackathon/evidence/agh-trajectory-web.json
// 同格式。实时链路不必解析——ctx.session.projection.read() 直接给 UITimeline，
// 本模块负责"把已导出的证据文件压成面板能显示的链"，用于离线摘要与评审材料。
//
// 三条赛事硬约束在这里各有对应证据类型：
//   底座 AGH / 连续步骤 → step/start · step/end · turn/end
//   plan→call→verify → tool/call · tool/result · verifier/signal(scope=tool|step|turn)
//   模型仅 Agnes      → request/header · request/sent · cost/ledger 的 data.model

import { existsSync, readFileSync } from 'node:fs'

const MAX_BYTES = 12 * 1024 * 1024

function parseJsonl(text) {
  const events = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t[0] !== '{') continue
    try {
      events.push(JSON.parse(t))
    } catch {
      /* 跳过损坏行：导出行可能被截断，不应让整份证据读不出来 */
    }
  }
  return events
}

export function readEvents(path) {
  if (!existsSync(path)) return { ok: false, error: `轨迹文件不存在：${path}`, events: [] }
  let stat
  try {
    stat = existsSync(path) ? readFileSync(path, 'utf8') : ''
  } catch (e) {
    return { ok: false, error: `轨迹文件读取失败：${String(e.message || e).slice(0, 120)}`, events: [] }
  }
  if (stat.length > MAX_BYTES) stat = stat.slice(-MAX_BYTES)
  return { ok: true, events: parseJsonl(stat) }
}

/** 从事件流抽出执行链 + 模型 + 报告全文 */
export function summarize(events) {
  const calls = new Map() // toolUseId → 调用条目
  const steps = []
  const verifies = []
  const effects = new Map()
  let model = null
  let report = ''
  let turnEnd = null
  let firstTs = null
  let lastTs = null

  for (const e of events) {
    const d = e.data ?? {}
    if (e.ts) {
      if (!firstTs) firstTs = e.ts
      lastTs = e.ts
    }
    switch (e.type) {
      case 'step/start':
        steps.push({ kind: 'step-start', turn: d.turn ?? null, step: d.step ?? null, ts: e.ts, id: e.id })
        break
      case 'step/end':
        steps.push({ kind: 'step-end', turn: d.turn ?? null, step: d.step ?? null, ts: e.ts, id: e.id })
        break
      case 'tool/call':
        calls.set(d.toolUseId, {
          kind: 'call',
          tool: d.name ?? 'unknown',
          toolUseId: d.toolUseId ?? '',
          ordinal: d.ordinal ?? null,
          args: safeArgs(d.args),
          requiresApproval: d.resolvedPolicy?.requiresApproval ?? null,
          executionDomain: d.executionDomain ?? null,
          ts: e.ts,
          id: e.id,
          ok: null,
          durationMs: null,
        })
        break
      case 'tool/result': {
        const entry = calls.get(d.toolUseId)
        const structured = d.structured ?? {}
        if (entry) {
          entry.ok = d.isError !== true
          entry.result = {
            shape_count: structured.shape_count ?? null,
            inlier_point_sum: structured.inlier_point_sum ?? null,
            points: structured.points ?? null,
            elapsed_ms: structured.elapsed_ms ?? null,
            exported: structured.exported ?? null,
            skipped: structured.skipped ?? null,
            pass: structured.pass ?? null,
            matched: structured.matched ?? null,
            total: structured.total ?? null,
            file: structured.file ?? null,
          }
        }
        break
      }
      case 'verifier/signal':
        verifies.push({
          scope: d.scope ?? 'unknown',
          verdict: d.verdict ?? 'unknown',
          tier: d.tier ?? null,
          toolUseId: d.toolUseId ?? null,
          ts: e.ts,
        })
        break
      case 'effect/intent':
        effects.set(d.effectId, { effectId: d.effectId, kind: d.kind ?? null, tool: d.tool?.name ?? null, durationMs: null, outcome: null })
        break
      case 'effect/settled': {
        const hit = effects.get(d.effectId)
        if (hit) {
          hit.durationMs = d.durationMs ?? null
          hit.outcome = d.outcome ?? null
        }
        break
      }
      case 'request/header':
      case 'request/sent':
      case 'cost/ledger': {
        const m = typeof d.model === 'string' ? d.model : d.model?.id
        if (m) model = m
        break
      }
      case 'assistant/message': {
        const text = Array.isArray(d.content)
          ? d.content.filter((c) => c && c.type === 'text').map((c) => c.text).join('\n')
          : ''
        // 取最后一条有实质内容的助手消息作为报告全文
        if (text.trim().length > report.trim().length) report = text
        break
      }
      case 'turn/end':
        turnEnd = { reason: d.reason ?? null, lastAssistantSeq: d.lastAssistantSeq ?? null, ts: e.ts }
        break
      default:
        break
    }
  }

  const callList = [...calls.values()].sort((a, b) => String(a.ts ?? '').localeCompare(String(b.ts ?? '')))
  // 执行链：按时间顺序把 step / call / verify 拍平成一条，评审可直接读
  const chain = [
    ...steps.map((s) => ({ at: s.ts, kind: s.kind === 'step-start' ? 'plan-step' : 'plan-step-end', label: `第${s.turn}轮 · 步骤${s.step}`, detail: null })),
    ...callList.map((c) => ({ at: c.ts, kind: 'call', label: c.tool, detail: summarizeCall(c) })),
    ...verifies.map((v) => ({ at: v.ts, kind: 'verify', label: `${v.scope} 判定`, detail: v.verdict })),
  ].sort((a, b) => String(a.at ?? '').localeCompare(String(b.at ?? '')))

  return {
    ok: true,
    eventCount: events.length,
    firstTs,
    lastTs,
    model,
    turnEnd,
    calls: callList,
    verifies,
    stepCount: steps.filter((s) => s.kind === 'step-start').length,
    chain,
    report,
    // 三条硬约束的自检结论：面板可直接显示"合规自检"
    compliance: {
      // AGH 事件命名空间（tool/ step/ turn/ effect/ verifier/ budget. 等）本身就是底座证据
      aghBase: events.some((e) =>
        /^(tool|step|turn|effect|verifier|assistant|request|budget|approval)\//.test(String(e.type ?? '')),
      ),
      continuousSteps: steps.filter((s) => s.kind === 'step-start').length,
      toolCalls: callList.length,
      verified: verifies.filter((v) => v.verdict === 'pass').length,
      verifyScopes: [...new Set(verifies.map((v) => v.scope))],
      modelsUsed: model ? [model] : [],
      onlyAgnesModels: model ? /^agnes[-.]/i.test(model) : false,
      completed: turnEnd?.reason === 'completed',
    },
  }
}

function summarizeCall(c) {
  const r = c.result ?? {}
  const bits = []
  if (r.points) bits.push(`${r.points.toLocaleString('en-US')} 点`)
  if (r.shape_count != null) bits.push(`${r.shape_count} 基元`)
  if (r.inlier_point_sum != null) bits.push(`内点 ${r.inlier_point_sum.toLocaleString('en-US')}`)
  if (r.exported != null) bits.push(`导出 ${r.exported} 个实体`)
  if (r.elapsed_ms != null) bits.push(`${r.elapsed_ms} ms`)
  if (r.pass != null) bits.push(r.pass ? 'verify PASS' : 'verify FAIL')
  if (c.requiresApproval) bits.push(`需审批(${c.requiresApproval})`)
  return bits.length ? bits.join(' · ') : null
}

function safeArgs(args) {
  if (!args || typeof args !== 'object') return null
  const out = {}
  for (const [k, v] of Object.entries(args)) {
    out[k] = typeof v === 'string' ? shorten(v) : v
  }
  return out
}

function shorten(v) {
  return v.length > 120 ? `${v.slice(0, 117)}...` : v
}

/** 读文件并汇总 */
export function traceFromFile(path) {
  const { ok, error, events } = readEvents(path)
  if (!ok) return { ok: false, error, calls: [], verifies: [], chain: [], report: '' }
  return { file: path, ...summarize(events) }
}