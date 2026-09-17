/**
 * Chapter 4 Concept-Level Detection Tests (C4-2)
 *
 * Replicates the established Phase 6B-3 detection semantics against the
 * locked Chapter 4 assets: six concept families (each rolling up to its
 * audited primary learning objective) and the canonical 30-question bank
 * (locked distribution 5/6/5/5/4/5).
 *
 * Answer keys are derived from the canonical bank at runtime — these tests
 * never restate question answers or mappings.
 */

import { describe, it, expect } from 'vitest'
import {
  buildConceptEvidence,
  detectConceptState,
  detectAllConceptGaps,
  detectConceptGapsWithEvidence,
  rollupToLearningObjectives,
} from './detection'
import { chapter4PremiumQuizQuestions } from '../chapter-4-premium-quiz'
import { chapter4QuizQuestionConceptMappings } from './mappings'
import type { Chapter4ConceptFamilyId } from './types'
import type { QuizAttempt } from '@/types'

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────

const answerById = new Map(
  chapter4PremiumQuizQuestions.map((q) => [q.id, q.correct_answer]),
)

function correctAnswer(questionId: string): string {
  const a = answerById.get(questionId)
  if (!a) throw new Error(`Test setup: unknown question ${questionId}`)
  return a
}

function wrongAnswer(questionId: string): string {
  return correctAnswer(questionId) === 'a' ? 'b' : 'a'
}

/** Build an answers_json record from { questionId: 'C' | 'M' } outcomes. */
function makeAnswers(spec: Record<string, 'C' | 'M'>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [questionId, result] of Object.entries(spec)) {
    out[questionId] = result === 'C' ? correctAnswer(questionId) : wrongAnswer(questionId)
  }
  return out
}

let attemptCounter = 0
function makeAttempt(
  answers: Record<string, string>,
  completedAt: string,
): QuizAttempt {
  return {
    id: `att-ch4-${++attemptCounter}`,
    user_id: 'student-1',
    quiz_id: 'quiz-4',
    score: 0,
    total_questions: 30,
    percentage: 0,
    answers_json: answers,
    completed_at: completedAt,
  }
}

/** Day-indexed timestamps so attempt ordering is explicit. */
function ts(day: number): string {
  return `2026-09-${String(day).padStart(2, '0')}T12:00:00.000Z`
}

// Disinfection & Sterilization (primary LO-4-04) — 6 mapped questions: qq-4-006..011
const DISINF = 'ch4-disinfection-sterilization' as Chapter4ConceptFamilyId
const DQ = {
  q1: 'qq-4-006',
  q2: 'qq-4-007',
  q3: 'qq-4-008',
  q4: 'qq-4-009',
  q5: 'qq-4-010',
  q6: 'qq-4-011',
} as const

// Pathogens & Transmission (primary LO-4-02) — 5 mapped questions: qq-4-001..005
const PATHO = 'ch4-pathogens-transmission' as Chapter4ConceptFamilyId
const PQ = { q1: 'qq-4-001', q2: 'qq-4-002', q3: 'qq-4-003', q4: 'qq-4-004' } as const

// ───────────────────────────────────────────────
// Binding completeness
// ───────────────────────────────────────────────

describe('Chapter 4 detection binding', () => {
  it('wires all 30 canonical questions and all 6 locked families', () => {
    // Structural guard: the binding consumes the canonical assets wholesale.
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4QuizQuestionConceptMappings).toHaveLength(30)
    expect(answerById.size).toBe(30)
    const families = new Set(
      chapter4QuizQuestionConceptMappings.map((m) => m.conceptFamilyId),
    )
    expect(families).toEqual(
      new Set([
        'ch4-pathogens-transmission',
        'ch4-disinfection-sterilization',
        'ch4-cross-contamination',
        'ch4-blood-exposure-ppe',
        'ch4-regulatory-chemical-safety',
        'ch4-safe-practice-compliance',
      ]),
    )
    // Every mapped question resolves to a correct answer in the bank.
    for (const m of chapter4QuizQuestionConceptMappings) {
      expect(answerById.has(m.questionId), m.questionId).toBe(true)
    }
  })
})

