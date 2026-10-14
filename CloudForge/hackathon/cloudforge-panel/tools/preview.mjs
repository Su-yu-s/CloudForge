// 云铸面板 · 独立预览台（不经 AGH，用于快速验证渲染与交互）
//
// 用途：AGH 的 rightbar.session 槽要活动会话 + 已信任工作区才能挂载，
// 现场改一行前端想看效果时不该被这些前置条件卡住。这个进程用真实的后端
// runtime handler 提供同款 JSON 服务，再用浏览器原生 ESM 加载真实的
// client/index.js（只把 'react' 换成 20 行的 createElement shim）。
//
// 用法：
//   node hackathon/cloudforge-panel/tools/preview.mjs [--port 5199] [--no-open]
// 打开 http://127.0.0.1:5199/

import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { dirname, extname, join, normalize, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const PANEL = resolve(HERE, '..', 'extensions', 'main')
const ROOT = resolve(HERE, '..', '..', '..')

const args = process.argv.slice(2)
const port = Number(args[args.indexOf('--port') + 1]) || 5199

// Windows 上动态 import 必须是 file:// URL，直接传盘符路径会 ERR_UNSUPPORTED_ESM_URL_SCHEME
const { SERVICES } = await import(pathToFileURL(join(PANEL, 'index.mjs')).href)
const handlers = new Map(SERVICES.map((s) => [s.name, s.handler]))

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1')
  const path = decodeURIComponent(url.pathname)

  // 后端服务：与 AGH 走的是同一批 handler，只是省掉了 BFF/配额层
  if (path.startsWith('/svc/')) {
    const name = path.slice(5)
    const handler = handlers.get(name)
    if (!handler) {
      res.writeHead(404, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: `未知服务 ${name}` }))
      return
    }
    let input = {}
    if (req.method === 'POST') {
      const chunks = []
      for await (const c of req) chunks.push(c)
      try {
        input = JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')
      } catch {
        input = {}
      }
    }
    try {
      const output = await handler(input)
      // 与 AGH 一致的 1 MiB 预算校验，便于提前发现超限
      const bytes = Buffer.byteLength(JSON.stringify(output ?? {}), 'utf8')
      if (bytes > 1048576) {
        res.writeHead(413, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ error: `超出 AGH maxResultBytes：${bytes} > 1048576` }))
        return
      }
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify(output ?? {}))
    } catch (e) {
      res.writeHead(500, { 'content-type': 'application/json; charset=utf-8' })
      res.end(JSON.stringify({ error: String((e && e.message) || e) }))
    }
    return
  }

  if (path === '/' || path === '/index.html') {
    const html = await readFile(join(HERE, 'preview.html'), 'utf8')
    res.writeHead(200, { 'content-type': MIME['.html'] })
    res.end(html)
    return
  }

  // 静态：/panel/** → extensions/main/**，/react.mjs → shim
  let file
  if (path === '/react.mjs') {
    file = join(HERE, 'react-shim.mjs')
  } else if (path.startsWith('/panel/')) {
    const rel = normalize(path.slice('/panel/'.length)).replace(/^([/\\])+/, '')
    file = join(PANEL, rel)
    if (!file.startsWith(PANEL)) {
      res.writeHead(403)
      res.end('forbidden')
      return
    }
  } else {
    res.writeHead(404)
    res.end('not found')
    return
  }

  try {
    const info = await stat(file)
    if (!info.isFile()) throw new Error('not a file')
    const body = await readFile(file)
    res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' })
    res.end(`404 ${path}`)
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`CloudForge 面板预览台: http://127.0.0.1:${port}/`)
  console.log(`  面板目录: ${PANEL}`)
  console.log(`  工作区  : ${ROOT}`)
  console.log(`  服务    : ${[...handlers.keys()].join(', ')}`)
})