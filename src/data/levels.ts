import { z } from 'zod'
import type { DeviceConfig, DeviceNode, DeviceType, Level, Objective } from '../types'
import { emptyConfig } from './devices'

const levelMetaSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  tagline: z.string().min(1),
  brief: z.string().min(1),
})

function makeNode(
  id: string,
  deviceType: DeviceType,
  label: string,
  x: number,
  y: number,
  config: Partial<DeviceConfig> = {},
  fixed = true,
): DeviceNode {
  return {
    id,
    type: 'device',
    position: { x, y },
    data: {
      deviceType,
      label,
      config: { ...emptyConfig(), ...config },
      fixed,
    },
    deletable: !fixed,
  }
}

const objectives = {
  link: {
    id: 'link',
    label: 'Hubungkan PC A dan PC B',
    kind: 'path',
    from: 'pc-a',
    to: 'pc-b',
  },
  lan: {
    id: 'lan',
    label: 'Empat perangkat terhubung dalam satu LAN',
    kind: 'all-connected',
    nodes: ['pc-1', 'pc-2', 'pc-3', 'pc-4'],
  },
  route: {
    id: 'route',
    label: 'PC A menjangkau PC B melalui router',
    kind: 'path',
    from: 'pc-a',
    to: 'pc-b',
    via: 'router',
  },
  subnets: {
    id: 'subnets',
    label: 'Dua subnet berbeda, gateway terisi',
    kind: 'configured',
    nodes: ['pc-a', 'pc-b'],
    requireGateway: true,
    differentSubnet: true,
  },
  dhcp: {
    id: 'dhcp',
    label: 'Tiga klien mendapat DHCP dari router',
    kind: 'dhcp',
    clients: ['pc-1', 'pc-2', 'pc-3'],
    providers: ['rt-1'],
  },
  physical: {
    id: 'physical',
    label: 'Kedua PC terhubung ke switch',
    kind: 'physical-path',
    from: 'pc-staff',
    to: 'pc-guest',
  },
  vlans: {
    id: 'vlans',
    label: 'Staf di VLAN 10, tamu di VLAN 20',
    kind: 'configured',
    nodes: ['pc-staff', 'pc-guest'],
    vlans: { 'pc-staff': '10', 'pc-guest': '20' },
  },
  isolated: {
    id: 'isolated',
    label: 'Tamu tidak dapat menjangkau jaringan staf',
    kind: 'isolated',
    a: 'pc-staff',
    b: 'pc-guest',
    vlans: { 'pc-staff': '10', 'pc-guest': '20' },
  },
} satisfies Record<string, Objective>