// ───────────────────────────────────────────────
// Evidence building
// ───────────────────────────────────────────────

describe('buildConceptEvidence (Chapter 4)', () => {
  it('counts only questions mapped to the requested family', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C', [PQ.q1]: 'M', [PQ.q2]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
    ]
    const evidence = buildConceptEvidence(DISINF, attempts)
    expect(evidence.conceptId).toBe(DISINF)
    expect(evidence.learningObjectiveId).toBe('LO-4-04')
    expect(evidence.totalObservations).toBe(2)
    expect(evidence.correct).toBe(1)
    expect(evidence.misses).toBe(1)
    expect(evidence.uniqueQuestions).toBe(2)
    expect(evidence.uniqueQuestionsMissed).toBe(1)
    expect(evidence.missRate).toBe(0.5)
    expect(evidence.hasHistoricalWeakness).toBe(true)
    expect(evidence.firstAttemptAt).toBe(ts(1))
    expect(evidence.lastAttemptAt).toBe(ts(2))
  })

  it('ignores unknown and foreign-chapter question IDs', () => {
    const attempts = [
      makeAttempt(
        { 'qq-4-999': 'a', 'qq-3-001': 'b', [DQ.q1]: correctAnswer(DQ.q1) },
        ts(1),
      ),
    ]
    const evidence = buildConceptEvidence(DISINF, attempts)
    expect(evidence.totalObservations).toBe(1)
  })

  it('orders evidence by completed_at, not array order', () => {
    const later = makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(5))
    const earlier = makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(2))
    const evidence = buildConceptEvidence(DISINF, [later, earlier])
    expect(evidence.firstAttemptAt).toBe(ts(2))
    expect(evidence.lastAttemptAt).toBe(ts(5))
    // Most recent result is a miss → deterioration streak visible.
    expect(evidence.consecutiveRecentMisses).toBe(1)
    expect(evidence.consecutiveRecentCorrect).toBe(0)
  })
})

// ───────────────────────────────────────────────
// State semantics
// ───────────────────────────────────────────────

describe('detectConceptState (Chapter 4) — state machine', () => {
  it('returns insufficient_evidence below the multi-question minimum (1 observation)', () => {
    const attempts = [makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1))]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('insufficient_evidence')
  })

  it('returns currently_performing_well with zero misses and >= 2 observations', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('currently_performing_well')
    expect(result.evidence.misses).toBe(0)
  })

  it('returns emerging_weakness for a single miss below the repeated threshold', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('emerging_weakness')
    expect(result.evidence.misses).toBe(1)
  })

  it('returns repeated_weakness with >= 3 observations and >= 2 misses', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q3]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('repeated_weakness')
    expect(result.evidence.misses).toBe(2)
  })

  it('does not classify an alternating pattern as repeated_weakness', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('emerging_weakness')
    expect(result.evidence.pattern).toBe('alternating')
    expect(result.flags).toContain('alternating_pattern')
    // Alternating pattern reduces confidence.
    expect(result.confidence).toBe('low')
  })

  it('returns improving after historical weakness with >= 2 consecutive recent correct', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('improving')
    expect(result.flags).toContain('recent_improvement')
  })

  it('treats M, M, C, M as emerging (single correct breaks the miss pattern)', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.state).toBe('emerging_weakness')
  })
})

// ───────────────────────────────────────────────
// Confidence semantics
// ───────────────────────────────────────────────

describe('detectConceptState (Chapter 4) — confidence', () => {
  it('low confidence below 4 observations', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q3]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.confidence).toBe('low')
  })

  it('medium confidence at 4–6 observations with question diversity', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.confidence).toBe('medium')
  })

  it('high confidence at >= 7 observations across >= 3 unique questions', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C', [DQ.q2]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q3]: 'C', [DQ.q1]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C', [DQ.q3]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(4)),
    ]
    const evidence = buildConceptEvidence(DISINF, attempts)
    expect(evidence.totalObservations).toBe(7)
    expect(evidence.uniqueQuestions).toBe(3)
    const result = detectConceptState(evidence)
    expect(result.confidence).toBe('high')
  })

  it('caps at medium when high-observation evidence lacks question diversity', () => {
    // 7 observations but only 2 unique questions.
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C', [DQ.q2]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C', [DQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C', [DQ.q2]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(4)),
    ]
    const evidence = buildConceptEvidence(DISINF, attempts)
    expect(evidence.totalObservations).toBe(7)
    expect(evidence.uniqueQuestions).toBe(2)
    const result = detectConceptState(evidence)
    expect(result.confidence).toBe('medium')
  })
})

