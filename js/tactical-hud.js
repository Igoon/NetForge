/* NET FORGE v0.65.1 — Tactical Cyber HUD Controller
   (Slim Icon Dock + Instant Hover Tooltip + Live Traffic Sparkline + Tactical/Classic Theme Switcher) */
(function () {
  'use strict';
  if (window.__NF6500_TACTICAL_HUD) return;
  window.__NF6500_TACTICAL_HUD = true;

  const DOCK_KEY = 'netforge.slimDock.v1';
  const THEME_KEY = 'netforge.themeMode.v1';
  const API = () => window.NetForgeUniversalInventory || null;

  // 1. Theme Switcher (Tactical Dark OLED <-> Classic Blue for classroom projectors)
  function applyTheme(mode) {
    const isClassic = mode === 'classic';
    document.body.classList.toggle('nf65-theme-classic', isClassic);
    try { localStorage.setItem(THEME_KEY, isClassic ? 'classic' : 'tactical'); } catch (_) {}

    const btn = document.getElementById('nf65ThemeBtn');
    if (btn) {
      btn.textContent = isClassic ? '🌌 Dark' : '☀️ Klasik';
      btn.title = isClassic
        ? 'Beralih ke tema Tactical Dark OLED (#0B0F19)'
        : 'Beralih ke tema Classic Blue (lebih terang untuk proyektor kelas)';
    }
    const sBtn = document.getElementById('nf65SettingsThemeBtn');
    const sTxt = document.getElementById('nf65SettingsThemeTxt');
    if (sBtn) sBtn.textContent = isClassic ? '🌌 Pakai Tactical Dark' : '☀️ Pakai Classic Blue';
    if (sTxt) sTxt.textContent = isClassic ? 'Tema aktif: Classic Blue (Proyektor Terang)' : 'Tema aktif: Tactical Dark OLED (#0B0F19)';
  }

  function toggleTheme() {
    applyTheme(document.body.classList.contains('nf65-theme-classic') ? 'tactical' : 'classic');
  }

  function initTheme() {
    let saved = 'tactical';
    try { saved = localStorage.getItem(THEME_KEY) || 'tactical'; } catch (_) {}
    applyTheme(saved);
  }

  function injectSettingsThemeCard() {
    const body = document.querySelector('#nf30Overlay .nf30-body');
    if (!body || document.getElementById('nf65SettingsThemeCard')) return Boolean(document.getElementById('nf65SettingsThemeCard'));
    const card = document.createElement('div');
    card.id = 'nf65SettingsThemeCard';
    card.innerHTML = `<span id="nf65SettingsThemeTxt">Tema aktif: Tactical Dark OLED (#0B0F19)</span><button type="button" id="nf65SettingsThemeBtn">☀️ Pakai Classic Blue</button>`;
    body.appendChild(card);
    card.querySelector('#nf65SettingsThemeBtn').addEventListener('click', toggleTheme);
    initTheme();
    return true;
  }

  // 2. Collapsible Left Inventory Icon Dock + Instant Hover Tooltip
  function applyDockState(slim) {
    document.body.classList.toggle('nf65-dock-slim', Boolean(slim));
    const btn = document.getElementById('nf65DockToggle');
    if (btn) {
      btn.textContent = slim ? '◨' : '◧ Ringkas';
      btn.title = slim
        ? 'Perluas panel Inventori Perangkat (Alt+B)'
        : 'Ringkas Inventori jadi Dock Ikon agar kanvas lebih luas (Alt+B)';
      btn.setAttribute('aria-pressed', String(Boolean(slim)));
    }
    const tip = document.getElementById('nf65DockTip');
    if (tip && !slim) tip.classList.remove('show');
    try { localStorage.setItem(DOCK_KEY, slim ? '1' : '0'); } catch (_) {}
  }

  function ensureDockTooltip() {
    let tip = document.getElementById('nf65DockTip');
    if (tip) return tip;
    tip = document.createElement('div');
    tip.id = 'nf65DockTip';
    tip.setAttribute('role', 'tooltip');
    document.body.appendChild(tip);
    return tip;
  }

  function bindSlimDockTooltips() {
    const list = document.getElementById('nf400List');
    if (!list || list.dataset.nf65TipBound === '1') return Boolean(list);
    list.dataset.nf65TipBound = '1';
    const tip = ensureDockTooltip();

    list.addEventListener('pointerover', e => {
      if (!document.body.classList.contains('nf65-dock-slim')) return;
      const btn = e.target.closest('button.nf400-device');
      if (!btn) return;
      const name = btn.querySelector('strong')?.textContent || btn.dataset.type || 'Perangkat';
      const sub = btn.querySelector('small')?.textContent || '';
      tip.innerHTML = `${name}${sub ? `<small>${sub}</small>` : ''}`;
      const r = btn.getBoundingClientRect();
      tip.style.left = Math.round(r.right + 10) + 'px';
      tip.style.top = Math.round(r.top + r.height / 2 - 20) + 'px';
      tip.classList.add('show');
    });

    list.addEventListener('pointerout', e => {
      const btn = e.target.closest('button.nf400-device');
      if (btn && !btn.contains(e.relatedTarget)) {
        tip.classList.remove('show');
      }
    });
    list.addEventListener('scroll', () => tip.classList.remove('show'), { passive: true });
    return true;
  }

  function injectDockToggle() {
    const head = document.querySelector('aside.panel.left > .panelhead');
    if (!head || document.getElementById('nf65DockToggle')) return Boolean(document.getElementById('nf65DockToggle'));
    const btn = document.createElement('button');
    btn.id = 'nf65DockToggle';
    btn.type = 'button';
    btn.addEventListener('click', () => {
      applyDockState(!document.body.classList.contains('nf65-dock-slim'));
    });
    head.appendChild(btn);
    let saved = false;
    try { saved = localStorage.getItem(DOCK_KEY) === '1'; } catch (_) {}
    applyDockState(saved);
    return true;
  }

  document.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 'b' || e.key === 'B')) {
      e.preventDefault();
      applyDockState(!document.body.classList.contains('nf65-dock-slim'));
    }
  });

  // 3. Live Mini Network Traffic Sparkline + Quick Theme Button in Command Center Bar
  const samples = new Array(22).fill(0);
  let sparkTimer = null;

  function drawSparkline() {
    const canvas = document.getElementById('nf65Sparkline');
    const lbl = document.getElementById('nf65Mbps');
    if (!canvas || !lbl || document.hidden) return;

    const api = API();
    const state = api?.getState?.() || { nodes: [], edges: [] };
    const activeLinks = (state.edges || []).filter(e => api?.isLinkActive?.(e)).length;
    const baseMbps = activeLinks > 0 ? activeLinks * 14 + Math.random() * (activeLinks * 9 + 6) : 0;
    const mbps = Math.round(baseMbps);

    samples.push(mbps);
    if (samples.length > 22) samples.shift();

    const maxVal = Math.max(40, ...samples);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 2);
    ctx.lineTo(w, h - 2);
    ctx.stroke();

    ctx.strokeStyle = activeLinks > 0 ? '#22D3EE' : '#475569';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    samples.forEach((v, i) => {
      const x = (i / (samples.length - 1)) * (w - 2) + 1;
      const y = h - 2 - (v / maxVal) * (h - 5);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    lbl.textContent = mbps + ' Mbps';
    lbl.style.color = activeLinks > 0 ? '#22D3EE' : '#64748B';
  }

  function injectTelemetryAndThemeBtn() {
    const bar = document.getElementById('nf43DrawerBar');
    if (!bar) return false;

    const tabs = bar.querySelector('.nf43-tabs');
    if (tabs && !document.getElementById('nf65ThemeBtn')) {
      const tb = document.createElement('button');
      tb.id = 'nf65ThemeBtn';
      tb.type = 'button';
      tb.addEventListener('click', toggleTheme);
      tabs.appendChild(tb);
      initTheme();
    }

    if (!document.getElementById('nf65Telemetry')) {
      const wrap = document.createElement('div');
      wrap.id = 'nf65Telemetry';
      wrap.title = 'Simulasi trafik jaringan real-time berdasarkan tautan aktif';
      wrap.innerHTML = '<canvas id="nf65Sparkline" width="56" height="18" aria-hidden="true"></canvas><span id="nf65Mbps">0 Mbps</span>';
      const health = document.getElementById('nf45HealthPill');
      if (health && health.parentElement === bar) bar.insertBefore(wrap, health);
      else bar.appendChild(wrap);
      if (!sparkTimer) sparkTimer = setInterval(drawSparkline, 900);
      drawSparkline();
    }
    return true;
  }

  window.NetForgeTacticalHUD = {
    version: '0.65.1',
    setSlimDock: applyDockState,
    toggleDock: () => applyDockState(!document.body.classList.contains('nf65-dock-slim')),
    setTheme: applyTheme,
    toggleTheme
  };

  initTheme();
  let tries = 0;
  (function boot() {
    const a = injectDockToggle();
    const b = bindSlimDockTooltips();
    const c = injectTelemetryAndThemeBtn();
    const d = injectSettingsThemeCard();
    if ((a && b && c && d) || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
