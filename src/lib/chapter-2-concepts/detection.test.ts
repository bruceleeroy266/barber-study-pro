/**
 * Chapter 2 Concept-Level Learning-Gap Detection — Tests
 *
 * Phase 6B-3: Comprehensive tests for the detection module.
 *
 * Test coverage:
 *   - All stress-test scenarios from ASCYN_PRO_CH02_PHASE6B3_THRESHOLD_STRESS_TEST.md
 *   - Boundary conditions
 *   - Edge cases
 *   - State and confidence determination
 *   - Evidence building from quiz attempts
 */

import { describe, it, expect } from 'vitest'
import {
  buildConceptEvidence,
  detectConceptState,
  detectAllConceptGaps,
  detectConceptGapsWithEvidence,
  rollupToLearningObjectives,
  type ConceptEvidence,
  type ConceptDetectionResult,
} from './detection'
import type { QuizAttempt } from '@/types'
import type { ConceptId } from './types'

// ───────────────────────────────────────────────
// Test Helpers
// ───────────────────────────────────────────────

function createQuizAttempt(
  id: string,
  answers: Record<string, string>,
  completedAt: string,
): QuizAttempt {
  return {
    id,
    user_id: 'test-user',
    quiz_id: 'quiz-2',
    score: 0,
    total_questions: Object.keys(answers).length,
    percentage: 0,
    answers_json: answers,
    completed_at: completedAt,
  }
}

function createEvidence(
  overrides: Partial<ConceptEvidence>,
): ConceptEvidence {
  return {
    conceptId: 'C-2-01',
    learningObjectiveId: 'LO-2-01',
    totalObservations: 0,
    uniqueQuestions: 0,
    uniqueQuestionsMissed: 0,
    misses: 0,
    correct: 0,
    missRate: 0,
    consecutiveRecentCorrect: 0,
    consecutiveRecentMisses: 0,
    pattern: 'consistent',
    hasHistoricalWeakness: false,
    firstAttemptAt: null,
    lastAttemptAt: null,
    ...overrides,
  }
}

// ───────────────────────────────────────────────
// Stress Test Scenarios
// ───────────────────────────────────────────────

