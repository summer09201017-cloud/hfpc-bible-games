// 🏆 分組計分板(兒童營用)。老師操作:哪一組表現好就加分。
//
// 設計現實:營會單機 + 投影 + 離線 + 各遊戲是別的網域(無後端、不能自動回傳分數),
//   所以這是「老師手動計分板」——台上哪一組玩得好,老師就按加分。
//   分數存在這台電腦的 localStorage,重開、離線都記得;換一天用「分數歸零」重來。
//
// 純讀寫 localStorage + 畫 DOM,零相依、可離線。入口:大廳 #/scoreboard(見 main.js)。

const KEY = 'hfpc-scoreboard-v1'
const PALETTE = [
  '#d64545', '#3b82c4', '#e0a92b', '#3a9d6b',
  '#8a5cc4', '#d97a2b', '#2aa9a0', '#d36a9a',
]
const MEDALS = ['🥇', '🥈', '🥉']

const defaultState = () => ({
  teams: [
    { id: uid(), name: '紅隊', color: PALETTE[0], score: 0 },
    { id: uid(), name: '藍隊', color: PALETTE[1], score: 0 },
    { id: uid(), name: '黃隊', color: PALETTE[2], score: 0 },
    { id: uid(), name: '綠隊', color: PALETTE[3], score: 0 },
  ],
})

let state = null

function uid() {
  return 't' + Math.random().toString(36).slice(2, 8)
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Array.isArray(s.teams)) {
      // 防呆:補齊缺欄位、分數轉成非負整數。
      s.teams = s.teams.map((t, i) => ({
        id: t.id || uid(),
        name: typeof t.name === 'string' ? t.name : `第 ${i + 1} 組`,
        color: t.color || PALETTE[i % PALETTE.length],
        score: Math.max(0, Math.floor(Number(t.score) || 0)),
      }))
      return s
    }
  } catch {}
  return defaultState()
}
function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

function el(tag, cls, text) {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}

// 入口:把計分板畫進 #app(由 main.js 的路由呼叫)。
export function renderScoreboard(app) {
  state = load()
  draw(app)
}

function draw(app) {
  app.innerHTML = ''
  const section = el('section', 'cat sb')

  const head = el('div')
  head.innerHTML = `
    <a class="backlink" href="#/">← 返回大廳</a>
    <div class="cat__head">
      <h2 class="cat__name">🏆 分組計分板</h2>
      <p class="cat__desc">老師操作:哪一組表現好就按加分。分數存在這台電腦,離線也記得;換一天按「分數歸零」重來。</p>
    </div>`
  section.appendChild(head)

  const list = el('div', 'sb__list')
  const sorted = [...state.teams].sort((a, b) => b.score - a.score)
  const max = sorted.length ? sorted[0].score : 0

  if (sorted.length === 0) {
    list.appendChild(el('p', 'sb__empty', '還沒有組別,按下面「➕ 新增一組」開始。'))
  }

  sorted.forEach((t, idx) => {
    const isLead = t.score > 0 && t.score === max
    const tile = el('div', 'sb__team' + (isLead ? ' sb__team--lead' : ''))
    tile.style.setProperty('--team', t.color)

    // 名次(同分都給同一面獎牌;0 分不給)
    const rank = el('div', 'sb__rank')
    rank.textContent = t.score > 0 && idx < 3 ? MEDALS[idx] : ''
    tile.appendChild(rank)

    // 隊名(可直接改)
    const name = el('input', 'sb__name')
    name.type = 'text'
    name.value = t.name
    name.setAttribute('aria-label', '隊名')
    name.addEventListener('change', () => {
      t.name = name.value.trim() || t.name
      persist()
    })
    tile.appendChild(name)

    const score = el('div', 'sb__score', String(t.score))
    tile.appendChild(score)

    const btns = el('div', 'sb__btns')
    btns.appendChild(scoreBtn('+1', 'sb__btn sb__btn--up', () => bump(app, t, 1)))
    btns.appendChild(scoreBtn('+5', 'sb__btn sb__btn--up5', () => bump(app, t, 5)))
    btns.appendChild(scoreBtn('−1', 'sb__btn sb__btn--down', () => bump(app, t, -1)))
    const rm = scoreBtn('✕', 'sb__btn sb__btn--rm', () => removeTeam(app, t))
    rm.setAttribute('aria-label', `移除 ${t.name}`)
    btns.appendChild(rm)
    tile.appendChild(btns)

    list.appendChild(tile)
  })
  section.appendChild(list)

  // 控制列
  const ctrl = el('div', 'sb__controls')
  ctrl.appendChild(scoreBtn('➕ 新增一組', 'sb__ctrl', () => addTeam(app)))
  ctrl.appendChild(scoreBtn('↺ 分數歸零', 'sb__ctrl sb__ctrl--reset', () => resetScores(app)))
  section.appendChild(ctrl)

  app.appendChild(section)
}

function scoreBtn(label, cls, onClick) {
  const b = el('button', cls, label)
  b.type = 'button'
  b.addEventListener('click', onClick)
  return b
}

function bump(app, team, delta) {
  team.score = Math.max(0, team.score + delta)
  persist()
  draw(app) // 重畫 = 重新排名,領先的那組會跳到最上面(現場氣氛 🔥)
}

function addTeam(app) {
  const n = state.teams.length
  state.teams.push({
    id: uid(),
    name: `第 ${n + 1} 組`,
    color: PALETTE[n % PALETTE.length],
    score: 0,
  })
  persist()
  draw(app)
}

function removeTeam(app, team) {
  if (!window.confirm(`移除「${team.name}」這一組?`)) return
  state.teams = state.teams.filter((t) => t.id !== team.id)
  persist()
  draw(app)
}

function resetScores(app) {
  if (!window.confirm('把所有組別分數歸零?(組別與名稱會保留)')) return
  for (const t of state.teams) t.score = 0
  persist()
  draw(app)
}
