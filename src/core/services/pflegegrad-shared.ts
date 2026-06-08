/**
 * Pure functions for the Pflegegrad-Voreinschätzung. Safe for both client and server.
 * No imports from the persistence layer.
 */
import type { CareLevel, PflegegradAnswers } from '@/core/types'

export const moduleWeights: Record<keyof PflegegradAnswers, number> = {
  mobility: 0.1,
  cognition: 0.15,
  behaviour: 0.15,
  selfCare: 0.4,
  copingHealth: 0.2,
  dailyLife: 0.15,
}

export function computeModuleScore(answers: Record<string, number>): number {
  const vals = Object.values(answers).filter(v => typeof v === 'number')
  if (!vals.length) return 0
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

export function computeTotalScore(answers: PflegegradAnswers): number {
  let total = 0
  for (const key of Object.keys(moduleWeights) as Array<keyof PflegegradAnswers>) {
    const score = computeModuleScore(answers[key])
    total += score * (moduleWeights[key] * 100)
  }
  return Math.round(total)
}

export function estimateCareLevel(totalScore: number): CareLevel {
  if (totalScore < 12.5) return 'none'
  if (totalScore < 27) return 'pg1'
  if (totalScore < 47.5) return 'pg2'
  if (totalScore < 70) return 'pg3'
  if (totalScore < 90) return 'pg4'
  return 'pg5'
}
