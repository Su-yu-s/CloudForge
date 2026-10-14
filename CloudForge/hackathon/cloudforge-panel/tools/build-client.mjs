import { build } from 'esbuild'
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const client = fileURLToPath(new URL('../extensions/main/client/', import.meta.url))
const output = join(client, 'bundle')
const manifest = join(output, '_build.json')
const result = await build({
  entryPoints: { index: join(client, 'index.js') },
  outdir: output,
  entryNames: '[name]',
  chunkNames: 'chunk-[hash]',
  bundle: true,
  splitting: true,
  minify: true,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  sourcemap: false,
  charset: 'utf8',
  legalComments: 'eof',
  external: ['react', 'react/*', 'react-dom', 'react-dom/*', '@agnes/cordis', '@agnes/web-client'],
  write: false,
})

// AGH 的客户端资源使用 base64 RPC；保留余量，避免仅遵守包的 4MiB 文件限制。
for (const file of result.outputFiles) {
  if (file.contents.byteLength > 750 * 1024) throw new Error(`Client chunk exceeds RPC budget: ${basename(file.path)}`)
}
let previous = []
try { previous = JSON.parse(await readFile(manifest, 'utf8')).files ?? [] } catch { /* 首次打包 */ }
await mkdir(output, { recursive: true })
for (const file of result.outputFiles) await writeFile(file.path, file.contents)
const files = result.outputFiles.map((file) => basename(file.path))
// 只清理上次构建登记的生成文件，不递归删除目录或源文件。
for (const name of Array.isArray(previous) ? previous : []) {
  if (typeof name !== 'string' || !/^(index|chunk-[A-Z0-9]+)\.js$/.test(name) || files.includes(name)) continue
  const path = join(output, name)
  if (dirname(path) !== output) throw new Error('Unexpected generated file path')
  await unlink(path).catch((error) => { if (error.code !== 'ENOENT') throw error })
}
await writeFile(manifest, JSON.stringify({ files }, null, 2) + '\n')
for (const file of result.outputFiles) console.log(`${basename(file.path)}: ${file.contents.byteLength} bytes`)
