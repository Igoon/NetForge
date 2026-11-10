import { LEVELS } from './levels'

export interface LevelRecord {
  bestScore: number
  stars: number
  completions: number
}

export interface Profile {
  version: 1
  name: string
  money: number
  xp: number
  reputation: number
  day: number
  levels: Record<string, LevelRecord>
}

export interface MissionReward {
  money: number
  xp: number
  reputation: number
  stars: number
  replay: boolean
}

export interface MissionResult {
  profile: Profile
  reward: MissionReward | null
  cleared: boolean
}

export const PROFILE_KEY = 'netforge.profile.v1'
export const XP_PER_LEVEL = 120

export const DEFAULT_PROFILE: Profile = {
  version: 1,
  name: 'Iga',
  money: 150,
  xp: 0,
  reputation: 0,
  day: 1,
  levels: {},
}

export function starsForScore(score: number): 0 | 1 | 2 | 3 {
  if (score >= 90) return 3
  if (score >= 70) return 2
  if (score >= 50) return 1
  return 0
}

export function xpProgress(xp: number): {
  level: number
  current: number
  next: number
  percent: number
} {
  const level = 1 + Math.floor(Math.max(0, xp) / XP_PER_LEVEL)
  const current = Math.max(0, xp) % XP_PER_LEVEL
  return {
    level,
    current,
    next: XP_PER_LEVEL,
    percent: Math.round((current / XP_PER_LEVEL) * 100),
  }
}

export function totalStars(profile: Profile): number {
  return Object.values(profile.levels).reduce(
    (total, record) => total + record.stars,
    0,
  )
}

export function bestStars(profile: Profile, levelId: string): number {
  return profile.levels[levelId]?.stars ?? 0
}

export function isLevelUnlocked(profile: Profile, levelId: string): boolean {
  const index = LEVELS.findIndex((level) => level.id === levelId)
  if (index <= 0) return true
  const previous = LEVELS[index - 1]
  return bestStars(profile, previous.id) >= 1
}

export function isDevUnlockAll(): boolean {
  if (typeof window === 'undefined') return false
  return (
    import.meta.env.DEV &&
    new URLSearchParams(window.location.search).get('unlockAll') === '1'
  )
}

export function recordMission(
  profile: Profile,
  levelId: string,
  score: number,
  stars: number,
): MissionResult {
  if (stars < 1) {
    return { profile, reward: null, cleared: false }
  }

  const previous = profile.levels[levelId]
  const replay = (previous?.completions ?? 0) > 0
  const money = Math.round((120 + score * 2) * (replay ? 0.4 : 1))
  const xp = Math.round((25 + score * 0.6) * (replay ? 0.5 : 1))
  const reputation = Math.round(
    ([0, 3, 6, 10][stars] ?? 0) * (replay ? 0.5 : 1),
  )
  const levels = {
    ...profile.levels,
    [levelId]: {
      bestScore: Math.max(previous?.bestScore ?? 0, score),
      stars: Math.max(previous?.stars ?? 0, stars),
      completions: (previous?.completions ?? 0) + 1,
    },
  }
  const nextProfile: Profile = {
    ...profile,
    money: profile.money + money,
    xp: profile.xp + xp,
    reputation: Math.min(100, profile.reputation + reputation),
    day: profile.day + 1,
    levels,
  }

  return {
    profile: nextProfile,
    reward: { money, xp, reputation, stars, replay },
    cleared: true,
  }
}

export function loadProfile(): Profile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY)
    if (!raw) return { ...DEFAULT_PROFILE, levels: {} }
    const parsed = JSON.parse(raw) as Partial<Profile>
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      version: 1,
      name: 'Iga',
      levels: parsed.levels ?? {},
    }
  } catch {
    return { ...DEFAULT_PROFILE, levels: {} }
  }
}

export function saveProfile(profile: Profile): void {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Profil tetap hidup di memori jika penyimpanan diblokir.
  }
}
