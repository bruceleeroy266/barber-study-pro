/**
 * ASCYN PRO — Chapter 2 Reassessment Reserve Tests (Post-Lock Option A)
 *
 * Protects the 25-question reassessment reserve and its integration:
 *   - reserve bank shape (25 questions, unique sequential IDs, valid options)
 *   - reserve answer-position balance (A=7, B=6, C=6, D=6)
 *   - no correct-is-longest giveaway
 *   - exactly one reserve question per active concept (25/25; C-2-22 none)
 *   - combined capacity 73 with combined mapping integrity
 *   - initial quiz serving remains exactly the locked 48
 *   - locked 48 ID set unchanged
 *   - 25/25 unseen capacity through the REAL exclusion engine after a full
 *     initial 48-question attempt, and safe pool exhaustion after the reserve
 *     is also consumed
 *   - reserve answers participate in detection evidence
 */

import { describe, it, expect } from 'vitest'
import { chapter2ReassessmentQuestions } from './chapter-2-reassessment-questions'
import { chapter2PremiumQuizQuestions } from './chapter-2-premium-quiz'
import { chapter2QuizQuestionMappings } from './chapter-2-concepts/mappings'
import {
  ACTIVE_CONCEPT_IDS,
  RETIRED_CONCEPT_IDS,
} from './chapter-2-concepts/concepts'
import { getLocalQuizQuestions } from './local-data'
import { getQuizQuestionById } from './remediation/content-filter'
import { buildConceptEvidence } from './chapter-2-concepts/detection'
import { HistoricalExclusionEngine } from './reassessment/exclusion-engine'
import type { QuizAttempt } from '@/types'

const reserve = chapter2ReassessmentQuestions
const initial = chapter2PremiumQuizQuestions

/** The locked 48 initial IDs — snapshot guard against accidental edits. */
const LOCKED_INITIAL_IDS = [
  ...Array.from({ length: 32 }, (_, i) => `qq-2-${String(i + 1).padStart(3, '0')}`),
  'qq-2-034',
  'qq-2-035',
  ...Array.from({ length: 14 }, (_, i) => `qq-2-${String(i + 37).padStart(3, '0')}`),
]

const reserveById = new Map(reserve.map((q) => [q.id, q]))
const mappingByQuestion = new Map<string, string>(
  chapter2QuizQuestionMappings.map((m) => [m.questionId, m.conceptId]),
)

// ───────────────────────────────────────────────
// Reserve bank shape
// ───────────────────────────────────────────────

describe('Chapter 2 reassessment reserve — bank shape', () => {
  it('contains exactly 25 questions', () => {
    expect(reserve).toHaveLength(25)
  })

  it('uses unique sequential IDs qq-2-051 through qq-2-075 (retired 033/036 untouched)', () => {
    const ids = reserve.map((q) => q.id)
    expect(new Set(ids).size).toBe(25)
    const expected = Array.from(
      { length: 25 },
      (_, i) => `qq-2-${String(i + 51).padStart(3, '0')}`,
    )
    expect([...ids].sort()).toEqual(expected)
    expect(ids).not.toContain('qq-2-033')
    expect(ids).not.toContain('qq-2-036')
  })

  it('every question has 4 distinct options, a valid key, substantive explanation, valid difficulty', () => {
    for (const q of reserve) {
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      expect(new Set(options.map((o) => o.trim().toLowerCase())).size).toBe(4)
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      expect((q.explanation ?? '').trim().length).toBeGreaterThanOrEqual(40)
      expect(q.difficulty).toMatch(/^(easy|medium|hard)$/)
      expect(q.quiz_id).toBe('quiz-2')
    }
  })
})

// ───────────────────────────────────────────────
// Position integrity
// ───────────────────────────────────────────────

