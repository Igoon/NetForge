import { MAX_ORDER_PAYOUT } from '../data/balance'
import { CUSTOMER_ORDERS } from '../data/customers'
import { briefingNote } from '../data/officeStory'
import { formatDuration } from '../lib/format'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { CustomerAvatar } from './CustomerAvatar'

export function OfficeReadyPanel() {
  const level = useGameStore((state) => state.level)
  const openOrderBoard = useGameStore((state) => state.openOrderBoard)
  const profile = useProfileStore((state) => state.profile)
  const briefing = useGameStore((state) => state.officeBriefing)
  const order = CUSTOMER_ORDERS[level.id]
  const note = briefingNote(briefing)
  const best = profile.levels[level.id]?.stars ?? 0

  return (
    <section className="panel office-ready-panel">
      <div className="panel-heading">
        <span className="eyebrow">Kantor NetForge</span>
        <h2>Iga siap bekerja</h2>
        <p className="panel-subtitle">
          Pilih order dari papan. Setelah order diterima, siapkan perlengkapan
          lalu berangkat ke lokasi.
        </p>
      </div>

      {order ? (
        <div className="office-ready-customer">
          <CustomerAvatar
            customer={order.customer}
            className="office-ready-avatar"
          />
          <div>
            <span>{order.customer.role}</span>
            <strong>{order.customer.name}</strong>
            <p>{order.customer.line}</p>
          </div>
        </div>
      ) : null}

      <div className="office-ready-order">
        <span className="eyebrow">Order berikutnya</span>
        <strong>{order?.orderTitle ?? level.name}</strong>
        <p>{level.objectives.map((objective) => objective.label).join(' A� ')}</p>
      </div>

      {note ? (
        <div className="office-ready-briefing">
          <span>Catatan briefing</span>
          <p>{note}</p>
        </div>
      ) : null}

      <div className="office-ready-stats">
        <div>
          <span>Target</span>
          <strong>{formatDuration(level.parSeconds)}</strong>
        </div>
        <div>
          <span>Hingga</span>
          <strong>Rp{MAX_ORDER_PAYOUT}</strong>
        </div>
        <div>
          <span>Bintang</span>
          <strong>{best}/3</strong>
        </div>
      </div>

      <button className="office-ready-button" onClick={openOrderBoard}>
        Buka papan order
        <span className="next-arrow">→</span>
      </button>
    </section>
  )
}
