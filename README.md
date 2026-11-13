# NET FORGE v0.40.8 — Mission Progress Dashboard

Dashboard baru membedakan tiga sumber: **latihan lokal**, **hasil yang dihitung server**, dan **antrean belum tersinkron**. Riwayat server hanya dimuat lewat tombol dan dihapus dari tampilan saat identitas Google berubah; autentikasi tetap dilakukan oleh fitur backend yang sudah ada.

- Profil: Network Basics, Smart Home Hybrid, Office Starter.
- Tombol `Muat Progres Server` dan `Kirim Ulang Antrean` berada pada panel dashboard.
- Pengiriman ulang tetap menggunakan ID percobaan lama dan validasi akun server.
- Tidak ada migrasi database dan tidak ada pemberian XP resmi.
- Bila backend v0.40.7 sudah terpasang, cukup perbarui frontend GitHub Pages. Backend referensi dibundel di paket lengkap untuk instalasi baru.

**Pengujian produksi**: login Google, database SQLite, koneksi Tailscale, dan PWA terinstal harus diverifikasi di deployment pengguna.
