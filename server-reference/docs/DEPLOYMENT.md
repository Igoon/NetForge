# NET FORGE v0.32.0 Deployment (Pilot)

## A. LAB lokal

Buka `index.html` langsung di Chrome/Edge. Tidak memerlukan server; nilai di LAB/Misi bersifat lokal dan belum menjadi nilai resmi.

## B. Server penilaian pilot

PHP 8.2+, ekstensi PDO SQLite, Nginx, HTTPS certificate diperlukan. Letakkan file frontend dan `backend/` pada direktori berbeda; **`backend/src` dan DB harus di luar document root**. Berikut contoh arsitektur virtual host, bukan konfigurasi universal siap pakai:

```
/var/www/netforge/client/index.html
/opt/netforge/backend/public/router.php
/opt/netforge/backend/src/common.php
/opt/netforge/backend/bin/create-player.php
/var/lib/netforge/netforge.sqlite  # writable by PHP-FPM, not publicly accessible
```

Contoh Nginx PHP-FPM (path socket harus disesuaikan):

```nginx
server {
  listen 443 ssl http2;
  server_name game.example.edu;
  root /var/www/netforge/client;
  index index.html;
  # Configure ssl_certificate, ssl_certificate_key, TLS and HSTS in production.
  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy no-referrer always;
  location / { try_files $uri $uri/ /index.html; }
  location ^~ /api/v1/ {
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME /opt/netforge/backend/public/router.php;
    fastcgi_param SCRIPT_NAME /router.php;
    fastcgi_param HTTP_AUTHORIZATION $http_authorization;
    fastcgi_param HTTPS on;
    fastcgi_pass unix:/run/php/php8.3-fpm.sock;
  }
}
```

Buat `NETFORGE_DB_DIR` dan `NETFORGE_ORIGIN` sebagai environment variabel proses PHP-FPM. Jangan menaruh token dalam kode frontend maupun di URL. Setelah setup, jalankan:

```
php /opt/netforge/backend/bin/create-player.php "Mahasiswa Demo"
```

Lalu buka `https://game.example.edu`, masuk **Pengaturan → Progres Resmi (Server)**, isi URL `https://game.example.edu/api/v1` dan token mahasiswa. **Token tidak ditulis ke localStorage** dan tidak termasuk dalam backup JSON; disimpan dalam sessionStorage selama tab hidup. Pada Guided Lab, setelah topologi dibangun, klik **Verifikasi Guided Lab**.

## C. Operasional dan integrasi kampus

- Pilot ini menggunakan **token statis**, bukan SSO. Untuk skala kelas/kampus, ganti dengan backend session dan SSO (OIDC/Shibboleth) serta pencabutan token.
- Server menyimpan user, hash token, dan hasil penilaian. Backup file SQLite di luar web root dan amankan izin folder.
- Endpoint belum menyediakan panel administrasi / rubrik per kelas. Tidak boleh dipakai sebagai satu-satunya bukti evaluasi berisiko tinggi.
- Untuk public internet, tambahkan reverse-proxy rate limiter, firewall, logging akses yang aman, DB transaction isolation, dan mekanisme backup. Jangan mengandalkan penundaan 6 submission/menit sebagai pengamanan tunggal.
- Karena JS frontend dieksekusi di komputer peserta, **kode client dapat dibaca dan disalin**. Logika penilaian resmi perlu tetap berada di server.
