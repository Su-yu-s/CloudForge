// AGH 工具共用引导：定位 agnes-harness 克隆 → 动态加载官方 SDK → 连本地 daemon。
//
// 为什么用**动态 import** 而不是静态 import：
// SDK 源码在 agnes-harness 内部（packages/sdk/src/index.node.ts），
// 静态 `from '../packages/sdk/src/…'` 只有当本文件位于 <agh-root>/scripts-tmp/ 时才解析得了。
// 这些脚本要随 CloudForge 仓库走（评审者 clone 下来就能跑），所以改成按路径动态加载，
// 并允许用 AGH_ROOT / AGH_PROFILE 覆盖发现结果。

import { randomUUID } from 'node:crypto'
import { existsSync, readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))

/** 依次尝试：环境变量 → 本仓库同级/上级的常见克隆位置 */
export function resolveAghRoot() {
  const candidates = [
    process.env.AGH_ROOT,
    resolve(here, '../../../../agnes-harness'), // E:\C++\Point\CloudForge\hackathon\tools\agh → 同级
    resolve(here, '../../../agnes-harness'),
  ].filter(Boolean)
  for (const dir of candidates) {
    if (existsSync(join(dir, 'packages/sdk/src/index.node.ts'))) return dir
  }
  throw new Error(
    '找不到 agnes-harness 仓库。\n' +
      '  设一个环境变量再跑，例如：\n' +
      '    $env:AGH_ROOT = "E:/C++/Point/agnes-harness"\n' +
      '  仓库地址：https://github.com/AgnesAI-Labs/agnes-harness',
  )
}

export function resolveProfile() {
  return process.env.AGH_PROFILE || 'local-dev'
}

/**
 * 连上本机 daemon 的私有管道。
 * @returns {Promise<{client: any, discovery: any, profile: string}>}
 */
export async function connect() {
  const root = resolveAghRoot()
  const sdk = await import(pathToFileURL(join(root, 'packages/sdk/src/index.node.ts')).href)
  const journal = await import(pathToFileURL(join(root, 'packages/sdk/src/journal.ts')).href)

  const home = join(homedir(), '.agh')
  const discovery = JSON.parse(readFileSync(join(home, 'data/daemon/discovery.json'), 'utf8'))
  if (!discovery.ready) throw new Error('daemon 未就绪（discovery.ready=false），先启动 AGH：agnes serve')

  const client = sdk.createClient({
    transport: {
      kind: 'unix',
      path: discovery.socketPath,
      serverIdentity: { pid: discovery.owner.pid, processStartId: discovery.owner.processStartId },
    },
    auth: { kind: 'local' },
    journal: journal.memoryJournal(randomUUID()),
  })
  return { client, discovery, profile: resolveProfile() }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))