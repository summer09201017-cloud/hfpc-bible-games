// 金句資料層(verses.json 的 ESM 版,零相依、可離線、import 直接用,不必 fetch)。
//
// ★★★ 經文鐵則(本系列第一鐵則)★★★
//   這裡的 `text`(和合本經文原文)只在「已逐字核對」時才填,並標 cuv:'verified'。
//   其餘一律 text:'' + cuv:'pending' —— 畫面會顯示「經文待核對」而不是憑記憶亂填。
//   ➜ 上線前請在「有接 cuv-scripture-mcp 的環境」跑 /cuv-check,把 pending 的逐句補上再改成 verified。
//   目前已核對(取自各遊戲現有、已上線的經文檔):約拿 2:9、使徒行傳 16:26。
//
// 欄位:
//   id      唯一代號         book   書卷(複習頁分組用)
//   ref     金句出處(章節)  theme  教導重點(我方文案,非經文;小測題目用這個當提示)
//   text    和合本經文原文(verified 才填;pending 留空)
//   cuv     'verified' | 'pending'
//   status  'live'(已有可玩的關)| 'soon'(設計中/尚未做關)
//   enter   去玩對應那一關的連結(選填;soon 不填)
//   game    來源關名稱(顯示用)

export const VERSES = [
  // ───── 已核對(verified)──────────────────────────────────────────────
  {
    id: 'jonah-2-9', book: '約拿書', ref: '約拿書 2:9', status: 'live',
    theme: '救恩不是出於人的逃避或努力,是出於神。',
    text: '救恩出於耶和華。', cuv: 'verified',
    game: '約拿闖關', enter: 'https://hfpc-jonah-game.netlify.app/',
  },
  {
    id: 'acts-16-26', book: '使徒行傳', ref: '使徒行傳 16:26', status: 'live',
    theme: '患難中讚美神,神以大能開了監門。',
    text: '忽然,地大震動,甚至監牢的地基都搖動了,監門立刻全開,眾囚犯的鎖鍊也都鬆開了。', cuv: 'verified',
    game: '保羅西拉・腓立比監牢', enter: 'https://hfpc-paul-game.netlify.app/?journey=paul2',
  },

  // ───── 已有關卡、經文待 /cuv-check 補(pending)─────────────────────────
  {
    id: 'sam1-17-47', book: '撒母耳記上', ref: '撒母耳記上 17:47', status: 'live',
    theme: '爭戰的勝敗全在乎耶和華,不在乎刀槍。',
    text: '', cuv: 'pending',
    game: '大衛甩石', enter: 'https://hfpc-paul-game.netlify.app/?demo=sling',
  },
  {
    id: 'kings2-13-17', book: '列王紀下', ref: '列王紀下 13:17', status: 'live',
    theme: '這是耶和華的得勝箭;憑信一箭一箭射到底,別太早停。',
    text: '', cuv: 'pending',
    game: '約阿施射得勝箭', enter: 'https://hfpc-paul-game.netlify.app/?demo=joash',
  },
  {
    id: 'isa-40-31', book: '以賽亞書', ref: '以賽亞書 40:31', status: 'live',
    theme: '等候耶和華的必重新得力;灰心時神先扶持你。',
    text: '', cuv: 'pending',
    game: '以利亞・盼望', enter: 'https://hfpc-paul-game.netlify.app/?demo=elijah-action',
  },
  {
    id: 'gen-6-22', book: '創世記', ref: '創世記 6:22', status: 'live',
    theme: '挪亞的功課不是力氣,是「凡神所吩咐的都照樣去行」的順服。',
    text: '', cuv: 'pending',
    game: '挪亞蓋方舟', enter: 'https://hfpc-paul-game.netlify.app/?demo=ark-build',
  },
  {
    id: 'chr2-20-15', book: '歷代志下', ref: '歷代志下 20:15', status: 'live',
    theme: '不要懼怕,因為勝敗不在乎你們,乃在乎神。',
    text: '', cuv: 'pending',
    game: '約沙法唱詩得勝', enter: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat',
  },
  {
    id: 'exo-14-redsea', book: '出埃及記', ref: '出埃及記 14:13–14', status: 'live',
    theme: '你們只管站住,看耶和華為你們施行的救恩;耶和華必為你們爭戰。',
    text: '', cuv: 'pending',
    game: '紅海奔逃', enter: 'https://hfpc-paul-game.netlify.app/?demo=redsea',
  },
  {
    id: 'num-22-balaam', book: '民數記', ref: '民數記 22:28', status: 'live',
    theme: '神能藉一頭驢說話,攔阻先知的悖逆;沒有神攔不住的路。',
    text: '', cuv: 'pending',
    game: '巴蘭的驢', enter: 'https://hfpc-paul-game.netlify.app/?demo=balaam',
  },
  {
    id: 'acts-10-cornelius', book: '使徒行傳', ref: '使徒行傳 10:34–35', status: 'live',
    theme: '神不偏待人;敬畏祂、行義的,都蒙悅納。',
    text: '', cuv: 'pending',
    game: '哥尼流', enter: 'https://hfpc-paul-game.netlify.app/?demo=cornelius',
  },
  {
    id: 'acts-9-saul', book: '使徒行傳', ref: '使徒行傳 9:3–6', status: 'live',
    theme: '主的光照亮逼迫者,生命可以一夕翻轉。',
    text: '', cuv: 'pending',
    game: '掃羅歸主', enter: 'https://hfpc-paul-game.netlify.app/?demo=saul',
  },
  {
    id: 'dan-2-44', book: '但以理書', ref: '但以理書 2:44', status: 'live',
    theme: '天上的神必另立一國,永不敗壞;祂掌管萬國。',
    text: '', cuv: 'pending',
    game: '但以理(金像/牆上的字/神掌權)', enter: 'https://hfpc-paul-game.netlify.app/',
  },
  {
    id: 'mat-14-31', book: '馬太福音', ref: '馬太福音 14:31', status: 'live',
    theme: '定睛看耶穌;疑惑下沉時,主的手仍拉住你。',
    text: '', cuv: 'pending',
    game: '彼得走海', enter: 'https://hfpc-peter-sea-game.netlify.app/',
  },
  {
    id: 'acts-12-peter', book: '使徒行傳', ref: '使徒行傳 12:7', status: 'live',
    theme: '教會同心禱告,神差天使開了監門救彼得。',
    text: '', cuv: 'pending',
    game: '彼得越獄', enter: 'https://hfpc-peter-prison-game.netlify.app/',
  },
  {
    id: 'psa-150-6', book: '詩篇', ref: '詩篇 150:6', status: 'live',
    theme: '凡有氣息的,都要讚美耶和華。',
    text: '', cuv: 'pending',
    game: '詩篇150 節奏關', enter: 'https://hfpc-psalm150-game.netlify.app/',
  },
  {
    id: 'judg-samson', book: '士師記', ref: '士師記 16:28', status: 'live',
    theme: '力量的源頭是神;人的剛強若離了神就歸於無有。',
    text: '', cuv: 'pending',
    game: '參孫打獅子', enter: 'https://hfpc-samson-game.netlify.app/',
  },

  // ───── 設計中 / 尚未做關(soon;經文亦待核對)───────────────────────────
  {
    id: 'ruth-1-16', book: '路得記', ref: '路得記 1:16', status: 'soon',
    theme: '你的國就是我的國,你的神就是我的神——忠誠與歸屬。',
    text: '', cuv: 'pending', game: '(設計中)',
  },
  {
    id: 'est-4-14', book: '以斯帖記', ref: '以斯帖記 4:14', status: 'soon',
    theme: '焉知你得了王后的位分,不是為現今的機會嗎?——神的安排與勇氣。',
    text: '', cuv: 'pending', game: '(設計中)',
  },
]

