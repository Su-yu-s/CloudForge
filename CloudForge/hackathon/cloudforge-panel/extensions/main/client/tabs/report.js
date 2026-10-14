// 云铸面板 · 报告页签
// 三块内容，全部来自真实产物：
//   ① 智能体自己写的 markdown 报告（AGH 事件里的 assistant/message 原文）
//   ② 场景换算：竣工核验口径的净高/开间/墙厚/平整度，由 result.json 的 coefficients 现算
//   ③ AGH 执行链：tool/call → tool/result → verifier/signal（plan→call→verify 的直接证据）+ 模型名

import { el, icon, num, mm, pct, typeCn, esc } from '../ui.js'

/** 场景 profile → 报告口径（对齐 hackathon/VALUE.md 第二节） */
const SEMANTICS = {
  asbuilt: { label: '竣工核验', unitNote: '净高/开间/墙厚 由平行平面对距换算；平整度以 robust_sigma 为代理量' },
  ship: { label: '船舶分段', unitNote: '基面/骨材参数 + 对照设计值的偏差表' },
  relic: { label: '文物构件', unitNote: '柱径/梁截面/墙体倾角 参数卡' },
}

export function createReportTab({ ctx, data, state }) {
  const root = el('section', { class: 'cf-pane', dataset: { pane: 'report' } })
  const scroll = el('div', { class: 'cf-scroll' })
  root.appendChild(scroll)

  const chainBox = el('div', { class: 'cf-list' })
  const complianceBox = el('div', { class: 'cf-list' })
  const derivedBox = el('div', { class: 'cf-list' })
  const reportBox = el('div', { class: 'cf-report' })

  scroll.appendChild(title('AGH 执行链'))
  scroll.appendChild(complianceBox)
  scroll.appendChild(chainBox)
  scroll.appendChild(title('场景换算'))
  scroll.appendChild(derivedBox)
  scroll.appendChild(title('智能体报告原文'))
  scroll.appendChild(reportBox)

  function title(t) {
    return el('div', { class: 'cf-group-title', text: t })
  }

  function renderCompliance() {
    complianceBox.replaceChildren()
    const c = state.trace?.compliance
    if (!c) {
      complianceBox.appendChild(el('div', { class: 'cf-empty' }, '未找到 AGH 轨迹证据（hackathon/evidence/*.json）'))
      return
    }
    const items = [
      ['底座 AGH', c.aghBase, `识别到 ${c.continuousSteps} 个 AGH 步骤事件`],
      ['连续 plan→call→verify', c.toolCalls > 0 && c.verified > 0, `${c.toolCalls} 次工具调用 · ${c.verified} 条 verifier 判定（${c.verifyScopes.join('/')}）`],
      ['模型仅 Agnes', c.onlyAgnesModels, c.modelsUsed.join(', ') || '—'],
      ['本轮正常结束', c.completed, state.trace?.turnEnd?.reason ?? '—'],
    ]
    for (const [k, ok, detail] of items) {
      complianceBox.appendChild(
        el('div', { class: 'cf-kv' }, [
          el('span', {}, [el('span', { class: `cf-dot-ico ${ok ? 'ok' : 'err'}`, text: ok ? '✓' : '✗' }), ' ' + k]),
          el('span', { class: 'mono', text: String(detail) }),
        ]),
      )
    }
  }

  function renderChain() {
    chainBox.replaceChildren()
    const chain = state.trace?.chain ?? []
    if (!chain.length) {
      chainBox.appendChild(el('div', { class: 'cf-empty' }, '无执行链'))
      return
    }
    for (const s of chain.slice(0, 40)) {
      const kindClass = s.kind === 'call' ? 'call' : s.kind === 'verify' ? 'verify' : 'plan'
      const time = s.at ? String(s.at).slice(11, 23) : ''
      const row = el('div', { class: `cf-chain-row ${kindClass}` }, [
        el('span', { class: 'cf-chain-time mono', text: time }),
        el('span', { class: `cf-chain-kind ${kindClass}`, text: s.kind === 'call' ? 'CALL' : s.kind === 'verify' ? 'VERIFY' : 'PLAN' }),
        el('span', { class: 'cf-chain-label', text: s.label }),
      ])
      if (s.detail) row.appendChild(el('span', { class: 'cf-chain-detail', text: s.detail }))
      chainBox.appendChild(row)
    }
  }

  /** 场景换算：只做可解释的确定性几何，不做任何"猜测性"结论 */
  function renderDerived() {
    derivedBox.replaceChildren()
    const sem = SEMANTICS[state.sceneId] ?? SEMANTICS.asbuilt
    derivedBox.appendChild(el('div', { class: 'cf-note', text: `${sem.label}：${sem.unitNote}` }))
    const scene = state.sceneCache
    if (!scene?.shapes?.length) {
      derivedBox.appendChild(el('div', { class: 'cf-empty' }, '暂无检测结果'))
      return
    }
    const planes = scene.shapes.filter((s) => s.type === 'Plane' && s.coefficients?.length >= 4)
    const pairs = parallelPairs(planes)
    derivedBox.appendChild(
      el('div', { class: 'cf-kv' }, [
        el('span', { text: '平面数 / 平行对' }),
        el('span', { class: 'mono', text: `${planes.length} / ${pairs.length}` }),
      ]),
    )
    // 取最显著的几组平行面（按间距从小到大，滤掉 <2cm 的同面重复）
    const useful = pairs.filter((p) => p.gap > 0.02 && p.gap < 20).slice(0, 8)
    for (const p of useful) {
      derivedBox.appendChild(
        el('div', { class: 'cf-kv' }, [
          el('span', { text: `间距 #${p.a} ↔ #${p.b}（法向夹角 ${p.angleDeg.toFixed(1)}°）` }),
          el('span', { class: 'mono', text: `${(p.gap * 1000).toFixed(1)} mm` }),
        ]),
      )
    }
    const sigma = planes.map((s) => s.robust_sigma).filter((v) => typeof v === 'number')
    if (sigma.length) {
      sigma.sort((a, b) => a - b)
      const med = sigma[Math.floor(sigma.length / 2)]
      derivedBox.appendChild(
        el('div', { class: 'cf-kv' }, [
          el('span', { text: '平整度代理量（robust_σ 中位数）' }),
          el('span', { class: 'mono', text: mm(med) }),
        ]),
      )
      derivedBox.appendChild(
        el('div', { class: 'cf-kv' }, [
          el('span', { text: 'σ > 3 mm 的面' }),
          el('span', { class: 'mono', text: `${sigma.filter((v) => v > 0.003).length} / ${sigma.length}（建议复测）` }),
        ]),
      )
    }
    derivedBox.appendChild(
      el('div', { class: 'cf-note' }, '说明：间距 = |Δd| / |n₁·n₂|，仅当两平面法向接近共线时才是真实构件间距；σ 为 RANSAC 鲁棒噪声尺度，不是规范平整度。'),
    )
  }

  /** 两两平行面：返回 {a, b, gap, angleDeg} */
  function parallelPairs(planes) {
    const out = []
    for (let i = 0; i < planes.length; i++) {
      for (let j = i + 1; j < planes.length; j++) {
        const A = planes[i].coefficients
        const B = planes[j].coefficients
        const na = [A[0], A[1], A[2]]
        const nb = [B[0], B[1], B[2]]
        const la = Math.hypot(...na) || 1
        const lb = Math.hypot(...nb) || 1
        const cosang = Math.min(1, Math.abs((na[0] * nb[0] + na[1] * nb[1] + na[2] * nb[2]) / (la * lb)))
        const angleDeg = (Math.acos(cosang) * 180) / Math.PI
        if (angleDeg > 8) continue // 8° 内才算"近似平行"，否则不是同一类构件
        const denom = Math.max(cosang, 1e-3)
        const gap = Math.abs(A[3] / la - B[3] / lb) / denom
        out.push({ a: planes[i].id, b: planes[j].id, gap, angleDeg })
      }
    }
    return out.sort((x, y) => x.gap - y.gap)
  }

  function renderReport() {
    reportBox.replaceChildren()
    const md = state.trace?.report
    if (!md) {
      reportBox.appendChild(el('div', { class: 'cf-empty' }, '轨迹证据里没有助手报告（assistant/message）'))
      return
    }
    // 极简 markdown → HTML（只处理标题/表格/列表/粗体/代码，够用且不引依赖）
    reportBox.innerHTML = mdToHtml(String(md))
  }

  return {
    el: root,
    activate() {
      renderCompliance()
      renderChain()
      renderDerived()
      renderReport()
    },
    deactivate() {},
    render() {},
    async refresh() {
      try {
        state.trace = await data.trace()
      } catch (e) {
        state.message = `轨迹读取失败：${String(e.message || e).slice(0, 80)}`
      }
    },
    renderFooter(foot, { state: st, data: dl, reload }) {
      const row = el('div', { class: 'cf-foot-row' })
      const t = st.trace
      row.appendChild(el('span', { class: 'mono', text: t?.ok === false ? '无轨迹证据' : `${num(t?.eventCount)} 事件 · ${t?.model ?? '—'}` }))
      row.appendChild(el('span', { class: 'spacer' }))
      const exportBtn = el('button', { class: 'cf-btn-sm', title: '用 AGH 官方 export 命令导出当前会话证据' }, '导出记录')
      exportBtn.addEventListener('click', () => void exportTrace(exportBtn))
      row.appendChild(exportBtn)
      foot.appendChild(row)

      const primary = el('button', { class: 'cf-primary-btn' }, [icon('play', 13), el('span', { text: '一键分析（检测 → CAD → 验证）' })])
      primary.addEventListener('click', () => void analyze(primary))
      foot.appendChild(primary)
      if (st.message) foot.appendChild(el('div', { class: 'cf-msg', text: st.message }))
    },
  }

  async function exportTrace(btn) {
    const sid = ctx.session?.sessionId
    if (!sid) {
      state.message = '需要一个已打开的会话才能导出记录'
      return
    }
    btn.disabled = true
    state.message = '正在调用 AGH 官方 export 命令…'
    try {
      // 两段式：effect 只负责启动（AGH 服务上限 30s），进度用 query 轮询
      const started = await dl.runEffect('cloudforge.export', { session_id: sid })
      if (!started?.started) {
        state.message = `无法启动导出：${started?.error ?? '未知'}`
        btn.disabled = false
        return
      }
      const deadline = Date.now() + 180000
      for (;;) {
        const st = await dl.call('cloudforge.exportstatus', { job: started.job })
        if (st.done) {
          state.message = st.ok
            ? `已导出 ${st.jsonl.split(/[\\/]/).pop()}（${(st.bytes / 1024).toFixed(0)} KB）${st.html ? ' + HTML' : ''}`
            : `导出失败：${(st.stderr || '未知').slice(0, 120)}`
          break
        }
        if (Date.now() > deadline) {
          state.message = '导出超时，可稍后再试'
          break
        }
        await new Promise((r) => setTimeout(r, 1200))
      }
    } catch (e) {
      state.message = `导出失败：${String(e.message || e).slice(0, 100)}`
    }
    btn.disabled = false
  }

  async function analyze(btn) {
    btn.disabled = true
    const label = btn.textContent
    try {
      btn.textContent = '已发送到当前会话…'
      await data.prompt(
        '使用 cloud-casting 流程分析工作区里最新的 CloudForge 检测结果：导出 CAD 到 STEP、执行 verify 并把结论写进报告。',
      )
      state.message = '已发送；本轮结束后面板会自动刷新'
    } catch (e) {
      state.message = `发送失败：${String(e.message || e).slice(0, 100)}`
      btn.textContent = label
      btn.disabled = false
      return
    }
    setTimeout(() => {
      btn.textContent = label
      btn.disabled = false
    }, 2500)
  }
}