const rawLevels: Level[] = [
  {
    id: 'first-cable',
    name: 'Kabel Pertama',
    tagline: 'Dua komputer, satu kabel.',
    brief:
      'Tarik kabel dari port PC A ke PC B. Ini adalah jaringan paling sederhana: satu tautan fisik.',
    parSeconds: 120,
    palette: [],
    initialNodes: [
      makeNode('pc-a', 'pc', 'PC A', 120, 180),
      makeNode('pc-b', 'pc', 'PC B', 430, 180),
    ],
    objectives: [objectives.link],
    hints: [
      'Arahkan kursor ke sisi kanan PC A, lalu tarik ke sisi kiri PC B.',
      'Gunakan roda mouse untuk zoom dan seret kanvas untuk berpindah.',
    ],
  },
  {
    id: 'tiny-switch',
    name: 'Switch Kecil',
    tagline: 'Satu titik temu untuk banyak perangkat.',
    brief:
      'Tambahkan switch dari panel komponen, lalu hubungkan keempat perangkat. Switch meneruskan data tanpa perlu konfigurasi IP.',
    parSeconds: 240,
    palette: ['switch'],
    initialNodes: [
      makeNode('pc-1', 'pc', 'PC 1', 80, 100),
      makeNode('pc-2', 'pc', 'PC 2', 500, 100),
      makeNode('pc-3', 'pc', 'PC 3', 80, 390),
      makeNode('pc-4', 'laptop', 'Laptop 1', 500, 390),
    ],
    objectives: [objectives.lan],
    hints: [
      'Seret kartu Switch dari panel kanan ke kanvas.',
      'Hubungkan setiap perangkat ke salah satu port switch; urutan port tidak penting.',
    ],
  },
  {
    id: 'two-subnets',
    name: 'Dua Subnet',
    tagline: 'Router menjadi jembatan antar-kantor.',
    brief:
      'Kedua switch berada di jaringan berbeda. Pasang router di antaranya, lalu beri PC alamat IP dan gateway yang benar.',
    parSeconds: 300,
    palette: ['router'],
    initialNodes: [
      makeNode('pc-a', 'pc', 'PC A', 30, 160),
      makeNode('sw-a', 'switch', 'Switch A', 300, 160),
      makeNode('sw-b', 'switch', 'Switch B', 650, 160),
      makeNode('pc-b', 'pc', 'PC B', 920, 160),
    ],
    objectives: [objectives.route, objectives.subnets],
    hints: [
      'Contoh: PC A 192.168.10.10/255.255.255.0, PC B 192.168.20.10/255.255.255.0.',
      'Isi gateway masing-masing dengan alamat router, misalnya 192.168.10.1 dan 192.168.20.1.',
      'Router harus berada di jalur antara PC A dan PC B.',
    ],
  },
  {
    id: 'dhcp-office',
    name: 'DHCP Kantor',
    tagline: 'Alamat IP otomatis, tanpa konfigurasi manual.',
    brief:
      'Hubungkan tiga PC ke router melalui switch. Aktifkan DHCP pada router dan pada setiap klien.',
    parSeconds: 240,
    palette: ['switch'],
    initialNodes: [
      makeNode('pc-1', 'pc', 'PC 1', 70, 100),
      makeNode('pc-2', 'pc', 'PC 2', 70, 280),
      makeNode('pc-3', 'pc', 'PC 3', 70, 460),
      makeNode('rt-1', 'router', 'Router Utama', 560, 280, {
        ip: '192.168.1.1',
        subnet: '255.255.255.0',
      }),
    ],
    objectives: [objectives.dhcp],
    hints: [
      'Tambahkan switch, lalu hubungkan ketiga PC dan router ke switch tersebut.',
      'Klik router, centang Aktifkan DHCP. Lakukan hal yang sama pada setiap PC.',
      'IP statis tidak diperlukan untuk klien DHCP.',
    ],
  },
  {
    id: 'guest-vlan',
    name: 'VLAN Tamu',
    tagline: 'Satu kabel, dua dunia terpisah.',
    brief:
      'Staf dan tamu memakai switch yang sama. Pisahkan mereka dengan VLAN 10 dan VLAN 20, lalu pastikan tamu tidak bisa menjangkau staf.',
    parSeconds: 240,
    palette: ['switch'],
    initialNodes: [
      makeNode('pc-staff', 'pc', 'PC Staf', 70, 150),
      makeNode('pc-guest', 'pc', 'PC Tamu', 70, 380),
      makeNode('sw-1', 'switch', 'Switch Lantai 1', 420, 265),
    ],
    objectives: [objectives.physical, objectives.vlans, objectives.isolated],
    hints: [
      'Hubungkan kedua PC ke switch, lalu isi IP dan subnet yang valid pada masing-masing PC.',
      'Isi VLAN 10 untuk PC Staf dan VLAN 20 untuk PC Tamu.',
      'Validasi memakai aturan VLAN: dua VLAN berbeda tidak boleh saling menjangkau.',
    ],
  },
  {
    id: 'cafe-expansion',
    name: 'Kafe Dua Lantai',
    tagline: 'Pelanggan lama, tantangan baru.',
    brief:
      'Bu Sari kembali. Kafenya sekarang punya dua lantai, satu printer kasir, dan tiga perangkat yang harus langsung mendapat alamat otomatis. Sambungkan kedua lantai lewat switch dan router.',
    parSeconds: 300,
    palette: [],
    initialNodes: [
      makeNode('pc-kasir', 'pc', 'PC Kasir', 40, 120),
      makeNode('pc-dapur', 'pc', 'PC Dapur', 40, 420),
      makeNode('printer-kasir', 'printer', 'Printer Kasir', 260, 270),
      makeNode('sw-1', 'switch', 'Switch Lantai 1', 500, 130),
      makeNode('sw-2', 'switch', 'Switch Lantai 2', 500, 410),
      makeNode('rt-1', 'router', 'Router Kafe', 780, 270, {
        ip: '192.168.50.1',
        subnet: '255.255.255.0',
      }),
    ],
    objectives: [
      {
        id: 'cafe-connected',
        label: 'Semua perangkat kafe saling terhubung',
        kind: 'all-connected',
        nodes: [
          'pc-kasir',
          'pc-dapur',
          'printer-kasir',
          'sw-1',
          'sw-2',
          'rt-1',
        ],
      },
      {
        id: 'cafe-dhcp',
        label: 'Tiga perangkat kafe mendapat DHCP dari router',
        kind: 'dhcp',
        clients: ['pc-kasir', 'pc-dapur', 'printer-kasir'],
        providers: ['rt-1'],
      },
    ],
    hints: [
      'Hubungkan PC Kasir dan Printer ke Switch Lantai 1, lalu PC Dapur ke Switch Lantai 2.',
      'Hubungkan kedua switch, lalu sambungkan Switch Lantai 2 ke Router Kafe.',
      'Aktifkan DHCP pada router dan ketiga perangkat klien.',
    ],
  },
]

export const LEVELS: Level[] = rawLevels.map((level) => {
  levelMetaSchema.parse(level)
  return level
})

export function getLevel(id: string): Level {
  return LEVELS.find((level) => level.id === id) ?? LEVELS[0]
}
