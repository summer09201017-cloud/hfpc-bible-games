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
        // 聖歌奇兵(約沙法):住在「約拿引擎」repo(vanilla JS),?level=jehoshaphat 動作關。
        // 代下 20——詩班走在軍隊前面讚美,神設伏兵,猶大不戰而勝(最典型「不靠刀槍、靠倚靠神」)。
        // 與「逆轉奇兵」合輯共用同一關(深連結,不複製;改一處兩邊都更新)。
        // ✅ 2026-06-14:同摩西,部署到「戰爭原型」獨立站 hfpc-war-games,卡片正式亮。
        id: 'jehoshaphat',
        name: '聖歌奇兵',
        subtitle: '代下 20・詩班讚美,神設伏兵得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-war-games.netlify.app/?level=jehoshaphat',
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
        // 紅海奔逃:設計稿 + config/scripture 就緒,關卡程式(redsea.js)待寫。
        id: 'redsea',
        name: '紅海奔逃',
        subtitle: '出 14・敬請期待',
        color: '#2b6fa8',
        emoji: '🌊',
        soon: true,
      },
    ],
  },
  reversal: {
    title: '逆轉奇兵',
    desc:
      '暑假快樂兒童營主題:神專門用世人看為軟弱的,逆轉得勝(林前 1:27)。五個「神的出其不意」。' +
      '(五關陸續開發中——做好一個就把它的「敬請期待」拿掉。)',
    color: '#7a3aa8',
    emoji: '🛡️',
    items: [
      {
        id: 'paul-light',
        name: '大光奇兵',
        subtitle: '徒 9・保羅遇大光信主',
        color: '#d9b310',
        emoji: '🌟',
        soon: true,
      },
      {
        // ✅ 2026-06-14:已部署 hfpc-war-games(?level=balaam);與「戰爭闖關合輯」共用同一關。
        id: 'donkey',
        name: '反轉奇兵',
        subtitle: '民 22・巴蘭的驢開口',
        color: '#8a6d3b',
        emoji: '🫏',
        url: 'https://hfpc-war-games.netlify.app/?level=balaam',
      },
      {
        id: 'cornelius',
        name: '福音奇兵',
        subtitle: '徒 10・彼得向哥尼流傳福音',
        color: '#3a8d8d',
        emoji: '🕊️',
        soon: true,
      },
      {
        // ✅ 2026-06-14:已部署 hfpc-war-games(?level=jehoshaphat);與「戰爭闖關合輯」共用同一關。
        id: 'jehoshaphat',
        name: '聖歌奇兵',
        subtitle: '代下 20・約沙法唱詩歌得勝',
        color: '#9a4ca8',
        emoji: '🎵',
        url: 'https://hfpc-war-games.netlify.app/?level=jehoshaphat',
      },
      {
        id: 'elijah',
        name: '盼望奇兵',
        subtitle: '王上 19・以利亞灰心後重得力',
        color: '#c1772e',
        emoji: '🌅',
        soon: true,
      },
    ],
  },
}
