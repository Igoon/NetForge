export type InventoryItem = 'spareCable' | 'token' | 'charger' | 'cableClip'

export interface InventoryDefinition {
  item: InventoryItem
  label: string
  short: string
  description: string
  color: string
}

export type Inventory = Record<InventoryItem, number>

export const INVENTORY_ORDER: InventoryItem[] = [
  'spareCable',
  'token',
  'charger',
  'cableClip',
]

export const INVENTORY_DEFS: Record<InventoryItem, InventoryDefinition> = {
  spareCable: {
    item: 'spareCable',
    label: 'Kabel cadangan',
    short: 'KBL',
    description: 'Mengganti kabel yang putus atau ditarik kucing.',
    color: '#2f6f9f',
  },
  token: {
    item: 'token',
    label: 'Token listrik',
    short: 'TKN',
    description: 'Mengembalikan daya saat token listrik habis.',
    color: '#b7791f',
  },
  charger: {
    item: 'charger',
    label: 'Charger',
    short: 'CHG',
    description: 'Menyelamatkan laptop yang kehabisan baterai.',
    color: '#2f7a57',
  },
  cableClip: {
    item: 'cableClip',
    label: 'Cable clip',
    short: 'CLP',
    description: 'Mencegah kabel ditarik kucing untuk seterusnya.',
    color: '#6b5b95',
  },
}

export const STARTING_INVENTORY: Inventory = {
  spareCable: 1,
  token: 1,
  charger: 1,
  cableClip: 1,
}

export const RESTOCK_SECONDS = 15
export const TOOLBOX_RESTOCK_SECONDS = 8

export function emptyInventory(): Inventory {
  return {
    spareCable: 0,
    token: 0,
    charger: 0,
    cableClip: 0,
  }
}

export function freshInventory(): Inventory {
  return { ...STARTING_INVENTORY }
}

export function hasItem(inventory: Inventory, item: InventoryItem): boolean {
  return inventory[item] > 0
}

export function consumeItem(
  inventory: Inventory,
  item: InventoryItem,
): Inventory | null {
  if (!hasItem(inventory, item)) return null
  return { ...inventory, [item]: inventory[item] - 1 }
}
