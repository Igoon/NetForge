import { CUSTOMER_ORDERS } from '../data/customers'
import { useGameStore } from '../store/gameStore'
import { CharacterAvatar } from './CharacterAvatar'

interface OfficeFallbackProps {
  onOpenOrder: () => void
}

export function OfficeFallback({ onOpenOrder }: OfficeFallbackProps) {
  const levelId = useGameStore((state) => state.levelId)
  const order = CUSTOMER_ORDERS[levelId]

  return (
    <div className="office-hub office-fallback">
      <div className="office-fallback-card">
        <span className="eyebrow">Kantor NetForge · mode ringan</span>
        <div className="office-fallback-main">
          <CharacterAvatar className="office-fallback-avatar" />
          <div>
            <h2>Iga siap menerima order</h2>
            <p>
              WebGL tidak tersedia di perangkat ini. Kantor tetap bisa dipakai
              dalam mode 2D.
            </p>
          </div>
        </div>

        <div className="office-fallback-npcs">
          <span>Mbak Rani · admin</span>
          <span>Pak Darma · teknisi</span>
          <span>Kucing kantor</span>
        </div>

        {order ? (
          <div className="office-fallback-order">
            <span>Order menunggu</span>
            <strong>{order.orderTitle}</strong>
            <small>{order.customer.name}</small>
          </div>
        ) : null}

        <button className="office-order-button" onClick={onOpenOrder}>
          Buka papan order
        </button>
      </div>
    </div>
  )
}
