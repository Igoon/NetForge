/* NET FORGE v0.69.2 — Tactical Cyber HUD Controller
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


  // 4. v0.69.2 — Node Micro-HUD IP Chips + Pop-in Micro-Interaction + Hop-by-Hop ICMP Packet Pulse
  const seenNodeIds = new Set();

  function syncNodeMicroHud() {
    const api = API();
    const container = document.getElementById('nf400Nodes');
    if (!api || !container) return;
    const state = api.getState?.() || { nodes: [], edges: [] };
    const nodes = Array.isArray(state.nodes) ? state.nodes : [];
    const activeEdges = (state.edges || []).filter(e => api.isLinkActive?.(e));
    const classic = api.classicView?.()?.nodes || [];
    const cfgById = new Map(classic.map(c => [String(c.id), c.config || {}]));

    const linkedSet = new Set();
    for (const e of activeEdges) {
      linkedSet.add(String(e.a));
      linkedSet.add(String(e.b));
    }

    const byId = new Map(nodes.map(n => [String(n.id), n]));
    container.querySelectorAll('.nf400-node').forEach(el => {
      const id = String(el.dataset.id || el.dataset.nodeId || '');
      const n = byId.get(id);
      if (!n) return;

      // Subtle pop-in glow for newly added devices
      if (!seenNodeIds.has(id)) {
        seenNodeIds.add(id);
        if (seenNodeIds.size > 1) {
          el.classList.add('nf66-just-placed');
          setTimeout(() => el.classList.remove('nf66-just-placed'), 420);
        }
      }

      const cfg = cfgById.get(id) || {};
      const ip = (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : '');
      const pref = String(cfg.prefix || '24').replace(/^\//, '');
      const isLinked = linkedSet.has(id);
      const isL2Only = n.type === 'switch' || n.type === 'modem';

      let pill = el.querySelector('.nf66-ip-pill');
      if (!pill) {
        pill = document.createElement('div');
        pill.className = 'nf66-ip-pill';
        el.appendChild(pill);
      }

      let cls = 'nf66-ip-pill';
      let label = '';
      if (ip) {
        cls += isLinked ? ' st-ok' : ' st-warn';
        label = `${ip}/${pref}`;
      } else if (isL2Only) {
        cls += isLinked ? ' st-l2' : '';
        label = isLinked ? (n.type === 'modem' ? 'WAN LINK UP' : 'L2 LINK UP') : 'Standby';
      } else {
        cls += ' st-warn';
        label = isLinked ? 'Belum ada IP' : 'Offline';
      }

      if (pill.className !== cls) pill.className = cls;
      const html = `<span class="nf66-dot"></span><span>${label}</span>`;
      if (pill.innerHTML !== html) pill.innerHTML = html;

      // v0.69.2: VLAN / Trunk micro-badge on canvas device card
      const vlanVal = String((n.vlan && String(n.vlan).trim()) || cfg.vlan || '').trim();
      const ifaceVal = String((n.iface && String(n.iface).trim()) || cfg.iface || '').trim().toLowerCase();
      let vpill = el.querySelector('.nf67-vlan-pill');
      if (vlanVal || ifaceVal === 'trunk') {
        if (!vpill) {
          vpill = document.createElement('div');
          vpill.className = 'nf67-vlan-pill';
          el.appendChild(vpill);
        }
        const vTxt = ifaceVal === 'trunk' ? `TRUNK ${vlanVal || 'ALL'}` : `VLAN ${vlanVal}`;
        if (vpill.textContent !== vTxt) vpill.textContent = vTxt;
      } else if (vpill) {
        vpill.remove();
      }
    });
  }

  function spawnPulseRing(xPct, yPct, tone) {
    const vp = document.getElementById('nf4024Viewport');
    if (!vp) return;
    const ring = document.createElement('div');
    ring.className = 'nf66-pulse-ring' + (tone ? ' ' + tone : '');
    ring.style.left = xPct + '%';
    ring.style.top = yPct + '%';
    vp.appendChild(ring);
    setTimeout(() => ring.remove(), 620);
  }

  function animatePacketPath(nodeIds, opts = {}) {
    const api = API();
    const vp = document.getElementById('nf4024Viewport');
    if (!api || !vp || !Array.isArray(nodeIds) || !nodeIds.length) return;
    const nodes = api.getState?.()?.nodes || [];
    const byId = new Map(nodes.map(n => [String(n.id), n]));
    const pts = nodeIds.map(id => byId.get(String(id))).filter(Boolean);
    if (!pts.length) return;

    const label = opts.label || 'ICMP';
    const isDrop = Boolean(opts.drop);
    const bounce = Boolean(opts.bounce) && !isDrop && pts.length > 1;

    const orb = document.createElement('div');
    orb.className = 'nf66-pkt-orb' + (isDrop ? ' drop' : '');
    orb.textContent = isDrop ? 'DROP ✕' : label;
    orb.style.left = pts[0].x + '%';
    orb.style.top = pts[0].y + '%';
    vp.appendChild(orb);
    spawnPulseRing(pts[0].x, pts[0].y, isDrop ? 'drop' : '');

    if (isDrop || pts.length === 1) {
      setTimeout(() => orb.remove(), 900);
      return;
    }

    const hops = bounce ? [...pts, ...pts.slice(0, -1).reverse()] : pts;
    let idx = 1;
    function stepNext() {
      if (idx >= hops.length) {
        setTimeout(() => orb.remove(), 260);
        return;
      }
      const p = hops[idx];
      const isReturnLeg = bounce && idx >= pts.length;
      if (isReturnLeg && !orb.classList.contains('reply')) {
        orb.classList.add('reply');
        orb.textContent = 'REPLY ✓';
      }
      orb.style.left = p.x + '%';
      orb.style.top = p.y + '%';
      if (idx === pts.length - 1 || idx === hops.length - 1) {
        setTimeout(() => spawnPulseRing(p.x, p.y, isReturnLeg ? 'mint' : ''), 320);
      }
      idx++;
      setTimeout(stepNext, 440);
    }
    setTimeout(stepNext, 40);
  }

  let hudObs = null;
  function attachNodeHudObserver() {
    const container = document.getElementById('nf400Nodes');
    if (!container || hudObs) return Boolean(container);
    hudObs = new MutationObserver(() => syncNodeMicroHud());
    hudObs.observe(container, { childList: true, subtree: false });
    syncNodeMicroHud();
    setInterval(() => { syncNodeMicroHud(); if (xrayActive) refreshXrayOverlay(); }, 1200);
    return true;
  }


  // 5. v0.69.2 — Mode X-Ray Jaringan (Subnet & VLAN Color Aura Overlay)
  let xrayActive = false;
  let xrayMode = 'subnet'; // 'subnet' | 'vlan'
  const XRAY_PALETTE = [
    { c: '#22D3EE', g: 'rgba(34, 211, 238, 0.32)' },
    { c: '#A855F7', g: 'rgba(168, 85, 247, 0.34)' },
    { c: '#34D399', g: 'rgba(52, 211, 153, 0.32)' },
    { c: '#F59E0B', g: 'rgba(245, 158, 11, 0.32)' },
    { c: '#F43F5E', g: 'rgba(244, 63, 94, 0.32)' },
    { c: '#38BDF8', g: 'rgba(56, 189, 248, 0.32)' }
  ];

  function calcNetKey(ip, pref) {
    const parts = String(ip || '').trim().split('.');
    if (parts.length !== 4 || parts.some(p => !/^\d+$/.test(p) || Number(p) > 255)) return '';
    const p = Math.max(0, Math.min(32, parseInt(pref || '24', 10) || 24));
    let num = 0;
    for (const s of parts) num = ((num << 8) | Number(s)) >>> 0;
    const mask = p === 0 ? 0 : ((0xffffffff << (32 - p)) >>> 0);
    const net = (num & mask) >>> 0;
    return `${(net >>> 24) & 255}.${(net >>> 16) & 255}.${(net >>> 8) & 255}.${net & 255}/${p}`;
  }

  function ensureXrayLegend() {
    const canvas = document.getElementById('nf400Canvas');
    if (!canvas) return null;
    let el = document.getElementById('nf68XrayLegend');
    if (!el) {
      el = document.createElement('div');
      el.id = 'nf68XrayLegend';
      el.innerHTML = `
        <div class="nf68-xray-head">
          <strong>🩻 X-RAY JARINGAN</strong>
          <div class="nf68-xray-switch">
            <button type="button" data-xray-mode="subnet" class="active">Subnet</button>
            <button type="button" data-xray-mode="vlan">VLAN</button>
          </div>
        </div>
        <div class="nf68-xray-items" id="nf68XrayItems"></div>
      `;
      canvas.appendChild(el);
      el.querySelectorAll('[data-xray-mode]').forEach(b => {
        b.addEventListener('click', () => {
          xrayMode = b.dataset.xrayMode;
          el.querySelectorAll('[data-xray-mode]').forEach(x => x.classList.toggle('active', x === b));
          refreshXrayOverlay();
        });
      });
    }
    return el;
  }

  function refreshXrayOverlay() {
    const container = document.getElementById('nf400Nodes');
    if (!container) return;
    if (!xrayActive) {
      container.querySelectorAll('.nf400-node').forEach(el => {
        el.removeAttribute('data-xray-color');
        el.removeAttribute('data-xray-dashed');
        el.style.removeProperty('--xray-c');
        el.style.removeProperty('--xray-glow');
      });
      return;
    }
    ensureXrayLegend();
    const api = API();
    const state = api?.getState?.() || { nodes: [] };
    const classic = api?.classicView?.()?.nodes || [];
    const cfgById = new Map(classic.map(c => [String(c.id), c.config || {}]));
    const byId = new Map((state.nodes || []).map(n => [String(n.id), n]));

    const groupColors = new Map();
    let colorIdx = 0;
    const pickColor = key => {
      if (!groupColors.has(key)) {
        groupColors.set(key, XRAY_PALETTE[colorIdx % XRAY_PALETTE.length]);
        colorIdx++;
      }
      return groupColors.get(key);
    };

    container.querySelectorAll('.nf400-node').forEach(el => {
      const id = String(el.dataset.id || el.dataset.nodeId || '');
      const n = byId.get(id);
      if (!n) return;
      const cfg = cfgById.get(id) || {};
      let key = '';
      let dashed = false;

      if (xrayMode === 'subnet') {
        const ip = (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : '');
        const pref = String(cfg.prefix || '24').replace(/^\//, '');
        key = ip ? calcNetKey(ip, pref) : (n.type === 'switch' ? 'L2 Switch' : 'Belum ber-IP');
      } else {
        const vlan = String((n.vlan && String(n.vlan).trim()) || cfg.vlan || '').trim();
        const iface = String((n.iface && String(n.iface).trim()) || cfg.iface || '').trim().toLowerCase();
        if (iface === 'trunk') {
          key = `TRUNK (${vlan || 'ALL'})`;
          dashed = true;
        } else if (vlan) {
          key = `VLAN ${vlan}`;
        } else {
          key = 'Default (Untagged)';
        }
      }

      const pal = (key === 'Belum ber-IP' || key === 'Default (Untagged)')
        ? { c: '#64748B', g: 'rgba(100, 116, 139, 0.22)' }
        : pickColor(key);

      el.setAttribute('data-xray-color', key);
      if (dashed) el.setAttribute('data-xray-dashed', '1');
      else el.removeAttribute('data-xray-dashed');
      el.style.setProperty('--xray-c', pal.c);
      el.style.setProperty('--xray-glow', pal.g);
    });

    const itemsBox = document.getElementById('nf68XrayItems');
    if (itemsBox) {
      const entries = [...groupColors.entries()];
      itemsBox.innerHTML = entries.length
        ? entries.map(([k, p]) => `<span class="nf68-xray-chip"><span class="nf68-xray-swatch" style="background:${p.c}"></span>${k}</span>`).join('')
        : '<span style="color:#94A3B8;font-size:10.5px;">Belum ada Subnet/VLAN terkonfigurasi di kanvas.</span>';
    }
  }

  function toggleXray(forceState) {
    xrayActive = typeof forceState === 'boolean' ? forceState : !xrayActive;
    document.body.classList.toggle('nf68-xray-on', xrayActive);
    const btn = document.getElementById('nf68XrayBtn');
    if (btn) {
      btn.classList.toggle('active', xrayActive);
      btn.setAttribute('aria-pressed', String(xrayActive));
      btn.textContent = xrayActive ? '🩻 X-Ray: ON' : '🩻 X-Ray';
    }
    refreshXrayOverlay();
  }

  function injectXrayButton() {
    const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
    if (!tabs || document.getElementById('nf68XrayBtn')) return Boolean(document.getElementById('nf68XrayBtn'));
    const b = document.createElement('button');
    b.id = 'nf68XrayBtn';
    b.type = 'button';
    b.textContent = '🩻 X-Ray';
    b.title = 'Mode X-Ray Jaringan: lihat aura zona Subnet & VLAN di kanvas (Alt+X)';
    b.addEventListener('click', () => toggleXray());
    tabs.appendChild(b);
    return true;
  }

  document.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 'x' || e.key === 'X')) {
      e.preventDefault();
      toggleXray();
    }
  });

  window.NetForgeTacticalHUD = {
    version: '0.69.2',
    setSlimDock: applyDockState,
    toggleDock: () => applyDockState(!document.body.classList.contains('nf65-dock-slim')),
    setTheme: applyTheme,
    toggleTheme,
    syncNodeMicroHud,
    animatePacketPath,
    toggleXray,
    refreshXrayOverlay
  };

  initTheme();
  let tries = 0;
  (function boot() {
    const a = injectDockToggle();
    const b = bindSlimDockTooltips();
    const c = injectTelemetryAndThemeBtn();
    const d = injectSettingsThemeCard();
    const e = attachNodeHudObserver();
    const f = injectXrayButton();
    if ((a && b && c && d && e && f) || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
