// cloudforge-tools 工具级自测：mock AGH extension API，直接调 execute() 验证 CLI 调用链
// 运行：node hackathon/cloudforge-tools/tools.test.mjs（需要先构建 hackathon/cli）

const registered = []
const fakeAgnes = {
  registerTool(def) { registered.push(def) },
  on() {},
  ctx: { log: { info() {} } },
}
const fakeCtx = { extension: () => fakeAgnes }

const mod = await import('./index.mjs')
mod.cloudforgeTools.apply(fakeCtx)

const names = registered.map((t) => t.name)
console.log('registered tools:', names.join(', '))
if (names.length !== 6) throw new Error(`expected 6 tools, got ${names.length}`)
for (const t of registered) {
  if (!t.name || !t.description || !t.parameters || !t.meta) throw new Error(`tool ${t.name} missing fields`)
  for (const k of ['isReadOnly', 'isDestructive', 'isConcurrencySafe', 'isOpenWorld', 'replay', 'costHint', 'deferLoading', 'requiresApproval']) {
    if (!(k in t.meta)) throw new Error(`tool ${t.name} meta missing ${k}`)
  }
}

const T = Object.fromEntries(registered.map((t) => [t.name, t.execute]))
const run = async (name, args) => (await T[name](args)).structured

const Tmp = 'E:/C++/Point/CloudForge/hackathon/.test-run'
let failed = 0
const check = (label, cond, extra) => {
  console.log(`${cond ? 'PASS' : 'FAIL'} ${label}${extra ? ' — ' + extra : ''}`)
  if (!cond) failed++
}

// 1) synth：合成真值点云
const synth = await run('cloudforge_synth', { output_pcd: Tmp + '/t.pcd' })
check('synth ok', synth.ok === true, `${synth.points} pts`)

// 2) info
const info = await run('cloudforge_cloud_info', { cloud: Tmp + '/t.pcd' })
check('info ok', info.ok === true && info.points > 0, `${info.points} pts, span=${info.span}`)

// 3) detect
const det = await run('cloudforge_detect', { cloud: Tmp + '/t.pcd', preset: 'mechanical', output_dir: Tmp + '/out' })
check('detect ok', det.ok === true && det.shape_count >= 2, `${det.shape_count} shapes`)

// 4) verify
const ver = await run('cloudforge_verify', { truth: Tmp + '/t.truth.json', result: Tmp + '/out/result.json' })
check('verify pass', ver.ok === true && ver.pass === true, `${ver.matched}/${ver.total} matched`)

// 5) refine：全量内点精拟合
const few = await run('cloudforge_refine', { cloud: Tmp + '/t.pcd', indices_file: Tmp + '/out/indices/shape_0.txt', hint: 'plane' })
check('refine ok', few.ok === true && few.shapes.length >= 1, `${few.selected} pts → ${few.shapes.length} shape(s)`)

// 6) 失败路径：不存在的文件
const bad = await run('cloudforge_cloud_info', { cloud: 'E:/not-exists.ply' })
check('info bad file → ok:false', bad.ok === false && /not found/.test(bad.error ?? ''))

// 7) CAD 导出：检测产物 → 可执行 CadQuery 脚本
const cad = await run('cloudforge_cad_export', {
  cloud: Tmp + '/t.pcd',
  result_dir: Tmp + '/out',
  output_py: Tmp + '/model.py',
  union: true,
})
check('cad export ok', cad.ok === true && cad.exported >= 2, `${cad.exported} solids, skipped=${cad.skipped}`)

console.log(failed === 0 ? '\nALL PASS' : `\n${failed} FAILURES`)
process.exit(failed === 0 ? 0 : 1)