// 依書卷分組(複習頁用)。保持 VERSES 內的原始順序。
export function versesByBook(list = VERSES) {
  const groups = []
  const index = new Map()
  for (const v of list) {
    if (!index.has(v.book)) {
      index.set(v.book, groups.length)
      groups.push({ book: v.book, items: [] })
    }
    groups[index.get(v.book)].items.push(v)
  }
  return groups
}

// 可朗讀的(有 verified 經文原文的)。朗讀與「今日金句」只用這些,不唸空字串。
export const readableVerses = (list = VERSES) =>
  list.filter((v) => v.cuv === 'verified' && v.text)

// 今日金句:用「年中第幾天」當索引,確定性挑一句(同一天大家看到同一句);
//   優先從可朗讀的挑,沒有就退回整份清單。dayNumber 由呼叫端傳入(避免在這裡碰 Date 不利測試)。
export function verseOfDay(dayNumber, list = VERSES) {
  const pool = readableVerses(list)
  const pick = pool.length ? pool : list
  if (!pick.length) return null
  return pick[((dayNumber % pick.length) + pick.length) % pick.length]
}

// 統計(顯示用):總數 / 已核對 / 已有關卡。
export const verseStats = (list = VERSES) => ({
  total: list.length,
  verified: list.filter((v) => v.cuv === 'verified').length,
  live: list.filter((v) => v.status === 'live').length,
})
