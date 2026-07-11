# CLAUDE.md — HFPC 聖經遊戲生態系(總入口大廳)

本 repo 是 **`hfpc-bible-games`(總入口大廳)**,也是整個「HFPC 聖經遊戲系列」的**生態系 hub**:一面卡片牆,帶路到各個獨立部署的遊戲。本檔給整個生態系的共用慣例與當前優先序;**各遊戲自己的開發細節在各自 repo 的 CLAUDE.md**。

## 🎯 當前任務(2026-07-09 對齊)
- **現況:24 張首頁卡(含 2 route 卡)、3 分類、12 個合輯(91 關)、sw v47**(npm test 以此為準)。
- 07-11(HFP 機):⛳ **3D 迷你高爾夫**進休閒運動合輯(第十五彈——九洞牆壁迷宮+桿數計分,
  洞數 3/6/9 可選;repo minigolf3d(私有)/hfpc-minigolf3d.netlify.app 手動站)+sw v47。
- 07-11(HFP 機):🎳 **3D 保齡球**進休閒運動合輯(第十四彈——滾球物理+正規計分(全倒/補中加成,
  課間學算數),格數 3/5/10 可選;repo bowling3d(私有)/hfpc-bowling3d.netlify.app 手動站)+sw v46。
- 07-11(HFP 機):🤺 **3D 西洋劍**進休閒運動合輯(第十三彈——奧運觸劍計分時機對決,點到為止
  無血條;repo fencing3d(私有)/hfpc-fencing3d.netlify.app 手動站;拳擊(奧運點數制)與
  功夫修行(節奏版)進待辦等使用者排程)+sw v45。
- 07-11(HFP 機):🎾 **3D 網球**+🏸 **3D 羽毛球**進休閒運動合輯(第十一/十二彈——**一站雙卡**:
  repo racket3d(私有)/hfpc-racket3d.netlify.app,`?mode=tennis|badminton` 深連結;隔網對打引擎共用,
  時機窗揮拍+先擲命運,14 句雲哲人聲;Netlify 手動站 `--no-build` 重推)+sw v44。
- 07-11(HFP 機):🎱 **3D 撞球**+⚽ **3D 足球**進休閒運動合輯(第九/十彈,獨立站
  hfpc-billiards3d / hfpc-soccer3d .netlify.app,Netlify CLI 手動部署站——改版要 `--no-build` 重推;
  repo billiards3d/soccer3d(私有);照 skill 3d-game-kit 建成,撞球=雙色清台+黑8、足球=即時控人+撲救+先進N球)+sw v43。
