import { useState } from 'react'
import { ReactFlowProvider } from '@xyflow/react'
import { IncidentPanel } from './components/IncidentPanel'
import { Inspector } from './components/Inspector'
import { IntroScreen } from './components/IntroScreen'
import { InventoryPanel } from './components/InventoryPanel'
import { LevelPanel } from './components/LevelPanel'
import { Palette } from './components/Palette'
import { ProfilePanel } from './components/ProfilePanel'
import { TimerHud } from './components/TimerHud'
import { TopologyCanvas } from './components/TopologyCanvas'
import { LEVELS } from './data/levels'
import {
  isDevUnlockAll,
  isLevelUnlocked,
} from './data/profile'
import { useGameStore } from './store/gameStore'
import { useProfileStore } from './store/profileStore'

const INTRO_KEY = 'netforge.intro.v1'

function GameShell() {
  const levelId = useGameStore((state) => state.levelId)
  const nodes = useGameStore((state) => state.nodes)
  const edges = useGameStore((state) => state.edges)
  const passed = useGameStore((state) => state.passed)
  const simulating = useGameStore((state) => state.simulating)
  const timerState = useGameStore((state) => state.timerState)
  const selectLevel = useGameStore((state) => state.selectLevel)
  const resetLevel = useGameStore((state) => state.resetLevel)
  const simulate = useGameStore((state) => state.simulate)
  const profile = useProfileStore((state) => state.profile)
  const devUnlock = isDevUnlockAll()
  const currentIndex = LEVELS.findIndex((level) => level.id === levelId)

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <span className="brand-kicker">Network lab</span>
            <h1>NetForge</h1>
          </div>
        </div>

        <div className="topbar-center">
          <span className="topbar-label">Level</span>
          <span className="level-counter">
            {String(currentIndex + 1).padStart(2, '0')} /{' '}
            {String(LEVELS.length).padStart(2, '0')}
          </span>
          <select
            className="level-select"
            value={levelId}
            onChange={(event) => selectLevel(event.target.value)}
          >
            {LEVELS.map((level) => {
              const unlocked =
                devUnlock || isLevelUnlocked(profile, level.id)
              return (
                <option key={level.id} value={level.id} disabled={!unlocked}>
                  {level.name}
                  {unlocked ? '' : ' - terkunci'}
                </option>
              )
            })}
          </select>
          <TimerHud />
        </div>

        <div className="topbar-actions">
          <button className="ghost-button" onClick={resetLevel}>
            Reset
          </button>
          <button
            className={`primary-button${passed ? ' is-complete' : ''}`}
            onClick={simulate}
            disabled={simulating || timerState === 'ready'}
          >
            <span className="button-pulse" />
            {simulating ? 'Mengirim...' : 'Simulasikan'}
          </button>
        </div>
      </header>

      <main className="workspace">
        <aside className="left-column">
          <LevelPanel />
          <IncidentPanel />
        </aside>

        <section className="canvas-column">
          <TopologyCanvas />
        </section>

        <aside className="right-column">
          <ProfilePanel />
          <InventoryPanel />
          <Palette />
          <Inspector />
        </aside>
      </main>

      <footer className="statusbar">
        <div className="status-items">
          <span>
            <i className="status-dot accent" /> {nodes.length} perangkat
          </span>
          <span>
            <i className="status-dot muted" /> {edges.length} koneksi
          </span>
          <span className={passed ? 'status-ok' : ''}>
            {passed
              ? 'Misi selesai'
              : timerState === 'ready'
                ? 'Siap dimulai'
                : 'Misi berjalan'}
          </span>
        </div>
        <span className="status-hint">
          NetForge v0.1 - prototipe simulasi jaringan
        </span>
      </footer>
    </div>
  )
}

export default function App() {
  const [showIntro, setShowIntro] = useState(() => {
    if (typeof window === 'undefined') return false
    const params = new URLSearchParams(window.location.search)
    if (params.get('skipIntro') === '1') return false
    if (params.get('intro') === '1') return true
    try {
      return localStorage.getItem(INTRO_KEY) !== '1'
    } catch {
      return true
    }
  })

  const finishIntro = () => {
    try {
      localStorage.setItem(INTRO_KEY, '1')
    } catch {
      // abaikan
    }
    setShowIntro(false)
  }

  if (showIntro) return <IntroScreen onStart={finishIntro} />

  return (
    <ReactFlowProvider>
      <GameShell />
    </ReactFlowProvider>
  )
}

