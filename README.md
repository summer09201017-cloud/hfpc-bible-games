# 聖經闖關大富翁遊戲 — 總入口大廳

HFPC 聖經遊戲系列的**總入口**。一面卡片牆,讓主日學老師/孩子從這裡選一段旅程進入
(約拿闖關、保羅大富翁,之後還有但以理、出埃及、RPG、戰爭闖關…)。

> 這個專案**本身不含遊戲**,只是「門口」:點一張卡片就連到那個遊戲自己的網址。
> 各遊戲維持各自獨立的 repo 與部署,大廳只負責帶路。

## 怎麼跑

```bash
npm run dev      # 自動找空埠(從 5180 起)+ 開瀏覽器,零相依、不必 npm install
```
一般使用者:雙擊 **`start-hub.bat`**(自動開瀏覽器;關掉視窗即停)。

## 怎麼加一段新旅程(最常做的事)

只改一個檔:**`src/data.js`**。在 `JOURNEYS` 陣列加一筆:

```js
{
  id: 'daniel',                 // 唯一英文代號
  name: '但以理',                // 卡片大標
  subtitle: '但以理書・獅子坑',   // 小字
  category: 'bible',            // 分類(bible / series,見 CATEGORIES)
  color: '#6a4c93',            // 卡片主題色
  emoji: '🦁',                  // 圖示
  url: 'https://……netlify.app/', // 那個遊戲的網址
}
```
還沒做好 → 加 `soon: true`,卡片會顯示「敬請期待」且不可點(可省略 url)。
**畫面碼一行都不用動**,存檔重新部署即可。

## 合輯卡片(一張卡片 = 一整組關卡)

有些卡片不是直接連到某個遊戲,而是「**就地展開一組關卡**」(像戰爭闖關合輯、逆轉奇兵)。
做法:那張首頁卡片寫 `collection: '<合輯 id>'`(不寫 url),點了會走 hash 路由
(`#/<合輯 id>`)在大廳內展開,**不離開頁面**;再把該組關卡放進 `COLLECTIONS`:

```js
export const COLLECTIONS = {
  war: {
    title: '戰爭闖關合輯', desc: '…', color: '#a8324a', emoji: '⚔️',
    items: [
      // 每一關「指向它原本已存在的地方」(深連結),不在這裡複製關卡!
      { id:'moses', name:'摩西舉手之戰', subtitle:'出 17', color:'#c98a2b', emoji:'🙌',
        url:'https://hfpc-jonah-game.netlify.app/?level=moses', soon:true /* 上線後拿掉 */ },
    ],
  },
}
```

> ★ **單一真相之源**:合輯只是一張「精選播放清單」,指向散落在各 repo 裡『已存在』的關卡。
> 改一關的數值只改它原本的 repo 一處,大廳這裡永遠不必跟著改、也不要把關卡複製過來。
> 一關上線後,把它的 `soon: true` 拿掉(並補上正式 url)即可。

## 怎麼建置 / 部署

```bash
npm run build    # = node scripts/bundle-static.mjs,逐檔複製到 site/(不是 dist/,不用打包器)
npm run preview  # 本機預覽 site/
```
- 部署:`netlify.toml` 已設好(`command = npm run build`、`publish = site`)。
- 建議連 GitHub repo 自動部署,網址例如 `hfpc-bible-games.netlify.app`。

## 怎麼測試

```bash
npm test            # 旅程資料齊備 + 分類有效 + 網址合法 + 檔案接線 + SW 離線清單
npm run test:offline   # 再加:build → site/ app shell 齊備(可離線)
```

## 地雷(沿用約拿那台 Windows + Node 24 的經驗)

1. **不要用 `vite build` / rollup**:遞迴 cpSync/rmSync 會讓行程無聲被殺。本專案 build 用單檔複製。
2. **`.bat` 一律純英文 + CRLF**(`.gitattributes` 已鎖 `*.bat eol=crlf`)。
3. **Service Worker 在 localhost 會自動解除**(見 `src/main.js`),改了碼馬上看得到;改 `public/sw.js` 後把 `CACHE` 版本號 +1。
4. **離線範圍**:大廳的 SW 只快取「選單畫面」(同網域)。各遊戲是別的網域,要離線需各自安裝。

## 檔案結構

```
index.html        外殼
styles.css        卡片牆樣式(大字、大卡片、橫直向都好看)
src/
  data.js         ★ 旅程清單(唯一要常改的檔)
  main.js         讀 data.js → 畫分類+卡片;SW 註冊/解除
public/           manifest.webmanifest、手寫 sw.js、icon.svg、favicon.svg
scripts/
  bundle-static.mjs  build = 複製到 site/
  serve.mjs          零相依靜態伺服器(找空埠+開瀏覽器)
  smoke-test.mjs     npm test
start-hub.bat     一般使用者雙擊啟動(英文 + CRLF)
```
