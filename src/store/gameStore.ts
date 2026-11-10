import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
  type XYPosition,
} from '@xyflow/react'
import { create } from 'zustand'
import { DEVICES, emptyConfig } from '../data/devices'
import {
  createIncident,
  getIncidentDefinition,
  pickIncidentType,
  shouldTriggerIncident,
  type Incident,
  type IncidentResolution,
  type IncidentType,
} from '../data/incidents'
import {
  consumeItem,
  emptyInventory,
  RESTOCK_SECONDS,
  TOOLBOX_RESTOCK_SECONDS,
  type Inventory,
  type InventoryItem,
} from '../data/inventory'
import { getLevelVariant, randomSeed } from '../data/variants'
import { LEVELS } from '../data/levels'
import {
  isDevUnlockAll,
  isLevelUnlocked,
  type MissionReward,
} from '../data/profile'
import { useProfileStore } from './profileStore'
import { computeScore, type ScoreBreakdown } from '../engine/score'
import { simulationEdgesFor, validateLevel } from '../engine/validate'
import type {
  CheckResult,
  DeviceConfig,
  DeviceNode,
  DeviceType,
  Level,
  PacketEdge,
} from '../types'

const STORAGE_KEY = 'netforge.graph.v3'
const FIRST_INCIDENT_AT = 20
const MAX_INCIDENTS = 3

type TimerState = 'ready' | 'running' | 'paused' | 'complete'

interface SavedGraph {
  nodes: DeviceNode[]
  edges: PacketEdge[]
}

interface GameStore {
  levelId: string
  level: Level
  seed: string
  nodes: DeviceNode[]
  edges: PacketEdge[]
  selectedNodeId: string | null
  checks: CheckResult[]
  score: number
  breakdown: ScoreBreakdown
  objectivesPassed: boolean
  passed: boolean
  cleared: boolean
  runSettled: boolean
  lastReward: MissionReward | null
  elapsed: number
  timerState: TimerState
  orderAccepted: boolean
  orderOpen: boolean
  orderBoardOpen: boolean
  incidents: Incident[]
  preventions: IncidentType[]
  inventory: Inventory
  loadout: InventoryItem[]
  triggeredCount: number
  nextIncidentAt: number
  simulating: boolean
  activeEdgeIds: string[]
  selectLevel: (levelId: string) => void
  setSelectedNode: (nodeId: string | null) => void
  onNodesChange: (changes: NodeChange<DeviceNode>[]) => void
  onEdgesChange: (changes: EdgeChange<PacketEdge>[]) => void
  onConnect: (connection: Connection) => void
  addDevice: (
    deviceType: DeviceType,
    position: XYPosition,
    avoidCollision?: boolean,
  ) => void
  updateConfig: (nodeId: string, patch: Partial<DeviceConfig>) => void
  renameNode: (nodeId: string, label: string) => void
  resetLevel: () => void
  rerollSeed: () => void
  revalidate: () => void
  recalculateScore: () => void
  tick: () => void
  togglePause: () => void
  acceptOrder: () => void
  openOrder: () => void
  openOrderBoard: () => void
  closeOrderBoard: () => void
  closeOrder: () => void
  toggleLoadout: (item: InventoryItem) => void
  startMission: () => void
  restockItem: (item: InventoryItem) => void
  triggerIncident: () => void
  resolveIncident: (id: string, method: IncidentResolution) => void
  simulate: () => void
}

function cloneNodes(nodes: DeviceNode[]): DeviceNode[] {
  return JSON.parse(JSON.stringify(nodes)) as DeviceNode[]
}

function cloneEdges(edges: PacketEdge[]): PacketEdge[] {
  return JSON.parse(JSON.stringify(edges)) as PacketEdge[]
}

function graphKey(levelId: string, seed: string): string {
  return `${STORAGE_KEY}:${levelId}:${seed}`
}

function readSaved(levelId: string, seed: string): SavedGraph | null {
  try {
    const raw = localStorage.getItem(graphKey(levelId, seed))
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<SavedGraph>
    if (!Array.isArray(parsed.nodes) || !Array.isArray(parsed.edges)) {
      return null
    }
    return {
      nodes: cloneNodes(parsed.nodes),
      edges: cloneEdges(parsed.edges).map((edge) => ({
        ...edge,
        data: { ...edge.data, active: false },
      })),
    }
  } catch {
    return null
  }
}

