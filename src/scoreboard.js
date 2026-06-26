// 🏆 分組計分板(兒童營用)。老師操作:哪一組表現好就加分。
//
// 設計現實:營會單機 + 投影 + 離線 + 各遊戲是別的網域(無後端、不能自動回傳分數),
//   所以這是「老師手動計分板」——台上哪一組玩得好,老師就按加分。
//   分數存在這台電腦的 localStorage,重開、離線都記得;換一天用「分數歸零」重來。
//
// 2026-06-26 加(lesson-mode + team-picker 精神):
//   ① 快速分組:一鍵設 2–6 隊(預設隊名/顏色);🎲 從名單隨機分組(貼名字 → 洗牌 → 平均分隊)。
//   ② 輪流 PK:「👉 現在輪到 X 隊」指示 + 「下一組 →」輪替(照隊伍順序,公平輪流)。
//   ③ 投影大字:領先金框、輪到的隊高亮。
//
// 純讀寫 localStorage + 畫 DOM,零相依、可離線。入口:大廳 #/scoreboard(見 main.js)。

const KEY = 'hfpc-scoreboard-v1'
const PALETTE = [
  '#d64545', '#3b82c4', '#e0a92b', '#3a9d6b',
  '#8a5cc4', '#d97a2b', '#2aa9a0', '#d36a9a',
]
const PRESET_NAMES = ['紅隊', '藍隊', '黃隊', '綠隊', '紫隊', '橘隊', '青隊', '粉隊']
const MEDALS = ['🥇', '🥈', '🥉']

const defaultState = () => ({
  teams: makeTeams(4),
  turnIdx: 0, // 輪到哪一隊(照 teams 順序,不照分數)
})
function makeTeams(n) {
  const out = []
  for (let i = 0; i < n; i++)
    out.push({ id: uid(), name: PRESET_NAMES[i] || `第 ${i + 1} 組`, color: PALETTE[i % PALETTE.length], score: 0, members: [] })
  return out
}

let state = null

