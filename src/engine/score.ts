import type { Incident, IncidentType } from '../data/incidents'
import type { CheckResult, Level } from '../types'

export interface ScoreBreakdown {
  mission: number
  time: number
  incidents: number
  tidy: number
  total: number
  progress: number
  handled: number
  triggered: number
  timeRatio: number
}

export function computeScore(
  level: Level,
  checks: CheckResult[],
  elapsedSeconds: number,
  incidents: Incident[],
  preventions: IncidentType[] = [],
): ScoreBreakdown {
  const progress =
    checks.length === 0
      ? 0
      : checks.filter((check) => check.passed).length / checks.length
  const triggered = incidents.length
  const handled = incidents.filter(
    (incident) => incident.status === 'resolved',
  ).length
  const active = incidents.filter(
    (incident) => incident.status === 'active',
  ).length
  const timeRatio = Math.min(
    1,
    level.parSeconds / Math.max(elapsedSeconds, 1),
  )
  const preventionRatio =
    triggered === 0 ? 1 : Math.min(1, preventions.length / triggered)

  const mission = Math.round(50 * progress)
  const time = Math.round(20 * progress * timeRatio)
  const incidentScore = Math.round(
    20 * progress * (triggered === 0 ? 1 : handled / triggered),
  )
  const tidy = Math.round(
    10 * progress * (active === 0 ? 0.6 + 0.4 * preventionRatio : 0),
  )

  return {
    mission,
    time,
    incidents: incidentScore,
    tidy,
    total: mission + time + incidentScore + tidy,
    progress,
    handled,
    triggered,
    timeRatio,
  }
}
