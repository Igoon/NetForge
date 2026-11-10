import type { DeviceNode, DeviceType, PacketEdge } from '../types'

export interface PathResult {
  nodes: string[]
  edges: string[]
}

interface Neighbour {
  nodeId: string
  edgeId: string
}

function hasVlanConflict(a: DeviceNode, b: DeviceNode): boolean {
  const vlanA = a.data.config.vlan.trim()
  const vlanB = b.data.config.vlan.trim()
  return Boolean(vlanA && vlanB && vlanA !== vlanB)
}

function buildAdjacency(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  honorVlan: boolean,
): Map<string, Neighbour[]> {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  const adjacency = new Map<string, Neighbour[]>()

  for (const edge of edges) {
    const source = nodeMap.get(edge.source)
    const target = nodeMap.get(edge.target)
    if (!source || !target) continue
    if (honorVlan && hasVlanConflict(source, target)) continue

    const fromList = adjacency.get(source.id) ?? []
    fromList.push({ nodeId: target.id, edgeId: edge.id })
    adjacency.set(source.id, fromList)

    const toList = adjacency.get(target.id) ?? []
    toList.push({ nodeId: source.id, edgeId: edge.id })
    adjacency.set(target.id, toList)
  }

  return adjacency
}

function findPath(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  from: string,
  to: string,
  honorVlan: boolean,
): PathResult | null {
  if (from === to) return { nodes: [from], edges: [] }

  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  if (!nodeMap.has(from) || !nodeMap.has(to)) return null

  const sourceVlan = honorVlan ? nodeMap.get(from)?.data.config.vlan.trim() : ''
  const adjacency = buildAdjacency(nodes, edges, honorVlan)
  const queue = [from]
  const visited = new Set([from])
  const parent = new Map<string, { previous: string; edgeId: string }>()

  while (queue.length > 0) {
    const current = queue.shift()
    if (!current) break
    if (current === to) break

    for (const neighbour of adjacency.get(current) ?? []) {
      if (visited.has(neighbour.nodeId)) continue

      const neighbourVlan =
        nodeMap.get(neighbour.nodeId)?.data.config.vlan.trim() ?? ''
      if (sourceVlan && neighbourVlan && neighbourVlan !== sourceVlan) {
        continue
      }

      visited.add(neighbour.nodeId)
      parent.set(neighbour.nodeId, {
        previous: current,
        edgeId: neighbour.edgeId,
      })
      queue.push(neighbour.nodeId)
    }
  }

  if (!parent.has(to)) return null

  const pathNodes: string[] = [to]
  const pathEdges: string[] = []
  let cursor = to
  while (cursor !== from) {
    const step = parent.get(cursor)
    if (!step) return null
    pathEdges.unshift(step.edgeId)
    pathNodes.unshift(step.previous)
    cursor = step.previous
  }

  return { nodes: pathNodes, edges: pathEdges }
}

export function findLogicalPath(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  from: string,
  to: string,
): PathResult | null {
  return findPath(nodes, edges, from, to, true)
}

export function findPhysicalPath(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  from: string,
  to: string,
): PathResult | null {
  return findPath(nodes, edges, from, to, false)
}

export function findPathVia(
  nodes: DeviceNode[],
  edges: PacketEdge[],
  from: string,
  to: string,
  viaType: DeviceType,
): PathResult | null {
  const viaNodes = nodes.filter((node) => node.data.deviceType === viaType)
  for (const via of viaNodes) {
    const first = findLogicalPath(nodes, edges, from, via.id)
    const second = findLogicalPath(nodes, edges, via.id, to)
    if (!first || !second) continue
    return {
      nodes: [...first.nodes, ...second.nodes.slice(1)],
      edges: [...first.edges, ...second.edges],
    }
  }
  return null
}

export function pathIncludesType(
  nodes: DeviceNode[],
  path: PathResult,
  type: DeviceType,
): boolean {
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))
  return path.nodes.some((id) => nodeMap.get(id)?.data.deviceType === type)
}
