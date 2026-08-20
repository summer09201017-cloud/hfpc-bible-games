// 聖經遊戲總入口 — 手寫 Service Worker(可安裝 + 大廳本身可離線)。
// 策略與約拿一致:核心檔安裝時預快取;所有同源 GET「網路優先」,離線才退回快取。
// 改版時把 CACHE 版本號 +1,舊快取會在啟用時自動清除。
//
// ⚠ 注意:卡片連到的「各遊戲」是別的網域(跨來源),SW 不會、也不該幫它們快取。
//    本大廳離線時只保證「選單畫面」打得開;各遊戲要離線,需各自安裝/快取它自己。
// v110(2026-08-15):📊 頁尾加「使用統計(同工用)」連結 → /stats(HFP 機 07-25 的 commit 卡在本機沒推,
//   本輪 rebase 上 145 個新 commit 才上線;衝突處=遠端給那段 <p> 加了 id="footCount",兩邊都保留)。
// v109(2026-08-13):📺 修「兩支 90 秒影片線上 404」——★ 根因不是上傳工具擋大檔,是**檔案放錯資料夾**:
//   `scripts/bundle-static.mjs` 產出 site/ 時只複製四樣(index.html / styles.css / src/ / public/),
//   而兩支 mp4 從 0804 加進 index.html 那天起就躺在**repo 根目錄** ⇒ 永遠進不了 site/ ⇒ 線上 404 九天。
//   ⚠ 這個 404 在 0806 被「修」過一次,那次補的是**進版控**(git 確實追蹤到了),
//   所以看起來像修好了、其實一次都沒上線過 ⇒ 0812 又被 /js-alive-check 抓到同一條。
//   ★★ 教訓:檔案「在 repo 裡」不等於「會被部署」——判準是**它在不在建置腳本的複製清單裡**。
//   對照組就在旁邊:intro60.mp4 一直放 public/ ⇒ 一直是 200。修法=把兩支搬進 public/。
//   (mp4 刻意不進 CORE 預快取:大檔會撐爆安裝;SW 對同源 GET 本來就是網路優先。)
// v108(2026-08-12):🐑 新增「好牧人・尋羊」合輯——路 15(失羊的比喻)+ 約 10(好牧人)的五款
//   收在一起:尋羊記(出門找)/牧羊人與羊群 3D(牧場養)/好牧人尋羊(聽聲尋)/趕羊入圈(撞球)/
//   羊群歸圈(連鏈)。⚠ 收的標準是**經文主題不是名字**——「雅各的斑點羊」是創 30
//   (神使雅各羊群增多、證出他的公義),主題不同,刻意不收、留在創世記合輯。
//   深連結不複製;sheepflock3d 在戰爭合輯的卡保留不動(大廳本來就允許一款進多個合輯)。
// v106(2026-08-04):📺 首頁介紹影片 60 秒單支 → 90 秒兩支(遊戲篇/工具篇)。
// ⚠ 這版當初只改在產物 site/sw.js、源碼 public/sw.js 還停在 v105,線上 v106 對不上版控(08-06 補回)。
//   ★ 教訓:bump 版本要改**源碼** public/sw.js,改 site/ 下一次 build 就被蓋掉、且版控完全不知情。
// v104(2026-07-27):大廳 +1 🏺 以斯拉點交器皿(kind puzzle 第二款,牧者過審點亮)
// v103(2026-07-26):強制所有裝置換快取——我在部署時誤把根目錄的 .assetsignore 複製進 site/,
// 那份清單排除 `src`,結果 /src/main.js 變 404、卡片整片消失(已修回並重佈)。
// SW 本身是網路優先且只快取 200,不會存到那個 404;bump 版本是為了讓已開著的裝置一定拿到新版。
// ★ 教訓:site/ 是**產物**,裡面只有出貨檔,不需要也不可以放根目錄那份 .assetsignore
//   (那份是給 `--assets .` 用的)。部署大廳只要 npm run build → wrangler deploy --assets site。
const CACHE = 'hfpc-hub-v113'
const CORE = [
  '/',
  '/index.html',
  '/bingo.html',
  '/styles.css',
  '/src/main.js',
  '/src/data.js',
  '/src/scoreboard.js',
  '/src/verses.js',
  '/src/bytype.js',
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

// 🏷️ 版號回報(0820 全艦隊批次):頁尾徽章問「實際執行中的版本」,答案=本 SW 的快取名。
self.addEventListener('message', function (e) {
  if (e && e.data === 'GET_VERSION' && e.source) e.source.postMessage({ type: 'SW_VERSION', v: CACHE });
});
