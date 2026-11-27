/* NET FORGE v0.71.1 — Clean Single-Screen Shell, Unified Drawer & Event-Driven UI */

/* === script:nf4093-pwa-status-fade === */
(function () {
  'use strict';
  let timer = null;
  function arm(el) {
    el.classList.remove('nf4093-faded');
    clearTimeout(timer);
    timer = setTimeout(() => el.classList.add('nf4093-faded'), 3500);
  }
  function attach() {
    const el = document.getElementById('nf330PwaStatus');
    if (!el || el.__nf4093Bound) return Boolean(el);
    el.__nf4093Bound = true;
    arm(el);
    if (window.MutationObserver) {
      new MutationObserver(() => arm(el)).observe(el, {
        childList: true,
        characterData: true,
        subtree: true
      });
    }
    return true;
  }
  document.addEventListener('DOMContentLoaded', () => {
    if (!attach()) {
      const obs = new MutationObserver(() => {
        if (attach()) obs.disconnect();
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 15000);
    }
  });
})();

/* === script:nf4200-ui-helper === */
/* Sinkronisasi LED berbasis MutationObserver (instan, tanpa setInterval) */
(function () {
  'use strict';
  if (window.__NF4200_UI) return;
  window.__NF4200_UI = true;

  let rafPending = false;
  function syncNodeLeds() {
    rafPending = false;
    const canvas = document.getElementById('nf400Canvas');
    if (!canvas) return;
    canvas.querySelectorAll('.nf400-node').forEach(node => {
      const txt = node.textContent || '';
      const isOnline = /LINK UP|ONLINE|ACTIVE/i.test(txt) && !/OFFLINE/i.test(txt);
      node.classList.toggle('nf42-online', isOnline);
    });
  }

  function scheduleSync() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(syncNodeLeds);
  }

  function bindCanvasObserver() {
    const canvas = document.getElementById('nf400Canvas');
    if (!canvas || canvas.__nf4200Bound) return Boolean(canvas);
    canvas.__nf4200Bound = true;
    syncNodeLeds();
    if (window.MutationObserver) {
      new MutationObserver(scheduleSync).observe(canvas, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }
    return true;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!bindCanvasObserver()) {
      const obs = new MutationObserver(() => {
        if (bindCanvasObserver()) obs.disconnect();
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 20000);
    }
  });
})();

