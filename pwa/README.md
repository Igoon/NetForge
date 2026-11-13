# NET FORGE v0.37.3 — Mission Workspace Integration Fix

Hotfix penting: perbaikan kesalahan `MutationObserver.observe` yang sebelumnya menghentikan inisialisasi Mission Control. Akibat bug tersebut, Smart Home Hybrid terbuka sebagai dialog fullscreen meskipun seharusnya tampil di workspace adaptif.

Perubahan:
- Memperbaiki `attributeFilter` agar hanya dipakai ketika `attributes: true`.
- Smart Home Hybrid berada di workspace bersama panel inventori sesuai misi, bukan modal terpisah.
- Menyembunyikan fitur virtualisasi yang tidak relevan.
- Sinkronisasi versi di HTML, version.json dan Service Worker.

Batasan: Smart Home masih berupa topologi dan konfigurasi interaktif, belum denah rumah bebas drag-and-drop; skor masih simulasi lokal. Backend v0.35.2 tidak berubah.
