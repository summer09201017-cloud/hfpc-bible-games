// 進入點:把 data.js 的旅程清單畫成「分類 + 卡片牆」。
// 純讀資料、不含遊戲邏輯;點直達卡片就連到各遊戲網址,點合輯卡片就就地展開那組關卡。
import { CATEGORIES, JOURNEYS, COLLECTIONS } from './data.js'
import { renderScoreboard } from './scoreboard.js'

const app = document.getElementById('app')

// —— 換色外皮:5 種背景皮,localStorage 記住;預設淺薄荷綠(= :root,不設 data-theme) ——
const THEMES = [
  { id: 'cream', name: '暖米白', sw: 'linear-gradient(135deg,#fdfaf3,#f4ead6)' },
  { id: 'sky', name: '淺天藍', sw: 'linear-gradient(135deg,#f0f7fd,#dbeafe)' },
  { id: 'mint', name: '淺薄荷綠', sw: 'linear-gradient(135deg,#f1f8f2,#e0f0e6)' },
  { id: 'apricot', name: '暖杏橘', sw: 'linear-gradient(135deg,#fdf3ea,#fbe6d2)' },
  { id: 'night', name: '深藍夜間', sw: 'linear-gradient(135deg,#1d4a73,#0a1b2e)' },
]
const THEME_KEY = 'hub-theme'
function applyTheme(id) {
  // 預設皮(mint)沒有對應的 [data-theme] 規則 → 清掉 data-theme,直接用 :root 預設。
  if (id && id !== 'mint') document.documentElement.dataset.theme = id
  else delete document.documentElement.dataset.theme
  try { localStorage.setItem(THEME_KEY, id) } catch {}
  document.querySelectorAll('.theme-pick__dot').forEach((d) =>
    d.setAttribute('aria-pressed', String(d.dataset.theme === id)),
  )
}
function renderThemePick() {
  const slot = document.getElementById('theme-slot')
  if (!slot) return
  slot.innerHTML = ''
  for (const t of THEMES) {
    const b = document.createElement('button')
    b.type = 'button'
    b.className = 'theme-pick__dot'
    b.dataset.theme = t.id
    b.style.background = t.sw
    b.title = `背景:${t.name}`
    b.setAttribute('aria-label', `背景顏色:${t.name}`)
    b.addEventListener('click', () => applyTheme(t.id))
    slot.appendChild(b)
  }
}
const savedTheme =
  (() => { try { return localStorage.getItem(THEME_KEY) } catch { return null } })() || 'mint'
renderThemePick()
applyTheme(savedTheme)

// —— 一張卡片(直達 / 合輯 / 敬請期待 共用) ——
//   有 collection → 合輯卡片(href=#/<id>,點了走 hash 路由、不離開大廳)。
//   有 url 且非 soon → 直達卡片(連到該遊戲網址)。
//   soon → 不可點的「敬請期待」。
function makeCard(j) {
  const isCollection = !!j.collection
  const clickable = isCollection || (!j.soon && j.url)
  const card = clickable ? document.createElement('a') : document.createElement('div')
  card.className = 'card' + (j.soon ? ' card--soon' : '')
  card.style.setProperty('--accent', j.color || '#3b6ea5')

  let cta = '敬請期待'
  if (isCollection) {
    card.href = `#/${j.collection}`
    card.setAttribute('aria-label', `展開 ${j.name}`)
    cta = '展開 →'
  } else if (clickable) {
    card.href = j.url
    // 同分頁開啟:大廳是「門口」,點了就走進該遊戲。
    card.setAttribute('aria-label', `進入 ${j.name}`)
    cta = '進入 →'
  }

  card.innerHTML = `
    <div class="card__emoji" aria-hidden="true">${j.emoji || '✦'}</div>
    <div class="card__text">
      <div class="card__name">${j.name}</div>
      <div class="card__sub">${j.subtitle || ''}</div>
    </div>
    <div class="card__cta">${cta}</div>
  `
  return card
}

// —— 首頁(大廳):分類 + 卡片牆。只渲染「有卡片」的分類。 ——
function renderHome() {
  app.innerHTML = ''
  for (const cat of CATEGORIES) {
    const items = JOURNEYS.filter((j) => j.category === cat.id)
    if (items.length === 0) continue

    const section = document.createElement('section')
    section.className = 'cat'
    section.innerHTML = `<div class="cat__head"><h2 class="cat__name">${cat.name}</h2>${
      cat.desc ? `<p class="cat__desc">${cat.desc}</p>` : ''
    }</div>`

    const grid = document.createElement('div')
    grid.className = 'grid'
    for (const j of items) grid.appendChild(makeCard(j))
    section.appendChild(grid)
    app.appendChild(section)
  }
}

