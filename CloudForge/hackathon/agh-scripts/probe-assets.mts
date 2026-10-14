// 探针：逐个读取面板的 client 资源，验证 daemon 能否返回。
//
// 为什么需要它：每个 client 资源的 RPC 结果 JSON 硬上限 1 MiB
// （packages/protocol/src/package-admin.ts:605 的 inspectJsonData(value, 1048576)），
// base64 还要涨 4/3 ⇒ 原始字节必须 ≲780 KB。超限时 daemon 抛
// RESULT_INVALID，而 web 层把「未找到 / 拒绝 / 不可达」统一变成**同一个空 body 的 404**，
// 同目录其它文件却全是 200 —— 极难定位。只有这个探针能看见真实错误。
//
// 用法：
//   npx tsx hackathon/tools/agh/probe-assets.mts <integrity> [资源路径…]
// 例：
//   npx tsx hackathon/tools/agh/probe-assets.mts sha256-xxxx \
//     /extensions/main/client/index.js /extensions/main/client/vendor/three.core.js

import { connect } from './bootstrap.mts'

const { client, profile } = await connect()

const revision = process.argv[2]
if (!revision) {
  console.error('usage: probe-assets.mts <integrity> [path…]')
  console.error('integrity 从 probe-roster.mts 的 revision 里取（去掉 "sha256-" 前缀不算，要整串）')
  process.exit(2)
}

const paths =
  process.argv.length > 3
    ? process.argv.slice(3)
    : [
        '/extensions/main/client/index.js',
        '/extensions/main/client/index.css',
        '/extensions/main/client/panel.js',
        '/extensions/main/client/viewer.js',
        '/extensions/main/client/data.js',
        '/extensions/main/client/vendor/three.core.js',
        '/extensions/main/client/vendor/three.module.js',
      ]

let failed = 0
for (const p of paths) {
  const full = `/plugins/cloudforge-panel/${revision}${p}`
  const started = Date.now()
  try {
    const r = await client.clientModules.read(profile, full)
    const b64 = r.base64?.length ?? 0
    const pct = Math.round((b64 / 1048576) * 100)
    if (r.found) {
      console.log(`FOUND ${String(b64).padStart(9)} b64 (${pct}% 预算) ${Date.now() - started}ms  ${p}`)
    } else {
      failed++
      console.log(`MISS  ${p}`)
    }
  } catch (e) {
    failed++
    const err = e
    console.log(`THROW ${p}`)
    console.log(`      code=${String(err.code)} message=${String(err.message)}`)
    console.log(`      data=${JSON.stringify(err.data)}`)
  }
}
console.log(failed ? `\n${failed} 个资源取不到` : '\n全部资源可读')
process.exit(failed ? 1 : 0)