import { describe, expect, it } from 'vitest'
import { LEVELS } from './levels'
import { getLevelVariant, randomSeed } from './variants'

describe('variasi level', () => {
  it('menghasilkan kasus yang sama untuk seed yang sama', () => {
    const first = getLevelVariant('guest-vlan', 'NF-TEST1')
    const second = getLevelVariant('guest-vlan', 'NF-TEST1')
    expect(first).toEqual(second)
  })

  it('memvariasikan VLAN dan subnet level tamu', () => {
    const pairs = new Set<string>()
    for (const seed of ['NF-AAAAA', 'NF-BBBBB', 'NF-CCCCC', 'NF-DDDDD']) {
      const level = getLevelVariant('guest-vlan', seed)
      const objective = level.objectives.find(
        (item) => item.kind === 'configured' && item.vlans,
      )
      expect(objective?.kind).toBe('configured')
      if (objective?.kind === 'configured') {
        const values = Object.values(objective.vlans ?? {})
        expect(values).toHaveLength(2)
        expect(values[0]).not.toBe(values[1])
        pairs.add(values.join('-'))
      }
      expect(level.brief).toContain('VLAN')
    }
    expect(pairs.size).toBeGreaterThan(1)
  })

  it('menempatkan tepat satu laptop di level switch', () => {
    const level = getLevelVariant('tiny-switch', 'NF-LAPTOP')
    const laptops = level.initialNodes.filter(
      (node) => node.data.deviceType === 'laptop',
    )
    expect(laptops).toHaveLength(1)
    expect(level.initialNodes).toHaveLength(4)
  })

  it('mempertahankan id level dan jumlah level', () => {
    for (const level of LEVELS) {
      const variant = getLevelVariant(level.id, 'NF-STABLE')
      expect(variant.id).toBe(level.id)
      expect(variant.objectives.length).toBe(level.objectives.length)
    }
    expect(LEVELS).toHaveLength(5)
  })

  it('membuat seed dengan format yang bisa dibagikan', () => {
    expect(randomSeed()).toMatch(/^NF-[A-HJ-NP-Z2-9]{5}$/)
  })
})
