/* NET FORGE v0.60.00 — Desainer Misi & Mode Ujian (Sekolah / Kampus Edition)
   - Pembuat Soal Visual (Guru/Dosen): judul, instruksi, durasi, budget, topologi awal, rubrik otomatis
   - Ekspor/Impor paket soal (.json) & Kode Soal 100% offline-friendly
   - 3 Template Ujian Bawaan siap pakai
   - Mode Ujian Terkunci (nonaktifkan hiburan & petunjuk), Timer, Penilaian Otomatis & Laporan Hasil + Kode Verifikasi */
(function () {
  'use strict';
  if (window.__NF6000_DESIGNER) return;
  window.__NF6000_DESIGNER = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  const TEMPLATES = [
    {
      id: 'tpl_smk_lan',
      title: 'Ujian Praktik SMK — Topologi LAN & Internet',
      author: 'Template Standar TKJ',
      instructions: 'Bangun jaringan LAN sekolah: hubungkan Modem ISP ke Router (WAN), sambungkan Switch ke Router, lalu hubungkan minimal 1 Desktop PC dan 1 Laptop hingga semua perangkat aktif dan IPv4 dapat saling berkomunikasi.',
      durationMin: 15,
      maxBudget: 1000,
      examLock: true,
      requiredDevices: ['modem', 'router', 'switch', 'pc', 'laptop'],
      requiredPaths: [['modem', 'router'], ['router', 'switch'], ['pc', 'router']],
      requireAllOnline: true,
      requirePing: true,
      requireBudget: true,
      initialGraph: null
    },
    {
      id: 'tpl_kampus_sec',
      title: 'Ujian Kampus — Jaringan Kantor Aman (Firewall & Printer)',
      author: 'Template Jaringan Komputer',
      instructions: 'Rancang jaringan kantor aman: pasang Modem ISP, Router, Firewall, Switch, Desktop PC, Server, dan Network Printer. Pastikan jalur Router ↔ Firewall ↔ Switch aktif serta PC dapat mengakses Server dan Printer.',
      durationMin: 20,
      maxBudget: 1400,
      examLock: true,
      requiredDevices: ['modem', 'router', 'firewall', 'switch', 'pc', 'server', 'printer'],
      requiredPaths: [['modem', 'router'], ['router', 'firewall'], ['firewall', 'switch'], ['pc', 'server'], ['printer', 'switch']],
      requireAllOnline: true,
      requirePing: true,
      requireBudget: true,
      initialGraph: null
    },
    {
      id: 'tpl_troubleshoot',
      title: 'Ujian Troubleshooting — Perbaiki Jaringan Terputus',
      author: 'Template Praktikum Troubleshooting',
      instructions: 'Perangkat kantor sudah terpasang tetapi belum terhubung! Sambungkan kabel pada port yang tepat (Modem → Router → Switch → PC & Server) tanpa melebihi batas budget.',
      durationMin: 10,
      maxBudget: 1200,
      examLock: true,
      requiredDevices: ['modem', 'router', 'switch', 'pc', 'server'],
      requiredPaths: [['modem', 'router'], ['router', 'switch'], ['pc', 'server']],
      requireAllOnline: true,
      requirePing: true,
      requireBudget: true,
      initialGraph: {
        nodes: [
          { id: 1, type: 'modem', name: 'Modem ISP', x: 16, y: 24 },
          { id: 2, type: 'router', name: 'Router Utama', x: 42, y: 24 },
          { id: 3, type: 'switch', name: 'Switch Lab', x: 68, y: 24 },
          { id: 4, type: 'pc', name: 'Desktop PC', x: 34, y: 66 },
          { id: 5, type: 'server', name: 'Server Lokal', x: 68, y: 66 }
        ],
        edges: [],
        nextId: 6,
        spent: 770
      }
    }
  ];

  const COMMON_PATHS = [
    { key: 'modem:router', label: 'Modem ISP ↔ Router' },
    { key: 'router:switch', label: 'Router ↔ Switch' },
    { key: 'router:firewall', label: 'Router ↔ Firewall' },
    { key: 'firewall:switch', label: 'Firewall ↔ Switch' },
    { key: 'pc:router', label: 'Desktop PC ↔ Router' },
    { key: 'pc:server', label: 'Desktop PC ↔ Server' },
    { key: 'printer:switch', label: 'Network Printer ↔ Switch' }
  ];

  let draftInitialGraph = null;
  let loadedExamPack = structuredClone(TEMPLATES[0]);
  let activeExam = null; // { pack, student, startedAt, timerId, remainingSec }

  function fnv1aHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }

  function makeVerifyCode(student, pack, score, passed, total) {
    const raw = [student.name, student.nim, pack.title, score, passed, total, 'NF60'].join('|');
    const hex = fnv1aHash(raw);
    return `NF60-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  function evaluateExam(pack) {
    const api = API();
    const snap = api?.getState?.() || { nodes: [], edges: [], spent: 0 };
    const nodes = Array.isArray(snap.nodes) ? snap.nodes : [];
    const edges = Array.isArray(snap.edges) ? snap.edges : [];
    const activeEdges = edges.filter(e => api?.isLinkActive?.(e));

    const first = type => nodes.find(n => n.type === type);
    function hasPath(a, b) {
      if (!a || !b) return false;
      if (String(a.id) === String(b.id)) return true;
      const q = [String(a.id)];
      const seen = new Set(q);
      while (q.length) {
        const cur = q.shift();
        for (const e of activeEdges) {
          const ea = String(e.a), eb = String(e.b);
          const nxt = ea === cur ? eb : (eb === cur ? ea : null);
          if (!nxt || seen.has(nxt)) continue;
          if (nxt === String(b.id)) return true;
          seen.add(nxt);
          q.push(nxt);
        }
      }
      return false;
    }

    const checks = [];
    const cat = api?.catalog || [];
    const devName = id => (cat.find(d => d.id === id)?.name) || id;

    // 1. Required devices check
    const reqDevs = Array.isArray(pack.requiredDevices) ? pack.requiredDevices : [];
    if (reqDevs.length) {
      const missing = reqDevs.filter(t => !first(t)).map(devName);
      checks.push({
        label: `Perangkat wajib tersedia (${reqDevs.length - missing.length}/${reqDevs.length})`,
        ok: missing.length === 0,
        detail: missing.length === 0 ? 'Semua perangkat wajib terpasang.' : 'Kurang: ' + missing.join(', ')
      });
    }

    // 2. Required connectivity paths
    const reqPaths = Array.isArray(pack.requiredPaths) ? pack.requiredPaths : [];
    reqPaths.forEach(([ta, tb]) => {
      const a = first(ta), b = first(tb);
      const ok = !!(a && b && hasPath(a, b));
      checks.push({
        label: `Jalur aktif ${devName(ta)} ↔ ${devName(tb)}`,
        ok,
        detail: ok ? 'Terhubung aktif.' : 'Belum ada jalur kabel/Wi-Fi aktif.'
      });
    });

    // 3. All placed devices connected (no orphan offline devices)
    if (pack.requireAllOnline) {
      const orphans = nodes.filter(n => !activeEdges.some(e => String(e.a) === String(n.id) || String(e.b) === String(n.id)));
      checks.push({
        label: 'Semua perangkat di kanvas terhubung aktif',
        ok: nodes.length > 0 && orphans.length === 0,
        detail: nodes.length === 0 ? 'Kanvas masih kosong.' : (orphans.length === 0 ? 'Tidak ada perangkat offline.' : `${orphans.length} perangkat belum tersambung.`)
      });
    }

    // 4. IPv4 Ping check between first client/pc and router/server
    if (pack.requirePing) {
      const src = first('pc') || first('laptop') || first('printer') || nodes[0];
      const dst = first('server') || first('router') || nodes[1];
      let pingRes = { ok: false, reason: 'Perangkat uji belum lengkap.' };
      if (src && dst && src.id !== dst.id) {
        try { pingRes = api?.ping?.(src.id, dst.id) || pingRes; } catch (_) {}
      }
      checks.push({
        label: `Uji IPv4 / Ping (${src ? devName(src.type) : 'Klien'} → ${dst ? devName(dst.type) : 'Target'})`,
        ok: !!pingRes.ok,
        detail: pingRes.ok ? 'Ping berhasil.' : (pingRes.reason || 'Jalur IPv4 belum aktif.')
      });
    }

    // 5. Budget compliance check
    if (pack.requireBudget && Number(pack.maxBudget) > 0) {
      const devCost = nodes.reduce((s, n) => s + (cat.find(d => d.id === n.type)?.cost || 0), 0);
      const totalSpent = devCost + edges.length * 10;
      const ok = totalSpent <= Number(pack.maxBudget);
      checks.push({
        label: `Biaya proyek dalam batas budget ($${totalSpent} ≤ $${pack.maxBudget})`,
        ok,
        detail: ok ? 'Sesuai anggaran ujian.' : `Melebihi budget sebesar $${totalSpent - Number(pack.maxBudget)}.`
      });
    }

    const total = checks.length;
    const passed = checks.filter(c => c.ok).length;
    const score = total ? Math.round((passed / total) * 100) : 0;
    const grade = score >= 90 ? 'A' : (score >= 75 ? 'B' : (score >= 60 ? 'C' : 'D'));
    return { checks, passed, total, score, grade, nodeCount: nodes.length, edgeCount: activeEdges.length };
  }

  function readDesignerForm() {
    const reqDevices = [...document.querySelectorAll('#nf60DevChips input:checked')].map(i => i.value);
    const reqPaths = [...document.querySelectorAll('#nf60PathChips input:checked')].map(i => i.value.split(':'));
    return {
      format: 'netforge-exam-v1',
      version: '0.60.00',
      title: ($('nf60Title')?.value || '').trim() || 'Misi Kustom NET FORGE',
      author: ($('nf60Author')?.value || '').trim() || 'Pengajar Jaringan',
      instructions: ($('nf60Instr')?.value || '').trim() || 'Bangun topologi sesuai rubrik yang ditentukan.',
      durationMin: Math.max(0, parseInt($('nf60Dur')?.value || '15', 10) || 0),
      maxBudget: Math.max(200, parseInt($('nf60Budget')?.value || '1200', 10) || 1200),
      examLock: Boolean($('nf60Lock')?.checked),
      requiredDevices: reqDevices,
      requiredPaths: reqPaths,
      requireAllOnline: Boolean($('nf60ReqOnline')?.checked),
      requirePing: Boolean($('nf60ReqPing')?.checked),
      requireBudget: Boolean($('nf60ReqBudget')?.checked),
      initialGraph: draftInitialGraph ? structuredClone(draftInitialGraph) : null
    };
  }

  function populateDesignerForm(pack) {
    if ($('nf60Title')) $('nf60Title').value = pack.title || '';
    if ($('nf60Author')) $('nf60Author').value = pack.author || '';
    if ($('nf60Instr')) $('nf60Instr').value = pack.instructions || '';
    if ($('nf60Dur')) $('nf60Dur').value = String(pack.durationMin ?? 15);
    if ($('nf60Budget')) $('nf60Budget').value = String(pack.maxBudget ?? 1200);
    if ($('nf60Lock')) $('nf60Lock').checked = pack.examLock !== false;
    if ($('nf60ReqOnline')) $('nf60ReqOnline').checked = pack.requireAllOnline !== false;
    if ($('nf60ReqPing')) $('nf60ReqPing').checked = pack.requirePing !== false;
    if ($('nf60ReqBudget')) $('nf60ReqBudget').checked = pack.requireBudget !== false;
    draftInitialGraph = pack.initialGraph ? structuredClone(pack.initialGraph) : null;
    updateInitialGraphLabel();

    const devSet = new Set(pack.requiredDevices || []);
    document.querySelectorAll('#nf60DevChips .nf60-chip').forEach(lbl => {
      const inp = lbl.querySelector('input');
      const on = devSet.has(inp.value);
      inp.checked = on;
      lbl.classList.toggle('on', on);
    });
    const pathSet = new Set((pack.requiredPaths || []).map(p => p.join(':')));
    document.querySelectorAll('#nf60PathChips .nf60-chip').forEach(lbl => {
      const inp = lbl.querySelector('input');
      const on = pathSet.has(inp.value);
      inp.checked = on;
      lbl.classList.toggle('on', on);
    });
  }

  function updateInitialGraphLabel() {
    const el = $('nf60InitStatus');
    if (!el) return;
    if (draftInitialGraph && draftInitialGraph.nodes?.length) {
      el.textContent = `✓ Topologi awal tersimpan (${draftInitialGraph.nodes.length} perangkat, ${draftInitialGraph.edges?.length || 0} kabel).`;
    } else {
      el.textContent = 'Kanvas awal: Kosong (siswa membangun dari nol).';
    }
  }

  function updateExamPreview() {
    const el = $('nf60ExamPreview');
    if (!el || !loadedExamPack) return;
    const p = loadedExamPack;
    el.innerHTML = `
      <strong>${p.title}</strong>
      <div style="font-size:11.5px;color:#a5c9e0;margin:4px 0 6px;">Pengajar: ${p.author} · Durasi: ${p.durationMin ? p.durationMin + ' menit' : 'Bebas'} · Budget Maks: $${p.maxBudget} · ${p.examLock ? '🔒 Mode Ujian Terkunci' : '🔓 Mode Latihan'}</div>
      <div style="font-size:12px;line-height:1.45;color:#e2f1ff;">${p.instructions}</div>
    `;
  }

  function formatMMSS(sec) {
    const s = Math.max(0, sec);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  }

  function stopExam(showReport) {
    if (!activeExam) return;
    const current = activeExam;
    if (current.timerId) clearInterval(current.timerId);
    activeExam = null;
    document.body.classList.remove('nf60-exam-locked');
    $('nf60ExamHud')?.classList.remove('active');
    if (showReport) renderResultModal(current);
  }

  function ensureExamHud() {
    if ($('nf60ExamHud')) return $('nf60ExamHud');
    const banner = $('nf403MissionBanner');
    if (!banner || !banner.parentElement) return null;
    const hud = document.createElement('div');
    hud.id = 'nf60ExamHud';
    hud.innerHTML = `
      <div class="nf60-hud-meta">
        <strong id="nf60HudTitle">📝 Ujian Aktif</strong>
        <small id="nf60HudStudent">Peserta</small>
      </div>
      <div class="nf60-hud-right">
        <span id="nf60ExamClock">15:00</span>
        <button type="button" class="nf60-btn" id="nf60HudCheck">📊 Cek Progres</button>
        <button type="button" class="nf60-btn primary" id="nf60HudSubmit">✅ Selesai &amp; Kumpulkan</button>
        <button type="button" class="nf60-btn danger" id="nf60HudAbort">✕ Batal</button>
      </div>
    `;
    banner.parentElement.insertBefore(hud, banner);
    hud.querySelector('#nf60HudCheck').addEventListener('click', () => {
      if (!activeExam) return;
      const ev = evaluateExam(activeExam.pack);
      window.NetForgeAlive?.igaReact?.(
        `Progres Ujian: ${ev.passed}/${ev.total} rubrik terpenuhi (Skor sementara: ${ev.score}/100).`,
        ev.score === 100 ? 'success' : 'think',
        true
      );
    });
    hud.querySelector('#nf60HudSubmit').addEventListener('click', () => stopExam(true));
    hud.querySelector('#nf60HudAbort').addEventListener('click', () => stopExam(false));
    return hud;
  }

  function startExamSession(pack, student) {
    stopExam(false);
    const api = API();
    if (!api) return;
    api.openMission('free');
    setTimeout(() => {
      if (pack.initialGraph && Array.isArray(pack.initialGraph.nodes)) {
        api.importGraph(pack.initialGraph);
      } else {
        api.resetCanvas();
      }
      window.NetForgeVisualFX?.syncHardwareMicroFx?.();
    }, 120);

    const hud = ensureExamHud();
    if (!hud) return;
    $('nf60HudTitle').textContent = '📝 ' + pack.title;
    $('nf60HudStudent').textContent = `${student.name} (${student.nim || 'Tanpa NIM'}) · ${student.kelas || 'Umum'}`;

    const totalSec = (Number(pack.durationMin) || 0) * 60;
    const clk = $('nf60ExamClock');
    clk.classList.remove('urgent');
    clk.textContent = totalSec > 0 ? formatMMSS(totalSec) : '∞ Bebas';

    if (pack.examLock) document.body.classList.add('nf60-exam-locked');
    hud.classList.add('active');
    $('nf60Modal')?.classList.remove('open');

    // Update mission banner instructions cleanly for the student
    if ($('nf403MissionHeading')) $('nf403MissionHeading').textContent = '📝 ' + pack.title;
    if ($('nf403MissionInstructions')) $('nf403MissionInstructions').textContent = pack.instructions;

    activeExam = {
      pack: structuredClone(pack),
      student: { ...student },
      startedAt: Date.now(),
      remainingSec: totalSec,
      timerId: null
    };

    if (totalSec > 0) {
      activeExam.timerId = setInterval(() => {
        if (!activeExam) return;
        activeExam.remainingSec--;
        clk.textContent = formatMMSS(activeExam.remainingSec);
        if (activeExam.remainingSec <= 60) clk.classList.add('urgent');
        if (activeExam.remainingSec <= 0) {
          stopExam(true);
        }
      }, 1000);
    }
  }

  function renderResultModal(session) {
    const ev = evaluateExam(session.pack);
    const elapsedSec = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
    const code = makeVerifyCode(session.student, session.pack, ev.score, ev.passed, ev.total);
    const reportObj = {
      format: 'netforge-exam-result-v1',
      version: '0.60.00',
      submittedAt: new Date().toISOString(),
      verificationCode: code,
      student: session.student,
      exam: { title: session.pack.title, author: session.pack.author, maxBudget: session.pack.maxBudget },
      result: { score: ev.score, grade: ev.grade, passed: ev.passed, total: ev.total, elapsedSec, checks: ev.checks }
    };

    let m = $('nf60ResultModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'nf60ResultModal';
      m.setAttribute('role', 'dialog');
      m.setAttribute('aria-modal', 'true');
      m.innerHTML = `
        <div class="nf60-dialog" style="width:min(620px,95vw);">
          <div class="nf60-head">
            <h3>🎓 Laporan Hasil Ujian NET FORGE</h3>
            <button type="button" class="nf60-btn" id="nf60ResClose">✕ Tutup</button>
          </div>
          <div class="nf60-body" id="nf60ResBody"></div>
        </div>`;
      document.body.appendChild(m);
      m.querySelector('#nf60ResClose').addEventListener('click', () => m.classList.remove('open'));
    }

    const body = m.querySelector('#nf60ResBody');
    body.innerHTML = `
      <div class="nf60-score-hero">
        <div>
          <div style="font-size:12px;color:#a7f3d0;font-weight:700;">NILAI AKHIR (GRADE ${ev.grade})</div>
          <div class="nf60-score-num">${ev.score}<span style="font-size:16px;color:#bae6fd;"> / 100</span></div>
          <div style="font-size:12px;color:#e2f1ff;margin-top:4px;">${session.student.name} · ${session.student.nim || '-'} · ${session.student.kelas || '-'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:11px;color:#cbd5e1;margin-bottom:4px;">Kode Verifikasi</div>
          <div class="nf60-verify-code">${code}</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:5px;">Waktu: ${formatMMSS(elapsedSec)} · ${ev.nodeCount} perangkat</div>
        </div>
      </div>
      <div class="nf60-box">
        <div class="nf60-box-title">Rincian Penilaian Rubrik (${ev.passed}/${ev.total})</div>
        <ul class="nf60-rubric-list">
          ${ev.checks.map(c => `<li><span>${c.ok ? '✅' : '❌'}</span><div><strong>${c.label}</strong><div style="font-size:11px;color:#94a3b8;">${c.detail}</div></div></li>`).join('')}
        </ul>
      </div>
      <div class="nf60-row-actions" style="justify-content:flex-end;">
        <button type="button" class="nf60-btn accent" id="nf60DownloadRes">⬇️ Unduh Laporan (.json)</button>
        <button type="button" class="nf60-btn" id="nf60PrintRes">🖨️ Cetak / PDF</button>
        <button type="button" class="nf60-btn primary" id="nf60DoneRes">Selesai</button>
      </div>
    `;

    body.querySelector('#nf60DownloadRes').addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(reportObj, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const safeNim = (session.student.nim || session.student.name || 'siswa').replace(/[^a-z0-9_-]/gi, '_');
      a.download = `hasil-ujian-netforge-${safeNim}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    });
    body.querySelector('#nf60PrintRes').addEventListener('click', () => window.print());
    body.querySelector('#nf60DoneRes').addEventListener('click', () => m.classList.remove('open'));
    m.classList.add('open');
    window.NetForgeAlive?.SFX?.victory?.();
  }

  function ensureModal() {
    if ($('nf60Modal')) return $('nf60Modal');
    const m = document.createElement('div');
    m.id = 'nf60Modal';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-modal', 'true');
    const catalog = API()?.catalog || [];
    const devChipsHtml = catalog.map(d =>
      `<label class="nf60-chip"><input type="checkbox" value="${d.id}">${d.icon} ${d.name}</label>`
    ).join('');
    const pathChipsHtml = COMMON_PATHS.map(p =>
      `<label class="nf60-chip"><input type="checkbox" value="${p.key}">🔗 ${p.label}</label>`
    ).join('');

    m.innerHTML = `
      <div class="nf60-dialog">
        <div class="nf60-head">
          <h3>📝 Desainer Misi &amp; Mode Ujian (Sekolah / Kampus)</h3>
          <button type="button" class="nf60-btn" id="nf60Close">✕ Tutup</button>
        </div>
        <div class="nf60-tabs">
          <button type="button" class="nf60-tab active" data-nf60-tab="designer">✏️ Buat Soal (Guru / Dosen)</button>
          <button type="button" class="nf60-tab" data-nf60-tab="exam">🎓 Mulai Ujian (Siswa / Mahasiswa)</button>
        </div>

        <!-- TAB 1: MISSION DESIGNER -->
        <div class="nf60-body" id="nf60TabDesigner">
          <div class="nf60-row-actions">
            <span style="font-size:11.5px;color:#94a3b8;font-weight:700;">Template Cepat:</span>
            ${TEMPLATES.map((t, i) => `<button type="button" class="nf60-btn" data-nf60-tpl="${i}">${i + 1}. ${t.title.split('—')[1]?.trim() || t.title}</button>`).join('')}
          </div>
          <div class="nf60-grid2">
            <div class="nf60-field"><label>Judul Soal / Misi</label><input id="nf60Title" type="text" maxlength="90"></div>
            <div class="nf60-field"><label>Nama Guru / Dosen / Institusi</label><input id="nf60Author" type="text" maxlength="60"></div>
          </div>
          <div class="nf60-field"><label>Instruksi / Studi Kasus</label><textarea id="nf60Instr"></textarea></div>
          <div class="nf60-grid2">
            <div class="nf60-field"><label>Durasi Ujian (menit · 0 = bebas)</label><input id="nf60Dur" type="number" min="0" max="180" value="15"></div>
            <div class="nf60-field"><label>Batas Budget Maksimal ($)</label><input id="nf60Budget" type="number" min="200" max="5000" step="50" value="1200"></div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">Perangkat Wajib (Pilih dari 15 Perangkat)</div>
            <div class="nf60-dev-chips" id="nf60DevChips">${devChipsHtml}</div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">Jalur Koneksi Wajib &amp; Syarat Rubrik</div>
            <div class="nf60-dev-chips" id="nf60PathChips" style="margin-bottom:10px;">${pathChipsHtml}</div>
            <div class="nf60-row-actions" style="font-size:12px;">
              <label><input type="checkbox" id="nf60ReqOnline" checked> Semua perangkat aktif</label>
              <label><input type="checkbox" id="nf60ReqPing" checked> Uji Ping IPv4 lulus</label>
              <label><input type="checkbox" id="nf60ReqBudget" checked> Sesuai batas budget</label>
              <label><input type="checkbox" id="nf60Lock" checked> 🔒 Mode Ujian Terkunci</label>
            </div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">Topologi Awal (Opsional untuk Soal Troubleshooting)</div>
            <div class="nf60-row-actions">
              <button type="button" class="nf60-btn" id="nf60SnapCanvas">📸 Ambil Topologi Kanvas Saat Ini</button>
              <button type="button" class="nf60-btn" id="nf60ClearInit">🗑 Kosongkan Awal</button>
              <span id="nf60InitStatus" style="font-size:11.5px;color:#93c5fd;"></span>
            </div>
          </div>

          <div class="nf60-status" id="nf60DesignerStatus"></div>
          <div class="nf60-row-actions" style="justify-content:flex-end;">
            <button type="button" class="nf60-btn" id="nf60CopyCode">📋 Salin Kode Soal</button>
            <button type="button" class="nf60-btn accent" id="nf60ExportJson">⬇️ Ekspor Soal (.json)</button>
            <button type="button" class="nf60-btn primary" id="nf60TestMission">▶ Uji Coba Soal</button>
          </div>
        </div>

        <!-- TAB 2: STUDENT EXAM MODE -->
        <div class="nf60-body" id="nf60TabExam" style="display:none;">
          <div class="nf60-grid2">
            <div class="nf60-field"><label>Nama Lengkap Peserta</label><input id="nf60StuName" type="text" placeholder="Contoh: Budi Santoso" maxlength="60"></div>
            <div class="nf60-field"><label>NIS / NIM</label><input id="nf60StuNim" type="text" placeholder="Contoh: 20261001" maxlength="30"></div>
          </div>
          <div class="nf60-field"><label>Kelas / Program Studi</label><input id="nf60StuClass" type="text" placeholder="Contoh: XII TKJ 1 / Informatika" maxlength="40"></div>

          <div class="nf60-box">
            <div class="nf60-box-title">Muat Paket Soal Ujian</div>
            <div class="nf60-row-actions" style="margin-bottom:8px;">
              <input type="file" id="nf60FileInput" accept=".json,application/json" style="font-size:12px;color:#bae6fd;">
              <select id="nf60TplSelect" style="background:#061529;color:#fff;border:1px solid rgba(56,189,248,0.35);border-radius:8px;padding:6px 8px;font-size:12px;">
                ${TEMPLATES.map((t, i) => `<option value="${i}">Template ${i + 1}: ${t.title}</option>`).join('')}
              </select>
            </div>
            <div class="nf60-field">
              <label>Atau Tempel Kode Soal JSON dari Guru/Dosen</label>
              <div class="nf60-row-actions">
                <input id="nf60CodeInput" type="text" placeholder="Tempel teks JSON paket soal lalu klik Muat…" style="flex:1;">
                <button type="button" class="nf60-btn" id="nf60LoadCode">Muat Kode</button>
              </div>
            </div>
          </div>

          <div class="nf60-box" id="nf60ExamPreview"></div>
          <div class="nf60-status" id="nf60ExamStatus"></div>
          <div class="nf60-row-actions" style="justify-content:flex-end;">
            <button type="button" class="nf60-btn primary" id="nf60StartExam">🚀 Mulai Ujian Sekarang</button>
          </div>
        </div>
      </div>`;
    document.body.appendChild(m);

    // Chip toggle styling
    m.querySelectorAll('.nf60-chip').forEach(lbl => {
      lbl.addEventListener('click', () => {
        const inp = lbl.querySelector('input');
        setTimeout(() => lbl.classList.toggle('on', inp.checked), 0);
      });
    });

    // Tab switcher
    m.querySelectorAll('.nf60-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const which = tab.dataset.nf60Tab;
        m.querySelectorAll('.nf60-tab').forEach(t => t.classList.toggle('active', t === tab));
        $('nf60TabDesigner').style.display = which === 'designer' ? 'flex' : 'none';
        $('nf60TabExam').style.display = which === 'exam' ? 'flex' : 'none';
        if (which === 'exam') updateExamPreview();
      });
    });

    $('nf60Close').addEventListener('click', () => m.classList.remove('open'));
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });

    // Designer template buttons
    m.querySelectorAll('button[data-nf60-tpl]').forEach(b => {
      b.addEventListener('click', () => {
        populateDesignerForm(TEMPLATES[Number(b.dataset.nf60Tpl)]);
        $('nf60DesignerStatus').textContent = '✓ Template dimuat ke editor soal.';
      });
    });

    $('nf60SnapCanvas').addEventListener('click', () => {
      const g = API()?.exportGraph?.();
      if (!g || !g.nodes?.length) {
        $('nf60DesignerStatus').textContent = 'Kanvas saat ini kosong. Tambahkan perangkat dulu jika ingin membuat soal troubleshooting.';
        return;
      }
      draftInitialGraph = g;
      updateInitialGraphLabel();
      $('nf60DesignerStatus').textContent = '✓ Topologi kanvas berhasil direkam sebagai kondisi awal soal.';
    });

    $('nf60ClearInit').addEventListener('click', () => {
      draftInitialGraph = null;
      updateInitialGraphLabel();
    });

    $('nf60ExportJson').addEventListener('click', () => {
      const pack = readDesignerForm();
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const slug = pack.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32) || 'misi';
      a.download = `soal-netforge-${slug}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      $('nf60DesignerStatus').textContent = '✓ File soal .json berhasil diunduh — siap dibagikan ke siswa!';
    });

    $('nf60CopyCode').addEventListener('click', async () => {
      const pack = readDesignerForm();
      const jsonStr = JSON.stringify(pack);
      try {
        await navigator.clipboard.writeText(jsonStr);
        $('nf60DesignerStatus').textContent = '✓ Kode soal disalin ke clipboard!';
      } catch (_) {
        $('nf60DesignerStatus').textContent = 'Gunakan tombol Ekspor Soal (.json) jika browser membatasi clipboard.';
      }
    });

    $('nf60TestMission').addEventListener('click', () => {
      const pack = readDesignerForm();
      loadedExamPack = pack;
      startExamSession(pack, { name: pack.author || 'Pengajar (Uji Coba)', nim: 'PREVIEW', kelas: 'Mode Uji Coba' });
    });

    // Student exam loader
    $('nf60TplSelect').addEventListener('change', e => {
      loadedExamPack = structuredClone(TEMPLATES[Number(e.target.value)] || TEMPLATES[0]);
      updateExamPreview();
      $('nf60ExamStatus').textContent = '✓ Paket soal template dipilih.';
    });

    $('nf60FileInput').addEventListener('change', async e => {
      const f = e.target.files?.[0];
      if (!f) return;
      try {
        const parsed = JSON.parse(await f.text());
        if (!parsed || !parsed.title) throw Error('Format file soal tidak dikenali.');
        loadedExamPack = parsed;
        updateExamPreview();
        $('nf60ExamStatus').textContent = '✓ File soal "' + parsed.title + '" berhasil dimuat!';
      } catch (err) {
        $('nf60ExamStatus').textContent = '⚠ Gagal membaca file: ' + err.message;
      }
    });

    $('nf60LoadCode').addEventListener('click', () => {
      try {
        const parsed = JSON.parse(($('nf60CodeInput').value || '').trim());
        if (!parsed || !parsed.title) throw Error('Format kode soal tidak valid.');
        loadedExamPack = parsed;
        updateExamPreview();
        $('nf60ExamStatus').textContent = '✓ Kode soal "' + parsed.title + '" berhasil dimuat!';
      } catch (err) {
        $('nf60ExamStatus').textContent = '⚠ Kode soal tidak valid: ' + err.message;
      }
    });

    $('nf60StartExam').addEventListener('click', () => {
      const name = ($('nf60StuName')?.value || '').trim() || window.NetForgeAuth?.getPlayer?.()?.name || window.NetForgeGuest?.profile?.()?.name || 'Peserta Ujian';
      const nim = ($('nf60StuNim')?.value || '').trim();
      const kelas = ($('nf60StuClass')?.value || '').trim();
      startExamSession(loadedExamPack, { name, nim, kelas });
    });

    populateDesignerForm(TEMPLATES[0]);
    updateExamPreview();
    return m;
  }

  function openDesigner(defaultTab) {
    const m = ensureModal();
    if (defaultTab) {
      const btn = m.querySelector(`.nf60-tab[data-nf60-tab="${defaultTab}"]`);
      if (btn) btn.click();
    }
    m.classList.add('open');
  }

  function injectLauncher() {
    const tabs = document.querySelector('#nf43DrawerBar .nf43-tabs');
    if (tabs && !$('nf60OpenBtn')) {
      const b = document.createElement('button');
      b.id = 'nf60OpenBtn';
      b.type = 'button';
      b.textContent = '📝 Desainer / Ujian';
      b.title = 'Buat soal misi kustom atau jalankan Mode Ujian Sekolah/Kampus';
      b.addEventListener('click', () => openDesigner('designer'));
      tabs.appendChild(b);
      return true;
    }
    return Boolean($('nf60OpenBtn'));
  }

  window.NetForgeExamDesigner = {
    version: '0.60.00',
    openDesigner,
    startExamSession,
    stopExam,
    evaluateExam,
    templates: TEMPLATES
  };

  let tries = 0;
  (function boot() {
    if (injectLauncher() || ++tries > 20) return;
    setTimeout(boot, 400);
  })();
})();
