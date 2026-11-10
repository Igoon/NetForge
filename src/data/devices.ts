import type { DeviceConfig, DeviceSpec, DeviceType } from '../types'

export const DEVICES: Record<DeviceType, DeviceSpec> = {
  pc: {
    type: 'pc',
    label: 'PC',
    short: 'PC',
    color: '#2f6f9f',
    category: 'endpoint',
    description: 'Komputer desktop untuk pengguna.',
  },
  laptop: {
    type: 'laptop',
    label: 'Laptop',
    short: 'LP',
    color: '#3d7ea6',
    category: 'endpoint',
    description: 'Perangkat pengguna yang fleksibel.',
  },
  printer: {
    type: 'printer',
    label: 'Printer',
    short: 'PR',
    color: '#6b5b95',
    category: 'endpoint',
    description: 'Printer jaringan untuk berbagi dokumen.',
  },
  switch: {
    type: 'switch',
    label: 'Switch',
    short: 'SW',
    color: '#2f7a57',
    category: 'network',
    description: 'Menghubungkan banyak perangkat dalam satu LAN.',
  },
  router: {
    type: 'router',
    label: 'Router',
    short: 'RT',
    color: '#b7791f',
    category: 'network',
    description: 'Menghubungkan subnet dan mengatur DHCP.',
  },
  firewall: {
    type: 'firewall',
    label: 'Firewall',
    short: 'FW',
    color: '#b23a48',
    category: 'security',
    description: 'Menyaring trafik antar zona jaringan.',
  },
  accesspoint: {
    type: 'accesspoint',
    label: 'Access Point',
    short: 'AP',
    color: '#7e5aa2',
    category: 'network',
    description: 'Menjadi jembatan klien Wi-Fi ke jaringan kabel.',
  },
  server: {
    type: 'server',
    label: 'Server',
    short: 'SRV',
    color: '#b05a2a',
    category: 'server',
    description: 'Menyediakan layanan jaringan.',
  },
}

export const DEVICE_TYPES = Object.keys(DEVICES) as DeviceType[]

export function emptyConfig(): DeviceConfig {
  return {
    ip: '',
    subnet: '',
    gateway: '',
    vlan: '',
    dhcp: false,
  }
}

const NETWORK_TYPES: DeviceType[] = [
  'switch',
  'router',
  'firewall',
  'accesspoint',
  'server',
]

export function isNetworkDevice(type: DeviceType): boolean {
  return NETWORK_TYPES.includes(type)
}
