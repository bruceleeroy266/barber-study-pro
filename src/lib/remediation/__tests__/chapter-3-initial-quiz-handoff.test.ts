/**
 * Chapter 3 Initial Quiz → Focus-Area Handoff (C3-2)
 *
 * Proves the Chapter 3 handoff contract through the generic
 * detection/orchestration pipeline:
 *   - a completed Chapter 3 quiz attempt is analyzed against the four locked
 *     Chapter 3 concept families
 *   - qualifying weak families produce correctly-shaped active cycles with
 *     assignments derived from the canonical Chapter 3 mappings
 *   - replay/idempotency never creates duplicate active cycles
 *   - unregistered chapters remain inert
 *
 * Expected assignments are DERIVED from chapter-3-concepts/mappings.ts at
 * runtime — this test never restates canonical mappings.
 */

import { describe, expect, it } from 'vitest'
import { chapter3PremiumQuizQuestions } from '@/lib/chapter-3-premium-quiz'
import {
  chapter3ContentConceptMappings,
  chapter3FlashcardConceptMappings,
} from '@/lib/chapter-3-concepts/mappings'
import {
  CHAPTER3_CONCEPT_FAMILY_IDS,
  chapter3ConceptFamilies,
} from '@/lib/chapter-3-concepts/concepts'
import {
  DetectionOrchestratorService,
  type IDetectionOrchestratorDbClient,
} from '@/lib/remediation/detection-orchestrator'
import type { QuizAttempt } from '@/types'
import type { ChapterId, ConceptId } from '@/lib/reassessment/types'
import type {
  ConceptEvidence,
  DetectionConfidence,
  DetectionState,
} from '@/lib/concept-detection/engine'

// ───────────────────────────────────────────────
// Attempt builders (answers derived from the canonical bank)
// ───────────────────────────────────────────────

function wrongAnswer(correct: string): string {
  return ['a', 'b', 'c', 'd'].find((answer) => answer !== correct) ?? 'a'
}

function weakInitialAttempt(): QuizAttempt {
  const answers = Object.fromEntries(
    chapter3PremiumQuizQuestions.map((question) => [
      question.id,
      wrongAnswer(question.correct_answer),
    ]),
  )

  return {
    id: 'attempt-ch3-initial-weak',
    user_id: 'student-ch3',
    quiz_id: 'quiz-3',
    score: 0,
    total_questions: chapter3PremiumQuizQuestions.length,
    percentage: 0,
    answers_json: answers,
    completed_at: '2026-09-15T18:00:00.000Z',
  }
}

/** Three ergonomics-only attempts: M, M, C → repeated_weakness for that family. */
function ergonomicsWeakAttempts(): QuizAttempt[] {
  const outcomes: Array<Record<string, 'C' | 'M'>> = [
    { 'qq-3-014': 'M' },
    { 'qq-3-028': 'M' },
    { 'qq-3-037': 'C' },
  ]
  return outcomes.map((outcome, index) => {
    const answers = Object.fromEntries(
      Object.entries(outcome).map(([questionId, result]) => [
        questionId,
        result === 'M'
          ? wrongAnswer(
              chapter3PremiumQuizQuestions.find((q) => q.id === questionId)!
                .correct_answer,
            )
          : chapter3PremiumQuizQuestions.find((q) => q.id === questionId)!
              .correct_answer,
      ]),
    )
    return {
      id: `attempt-ch3-ergo-${index + 1}`,
      user_id: 'student-ch3',
      quiz_id: 'quiz-3',
      score: 0,
      total_questions: 30,
      percentage: 0,
      answers_json: answers,
      completed_at: `2026-09-1${index + 1}T18:00:00.000Z`,
    }
  })
}

// ───────────────────────────────────────────────
// In-memory DB client (captures everything the orchestrator writes)
// ───────────────────────────────────────────────

interface CreatedCycle {
  id: string
  userId: string
  conceptId: ConceptId
  chapterId: ChapterId
  cycleNumber: number
  detectionState: DetectionState
  detectionConfidence: DetectionConfidence
  status: 'targeted'
  assignments: Array<{
    assignmentType: 'content_block' | 'flashcard'
    assetId: string
    priority: number
    isPrimary: boolean
  }>
}

class Chapter3HandoffDb implements IDetectionOrchestratorDbClient {
  readonly created: CreatedCycle[] = []
  private active = new Map<string, { id: string }>()

  constructor(private readonly attempts: QuizAttempt[]) {}

  async getQuizAttemptsForUser(): Promise<QuizAttempt[]> {
    return this.attempts
  }

  async getActiveCycleForConcept(
    userId: string,
    conceptId: ConceptId,
  ): Promise<{ id: string } | null> {
    return this.active.get(`${userId}:${conceptId}`) ?? null
  }

  async createRemediationCycleWithAssignments(data: {
    userId: string
    conceptId: ConceptId
    chapterId: ChapterId
    cycleNumber: number
    detectionState: DetectionState
    detectionConfidence: DetectionConfidence
    detectionEvidence: ConceptEvidence
    status: 'targeted'
    assignments: CreatedCycle['assignments']
  }): Promise<string | null> {
    const id = `focus-ch3-${this.created.length + 1}`
    this.created.push({
      id,
      userId: data.userId,
      conceptId: data.conceptId,
      chapterId: data.chapterId,
      cycleNumber: data.cycleNumber,
      detectionState: data.detectionState,
      detectionConfidence: data.detectionConfidence,
      status: data.status,
      assignments: data.assignments,
    })
    this.active.set(`${data.userId}:${data.conceptId}`, { id })
    return id
  }

