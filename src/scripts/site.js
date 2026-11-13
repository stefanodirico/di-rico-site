// Progressive enhancement only. Every link and page works without this file.
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- cookie consent ---------- */
const KEY = 'sdr-consent';
const readConsent = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch { return null; } };
const writeConsent = (c) => { try { localStorage.setItem(KEY, JSON.stringify({ v: 1, ...c, t: new Date().toISOString().slice(0, 10) })); } catch {} };
const banner = $('[data-consent]');
const body = document.body;

function loadAnalytics(c) {
  const p = body.dataset.analytics, id = body.dataset.analyticsId;
  if (!p || !id || window.__an) return;
  if (p === 'goatcounter') {
    // Cookieless, so it does not need consent.
    window.__an = 1;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://gc.zgo.at/count.js'; s.dataset.goatcounter = `https://${id}.goatcounter.com/count`;
    document.head.append(s);
  } else if (p === 'ga4' && c && c.analytics) {
    window.__an = 1;
    const s = document.createElement('script');
    s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', id, { anonymize_ip: true });
  }
}
function loadEmbeds(c) {
  $$('[data-embed]').forEach((box) => {
    if (!(c && c.media) || box.dataset.loaded) return;
    box.dataset.loaded = '1';
    const f = document.createElement('iframe');
    f.src = box.dataset.src; f.title = box.dataset.title || 'Embedded player'; f.loading = 'lazy';
    f.height = box.dataset.height || '232';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    $$('.ph', box).forEach((n) => n.remove());
    box.prepend(f);
  });
}
function apply(c) { loadAnalytics(c); loadEmbeds(c); }
function openBanner(choose) {
  if (!banner) return;
  const c = readConsent() || {};
  $$('[data-consent-box]', banner).forEach((b) => { b.checked = !!c[b.dataset.consentBox]; });
  banner.hidden = false;
  if (choose) showChoices();
}
function showChoices() {
  $('[data-consent-choices]', banner).hidden = false;
  $('[data-consent-save]', banner).hidden = false;
  $('[data-consent-more]', banner).hidden = true;
}
function save(c) { writeConsent(c); if (banner) banner.hidden = true; apply(c); if (!c.media && $('[data-embed][data-loaded]')) location.reload(); }
if (banner) {
  $$('[data-consent-set]', banner).forEach((b) => b.addEventListener('click', () => {
    const all = b.dataset.consentSet === 'all';
    save({ media: all, analytics: all });
  }));
  $('[data-consent-more]', banner).addEventListener('click', showChoices);
  $('[data-consent-save]', banner).addEventListener('click', () => {
    const c = { media: false, analytics: false };
    $$('[data-consent-box]', banner).forEach((b) => { c[b.dataset.consentBox] = b.checked; });
    save(c);
  });
  $$('[data-consent-open]').forEach((b) => b.addEventListener('click', () => openBanner(true)));
  const c = readConsent();
  // Only ask when there is something to ask about: an embed on this page, or analytics that needs consent.
  const needs = $('[data-embed]') || body.dataset.analytics === 'ga4';
  if (!c && needs) openBanner(false);
  apply(c);
}
// "Load player" buttons inside an embed placeholder give consent for embedded media in one step.
$$('[data-embed-allow]').forEach((b) => b.addEventListener('click', () => {
  const c = readConsent() || { analytics: false };
  save({ ...c, media: true });
}));

/* ---------- copy buttons ---------- */
$$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
  const src = b.dataset.copy.startsWith('#') ? $(b.dataset.copy).innerText : b.dataset.copy;
  const old = b.textContent;
  try { await navigator.clipboard.writeText(src.trim()); b.textContent = 'Copied'; }
  catch { b.textContent = 'Press Ctrl+C to copy'; }
  setTimeout(() => { b.textContent = old; }, 1800);
}));

/* ---------- lanyard pass ---------- */
const pass = $('#pass');
if (pass) {
  const sw = $('.swing', pass);
  let n = 0;
  sw && sw.addEventListener('click', () => {
    n += 1;
    pass.style.setProperty('--tilt', (n % 2 ? 7 : -4) + 'deg');
  });
}

