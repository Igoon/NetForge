/* === script:nf4093-pwa-status-fade === */
/* v0.57.00: status PWA tampil 7 detik tiap kali teksnya berubah, lalu memudar. */
(function(){'use strict';var timer=null;
function arm(el){el.classList.remove('nf4093-faded');clearTimeout(timer);timer=setTimeout(function(){el.classList.add('nf4093-faded')},7000)}
function init(){var el=document.getElementById('nf330PwaStatus');if(!el)return false;arm(el);
 if(window.MutationObserver){new MutationObserver(function(){arm(el)}).observe(el,{childList:true,characterData:true,subtree:true})}return true}
var tries=0;(function wait(){if(init()||++tries>40)return;setTimeout(wait,500)})();
})();
;

/* === script:nf4200-ui-helper === */
/* NET FORGE v0.57.00 — Sync LED online badges on canvas nodes + faster PWA toast fade */
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
/* NET FORGE v0.57.00 — Single-Screen 100dvh App Shell & Collapsible Bottom Drawer */
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
