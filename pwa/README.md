# NET FORGE v0.37.4 — Unified Mission Navigation Fix

Perbaikan alur misi ketika pemain memilih Mission Control → Smart Home Hybrid → Kembali ke Mission Control. Sebelumnya tombol petualangan lama dapat membuka briefing Network Basics tanpa dipilih.

- Tombol **Pilih Misi · Petualangan Baru** di menu utama sekarang membuka Mission Control.
- Smart Home masuk langsung ke workspace tanpa memicu tombol Continue dan modal petualangan lama.
- Tombol **Kembali ke Mission Control** menutup Smart Home dan menampilkan daftar misi saja.
- **Network Basics** membuka briefing petualangan dasar hanya saat misi tersebut dipilih secara eksplisit.
- **Free Network Lab** tetap berupa editor topologi bebas.
- Semua progres dan API backend lama dipertahankan; tidak perlu update backend.

### Uji manual
1. Dari menu utama, tekan Pilih Misi · Petualangan Baru → Smart Home Hybrid.
2. Tekan Kembali ke Mission Control. Pastikan modal Mulai Petualangan Baru tidak muncul.
3. Pilih Smart Home Hybrid sekali lagi dan pastikan konfigurasi lokal tetap tersimpan.
4. Pilih Network Basics: baru di sini modal tingkat kesulitan petualangan dasar muncul.
5. Pilih Free Network Lab: area topologi bebas terbuka tanpa modal petualangan dasar.
6. Periksa Cek Update: versi aktif 0.37.4 dan changelog sesuai.
