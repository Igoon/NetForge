import {
  INVENTORY_DEFS,
  INVENTORY_ORDER,
} from '../data/inventory'
import { useGameStore } from '../store/gameStore'

export function LoadoutOverlay() {
  const level = useGameStore((state) => state.level)
  const seed = useGameStore((state) => state.seed)
  const loadout = useGameStore((state) => state.loadout)
  const timerState = useGameStore((state) => state.timerState)
  const toggleLoadout = useGameStore((state) => state.toggleLoadout)
  const startMission = useGameStore((state) => state.startMission)
  const rerollSeed = useGameStore((state) => state.rerollSeed)

  if (timerState !== 'ready') return null

  return (
    <div className="loadout-overlay">
      <div className="loadout-card" role="dialog" aria-labelledby="loadout-title">
        <div className="loadout-head">
          <div className="loadout-topline">
            <span className="eyebrow">Briefing · {level.name}</span>
            <div className="loadout-case">
              <span className="seed-chip">seed {seed}</span>
              <button className="loadout-reroll" onClick={rerollSeed}>
                Acak kasus
              </button>
            </div>
          </div>
          <h2 id="loadout-title">Pilih dua perlengkapan</h2>
          <p>
            Barang ini akan menemanimu selama misi. Timer baru berjalan setelah
            kamu menekan Mulai.
          </p>
        </div>

        <div className="loadout-options">
          {INVENTORY_ORDER.map((item) => {
            const definition = INVENTORY_DEFS[item]
            const selected = loadout.includes(item)
            const full = loadout.length >= 2 && !selected
            return (
              <button
                key={item}
                className={`loadout-option${selected ? ' is-selected' : ''}`}
                onClick={() => toggleLoadout(item)}
                disabled={full}
                aria-pressed={selected}
              >
                <span
                  className="loadout-icon"
                  style={{ color: definition.color }}
                >
                  {definition.short}
                </span>
                <span className="loadout-copy">
                  <strong>{definition.label}</strong>
                  <small>{definition.description}</small>
                </span>
                <span className="loadout-check">{selected ? '✓' : '+'}</span>
              </button>
            )
          })}
        </div>

        <div className="loadout-footer">
          <span className="loadout-count">
            {loadout.length}/2 dipilih
          </span>
          <button
            className="primary-button loadout-start"
            onClick={startMission}
            disabled={loadout.length !== 2}
          >
            Mulai misi
            <span className="next-arrow">→</span>
          </button>
        </div>
      </div>
    </div>
  )
}
