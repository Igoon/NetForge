# NET FORGE — Laravel integration examples (paired with frontend v0.40.86)

PENTING: Ini contoh integrasi Laravel yang berasal dari paket backend v0.40.70, BUKAN backend NET FORGE lengkap atau server siap deploy. Tidak ada modifikasi API backend khusus untuk v0.40.86.

## Cara pakai
1. Ekstrak ke folder kerja PRIVAT, bukan GitHub Pages.
2. Baca backend-laravel-example/README.md, GOOGLE-AUTH-BACKEND-V0.40.65.md, dan dokumen integrasi terkait.
3. Integrasikan controller, route snippet, migration ke proyek Laravel terpasang. Pastikan versi Laravel, Sanctum, composer dependencies, CORS, dan konfigurasi Google OAuth sesuai lingkungan Anda.
4. Audit permissions, rate limiting, token handling, user mapping, dan migrasi sebelum deploy.
5. Jalankan pengujian end-to-end login Google, /me, logout, rating, Cloud Save revision conflict dengan akun uji.

## Batasan
- Contoh kode tidak memuat proyek Laravel utuh, dependensi composer, aplikasi berjalan, atau kredensial produksi.
- Jangan mengunggah kode backend, .env, atau credential ke repository GitHub Pages.
- Nama paket diselaraskan pada frontend v0.40.86 untuk kemudahan distribusi, bukan indikasi backend berubah ke v0.40.86.
