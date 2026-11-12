# NET FORGE v0.36.7 — PWA Update Recovery

## Changes
- Waits for the pending Service Worker installation before treating an update as unavailable.
- Shows a deliberate **Pulihkan pembaruan** option when the worker stays stuck.
- Recovery unregisters only NET FORGE scope service worker and removes only `nf-static-*` app-shell cache entries; player progress in localStorage/IndexedDB is untouched.
- Version shown in game comes from running HTML, latest release information from `version.json`.
- No changes to backend authentication or LAB scoring.

## Deployment
Upload the full **GitHub Pages** package to the repository root (including `index.html`, `sw.js`, `version.json`). If an old installed PWA still can't update, use browser DevTools > Application > Service Workers > Unregister, followed by a reload. Do **not** choose Clear storage/Delete site data unless you have backed up local progress.

## Manual test
1. Deploy v0.36.6 to a staging path and open it. Install as PWA.
2. Deploy v0.36.7 on the same path. Keep old PWA open.
3. Click Cek Update. Confirm running version is old, latest version is new.
4. Click Unduh dan siapkan update, wait until SW is installed. Verify activation/reload.
5. With installation deliberately blocked, verify Pulihkan pembaruan appears and doesn't erase player progress.
