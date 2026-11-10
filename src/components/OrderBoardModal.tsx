import { MAX_ORDER_PAYOUT } from '../data/balance'
import { CUSTOMER_ORDERS } from '../data/customers'
import { LEVELS } from '../data/levels'
import {
  isDevUnlockAll,
  isLevelUnlocked,
} from '../data/profile'
import { formatDuration } from '../lib/format'
import { useDialogA11y } from '../lib/useDialogA11y'
import { useGameStore } from '../store/gameStore'
import { useProfileStore } from '../store/profileStore'
import { CustomerAvatar } from './CustomerAvatar'

export function OrderBoardModal() {
  const levelId = useGameStore((state) => state.levelId)
  const timerState = useGameStore((state) => state.timerState)
  const orderAccepted = useGameStore((state) => state.orderAccepted)
  const orderBoardOpen = useGameStore((state) => state.orderBoardOpen)
  const closeOrderBoard = useGameStore((state) => state.closeOrderBoard)
  const openOrder = useGameStore((state) => state.openOrder)
  const selectLevel = useGameStore((state) => state.selectLevel)
  const profile = useProfileStore((state) => state.profile)
  const devUnlock = isDevUnlockAll()
  const isOpen = timerState === 'ready' && !orderAccepted && orderBoardOpen
  const dialogRef = useDialogA11y<HTMLElement>(isOpen, closeOrderBoard)

  if (!isOpen) return null

  const currentIndex = LEVELS.findIndex((level) => level.id === levelId)
  const candidateIndexes = [
    currentIndex,
    currentIndex + 1,
    currentIndex + 2,
    currentIndex - 1,
  ]
  const seen = new Set<string>()
  const candidates = candidateIndexes
    .filter((index) => index >= 0 && index < LEVELS.length)
    .map((index) => LEVELS[index])
    .filter((level) => {
      if (seen.has(level.id)) return false
      seen.add(level.id)
      return true
    })
    .slice(0, 3)

  const chooseOrder = (chosenLevelId: string) => {
    if (chosenLevelId !== levelId) {
      selectLevel(chosenLevelId)
    }
    openOrder()
  }

  return (
    <div className="order-board-overlay">
      <section
        className="order-board-modal"
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-board-title"
      >
        <div className="order-board-head">
          <div>
            <span className="eyebrow">Papan order · Kantor NetForge</span>
            <h2 id="order-board-title">Pekerjaan hari ini</h2>
          </div>
          <button className="order-close" onClick={closeOrderBoard}>
            Tutup
          </button>
        </div>
        <p className="order-board-note">
          Pilih satu order. Customer akan menjelaskan kebutuhannya sebelum kamu
          berangkat.
        </p>

        <div className="order-choice-grid">
          {candidates.map((level) => {
            const order = CUSTOMER_ORDERS[level.id]
            const unlocked =
              devUnlock || isLevelUnlocked(profile, level.id)
            return (
              <button
                className={`order-choice${unlocked ? '' : ' is-locked'}${
                  level.id === levelId ? ' is-current' : ''
                }`}
                key={level.id}
                disabled={!unlocked}
                onClick={() => chooseOrder(level.id)}
              >
                <div className="order-choice-top">
                  {order ? (
                    <CustomerAvatar
                      customer={order.customer}
                      className="order-choice-avatar"
                    />
                  ) : null}
                  <div>
                    <strong>{order?.customer.name ?? 'Customer'}</strong>
                    <span>{order?.customer.role ?? 'Klien'}</span>
                  </div>
                  <span className="order-choice-badge">
                    {level.id === levelId
                      ? 'Aktif'
                      : unlocked
                        ? 'Tersedia'
                        : 'Terkunci'}
                  </span>
                </div>
                <h3>{order?.orderTitle ?? level.name}</h3>
                <p>{level.name}</p>
                <div className="order-choice-meta">
                  <span>Target {formatDuration(level.parSeconds)}</span>
                  <span>Hingga Rp{MAX_ORDER_PAYOUT}</span>
                </div>
                {!unlocked ? (
                  <small>Selesaikan level sebelumnya untuk membuka order ini.</small>
                ) : null}
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}

