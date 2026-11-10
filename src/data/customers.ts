export interface CustomerProfile {
  name: string
  role: string
  line: string
  detail: string
  accent: string
  hair: string
  shirt: string
  skin: string
}

export interface CustomerOrder {
  levelId: string
  orderTitle: string
  igaLine: string
  customer: CustomerProfile
}

export const CUSTOMER_ORDERS: Record<string, CustomerOrder> = {
  'first-cable': {
    levelId: 'first-cable',
    orderTitle: 'Sambungkan meja kasir',
    igaLine: 'Saya cek jalur kabelnya dulu. Kalau port-nya bersih, ini cepat.',
    customer: {
      name: 'Bu Sari',
      role: 'Pemilik kafe',
      line: 'Dua komputer kasir saya belum tersambung. Antrean jadi lambat saat ramai.',
      detail: 'Kabelnya ada di bawah meja. Tolong jangan sampai tertarik kucing kafe.',
      accent: '#b7791f',
      hair: '#3c2a21',
      shirt: '#b7791f',
      skin: '#e8b98c',
    },
  },
  'tiny-switch': {
    levelId: 'tiny-switch',
    orderTitle: 'Empat meja kantor',
    igaLine: 'Saya pasang satu switch sebagai titik temu. Semua perangkat akan bertemu di situ.',
    customer: {
      name: 'Pak Hasan',
      role: 'Manajer kantor',
      line: 'Empat perangkat di ruang kerja harus saling terhubung. Saya tidak mau kabel berserakan.',
      detail: 'Ada laptop dan tiga PC. Pastikan semuanya masuk ke jaringan yang sama.',
      accent: '#2f7a57',
      hair: '#252525',
      shirt: '#2f7a57',
      skin: '#d9a273',
    },
  },
  'two-subnets': {
    levelId: 'two-subnets',
    orderTitle: 'Hubungkan dua ruang',
    igaLine: 'Saya butuh router di antara kedua switch, lalu IP dan gateway di tiap PC.',
    customer: {
      name: 'Bu Rina',
      role: 'Kepala cabang',
      line: 'Ruang depan dan ruang belakang memakai jaringan berbeda. Keduanya harus bisa berkomunikasi.',
      detail: 'Jangan satukan semua perangkat ke satu subnet. Setiap sisi punya gateway sendiri.',
      accent: '#3d7ea6',
      hair: '#4a2f24',
      shirt: '#3d7ea6',
      skin: '#ecc19b',
    },
  },
  'dhcp-office': {
    levelId: 'dhcp-office',
    orderTitle: 'Alamat IP otomatis',
    igaLine: 'Router akan membagikan alamat otomatis. Klien tinggal menerima DHCP.',
    customer: {
      name: 'Bu Nia',
      role: 'Admin operasional',
      line: 'Tiga PC baru harus langsung dapat IP tanpa saya isi satu per satu.',
      detail: 'Aktifkan DHCP di router dan semua klien. Jangan ada IP yang bentrok.',
      accent: '#6b5b95',
      hair: '#2e1f1a',
      shirt: '#6b5b95',
      skin: '#e8b98c',
    },
  },
  'guest-vlan': {
    levelId: 'guest-vlan',
    orderTitle: 'Wi-Fi tamu terpisah',
    igaLine: 'Saya pisahkan tamu dan staf dengan VLAN, lalu uji apakah jalurnya benar-benar tertutup.',
    customer: {
      name: 'Bu Maya',
      role: 'Manajer hotel',
      line: 'Wi-Fi tamu dan jaringan staf harus terpisah. Tamu tidak boleh masuk ke sistem internal.',
      detail: 'Kedua PC memakai switch yang sama. Pemisahan harus lewat VLAN, bukan memindahkan kabel.',
      accent: '#b23a48',
      hair: '#3a2620',
      shirt: '#b23a48',
      skin: '#d9a273',
    },
  },
  'cafe-expansion': {
    levelId: 'cafe-expansion',
    orderTitle: 'Dua lantai, satu jaringan',
    igaLine:
      'Saya sambungkan kedua lantai lewat switch dan router, lalu biarkan DHCP mengurus alamat perangkat.',
    customer: {
      name: 'Bu Sari',
      role: 'Pemilik kafe',
      line: 'Kafe saya sekarang dua lantai. Printer kasir dan PC dapur harus langsung terhubung tanpa saya atur satu per satu.',
      detail: 'Jangan biarkan kabel antar-lantai berantakan. Printer kasir harus bisa dijangkau dari kedua lantai.',
      accent: '#b7791f',
      hair: '#3c2a21',
      shirt: '#b7791f',
      skin: '#e8b98c',
    },
  },
}
