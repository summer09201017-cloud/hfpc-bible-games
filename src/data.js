// ★ 總入口唯一要維護的檔:旅程清單(資料驅動)。
// 加一張新卡片 / 一整組合輯,只改這個檔,畫面碼一行都不用動。重新 build/部署即可。
//
// 這裡有「兩種卡片」:
//   A. 直達卡片(link card)  ── 有 url,點了直接連到那個遊戲的網址。
//   B. 合輯卡片(collection)  ── 有 collection: '<合輯 id>',點了「不離開大廳」,
//                                就地展開那組合輯的關卡清單(見下方 COLLECTIONS)。
//
// 一筆卡片可有的欄位:
//   id        唯一英文代號(別重複)
//   name      卡片大標(中文)
//   subtitle  小字說明
//   category  屬於哪個分類(必須是下面 CATEGORIES 的 id)
//   color     卡片主題色(CSS 顏色)
//   emoji     卡片圖示(先用 emoji,之後想換真圖再說)
//   url       【link card】點下去要去的網址(各遊戲各自的 Netlify 站)
//   collection【collection card】要展開哪一組合輯(對應 COLLECTIONS 的 key)
//   soon:true 還沒做好 → 卡片變「敬請期待」、不可點(url 可省略;留著當「將來要連去哪」的備忘也行)
//   credit   小作者署名(選填),如 '製作:憫安'。有值就在卡片上顯示一枚「製作」徽章,給孩子記上一筆。
//
// ─────────────────────────────────────────────────────────────────────────────
// ★ 重要原則:大廳「不放遊戲、不複製關卡」,只「帶路」。
//   合輯 = 一張「精選播放清單」卡片,指向散落在各 repo 裡『已經存在』的關卡,
//   不是把關卡複製一份過來。改一關只要改它原本的 repo 一處(單一真相之源),
//   大廳這裡永遠不必跟著改數值。
// ─────────────────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  { id: 'bible', name: '聖經旅程', desc: '跟著聖經人物走一趟(大富翁桌遊)' },
  { id: 'series', name: '闖關合輯', desc: '一張卡片,進入一整組可單獨玩的關卡' },
  { id: 'review', name: '複習・工具', desc: '金句複習朗讀、課堂計分等工具' },
]

