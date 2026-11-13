# NET FORGE v0.39.4 — Device Inspector & Live Port Status

Frontend-only update based on v0.39.2. New Smart Home Device Inspector shows occupied/available ports, Wi-Fi associations, port peers, PoE-capable ports, audit issues, and shortcuts to configuration and port audit. Green indicators mean topology allocation, not real measured link traffic. Backend unchanged; do not overwrite existing database or .env.

Deploy contents of this folder into the root of igoon/NetForge on GitHub Pages. Verify index.html, sw.js, version.json, and recovery.html uploaded together.


## Catatan penting versi 0.39.4
Halaman recovery.html v0.39.4 memisahkan pembacaan versi server dan cache Service Worker. Jika halaman masih controlled, klik **Lepas Service Worker & Periksa Server**, lalu bandingkan ketiga versi sebelum melakukan pemulihan. Tidak menghapus Local Storage.
