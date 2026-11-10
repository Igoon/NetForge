import { describe, expect, it } from 'vitest'
import type { Incident } from '../data/incidents'
import { LEVELS } from '../data/levels'
import { computeScore } from './score'

const level = LEVELS[0]
const fullChecks = level.objectives.map((objective) => ({
  id: objective.id,
  label: objective.label,
  passed: true,
  detail: '',
}))

const activeIncident: Incident = {
  id: 'inc-1',
  type: 'blackout',
  title: 'Token listrik habis',
  detail: '',
  status: 'active',
  startedAt: 10,
}

const resolvedIncident: Incident = {
  ...activeIncident,
  status: 'resolved',
  resolution: 'quick',
  resolvedAt: 20,
}

describe('computeScore', () => {
  it('memberi 100 untuk misi selesai tanpa insiden di bawah target waktu', () => {
    const result = computeScore(level, fullChecks, 30, [])
    expect(result).toMatchObject({
      mission: 50,
      time: 20,
      incidents: 20,
      tidy: 10,
      total: 100,
    })
  })

  it('mengurangi skor waktu setelah melewati par time', () => {
    const result = computeScore(level, fullChecks, level.parSeconds * 2, [])
    expect(result.time).toBe(10)
    expect(result.total).toBe(90)
  })

  it('menghukum insiden yang belum ditangani', () => {
    const result = computeScore(level, fullChecks, 30, [activeIncident])
    expect(result.incidents).toBe(0)
    expect(result.tidy).toBe(0)
    expect(result.total).toBe(70)
  })

  it('memulihkan skor insiden setelah ditangani dengan pencegahan', () => {
    const result = computeScore(level, fullChecks, 30, [resolvedIncident], [
      'blackout',
    ])
    expect(result.incidents).toBe(20)
    expect(result.tidy).toBe(10)
    expect(result.total).toBe(100)
  })

  it('tetap mengurangi kerapian jika insiden hanya ditangani cepat', () => {
    const result = computeScore(level, fullChecks, 30, [resolvedIncident], [])
    expect(result.incidents).toBe(20)
    expect(result.tidy).toBe(6)
    expect(result.total).toBe(96)
  })

  it('menskalakan komponen misi saat progres belum penuh', () => {
    const partial = [
      { ...fullChecks[0], passed: true },
      { ...fullChecks[0], passed: false },
    ]
    const result = computeScore(level, partial, 30, [])
    expect(result.progress).toBe(0.5)
    expect(result.mission).toBe(25)
    expect(result.time).toBeLessThan(20)
  })
})
