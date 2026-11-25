/* NET FORGE v0.69.1 — Procedural Lo-Fi Chillhop Background Music (Web Audio API, Muteable) */
(function () {
  'use strict';
  if (window.__NF6300_LOFI) return;
  window.__NF6300_LOFI = true;

  const MUTE_KEY = 'netforge.lofiMuted.v1';
  const VOL_KEY = 'netforge.lofiVolume.v1';

  let ctx = null;
  let masterGain = null;
  let lpf = null;
  let timer = null;
  let step = 0;
  let started = false;
  let muted = false;
  let volume = 0.22;

  try {
    muted = localStorage.getItem(MUTE_KEY) === '1';
    const savedVol = parseFloat(localStorage.getItem(VOL_KEY) || '');
    if (!Number.isNaN(savedVol) && savedVol >= 0.05 && savedVol <= 0.6) volume = savedVol;
  } catch (_) {}

  // Warm jazz-lofi 4-bar progression (frequencies in Hz):
  // Cmaj9 -> Am9 -> Dm9 -> G13
  const CHORDS = [
    [261.63, 329.63, 392.00, 493.88, 587.33],
    [220.00, 261.63, 329.63, 392.00, 493.88],
    [293.66, 349.23, 440.00, 523.25, 659.25],
    [196.00, 246.94, 349.23, 440.00, 523.25]
  ];
  const BASS = [130.81, 110.00, 146.83, 98.00];
  const MELODY_PENT = [523.25, 587.33, 659.25, 783.99, 880.00, 659.25, 587.33, 523.25];

  function ensureAudio() {
    if (ctx) return ctx;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return null;
    ctx = new AudioCtx();
    masterGain = ctx.createGain();
    masterGain.gain.value = muted ? 0.0001 : volume;

    // Warm lo-fi low-pass filter so highs stay cozy and never harsh
    lpf = ctx.createBiquadFilter();
    lpf.type = 'lowpass';
    lpf.frequency.value = 1850;
    lpf.Q.value = 0.7;

    lpf.connect(masterGain);
    masterGain.connect(ctx.destination);
    return ctx;
  }

  function playChord(freqs, time, dur) {
    if (!ctx || !lpf) return;
    freqs.forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      // Slight lo-fi detune warmth
      osc.frequency.setValueAtTime(f, time);
      osc.detune.setValueAtTime((idx - 2) * 3.5, time);

      const peak = 0.055 / Math.sqrt(freqs.length);
      g.gain.setValueAtTime(0.0001, time);
      g.gain.linearRampToValueAtTime(peak, time + 0.06);
      g.gain.exponentialRampToValueAtTime(peak * 0.45, time + dur * 0.65);
      g.gain.exponentialRampToValueAtTime(0.0001, time + dur);

      osc.connect(g);
      g.connect(lpf);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    });
  }

  function playBass(freq, time, dur) {
    if (!ctx || !lpf) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.09, time + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g);
    g.connect(lpf);
    osc.start(time);
    osc.stop(time + dur + 0.05);
  }

  function playPluck(freq, time) {
    if (!ctx || !lpf) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(0.032, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.42);
    osc.connect(g);
    g.connect(lpf);
    osc.start(time);
    osc.stop(time + 0.46);
  }

  function playKick(time) {
    if (!ctx || !lpf) return;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(98, time);
    osc.frequency.exponentialRampToValueAtTime(42, time + 0.11);
    g.gain.setValueAtTime(0.11, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
    osc.connect(g);
    g.connect(lpf);
    osc.start(time);
    osc.stop(time + 0.18);
  }

  function playBrushHat(time, accent) {
    if (!ctx || !lpf) return;
    const len = Math.floor(ctx.sampleRate * (accent ? 0.075 : 0.035));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;

    const hp = ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.value = accent ? 2600 : 4200;
    hp.Q.value = 1.2;

    const g = ctx.createGain();
    g.gain.setValueAtTime(accent ? 0.03 : 0.014, time);
    g.gain.exponentialRampToValueAtTime(0.0001, time + (accent ? 0.07 : 0.03));

    src.connect(hp);
    hp.connect(g);
    g.connect(lpf);
    src.start(time);
  }

  // 74 BPM -> 1 eighth-note step = ~405ms
  const STEP_MS = 405;
  function tick() {
    if (muted || document.hidden || !ctx || ctx.state !== 'running') return;
    const now = ctx.currentTime + 0.02;
    const bar = Math.floor(step / 8) % CHORDS.length;
    const beatInBar = step % 8; // 8 eighth-notes per bar

    if (beatInBar === 0) {
      playChord(CHORDS[bar], now, (STEP_MS * 7.6) / 1000);
      playBass(BASS[bar], now, (STEP_MS * 4.2) / 1000);
      playKick(now);
    } else if (beatInBar === 3) {
      playKick(now);
    } else if (beatInBar === 4) {
      playBrushHat(now, true);
      playBass(BASS[bar] * 1.5, now, (STEP_MS * 2.4) / 1000);
    }

    if (beatInBar % 2 === 1) {
      playBrushHat(now, false);
    }

    // Gentle sparse lo-fi bell note on select off-beats
    if (beatInBar === 2 || beatInBar === 6) {
      if ((step + bar) % 3 !== 0) {
        const note = MELODY_PENT[(step + bar * 2) % MELODY_PENT.length];
        playPluck(note, now);
      }
    }

    step = (step + 1) % 32;
  }

  function startLoop() {
    if (started) return;
    const c = ensureAudio();
    if (!c) return;
    started = true;
    if (c.state === 'suspended' && !muted) {
      c.resume().catch(() => {});
    }
    if (!timer) {
      timer = setInterval(tick, STEP_MS);
    }
  }

  function syncButton() {
    const btn = document.getElementById('nf63LofiBtn');
    if (!btn) return;
    btn.setAttribute('aria-pressed', String(!muted));
    btn.classList.toggle('is-muted', muted);
    btn.textContent = muted ? '🔇 Lo-Fi' : '🎵 Lo-Fi';
    btn.title = muted ? 'Nyalakan musik latar lo-fi ringan' : 'Bisukan musik latar lo-fi';
  }

  function setMuted(nextMuted) {
    muted = Boolean(nextMuted);
    try { localStorage.setItem(MUTE_KEY, muted ? '1' : '0'); } catch (_) {}
    if (!muted) startLoop();
    if (ctx && masterGain) {
      const now = ctx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      masterGain.gain.setTargetAtTime(muted ? 0.0001 : volume, now, 0.08);
      if (!muted && ctx.state === 'suspended') ctx.resume().catch(() => {});
    }
    syncButton();
  }

  function toggle() {
    setMuted(!muted);
  }

  function setVolume(v) {
    const num = Math.max(0.05, Math.min(0.6, Number(v) || 0.22));
    volume = num;
    try { localStorage.setItem(VOL_KEY, String(volume)); } catch (_) {}
    if (ctx && masterGain && !muted) {
      masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.06);
    }
  }

  function injectButton() {
    const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
    if (tabs && !document.getElementById('nf63LofiBtn')) {
      const b = document.createElement('button');
      b.id = 'nf63LofiBtn';
      b.type = 'button';
      b.addEventListener('click', toggle);
      tabs.appendChild(b);
      syncButton();
      return true;
    }
    return Boolean(document.getElementById('nf63LofiBtn'));
  }

  // Respect browser autoplay policy: gently start on first user interaction if not muted
  function onFirstGesture() {
    if (!muted) startLoop();
    window.removeEventListener('pointerdown', onFirstGesture, true);
    window.removeEventListener('keydown', onFirstGesture, true);
  }
  window.addEventListener('pointerdown', onFirstGesture, true);
  window.addEventListener('keydown', onFirstGesture, true);

  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden && ctx.state === 'running') {
      ctx.suspend().catch(() => {});
    } else if (!document.hidden && !muted && started && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  });

  window.NetForgeLofi = {
    version: '0.69.1',
    toggle,
    setMuted,
    isMuted: () => muted,
    setVolume
  };

  let tries = 0;
  (function boot() {
    if (injectButton() || ++tries > 24) return;
    setTimeout(boot, 350);
  })();
})();
