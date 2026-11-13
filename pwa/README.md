# NET FORGE v0.39.2 — Visual Port Connection Builder

Rilis ini menambahkan dialog pemilihan port fisik ketika dua perangkat Smart Home dihubungkan melalui alat **Hubungkan**. Pilih port A/B yang kosong dan kompatibel, lalu tekan **Sambungkan**. Untuk PoE, hanya port PoE switch yang dapat dipilih. Port terpakai ditandai hijau, port tidak cocok merah. Koneksi Guided dan data topologi versi lama tetap dapat dibaca.

## Deploy

Unggah seluruh isi paket ke root repository `igoon/NetForge` dan pastikan `index.html`, `sw.js`, `version.json`, serta `recovery.html` terganti. Cadangkan progres lokal sebelum deployment. Backend v0.35.2 tidak perlu berubah.

## Cakupan

Pemilihan port baru tersedia pada builder Smart Home. Network Basics masih menggunakan editor lama, tetapi audit menggunakan model graf yang sama. Indikator LED adalah **status port alokasi simulasi**, bukan pengukuran Ethernet sesungguhnya. Skor Smart Home belum menjadi nilai server resmi.