  async getNextCycleNumber(): Promise<number> {
    return 1
  }
}

// ───────────────────────────────────────────────
// Expected assignments derived from canonical mappings
// ───────────────────────────────────────────────

function expectedAssignmentsFor(conceptFamilyId: string) {
  const content = chapter3ContentConceptMappings
    .filter((m) => m.conceptFamilyId === conceptFamilyId)
    .map((m) => m.contentBlockId)
  const flashcards = chapter3FlashcardConceptMappings
    .filter((m) => m.conceptFamilyId === conceptFamilyId)
    .map((m) => m.flashcardId)
  return { content, flashcards }
}

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

describe('Chapter 3 initial quiz → focus-area handoff', () => {
  it('creates one targeted cycle per weak family from a weak real 30-question attempt', async () => {
    expect(chapter3PremiumQuizQuestions).toHaveLength(30)

    const db = new Chapter3HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-3',
      'attempt-ch3-initial-weak',
    )

    expect(result.success).toBe(true)
    // All four families are all-miss with >= 3 observations → repeated_weakness.
    expect(result.cyclesCreated).toBe(4)
    expect(result.conceptsDetected.sort()).toEqual(
      [...CHAPTER3_CONCEPT_FAMILY_IDS].sort(),
    )
    expect(db.created).toHaveLength(4)

    for (const cycle of db.created) {
      // Cycle shape: chapter, status, sequencing, detection snapshot.
      expect(cycle.chapterId).toBe('ch-3')
      expect(cycle.status).toBe('targeted')
      expect(cycle.cycleNumber).toBe(1)
      expect(cycle.detectionState).toBe('repeated_weakness')
      expect(result.cycleIds).toContain(cycle.id)

      // Assignments equal the canonical mapping projection for this family.
      const expected = expectedAssignmentsFor(cycle.conceptId)
      expect(expected.content.length).toBeGreaterThan(0)
      expect(expected.flashcards.length).toBe(12)

      const contentAssignments = cycle.assignments.filter(
        (a) => a.assignmentType === 'content_block',
      )
      const flashcardAssignments = cycle.assignments.filter(
        (a) => a.assignmentType === 'flashcard',
      )
      expect(contentAssignments.map((a) => a.assetId)).toEqual(expected.content)
      expect(flashcardAssignments.map((a) => a.assetId)).toEqual(expected.flashcards)
      expect(contentAssignments.every((a) => a.isPrimary)).toBe(true)
      expect(flashcardAssignments.every((a) => !a.isPrimary)).toBe(true)

      // Priorities are sequential and asset IDs unique within the cycle.
      expect(cycle.assignments.map((a) => a.priority)).toEqual(
        cycle.assignments.map((_, i) => i + 1),
      )
      expect(new Set(cycle.assignments.map((a) => a.assetId)).size).toBe(
        cycle.assignments.length,
      )
    }
  })

  it('attributes weakness to the correct Chapter 3 family only', async () => {
    const db = new Chapter3HandoffDb(ergonomicsWeakAttempts())
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-3',
      'attempt-ch3-ergo-3',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(1)
    expect(result.conceptsDetected).toEqual(['ch3-ergonomics'])
    expect(db.created[0].conceptId).toBe('ch3-ergonomics')
    expect(db.created[0].detectionState).toBe('repeated_weakness')

    // The cycle's assignments are exactly the ergonomics slice of the
    // canonical mappings.
    const expected = expectedAssignmentsFor('ch3-ergonomics')
    expect(db.created[0].assignments.map((a) => a.assetId)).toEqual([
      ...expected.content,
      ...expected.flashcards,
    ])
  })

  it('does not duplicate active focus areas when detection replays', async () => {
    const db = new Chapter3HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const first = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-3',
      'attempt-ch3-initial-weak',
    )
    const second = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-3',
      'attempt-ch3-initial-weak',
    )

    expect(first.cyclesCreated).toBe(4)
    expect(second.cyclesCreated).toBe(0)
    expect(second.existingCyclesFound).toBe(4)
    expect(second.cycleIds).toEqual(first.cycleIds)
    expect(db.created).toHaveLength(4)
  })

  it('creates no cycles when the attempt shows no weakness', async () => {
    const cleanAttempt: QuizAttempt = {
      ...weakInitialAttempt(),
      answers_json: Object.fromEntries(
        chapter3PremiumQuizQuestions.map((q) => [q.id, q.correct_answer]),
      ),
    }
    const db = new Chapter3HandoffDb([cleanAttempt])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-3',
      'attempt-ch3-initial-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(0)
    expect(result.conceptsDetected).toHaveLength(0)
    expect(db.created).toHaveLength(0)
  })

  it('remains inert for unregistered chapters', async () => {
    const db = new Chapter3HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch3',
      'ch-4',
      'attempt-ch3-initial-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(0)
    expect(result.cycleIds).toHaveLength(0)
    expect(db.created).toHaveLength(0)
  })

  it('resolves Chapter 3 concept display names through the provider', () => {
    const service = new DetectionOrchestratorService(new Chapter3HandoffDb([]))
    for (const family of chapter3ConceptFamilies) {
      expect(service.getConceptName(family.id, 'ch-3')).toBe(family.name)
    }
    expect(service.getConceptName('ch3-unknown', 'ch-3')).toBe('ch3-unknown')
  })
})
