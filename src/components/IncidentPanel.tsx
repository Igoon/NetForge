import { useEffect, useRef } from 'react'
import { getIncidentDefinition, type IncidentResolution } from '../data/incidents'
import { formatDuration } from '../lib/format'
import { playIncident, playResolution } from '../lib/sound'
import { useGameStore } from '../store/gameStore'

export function IncidentPanel() {
  const incidents = useGameStore((state) => state.incidents)
  const preventions = useGameStore((state) => state.preventions)
  const inventory = useGameStore((state) => state.inventory)
  const loadout = useGameStore((state) => state.loadout)
  const triggeredCount = useGameStore((state) => state.triggeredCount)
  const resolveIncident = useGameStore((state) => state.resolveIncident)
  const active = incidents.filter((incident) => incident.status === 'active')
  const resolved = incidents.filter((incident) => incident.status === 'resolved')
  const activeIncident = active[0]
  const lastSoundId = useRef<string | null>(null)

  useEffect(() => {
    if (!activeIncident || activeIncident.id === lastSoundId.current) return
    lastSoundId.current = activeIncident.id
    playIncident(activeIncident.type)
  }, [activeIncident])

  const resolve = (id: string, method: IncidentResolution) => {
    playResolution(method)
    resolveIncident(id, method)
  }

  return (
    <section className="panel incident-panel">
      <div className="panel-heading incident-heading">
        <div>
          <span className="eyebrow">Gangguan</span>
          <h2>Situasi lab</h2>
        </div>
        <span className="incident-count">
          {triggeredCount}/3 kejadian
        </span>
      </div>

      {active.length === 0 ? (
        <div className="incident-stable">
          <span className="stable-mark" aria-hidden="true">
            ✓
          </span>
          <div>
            <strong>Tidak ada gangguan aktif</strong>
            <small>
              Sistem stabil untuk sekarang. Gangguan bisa datang saat kamu
              sedang sibuk.
            </small>
          </div>
        </div>
      ) : (
        active.map((incident) => {
          const definition = getIncidentDefinition(incident.type)
          const inventoryCount = inventory[definition.inventory.item]
          const carried = loadout.includes(definition.inventory.item)
          const preventionCount = definition.prevention.item
            ? inventory[definition.prevention.item]
            : null
          const preventionCarried = definition.prevention.item
            ? loadout.includes(definition.prevention.item)
            : true
          const canPrevent =
            preventionCarried &&
            (preventionCount === null || preventionCount > 0)

          return (
            <div className="incident-card" key={incident.id} aria-live="polite">
              <div className="incident-card-head">
                <span className="incident-alert">!</span>
                <div>
                  <span className="incident-tag">{definition.tag}</span>
                  <strong>{incident.title}</strong>
                  <small>{incident.detail}</small>
                </div>
                <span className="incident-time">
                  t+{formatDuration(incident.startedAt)}
                </span>
              </div>

              <div className="comic-bubble">
                <span className="comic-burst">{definition.comic.exclaim}</span>
                <div className="comic-copy">
                  <strong>{definition.comic.speaker}</strong>
                  <p>{definition.comic.line}</p>
                </div>
              </div>

              <div className="incident-actions">
                <button
                  className="incident-button is-inventory"
                  onClick={() => resolve(incident.id, 'inventory')}
                  disabled={!carried || inventoryCount === 0}
                >
                  <span>{definition.inventory.label}</span>
                  <small>
                    {!carried
                      ? 'Tidak dibawa'
                      : inventoryCount === 0
                        ? 'Stok habis'
                        : `0s · stok ${inventoryCount}`}
                  </small>
                </button>
                <button
                  className="incident-button"
                  onClick={() => resolve(incident.id, 'quick')}
                >
                  <span>{definition.quickLabel}</span>
                  <small>+{definition.quickSeconds}s</small>
                </button>
              </div>
              <button
                className="incident-button is-prevent incident-prevention-wide"
                onClick={() => resolve(incident.id, 'prevention')}
                disabled={!canPrevent}
              >
                <span>{definition.prevention.label}</span>
                <small>
                  {canPrevent
                    ? `+${definition.prevention.seconds}s · cegah`
                    : !preventionCarried
                      ? 'Barang tidak dibawa'
                      : 'Stok pencegahan habis'}
                </small>
              </button>
            </div>
          )
        })
      )}

      {preventions.length > 0 ? (
        <div className="prevention-row">
          <span className="eyebrow">Pencegahan</span>
          <div className="prevention-badges">
            {preventions.map((type) => (
              <span className="prevention-badge" key={type}>
                {getIncidentDefinition(type).prevention.preventionName}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {resolved.length > 0 ? (
        <div className="incident-history">
          <span className="eyebrow">Catatan pemulihan</span>
          <div className="history-list">
            {resolved.slice(0, 4).map((incident) => (
              <div className="history-item" key={incident.id}>
                <span className="history-mark">✓</span>
                <div>
                  <strong>{incident.title}</strong>
                  <small>
                    {incident.resolution === 'prevention'
                      ? 'Ditangani dengan pencegahan'
                      : incident.resolution === 'inventory'
                        ? 'Ditangani dengan inventory'
                        : 'Ditangani cepat'}{' '}
                    · t+{formatDuration(incident.resolvedAt ?? 0)}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  )
}
