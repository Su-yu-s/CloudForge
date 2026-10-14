// 云铸面板 · 从混杂 stdout 中提取 JSON 对象
//
// 为什么需要：AGH 的子进程输出常在 JSON 前后混有诊断/进度噪声
//   · qRANSAC_SD(Schnabel) 会往 stdout 打诊断行 —— cloudforge-tools/index.mjs 也用同样的手法截取
//   · freecadcmd 转换 STEP 时会在 JSON 之后追加成百上千行 "\t(37 %)" 进度条
// 因此不能只做 indexOf('{') + JSON.parse（尾部噪声会让 parse 直接失败），
// 这里做括号配平并识别字符串字面量，保证取到第一个完整 JSON 对象。

/**
 * @param {string} text
 * @returns {any} 解析成功返回对象，否则返回 null
 */
export function extractJson(text) {
  const s = String(text ?? '')
  const candidates = []
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '{') candidates.push(i)
    if (candidates.length > 64) break // 噪声里出现大量 '{' 时只保留前若干个起点
  }
  for (const start of candidates) {
    const obj = matchObject(s, start)
    if (obj) return obj
  }
  return null
}

/** 从 start 处的 '{' 开始括号配平，正确跳过字符串与转义；成功返回解析结果 */
function matchObject(s, start) {
  let depth = 0
  let inStr = false
  let quote = ''
  let escaped = false
  for (let i = start; i < s.length; i++) {
    const c = s[i]
    if (inStr) {
      if (escaped) escaped = false
      else if (c === '\\') escaped = true
      else if (c === quote) inStr = false
      continue
    }
    if (c === '"' || c === "'") {
      inStr = true
      quote = c
      continue
    }
    if (c === '{') depth++
    else if (c === '}') {
      depth--
      if (depth === 0) {
        try {
          return JSON.parse(s.slice(start, i + 1))
        } catch {
          return null // 这个起点不是合法 JSON，换下一个起点
        }
      }
    }
  }
  return null
}