import { describe, expect, it } from 'vitest'
import type { PacketEdge } from '../types'
import { LEVELS } from '../data/levels'
import {
  INCIDENT_DEFS,
  createIncident,
  pickIncidentType,
  shouldTriggerIncident,
} from './incidents'

const level = LEVELS[1]
const edge: PacketEdge = {
  id: 'e1',
  source: 'pc-1',
  target: 'pc-2',
  type: 'packet',
}

describe('insiden', () => {
  it('mendeteksi laptop sebagai syarat insiden baterai', () => {
    expect(INCIDENT_DEFS.battery.canTrigger(level.initialNodes, [])).toBe(true)
    expect(INCIDENT_DEFS.battery.canTrigger([], [])).toBe(false)
  })

  it('mendeteksi kabel sebagai syarat insiden kucing', () => {
    expect(INCIDENT_DEFS.cat.canTrigger(level.initialNodes, [])).toBe(false)
    expect(INCIDENT_DEFS.cat.canTrigger(level.initialNodes, [edge])).toBe(true)
  })

  it('tidak memilih insiden yang sudah dicegah', () => {
    expect(
      pickIncidentType(level.initialNodes, [edge], ['battery', 'cat'], () => 0),
    ).toBe('blackout')
    expect(
      pickIncidentType(
        level.initialNodes,
        [edge],
        ['battery', 'cat', 'blackout'],
        () => 0,
      ),
    ).toBeNull()
  })

  it('membuat insiden dengan detail perangkat yang relevan', () => {
    const incident = createIncident(
      'battery',
      level.initialNodes,
      [],
      'inc-1',
      12,
    )
    expect(incident.title).toBe('Baterai laptop habis')
    expect(incident.detail).toContain('Laptop 1')
    expect(incident.status).toBe('active')
  })

  it('memicu insiden dari progres misi sebelum batas waktu', () => {
    expect(shouldTriggerIncident(6, 30, 0.5, 0, false)).toBe(true)
    expect(shouldTriggerIncident(4, 30, 0.5, 0, false)).toBe(false)
    expect(shouldTriggerIncident(30, 30, 0.2, 0, false)).toBe(true)
    expect(shouldTriggerIncident(30, 30, 0.2, 0, true)).toBe(false)
    expect(shouldTriggerIncident(30, 30, 1, 3, false)).toBe(false)
  })
})
