// 金句資料層(verses.json 的 ESM 版,零相依、可離線、import 直接用,不必 fetch)。
//
// ★★★ 經文鐵則(本系列第一鐵則)★★★
//   `text`(和合本經文原文)一律「逐字核對」過才填,並標 cuv:'verified'。
//   2026-06-26:全 18 句已對照「和合本 unv.json」(= cuv-scripture-mcp 預設版本 unv,
//   來源 C:\Users\agape250\Desktop\聖經查詢ANTI\public\data\unv.json)逐字核對。
//   長經文「截到金句段」一律是**逐字連續子句**(不改字、不加標點、不換句),非意譯。
//   日後新增/改動仍要先 /cuv-check 或 cuv-scripture-mcp lookup,查不到就留空、不憑記憶。
//
// 欄位:
//   id      唯一代號         book   書卷(複習頁分組用)
//   ref     金句出處(章節)  theme  教導重點(我方文案,非經文;小測題目用這個當提示)
//   text    和合本經文原文(verified 才填;pending 留空)
//   cuv     'verified' | 'pending'
//   status  'live'(已有可玩的關)| 'soon'(設計中/尚未做關;經文仍可複習朗讀)
//   enter   去玩對應那一關的連結(選填;soon 不填)
//   game    來源關名稱(顯示用)

