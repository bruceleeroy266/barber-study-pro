/**
 * Chapter 4 Initial Quiz → Focus-Area Handoff (C4-2)
 *
 * Proves the Chapter 4 handoff contract through the generic
 * detection/orchestration pipeline:
 *   - a completed Chapter 4 quiz attempt is analyzed against the six locked
 *     Chapter 4 concept families
 *   - qualifying weak families produce correctly-shaped active cycles with
 *     assignments derived from the canonical Chapter 4 mappings
 *   - replay/idempotency never creates duplicate active cycles
 *   - unregistered chapters remain inert
 *
 * Expected assignments are DERIVED from chapter-4-concepts/mappings.ts at
 * runtime — this test never restates canonical mappings.
 */

import { describe, expect, it } from 'vitest'
import { chapter4PremiumQuizQuestions } from '@/lib/chapter-4-premium-quiz'
import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
} from '@/lib/chapter-4-concepts/mappings'
import {
  ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS,
  chapter4ConceptFamilies,
} from '@/lib/chapter-4-concepts/concepts'
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
    chapter4PremiumQuizQuestions.map((question) => [
      question.id,
      wrongAnswer(question.correct_answer),
    ]),
  )

  return {
    id: 'attempt-ch4-initial-weak',
    user_id: 'student-ch4',
    quiz_id: 'quiz-4',
    score: 0,
    total_questions: chapter4PremiumQuizQuestions.length,
    percentage: 0,
    answers_json: answers,
    completed_at: '2026-09-16T18:00:00.000Z',
  }
}

/** Three disinfection-only attempts: M, M, C → repeated_weakness for that family. */
function disinfectionWeakAttempts(): QuizAttempt[] {
  const outcomes: Array<Record<string, 'C' | 'M'>> = [
    { 'qq-4-006': 'M' },
    { 'qq-4-007': 'M' },
    { 'qq-4-008': 'C' },
  ]
  return outcomes.map((outcome, index) => {
    const answers = Object.fromEntries(
      Object.entries(outcome).map(([questionId, result]) => [
        questionId,
        result === 'M'
          ? wrongAnswer(
              chapter4PremiumQuizQuestions.find((q) => q.id === questionId)!
                .correct_answer,
            )
          : chapter4PremiumQuizQuestions.find((q) => q.id === questionId)!
              .correct_answer,
      ]),
    )
    return {
      id: `attempt-ch4-disinf-${index + 1}`,
      user_id: 'student-ch4',
      quiz_id: 'quiz-4',
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

class Chapter4HandoffDb implements IDetectionOrchestratorDbClient {
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
    const id = `focus-ch4-${this.created.length + 1}`
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
  const content = chapter4ContentConceptMappings
    .filter((m) => m.conceptFamilyId === conceptFamilyId)
    .map((m) => m.contentBlockId)
  const flashcards = chapter4FlashcardConceptMappings
    .filter((m) => m.conceptFamilyId === conceptFamilyId)
    .map((m) => m.flashcardId)
  return { content, flashcards }
}

// ───────────────────────────────────────────────
// Tests
// ───────────────────────────────────────────────

describe('Chapter 4 initial quiz → focus-area handoff', () => {
  it('creates one targeted cycle per weak family from a weak real 30-question attempt', async () => {
    expect(chapter4PremiumQuizQuestions).toHaveLength(30)

    const db = new Chapter4HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-4',
      'attempt-ch4-initial-weak',
    )

    expect(result.success).toBe(true)
    // All six families are all-miss with >= 3 observations → repeated_weakness.
    expect(result.cyclesCreated).toBe(6)
    expect(result.conceptsDetected.sort()).toEqual(
      [...ACTIVE_CHAPTER4_CONCEPT_FAMILY_IDS].sort(),
    )
    expect(db.created).toHaveLength(6)

    for (const cycle of db.created) {
      // Cycle shape: chapter, status, sequencing, detection snapshot.
      expect(cycle.chapterId).toBe('ch-4')
      expect(cycle.status).toBe('targeted')
      expect(cycle.cycleNumber).toBe(1)
      expect(cycle.detectionState).toBe('repeated_weakness')
      expect(result.cycleIds).toContain(cycle.id)

      // Assignments equal the canonical mapping projection for this family.
      const expected = expectedAssignmentsFor(cycle.conceptId)
      expect(expected.content.length).toBeGreaterThan(0)
      expect(expected.flashcards.length).toBeGreaterThan(0)

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

  it('attributes weakness to the correct Chapter 4 family only', async () => {
    const db = new Chapter4HandoffDb(disinfectionWeakAttempts())
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-4',
      'attempt-ch4-disinf-3',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(1)
    expect(result.conceptsDetected).toEqual(['ch4-disinfection-sterilization'])
    expect(db.created[0].conceptId).toBe('ch4-disinfection-sterilization')
    expect(db.created[0].detectionState).toBe('repeated_weakness')

    // The cycle's assignments are exactly the disinfection slice of the
    // canonical mappings.
    const expected = expectedAssignmentsFor('ch4-disinfection-sterilization')
    expect(db.created[0].assignments.map((a) => a.assetId)).toEqual([
      ...expected.content,
      ...expected.flashcards,
    ])
  })

  it('does not duplicate active focus areas when detection replays', async () => {
    const db = new Chapter4HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const first = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-4',
      'attempt-ch4-initial-weak',
    )
    const second = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-4',
      'attempt-ch4-initial-weak',
    )

    expect(first.cyclesCreated).toBe(6)
    expect(second.cyclesCreated).toBe(0)
    expect(second.existingCyclesFound).toBe(6)
    expect(second.cycleIds).toEqual(first.cycleIds)
    expect(db.created).toHaveLength(6)
  })

  it('creates no cycles when the attempt shows no weakness', async () => {
    const cleanAttempt: QuizAttempt = {
      ...weakInitialAttempt(),
      answers_json: Object.fromEntries(
        chapter4PremiumQuizQuestions.map((q) => [q.id, q.correct_answer]),
      ),
    }
    const db = new Chapter4HandoffDb([cleanAttempt])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-4',
      'attempt-ch4-initial-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(0)
    expect(result.conceptsDetected).toHaveLength(0)
    expect(db.created).toHaveLength(0)
  })

  it('remains inert for unregistered chapters', async () => {
    const db = new Chapter4HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch4',
      'ch-5',
      'attempt-ch4-initial-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(0)
    expect(result.cycleIds).toHaveLength(0)
    expect(db.created).toHaveLength(0)
  })

  it('resolves Chapter 4 concept display names through the provider', () => {
    const service = new DetectionOrchestratorService(new Chapter4HandoffDb([]))
    for (const family of chapter4ConceptFamilies) {
      expect(service.getConceptName(family.id, 'ch-4')).toBe(family.name)
    }
    expect(service.getConceptName('ch4-unknown', 'ch-4')).toBe('ch4-unknown')
  })
})
