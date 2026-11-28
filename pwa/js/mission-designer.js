/* NET FORGE v0.72.1 — Desainer Misi & Mode Ujian (Sekolah / Kampus Edition)
   - Menyembunyikan panel Objective lama saat ujian & menampilkan Panel Rubrik Ujian khusus di sidebar kanan
   - Cetak / Simpan PDF via dokumen cetak bersih (terjamin tidak pernah blank di Print Preview!)
   - Editor Aturan IP Spesifik per Perangkat (IP eksak, subnet wildcard 192.168.10.*, prefix /24, & gateway) */
(function () {
  'use strict';
  if (window.__NF6000_DESIGNER) return;
  window.__NF6000_DESIGNER = true;

  const $ = id => document.getElementById(id);
  const API = () => window.NetForgeUniversalInventory || null;

  const TEMPLATES = [
    {
      id: 'tpl_smk_lan',
      title: 'Ujian Praktik SMK — Topologi LAN & IP Statis',
      author: 'Template Standar TKJ',
      instructions: 'Bangun jaringan LAN sekolah: hubungkan Modem ISP → Router → Switch → Desktop PC & Server. Atur IP Router = 192.168.10.1 dan Server = 192.168.10.10 (prefix /24), lalu pastikan Ping berhasil.',
      durationMin: 15,
      maxBudget: 1100,
      examLock: true,
      requiredDevices: ['modem', 'router', 'switch', 'pc', 'server'],
      requiredPaths: [['modem', 'router'], ['router', 'switch'], ['pc', 'server']],
      requiredIPs: [
        { type: 'router', ip: '192.168.10.1', prefix: '24', gateway: '' },
        { type: 'server', ip: '192.168.10.10', prefix: '24', gateway: '192.168.10.1' }
      ],
      requireAllOnline: true,
      requirePing: true,
      requireBudget: true,
      initialGraph: null
    },
    {
      id: 'tpl_kampus_sec',
      title: 'Ujian Kampus — Jaringan Kantor Aman (Firewall & Printer)',
      author: 'Template Jaringan Komputer',
      instructions: 'Rancang jaringan kantor aman: Modem ISP → Router → Firewall → Switch → Desktop PC, Server (192.168.10.10), & Network Printer (192.168.10.*). Pastikan semua perangkat aktif dan lolos uji Ping.',
      durationMin: 20,
      maxBudget: 1400,
      examLock: true,
      requiredDevices: ['modem', 'router', 'firewall', 'switch', 'pc', 'server', 'printer'],
      requiredPaths: [['modem', 'router'], ['router', 'firewall'], ['firewall', 'switch'], ['pc', 'server'], ['printer', 'switch']],
      requiredIPs: [
        { type: 'server', ip: '192.168.10.10', prefix: '24', gateway: '' },
        { type: 'printer', ip: '192.168.10.*', prefix: '', gateway: '' }
      ],
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
      requiredIPs: [],
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
    },
    {
      id: 'tpl_vlan_trunk',
      title: 'Ujian Praktik VLAN — Segmentasi VLAN 10/20 & Switch Trunk',
      author: 'Template UKK SMK TKJ',
      instructions: 'Bangun topologi Router → Switch → 4 Desktop PC. Pisahkan minimal 2 PC ke VLAN 10 (Admin) dan 2 PC ke VLAN 20 (Staff), lalu atur Switch ke mode trunk dengan VLAN 10,20 serta pastikan tidak ada konflik IP.',
      durationMin: 20,
      maxBudget: 1450,
      examLock: true,
      allowIpCalc: true,
      requiredDevices: ['router', 'switch', 'pc'],
      deviceMinCounts: { router: 1, switch: 1, pc: 4 },
      requiredPaths: [['router', 'switch'], ['pc', 'router']],
      requiredIPs: [
        { type: 'router', ip: '192.168.10.1', prefix: '24', gateway: '' }
      ],
      requiredVlans: [
        { type: 'pc', vlan: '10', iface: '', minCount: 2 },
        { type: 'pc', vlan: '20', iface: '', minCount: 2 },
        { type: 'switch', vlan: '10,20', iface: 'trunk', minCount: 1 }
      ],
      requireRouterDhcp: false,
      requireClientDhcp: false,
      requiredDns: '',
      requireNoIpConflict: true,
      requiredMedia: '',
      requireAllOnline: true,
      requirePing: true,
      requireBudget: true,
      initialGraph: null
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
  let activeExam = null;

  const BANK_KEY = 'netforge.examBank.v1';
  const DRIVE_CLIENT_KEY = 'netforge.driveClientId.v1';
  const DRIVE_FOLDER_NAME = 'NET FORGE - Bank Soal';
  const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.file';

  let connectedDirHandle = null;
  let folderExamEntries = [];
  let driveAccessToken = '';
  let driveTokenExpiry = 0;
  let driveFolderId = '';
  let driveExamEntries = [];
  let currentEditingId = null;

  function slugify(text) {
    return String(text || 'misi').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 36) || 'misi';
  }

  function makePackFileName(pack) {
    return `soal-netforge-${slugify(pack?.title)}.json`;
  }

  function readLocalBank() {
    try {
      const raw = JSON.parse(localStorage.getItem(BANK_KEY) || '[]');
      return Array.isArray(raw) ? raw.filter(x => x && x.title) : [];
    } catch (_) {
      return [];
    }
  }

  function writeLocalBank(list) {
    try {
      localStorage.setItem(BANK_KEY, JSON.stringify(list.slice(0, 100)));
      return true;
    } catch (_) {
      return false;
    }
  }

  function savePackToLocalBank(pack) {
    const list = readLocalBank();
    const id = currentEditingId || pack.id || ('nf61_' + Date.now().toString(36));
    const entry = {
      ...structuredClone(pack),
      id,
      savedAt: new Date().toISOString()
    };
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list[idx] = entry;
    else list.unshift(entry);
    currentEditingId = id;
    writeLocalBank(list);
    renderLocalBankList();
    return entry;
  }

  function deletePackFromLocalBank(id) {
    const list = readLocalBank().filter(x => x.id !== id);
    writeLocalBank(list);
    if (currentEditingId === id) currentEditingId = null;
    renderLocalBankList();
  }

  function downloadPackFallback(pack) {
    const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = makePackFileName(pack);
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }

  async function savePackToComputerFolder(pack) {
    const jsonText = JSON.stringify(pack, null, 2);
    const filename = makePackFileName(pack);
    if (connectedDirHandle && typeof connectedDirHandle.getFileHandle === 'function') {
      const fh = await connectedDirHandle.getFileHandle(filename, { create: true });
      const writable = await fh.createWritable();
      await writable.write(jsonText);
      await writable.close();
      await scanConnectedFolder();
      return { mode: 'folder', label: `${connectedDirHandle.name}/${filename}` };
    }
    if (typeof window.showSaveFilePicker === 'function') {
      const fh = await window.showSaveFilePicker({
        suggestedName: filename,
        types: [{ description: 'Paket Soal NET FORGE (.json)', accept: { 'application/json': ['.json'] } }]
      });
      const writable = await fh.createWritable();
      await writable.write(jsonText);
      await writable.close();
      return { mode: 'picker', label: fh.name || filename };
    }
    downloadPackFallback(pack);
    return { mode: 'download', label: filename };
  }

  async function scanConnectedFolder() {
    folderExamEntries = [];
    if (!connectedDirHandle) {
      renderFolderList();
      return;
    }
    for await (const [name, handle] of connectedDirHandle.entries()) {
      if (handle.kind !== 'file' || !name.toLowerCase().endsWith('.json')) continue;
      try {
        const file = await handle.getFile();
        const parsed = JSON.parse(await file.text());
        if (parsed && parsed.title) {
          folderExamEntries.push({
            fileName: name,
            handle,
            pack: parsed,
            modified: file.lastModified ? new Date(file.lastModified).toLocaleString('id-ID') : ''
          });
        }
      } catch (_) {}
    }
    folderExamEntries.sort((a, b) => a.fileName.localeCompare(b.fileName));
    renderFolderList();
  }

  async function connectLocalFolder() {
    if (typeof window.showDirectoryPicker !== 'function') {
      throw Error('Browser ini belum mendukung akses folder langsung (gunakan Chrome/Edge desktop, atau pakai tombol Impor/Ekspor .json).');
    }
    connectedDirHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
    await scanConnectedFolder();
    return connectedDirHandle.name;
  }

  // --- Google Drive Integration (OAuth 2.0 drive.file scope) ---
  async function resolveGoogleClientId() {
    const manualInput = ($('nf60DriveClientId')?.value || '').trim();
    if (manualInput) {
      try { localStorage.setItem(DRIVE_CLIENT_KEY, manualInput); } catch (_) {}
      return manualInput;
    }
    const base = ($('nf32Url')?.value || '').trim().replace(/\/+$/, '');
    if (base && (/^https:\/\//.test(base) || /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/api\/v1$/.test(base))) {
      try {
        const res = await fetch(base + '/auth/config', { cache: 'no-store', signal: AbortSignal.timeout(7000) });
        if (res.ok) {
          const cfg = await res.json().catch(() => ({}));
          if (cfg?.googleClientId) return String(cfg.googleClientId).trim();
        }
      } catch (_) {}
    }
    try {
      const saved = (localStorage.getItem(DRIVE_CLIENT_KEY) || '').trim();
      if (saved) return saved;
    } catch (_) {}
    return '';
  }

  function loadGsiScript() {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2) return resolve();
      const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existing) {
        let tries = 0;
        const timer = setInterval(() => {
          if (window.google?.accounts?.oauth2) { clearInterval(timer); resolve(); }
          else if (++tries > 40) { clearInterval(timer); reject(Error('Google Identity Services belum siap.')); }
        }, 150);
        return;
      }
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(Error('Gagal memuat Google Identity Services. Periksa koneksi internet.'));
      document.head.appendChild(s);
    });
  }

  async function ensureDriveToken(interactive = true) {
    if (driveAccessToken && Date.now() < driveTokenExpiry - 30000) return driveAccessToken;
    if (!interactive) return '';
    if (!navigator.onLine) throw Error('Perangkat sedang offline. Sambungkan internet untuk mengakses Google Drive.');
    const clientId = await resolveGoogleClientId();
    if (!clientId) {
      throw Error('Google Client ID belum ditemukan. Pastikan backend API aktif di Pengaturan atau masukkan Client ID pada Pengaturan Lanjutan Google Drive.');
    }
    await loadGsiScript();
    return new Promise((resolve, reject) => {
      try {
        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: DRIVE_SCOPE,
          callback: resp => {
            if (resp?.error) {
              reject(Error('Izin Google Drive dibatalkan atau gagal: ' + (resp.error_description || resp.error)));
              return;
            }
            if (!resp?.access_token) {
              reject(Error('Google tidak mengembalikan token akses Drive.'));
              return;
            }
            driveAccessToken = resp.access_token;
            driveTokenExpiry = Date.now() + (Number(resp.expires_in || 3500) * 1000);
            updateDriveBadge();
            resolve(driveAccessToken);
          },
          error_callback: err => {
            reject(Error('Popup izin Google Drive diblokir atau ditutup (' + (err?.type || 'error') + ').'));
          }
        });
        client.requestAccessToken({ prompt: '' });
      } catch (e) {
        reject(e);
      }
    });
  }

  async function driveApiFetch(url, options = {}) {
    const token = await ensureDriveToken(true);
    const headers = Object.assign({ Authorization: 'Bearer ' + token }, options.headers || {});
    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      driveAccessToken = '';
      driveTokenExpiry = 0;
      updateDriveBadge();
      throw Error('Sesi Google Drive kedaluwarsa. Klik Hubungkan Google Drive kembali.');
    }
    if (!res.ok) {
      const errJson = await res.json().catch(() => null);
      const msg = errJson?.error?.message || ('HTTP ' + res.status);
      if (res.status === 403 && /Drive API|not enabled|disabled/i.test(msg)) {
        throw Error('Google Drive API belum diaktifkan di Google Cloud Console pada project OAuth Client ID Anda.');
      }
      throw Error('Google Drive error: ' + msg);
    }
    return res;
  }

  async function ensureDriveFolder() {
    if (driveFolderId) return driveFolderId;
    const q = encodeURIComponent(`name='${DRIVE_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`);
    const res = await driveApiFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)&spaces=drive`);
    const data = await res.json();
    if (data.files && data.files.length) {
      driveFolderId = data.files[0].id;
      return driveFolderId;
    }
    const createRes = await driveApiFetch('https://www.googleapis.com/drive/v3/files?fields=id,name', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: DRIVE_FOLDER_NAME,
        mimeType: 'application/vnd.google-apps.folder'
      })
    });
    const created = await createRes.json();
    driveFolderId = created.id;
    return driveFolderId;
  }

  async function listDriveExamFiles() {
    const folderId = await ensureDriveFolder();
    const q = encodeURIComponent(`'${folderId}' in parents and trashed=false and mimeType='application/json'`);
    const res = await driveApiFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&orderBy=modifiedTime desc&fields=files(id,name,modifiedTime)&pageSize=50`);
    const data = await res.json();
    driveExamEntries = Array.isArray(data.files) ? data.files : [];
    renderDriveList();
    return driveExamEntries;
  }

  async function savePackToGoogleDrive(pack) {
    const folderId = await ensureDriveFolder();
    const fileName = makePackFileName(pack);
    const safeName = fileName.replace(/'/g, "\'");
    const q = encodeURIComponent(`'${folderId}' in parents and name='${safeName}' and trashed=false`);
    const findRes = await driveApiFetch(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`);
    const existing = (await findRes.json())?.files?.[0];

    const metadata = existing
      ? { name: fileName, mimeType: 'application/json' }
      : { name: fileName, mimeType: 'application/json', parents: [folderId] };
    const boundary = 'nf61_drive_boundary_' + Date.now();
    const body =
      `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n` +
      JSON.stringify(pack, null, 2) +
      `\r\n--${boundary}--`;

    const uploadUrl = existing
      ? `https://www.googleapis.com/upload/drive/v3/files/${existing.id}?uploadType=multipart&fields=id,name`
      : 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name';

    await driveApiFetch(uploadUrl, {
      method: existing ? 'PATCH' : 'POST',
      headers: { 'Content-Type': `multipart/related; boundary=${boundary}` },
      body
    });
    await listDriveExamFiles();
    return { fileName, updated: Boolean(existing) };
  }

  async function loadPackFromGoogleDrive(fileId) {
    const res = await driveApiFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media`);
    const parsed = await res.json();
    if (!parsed || !parsed.title) throw Error('Isi file di Google Drive bukan format soal NET FORGE yang valid.');
    return parsed;
  }

  async function deletePackFromGoogleDrive(fileId) {
    await driveApiFetch(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}`, { method: 'DELETE' });
    await listDriveExamFiles();
  }

  function updateDriveBadge() {
    const pill = $('nf60DriveStatusPill');
    if (!pill) return;
    if (driveAccessToken && Date.now() < driveTokenExpiry - 30000) {
      pill.className = 'nf60-pill ok';
      pill.textContent = `☁️ Google Drive Terhubung · Folder: ${DRIVE_FOLDER_NAME}`;
    } else {
      pill.className = 'nf60-pill';
      pill.textContent = '☁️ Google Drive Belum Terhubung (Scope aman: drive.file)';
    }
  }

  async function openPackInEditor(pack, sourceLabel) {
    let target = pack;
    if (target?.passwordProtected && !target._unlockedPassword) {
      target = await promptPasswordForPack(target, 'mengedit soal ini');
      if (!target) return;
    }
    currentEditingId = target.id || null;
    populateDesignerForm(target);
    const tabBtn = document.querySelector('#nf60Modal .nf60-tab[data-nf60-tab="designer"]');
    if (tabBtn) tabBtn.click();
    if ($('nf60DesignerStatus')) $('nf60DesignerStatus').textContent = `✓ Soal "${target.title}" dibuka dari ${sourceLabel}.`;
  }

  function openPackInExamTab(pack, sourceLabel) {
    loadedExamPack = structuredClone(pack);
    updateExamPreview();
    const tabBtn = document.querySelector('#nf60Modal .nf60-tab[data-nf60-tab="exam"]');
    if (tabBtn) tabBtn.click();
    if ($('nf60ExamStatus')) $('nf60ExamStatus').textContent = `✓ Soal "${pack.title}" siap diujikan (sumber: ${sourceLabel}).`;
  }

  function renderLocalBankList() {
    const box = $('nf60LocalBankList');
    if (!box) return;
    const list = readLocalBank();
    if (!list.length) {
      box.innerHTML = '<div class="nf60-empty">Belum ada soal di Bank Soal Browser. Buat soal di tab ✏️ Buat Soal lalu klik <b>💾 Simpan ke Bank Soal</b>.</div>';
      return;
    }
    box.innerHTML = list.map((p, idx) => `
      <div class="nf60-bank-item">
        <div class="nf60-bank-meta">
          <strong>${p.passwordProtected ? '🔐 ' : ''}${escapeHtml(p.title)}</strong>
          <small>${escapeHtml(p.author || 'Pengajar')} · ${(p.requiredDevices || []).length} perangkat · ${(p.requiredIPs || []).length} aturan IP · ${p.durationMin ? p.durationMin + ' mnt' : 'Bebas'}</small>
        </div>
        <div class="nf60-bank-actions">
          <button type="button" class="nf60-btn sm" data-bank-edit="${idx}">✏️ Edit</button>
          <button type="button" class="nf60-btn sm primary" data-bank-exam="${idx}">▶ Ujian</button>
          <button type="button" class="nf60-btn sm" data-bank-dl="${idx}" title="Unduh .json">⬇️</button>
          <button type="button" class="nf60-btn sm danger" data-bank-del="${escapeHtml(p.id)}" title="Hapus">🗑</button>
        </div>
      </div>`).join('');
    box.querySelectorAll('[data-bank-edit]').forEach(b => b.addEventListener('click', () => openPackInEditor(list[Number(b.dataset.bankEdit)], 'Bank Soal Browser')));
    box.querySelectorAll('[data-bank-exam]').forEach(b => b.addEventListener('click', () => openPackInExamTab(list[Number(b.dataset.bankExam)], 'Bank Soal Browser')));
    box.querySelectorAll('[data-bank-dl]').forEach(b => b.addEventListener('click', () => downloadPackFallback(list[Number(b.dataset.bankDl)])));
    box.querySelectorAll('[data-bank-del]').forEach(b => b.addEventListener('click', () => {
      if (window.confirm('Hapus soal ini dari Bank Soal Browser?')) deletePackFromLocalBank(b.dataset.bankDel);
    }));
  }

  function renderFolderList() {
    const box = $('nf60FolderBankList');
    const pill = $('nf60FolderStatusPill');
    if (pill) {
      if (connectedDirHandle) {
        pill.className = 'nf60-pill ok';
        pill.textContent = `📁 Folder Aktif: ${connectedDirHandle.name} (${folderExamEntries.length} file soal)`;
      } else {
        pill.className = 'nf60-pill';
        pill.textContent = '📁 Belum ada folder komputer yang dipilih';
      }
    }
    if (!box) return;
    if (!connectedDirHandle) {
      box.innerHTML = '<div class="nf60-empty">Klik <b>📂 Pilih Folder Soal di Komputer</b> untuk membuka atau menyimpan banyak file <code>.json</code> langsung di satu folder khusus.</div>';
      return;
    }
    if (!folderExamEntries.length) {
      box.innerHTML = '<div class="nf60-empty">Folder terhubung, tetapi belum ada file soal <code>.json</code> NET FORGE di dalamnya. Klik <b>📁 Simpan ke Folder PC</b> di tab Buat Soal untuk menyimpan ke folder ini.</div>';
      return;
    }
    box.innerHTML = folderExamEntries.map((item, idx) => `
      <div class="nf60-bank-item">
        <div class="nf60-bank-meta">
          <strong>${escapeHtml(item.pack.title)}</strong>
          <small>${escapeHtml(item.fileName)}${item.modified ? ' · ' + escapeHtml(item.modified) : ''}</small>
        </div>
        <div class="nf60-bank-actions">
          <button type="button" class="nf60-btn sm" data-dir-edit="${idx}">✏️ Edit</button>
          <button type="button" class="nf60-btn sm primary" data-dir-exam="${idx}">▶ Ujian</button>
        </div>
      </div>`).join('');
    box.querySelectorAll('[data-dir-edit]').forEach(b => b.addEventListener('click', () => openPackInEditor(folderExamEntries[Number(b.dataset.dirEdit)].pack, 'Folder ' + connectedDirHandle.name)));
    box.querySelectorAll('[data-dir-exam]').forEach(b => b.addEventListener('click', () => openPackInExamTab(folderExamEntries[Number(b.dataset.dirExam)].pack, 'Folder ' + connectedDirHandle.name)));
  }

  function renderDriveList() {
    const box = $('nf60DriveBankList');
    updateDriveBadge();
    if (!box) return;
    if (!driveAccessToken || Date.now() >= driveTokenExpiry - 30000) {
      box.innerHTML = '<div class="nf60-empty">Hubungkan Google Drive untuk menyimpan &amp; membuka paket soal langsung di folder <b>NET FORGE - Bank Soal</b> pada akun Google Anda.</div>';
      return;
    }
    if (!driveExamEntries.length) {
      box.innerHTML = '<div class="nf60-empty">Folder <b>NET FORGE - Bank Soal</b> di Google Drive masih kosong. Klik <b>☁️ Simpan ke Google Drive</b> di tab Buat Soal.</div>';
      return;
    }
    box.innerHTML = driveExamEntries.map((f, idx) => {
      const mod = f.modifiedTime ? new Date(f.modifiedTime).toLocaleString('id-ID') : '';
      return `
      <div class="nf60-bank-item">
        <div class="nf60-bank-meta">
          <strong>${escapeHtml(f.name)}</strong>
          <small>Google Drive${mod ? ' · Diubah ' + escapeHtml(mod) : ''}</small>
        </div>
        <div class="nf60-bank-actions">
          <button type="button" class="nf60-btn sm" data-drv-edit="${idx}">✏️ Edit</button>
          <button type="button" class="nf60-btn sm primary" data-drv-exam="${idx}">▶ Ujian</button>
          <button type="button" class="nf60-btn sm danger" data-drv-del="${idx}" title="Hapus dari Drive">🗑</button>
        </div>
      </div>`;
    }).join('');
    box.querySelectorAll('[data-drv-edit]').forEach(b => b.addEventListener('click', async () => {
      const entry = driveExamEntries[Number(b.dataset.drvEdit)];
      const st = $('nf60BankStatus');
      try {
        if (st) st.textContent = '⏳ Mengunduh soal dari Google Drive…';
        const pack = await loadPackFromGoogleDrive(entry.id);
        openPackInEditor(pack, 'Google Drive');
        if (st) st.textContent = '';
      } catch (err) {
        if (st) st.textContent = '⚠ ' + err.message;
      }
    }));
    box.querySelectorAll('[data-drv-exam]').forEach(b => b.addEventListener('click', async () => {
      const entry = driveExamEntries[Number(b.dataset.drvExam)];
      const st = $('nf60BankStatus');
      try {
        if (st) st.textContent = '⏳ Memuat soal dari Google Drive…';
        const pack = await loadPackFromGoogleDrive(entry.id);
        openPackInExamTab(pack, 'Google Drive');
        if (st) st.textContent = '';
      } catch (err) {
        if (st) st.textContent = '⚠ ' + err.message;
      }
    }));
    box.querySelectorAll('[data-drv-del]').forEach(b => b.addEventListener('click', async () => {
      const entry = driveExamEntries[Number(b.dataset.drvDel)];
      if (!window.confirm(`Hapus "${entry.name}" dari Google Drive?`)) return;
      const st = $('nf60BankStatus');
      try {
        if (st) st.textContent = '⏳ Menghapus file dari Google Drive…';
        await deletePackFromGoogleDrive(entry.id);
        if (st) st.textContent = '✓ File dihapus dari Google Drive.';
      } catch (err) {
        if (st) st.textContent = '⚠ ' + err.message;
      }
    }));
  }


  function fnv1aHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).toUpperCase().padStart(8, '0');
  }


  // =========================================================================
  // v0.72.1 — PASSWORD PROTECTION FOR MISSION FILES
  // =========================================================================
  function xorBytes(bytes, keyStr) {
    const k = new TextEncoder().encode(keyStr || 'NF62');
    const out = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      out[i] = bytes[i] ^ k[i % k.length] ^ ((i * 31) & 0xff);
    }
    return out;
  }

  function bytesToB64(bytes) {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  }

  function b64ToBytes(b64) {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function protectPack(pack, password) {
    const pwd = String(password || '').trim();
    const clean = structuredClone(pack);
    delete clean.password;
    if (!pwd) {
      delete clean.passwordProtected;
      delete clean.passwordSalt;
      delete clean.passwordHash;
      delete clean.protectedPayload;
      return clean;
    }
    const salt = Math.random().toString(36).slice(2, 10).toUpperCase();
    const hash = fnv1aHash(`${salt}:${pwd}:NF62_LOCK`);
    const secretObj = {
      instructions: clean.instructions || '',
      requiredDevices: clean.requiredDevices || [],
      requiredPaths: clean.requiredPaths || [],
      requiredIPs: clean.requiredIPs || [],
      requireAllOnline: clean.requireAllOnline !== false,
      requirePing: clean.requirePing !== false,
      requireBudget: clean.requireBudget !== false,
      allowIpCalc: clean.allowIpCalc !== false,
      restrictInventory: Boolean(clean.restrictInventory),
      deviceMinCounts: clean.deviceMinCounts || {},
      requiredVlans: clean.requiredVlans || [],
      requireRouterDhcp: Boolean(clean.requireRouterDhcp),
      requireClientDhcp: Boolean(clean.requireClientDhcp),
      requiredDns: clean.requiredDns || '',
      requireNoIpConflict: clean.requireNoIpConflict !== false,
      requiredMedia: clean.requiredMedia || '',
      initialGraph: clean.initialGraph || null
    };
    const enc = xorBytes(new TextEncoder().encode(JSON.stringify(secretObj)), `${salt}:${pwd}:NF62`);
    return {
      schema: 2,
      id: clean.id || ('nf62_' + Date.now().toString(36)),
      title: clean.title,
      author: clean.author,
      durationMin: clean.durationMin,
      maxBudget: clean.maxBudget,
      examLock: clean.examLock !== false,
      passwordProtected: true,
      passwordSalt: salt,
      passwordHash: hash,
      protectedPayload: bytesToB64(enc),
      savedAt: clean.savedAt || new Date().toISOString()
    };
  }

  function unlockPack(pack, password) {
    if (!pack || !pack.passwordProtected) return structuredClone(pack);
    const pwd = String(password || '').trim();
    const expected = fnv1aHash(`${pack.passwordSalt || ''}:${pwd}:NF62_LOCK`);
    if (expected !== pack.passwordHash) return null;
    try {
      const decBytes = xorBytes(b64ToBytes(pack.protectedPayload || ''), `${pack.passwordSalt || ''}:${pwd}:NF62`);
      const secretObj = JSON.parse(new TextDecoder().decode(decBytes));
      return {
        ...pack,
        ...secretObj,
        passwordProtected: true,
        _unlockedPassword: pwd
      };
    } catch (_) {
      return null;
    }
  }

  function promptPasswordForPack(pack, purposeLabel) {
    return new Promise(resolve => {
      if (!pack || !pack.passwordProtected) return resolve(structuredClone(pack));
      let modal = $('nf60PwdModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'nf60PwdModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.innerHTML = `
          <div class="nf60-pwd-card">
            <h3 id="nf60PwdTitle">🔐 Password Soal Diperlukan</h3>
            <p id="nf60PwdDesc"></p>
            <div class="nf60-field">
              <label for="nf60PwdInput">Masukkan Password Soal</label>
              <input id="nf60PwdInput" type="password" placeholder="Ketik password dari guru/dosen…" autocomplete="off">
            </div>
            <div class="nf60-pwd-err" id="nf60PwdErr"></div>
            <div class="nf60-row-actions" style="justify-content:flex-end;">
              <button type="button" class="nf60-btn" id="nf60PwdCancel">Batal</button>
              <button type="button" class="nf60-btn primary" id="nf60PwdSubmit">🔓 Buka &amp; Lanjutkan</button>
            </div>
          </div>`;
        document.body.appendChild(modal);
      }
      const desc = modal.querySelector('#nf60PwdDesc');
      const inp = modal.querySelector('#nf60PwdInput');
      const err = modal.querySelector('#nf60PwdErr');
      const btnCancel = modal.querySelector('#nf60PwdCancel');
      const btnOk = modal.querySelector('#nf60PwdSubmit');

      desc.textContent = `Soal "${pack.title}" dilindungi password. Masukkan password untuk ${purposeLabel || 'memulai ujian'}.`;
      inp.value = '';
      err.textContent = '';

      function cleanup(val) {
        modal.classList.remove('open');
        btnCancel.onclick = null;
        btnOk.onclick = null;
        inp.onkeydown = null;
        resolve(val);
      }
      function submit() {
        const unlocked = unlockPack(pack, inp.value);
        if (!unlocked) {
          err.textContent = '❌ Password salah. Periksa huruf besar/kecil dan coba lagi.';
          inp.focus();
          inp.select();
          return;
        }
        cleanup(unlocked);
      }
      btnCancel.onclick = () => cleanup(null);
      btnOk.onclick = submit;
      inp.onkeydown = e => {
        if (e.key === 'Enter') { e.preventDefault(); submit(); }
        else if (e.key === 'Escape') { e.preventDefault(); cleanup(null); }
      };
      modal.classList.add('open');
      setTimeout(() => inp.focus(), 60);
    });
  }

  function makeVerifyCode(student, pack, score, passed, total) {
    const raw = [student.name, student.nim, pack.title, score, passed, total, 'NF60'].join('|');
    const hex = fnv1aHash(raw);
    return `NF60-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
  }

  function matchIpPattern(actualIp, expectedPattern) {
    const a = String(actualIp || '').trim();
    const p = String(expectedPattern || '').trim();
    if (!a || !p) return false;
    if (p.includes('*')) {
      const re = new RegExp('^' + p.replace(/\./g, '\\.').replace(/\*/g, '\\d{1,3}') + '$');
      return re.test(a);
    }
    return a === p;
  }

  function getEffectiveNodeConfigs() {
    const api = API();
    const rawNodes = api?.getState?.()?.nodes || [];
    const classicNodes = api?.classicView?.()?.nodes || [];
    const byId = new Map(classicNodes.map(c => [String(c.id), c.config || {}]));
    return rawNodes.map(n => {
      const cfg = byId.get(String(n.id)) || {};
      return {
        id: n.id,
        type: n.type,
        name: n.name || n.type,
        ip: (n.ip && String(n.ip).trim()) || cfg.ip || (n.type === 'router' ? '192.168.10.1' : ''),
        prefix: String(cfg.prefix || '24').replace(/^\//, ''),
        gateway: (n.gateway && String(n.gateway).trim()) || cfg.gateway || '',
        dns: String((n.dns && String(n.dns).trim()) || cfg.dns || '').trim(),
        vlan: String((n.vlan && String(n.vlan).trim()) || cfg.vlan || '').trim(),
        iface: String((n.iface && String(n.iface).trim()) || cfg.iface || '').trim().toLowerCase(),
        mode: String((n.mode && String(n.mode).trim()) || cfg.mode || 'static').trim().toLowerCase(),
        dhcp: n.dhcp !== undefined ? Boolean(n.dhcp) : Boolean(cfg.dhcp)
      };
    });
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

    // 1. Required devices (with optional minimum quantity per device type)
    const reqDevs = Array.isArray(pack.requiredDevices) ? pack.requiredDevices : [];
    const minMap = (pack.deviceMinCounts && typeof pack.deviceMinCounts === 'object') ? pack.deviceMinCounts : {};
    if (reqDevs.length) {
      const missing = [];
      reqDevs.forEach(t => {
        const need = Math.max(1, parseInt(minMap[t] || 1, 10) || 1);
        const have = nodes.filter(n => n.type === t).length;
        if (have < need) missing.push(need > 1 ? `${devName(t)} (${have}/${need})` : devName(t));
      });
      checks.push({
        label: `Perangkat wajib tersedia (${reqDevs.length - missing.length}/${reqDevs.length})`,
        ok: missing.length === 0,
        detail: missing.length === 0 ? 'Semua perangkat wajib & jumlah unitnya terpenuhi.' : 'Kurang: ' + missing.join(', ')
      });
    }

    // 2. Required paths
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

    // 3. Specific IP / Prefix / Gateway Rules
    const reqIPs = Array.isArray(pack.requiredIPs) ? pack.requiredIPs : [];
    if (reqIPs.length) {
      const effNodes = getEffectiveNodeConfigs();
      reqIPs.forEach(rule => {
        if (!rule || !rule.type || !rule.ip) return;
        const candidates = effNodes.filter(n => n.type === rule.type);
        const wantPrefix = String(rule.prefix || '').replace(/^\//, '').trim();
        const wantGw = String(rule.gateway || '').trim();
        const matched = candidates.find(n =>
          matchIpPattern(n.ip, rule.ip) &&
          (!wantPrefix || n.prefix === wantPrefix) &&
          (!wantGw || n.gateway === wantGw)
        );
        const ruleDesc = rule.ip + (wantPrefix ? '/' + wantPrefix : '') + (wantGw ? ' · GW ' + wantGw : '');
        const foundDesc = candidates.length
          ? candidates.map(c => (c.ip || 'belum diatur') + (c.gateway ? ' (GW ' + c.gateway + ')' : '')).join(', ')
          : 'perangkat belum dipasang';
        checks.push({
          label: `IP ${devName(rule.type)} = ${ruleDesc}`,
          ok: Boolean(matched),
          detail: matched ? `Terpenuhi (${matched.ip}/${matched.prefix}).` : `Saat ini: ${foundDesc}. Klik 2x perangkat untuk mengatur IP.`
        });
      });
    }

    // 3b. VLAN & Switch Trunk Rules
    const effNodesAll = getEffectiveNodeConfigs();
    const reqVlans = Array.isArray(pack.requiredVlans) ? pack.requiredVlans : [];
    if (reqVlans.length) {
      reqVlans.forEach(rule => {
        if (!rule || !rule.type || !rule.vlan) return;
        const wantVlans = String(rule.vlan).replace(/\s+/g, '').split(',').filter(Boolean);
        const wantIface = String(rule.iface || '').trim().toLowerCase();
        const minCount = Math.max(1, parseInt(rule.minCount || 1, 10) || 1);
        const matched = effNodesAll.filter(n => {
          if (n.type !== rule.type) return false;
          const nodeVlans = String(n.vlan || '').replace(/\s+/g, '').split(',').filter(Boolean);
          const hasAllVlans = wantVlans.every(v => nodeVlans.includes(v));
          const ifaceOk = !wantIface || n.iface === wantIface;
          return hasAllVlans && ifaceOk;
        });
        const ok = matched.length >= minCount;
        const descIface = wantIface ? ` (mode ${wantIface})` : '';
        checks.push({
          label: `VLAN ${wantVlans.join(',')} pada ${minCount > 1 ? minCount + '× ' : ''}${devName(rule.type)}${descIface}`,
          ok,
          detail: ok
            ? `Terpenuhi (${matched.length}/${minCount} unit sesuai).`
            : `Baru ${matched.length}/${minCount} unit sesuai. Klik 2x perangkat untuk mengatur VLAN${wantIface ? ' & Interface ' + wantIface : ''}.`
        });
      });
    }

    // 3c. DHCP Server (Router) & DHCP Client Rules
    if (pack.requireRouterDhcp) {
      const routers = effNodesAll.filter(n => n.type === 'router');
      const ok = routers.some(r => r.dhcp);
      checks.push({
        label: 'Router mengaktifkan layanan DHCP Server',
        ok,
        detail: ok ? 'DHCP Server aktif pada Router.' : 'Aktifkan DHCP Server di konfigurasi Router.'
      });
    }
    if (pack.requireClientDhcp) {
      const clients = effNodesAll.filter(n => ['pc', 'laptop', 'tablet', 'phone'].includes(n.type));
      const dhcpOk = clients.length > 0 && clients.every(c => c.mode === 'dhcp');
      checks.push({
        label: `Perangkat klien menggunakan mode DHCP (${clients.filter(c => c.mode === 'dhcp').length}/${clients.length})`,
        ok: dhcpOk,
        detail: clients.length === 0 ? 'Belum ada perangkat klien.' : (dhcpOk ? 'Semua klien memakai mode DHCP.' : 'Ubah mode IP klien ke DHCP pada pengaturan perangkat.')
      });
    }

    // 3d. Required DNS Server
    if (pack.requiredDns && String(pack.requiredDns).trim()) {
      const wantDns = String(pack.requiredDns).trim();
      const endpoints = effNodesAll.filter(n => !['switch', 'modem'].includes(n.type));
      const matchedDns = endpoints.filter(n => n.dns === wantDns);
      const ok = matchedDns.length > 0;
      checks.push({
        label: `Konfigurasi DNS Server = ${wantDns}`,
        ok,
        detail: ok ? `${matchedDns.length} perangkat sudah memakai DNS ${wantDns}.` : `Belum ada perangkat yang diarahkan ke DNS ${wantDns}.`
      });
    }

    // 3e. No IP Conflict
    if (pack.requireNoIpConflict) {
      const ipSeen = new Map();
      const dups = [];
      effNodesAll.forEach(n => {
        if (!n.ip || n.ip.toUpperCase() === 'DHCP') return;
        if (ipSeen.has(n.ip)) dups.push(`${n.ip} (${ipSeen.get(n.ip)} & ${n.name})`);
        else ipSeen.set(n.ip, n.name);
      });
      const ok = dups.length === 0;
      checks.push({
        label: 'Bebas konflik alamat IP (semua IP unik)',
        ok,
        detail: ok ? 'Tidak ditemukan duplikasi IP pada topologi.' : 'Konflik IP terdeteksi: ' + dups.join('; ')
      });
    }

    // 3f. Required Cable / Link Media (Fiber / PoE / Wi-Fi)
    if (pack.requiredMedia) {
      const wantM = String(pack.requiredMedia).toLowerCase();
      const mediaNames = { fiber: 'Fiber / SFP', poe: 'PoE', wifi: 'Wi-Fi' };
      const ok = activeEdges.some(e => {
        const m = String(e.medium || '').toLowerCase();
        const p = String((e.portA || '') + ' ' + (e.portB || '')).toLowerCase();
        if (wantM === 'fiber') return m.includes('fiber') || p.includes('sfp');
        if (wantM === 'poe') return m.includes('poe') || Boolean(e.poe) || p.includes('poe');
        if (wantM === 'wifi') return m.includes('wifi') || m.includes('wireless') || p.includes('wi-fi');
        return false;
      });
      checks.push({
        label: `Menggunakan tautan media ${mediaNames[wantM] || wantM}`,
        ok,
        detail: ok ? `Tautan ${mediaNames[wantM] || wantM} aktif.` : `Belum ada koneksi aktif dengan media ${mediaNames[wantM] || wantM}.`
      });
    }

    // 4. All devices online
    if (pack.requireAllOnline) {
      const orphans = nodes.filter(n => !activeEdges.some(e => String(e.a) === String(n.id) || String(e.b) === String(n.id)));
      checks.push({
        label: 'Semua perangkat di kanvas terhubung aktif',
        ok: nodes.length > 0 && orphans.length === 0,
        detail: nodes.length === 0 ? 'Kanvas masih kosong.' : (orphans.length === 0 ? 'Tidak ada perangkat offline.' : `${orphans.length} perangkat belum tersambung.`)
      });
    }

    // 5. IPv4 Ping
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

    // 6. Budget check
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

  // =========================================================================
  // SIDEBAR EXAM RUBRIC PANEL (Replaces confusing legacy Objective list!)
  // =========================================================================
  function ensureSidePanel() {
    if ($('nf60SidePanel')) return $('nf60SidePanel');
    const rightPanel = document.querySelector('.right .panelbody') || document.querySelector('.right');
    if (!rightPanel) return null;
    const sec = document.createElement('section');
    sec.id = 'nf60SidePanel';
    sec.innerHTML = `
      <h4>📋 Rubrik Soal Ujian</h4>
      <p id="nf60SideInstr"></p>
      <ul id="nf60SideList"></ul>
    `;
    rightPanel.appendChild(sec);
    return sec;
  }

  function refreshSidePanel() {
    if (!activeExam) return;
    const panel = ensureSidePanel();
    if (!panel) return;
    const ev = evaluateExam(activeExam.pack);
    $('nf60SideInstr').textContent = activeExam.pack.instructions;
    $('nf60SideList').innerHTML = ev.checks.map(c =>
      `<li><span>${c.ok ? '✅' : '⬜'}</span><span>${c.label}</span></li>`
    ).join('');
  }

  // =========================================================================
  // CLEAN PRINT / PDF REPORT GENERATOR (NEVER BLANK IN PRINT PREVIEW!)
  // =========================================================================
  function printExamReport(reportObj) {
    const s = reportObj.student || {};
    const ex = reportObj.exam || {};
    const r = reportObj.result || {};
    const rows = (r.checks || []).map((c, i) => `
      <tr>
        <td style="text-align:center;">${i + 1}</td>
        <td><strong>${escapeHtml(c.label)}</strong><div style="color:#475569;font-size:11px;margin-top:2px;">${escapeHtml(c.detail)}</div></td>
        <td style="text-align:center;font-weight:700;color:${c.ok ? '#059669' : '#dc2626'};">${c.ok ? 'LULUS' : 'BELUM'}</td>
      </tr>`).join('');

    const docHtml = `<!DOCTYPE html><html lang="id"><head><meta charset="utf-8">
      <title>Laporan Ujian NET FORGE - ${escapeHtml(s.name || 'Peserta')}</title>
      <style>
        @page { size: A4; margin: 16mm; }
        body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; color: #0f172a; background: #fff; margin: 0; padding: 0; font-size: 12.5px; line-height: 1.45; }
        .hdr { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 10px; margin-bottom: 14px; }
        .hdr h1 { margin: 0; font-size: 18px; color: #0b223e; }
        .hdr small { color: #475569; font-size: 11px; }
        .code { font-family: ui-monospace, monospace; font-weight: 800; font-size: 13px; border: 1.5px solid #0f172a; padding: 4px 9px; border-radius: 6px; background: #f8fafc; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; }
        .scorebox { display: flex; justify-content: space-between; align-items: center; border: 2px solid #059669; background: #ecfdf5; border-radius: 8px; padding: 10px 14px; margin-bottom: 14px; }
        .scoreval { font-size: 28px; font-weight: 900; color: #047857; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
        th, td { border: 1px solid #cbd5e1; padding: 7px 9px; text-align: left; vertical-align: top; }
        th { background: #e2e8f0; font-size: 11.5px; text-transform: uppercase; }
        .sign { display: flex; justify-content: space-between; margin-top: 28px; font-size: 11.5px; color: #334155; }
        .sign div { width: 42%; text-align: center; }
        .sign .line { margin-top: 44px; border-top: 1px solid #64748b; padding-top: 4px; }
      </style></head><body>
      <div class="hdr">
        <div>
          <h1>LAPORAN HASIL UJIAN PRAKTIK JARINGAN — NET FORGE</h1>
          <small>Versi ${escapeHtml(reportObj.version)} · Dicetak: ${new Date().toLocaleString('id-ID')}</small>
        </div>
        <div class="code">${escapeHtml(reportObj.verificationCode)}</div>
      </div>
      <div class="grid">
        <div><strong>Nama Peserta:</strong> ${escapeHtml(s.name || '-')}<br><strong>NIS / NIM:</strong> ${escapeHtml(s.nim || '-')}<br><strong>Kelas / Prodi:</strong> ${escapeHtml(s.kelas || '-')}</div>
        <div><strong>Judul Soal:</strong> ${escapeHtml(ex.title || '-')}<br><strong>Pengajar:</strong> ${escapeHtml(ex.author || '-')}<br><strong>Durasi Kerja:</strong> ${formatMMSS(r.elapsedSec || 0)}</div>
      </div>
      <div class="scorebox">
        <div><strong>NILAI AKHIR</strong><div style="font-size:11.5px;color:#065f46;">Rubrik terpenuhi: ${r.passed}/${r.total} kriteria</div></div>
        <div class="scoreval">${r.score} / 100 <span style="font-size:16px;">(Grade ${escapeHtml(r.grade)})</span></div>
      </div>
      <table>
        <thead><tr><th style="width:36px;text-align:center;">No</th><th>Kriteria Rubrik Penilaian</th><th style="width:76px;text-align:center;">Status</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="sign">
        <div>Peserta Ujian<div class="line">${escapeHtml(s.name || '................................')}</div></div>
        <div>Guru / Dosen Penguji<div class="line">${escapeHtml(ex.author || '................................')}</div></div>
      </div>
      </body></html>`;

    // Render into a hidden isolated iframe and print it — guarantees 100% crisp Print Preview / PDF!
    let frame = $('nf60PrintFrame');
    if (frame) frame.remove();
    frame = document.createElement('iframe');
    frame.id = 'nf60PrintFrame';
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;';
    document.body.appendChild(frame);
    const fdoc = frame.contentDocument || frame.contentWindow.document;
    fdoc.open();
    fdoc.write(docHtml);
    fdoc.close();
    setTimeout(() => {
      try {
        frame.contentWindow.focus();
        frame.contentWindow.print();
      } catch (_) {
        const w = window.open('', '_blank', 'width=840,height=920');
        if (w) { w.document.write(docHtml); w.document.close(); w.focus(); w.print(); }
      }
    }, 180);
  }

  function escapeHtml(s) {
    return String(s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // =========================================================================
  // SPECIFIC IP RULES EDITOR IN MISSION DESIGNER
  // =========================================================================
  function addIpRuleRow(rule) {
    const list = $('nf60IpList');
    if (!list) return;
    const cat = API()?.catalog || [];
    const r = rule || { type: 'server', ip: '192.168.10.10', prefix: '24', gateway: '' };
    const row = document.createElement('div');
    row.className = 'nf60-ip-row';
    row.innerHTML = `
      <select class="nf60-ip-type">
        ${cat.map(d => `<option value="${d.id}" ${d.id === r.type ? 'selected' : ''}>${d.icon} ${d.name}</option>`).join('')}
      </select>
      <input class="nf60-ip-addr" type="text" placeholder="IP / 192.168.10.*" value="${escapeHtml(r.ip || '')}">
      <input class="nf60-ip-pref" type="text" placeholder="/24" value="${escapeHtml(r.prefix || '')}">
      <input class="nf60-ip-gw" type="text" placeholder="Gateway (opsional)" value="${escapeHtml(r.gateway || '')}">
      <button type="button" class="nf60-btn danger nf60-ip-del" title="Hapus aturan IP">✕</button>
    `;
    row.querySelector('.nf60-ip-del').addEventListener('click', () => row.remove());
    list.appendChild(row);
  }

  function readIpRules() {
    const out = [];
    document.querySelectorAll('#nf60IpList .nf60-ip-row').forEach(row => {
      const type = row.querySelector('.nf60-ip-type')?.value;
      const ip = (row.querySelector('.nf60-ip-addr')?.value || '').trim();
      const prefix = (row.querySelector('.nf60-ip-pref')?.value || '').replace(/^\//, '').trim();
      const gateway = (row.querySelector('.nf60-ip-gw')?.value || '').trim();
      if (type && ip) out.push({ type, ip, prefix, gateway });
    });
    return out;
  }

  function addVlanRuleRow(rule) {
    const list = $('nf60VlanList');
    if (!list) return;
    const cat = API()?.catalog || [];
    const r = rule || { type: 'pc', vlan: '10', iface: '', minCount: 1 };
    const row = document.createElement('div');
    row.className = 'nf60-vlan-row';
    row.innerHTML = `
      <select class="nf60-vlan-type">
        ${cat.map(d => `<option value="${d.id}" ${d.id === r.type ? 'selected' : ''}>${d.icon} ${d.name}</option>`).join('')}
      </select>
      <input class="nf60-vlan-id" type="text" placeholder="VLAN (10 atau 10,20)" value="${escapeHtml(r.vlan || '')}">
      <select class="nf60-vlan-iface">
        <option value="" ${!r.iface ? 'selected' : ''}>Mode: Bebas</option>
        <option value="access" ${r.iface === 'access' ? 'selected' : ''}>access</option>
        <option value="trunk" ${r.iface === 'trunk' ? 'selected' : ''}>trunk</option>
      </select>
      <input class="nf60-vlan-min" type="number" min="1" max="12" title="Minimal unit perangkat" value="${Math.max(1, parseInt(r.minCount || 1, 10) || 1)}">
      <button type="button" class="nf60-btn danger nf60-vlan-del" title="Hapus aturan VLAN">✕</button>
    `;
    row.querySelector('.nf60-vlan-del').addEventListener('click', () => row.remove());
    list.appendChild(row);
  }

  function readVlanRules() {
    const out = [];
    document.querySelectorAll('#nf60VlanList .nf60-vlan-row').forEach(row => {
      const type = row.querySelector('.nf60-vlan-type')?.value;
      const vlan = (row.querySelector('.nf60-vlan-id')?.value || '').trim();
      const iface = (row.querySelector('.nf60-vlan-iface')?.value || '').trim().toLowerCase();
      const minCount = Math.max(1, parseInt(row.querySelector('.nf60-vlan-min')?.value || '1', 10) || 1);
      if (type && vlan) out.push({ type, vlan, iface, minCount });
    });
    return out;
  }

  function addCustomPathRow(pair) {
    const list = $('nf60CustomPathList');
    if (!list) return;
    const cat = API()?.catalog || [];
    const [a, b] = Array.isArray(pair) ? pair : ['ap', 'laptop'];
    const row = document.createElement('div');
    row.className = 'nf60-cpath-row';
    row.innerHTML = `
      <select class="nf60-cp-a">${cat.map(d => `<option value="${d.id}" ${d.id === a ? 'selected' : ''}>${d.icon} ${d.name}</option>`).join('')}</select>
      <span style="color:#7dd3fc;font-weight:800;">↔</span>
      <select class="nf60-cp-b">${cat.map(d => `<option value="${d.id}" ${d.id === b ? 'selected' : ''}>${d.icon} ${d.name}</option>`).join('')}</select>
      <button type="button" class="nf60-btn danger nf60-cp-del" title="Hapus jalur kustom">✕</button>
    `;
    row.querySelector('.nf60-cp-del').addEventListener('click', () => row.remove());
    list.appendChild(row);
  }

  function readCustomPaths() {
    const out = [];
    document.querySelectorAll('#nf60CustomPathList .nf60-cpath-row').forEach(row => {
      const a = row.querySelector('.nf60-cp-a')?.value;
      const b = row.querySelector('.nf60-cp-b')?.value;
      if (a && b && a !== b) out.push([a, b]);
    });
    return out;
  }


  function readDesignerForm() {
    const reqDevices = [];
    const deviceMinCounts = {};
    document.querySelectorAll('#nf60DevChips .nf60-chip').forEach(lbl => {
      const cb = lbl.querySelector('input[type="checkbox"]');
      if (cb && cb.checked) {
        reqDevices.push(cb.value);
        const q = Math.max(1, parseInt(lbl.querySelector('.nf60-qty')?.value || '1', 10) || 1);
        if (q > 1) deviceMinCounts[cb.value] = q;
      }
    });
    const basePaths = [...document.querySelectorAll('#nf60PathChips input:checked')].map(i => i.value.split(':'));
    const customPaths = readCustomPaths();
    return {
      format: 'netforge-exam-v1',
      version: '0.72.1',
      title: ($('nf60Title')?.value || '').trim() || 'Misi Kustom NET FORGE',
      author: ($('nf60Author')?.value || '').trim() || 'Pengajar Jaringan',
      instructions: ($('nf60Instr')?.value || '').trim() || 'Bangun topologi sesuai rubrik yang ditentukan.',
      durationMin: Math.max(0, parseInt($('nf60Dur')?.value || '15', 10) || 0),
      maxBudget: Math.max(200, parseInt($('nf60Budget')?.value || '1200', 10) || 1200),
      examLock: Boolean($('nf60Lock')?.checked),
      allowIpCalc: $('nf60AllowIpCalc') ? Boolean($('nf60AllowIpCalc').checked) : true,
      restrictInventory: Boolean($('nf60RestrictInv')?.checked),
      requiredDevices: reqDevices,
      deviceMinCounts,
      requiredPaths: [...basePaths, ...customPaths],
      requiredIPs: readIpRules(),
      requiredVlans: readVlanRules(),
      requireRouterDhcp: Boolean($('nf60ReqRouterDhcp')?.checked),
      requireClientDhcp: Boolean($('nf60ReqClientDhcp')?.checked),
      requiredDns: ($('nf60ReqDns')?.value || '').trim(),
      requireNoIpConflict: $('nf60ReqNoConflict') ? Boolean($('nf60ReqNoConflict').checked) : true,
      requiredMedia: ($('nf60ReqMedia')?.value || '').trim(),
      requireAllOnline: Boolean($('nf60ReqOnline')?.checked),
      requirePing: Boolean($('nf60ReqPing')?.checked),
      requireBudget: Boolean($('nf60ReqBudget')?.checked),
      initialGraph: draftInitialGraph ? structuredClone(draftInitialGraph) : null
    };
  }

  function readDesignerFormProtected() {
    const raw = readDesignerForm();
    const pwd = ($('nf60Password')?.value || '').trim();
    return protectPack(raw, pwd);
  }

  function populateDesignerForm(pack) {
    if ($('nf60Title')) $('nf60Title').value = pack.title || '';
    if ($('nf60Author')) $('nf60Author').value = pack.author || '';
    if ($('nf60Instr')) $('nf60Instr').value = pack.instructions || '';
    if ($('nf60Dur')) $('nf60Dur').value = String(pack.durationMin ?? 15);
    if ($('nf60Budget')) $('nf60Budget').value = String(pack.maxBudget ?? 1200);
    if ($('nf60Lock')) $('nf60Lock').checked = pack.examLock !== false;
    if ($('nf60AllowIpCalc')) $('nf60AllowIpCalc').checked = pack.allowIpCalc !== false;
    if ($('nf60RestrictInv')) $('nf60RestrictInv').checked = Boolean(pack.restrictInventory);
    if ($('nf60Password')) $('nf60Password').value = pack._unlockedPassword || '';
    if ($('nf60ReqOnline')) $('nf60ReqOnline').checked = pack.requireAllOnline !== false;
    if ($('nf60ReqPing')) $('nf60ReqPing').checked = pack.requirePing !== false;
    if ($('nf60ReqBudget')) $('nf60ReqBudget').checked = pack.requireBudget !== false;
    if ($('nf60ReqNoConflict')) $('nf60ReqNoConflict').checked = pack.requireNoIpConflict !== false;
    if ($('nf60ReqRouterDhcp')) $('nf60ReqRouterDhcp').checked = Boolean(pack.requireRouterDhcp);
    if ($('nf60ReqClientDhcp')) $('nf60ReqClientDhcp').checked = Boolean(pack.requireClientDhcp);
    if ($('nf60ReqDns')) $('nf60ReqDns').value = pack.requiredDns || '';
    if ($('nf60ReqMedia')) $('nf60ReqMedia').value = pack.requiredMedia || '';
    const minMap = (pack.deviceMinCounts && typeof pack.deviceMinCounts === 'object') ? pack.deviceMinCounts : {};
    document.querySelectorAll('#nf60DevChips .nf60-chip').forEach(lbl => {
      const cb = lbl.querySelector('input[type="checkbox"]');
      const qtyInp = lbl.querySelector('.nf60-qty');
      if (cb && qtyInp) qtyInp.value = String(Math.max(1, parseInt(minMap[cb.value] || 1, 10) || 1));
    });
    const vlanList = $('nf60VlanList');
    if (vlanList) {
      vlanList.innerHTML = '';
      (pack.requiredVlans || []).forEach(r => addVlanRuleRow(r));
    }
    const cpathList = $('nf60CustomPathList');
    if (cpathList) {
      cpathList.innerHTML = '';
      const commonSet = new Set(COMMON_PATHS.map(p => p.key));
      (pack.requiredPaths || []).forEach(pair => {
        if (!Array.isArray(pair) || pair.length < 2) return;
        const k1 = `${pair[0]}:${pair[1]}`;
        const k2 = `${pair[1]}:${pair[0]}`;
        if (!commonSet.has(k1) && !commonSet.has(k2)) addCustomPathRow(pair);
      });
    }
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

    const ipList = $('nf60IpList');
    if (ipList) {
      ipList.innerHTML = '';
      (pack.requiredIPs || []).forEach(r => addIpRuleRow(r));
    }
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
    const isLocked = Boolean(p.passwordProtected && !p._unlockedPassword);
    const ipCount = isLocked ? 0 : (p.requiredIPs || []).length;
    el.innerHTML = `
      <strong>${isLocked ? '🔐 ' : ''}${escapeHtml(p.title)}</strong>
      <div style="font-size:11.5px;color:#a5c9e0;margin:4px 0 6px;">Pengajar: ${escapeHtml(p.author)} · Durasi: ${p.durationMin ? p.durationMin + ' menit' : 'Bebas'} · Budget Maks: $${p.maxBudget}${ipCount ? ' · ' + ipCount + ' Aturan IP Spesifik' : ''} · ${p.examLock ? '🔒 Mode Ujian Terkunci' : '🔓 Mode Latihan'}${p.passwordProtected ? ' · 🔑 Berpassword' : ''}</div>
      <div style="font-size:12px;line-height:1.45;color:#e2f1ff;">${isLocked ? '🔒 Soal dan instruksi dilindungi password. Klik <b>🚀 Mulai Ujian Sekarang</b> lalu masukkan password dari pengajar untuk membuka soal.' : escapeHtml(p.instructions)}</div>
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
    document.body.classList.remove('nf60-exam-locked', 'nf60-exam-active', 'nf60-no-ipcalc');
    window.NetForgeCampaign?.setAllowedDevices?.(null, '');
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
      refreshSidePanel();
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
      refreshSidePanel();
    }, 140);

    const hud = ensureExamHud();
    if (!hud) return;
    $('nf60HudTitle').textContent = '📝 ' + pack.title;
    $('nf60HudStudent').textContent = `${student.name} (${student.nim || 'Tanpa NIM'}) · ${student.kelas || 'Umum'}`;

    const totalSec = (Number(pack.durationMin) || 0) * 60;
    const clk = $('nf60ExamClock');
    clk.classList.remove('urgent');
    clk.textContent = totalSec > 0 ? formatMMSS(totalSec) : '∞ Bebas';

    try { window.NetForgeCampaign?.stopLevel?.(); window.NetForgeDailyChallenge?.stop?.(); } catch (_) {}
    document.body.classList.add('nf60-exam-active');
    document.body.classList.toggle('nf60-no-ipcalc', pack.allowIpCalc === false);
    if (pack.restrictInventory && Array.isArray(pack.requiredDevices) && pack.requiredDevices.length) { window.NetForgeCampaign?.setAllowedDevices?.(pack.requiredDevices, `🎯 Inventori Ujian: ${pack.requiredDevices.length} perangkat soal`); } else { window.NetForgeCampaign?.setAllowedDevices?.(null, ''); }
    if (pack.examLock) document.body.classList.add('nf60-exam-locked');
    hud.classList.add('active');
    $('nf60Modal')?.classList.remove('open');

    if ($('nf403MissionHeading')) $('nf403MissionHeading').textContent = '📝 ' + pack.title;
    if ($('nf403MissionInstructions')) $('nf403MissionInstructions').textContent = pack.instructions;
    if ($('missionTitle')) $('missionTitle').textContent = 'Mode Ujian · ' + pack.title;
    window.NetForgeAlive?.igaReact?.('Mode Ujian aktif! Fokus kerjakan sesuai rubrik di bawah, lalu klik "Selesai & Kumpulkan" bila sudah yakin.', 'think', true);

    activeExam = {
      pack: structuredClone(pack),
      student: { ...student },
      startedAt: Date.now(),
      remainingSec: totalSec,
      timerId: null
    };
    refreshSidePanel();

    if (totalSec > 0) {
      activeExam.timerId = setInterval(() => {
        if (!activeExam) return;
        activeExam.remainingSec--;
        clk.textContent = formatMMSS(activeExam.remainingSec);
        if (activeExam.remainingSec <= 60) clk.classList.add('urgent');
        if (activeExam.remainingSec <= 0) stopExam(true);
      }, 1000);
    }
  }

  function renderResultModal(session) {
    const ev = evaluateExam(session.pack);
    const elapsedSec = Math.max(1, Math.round((Date.now() - session.startedAt) / 1000));
    const code = makeVerifyCode(session.student, session.pack, ev.score, ev.passed, ev.total);
    const reportObj = {
      format: 'netforge-exam-result-v1',
      version: '0.72.1',
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
          <div style="font-size:12px;color:#e2f1ff;margin-top:4px;">${escapeHtml(session.student.name)} · ${escapeHtml(session.student.nim || '-')} · ${escapeHtml(session.student.kelas || '-')}</div>
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
          ${ev.checks.map(c => `<li><span>${c.ok ? '✅' : '❌'}</span><div><strong>${escapeHtml(c.label)}</strong><div style="font-size:11px;color:#94a3b8;">${escapeHtml(c.detail)}</div></div></li>`).join('')}
        </ul>
      </div>
      <div class="nf60-row-actions" style="justify-content:flex-end;">
        <button type="button" class="nf60-btn accent" id="nf60DownloadRes">⬇️ Unduh Laporan (.json)</button>
        <button type="button" class="nf60-btn" id="nf60PrintRes">🖨️ Cetak / Simpan PDF</button>
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
    body.querySelector('#nf60PrintRes').addEventListener('click', () => printExamReport(reportObj));
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
      `<label class="nf60-chip"><input type="checkbox" value="${d.id}">${d.icon} ${d.name}<input type="number" class="nf60-qty" min="1" max="12" value="1" title="Jumlah minimal unit" onclick="event.stopPropagation()"></label>`
    ).join('');
    const pathChipsHtml = COMMON_PATHS.map(p =>
      `<label class="nf60-chip"><input type="checkbox" value="${p.key}">🔗 ${p.label}</label>`
    ).join('');

    m.innerHTML = `
      <div class="nf60-dialog">
        <div class="nf60-head">
          <h3>📝 Desainer Misi &amp; Mode Ujian (Sekolah / Kampus)</h3>
          <button type="button" class="nf60-btn" id="nf60ModalClose">✕ Tutup</button>
        </div>
        <div class="nf60-tabs">
          <button type="button" class="nf60-tab active" data-nf60-tab="designer">✏️ Buat Soal</button>
          <button type="button" class="nf60-tab" data-nf60-tab="bank">📚 Bank Soal &amp; Cloud</button>
          <button type="button" class="nf60-tab" data-nf60-tab="exam">🎓 Mulai Ujian</button>
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
          <div class="nf60-field">
            <label>🔑 Password Soal (Opsional — jika diisi, peserta wajib memasukkan password untuk memulai)</label>
            <input id="nf60Password" type="text" placeholder="Kosongkan jika soal bebas dibuka tanpa password" maxlength="40" autocomplete="off">
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
              <label><input type="checkbox" id="nf60AllowIpCalc" checked> 🧮 Izinkan Kalkulator IP saat ujian</label>
              <label><input type="checkbox" id="nf60RestrictInv"> 🎯 Batasi inventori ke perangkat wajib</label>
            </div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">🌐 Aturan IP Spesifik per Perangkat (Opsional)</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:7px;">Isi IP eksak (mis. <code>192.168.10.10</code>) atau subnet wildcard (mis. <code>192.168.10.*</code>), prefix (<code>24</code>), dan gateway opsional.</div>
            <div class="nf60-ip-list" id="nf60IpList"></div>
            <button type="button" class="nf60-btn" id="nf60AddIpRule">＋ Tambah Aturan IP Perangkat</button>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">🏷️ Aturan VLAN &amp; Switch Trunk (Opsional)</div>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:7px;">Pilih perangkat, isi VLAN ID (mis. <code>10</code> atau <code>10,20</code> untuk trunk), mode antarmuka (<code>access</code>/<code>trunk</code>), dan jumlah minimal unit.</div>
            <div class="nf60-vlan-list" id="nf60VlanList"></div>
            <button type="button" class="nf60-btn" id="nf60AddVlanRule">＋ Tambah Aturan VLAN / Trunk</button>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">🔗 Jalur Koneksi Kustom Bebas (Opsional)</div>
            <div class="nf60-cpath-list" id="nf60CustomPathList"></div>
            <button type="button" class="nf60-btn" id="nf60AddCustomPath">＋ Tambah Pasangan Jalur Kustom</button>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">⚙️ Layanan Jaringan (DHCP, DNS, Konflik IP &amp; Media Kabel)</div>
            <div class="nf60-row-actions" style="font-size:12px;margin-bottom:8px;">
              <label><input type="checkbox" id="nf60ReqNoConflict" checked> 🛡️ Bebas Konflik IP</label>
              <label><input type="checkbox" id="nf60ReqRouterDhcp"> 🔄 Router wajib DHCP Server</label>
              <label><input type="checkbox" id="nf60ReqClientDhcp"> 📡 Klien wajib mode DHCP</label>
            </div>
            <div class="nf60-grid2">
              <div class="nf60-field">
                <label>🌍 DNS Server Wajib (Opsional)</label>
                <input id="nf60ReqDns" type="text" placeholder="Contoh: 192.168.10.10 atau 8.8.8.8">
              </div>
              <div class="nf60-field">
                <label>🔌 Media Kabel Wajib (Opsional)</label>
                <select id="nf60ReqMedia">
                  <option value="">Bebas (Ethernet / Wi-Fi / apa saja)</option>
                  <option value="fiber">Wajib ada tautan Fiber / SFP</option>
                  <option value="poe">Wajib ada tautan PoE</option>
                  <option value="wifi">Wajib ada tautan Wi-Fi</option>
                </select>
              </div>
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
            <button type="button" class="nf60-btn" id="nf60SaveBank">💾 Simpan ke Bank Soal</button>
            <button type="button" class="nf60-btn" id="nf60SaveFolder">📁 Simpan ke Folder PC</button>
            <button type="button" class="nf60-btn drive" id="nf60SaveDrive">☁️ Simpan ke Google Drive</button>
            <button type="button" class="nf60-btn" id="nf60CopyCode">📋 Salin Kode</button>
            <button type="button" class="nf60-btn accent" id="nf60ExportJson">⬇️ Unduh .json</button>
            <button type="button" class="nf60-btn primary" id="nf60TestMission">▶ Uji Coba</button>
          </div>
        </div>

        <!-- TAB 2: BANK SOAL LOKAL, FOLDER PC & GOOGLE DRIVE -->
        <div class="nf60-body" id="nf60TabBank" style="display:none;">
          <div class="nf60-box">
            <div class="nf60-box-title">💾 Bank Soal Tersimpan di Browser (Lokal)</div>
            <div style="font-size:11.5px;color:#94a3b8;">Tersimpan otomatis di perangkat ini tanpa perlu internet.</div>
            <div class="nf60-bank-list" id="nf60LocalBankList"></div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">📁 Folder Khusus di Komputer (Chrome / Edge Desktop)</div>
            <div class="nf60-row-actions">
              <button type="button" class="nf60-btn accent" id="nf60PickFolder">📂 Pilih Folder Soal di Komputer</button>
              <button type="button" class="nf60-btn" id="nf60RefreshFolder">🔄 Muat Ulang Folder</button>
              <span class="nf60-pill" id="nf60FolderStatusPill">📁 Belum ada folder komputer yang dipilih</span>
            </div>
            <div class="nf60-bank-list" id="nf60FolderBankList"></div>
          </div>

          <div class="nf60-box">
            <div class="nf60-box-title">☁️ Google Drive (Folder: NET FORGE - Bank Soal)</div>
            <div class="nf60-row-actions">
              <button type="button" class="nf60-btn drive" id="nf60ConnectDrive">🔗 Hubungkan &amp; Muat Google Drive</button>
              <button type="button" class="nf60-btn" id="nf60RefreshDrive">🔄 Segarkan Drive</button>
              <span class="nf60-pill" id="nf60DriveStatusPill">☁️ Google Drive Belum Terhubung</span>
            </div>
            <details class="nf60-details">
              <summary>⚙️ Pengaturan Lanjutan Google Drive (Client ID &amp; Syarat)</summary>
              <div style="margin-top:6px;line-height:1.45;">
                Google Client ID otomatis dibaca dari backend API yang terhubung di Pengaturan. Pastikan <b>Google Drive API</b> aktif di Google Cloud Console Anda. Jika menjalankan mode offline/mandiri, Anda dapat menempelkan OAuth Web Client ID di bawah ini:
                <input id="nf60DriveClientId" type="text" placeholder="Opsional: xxxxx.apps.googleusercontent.com" style="margin-top:6px;background:#061529;color:#f1f8ff;border:1px solid rgba(56,189,248,0.35);border-radius:7px;padding:6px 8px;width:100%;box-sizing:border-box;font-size:11.5px;">
              </div>
            </details>
            <div class="nf60-bank-list" id="nf60DriveBankList"></div>
          </div>

          <div class="nf60-status" id="nf60BankStatus"></div>
        </div>

        <!-- TAB 3: STUDENT EXAM MODE -->
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
              <button type="button" class="nf60-btn drive" id="nf60JumpBank">📚 Pilih dari Bank Soal / Folder / Drive</button>
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

    m.querySelectorAll('.nf60-chip').forEach(lbl => {
      lbl.addEventListener('click', e => {
        if (e.target && e.target.classList.contains('nf60-qty')) return;
        const inp = lbl.querySelector('input[type="checkbox"]');
        setTimeout(() => lbl.classList.toggle('on', inp.checked), 0);
      });
    });

    m.querySelectorAll('.nf60-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const which = tab.dataset.nf60Tab;
        m.querySelectorAll('.nf60-tab').forEach(t => t.classList.toggle('active', t === tab));
        $('nf60TabDesigner').style.display = which === 'designer' ? 'flex' : 'none';
        $('nf60TabBank').style.display = which === 'bank' ? 'flex' : 'none';
        $('nf60TabExam').style.display = which === 'exam' ? 'flex' : 'none';
        if (which === 'bank') { renderLocalBankList(); renderFolderList(); renderDriveList(); }
        if (which === 'exam') updateExamPreview();
      });
    });

    m.querySelector('#nf60ModalClose').addEventListener('click', () => m.classList.remove('open'));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && m.classList.contains('open')) m.classList.remove('open'); });
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
    $('nf60AddIpRule').addEventListener('click', () => addIpRuleRow());
    $('nf60AddVlanRule').addEventListener('click', () => addVlanRuleRow());
    $('nf60AddCustomPath').addEventListener('click', () => addCustomPathRow());

    m.querySelectorAll('button[data-nf60-tpl]').forEach(b => {
      b.addEventListener('click', () => {
        currentEditingId = null;
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
      const pack = readDesignerFormProtected();
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const slug = pack.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32) || 'misi';
      a.download = `soal-netforge-${slug}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1500);
      $('nf60DesignerStatus').textContent = '✓ File soal .json berhasil diunduh — siap dibagikan ke siswa!';
    });

    $('nf60SaveBank').addEventListener('click', () => {
      const pack = readDesignerFormProtected();
      const saved = savePackToLocalBank(pack);
      $('nf60DesignerStatus').textContent = `✓ Soal "${saved.title}" tersimpan ke Bank Soal Browser!`;
    });

    $('nf60SaveFolder').addEventListener('click', async () => {
      const pack = readDesignerFormProtected();
      try {
        const res = await savePackToComputerFolder(pack);
        if (res.mode === 'folder') {
          $('nf60DesignerStatus').textContent = `✓ Tersimpan langsung ke folder komputer: ${res.label}`;
        } else if (res.mode === 'picker') {
          $('nf60DesignerStatus').textContent = `✓ File soal disimpan ke lokasi pilihan Anda: ${res.label}`;
        } else {
          $('nf60DesignerStatus').textContent = `✓ File ${res.label} diunduh (browser ini memakai folder unduhan standar).`;
        }
      } catch (err) {
        if (err?.name === 'AbortError') return;
        $('nf60DesignerStatus').textContent = '⚠ Gagal menyimpan ke folder: ' + err.message;
      }
    });

    $('nf60SaveDrive').addEventListener('click', async () => {
      const pack = readDesignerFormProtected();
      const st = $('nf60DesignerStatus');
      try {
        st.textContent = '⏳ Menyimpan soal ke Google Drive (NET FORGE - Bank Soal)…';
        const res = await savePackToGoogleDrive(pack);
        st.textContent = `✓ Soal ${res.updated ? 'diperbarui' : 'disimpan'} di Google Drive → ${DRIVE_FOLDER_NAME}/${res.fileName}`;
      } catch (err) {
        st.textContent = '⚠ ' + err.message;
      }
    });

    $('nf60PickFolder').addEventListener('click', async () => {
      const st = $('nf60BankStatus');
      try {
        const folderName = await connectLocalFolder();
        st.textContent = `✓ Folder "${folderName}" terhubung (${folderExamEntries.length} file soal ditemukan).`;
      } catch (err) {
        if (err?.name === 'AbortError') return;
        st.textContent = '⚠ ' + err.message;
      }
    });

    $('nf60RefreshFolder').addEventListener('click', async () => {
      const st = $('nf60BankStatus');
      if (!connectedDirHandle) {
        st.textContent = 'Pilih folder komputer terlebih dahulu.';
        return;
      }
      try {
        await scanConnectedFolder();
        st.textContent = `✓ Daftar file di folder "${connectedDirHandle.name}" diperbarui (${folderExamEntries.length} soal).`;
      } catch (err) {
        st.textContent = '⚠ ' + err.message;
      }
    });

    $('nf60ConnectDrive').addEventListener('click', async () => {
      const st = $('nf60BankStatus');
      try {
        st.textContent = '⏳ Menghubungkan ke Google Drive…';
        await ensureDriveToken(true);
        const files = await listDriveExamFiles();
        st.textContent = `✓ Google Drive terhubung! Ditemukan ${files.length} file soal di folder "${DRIVE_FOLDER_NAME}".`;
      } catch (err) {
        st.textContent = '⚠ ' + err.message;
      }
    });

    $('nf60RefreshDrive').addEventListener('click', async () => {
      const st = $('nf60BankStatus');
      try {
        st.textContent = '⏳ Menyegarkan daftar soal dari Google Drive…';
        const files = await listDriveExamFiles();
        st.textContent = `✓ Daftar Google Drive diperbarui (${files.length} soal).`;
      } catch (err) {
        st.textContent = '⚠ ' + err.message;
      }
    });

    $('nf60JumpBank').addEventListener('click', () => {
      const tabBtn = m.querySelector('.nf60-tab[data-nf60-tab="bank"]');
      if (tabBtn) tabBtn.click();
    });

    try {
      const savedCid = localStorage.getItem(DRIVE_CLIENT_KEY) || '';
      if (savedCid && $('nf60DriveClientId')) $('nf60DriveClientId').value = savedCid;
    } catch (_) {}


    $('nf60CopyCode').addEventListener('click', async () => {
      const pack = readDesignerFormProtected();
      try {
        await navigator.clipboard.writeText(JSON.stringify(pack));
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

    $('nf60StartExam').addEventListener('click', async () => {
      let packToRun = loadedExamPack;
      if (packToRun?.passwordProtected && !packToRun._unlockedPassword) {
        packToRun = await promptPasswordForPack(packToRun, 'memulai ujian');
        if (!packToRun) return;
      }
      const name = ($('nf60StuName')?.value || '').trim() || window.NetForgeAuth?.getPlayer?.()?.name || window.NetForgeGuest?.profile?.()?.name || 'Peserta Ujian';
      const nim = ($('nf60StuNim')?.value || '').trim();
      const kelas = ($('nf60StuClass')?.value || '').trim();
      startExamSession(packToRun, { name, nim, kelas });
    });

    populateDesignerForm(TEMPLATES[0]);
    renderLocalBankList();
    renderFolderList();
    renderDriveList();
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
      b.textContent = '📝 Ujian';
      b.title = 'Buat soal misi kustom atau jalankan Mode Ujian Sekolah/Kampus';
      b.addEventListener('click', () => openDesigner('designer'));
      tabs.appendChild(b);
      return true;
    }
    return Boolean($('nf60OpenBtn'));
  }

  // Keep right-sidebar Exam Rubric Panel synced automatically while student builds topology
  document.addEventListener('click', () => {
    if (activeExam) setTimeout(refreshSidePanel, 220);
  }, true);

  window.NetForgeExamDesigner = {
    version: '0.72.1',
    openDesigner,
    startExamSession,
    stopExam,
    evaluateExam,
    printExamReport,
    templates: TEMPLATES
  };


  function dismissIntroAndOpen(tabName) {
    const dlg = $('nf372MissionDialog');
    if (dlg) dlg.hidden = true;
    const intro = $('nf322Overlay');
    if (intro) intro.hidden = true;
    const home = $('nf322Home');
    if (home) home.hidden = false;
    const startModal = $('startModal');
    if (startModal) startModal.classList.remove('open');
    try { API()?.setMode?.('mixed'); } catch (_) {}
    openDesigner(tabName || 'exam');
  }

  function injectIntroAndPickerEntries() {
    let okPicker = false;

    // 1. Two clear cards inside Mission Control Picker (#nf372MissionDialog)
    const grid = document.querySelector('#nf372MissionDialog .nf372-mission-grid');
    if (grid) {
      if (!$('nf60PickerExam')) {
        const examCard = document.createElement('button');
        examCard.id = 'nf60PickerExam';
        examCard.type = 'button';
        examCard.className = 'nf372-choice nf60-picker-exam';
        examCard.innerHTML = '<span class="nf372-chip">Ujian · Peserta</span><strong>🎓 Mode Ujian (Siswa / Mahasiswa)</strong><small>Muat file soal .json, tempel kode soal, atau masukkan password ujian dari guru/dosen dengan fokus penuh.</small>';
        examCard.addEventListener('click', () => dismissIntroAndOpen('exam'));
        grid.appendChild(examCard);
      }
      if (!$('nf60PickerDesigner')) {
        const desCard = document.createElement('button');
        desCard.id = 'nf60PickerDesigner';
        desCard.type = 'button';
        desCard.className = 'nf372-choice nf60-picker-designer';
        desCard.innerHTML = '<span class="nf372-chip">Pengajar · Cloud</span><strong>📝 Desainer Misi &amp; Bank Soal (Guru / Dosen)</strong><small>Buat soal kustom (IP, VLAN, DHCP, DNS, Password), lalu simpan ke Browser, Folder PC, atau Google Drive.</small>';
        desCard.addEventListener('click', () => dismissIntroAndOpen('designer'));
        grid.appendChild(desCard);
      }
      okPicker = true;
    }

    // Intro Main Menu tetap ringkas — Mode Ujian & Desainer Misi diakses lewat Pilih Misi / Petualangan Baru
    $('nf60IntroExamBtn')?.remove();
    return okPicker;
  }

  let tries = 0;
  (function boot() {
    const a = injectLauncher();
    const b = injectIntroAndPickerEntries();
    if ((a && b) || ++tries > 30) return;
    setTimeout(boot, 400);
  })();
})();
