# NET FORGE v0.40.51 — Admin Feedback Center

Contoh integrasi, BUKAN backend yang telah di-deploy.

1. Integrasikan migration, controller, dan routes ke project Laravel backend.
2. Jangan menyalin folder backend ke publikasi GitHub Pages.
3. Pastikan model User, middleware auth:sanctum dan personal access token sesuai layanan SSO NET FORGE.
4. Definisikan Gate `moderate-netforge-feedback` **server-side** yang hanya mengizinkan admin tepercaya. Jangan percaya role dari browser atau request.
5. Konfigurasi CORS hanya untuk origin frontend resmi. API wajib HTTPS pada produksi.
6. Jalankan `php artisan migrate` setelah backup database, lakukan pengujian admin/non-admin, dan pastikan rate limit aktif.
7. Halaman admin di frontend otomatis menyembunyikan akses jika GET `/api/v1/admin/feedback/reports` mengembalikan 401/403. Backend adalah satu-satunya otoritas.

## API
- `GET /api/v1/admin/feedback/summary`: total dan jumlah laporan per status.
- `GET /api/v1/admin/feedback/reports?status=new&page=1`: pagination dan filter status.
- `PATCH /api/v1/admin/feedback/reports/{id}`: status + admin_note.
- `GET /api/v1/admin/feedback/ratings?page=1`: data rating moderasi.
- `PATCH /api/v1/admin/feedback/ratings/{id}`: is_visible true/false.

## Keamanan
- Dilarang mengirim token via query string. Kode frontend memakai Authorization Bearer.
- Jangan jadikan tombol tersembunyi sebagai pengganti authorization.
- Informasi laporan dapat memuat data pribadi: batasi akses dan tetapkan masa retensi.
- Moderasi dan perubahannya ditulis ke application log; untuk produksi pertimbangkan tabel audit terpisah.
- Dashboard tidak menampilkan data buatan saat API tidak tersedia.