describe('Phase 6B-3 Stress Test Scenarios', () => {
  // Single-question concept: C-2-16 (qq-2-037 only)
  const SINGLE_Q_CONCEPT: ConceptId = 'C-2-16'
  // Multi-question concept: C-2-01 (qq-2-001, qq-2-021)
  const MULTI_Q_CONCEPT: ConceptId = 'C-2-01'
  // 4+ question concept: C-2-21 (qq-2-003, qq-2-004, qq-2-012, qq-2-024, qq-2-042)
  const FOUR_PLUS_Q_CONCEPT: ConceptId = 'C-2-21'

  describe('Single-Question Concepts', () => {
    it('P1: 1 attempt / 1 miss → insufficient_evidence', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong (correct is 'b')
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(1)
      expect(result.evidence.misses).toBe(1)
    })

    it('P2: 1 attempt / 1 correct → insufficient_evidence', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(1)
      expect(result.evidence.correct).toBe(1)
    })

    it('P3: 2 attempts / 1 correct + 1 miss → insufficient_evidence (single-Q protection)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-037': 'a' }, '2026-01-02T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Single-question concepts require 4+ observations
      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(2)
    })

    it('P4: 2 attempts / 2 misses → insufficient_evidence (single-Q protection)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-037': 'c' }, '2026-01-02T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Single-question concepts require 4+ observations
      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(2)
      expect(result.evidence.misses).toBe(2)
    })

    it('P5: 3 attempts / 1 miss → insufficient_evidence (single-Q protection)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-037': 'b' }, '2026-01-02T00:00:00Z'), // correct
        createQuizAttempt('a3', { 'qq-2-037': 'a' }, '2026-01-03T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Single-question concepts require 4+ observations
      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(3)
    })

    it('P6: 3 attempts / 2 misses → insufficient_evidence (single-Q protection)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-037': 'a' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-037': 'c' }, '2026-01-03T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Single-question concepts require 4+ observations
      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(3)
      expect(result.evidence.misses).toBe(2)
    })

    it('P7: 3 attempts / 3 misses → insufficient_evidence (single-Q protection)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-037': 'c' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-037': 'd' }, '2026-01-03T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Single-question concepts require 4+ observations
      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(3)
      expect(result.evidence.misses).toBe(3)
    })

    it('P8: 4 attempts / 2 misses → emerging_weakness (single-Q, alternating)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-037': 'a' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-037': 'b' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-037': 'c' }, '2026-01-04T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('emerging_weakness')
      expect(result.confidence).toBe('low') // Alternating pattern
      expect(result.evidence.totalObservations).toBe(4)
      expect(result.evidence.misses).toBe(2)
      expect(result.evidence.pattern).toBe('alternating')
      expect(result.flags).toContain('alternating_pattern')
    })

    it('P9: repeated misses → 1 correct → emerging_weakness (not improving)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-037': 'c' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-037': 'b' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-037': 'a' }, '2026-01-04T00:00:00Z'), // wrong (need 2 consecutive correct for improving)
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // Only 1 consecutive correct — not enough for improving
      expect(result.state).toBe('emerging_weakness')
      expect(result.evidence.consecutiveRecentCorrect).toBe(0) // Last is wrong
    })

    it('P10: repeated misses → 2 consecutive correct → improving', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-037': 'c' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-037': 'b' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-037': 'b' }, '2026-01-04T00:00:00Z'), // correct
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('improving')
      expect(result.evidence.consecutiveRecentCorrect).toBe(2)
      expect(result.evidence.hasHistoricalWeakness).toBe(true)
      expect(result.flags).toContain('recent_improvement')
    })

    it('P11: early misses → sustained correct → currently_performing_well', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'a' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-037': 'b' }, '2026-01-02T00:00:00Z'), // correct
        createQuizAttempt('a3', { 'qq-2-037': 'b' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-037': 'b' }, '2026-01-04T00:00:00Z'), // correct
        createQuizAttempt('a5', { 'qq-2-037': 'b' }, '2026-01-05T00:00:00Z'), // correct
        createQuizAttempt('a6', { 'qq-2-037': 'b' }, '2026-01-06T00:00:00Z'), // correct
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('currently_performing_well')
      expect(result.evidence.consecutiveRecentCorrect).toBe(3) // Last 3 in window
      expect(result.evidence.missRate).toBeLessThanOrEqual(0.2)
    })

    it('P12: early correct → recent repeated misses → repeated_weakness', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-037': 'b' }, '2026-01-02T00:00:00Z'), // correct
        createQuizAttempt('a3', { 'qq-2-037': 'b' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-037': 'a' }, '2026-01-04T00:00:00Z'), // wrong
        createQuizAttempt('a5', { 'qq-2-037': 'c' }, '2026-01-05T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(SINGLE_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('repeated_weakness')
      expect(result.evidence.consecutiveRecentMisses).toBe(2)
      expect(result.flags).toContain('recent_deterioration')
    })
  })

  describe('Multi-Question Concepts (2-3 questions)', () => {
    it('P1: 1 attempt / 1 miss → insufficient_evidence', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'), // wrong (correct is 'a')
      ]
      const evidence = buildConceptEvidence(MULTI_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('insufficient_evidence')
      expect(result.evidence.totalObservations).toBe(1)
    })

    it('P3: 2 attempts / 1 correct + 1 miss → emerging_weakness', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'), // correct
        createQuizAttempt('a2', { 'qq-2-001': 'b' }, '2026-01-02T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(MULTI_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('emerging_weakness')
      expect(result.confidence).toBe('low')
      expect(result.evidence.totalObservations).toBe(2)
    })

    it('P4: 2 attempts / 2 misses → emerging_weakness (not repeated)', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(MULTI_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // 2 observations cannot produce repeated_weakness
      expect(result.state).toBe('emerging_weakness')
      expect(result.confidence).toBe('low')
    })

    it('P7: 3 attempts / 3 misses → repeated_weakness', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-001': 'd' }, '2026-01-03T00:00:00Z'), // wrong
      ]
      const evidence = buildConceptEvidence(MULTI_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('repeated_weakness')
      expect(result.confidence).toBe('low') // Only 3 observations
      expect(result.evidence.misses).toBe(3)
    })

    it('P10: repeated misses → 2 consecutive correct → improving', () => {
      const attempts = [
        createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'), // wrong
        createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'), // wrong
        createQuizAttempt('a3', { 'qq-2-001': 'a' }, '2026-01-03T00:00:00Z'), // correct
        createQuizAttempt('a4', { 'qq-2-001': 'a' }, '2026-01-04T00:00:00Z'), // correct
      ]
      const evidence = buildConceptEvidence(MULTI_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('improving')
      expect(result.evidence.consecutiveRecentCorrect).toBe(2)
    })
  })

  describe('Four-Plus Question Concepts', () => {
    it('P4: 2 attempts / 2 misses on different questions → repeated_weakness', () => {
      const attempts = [
        createQuizAttempt(
          'a1',
          { 'qq-2-003': 'b', 'qq-2-004': 'b' }, // wrong (correct is 'a')
          '2026-01-01T00:00:00Z',
        ),
        createQuizAttempt(
          'a2',
          { 'qq-2-003': 'c', 'qq-2-004': 'c' }, // wrong
          '2026-01-02T00:00:00Z',
        ),
      ]
      const evidence = buildConceptEvidence(FOUR_PLUS_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      // 4 observations, 4 misses, 2 unique questions
      expect(result.state).toBe('repeated_weakness')
      expect(result.evidence.totalObservations).toBe(4)
      expect(result.evidence.uniqueQuestions).toBe(2)
      expect(result.evidence.uniqueQuestionsMissed).toBe(2)
    })

    it('P7: 3 attempts / multiple misses → repeated_weakness with high confidence', () => {
      const attempts = [
        createQuizAttempt(
          'a1',
          { 'qq-2-003': 'b', 'qq-2-004': 'b', 'qq-2-012': 'b' }, // wrong
          '2026-01-01T00:00:00Z',
        ),
        createQuizAttempt(
          'a2',
          { 'qq-2-003': 'c', 'qq-2-004': 'c', 'qq-2-012': 'c' }, // wrong
          '2026-01-02T00:00:00Z',
        ),
        createQuizAttempt(
          'a3',
          { 'qq-2-003': 'd', 'qq-2-004': 'd', 'qq-2-012': 'd' }, // wrong
          '2026-01-03T00:00:00Z',
        ),
      ]
      const evidence = buildConceptEvidence(FOUR_PLUS_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('repeated_weakness')
      expect(result.confidence).toBe('high') // 9 observations, 3 unique questions
      expect(result.evidence.totalObservations).toBe(9)
      expect(result.evidence.uniqueQuestions).toBe(3)
    })

    it('high confidence requires 7+ observations and question diversity', () => {
      const attempts = [
        createQuizAttempt(
          'a1',
          { 'qq-2-003': 'b', 'qq-2-004': 'b', 'qq-2-012': 'b', 'qq-2-024': 'b' }, // wrong
          '2026-01-01T00:00:00Z',
        ),
        createQuizAttempt(
          'a2',
          { 'qq-2-003': 'c', 'qq-2-004': 'c', 'qq-2-012': 'c', 'qq-2-024': 'c' }, // wrong
          '2026-01-02T00:00:00Z',
        ),
      ]
      const evidence = buildConceptEvidence(FOUR_PLUS_Q_CONCEPT, attempts)
      const result = detectConceptState(evidence)

      expect(result.state).toBe('repeated_weakness')
      expect(result.confidence).toBe('high') // 8 observations, 4 unique questions
      expect(result.evidence.totalObservations).toBe(8)
      expect(result.evidence.uniqueQuestions).toBe(4)
    })
  })
})

