import { z } from 'zod'
import { DEVICE_TYPES } from './devices'
import type { DeviceNode, DeviceType, PacketEdge } from '../types'

export interface SavedGraph {
  nodes: DeviceNode[]
  edges: PacketEdge[]
}

const deviceTypeSchema = z.enum(
  DEVICE_TYPES as [DeviceType, ...DeviceType[]],
)

const configSchema = z.object({
  ip: z.string().max(64),
  subnet: z.string().max(64),
  gateway: z.string().max(64),
  vlan: z.string().max(32),
  dhcp: z.boolean(),
})

const nodeSchema = z
  .object({
    id: z.string().min(1).max(160),
    type: z.literal('device'),
    position: z.object({
      x: z.number().finite().min(-100_000).max(100_000),
      y: z.number().finite().min(-100_000).max(100_000),
    }),
    data: z
      .object({
        deviceType: deviceTypeSchema,
        label: z.string().max(120),
        config: configSchema,
        fixed: z.boolean().optional(),
      })
      .passthrough(),
    deletable: z.boolean().optional(),
    selected: z.boolean().optional(),
  })
  .passthrough()

const edgeSchema = z
  .object({
    id: z.string().min(1).max(160),
    source: z.string().min(1).max(160),
    target: z.string().min(1).max(160),
    type: z.string().max(40).optional(),
    data: z.record(z.string(), z.unknown()).optional(),
  })
  .passthrough()

const graphSchema = z.object({
  nodes: z.array(nodeSchema).max(200),
  edges: z.array(edgeSchema).max(400),
})

export function parseSavedGraph(raw: string): SavedGraph | null {
  try {
    const parsed = graphSchema.safeParse(JSON.parse(raw))
    if (!parsed.success) return null

    const nodes: DeviceNode[] = []
    const nodeIds = new Set<string>()
    for (const node of parsed.data.nodes) {
      if (nodeIds.has(node.id)) continue
      nodeIds.add(node.id)
      nodes.push(node as unknown as DeviceNode)
    }

    const edges: PacketEdge[] = []
    const edgeIds = new Set<string>()
    const pairs = new Set<string>()
    for (const edge of parsed.data.edges) {
      if (edgeIds.has(edge.id)) continue
      if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue
      if (edge.source === edge.target) continue
      const pair = [edge.source, edge.target].sort().join('::')
      if (pairs.has(pair)) continue
      edgeIds.add(edge.id)
      pairs.add(pair)
      edges.push({
        ...edge,
        type: 'packet',
        data: { ...edge.data, active: false },
      } as PacketEdge)
    }

    return { nodes, edges }
  } catch {
    return null
  }
}

