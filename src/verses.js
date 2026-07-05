// 📖 金句複習・朗讀(+ 金句小測)。大廳入口 #/verses(見 main.js)。
//
// 三件事:
//   ① 今日金句(daily-verse):每天一句,可朗讀;首頁頂端也放一條(dailyStrip)。
//   ② 複習:全系列金句依書卷分組,有經文原文的可 🔊 朗讀;待核對的顯示「經文待 /cuv-check」。
//   ③ 金句小測:看「教導重點」猜「出自哪處經文」,答對就收進金句冊(verse-collection)。
//
// 零相依、可離線、投影可讀。經文文字一律只用 verseData.js 裡標 verified 的(不憑記憶唸)。
import { VERSES, versesByBook, verseOfDay, verseStats } from './verseData.js'

// —— 金句收集冊(verse-collection skill 的 VerseDex,跨「本站」遊戲共用同一本) ——
//    ⚠ localStorage 是各網域各一本:此處只記在大廳這個網域,是「複習鼓勵」不是「成績」。
const DEX_KEY = 'hfpc-versedex-v1'
const VerseDex = {
  load() { try { return JSON.parse(localStorage.getItem(DEX_KEY)) || {} } catch { return {} } },
  save(o) { try { localStorage.setItem(DEX_KEY, JSON.stringify(o)) } catch {} },
  collect(ref, text, game) {
    if (!ref) return false
    const d = this.load()
    if (d[ref]) return false
    d[ref] = { ref, text: text || '', game: game || '', at: Date.now() }
    this.save(d); return true
  },
  has(ref) { return !!this.load()[ref] },
  count() { return Object.keys(this.load()).length },
}

// —— 朗讀(web-speech-scripture 的精神:過關/複習都念,附經文出處) ——
function spokenRef(ref) {
  // 「約拿書 2:9」→「經文出自 約拿書 第 2 章 第 9 節」(粗略;唸得出來即可)
  const m = String(ref).match(/^(.+?)\s*(\d+):([\d–\-, ]+)/)
  if (!m) return `經文出自 ${ref}`
  return `經文出自 ${m[1]} 第 ${m[2]} 章 第 ${m[3].replace(/[–\-]/g, '到')} 節`
}
function speak(text, ref) {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(ref ? `${text}。${spokenRef(ref)}` : text)
    u.lang = 'zh-TW'; u.rate = 0.95; u.pitch = 1
    window.speechSynthesis.speak(u)
  } catch {}
}
function stopSpeak() { try { window.speechSynthesis?.cancel() } catch {} }

function el(tag, cls, text) {
  const n = document.createElement(tag)
  if (cls) n.className = cls
  if (text != null) n.textContent = text
  return n
}
// 朗讀鈕(有經文才可按;待核對則 disabled 並提示)
function speakBtn(v) {
  const b = el('button', 'vd__speak', v.text ? '🔊 朗讀' : '🔒 待核對')
  b.type = 'button'
  if (!v.text) { b.disabled = true; b.title = '經文待 /cuv-check 補上後才能朗讀' }
  else b.addEventListener('click', () => speak(v.text, v.ref))
  return b
}

// 今日金句:確定性挑當天那句(同一天全班同一句)
function todaysVerse() {
  const now = new Date()
  const dayNum = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000)
  return verseOfDay(dayNum)
}

// 首頁頂端的「今日金句」橫條(由 main.js renderHome 呼叫並 prepend)
export function dailyStrip() {
  const v = todaysVerse()
  const wrap = el('section', 'daily')
  if (!v) return wrap
  wrap.innerHTML = `
    <div class="daily__tag">📖 今日金句</div>
    <div class="daily__ref">${v.ref}</div>
    <div class="daily__text">${v.text ? `「${v.text}」` : v.theme}</div>`
  const row = el('div', 'daily__row')
  if (v.text) row.appendChild(makeBtn('🔊 朗讀', 'daily__btn', () => speak(v.text, v.ref)))
  row.appendChild(makeLink('全部金句複習 →', '#/verses', 'daily__btn daily__btn--ghost'))
  wrap.appendChild(row)
  return wrap
}
function makeBtn(label, cls, on) { const b = el('button', cls, label); b.type = 'button'; b.addEventListener('click', on); return b }
function makeLink(label, href, cls) { const a = el('a', cls, label); a.href = href; return a }

