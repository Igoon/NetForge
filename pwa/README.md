# NET FORGE v0.34.1 — Tailscale backend configuration

Frontend static PWA: upload contents of this folder to GitHub Pages.

Backend URL preset: `https://netforge-docker2.taild3997b.ts.net/api/v1` (candidate URL; not verified). The existing backend runs over HTTP at port 8085 on the tailnet. You must configure an HTTPS endpoint such as Tailscale Serve, then verify the URL before using the preset.

## Backend setup

1. On the host running the API, enable HTTPS with Tailscale Serve for the internal HTTP service listening on 127.0.0.1:8085 (or the actual interface/bind address). For current Tailscale versions use `tailscale serve --bg 8085` on the host (assuming the service is reachable locally on port 8085); check with `tailscale serve status`. This publishes HTTPS within your tailnet, not publicly. See https://tailscale.com/docs/reference/tailscale-cli/serve .
2. Confirm the HTTPS URL `/api/v1/health` from a client device connected to the same Tailnet.
3. Configure backend `NETFORGE_ORIGIN` to exactly `https://YOURNAME.github.io`, not the project path, when deploying at `https://YOURNAME.github.io/net-forge/`. Origin matching is scheme + hostname + port only.
4. Keep `NETFORGE_ALLOW_HTTP=0`; ensure the PHP reverse proxy forwards `X-Forwarded-Proto: https` and that the backend trusts only your reverse proxy.
5. Add your renewed token in **Pengaturan → Progres Resmi (Server)**. Do not commit token in GitHub or JavaScript.
6. Test `Verifikasi akun`, `Lihat progres resmi`, and a Guided Lab submission. The API must be reachable from the player's device through Tailscale.

## Security

A token was disclosed during setup: revoke/rotate it before using this release. The token is intentionally NOT included anywhere in the distributable.

Service worker only caches same-origin app shell and icons; never caches API calls. GitHub Pages cannot host PHP backend. PWA on GitHub Pages does not protect frontend source against copying.

## Important

This release changes only the backend URL preset and guidance; it does not bypass GitHub Pages mixed-content rules or Tailnet network restrictions. Server integration is untested without access to the user's Tailnet.
