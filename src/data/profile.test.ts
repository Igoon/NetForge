import { describe, expect, it } from 'vitest'
import {
  DEFAULT_PROFILE,
  isLevelUnlocked,
  recordMission,
  starsForScore,
  totalStars,
  xpProgress,
} from './profile'

describe('profil Iga', () => {
  it('menentukan bintang dari skor', () => {
    expect(starsForScore(49)).toBe(0)
    expect(starsForScore(50)).toBe(1)
    expect(starsForScore(70)).toBe(2)
    expect(starsForScore(90)).toBe(3)
  })

  it('menghitung level dan progres XP', () => {
    expect(xpProgress(0)).toMatchObject({ level: 1, current: 0, percent: 0 })
    expect(xpProgress(120)).toMatchObject({ level: 2, current: 0 })
    expect(xpProgress(150)).toMatchObject({ level: 2, current: 30 })
  })

  it('memberi hadiah pertama dan menyimpan rekor', () => {
    const result = recordMission(DEFAULT_PROFILE, 'first-cable', 100, 3)
    expect(result.cleared).toBe(true)
    expect(result.reward).toMatchObject({ stars: 3, replay: false })
    expect(result.profile.money).toBe(470)
    expect(result.profile.levels['first-cable']).toMatchObject({
      bestScore: 100,
      stars: 3,
      completions: 1,
    })
    expect(result.profile.day).toBe(2)
    expect(totalStars(result.profile)).toBe(3)
  })

  it('mengurangi hadiah saat mengulang tanpa menghapus rekor terbaik', () => {
    const first = recordMission(DEFAULT_PROFILE, 'first-cable', 100, 3)
    const replay = recordMission(first.profile, 'first-cable', 80, 2)
    expect(replay.reward?.replay).toBe(true)
    expect(replay.profile.levels['first-cable'].bestScore).toBe(100)
    expect(replay.profile.levels['first-cable'].stars).toBe(3)
    expect(replay.profile.levels['first-cable'].completions).toBe(2)
  })

  it('tidak memberi hadiah atau membuka level jika bintang nol', () => {
    const result = recordMission(DEFAULT_PROFILE, 'first-cable', 40, 0)
    expect(result.cleared).toBe(false)
    expect(result.reward).toBeNull()
    expect(result.profile).toEqual(DEFAULT_PROFILE)
  })

  it('membuka level berikutnya setelah minimal satu bintang', () => {
    expect(isLevelUnlocked(DEFAULT_PROFILE, 'first-cable')).toBe(true)
    expect(isLevelUnlocked(DEFAULT_PROFILE, 'tiny-switch')).toBe(false)

    const result = recordMission(DEFAULT_PROFILE, 'first-cable', 80, 2)
    expect(isLevelUnlocked(result.profile, 'tiny-switch')).toBe(true)
    expect(isLevelUnlocked(result.profile, 'two-subnets')).toBe(false)
  })
})
