# NetForge

Laboratorium topologi jaringan interaktif. Susun perangkat, tarik kabel,
konfigurasi IP/VLAN/DHCP, lalu jalankan simulasi untuk menyelesaikan misi.
Setiap misi punya target waktu, skor empat komponen, dan gangguan acak yang
bisa dicegah.

## Menjalankan

```bash
npm install
npm run dev
```

Build produksi dan pratinjau:

```bash
npm run build
npm run preview
```

## Perintah

- `npm run dev` - server pengembangan Vite
- `npm run build` - cek TypeScript dan build produksi
- `npm test` - unit test engine validasi, skor, dan insiden (Vitest)
- `npm run lint` - Oxlint
- `npm run test:e2e` - E2E Playwright
- `npm run preview` - pratinjau hasil build

## Misi

1. Kabel Pertama - menghubungkan dua PC.
2. Switch Kecil - membangun LAN dengan switch.
3. Dua Subnet - routing dan gateway.
4. DHCP Kantor - konfigurasi DHCP.
5. VLAN Tamu - segmentasi VLAN dan isolasi tamu.
6. Kafe Dua Lantai - pelanggan tetap, dua switch, printer, dan DHCP.

## Skor dan insiden

- Skor: misi 50, waktu 20, penanganan insiden 20, kerapian 10.
- Sebelum misi, pilih 2 perlengkapan dari 4 item; timer baru berjalan setelah menekan Mulai.
- Setiap level memakai seed acak: IP, subnet, VLAN, label perangkat, dan insiden bisa berbeda.
- Seed ditampilkan di briefing dan bisa diacak ulang sebelum mulai.
- Timer berjalan otomatis dan bisa dijeda; target waktu tampil di HUD.
- Insiden MVP: baterai laptop habis, kabel ditarik kucing, dan token listrik habis.
- Insiden pertama dipicu oleh progres misi 50% atau waktu, mana yang lebih dulu.
- Insiden bisa diselesaikan cepat, memakai inventory, atau memasang pencegahan.
- Inventory awal: kabel cadangan, token listrik, charger, dan cable clip.
- Pemakaian inventory langsung memulihkan tanpa penalti waktu; pencegahan memblokir insiden sejenis dan menjaga skor kerapian.
- Item kosong bisa di-restock dengan biaya 15 detik.
- Efek dramatis: pop-up komik di tengah kanvas, balon percakapan, suara sintetis Web Audio, getaran kanvas, dan kedip blackout. Semua bisa dimatikan lewat SFX dan menghormati reduced motion.

## Karakter dan progresi

- Tokoh utama: **Iga**, teknisi jaringan.
- Papan order menampilkan tiga pekerjaan; order terkunci sampai level sebelumnya lulus.
- Papan order adalah navigasi level utama; dropdown level sudah dihapus.
- Playwright menguji alur order, Escape modal, dialog customer, dan kantor 2D di CI.
- Setiap level dibuka lewat order customer dan dialog dua avatar.
- Setelah misi, laporan customer dan tombol kembali ke kantor tersedia.
- Profil menyimpan uang, XP, level, reputasi, hari, dan rekor bintang.
- Level terkunci sampai level sebelumnya memperoleh minimal 1 bintang.
- Skor menentukan bintang: 3 bintang >=90, 2 bintang >=70, 1 bintang >=50.
- Misi yang lulus memberi uang, XP, dan reputasi. Pengulangan tetap mengurangi hadiah.
- Tombol level berikutnya hanya muncul jika misi sudah lulus.
- Kantor Iga berisi tiga NPC dan toko upgrade: toolbox, cable tray, dan UPS.
- Toolbox mempercepat restock; cable tray dan UPS mencegah insiden terkait.
- Data profil disimpan terpisah di `localStorage`.

## Keamanan dan update

- Profil divalidasi dengan Zod, nilai di-clamp, dan data lama disimpan sebagai backup.
- Graf tersimpan divalidasi dengan Zod; node/edge rusak dibuang.
- Kantor 2D tidak membutuhkan WebGL; topologi misi tetap memakai React Flow.
- Bintang dan hadiah dihitung ulang dari skor; data bintang kiriman klien tidak dipercaya.
- Pembelian upgrade memeriksa kepemilikan dan saldo uang.
- Kunci level ditegakkan di store, bukan hanya di tampilan.
- Notifikasi changelog muncul saat versi berubah.
- Service worker menampilkan tombol muat ulang saat update PWA tersedia.
- Modal memiliki focus trap dan Escape; CI menjalankan test, lint, E2E, dan build.
- Versi dan cache service worker disinkronkan dari package.json.
- Versi aplikasi saat ini: **0.7.0**.

## Kantor 2D pixel art

- Kantor Iga tampil sebagai scene pixel art 2D dengan sprite Iga, Mbak Rani, Pak Darma, customer, dan kucing.
- Papan order, meja, rak server, tanaman, dan upgrade kantor tampil sebagai bagian dari scene.
- Klik karakter untuk berdialog; customer memberi pilihan briefing sebelum berangkat.
- Panduan lima langkah muncul otomatis di shift pertama dan bisa dibuka lagi lewat tombol Panduan.
- Bu Sari kembali sebagai pelanggan tetap pada level Kafe Dua Lantai.
- Pilihan briefing dicatat dan ditampilkan di panel misi, order, dan laporan customer.
- Jurnal shift dan dialog NPC berubah mengikuti misi terakhir yang selesai.
- Kantor berevolusi dari bintang: foto klien, rak penghargaan, dan piala bertambah.
- Customer berjalan masuk saat kantor siap dan kembali ke laporan setelah misi.
- Animasi sprite, LED rak, dan walk-in dinonaktifkan saat prefers-reduced-motion.
- Papan topologi misi tetap 2D agar IP, port, dan jalur mudah dibaca.
- Tidak ada dependensi Three.js; scene kantor dirender dengan SVG dan CSS.

## Deploy GitHub Pages dan PWA

Build memakai `base: './'`, jadi bisa dipasang di root maupun subpath GitHub Pages.
Workflow `.github/workflows/deploy.yml` akan menjalankan test, build, lalu deploy
`dist` setiap push ke `main`.

1. Push repo ke GitHub.
2. Buka **Settings > Pages** dan pilih **GitHub Actions** sebagai source.
3. Push ke `main`, lalu buka `https://igoon.github.io/NetForge/`.

Repo private: GitHub Pages untuk repo private memerlukan paket GitHub Pro,
Team, atau Enterprise. Akun GitHub Free harus memakai repo publik. Visibilitas
situs juga diatur terpisah, jadi repo private tidak otomatis membuat situsnya
private. Alternatif gratis untuk repo private adalah Cloudflare Pages, Netlify,
atau Vercel.

PWA sudah disiapkan lewat `manifest.webmanifest`, ikon, dan service worker.
Setelah dibuka melalui HTTPS GitHub Pages, Chrome/Android dapat menampilkan
tombol Install app; Safari/iOS memakai Add to Home Screen. Progres tetap
tersimpan di `localStorage` per alamat situs.

## Lisensi

Dirilis di bawah [Apache License 2.0](./LICENSE). Lihat [NOTICE](./NOTICE)
untuk atribusi.

## Stack

React 19, TypeScript, Vite, React Flow (`@xyflow/react`), Zustand, Zod,
Vitest. Progres topologi disimpan di `localStorage`.









