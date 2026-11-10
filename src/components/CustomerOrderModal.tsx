import { useState } from 'react'
import {
  CUSTOMER_ORDERS,
  type CustomerOrder,
} from '../data/customers'
import { formatDuration } from '../lib/format'
import { useGameStore } from '../store/gameStore'
import { CharacterAvatar } from './CharacterAvatar'
import { CustomerAvatar } from './CustomerAvatar'

const FALLBACK_ORDER: CustomerOrder = {
  levelId: 'custom',
  orderTitle: 'Perbaiki jaringan kantor',
  igaLine: 'Saya cek dulu perangkat dan jalur kabelnya.',
  customer: {
    name: 'Pelanggan',
    role: 'Pemilik kantor',
    line: 'Jaringan di kantor saya bermasalah. Tolong bantu periksa.',
    detail: 'Pastikan semua perangkat bisa saling terhubung.',
    accent: '#2f7a57',
    hair: '#2b2f36',
    shirt: '#2f7a57',
    skin: '#e8b98c',
  },
}

export function CustomerOrderModal() {
  const level = useGameStore((state) => state.level)
  const seed = useGameStore((state) => state.seed)
  const timerState = useGameStore((state) => state.timerState)
  const orderAccepted = useGameStore((state) => state.orderAccepted)
  const orderOpen = useGameStore((state) => state.orderOpen)
  const acceptOrder = useGameStore((state) => state.acceptOrder)
  const closeOrder = useGameStore((state) => state.closeOrder)
  const [detailOpen, setDetailOpen] = useState(false)
  const order = CUSTOMER_ORDERS[level.id] ?? FALLBACK_ORDER

  if (timerState !== 'ready' || orderAccepted || !orderOpen) return null

  return (
    <div className="loadout-overlay order-overlay">
      <section
        className="order-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-title"
      >
        <div className="order-topline">
          <span className="eyebrow">Order masuk · {level.name}</span>
          <div className="order-top-actions">
            <span className="seed-chip">seed {seed}</span>
            <button className="order-close" onClick={closeOrder}>
              Nanti
            </button>
          </div>
        </div>

        <div className="order-actors">
          <div className="order-actor">
            <CustomerAvatar customer={order.customer} className="order-avatar" />
            <strong>{order.customer.name}</strong>
            <span>{order.customer.role}</span>
          </div>
          <div className="order-actor is-iga">
            <CharacterAvatar className="order-avatar" />
            <strong>Iga</strong>
            <span>Teknisi jaringan</span>
          </div>
        </div>

        <div className="order-chat">
          <div className="order-bubble is-customer">
            <span>{order.customer.name}</span>
            <p>{order.customer.line}</p>
          </div>
          {detailOpen ? (
            <div className="order-bubble is-customer is-detail">
              <span>Detail dari {order.customer.name}</span>
              <p>{order.customer.detail}</p>
            </div>
          ) : null}
          <div className="order-bubble is-iga">
            <span>Iga</span>
            <p>{order.igaLine}</p>
          </div>
        </div>

        <div className="order-summary">
          <div className="order-summary-main">
            <span className="eyebrow">Order</span>
            <strong id="order-title">{order.orderTitle}</strong>
            <p>{level.objectives.map((objective) => objective.label).join(' · ')}</p>
          </div>
          <div>
            <span>Target</span>
            <strong>{formatDuration(level.parSeconds)}</strong>
          </div>
          <div>
            <span>Bayaran</span>
            <strong>hingga Rp320</strong>
          </div>
        </div>

        <div className="order-actions">
          <button
            className="order-detail-button"
            onClick={() => setDetailOpen((value) => !value)}
          >
            {detailOpen ? 'Tutup detail' : 'Tanya detail'}
          </button>
          <button className="primary-button order-accept" onClick={acceptOrder}>
            Terima order
            <span className="next-arrow">→</span>
          </button>
        </div>
      </section>
    </div>
  )
}

