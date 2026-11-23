# Rencana Perlindungan Kode dan Distribusi

## Risiko

HTML/JS lokal: kode sumber dan ilustrasi dapat disalin, diubah, atau dibuka di DevTools. Obfuscation dan mematikan klik kanan hanya menghambat, bukan mencegah. PDF/screenshot atas tampilan juga tidak bisa sepenuhnya dilarang.

## Diterapkan v0.32.0

- Frontend tetap berjalan lokal untuk pembelajaran; **token dan secret server tidak disertakan dalam HTML**.
- Token disimpan hanya dalam sessionStorage, bukan profil atau backup.
- Validator skor resmi di PHP, sehingga skor/XP yang dikirim dari browser diabaikan.
- Bearer token disimpan sebagai SHA-256 di database; token baru dibuat lewat cryptographic RNG.
- Idempotency attemptId, pembatasan ukuran request, HTTPS required (di luar dev), Origin allowlist, no-store, rate limit dasar.
- Skor resmi dibedakan dari Learning XP lokal. Mengulang satu latihan tidak memberikan XP resmi tak terbatas.

## Belum diterapkan / wajib sebelum produksi

- **Pengujian end-to-end API/DB** di host yang memiliki `pdo_sqlite` (driver tidak tersedia di lingkungan pembuatan paket).
- Single sign-on institusional dan server-side session/rotating tokens.
- Challenge server-issued, nonce, batas waktu, per-event logging, rubrik per kelas, validasi input lebih mendalam; topologi akhir valid **masih dapat dikirim tanpa memainkan game**.
- CSP ketat (perlu migrasi inline scripts), source maps privat, build/minification, pemeriksaan dependensi, dependency lockfile.
- Security review independen dan pengujian penetrasi sebelum dipakai untuk ujian/sertifikasi.
- Kepemilikan hak cipta, lisensi karya/asset (termasuk hasil AI), merek NET FORGE, pembatasan redistribusi pada EULA/kontrak, dan pencatatan rilis.

## Praktik source control

Gunakan Git privat untuk source, tag setiap versi. Distribusikan build, bukan repository. Sertakan daftar checksum SHA-256 release untuk deteksi modifikasi yang **dibandingkan dengan checksum yang dipublikasikan melalui kanal terpercaya**, bukan hanya file checksum di ZIP yang sama.
