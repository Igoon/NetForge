import type { DragEvent } from 'react'
import { DEVICES } from '../data/devices'
import { useGameStore } from '../store/gameStore'
import type { DeviceType } from '../types'
import { DeviceGlyph } from './DeviceGlyph'

const CATEGORY_LABEL: Record<string, string> = {
  endpoint: 'Perangkat pengguna',
  network: 'Jaringan',
  security: 'Keamanan',
  server: 'Layanan',
}

export function Palette() {
  const level = useGameStore((state) => state.level)
  const addDevice = useGameStore((state) => state.addDevice)

  const onDragStart = (event: DragEvent, type: DeviceType) => {
    event.dataTransfer.setData('application/netforge-device', type)
    event.dataTransfer.effectAllowed = 'copy'
  }

  if (level.palette.length === 0) {
    return (
      <section className="panel">
        <div className="panel-heading">
          <span className="eyebrow">Komponen</span>
          <h2>Palet perangkat</h2>
        </div>
        <p className="empty-note">
          Level ini sudah menyiapkan semua perangkat. Fokus pada kabel dan
          konfigurasi.
        </p>
      </section>
    )
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <span className="eyebrow">Komponen</span>
        <h2>Palet perangkat</h2>
      </div>
      <p className="panel-subtitle">
        Seret ke kanvas, atau klik untuk menambah.
      </p>
      <div className="palette-list">
        {level.palette.map((type) => {
          const spec = DEVICES[type]
          return (
            <button
              key={type}
              className="palette-card"
              draggable
              onDragStart={(event) => onDragStart(event, type)}
              onClick={() =>
                addDevice(
                  type,
                  {
                    x: 320,
                    y: 220,
                  },
                  true,
                )
              }
            >
              <span
                className="palette-visual"
                style={{ color: spec.color }}
              >
                <DeviceGlyph type={type} />
              </span>
              <span className="palette-copy">
                <strong>{spec.label}</strong>
                <small>{CATEGORY_LABEL[spec.category]}</small>
              </span>
              <span className="palette-add">+</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
