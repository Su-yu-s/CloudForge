// 探针：daemon 现在认哪些工作区 / profile 解析成什么 / 有没有模型。
//
// 排查用：如果浏览器侧报 SEMANTIC_REJECTED (-32011)、工作区列表空白、模型选不了，
// 先跑这个。注意本探针的客户端**没有绑定任何工作区**，所以 config.get 本身就会返回
// -32011 —— 那是预期的，不代表 daemon 有问题；要判断 daemon 是否健康，看 workspace.list
// 是否能列出工作区且 available=true。
//
// 只读，不改任何状态。
//
// 用法：
//   npx tsx hackathon/tools/agh/probe-workspace.mts

import { connect } from './bootstrap.mts'

const { client } = await connect()

const show = async (label, fn) => {
  try {
    const v = await fn()
    const text = JSON.stringify(v) ?? 'undefined'
    console.log(`${label}: ${text.slice(0, 700)}`)
  } catch (e) {
    console.log(`${label}: ERROR ${String(e.code ?? '')} ${String(e.message || e).slice(0, 200)}`)
  }
}

await show('config.get', () => client.call('_agnes/v1/config.get', {}))
await show('workspace.list', () => client.call('_agnes/v1/workspace.list', {}))
await show('sessions.list', () => client.call('_agnes/v1/sessions.list', {}))
await show('providers/models', () => client.call('_agnes/v1/config.providers', {}))
process.exit(0)