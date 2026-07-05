// 聖經遊戲總入口 — 手寫 Service Worker(可安裝 + 大廳本身可離線)。
// 策略與約拿一致:核心檔安裝時預快取;所有同源 GET「網路優先」,離線才退回快取。
// 改版時把 CACHE 版本號 +1,舊快取會在啟用時自動清除。
//
// ⚠ 注意:卡片連到的「各遊戲」是別的網域(跨來源),SW 不會、也不該幫它們快取。
//    本大廳離線時只保證「選單畫面」打得開;各遊戲要離線,需各自安裝/快取它自己。
const CACHE = 'hfpc-hub-v15'
const CORE = [
  '/',
  '/index.html',
  '/styles.css',
  '/src/main.js',
  '/src/data.js',
  '/src/scoreboard.js',
  '/src/verses.js',
  '/src/verseData.js',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icon.svg',
  '/icons/pwa-192x192.png',
  '/icons/pwa-512x512.png',
  '/icons/maskable-512x512.png',
]

self.addEventListener('install', (event) => {
  self.skipWaiting()
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {}))
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  // 只接管自己網域;連到各遊戲的跨來源請求一律放行(讓瀏覽器正常導覽過去)。
  if (url.origin !== location.origin) return

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put('/index.html', copy))
          return res
        })
        .catch(() =>
          caches.match('/index.html').then((r) => r || caches.match('/'))
        )
    )
    return
  }

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone()
          caches.open(CACHE).then((c) => c.put(req, copy))
        }
        return res
      })
      .catch(() => caches.match(req))
  )
})
