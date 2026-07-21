// 🎮 依玩法瀏覽(#/bytype)——把全系列關卡按「玩法類型」重新分組的索引內頁。
// 資料來源:data.js 的 JOURNEYS 直達卡 + COLLECTIONS 各合輯 items,凡標了 kind 欄位的都收;
// 同一關出現在多個合輯(播放清單模式)以 url 去重,只列一次。
// 大廳鐵則不變:只帶路、不放遊戲——每一條都是深連結。新關上卡時在 data.js 順手標 kind 即可入列。
import { JOURNEYS, COLLECTIONS } from './data.js'

// —— 42 種玩法:依家族分組(順序=展示順序)。export 給 smoke-test 驗「kind 值必在此表」。 ——
export const GROUPS = [
  {
    name: '🏃 動作與冒險',
    kinds: [
      ['parkour', '跑酷障礙', '往前跑、跳過障礙(約拿六關含平衡穩船/黑暗探索)'],
      ['dodge', '閃避不還手', '仇敵攻擊只管躲——得勝靠神的保守'],
      ['drift', '漂流閃避', '縱向捲軸,左右閃開障礙(只躲不打)'],
      ['aim', '拋射瞄準', '抓角度與力道,瞄準投出'],
      ['shout', '蓄力吶喊', '蓄力吹角呼喊——牆是神使它塌陷'],
      ['boss', '勇者對決', '面對巨獸——力量出於耶和華的靈'],
      ['stealth', '潛行', '避開守衛,靜悄悄走到目的地'],
      ['endure', '撐住型', '撐住不放——體會經文處境'],
      ['reliance', '倚靠值(反向 RPG)', '不還手,倚靠值滿了神出手'],
      ['collect', '收集恢復', '邊走邊撿補給,恢復體力'],
      ['maze', '迷宮尋路', '循聲音找到,再帶回家'],
      ['escort', '護送', '沒有武器,唯一的動作是禱告'],
      ['defense', '塔防佈崗', '佈置守望者,角聲一響仇敵退去'],
      ['guard', '守護反應', '威脅冒出來,及時做出正確回應(趕/擒/滅)'],
      ['breakout', '打磚塊', '彈起石球,拆掉神吩咐拆的假壇'],
      ['resist', '忍住誘惑', '往前跑,那顆「回頭」的按鈕千萬別按'],
      ['pool', '撞球物理', '像撞球一樣瞄準發射,把散開的領回一處'],
      ['ride', '騎乘關', '控節奏+綠區時機,馱著故事一路前進'],
      ['sports', '運動練習', '瞄準射門・抓時機・玩得開心(休閒)'],
      ['shmup', '飛行射擊', '駕機升空、擊落敵機(無經文休閒・大孩子向)'],
    ],
  },
  {
    name: '🎵 節奏與音樂',
    kinds: [
      ['rhythm-fnf', '節拍打擊', '音符升到判定線,踩準節拍'],
      ['rhythm-4k', '下落琴鍵', '四欄琴鍵落下,按對=加入讚美'],
      ['rhythm-guitar', '透視琴弦', '琴弦由遠而近,彈準它'],
      ['rhythm-taiko', '太鼓連打', '紅拍鼓、藍搖鈴,還有連打段'],
      ['rhythm', '節奏模仿', '招式圖示滑進圈,按對鍵出招'],
      ['freeplay', '自由演奏', '沒有錯的音,想彈哪根弦就彈(幼兒)'],
    ],
  },
  {
    name: '🃏 卡片・桌遊・解謎',
    kinds: [
      ['rollmove', '大富翁桌遊', '擲骰走真實地理棋盤,問答賺點數'],
      ['cards', '卡片故事', '讀經、抉擇、排序、五幕反思'],
      ['storyanswer', '敘事點答', '走進故事,回答那句最要緊的話'],
      ['pairs', '翻牌配對', '翻牌記憶,一公一母配成對'],
      ['buildtiming', '時機建造', '抓準時機,一步一步蓋起來'],
      ['memoryseq', '記憶序列', '注意看、注意聽,照順序點回來'],
      ['sliding', '滑塊拼圖', '把打散的圖一塊一塊拼回'],
      ['management', '經營管理', '滑桿調度:現在享用 vs 存起來備荒'],
      ['dressup', '換裝裝備', '把裝備拖到正確部位穿上'],
      ['stack', '落石砌合', '鑿好的石塊落下,湊滿一排砌進牆(非爆炸)'],
      ['seek', '找物尋寶', '提著燈細細地找,直到找著'],
      ['match', '彈珠配對', '同類聚在一起,一起進方舟(非爆破)'],
      ['swap3', '交換配對', '點兩塊相鄰的交換,3 個同款=收進罐裡(非爆裂)'],
      ['tsum', '連鏈分享', '圓滾滾堆疊,劃線連同款分給眾人(非消除)'],
      ['fit', '歸位配對', '把每一塊放回它該在的位置(放錯溫柔搖頭)'],
    ],
  },
  {
    name: '📖 複習與課堂',
    kinds: [
      ['versepuzzle', '拼金句', '把打亂的金句拼回正確順序'],
      ['versequiz', '金句小測', '看教導重點,猜出自哪處經文'],
      ['buzzer', '搶答賽', '投影分組搶答,先按先得'],
      ['bingo', '賓果(不插電)', '列印賓果卡,唸提示、蓋章、連線'],
    ],
  },
]

