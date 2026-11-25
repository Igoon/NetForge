/* === script:nf4093-pwa-status-fade === */
/* v0.67.0: status PWA tampil 7 detik tiap kali teksnya berubah, lalu memudar. */
(function(){'use strict';var timer=null;
function arm(el){el.classList.remove('nf4093-faded');clearTimeout(timer);timer=setTimeout(function(){el.classList.add('nf4093-faded')},7000)}
function init(){var el=document.getElementById('nf330PwaStatus');if(!el)return false;arm(el);
 if(window.MutationObserver){new MutationObserver(function(){arm(el)}).observe(el,{childList:true,characterData:true,subtree:true})}return true}
var tries=0;(function wait(){if(init()||++tries>40)return;setTimeout(wait,500)})();
})();
;

/* === script:nf4200-ui-helper === */
/* NET FORGE v0.67.0 — Sync LED online badges on canvas nodes + faster PWA toast fade */
(function () {
  'use strict';
  if (window.__NF4200_UI) return;
  window.__NF4200_UI = true;

  function syncNodeLeds() {
    const canvas = document.getElementById('nf400Canvas');
    if (!canvas) return;
    canvas.querySelectorAll('.nf400-node').forEach(node => {
      const txt = (node.textContent || '');
      const isOnline = /LINK UP|ONLINE|ACTIVE/i.test(txt) && !/OFFLINE/i.test(txt);
      node.classList.toggle('nf42-online', isOnline);
    });
  }

  // Sync LEDs on clicks/evaluations without heavy continuous polling
  document.addEventListener('click', () => setTimeout(syncNodeLeds, 160), true);
  setInterval(syncNodeLeds, 2500);

  // Fade PWA local-mode banner faster (3.5s) so it never sits over canvas
  setTimeout(() => {
    const pwa = document.getElementById('nf330PwaStatus');
    if (pwa) pwa.classList.add('nf4093-faded');
  }, 3500);
})();
;

/* === script:nf4300-shell-controller === */
/* NET FORGE v0.67.0 — Single-Screen 100dvh App Shell & Collapsible Bottom Drawer */
(function () {
  'use strict';
  if (window.__NF4300_SHELL) return;
  window.__NF4300_SHELL = true;

  const $ = id => document.getElementById(id);
  let activeTab = null;

  function ensureDrawerUI() {
    const wsShell = document.querySelector('section.workspace-shell');
    if (!wsShell) return false;
    document.body.classList.add('nf43-shell-active');

    if (!$('nf43DrawerBar')) {
      const bar = document.createElement('div');
      bar.id = 'nf43DrawerBar';
      bar.innerHTML = `
        <div class="nf43-tabs">
          <button type="button" id="nf43TabPanel">📊 Log, Trafik & Progres ▲</button>
          <button type="button" id="nf43TabDock">⌁ Terminal & Chaos ▲</button>
        </div>
        <span class="nf43-hint">Layar penuh aktif · klik panel untuk buka/tutup</span>
      `;
      wsShell.appendChild(bar);
    }

    if (!$('nf43DrawerSheet')) {
      const sheet = document.createElement('div');
      sheet.id = 'nf43DrawerSheet';
      sheet.setAttribute('role', 'dialog');
      sheet.innerHTML = `
        <div class="nf43-sheet-head">
          <strong id="nf43SheetTitle">Panel Detail</strong>
          <button type="button" class="nf43-sheet-close" id="nf43SheetClose">✕ Tutup</button>
        </div>
        <div id="nf43DrawerBody"></div>
      `;
      document.body.appendChild(sheet);

      const closeSheet = () => {
        sheet.classList.remove('open');
        activeTab = null;
        $('nf43TabPanel')?.classList.remove('active');
        $('nf43TabDock')?.classList.remove('active');
      };

      $('nf43SheetClose').addEventListener('click', closeSheet);
      document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && sheet.classList.contains('open')) closeSheet();
      });

      const openTab = (which) => {
        if (activeTab === which && sheet.classList.contains('open')) {
          closeSheet();
          return;
        }
        const body = $('nf43DrawerBody');
        const panel = $('nf400Panel');
        const dock = $('commandDock');
        // Move panels into drawer body once, toggle visibility cleanly
        if (panel && panel.parentElement !== body) body.appendChild(panel);
        if (dock && dock.parentElement !== body) body.appendChild(dock);

        if (panel) panel.style.setProperty('display', which === 'panel' ? 'block' : 'none', 'important');
        if (dock) dock.style.setProperty('display', which === 'dock' ? 'grid' : 'none', 'important');

        $('nf43SheetTitle').textContent = which === 'panel'
          ? '📊 Log Aktivitas, Trafik, Evaluasi & Progres'
          : '⌁ Terminal Jaringan, Log Live & Chaos Event';
        $('nf43TabPanel')?.classList.toggle('active', which === 'panel');
        $('nf43TabDock')?.classList.toggle('active', which === 'dock');
        activeTab = which;
        sheet.classList.add('open');
      };

      $('nf43TabPanel').addEventListener('click', () => openTab('panel'));
      $('nf43TabDock').addEventListener('click', () => openTab('dock'));
    }
    return true;
  }

  let tries = 0;
  (function boot() {
    if (ensureDrawerUI() || ++tries > 20) return;
    setTimeout(boot, 350);
  })();
})();
;

