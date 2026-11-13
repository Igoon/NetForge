# NET FORGE v0.37.1 — Smart Home Hybrid Release Hotfix

## Perbaikan
- Nama rilis pada konstanta `window.NETFORGE_RELEASE` dan **Credits** sekarang sesuai: **Smart Home Hybrid — Release Consistency Fix**.
- Nomor versi aplikasi pada `index.html`, metadata `version.json`, cache Service Worker (`sw.js`) adalah **v0.37.1**.
- Mode N01 Smart Home Hybrid, Google Login, Guided Lab, fitur pemulihan, dan sistem update dipertahankan.
- Tidak diperlukan migrasi database atau deploy backend baru bila sudah memakai backend v0.35.2.

## Perhatian saat update
- PWA yang menjalankan versi lama mungkin tetap menampilkan v0.37.0 sebelum Service Worker baru selesai diaktifkan.
- Buka **Cek Update**, lihat perbandingan versi, lakukan update, dan buka kembali aplikasi.
- Jika updater lama macet, cadangkan progres lalu ikuti pemulihan Service Worker dan cache aplikasi **tanpa menghapus Local Storage**.

## Pengujian
- Lakukan tes `version.json`, `sw.js`, halaman Credits, tombol misi N01, dialog update, serta Google Login pada domain deploy.
- Pengujian sintaks kode **bukan** pengganti pengujian PWA install/update di browser nyata.
