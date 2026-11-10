import { describe, expect, it } from 'vitest'
import { DEFAULT_PROFILE } from './profile'
import { buyUpgrade } from './shop'

describe('toko kantor', () => {
  it('membeli upgrade jika uang cukup', () => {
    const rich = { ...DEFAULT_PROFILE, money: 500, upgrades: { ...DEFAULT_PROFILE.upgrades } }
    const result = buyUpgrade(rich, 'toolbox')
    expect(result.ok).toBe(true)
    expect(result.profile.money).toBe(320)
    expect(result.profile.upgrades.toolbox).toBe(true)
  })

  it('menolak pembelian jika uang kurang', () => {
    const poor = { ...DEFAULT_PROFILE, money: 10, upgrades: { ...DEFAULT_PROFILE.upgrades } }
    const result = buyUpgrade(poor, 'ups')
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('insufficient')
    expect(result.profile.money).toBe(10)
  })

  it('menolak pembelian ganda', () => {
    const owned = {
      ...DEFAULT_PROFILE,
      money: 500,
      upgrades: { ...DEFAULT_PROFILE.upgrades, cableTray: true },
    }
    const result = buyUpgrade(owned, 'cableTray')
    expect(result.ok).toBe(false)
    expect(result.reason).toBe('owned')
    expect(result.profile.money).toBe(500)
  })
})
