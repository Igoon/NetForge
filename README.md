# NET FORGE v0.32.9 — Unified Intro Audio Fix

**Perbaikan:** SFX intro dan gameplay memakai Audio Manager yang sama, satu mute dan pengaturan volume.

### Mendengar SFX intro
1. Buka game di HTTPS (GitHub Pages) atau localhost.
2. Pada layar intro tekan **Aktifkan SFX (putar intro)**: ini adalah interaksi pengguna yang mengizinkan audio browser, lalu intro diputar ulang dengan suara.
3. Jika intro sudah terlewati, buka menu utama, buka Audio, aktifkan, lalu **Putar Ulang Intro**.

Browser umumnya tidak mengizinkan autoplay audio sebelum interaksi; intro otomatis pertama kali tetap visual dan dapat berlangsung tanpa suara.

### Deploy
Unggah isi folder ini (kecuali `server-reference` bila hanya memakai GitHub Pages) ke root repository. `sw.js` memakai cache release v0.32.9; pada pengguna yang sudah memasang PWA, pilih tombol *Update tersedia* ketika muncul.

Untuk skor resmi diperlukan backend terpisah. GitHub Pages hanya meng-host frontend statis.

Created by I GO ON (Igoon).