describe('Chapter 2 reassessment reserve — position integrity', () => {
  const counts = { a: 0, b: 0, c: 0, d: 0 }
  for (const q of reserve) counts[q.correct_answer as keyof typeof counts] += 1

  it('reserve positions are exactly A=7, B=6, C=6, D=6', () => {
    expect(counts).toEqual({ a: 7, b: 6, c: 6, d: 6 })
  })

  it('combined bank positions are A=19, B=18, C=18, D=18 and blind ceiling stays <80%', () => {
    const combined = { ...counts }
    for (const q of initial) combined[q.correct_answer as keyof typeof combined] += 1
    expect(combined).toEqual({ a: 19, b: 18, c: 18, d: 18 })
    const blindMax = Math.max(...Object.values(combined))
    expect(blindMax / (initial.length + reserve.length)).toBeLessThan(0.8)
  })

  it('no strong correct-is-longest pattern exists in the reserve', () => {
    let uniquelyLongest = 0
    let worstMargin = 0
    for (const q of reserve) {
      const lens: Record<string, number> = {
        a: q.answer_a.length,
        b: q.answer_b.length,
        c: q.answer_c.length,
        d: q.answer_d.length,
      }
      const correctLen = lens[q.correct_answer]
      const distractorMax = Math.max(
        ...Object.entries(lens)
          .filter(([k]) => k !== q.correct_answer)
          .map(([, v]) => v),
      )
      worstMargin = Math.max(worstMargin, correctLen - distractorMax)
      const values = Object.values(lens)
      const max = Math.max(...values)
      if (correctLen === max && values.filter((v) => v === max).length === 1) {
        uniquelyLongest += 1
      }
    }
    expect(uniquelyLongest / reserve.length).toBeLessThanOrEqual(0.5)
    expect(worstMargin).toBeLessThanOrEqual(20)
  })
})

// ───────────────────────────────────────────────
// Concept coverage & combined mapping integrity
// ───────────────────────────────────────────────

describe('Chapter 2 reassessment reserve — concept coverage', () => {
  it('assigns exactly one reserve question to each of the 25 active concepts', () => {
    const concepts = reserve.map((q) => mappingByQuestion.get(q.id))
    for (const q of reserve) {
      expect(concepts, `${q.id} unmapped`).toBeDefined()
    }
    const uniqueConcepts = new Set(concepts)
    expect(uniqueConcepts.size).toBe(25)
    for (const id of ACTIVE_CONCEPT_IDS) {
      expect(uniqueConcepts.has(id)).toBe(true)
    }
  })

  it('assigns zero reserve questions to retired C-2-22', () => {
    for (const q of reserve) {
      expect(mappingByQuestion.get(q.id)).not.toBe('C-2-22')
    }
    for (const id of RETIRED_CONCEPT_IDS) {
      expect(
        chapter2QuizQuestionMappings.filter((m) => m.conceptId === id),
      ).toHaveLength(0)
    }
  })

  it('combined capacity is 73 and every mapping resolves to a real question', () => {
    expect(initial).toHaveLength(48)
    expect(reserve).toHaveLength(25)
    expect(chapter2QuizQuestionMappings).toHaveLength(73)
    const allIds = new Set([...initial, ...reserve].map((q) => q.id))
    for (const m of chapter2QuizQuestionMappings) {
      expect(allIds.has(m.questionId)).toBe(true)
    }
    // No question is double-mapped
    const mappedIds = chapter2QuizQuestionMappings.map((m) => m.questionId)
    expect(new Set(mappedIds).size).toBe(73)
  })
})

// ───────────────────────────────────────────────
// Locked initial bank protection
// ───────────────────────────────────────────────

describe('Chapter 2 reassessment reserve — locked initial bank', () => {
  it('initial bank remains exactly the locked 48 with unchanged ID set', () => {
    expect(initial).toHaveLength(48)
    expect([...initial.map((q) => q.id)].sort()).toEqual(
      [...LOCKED_INITIAL_IDS].sort(),
    )
  })

  it('initial quiz serving returns exactly 48 questions and zero reserve IDs', () => {
    const served = getLocalQuizQuestions('quiz-2')
    expect(served).toHaveLength(48)
    const servedIds = new Set(served.map((q) => q.id))
    for (const q of reserve) {
      expect(servedIds.has(q.id)).toBe(false)
    }
  })
})

// ───────────────────────────────────────────────
// Unseen capacity through the real exclusion engine
// ───────────────────────────────────────────────

function makeAttempt(
  id: string,
  answers: Record<string, string>,
): QuizAttempt {
  return {
    id,
    user_id: 'capacity-test-user',
    quiz_id: 'quiz-2',
    score: 0,
    total_questions: Object.keys(answers).length,
    percentage: 0,
    answers_json: answers,
    completed_at: '2026-09-09T12:00:00Z',
  }
}

const ALL_INITIAL_ANSWERS = Object.fromEntries(
  initial.map((q) => [q.id, q.correct_answer]),
)
const ALL_COMBINED_ANSWERS = Object.fromEntries(
  [...initial, ...reserve].map((q) => [q.id, q.correct_answer]),
)