// —— 入口:把金句頁畫進 #app(main.js 路由呼叫) ——
export function renderVerses(app) {
  stopSpeak()
  app.innerHTML = ''
  const s = verseStats()
  const section = el('section', 'cat vd')
  section.innerHTML = `
    <a class="backlink" href="#/" aria-label="返回大廳">← 返回大廳</a>
    <div class="cat__head">
      <h2 class="cat__name">📖 金句複習・朗讀</h2>
      <p class="cat__desc">全系列 ${s.total} 句金句 ‧ 複習 + 小測 + 朗讀。已收集 <b id="dexcount">${VerseDex.count()}</b> 句。
      ${s.verified < s.total ? `<br><small>（${s.verified}/${s.total} 句經文已核對可朗讀;其餘待在有 cuv 的環境跑 /cuv-check 補上）</small>` : ''}</p>
    </div>`

  // 分頁:複習 / 小測 / 拼金句
  const tabs = el('div', 'vd__tabs')
  const body = el('div', 'vd__body')
  const tabReview = makeBtn('📖 複習', 'vd__tab vd__tab--on', () => switchTab('review'))
  const tabQuiz = makeBtn('✍️ 金句小測', 'vd__tab', () => switchTab('quiz'))
  const tabPuzzle = makeBtn('🧩 拼金句', 'vd__tab', () => switchTab('puzzle'))
  tabs.append(tabReview, tabQuiz, tabPuzzle)
  function switchTab(which) {
    tabReview.classList.toggle('vd__tab--on', which === 'review')
    tabQuiz.classList.toggle('vd__tab--on', which === 'quiz')
    tabPuzzle.classList.toggle('vd__tab--on', which === 'puzzle')
    stopSpeak()
    body.innerHTML = ''
    body.appendChild(which === 'review' ? buildReview() : which === 'quiz' ? buildQuiz(app) : buildPuzzle())
  }

  // 今日金句條
  section.appendChild(dailyStrip())
  section.appendChild(tabs)
  section.appendChild(body)
  body.appendChild(buildReview())
  app.appendChild(section)
}

// ② 複習:依書卷分組
function buildReview() {
  const frag = document.createDocumentFragment()
  for (const g of versesByBook()) {
    const grp = el('div', 'vd__group')
    grp.appendChild(el('h3', 'vd__book', g.book))
    const grid = el('div', 'vd__grid')
    for (const v of g.items) {
      const card = el('div', 'vd__card' + (v.status === 'soon' ? ' vd__card--soon' : ''))
      card.innerHTML = `
        <div class="vd__ref">${v.ref}${v.status === 'soon' ? ' <span class="vd__soon">敬請期待</span>' : ''}</div>
        <div class="vd__verse">${v.text ? `「${v.text}」` : `<span class="vd__pending">經文待核對</span>`}</div>
        <div class="vd__theme">${v.theme}</div>
        <div class="vd__from">出自:${v.game}</div>`
      const row = el('div', 'vd__row')
      row.appendChild(speakBtn(v))
      if (v.enter && v.status === 'live') row.appendChild(makeLink('去玩這關 →', v.enter, 'vd__go'))
      card.appendChild(row)
      grid.appendChild(card)
    }
    grp.appendChild(grid)
    frag.appendChild(grp)
  }
  return frag
}

