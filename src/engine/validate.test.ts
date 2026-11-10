import { describe, expect, it } from 'vitest'
import type { DeviceConfig, DeviceNode, DeviceType, PacketEdge } from '../types'
import { emptyConfig } from '../data/devices'
import { LEVELS } from '../data/levels'
import { validateLevel, simulationEdgesFor } from './validate'

function node(
  id: string,
  deviceType: DeviceType,
  config: Partial<DeviceConfig> = {},
): DeviceNode {
  return {
    id,
    type: 'device',
    position: { x: 0, y: 0 },
    data: {
      deviceType,
      label: id,
      config: { ...emptyConfig(), ...config },
    },
  }
}

function edge(id: string, source: string, target: string): PacketEdge {
  return { id, source, target, type: 'packet' }
}

function configuredNodes(levelIndex: number, changes: Record<string, Partial<DeviceConfig>>): DeviceNode[] {
  return LEVELS[levelIndex].initialNodes.map((item) => ({
    ...item,
    data: {
      ...item.data,
      config: { ...item.data.config, ...(changes[item.id] ?? {}) },
    },
  }))
}

describe('validateLevel', () => {
  it('mendeteksi kabel yang belum terpasang', () => {
    const level = LEVELS[0]
    const noCable = validateLevel(level, level.initialNodes, [])
    expect(noCable.passed).toBe(false)

    const linked = validateLevel(level, level.initialNodes, [
      edge('e1', 'pc-a', 'pc-b'),
    ])
    expect(linked.passed).toBe(true)
    expect(linked.score).toBe(100)
  })

  it('memvalidasi semua PC terhubung melalui switch', () => {
    const level = LEVELS[1]
    const nodes = [...level.initialNodes, node('sw-1', 'switch')]
    const edges = [
      edge('e1', 'pc-1', 'sw-1'),
      edge('e2', 'pc-2', 'sw-1'),
      edge('e3', 'pc-3', 'sw-1'),
      edge('e4', 'pc-4', 'sw-1'),
    ]
    expect(validateLevel(level, nodes, edges).passed).toBe(true)
    expect(validateLevel(level, nodes, edges.slice(0, 3)).passed).toBe(false)
    expect(simulationEdgesFor(level, nodes, edges)).toHaveLength(4)
  })

  it('memerlukan router dan dua subnet berbeda pada level dua subnet', () => {
    const level = LEVELS[2]
    const nodes = [
      ...configuredNodes(2, {
        'pc-a': { ip: '192.168.10.10', subnet: '255.255.255.0', gateway: '192.168.10.1' },
        'pc-b': { ip: '192.168.20.10', subnet: '255.255.255.0', gateway: '192.168.20.1' },
      }),
      node('rt-1', 'router'),
    ]
    const edges = [
      edge('e1', 'pc-a', 'sw-a'),
      edge('e2', 'sw-a', 'rt-1'),
      edge('e3', 'rt-1', 'sw-b'),
      edge('e4', 'sw-b', 'pc-b'),
    ]
    expect(validateLevel(level, nodes, edges).passed).toBe(true)

    const sameSubnet = nodes.map((item) =>
      item.id === 'pc-b'
        ? {
            ...item,
            data: {
              ...item.data,
              config: { ...item.data.config, ip: '192.168.10.20' },
            },
          }
        : item,
    )
    expect(validateLevel(level, sameSubnet, edges).passed).toBe(false)
  })

  it('memvalidasi DHCP pada router dan klien', () => {
    const level = LEVELS[3]
    const nodes = [
      ...configuredNodes(3, {
        'pc-1': { dhcp: true },
        'pc-2': { dhcp: true },
        'pc-3': { dhcp: true },
        'rt-1': { dhcp: true },
      }),
      node('sw-1', 'switch'),
    ]
    const edges = [
      edge('e1', 'pc-1', 'sw-1'),
      edge('e2', 'pc-2', 'sw-1'),
      edge('e3', 'pc-3', 'sw-1'),
      edge('e4', 'sw-1', 'rt-1'),
    ]
    expect(validateLevel(level, nodes, edges).passed).toBe(true)
  })

  it('memisahkan VLAN tamu dan staf', () => {
    const level = LEVELS[4]
    const nodes = configuredNodes(4, {
      'pc-staff': {
        ip: '192.168.10.10',
        subnet: '255.255.255.0',
        vlan: '10',
      },
      'pc-guest': {
        ip: '192.168.20.10',
        subnet: '255.255.255.0',
        vlan: '20',
      },
    })
    const edges = [
      edge('e1', 'pc-staff', 'sw-1'),
      edge('e2', 'pc-guest', 'sw-1'),
    ]
    expect(validateLevel(level, nodes, edges).passed).toBe(true)

    const sameVlan = nodes.map((item) =>
      item.id === 'pc-guest'
        ? {
            ...item,
            data: {
              ...item.data,
              config: { ...item.data.config, vlan: '10' },
            },
          }
        : item,
    )
    const result = validateLevel(level, sameVlan, edges)
    expect(result.passed).toBe(false)
    expect(result.checks.find((check) => check.id === 'isolated')?.passed).toBe(false)
  })
})