// #/verses 內頁自帶的兩個玩法(拼金句/金句小測分頁)——沒有獨立卡片,固定收錄。
const VERSE_TOOLS = {
  versepuzzle: [{ name: '🧩 拼金句(金句複習頁)', subtitle: '大廳內頁・全系列金句拼句', href: '#/verses', emoji: '🧩', color: '#7a5cc4' }],
  versequiz: [{ name: '✍️ 金句小測(金句複習頁)', subtitle: '大廳內頁・猜出自哪處經文', href: '#/verses', emoji: '✍️', color: '#7a5cc4' }],
}

function collectByKind() {
  const byKind = {}
  const seen = new Set()
  const push = (e) => {
    if (!e.kind || !e.url || e.soon) return
    if (seen.has(e.url)) return // 同一關在多個合輯只列一次
    seen.add(e.url)
    ;(byKind[e.kind] ??= []).push(e)
  }
  for (const j of JOURNEYS) push(j)
  for (const col of Object.values(COLLECTIONS)) for (const it of col.items || []) push(it)
  return byKind
}

export function renderByType(app) {
  const byKind = collectByKind()
  app.innerHTML = ''
  const section = document.createElement('section')
  section.className = 'cat'
  section.style.setProperty('--accent', '#4a6ab0')
  section.innerHTML = `
    <a class="backlink" href="#/" aria-label="返回大廳">← 返回大廳</a>
    <div class="cat__head subhub__head">
      <h2 class="cat__name">🎮 依玩法瀏覽</h2>
      <p class="cat__desc">全系列關卡按 41 種玩法分組——想玩哪一種,從這裡挑。(同一關若在多個合輯,只列一次)</p>
    </div>`
  app.appendChild(section)

  let total = 0
  for (const g of GROUPS) {
    const groupSec = document.createElement('section')
    groupSec.className = 'cat'
    groupSec.innerHTML = `<div class="cat__head"><h2 class="cat__name">${g.name}</h2></div>`
    let any = false
    for (const [key, name, blurb] of g.kinds) {
      const entries = [
        ...(byKind[key] || []),
        ...((VERSE_TOOLS[key] || [])),
      ]
      if (!entries.length) continue
      any = true
      total += entries.length
      const head = document.createElement('div')
      head.className = 'cat__head'
      head.innerHTML = `<h3 class="cat__name" style="font-size:1.05em">${name}<span style="opacity:.55;font-size:.8em"> ・ ${entries.length} 關</span></h3><p class="cat__desc">${blurb}</p>`
      groupSec.appendChild(head)
      const grid = document.createElement('div')
      grid.className = 'grid'
      for (const e of entries) {
        const a = document.createElement('a')
        a.className = 'card'
        a.style.setProperty('--accent', e.color || '#3b6ea5')
        a.href = e.href || e.url
        a.setAttribute('aria-label', `進入 ${e.name}`)
        a.innerHTML = `
          <div class="card__emoji" aria-hidden="true">${e.emoji || '✦'}</div>
          <div class="card__text">
            <div class="card__name">${e.name}</div>
            <div class="card__sub">${e.subtitle || ''}</div>
            ${e.credit ? `<div class="card__credit">${e.credit}</div>` : ''}
          </div>
          <div class="card__cta">${e.href ? '開啟 →' : '進入 →'}</div>`
        grid.appendChild(a)
      }
      groupSec.appendChild(grid)
    }
    if (any) app.appendChild(groupSec)
  }
}
