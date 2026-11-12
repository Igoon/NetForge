# NET FORGE v0.35.0 — Full Package

- `pwa/`: siap unggah ke GitHub Pages, Guest gratis tanpa login, Google Login opsional.
- `backend/`: PHP 8.3 + SQLite, endpoint `/auth/config`, `/auth/google`, `/auth/refresh`, `/auth/logout`, dan `/me`, `/progress`, `/attempts` (backend scorer).
- `docs/DEPLOY-0350.md`: deployment, keamanan, OAuth Client ID, domain API publik.

Perlu konfigurasi manual Google Web Client ID dan domain HTTPS API yang dapat diakses internet; Tailscale Serve saja tidak cukup untuk pemain umum. Jangan unggah folder `backend/` atau `.env` ke GitHub Pages.
