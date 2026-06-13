// 上課前/部署前煙霧測試(零相依,Node 24 友善)。
//   npm test            內容(旅程資料齊備、分類有效、網址合法)+ 檔案接線
//   npm test -- --offline  再加:build → site/ 內 PWA app shell 齊備(可離線)
// 失敗會列出問題並 exit 1。
import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { spawnSync } from 'node:child_process'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const errors = []
const fail = (m) => errors.push(m)
const read = (rel) => readFileSync(join(root, rel), 'utf8')

// —— 1. 旅程資料 ——
const { CATEGORIES, JOURNEYS } = await import('../src/data.js').catch((e) => {
  fail('src/data.js 無法載入(語法錯誤?):' + e.message)
  return { CATEGORIES: [], JOURNEYS: [] }
})

const catIds = new Set(CATEGORIES.map((c) => c.id))
if (CATEGORIES.length === 0) fail('CATEGORIES 是空的')

const seen = new Set()
for (const [i, j] of JOURNEYS.entries()) {
  const where = `JOURNEYS[${i}] (${j && j.id ? j.id : '無 id'})`
  if (!j || typeof j !== 'object') {
    fail(`${where} 不是物件`)
    continue
  }
  if (!j.id) fail(`${where} 缺 id`)
  else if (seen.has(j.id)) fail(`${where} id 重複`)
  else seen.add(j.id)
  if (!j.name) fail(`${where} 缺 name`)
  if (!j.category) fail(`${where} 缺 category`)
  else if (!catIds.has(j.category))
    fail(`${where} 的 category "${j.category}" 不在 CATEGORIES`)
  if (!j.color) fail(`${where} 缺 color`)
  if (!j.soon) {
    if (!j.url) fail(`${where} 不是 soon,卻沒有 url`)
    else if (!/^https?:\/\//.test(j.url))
      fail(`${where} 的 url 不是 http(s) 開頭:${j.url}`)
  }
}

// —— 2. 檔案接線(referenced assets 真的存在) ——
const mustExist = [
  'index.html',
  'styles.css',
  'src/main.js',
  'src/data.js',
  'public/sw.js',
  'public/manifest.webmanifest',
  'public/icon.svg',
  'public/favicon.svg',
]
for (const f of mustExist) if (!existsSync(join(root, f))) fail(`缺檔案:${f}`)

const html = existsSync(join(root, 'index.html')) ? read('index.html') : ''
if (!/manifest\.webmanifest/.test(html)) fail('index.html 沒有連結 manifest')
if (!/src\/main\.js/.test(html)) fail('index.html 沒有載入 src/main.js')

// —— 3. Service Worker app shell 清單 ——
const sw = existsSync(join(root, 'public/sw.js')) ? read('public/sw.js') : ''
if (!/const\s+CACHE\s*=/.test(sw)) fail('sw.js 沒有 CACHE 版本號')
for (const need of ['/index.html', '/styles.css', '/src/main.js', '/src/data.js'])
  if (!sw.includes(`'${need}'`))
    fail(`sw.js 的預快取清單 CORE 漏了 ${need}(離線會缺檔)`)

// —— 4.(可選)--offline:build 後檢查 site/ 齊備 ——
if (process.argv.includes('--offline')) {
  const r = spawnSync('node', ['scripts/bundle-static.mjs'], {
    cwd: root,
    encoding: 'utf8',
  })
  if (r.status !== 0) fail('build 失敗:' + (r.stderr || r.stdout))
  else {
    for (const f of [
      'index.html',
      'styles.css',
      'src/main.js',
      'src/data.js',
      'sw.js',
      'manifest.webmanifest',
      'icon.svg',
      'favicon.svg',
      'icons/pwa-192x192.png',
      'icons/pwa-512x512.png',
      'icons/maskable-512x512.png',
    ]) {
      if (!existsSync(join(root, 'site', f)))
        fail(`build 後 site/ 缺 ${f}(離線會缺檔)`)
    }
  }
}

// —— 結果 ——
if (errors.length) {
  console.error(`✗ 煙霧測試失敗(${errors.length}):`)
  for (const e of errors) console.error('  - ' + e)
  process.exit(1)
}
console.log(
  `✓ 煙霧測試通過:${JOURNEYS.length} 個旅程、${CATEGORIES.length} 個分類,接線與離線清單齊備。`
)
