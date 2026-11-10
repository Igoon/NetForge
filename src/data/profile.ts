import { z } from 'zod'
import { LEVELS } from './levels'
import {
  BASE_PAYOUT,
  PAYOUT_PER_SCORE,
  STAR_THRESHOLDS,
} from './balance'

export type UpgradeId = 'toolbox' | 'cableTray' | 'ups'

export interface LevelRecord {
  bestScore: number
  stars: number
  completions: number
}

export type Upgrades = Record<UpgradeId, boolean>

export interface Profile {
  version: 1
  name: string
  money: number
  xp: number
  reputation: number
  day: number
  levels: Record<string, LevelRecord>
  upgrades: Upgrades
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
export const PROFILE_BACKUP_KEY = 'netforge.profile.v1.backup'
export const XP_PER_LEVEL = 120

export const DEFAULT_UPGRADES: Upgrades = {
  toolbox: false,
  cableTray: false,
  ups: false,
}

export const DEFAULT_PROFILE: Profile = {
  version: 1,
  name: 'Iga',
  money: 150,
  xp: 0,
  reputation: 0,
  day: 1,
  levels: {},
  upgrades: { ...DEFAULT_UPGRADES },
}

const levelRecordSchema = z.object({
  bestScore: z.number().finite().min(0).max(100),
  stars: z.number().int().min(0).max(3),
  completions: z.number().int().min(0).max(1_000_000),
})

const profileSchema = z.object({
  money: z.number().finite().min(0).max(1_000_000_000),
  xp: z.number().finite().min(0).max(100_000_000),
  reputation: z.number().finite().min(0).max(100),
  day: z.number().int().min(1).max(1_000_000),
  levels: z.record(z.string(), levelRecordSchema).optional(),
  upgrades: z
    .object({
      toolbox: z.boolean().optional(),
      cableTray: z.boolean().optional(),
      ups: z.boolean().optional(),
    })
    .optional(),
})

export function starsForScore(score: number): 0 | 1 | 2 | 3 {
  if (score >= STAR_THRESHOLDS.three) return 3
  if (score >= STAR_THRESHOLDS.two) return 2
  if (score >= STAR_THRESHOLDS.one) return 1
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
): MissionResult {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)))
  const stars = starsForScore(safeScore)
  if (stars < 1) {
    return { profile, reward: null, cleared: false }
  }

  const previous = profile.levels[levelId]
  const replay = (previous?.completions ?? 0) > 0
  const money = Math.round(
    (BASE_PAYOUT + safeScore * PAYOUT_PER_SCORE) * (replay ? 0.4 : 1),
  )
  const xp = Math.round((25 + safeScore * 0.6) * (replay ? 0.5 : 1))
  const reputation = Math.round(
    ([0, 3, 6, 10][stars] ?? 0) * (replay ? 0.5 : 1),
  )
  const levels = {
    ...profile.levels,
    [levelId]: {
      bestScore: Math.max(previous?.bestScore ?? 0, safeScore),
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

function normalizeProfile(input: z.infer<typeof profileSchema>): Profile {
  const levels: Record<string, LevelRecord> = {}
  for (const [levelId, record] of Object.entries(input.levels ?? {})) {
    if (!LEVELS.some((level) => level.id === levelId)) continue
    levels[levelId] = {
      bestScore: Math.round(record.bestScore),
      stars: record.stars,
      completions: record.completions,
    }
  }

  return {
    version: 1,
    name: 'Iga',
    money: Math.round(input.money),
    xp: Math.round(input.xp),
    reputation: Math.round(input.reputation),
    day: input.day,
    levels,
    upgrades: {
      ...DEFAULT_UPGRADES,
      ...input.upgrades,
    },
  }
}

function parseStoredProfile(raw: string): Profile | null {
  try {
    const parsed = profileSchema.safeParse(JSON.parse(raw))
    return parsed.success ? normalizeProfile(parsed.data) : null
  } catch {
    return null
  }
}

export function loadProfile(): Profile {
  try {
    for (const key of [PROFILE_KEY, PROFILE_BACKUP_KEY]) {
      const raw = localStorage.getItem(key)
      if (!raw) continue
      const profile = parseStoredProfile(raw)
      if (profile) return profile
    }
  } catch {
    // abaikan; gunakan profil baru
  }
  return { ...DEFAULT_PROFILE, levels: {}, upgrades: { ...DEFAULT_UPGRADES } }
}

export function saveProfile(profile: Profile): void {
  try {
    const current = localStorage.getItem(PROFILE_KEY)
    if (current) localStorage.setItem(PROFILE_BACKUP_KEY, current)
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  } catch {
    // Profil tetap hidup di memori jika penyimpanan diblokir.
  }
}


