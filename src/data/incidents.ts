import type { DeviceNode, PacketEdge } from '../types'
import type { InventoryItem } from './inventory'

export type IncidentType = 'battery' | 'cat' | 'blackout'
export type IncidentStatus = 'active' | 'resolved'
export type IncidentResolution = 'quick' | 'inventory' | 'prevention'

export interface Incident {
  id: string
  type: IncidentType
  title: string
  detail: string
  status: IncidentStatus
  startedAt: number
  resolvedAt?: number
  resolution?: IncidentResolution
}

export interface IncidentInventoryAction {
  item: InventoryItem
  label: string
  seconds: number
}

export interface IncidentPreventionAction {
  label: string
  seconds: number
  preventionName: string
  item?: InventoryItem
}

export interface IncidentComic {
  exclaim: string
  speaker: string
  line: string
}

export interface IncidentDefinition {
  type: IncidentType
  title: string
  tag: string
  weight: number
  quickLabel: string
  quickSeconds: number
  inventory: IncidentInventoryAction
  prevention: IncidentPreventionAction
  comic: IncidentComic
  canTrigger: (nodes: DeviceNode[], edges: PacketEdge[]) => boolean
  detail: (nodes: DeviceNode[], edges: PacketEdge[]) => string
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined
  return items[Math.floor(Math.random() * items.length)]
}

function laptopDetail(nodes: DeviceNode[]): string {
  const laptop = pickRandom(
    nodes.filter((node) => node.data.deviceType === 'laptop'),
  )
  return `${laptop?.data.label ?? 'Laptop'} mati mendadak karena baterainya habis. Cari sumber listrik sebelum melanjutkan.`
}

function catDetail(nodes: DeviceNode[], edges: PacketEdge[]): string {
  const edge = pickRandom(edges)
  if (!edge) return 'Kucing menarik kabel jaringan sampai lepas.'
  const map = new Map(nodes.map((node) => [node.id, node.data.label]))
  return `Kucing menarik kabel antara ${map.get(edge.source) ?? 'perangkat'} dan ${map.get(edge.target) ?? 'perangkat'} sampai lepas.`
}

export const INCIDENT_DEFS: Record<IncidentType, IncidentDefinition> = {
  battery: {
    type: 'battery',
    title: 'Baterai laptop habis',
    tag: 'DAYA',
    weight: 4,
    quickLabel: 'Cari colokan listrik',
    quickSeconds: 10,
    inventory: {
      item: 'charger',
      label: 'Pakai charger',
      seconds: 0,
    },
    prevention: {
      label: 'Pasang charger tetap',
      seconds: 8,
      preventionName: 'Charger terpasang',
      item: 'charger',
    },
    comic: {
      exclaim: 'KREK!',
      speaker: 'Laptop Staf',
      line: 'Baterai 1%. Tolong...',
    },
    canTrigger: (nodes) =>
      nodes.some((node) => node.data.deviceType === 'laptop'),
    detail: (nodes) => laptopDetail(nodes),
  },
  cat: {
    type: 'cat',
    title: 'Kabel ditarik kucing',
    tag: 'KABEL',
    weight: 3,
    quickLabel: 'Sambungkan ulang',
    quickSeconds: 6,
    inventory: {
      item: 'spareCable',
      label: 'Ganti kabel cadangan',
      seconds: 0,
    },
    prevention: {
      label: 'Pasang cable clip',
      seconds: 6,
      preventionName: 'Cable clip terpasang',
      item: 'cableClip',
    },
    comic: {
      exclaim: 'MIAW!',
      speaker: 'Kucing',
      line: 'Kabel ini mainan baruku.',
    },
    canTrigger: (_nodes, edges) => edges.length > 0,
    detail: (nodes, edges) => catDetail(nodes, edges),
  },
  blackout: {
    type: 'blackout',
    title: 'Token listrik habis',
    tag: 'LISTRIK',
    weight: 2,
    quickLabel: 'Beli token listrik',
    quickSeconds: 12,
    inventory: {
      item: 'token',
      label: 'Isi token listrik',
      seconds: 0,
    },
    prevention: {
      label: 'Nyalakan UPS',
      seconds: 8,
      preventionName: 'UPS siaga',
    },
    comic: {
      exclaim: 'JLEG!',
      speaker: 'Lab',
      line: 'Token habis. Gelap total.',
    },
    canTrigger: () => true,
    detail: () =>
      'Token listrik lab habis dan lampu mati. Perangkat perlu dinyalakan lagi setelah daya kembali.',
  },
}

export const INCIDENT_TYPES = Object.keys(INCIDENT_DEFS) as IncidentType[]

export function getIncidentDefinition(type: IncidentType): IncidentDefinition {
  return INCIDENT_DEFS[type]
}

export function pickIncidentType(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  preventions: IncidentType[],
  random: () => number = Math.random,
): IncidentType | null {
  const candidates = INCIDENT_TYPES.map((type) => INCIDENT_DEFS[type]).filter(
    (definition) =>
      !preventions.includes(definition.type) &&
      definition.canTrigger(nodes, edges),
  )
  if (candidates.length === 0) return null

  const totalWeight = candidates.reduce(
    (total, definition) => total + definition.weight,
    0,
  )
  let roll = random() * totalWeight
  for (const definition of candidates) {
    roll -= definition.weight
    if (roll <= 0) return definition.type
  }
  return candidates[candidates.length - 1].type
}

export function shouldTriggerIncident(
  elapsed: number,
  nextIncidentAt: number,
  progress: number,
  triggeredCount: number,
  hasActive: boolean,
  maxIncidents = 3,
): boolean {
  if (hasActive || triggeredCount >= maxIncidents) return false
  if (triggeredCount === 0 && elapsed >= 5 && progress >= 0.5) return true
  return elapsed >= nextIncidentAt
}

export function createIncident(
  type: IncidentType,
  nodes: DeviceNode[],
  edges: PacketEdge[],
  id: string,
  startedAt: number,
): Incident {
  const definition = INCIDENT_DEFS[type]
  return {
    id,
    type,
    title: definition.title,
    detail: definition.detail(nodes, edges),
    status: 'active',
    startedAt,
  }
}