/** 极简 markdown 渲染（标题/列表/表格/粗体/行内代码/段落） */
function mdToHtml(md) {
  const lines = md.split('\n')
  const out = []
  let inTable = false
  let inList = false
  const closeList = () => {
    if (inList) {
      out.push('</ul>')
      inList = false
    }
  }
  const closeTable = () => {
    if (inTable) {
      out.push('</tbody></table>')
      inTable = false
    }
  }
  const inline = (s) =>
    esc(s)
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (/^\s*\|/.test(line)) {
      const cells = line.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim())
      if (/^[\s|:-]+$/.test(line)) continue // 分隔行
      if (!inTable) {
        closeList()
        out.push('<table><thead><tr>' + cells.map((c) => `<th>${inline(c)}</th>`).join('') + '</tr></thead><tbody>')
        inTable = true
      } else {
        out.push('<tr>' + cells.map((c) => `<td>${inline(c)}</td>`).join('') + '</tr>')
      }
      continue
    }
    closeTable()
    const h = /^(#{1,6})\s+(.*)$/.exec(line)
    if (h) {
      closeList()
      const lv = Math.min(6, h[1].length + 2)
      out.push(`<h${lv}>${inline(h[2])}</h${lv}>`)
      continue
    }
    const li = /^\s*[-*]\s+(.*)$/.exec(line)
    if (li) {
      if (!inList) {
        out.push('<ul>')
        inList = true
      }
      out.push(`<li>${inline(li[1])}</li>`)
      continue
    }
    if (!line.trim()) {
      closeList()
      continue
    }
    closeList()
    out.push(`<p>${inline(line)}</p>`)
  }
  closeList()
  closeTable()
  return out.join('')
}