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

  // 分頁:複習 / 小測
  const tabs = el('div', 'vd__tabs')
  const body = el('div', 'vd__body')
  const tabReview = makeBtn('📖 複習', 'vd__tab vd__tab--on', () => switchTab('review'))
  const tabQuiz = makeBtn('✍️ 金句小測', 'vd__tab', () => switchTab('quiz'))
  tabs.append(tabReview, tabQuiz)
  function switchTab(which) {
    tabReview.classList.toggle('vd__tab--on', which === 'review')
    tabQuiz.classList.toggle('vd__tab--on', which === 'quiz')
    stopSpeak()
    body.innerHTML = ''
    body.appendChild(which === 'review' ? buildReview() : buildQuiz(app))
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