function saveGraph(
  levelId: string,
  seed: string,
  nodes: DeviceNode[],
  edges: PacketEdge[],
): void {
  try {
    localStorage.setItem(
      graphKey(levelId, seed),
      JSON.stringify({ nodes, edges }),
    )
  } catch {
    // Penyimpanan lokal bisa diblokir; permainan tetap berjalan di memori.
  }
}

function clearSaved(levelId: string, seed: string): void {
  try {
    localStorage.removeItem(graphKey(levelId, seed))
  } catch {
    // abaikan
  }
}

const NODE_WIDTH = 220
const NODE_HEIGHT = 120
const OFFSETS: Array<[number, number]> = [
  [0, 140],
  [0, -140],
  [220, 0],
  [-220, 0],
  [220, 140],
  [-220, 140],
  [220, -140],
  [-220, -140],
  [0, 280],
  [0, -280],
  [440, 0],
  [-440, 0],
]

function findOpenPosition(
  nodes: DeviceNode[],
  desired: XYPosition,
): XYPosition {
  const isFree = (candidate: XYPosition) =>
    nodes.every(
      (node) =>
        Math.abs(node.position.x - candidate.x) >= NODE_WIDTH ||
        Math.abs(node.position.y - candidate.y) >= NODE_HEIGHT,
    )

  if (isFree(desired)) return desired
  for (const [dx, dy] of OFFSETS) {
    const candidate = { x: desired.x + dx, y: desired.y + dy }
    if (isFree(candidate)) return candidate
  }
  return { x: desired.x + 40, y: desired.y + 40 }
}

function startupLevelId(): string {
  try {
    const savedId = localStorage.getItem(`${STORAGE_KEY}:level`)
    if (savedId && LEVELS.some((level) => level.id === savedId)) {
      return savedId
    }
  } catch {
    // abaikan
  }
  return LEVELS[0].id
}

