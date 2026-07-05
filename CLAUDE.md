# CLAUDE.md — HFPC 聖經遊戲生態系(總入口大廳)

本 repo 是 **`hfpc-bible-games`(總入口大廳)**,也是整個「HFPC 聖經遊戲系列」的**生態系 hub**:一面卡片牆,帶路到各個獨立部署的遊戲。本檔給整個生態系的共用慣例與當前優先序;**各遊戲自己的開發細節在各自 repo 的 CLAUDE.md**。

## 🎯 當前任務(2026-07-05 對齊)
- ✅ 舊任務全結案:逆轉奇兵 10 卡、彼得大富翁(`?journey=peter`)、耶穌生平之旅(`?journey=jesus`)皆已上線點卡。
- **現況:23 張首頁卡、7 個合輯(37 關)、sw v17**。本日新增:🐑 好牧人尋羊卡(paul ?demo=shepherd,牧者過審)、🧩 金句頁第三分頁「拼金句」、戰爭三卡(摩西/巴蘭×2)改指 paul——**hfpc-war-games 可退役**(等使用者定)。
- 🔜 下一張卡:撒母耳聽呼喚(paul feat/samuel-simon-wip 完工+牧者過審後);路得記(ruth 接好 Netlify 自動部署後換新版)。

## 🗺️ 生態系地圖(哪個遊戲住哪)
| Repo | 是什麼 | 線上 |
| --- | --- | --- |
| **hfpc-bible-games**(本 repo) | 總入口大廳,只帶路、不放遊戲 | hfpc-bible-games.netlify.app |
| **hfpc-paul-game**(`paul-journey-game`) | 保羅大富翁 + **多數動作/卡片關**住這(`?journey=`、`?demo=`);React+Vite | hfpc-paul-game.netlify.app |
| **hfpc-jonah-game**(`jonah-game`) | 約拿闖關;**vanilla 引擎範本** | hfpc-jonah-game.netlify.app |
| **hfpc-samson-game** | 參孫打獅子(獨立 vanilla 動作關,戰爭合輯第 6 關) | hfpc-samson-game.netlify.app |
| hfpc-war-games | 戰爭原型站(`?level=`,約拿引擎聚合,手動部署) | hfpc-war-games.netlify.app |

## 📌 本 repo 維護重點(大廳)
- **唯一要常改的檔:`src/data.js`**——卡片牆與合輯清單(`JOURNEYS` + `COLLECTIONS`)。加卡片/合輯只動這檔,畫面碼一行不用動。
- **大廳只帶路、不複製關卡**(★單一真相之源):合輯卡片用 `url` 深連結到那關**已部署的網址**;改關卡數值永遠回它原本的 repo 改,大廳不跟著改。
- 加合輯卡片的完整流程 → skill `add-to-collection`。
- build 走 `npm run build`(= `scripts/bundle-static.mjs` 逐檔複製到 `site/`);**不要用 vite build / rollup**(這台 Node 24 遞迴 cpSync 會無聲被殺)。`.bat` 純 ASCII + CRLF。
- 測試:`npm test`(卡片資料/分類/url/接線/SW 離線清單)、`npm run test:offline`(再加 build 檢查)。

## 🧱 生態系共用鐵律(做任何一關都遵守)
- **嵌入契約**:`new Game(canvas,{embed,winPoints,onComplete})` + `boot()`/`destroy()`;純 Canvas、零相依、可離線。view 只讀狀態。
- **卡片關一律 L6 手繪 Canvas、不用 emoji**;畫風與既有卡片關一致。
- **文案閘門**:經文與教導由 AI **草擬、標「待牧者審核」**,牧師通過前**不 merge main**。送審前可用 agent `bible-game-reviewer` 預篩、用 skill `pastor-review`(待做)打包成牧師審題包。
- **兒童營守則**:鍵盤優先、單局 60–120 秒、大 UI 投影可讀、完全離線、結算大畫面 + 經文;難度寧可偏簡單。
- **改玩法 = 同 commit 同步更新該 repo 的 CLAUDE.md / README / roadmap**(本系列曾文件/實作脫節,害老師教錯)。

## 🧰 工具(隨 skill 合輯一起裝)
- 一鍵裝齊所有 skill/指令/agent:私有 repo **`summer09201017-cloud/hfpc-claude-skills`**(`/plugin` 或 `install.bat`)。
- 指令:`/ship-check`(上線前體檢)、`/sync-skills`(同步 skill 合輯)。
- agent:`bible-game-reviewer`(內容/神學/兒童友善/文件對齊)、`qa-playtester`(跑測試只回報失敗)。
- 下一步計畫(含四件套 Slash/Agent/Hook/MCP)→ 合輯 repo 的 `references/四件套-修正版.md`。
- MCP:`claude mcp add` 跨專案要 `--scope user`、團隊共用要 `--scope project`(別漏,否則只綁當下目錄)。

## 換機 / 接手
各遊戲 repo 都有 `讀我-HANDOFF.txt`(現況、跑法、地雷、下一步);先讀它再動手。

榮耀歸神。