// ④ 拼金句:把整節金句拆成「逐字連續」片段、打散,照原文順序點回來。
//    答錯溫柔搖一下再試(不會輸);連錯 3 次亮出下一片提示。拼好=朗讀+收進金句冊。
//    片段只做「切」不做「改」——拼回去必等於 verified 原文,不動任何一個字。
function segmentsOf(text) {
  const raw = String(text).match(/[^，。；：！？、…]+[，。；：！？、…]*/g) || []
  const out = []
  for (const s of raw) {
    if (s.length > 12) { const mid = Math.ceil(s.length / 2); out.push(s.slice(0, mid), s.slice(mid)) }
    else out.push(s)
  }
  return out
}
function buildPuzzle() {
  const wrap = el('div', 'vd__quiz')
  const status = el('div', 'vd__qstatus')
  const stage = el('div', 'vd__qstage')
  wrap.append(status, stage)
  let done = 0
  // 只用已核對、切得出 3 片以上的金句(太短的拼起來沒意思)
  const pool = VERSES.filter((v) => v.cuv === 'verified' && v.text && segmentsOf(v.text).length >= 3)

  function shuffle(a) {
    const r = a.slice()
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
    return r
  }
  function next() {
    stopSpeak()
    stage.innerHTML = ''
    if (!pool.length) { stage.appendChild(el('div', 'vd__qprompt', '（目前沒有可拼的金句）')); return }
    const v = pool[Math.floor(Math.random() * pool.length)]
    const segs = segmentsOf(v.text)
    let idx = 0, misses = 0
    status.innerHTML = `已拼好 ${done} 句 ‧ 已收集 <b>${VerseDex.count()}</b> 句`
    stage.appendChild(el('div', 'vd__qprompt', `把金句照原文順序拼回來 ‧ ${v.ref}`))
    // 教導重點常常「幾乎就是答案」,預設藏起來、按了才看(不破梗)
    const themeRow = el('div', 'vd__qtheme')
    const hintBtn = makeBtn('💡 提示', 'vd__chip', () => { themeRow.textContent = v.theme; hintBtn.remove() })
    themeRow.appendChild(hintBtn)
    stage.appendChild(themeRow)
    const built = el('div', 'vd__built', '＿')
    const chips = el('div', 'vd__chips')
    stage.append(built, chips)
    for (const c of shuffle(segs.map((s, i) => ({ s, i })))) {
      const b = makeBtn(c.s, 'vd__chip', () => {
        if (b.disabled) return
        if (c.s === segs[idx]) { // 比「內容」不比編號:重複片段任一顆都算對
          b.disabled = true
          b.classList.add('vd__chip--used')
          idx++
          misses = 0
          built.textContent = segs.slice(0, idx).join('')
          if (idx === segs.length) finish(v)
        } else {
          misses++
          b.classList.add('vd__chip--no')
          setTimeout(() => b.classList.remove('vd__chip--no'), 450)
          if (misses >= 3) { // 溫柔提示:亮一下正確的下一片
            const hint = [...chips.children].find((x) => !x.disabled && x.textContent === segs[idx])
            if (hint) { hint.classList.add('vd__chip--hint'); setTimeout(() => hint.classList.remove('vd__chip--hint'), 1200) }
            misses = 0
          }
        }
      })
      chips.appendChild(b)
    }
  }
  function finish(v) {
    done++
    const isNew = VerseDex.collect(v.ref, v.text, v.game)
    const fb = el('div', 'vd__qfb vd__qfb--ok')
    fb.innerHTML = `🎉 拼好了!${isNew ? '✨ 收進金句冊' : ''}<br><b>${v.ref}</b>「${v.text}」`
    stage.appendChild(fb)
    if (v.text) speak(v.text, v.ref)
    const c = document.getElementById('dexcount'); if (c) c.textContent = String(VerseDex.count())
    status.innerHTML = `已拼好 ${done} 句 ‧ 已收集 <b>${VerseDex.count()}</b> 句`
    stage.appendChild(makeBtn('下一句 →', 'vd__qnext', next))
  }
  next()
  return wrap
}

// ③ 金句小測:看「教導重點」猜「出自哪處經文」,答對就收集
function buildQuiz(app) {
  const wrap = el('div', 'vd__quiz')
  let correct = 0, asked = 0
  const status = el('div', 'vd__qstatus')
  const stage = el('div', 'vd__qstage')
  wrap.append(status, stage)

  function shuffle(a) { // 不依賴 Math.random 順序穩定度,簡單洗牌即可
    const r = a.slice()
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[r[i], r[j]] = [r[j], r[i]] }
    return r
  }
  function nextQ() {
    stopSpeak()
    stage.innerHTML = ''
    const pool = VERSES
    const v = pool[Math.floor(Math.random() * pool.length)]
    // 干擾項:其他 3 個不同 ref
    const others = shuffle(pool.filter((x) => x.ref !== v.ref)).slice(0, 3)
    const options = shuffle([v, ...others])
    asked++
    status.innerHTML = `第 ${asked} 題 ‧ 答對 ${correct} ‧ 已收集 <b>${VerseDex.count()}</b> 句`

    stage.appendChild(el('div', 'vd__qprompt', '這句教導,出自哪一處經文?'))
    stage.appendChild(el('div', 'vd__qtheme', `「${v.theme}」`))
    const opts = el('div', 'vd__qopts')
    for (const o of options) {
      const b = makeBtn(`${o.book} ${o.ref.replace(o.book, '').trim()}`, 'vd__qopt', () => choose(o, v, b))
      opts.appendChild(b)
    }
    stage.appendChild(opts)
  }
  function choose(picked, answer, btn) {
    const right = picked.ref === answer.ref
    stage.querySelectorAll('.vd__qopt').forEach((b) => { b.disabled = true })
    btn.classList.add(right ? 'vd__qopt--ok' : 'vd__qopt--no')
    const fb = el('div', 'vd__qfb')
    if (right) {
      correct++
      const isNew = VerseDex.collect(answer.ref, answer.text, answer.game)
      fb.innerHTML = `✓ 答對!${isNew ? '✨ 收進金句冊' : '(這句已在金句冊裡)'}<br>${answer.ref}${answer.text ? `「${answer.text}」` : ''}`
      fb.className = 'vd__qfb vd__qfb--ok'
      if (answer.text) speak(answer.text, answer.ref)
      const c = document.getElementById('dexcount'); if (c) c.textContent = String(VerseDex.count())
    } else {
      fb.innerHTML = `再想想 🙂 正解是 <b>${answer.ref}</b>。${answer.theme}`
      fb.className = 'vd__qfb vd__qfb--no'
    }
    stage.appendChild(fb)
    stage.appendChild(makeBtn('下一題 →', 'vd__qnext', nextQ))
  }
  nextQ()
  return wrap
}