- 07-10(HFP 機):🏟️ **3D 棒球**進休閒運動合輯(kind sports,**獨立站 hfpc-baseball3d.netlify.app**——系列第一個 Three.js 3D 關,主審視角/九宮格五球種/盜壘跑壘/9 局計分板/人聲播報;repo `baseball3d`,Netlify CLI 建站部署(改版後 `netlify deploy --prod --dir dist` 重推),線上冒煙驗過才點卡)+sw v42。
- 07-10(HFP 機):🎱 **花式撞球**進休閒運動合輯(kind pool,paul `?demo=billiards` 真物理入袋,PR #89 無經文免送審併入、A 站驗過 bundle 才點卡)+sw v41。
- 07-10(HFP 機):🕹️ **經典街機合輯**上線(使用者拍板)——四張**直達卡連「爸爸作品集」已部署成品**(打磚塊 bricksbreaking/俄羅斯方塊 dragtetris/雷電 flyshoot/九局熱戰 deyi-baseball),大廳鐵則「只帶路不複製」的活範例、零維護分叉;雷電副標寫明「擊落敵機・大孩子向」(使用者拍板放行)、九局熱戰標「棒球進階版」與棒球打擊王並列;bytype +1 新 kind `shmup`(系列玩法 → 42 種)+sw v40。
- 07-09 晚(HFP 機):🏀 **投籃大賽**+⛹️ **世界盃籃球賽**+⚾ **棒球打擊王**三卡進休閒運動合輯(kind sports,合輯卡關數自動 3→6;paul PR #84/#85 無經文免送審併入、A 站驗過 bundle 三關都在才點卡)+sw v39。棒球「主審視角大改」在 paul PR #86 審中,併後既有卡直接生效。
- 07-09 早(agape250 機):合輯卡標題自動帶關數「(有N關)」(使用者點名)——main.js makeCard 從 COLLECTIONS items 動態算(加關卡數字自動更新,不手寫);styles.css 加 .card__count;sw v38。
- 07-09 早(agape250 機)★**首頁瘦身**(使用者拍板「按書卷/故事主題收攏,不按玩法」):30 張單關直達卡收進五個新合輯——📜 **創世記**(挪亞合輯整組併入+彩衣/糧倉/斑點羊/紅綠燈/動物歸艙)、🏜️ **出埃及**(籃子/紅海/米利暗/嗎哪/舉手之戰/胸牌)、⚔️ **士師與列王**(耶利哥/基甸/參孫/路得/撒母耳/大衛/聖殿/以利亞/約阿施/以斯拉/尼希米)、💬 **比喻與教導**(守護三式/尋羊/失錢/管家/零碎/趕羊/果子/軍裝)、🎮 **休閒運動**(goalkick/soccer/football);首頁只留桌遊主線旗艦卡(約拿×2/保羅/但以理/出埃及/路得/彼得/耶穌生平)+合輯卡+工具卡。49→23 卡;原「挪亞方舟」合輯卡撤下(內容住創世記合輯);網址全不變,#/bytype 不受影響(讀全量);sw v37。播放清單模式:同關可在多清單(參孫=戰爭+憫安+士師列王)。
- 07-09 早(agape250 機):🥅 **世界盃足球賽・實況版**進憫安合輯(kind sports,即時運球+蓄力踢球,牧者點名「真的運球與踢球」;paul PR #83 無經文免送審併入、同批 PR #82 gideon 壇石加難隨 main 生效;A 站驗過 bundle 才點)+sw v36。
- 07-09 深夜:🏆 **世界盃足球賽**進憫安合輯(kind sports,回合彈射全場,AI 阿福教練/雙人同機;paul PR #81 無經文免送審併入、A 站驗過才點)+sw v35。
- 07-09 晚新增:🌾 **拾穗的路得**(kind swap3,斜線實驗版)+🐏 **雅各的斑點羊**(kind pool,雙欄分類)兩卡——paul PR #79/#80 牧者過審併入、A 站驗過 bundle+mp3 才點卡(sw v34)。同批 gems 記憶挑戰/名字的意思、gideon 應許卷軸、goalkick 回饋與蓄力修正已隨 main 上線(既有卡直接生效)。
- 07-09 新增:🍞 **嗎哪收取**(paul `?demo=manna`,系列第一個交換配對/消消樂反向化,**新 kind `swap3`**——不與彈珠配對 `match` 混)一卡——paul PR #78 牧者過審併入、A 站驗過 bundle+mp3 才點卡(sw v33);bytype.js +1 kind(系列玩法 → 41 種,索引頁顯示字串同步對齊)。
- 07-08 晚新增:🧺 **收拾零碎**(kind `match`)+🍇 **聖靈果子**(kind `match`)+💎 **胸牌寶石歸位**(新 kind `fit`)三卡——paul PR #75 牧者過審併入、**A 站驗過這三關已上線才點卡**(sw v31);bytype.js +1 kind `fit`。✅ 同批 🐑 趕羊入圈(PR #76,kind `pool`,首頁卡)+⚽ 射門練習(PR #77,kind `sports`,進憫安合輯)已補點——A 站曾因遠端合併留下的 MiniGameModal 疊套 if(少 2 個 })建置失敗卡在舊版,修復(845193e)後 Netlify 重建成功、6 關全上線才點卡。
- 07-08 新增:💼 **好管家**(kind `management`)+🪙 **失錢找物**(新 kind `seek`)+🧂 **羅得紅綠燈**(新 kind `resist`)+🦁 **各從其類・動物歸艙**(新 kind `match`)四卡——paul PR #74 牧者過審併入、A 站驗過新版才點卡(sw v30);bytype.js 家族表 +3 kind(系列玩法 → 37 種)。
- 07-07 新增:🧱 **活石蓋聖殿**(paul `?demo=temple`,系列第一個落石砌合,kind `stack`)+ ⚒️ **基甸拆祭壇**(paul `?demo=gideon`,系列第一個打磚塊,kind `breakout`)兩卡——paul PR #73 牧者過審併入、A 站驗過新版才點卡(sw v29);bytype.js 家族表同步 +2 kind(系列玩法 → 34 種)。
- 07-06 深夜④新增:🎮 **依玩法瀏覽 route 卡**(#/bytype,src/bytype.js)——全系列 55 個去重關卡按 **32 種玩法** 4 家族分組的索引內頁;資料=data.js 各卡/合輯 item 的 **kind 欄位**(64 筆已標);★新規矩:**新關上卡時順手標 kind**,不標就不會出現在玩法索引。
- 07-06 深夜新增:🌱 **護住好種子** + 🦊 **擒拿小狐狸** + 💧 **撲滅小火苗** 三卡——「守護反應(打地鼠家族)」三式(paul `?demo=sower/foxes/sparks`,PR #70 牧者過審併入,線上驗新版才點卡;sw v25)。
- 07-06 晚新增:🛡️ **尼希米守望**(paul `?demo=wallguard`,系列第一個塔防・佈置守望)+ 🕊️ **以斯拉護送**(paul `?demo=ezra`,系列第一個護送)兩張卡——paul PR #69 牧者過審併入、線上驗過新版才點卡(sw v24);🖍️ **聖經賓果(不插電)卡**——bible-bingo 產生器單檔住本 repo `public/bingo.html`(review 分類;同源工具頁前例;內建題組頁內標「請牧者過目」,sw v23)。
- 07-06 稍早已點亮:🎤 搶答 PK 秀(牧者過審,sw v22)、🌾 約瑟管糧倉(sw v21)、🧥 約瑟的彩衣+創 50:20 金句(sw v20)、📊 play-stats beacon(sw v19)、🕯️ 撒母耳卡(sw v18)。
- 🔜 待辦:**hfpc-war-games 退役**(戰爭卡已全改指 paul,等使用者定)。

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
