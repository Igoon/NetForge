import { useEffect } from 'react'
import { SHOP_UPGRADES } from '../data/shop'
import { totalStars, xpProgress } from '../data/profile'
import { useProfileStore } from '../store/profileStore'
import { CharacterAvatar } from './CharacterAvatar'

interface OfficeModalProps {
  onClose: () => void
}

const NPCS = [
  {
    name: 'Mbak Rani',
    role: 'Admin kantor',
    line: 'Kalau kabel habis, bilang saja. Jangan dipaksa disambung dengan selotip.',
  },
  {
    name: 'Pak Darma',
    role: 'Teknisi senior',
    line: 'Periksa gateway sebelum menyalahkan kabel. Pengalaman memang begitu.',
  },
  {
    name: 'Kucing Kantor',
    role: 'Mascot resmi',
    line: 'Miaw. Kabel yang menggantung itu memang menarik.',
  },
]

export function OfficeModal({ onClose }: OfficeModalProps) {
  const profile = useProfileStore((state) => state.profile)
  const buyUpgrade = useProfileStore((state) => state.buyUpgrade)
  const xp = xpProgress(profile.xp)
  const stars = totalStars(profile)

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="office-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="office-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="office-title"
      >
        <div className="office-header">
          <div>
            <span className="eyebrow">Kantor NetForge</span>
            <h2 id="office-title">Ruang kerja Iga</h2>
          </div>
          <button className="office-close" onClick={onClose}>
            Tutup
          </button>
        </div>

        <div className="office-layout">
          <div className="office-side">
            <CharacterAvatar className="office-avatar" />
            <strong>{profile.name}</strong>
            <span>
              Lv {xp.level} · Hari {profile.day}
            </span>
            <div className="office-wallet">
              <span>Uang</span>
              <strong>Rp {profile.money.toLocaleString('id-ID')}</strong>
            </div>
            <div className="office-meta">
              Reputasi {profile.reputation}/100 · Bintang {stars}/15
            </div>
          </div>

          <div className="office-content">
            <div>
              <span className="eyebrow">Rekan kerja</span>
              <div className="npc-list">
                {NPCS.map((npc) => (
                  <article className="npc-card" key={npc.name}>
                    <div className="npc-avatar" aria-hidden="true">
                      {npc.name.slice(0, 1)}
                    </div>
                    <div>
                      <strong>{npc.name}</strong>
                      <span>{npc.role}</span>
                      <p>{npc.line}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="shop-block">
              <div className="shop-head">
                <div>
                  <span className="eyebrow">Toko perlengkapan</span>
                  <strong>Upgrade kantor</strong>
                </div>
                <span className="shop-money">
                  Rp {profile.money.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="shop-list">
                {SHOP_UPGRADES.map((item) => {
                  const owned = profile.upgrades[item.id]
                  const affordable = profile.money >= item.price
                  return (
                    <div className={`shop-item${owned ? ' is-owned' : ''}`} key={item.id}>
                      <div>
                        <strong>{item.label}</strong>
                        <p>{item.description}</p>
                        <small>{item.effect}</small>
                      </div>
                      <button
                        className="shop-buy"
                        onClick={() => buyUpgrade(item.id)}
                        disabled={owned || !affordable}
                      >
                        {owned
                          ? 'Terpasang'
                          : affordable
                            ? `Beli Rp ${item.price.toLocaleString('id-ID')}`
                            : 'Uang kurang'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
