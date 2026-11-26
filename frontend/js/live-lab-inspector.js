/* NET FORGE v0.70.0 — Live Side Inspector & Packet Flow Canvas Sync */
(function () {
  'use strict';
  if (window.__NF3_LIVE_LAB) return;
  window.__NF3_LIVE_LAB = true;

  const $ = id => document.getElementById(id);
  const dockPreference = { nf69: true, nf61: true };
  const observedIds = new Set();

  /* 1. Tombol Mode Cepat di Bar Misi Unified Canvas (#nf400Modebar) atau HUD Klasik (#nf24Hud) */
  function injectModeBar() {
    const host = $('nf400Modebar') || $('nf24Hud');
    if (!host) return false;
    let bar = $('nf3ModeBar');
    if (bar) {
      if ($('nf400Modebar') && bar.parentElement !== $('nf400Modebar')) {
        $('nf400Modebar').appendChild(bar);
      }
      return true;
    }

    bar = document.createElement('div');
    bar.id = 'nf3ModeBar';
    bar.className = 'nf3-mode-bar';
    bar.setAttribute('role', 'group');
    bar.setAttribute('aria-label', 'Mode inspeksi kanvas');
    bar.innerHTML = `
      <button type="button" data-mode="build" class="active" title="Mode membangun topologi">🔧 Build</button>
      <button type="button" data-mode="nf69" title="Live ARP &amp; MAC Table di samping kanvas">📡 ARP / MAC</button>
      <button type="button" data-mode="nf61" title="Live DHCP DORA, VLAN &amp; Routing">🧪 Protocol</button>
    `;
    host.appendChild(bar);

    bar.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => openInspectorMode(btn.dataset.mode));
    });
    return true;
  }

  function openInspectorMode(mode) {
    const ov69 = $('nf69Overlay');
    const ov61 = $('nf61Overlay');

    if (mode === 'build') {
      if (ov69 && !ov69.hidden) $('nf69Close')?.click() || (ov69.hidden = true);
      if (ov61 && !ov61.hidden) $('nf61Close')?.click() || (ov61.hidden = true);
      syncModeState();
      return;
    }

    if (mode === 'nf69' && ov69) {
      if (ov61 && !ov61.hidden) $('nf61Close')?.click() || (ov61.hidden = true);
      dockPreference.nf69 = true;
      ov69.hidden = false;
      $('nf69Refresh')?.click();
    } else if (mode === 'nf61' && ov61) {
      if (ov69 && !ov69.hidden) $('nf69Close')?.click() || (ov69.hidden = true);
      dockPreference.nf61 = true;
      ov61.hidden = false;
      $('nf61Refresh')?.click();
    }
    syncModeState();
  }

  /* 2. Tambah tombol Dock/Full pada header #nf69Card & #nf61Card */
  function ensureDockButtons() {
    [
      { key: 'nf69', cardId: 'nf69Card', closeId: 'nf69Close', ovId: 'nf69Overlay' },
      { key: 'nf61', cardId: 'nf61Card', closeId: 'nf61Close', ovId: 'nf61Overlay' }
    ].forEach(({ key, cardId, closeId, ovId }) => {
      const card = $(cardId);
      const closeBtn = $(closeId);
      const btnId = `nf3DockBtn_${key}`;
      if (!card || !closeBtn || $(btnId)) return;

      const btn = document.createElement('button');
      btn.id = btnId;
      btn.type = 'button';
      btn.className = 'nf3-dock-toggle';
      btn.textContent = '⛶ Perbesar';
      btn.addEventListener('click', () => {
        dockPreference[key] = !dockPreference[key];
        applyDockClass($(ovId), key);
        syncModeState();
      });
      closeBtn.parentElement.insertBefore(btn, closeBtn);
    });
  }

  function applyDockClass(ov, key) {
    if (!ov) return;
    const isOpen = !ov.hidden;
    const docked = isOpen && dockPreference[key];
    ov.classList.toggle('nf3-docked', docked);
    const btn = $(`nf3DockBtn_${key}`);
    if (btn) btn.textContent = docked ? '⛶ Perbesar' : '◫ Samping Kanvas';
  }

  function syncModeState() {
    const ov69 = $('nf69Overlay');
    const ov61 = $('nf61Overlay');
    applyDockClass(ov69, 'nf69');
    applyDockClass(ov61, 'nf61');

    const open69 = Boolean(ov69 && !ov69.hidden);
    const open61 = Boolean(ov61 && !ov61.hidden);
    const anyDocked = (open69 && dockPreference.nf69) || (open61 && dockPreference.nf61);
    document.body.classList.toggle('nf3-side-open', anyDocked);

    const activeMode = open69 ? 'nf69' : open61 ? 'nf61' : 'build';
    document.querySelectorAll('#nf3ModeBar button').forEach(b => {
      b.classList.toggle('active', b.dataset.mode === activeMode);
    });
  }

  /* 3. Sinkronkan #nf70PacketHud dengan Step di #nf69Steps & Node di Kanvas */
  function syncPacketFlowToInspector() {
    const hud = $('nf70PacketHud');
    const stateEl = $('nf70State');
    const headersEl = $('nf70Headers');
    const isRunning = Boolean(hud && !hud.hidden);

    document.querySelectorAll('.nf3-node-active').forEach(el => el.classList.remove('nf3-node-active'));

    const statusBox = $('nf69Status');
    let pill = $('nf3PktPill');

    if (!isRunning) {
      if (pill) pill.remove();
      document.querySelectorAll('#nf69Steps .nf3-step-active').forEach(el => el.classList.remove('nf3-step-active'));
      return;
    }

    const stateTxt = (stateEl?.textContent || '').trim();
    const headerTxt = (headersEl?.textContent || '').trim();
    const combined = `${stateTxt} ${headerTxt}`.toLowerCase();
    const isReply = /reply|unicast|ack|offer/i.test(combined);

    if (statusBox) {
      if (!pill) {
        pill = document.createElement('div');
        pill.id = 'nf3PktPill';
        statusBox.appendChild(pill);
      }
      pill.className = 'nf3-pkt-pill' + (isReply ? ' reply' : '');
      pill.textContent = (isReply ? '◀ UNICAST: ' : '▶ BROADCAST: ') + (stateTxt || 'Paket bergerak...');
    }

    const stepsWrap = $('nf69Steps');
    if (stepsWrap) {
      const items = [...stepsWrap.children];
      items.forEach(el => el.classList.remove('nf3-step-active'));
      const match = items.find(el => {
        const t = (el.textContent || '').toLowerCase();
        return isReply ? /reply|unicast/.test(t) : /request|broadcast|learn/.test(t);
      });
      if (match) {
        match.classList.add('nf3-step-active');
        match.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }

    const canvasNodes = document.querySelectorAll('#nf400Canvas .nf400-node, #board .node');
    canvasNodes.forEach(node => {
      const title = (node.querySelector('b, strong, .title, .nf400-title')?.textContent || node.textContent || '').trim();
      const shortName = title.split(/\s+/)[0]?.toLowerCase();
      if (shortName && shortName.length >= 2 && combined.includes(shortName)) {
        node.classList.add('nf3-node-active');
      }
    });
  }

  /* 4. Klik baris ARP/MAC untuk menyorot perangkat terkait di kanvas */
  function bindTableRowHighlight() {
    ['nf69Arp', 'nf69Mac'].forEach(id => {
      const el = $(id);
      if (!el || el.__nf3Bound) return;
      el.__nf3Bound = true;
      el.addEventListener('click', e => {
        const row = e.target.closest('tr, li, div');
        if (!row) return;
        const txt = (row.textContent || '').toLowerCase();
        document.querySelectorAll('#nf400Canvas .nf400-node, #board .node').forEach(node => {
          const name = (node.querySelector('b, strong, .title, .nf400-title')?.textContent || '').trim().toLowerCase();
          const hit = name && txt.includes(name);
          node.classList.toggle('nf3-node-active', Boolean(hit));
        });
      });
    });
  }

  /* 5. Auto-refresh topologi di inspector saat tombol Save config atau koneksi berubah */
  function bindAutoTopologySync() {
    const save = $('cfgSave');
    if (save && !save.__nf3Bound) {
      save.__nf3Bound = true;
      save.addEventListener('click', () => {
        setTimeout(() => {
          if ($('nf69Overlay') && !$('nf69Overlay').hidden) $('nf69Refresh')?.click();
          if ($('nf61Overlay') && !$('nf61Overlay').hidden) $('nf61Refresh')?.click();
        }, 150);
      });
    }
  }

  const ovObs = new MutationObserver(() => {
    ensureDockButtons();
    syncModeState();
    syncPacketFlowToInspector();
  });

  const pktObs = new MutationObserver(syncPacketFlowToInspector);

  function bindDynamicTargets() {
    injectModeBar();
    ensureDockButtons();
    bindTableRowHighlight();
    bindAutoTopologySync();

    ['nf69Overlay', 'nf61Overlay', 'nf70PacketHud'].forEach(id => {
      const el = $(id);
      if (el && !observedIds.has(id)) {
        observedIds.add(id);
        ovObs.observe(el, { attributes: true, attributeFilter: ['hidden', 'class', 'style'] });
      }
    });

    ['nf70State', 'nf70Headers'].forEach(id => {
      const el = $(id);
      if (el && !observedIds.has(id)) {
        observedIds.add(id);
        pktObs.observe(el, { childList: true, characterData: true, subtree: true });
      }
    });

    syncModeState();
    return Boolean($('nf400Modebar') && observedIds.has('nf69Overlay') && observedIds.has('nf61Overlay'));
  }

  function init() {
    if (!bindDynamicTargets() && window.MutationObserver) {
      const bodyObs = new MutationObserver(() => {
        if (bindDynamicTargets()) bodyObs.disconnect();
      });
      bodyObs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => bodyObs.disconnect(), 20000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
