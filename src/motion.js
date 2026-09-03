// 聖經遊戲大廳 — 動態（0903）：進場 / 標題逐字 / 餘火 / 一句話輪播 / 捲動浮現 / 拉幕跳轉
// 一定排在 main.js 之後載入（module 依序執行）：它要等 route() 把卡片畫好。
// 卡片是 main.js 每次路由（首頁 / 合輯 / 玩法 / 金句 / 計分板）整個重畫的 ⇒ 這裡用 MutationObserver 接，不碰 main.js。
import { JOURNEYS, COLLECTIONS } from './data.js';
import { GROUPS } from './bytype.js';

const CFG = {
  title: '.hero__title',
  hero: '.hero',
  rotator: '.hero__subtitle',
  entrance: ['.hero__subtitle', '.tagbar', '.hero__nav', '#install-slot', '#theme-slot'],
  revealRoot: '#app',
  reveal: '.daily, .cat__head, .card:not(.card--egg)',
  curtain: 'a.card',
};
// 輪播的句子：數字全部從 data.js / bytype.js 算，加關卡不用回來改字
const nCol = Object.keys(COLLECTIONS).length;
const nLv = Object.values(COLLECTIONS).reduce((n, c) => n + ((c && c.items) || []).length, 0);
const nKinds = (GROUPS || []).reduce((n, g) => n + ((g && g.kinds) || []).length, 0);
const sub0 = document.querySelector('.hero__subtitle');
const LINES = [
  sub0 ? sub0.textContent.trim() : '選一段旅程開始',
  JOURNEYS.length + ' 張卡片・' + nCol + ' 個合輯・共 ' + nLv + ' 關',
  '📖 每天一節金句，開頁就看得到',
  '🏆 分組計分板，投影上課直接用',
  '🎮 依玩法瀏覽，' + nKinds + ' 種玩法一次看',
  '📱 裝到主畫面，離線也能開',
];

/* ── 共用核心（信友火花 0902 那套的通用版；每個入口站各放一份，改一處要同步）──
   全部只在 <html class="js-motion"> 時跑（head 那一行加的：沒有 IntersectionObserver、
   或使用者選了「減少動態」就不加）⇒ 沒 JS、舊瀏覽器、減少動態，內容從頭到尾看得見。
   只動 transform / opacity；所有「起始看不見」的 CSS 都掛在 .js-motion 底下。 */
const MOTION = document.documentElement.classList.contains('js-motion');
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));

// 1) 標題逐字浮出（CSS 用 --k 算每個字的 delay；螢幕閱讀器仍讀整句：aria-label）
function splitTitle(sel) {
  const h = $(sel);
  if (!h || h.querySelector('span')) return;
  const t = h.textContent.trim();
  if (!t) return;
  h.setAttribute('aria-label', t);
  h.textContent = '';
  Array.from(t).forEach((c, i) => {
    const s = document.createElement('span');
    s.setAttribute('aria-hidden', 'true');
    s.style.setProperty('--k', i);
    s.textContent = c === ' ' ? ' ' : c;
    h.appendChild(s);
  });
  h.classList.add('split');
}

// 2) 餘火：hero 底部飄升的小火星（純 CSS 動；這裡只生 DOM 與每顆的參數）
function initSparks(heroSel, n) {
  const hero = $(heroSel);
  if (!hero || $('.sparks', hero)) return;
  const box = document.createElement('div');
  box.className = 'sparks';
  box.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    d.style.setProperty('--x', (4 + (i * 92) / Math.max(1, n - 1)).toFixed(1) + '%');
    d.style.setProperty('--s', (4 + ((i * 7) % 5)) + 'px');
    d.style.setProperty('--t', (8 + ((i * 1.7) % 5)).toFixed(1) + 's');
    d.style.setProperty('--d', '-' + ((i * 3.3) % 11).toFixed(1) + 's');
    d.style.setProperty('--dx', ((i % 2 ? -1 : 1) * (10 + ((i * 5) % 22))) + 'px');
    box.appendChild(d);
  }
  hero.appendChild(box);
}