/* === script:nf5600-streamline === */
(function () {
  'use strict';
  if (window.__NF5600_CLEAN) return;
  window.__NF5600_CLEAN = true;
  function pruneRedundantUI() {
    // Keep only "Petunjuk" & "Tunjukkan" inside Iga actions
    document.querySelectorAll('#nf4034Coach .nf4034-actions button').forEach(btn => {
      const t = (btn.textContent || '').toLowerCase();
      if (t.includes('jelaskan') || t.includes('panduan') || t.includes('sambung port')) {
        btn.style.display = 'none';
      }
    });
    // Hide Legacy Classic Mode card in mission picker
    document.querySelectorAll('button').forEach(btn => {
      if ((btn.textContent || '').includes('Mode Klasik (Kompatibilitas)')) {
        btn.style.display = 'none';
      }
    });
  }
  let n = 0;
  (function run() {
    pruneRedundantUI();
    if (++n < 15) setTimeout(run, 400);
  })();
  document.addEventListener('click', () => setTimeout(pruneRedundantUI, 150), true);
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
    // Move startup checkboxes into the collapsible "Pengaturan & Lainnya" drawer
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

  let k = 0;
  (function tick() {
    polishMainMenu();
    if (++k < 14) setTimeout(tick, 350);
  })();
  document.addEventListener('click', () => setTimeout(polishMainMenu, 150), true);
})();

/* === script:nf5800-autoupdate === */
/* NET FORGE v0.67.0 — Silent Background Update Checker & Non-Intrusive Banner */
(function () {
  'use strict';
  if (window.__NF5800_UPDATER) return;
  window.__NF5800_UPDATER = true;

  const CURRENT = (window.NETFORGE_RELEASE && window.NETFORGE_RELEASE.version) || '0.67.0';
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
        const b = document.getElementById('nf58UpdateBanner');
        if (b) b.classList.remove('show');
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
  setTimeout(() => { injectSettingsCheck(); checkSilent(false); }, 2500);
  window.NetForgeUpdater = { version: CURRENT, checkNow: () => checkSilent(true) };
})();

/* === script:nf5900-profile-settings-ux === */
/* NET FORGE v0.67.0 — Seamless Post-Google-Login Transition & Decluttered Settings Modal */
(function () {
  'use strict';
  if (window.__NF5900_PROFILE_UX) return;
  window.__NF5900_PROFILE_UX = true;

  const $ = id => document.getElementById(id);
  let wasSignedIn = Boolean(window.NetForgeAuth?.isSignedIn?.());
  let cameFromIntroGoogle = false;

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

    // 1. Add prominent "▶ Lanjut ke Permainan" button in modal header
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

    // 2. Tuck diagnostic buttons inside #nf350AuthPanel into collapsible <details>
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

    // 3. Tuck technical server API URL, legacy duplicate profile, backup & local reset cards into collapsible Advanced drawer
    const body = ov.querySelector('.nf30-body');
    if (body && !$('nf59AdvancedPanel')) {
      const adv = document.createElement('details');
      adv.id = 'nf59AdvancedPanel';
      adv.innerHTML = '<summary>🛠️ Pengaturan Server API, Backup &amp; Data Lanjutan</summary><div id="nf59AdvancedBody"></div>';
      const advBody = adv.querySelector('#nf59AdvancedBody');

      const toMove = [];
      // Move legacy API URL / Token card
      const apiCard = $('nf32Url')?.closest('section');
      if (apiCard) toMove.push(apiCard);
      // Move legacy duplicate Profil Pemain (#nf30Name), Backup, and Local Data cards
      [...body.children].forEach(ch => {
        if (ch.tagName !== 'SECTION') return;
        const h = (ch.querySelector('h3')?.textContent || '');
        if (ch.querySelector('#nf30Name') || /Backup|Kelola Data Lokal/i.test(h)) {
          toMove.push(ch);
        }
      });

      if (toMove.length) {
        toMove.forEach(c => advBody.appendChild(c));
        body.appendChild(adv);
      }
    }

    // 4. Smart fallback: if API URL is empty when clicking #nf350Login, auto-open Advanced drawer so admin sees #nf32Url
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

  // Track if user initiated Google Login from the Intro/Menu card
  document.addEventListener('click', e => {
    if (e.target.closest?.('#nf64GoogleFromIntro')) {
      cameFromIntroGoogle = true;
      setTimeout(() => {
        organizeSettingsModal();
        // Auto-trigger Google sign-in mount if URL is already configured so user doesn't have to click twice!
        const urlEl = $('nf32Url');
        const loginBtn = $('nf350Login');
        if (urlEl && urlEl.value.trim() && loginBtn && !loginBtn.hidden && !window.NetForgeAuth?.isSignedIn?.()) {
          loginBtn.click();
        }
      }, 220);
    }
  }, true);

  // Seamless post-login transition: auto-close Settings modal & enter game right after Google Login succeeds!
  window.addEventListener('netforge:auth-change', () => {
    const nowSigned = Boolean(window.NetForgeAuth?.isSignedIn?.());
    syncMenuAuthState();
    if (!wasSignedIn && nowSigned) {
      const name = window.NetForgeAuth?.getPlayer?.()?.name || 'Pemain';
      const ov = $('nf30Overlay');
      if (ov && !ov.hidden) {
        showWelcomeToast('✅ Masuk sebagai ' + name + '! Membuka permainan…');
        setTimeout(() => {
          closeSettingsAndPlay();
          cameFromIntroGoogle = false;
        }, 900);
      } else {
        showWelcomeToast('✅ Sesi Google aktif: ' + name);
      }
    }
    wasSignedIn = nowSigned;
  });

  let n = 0;
  (function boot() {
    organizeSettingsModal();
    syncMenuAuthState();
    if (++n < 16) setTimeout(boot, 400);
  })();
})();