// —— 合輯內頁:標題 + 返回鈕 + 該組關卡卡片牆 ——
function renderCollection(col) {
  app.innerHTML = ''
  const section = document.createElement('section')
  section.className = 'cat'
  section.style.setProperty('--accent', col.color || '#3b6ea5')
  section.innerHTML = `
    <a class="backlink" href="#/" aria-label="返回大廳">← 返回大廳</a>
    <div class="cat__head subhub__head">
      <h2 class="cat__name">${col.emoji || ''} ${col.title}</h2>
      ${col.desc ? `<p class="cat__desc">${col.desc}</p>` : ''}
    </div>`

  const items = col.items || []
  // 逆轉奇兵:5 列 2 欄(col.paired)——左欄=前半「卡片版」、右欄=後半「動作版」,
  //   靠 grid-auto-flow:column 先填滿左欄再填右欄;data.js 內前 5 筆=卡片版、後 5 筆=動作版,
  //   且兩半奇兵順序一致(福音/盼望/大光/聖歌/反轉),所以每一橫列剛好是同一個奇兵。
  if (col.paired && items.length >= 2) {
    const head = document.createElement('div')
    head.className = 'pairhead'
    head.innerHTML = `<span>📖 卡片版</span><span>🎮 動作版</span>`
    section.appendChild(head)
    const grid = document.createElement('div')
    grid.className = 'grid grid--paired'
    grid.style.gridTemplateRows = `repeat(${Math.ceil(items.length / 2)}, auto)`
    for (const item of items) grid.appendChild(makeCard(item))
    section.appendChild(grid)
  } else {
    const grid = document.createElement('div')
    grid.className = 'grid'
    for (const item of items) grid.appendChild(makeCard(item))
    section.appendChild(grid)
  }
  app.appendChild(section)
}

// —— hash 路由:#/scoreboard → 計分板;#/<合輯id> → 合輯內頁;其餘 → 大廳。 ——
function route() {
  const m = (location.hash || '').match(/^#\/([\w-]+)$/)
  const key = m && m[1]
  if (key === 'scoreboard') renderScoreboard(app)
  else if (key && COLLECTIONS[key]) renderCollection(COLLECTIONS[key])
  else renderHome()
  window.scrollTo(0, 0)
}
window.addEventListener('hashchange', route)
route()

// —— 「安裝到手機/主畫面」按鈕(vanilla 版,邏輯同 pwa-install-button skill) ——
// listener 必須在模組最上層、越早越好:beforeinstallprompt 只觸發一次且很早,
// 等使用者點了才掛就拿不到事件了。
let deferredPrompt = null
const slot = document.getElementById('install-slot')
const ua = navigator.userAgent || ''
const isIosSafari = /iphone|ipad|ipod/i.test(ua) && !/crios|fxios|edgios/i.test(ua)
const isStandalone =
  window.matchMedia?.('(display-mode: standalone)')?.matches ||
  window.navigator.standalone === true

function renderInstallButton() {
  if (!slot) return
  // 已安裝就不顯示;既沒有可程式化安裝、又不是 iOS Safari 也不顯示(免得點了沒反應)。
  if (isStandalone) return
  if (!deferredPrompt && !isIosSafari) return
  if (slot.querySelector('.install-btn')) return

  const btn = document.createElement('button')
  btn.type = 'button'
  btn.className = 'install-btn'
  btn.textContent = '📲 安裝到手機(離線也能玩)'
  btn.addEventListener('click', onInstallClick)
  slot.appendChild(btn)
}

async function onInstallClick() {
  if (deferredPrompt) {
    deferredPrompt.prompt()
    try {
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') slot.innerHTML = ''
    } catch {}
    deferredPrompt = null // 同一事件不能 prompt 第二次
  } else if (isIosSafari) {
    showIosHelp()
  }
}

function showIosHelp() {
  const back = document.createElement('div')
  back.className = 'install-ios'
  back.innerHTML = `
    <div class="install-ios__card">
      <h3>安裝到 iPhone / iPad</h3>
      <ol>
        <li>點下方工具列的「分享」按鈕(方框內一個向上箭頭 ⬆️)。</li>
        <li>往下捲,選「加入主畫面」。</li>
        <li>右上角按「加入」。</li>
      </ol>
      <button type="button" class="install-ios__ok">知道了</button>
    </div>`
  const close = () => back.remove()
  back.addEventListener('click', (e) => {
    if (e.target === back || e.target.classList.contains('install-ios__ok')) close()
  })
  document.body.appendChild(back)
}

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault() // 攔下 Chrome 自己的迷你提示,改由我們的按鈕觸發
  deferredPrompt = e
  renderInstallButton()
})
window.addEventListener('appinstalled', () => {
  deferredPrompt = null
  if (slot) slot.innerHTML = ''
})
// iOS Safari 不會發 beforeinstallprompt,要主動顯示「分享→加入主畫面」引導鈕。
renderInstallButton()

// Service Worker 策略(與約拿一致):
//   開發(localhost):移除 SW + 清快取,確保改了碼馬上看得到。
//   正式(Netlify):註冊 SW → 可安裝 / 大廳本身可離線。
const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(location.hostname)
if ('serviceWorker' in navigator) {
  if (isLocalhost) {
    navigator.serviceWorker
      .getRegistrations()
      .then((regs) => regs.forEach((r) => r.unregister()))
    if (window.caches) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
    }
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    })
  }
}
