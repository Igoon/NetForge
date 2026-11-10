import { describe, expect, it } from 'vitest'
import {
  npcLineFor,
  officeTier,
  storyBeatFor,
} from './officeStory'
import { DEFAULT_PROFILE, type LevelRecord, type Profile } from './profile'

function profileWith(levels: Record<string, LevelRecord>): Profile {
  return {
    ...DEFAULT_PROFILE,
    levels,
    upgrades: { ...DEFAULT_PROFILE.upgrades },
  }
}

function cleared(stars: number): LevelRecord {
  return { bestScore: 90, stars, completions: 1 }
}

describe('office story progression', () => {
  it('memakai cerita awal saat belum ada misi yang selesai', () => {
    const beat = storyBeatFor(profileWith({}))
    expect(beat.id).toBe('start')
    expect(beat.title).toContain('Hari pertama')
  })

  it('memakai beat dari misi terakhir yang sudah selesai', () => {
    const beat = storyBeatFor(
      profileWith({
        'first-cable': cleared(3),
        'tiny-switch': cleared(2),
      }),
    )
    expect(beat.id).toBe('tiny-switch')
    expect(npcLineFor('rani', profileWith({ 'tiny-switch': cleared(1) }))).toContain(
      'Pak Hasan',
    )
  })

  it('menaikkan tier kantor berdasarkan total bintang', () => {
    expect(officeTier(profileWith({}))).toBe(0)
    expect(officeTier(profileWith({ 'first-cable': cleared(1) }))).toBe(1)
    expect(
      officeTier(
        profileWith({
          'first-cable': cleared(3),
          'tiny-switch': cleared(3),
        }),
      ),
    ).toBe(2)
    expect(
      officeTier(
        profileWith({
          'first-cable': cleared(3),
          'tiny-switch': cleared(3),
          'two-subnets': cleared(3),
        }),
      ),
    ).toBe(3)
  })
})