export const VERSES = [
  {
    id: 'jonah-2-9', book: '約拿書', ref: '約拿書 2:9', status: 'live',
    theme: '救恩不是出於人的逃避或努力,是出於神。',
    text: '救恩出於耶和華。', cuv: 'verified',
    game: '約拿闖關', enter: 'https://hfpc-jonah-game.netlify.app/',
  },
  {
    id: 'acts-16-26', book: '使徒行傳', ref: '使徒行傳 16:26', status: 'live',
    theme: '患難中讚美神,神以大能開了監門。',
    text: '忽然，地大震動，甚至監牢的地基都搖動了，監門立刻全開，眾囚犯的鎖鍊也都鬆開了。', cuv: 'verified',
    game: '保羅西拉・腓立比監牢', enter: 'https://hfpc-paul-game.netlify.app/?journey=paul2',
  },
  {
    id: 'sam1-17-47', book: '撒母耳記上', ref: '撒母耳記上 17:47', status: 'live',
    theme: '爭戰的勝敗全在乎耶和華,不在乎刀槍。',
    text: '爭戰的勝敗全在乎耶和華。', cuv: 'verified',
    game: '大衛甩石', enter: 'https://hfpc-paul-game.netlify.app/?demo=sling',
  },
  {
    id: 'kings2-13-17', book: '列王紀下', ref: '列王紀下 13:17', status: 'live',
    theme: '這是耶和華的得勝箭;憑信一箭一箭射到底,別太早停。',
    text: '這是耶和華的得勝箭，就是戰勝亞蘭人的箭', cuv: 'verified',
    game: '約阿施射得勝箭', enter: 'https://hfpc-paul-game.netlify.app/?demo=joash',
  },
  {
    id: 'isa-40-31', book: '以賽亞書', ref: '以賽亞書 40:31', status: 'live',
    theme: '等候耶和華的必重新得力;灰心時神先扶持你。',
    text: '但那等候耶和華的必從新得力。他們必如鷹展翅上騰；他們奔跑卻不困倦，行走卻不疲乏。', cuv: 'verified',
    game: '以利亞・盼望', enter: 'https://hfpc-paul-game.netlify.app/?demo=elijah-action',
  },
  {
    id: 'gen-6-22', book: '創世記', ref: '創世記 6:22', status: 'live',
    theme: '挪亞的功課不是力氣,是「凡神所吩咐的都照樣去行」的順服。',
    text: '挪亞就這樣行。凡神所吩咐的，他都照樣行了。', cuv: 'verified',
    game: '挪亞蓋方舟', enter: 'https://hfpc-paul-game.netlify.app/?demo=ark-build',
  },
  {
    id: 'chr2-20-15', book: '歷代志下', ref: '歷代志下 20:15', status: 'live',
    theme: '不要因這大軍恐懼驚惶,因為勝敗不在乎你們,乃在乎神。',
    text: '不要因這大軍恐懼驚惶；因為勝敗不在乎你們，乃在乎神。', cuv: 'verified',
    game: '約沙法唱詩得勝', enter: 'https://hfpc-paul-game.netlify.app/?demo=jehoshaphat',
  },
  {
    id: 'exo-14-redsea', book: '出埃及記', ref: '出埃及記 14:13', status: 'live',
    theme: '不要懼怕,只管站住,看耶和華為你們施行的救恩。',
    text: '不要懼怕，只管站住！看耶和華今天向你們所要施行的救恩。', cuv: 'verified',
    game: '紅海奔逃', enter: 'https://hfpc-paul-game.netlify.app/?demo=redsea',
  },
  {
    id: 'num-22-balaam', book: '民數記', ref: '民數記 22:28', status: 'live',
    theme: '神能藉一頭驢說話,攔阻先知的悖逆;沒有神攔不住的路。',
    text: '耶和華叫驢開口，對巴蘭說：我向你行了甚麼，你竟打我這三次呢？', cuv: 'verified',
    game: '巴蘭的驢', enter: 'https://hfpc-paul-game.netlify.app/?demo=balaam',
  },
  {
    id: 'acts-10-cornelius', book: '使徒行傳', ref: '使徒行傳 10:34-35', status: 'live',
    theme: '神不偏待人;敬畏祂、行義的,都蒙悅納。',
    text: '我真看出神是不偏待人。原來，各國中那敬畏主、行義的人都為主所悅納。', cuv: 'verified',
    game: '哥尼流', enter: 'https://hfpc-paul-game.netlify.app/?demo=cornelius',
  },
  {
    id: 'acts-9-saul', book: '使徒行傳', ref: '使徒行傳 9:4', status: 'live',
    theme: '主的光照亮逼迫者,生命可以一夕翻轉。',
    text: '掃羅！掃羅！你為甚麼逼迫我？', cuv: 'verified',
    game: '掃羅歸主', enter: 'https://hfpc-paul-game.netlify.app/?demo=saul',
  },
  {
    id: 'dan-2-44', book: '但以理書', ref: '但以理書 2:44', status: 'live',
    theme: '天上的神必另立一國,永不敗壞;祂掌管萬國。',
    text: '天上的神必另立一國，永不敗壞，也不歸別國的人，卻要打碎滅絕那一切國，這國必存到永遠。', cuv: 'verified',
    game: '但以理(金像/牆上字/神掌權)', enter: 'https://hfpc-paul-game.netlify.app/',
  },
  {
    id: 'mat-14-31', book: '馬太福音', ref: '馬太福音 14:31', status: 'live',
    theme: '定睛看耶穌;疑惑下沉時,主的手仍拉住你。',
    text: '耶穌趕緊伸手拉住他，說：你這小信的人哪，為甚麼疑惑呢？', cuv: 'verified',
    game: '彼得走海', enter: 'https://hfpc-peter-sea-game.netlify.app/',
  },
  {
    id: 'acts-12-peter', book: '使徒行傳', ref: '使徒行傳 12:7', status: 'live',
    theme: '教會同心禱告,神差天使開了監門救彼得。',
    text: '忽然，有主的一個使者站在旁邊，屋裡有光照耀，天使拍彼得的肋旁，拍醒了他，說：快快起來！那鐵鍊就從他手上脫落下來。', cuv: 'verified',
    game: '彼得越獄', enter: 'https://hfpc-peter-prison-game.netlify.app/',
  },
  {
    id: 'psa-150-6', book: '詩篇', ref: '詩篇 150:6', status: 'live',
    theme: '凡有氣息的,都要讚美耶和華。',
    text: '凡有氣息的都要讚美耶和華！你們要讚美耶和華！', cuv: 'verified',
    game: '詩篇150 節奏關', enter: 'https://hfpc-psalm150-game.netlify.app/',
  },
  {
    id: 'judg-samson', book: '士師記', ref: '士師記 16:28', status: 'live',
    theme: '力量的源頭是神;人的剛強若離了神就歸於無有。',
    text: '主耶和華啊，求你眷念我。神啊，求你賜我這一次的力量', cuv: 'verified',
    game: '參孫打獅子', enter: 'https://hfpc-samson-game.netlify.app/',
  },

  // ───── 設計中 / 尚未做關(soon;經文已核對、可複習朗讀,關卡待做)──────────
  {
    id: 'ruth-1-16', book: '路得記', ref: '路得記 1:16', status: 'soon',
    theme: '你的國就是我的國,你的神就是我的神——忠誠與歸屬。',
    text: '你往哪裡去，我也往那裡去；你在哪裡住宿，我也在那裡住宿；你的國就是我的國，你的神就是我的神。', cuv: 'verified',
    game: '(設計中)',
  },
  {
    id: 'est-4-14', book: '以斯帖記', ref: '以斯帖記 4:14', status: 'soon',
    theme: '焉知你得了王后的位分,不是為現今的機會嗎?——神的安排與勇氣。',
    text: '焉知你得了王后的位分不是為現今的機會嗎？', cuv: 'verified',
    game: '(設計中)',
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