function makeMockDb(attempts: QuizAttempt[]) {
  const exhaustionCalls: Array<Record<string, unknown>> = []
  return {
    exhaustionCalls,
    async getHistoricalQuizAttempts() {
      return attempts.map((a) => ({
        id: a.id,
        userId: a.user_id,
        quizId: a.quiz_id,
        answersJson: a.answers_json as Record<string, string>,
        completedAt: new Date(a.completed_at),
        isReassessment: false,
        targetConceptId: undefined,
        remediationCycleId: undefined,
      }))
    },
    async getReassessmentQuestionHistory() {
      return [] as Array<Record<string, unknown>>
    },
    async checkAndRecordPoolExhaustion(
      userId: string,
      conceptId: string,
      chapterId: string,
      cycleId: string,
      totalQuestionsInPool: number,
    ) {
      exhaustionCalls.push({ userId, conceptId, chapterId, cycleId, totalQuestionsInPool })
      return 'exhaustion-record-id'
    },
  }
}

describe('Chapter 2 reassessment reserve — 25/25 unseen capacity (real exclusion engine)', () => {
  it('after a complete initial 48-question attempt, every active concept selects its reserve question', async () => {
    const db = makeMockDb([makeAttempt('attempt-full-48', ALL_INITIAL_ANSWERS)])
    const engine = new HistoricalExclusionEngine(db as never, 'ch-2')

    for (const conceptId of ACTIVE_CONCEPT_IDS) {
      const result = await engine.selectReassessmentQuestion(
        'capacity-test-user',
        conceptId,
        'cycle-capacity',
      )
      const expectedReserve = reserve.find(
        (q) => mappingByQuestion.get(q.id) === conceptId,
      )
      expect(
        result.success,
        `${conceptId} should have an unseen reserve after full initial attempt`,
      ).toBe(true)
      expect(result.selectedQuestionId).toBe(expectedReserve!.id)
    }
    // C-2-05 explicitly covered (founder's critical check)
    expect(mappingByQuestion.get('qq-2-064')).toBe('C-2-05')
    expect(db.exhaustionCalls).toHaveLength(0)
  })

  it('pool exhaustion still fires safely once the reserve is also consumed', async () => {
    const db = makeMockDb([makeAttempt('attempt-all-73', ALL_COMBINED_ANSWERS)])
    const engine = new HistoricalExclusionEngine(db as never, 'ch-2')

    const result = await engine.selectReassessmentQuestion(
      'capacity-test-user',
      'C-2-05',
      'cycle-exhaustion',
    )
    expect(result.success).toBe(false)
    expect(result.poolExhaustion?.isExhausted).toBe(true)
    expect(result.poolExhaustion?.totalQuestionsInPool).toBe(6) // 5 initial + 1 reserve
    expect(result.poolExhaustion?.availableQuestionIds).toHaveLength(0)
    expect(db.exhaustionCalls).toHaveLength(1)
  })
})

// ───────────────────────────────────────────────
// Detection / evaluation participation
// ───────────────────────────────────────────────

describe('Chapter 2 reassessment reserve — detection participation', () => {
  it('reserve answers resolve through getQuizQuestionById (reassessment serving/scoring path)', () => {
    for (const q of reserve) {
      const resolved = getQuizQuestionById(q.id)
      expect(resolved, `${q.id} must resolve`).not.toBeNull()
      expect(resolved!.correct_answer).toBe(q.correct_answer)
    }
    // Locked questions still resolve
    expect(getQuizQuestionById('qq-2-001')).not.toBeNull()
    // Retired IDs remain unresolvable
    expect(getQuizQuestionById('qq-2-033')).toBeNull()
    expect(getQuizQuestionById('qq-2-036')).toBeNull()
  })

  it('a correct reserve answer counts as detection evidence (not skipped)', () => {
    // C-2-09 reserve = qq-2-051 (correct answer 'a')
    expect(mappingByQuestion.get('qq-2-051')).toBe('C-2-09')
    const evidence = buildConceptEvidence('C-2-09', [
      makeAttempt('attempt-reserve-correct', { 'qq-2-051': 'a' }),
    ])
    expect(evidence.totalObservations).toBe(1)
    expect(evidence.correct).toBe(1)
    expect(evidence.misses).toBe(0)
  })

  it('a missed reserve answer counts as detection evidence (not skipped)', () => {
    const evidence = buildConceptEvidence('C-2-09', [
      makeAttempt('attempt-reserve-miss', { 'qq-2-051': 'b' }),
    ])
    expect(evidence.totalObservations).toBe(1)
    expect(evidence.correct).toBe(0)
    expect(evidence.misses).toBe(1)
  })
})
