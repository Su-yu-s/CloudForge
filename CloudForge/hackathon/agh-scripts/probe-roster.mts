// 探针：客户端模块名册（_agnes/v1/clientModules.list）——确认 AGH 点云面板
// 已装、已信任、已启用，且 entryUrl / slots / slotCatalogVersion 都被正确登记。
// 只读，不改任何状态。
//
// 用法：
//   npx tsx hackathon/tools/agh/probe-roster.mts

import { connect } from './bootstrap.mts'

const { client, profile } = await connect()
const roster = await client.clientModules.list(profile)
console.log('modules:', roster.modules.length)
for (const m of roster.modules) {
  console.log('-', m.packageId)
  console.log('    rowId     =', m.rowId)
  console.log('    revision  =', String(m.revision))
  console.log('    entryUrl  =', m.entryUrl ?? '(none)')
  console.log('    slots     =', JSON.stringify(m.slots ?? []))
  console.log('    services  =', JSON.stringify(m.services ?? []))
  console.log('    catalogVer=', m.slotCatalogVersion ?? '(none)')
}
process.exit(0)