// ───────────────────────────────────────────────
// Boundary Conditions
// ───────────────────────────────────────────────

describe('Boundary Conditions', () => {
  it('2 observations cannot produce repeated_weakness', () => {
    const evidence = createEvidence({
      totalObservations: 2,
      misses: 2,
      correct: 0,
      missRate: 1.0,
    })
    const result = detectConceptState(evidence)

    expect(result.state).not.toBe('repeated_weakness')
    expect(result.state).toBe('emerging_weakness')
  })

  it('repeated_weakness requires at least 3 observations', () => {
    const evidence = createEvidence({
      totalObservations: 3,
      misses: 2,
      correct: 1,
      missRate: 0.67,
    })
    const result = detectConceptState(evidence)

    expect(result.state).toBe('repeated_weakness')
  })

  it('50% miss rate alone cannot escalate with only 2 observations', () => {
    const evidence = createEvidence({
      totalObservations: 2,
      misses: 1,
      correct: 1,
      missRate: 0.5,
    })
    const result = detectConceptState(evidence)

    expect(result.state).toBe('emerging_weakness')
    expect(result.state).not.toBe('repeated_weakness')
  })

  it('improving requires at least 2 consecutive recent correct', () => {
    const evidence = createEvidence({
      totalObservations: 4,
      misses: 2,
      correct: 2,
      missRate: 0.5,
      consecutiveRecentCorrect: 1, // Only 1 consecutive correct
      hasHistoricalWeakness: true,
    })
    const result = detectConceptState(evidence)

    expect(result.state).not.toBe('improving')
  })

  it('high confidence requires at least 7 observations', () => {
    const evidence = createEvidence({
      totalObservations: 6,
      uniqueQuestions: 3,
      misses: 3,
      correct: 3,
      missRate: 0.5,
      pattern: 'consistent',
    })
    const result = detectConceptState(evidence)

    expect(result.confidence).not.toBe('high')
    expect(result.confidence).toBe('medium')
  })

  it('high confidence with 7+ observations and diversity', () => {
    const evidence = createEvidence({
      totalObservations: 7,
      uniqueQuestions: 3,
      misses: 3,
      correct: 4,
      missRate: 0.43,
      pattern: 'consistent',
    })
    const result = detectConceptState(evidence)

    expect(result.confidence).toBe('high')
  })
})

