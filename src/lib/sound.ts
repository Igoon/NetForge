import type { IncidentResolution, IncidentType } from '../data/incidents'

const SOUND_KEY = 'netforge.sound.v1'
type Wave = 'sine' | 'square' | 'triangle' | 'sawtooth'

function readEnabled(): boolean {
  try {
    return localStorage.getItem(SOUND_KEY) !== 'off'
  } catch {
    return true
  }
}

let enabled = readEnabled()
let context: AudioContext | null = null

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!context) {
      const Ctor =
        window.AudioContext ??
        (window as Window & { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext
      if (!Ctor) return null
      context = new Ctor()
    }
    if (context.state === 'suspended') void context.resume()
    return context
  } catch {
    return null
  }
}

function tone(
  ctx: AudioContext,
  frequency: number,
  delay: number,
  duration: number,
  wave: Wave,
  volume: number,
): void {
  const start = ctx.currentTime + delay
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()
  oscillator.type = wave
  oscillator.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.linearRampToValueAtTime(volume, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  oscillator.connect(gain)
  gain.connect(ctx.destination)
  oscillator.start(start)
  oscillator.stop(start + duration + 0.02)
}

function sequence(
  notes: Array<[number, number]>,
  wave: Wave,
  volume = 0.035,
): void {
  if (!enabled) return
  const ctx = getContext()
  if (!ctx) return
  for (const [frequency, delay] of notes) {
    tone(ctx, frequency, delay, 0.14, wave, volume)
  }
}

export function isSoundEnabled(): boolean {
  return enabled
}

export function toggleSound(): boolean {
  enabled = !enabled
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off')
  } catch {
    // abaikan
  }
  if (enabled) sequence([[660, 0], [880, 0.06]], 'sine')
  return enabled
}

export function playIncident(type: IncidentType): void {
  if (type === 'blackout') {
    sequence([[110, 0], [72, 0.08], [48, 0.16]], 'sawtooth', 0.03)
    return
  }
  if (type === 'cat') {
    sequence([[880, 0], [1180, 0.07], [760, 0.14]], 'triangle', 0.04)
    return
  }
  sequence([[660, 0], [440, 0.08]], 'square', 0.03)
}

export function playResolution(method: IncidentResolution): void {
  if (method === 'inventory') {
    sequence([[523, 0], [659, 0.07], [784, 0.14]], 'sine', 0.045)
    return
  }
  if (method === 'prevention') {
    sequence([[392, 0], [523, 0.08], [659, 0.16]], 'triangle', 0.04)
    return
  }
  sequence([[330, 0], [440, 0.07]], 'sine', 0.035)
}

export function playSuccess(): void {
  sequence(
    [[523, 0], [659, 0.08], [784, 0.16], [1046, 0.24]],
    'sine',
    0.045,
  )
}
