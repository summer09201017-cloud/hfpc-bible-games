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
    id: 'jonah',
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
    name: '約拿宣教之旅(桌遊版)',
    subtitle: '約拿書 1–4 ・ 大富翁桌遊',
    category: 'bible',
    color: '#2aa198',
    emoji: '🗺️',
    url: 'https://hfpc-paul-game.netlify.app/?journey=jonah',
  },
  {
    id: 'paul',
    name: '保羅大富翁',
    subtitle: '保羅宣教之旅・擲骰桌遊',
    category: 'bible',
    color: '#c1772e',
    emoji: '⛵',
    url: 'https://hfpc-paul-game.netlify.app/?journey=paul',
  },
  {
    id: 'daniel',
    name: '但以理在巴比倫',
    subtitle: '但以理書 1–6、9 ・ 大富翁桌遊',
    category: 'bible',
    color: '#6a4c93',
    emoji: '🦁',
    url: 'https://hfpc-paul-game.netlify.app/?journey=daniel',
  },
  {
    id: 'exodus',
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
    name: '路得記·從空到滿',
    subtitle: '得 1–4・大富翁桌遊:救贖與恩慈(hesed)',
    category: 'bible',
    color: '#caa54a',
    emoji: '🌾',
    url: 'https://hfpc-ruth-game.netlify.app/',
  },
  {
    // 彼得走海(節奏闖關):獨立 repo hfpc-peter-sea-game(vanilla Canvas + Web Audio PWA,FNF 風格節拍打擊)。
    // ✅ 2026-06-21:已部署 hfpc-peter-sea-game.netlify.app(curl 驗證標題 + 核心資產 200),卡片正式亮。
    id: 'peter-sea',
    name: '彼得走海(節奏闖關)',
    subtitle: '太 14・定睛看耶穌,踩準節拍走過海面',
    category: 'bible',
    color: '#1e4f8a',
    emoji: '🌊',
    url: 'https://hfpc-peter-sea-game.netlify.app/',
    credit: '製作:憫安',
  },
  {
    // 保羅西拉(節奏闖關):獨立 repo hfpc-paul-silas-game(vanilla Canvas + Web Audio PWA,FNF 風格)。
    // ✅ 2026-06-22:已部署 hfpc-paul-silas-game.netlify.app(curl 驗證標題 + 核心資產 200),卡片正式亮。
    id: 'paul-silas',
    name: '保羅西拉(節奏闖關)',
    subtitle: '徒 16・半夜監牢唱詩讚美,神開監門',
    category: 'bible',
    color: '#5a3a8a',
    emoji: '🎶',
    url: 'https://hfpc-paul-silas-game.netlify.app/',
  },
  {
    // 詩篇150(節奏闖關):獨立 repo hfpc-psalm150-game(vanilla Canvas + Web Audio PWA,FNF 風格)。
    // ✅ 2026-06-22:已部署 hfpc-psalm150-game.netlify.app(curl 驗證標題 + 核心資產 200),卡片正式亮。
    id: 'psalm150',
    name: '詩篇150(節奏闖關)',
    subtitle: '詩 150・各樣樂器齊鳴,凡有氣息都讚美',
    category: 'bible',
    color: '#b5872e',
    emoji: '🎺',
    url: 'https://hfpc-psalm150-game.netlify.app/',
  },
  {
    // 王宮之夜(潛行恐怖 + 輕反向RPG):獨立 repo hfpc-daniel-game(vanilla Canvas PWA)。
    // ✅ 2026-06-25:已部署 hfpc-daniel-game.netlify.app(curl 驗證標題 + 核心資產 200),卡片正式亮。
    //    內建「恐怖強度」旋鈕(💀滿／🕯️緩和／🧸兒童),切「兒童」即不嚇人、無血、較亮 → 主日學也能用。
    id: 'daniel-palace',
    name: '王宮之夜(潛行闖關)',
    subtitle: '但 2・漆黑王宮避開獵手,趕在天亮前到王前求寬限',
    category: 'bible',
    color: '#3a2c52',
    emoji: '🕯️',
    url: 'https://hfpc-daniel-game.netlify.app/',
    credit: '製作:憫安',
  },
  {
    // 彼得大富翁(直達卡):住保羅 repo,?journey=peter(20 站真實地理聖地棋盤)。
    // ✅ 2026-06-25:地圖「整頁變藍」已修(paul 494eb9d)、經文已上線;文案經牧者自審(免送審題包)→ 直接亮。
    //    另在「彼得的一生」合輯(series)也收一張(id:'board');這裡是首頁聖經旅程的直達卡。
    id: 'peter-board',
    name: '彼得大富翁',
    subtitle: '徒 1–12・20 站真實地理,擲骰走遍彼得腳蹤',
    category: 'bible',
    color: '#5a7d3a',
    emoji: '🎲',
    url: 'https://hfpc-paul-game.netlify.app/?journey=peter',
  },
  {
    // 參孫打獅子(直達卡):獨立 repo hfpc-samson-game(vanilla Canvas PWA),即時動作關。
    // 已部署 hfpc-samson-game.netlify.app(2026-06-25 curl 驗證標題 + 200)。憫安製作,合輯(戰爭/憫安)也各收一張。
    // 主題正中合輯精神:聖經不說參孫多強壯,而說「耶和華的靈大大感動他」——力量出於神。
    id: 'samson',
    name: '參孫打獅子',
    subtitle: '士 14・耶和華的靈感動,徒手撕獅',
    category: 'bible',
    color: '#9c5a2a',
    emoji: '🦁',
    url: 'https://hfpc-samson-game.netlify.app/',
    credit: '製作:憫安',
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
    // 挪亞方舟:兩個方舟小遊戲(住保羅 repo src/minigames/arkpairs|arkbuild/)。
    // ⚠ 連到保羅站 ?demo=,需先合併並部署 paul「feat/noah-minigames」(PR #15)才會生效;未部署前點了會 404。
    id: 'noah',
    name: '挪亞方舟',
    subtitle: '創 6–7・兩個方舟小遊戲',
    category: 'series',
    color: '#3f7fbf',
    emoji: '🛕',
    collection: 'noah',
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
]