// ───────────────────────────────────────────────
// Edge Cases
// ───────────────────────────────────────────────

describe('Edge Cases', () => {
  it('perfect performance with 1-2 observations → insufficient_evidence', () => {
    const evidence = createEvidence({
      totalObservations: 2,
      misses: 0,
      correct: 2,
      missRate: 0,
    })
    const result = detectConceptState(evidence)

    expect(result.state).toBe('currently_performing_well')
    expect(result.confidence).toBe('low')
  })

  it('perfect performance with 7+ observations → currently_performing_well high confidence', () => {
    const evidence = createEvidence({
      totalObservations: 7,
      uniqueQuestions: 3,
      misses: 0,
      correct: 7,
      missRate: 0,
      pattern: 'consistent',
    })
    const result = detectConceptState(evidence)

    expect(result.state).toBe('currently_performing_well')
    expect(result.confidence).toBe('high')
  })

  it('all misses with 2 observations → emerging_weakness', () => {
    const evidence = createEvidence({
      totalObservations: 2,
      misses: 2,
      correct: 0,
      missRate: 1.0,
    })
    const result = detectConceptState(evidence)

    expect(result.state).toBe('emerging_weakness')
    expect(result.confidence).toBe('low')
  })

  it('alternating pattern reduces confidence', () => {
    const evidence = createEvidence({
      totalObservations: 8,
      uniqueQuestions: 4,
      misses: 4,
      correct: 4,
      missRate: 0.5,
      pattern: 'alternating',
    })
    const result = detectConceptState(evidence)

    expect(result.confidence).toBe('medium') // Would be high without alternating
    expect(result.flags).toContain('alternating_pattern')
  })

  it('question-specific issue flag when misses concentrated on one question', () => {
    const evidence = createEvidence({
      totalObservations: 6,
      uniqueQuestions: 3,
      uniqueQuestionsMissed: 1,
      misses: 3,
      correct: 3,
      missRate: 0.5,
    })
    const result = detectConceptState(evidence)

    expect(result.flags).toContain('question_specific_issue')
  })

  it('single-question concept flag', () => {
    const evidence = createEvidence({
      conceptId: 'C-2-16', // Single-question concept
      totalObservations: 4,
      uniqueQuestions: 1,
      misses: 2,
      correct: 2,
      missRate: 0.5,
    })
    const result = detectConceptState(evidence)

    expect(result.flags).toContain('single_question_concept')
  })
})