// 3) 一句話輪播 + 進度線（頁面在背景就停，回來從當句重數）
function initRotator(textSel, lines, ms) {
  const el = $(textSel);
  if (!el || !lines || lines.length < 2) return;
  const bar = document.createElement('div');
  bar.className = 'tagbar';
  bar.setAttribute('aria-hidden', 'true');
  lines.forEach(() => bar.appendChild(document.createElement('i')));
  el.insertAdjacentElement('afterend', bar);
  el.classList.add('rot');
  const segs = $$('i', bar);
  let idx = 0, timer = 0;
  function arm(i) {
    segs.forEach((s, k) => { s.className = k < i ? 'done' : ''; });
    void segs[i].offsetWidth;            // 讓同一格能重新從 0 開始跑
    segs[i].className = 'on';
    clearTimeout(timer);
    timer = setTimeout(() => show((idx + 1) % lines.length), ms);
  }
  function show(i) {
    idx = i;
    el.classList.add('swap');
    setTimeout(() => { el.textContent = lines[i]; el.classList.remove('swap'); }, 320);
    arm(i);
  }
  arm(0);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { clearTimeout(timer); document.documentElement.classList.add('paused'); }
    else { document.documentElement.classList.remove('paused'); arm(idx); }
  });
}

// 4) 進場：hero 裡指定的段落照順序錯開（--e 第幾段；CSS 算 delay；標題另有逐字）
function initEntrance(sels) {
  let e = 0;
  sels.forEach((sel) => {
    const el = $(sel);
    if (el) el.style.setProperty('--e', e++);
  });
}

// 5) 捲動浮現：root 裡「任何時候」長出來的卡片/區塊都自動接上（路由換頁、篩選重畫都不用管）
//    ★ rootMargin 上緣放到極大：一口氣捲到底、回上一頁還原捲動位置時「捲過頭」的區塊也算看過，
//      否則它從「在下面」直接變「在上面」、中間沒交集過 ⇒ 永遠 opacity:0（信友火花 0902 實測抓到）。
function initReveal(rootSel, sels) {
  const root = $(rootSel);
  if (!root) return;
  let io;
  try {
    io = new IntersectionObserver((ents) => {
      ents.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '100000px 0px -6% 0px', threshold: 0.05 });
  } catch (_) { return; }
  let first = true, fuse = 0;
  function scan() {
    const fresh = $$(sels, root).filter((el) => !el.classList.contains('rv'));
    if (!fresh.length) return;
    const perParent = new Map();
    fresh.forEach((el) => {
      const p = el.parentElement;
      const n = perParent.get(p) || 0;
      perParent.set(p, n + 1);
      el.style.setProperty('--i', first ? n % 8 : n % 4);   // 首次進站錯開多一點；之後篩選重畫要快
      el.classList.add('rv');
      io.observe(el);
    });
    first = false;
    // 保險絲：3 秒後在視窗裡卻還沒亮 = 觀察器在這個瀏覽器不工作 ⇒ 直接亮，寧可沒動畫也不能沒內容
    clearTimeout(fuse);
    fuse = setTimeout(() => {
      $$('.rv:not(.in)', root).forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight + 100) el.classList.add('in');
      });
    }, 3000);
  }
  scan();
  let raf = 0;
  new MutationObserver(() => {
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; scan(); });
  }).observe(root, { childList: true, subtree: true });
}

// 6) 送出：卡片先亮、整頁拉幕 0.28 秒、再同分頁過去；#hash 路由與開新分頁的連結不管。
//    站內換頁若瀏覽器支援跨頁 View Transition（CSS 有 @view-transition）就交給它。
//    回上一頁（bfcache）一定把幕拉開，不然整頁是透明的。
function initCurtain(linkSel) {
  document.addEventListener('click', (e) => {
    const a = e.target && e.target.closest ? e.target.closest(linkSel) : null;
    if (!a || (a.target && a.target !== '_self')) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const href = a.getAttribute('href');
    if (!href || /^(#|javascript:)/i.test(href)) return;
    let same = false;
    try { same = new URL(href, location.href).origin === location.origin; } catch (_) { /* 當成外站 */ }
    if (same && document.startViewTransition) return;
    e.preventDefault();
    a.classList.remove('go'); void a.offsetWidth; a.classList.add('go');
    document.body.classList.add('leaving');
    setTimeout(() => { location.href = href; }, 280);
  });
  window.addEventListener('pageshow', () => {
    document.body.classList.remove('leaving');
    $$('.go').forEach((el) => el.classList.remove('go'));
  });
}

if (MOTION) {
  splitTitle(CFG.title);
  initSparks(CFG.hero, 10);
  initRotator(CFG.rotator, LINES, 6000);
  initEntrance(CFG.entrance);
  initReveal(CFG.revealRoot, CFG.reveal);
  initCurtain(CFG.curtain);
}
