// 進入點:把 data.js 的旅程清單畫成「分類 + 卡片牆」。
// 純讀資料、不含遊戲邏輯;點卡片就連到各遊戲自己的網址。
import { CATEGORIES, JOURNEYS } from './data.js'

const app = document.getElementById('app')

// 只渲染「有卡片」的分類,空分類不顯示(避免出現空蕩蕩的標題)。
for (const cat of CATEGORIES) {
  const items = JOURNEYS.filter((j) => j.category === cat.id)
  if (items.length === 0) continue

  const section = document.createElement('section')
  section.className = 'cat'

  const head = document.createElement('div')
  head.className = 'cat__head'
  head.innerHTML = `<h2 class="cat__name">${cat.name}</h2>${
    cat.desc ? `<p class="cat__desc">${cat.desc}</p>` : ''
  }`
  section.appendChild(head)

  const grid = document.createElement('div')
  grid.className = 'grid'

  for (const j of items) {
    const card = j.soon
      ? document.createElement('div')
      : document.createElement('a')
    card.className = 'card' + (j.soon ? ' card--soon' : '')
    card.style.setProperty('--accent', j.color || '#3b6ea5')

    if (!j.soon) {
      card.href = j.url
      // 同分頁開啟:大廳是「門口」,點了就走進該遊戲。
      card.setAttribute('aria-label', `進入 ${j.name}`)
    }

    card.innerHTML = `
      <div class="card__emoji" aria-hidden="true">${j.emoji || '✦'}</div>
      <div class="card__text">
        <div class="card__name">${j.name}</div>
        <div class="card__sub">${j.subtitle || ''}</div>
      </div>
      <div class="card__cta">${j.soon ? '敬請期待' : '進入 →'}</div>
    `
    grid.appendChild(card)
  }

  section.appendChild(grid)
  app.appendChild(section)
}

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
