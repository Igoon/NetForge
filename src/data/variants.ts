import { LEVELS } from './levels'
import type { Level } from '../types'

const WORKSTATION_NAMES = [
  'PC Admin',
  'PC Kasir',
  'PC Desain',
  'PC Resepsionis',
  'PC Keuangan',
  'PC Gudang',
]

const VLAN_POOL = [10, 20, 30, 40, 50, 60, 100, 200, 300, 400]

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function shuffled<T>(rng: () => number, items: T[]): T[] {
  const result = [...items]
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(rng() * (index + 1))
    ;[result[index], result[swap]] = [result[swap], result[index]]
  }
  return result
}

function randomSubnet(rng: () => number, used: Set<string>): string {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const subnet = `10.${randomInt(rng, 10, 40)}.${randomInt(rng, 10, 40)}.0`
    if (!used.has(subnet)) return subnet
  }
  return `10.${randomInt(rng, 10, 40)}.${randomInt(rng, 10, 40)}.0`
}

function hostIp(subnet: string, host: number): string {
  return subnet.replace(/\.0$/, `.${host}`)
}

function cloneLevel(level: Level): Level {
  return JSON.parse(JSON.stringify(level)) as Level
}

export function randomSeed(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let value = 'NF-'
  for (let index = 0; index < 5; index += 1) {
    value += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return value
}

export function getLevelVariant(levelId: string, seed: string): Level {
  const base = LEVELS.find((level) => level.id === levelId) ?? LEVELS[0]
  const level = cloneLevel(base)
  const rng = mulberry32(hashSeed(`${base.id}:${seed}`))

  if (level.id === 'first-cable') {
    const names = shuffled(rng, WORKSTATION_NAMES)
    const first = level.initialNodes.find((node) => node.id === 'pc-a')
    const second = level.initialNodes.find((node) => node.id === 'pc-b')
    if (first) first.data.label = names[0]
    if (second) second.data.label = names[1]
    const link = level.objectives.find((objective) => objective.kind === 'path')
    if (link && link.kind === 'path') {
      link.label = `Hubungkan ${names[0]} dan ${names[1]}`
    }
    level.hints = [
      `Tarik kabel dari port kanan ${names[0]} ke port kiri ${names[1]}.`,
      'Gunakan roda mouse untuk zoom dan seret kanvas untuk berpindah.',
    ]
  }

  if (level.id === 'tiny-switch') {
    const names = shuffled(rng, WORKSTATION_NAMES)
    const laptopIndex = randomInt(rng, 0, 3)
    level.initialNodes.forEach((node, index) => {
      const isLaptop = index === laptopIndex
      node.data.deviceType = isLaptop ? 'laptop' : 'pc'
      node.data.label = isLaptop
        ? 'Laptop Staf'
        : (names[index] ?? `PC ${index + 1}`)
    })
  }

  if (level.id === 'two-subnets') {
    const used = new Set<string>()
    const subnetA = randomSubnet(rng, used)
    used.add(subnetA)
    const subnetB = randomSubnet(rng, used)
    const ipA = hostIp(subnetA, 10)
    const ipB = hostIp(subnetB, 10)
    level.brief = `Kedua switch berada di jaringan berbeda. Pasang router di antaranya, lalu beri PC alamat IP dan gateway untuk subnet ${subnetA}/24 dan ${subnetB}/24.`
    level.hints = [
      `Contoh: PC A ${ipA}/255.255.255.0, PC B ${ipB}/255.255.255.0.`,
      `Isi gateway masing-masing dengan alamat router, misalnya ${hostIp(subnetA, 1)} dan ${hostIp(subnetB, 1)}.`,
      'Router harus berada di jalur antara PC A dan PC B.',
    ]
  }

  if (level.id === 'dhcp-office') {
    const routerOctet = randomInt(rng, 10, 40)
    const routerIp = `10.${routerOctet}.1.1`
    const router = level.initialNodes.find((node) => node.id === 'rt-1')
    if (router) {
      router.data.config = {
        ...router.data.config,
        ip: routerIp,
        subnet: '255.255.255.0',
      }
    }
    level.hints = [
      'Tambahkan switch, lalu hubungkan ketiga PC dan router ke switch tersebut.',
      `Router sudah memakai IP ${routerIp}. Aktifkan DHCP pada router dan setiap PC.`,
      'IP statis tidak diperlukan untuk klien DHCP.',
    ]
  }

  if (level.id === 'cafe-expansion') {
    const routerOctet = randomInt(rng, 40, 80)
    const routerIp = `10.${routerOctet}.1.1`
    const router = level.initialNodes.find((node) => node.id === 'rt-1')
    if (router) {
      router.data.config = {
        ...router.data.config,
        ip: routerIp,
        subnet: '255.255.255.0',
      }
    }
    level.hints = [
      'Hubungkan PC Kasir dan Printer ke Switch Lantai 1, lalu PC Dapur ke Switch Lantai 2.',
      `Hubungkan kedua switch, lalu sambungkan Switch Lantai 2 ke Router Kafe (${routerIp}).`,
      'Aktifkan DHCP pada router dan ketiga perangkat klien.',
    ]
  }

  if (level.id === 'guest-vlan') {
    const vlanChoices = shuffled(rng, VLAN_POOL)
    const vlanA = vlanChoices[0]
    const vlanB = vlanChoices[1]
    const used = new Set<string>()
    const subnetA = randomSubnet(rng, used)
    used.add(subnetA)
    const subnetB = randomSubnet(rng, used)

    const vlans = level.objectives.find(
      (objective) => objective.kind === 'configured' && objective.vlans,
    )
    if (vlans && vlans.kind === 'configured') {
      vlans.label = `Staf di VLAN ${vlanA}, tamu di VLAN ${vlanB}`
      vlans.vlans = {
        'pc-staff': String(vlanA),
        'pc-guest': String(vlanB),
      }
    }

    const isolated = level.objectives.find(
      (objective) => objective.kind === 'isolated',
    )
    if (isolated && isolated.kind === 'isolated') {
      isolated.vlans = {
        'pc-staff': String(vlanA),
        'pc-guest': String(vlanB),
      }
    }

    level.brief = `Staf dan tamu memakai switch yang sama. Pisahkan mereka dengan VLAN ${vlanA} dan VLAN ${vlanB}, lalu pastikan tamu tidak bisa menjangkau staf.`
    level.hints = [
      `Hubungkan kedua PC ke switch. Contoh: gunakan IP pada subnet ${subnetA}/24 dan ${subnetB}/24.`,
      `Isi VLAN ${vlanA} untuk PC Staf dan VLAN ${vlanB} untuk PC Tamu.`,
      'Validasi memakai aturan VLAN: dua VLAN berbeda tidak boleh saling menjangkau.',
    ]
  }

  return level
}
