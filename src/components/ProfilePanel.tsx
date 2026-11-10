import {
  totalStars,
  xpProgress,
} from '../data/profile'
import { useProfileStore } from '../store/profileStore'
import { CharacterAvatar } from './CharacterAvatar'

export function ProfilePanel() {
  const profile = useProfileStore((state) => state.profile)
  const xp = xpProgress(profile.xp)
  const stars = totalStars(profile)

  return (
    <section className="panel profile-panel">
      <div className="profile-main">
        <CharacterAvatar className="profile-avatar" />
        <div className="profile-copy">
          <span className="eyebrow">Teknisi jaringan</span>
          <h2>{profile.name}</h2>
          <span className="profile-level">
            Lv {xp.level} · Hari {profile.day}
          </span>
        </div>
      </div>

      <div className="profile-stats">
        <div>
          <span>Uang</span>
          <strong>Rp {profile.money.toLocaleString('id-ID')}</strong>
        </div>
        <div>
          <span>Reputasi</span>
          <strong>{profile.reputation}/100</strong>
        </div>
        <div>
          <span>Bintang</span>
          <strong>{stars}/15</strong>
        </div>
      </div>

      <div className="xp-block">
        <div className="xp-head">
          <span>XP</span>
          <span>
            {xp.current}/{xp.next}
          </span>
        </div>
        <div className="xp-track">
          <span style={{ width: `${xp.percent}%` }} />
        </div>
      </div>
    </section>
  )
}
