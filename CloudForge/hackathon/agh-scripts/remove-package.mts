// 用 AGH 官方管理 SDK 直调 daemon 卸载一个已装插件包：disable（如已启用）→ remove
//
// 用法：
//   npx tsx hackathon/tools/agh/remove-package.mts cloudforge-panel

import { randomUUID } from 'node:crypto'
import { connect, sleep } from './bootstrap.mts'

const { client, profile } = await connect()

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

const PACKAGE_ID = process.argv[2]
if (!PACKAGE_ID) throw new Error('usage: remove-package.mts <packageId>')
const clientId = await client.clientId()

const existing = await client.packages.list({ profile })
const target = existing.packages.find((p) => p.id === PACKAGE_ID)
if (!target) {
  console.log(`not installed: ${PACKAGE_ID}`)
  process.exit(0)
}
console.log(`found ${PACKAGE_ID}@${target.version} desired=${target.desired} trusted=${target.trusted}`)

if (target.desired === 'enabled') {
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

const after = await client.packages.list({ profile })
console.log('remaining:', after.packages.map((p) => `${p.id}@${p.version}(${p.desired})`).join(', '))
console.log(`DONE: ${PACKAGE_ID} removed`)
process.exit(0)