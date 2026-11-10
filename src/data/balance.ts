import { LEVELS } from './levels'

export const STAR_THRESHOLDS = {
  three: 90,
  two: 70,
  one: 50,
} as const

export const TOTAL_STARS = LEVELS.length * 3
export const BASE_PAYOUT = 120
export const PAYOUT_PER_SCORE = 2
export const MAX_ORDER_PAYOUT = BASE_PAYOUT + 100 * PAYOUT_PER_SCORE
