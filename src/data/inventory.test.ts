import { describe, expect, it } from 'vitest'
import {
  consumeItem,
  freshInventory,
  hasItem,
  STARTING_INVENTORY,
} from './inventory'

describe('inventory', () => {
  it('memberi stok awal untuk setiap barang', () => {
    const inventory = freshInventory()
    expect(inventory).toEqual(STARTING_INVENTORY)
    expect(hasItem(inventory, 'spareCable')).toBe(true)
  })

  it('mengurangi stok saat barang dipakai', () => {
    const inventory = consumeItem(freshInventory(), 'token')
    expect(inventory?.token).toBe(0)
    expect(inventory && hasItem(inventory, 'token')).toBe(false)
  })

  it('menolak pemakaian saat stok habis', () => {
    const empty = { ...freshInventory(), charger: 0 }
    expect(consumeItem(empty, 'charger')).toBeNull()
  })
})
