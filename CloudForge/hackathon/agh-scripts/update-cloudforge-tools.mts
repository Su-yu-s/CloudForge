// Update the reviewed tool package through the official AGH administration SDK.
// Run from the CloudForge project root. No model/tool verification is executed here.
import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { isDeepStrictEqual } from 'node:util'
import { connect, sleep } from './bootstrap.mts'

const id = 'cloudforge-tools'
const source = { type: 'file', ref: 'file:./hackathon/cloudforge-tools' }
const manifest = JSON.parse(readFileSync('hackathon/cloudforge-tools/package.json', 'utf8'))
const reviewed = { plugins: [{ export: 'cloudforgeTools', id: 'ext:cloudforge/cloudforge-tools', inject: ['extension'] }] }
if (manifest.name !== id || manifest.exports !== './index.mjs' || !isDeepStrictEqual(manifest.agnes, reviewed)
  || Object.keys(manifest.dependencies || {}).length || Object.keys(manifest.scripts || {}).length)
  throw new Error('Unexpected tool package entry, contributions, dependencies or scripts')

const { client, profile } = await connect()
const clientId = await client.clientId()
const commandId = () => `cloudforge-tools-update-${randomUUID().replaceAll('-', '')}`
async function completed(receipt, label) {
  for (let i = 0; i < 120; i++) {
    const operation = await client.packages.operation.get({ profile, operationId: receipt.operationId })
    if (['completed', 'failed', 'cancelled', 'rolled-back'].includes(operation.state)) {
      console.log(`${label}: ${operation.state}`)
      if (operation.state !== 'completed') throw new Error(`${label} failed: ${JSON.stringify(operation.error || operation.blockers || operation.state)}`)
      return operation
    }
    await sleep(500)
  }
  throw new Error(`${label} timed out; inspect the existing operation before retrying`)
}

const installed = (await client.packages.list({ profile })).packages.find((entry) => entry.id === id)
const inspection = await completed(await client.packages.inspect({ profile, clientId, commandId: commandId(), source }), 'inspect')
const preview = inspection.preview
if (!preview || preview.id !== id || !preview.capabilityHash || preview.blockers?.length
  || Object.keys(preview.dependencies || {}).length) throw new Error('Tool package inspection did not match the reviewed package')
if (installed && preview.capabilityHash !== installed.capabilityHash)
  throw new Error('Tool package capability change requires a separate source review')
console.log(JSON.stringify({ id, previousIntegrity: installed?.integrity ?? null, actual: installed?.actual ?? null,
  capabilityHash: preview.capabilityHash, candidateIntegrity: preview.integrity }))
if (process.argv.includes('--inspect-only')) process.exit(0)

if (installed) {
  const activeIntegrity = installed.actualIntegrity ?? (installed.actual === 'not-running' ? null : undefined)
  if (activeIntegrity === undefined) throw new Error('Active tool package identity is unavailable')
  await completed(await client.packages.update({ profile, clientId, commandId: commandId(), id,
    source: preview.source ?? source, expectedIntegrity: preview.integrity,
    activation: { expectedInstalledIntegrity: installed.integrity, expectedActiveIntegrity: activeIntegrity,
      trust: { integrity: preview.integrity, capabilityHash: preview.capabilityHash } },
  }), 'update')
} else {
  await completed(await client.packages.install({ profile, clientId, commandId: commandId(), source: preview.source ?? source,
    expectedIntegrity: preview.integrity }), 'install')
  await completed(await client.packages.trust({ profile, clientId, commandId: commandId(), id,
    expectedIntegrity: preview.integrity, capabilityHash: preview.capabilityHash }), 'trust')
  await completed(await client.packages.enable({ profile, clientId, commandId: commandId(), id }), 'enable')
}
const updated = (await client.packages.list({ profile })).packages.find((entry) => entry.id === id)
console.log(JSON.stringify({ id, desired: updated?.desired, actual: updated?.actual, integrity: updated?.integrity, actualIntegrity: updated?.actualIntegrity }))
if (updated?.actual !== 'running' || updated.actualIntegrity !== preview.integrity) throw new Error('Updated CloudForge tools are not active')
process.exit(0)
