import { describe, expect, it } from 'vitest'
import { calculateConceptMastery } from './mastery-score'
import type { ConceptEvidence } from '@/lib/concept-detection/engine'

function evidence(overrides: Partial<ConceptEvidence> = {}): ConceptEvidence {
  return {
    conceptId: 'ch4-disinfection-sterilization',
    learningObjectiveId: 'LO-4-04',
    totalObservations: 7,
    uniqueQuestions: 4,
    uniqueQuestionsMissed: 1,
    misses: 1,
    correct: 6,
    missRate: 1 / 7,
    consecutiveRecentCorrect: 3,
    consecutiveRecentMisses: 0,
    pattern: 'trending_up',
    hasHistoricalWeakness: true,
    firstAttemptAt: '2026-09-20T10:00:00Z',
    lastAttemptAt: '2026-09-25T10:00:00Z',
    ...overrides,
  }
}

describe('calculateConceptMastery', () => {
  it('returns null when there is no evidence', () => {
    expect(calculateConceptMastery(null)).toBeNull()
    expect(calculateConceptMastery(evidence({ totalObservations: 0, correct: 0, misses: 0 }))).toBeNull()
  })

  it('produces a high non-provisional score for broad sustained success', () => {
    const result = calculateConceptMastery(evidence())!
    expect(result.score).toBeGreaterThanOrEqual(90)
    expect(result.band).toBe('Mastery demonstrated')
    expect(result.provisional).toBe(false)
  })

  it('keeps severe repeated weakness low even with enough evidence', () => {
    const result = calculateConceptMastery(evidence({
      totalObservations: 7,
      uniqueQuestions: 4,
      uniqueQuestionsMissed: 4,
      misses: 6,
      correct: 1,
      missRate: 6 / 7,
      consecutiveRecentCorrect: 0,
      consecutiveRecentMisses: 3,
      pattern: 'consistent',
    }))!
    expect(result.score).toBeLessThan(40)
    expect(result.band).toBe('Needs intensive support')
  })

  it('shrinks a tiny perfect sample toward neutral and marks it provisional', () => {
    const result = calculateConceptMastery(evidence({
      totalObservations: 2,
      uniqueQuestions: 2,
      uniqueQuestionsMissed: 0,
      misses: 0,
      correct: 2,
      missRate: 0,
      consecutiveRecentCorrect: 2,
      pattern: 'consistent',
    }))!
    expect(result.score).toBeLessThan(90)
    expect(result.score).toBeGreaterThan(50)
    expect(result.provisional).toBe(true)
    expect(result.band).not.toBe('Mastery demonstrated')
  })

  it('rewards recent improvement without erasing historical misses', () => {
    const flat = calculateConceptMastery(evidence({
      totalObservations: 7,
      uniqueQuestions: 4,
      misses: 3,
      correct: 4,
      missRate: 3 / 7,
      consecutiveRecentCorrect: 0,
      pattern: 'mixed',
    }))!
    const improving = calculateConceptMastery(evidence({
      totalObservations: 7,
      uniqueQuestions: 4,
      misses: 3,
      correct: 4,
      missRate: 3 / 7,
      consecutiveRecentCorrect: 3,
      pattern: 'trending_up',
    }))!
    expect(improving.score).toBeGreaterThan(flat.score)
    expect(improving.score - flat.score).toBeLessThanOrEqual(11)
  })

  it('penalizes alternating patterns and keeps them provisional', () => {
    const mixed = calculateConceptMastery(evidence({
      totalObservations: 8,
      uniqueQuestions: 4,
      misses: 4,
      correct: 4,
      missRate: 0.5,
      pattern: 'mixed',
      consecutiveRecentCorrect: 0,
    }))!
    const alternating = calculateConceptMastery(evidence({
      totalObservations: 8,
      uniqueQuestions: 4,
      misses: 4,
      correct: 4,
      missRate: 0.5,
      pattern: 'alternating',
      consecutiveRecentCorrect: 0,
    }))!
    expect(alternating.score).toBeLessThan(mixed.score)
    expect(alternating.provisional).toBe(true)
  })

  it('always remains within 0–100', () => {
    const high = calculateConceptMastery(evidence({
      totalObservations: 20,
      uniqueQuestions: 10,
      misses: 0,
      correct: 20,
      missRate: 0,
      consecutiveRecentCorrect: 3,
      pattern: 'trending_up',
    }))!
    const low = calculateConceptMastery(evidence({
      totalObservations: 20,
      uniqueQuestions: 10,
      misses: 20,
      correct: 0,
      missRate: 1,
      consecutiveRecentMisses: 3,
      consecutiveRecentCorrect: 0,
      pattern: 'trending_down',
    }))!
    expect(high.score).toBe(100)
    expect(low.score).toBe(0)
  })
})
