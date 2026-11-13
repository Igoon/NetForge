# NET FORGE v0.40.18 — Workspace Cleanup & Packet Pulse

Frontend-only update. Replace all files in the GitHub Pages root with the contents of this package. No backend update required.

- Permanently remove the duplicate **Konfigurasi Perangkat** dock shown beneath the workspace. The existing Unified Canvas device config modal still opens on double click.
- Restore **Log Aktivitas** as the third visible command dock panel next to Iga and Terminal. Same original log DOM, without duplicate forms.
- Replace bulky **Alat Network Basics** panel with compact tools bar. Retain Tool/Media and existing buttons.
- On successful Unified Canvas Ping, show a short data-packet pulse along the simulated path. Does not affect scoring. Reduced-motion respected.

Do not overwrite production .env or SQLite. Deployment and installed-PWA runtime have not been verified.