/* ---------- recorder ---------- */
const deck = $('[data-recorder]');
if (deck) {
  const audio = $('audio', deck);
  const tapes = $$('[data-tape]');
  const eps = tapes.map((t) => ({ el: t, ...t.dataset }));
  const bars = $$('.bars span', deck);
  const fmt = (s) => { s = Math.max(0, Math.floor(s || 0)); const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(s % 60).padStart(2, '0'); };
  let i = 0;
  const show = () => {
    const e = eps[i]; if (!e) return;
    $('[data-r-no]', deck).textContent = 'EP ' + String(e.no).padStart(2, '0');
    $('[data-r-guest]', deck).textContent = e.guest;
    $('[data-r-line]', deck).textContent = e.headline;
    $('[data-r-label]', deck).textContent = i === 0 ? 'Latest episode' : 'From the shelf';
    const art = $('[data-r-art]', deck);
    if (art && !art.src.endsWith(e.art)) { art.classList.add('swap'); art.src = e.art; art.alt = 'Episode cover: ' + e.guest; art.onload = () => art.classList.remove('swap'); }
    $('[data-r-total]', deck).textContent = fmt(Number(e.secs));
    $('[data-r-page]', deck).href = e.el.href;
    tapes.forEach((t, k) => t.classList.toggle('is-on', k === i));
  };
  const paint = () => {
    const e = eps[i]; const total = audio.duration || Number(e.secs) || 1;
    const p = audio.currentTime / total;
    bars.forEach((b, k) => b.classList.toggle('on', k / bars.length < p));
    $('[data-r-now]', deck).textContent = fmt(audio.currentTime);
  };
  const state = () => {
    const on = !audio.paused;
    $('[data-r-state]', deck).textContent = on ? 'PLAYING' : audio.currentTime > 0 ? 'PAUSED' : 'READY';
    const pb = $('[data-r-play]', deck);
    $('[data-r-play-label]', deck).textContent = on ? 'Pause' : 'Play';
    deck.classList.toggle('is-live', on);
    pb.setAttribute('aria-pressed', String(on));
    tapes.forEach((t, k) => t.classList.toggle('is-playing', on && k === i));
  };
  const load = (k, play) => {
    i = (k + eps.length) % eps.length;
    audio.src = eps[i].audio; show(); paint();
    if (!reduce) { deck.classList.remove('load'); void deck.offsetWidth; deck.classList.add('load'); }
    if (play) audio.play().catch(() => {}); else state();
  };
  $('[data-r-play]', deck).addEventListener('click', () => {
    if (!audio.getAttribute('src')) return load(i, true);
    audio.paused ? audio.play().catch(() => {}) : audio.pause();
  });
  $('[data-r-prev]', deck).addEventListener('click', () => load(i + 1, !audio.paused));
  $('[data-r-next]', deck).addEventListener('click', () => load(i - 1, !audio.paused));
  $('[data-r-back]', deck).addEventListener('click', () => { audio.currentTime = Math.max(0, audio.currentTime - 15); });
  $('[data-r-fwd]', deck).addEventListener('click', () => { audio.currentTime += 30; });
  ['play', 'pause', 'ended'].forEach((ev) => audio.addEventListener(ev, state));
  audio.addEventListener('timeupdate', paint);
  // A "put this tape in" button under each cassette; the cassette itself stays a link to the episode page.
  $$('[data-tape-play]').forEach((b, k) => b.addEventListener('click', () => { load(k, true); deck.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' }); }));
  show();
}

/* ---------- notebooks on the shelf ---------- */
const shelf = $('[data-shelf]');
if (shelf) {
  const books = $$('.book');
  const tabs = $$('.nb', shelf);
  const wide = matchMedia('(min-width: 861px)');
  const open = (id, animate, focus) => {
    books.forEach((b) => {
      const on = b.id === id;
      b.hidden = !on;
      if (!on) return;
      const cover = $('.cover', b);
      if (animate && cover && wide.matches && !reduce) {
        b.classList.add('is-shut'); cover.classList.add('shut');
        requestAnimationFrame(() => requestAnimationFrame(() => { cover.classList.remove('shut'); b.classList.remove('is-shut'); }));
      }
      if (focus) { const h = $('h2', b); h.tabIndex = -1; h.focus({ preventScroll: true }); b.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); }
    });
    tabs.forEach((t) => t.setAttribute('aria-current', String(t.hash === '#' + id)));
  };
  tabs.forEach((t) => t.addEventListener('click', (e) => { e.preventDefault(); history.replaceState(null, '', t.hash); open(t.hash.slice(1), true, true); }));
  const first = books.find((b) => '#' + b.id === location.hash) || books[0];
  open(first.id, false, false);
}

/* ---------- polaroids and the post-it ---------- */
const pols = $('[data-pols]');
if (pols) {
  const note = $('[data-postit]');
  const cards = $$('.pol', pols);
  const fill = (p) => {
    note.hidden = false;
    $('.w', note).textContent = p.dataset.when;
    $('.t', note).textContent = p.dataset.title;
    $('.s', note).textContent = p.dataset.summary;
    $('.o', note).textContent = p.dataset.outcome;
    $('a', note).href = p.href;
    cards.forEach((c) => c.setAttribute('aria-expanded', String(c === p)));
  };
  cards.forEach((p) => {
    p.setAttribute('aria-expanded', 'false');
    p.setAttribute('aria-controls', 'postit');
    p.addEventListener('click', (e) => {
      // First click shows the post-it; the post-it links to the full page. Modified clicks behave as normal links.
      if (e.metaKey || e.ctrlKey || e.shiftKey || p.getAttribute('aria-expanded') === 'true') return;
      e.preventDefault(); fill(p);
    });
  });
  // Phones: the polaroids sit in a pile. "Next" sends the top one to the back.
  const next = $('[data-pile-next]');
  const count = $('[data-pile-count]');
  let order = cards.slice();
  const stack = () => {
    order.forEach((c, k) => c.style.setProperty('--k', k));
    if (count) count.textContent = `${cards.indexOf(order[0]) + 1} of ${cards.length}`;
    if (matchMedia('(max-width: 860px)').matches) fill(order[0]);
  };
  next && next.addEventListener('click', () => {
    const top = order[0];
    const done = () => { top.classList.remove('fly'); order.push(order.shift()); stack(); };
    if (reduce) return done();
    top.classList.add('fly');
    top.addEventListener('animationend', done, { once: true });
  });
  stack();
}

/* ---------- ladder: rungs climb in when first seen ---------- */
const hl = $('.hl');
if (hl && 'IntersectionObserver' in window && !reduce) {
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { hl.classList.add('climb'); io.disconnect(); } }, { threshold: 0.3 });
  io.observe(hl);
}

/* ---------- experience ladder: ladder view or plain list ---------- */
const sw = $('[data-view-switch]');
if (sw) {
  const set = (v) => {
    document.documentElement.classList.toggle('view-plain', v === 'plain');
    $$('button', sw).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === v)));
  };
  $$('button', sw).forEach((b) => b.addEventListener('click', () => set(b.dataset.view)));
  $$('[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));
  set('ladder');
}

/* ---------- gentle reveal as you scroll (only for things below the first screen) ---------- */
if (!reduce && 'IntersectionObserver' in window) {
  const els = $$('.sec > *, .page-hero > *, .two > .main > *, .two > aside > *, .vrow, .cards > li, .topics > li, .tapes > li, .notes > .note, .shots > li, .gallery > *, main > .wrap > .sheet');
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  let n = 0;
  els.forEach((el) => {
    if (el.closest('.book') || el.getBoundingClientRect().top < innerHeight * 0.92) return;
    el.classList.add('rv'); el.style.setProperty('--rd', (n++ % 4) * 70 + 'ms'); io.observe(el);
  });
  // The lanyard swings once when the page arrives.
  pass && pass.classList.add('arrive');
}
