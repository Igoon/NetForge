# NET FORGE v0.34.6 — Public Player Access

Created by I GO ON (Igoon).

## Deploy GitHub Pages
Upload contents of this folder (not the folder itself) to the `NetForge` GitHub Pages repository root. Install over HTTPS. If an old PWA is open, use Check Update and restart after deployment.

## Access modes
- **Guest Mode** works immediately with no login. Misi and LAB are stored locally in the player's browser.
- **Official Progress** is optional. The current backend (`/api/v1/me`, `/progress`, `/attempts`) still uses a player token, entered in Settings; token is sessionStorage-only, not embedded in game or backed up. On reload in the same tab, the session can be rechecked automatically.
- **Persistent server login across browser restarts is NOT implemented.** It requires new backend endpoints, a secure login or OIDC flow, session/refresh rotation, logout and CORS/CSRF deployment review. GitHub Pages cross-site cookies may be blocked. Backend Tailscale Serve is accessible only from authorized Tailnet devices.
- Local progress and XP are not server-certified. Server alone validates official attempts.

## Security
Never hard-code secret credentials in GitHub Pages files. Revoke any previously disclosed token and create separate per-player credentials. Avoid exposing administration endpoints. Static PWA remains copyable; obfuscation is not meaningful authentication.

## Manual checks
Open on HTTPS: first start, guest start, LAB free, settings > guest name, close/reopen same site and confirm nickname persistence, official legacy token check in the same tab, no unauthorized score elevation, PWA update and offline fallback.