export const JOURNEYS = [
  // —— 複習・工具(route 卡片:點了走大廳內頁 hash 路由,不離開大廳) ——
  {
    id: 'verse-review',
    name: '金句複習・朗讀',
    subtitle: '全系列金句 ‧ 複習 + 小測 + 朗讀(可離線)',
    category: 'review',
    color: '#7a5cc4',
    emoji: '📖',
    route: 'verses', // → #/verses(src/verses.js);不是外部遊戲網址
  },
  {
    // 依玩法瀏覽(route 卡):#/bytype(src/bytype.js)——全系列關卡按 32 種玩法分組的索引內頁。
    // 資料=各卡片/合輯 item 的 kind 欄位;新關上卡時順手標 kind 即入列。
    id: 'by-type',
    name: '依玩法瀏覽',
    subtitle: '32 種玩法索引・跑酷/節奏/桌遊/解謎/課堂,想玩哪種挑哪種',
    category: 'review',
    color: '#4a6ab0',
    emoji: '🎮',
    route: 'bytype',
  },
  // —— 靠神得勝・閃避(合輯卡片:點了就地展開掃羅+尼希米兩關) ——
  {
    id: 'dodge-heroes',
    name: '靠神得勝・閃避',
    subtitle: '掃羅擲槍 / 尼希米修牆 / 大衛躲槍(3D) — 只管躲、不還手,神保守',
    category: 'series',
    color: '#7a4030',
    emoji: '🛡️',
    collection: 'dodge-heroes',
  },
  {
    id: 'jonah',
    kind: 'parkour', // 玩法類型(#/bytype 依此分組)
    name: '約拿闖關(動作版)',
    subtitle: '約拿書・六關跑酷與默想',
    category: 'bible',
    color: '#2b7fa8',
    emoji: '🐳',
    url: 'https://hfpc-jonah-game.netlify.app/',
  },
  // —— 以下四個都住在「保羅大富翁」這個 app(hfpc-paul-game),用 ?journey= 直接跳到那條旅程 ——
  //    deep-link 由保羅的 SetupScreen 讀 ?journey= 預選旅程(已加,需重新部署保羅才會生效;
  //    未部署前 ?journey= 會被忽略 → 仍會落在保羅選單,手動點該旅程即可,卡片照樣能用)。
  // 注意:這張「約拿宣教之旅(桌遊版)」與上面獨立的「約拿闖關(動作版)」是兩種玩法,刻意並存。
  {
    id: 'jonah-board',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '約拿宣教之旅(桌遊版)',
    subtitle: '約拿書 1–4 ・ 大富翁桌遊',
    category: 'bible',
    color: '#2aa198',
    emoji: '🗺️',
    url: 'https://hfpc-paul-game.netlify.app/?journey=jonah',
  },
  {
    id: 'paul',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '保羅大富翁',
    subtitle: '保羅宣教之旅・擲骰桌遊',
    category: 'bible',
    color: '#c1772e',
    emoji: '⛵',
    url: 'https://hfpc-paul-game.netlify.app/?journey=paul',
  },
  {
    id: 'daniel',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '但以理在巴比倫',
    subtitle: '但以理書 1–6、9 ・ 大富翁桌遊',
    category: 'bible',
    color: '#6a4c93',
    emoji: '🦁',
    url: 'https://hfpc-paul-game.netlify.app/?journey=daniel',
  },
  {
    id: 'exodus',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '出埃及記之旅',
    subtitle: '出埃及記 1–40 ・ 大富翁桌遊',
    category: 'bible',
    color: '#b5452f',
    emoji: '🔥',
    url: 'https://hfpc-paul-game.netlify.app/?journey=exodus',
  },
  {
    // 路得記·從空到滿:獨立 repo hfpc-ruth-game(可玩棋盤 + 拾麥穗收集闖關)。
    // ✅ 2026-06-19:已部署 hfpc-ruth-game.netlify.app(curl 驗證標題+資產+真內容),卡片正式亮。
    id: 'ruth',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '路得記·從空到滿',
    subtitle: '得 1–4・大富翁桌遊:救贖與恩慈(hesed)',
    category: 'bible',
    color: '#caa54a',
    emoji: '🌾',
    url: 'https://hfpc-ruth-game.netlify.app/',
  },
  {
    // 彼得大富翁(直達卡):住保羅 repo,?journey=peter(20 站真實地理聖地棋盤)。
    // ✅ 2026-06-25:地圖「整頁變藍」已修(paul 494eb9d)、經文已上線;文案經牧者自審(免送審題包)→ 直接亮。
    //    另在「彼得的一生」合輯(series)也收一張(id:'board');這裡是首頁聖經旅程的直達卡。
    id: 'peter-board',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '彼得大富翁',
    subtitle: '徒 1–12・20 站真實地理,擲骰走遍彼得腳蹤',
    category: 'bible',
    color: '#5a7d3a',
    emoji: '🎲',
    url: 'https://hfpc-paul-game.netlify.app/?journey=peter',
  },
  {
    // 耶穌生平之旅(直達卡):住保羅 repo,?journey=jesus(21 站聖地棋盤,伯利恆→加利利→耶路撒冷)。
    // ✅ 2026-07-05:七關全接上(①曠野試探②平靜風浪③五餅二魚④水面行走=嵌彼得走海⑤好撒馬利亞人
    //    ⑥客西馬尼撐住不睡⑦各各他五幕終局)、題庫+卡片文案牧師已過審 → 點亮。
    //    玩家=無名門徒「你」,耶穌永不受操控;受難守定調(剪影不見血)。
    id: 'jesus-journey',
    kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
    name: '耶穌生平之旅',
    subtitle: '四福音・21 站聖地,跟隨主直到空墳墓',
    category: 'bible',
    color: '#7a5ab0',
    emoji: '✝️',
    url: 'https://hfpc-paul-game.netlify.app/?journey=jesus',
  },
  {
    // 騎驢進耶路撒冷(3D)(直達卡):獨立 repo donkey-jerusalem3d(equestrian3d 騎乘引擎聖經皮)。
    // ✅ 2026-07-16:玩家=小驢駒馱主進城(耶穌永不受操控);人群站綠區「穩步」,擦標=受驚+4 罰分,
    //    永不會輸;亞9:9/太21:9 已 cuv 查驗,曉臻朗讀;獨立站,大廳只帶路。
    id: 'donkey-jerusalem3d',
    kind: 'ride', // 玩法類型(#/bytype 依此分組)
    name: '騎驢進耶路撒冷(3D)',
    subtitle: '太 21・你是小驢駒,馱著溫柔的王穩穩進城',
    category: 'bible',
    color: '#8a6a3f',
    emoji: '🫏',
    url: 'https://hfpc-donkey-jerusalem3d.summer09201017.workers.dev/',
  },
  {
    // 大衛的勇士們(3D)(直達卡):獨立 repo david-warriors3d(arena-duel-kit 首個聖經皮,
    // fork warrior3d 競技場對決引擎)。✅ 2026-07-16:四勇士可選(以利亞撒劍/沙瑪大刀/
    // 比拿雅長槍/亞比篩長矛)vs 非利士勇士;場景=沙瑪死守的紅豆田(撒下23:11-12);
    // 八般武器+蓄力大招+格擋盾反;撒下23:10 已 cuv 查驗、曉臻誦讀;溫柔 KO 無流血。
    id: 'david-warriors3d',
    kind: 'boss', // 玩法類型(#/bytype 依此分組)
    name: '大衛的勇士們(3D)',
    subtitle: '撒下 23・在紅豆田迎戰非利士勇士,得勝歸耶和華',
    category: 'bible',
    color: '#8f6a2e',
    emoji: '⚔️',
    url: 'https://hfpc-david-warriors3d.summer09201017.workers.dev/',
  },
  {
    // 巴蘭騎驢(3D)(直達卡):獨立 repo balaam-donkey3d(驢駒引擎再 fork,民22:21-33)。
    // ✅ 2026-07-16:玩家=驢,全場唯一看得見持刀天使的;三幕避讓(田間/葡萄園/山道)、
    //    挨打溫柔演出、終局天使現形+巴蘭俯伏;民22:28/31/33 已 cuv 查驗,曉臻朗讀;防穿模雙保險。
    id: 'balaam-donkey3d',
    kind: 'ride', // 玩法類型(#/bytype 依此分組)
    name: '巴蘭騎驢(3D)',
    subtitle: '民 22・你是那頭驢——唯一看得見天使的',
    category: 'bible',
    color: '#5a6b8f',
    emoji: '🫏',
    url: 'https://hfpc-balaam-donkey3d.summer09201017.workers.dev/',
  },
  {
    // 約拿落海(3D)(直達卡):獨立 repo jonah-water3d(water-kit 首個聖經皮,拿1)。
    // ✅ 2026-07-18:風暴撐船(舀水+穩舵耐力)→掣籤→認罪→拋下海→海立平靜(拿1:15 神蹟固定觸發)
    //    →大魚吞(拿1:17);拿1:3/4/7/12/15/17 已 cuv 查驗,曉臻唸經+雲哲旁白;永不會輸。
    id: 'jonah-water3d',
    kind: 'endure', // 玩法類型(#/bytype 依此分組):撐住型——撐過風暴,體會拿1
    name: '約拿落海(3D)',
    subtitle: '拿 1・撐過風暴——海的狂浪就平息了',
    category: 'bible',
    color: '#1f5e96',
    emoji: '🐳',
    url: 'https://hfpc-jonah-water3d.summer09201017.workers.dev/',
  },
  {
    // 紅海過乾地(3D)(直達卡):獨立 repo redsea3d(C1 formation-kit 首跑,出14)。
    // ✅ 2026-07-18:摩西舉杖(敘事鈕)→活水牆分開→帶百姓走乾地(A/D 導引+礁石;
    //    落後者自動歸隊=一個也不失落)→全隊過完水牆才合攏;出14:21/22/31 已 cuv 驗,曉臻朗讀。
    id: 'redsea3d',
    kind: 'reliance', // 玩法類型:靠神得勝——海是耶和華分開的,你的工作是牧養帶隊
    name: '紅海過乾地(3D)',
    subtitle: '出 14・帶百姓走乾地——一個也不失落',
    category: 'bible',
    color: '#2a4a68',
    emoji: '🌊',
    url: 'https://hfpc-redsea3d.summer09201017.workers.dev/',
  },
  {
    // 挪亞方舟建造(3D)(直達卡):獨立 repo noahark3d(C2 construction-snap-kit 首跑,創6-7)。
    // ✅ 2026-07-18:格線照圖蓋舟(綠框=神的吩咐)→動物成對進舟→耶和華關門(創7:16 固定觸發)
    //    →洪水漲方舟浮起(water-kit);創6:14/6:22/7:16 已 cuv 驗;放錯溫柔退回永不會輸。
    id: 'noahark3d',
    kind: 'stack', // 玩法類型:砌合建造
    name: '挪亞方舟建造(3D)',
    subtitle: '創 6-7・照神所吩咐的蓋——門是神關的',
    category: 'bible',
    color: '#5a86ac',
    emoji: '🛶',
    url: 'https://hfpc-noahark3d.summer09201017.workers.dev/',
  },
  {
    // 五餅二魚・越分越多(直達卡):獨立 repo hfpc-fiveloaves-tsum(tsum-chain 首發,CF workers.dev)。
    // ✅ 2026-07-21:牧者過審文案後點亮;Verlet 圓堆疊+劃線連同款分給眾人,清 n 掉 n+1(越分越多);
    //    太14:19-21/約6:9 已 cuv 驗;曉臻 intro/bless/win 三句已烤;年齡三檔(幼連2/童3/青3)。
    id: 'fiveloaves-tsum',
    kind: 'tsum', // 玩法類型:連鏈分享(#/bytype 依此分組)
    name: '五餅二魚・越分越多',
    subtitle: '太 14・劃線連同款,分給眾人越分越多',
    category: 'bible',
    color: '#c98a2d',
    emoji: '🍞',
    url: 'https://hfpc-fiveloaves-tsum.summer09201017.workers.dev/',
  },

  {
    // 聖經搶答 PK 秀(直達卡):獨立 repo hfpc-quiz-show(零建置手寫 PWA,class-game-show 活實作)。
    // ✅ 2026-07-06:牧者過審內建題組後點亮;投影分組搶答(先按先得/roll-over/末題雙倍),老師判分。
    id: 'quiz-show',
    kind: 'buzzer', // 玩法類型(#/bytype 依此分組)
    name: '聖經搶答 PK 秀',
    subtitle: '投影分組搶答・🦁A 🦅L 🐑Z 🐟M 先按先得',
    category: 'review',
    color: '#8a5cc4',
    emoji: '🎤',
    url: 'https://hfpc-quiz-show.netlify.app/',
  },
  {
    // 聖經賓果(同源工具頁):bible-bingo skill 的產生器單檔,住大廳 public/bingo.html。
    // 全系列唯一「不插電」選項:產可列印 5×5/3×3 賓果卡+老師主持稿;零相依、可離線。
    // ⚠ 內建題組文案 AI 草擬(產生器頁內已標「請牧者過目」);老師自訂題庫先過 /cuv-check。
    id: 'bible-bingo',
    kind: 'bingo', // 玩法類型(#/bytype 依此分組)
    name: '聖經賓果(不插電)',
    subtitle: '列印賓果卡+老師主持稿・唸提示 ‧ 蓋章 ‧ 連線',
    category: 'review',
    color: '#3a7a4e',
    emoji: '🖍️',
    url: 'https://hfpc-bible-games.netlify.app/bingo.html',
  },
  // —— 兩張「合輯卡片」:點了在大廳內就地展開,不離開頁面 ——
  {
    id: 'war',
    name: '戰爭闖關合輯',
    subtitle: '聖經中的爭戰・每關單獨玩(不綁桌遊)',
    category: 'series',
    color: '#a8324a',
    emoji: '⚔️',
    collection: 'war',
  },
  {
    id: 'reversal',
    name: '逆轉奇兵',
    subtitle: '暑假快樂兒童營主題・五個奇兵',
    category: 'series',
    color: '#7a3aa8',
    emoji: '🛡️',
    collection: 'reversal',
  },
  {
    // 憫安製作闖關合輯:作者「作品集 / 榮譽牆」——把憫安一手做的關集中展示。
    // 這些關各自在大廳別處也有卡(播放清單模式:同一關可在多個清單),這裡按「作者」聚成一面牆。
    id: 'minan',
    name: '憫安製作闖關合輯',
    subtitle: '憫安一手打造的關卡・每關單獨玩',
    category: 'series',
    color: '#f0b840',
    emoji: '✨',
    collection: 'minan',
  },
  {
    // 彼得的一生:合輯卡(就地展開)。彼得不只一關——水面行走/越獄/下網得魚/海邊復興。
    id: 'peterLife',
    name: '彼得的一生',
    subtitle: '從漁夫到磐石・蒙召・跌倒・被主重建',
    category: 'series',
    color: '#7a5230',
    emoji: '🪨',
    collection: 'peterLife',
  },
  {
    // 音樂闖關合輯(2026-07-04):六關四種玩法(FNF/下落式/GuitarHero/太鼓)聚成一張播放清單。
    // psalm100/davidharp/miriam 的首頁直達卡同日撤下收進來(上架僅兩天無習慣);
    // 彼得走海/保羅西拉/詩篇150 首頁卡先留(上線較久,同一關可在多個清單)。
    id: 'music',
    name: '音樂闖關合輯',
    subtitle: '六關四種玩法・唱詩擊鼓讚美耶和華',
    category: 'series',
    color: '#b8860b',
    emoji: '🎵',
    collection: 'music',
  },
  // —— 2026-07-09 首頁瘦身(使用者拍板):原本的單關直達卡按「書卷/故事主題」收進下面五個合輯,
  //    首頁只留桌遊主線旗艦卡+合輯卡+工具卡(49 → 23 張)。網址全不變、只是入口整併;
  //    「依玩法瀏覽」#/bytype 照樣收錄全部關卡(它讀 JOURNEYS+COLLECTIONS 全量,不受影響)。
  {
    id: 'genesis',
    name: '創世記闖關合輯',
    subtitle: '挪亞方舟・羅得・雅各・約瑟——審判中有恩典',
    category: 'series',
    color: '#3f7fbf',
    emoji: '📜',
    collection: 'genesis',
  },
  {
    id: 'exodus-pack',
    name: '出埃及闖關合輯',
    subtitle: '籃子・紅海・嗎哪・胸牌——神領百姓出埃及',
    category: 'series',
    color: '#b5452f',
    emoji: '🏜️',
    collection: 'exodus-pack',
  },
  {
    id: 'kings',
    name: '士師與列王合輯',
    subtitle: '耶利哥・基甸・參孫・大衛・聖殿・回歸重建',
    category: 'series',
    color: '#8a6a2e',
    emoji: '⚔️',
    collection: 'kings',
  },
  {
    id: 'parables',
    name: '比喻與教導合輯',
    subtitle: '好牧人・失錢・好管家・五餅二魚・聖靈果子',
    category: 'series',
    color: '#5c8f49',
    emoji: '💬',
    collection: 'parables',
  },
  {
    id: 'sports-fun',
    name: '休閒運動合輯',
    subtitle: '射門練習+世界盃兩種玩法——課間放鬆(無經文)',
    category: 'series',
    color: '#3f7a34',
    emoji: '🎮',
    collection: 'sports-fun',
  },
  {
    // 經典街機合輯(2026-07-10 使用者拍板):直連「爸爸作品集」裡已完成部署的經典遊戲,
    // 大廳只帶路不複製;雷電含射擊(打敵機)——卡片副標寫明「大孩子向」讓老師自行斟酌。
    id: 'arcade-classics',
    name: '經典街機合輯',
    subtitle: '打磚塊・俄羅斯方塊・雷電・九局熱戰——經典懷舊(無經文)',
    category: 'series',
    color: '#2c3e6b',
    emoji: '🕹️',
    collection: 'arcade-classics',
  },
  {
    // HFPC 奧運會入口(07-13 使用者拍板放進大廳):16+ 3D 運動項目卡+可編輯賽程表+
    // 隊伍計分板=教會分組對抗運動會主控台。portal=入口頁不是關卡,頁尾關卡數不計入;
    // 對打類(deyi 武鬥館系列)按家規仍獨立在大廳之外,由奧運會頁「示範賽」區帶路。
    id: 'hfpc-olympics',
    kind: 'sports', // 玩法類型(#/bytype 依此分組)
    name: 'HFPC 奧運會',
    subtitle: '25 個運動關卡(主賽18+示範賽7)・賽程表・隊伍計分板——分組對抗運動會主控台',
    category: 'series',
    color: '#b8860b',
    emoji: '🏅',
    portal: true,
    url: 'https://hfpc-olympics.netlify.app/',
  },
]

