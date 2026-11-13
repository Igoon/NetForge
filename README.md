# NET FORGE v0.40.5 — Server-Validated Unified Mission Results

Upload isi ZIP GitHub Pages ke root repo. **Perlu deploy backend PHP baru** dari FULL-PACKAGE/server-reference/backend agar endpoint `/api/v1/unified-missions` aktif.

Pemain yang login Google dapat menekan **Kirim Evaluasi ke Server** pada panel Unified Mission. Backend menghitung ulang hasil dari topology yang dikirim, memberi idempotensi per attemptId, dan menyimpan skor terbaik per akun. Tidak ada XP resmi tambahan: topologi dikirim dari browser dan dapat dipalsukan, sehingga hasil hanya `server-validated educational`. Penilaian Guided Lab lama tidak berubah.

Perhatian: URL backend Tailscale Serve hanya dapat diakses dari perangkat yang memiliki akses Tailnet. Jangan mengunggah isi `server-reference` ke GitHub Pages.
