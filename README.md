# NET FORGE v0.40.3 — Mission Control → Unified Canvas

## Instalasi
Unggah semua isi ZIP GitHub Pages ke root repository, kemudian periksa `version.json`, `index.html`, dan `sw.js` melalui recovery.html. Tidak perlu menghapus localStorage pemain.

## Yang berubah
- Mission Control: pilih Network Basics, Smart Home Hybrid, Office Starter, atau Free Lab. Semuanya membuka canvas dan inventori **yang sama**.
- Inventori memfilter kategori perangkat per profil misi, tanpa menghapus perangkat/topologi yang sudah disimpan.
- Tombol Evaluasi Misi menjalankan validator lokal sesuai profil.
- Mode Klasik tetap tersedia untuk simulator/penilaian lama.

## Batasan
Skor Unified Mission Validator hanya edukatif/lokal; tidak mengubah skor atau XP resmi. Browser terinstal dan siklus PWA update perlu diverifikasi setelah deployment.
