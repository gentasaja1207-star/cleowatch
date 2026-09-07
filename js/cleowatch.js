/* cleowatch.js — shared utilities */

const CLEO_LOGO_SVG = `<svg class="nw-logo-svg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sg" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#E8E8F0"/>
      <stop offset="50%" stop-color="#C8C8D0"/>
      <stop offset="100%" stop-color="#8A8A98"/>
    </linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="1.2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <!-- Clock ring -->
  <circle cx="24" cy="24" r="22" stroke="url(#sg)" stroke-width="1.5" fill="none" opacity=".5"/>
  <!-- Tick marks -->
  <line x1="24" y1="3.5" x2="24" y2="7" stroke="url(#sg)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="24" y1="41" x2="24" y2="44.5" stroke="url(#sg)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="3.5" y1="24" x2="7" y2="24" stroke="url(#sg)" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="41" y1="24" x2="44.5" y2="24" stroke="url(#sg)" stroke-width="1.5" stroke-linecap="round"/>
  <!-- N letterform with clock hands -->
  <path d="M15 32V16L24 28V16" stroke="url(#sg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <path d="M24 28L33 16V32" stroke="url(#sg)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/>
  <!-- Center pin -->
  <circle cx="24" cy="24" r="2" fill="url(#sg)"/>
</svg>`;

function cleoLogoHTML() {
  return `<a class="nw-logo-wrap" href="/home">
    ${CLEO_LOGO_SVG}
    <span class="nw-logo-text">CLEO WATCH</span>
  </a>`;
}

function cleoNavbar() {
  return `
<nav class="navbar">
  <div class="nav-inner">
    ${cleoLogoHTML()}
    <div class="nav-search">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
      <input id="navSearchInput" type="text" placeholder="Cari film, series…" autocomplete="off"/>
    </div>
    <div style="flex:1"></div>
    <button class="hamburger" id="hamburger" aria-label="Menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
<div class="mob-menu" id="mobMenu">
  <div class="nav-search" style="max-width:100%">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input id="mobSearchInput" type="text" placeholder="Cari film, series…" autocomplete="off"/>
  </div>
  <a class="mob-nav-a" href="/home">Beranda</a>
  <div class="developer-card">
    <div class="cleo-ai-badge">✨ CLEO AI Developer</div>
    <p style="margin-top:10px;color:var(--text-m)">About Developer</p>
    <a href="https://whatsapp.com/channel/0029Vb93nxsHltYDfZozNZ2Q" target="_blank">Join Saluran WhatsApp (Info Update)</a>
  </div>
</div>`;
}

function cleoInitNav() {
  const hamburger = document.getElementById('hamburger');
  const mobMenu   = document.getElementById('mobMenu');
  if (hamburger && mobMenu) {
    hamburger.addEventListener('click', () => mobMenu.classList.toggle('open'));
  }
  function doSearch(q) {
    if (q.trim()) window.location.href = `/home?q=${encodeURIComponent(q.trim())}`;
  }
  ['navSearchInput','mobSearchInput'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(el.value); });
  });
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function cardHTML(item) {
  const badge = item.type === 'tv'
    ? `<span class="card-badge">SERIES</span>`
    : (item.year && item.year >= new Date().getFullYear() ? `<span class="card-badge new">BARU</span>` : '');
  const thumb = item.poster
    ? `<img src="${esc(item.poster)}" alt="${esc(item.title)}" loading="lazy" referrerpolicy="no-referrer"
        onerror="this.parentElement.innerHTML='<div class=card-no-img><svg width=28 height=28 viewBox=\\'0 0 24 24\\' fill=none stroke=\\'currentColor\\' stroke-width=1.5 opacity=.3><rect x=2 y=2 width=20 height=20 rx=3/></svg></div>'">`
    : `<div class="card-no-img"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".3"><rect x="2" y="2" width="20" height="20" rx="3"/></svg></div>`;

  const url = `/details?id=${item.id}&type=${item.type === 'tv' ? 'series' : 'movie'}`;
  return `<a class="card" href="${url}">
    <div class="card-thumb">
      ${thumb}
      ${badge}
      <div class="card-overlay">
        <div class="card-play">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21"/></svg>
          Tonton
        </div>
      </div>
    </div>
    <div class="card-info">
      <div class="card-title">${esc(item.title)}</div>
      <div class="card-meta">
        ${item.rating ? `<span class="card-rating">★ ${item.rating}</span><span>·</span>` : ''}
        <span>${esc(item.year || '')}</span>
      </div>
    </div>
  </a>`;
}

function skeletonCards(n = 6) {
  return Array.from({length: n}, () => `
    <div class="card">
      <div class="card-thumb skel" style="aspect-ratio:2/3"></div>
      <div class="card-info">
        <div class="skel" style="height:12px;width:85%;margin-bottom:6px"></div>
        <div class="skel" style="height:10px;width:50%"></div>
      </div>
    </div>`).join('');
}

function nwToast(msg, dur = 2600) {
  let wrap = document.querySelector('.toasts');
  if (!wrap) { wrap = document.createElement('div'); wrap.className = 'toasts'; document.body.appendChild(wrap); }
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg; wrap.appendChild(t);
  setTimeout(() => t.remove(), dur);
}

function nwFooter() {
  return `<footer class="footer">
    <div class="footer-logo">
      ${CLEO_LOGO_SVG}
      <span class="nw-logo-text">CLEO WATCH</span>
    </div>
    <p class="footer-note">CLEO WATCH tidak menyimpan konten. Semua konten disajikan dari pihak ketiga. Untuk hiburan saja.</p>
  </footer>`;
}