/* === script:nf4300-shell-controller === */
/* Shell 100dvh, Tab Inventori/Lab, Floating Iga, Drawer 3 Tab, & Sinkronisasi Gate Awal */
(function () {
  'use strict';
  if (window.__NF4300_SHELL) return;
  window.__NF4300_SHELL = true;

  const $ = id => document.getElementById(id);
  let activeTab = null;

  /* 1. Pastikan #startModal & #nf344AudioGate tidak bertumpuk di belakang #nf322Overlay */
  function syncIntroGateLock() {
    const intro = $('nf322Overlay');
    const isIntroVisible = Boolean(
      intro && !intro.hidden && getComputedStyle(intro).display !== 'none'
    );
    document.body.classList.toggle('nf1-intro-open', isIntroVisible);
  }

  /* 2. Bagi aside.panel.left menjadi 2 tab: Perangkat | Lab Virtual */
  function setupLeftTabs() {
    const left = document.querySelector('aside.panel.left');
    if (!left || $('nf1LeftTabs')) return;

    const head = left.querySelector(':scope > .panelhead');
    const body = left.querySelector(':scope > .panelbody');
    if (!head || !body) return;

    const tabs = document.createElement('div');
    tabs.id = 'nf1LeftTabs';
    tabs.className = 'nf1-left-tabs';
    tabs.setAttribute('role', 'tablist');
    tabs.innerHTML = `
      <button type="button" role="tab" id="nf1TabDevices" aria-selected="true" class="active">⬡ Perangkat</button>
      <button type="button" role="tab" id="nf1TabLab" aria-selected="false">🖥️ Lab Virtual</button>
    `;
    head.insertAdjacentElement('afterend', tabs);

    body.classList.add('nf1-left-pane');
    const labPane = document.createElement('div');
    labPane.id = 'nf1LeftPaneLab';
    labPane.className = 'nf1-left-pane';
    labPane.hidden = true;

    const toMove = [];
    let sib = body.nextElementSibling;
    while (sib) {
      toMove.push(sib);
      sib = sib.nextElementSibling;
    }
    toMove.forEach(el => labPane.appendChild(el));
    left.appendChild(labPane);

    const switchLeft = mode => {
      const isDev = mode === 'devices';
      body.hidden = !isDev;
      labPane.hidden = isDev;
      $('nf1TabDevices').classList.toggle('active', isDev);
      $('nf1TabDevices').setAttribute('aria-selected', String(isDev));
      $('nf1TabLab').classList.toggle('active', !isDev);
      $('nf1TabLab').setAttribute('aria-selected', String(!isDev));
    };

    $('nf1TabDevices').addEventListener('click', () => switchLeft('devices'));
    $('nf1TabLab').addEventListener('click', () => switchLeft('lab'));

    document.querySelector('a[href="#pveConfigPanel"]')?.addEventListener('click', () => {
      switchLeft('lab');
    });
  }

  /* 3. Sembunyikan panel Iga/Log/Insiden duplikat di aside.right agar fokus ke Misi */
  function declutterRightSidebar() {
    const right = document.querySelector('aside.right');
    if (!right) return;
    const panels = right.querySelectorAll(':scope > section.panel');
    if (panels[1]) {
      panels[1].classList.add('nf1-right-dup-panel');
    }
  }

  /* 4. Jadikan Iga sebagai floating assistant chip di pojok kanvas */
  function setupFloatingIga() {
    const stage = $('stage');
    const igaDock = document.querySelector('#commandDock .iga-dock');
    if (!stage || !igaDock || $('nf1IgaWidget')) return;

    const widget = document.createElement('div');
    widget.id = 'nf1IgaWidget';
    widget.innerHTML = `
      <div id="nf1IgaPopover" hidden role="region" aria-label="Asisten Iga">
        <div class="nf1-iga-head">
          <span>🧑‍🔧 IGA · NETWORK GUIDE</span>
          <button type="button" id="nf1IgaClose" aria-label="Ciutkan Iga">✕</button>
        </div>
        <div id="nf1IgaSlot"></div>
      </div>
      <button type="button" id="nf1IgaToggle" aria-expanded="false">
        <span class="nf1-iga-dot" aria-hidden="true"></span>
        <span>Iga</span>
        <span class="nf1-iga-preview" id="nf1IgaPreview">Siap membantu</span>
      </button>
    `;
    stage.appendChild(widget);

    const slot = $('nf1IgaSlot');
    slot.appendChild(igaDock);

    const popover = $('nf1IgaPopover');
    const toggle = $('nf1IgaToggle');
    const preview = $('nf1IgaPreview');

    const setOpen = open => {
      popover.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(popover.hidden));
    $('nf1IgaClose').addEventListener('click', () => setOpen(false));

    const syncPreview = () => {
      const dockTxt = ($('igaDockTalk')?.textContent || '').trim();
      const rightTxt = ($('igaTalk')?.textContent || '').trim();
      const text = dockTxt || rightTxt || 'Siap membantu';
      preview.textContent = text;
      if (!dockTxt && rightTxt && $('igaDockTalk')) {
        $('igaDockTalk').textContent = rightTxt;
      }
    };
    syncPreview();
    ['igaDockTalk', 'igaTalk'].forEach(id => {
      const el = $(id);
      if (el && window.MutationObserver) {
        new MutationObserver(syncPreview).observe(el, {
          childList: true,
          characterData: true,
          subtree: true
        });
      }
    });
  }

  /* 5. Drawer bawah 3 tab tunggal: Terminal · Log & Trafik · Insiden & Chaos */
  function setupUnifiedDrawer() {
    const wsShell = document.querySelector('section.workspace-shell');
    if (!wsShell) return false;
    document.body.classList.add('nf43-shell-active');

    if (!$('nf43DrawerBar')) {
      const bar = document.createElement('div');
      bar.id = 'nf43DrawerBar';
      bar.innerHTML = `
        <div class="nf43-tabs" role="tablist" aria-label="Panel alat workspace">
          <button type="button" id="nf1TabTerminal">⌁ Terminal</button>
          <button type="button" id="nf1TabLog">📟 Log &amp; Trafik</button>
          <button type="button" id="nf1TabChaos">🎲 Insiden &amp; Chaos</button>
        </div>
        <span class="nf43-hint">Klik tab untuk buka/tutup panel</span>
      `;
      wsShell.appendChild(bar);
    }

    if (!$('nf43DrawerSheet')) {
      const sheet = document.createElement('div');
      sheet.id = 'nf43DrawerSheet';
      sheet.setAttribute('role', 'dialog');
      sheet.setAttribute('aria-label', 'Panel Alat Jaringan');
      sheet.innerHTML = `
        <div class="nf43-sheet-head">
          <strong id="nf43SheetTitle">Panel Alat</strong>
          <button type="button" class="nf43-sheet-close" id="nf43SheetClose">✕ Tutup</button>
        </div>
        <div id="nf43DrawerBody">
          <div id="nf1PaneTerminal" class="nf1-drawer-tabpane" hidden></div>
          <div id="nf1PaneLog" class="nf1-drawer-tabpane" hidden></div>
          <div id="nf1PaneChaos" class="nf1-drawer-tabpane" hidden></div>
        </div>
      `;
      document.body.appendChild(sheet);

      const paneTerm = $('nf1PaneTerminal');
      const paneLog = $('nf1PaneLog');
      const paneChaos = $('nf1PaneChaos');

      const terminalDock = document.querySelector('#commandDock .terminal-dock');
      const pingPanel = document.querySelector('aside.panel.left .ping-panel');
      if (terminalDock) paneTerm.appendChild(terminalDock);
      const termContent = $('terminalDockContent');
      if (pingPanel && termContent && !termContent.children.length) {
        termContent.appendChild(pingPanel);
      }

      const nf400Panel = $('nf400Panel');
      const activityDock = document.querySelector('#commandDock .activity-dock');
      const legacyLog = $('log')?.closest('.rightsection');
      if (nf400Panel) paneLog.appendChild(nf400Panel);
      if (activityDock) paneLog.appendChild(activityDock);
      if (legacyLog && !document.querySelector('#activityDockContent')?.children.length) {
        paneLog.appendChild(legacyLog);
      }

      const chaosPanel = document.querySelector('#commandDock .chaos-panel');
      const incidentSection = $('eventArea')?.closest('.rightsection');
      if (chaosPanel) paneChaos.appendChild(chaosPanel);
      if (incidentSection) paneChaos.appendChild(incidentSection);

      const tabMap = {
        terminal: { btn: $('nf1TabTerminal'), pane: paneTerm, title: '⌁ Terminal Jaringan (Ping & Traceroute)' },
        log: { btn: $('nf1TabLog'), pane: paneLog, title: '📟 Log Aktivitas, Trafik & Evaluasi' },
        chaos: { btn: $('nf1TabChaos'), pane: paneChaos, title: '🎲 Pusat Insiden & Chaos Event' }
      };

      const closeSheet = () => {
        sheet.classList.remove('open');
        activeTab = null;
        Object.values(tabMap).forEach(t => {
          t.btn?.classList.remove('active');
          if (t.pane) t.pane.hidden = true;
        });
      };

      const openTab = key => {
        if (activeTab === key && sheet.classList.contains('open')) {
          closeSheet();
          return;
        }
        const latePanel = $('nf400Panel');
        if (latePanel) {
          if (latePanel.parentElement !== paneLog) paneLog.prepend(latePanel);
          latePanel.hidden = false;
        }

        Object.entries(tabMap).forEach(([k, t]) => {
          const on = k === key;
          t.btn?.classList.toggle('active', on);
          if (t.pane) t.pane.hidden = !on;
        });
        $('nf43SheetTitle').textContent = tabMap[key].title;
        activeTab = key;
        sheet.classList.add('open');
      };

      $('nf43SheetClose').addEventListener('click', closeSheet);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && sheet.classList.contains('open')) closeSheet();
      });

      $('nf1TabTerminal').addEventListener('click', () => openTab('terminal'));
      $('nf1TabLog').addEventListener('click', () => openTab('log'));
      $('nf1TabChaos').addEventListener('click', () => openTab('chaos'));

      document.querySelector('a[href="#log"]')?.addEventListener('click', e => {
        e.preventDefault();
        openTab('log');
      });
    }
    return true;
  }

  function boot() {
    syncIntroGateLock();
    const intro = $('nf322Overlay');
    if (intro && window.MutationObserver) {
      new MutationObserver(syncIntroGateLock).observe(intro, {
        attributes: true,
        attributeFilter: ['hidden', 'style', 'class']
      });
    }
    setupLeftTabs();
    declutterRightSidebar();
    setupFloatingIga();
    setupUnifiedDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* === script:nf5600-streamline === */
(function () {
  'use strict';
  if (window.__NF5600_CLEAN) return;
  window.__NF5600_CLEAN = true;

  function pruneRedundantUI() {
    document.querySelectorAll('#nf4034Coach .nf4034-actions button').forEach(btn => {
      const t = (btn.textContent || '').toLowerCase();
      if (t.includes('jelaskan') || t.includes('panduan') || t.includes('sambung port')) {
        btn.style.display = 'none';
      }
    });
    document.querySelectorAll('button').forEach(btn => {
      if ((btn.textContent || '').includes('Mode Klasik (Kompatibilitas)')) {
        btn.style.display = 'none';
      }
    });
  }

  document.addEventListener('DOMContentLoaded', pruneRedundantUI);
  document.addEventListener('click', () => requestAnimationFrame(pruneRedundantUI), true);
})();

/* === script:nf5700-intro-revamp === */
(function () {
  'use strict';
  if (window.__NF5700_INTRO) return;
  window.__NF5700_INTRO = true;

  function polishMainMenu() {
    const cont = document.getElementById('nf322Continue');
    const adv = document.getElementById('nf322Adventure');
    if (cont && adv) {
      const noSave = cont.disabled || cont.getAttribute('aria-disabled') === 'true';
      adv.classList.toggle('nf57-primary-cta', noSave);
      if (noSave) adv.textContent = '▶ Mulai Petualangan Baru';
    }
    const extra = document.querySelector('#nf322Menu .nf360-menu-extra');
    if (extra && !extra.__nf57Moved) {
      extra.__nf57Moved = true;
      document.querySelectorAll('#nf322Menu > label.nf322-check').forEach(lbl => {
        lbl.style.setProperty('display', 'flex', 'important');
        lbl.style.fontSize = '11.5px';
        extra.appendChild(lbl);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', polishMainMenu);
  document.addEventListener('click', () => requestAnimationFrame(polishMainMenu), true);
})();

/* === script:nf5800-autoupdate === */
(function () {
  'use strict';
  if (window.__NF5800_UPDATER) return;
  window.__NF5800_UPDATER = true;

  const CURRENT = (window.NETFORGE_RELEASE && window.NETFORGE_RELEASE.version) || '0.71.1';
  let lastCheckAt = 0;

  function cmpVer(a, b) {
    const pa = String(a || '0').split('.').map(n => parseInt(n, 10) || 0);
    const pb = String(b || '0').split('.').map(n => parseInt(n, 10) || 0);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
      if ((pa[i] || 0) !== (pb[i] || 0)) return (pa[i] || 0) - (pb[i] || 0);
    }
    return 0;
  }

  function ensureBanner(newVer) {
    let b = document.getElementById('nf58UpdateBanner');
    if (!b) {
      b = document.createElement('div');
      b.id = 'nf58UpdateBanner';
      b.setAttribute('role', 'status');
      b.innerHTML = `
        <span id="nf58UpdateText">✨ Versi baru NET FORGE tersedia!</span>
        <button type="button" id="nf58UpdateApply">Perbarui Sekarang</button>
        <button type="button" id="nf58UpdateLater">Nanti</button>
      `;
      document.body.appendChild(b);
      b.querySelector('#nf58UpdateLater').addEventListener('click', () => b.classList.remove('show'));
      b.querySelector('#nf58UpdateApply').addEventListener('click', async () => {
        try {
          if ('caches' in window) {
            const keys = await caches.keys();
            await Promise.all(keys.filter(k => k.startsWith('netforge-pwa-')).map(k => caches.delete(k)));
          }
          if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.getRegistration();
            if (reg?.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' });
            await reg?.update?.();
          }
        } catch (_) {}
        sessionStorage.setItem('nf4041.approved', '1');
        location.replace('./index.html?v=' + encodeURIComponent(newVer || Date.now()));
      });
    }
    const txt = b.querySelector('#nf58UpdateText');
    if (txt && newVer) txt.textContent = '✨ NET FORGE v' + newVer + ' tersedia!';
    b.classList.add('show');
  }

  async function checkSilent(manual) {
    if (location.protocol !== 'http:' && location.protocol !== 'https:') {
      if (manual) {
        const st = document.getElementById('nf58SettingsUpdateText');
        if (st) st.textContent = 'Versi aktif v' + CURRENT + ' (mode file lokal)';
      }
      return;
    }
    const now = Date.now();
    if (!manual && now - lastCheckAt < 300000) return;
    lastCheckAt = now;
    try {
      const res = await fetch('./version.json?t=' + now, { cache: 'no-store' });
      if (!res.ok) return;
      const meta = await res.json();
      const remote = meta && meta.version;
      const st = document.getElementById('nf58SettingsUpdateText');
      if (remote && cmpVer(remote, CURRENT) > 0) {
        if (st) st.textContent = 'Update v' + remote + ' tersedia (aktif: v' + CURRENT + ')';
        ensureBanner(remote);
      } else {
        document.getElementById('nf58UpdateBanner')?.classList.remove('show');
        const legacy = document.getElementById('nf4039UpdateBanner');
        if (legacy) legacy.hidden = true;
        if (manual && st) st.textContent = '✓ Sudah versi terbaru (v' + CURRENT + ')';
      }
    } catch (_) {
      if (manual) {
        const st = document.getElementById('nf58SettingsUpdateText');
        if (st) st.textContent = 'Mode offline · versi aktif v' + CURRENT;
      }
    }
  }

  function injectSettingsCheck() {
    const body = document.querySelector('#nf30Overlay .nf30-body');
    if (!body || document.getElementById('nf58SettingsUpdateCard')) return;
    const card = document.createElement('div');
    card.id = 'nf58SettingsUpdateCard';
    card.innerHTML = `
      <span id="nf58SettingsUpdateText">Versi aktif: v${CURRENT} · Cek update otomatis aktif</span>
      <button type="button" id="nf58SettingsUpdateBtn">⟳ Cek Update</button>
    `;
    body.appendChild(card);
    card.querySelector('#nf58SettingsUpdateBtn').addEventListener('click', () => checkSilent(true));
  }

  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkSilent(false);
  });
  setTimeout(() => { injectSettingsCheck(); checkSilent(false); }, 2000);
  window.NetForgeUpdater = { version: CURRENT, checkNow: () => checkSilent(true) };
})();

/* === script:nf5900-profile-settings-ux === */
(function () {
  'use strict';
  if (window.__NF5900_PROFILE_UX) return;
  window.__NF5900_PROFILE_UX = true;

  const $ = id => document.getElementById(id);
  let wasSignedIn = Boolean(window.NetForgeAuth?.isSignedIn?.());

  function showWelcomeToast(msg) {
    $('nf59LoginToast')?.remove();
    const t = document.createElement('div');
    t.id = 'nf59LoginToast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  function closeSettingsAndPlay() {
    const closeBtn = $('nf30Close');
    const ov = $('nf30Overlay');
    if (closeBtn) closeBtn.click();
    else if (ov) ov.hidden = true;
  }

  function syncMenuAuthState() {
    const signed = Boolean(window.NetForgeAuth?.isSignedIn?.());
    const player = window.NetForgeAuth?.getPlayer?.();
    const googleBtn = $('nf64GoogleFromIntro');
    const label = $('nf346GuestLabel');
    const note = $('nf64AccountNote');
    const actions = document.querySelector('#nf346MenuEntry .nf346-actions');

    if (signed) {
      if (label) label.textContent = '✅ Akun Google · ' + (player?.name || 'Pemain Resmi');
      if (note) note.textContent = 'Sesi Google aktif. Progres dan pencapaian Anda siap disinkronkan ke Cloud.';
      if (googleBtn) googleBtn.style.setProperty('display', 'none', 'important');
      if (actions && !$('nf59CloudPill')) {
        const pill = document.createElement('span');
        pill.id = 'nf59CloudPill';
        pill.textContent = '☁️ Cloud Sync Aktif';
        actions.prepend(pill);
      }
    } else {
      if (googleBtn) googleBtn.style.removeProperty('display');
      $('nf59CloudPill')?.remove();
    }
  }

  function organizeSettingsModal() {
    const ov = $('nf30Overlay');
    if (!ov) return;

    const head = ov.querySelector('.nf30-head');
    const closeBtn = $('nf30Close');
    if (head && closeBtn && !$('nf59PlayNowBtn')) {
      const wrap = document.createElement('div');
      wrap.className = 'nf59-head-actions';
      const playBtn = document.createElement('button');
      playBtn.id = 'nf59PlayNowBtn';
      playBtn.type = 'button';
      playBtn.textContent = '▶ Lanjut ke Permainan';
      playBtn.addEventListener('click', closeSettingsAndPlay);
      closeBtn.parentElement.insertBefore(wrap, closeBtn);
      wrap.append(playBtn, closeBtn);
    }

    const authPanel = $('nf350AuthPanel');
    if (authPanel && !$('nf59AuthDiag')) {
      const verify = $('nf367Verify');
      const diag = $('nf362Diagnose');
      const diagOut = $('nf362DiagOutput');
      if (verify || diag) {
        const det = document.createElement('details');
        det.id = 'nf59AuthDiag';
        det.innerHTML = '<summary>🔧 Diagnostik &amp; Verifikasi Sesi</summary><div class="nf59-diag-body"></div>';
        const dBody = det.querySelector('.nf59-diag-body');
        if (verify) dBody.appendChild(verify);
        if (diag) dBody.appendChild(diag);
        if (diagOut) dBody.appendChild(diagOut);
        authPanel.appendChild(det);
      }
    }

    const body = ov.querySelector('.nf30-body');
    if (body && !$('nf59AdvancedPanel')) {
      const adv = document.createElement('details');
      adv.id = 'nf59AdvancedPanel';
      adv.innerHTML = '<summary>🛠️ Pengaturan Server API, Backup &amp; Data Lanjutan</summary><div id="nf59AdvancedBody"></div>';
      const advBody = adv.querySelector('#nf59AdvancedBody');

      const toMove = [];
      const apiCard = $('nf32Url')?.closest('section');
      if (apiCard) toMove.push(apiCard);
      [...body.children].forEach(ch => {
        if (ch.tagName !== 'SECTION') return;
        const h = ch.querySelector('h3')?.textContent || '';
        if (ch.querySelector('#nf30Name') || /Backup|Kelola Data Lokal/i.test(h)) {
          toMove.push(ch);
        }
      });

      if (toMove.length) {
        toMove.forEach(c => advBody.appendChild(c));
        body.appendChild(adv);
      }
    }

    const loginBtn = $('nf350Login');
    if (loginBtn && !loginBtn.__nf59Hook) {
      loginBtn.__nf59Hook = true;
      loginBtn.addEventListener('click', () => {
        const urlEl = $('nf32Url');
        if (urlEl && !urlEl.value.trim()) {
          const adv = $('nf59AdvancedPanel');
          if (adv) {
            adv.open = true;
            setTimeout(() => urlEl.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
          }
        }
      });
    }
  }

  document.addEventListener('click', e => {
    if (e.target.closest?.('#nf64GoogleFromIntro')) {
      setTimeout(() => {
        organizeSettingsModal();
        const urlEl = $('nf32Url');
        const loginBtn = $('nf350Login');
        if (urlEl && urlEl.value.trim() && loginBtn && !loginBtn.hidden && !window.NetForgeAuth?.isSignedIn?.()) {
          loginBtn.click();
        }
      }, 220);
    }
  }, true);

  window.addEventListener('netforge:auth-change', () => {
    const nowSigned = Boolean(window.NetForgeAuth?.isSignedIn?.());
    syncMenuAuthState();
    if (!wasSignedIn && nowSigned) {
      const name = window.NetForgeAuth?.getPlayer?.()?.name || 'Pemain';
      const ov = $('nf30Overlay');
      if (ov && !ov.hidden) {
        showWelcomeToast('✅ Masuk sebagai ' + name + '! Membuka permainan…');
        setTimeout(closeSettingsAndPlay, 900);
      } else {
        showWelcomeToast('✅ Sesi Google aktif: ' + name);
      }
    }
    wasSignedIn = nowSigned;
  });

  function bindWhenReady() {
    organizeSettingsModal();
    syncMenuAuthState();
    return Boolean($('nf59PlayNowBtn'));
  }
  document.addEventListener('DOMContentLoaded', () => {
    if (!bindWhenReady() && window.MutationObserver) {
      const obs = new MutationObserver(() => {
        if (bindWhenReady()) obs.disconnect();
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => obs.disconnect(), 15000);
    }
  });
})();
