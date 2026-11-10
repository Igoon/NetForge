import type { Profile, UpgradeId } from './profile'

export interface ShopUpgrade {
  id: UpgradeId
  label: string
  price: number
  description: string
  effect: string
}

export const SHOP_UPGRADES: ShopUpgrade[] = [
  {
    id: 'toolbox',
    label: 'Toolbox cepat',
    price: 180,
    description: 'Kotak alat dengan slot restock lebih ringkas.',
    effect: 'Restock item hanya 8 detik.',
  },
  {
    id: 'cableTray',
    label: 'Cable tray',
    price: 220,
    description: 'Kabel tersusun rapi di jalur khusus.',
    effect: 'Insiden kucing tidak muncul lagi.',
  },
  {
    id: 'ups',
    label: 'UPS mini',
    price: 260,
    description: 'Cadangan daya untuk perangkat penting.',
    effect: 'Blackout token listrik tidak muncul lagi.',
  },
]

export interface BuyUpgradeResult {
  profile: Profile
  ok: boolean
  reason?: 'owned' | 'insufficient'
}

export function buyUpgrade(
  profile: Profile,
  upgradeId: UpgradeId,
): BuyUpgradeResult {
  const item = SHOP_UPGRADES.find((upgrade) => upgrade.id === upgradeId)
  if (!item) return { profile, ok: false }
  if (profile.upgrades[upgradeId]) {
    return { profile, ok: false, reason: 'owned' }
  }
  if (profile.money < item.price) {
    return { profile, ok: false, reason: 'insufficient' }
  }

  return {
    profile: {
      ...profile,
      money: profile.money - item.price,
      upgrades: { ...profile.upgrades, [upgradeId]: true },
    },
    ok: true,
  }
}