// ★ 合輯內容(每個 = 一張「播放清單」)。
//   items 裡每一關都『指向它原本已存在的地方』(深連結),不在這裡複製關卡。
//   一關還沒上線就 soon:true(顯示「敬請期待」、不可點);上線後把 soon 拿掉、補上 url 即可。
export const COLLECTIONS = {
  // 作者作品集(榮譽牆):按「製作者=憫安」聚成一張清單,鼓勵小作者。每關都連到它原本的網址,不複製。
  minan: {
    title: '憫安製作闖關合輯',
    desc:
      '這些關卡都是憫安一手打造的——節奏、動作、潛行各一款,每關都能單獨玩。' +
      '(同一關在大廳別處也找得到;這裡按「作者」聚成一面作品牆,給憫安記上一筆。)',
    color: '#f0b840',
    emoji: '✨',
    items: [
      {
        id: 'peter-sea',
        name: '彼得走海(節奏闖關)',
        subtitle: '太 14・定睛看耶穌,踩準節拍走過海面',
        color: '#1e4f8a',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        id: 'samson',
        name: '參孫打獅子',
        subtitle: '士 14・耶和華的靈感動,徒手撕獅',
        color: '#9c5a2a',
        emoji: '🦁',
        url: 'https://hfpc-samson-game.netlify.app/',
        credit: '製作:憫安',
      },
      {
        id: 'daniel-palace',
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
        // 摩西舉手之戰:住在「約拿引擎」repo(vanilla JS),?level=moses。
        // ✅ 2026-06-14:部署到「戰爭原型」獨立站 hfpc-war-games(不碰線上約拿六關站),卡片正式亮。
        //   永久家仍是保羅 repo(見 HANDOFF);營會後有空再搬,屆時把 url 改指向保羅站即可。
        id: 'moses',
        name: '摩西舉手之戰',
        subtitle: '出 17・撐住舉手,亞倫戶珥扶手',
        color: '#c98a2b',
        emoji: '🙌',
        url: 'https://hfpc-war-games.netlify.app/?level=moses',
      },
      {
        // 大衛甩石:住在「保羅大富翁」repo,src/minigames/sling/,?demo=sling 可單獨玩。
        // ✅ 2026-06-14:牧師實測 OK → feat/david-sling 已併 main 並部署,卡片正式亮。
        id: 'david',
        name: '大衛甩石',
        subtitle: '撒上 17・瞄準拋射,打倒歌利亞',
        color: '#3a8d6b',
        emoji: '🎯',
        url: 'https://hfpc-paul-game.netlify.app/?demo=sling',
      },
      {
        // 聖歌奇兵(約沙法)動作關:代下 20——詩班走在軍隊前面讚美,神設伏兵,猶大不戰而勝
        // (最典型「不靠刀槍、靠倚靠神」)。與「逆轉奇兵」合輯共用同一關(深連結,不複製)。
        // ✅ 2026-06-16:戰爭關搬進保羅 repo(永久家,消除跨 repo sync)→ paul ?demo=jehoshaphat-action
        //    (自動部署;敵人放大+表情等改動即可上線。原 war-games 為手動部署的原型站。)
        id: 'jehoshaphat',
        name: '聖歌奇兵',
        subtitle: '代下 20・詩班讚美,神設伏兵得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat-action',
      },
      {
        // 反轉奇兵(巴蘭的驢 民22):住在「約拿引擎」repo,?level=balaam 閃避動作關。
        // 與「逆轉奇兵」合輯共用同一關(深連結,不複製;改一處兩邊都更新)。
        // ✅ 2026-06-14:同摩西/聖歌,部署在 hfpc-war-games,卡片正式亮。
        id: 'balaam',
        name: '反轉奇兵',
        subtitle: '民 22・巴蘭的驢,神攔阻得勝',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-war-games.netlify.app/?level=balaam',
      },
      {
        // ✅ 2026-06-15:紅海奔逃動作關復活——獨立入口 保羅 ?demo=redsea(出 14;不綁約拿站,點進去直接玩)。
        //   ⚠ 需先合併並部署 paul「feat/redsea-demo」才會生效。
        id: 'redsea',
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
        name: '參孫打獅子',
        subtitle: '士 14・耶和華的靈感動,徒手撕獅',
        color: '#9c5a2a',
        emoji: '🦁',
        url: 'https://hfpc-samson-game.netlify.app/',
        // 小作者署名:任何卡片加 credit 欄就會顯示一枚「製作」徽章(見 main.js makeCard / styles.css .card__credit)。
        credit: '製作:憫安',
      },
      {
        // 約阿施射得勝箭(王下 13):住保羅 repo src/minigames/joash/,?demo=joash(拋射動作關,複製甩石引擎換皮)。
        // ✅ 2026-06-25:經文 cuv 查驗、自動部署上線(paul A 站)。年齡旋鈕(幼/童/青)+ 會動的靶 + 語音玩法。
        // 主題正中合輯精神:得勝是「耶和華的得勝箭」,不是王的臂力;憑信多射幾次=得勝越完全(13:19)。
        id: 'joash',
        name: '約阿施射得勝箭',
        subtitle: '王下 13・憑信射到底,耶和華使你得勝',
        color: '#7a4fb0',
        emoji: '🏹',
        url: 'https://hfpc-paul-game.netlify.app/?demo=joash',
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
        name: '福音奇兵·卡片版',
        subtitle: '徒 10・彼得向哥尼流傳福音',
        color: '#3a8d8d',
        emoji: '🕊️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=cornelius',
      },
      {
        // ⚠ 文案待牧者審(使用者指示先亮、之後自審);關卡已在保羅 main(?demo=elijah)。
        id: 'elijah-card',
        name: '盼望奇兵·卡片版',
        subtitle: '王上 19・以利亞灰心後重得力',
        color: '#c1772e',
        emoji: '🌅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=elijah',
      },
      {
        // ⚠ 文案待牧者審(使用者指示先亮、之後自審);關卡已在保羅 main(?demo=saul)。
        id: 'saul-card',
        name: '大光奇兵·卡片版',
        subtitle: '徒 9・掃羅遇大光信主',
        color: '#d9b310',
        emoji: '💡',
        url: 'https://hfpc-paul-game.netlify.app/?demo=saul',
      },
      {
        // ✅ 2026-06-15 新做:聖歌卡片關(代下 20 約沙法唱詩得勝);需 paul 卡片關 PR 部署。文案待牧者審。
        id: 'jehoshaphat-card',
        name: '聖歌奇兵·卡片版',
        subtitle: '代下 20・約沙法唱詩歌得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat',
      },
      {
        // ✅ 2026-06-15 新做:反轉卡片關(民 22 巴蘭的驢);需 paul 卡片關 PR 部署。文案待牧者審。
        id: 'balaam-card',
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
        name: '福音奇兵·動作版',
        subtitle: '徒 10・順服聖靈,出發傳福音',
        color: '#3a8d8d',
        emoji: '🕊️',
        url: 'https://hfpc-paul-game.netlify.app/?demo=cornelius-action',
      },
      {
        // ✅ 2026-06-15:盼望動作版上線(以利亞曠野撿餅水恢復體力,?demo=elijah-action)。
        id: 'elijah-action',
        name: '盼望奇兵·動作版',
        subtitle: '王上 19・撿餅喝水重得力',
        color: '#c1772e',
        emoji: '🌅',
        url: 'https://hfpc-paul-game.netlify.app/?demo=elijah-action',
      },
      {
        // ✅ 2026-06-15:大光動作版上線(曠野跑酷,大馬士革路→直街,?demo=saul-action)。需 paul feat/saul-action 部署。
        id: 'saul-action',
        name: '大光奇兵·動作版',
        subtitle: '徒 9・大光仆倒,順服奔跑',
        color: '#d9b310',
        emoji: '💡',
        url: 'https://hfpc-paul-game.netlify.app/?demo=saul-action',
      },
      {
        // ✅ 2026-06-16:聖歌動作版搬進保羅 repo(永久家)→ paul ?demo=jehoshaphat-action(自動部署);與戰爭合輯共用同一關。
        id: 'jehoshaphat-action',
        name: '聖歌奇兵·動作版',
        subtitle: '代下 20・詩班讚美,神設伏兵',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat-action',
      },
      {
        // ✅ 2026-06-14:反轉動作版部署於 hfpc-war-games(?level=balaam);與戰爭合輯共用同一關。
        id: 'balaam-action',
        name: '反轉奇兵·動作版',
        subtitle: '民 22・閃避攔路,神攔阻得勝',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-war-games.netlify.app/?level=balaam',
      },
    ],
  },
  noah: {
    title: '挪亞方舟',
    desc:
      '創世記 6–9:挪亞因著信、頂著旁人譏笑造方舟;動物一對一對進來;審判中有恩典,彩虹為立約的記號。' +
      '可玩「完整大富翁旅程」(14 站,把兩關當闖關站),也可單獨玩各關。',
    color: '#3f7fbf',
    emoji: '🛕',
    items: [
      {
        // ✅ 2026-06-18:完整挪亞大富翁旅程(14 站手繪洪水板 + arkbuild/arkpairs 闖關站 + 彩虹之約終局卡片關)。住保羅 repo,?journey=noah。
        id: 'noah-journey',
        name: '挪亞方舟・完整旅程',
        subtitle: '創 6–9・擲骰大富翁:造舟→洪水→彩虹之約',
        color: '#3f7fbf',
        emoji: '🌈',
        url: 'https://hfpc-paul-game.netlify.app/?journey=noah',
      },
      {
        // 一公一母進方舟 + 安排房間解謎:住保羅 repo src/minigames/arkpairs/,?demo=arkpairs。
        id: 'arkpairs',
        name: '一公一母進方舟',
        subtitle: '創 6–7・翻牌配對 + 安排房間(母的戴🎀)',
        color: '#3f7fd0',
        emoji: '🐘',
        url: 'https://hfpc-paul-game.netlify.app/?demo=arkpairs',
      },
      {
        // 一步一步蓋方舟(操作挪亞鎚擊瞄準):住保羅 repo src/minigames/arkbuild/,?demo=arkbuild。
        id: 'arkbuild',
        name: '一步一步蓋方舟',
        subtitle: '創 6:14-22・操作挪亞釘木板,旁人嘲笑',
        color: '#8a4b2f',
        emoji: '🔨',
        url: 'https://hfpc-paul-game.netlify.app/?demo=arkbuild',
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
        name: '彼得大富翁',
        subtitle: '徒 1–12・20 站真實地理,擲骰走遍彼得腳蹤',
        color: '#5a7d3a',
        emoji: '🎲',
        url: 'https://hfpc-paul-game.netlify.app/?journey=peter',
      },
      {
        // 彼得走海(節奏關,已部署上線;大廳首頁也有直達卡 peter-sea、憫安合輯也收一張)。
        id: 'sea',
        name: '彼得走海',
        subtitle: '太 14・定睛看耶穌,在風浪中不下沉',
        color: '#2f6fb0',
        emoji: '🌊',
        url: 'https://hfpc-peter-sea-game.netlify.app/',
      },
      {
        // 彼得越獄(潛行關)。✅ 2026-06-25:經文 cuv 查驗 10/10、已部署 hfpc-peter-prison-game.netlify.app
        //   (curl 驗證標題 + 核心資產 200);牧者審題包依指示略過(牧者自審)→ 正式亮。
        id: 'prison',
        name: '彼得越獄',
        subtitle: '徒 12・神開鐵門,人只管跟著走',
        color: '#5b6470',
        emoji: '🕯️',
        url: 'https://hfpc-peter-prison-game.netlify.app/',
      },
      {
        // 下網得魚(未製作,佔位「敬請期待」;做好再補 url + 刪 soon)。
        id: 'catch',
        name: '下網得魚',
        subtitle: '路 5/約 21・聽主的話,空船變滿網',
        color: '#2e8b8b',
        emoji: '🎣',
        soon: true,
      },
      {
        // 海邊的復興/三次託付(未製作,佔位)。
        id: 'restore',
        name: '海邊的復興',
        subtitle: '約 21・「你愛我嗎?」三次跌倒、三次託付',
        color: '#c0612a',
        emoji: '🔥',
        soon: true,
      },
    ],
  },
}