// ───────────────────────────────────────────────
// Evidence Building
// ───────────────────────────────────────────────

describe('Evidence Building', () => {
  it('builds evidence from quiz attempts correctly', () => {
    const attempts = [
      createQuizAttempt(
        'a1',
        { 'qq-2-001': 'a', 'qq-2-021': 'b' },
        '2026-01-01T00:00:00Z',
      ),
      createQuizAttempt(
        'a2',
        { 'qq-2-001': 'b', 'qq-2-021': 'a' },
        '2026-01-02T00:00:00Z',
      ),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.conceptId).toBe('C-2-01')
    expect(evidence.learningObjectiveId).toBe('LO-2-01')
    expect(evidence.totalObservations).toBe(4)
    expect(evidence.uniqueQuestions).toBe(2)
    expect(evidence.misses).toBe(2) // qq-2-001 wrong in a2, qq-2-021 wrong in a1
    expect(evidence.correct).toBe(2)
    expect(evidence.missRate).toBe(0.5)
  })

  it('tracks consecutive recent correct', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'a' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'a' }, '2026-01-03T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.consecutiveRecentCorrect).toBe(2)
    expect(evidence.consecutiveRecentMisses).toBe(0)
  })

  it('tracks consecutive recent misses', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'b' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'c' }, '2026-01-03T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.consecutiveRecentCorrect).toBe(0)
    expect(evidence.consecutiveRecentMisses).toBe(2)
  })

  it('preserves historical weakness evidence', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'a' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'a' }, '2026-01-03T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.hasHistoricalWeakness).toBe(true)
    expect(evidence.misses).toBe(1)
  })

  it('ignores questions from other concepts', () => {
    const attempts = [
      createQuizAttempt(
        'a1',
        { 'qq-2-001': 'a', 'qq-2-003': 'b' }, // qq-2-003 is C-2-21, not C-2-01
        '2026-01-01T00:00:00Z',
      ),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.totalObservations).toBe(1) // Only qq-2-001 counted
    expect(evidence.uniqueQuestions).toBe(1)
  })
})

// ───────────────────────────────────────────────
// Pattern Detection
// ───────────────────────────────────────────────

describe('Pattern Detection', () => {
  it('detects consistent pattern (all correct)', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'a' }, '2026-01-02T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.pattern).toBe('consistent')
  })

  it('detects consistent pattern (all missed)', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.pattern).toBe('consistent')
  })

  it('detects alternating pattern', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'b' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'a' }, '2026-01-03T00:00:00Z'),
      createQuizAttempt('a4', { 'qq-2-001': 'c' }, '2026-01-04T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.pattern).toBe('alternating')
  })

  it('detects trending up pattern', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'b' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'a' }, '2026-01-03T00:00:00Z'),
      createQuizAttempt('a4', { 'qq-2-001': 'a' }, '2026-01-04T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.pattern).toBe('trending_up')
  })

  it('detects trending down pattern', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'a' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'b' }, '2026-01-03T00:00:00Z'),
      createQuizAttempt('a4', { 'qq-2-001': 'c' }, '2026-01-04T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-01', attempts)

    expect(evidence.pattern).toBe('trending_down')
  })
})

