# NET FORGE v0.37.5 — PWA Update Recovery

Hotfix untuk bug *versi internal* pada rilis v0.37.4: `NETFORGE_RELEASE.version` keliru tertulis `0.37.3` meski label dan metadata sudah `0.37.4`.

## Instalasi
1. Unggah isi ZIP ini ke **root** repository `igoon/NetForge`.
2. Pastikan `index.html`, `sw.js`, `version.json`, dan `recovery.html` berada di folder yang sama.
3. Buka `https://igoon.github.io/NetForge/recovery.html` dari browser yang PWA-nya bermasalah.
4. Klik **Periksa ulang**, pastikan ketiga file server menunjukkan **v0.37.5**.
5. Klik **Pulihkan dan muat rilis terbaru**. Jangan hapus Site Data, Local Storage atau IndexedDB.
6. Jika server masih melaporkan versi lama, selesaikan deployment terlebih dahulu.

Perubahan ini hanya frontend. Backend v0.35.2 tetap kompatibel. Akun Google, misi Smart Home, Mission Control, dan autosave tetap dipertahankan.
