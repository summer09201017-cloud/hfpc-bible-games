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
]

export const JOURNEYS = [
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
]

// ★ 合輯內容(每個 = 一張「播放清單」)。
//   items 裡每一關都『指向它原本已存在的地方』(深連結),不在這裡複製關卡。
//   一關還沒上線就 soon:true(顯示「敬請期待」、不可點);上線後把 soon 拿掉、補上 url 即可。
export const COLLECTIONS = {
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
      '創世記 6–7:挪亞因著信、頂著旁人譏笑造方舟;動物一對一對進來。' +
      '兩個小遊戲都能單獨玩。' +
      '(⚠ 連到保羅站的 ?demo=,需先合併並部署 paul「feat/noah-minigames」(PR #15)才會生效。)',
    color: '#3f7fbf',
    emoji: '🛕',
    items: [
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
}
