import { CUSTOMER_ORDERS } from '../data/customers'
import { STAR_THRESHOLDS } from '../data/balance'
import { briefingNote } from '../data/officeStory'
import { starsForScore } from '../data/profile'
import { LEVELS } from '../data/levels'
import { CustomerAvatar } from './CustomerAvatar'
import { useGameStore } from '../store/gameStore'

export function LevelPanel() {
  const levelId = useGameStore((state) => state.levelId)
  const level = useGameStore((state) => state.level)
  const seed = useGameStore((state) => state.seed)
  const checks = useGameStore((state) => state.checks)
  const score = useGameStore((state) => state.score)
  const breakdown = useGameStore((state) => state.breakdown)
  const passed = useGameStore((state) => state.passed)
  const cleared = useGameStore((state) => state.cleared)
  const runSettled = useGameStore((state) => state.runSettled)
  const lastReward = useGameStore((state) => state.lastReward)
  const objectivesPassed = useGameStore((state) => state.objectivesPassed)
  const incidents = useGameStore((state) => state.incidents)
  const simulating = useGameStore((state) => state.simulating)
  const officeBriefing = useGameStore((state) => state.officeBriefing)
  const selectLevel = useGameStore((state) => state.selectLevel)
  const resetLevel = useGameStore((state) => state.resetLevel)
  const currentIndex = LEVELS.findIndex((item) => item.id === levelId)
  const note = briefingNote(officeBriefing)
  const nextLevel = LEVELS[currentIndex + 1]
  const activeIncidents = incidents.filter(
    (incident) => incident.status === 'active',
  ).length
  const stars = passed ? starsForScore(score) : 0
  const customerOrder = CUSTOMER_ORDERS[levelId]
  const briefingReaction =
    officeBriefing === 'listen'
      ? ' Customer merasa didengarkan sejak awal.'
      : officeBriefing === 'inspect'
        ? ' Perlengkapan yang diperiksa membuat pekerjaan lebih tenang.'
        : ''
  const customerReaction = !cleared
    ? 'Pekerjaan selesai, tetapi kualitasnya belum memenuhi ekspektasi. Coba lagi.'
    : score >= STAR_THRESHOLDS.three
      ? `Customer sangat puas. Relasinya meningkat pesat.${briefingReaction}`
      : score >= STAR_THRESHOLDS.two
        ? `Customer puas dengan hasil kerja Iga.${briefingReaction}`
        : `Customer cukup puas, meski masih ada ruang perbaikan.${briefingReaction}`


  const missionMessage = simulating
    ? 'Paket sedang berjalan melalui topologi...'
    : passed && !cleared
      ? 'Misi selesai, tetapi skor belum mencapai 1 bintang. Ulangi untuk lulus.'
      : passed
        ? 'Semua tujuan tercapai. Misi selesai!'
        : objectivesPassed && activeIncidents > 0
          ? 'Tujuan sudah tercapai. Tangani gangguan agar misi selesai.'
          : activeIncidents > 0
            ? 'Ada gangguan aktif. Selesaikan dulu agar skor tidak terus turun.'
            : 'Selesaikan semua tujuan untuk menuntaskan misi.'

  return (
    <section className="panel level-panel">
      <div className="panel-heading">
        <span className="eyebrow">Misi aktif</span>
        <h2>{level.name}</h2>
        <p className="level-tagline">{level.tagline}</p>
        <div className="level-meta">
          <span className="seed-chip">seed {seed}</span>
          <span className="variant-chip">kasus acak</span>
        </div>
      </div>

      <p className="level-brief">{level.brief}</p>

      {note ? (
        <div className="level-briefing-note">
          <span>Catatan briefing</span>
          <p>{note}</p>
        </div>
      ) : null}

      <div className="score-block">
        <div className="score-copy">
          <strong>{score}</strong>
          <span>skor</span>
        </div>
        <div className="score-side">
          <div className="stars" aria-label={`Pencapaian ${stars} dari 3`}>
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`star${index < stars ? ' is-on' : ''}`}
              />
            ))}
          </div>
          <div className="progress-track">
            <span style={{ width: `${score}%` }} />
          </div>
        </div>
      </div>

      <div className="score-breakdown">
        <div>
          <span>Misi</span>
          <strong>{breakdown.mission}<small>/50</small></strong>
        </div>
        <div>
          <span>Waktu</span>
          <strong>{breakdown.time}<small>/20</small></strong>
        </div>
        <div>
          <span>Insiden</span>
          <strong>{breakdown.incidents}<small>/20</small></strong>
        </div>
        <div>
          <span>Kerapian</span>
          <strong>{breakdown.tidy}<small>/10</small></strong>
        </div>
      </div>

      <div className={`mission-state${cleared ? ' is-done' : ''}`}>
        <span className="state-dot" />
        {missionMessage}
      </div>

      {lastReward ? (
        <div className="reward-box">
          <span className="eyebrow">
            {lastReward.replay ? 'Hadiah ulangan' : 'Hadiah shift'}
          </span>
          <div className="reward-grid">
            <div>
              <span>Uang</span>
              <strong>+Rp {lastReward.money.toLocaleString('id-ID')}</strong>
            </div>
            <div>
              <span>XP</span>
              <strong>+{lastReward.xp}</strong>
            </div>
            <div>
              <span>Reputasi</span>
              <strong>+{lastReward.reputation}</strong>
            </div>
          </div>
        </div>
      ) : null}

      {runSettled && customerOrder ? (
        <div
          className={`mission-report${cleared ? ' is-success' : ' is-fail'}`}
        >
          <div className="mission-report-head">
            <CustomerAvatar
              customer={customerOrder.customer}
              className="report-avatar"
            />
            <div>
              <span className="eyebrow">Laporan ke customer</span>
              <strong>{customerOrder.customer.name}</strong>
              <p>{customerReaction}</p>
            </div>
          </div>
          <button className="return-office-button" onClick={resetLevel}>
            Kembali ke kantor
          </button>
        </div>
      ) : null}

      {passed && !cleared ? (
        <button className="retry-button" onClick={resetLevel}>
          Ulangi misi
        </button>
      ) : null}

      {cleared ? (
        nextLevel ? (
          <button
            className="next-level"
            onClick={() => selectLevel(nextLevel.id)}
          >
            <span>
              <small>Misi berikutnya</small>
              {nextLevel.name}
            </span>
            <span className="next-arrow">→</span>
          </button>
        ) : (
          <div className="final-note">
            Semua misi selesai. Topologi jaringanmu sudah cukup rapi.
          </div>
        )
      ) : null}

      <div className="objective-list">
        {checks.map((check) => (
          <div
            key={check.id}
            className={`objective${check.passed ? ' is-passed' : ''}`}
          >
            <span className="objective-mark">{check.passed ? '✓' : '·'}</span>
            <div>
              <strong>{check.label}</strong>
              <small>{check.detail}</small>
            </div>
          </div>
        ))}
      </div>

      <div className="hint-block">
        <span className="eyebrow">Petunjuk</span>
        <ul>
          {level.hints.map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}



