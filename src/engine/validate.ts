import type {
  CheckResult,
  DeviceNode,
  Level,
  Objective,
  PacketEdge,
  ValidationResult,
} from '../types'
import { isValidIp, isValidSubnet, sameSubnet } from './ip'
import {
  findLogicalPath,
  findPathVia,
  findPhysicalPath,
  type PathResult,
} from './graph'

function nodeMapOf(nodes: DeviceNode[]): Map<string, DeviceNode> {
  return new Map(nodes.map((node) => [node.id, node]))
}

function labelOf(nodes: Map<string, DeviceNode>, id: string): string {
  return nodes.get(id)?.data.label ?? id
}

function checkPath(objective: Extract<Objective, { kind: 'path' }>, nodes: DeviceNode[], edges: PacketEdge[]): CheckResult {
  const path: PathResult | null = objective.via
    ? findPathVia(nodes, edges, objective.from, objective.to, objective.via)
    : findLogicalPath(nodes, edges, objective.from, objective.to)
  const map = nodeMapOf(nodes)

  return {
    id: objective.id,
    label: objective.label,
    passed: Boolean(path),
    detail: path
      ? `${labelOf(map, objective.from)} → ${labelOf(map, objective.to)} · ${path.edges.length} tautan`
      : `Belum ada jalur dari ${labelOf(map, objective.from)} ke ${labelOf(map, objective.to)}.`,
  }
}

function checkPhysicalPath(objective: Extract<Objective, { kind: 'physical-path' }>, nodes: DeviceNode[], edges: PacketEdge[]): CheckResult {
  const path = findPhysicalPath(nodes, edges, objective.from, objective.to)
  const map = nodeMapOf(nodes)

  return {
    id: objective.id,
    label: objective.label,
    passed: Boolean(path),
    detail: path
      ? `Terhubung fisik melalui ${path.edges.length} kabel.`
      : `Sambungkan ${labelOf(map, objective.from)} dan ${labelOf(map, objective.to)} ke switch.`,
  }
}

function checkAllConnected(objective: Extract<Objective, { kind: 'all-connected' }>, nodes: DeviceNode[], edges: PacketEdge[]): CheckResult {
  const map = nodeMapOf(nodes)
  const missing = objective.nodes.filter((id) => !map.has(id))
  if (missing.length > 0) {
    return {
      id: objective.id,
      label: objective.label,
      passed: false,
      detail: `Perangkat tidak ditemukan: ${missing.join(', ')}.`,
    }
  }

  const origin = objective.nodes[0]
  const connected = objective.nodes.filter(
    (id) => id === origin || findLogicalPath(nodes, edges, origin, id) !== null,
  )

  return {
    id: objective.id,
    label: objective.label,
    passed: connected.length === objective.nodes.length,
    detail: `${connected.length}/${objective.nodes.length} perangkat saling terhubung.`,
  }
}

function checkConfigured(objective: Extract<Objective, { kind: 'configured' }>, nodes: DeviceNode[]): CheckResult {
  const map = nodeMapOf(nodes)
  const errors: string[] = []

  for (const id of objective.nodes) {
    const node = map.get(id)
    if (!node) {
      errors.push(`Perangkat ${id} tidak ditemukan`)
      continue
    }
    const { ip, subnet, gateway, vlan } = node.data.config
    if (!isValidIp(ip)) errors.push(`${node.data.label}: IP belum valid`)
    if (!isValidSubnet(subnet)) errors.push(`${node.data.label}: subnet belum valid`)
    if (objective.requireGateway && !isValidIp(gateway)) {
      errors.push(`${node.data.label}: gateway belum valid`)
    }
    const expectedVlan = objective.vlans?.[id]
    if (expectedVlan !== undefined && vlan.trim() !== expectedVlan) {
      errors.push(`${node.data.label}: VLAN harus ${expectedVlan}`)
    }
  }

  if (objective.differentSubnet) {
    const validNodes = objective.nodes
      .map((id) => map.get(id))
      .filter((node): node is DeviceNode => Boolean(node))
      .filter(
        (node) =>
          isValidIp(node.data.config.ip) &&
          isValidSubnet(node.data.config.subnet),
      )

    for (let i = 0; i < validNodes.length; i += 1) {
      for (let j = i + 1; j < validNodes.length; j += 1) {
        const first = validNodes[i]
        const second = validNodes[j]
        if (
          sameSubnet(
            first.data.config.ip,
            second.data.config.ip,
            first.data.config.subnet,
          )
        ) {
          errors.push(
            `${first.data.label} dan ${second.data.label} masih satu subnet`,
          )
        }
      }
    }
  }

  return {
    id: objective.id,
    label: objective.label,
    passed: errors.length === 0,
    detail:
      errors.length === 0
        ? 'Alamat IP, subnet, gateway, dan VLAN sudah sesuai.'
        : errors[0],
  }
}

