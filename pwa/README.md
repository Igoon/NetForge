# NET FORGE v0.37.6 — Single Mission Entry Fix

Perbaikan menu utama: dua tombol yang sama-sama membuka Mission Control disatukan menjadi satu tombol **Pilih Misi / Petualangan Baru**.

## Menu
- **Lanjut Bermain**: melanjutkan sesi/progres lokal yang tersedia.
- **Pilih Misi / Petualangan Baru**: membuka Mission Control sekali.
- **Network Lab**: akses percobaan jaringan bebas (fitur lama tetap dipertahankan).

Dalam Mission Control, pilih Network Basics, Smart Home Hybrid, atau Free Network Lab. Smart Home tetap menggunakan workspace adaptif.

## Deployment
Unggah seluruh isi ZIP ini ke root repository `igoon/NetForge`, termasuk `index.html`, `sw.js`, `version.json`, dan `recovery.html`.

Jika PWA terinstal masih menyajikan UI lama, gunakan halaman `https://igoon.github.io/NetForge/recovery.html` setelah GitHub Pages selesai deployment. Jangan hapus site data, localStorage atau IndexedDB. Backend tetap v0.35.2.