// ───────────────────────────────────────────────
// Flags
// ───────────────────────────────────────────────

describe('detectConceptState (Chapter 4) — flags', () => {
  it('flags recent_deterioration on >= 2 consecutive recent misses', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(3)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.flags).toContain('recent_deterioration')
  })

  it('flags low_unique_question_diversity when a multi-question family sees only one question', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'C' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.flags).toContain('low_unique_question_diversity')
    expect(result.flags).not.toContain('single_question_concept')
  })

  it('flags question_specific_issue when >= 3 misses concentrate on one question', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q1]: 'M', [DQ.q2]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(DISINF, attempts))
    expect(result.flags).toContain('question_specific_issue')
  })
})

// ───────────────────────────────────────────────
// Batch detection, attribution, and rollup
// ───────────────────────────────────────────────

describe('detectAllConceptGaps (Chapter 4)', () => {
  it('covers exactly the six locked families with correct per-family attribution', () => {
    const attempts = [
      // Disinfection: repeated weakness (3 obs, 2 misses, non-alternating).
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q3]: 'C' }), ts(3)),
      // Pathogens: clean performance.
      makeAttempt(makeAnswers({ [PQ.q1]: 'C', [PQ.q2]: 'C' }), ts(4)),
    ]
    const results = detectAllConceptGaps(attempts)

    expect([...results.keys()].sort()).toEqual([
      'ch4-blood-exposure-ppe',
      'ch4-cross-contamination',
      'ch4-disinfection-sterilization',
      'ch4-pathogens-transmission',
      'ch4-regulatory-chemical-safety',
      'ch4-safe-practice-compliance',
    ])

    const disinf = results.get(DISINF)!
    expect(disinf.state).toBe('repeated_weakness')
    expect(disinf.learningObjectiveId).toBe('LO-4-04')
    expect(disinf.evidence.totalObservations).toBe(3)

    const patho = results.get(PATHO)!
    expect(patho.state).toBe('currently_performing_well')
    expect(patho.learningObjectiveId).toBe('LO-4-02')
    // Attribution: the disinfection misses never leak into this family.
    expect(patho.evidence.misses).toBe(0)

    // Untouched families report insufficient evidence with zero observations.
    expect(results.get('ch4-cross-contamination')!.state).toBe('insufficient_evidence')
    expect(results.get('ch4-cross-contamination')!.evidence.totalObservations).toBe(0)
    expect(results.get('ch4-blood-exposure-ppe')!.state).toBe('insufficient_evidence')
    expect(results.get('ch4-regulatory-chemical-safety')!.state).toBe('insufficient_evidence')
    expect(results.get('ch4-safe-practice-compliance')!.state).toBe('insufficient_evidence')
  })

  it('detectConceptGapsWithEvidence filters zero-observation families', () => {
    const attempts = [makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1))]
    const results = detectConceptGapsWithEvidence(attempts)
    expect(results.size).toBe(1)
    expect(results.has(DISINF)).toBe(true)
  })
})

describe('rollupToLearningObjectives (Chapter 4)', () => {
  it('rolls each family up to its audited primary learning objective', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [DQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [DQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [DQ.q3]: 'C' }), ts(3)),
    ]
    const rollup = rollupToLearningObjectives(detectAllConceptGaps(attempts))

    const lo4 = rollup.get('LO-4-04')!
    expect(lo4).toBeDefined()
    expect(lo4.state).toBe('repeated_weakness')
    expect(lo4.conceptResults).toHaveLength(1)
    expect(lo4.conceptResults[0].conceptId).toBe(DISINF)
  })
})