// ★ 隱藏彩蛋卡片(2026-07-03 牧師決定):連點大廳大標題 7 下才會出現、之後 localStorage 記住。
//   不放進 JOURNEYS(平常卡片牆一張不多);和「憫安製作闖關合輯」成對——父子的作品都在這個家。
export const EGG = {
  id: 'daddy-portfolio',
  name: '爸爸作品集',
  emoji: '🎁',
  subtitle: '爸爸做的 51 個網站・聖經遊戲只是其中一部分',
  credit: '被你發現了!🎉',
  url: 'https://hfpc-portfolio.netlify.app',
  color: '#b8860b',
}

// ★ 合輯內容(每個 = 一張「播放清單」)。
//   items 裡每一關都『指向它原本已存在的地方』(深連結),不在這裡複製關卡。
//   一關還沒上線就 soon:true(顯示「敬請期待」、不可點);上線後把 soon 拿掉、補上 url 即可。
export const COLLECTIONS = {
  // 音樂闖關合輯(2026-07-04):節奏家族四子型六關——同一個信息(讚美/持守/定睛),四種玩法給老師和孩子選。
  music: {
    title: '音樂闖關合輯',
    emoji: '🎵',
    desc:
      '六關音樂節奏遊戲、四種玩法——節拍、下落琴鍵、透視琴弦、太鼓連打。' +
      '每關都能單獨玩、都有年齡難度;打得準不是為了贏,是一起把讚美歸給耶和華。',
    color: '#b8860b',
    items: [
      {
        id: 'peter-sea',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海(節拍)',
        subtitle: '太 14・定睛看耶穌,踩準節拍走過海面',
        color: '#1e4f8a',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        // 彼得走海(3D):peter-sea3d(07-13 佇列#15;kungfutrain 節奏底座聖經皮;2D 原版保留並列=keep-2d-add-3d 鐵則)。
        id: 'peter-sea3d',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海(3D)',
        subtitle: '夜海 3D 踏浪!左右腳跟拍走向耶穌・風浪下沉喊「主啊救我」・經文朗讀',
        color: '#1d4265',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea3d.summer09201017.workers.dev/',
      },

      {
        id: 'paul-silas',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '保羅西拉獄中讚美(節拍)',
        subtitle: '徒 16・半夜監牢唱詩讚美,神開監門',
        color: '#3a2c52',
        emoji: '⛓️',
        url: 'https://hfpc-paul-silas-game.netlify.app/',
      },
      {
        id: 'psalm150',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '詩篇150(節拍)',
        subtitle: '詩 150・各樣樂器齊鳴,凡有氣息都讚美',
        color: '#b5872e',
        emoji: '🎺',
        url: 'https://hfpc-psalm150-game.netlify.app/',
      },
      {
        id: 'psalm100',
        kind: 'rhythm-4k', // 玩法類型(#/bytype 依此分組)
        name: '讚美琴鍵(下落琴鍵)',
        subtitle: '詩 100・琴鍵落進聖殿的門,按對=稱謝進門',
        color: '#b8860b',
        emoji: '🎹',
        url: 'https://hfpc-paul-game.netlify.app/?demo=psalm100',
      },
      {
        id: 'davidharp',
        kind: 'rhythm-guitar', // 玩法類型(#/bytype 依此分組)
        name: '大衛彈琴(透視琴弦)',
        subtitle: '撒上 16・用手彈琴,掃羅便舒暢爽快,惡魔離了他',
        color: '#7a5a9c',
        emoji: '🎻',
        url: 'https://hfpc-paul-game.netlify.app/?demo=davidharp',
      },
      {
        // two-forms 配對(2026-07-04):同故事的「自由演奏」幼稚園版——沒有音符、沒有錯的音,
        // 五聲音階怎麼亂彈都好聽;跟上面的節奏判定版並排,老師按年齡選。
        id: 'harptoy',
        kind: 'freeplay', // 玩法類型(#/bytype 依此分組)
        name: '大衛彈琴(自由演奏・幼兒)',
        subtitle: '撒上 16・想彈哪根弦就彈,沒有錯的音!彈著彈著,王的愁煩就散開',
        color: '#9c7ab8',
        emoji: '🪕',
        url: 'https://hfpc-paul-game.netlify.app/?demo=harptoy',
      },
      {
        id: 'miriam',
        kind: 'rhythm-taiko', // 玩法類型(#/bytype 依此分組)
        name: '米利暗擊鼓(太鼓連打)',
        subtitle: '出 15・拿鼓跳舞!你們要歌頌耶和華,因他大大戰勝',
        color: '#d9483d',
        emoji: '🥁',
        url: 'https://hfpc-paul-game.netlify.app/?demo=miriam',
      },
    ],
  },
  // 靠神得勝・閃避:仇敵攻擊,只管躲、不還手——得勝在乎倚靠神(反向 RPG)。兩關都住在保羅 app 的 ?demo=。
  'dodge-heroes': {
    title: '靠神得勝・閃避',
    emoji: '🛡️',
    desc:
      '仇敵不斷攻擊,你只管躲、不還手——得勝不是靠武力,是靠神的保守。' +
      '用 ← → (或左右半邊畫面) 閃開飛來的槍和箭。兩關都能單獨玩,也有幼/童/青三種難度。',
    color: '#7a4030',
    items: [
      {
        id: 'saul-spear',
        kind: 'dodge', // 玩法類型(#/bytype 依此分組)
        name: '掃羅擲槍·大衛閃避',
        subtitle: '撒上 18-19・大衛不伸手害受膏者,只躲、只信靠神',
        color: '#6b3fa0',
        emoji: '🗡️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=saul-spear',
      },
      {
        id: 'david-spear3d',
        kind: 'dodge', // 玩法類型(#/bytype 依此分組)
        name: '大衛躲槍(3D)',
        subtitle: '撒上 18・掃羅掄槍,大衛照常彈琴——3D 王宮夜、槍釘牆',
        color: '#6b3fa0',
        emoji: '🎵',
        url: 'https://hfpc-david-spear3d.summer09201017.workers.dev/',
      },
      {
        id: 'nehemiah-wall',
        kind: 'dodge', // 玩法類型(#/bytype 依此分組)
        name: '尼希米修牆·躲攻擊',
        subtitle: '尼 4&6・邊閃避邊把城牆建起來,神為我們爭戰',
        color: '#7a4030',
        emoji: '🧱',
        url: 'https://hfpc-paul-game.netlify.app/?demo=nehemiah',
      },
    ],
  },
  // 作者作品集(榮譽牆):按「製作者=憫安」聚成一張清單,鼓勵小作者。每關都連到它原本的網址,不複製。
  minan: {
    title: '憫安製作闖關合輯',
    desc:
      '這些關卡都是憫安一手打造的——每關都能單獨玩。' +
      '(同一關在大廳別處也找得到;這裡按「作者」聚成一面作品牆,給憫安記上一筆。)',
    color: '#f0b840',
    emoji: '✨',
    items: [
      {
        id: 'peter-sea',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海(節奏闖關)',
        subtitle: '太 14・定睛看耶穌,踩準節拍走過海面',
        color: '#1e4f8a',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        // 彼得走海(3D):peter-sea3d(07-13 佇列#15;kungfutrain 節奏底座聖經皮;2D 原版保留並列=keep-2d-add-3d 鐵則)。
        id: 'peter-sea3d',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海(3D)',
        subtitle: '夜海 3D 踏浪!左右腳跟拍走向耶穌・風浪下沉喊「主啊救我」・經文朗讀',
        color: '#1d4265',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea3d.summer09201017.workers.dev/',
        credit: '製作:憫安',
      },

      {
        id: 'samson',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子',
        subtitle: '士 14・耶和華的靈感動,徒手撕獅',
        color: '#9c5a2a',
        emoji: '🦁',
        url: 'https://hfpc-samson-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        // 參孫打獅子(2.5D):samson-lion3d(judo引擎聖經皮=側視 1D 家族;07-19 正名 2.5D;真3D=samson3d 另 repo)。
        id: 'samson-lion3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子(2.5D)',
        subtitle: '士 14・葡萄園徒手鬥獅!聖靈大招制伏(不流血)・經文朗讀',
        color: '#9aa14f',
        emoji: '🦁',
        url: 'https://hfpc-samson-lion3d.summer09201017.workers.dev/',
        credit: '製作:憫安',
      },
      {
        // 3D 馬術障礙賽(07-19 使用者點名加入憫安合輯):equestrian3d,騎馬跨欄競速。
        id: 'equestrian3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 馬術障礙賽',
        subtitle: '騎馬跨欄!控速節奏抓綠區起跳・多視角・競速對手',
        color: '#7a5a2e',
        emoji: '🏇',
        url: 'https://hfpc-equestrian3d.summer09201017.workers.dev/',
        credit: '製作:憫安',
      },
      {
        id: 'daniel-palace',
        kind: 'stealth', // 玩法類型(#/bytype 依此分組)
        name: '王宮之夜(潛行闖關)',
        subtitle: '但 2・漆黑王宮避開獵手,趕在天亮前到王前',
        color: '#3a2c52',
        emoji: '🕯️',
        url: 'https://hfpc-daniel-game.netlify.app/',
        credit: '製作:憫安',
      },
    ],
  },
  war: {
    title: '戰爭闖關合輯',
    desc:
      '聖經裡的爭戰,每一關都能單獨玩——得勝靠的不是「我多強」,是「我多倚靠神」。' +
      '(每張卡片直接連到那一關的所在地,不複製關卡。)',
    color: '#a8324a',
    emoji: '⚔️',
    items: [
      {
        // 基甸三百(3D):07-19 自憫安合輯移居此地(該合輯改為純憫安作品牆)。
        id: 'gideon300-3d',
        kind: 'stealth', // 玩法類型(#/bytype 依此分組)
        name: '基甸三百勇士(3D)',
        subtitle: '士 7・夜襲潛行避火把+吹角破瓶舉火把三信號——耶和華和基甸的刀!',
        color: '#8a5a20',
        emoji: '🎺',
        url: 'https://hfpc-gideon300-3d.summer09201017.workers.dev/',
      },
      {
        // 王宮之夜(3D):daniel-palace3d(07-19 上架;gideon300-3d 潛行底座換皮;2D 版在憫安合輯=keep-2d-add-3d)。
        id: 'daniel-palace3d',
        kind: 'stealth', // 玩法類型(#/bytype 依此分組)
        name: '王宮之夜(3D)',
        subtitle: '但 2・殺令之夜!柱影潛行避獵手火把,與三同伴同心禱告——奧祕在夜間異象中顯明',
        color: '#3a2c52',
        emoji: '🕯️',
        url: 'https://hfpc-daniel-palace3d.summer09201017.workers.dev/',
      },
      {
        // 俄巴底藏先知(3D 潛行×護送):obadiah3d(07-20 上架;daniel-palace3d fork+formation-kit 護送小隊)。CF Pages。
        id: 'obadiah3d',
        kind: 'stealth', // 玩法類型(#/bytype 依此分組)
        name: '俄巴底藏先知',
        subtitle: '王上 18・帶先知小隊避開耶洗別的兵、分批藏進山洞,供養餅和水——神藉俄巴底保存一百先知',
        color: '#2e3d2a',
        emoji: '🕊️',
        url: 'https://hfpc-obadiah3d.pages.dev/',
      },
      {
        // 雅各摔跤(3D):07-19 自憫安合輯移居此地(創32:28 與神與人較力都得了勝)。
        id: 'jacob-wrestle3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '雅各摔跤(3D)',
        subtitle: '創 32・毘努伊勒摔到黎明!得勝改名以色列・瘸腿蒙福・經文朗讀',
        color: '#3a5a8a',
        emoji: '🌙',
        url: 'https://hfpc-jacob-wrestle3d.summer09201017.workers.dev/',
      },
      {
        // 摩西舉手之戰(約拿引擎 L7)。
        // ✅ 2026-07-05:搬進永久家保羅 repo(paul PR #62,自動部署)→ ?demo=moses-action;
        //   原 hfpc-war-games(手動 B 站)可退役。
        id: 'moses',
        kind: 'endure', // 玩法類型(#/bytype 依此分組)
        name: '摩西舉手之戰',
        subtitle: '出 17・撐住舉手,亞倫戶珥扶手',
        color: '#c98a2b',
        emoji: '🙌',
        url: 'https://hfpc-paul-game.netlify.app/?demo=moses-action',
      },
      {
        // 大衛甩石:住在「保羅大富翁」repo,src/minigames/sling/,?demo=sling 可單獨玩。
        // ✅ 2026-06-14:牧師實測 OK → feat/david-sling 已併 main 並部署,卡片正式亮。
        id: 'david',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '大衛甩石',
        subtitle: '撒上 17・瞄準拋射,打倒歌利亞',
        color: '#3a8d6b',
        emoji: '🎯',
        url: 'https://hfpc-paul-game.netlify.app/?demo=sling',
      },
      {
        // 大衛甩石(3D):athletics3d 引擎聖經皮,獨立站——與 2D 版並列(keep-2d-add-3d 鐵則,
        // 07-13 建成:蓄力+雙軸瞄準+風;17:49 仆倒面伏於地照經文;便雅憫毫髮不差挑戰;
        // 終幕經文朗讀曉臻;經文 cuv 逐句查驗)。
        id: 'david-sling3d',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '大衛甩石(3D)',
        subtitle: '撒上 17・3D 甩石索瞄巨人額頭+便雅憫毫髮不差挑戰(士20:16)',
        color: '#2e7d4f',
        emoji: '🪨',
        url: 'https://hfpc-david-sling3d.pages.dev/',
      },
      {
        // 聖歌奇兵(約沙法)動作關:代下 20——詩班走在軍隊前面讚美,神設伏兵,猶大不戰而勝
        // (最典型「不靠刀槍、靠倚靠神」)。與「逆轉奇兵」合輯共用同一關(深連結,不複製)。
        // ✅ 2026-06-16:戰爭關搬進保羅 repo(永久家,消除跨 repo sync)→ paul ?demo=jehoshaphat-action
        //    (自動部署;敵人放大+表情等改動即可上線。原 war-games 為手動部署的原型站。)
        id: 'jehoshaphat',
        kind: 'reliance', // 玩法類型(#/bytype 依此分組)
        name: '聖歌奇兵',
        subtitle: '代下 20・詩班讚美,神設伏兵得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat-action',
      },
      {
        // 反轉奇兵(巴蘭的驢 民22,約拿引擎 L10)。與「逆轉奇兵」合輯共用同一關(深連結,不複製)。
        // ✅ 2026-07-05:搬進永久家保羅 repo(paul PR #62,自動部署)→ ?demo=balaam-action。
        id: 'balaam',
        kind: 'reliance', // 玩法類型(#/bytype 依此分組)
        name: '反轉奇兵',
        subtitle: '民 22・巴蘭的驢,神攔阻得勝',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-paul-game.netlify.app/?demo=balaam-action',
      },
      {
        // ✅ 2026-06-15:紅海奔逃動作關復活——獨立入口 保羅 ?demo=redsea(出 14;不綁約拿站,點進去直接玩)。
        //   ⚠ 需先合併並部署 paul「feat/redsea-demo」才會生效。
        id: 'redsea',
        kind: 'parkour', // 玩法類型(#/bytype 依此分組)
        name: '紅海奔逃',
        subtitle: '出 14・站住等候,神開海路',
        color: '#2b6fa8',
        emoji: '🌊',
        url: 'https://hfpc-paul-game.netlify.app/?demo=redsea',
      },
      {
        // 參孫打獅子:住在獨立 repo「孫孫打獅子」(vanilla JS + Canvas,可獨立 build 的 PWA)。
        // 永久家=自己的 Netlify 站。✅ 2026-06-17:hfpc-samson-game.netlify.app 已部署上線,卡片正式亮。
        // 主題正中合輯精神:聖經不說參孫多強壯,而說「耶和華的靈大大感動他」——力量出於神。
        id: 'samson',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子',
        subtitle: '士 14・耶和華的靈感動,徒手撕獅',
        color: '#9c5a2a',
        emoji: '🦁',
        url: 'https://hfpc-samson-game.netlify.app/',
        // 小作者署名:任何卡片加 credit 欄就會顯示一枚「製作」徽章(見 main.js makeCard / styles.css .card__credit)。
        credit: '製作:憫安',
      },
      {
        // 參孫打獅子(2.5D):samson-lion3d(judo引擎聖經皮=側視 1D 家族;07-19 正名 2.5D;真3D=samson3d 另 repo)。
        id: 'samson-lion3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子(2.5D)',
        subtitle: '士 14・葡萄園徒手鬥獅!聖靈大招制伏(不流血)・經文朗讀',
        color: '#9aa14f',
        emoji: '🦁',
        url: 'https://hfpc-samson-lion3d.summer09201017.workers.dev/',
      },
      {
        // 參孫打獅子(真3D):samson3d(07-19 上架;warrior3d 自由走位底座;beast-boss-kit 首發活範例)。
        id: 'samson3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子(真3D)',
        subtitle: '士 14・真3D 自由走位鬥獅!輕拳重拳+聖靈金光・撲咬預告紅圈・蜂蜜補血',
        color: '#8a6a2e',
        emoji: '🦁',
        url: 'https://hfpc-samson3d.summer09201017.workers.dev/',
      },
      {
        // 大衛打獅熊(真3D):davidbeasts3d(07-19 上架;samson3d fork 多獸引擎 foes[];Cloudflare Pages 首發試點站)。
        id: 'davidbeasts3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '大衛打獅熊(真3D)',
        subtitle: '撒上 17・選獅選熊或雙獸夾攻(1~3隻)!護羊之戰・聖靈金光穿透群獸',
        color: '#7a5230',
        emoji: '🐻',
        url: 'https://hfpc-davidbeasts3d.pages.dev/',
      },
      {
        // 大衛打獅與熊(2D):davidbeasts2d(07-20 上架;hfpc-samson-game 2D fork,獅波→救羊羔→熊波)。CF Pages。
        id: 'davidbeasts2d',
        kind: 'boss',
        name: '大衛打獅與熊(2D)',
        subtitle: '撒上 17・牧羊少年徒手擊退獅與熊兩波・得勝歸耶和華(17:37)',
        color: '#7a5230',
        emoji: '🦁',
        url: 'https://hfpc-davidbeasts2d.pages.dev/',
      },
      {
        // 大衛打獅與熊(2.5D):davidbeasts2p5d(07-20 上架;samson-lion3d 側視 fork,連戰獅→救羊羔→熊)。CF Pages。
        id: 'davidbeasts2p5d',
        kind: 'boss',
        name: '大衛打獅與熊(2.5D)',
        subtitle: '撒上 17・側視摔技對獅與熊・聖靈大招・得勝歸神',
        color: '#7a5230',
        emoji: '🐻',
        url: 'https://hfpc-davidbeasts2p5d.pages.dev/',
      },
      {
        // 約阿施射得勝箭(王下 13):住保羅 repo src/minigames/joash/,?demo=joash(拋射動作關,複製甩石引擎換皮)。
        // ✅ 2026-06-25:經文 cuv 查驗、自動部署上線(paul A 站)。年齡旋鈕(幼/童/青)+ 會動的靶 + 語音玩法。
        // 主題正中合輯精神:得勝是「耶和華的得勝箭」,不是王的臂力;憑信多射幾次=得勝越完全(13:19)。
        id: 'joash',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '約阿施射得勝箭',
        subtitle: '王下 13・憑信射到底,耶和華使你得勝',
        color: '#7a4fb0',
        emoji: '🏹',
        url: 'https://hfpc-paul-game.netlify.app/?demo=joash',
      },
      {
        // 約阿施的得勝箭(3D):joash-arrows(archery3d 引擎聖經皮;keep-2d-add-3d 並列)。
        // 2026-07-15:病房朝東窗射軍旗靶+拿箭打地(不揭示次數,≥5=完全得勝);王下13:14-19 cuv 查驗;獨立站,大廳只帶路。
        id: 'joash-arrows3d',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '約阿施的得勝箭(3D)',
        subtitle: '王下 13・開朝東的窗射得勝箭+拿箭打地——打幾次,你決定!',
        color: '#6d3fb0',
        emoji: '🏹',
        url: 'https://hfpc-joash-arrows.summer09201017.workers.dev/',
      },
    ],
  },
  reversal: {
    title: '逆轉奇兵',
    desc:
      '暑假快樂兒童營主題:神專門用世人看為軟弱的,逆轉得勝(林前 1:27)。五個「神的出其不意」,' +
      '每個奇兵都有兩種玩法——「卡片版」(讀經、抉擇、默想)與「動作版」(即時闖關)。' +
      '(做好一關就把它的「敬請期待」拿掉、補上網址;牧者審完的卡片版也一併點亮。)',
    color: '#7a3aa8',
    emoji: '🛡️',
    paired: true, // 大廳以「5 列 2 欄」呈現:左欄卡片版、右欄動作版(見 main.js renderCollection)。
    // ★ 10 張卡 = 5 奇兵 × 2 形態。卡片版住保羅(?demo=)、動作版分住保羅(?demo=)或戰爭原型站(?level=)。
    //   ⚠ jehoshaphat-card / balaam-card 指向 ?demo=jehoshaphat / ?demo=balaam,需先合併並部署
    //      paul 的「feat/reversal-card-levels」(這兩個新卡片關)才會生效,否則會 404。
    items: [
      // ───────────── 卡片版(5):純 React 讀經/排序/抉擇/默想關 ─────────────
      {
        // ✅ 2026-06-15:福音卡片關上線(?demo=cornelius,牧者已審)。
        id: 'cornelius-card',
        kind: 'cards', // 玩法類型(#/bytype 依此分組)
        name: '福音奇兵·卡片版',
        subtitle: '徒 10・彼得向哥尼流傳福音',
        color: '#3a8d8d',
        emoji: '🕊️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=cornelius',
      },
      {
        // ⚠ 文案待牧者審(使用者指示先亮、之後自審);關卡已在保羅 main(?demo=elijah)。
        id: 'elijah-card',
        kind: 'cards', // 玩法類型(#/bytype 依此分組)
        name: '盼望奇兵·卡片版',
        subtitle: '王上 19・以利亞灰心後重得力',
        color: '#c1772e',
        emoji: '🌅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=elijah',
      },
      {
        // ⚠ 文案待牧者審(使用者指示先亮、之後自審);關卡已在保羅 main(?demo=saul)。
        id: 'saul-card',
        kind: 'cards', // 玩法類型(#/bytype 依此分組)
        name: '大光奇兵·卡片版',
        subtitle: '徒 9・掃羅遇大光信主',
        color: '#d9b310',
        emoji: '💡',
        url: 'https://hfpc-paul-game.netlify.app/?demo=saul',
      },
      {
        // ✅ 2026-06-15 新做:聖歌卡片關(代下 20 約沙法唱詩得勝);需 paul 卡片關 PR 部署。文案待牧者審。
        id: 'jehoshaphat-card',
        kind: 'cards', // 玩法類型(#/bytype 依此分組)
        name: '聖歌奇兵·卡片版',
        subtitle: '代下 20・約沙法唱詩歌得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat',
      },
      {
        // ✅ 2026-06-15 新做:反轉卡片關(民 22 巴蘭的驢);需 paul 卡片關 PR 部署。文案待牧者審。
        id: 'balaam-card',
        kind: 'cards', // 玩法類型(#/bytype 依此分組)
        name: '反轉奇兵·卡片版',
        subtitle: '民 22・巴蘭的驢開口',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-paul-game.netlify.app/?demo=balaam',
      },
      // ───────────── 動作版(5):即時 Canvas 闖關 ─────────────
      {
        // ✅ 2026-06-15:福音動作版上線(跑酷,約帕→該撒利亞,?demo=cornelius-action)。需 paul feat/cornelius-action 部署。
        id: 'cornelius-action',
        kind: 'parkour', // 玩法類型(#/bytype 依此分組)
        name: '福音奇兵·動作版',
        subtitle: '徒 10・順服聖靈,出發傳福音',
        color: '#3a8d8d',
        emoji: '🕊️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=cornelius-action',
      },
      {
        // ✅ 2026-06-15:盼望動作版上線(以利亞曠野撿餅水恢復體力,?demo=elijah-action)。
        id: 'elijah-action',
        kind: 'collect', // 玩法類型(#/bytype 依此分組)
        name: '盼望奇兵·動作版',
        subtitle: '王上 19・撿餅喝水重得力',
        color: '#c1772e',
        emoji: '🌅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=elijah-action',
      },
      {
        // ✅ 2026-06-15:大光動作版上線(曠野跑酷,大馬士革路→直街,?demo=saul-action)。需 paul feat/saul-action 部署。
        id: 'saul-action',
        kind: 'parkour', // 玩法類型(#/bytype 依此分組)
        name: '大光奇兵·動作版',
        subtitle: '徒 9・大光仆倒,順服奔跑',
        color: '#d9b310',
        emoji: '💡',
        url: 'https://hfpc-paul-game.netlify.app/?demo=saul-action',
      },
      {
        // ✅ 2026-06-16:聖歌動作版搬進保羅 repo(永久家)→ paul ?demo=jehoshaphat-action(自動部署);與戰爭合輯共用同一關。
        id: 'jehoshaphat-action',
        kind: 'reliance', // 玩法類型(#/bytype 依此分組)
        name: '聖歌奇兵·動作版',
        subtitle: '代下 20・詩班讚美,神設伏兵',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat-action',
      },
      {
        // ✅ 2026-07-05:搬進保羅 repo(paul PR #62)→ ?demo=balaam-action;與戰爭合輯共用同一關。
        id: 'balaam-action',
        kind: 'reliance', // 玩法類型(#/bytype 依此分組)
        name: '反轉奇兵·動作版',
        subtitle: '民 22・閃避攔路,神攔阻得勝',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-paul-game.netlify.app/?demo=balaam-action',
      },
    ],
  },
  // —— 2026-07-09 首頁瘦身新增的五個「書卷/故事主題」合輯(使用者拍板)——
  //    播放清單模式:同一關可在多個清單(samson 同時在戰爭/憫安/士師列王),都是深連結、不複製關卡。
  //    原「挪亞方舟」合輯(noah)整組併入創世記合輯,卡片與網址不變。
  genesis: {
    title: '創世記闖關合輯',
    emoji: '📜',
    desc:
      '起初,神創造——從挪亞方舟到約瑟:審判中有恩典、破碎中有保守。' +
      '可玩挪亞「完整大富翁旅程」,其餘每關都能單獨玩。(每張卡片直接連到那一關的所在地,不複製關卡。)',
    color: '#3f7fbf',
    items: [
      {
        id: 'noah-journey',
        kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
        name: '挪亞方舟・完整旅程',
        subtitle: '創 6–9・擲骰大富翁:造舟→洪水→彩虹之約',
        color: '#3f7fbf',
        emoji: '🌈',
        url: 'https://hfpc-paul-game.netlify.app/?journey=noah',
      },
      {
        id: 'arkbuild',
        kind: 'buildtiming', // 玩法類型(#/bytype 依此分組)
        name: '一步一步蓋方舟',
        subtitle: '創 6:14-22・操作挪亞釘木板,旁人嘲笑',
        color: '#8a4b2f',
        emoji: '🔨',
        url: 'https://hfpc-paul-game.netlify.app/?demo=arkbuild',
      },
      {
        id: 'arkpairs',
        kind: 'pairs', // 玩法類型(#/bytype 依此分組)
        name: '一公一母進方舟',
        subtitle: '創 6–7・翻牌配對 + 安排房間(母的戴🎀)',
        color: '#3f7fd0',
        emoji: '🐘',
        url: 'https://hfpc-paul-game.netlify.app/?demo=arkpairs',
      },
      {
        id: 'arkmatch',
        kind: 'match', // 玩法類型(#/bytype 依此分組)
        name: '各從其類・動物歸艙',
        subtitle: '創 7・同類聚一起,進方舟——耶和華關門',
        color: '#4a7a58',
        emoji: '🦁',
        url: 'https://hfpc-paul-game.netlify.app/?demo=arkmatch',
      },
      {
        id: 'lotrun',
        kind: 'resist', // 玩法類型(#/bytype 依此分組)
        name: '羅得紅綠燈',
        subtitle: '創 19・逃命吧!不可回頭看——忍住那顆按鈕',
        color: '#7a4055',
        emoji: '🧂',
        url: 'https://hfpc-paul-game.netlify.app/?demo=lotrun',
      },
      {
        id: 'flock',
        kind: 'pool', // 玩法類型(#/bytype 依此分組)
        name: '雅各的斑點羊',
        subtitle: '創 30・純白進左欄、斑點進右欄——證出我的公義來',
        color: '#6a8a4a',
        emoji: '🐏',
        url: 'https://hfpc-paul-game.netlify.app/?demo=flock',
      },
      {
        id: 'joseph',
        kind: 'sliding', // 玩法類型(#/bytype 依此分組)
        name: '約瑟的彩衣',
        subtitle: '創 37→50・拼回彩衣——神把破碎拼回',
        color: '#b96a3a',
        emoji: '🧥',
        url: 'https://hfpc-paul-game.netlify.app/?demo=joseph',
      },
      {
        id: 'joseph-granary',
        kind: 'management', // 玩法類型(#/bytype 依此分組)
        name: '約瑟管糧倉',
        subtitle: '創 41・七豐年七荒年——豐年不揮霍,荒年有預備',
        color: '#b8860b',
        emoji: '🌾',
        url: 'https://hfpc-joseph-granary.netlify.app/',
      },
    ],
  },
  'exodus-pack': {
    title: '出埃及闖關合輯',
    emoji: '🏜️',
    desc:
      '神用大能的手領百姓出埃及——籃子裡的保守、海中開路、天降嗎哪、胸前帶著名字。' +
      '想走完整故事,首頁另有「出埃及記之旅」大富翁。(紅海/舉手之戰/米利暗與戰爭・音樂合輯共用同一關。)',
    color: '#b5452f',
    items: [
      {
        id: 'basket',
        kind: 'drift', // 玩法類型(#/bytype 依此分組)
        name: '摩西的籃子',
        subtitle: '出 2・蒲草箱漂尼羅河,閃開障礙——神看顧著',
        color: '#3a7a9a',
        emoji: '🧺',
        url: 'https://hfpc-paul-game.netlify.app/?demo=basket',
      },
      {
        id: 'redsea',
        kind: 'parkour', // 玩法類型(#/bytype 依此分組)
        name: '紅海奔逃',
        subtitle: '出 14・站住等候,神開海路',
        color: '#2b6fa8',
        emoji: '🌊',
        url: 'https://hfpc-paul-game.netlify.app/?demo=redsea',
      },
      {
        id: 'miriam',
        kind: 'rhythm-taiko', // 玩法類型(#/bytype 依此分組)
        name: '米利暗擊鼓(太鼓連打)',
        subtitle: '出 15・拿鼓跳舞!你們要歌頌耶和華,因他大大戰勝',
        color: '#d9483d',
        emoji: '🥁',
        url: 'https://hfpc-paul-game.netlify.app/?demo=miriam',
      },
      {
        id: 'manna',
        kind: 'swap3', // 玩法類型(#/bytype 依此分組)
        name: '嗎哪收取',
        subtitle: '出 16・收滿俄梅珥罐——多收的沒有餘,少收的沒有缺',
        color: '#b0985a',
        emoji: '🍞',
        url: 'https://hfpc-paul-game.netlify.app/?demo=manna',
      },
      {
        id: 'moses',
        kind: 'endure', // 玩法類型(#/bytype 依此分組)
        name: '摩西舉手之戰',
        subtitle: '出 17・撐住舉手,亞倫戶珥扶手',
        color: '#c98a2b',
        emoji: '🙌',
        url: 'https://hfpc-paul-game.netlify.app/?demo=moses-action',
      },
      {
        id: 'gems',
        kind: 'fit', // 玩法類型(#/bytype 依此分組)
        name: '大祭司胸牌・寶石歸位',
        subtitle: '出 28・十二寶石按支派歸位——名字帶在胸前',
        color: '#7a5a9a',
        emoji: '💎',
        url: 'https://hfpc-paul-game.netlify.app/?demo=gems',
      },
    ],
  },
  kings: {
    title: '士師與列王合輯',
    emoji: '⚔️',
    desc:
      '從耶利哥到回歸重建——約書亞、士師、君王與先知的時代:' +
      '得勝從來不靠人的強壯,是耶和華的作為。(參孫/大衛/約阿施與戰爭合輯共用同一關。)',
    color: '#8a6a2e',
    items: [
      {
        id: 'jericho',
        kind: 'shout', // 玩法類型(#/bytype 依此分組)
        name: '耶利哥城牆',
        subtitle: '書 6・繞城吹角大聲呼喊,耶和華使城牆塌陷',
        color: '#c98a2b',
        emoji: '🎺',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jericho',
      },
      {
        // 約拿單的暗號:第一個「3D 引擎聖經皮」關(archery3d fork,07-12 建成;
        // 撒上20:20-22/42+18:1 和合本 cuv MCP 逐句查驗;獨立站,大廳只帶路)。
        id: 'jonathan-arrows',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '約拿單的暗號(3D)',
        subtitle: '撒上 20・射三箭如射靶,第四箭飛過童子——「箭在前頭」救大衛!',
        color: '#8a6a28',
        emoji: '🏹',
        url: 'https://hfpc-jonathan-arrows.pages.dev/',
      },
      {
        id: 'gideon',
        kind: 'breakout', // 玩法類型(#/bytype 依此分組)
        name: '基甸拆祭壇',
        subtitle: '士 6:25-27・夜裡拆巴力壇——先拆假的,才立真的',
        color: '#2c3658',
        emoji: '⚒️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=gideon',
      },
      {
        id: 'samson',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子',
        subtitle: '士 14・耶和華的靈感動,徒手撕獅',
        color: '#9c5a2a',
        emoji: '🦁',
        url: 'https://hfpc-samson-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        // 參孫打獅子(2.5D):samson-lion3d(judo引擎聖經皮=側視 1D 家族;07-19 正名 2.5D;真3D=samson3d 另 repo)。
        id: 'samson-lion3d',
        kind: 'boss', // 玩法類型(#/bytype 依此分組)
        name: '參孫打獅子(2.5D)',
        subtitle: '士 14・葡萄園徒手鬥獅!聖靈大招制伏(不流血)・經文朗讀',
        color: '#9aa14f',
        emoji: '🦁',
        url: 'https://hfpc-samson-lion3d.summer09201017.workers.dev/',
      },
      {
        id: 'glean',
        kind: 'swap3', // 玩法類型(#/bytype 依此分組)
        name: '拾穗的路得',
        subtitle: '得 2・橫直斜都算一排——恩典故意多給一點',
        color: '#b0904a',
        emoji: '🌾',
        url: 'https://hfpc-paul-game.netlify.app/?demo=glean',
      },
      {
        id: 'samuel',
        kind: 'memoryseq', // 玩法類型(#/bytype 依此分組)
        name: '撒母耳聽呼喚',
        subtitle: '撒上 3・注意聽,照順序點燈——請說,僕人敬聽',
        color: '#7a5c9e',
        emoji: '🕯️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=samuel',
      },
      {
        id: 'david',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '大衛甩石',
        subtitle: '撒上 17・瞄準拋射,打倒歌利亞',
        color: '#3a8d6b',
        emoji: '🎯',
        url: 'https://hfpc-paul-game.netlify.app/?demo=sling',
      },
      {
        // 大衛甩石(3D):athletics3d 引擎聖經皮,獨立站——與 2D 版並列(keep-2d-add-3d 鐵則,
        // 07-13 建成:蓄力+雙軸瞄準+風;17:49 仆倒面伏於地照經文;便雅憫毫髮不差挑戰;
        // 終幕經文朗讀曉臻;經文 cuv 逐句查驗)。
        id: 'david-sling3d',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '大衛甩石(3D)',
        subtitle: '撒上 17・3D 甩石索瞄巨人額頭+便雅憫毫髮不差挑戰(士20:16)',
        color: '#2e7d4f',
        emoji: '🪨',
        url: 'https://hfpc-david-sling3d.pages.dev/',
      },
      {
        id: 'temple',
        kind: 'stack', // 玩法類型(#/bytype 依此分組)
        name: '活石蓋聖殿',
        subtitle: '王上 6:7・石頭鑿好才運來——安安靜靜砌成聖殿',
        color: '#a08040',
        emoji: '🧱',
        url: 'https://hfpc-paul-game.netlify.app/?demo=temple',
      },
      {
        id: 'elijah-action',
        kind: 'collect', // 玩法類型(#/bytype 依此分組)
        name: '以利亞重得力',
        subtitle: '王上 19・撿餅喝水重得力',
        color: '#c1772e',
        emoji: '🌅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=elijah-action',
      },
      {
        id: 'joash',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '約阿施射得勝箭',
        subtitle: '王下 13・憑信射到底,耶和華使你得勝',
        color: '#7a4fb0',
        emoji: '🏹',
        url: 'https://hfpc-paul-game.netlify.app/?demo=joash',
      },
      {
        // 約阿施的得勝箭(3D):joash-arrows(archery3d 引擎聖經皮;keep-2d-add-3d 並列)。
        // 2026-07-15:病房朝東窗射軍旗靶+拿箭打地(不揭示次數,≥5=完全得勝);王下13:14-19 cuv 查驗;獨立站,大廳只帶路。
        id: 'joash-arrows3d',
        kind: 'aim', // 玩法類型(#/bytype 依此分組)
        name: '約阿施的得勝箭(3D)',
        subtitle: '王下 13・開朝東的窗射得勝箭+拿箭打地——打幾次,你決定!',
        color: '#6d3fb0',
        emoji: '🏹',
        url: 'https://hfpc-joash-arrows.summer09201017.workers.dev/',
      },
      {
        id: 'ezra',
        kind: 'escort', // 玩法類型(#/bytype 依此分組)
        name: '以斯拉護送',
        subtitle: '拉 8・沒有刀兵,只有禱告——護送全隊回耶路撒冷',
        color: '#4a7a8a',
        emoji: '🕊️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=ezra',
      },
      {
        id: 'wallguard',
        kind: 'defense', // 玩法類型(#/bytype 依此分組)
        name: '尼希米守望',
        subtitle: '尼 3-6・佈崗吹角,仇敵退去——神必為我們爭戰',
        color: '#8a6a33',
        emoji: '🛡️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=wallguard',
      },
    ],
  },
  parables: {
    title: '比喻與教導合輯',
    emoji: '💬',
    desc:
      '耶穌的比喻與聖經的教導——撒種、尋羊、找錢、管家、收零碎、結果子…' +
      '小遊戲玩一遍,道理就記住了。每關都能單獨玩、都有年齡難度。',
    color: '#5c8f49',
    items: [
      {
        id: 'sower',
        kind: 'guard', // 玩法類型(#/bytype 依此分組)
        name: '護住好種子',
        subtitle: '太 13・點飛鳥拍手趕走,護種子長成小苗',
        color: '#5a8a3e',
        emoji: '🌱',
        url: 'https://hfpc-paul-game.netlify.app/?demo=sower',
      },
      {
        id: 'steward',
        kind: 'management', // 玩法類型(#/bytype 依此分組)
        name: '好管家',
        subtitle: '太 25・銀子交託給你——神看忠心,不看數額',
        color: '#a07a30',
        emoji: '💼',
        url: 'https://hfpc-paul-game.netlify.app/?demo=steward',
      },
      {
        id: 'shepherd',
        kind: 'maze', // 玩法類型(#/bytype 依此分組)
        name: '好牧人尋羊',
        subtitle: '路 15・循「咩~」尋迷羊,扛在肩上帶回家',
        color: '#5c8f49',
        emoji: '🐑',
        url: 'https://hfpc-paul-game.netlify.app/?demo=shepherd',
      },
      {
        id: 'lostcoin',
        kind: 'seek', // 玩法類型(#/bytype 依此分組)
        name: '失錢找物',
        subtitle: '路 15:8-10・點上燈細細地找——直到找著',
        color: '#8a6a3a',
        emoji: '🪙',
        url: 'https://hfpc-paul-game.netlify.app/?demo=lostcoin',
      },
      {
        id: 'fragments',
        kind: 'match', // 玩法類型(#/bytype 依此分組)
        name: '五餅二魚・收拾零碎',
        subtitle: '約 6・零碎收進十二個籃子——免得有糟蹋的',
        color: '#b0904a',
        emoji: '🧺',
        url: 'https://hfpc-paul-game.netlify.app/?demo=fragments',
      },
      {
        id: 'herd',
        kind: 'pool', // 玩法類型(#/bytype 依此分組)
        name: '趕羊入圈',
        subtitle: '約 10・撞球式把走散的羊領回圈——合成一群',
        color: '#5a8a4a',
        emoji: '🐑',
        url: 'https://hfpc-paul-game.netlify.app/?demo=herd',
      },
      {
        id: 'fruits',
        kind: 'match', // 玩法類型(#/bytype 依此分組)
        name: '聖靈果子・結果子',
        subtitle: '加 5・仁愛喜樂和平…結到樹上,常在主裡面',
        color: '#7aa060',
        emoji: '🍇',
        url: 'https://hfpc-paul-game.netlify.app/?demo=fruits',
      },
      {
        id: 'armor',
        kind: 'dressup', // 玩法類型(#/bytype 依此分組)
        name: '穿戴全副軍裝',
        subtitle: '弗 6・六件軍裝拖到正確部位——站立得住',
        color: '#8a6a2e',
        emoji: '⚔️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=armor',
      },
      {
        id: 'foxes',
        kind: 'guard', // 玩法類型(#/bytype 依此分組)
        name: '擒拿小狐狸',
        subtitle: '歌 2:15・網子擒住毀壞葡萄園的小狐狸——蝴蝶別抓錯',
        color: '#b9743a',
        emoji: '🦊',
        url: 'https://hfpc-paul-game.netlify.app/?demo=foxes',
      },
      {
        id: 'sparks',
        kind: 'guard', // 玩法類型(#/bytype 依此分組)
        name: '撲滅小火苗',
        subtitle: '雅 3:5・趁小撲滅,別讓最小的火點著最大的樹林',
        color: '#3a6a9a',
        emoji: '💧',
        url: 'https://hfpc-paul-game.netlify.app/?demo=sparks',
      },
    ],
  },
  'sports-fun': {
    title: '休閒運動合輯',
    emoji: '🎮',
    desc:
      '無經文的課間放鬆小遊戲——運動題材,輸了也開心,再來一場就是了。' +
      '(與「憫安製作闖關合輯」共用同幾關;這裡按「休閒」聚一份,課間快速找。)',
    color: '#3f7a34',
    items: [
      {
        id: 'goalkick',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '射門練習(休閒)',
        subtitle: '拖球射門・守門員撲救・踢 10 球看進幾球',
        color: '#5a8a3a',
        emoji: '⚽',
        url: 'https://hfpc-paul-game.netlify.app/?demo=goalkick',
      },
      {
        id: 'soccer',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '世界盃足球賽(休閒)',
        subtitle: '回合彈射全場・🤖 鬥阿福教練或 👥 雙人同機 PK',
        color: '#3f7a34',
        emoji: '🏆',
        url: 'https://hfpc-paul-game.netlify.app/?demo=soccer',
      },
      {
        id: 'football',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '世界盃足球賽・實況版(休閒)',
        subtitle: '即時運球+蓄力踢球・🤖 對戰 AI 或 👥 雙人同機',
        color: '#3f7a34',
        emoji: '🥅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=football',
      },
      {
        // 投籃大賽:休閒關第四彈(無經文,側視蓄力投籃;paul PR #84 併入、A 站驗過 bundle 才點)。
        id: 'hoopshot',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '投籃大賽(休閒)',
        subtitle: '蓄力抓綠色甜蜜區・越投越遠・三分線外算 3 分',
        color: '#a05a28',
        emoji: '🏀',
        url: 'https://hfpc-paul-game.netlify.app/?demo=hoopshot',
      },
      {
        // 世界盃籃球賽:休閒關第五彈(無經文,football 姊妹作即時運球+投籃;paul PR #84 併入)。
        id: 'basketball',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '世界盃籃球賽(休閒)',
        subtitle: '即時運球+蓄力投籃・搶籃板・🤖 對戰 AI 或 👥 雙人同機',
        color: '#8a4a20',
        emoji: '⛹️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=basketball',
      },
      {
        // 棒球打擊王:休閒關第六彈(無經文,主審視角時機揮棒;paul PR #85 併入,#86 主審視角大改審中)。
        id: 'baseball',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '棒球打擊王(休閒)',
        subtitle: '看清好壞球再揮棒・全壘打!・🤖 打擊練習或 👥 投打對決',
        color: '#4a6a9a',
        emoji: '⚾',
        url: 'https://hfpc-paul-game.netlify.app/?demo=baseball',
      },
      {
        // 花式撞球:休閒關第七彈(無經文,真物理入袋;paul PR #89 併入、A 站驗過 bundle 才點)。
        id: 'billiards',
        kind: 'pool', // 玩法類型(#/bytype 依此分組)
        name: '花式撞球(休閒)',
        subtitle: '真物理入袋・拉桿瞄準清光自己的球・🤖 鬥阿福或 👥 雙人',
        color: '#2e7d4f',
        emoji: '🎱',
        url: 'https://hfpc-paul-game.netlify.app/?demo=billiards',
      },
      {
        // 3D 棒球:休閒關第八彈(無經文,獨立站 baseball3d;大廳只帶路——Three.js 主審視角,
        // 07-10 一天建成:九宮格五球種/盜壘跑壘/9 局計分板/人聲播報;Netlify CLI 部署驗過 bundle 才點卡)。
        id: 'baseball3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 棒球(休閒)',
        subtitle: '主審視角 3D 球場・九宮格五球種・盜壘跑壘・🤖 打擊/投球/對戰/雙人',
        color: '#35558a',
        emoji: '🏟️',
        url: 'https://hfpc-baseball3d.summer09201017.workers.dev/',
      },
      {
        // 3D 撞球:休閒關第九彈(無經文,獨立站;07-11 子代理照 3d-game-kit 建成,51 項物理/規則自測)。
        id: 'billiards3d',
        kind: 'pool', // 玩法類型(#/bytype 依此分組)
        name: '3D 撞球(休閒)',
        subtitle: '3D 球桌雙色對決・蓄力擊球清台打黑8・🤖 鬥阿福或 👥 雙人',
        color: '#1f6b45',
        emoji: '🎱',
        url: 'https://hfpc-billiards3d.summer09201017.workers.dev/',
      },
      {
        // 3D 足球:休閒關第十彈(無經文,獨立站;07-11 建成——即時控人+守門員撲救+先進N球)。
        id: 'soccer3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 足球(休閒)',
        subtitle: '3D 綠茵夜賽・帶球傳射+守門員撲救・先進 N 球獲勝・🤖/👥',
        color: '#2c7a3f',
        emoji: '⚽',
        url: 'https://hfpc-soccer3d.summer09201017.workers.dev/',
      },
      {
        // 3D 網球:休閒關第十一彈(racket3d 一站雙玩法,?mode 深連結;07-11 隔網引擎)。
        id: 'tennis3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 網球(休閒)',
        subtitle: '隔網對打・時機揮拍蓄力抽擊・搶 N 分自訂・🤖 五檔/👥 雙人',
        color: '#2f6e8f',
        emoji: '🎾',
        url: 'https://hfpc-racket3d.summer09201017.workers.dev/?mode=tennis',
      },
      {
        // 3D 羽毛球:休閒關第十二彈(同站 racket3d,羽毛球物理:不落地/殺球快陡)。
        id: 'badminton3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 羽毛球(休閒)',
        subtitle: '不落地的攻防・長按殺球又快又陡・搶 N 分自訂・🤖/👥',
        color: '#3f7a4a',
        emoji: '🏸',
        url: 'https://hfpc-racket3d.summer09201017.workers.dev/?mode=badminton',
      },
      {
        // 3D 西洋劍:休閒關第十三彈(奧運觸劍計分,點到為止無血條;07-11 使用者拍板做競技版)。
        id: 'fencing3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 西洋劍(休閒)',
        subtitle: '奧運觸劍計分・看紅色預告格擋再反擊・搶 N 分自訂・🤖/👥',
        color: '#5a6482',
        emoji: '🤺',
        url: 'https://hfpc-fencing3d.netlify.app/',
      },
      {
        // 3D 保齡球:休閒關第十四彈(滾球物理+正規計分學算數;回合制輪流=課間分組)。
        id: 'bowling3d',
        kind: 'pool', // 玩法類型(#/bytype 依此分組:滾球瞄準家族)
        name: '3D 保齡球(休閒)',
        subtitle: '瞄口袋蓄力出手・全倒補中正規計分學算數・單人/🤖/👥 輪流',
        color: '#8a5a28',
        emoji: '🎳',
        url: 'https://hfpc-bowling3d.netlify.app/',
      },
      {
        // 3D 迷你高爾夫:休閒關第十五彈(滾球物理+九洞關卡;溫柔 8 桿上限)。
        id: 'minigolf3d',
        kind: 'pool', // 玩法類型(#/bytype 依此分組:滾球瞄準家族)
        name: '3D 迷你高爾夫(休閒)',
        subtitle: '九洞牆壁迷宮・瞄角度拿捏力道・桿數比標準桿・單人/🤖/👥',
        color: '#2e7a44',
        emoji: '⛳',
        url: 'https://hfpc-minigolf3d.pages.dev/',
      },
      {
        // 3D 躲避球:休閒關第十六彈(台灣小學經典;接殺機制+溫柔出局=板凳加油)。
        id: 'dodgeball3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 躲避球(休閒)',
        subtitle: '小學經典・蓄力投球+K 接殺逆轉・出局到板凳加油・🤖/👥',
        color: '#a3552e',
        emoji: '🤾',
        url: 'https://hfpc-dodgeball3d.netlify.app/',
      },
      {
        // 3D 功夫修行:休閒關第十七彈(打木人樁節奏模仿,非互毆;評級全鼓勵語)。
        id: 'kungfutrain3d',
        kind: 'rhythm', // 玩法類型(#/bytype 依此分組:節奏家族)
        name: '3D 功夫修行(休閒)',
        subtitle: '跟節奏打木人樁・拳掌踢擋四鍵・連擊評級到宗師・非對打',
        color: '#7a3c2e',
        emoji: '🏮',
        url: 'https://hfpc-kungfutrain3d.summer09201017.workers.dev/',
      },
      {
        // 3D 桌球:休閒關第十八彈(racket3d 第三運動,?mode=pingpong 深連結)。
        id: 'pingpong3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 桌球(休閒)',
        subtitle: '球桌快節奏・彈跳快殺球更快・搶 11 分自訂・🤖/👥',
        color: '#2456a8',
        emoji: '🏓',
        url: 'https://hfpc-racket3d.summer09201017.workers.dev/?mode=pingpong',
      },
      {
        // 3D 射箭:休閒關第十九彈(無經文,獨立站 archery3d;「蓄力+拋物線」家族地基,
        // 07-12 建成:拉弓蓄力+屏息準星晃動+順逆風補償+十環靶,雲哲人聲播報+觀眾聲,
        // 五難度自我對戰校正;線上 bundle 驗過新版才點卡)。
        id: 'archery3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 射箭(休閒)',
        subtitle: '拉弓蓄力屏息瞄準・抓風向反向補償・十環靶計分・五難度三模式',
        color: '#8a6a28',
        emoji: '🏹',
        url: 'https://hfpc-archery3d.summer09201017.workers.dev/',
      },
      {
        // 3D 鉛球:休閒關第二十彈(athletics3d 一站三項,?mode 深連結——racket3d 範式;
        // archery3d fork「蓄力+拋物線」家族,07-12 建成:蓄力+出手角度+順逆風+6投取最佳+個人紀錄)。
        id: 'shotput3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 鉛球(休閒)',
        subtitle: '蓄力推球 41° 最遠・順逆風補償・6 投取最佳・個人紀錄金弧',
        color: '#4a4e57',
        emoji: '🥎',
        url: 'https://hfpc-athletics3d.summer09201017.workers.dev/?mode=shotput',
      },
      {
        // 3D 鐵餅:同站 athletics3d 第二項目。
        id: 'discus3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 鐵餅(休閒)',
        subtitle: '甩餅乘風滑翔 38° 最遠・角度手抖拿捏・6 投取最佳・個人紀錄',
        color: '#8a6a28',
        emoji: '🥏',
        url: 'https://hfpc-athletics3d.summer09201017.workers.dev/?mode=discus',
      },
      {
        // 3D 標槍:同站 athletics3d 第三項目。
        id: 'javelin3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 標槍(休閒)',
        subtitle: '全力一擲插進草地 36° 最遠・貼近真實紀錄尺度・6 投取最佳',
        color: '#5a6482',
        emoji: '🎯',
        url: 'https://hfpc-athletics3d.summer09201017.workers.dev/?mode=javelin',
      },
      {
        // 3D 100公尺:athletics3d 第四項目(07-13 佇列⑤田徑跑步;連點節奏衝刺+計時+PB)。
        id: 'sprint3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 100公尺(休閒)',
        subtitle: '連點衝刺節奏越穩越快・亂按會腳步打結・計時+個人紀錄',
        color: '#b3542e',
        emoji: '🏃',
        url: 'https://hfpc-athletics3d.summer09201017.workers.dev/?mode=sprint',
      },
      {
        // 3D 冰壺:bowling3d fork(07-13 佇列⑧;擲壺+掃冰+House 計分,冰上西洋棋)。
        id: 'curling3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 冰壺(休閒)',
        subtitle: '擲壺蓄力+按住空白鍵掃冰更滑・House 圓心計分・4v4 壺鬥智',
        color: '#2f6fd6',
        emoji: '🥌',
        url: 'https://hfpc-curling3d.netlify.app/',
      },
      {
        // 3D 冰球:curling3d fork(07-13 佇列⑨最終項;射門+撲救輪流對決)。
        id: 'hockey3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 冰球(休閒)',
        subtitle: '射門瞄死角+換邊控守門員撲救・側板反彈折射球・進球多者勝',
        color: '#3a5f8a',
        emoji: '🏒',
        url: 'https://hfpc-hockey3d.netlify.app/',
      },
      {
        // 3D 12碼PK:hockey3d 骨架足球版(07-14 使用者拍板)。
        id: 'penalty3d',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '3D 12碼 PK 大戰(休閒)',
        subtitle: '主罰⇄飛撲輪流攻防・大力=高球較難撲・賭方向的心理戰',
        color: '#2e7d32',
        emoji: '⚽',
        url: 'https://hfpc-penalty3d.netlify.app/',
      },
    ],
  },
  // 經典街機合輯(2026-07-10 使用者拍板):四張直達卡連到「爸爸作品集」已部署的完整成品——
  // 大廳鐵則「只帶路、不放遊戲、不複製」的活範例;原專案改版,這裡自動享受新版。
  'arcade-classics': {
    title: '經典街機合輯',
    emoji: '🕹️',
    desc:
      '經典懷舊小遊戲——打磚塊、俄羅斯方塊、雷電、棒球對戰,都是完整成品(無經文)。' +
      '課間放鬆、大孩子挑戰高分;雷電是飛行射擊(擊落敵機),老師可自行斟酌年齡。',
    color: '#2c3e6b',
    items: [
      {
        id: 'bricksbreaking',
        kind: 'breakout', // 玩法類型(#/bytype 依此分組)
        name: '打磚塊',
        subtitle: '經典彈板敲磚・寶物雷射分裂球・每日挑戰與成就',
        color: '#c8901e',
        emoji: '🧱',
        url: 'https://bricksbreaking.netlify.app/',
      },
      {
        id: 'dragtetris',
        kind: 'stack', // 玩法類型(#/bytype 依此分組)
        name: '俄羅斯方塊',
        subtitle: '經典 Tetris・HOLD+五顆預覽・滑鼠拖曳模式',
        color: '#2c5ac8',
        emoji: '🟦',
        url: 'https://dragtetris.netlify.app/',
      },
      {
        id: 'flyshoot',
        kind: 'shmup', // 玩法類型(#/bytype 依此分組;新 kind:飛行射擊)
        name: '雷電・蒼穹突擊',
        subtitle: '擊落敵機・大孩子向——Boss/僚機/商店/雙人協力',
        color: '#1e3a5c',
        emoji: '✈️',
        url: 'https://flyshoot.netlify.app/',
      },
      {
        id: 'deyi-baseball',
        kind: 'sports', // 玩法類型(#/bytype 依此分組)
        name: '九局熱戰(棒球進階版)',
        subtitle: '完整九局棒球對戰——與棒球打擊王並列,進階版',
        color: '#7a3a2c',
        emoji: '⚾',
        url: 'https://deyi-baseball.netlify.app/',
      },
    ],
  },
  peterLife: {
    title: '彼得的一生',
    desc:
      '跟著彼得走一生:在風浪中定睛、在監牢裡蒙拯救、在跌倒後被主重建。' +
      '(每張卡片直接連到那一關的所在地,不複製關卡;沒做好/沒部署的先「敬請期待」。)',
    color: '#7a5230',
    emoji: '🪨',
    items: [
      {
        // 彼得大富翁(?journey=peter,已嵌 paul、A 站自動部署)。地圖「整頁變藍」2026-06-25 已修(commit 494eb9d,已 push 上線)。
        // ✅ 2026-06-25:經文已上線、文案經牧者自審(免送審題包)→ 直接亮(首頁聖經旅程另有直達卡 peter-board)。
        id: 'board',
        kind: 'rollmove', // 玩法類型(#/bytype 依此分組)
        name: '彼得大富翁',
        subtitle: '徒 1–12・20 站真實地理,擲骰走遍彼得腳蹤',
        color: '#5a7d3a',
        emoji: '🎲',
        url: 'https://hfpc-paul-game.netlify.app/?journey=peter',
      },
      {
        // 彼得走海(節奏關,已部署上線;大廳首頁也有直達卡 peter-sea、憫安合輯也收一張)。
        id: 'sea',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海',
        subtitle: '太 14・定睛看耶穌,在風浪中不下沉',
        color: '#2f6fb0',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea-game.netlify.app/',
      },
      {
        // 彼得走海(3D):peter-sea3d(07-13 佇列#15;kungfutrain 節奏底座聖經皮;2D 原版保留並列=keep-2d-add-3d 鐵則)。
        id: 'peter-sea3d',
        kind: 'rhythm-fnf', // 玩法類型(#/bytype 依此分組)
        name: '彼得走海(3D)',
        subtitle: '夜海 3D 踏浪!左右腳跟拍走向耶穌・風浪下沉喊「主啊救我」・經文朗讀',
        color: '#1d4265',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea3d.summer09201017.workers.dev/',
      },

      {
        // 彼得越獄(潛行關)。✅ 2026-06-25:經文 cuv 查驗 10/10、已部署 hfpc-peter-prison-game.netlify.app
        //   (curl 驗證標題 + 核心資產 200);牧者審題包依指示略過(牧者自審)→ 正式亮。
        id: 'prison',
        kind: 'stealth', // 玩法類型(#/bytype 依此分組)
        name: '彼得越獄',
        subtitle: '徒 12・神開鐵門,人只管跟著走',
        color: '#5b6470',
        emoji: '🕯️',
        url: 'https://hfpc-peter-prison-game.netlify.app/',
      },
      {
        // 下網得魚(收集類)。✅ 2026-06-27:住保羅 repo src/minigames/fishing/,?demo=fishing;經文 cuv 查驗(路5:4/5/6/10/11)、A 站自動部署。
        //   兩階段順服:整夜勞力→「依你的話」開到水深之處→網滿;神學「得人如得魚、撇下所有跟從」(路5:10-11)。
        id: 'catch',
        kind: 'collect', // 玩法類型(#/bytype 依此分組)
        name: '下網得魚',
        subtitle: '路 5・聽主的話,空船變滿網',
        color: '#2e8b8b',
        emoji: '🎣',
        url: 'https://hfpc-paul-game.netlify.app/?demo=fishing',
      },
      {
        // 海邊的復興/三次託付。✅ 2026-06-28:住保羅 repo src/minigames/shore/,?demo=shore;經文 cuv 查驗(約21:15/16/17/19/9)、A 站自動部署。
        //   三次「你愛我嗎?」→ 餵養我的羊;炭火旁的接納(彼得曾三次不認主)、「你跟從我吧」(21:19)。⛔ 不渲染殉道。
        id: 'restore',
        kind: 'storyanswer', // 玩法類型(#/bytype 依此分組)
        name: '海邊的復興',
        subtitle: '約 21・「你愛我嗎?」三次跌倒、三次託付',
        color: '#c0612a',
        emoji: '🔥',
        url: 'https://hfpc-paul-game.netlify.app/?demo=shore',
      },
    ],
  },
}
