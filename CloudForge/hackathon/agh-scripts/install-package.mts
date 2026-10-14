// 用 AGH 官方管理 SDK 直调 daemon 完成插件包的安装流程：
// inspect → install → trust → enable
// （CLI 的交互确认要求 TTY，SDK 是官方提供的程序化管理路径）
//
// 用法（必须在 CloudForge 仓库根执行，因为 file: 源只接受 file:./ 相对路径）：
//   cd E:\C++\Point\CloudForge
//   pnpm --dir E:\C++\Point\agnes-harness exec tsx ..\CloudForge\hackathon\tools\agh\install-package.mts "file:./hackathon/cloudforge-panel" "cloudforge-panel"
//   # 或先设好 AGH_ROOT，然后：
//   npx tsx hackathon/tools/agh/install-package.mts "file:./hackathon/cloudforge-panel" "cloudforge-panel"

import { randomUUID } from 'node:crypto'
import { connect, sleep } from './bootstrap.mts'

const { client, discovery, profile } = await connect()

const commandId = (kind) => `${kind}-${randomUUID().replaceAll('-', '')}`

async function waitOperation(opId, label) {
  for (let i = 0; i < 120; i++) {
    const op = await client.packages.operation.get({ profile, operationId: opId })
    if (['completed', 'failed', 'cancelled', 'rolled-back'].includes(op.state)) {
      console.log(`[${label}] ${op.state} (${op.progress}%)`)
      if (op.state !== 'completed') {
        console.log(JSON.stringify(op, null, 2))
        throw new Error(`${label} failed`)
      }
      return op
    }
    await sleep(500)
  }
  throw new Error(`${label} timed out`)
}

const SOURCE = { type: 'file', ref: process.argv[2] ?? 'file:./hackathon/cloudforge-tools' }
const PACKAGE_ID = process.argv[3] ?? 'cloudforge-tools'
const clientId = await client.clientId()
console.log(`daemon: ${discovery.socketPath}\nclientId: ${clientId}\nsource: ${SOURCE.ref}`)

// 0) 幂等：已装旧版则先移除（否则 install 新版本会被包状态机拒绝）
const existing = await client.packages.list({ profile })
const old = existing.packages.find((p) => p.id === PACKAGE_ID)
if (old) {
  console.log(`removing existing ${PACKAGE_ID}@${old.version} ...`)
  if (old.desired === 'enabled') {
    const dis = await client.packages.disable({
      profile,
      clientId,
      commandId: commandId('disable'),
      id: PACKAGE_ID,
    })
    await waitOperation(dis.operationId, 'disable')
  }
  const rm = await client.packages.remove({
    profile,
    clientId,
    commandId: commandId('remove'),
    id: PACKAGE_ID,
  })
  await waitOperation(rm.operationId, 'remove')
}

// 1) inspect（receipt → 等 operation → preview）
const inspectReceipt = await client.packages.inspect({
  profile,
  clientId,
  commandId: commandId('inspect'),
  source: SOURCE,
})
const inspectOp = await waitOperation(inspectReceipt.operationId, 'inspect')
const preview = inspectOp.preview
if (!preview) throw new Error('inspection completed without a preview')
console.log(`\npreview: ${preview.id}@${preview.version}`)
console.log(`integrity: ${preview.integrity}`)

// 2) install（保持 untrusted/disabled 默认）
const installReceipt = await client.packages.install({
  profile,
  clientId,
  commandId: commandId('install'),
  source: preview.source ?? SOURCE,
  expectedIntegrity: preview.integrity,
})
const installedOp = await waitOperation(installReceipt.operationId, 'install')
const installed = installedOp.installed
if (!installed) throw new Error('no installed record')
console.log(`installed: ${installed.id}@${installed.version} trusted=${installed.trusted} desired=${installed.desired}`)

// 3) trust（绑定安装时输出的完整性 + 能力哈希）
const capabilityHash = installed.capabilityHash
if (!capabilityHash) throw new Error('missing capabilityHash in installed record')
const trustReceipt = await client.packages.trust({
  profile,
  clientId,
  commandId: commandId('trust'),
  id: installed.id,
  expectedIntegrity: preview.integrity,
  capabilityHash,
})
await waitOperation(trustReceipt.operationId, 'trust')

// 4) enable
const enableReceipt = await client.packages.enable({
  profile,
  clientId,
  commandId: commandId('enable'),
  id: installed.id,
})
await waitOperation(enableReceipt.operationId, 'enable')

const list = await client.packages.list({ profile })
console.log('\npackages:', JSON.stringify(list.packages, null, 2))
console.log('\nDONE: package installed, trusted and enabled')
process.exit(0)