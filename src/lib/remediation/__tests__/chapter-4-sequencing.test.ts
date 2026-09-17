/**
 * Chapter 4 Knowledge Check Sequencing Tests (C4-3)
 *
 * Proves the five-question Knowledge Check contract for Chapter 4 from
 * persisted state only — the same generic sequencing engine Chapter 3 uses,
 * driven by the ch-4 length config and the ch-4 canonical pools:
 *   - ch-4 knowledge-check length is 5
 *   - questions 1–4 cannot complete (and therefore cannot terminally evaluate)
 *   - question 5 completes with exactly the five persisted evidence IDs in order
 *   - open-reservation detection and consumed-WRONG-answer handling
 *   - replay/idempotency: consumed reservations return their real attempt ID
 *   - exclusion engine: after a full initial-quiz attempt the eligible pool is
 *     exactly the 15 reserve questions of the cycle's family (initial
 *     questions never substitute); exhaustion stays explicit; reservation
 *     conflicts retry safely
 */

import { describe, it, expect } from 'vitest'
import {
  getKnowledgeCheckLength,
  getKnowledgeCheckProgress,
  getConsumedAttemptId,
  type IKnowledgeCheckDbClient,
  type ReassessmentAttemptRow,
  type ReassessmentReservationRow,
} from '../knowledge-check'
import { ReassessmentService } from '@/lib/reassessment/reassessment-service'
import { resetMappingProviderRegistry } from '@/lib/reassessment/provider-registry'
import type {
  IExclusionDatabaseClient,
  HistoricalQuizAttempt,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'

// ───────────────────────────────────────────────
// In-memory knowledge-check DB
// ───────────────────────────────────────────────

class MockKnowledgeCheckDb implements IKnowledgeCheckDbClient {
  attempts: ReassessmentAttemptRow[] = []
  reservations: ReassessmentReservationRow[] = []

  async getReassessmentAttemptsForCycle(): Promise<ReassessmentAttemptRow[]> {
    return [...this.attempts]
  }

  async getReassessmentReservationsForCycle(): Promise<ReassessmentReservationRow[]> {
    return [...this.reservations]
  }

  async quizAttemptExists(attemptId: string): Promise<boolean> {
    return this.attempts.some((a) => a.id === attemptId)
  }

  /** Simulate consuming a reservation: add the real attempt and point the reservation at it. */
  consume(reservationId: string, attemptId: string, isCorrect: boolean): void {
    this.attempts.push({ id: attemptId, completed_at: new Date().toISOString() })
    const r = this.reservations.find((x) => x.id === reservationId)
    if (r) {
      r.quiz_attempt_id = attemptId
      r.is_correct = isCorrect
    }
  }

  /** Add an open (placeholder) reservation. */
  reserveOpen(reservationId: string, questionId: string, placeholderId: string): void {
    this.reservations.push({
      id: reservationId,
      question_id: questionId,
      quiz_attempt_id: placeholderId,
      is_correct: false,
      created_at: new Date().toISOString(),
    })
  }
}

// ───────────────────────────────────────────────
// Sequence length policy
// ───────────────────────────────────────────────

describe('Chapter 4 knowledge-check length', () => {
  it('ch-4 uses the five-question Knowledge Check; unsupported chapters fall back to 1', () => {
    expect(getKnowledgeCheckLength('ch-4')).toBe(5)
    expect(getKnowledgeCheckLength('ch-5')).toBe(1)
  })
})

// ───────────────────────────────────────────────
// The five-question flow
// ───────────────────────────────────────────────

describe('getKnowledgeCheckProgress — the Chapter 4 five-question sequence', () => {
  it('questions 1–4 cannot complete (and therefore cannot terminally evaluate)', async () => {
    const db = new MockKnowledgeCheckDb()
    const reserveIds = ['qq-4-046', 'qq-4-047', 'qq-4-048', 'qq-4-049']

    for (let q = 1; q <= 4; q++) {
      db.reserveOpen(`res-${q}`, reserveIds[q - 1], `placeholder-${q}`)
      db.consume(`res-${q}`, `attempt-${q}`, q % 2 === 0)
      const progress = await getKnowledgeCheckProgress(db, 'cycle-1', 'user-1', 5)

      expect(progress.answeredCount, `after Q${q}`).toBe(q)
      expect(progress.isComplete, `after Q${q}`).toBe(false)
      // The submit path evaluates only when complete — mid-sequence it must not.
    }
  })

  it('question 5 completes with exactly the five persisted evidence IDs in completion order', async () => {
    const db = new MockKnowledgeCheckDb()
    const reserveIds = ['qq-4-046', 'qq-4-047', 'qq-4-048', 'qq-4-049', 'qq-4-050']

    for (let q = 1; q <= 5; q++) {
      db.reserveOpen(`res-${q}`, reserveIds[q - 1], `placeholder-${q}`)
      db.consume(`res-${q}`, `attempt-${q}`, q !== 4)
    }

    const progress = await getKnowledgeCheckProgress(db, 'cycle-1', 'user-1', 5)

    expect(progress.answeredCount).toBe(5)
    expect(progress.isComplete).toBe(true)
    expect(progress.answeredAttemptIds).toEqual([
      'attempt-1',
      'attempt-2',
      'attempt-3',
      'attempt-4',
      'attempt-5',
    ])
    // The evaluation evidence set is exactly these five IDs (slice(0, 5)).
    expect(progress.answeredAttemptIds.slice(0, 5)).toHaveLength(5)
  })

  it('detects an open (reserved-but-not-consumed) question for reload recovery', async () => {
    const db = new MockKnowledgeCheckDb()
    db.reserveOpen('res-1', 'qq-4-046', 'placeholder-1')
    db.consume('res-1', 'attempt-1', true)
    db.reserveOpen('res-2', 'qq-4-047', 'placeholder-2') // still open

    const progress = await getKnowledgeCheckProgress(db, 'cycle-1', 'user-1', 5)

    expect(progress.answeredCount).toBe(1)
    expect(progress.isComplete).toBe(false)
    expect(progress.openReservation).toEqual({
      reservationId: 'res-2',
      questionId: 'qq-4-047',
    })
  })

  it('a consumed WRONG answer is not mistaken for an open reservation', async () => {
    const db = new MockKnowledgeCheckDb()
    db.reserveOpen('res-1', 'qq-4-046', 'placeholder-1')
    db.consume('res-1', 'attempt-1', false) // wrong answer, is_correct stays false

    const progress = await getKnowledgeCheckProgress(db, 'cycle-1', 'user-1', 5)

    expect(progress.answeredCount).toBe(1)
    expect(progress.openReservation).toBeNull()
  })
})

// ───────────────────────────────────────────────
// Replay / idempotent consumption
// ───────────────────────────────────────────────

describe('getConsumedAttemptId — Chapter 4 replay idempotency', () => {
  it('returns the persisted attempt for a consumed reservation (correct answer)', async () => {
    const db = new MockKnowledgeCheckDb()
    db.reserveOpen('res-1', 'qq-4-046', 'placeholder-1')
    db.consume('res-1', 'attempt-1', true)

    const reservations = await db.getReassessmentReservationsForCycle()
    expect(await getConsumedAttemptId(db, reservations, 'res-1')).toBe('attempt-1')
  })

  it('returns the persisted attempt for a consumed WRONG answer (the DB-level hole)', async () => {
    const db = new MockKnowledgeCheckDb()
    db.reserveOpen('res-1', 'qq-4-046', 'placeholder-1')
    db.consume('res-1', 'attempt-1', false)

    const reservations = await db.getReassessmentReservationsForCycle()
    expect(await getConsumedAttemptId(db, reservations, 'res-1')).toBe('attempt-1')
  })

  it('returns null for an open reservation (placeholder ID)', async () => {
    const db = new MockKnowledgeCheckDb()
    db.reserveOpen('res-1', 'qq-4-046', 'placeholder-1')

    const reservations = await db.getReassessmentReservationsForCycle()
    expect(await getConsumedAttemptId(db, reservations, 'res-1')).toBeNull()
  })
})

// ───────────────────────────────────────────────
// Exclusion engine: initial questions never substitute
// ───────────────────────────────────────────────

class MockExclusionDb implements IExclusionDatabaseClient {
  history: ReassessmentQuestionHistoryRecord[] = []
  exhaustionRecords: Array<{ conceptId: string; totalQuestionsInPool: number }> = []
  conflictQuestionIds = new Set<string>()

  constructor(private readonly attempts: HistoricalQuizAttempt[]) {}

  async getHistoricalQuizAttempts(): Promise<HistoricalQuizAttempt[]> {
    return this.attempts
  }

  async getReassessmentQuestionHistory(): Promise<ReassessmentQuestionHistoryRecord[]> {
    return [...this.history]
  }

  async recordQuestionAttempt(
    userId: string,
    conceptId: string,
    questionId: string,
    _quizAttemptId: string,
    cycleId: string | null,
    isCorrect: boolean
  ): Promise<string | null> {
    if (this.conflictQuestionIds.has(questionId)) {
      // ON CONFLICT DO NOTHING — a concurrent actor reserved this question
      // first. Their reservation now exists in history (excluded on recompute).
      this.history.push({
        id: `concurrent-${this.history.length + 1}`,
        userId: 'concurrent-actor',
        conceptId,
        questionId,
        quizAttemptId: 'concurrent-placeholder',
        cycleId,
        isCorrect: false,
        attemptedAt: new Date(),
      } as ReassessmentQuestionHistoryRecord)
      return null
    }
    const id = `history-${this.history.length + 1}`
    this.history.push({
      id,
      userId,
      conceptId,
      questionId,
      quizAttemptId: _quizAttemptId,
      cycleId,
      isCorrect,
      attemptedAt: new Date(),
    } as ReassessmentQuestionHistoryRecord)
    return id
  }

  async checkAndRecordPoolExhaustion(
    _userId: string,
    conceptId: string,
    _chapterId: string,
    _cycleId: string,
    totalQuestionsInPool: number
  ): Promise<string | null> {
    this.exhaustionRecords.push({ conceptId, totalQuestionsInPool })
    return `exhaustion-${this.exhaustionRecords.length}`
  }
}

function fullInitialAttempt(): HistoricalQuizAttempt {
  return {
    id: 'initial-attempt-1',
    userId: 'user-1',
    quizId: 'quiz-4',
    answersJson: Object.fromEntries(
      chapter4PremiumQuizQuestions.map((q) => [q.id, q.correct_answer]),
    ),
    completedAt: new Date('2026-09-17T10:00:00.000Z'),
  }
}

describe('exclusion engine — the Chapter 4 five Knowledge Check questions are legitimate and concept-bound', () => {
  it('after a full initial-quiz attempt, the eligible pool is exactly the 15 reserve questions', async () => {
    resetMappingProviderRegistry()
    const db = new MockExclusionDb([fullInitialAttempt()])
    const service = new ReassessmentService(db, 'ch-4')

    // Consume five questions through the atomic select-and-reserve path.
    const selected: string[] = []
    for (let i = 0; i < 5; i++) {
      const result = await service.selectAndReserveQuestion(
        'user-1',
        'ch4-disinfection-sterilization',
        'cycle-1',
        `placeholder-${i + 1}`
      )
      expect(result.success, `selection ${i + 1}`).toBe(true)
      selected.push(result.questionId!)
    }

    // All five are reserve questions mapped to the cycle's family — never
    // silently substituted initial-quiz questions.
    const initialIds = new Set(chapter4PremiumQuizQuestions.map((q) => q.id))
    const disinfReserveIds = chapter4ReassessmentQuestions
      .filter((q) => q.id >= 'qq-4-046' && q.id <= 'qq-4-060')
      .map((q) => q.id)
    expect(selected).toHaveLength(5)
    expect(new Set(selected).size).toBe(5)
    for (const id of selected) {
      expect(initialIds.has(id), `${id} is an initial-quiz question`).toBe(false)
      expect(disinfReserveIds, `${id} not in the disinfection reserve`).toContain(id)
    }
    // Deterministic order: first five reserve questions by ID.
    expect(selected).toEqual(['qq-4-046', 'qq-4-047', 'qq-4-048', 'qq-4-049', 'qq-4-050'])
  })

  it('pool exhaustion is explicit after all 15 reserve questions are consumed', async () => {
    resetMappingProviderRegistry()
    const db = new MockExclusionDb([fullInitialAttempt()])
    const service = new ReassessmentService(db, 'ch-4')

    for (let i = 0; i < 15; i++) {
      const result = await service.selectAndReserveQuestion(
        'user-1',
        'ch4-disinfection-sterilization',
        'cycle-1',
        `placeholder-${i + 1}`
      )
      expect(result.success, `selection ${i + 1}`).toBe(true)
    }

    const exhausted = await service.selectAndReserveQuestion(
      'user-1',
      'ch4-disinfection-sterilization',
      'cycle-1',
      'placeholder-16'
    )
    expect(exhausted.success).toBe(false)
    expect(exhausted.poolExhaustion?.isExhausted).toBe(true)
    expect(exhausted.poolExhaustion?.totalQuestionsInPool).toBe(21) // 6 initial + 15 reserve
    expect(db.exhaustionRecords).toHaveLength(1)
    expect(db.exhaustionRecords[0].conceptId).toBe('ch4-disinfection-sterilization')
  })

  it('reservation conflicts retry with a different candidate (concurrency protection remains)', async () => {
    resetMappingProviderRegistry()
    const db = new MockExclusionDb([fullInitialAttempt()])
    // First candidate always conflicts — the service must skip it and reserve
    // the next eligible question, never returning the conflicting candidate.
    db.conflictQuestionIds.add('qq-4-046')
    const service = new ReassessmentService(db, 'ch-4')

    const result = await service.selectAndReserveQuestion(
      'user-1',
      'ch4-disinfection-sterilization',
      'cycle-1',
      'placeholder-1'
    )

    expect(result.success).toBe(true)
    expect(result.questionId).toBe('qq-4-047')
    expect(result.reservationAttempts).toBeGreaterThan(1)
    // The conflicting candidate was never returned; our reservation is qq-4-047.
    expect(db.history.map((h) => h.questionId)).toContain('qq-4-047')
  })
})
