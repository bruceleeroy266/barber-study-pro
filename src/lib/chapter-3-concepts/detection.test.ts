/**
 * Chapter 3 Concept-Level Detection Tests (C3-2)
 *
 * Replicates the established Phase 6B-3 detection semantics against the
 * locked Chapter 3 assets: four concept families (1:1 with LO-3-01..04)
 * and the canonical 30-question bank (8/7/8/7).
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
import { chapter3PremiumQuizQuestions } from '../chapter-3-premium-quiz'
import { chapter3QuizQuestionConceptMappings } from './mappings'
import type { Chapter3ConceptFamilyId } from './types'
import type { QuizAttempt } from '@/types'

// ───────────────────────────────────────────────
// Helpers
// ───────────────────────────────────────────────

const answerById = new Map(
  chapter3PremiumQuizQuestions.map((q) => [q.id, q.correct_answer]),
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
    id: `att-ch3-${++attemptCounter}`,
    user_id: 'student-1',
    quiz_id: 'quiz-3',
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

// Ergonomics (LO3) — 8 mapped questions: qq-3-014, qq-3-028, qq-3-037..042
const ERGO = 'ch3-ergonomics' as Chapter3ConceptFamilyId
const EQ = {
  q1: 'qq-3-014',
  q2: 'qq-3-028',
  q3: 'qq-3-037',
  q4: 'qq-3-038',
  q5: 'qq-3-039',
  q6: 'qq-3-040',
  q7: 'qq-3-041',
  q8: 'qq-3-042',
} as const

// Healthful habits (LO1) — 8 mapped questions: qq-3-001, qq-3-002, qq-3-004, qq-3-031..035
const HABITS = 'ch3-healthful-habits' as Chapter3ConceptFamilyId
const HQ = { q1: 'qq-3-001', q2: 'qq-3-002', q3: 'qq-3-004', q4: 'qq-3-031' } as const

// ───────────────────────────────────────────────
// Binding completeness
// ───────────────────────────────────────────────

describe('Chapter 3 detection binding', () => {
  it('wires all 30 canonical questions and all 4 locked families', () => {
    // Structural guard: the binding consumes the canonical assets wholesale.
    expect(chapter3PremiumQuizQuestions).toHaveLength(30)
    expect(chapter3QuizQuestionConceptMappings).toHaveLength(30)
    expect(answerById.size).toBe(30)
    const families = new Set(
      chapter3QuizQuestionConceptMappings.map((m) => m.conceptFamilyId),
    )
    expect(families).toEqual(
      new Set([
        'ch3-healthful-habits',
        'ch3-professional-image',
        'ch3-ergonomics',
        'ch3-human-relations',
      ]),
    )
    // Every mapped question resolves to a correct answer in the bank.
    for (const m of chapter3QuizQuestionConceptMappings) {
      expect(answerById.has(m.questionId), m.questionId).toBe(true)
    }
  })
})

// ───────────────────────────────────────────────
// Evidence building
// ───────────────────────────────────────────────

describe('buildConceptEvidence (Chapter 3)', () => {
  it('counts only questions mapped to the requested family', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C', [HQ.q1]: 'M', [HQ.q2]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
    ]
    const evidence = buildConceptEvidence(ERGO, attempts)
    expect(evidence.conceptId).toBe(ERGO)
    expect(evidence.learningObjectiveId).toBe('LO-3-03')
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
        { 'qq-3-999': 'a', 'qq-2-001': 'b', [EQ.q1]: correctAnswer(EQ.q1) },
        ts(1),
      ),
    ]
    const evidence = buildConceptEvidence(ERGO, attempts)
    expect(evidence.totalObservations).toBe(1)
  })

  it('orders evidence by completed_at, not array order', () => {
    const later = makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(5))
    const earlier = makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(2))
    const evidence = buildConceptEvidence(ERGO, [later, earlier])
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

describe('detectConceptState (Chapter 3) — state machine', () => {
  it('returns insufficient_evidence below the multi-question minimum (1 observation)', () => {
    const attempts = [makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1))]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('insufficient_evidence')
  })

  it('returns currently_performing_well with zero misses and >= 2 observations', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('currently_performing_well')
    expect(result.evidence.misses).toBe(0)
  })

  it('returns emerging_weakness for a single miss below the repeated threshold', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('emerging_weakness')
    expect(result.evidence.misses).toBe(1)
  })

  it('returns repeated_weakness with >= 3 observations and >= 2 misses', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q3]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('repeated_weakness')
    expect(result.evidence.misses).toBe(2)
  })

  it('does not classify an alternating pattern as repeated_weakness', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('emerging_weakness')
    expect(result.evidence.pattern).toBe('alternating')
    expect(result.flags).toContain('alternating_pattern')
    // Alternating pattern reduces confidence.
    expect(result.confidence).toBe('low')
  })

  it('returns improving after historical weakness with >= 2 consecutive recent correct', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('improving')
    expect(result.flags).toContain('recent_improvement')
  })

  it('treats M, M, C, M as emerging (single correct breaks the miss pattern)', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.state).toBe('emerging_weakness')
  })
})

// ───────────────────────────────────────────────
// Confidence semantics
// ───────────────────────────────────────────────

describe('detectConceptState (Chapter 3) — confidence', () => {
  it('low confidence below 4 observations', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q3]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.confidence).toBe('low')
  })

  it('medium confidence at 4–6 observations with question diversity', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.confidence).toBe('medium')
  })

  it('high confidence at >= 7 observations across >= 3 unique questions', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C', [EQ.q2]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q3]: 'C', [EQ.q1]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C', [EQ.q3]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(4)),
    ]
    const evidence = buildConceptEvidence(ERGO, attempts)
    expect(evidence.totalObservations).toBe(7)
    expect(evidence.uniqueQuestions).toBe(3)
    const result = detectConceptState(evidence)
    expect(result.confidence).toBe('high')
  })

  it('caps at medium when high-observation evidence lacks question diversity', () => {
    // 7 observations but only 2 unique questions.
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C', [EQ.q2]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C', [EQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C', [EQ.q2]: 'C' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(4)),
    ]
    const evidence = buildConceptEvidence(ERGO, attempts)
    expect(evidence.totalObservations).toBe(7)
    expect(evidence.uniqueQuestions).toBe(2)
    const result = detectConceptState(evidence)
    expect(result.confidence).toBe('medium')
  })
})

// ───────────────────────────────────────────────
// Flags
// ───────────────────────────────────────────────

describe('detectConceptState (Chapter 3) — flags', () => {
  it('flags recent_deterioration on >= 2 consecutive recent misses', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'C' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(3)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(4)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.flags).toContain('recent_deterioration')
  })

  it('flags low_unique_question_diversity when a multi-question family sees only one question', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'C' }), ts(2)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.flags).toContain('low_unique_question_diversity')
    expect(result.flags).not.toContain('single_question_concept')
  })

  it('flags question_specific_issue when >= 3 misses concentrate on one question', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q1]: 'M', [EQ.q2]: 'C' }), ts(3)),
    ]
    const result = detectConceptState(buildConceptEvidence(ERGO, attempts))
    expect(result.flags).toContain('question_specific_issue')
  })
})

// ───────────────────────────────────────────────
// Batch detection, attribution, and rollup
// ───────────────────────────────────────────────

describe('detectAllConceptGaps (Chapter 3)', () => {
  it('covers exactly the four locked families with correct per-family attribution', () => {
    const attempts = [
      // Ergonomics: repeated weakness (3 obs, 2 misses, non-alternating).
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q3]: 'C' }), ts(3)),
      // Healthful habits: clean performance.
      makeAttempt(makeAnswers({ [HQ.q1]: 'C', [HQ.q2]: 'C' }), ts(4)),
    ]
    const results = detectAllConceptGaps(attempts)

    expect([...results.keys()].sort()).toEqual([
      'ch3-ergonomics',
      'ch3-healthful-habits',
      'ch3-human-relations',
      'ch3-professional-image',
    ])

    const ergo = results.get(ERGO)!
    expect(ergo.state).toBe('repeated_weakness')
    expect(ergo.learningObjectiveId).toBe('LO-3-03')
    expect(ergo.evidence.totalObservations).toBe(3)

    const habits = results.get(HABITS)!
    expect(habits.state).toBe('currently_performing_well')
    expect(habits.learningObjectiveId).toBe('LO-3-01')
    // Attribution: the ergonomics misses never leak into this family.
    expect(habits.evidence.misses).toBe(0)

    // Untouched families report insufficient evidence with zero observations.
    expect(results.get('ch3-professional-image')!.state).toBe('insufficient_evidence')
    expect(results.get('ch3-professional-image')!.evidence.totalObservations).toBe(0)
    expect(results.get('ch3-human-relations')!.state).toBe('insufficient_evidence')
  })

  it('detectConceptGapsWithEvidence filters zero-observation families', () => {
    const attempts = [makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1))]
    const results = detectConceptGapsWithEvidence(attempts)
    expect(results.size).toBe(1)
    expect(results.has(ERGO)).toBe(true)
  })
})

describe('rollupToLearningObjectives (Chapter 3)', () => {
  it('rolls each family up to its 1:1 learning objective', () => {
    const attempts = [
      makeAttempt(makeAnswers({ [EQ.q1]: 'M' }), ts(1)),
      makeAttempt(makeAnswers({ [EQ.q2]: 'M' }), ts(2)),
      makeAttempt(makeAnswers({ [EQ.q3]: 'C' }), ts(3)),
    ]
    const rollup = rollupToLearningObjectives(detectAllConceptGaps(attempts))

    const lo3 = rollup.get('LO-3-03')!
    expect(lo3).toBeDefined()
    expect(lo3.state).toBe('repeated_weakness')
    expect(lo3.conceptResults).toHaveLength(1)
    expect(lo3.conceptResults[0].conceptId).toBe(ERGO)

    // Families with no evidence roll up to insufficient_evidence.
    expect(rollup.get('LO-3-01')!.state).toBe('insufficient_evidence')
    expect(rollup.get('LO-3-02')!.state).toBe('insufficient_evidence')
    expect(rollup.get('LO-3-04')!.state).toBe('insufficient_evidence')
  })
})
