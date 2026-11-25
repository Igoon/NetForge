/* NET FORGE v0.65.0 — Tactical Cyber HUD Controller (Slim Icon Dock + Live Traffic Sparkline) */
(function () {
  'use strict';
  if (window.__NF6500_TACTICAL_HUD) return;
  window.__NF6500_TACTICAL_HUD = true;

  const DOCK_KEY = 'netforge.slimDock.v1';
  const API = () => window.NetForgeUniversalInventory || null;

  // 1. Collapsible Left Inventory Icon Dock (Focus Mode Canvas)
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
    try { localStorage.setItem(DOCK_KEY, slim ? '1' : '0'); } catch (_) {}
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

  // 2. Live Mini Network Traffic Sparkline inside Unified Command Center Bar
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

    // Draw subtle baseline
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.18)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 2);
    ctx.lineTo(w, h - 2);
    ctx.stroke();

    // Draw glowing sparkline
    const strokeCol = activeLinks > 0 ? '#22D3EE' : '#475569';
    ctx.strokeStyle = strokeCol;
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

  function injectTelemetry() {
    const bar = document.getElementById('nf43DrawerBar');
    if (!bar || document.getElementById('nf65Telemetry')) return Boolean(document.getElementById('nf65Telemetry'));
    const wrap = document.createElement('div');
    wrap.id = 'nf65Telemetry';
    wrap.title = 'Simulasi trafik jaringan real-time berdasarkan tautan aktif';
    wrap.innerHTML = '<canvas id="nf65Sparkline" width="58" height="18" aria-hidden="true"></canvas><span id="nf65Mbps">0 Mbps</span>';
    const health = document.getElementById('nf45HealthPill');
    if (health && health.parentElement === bar) bar.insertBefore(wrap, health);
    else bar.appendChild(wrap);
    if (!sparkTimer) sparkTimer = setInterval(drawSparkline, 900);
    drawSparkline();
    return true;
  }

  window.NetForgeTacticalHUD = {
    version: '0.65.0',
    setSlimDock: applyDockState,
    toggleDock: () => applyDockState(!document.body.classList.contains('nf65-dock-slim'))
  };

  let tries = 0;
  (function boot() {
    const a = injectDockToggle();
    const b = injectTelemetry();
    if ((a && b) || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