function uid() {
  return 't' + Math.random().toString(36).slice(2, 8)
}
function load() {
  try {
    const s = JSON.parse(localStorage.getItem(KEY))
    if (s && Array.isArray(s.teams)) {
      // 防呆:補齊缺欄位、分數轉成非負整數、members 一定是陣列。
      s.teams = s.teams.map((t, i) => ({
        id: t.id || uid(),
        name: typeof t.name === 'string' ? t.name : `第 ${i + 1} 組`,
        color: t.color || PALETTE[i % PALETTE.length],
        score: Math.max(0, Math.floor(Number(t.score) || 0)),
        members: Array.isArray(t.members) ? t.members.filter((m) => typeof m === 'string') : [],
      }))
      s.turnIdx = Math.min(Math.max(0, Math.floor(Number(s.turnIdx) || 0)), Math.max(0, s.teams.length - 1))
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

  // —— 快速分組(team-picker) ——
  const setup = el('div', 'sb__setup')
  setup.appendChild(el('span', 'sb__setuplab', '快速分組:'))
  for (const n of [2, 3, 4, 5, 6]) {
    setup.appendChild(
      scoreBtn(`${n} 隊`, 'sb__quick' + (state.teams.length === n ? ' sb__quick--on' : ''), () => setTeamCount(app, n)),
    )
  }
  setup.appendChild(scoreBtn('🎲 從名單隨機分組', 'sb__quick sb__quick--rng', () => randomGroup(app)))
  section.appendChild(setup)

  // —— 輪到哪一隊 ——
  if (state.teams.length > 0) {
    const cur = state.teams[Math.min(state.turnIdx, state.teams.length - 1)]
    const turn = el('div', 'sb__turn')
    turn.style.setProperty('--team', cur.color)
    turn.innerHTML = `<span class="sb__turnlab">👉 現在輪到</span> <b class="sb__turnname">${cur.name}</b>`
    turn.appendChild(scoreBtn('下一組 →', 'sb__turnnext', () => nextTurn(app)))
    section.appendChild(turn)
  }

  const list = el('div', 'sb__list')
  // 顯示照分數排名,但「輪到」是照原隊伍順序(用 id 對應)
  const curId = state.teams.length ? state.teams[Math.min(state.turnIdx, state.teams.length - 1)].id : null
  const sorted = [...state.teams].sort((a, b) => b.score - a.score)
  const max = sorted.length ? sorted[0].score : 0

  if (sorted.length === 0) {
    list.appendChild(el('p', 'sb__empty', '還沒有組別,按上面「快速分組」或下面「➕ 新增一組」開始。'))
  }

  sorted.forEach((t, idx) => {
    const isLead = t.score > 0 && t.score === max
    const isTurn = t.id === curId
    const tile = el('div', 'sb__team' + (isLead ? ' sb__team--lead' : '') + (isTurn ? ' sb__team--turn' : ''))
    tile.style.setProperty('--team', t.color)

    // 名次(同分都給同一面獎牌;0 分不給)
    const rank = el('div', 'sb__rank')
    rank.textContent = t.score > 0 && idx < 3 ? MEDALS[idx] : ''
    tile.appendChild(rank)

    // 隊名 + 成員(可直接改隊名)
    const nameWrap = el('div', 'sb__namewrap')
    const name = el('input', 'sb__name')
    name.type = 'text'
    name.value = t.name
    name.setAttribute('aria-label', '隊名')
    name.addEventListener('change', () => {
      t.name = name.value.trim() || t.name
      persist()
      draw(app) // 更新「輪到」顯示的名字
    })
    nameWrap.appendChild(name)
    if (t.members && t.members.length) {
      nameWrap.appendChild(el('div', 'sb__members', t.members.join('、')))
    }
    tile.appendChild(nameWrap)

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

// —— 快速分組:設 N 隊(保留現有隊伍的分數/隊名;多退少補) ——
function setTeamCount(app, n) {
  const cur = state.teams
  const next = []
  for (let i = 0; i < n; i++) {
    if (cur[i]) next.push(cur[i])
    else next.push({ id: uid(), name: PRESET_NAMES[i] || `第 ${i + 1} 組`, color: PALETTE[i % PALETTE.length], score: 0, members: [] })
  }
  state.teams = next
  state.turnIdx = Math.min(state.turnIdx, n - 1)
  persist()
  draw(app)
}

// —— 🎲 從名單隨機分組:貼名字 → 洗牌 → 平均分進現有隊數 ——
function randomGroup(app) {
  const raw = window.prompt('把所有小朋友的名字貼進來(用逗號、空格或換行分隔):', '')
  if (raw == null) return
  const names = raw.split(/[\s,、，\n]+/).map((s) => s.trim()).filter(Boolean)
  if (names.length === 0) return
  // 洗牌(Fisher–Yates)
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[names[i], names[j]] = [names[j], names[i]]
  }
  // 沒有隊伍就先依人數開 2–4 隊;清空各隊成員,round-robin 平均分配
  if (state.teams.length === 0) state.teams = makeTeams(Math.min(4, Math.max(2, names.length)))
  for (const t of state.teams) t.members = []
  names.forEach((nm, i) => state.teams[i % state.teams.length].members.push(nm))
  persist()
  draw(app)
}

// —— 輪到下一組(照隊伍順序公平輪流) ——
function nextTurn(app) {
  if (state.teams.length === 0) return
  state.turnIdx = (state.turnIdx + 1) % state.teams.length
  persist()
  draw(app)
}

function addTeam(app) {
  const n = state.teams.length
  state.teams.push({
    id: uid(),
    name: PRESET_NAMES[n] || `第 ${n + 1} 組`,
    color: PALETTE[n % PALETTE.length],
    score: 0,
    members: [],
  })
  persist()
  draw(app)
}

function removeTeam(app, team) {
  if (!window.confirm(`移除「${team.name}」這一組?`)) return
  state.teams = state.teams.filter((t) => t.id !== team.id)
  if (state.turnIdx >= state.teams.length) state.turnIdx = 0
  persist()
  draw(app)
}

function resetScores(app) {
  if (!window.confirm('把所有組別分數歸零?(組別與名稱會保留)')) return
  for (const t of state.teams) t.score = 0
  state.turnIdx = 0
  persist()
  draw(app)
}
