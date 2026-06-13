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
const { CATEGORIES, JOURNEYS, COLLECTIONS } = await import('../src/data.js').catch(
  (e) => {
    fail('src/data.js 無法載入(語法錯誤?):' + e.message)
    return { CATEGORIES: [], JOURNEYS: [], COLLECTIONS: {} }
  }
)

const catIds = new Set(CATEGORIES.map((c) => c.id))
if (CATEGORIES.length === 0) fail('CATEGORIES 是空的')
const collections = COLLECTIONS || {}

// 共用:檢一張卡片(直達 / 合輯 / 敬請期待)。soon 可省略 url;合輯卡片要指到存在的合輯。
function checkCard(j, where, seen) {
  if (!j || typeof j !== 'object') {
    fail(`${where} 不是物件`)
    return
  }
  if (!j.id) fail(`${where} 缺 id`)
  else if (seen.has(j.id)) fail(`${where} id 重複:${j.id}`)
  else seen.add(j.id)
  if (!j.name) fail(`${where} 缺 name`)
  if (!j.color) fail(`${where} 缺 color`)
  if (j.collection) {
    if (!collections[j.collection])
      fail(`${where} 指向不存在的合輯 collection "${j.collection}"`)
  } else if (!j.soon) {
    if (!j.url) fail(`${where} 不是 soon、也不是合輯,卻沒有 url`)
    else if (!/^https?:\/\//.test(j.url))
      fail(`${where} 的 url 不是 http(s) 開頭:${j.url}`)
  }
}

const seen = new Set()
for (const [i, j] of JOURNEYS.entries()) {
  const where = `JOURNEYS[${i}] (${j && j.id ? j.id : '無 id'})`
  checkCard(j, where, seen)
  if (j && j.category && !catIds.has(j.category))
    fail(`${where} 的 category "${j.category}" 不在 CATEGORIES`)
  else if (j && !j.category) fail(`${where} 缺 category`)
}

// 每個合輯卡片都要有對應 COLLECTIONS;每個合輯的關卡各自檢查(id 在合輯內唯一)。
const referenced = new Set(JOURNEYS.filter((j) => j.collection).map((j) => j.collection))
for (const [key, col] of Object.entries(collections)) {
  const where = `COLLECTIONS["${key}"]`
  if (!col || typeof col !== 'object') {
    fail(`${where} 不是物件`)
    continue
  }
  if (!col.title) fail(`${where} 缺 title`)
  if (!Array.isArray(col.items) || col.items.length === 0)
    fail(`${where} 沒有 items`)
  const seenItem = new Set()
  for (const [i, it] of (col.items || []).entries())
    checkCard(it, `${where}.items[${i}] (${it && it.id ? it.id : '無 id'})`, seenItem)
  if (!referenced.has(key))
    fail(`${where} 沒有任何 JOURNEYS 卡片連到它(孤兒合輯)`)
}

// —— 2. 檔案接線(referenced assets 真的存在) ——
const mustExist = [
  'index.html',
  'styles.css',
  'src/main.js',
  'src/data.js',
  'src/scoreboard.js',
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
for (const need of ['/index.html', '/styles.css', '/src/main.js', '/src/data.js', '/src/scoreboard.js'])
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
const colItems = Object.values(collections).reduce(
  (n, c) => n + ((c && c.items && c.items.length) || 0),
  0
)
console.log(
  `✓ 煙霧測試通過:${JOURNEYS.length} 張首頁卡片、${CATEGORIES.length} 個分類、` +
    `${Object.keys(collections).length} 個合輯(共 ${colItems} 關),接線與離線清單齊備。`
)
