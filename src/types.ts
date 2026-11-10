import type { Edge, Node } from '@xyflow/react'

export type DeviceType =
  | 'pc'
  | 'laptop'
  | 'printer'
  | 'switch'
  | 'router'
  | 'firewall'
  | 'accesspoint'
  | 'server'

export type DeviceCategory = 'endpoint' | 'network' | 'security' | 'server'

export interface DeviceConfig {
  ip: string
  subnet: string
  gateway: string
  vlan: string
  dhcp: boolean
}

export interface DeviceSpec {
  type: DeviceType
  label: string
  short: string
  color: string
  category: DeviceCategory
  description: string
}

export interface DeviceNodeData extends Record<string, unknown> {
  deviceType: DeviceType
  label: string
  config: DeviceConfig
  fixed?: boolean
}

export type DeviceNode = Node<DeviceNodeData, 'device'>

export interface PacketEdgeData extends Record<string, unknown> {
  active?: boolean
}

export type PacketEdge = Edge<PacketEdgeData, 'packet'>

export type Objective =
  | {
      id: string
      label: string
      kind: 'path'
      from: string
      to: string
      via?: DeviceType
    }
  | {
      id: string
      label: string
      kind: 'physical-path'
      from: string
      to: string
    }
  | {
      id: string
      label: string
      kind: 'all-connected'
      nodes: string[]
    }
  | {
      id: string
      label: string
      kind: 'configured'
      nodes: string[]
      requireGateway?: boolean
      differentSubnet?: boolean
      vlans?: Record<string, string>
    }
  | {
      id: string
      label: string
      kind: 'dhcp'
      clients: string[]
      providers: string[]
    }
  | {
      id: string
      label: string
      kind: 'isolated'
      a: string
      b: string
      vlans?: Record<string, string>
    }

export interface Level {
  id: string
  name: string
  tagline: string
  brief: string
  parSeconds: number
  palette: DeviceType[]
  initialNodes: DeviceNode[]
  objectives: Objective[]
  hints: string[]
}

export interface CheckResult {
  id: string
  label: string
  passed: boolean
  detail: string
}

export interface ValidationResult {
  checks: CheckResult[]
  passed: boolean
  score: number
}