function checkDhcp(objective: Extract<Objective, { kind: 'dhcp' }>, nodes: DeviceNode[], edges: PacketEdge[]): CheckResult {
  const map = nodeMapOf(nodes)
  const clientsOn = objective.clients.filter(
    (id) => map.get(id)?.data.config.dhcp === true,
  ).length
  const providersOn = objective.providers.filter(
    (id) => map.get(id)?.data.config.dhcp === true,
  ).length
  const reachable = objective.clients.filter((client) =>
    objective.providers.some(
      (provider) =>
        map.has(client) &&
        map.has(provider) &&
        findLogicalPath(nodes, edges, client, provider) !== null,
    ),
  ).length

  const passed =
    clientsOn === objective.clients.length &&
    providersOn === objective.providers.length &&
    reachable === objective.clients.length

  return {
    id: objective.id,
    label: objective.label,
    passed,
    detail: `${clientsOn}/${objective.clients.length} klien DHCP · ${providersOn}/${objective.providers.length} server DHCP · ${reachable}/${objective.clients.length} jalur.`,
  }
}

function checkIsolated(objective: Extract<Objective, { kind: 'isolated' }>, nodes: DeviceNode[], edges: PacketEdge[]): CheckResult {
  const map = nodeMapOf(nodes)
  const a = map.get(objective.a)
  const b = map.get(objective.b)
  if (!a || !b) {
    return {
      id: objective.id,
      label: objective.label,
      passed: false,
      detail: 'Perangkat untuk uji isolasi tidak ditemukan.',
    }
  }

  const vlanOk =
    !objective.vlans ||
    Object.entries(objective.vlans).every(
      ([id, expected]) => map.get(id)?.data.config.vlan.trim() === expected,
    )
  const path = findLogicalPath(nodes, edges, objective.a, objective.b)

  return {
    id: objective.id,
    label: objective.label,
    passed: vlanOk && path === null,
    detail: path
      ? `${a.data.label} masih bisa menjangkau ${b.data.label} melalui ${path.edges.length} tautan.`
      : vlanOk
        ? 'Tidak ada jalur logis antara kedua VLAN.'
        : 'VLAN belum dipisahkan dengan benar.',
  }
}

export function validateLevel(level: Level, nodes: DeviceNode[], edges: PacketEdge[]): ValidationResult {
  const checks = level.objectives.map((objective): CheckResult => {
    switch (objective.kind) {
      case 'path':
        return checkPath(objective, nodes, edges)
      case 'physical-path':
        return checkPhysicalPath(objective, nodes, edges)
      case 'all-connected':
        return checkAllConnected(objective, nodes, edges)
      case 'configured':
        return checkConfigured(objective, nodes)
      case 'dhcp':
        return checkDhcp(objective, nodes, edges)
      case 'isolated':
        return checkIsolated(objective, nodes, edges)
    }
  })

  const passedCount = checks.filter((check) => check.passed).length
  return {
    checks,
    passed: checks.length > 0 && passedCount === checks.length,
    score: checks.length === 0 ? 0 : Math.round((passedCount / checks.length) * 100),
  }
}

export function simulationEdgesFor(level: Level, nodes: DeviceNode[], edges: PacketEdge[]): string[] {
  const paths: PathResult[] = []

  for (const objective of level.objectives) {
    if (objective.kind === 'path') {
      const path = objective.via
        ? findPathVia(nodes, edges, objective.from, objective.to, objective.via)
        : findLogicalPath(nodes, edges, objective.from, objective.to)
      if (path) paths.push(path)
    }

    if (objective.kind === 'all-connected') {
      const origin = objective.nodes[0]
      for (const id of objective.nodes) {
        if (id === origin) continue
        const path = findLogicalPath(nodes, edges, origin, id)
        if (path) paths.push(path)
      }
    }

    if (objective.kind === 'dhcp') {
      for (const client of objective.clients) {
        for (const provider of objective.providers) {
          const path = findLogicalPath(nodes, edges, client, provider)
          if (path) paths.push(path)
        }
      }
    }
  }

  return [...new Set(paths.flatMap((path) => path.edges))]
}