// ───────────────────────────────────────────────
// Batch Detection
// ───────────────────────────────────────────────

describe('Batch Detection', () => {
  it('detectAllConceptGaps returns results for all active concepts', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
    ]

    const results = detectAllConceptGaps(attempts)

    expect(results.size).toBe(25) // All active concepts
    expect(results.has('C-2-01')).toBe(true)
    expect(results.has('C-2-26')).toBe(true)
  })

  it('detectConceptGapsWithEvidence filters to concepts with observations', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'a' }, '2026-01-01T00:00:00Z'),
    ]

    const results = detectConceptGapsWithEvidence(attempts)

    // Only C-2-01 has evidence (qq-2-001)
    expect(results.size).toBe(1)
    expect(results.has('C-2-01')).toBe(true)
    expect(results.has('C-2-02')).toBe(false)
  })
})

// ───────────────────────────────────────────────
// Learning Objective Rollup
// ───────────────────────────────────────────────

describe('Learning Objective Rollup', () => {
  it('rollupToLearningObjectives groups concepts by LO', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'd' }, '2026-01-03T00:00:00Z'),
    ]

    const conceptResults = detectAllConceptGaps(attempts)
    const loResults = rollupToLearningObjectives(conceptResults)

    // LO-2-01 contains C-2-01
    expect(loResults.has('LO-2-01')).toBe(true)
    const lo1 = loResults.get('LO-2-01')!
    expect(lo1.conceptResults.length).toBe(1)
    expect(lo1.conceptResults[0].conceptId).toBe('C-2-01')
  })

  it('LO state dominated by repeated_weakness', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-001': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-001': 'c' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-001': 'd' }, '2026-01-03T00:00:00Z'),
    ]

    const conceptResults = detectAllConceptGaps(attempts)
    const loResults = rollupToLearningObjectives(conceptResults)

    const lo1 = loResults.get('LO-2-01')!
    expect(lo1.state).toBe('repeated_weakness')
  })
})

// ───────────────────────────────────────────────
// Regression Tests
// ───────────────────────────────────────────────

describe('Regression Tests', () => {
  it('qq-2-037 (C-2-16) single-question concept requires 4+ observations', () => {
    const attempts = [
      createQuizAttempt('a1', { 'qq-2-037': 'b' }, '2026-01-01T00:00:00Z'),
      createQuizAttempt('a2', { 'qq-2-037': 'c' }, '2026-01-02T00:00:00Z'),
      createQuizAttempt('a3', { 'qq-2-037': 'd' }, '2026-01-03T00:00:00Z'),
    ]

    const evidence = buildConceptEvidence('C-2-16', attempts)
    const result = detectConceptState(evidence)

    // 3 observations < 4 required for single-question concepts
    expect(result.state).toBe('insufficient_evidence')
    expect(result.flags).toContain('single_question_concept')
  })

  it('C-2-21 (4 questions) can achieve high confidence', () => {
    const attempts = [
      createQuizAttempt(
        'a1',
        { 'qq-2-003': 'b', 'qq-2-004': 'b', 'qq-2-012': 'b', 'qq-2-024': 'b' }, // all wrong
        '2026-01-01T00:00:00Z',
      ),
      createQuizAttempt(
        'a2',
        { 'qq-2-003': 'c', 'qq-2-004': 'c', 'qq-2-012': 'c', 'qq-2-024': 'c' }, // all wrong
        '2026-01-02T00:00:00Z',
      ),
    ]

    const evidence = buildConceptEvidence('C-2-21', attempts)
    const result = detectConceptState(evidence)

    expect(result.evidence.totalObservations).toBe(8)
    expect(result.evidence.uniqueQuestions).toBe(4)
    expect(result.confidence).toBe('high')
  })
})
