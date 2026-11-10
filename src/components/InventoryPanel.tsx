import { useState } from 'react'
import {
  INVENTORY_DEFS,
  RESTOCK_SECONDS,
  TOOLBOX_RESTOCK_SECONDS,
} from '../data/inventory'
import { isSoundEnabled, toggleSound } from '../lib/sound'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'

export function InventoryPanel() {
  const inventory = useGameStore((state) => state.inventory)
  const loadout = useGameStore((state) => state.loadout)
  const timerState = useGameStore((state) => state.timerState)
  const restockItem = useGameStore((state) => state.restockItem)
  const upgrades = useProfileStore((state) => state.profile.upgrades)
  const [soundOn, setSoundOn] = useState(isSoundEnabled)
  const restockSeconds = upgrades.toolbox
    ? TOOLBOX_RESTOCK_SECONDS
    : RESTOCK_SECONDS

  if (timerState === 'ready') return null

  const canRestock = timerState === 'running' || timerState === 'paused'

  return (
    <section className="panel inventory-panel">
      <div className="panel-heading inventory-heading">
        <div>
          <span className="eyebrow">Persediaan</span>
          <h2>Inventory</h2>
        </div>
        <button
          className={`sound-toggle${soundOn ? ' is-on' : ''}`}
          onClick={() => setSoundOn(toggleSound())}
          title={soundOn ? 'Matikan efek suara' : 'Nyalakan efek suara'}
        >
          <span className="sound-dot" />
          {soundOn ? 'SFX ON' : 'SFX OFF'}
        </button>
      </div>
      <div className="inventory-grid">
        {loadout.map((item) => {
          const definition = INVENTORY_DEFS[item]
          const count = inventory[item]
          const content = (
            <>
              <span
                className="inventory-icon"
                style={{ color: definition.color }}
              >
                {definition.short}
              </span>
              <span className="inventory-copy">
                <strong>{definition.label}</strong>
                <small>
                  {count === 0
                    ? canRestock
                      ? `Kosong · restock +${restockSeconds}s`
                      : 'Habis'
                    : `${count} tersedia`}
                </small>
              </span>
            </>
          )

          if (count === 0 && canRestock) {
            return (
              <button
                className="inventory-card is-empty is-restock"
                key={item}
                title={`Restock ${definition.label} dengan biaya ${restockSeconds} detik`}
                onClick={() => restockItem(item)}
              >
                {content}
              </button>
            )
          }

          return (
            <div
              className={`inventory-card${count === 0 ? ' is-empty' : ''}`}
              key={item}
              title={definition.description}
            >
              {content}
            </div>
          )
        })}
      </div>
      <p className="inventory-hint">
        Gunakan barang agar pulih tanpa penalti waktu. Barang kosong bisa
        di-restock dengan biaya {restockSeconds} detik.
      </p>
    </section>
  )
}
