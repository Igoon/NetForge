import { useEffect, useRef } from 'react'
import { formatDuration } from '../lib/format'
import { playSuccess } from '../lib/sound'
import { useGameStore } from '../store/gameStore'

export function TimerHud() {
  const level = useGameStore((state) => state.level)
  const elapsed = useGameStore((state) => state.elapsed)
  const timerState = useGameStore((state) => state.timerState)
  const tick = useGameStore((state) => state.tick)
  const togglePause = useGameStore((state) => state.togglePause)
  const previousTimerState = useRef(timerState)

  useEffect(() => {
    if (
      previousTimerState.current !== 'complete' &&
      timerState === 'complete' &&
      elapsed > 0
    ) {
      playSuccess()
    }
    previousTimerState.current = timerState
  }, [elapsed, timerState])

  useEffect(() => {
    if (timerState !== 'running') return
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [tick, timerState])

  return (
    <div className={`timer-hud is-${timerState}`} aria-live="polite">
      <span className="timer-light" />
      <div className="timer-copy">
        <span>
          {timerState === 'complete'
            ? 'Misi selesai'
            : timerState === 'paused'
              ? 'Jeda'
              : timerState === 'ready'
                ? 'Siap'
                : 'Waktu'}
        </span>
        <strong>{formatDuration(elapsed)}</strong>
      </div>
      <span className="timer-par">target {formatDuration(level.parSeconds)}</span>
      {timerState === 'complete' || timerState === 'ready' ? null : (
        <button className="timer-toggle" onClick={togglePause}>
          {timerState === 'paused' ? 'Lanjut' : 'Jeda'}
        </button>
      )}
    </div>
  )
}
