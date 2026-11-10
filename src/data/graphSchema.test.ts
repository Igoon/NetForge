import { describe, expect, it } from 'vitest'
import { LEVELS } from './levels'
import { parseSavedGraph } from './graphSchema'

const level = LEVELS[0]

describe('validasi graf tersimpan', () => {
  it('menerima graf yang valid', () => {
    const graph = parseSavedGraph(
      JSON.stringify({
        nodes: level.initialNodes,
        edges: [
          {
            id: 'edge-1',
            source: 'pc-a',
            target: 'pc-b',
            type: 'packet',
          },
        ],
      }),
    )

    expect(graph?.nodes).toHaveLength(2)
    expect(graph?.edges).toHaveLength(1)
    expect(graph?.edges[0].data?.active).toBe(false)
  })

  it('menolak tipe perangkat yang tidak dikenal', () => {
    const nodes = structuredClone(level.initialNodes)
    nodes[0].data.deviceType = 'toaster' as never

    expect(
      parseSavedGraph(JSON.stringify({ nodes, edges: [] })),
    ).toBeNull()
  })

  it('membuang node duplikat, edge duplikat, dan edge tanpa node', () => {
    const graph = parseSavedGraph(
      JSON.stringify({
        nodes: [level.initialNodes[0], level.initialNodes[0], level.initialNodes[1]],
        edges: [
          { id: 'e1', source: 'pc-a', target: 'pc-b' },
          { id: 'e2', source: 'pc-b', target: 'pc-a' },
          { id: 'e3', source: 'pc-a', target: 'missing' },
        ],
      }),
    )

    expect(graph?.nodes).toHaveLength(2)
    expect(graph?.edges).toHaveLength(1)
  })

  it('menolak JSON rusak', () => {
    expect(parseSavedGraph('{bukan json')).toBeNull()
    expect(parseSavedGraph('{}')).toBeNull()
  })
})
