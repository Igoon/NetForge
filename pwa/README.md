# NET FORGE v0.35.0 — Public Learning Platform

Created by I GO ON (Igoon).

Upload **isi folder ini** (bukan foldernya) ke repository GitHub Pages `igoon/NetForge`.

- **Guest:** langsung main tanpa akun, progres lokal browser.
- **Official:** buka Pengaturan -> Akun Resmi -> Masuk dengan Google. Tidak membutuhkan token Tailscale. Login memerlukan backend NET FORGE v0.35.0 dan Google Web Client ID pada server.
- **Skor:** server tetap mengevaluasi LAB secara independen; progres lokal tidak diakui otomatis.
- **URL API:** pada Pengaturan bagian Progres Resmi, isikan API HTTPS publik untuk pemain umum. Default masih endpoint Tailscale **privat**, untuk pengujian di Tailnet saja.
- **Sesi:** access token hanya singkat (15 menit); refresh token persisten (30 hari) tersimpan lokal dan dirotasi server. Gunakan perangkat pribadi; logout setelah memakai perangkat bersama.

Baca `docs/DEPLOY-0350.md` pada **paket lengkap** untuk cara instal Google Cloud dan Docker. Jangan menyimpan secret/token pribadi di GitHub.
