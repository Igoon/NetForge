# NET FORGE v0.34.4 — PWA Audio Startup Fix

## Deploy GitHub Pages
Upload files inside this folder to the repository root (case sensitive: `/NetForge/`). `index.html`, `sw.js`, `manifest.webmanifest`, `version.json` and the `icons/` directory must be together.

## How audio works
The app displays an audio choice before starting the opening animation. Choose **Mulai Intro dengan Suara** to unlock Web Audio with a direct tap/click and start the intro. Or choose **Lanjut Tanpa Suara** for silent playback. The intro animation remains available in the menu for replay. The PWA cannot sound automatically before player interaction, regardless of browser configuration.

SFX volume is controlled using the Audio popover in the game. If still silent, check browser tab mute, system output volume, browser policy, and the displayed Web Audio status. After deploying, reload the PWA and use **Cek Update**. Existing locally saved game progress is not cleared by this update.

Backend official-progress API remains separate and is not cached by the service worker. Do not commit player tokens to GitHub.