function rememberLevel(levelId: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}:level`, levelId)
  } catch {
    // abaikan
  }
}

function savedSeed(): string | null {
  try {
    return localStorage.getItem(`${STORAGE_KEY}:seed`)
  } catch {
    return null
  }
}

function rememberSeed(seed: string): void {
  try {
    localStorage.setItem(`${STORAGE_KEY}:seed`, seed)
  } catch {
    // abaikan
  }
}

function freshLevelState(level: Level, nodes: DeviceNode[], edges: PacketEdge[]) {
  const validation = validateLevel(level, nodes, edges)
  const breakdown = computeScore(level, validation.checks, 0, [])
  return {
    nodes,
    edges,
    checks: validation.checks,
    score: breakdown.total,
    breakdown,
    objectivesPassed: validation.passed,
    passed: false,
    cleared: false,
    runSettled: false,
    lastReward: null,
    elapsed: 0,
    timerState: 'ready' as TimerState,
    orderAccepted: false,
    orderOpen: false,
    orderBoardOpen: false,
    incidents: [] as Incident[],
    preventions: [] as IncidentType[],
    inventory: emptyInventory(),
    loadout: [] as InventoryItem[],
    triggeredCount: 0,
    nextIncidentAt: FIRST_INCIDENT_AT,
  }
}

const startupRunSeed = savedSeed() ?? randomSeed()
const savedStartupLevelId = startupLevelId()
const startupProfile = useProfileStore.getState().profile
const startupBaseLevelId =
  isDevUnlockAll() ||
  isLevelUnlocked(startupProfile, savedStartupLevelId)
    ? savedStartupLevelId
    : LEVELS[0].id
const startupLevel = getLevelVariant(startupBaseLevelId, startupRunSeed)
const startupSaved = readSaved(startupLevel.id, startupRunSeed)
const startupNodes = (
  startupSaved ? startupSaved.nodes : cloneNodes(startupLevel.initialNodes)
).map((node) => ({ ...node, selected: false }))
const startupEdges = startupSaved ? startupSaved.edges : []
const startupState = freshLevelState(startupLevel, startupNodes, startupEdges)
rememberSeed(startupRunSeed)

let simulationTimer: ReturnType<typeof setTimeout> | null = null

export const useGameStore = create<GameStore>((set, get) => ({
  levelId: startupLevel.id,
  level: startupLevel,
  seed: startupRunSeed,
  nodes: startupState.nodes,
  edges: startupState.edges,
  selectedNodeId: null,
  checks: startupState.checks,
  score: startupState.score,
  breakdown: startupState.breakdown,
  objectivesPassed: startupState.objectivesPassed,
  passed: startupState.passed,
  cleared: startupState.cleared,
  runSettled: startupState.runSettled,
  lastReward: startupState.lastReward,
  elapsed: startupState.elapsed,
  timerState: startupState.timerState,
  orderAccepted: startupState.orderAccepted,
  orderOpen: startupState.orderOpen,
  orderBoardOpen: startupState.orderBoardOpen,
  incidents: startupState.incidents,
  preventions: startupState.preventions,
  inventory: startupState.inventory,
  loadout: startupState.loadout,
  triggeredCount: startupState.triggeredCount,
  nextIncidentAt: startupState.nextIncidentAt,
  simulating: false,
  activeEdgeIds: [],

  selectLevel: (levelId) => {
    if (
      !isDevUnlockAll() &&
      !isLevelUnlocked(useProfileStore.getState().profile, levelId)
    ) {
      return
    }
    const seed = randomSeed()
    const level = getLevelVariant(levelId, seed)
    const nodes = cloneNodes(level.initialNodes).map((node) => ({
      ...node,
      selected: false,
    }))
    if (simulationTimer) clearTimeout(simulationTimer)
    rememberLevel(level.id)
    rememberSeed(seed)
    set({
      levelId: level.id,
      level,
      seed,
      ...freshLevelState(level, nodes, []),
      selectedNodeId: null,
      simulating: false,
      activeEdgeIds: [],
    })
  },

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),

  onNodesChange: (changes) => {
    const nodes = applyNodeChanges(changes, get().nodes)
    set({ nodes })
    saveGraph(get().levelId, get().seed, nodes, get().edges)
    get().revalidate()
  },

  onEdgesChange: (changes) => {
    const edges = applyEdgeChanges(changes, get().edges)
    set({ edges })
    saveGraph(get().levelId, get().seed, get().nodes, edges)
    get().revalidate()
  },

  onConnect: (connection) => {
    if (!connection.source || !connection.target) return
    if (connection.source === connection.target) return
    const duplicate = get().edges.some(
      (edge) =>
        edge.source === connection.source && edge.target === connection.target,
    )
    if (duplicate) return

    const edge: PacketEdge = {
      id: `edge-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      source: connection.source,
      target: connection.target,
      type: 'packet',
    }
    const edges = addEdge<PacketEdge>(edge, get().edges)
    set({ edges })
    saveGraph(get().levelId, get().seed, get().nodes, edges)
    get().revalidate()
  },

  addDevice: (deviceType, position, avoidCollision = false) => {
    const spec = DEVICES[deviceType]
    const count =
      get().nodes.filter((node) => node.data.deviceType === deviceType).length + 1
    const id = `${deviceType}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`
    const placement = avoidCollision
      ? findOpenPosition(get().nodes, position)
      : position
    const node: DeviceNode = {
      id,
      type: 'device',
      position: placement,
      deletable: true,
      selected: true,
      data: {
        deviceType,
        label: `${spec.label} ${count}`,
        config: emptyConfig(),
      },
    }
    const nodes = [
      ...get().nodes.map((item) => ({ ...item, selected: false })),
      node,
    ]
    set({ nodes, selectedNodeId: id })
    saveGraph(get().levelId, get().seed, nodes, get().edges)
    get().revalidate()
  },

  updateConfig: (nodeId, patch) => {
    const nodes = get().nodes.map((node) =>
      node.id === nodeId
        ? {
            ...node,
            data: {
              ...node.data,
              config: { ...node.data.config, ...patch },
            },
          }
        : node,
    )
    set({ nodes })
    saveGraph(get().levelId, get().seed, nodes, get().edges)
    get().revalidate()
  },

  renameNode: (nodeId, label) => {
    const nodes = get().nodes.map((node) =>
      node.id === nodeId
        ? { ...node, data: { ...node.data, label } }
        : node,
    )
    set({ nodes })
    saveGraph(get().levelId, get().seed, nodes, get().edges)
    get().revalidate()
  },

  resetLevel: () => {
    const state = get()
    const level = state.level
    clearSaved(level.id, state.seed)
    if (simulationTimer) clearTimeout(simulationTimer)
    const nodes = cloneNodes(level.initialNodes).map((node) => ({
      ...node,
      selected: false,
    }))
    set({
      ...freshLevelState(level, nodes, []),
      selectedNodeId: null,
      simulating: false,
      activeEdgeIds: [],
    })
  },

  rerollSeed: () => {
    const state = get()
    if (state.timerState !== 'ready') return
    const seed = randomSeed()
    const level = getLevelVariant(state.levelId, seed)
    const nodes = cloneNodes(level.initialNodes).map((node) => ({
      ...node,
      selected: false,
    }))
    rememberSeed(seed)
    set({
      level,
      seed,
      ...freshLevelState(level, nodes, []),
      selectedNodeId: null,
      simulating: false,
      activeEdgeIds: [],
    })
  },

  revalidate: () => {
    const state = get()
    const level = state.level
    const validation = validateLevel(level, state.nodes, state.edges)
    const active = state.incidents.some(
      (incident) => incident.status === 'active',
    )
    const objectivesPassed = validation.passed
    const ready = state.timerState === 'ready'
    const passed = !ready && objectivesPassed && !active
    const breakdown = computeScore(
      level,
      validation.checks,
      state.elapsed,
      state.incidents,
      state.preventions,
    )
    let timerState = state.timerState
    if (!ready) {
      if (passed) timerState = 'complete'
      else if (timerState === 'complete') timerState = 'running'
    }

    let cleared = state.cleared
    let runSettled = state.runSettled
    let lastReward = state.lastReward
    if (passed && !state.runSettled) {
      const result = useProfileStore
        .getState()
        .recordMission(level.id, breakdown.total)
      cleared = result.cleared
      runSettled = true
      lastReward = result.reward
    }

    set({
      checks: validation.checks,
      objectivesPassed,
      passed,
      cleared,
      runSettled,
      lastReward,
      score: breakdown.total,
      breakdown,
      timerState,
    })
  },

  recalculateScore: () => {
    const state = get()
    const breakdown = computeScore(
      state.level,
      state.checks,
      state.elapsed,
      state.incidents,
      state.preventions,
    )
    set({ score: breakdown.total, breakdown })
  },

  tick: () => {
    const state = get()
    if (state.timerState !== 'running') return
    const elapsed = state.elapsed + 1
    set({ elapsed })
    const current = get()
    const hasActive = current.incidents.some(
      (incident) => incident.status === 'active',
    )
    const progress =
      current.checks.length === 0
        ? 0
        : current.checks.filter((check) => check.passed).length /
          current.checks.length
    if (
      !current.objectivesPassed &&
      shouldTriggerIncident(
        elapsed,
        current.nextIncidentAt,
        progress,
        current.triggeredCount,
        hasActive,
        MAX_INCIDENTS,
      )
    ) {
      get().triggerIncident()
    }
    get().recalculateScore()
  },

  togglePause: () => {
    const state = get()
    if (state.timerState === 'complete' || state.timerState === 'ready') return
    set({
      timerState: state.timerState === 'running' ? 'paused' : 'running',
    })
  },

  acceptOrder: () => {
    if (get().timerState !== 'ready') return
    set({ orderAccepted: true, orderOpen: false, orderBoardOpen: false })
  },

  openOrder: () => {
    const state = get()
    if (state.timerState !== 'ready' || state.orderAccepted) return
    set({ orderOpen: true, orderBoardOpen: false })
  },

  closeOrder: () => set({ orderOpen: false }),

  openOrderBoard: () => {
    const state = get()
    if (state.timerState !== 'ready' || state.orderAccepted) return
    set({ orderBoardOpen: true, orderOpen: false })
  },

  closeOrderBoard: () => set({ orderBoardOpen: false }),

  toggleLoadout: (item) => {
    const state = get()
    if (state.timerState !== 'ready') return
    if (state.loadout.includes(item)) {
      set({ loadout: state.loadout.filter((selected) => selected !== item) })
      return
    }
    if (state.loadout.length >= 2) return
    set({ loadout: [...state.loadout, item] })
  },

  startMission: () => {
    const state = get()
    if (
      state.timerState !== 'ready' ||
      !state.orderAccepted ||
      state.loadout.length !== 2
    ) {
      return
    }
    const inventory = emptyInventory()
    for (const item of state.loadout) {
      inventory[item] = 1
    }
    const upgrades = useProfileStore.getState().profile.upgrades
    const preventions: IncidentType[] = []
    if (upgrades.cableTray) preventions.push('cat')
    if (upgrades.ups) preventions.push('blackout')
    set({
      inventory,
      preventions,
      elapsed: 0,
      timerState: 'running',
      incidents: [],
      triggeredCount: 0,
      nextIncidentAt: FIRST_INCIDENT_AT,
    })
    get().revalidate()
  },

  restockItem: (item) => {
    const state = get()
    if (state.timerState === 'ready' || state.timerState === 'complete') return
    if (!state.loadout.includes(item)) return
    const upgrades = useProfileStore.getState().profile.upgrades
    const restockSeconds = upgrades.toolbox
      ? TOOLBOX_RESTOCK_SECONDS
      : RESTOCK_SECONDS
    set({
      inventory: { ...state.inventory, [item]: state.inventory[item] + 1 },
      elapsed: state.elapsed + restockSeconds,
    })
    get().recalculateScore()
  },

  triggerIncident: () => {
    const state = get()
    if (state.timerState !== 'running' || state.objectivesPassed) return
    if (state.incidents.some((incident) => incident.status === 'active')) return
    if (state.triggeredCount >= MAX_INCIDENTS) return

    const type = pickIncidentType(
      state.nodes,
      state.edges,
      state.preventions,
    )
    if (!type) {
      set({ nextIncidentAt: state.elapsed + 30 })
      return
    }

    const incident = createIncident(
      type,
      state.nodes,
      state.edges,
      `incident-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
      state.elapsed,
    )
    set({
      incidents: [incident, ...state.incidents],
      triggeredCount: state.triggeredCount + 1,
      nextIncidentAt: state.elapsed + 30 + Math.floor(Math.random() * 20),
    })
    get().recalculateScore()
  },

  resolveIncident: (id, method) => {
    const state = get()
    const incident = state.incidents.find(
      (item) => item.id === id && item.status === 'active',
    )
    if (!incident) return

    const definition = getIncidentDefinition(incident.type)
    let inventory = state.inventory
    let penalty = definition.quickSeconds

    if (method === 'inventory') {
      const nextInventory = consumeItem(
        inventory,
        definition.inventory.item,
      )
      if (!nextInventory) return
      inventory = nextInventory
      penalty = definition.inventory.seconds
    }

    if (method === 'prevention') {
      if (definition.prevention.item) {
        const nextInventory = consumeItem(
          inventory,
          definition.prevention.item,
        )
        if (!nextInventory) return
        inventory = nextInventory
      }
      penalty = definition.prevention.seconds
    }

    const preventions =
      method === 'prevention' && !state.preventions.includes(incident.type)
        ? [...state.preventions, incident.type]
        : state.preventions
    const incidents = state.incidents.map((item) =>
      item.id === id
        ? {
            ...item,
            status: 'resolved' as const,
            resolution: method,
            resolvedAt: state.elapsed,
          }
        : item,
    )

    set({
      incidents,
      preventions,
      inventory,
      elapsed: state.elapsed + penalty,
      nextIncidentAt: state.elapsed + penalty + 25 + Math.floor(Math.random() * 20),
    })
    get().revalidate()
  },

  simulate: () => {
    const state = get()
    if (state.timerState === 'ready') return
    const level = state.level
    const edgeIds = simulationEdgesFor(level, state.nodes, state.edges)
    if (simulationTimer) clearTimeout(simulationTimer)
    set({ simulating: true, activeEdgeIds: edgeIds })
    get().revalidate()
    simulationTimer = setTimeout(() => {
      set({ simulating: false, activeEdgeIds: [] })
    }, 4500)
  },
}))



