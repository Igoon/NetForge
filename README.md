NET FORGE v0.40.20 — 3D Device Art & PWA Recovery Hotfix

- Device Unified Canvas menggunakan 12 gambar SVG pseudo-3D berbeda: Router, Switch, AP, Desktop PC, Laptop, Tablet, Smartphone, Server, TV, Camera, IoT, NVR.
- LED dan layar mengikuti status koneksi graf; tampilan 3D bergaya ilustrasi, bukan engine 3D WebGL.
- Menu aksi kontekstual, modal konfigurasi, Log Aktivitas, dan animasi paket sebelumnya tetap digunakan.
- Dialog update menampilkan akses Pemulihan PWA walaupun versi server tak terbaca.
- Halaman recovery menyediakan reset cache manual setelah upload deployment; Local Storage dan IndexedDB tidak dihapus.

PENTING: Jika versi server tidak ditemukan, periksa deployment GitHub Pages lebih dulu. Reset cache tidak dapat menciptakan file yang belum diunggah. Unggah SEMUA isi ZIP ini ke ROOT repository, bukan folder tambahan.
Backend tidak berubah.
