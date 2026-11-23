/* === script:nf4100-alive-engine === */
/* NET FORGE v0.56.00 — Alive, Fun & Funny Gameplay Layer
   1. Dynamic Iga Expressions + Reactive Funny Quips
   2. Web Audio Micro-SFX (RJ45 Click, Pop, Cat Meow, Error Bonk, Victory Fanfare)
   3. Animated Packet Flow Pulses & Offline Error Sparks on Unified Canvas
   4. Interactive "Si Oyen" Cat Chaos Event on Canvas Devices (+25 XP)
   5. 3-Star Mission Victory Card & Funny Client Testimonials */
(function () {
  'use strict';
  if (window.__NF4100_LOADED) return;
  window.__NF4100_LOADED = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  // =========================================================================
  // 1. WEB AUDIO MICRO-SFX ENGINE (zero external assets, mute-aware)
  // =========================================================================
  let audioCtx = null;
  function sfxAllowed() {
    const btn = $('nf4031Sound');
    if (btn && /mati|mute|off/i.test(btn.textContent || '')) return false;
    return true;
  }
  function getCtx() {
    if (!sfxAllowed()) return null;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!audioCtx) audioCtx = new AC();
      if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
      return audioCtx;
    } catch (_) { return null; }
  }
  function playTone(freq, endFreq, dur, type, vol, delay) {
    const ctx = getCtx();
    if (!ctx) return;
    try {
      const now = ctx.currentTime + (delay || 0);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, now);
      if (endFreq && endFreq !== freq) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(40, endFreq), now + dur);
      }
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(vol || 0.12, now + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, now + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + dur + 0.02);
    } catch (_) {}
  }
  const SFX = {
    pop() { playTone(320, 560, 0.09, 'triangle', 0.11, 0); },
    cableClick() {
      playTone(920, 420, 0.045, 'square', 0.08, 0);
      playTone(1380, 1120, 0.055, 'triangle', 0.09, 0.035);
    },
    errorBonk() {
      playTone(210, 125, 0.16, 'sawtooth', 0.09, 0);
      playTone(165, 110, 0.18, 'sawtooth', 0.08, 0.11);
    },
    catMeow() {
      playTone(540, 790, 0.16, 'triangle', 0.11, 0);
      playTone(790, 460, 0.24, 'triangle', 0.1, 0.15);
    },
    catPurrHappy() {
      playTone(523, 659, 0.11, 'sine', 0.11, 0);
      playTone(659, 880, 0.14, 'sine', 0.11, 0.09);
    },
    victory() {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((n, i) => playTone(n, n * 1.01, 0.18, 'triangle', 0.13, i * 0.095));
    }
  };

  // =========================================================================
  // 2. IGA ALIVE EXPRESSIONS & REACTIVE FUNNY QUIPS
  // =========================================================================
  const MOOD_BADGES = {
    talk: '💬',
    success: '✅',
    celebrate: '🏆',
    fail: '❌',
    panic: '😱',
    confused: '🤔',
    think: '💡'
  };
  let lastQuipAt = 0;
  function igaReact(text, mood, force) {
    const now = Date.now();
    if (!force && now - lastQuipAt < 1800) return;
    lastQuipAt = now;
    const m = MOOD_BADGES[mood] ? mood : 'talk';
    try {
      if (typeof window.netforgeIgaSay === 'function') {
        window.netforgeIgaSay(text, m);
      } else {
        const bubble = $('igaTalk');
        if (bubble) bubble.textContent = text;
      }
    } catch (_) {}
    const av = $('igaAvatar');
    if (av) {
      av.setAttribute('data-nf41-mood', m);
      av.setAttribute('data-nf41-badge', MOOD_BADGES[m]);
    }
    const bubble = $('igaTalk');
    if (bubble) {
      bubble.classList.remove('nf41-pop');
      void bubble.offsetWidth;
      bubble.classList.add('nf41-pop');
    }
  }

  // Wrap netforgeIgaSay so every existing call also updates the expression badge
  function wrapIgaSay() {
    if (typeof window.netforgeIgaSay !== 'function' || window.netforgeIgaSay.__nf41) return;
    const orig = window.netforgeIgaSay;
    const wrapped = function (s, mood) {
      const m = MOOD_BADGES[mood] ? mood : 'talk';
      const res = orig.call(this, s, m);
      const av = $('igaAvatar');
      if (av) {
        av.setAttribute('data-nf41-mood', m);
        av.setAttribute('data-nf41-badge', MOOD_BADGES[m]);
      }
      return res;
    };
    wrapped.__nf41 = true;
    window.netforgeIgaSay = wrapped;
    const av = $('igaAvatar');
    if (av && !av.getAttribute('data-nf41-badge')) {
      av.setAttribute('data-nf41-mood', 'talk');
      av.setAttribute('data-nf41-badge', '💬');
    }
  }

  const ADD_QUIPS = [
    'Perangkat terpasang! Tinggal klik port-nya langsung buat narik kabel.',
    'Sip, alat baru mendarat mulus di kanvas!',
    'Cakep! Ingat, kabel rapi bikin hidup teknisi lebih damai.'
  ];
  const CABLE_QUIPS = [
    'Klik! Konektor RJ45 masuk sempurna. Paket data siap meluncur!',
    'Mantap, kabel tersambung! Lampu link langsung menyala hijau.',
    'Koneksi rapi! Klien bakal senang lihat jaringan sebersih ini.'
  ];
  let quipIdx = 0;

  // =========================================================================
  // 3. ANIMATED PACKET FLOW & ERROR SPARKS ON #nf400Canvas
  // =========================================================================
  function ensurePacketLayer() {
    const canvas = $('nf400Canvas');
    if (!canvas) return null;
    let svg = $('nf41PacketLayer');
    if (!svg) {
      svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.id = 'nf41PacketLayer';
      canvas.appendChild(svg);
    }
    return svg;
  }

  function spawnSpark(nodeEl, label, isOk) {
    const canvas = $('nf400Canvas');
    if (!canvas || !nodeEl) return;
    const cr = canvas.getBoundingClientRect();
    const nr = nodeEl.getBoundingClientRect();
    const div = document.createElement('div');
    div.className = 'nf41-spark' + (isOk ? ' ok' : '');
    div.textContent = label;
    div.style.left = (nr.left - cr.left + nr.width / 2) + 'px';
    div.style.top = Math.max(8, nr.top - cr.top - 6) + 'px';
    canvas.appendChild(div);
    setTimeout(() => div.remove(), 2250);
  }

  function launchPacketBurst(countPerWire) {
    if (window.NetForgeVisualFX && window.NetForgeVisualFX.emitAmbientTraffic) {
      window.NetForgeVisualFX.emitAmbientTraffic();
      return document.querySelectorAll('#nf400Wires line.nf400-wire').length;
    }
    const wiresSvg = $('nf400Wires');
    const layer = ensurePacketLayer();
    if (!wiresSvg || !layer) return 0;
    const lines = [...wiresSvg.querySelectorAll('line.nf400-wire')];
    if (!lines.length) return 0;

    // Match viewBox / dimensions with #nf400Wires
    const vb = wiresSvg.getAttribute('viewBox');
    if (vb) layer.setAttribute('viewBox', vb);
    else layer.removeAttribute('viewBox');

    const perWire = countPerWire || 2;
    lines.forEach((ln, idx) => {
      const x1 = parseFloat(ln.getAttribute('x1') || '0');
      const y1 = parseFloat(ln.getAttribute('y1') || '0');
      const x2 = parseFloat(ln.getAttribute('x2') || '0');
      const y2 = parseFloat(ln.getAttribute('y2') || '0');
      if (x1 === x2 && y1 === y2) return;
      const isDown = ln.classList.contains('nf4045-down') || ln.classList.contains('down');
      const color = isDown ? '#ff6b81' : '#52ffcb';
      for (let k = 0; k < perWire; k++) {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const vbP = (vb || '').trim().split(/\s+/).map(Number); const rV = (vbP.length === 4 && vbP[2] > 0) ? Math.max(0.5, vbP[2] / 170).toFixed(2) : (isDown ? '4.5' : '4'); dot.setAttribute('r', rV);
        dot.setAttribute('fill', color);
        dot.setAttribute('opacity', '0.95');
        layer.appendChild(dot);
        const startAt = performance.now() + k * 240 + (idx % 3) * 60;
        const dur = isDown ? 520 : 720;
        const forward = k % 2 === 0;
        function step(ts) {
          const t = (ts - startAt) / dur;
          if (t < 0) { requestAnimationFrame(step); return; }
          if (t >= 1) { dot.remove(); return; }
          const p = isDown ? Math.min(0.52, t) : (forward ? t : 1 - t);
          dot.setAttribute('cx', (x1 + (x2 - x1) * p).toFixed(1));
          dot.setAttribute('cy', (y1 + (y2 - y1) * p).toFixed(1));
          if (isDown && t > 0.5) dot.setAttribute('opacity', String(Math.max(0, 1 - (t - 0.5) * 2)));
          requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
    });
    return lines.length;
  }

  // =========================================================================
  // 4. INTERACTIVE CAT CHAOS EVENT ("SI OYEN")
  // =========================================================================
  let catActiveNode = null;
  let catCountResolved = 0;
  const CAT_SVG = `
    <svg class="nf41-cat-svg" viewBox="0 0 80 60" aria-hidden="true">
      <ellipse cx="40" cy="52" rx="28" ry="6" fill="rgba(0,0,0,0.35)"/>
      <path d="M16 44 Q12 24 26 20 L25 9 L35 17 Q42 15 49 17 L59 9 L58 20 Q70 25 66 44 Q54 52 40 52 Q24 52 16 44 Z" fill="#f59f3d" stroke="#7c3a0d" stroke-width="2.5"/>
      <path d="M27 17 L27 12 L32 16 M56 17 L56 12 L51 16" fill="#ffb899"/>
      <path d="M29 31 Q33 27 37 31 M45 31 Q49 27 53 31" fill="none" stroke="#472005" stroke-width="2.4" stroke-linecap="round"/>
      <polygon points="39,34 43,34 41,37" fill="#ff7675"/>
      <path d="M36 39 Q41 42 46 39" fill="none" stroke="#472005" stroke-width="2" stroke-linecap="round"/>
      <path d="M64 42 Q76 34 72 24" fill="none" stroke="#f59f3d" stroke-width="5" stroke-linecap="round"/>
    </svg>`;

  function spawnCatChaos() {
    const canvas = $('nf400Canvas');
    if (!canvas) return false;
    const nodeEls = [...canvas.querySelectorAll('[data-node]')];
    if (!nodeEls.length) {
      igaReact('Si Oyen mau tidur di atas perangkat, tapi kanvas masih kosong! Tambah Router atau PC dulu ya.', 'confused', true);
      SFX.errorBonk();
      return false;
    }
    // Remove previous cat if any
    canvas.querySelectorAll('.nf41-cat-overlay').forEach(el => el.remove());
    canvas.querySelectorAll('.nf41-cat-hot').forEach(el => el.classList.remove('nf41-cat-hot'));

    const target = nodeEls[Math.floor(Math.random() * nodeEls.length)];
    catActiveNode = target;
    target.classList.add('nf41-cat-hot');

    const wrap = document.createElement('div');
    wrap.className = 'nf41-cat-overlay';
    wrap.setAttribute('role', 'button');
    wrap.setAttribute('tabindex', '0');
    wrap.title = 'Klik untuk membujuk Si Oyen turun dengan ikan!';
    wrap.innerHTML = '<span class="nf41-cat-badge">🐱 Zzz... Panas! Klik kasih ikan 🐟</span>' + CAT_SVG;

    const rescue = ev => {
      if (ev) { ev.stopPropagation(); ev.preventDefault(); }
      wrap.remove();
      target.classList.remove('nf41-cat-hot');
      catActiveNode = null;
      catCountResolved++;
      SFX.catPurrHappy();
      spawnSpark(target, '❤️ Meong! +25 XP', true);
      // Add +25 XP visually if XP counter exists
      try {
        const xpEl = document.querySelector('#xp, [id*="xp" i]');
        if (xpEl && /\d+/.test(xpEl.textContent)) {
          xpEl.textContent = xpEl.textContent.replace(/\d+/, m => String(Number(m) + 25));
        }
      } catch (_) {}
      igaReact('Haha berhasil! Si Oyen langsung turun demi ikan tuna. Suhu perangkat aman kembali (+25 XP)!', 'celebrate', true);
    };
    wrap.addEventListener('click', rescue);
    wrap.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') rescue(e); });
    target.appendChild(wrap);

    SFX.catMeow();
    const devName = (target.querySelector('strong, .name, b')?.textContent || 'perangkat').trim();
    igaReact('AWAS! Si Oyen naik dan tidur di atas ' + devName + '! Klik kucingnya untuk membujuknya turun pakai ikan sebelum overheat!', 'panic', true);
    return true;
  }

  function injectCatButton() {
    if ($('nf41CatBtn')) return;
    const banner = $('nf403MissionBanner');
    const runBtn = $('nf403RunMission');
    const host = runBtn ? runBtn.parentElement : banner;
    if (!host) return;
    const btn = document.createElement('button');
    btn.id = 'nf41CatBtn';
    btn.type = 'button';
    btn.textContent = '🐱 Chaos: Si Oyen';
    btn.title = 'Panggil insiden kocak Si Oyen tidur di atas perangkat jaringan!';
    btn.addEventListener('click', () => spawnCatChaos());
    host.appendChild(btn);
  }

  // =========================================================================
  // 5. 3-STAR VICTORY SCORECARD & FUNNY CLIENT TESTIMONIALS
  // =========================================================================
  const CLIENT_QUOTES = {
    basics: [
      { who: 'Pak RT — Warga RT 04', text: '"Alhamdulillah! Wi-Fi pos ronda lancar jaya, nonton bola malam ini gak buffering lagi!"' },
      { who: 'Mbak Rina — Pemilik Warkop Digital', text: '"Pelanggan yang tadinya ngamuk kalah push rank sekarang senyum semua. Teknisi jempolan!"' }
    ],
    smart: [
      { who: 'Keluarga Santoso — Smart Home', text: '"Smart TV nyala, kamera CCTV aman, bahkan lampu IoT nurut! Si Oyen juga terpantau jelas."' }
    ],
    office: [
      { who: 'Pak Budi — Manajer Kantor', text: '"Akhirnya semua PC bisa akses Server sebelum deadline! Bonus kopi susu buat tim jaringan!"' }
    ],
    mixed: [
      { who: 'Tim QA Lab Jaringan', text: '"Topologi rapi, paket data melesat tanpa drama. Layak dipamerkan ke ruang server!"' }
    ]
  };

  let lastVictorySignature = '';
  function ensureVictoryModal() {
    if ($('nf41VictoryModal')) return $('nf41VictoryModal');
    const m = document.createElement('div');
    m.id = 'nf41VictoryModal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    m.innerHTML = `
      <div class="nf41-vcard">
        <div class="nf41-vhead">
          <span class="nf41-vtag">🏆 Misi Jaringan Tuntas</span>
          <button type="button" class="nf41-vclose" id="nf41VClose">✕ Tutup</button>
        </div>
        <h3 class="nf41-vtitle" id="nf41VTitle">Jaringan Lancar Jaya!</h3>
        <div class="nf41-stars" id="nf41VStars">
          <span class="nf41-star">⭐</span>
          <span class="nf41-star">⭐</span>
          <span class="nf41-star">⭐</span>
        </div>
        <ul class="nf41-criteria" id="nf41VCriteria"></ul>
        <div class="nf41-quote" id="nf41VQuote"></div>
        <div class="nf41-vactions">
          <button type="button" id="nf41VOk">Lanjut Petualangan 🚀</button>
        </div>
      </div>`;
    document.body.appendChild(m);
    const close = () => m.classList.remove('open');
    m.querySelector('#nf41VClose').addEventListener('click', close);
    m.querySelector('#nf41VOk').addEventListener('click', close);
    m.addEventListener('click', e => { if (e.target === m) close(); });
    return m;
  }

  function showVictoryCard() {
    const state = API()?.getState?.() || {};
    const profile = (API()?.getProfile?.() || 'basics').toLowerCase();
    const nodes = state.nodes || [];
    const budgetText = document.body.innerText.match(/\$\s*(-?\d[\d,]*)/);
    const budgetVal = budgetText ? Number(budgetText[1].replace(/,/g, '')) : 900;

    const thresholds = {
      basics: { minBudget: 1000, maxNodes: 5 },
      smart:  { minBudget: 420,  maxNodes: 9 },
      office: { minBudget: 280,  maxNodes: 8 },
      free:   { minBudget: 500,  maxNodes: 10 }
    }[profile] || { minBudget: 500, maxNodes: 8 };

    const report = window.NetForgeMissionValidator?.assess?.(profile === 'free' ? 'basics' : profile) || { passed: 3, total: 3, score: 100 };
    const star1 = true;
    const star2 = budgetVal >= thresholds.minBudget;
    const star3 = nodes.length <= thresholds.maxNodes && !catActiveNode;
    const stars = (star1 ? 1 : 0) + (star2 ? 1 : 0) + (star3 ? 1 : 0);

    const modal = ensureVictoryModal();
    const card = modal.querySelector('.nf41-vcard');
    card.querySelectorAll('.nf41-confetti').forEach(c => c.remove());

    const starEls = modal.querySelectorAll('.nf41-star');
    starEls.forEach((el, i) => el.classList.toggle('lit', i < stars));

    $('nf41VTitle').textContent = stars === 3 ? 'Sempurna! Teknisi Legendaris!' : (stars === 2 ? 'Keren! Jaringan Stabil!' : 'Misi Lulus!');
    $('nf41VCriteria').innerHTML = [
      `<li><span>${star1 ? '✅' : '⬜'}</span><span>Semua objective misi terpenuhi (${report.passed}/${report.total} · Skor ${report.score}%)</span></li>`,
      `<li><span>${star2 ? '✅' : '⬜'}</span><span>Hemat budget proyek (sisa $${budgetVal} ≥ $${thresholds.minBudget})</span></li>`,
      `<li><span>${star3 ? '✅' : '⬜'}</span><span>Topologi efisien & bebas gangguan (${nodes.length} ≤ ${thresholds.maxNodes} perangkat)</span></li>`
    ].join('');

    const pool = CLIENT_QUOTES[profile] || CLIENT_QUOTES.basics;
    const q = pool[Math.floor(Math.random() * pool.length)];
    $('nf41VQuote').innerHTML = `<strong>💬 Testimoni ${q.who}</strong>${q.text}`;

    // Spawn lightweight confetti pieces
    const colors = ['#48d9ff', '#52ffcb', '#ffd54f', '#ff7675', '#a29bfe'];
    for (let i = 0; i < 18; i++) {
      const c = document.createElement('span');
      c.className = 'nf41-confetti';
      c.style.left = (6 + Math.random() * 88) + '%';
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = (Math.random() * 0.35).toFixed(2) + 's';
      card.appendChild(c);
    }

    modal.classList.add('open');
    SFX.victory();
    igaReact('BOOM! ' + stars + '/3 Bintang! Jaringan lancar jaya dan klien langsung kasih testimoni puas!', 'celebrate', true);
  }

  // =========================================================================
  // 6. HOOK INTO GAME EVENTS CLEANLY (ZERO POLLING / ZERO HEAVY OBSERVERS)
  // =========================================================================
  function checkEvaluationOutcome() {
    const canvas = $('nf400Canvas');
    const wireCount = launchPacketBurst(2);
    const rightText = (document.querySelector('.right')?.innerText || '');
    const passed = rightText.includes('MISI TUNTAS') || rightText.includes('LULUS') || /(\d+)\s*\/\s*\1\s+objective/.test(rightText);

    if (passed) {
      if (canvas) {
        canvas.querySelectorAll('[data-node]').forEach(el => spawnSpark(el, '✓ OK', true));
      }
      const sig = (API()?.getMode?.() || 'm') + ':' + (API()?.getState?.()?.nodes?.length || 0) + ':' + wireCount;
      if (sig !== lastVictorySignature) {
        lastVictorySignature = sig;
        setTimeout(showVictoryCard, 350);
      } else {
        SFX.victory();
      }
    } else {
      SFX.errorBonk();
      if (canvas) {
        const offlineNodes = [...canvas.querySelectorAll('[data-node]')].filter(el => /offline/i.test(el.textContent || ''));
        offlineNodes.forEach(el => spawnSpark(el, '❓ Belum tersambung!', false));
        if (offlineNodes.length) {
          igaReact('Waduh, masih ada ' + offlineNodes.length + ' perangkat OFFLINE! Klik langsung port LAN1 ke ETH0 untuk menyambung kabelnya.', 'fail', true);
        } else {
          igaReact('Paket belum tembus semua objective. Coba cek koneksi atau konfigurasi IP perangkat ya!', 'confused', true);
        }
      }
    }
  }

  function wireHooks() {
    wrapIgaSay();
    injectCatButton();

    // Hook Evaluasi Misi button
    const evalBtn = $('nf403RunMission');
    if (evalBtn && !evalBtn.__nf41Hook) {
      evalBtn.__nf41Hook = true;
      evalBtn.addEventListener('click', () => {
        setTimeout(checkEvaluationOutcome, 180);
      });
    }

    // Hook device palette additions (pop SFX + funny Router quip)
    const palette = $('nf400List');
    if (palette && !palette.__nf41Hook) {
      palette.__nf41Hook = true;
      palette.addEventListener('click', e => {
        const btn = e.target.closest('button, .nf400-device');
        if (!btn) return;
        SFX.pop();
        setTimeout(() => {
          const nodes = API()?.getState?.()?.nodes || [];
          const routers = nodes.filter(n => n.type === 'router').length;
          if (routers >= 3) {
            igaReact('Wah, sudah pasang ' + routers + ' Router! Mau bikin warnet sekecamatan nih? Satu Router saja biasanya cukup kok!', 'confused', true);
          } else {
            igaReact(ADD_QUIPS[quipIdx++ % ADD_QUIPS.length], 'think', false);
          }
        }, 120);
      });
    }

    // Hook wire creation via unified canvas clicks on ports
    const canvas = $('nf400Canvas');
    if (canvas && !canvas.__nf41Hook) {
      canvas.__nf41Hook = true;
      let prevWires = document.querySelectorAll('#nf400Wires line.nf400-wire').length;
      canvas.addEventListener('click', e => {
        if (!e.target.closest('.nf4033-jack')) return;
        setTimeout(() => {
          const curWires = document.querySelectorAll('#nf400Wires line.nf400-wire').length;
          if (curWires > prevWires) {
            SFX.cableClick();
            launchPacketBurst(2);
            igaReact(CABLE_QUIPS[quipIdx++ % CABLE_QUIPS.length], 'success', false);
          }
          prevWires = curWires;
        }, 120);
      });
    }
  }

  // Expose tiny debug/trigger API for QA & future extensions
  window.NetForgeAlive = {
    version: '0.56.00',
    spawnCatChaos,
    launchPacketBurst,
    showVictoryCard,
    igaReact,
    SFX
  };

  // Boot cleanly once DOM & unified canvas are ready
  let bootTries = 0;
  (function boot() {
    wireHooks();
    if (++bootTries < 16) setTimeout(boot, 500);
  })();
})();
;

/* === script:nf5000-release-polish === */
/* NET FORGE v0.56.00 — Intro Verified Badge, First-Class Guest Mode & Richer Tactile SFX */
(function () {
  'use strict';
  if (window.__NF5000_RELEASE) return;
  window.__NF5000_RELEASE = true;

  const $ = id => document.getElementById(id);

  // 1. Extended Tactile Web Audio SFX (strictly respects SFX mute toggle)
  let ctx = null;
  function sfxOn() {
    const btn = $('nf4031Sound');
    if (btn && /mati|mute|off/i.test(btn.textContent || '')) return false;
    return true;
  }
  function getAudio() {
    if (!sfxOn()) return null;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      if (!ctx) ctx = new AC();
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
      return ctx;
    } catch (_) { return null; }
  }
  function beep(f1, f2, dur, type, vol, delay) {
    const c = getAudio();
    if (!c) return;
    try {
      const t = c.currentTime + (delay || 0);
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type || 'sine';
      o.frequency.setValueAtTime(f1, t);
      if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(Math.max(40, f2), t + dur);
      g.gain.setValueAtTime(0.001, t);
      g.gain.linearRampToValueAtTime(vol || 0.09, t + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g); g.connect(c.destination);
      o.start(t); o.stop(t + dur + 0.02);
    } catch (_) {}
  }
  const ExtraSFX = {
    uiClick() { beep(640, 760, 0.04, 'sine', 0.055, 0); },
    portSelect() { beep(740, 980, 0.06, 'triangle', 0.08, 0); },
    coinBuy() {
      beep(988, 988, 0.08, 'triangle', 0.1, 0);
      beep(1318, 1318, 0.15, 'triangle', 0.1, 0.075);
    },
    timerTick() { beep(880, 660, 0.05, 'square', 0.045, 0); }
  };

  // Wire tactile SFX safely onto UI interactions
  document.addEventListener('click', e => {
    const el = e.target.closest?.('button, .nf4033-jack');
    if (!el) return;
    if (el.classList.contains('nf4033-jack')) {
      ExtraSFX.portSelect();
    } else if (el.matches('button[data-nf44-item]')) {
      ExtraSFX.coinBuy();
    } else if (el.matches('#nf400Modebar button, #nf43DrawerBar button, .topnav button')) {
      ExtraSFX.uiClick();
    }
  }, true);

  // Subtle tick on final 10 seconds of Emergency 60s Mode
  setInterval(() => {
    const bar = $('nf44TimerBar');
    const clk = $('nf44TimerClock');
    if (!bar || !bar.classList.contains('active') || !clk) return;
    const m = (clk.textContent || '').match(/00:0(\d)/);
    if (m && Number(m[1]) > 0) ExtraSFX.timerTick();
  }, 1000);

  // 2. Inject Compact Verification Badge on Intro & Main Menu + Polish Guest Mode CTA
  function applyIntroAndGuestPolish() {
    // Inject compact badge inside intro/menu footer or card
    const targets = [
      document.querySelector('.nf322-footer'),
      document.querySelector('#nf322Intro .nf322-card'),
      document.querySelector('#nf344AudioGate .nf344-card')
    ].filter(Boolean);

    targets.forEach((host, idx) => {
      const bid = 'nf50IntroBadge_' + idx;
      if ($(bid)) return;
      const wrap = document.createElement('div');
      wrap.id = bid;
      wrap.className = 'nf50-intro-badge';
      wrap.innerHTML = '<img src="./icons/badge-verified.svg" alt="NET FORGE Verified Playable - Tested by Gemini QA Passed">';
      host.appendChild(wrap);
    });

    // Enhance Guest Mode button clarity & welcoming subtext
    const guestBtn = $('nf346GuestPlay');
    if (guestBtn && !guestBtn.__nf50Polished) {
      guestBtn.__nf50Polished = true;
      guestBtn.textContent = '▶ Main Langsung (Mode Tamu)';
      guestBtn.title = 'Mulai bermain instan tanpa akun — seluruh progres tersimpan otomatis di browser Anda';
      const parent = guestBtn.parentElement;
      if (parent && !$('nf50GuestNote')) {
        const note = document.createElement('div');
        note.id = 'nf50GuestNote';
        note.className = 'nf50-guest-note';
        note.textContent = '✓ Simpan otomatis di browser (XP, Bintang, Lencana & Toko). Tanpa perlu login.';
        parent.appendChild(note);
      }
    }

    // Ensure SFX starts enabled cleanly when player clicks "Mulai Intro dengan Suara"
    const soundStart = $('nf344SoundStart');
    if (soundStart && !soundStart.__nf50Hook) {
      soundStart.__nf50Hook = true;
      soundStart.addEventListener('click', () => {
        // Safety fallback: if browser blocks AudioContext.resume(), never hang on 'Mengaktifkan AudioContext...'
        setTimeout(() => {
          const gate = $('nf344AudioGate');
          if (gate && getComputedStyle(gate).display !== 'none') {
            $('nf344SilentStart')?.click();
          }
          const sfxBtn = $('nf4031Sound');
          if (sfxBtn && /mati|mute/i.test(sfxBtn.textContent || '')) sfxBtn.click();
        }, 450);
      });
    }
  }

  window.NetForgeRelease = { version: '0.56.00', ExtraSFX };

  let tries = 0;
  (function boot() {
    applyIntroAndGuestPolish();
    if (++tries < 16) setTimeout(boot, 350);
  })();
})();
