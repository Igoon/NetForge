import { useEffect, useRef, useState } from 'react'
import { getIncidentDefinition, type Incident } from '../data/incidents'
import { useGameStore } from '../store/gameStore'

export function ComicPopup() {
  const incidents = useGameStore((state) => state.incidents)
  const [popup, setPopup] = useState<Incident | null>(null)
  const lastId = useRef<string | null>(null)

  useEffect(() => {
    const active = incidents.find((incident) => incident.status === 'active')
    if (!active) {
      lastId.current = null
      return
    }
    if (active.id === lastId.current) return

    lastId.current = active.id
    setPopup(active)
    const timer = window.setTimeout(() => setPopup(null), 2300)
    return () => window.clearTimeout(timer)
  }, [incidents])

  if (!popup) return null

  const definition = getIncidentDefinition(popup.type)

  return (
    <div
      className={`comic-popup is-${popup.type}`}
      key={popup.id}
      role="status"
      aria-live="assertive"
    >
      <div className="comic-popup-burst">
        <svg
          className="comic-popup-shape"
          viewBox="0 0 400 260"
          aria-hidden="true"
        >
          <polygon
            points="200,8 224,48 268,24 270,70 316,64 302,108 354,116 326,154 372,178 326,198 340,240 292,226 276,258 238,226 204,252 178,220 138,246 130,208 86,222 96,184 50,184 72,146 28,126 64,96 34,62 78,60 64,18 108,32 120,4 158,32"
            fill="#1e2936"
            opacity=".2"
            transform="translate(5 6)"
          />
          <polygon
            points="200,8 224,48 268,24 270,70 316,64 302,108 354,116 326,154 372,178 326,198 340,240 292,226 276,258 238,226 204,252 178,220 138,246 130,208 86,222 96,184 50,184 72,146 28,126 64,96 34,62 78,60 64,18 108,32 120,4 158,32"
            fill="var(--comic-fill)"
            stroke="#1e2936"
            strokeWidth="5"
            strokeLinejoin="round"
          />
        </svg>
        <div className="comic-popup-copy">
          <span className="comic-popup-word">{definition.comic.exclaim}</span>
          <span className="comic-popup-title">{popup.title}</span>
        </div>
      </div>
    </div>
  )
}
