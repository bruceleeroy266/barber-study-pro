import { describe, expect, it } from 'vitest'
import { chapter2PremiumQuizQuestions } from '@/lib/chapter-2-premium-quiz'
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
} from '@/lib/chapter-2-concepts/detection'

function wrongAnswer(correct: string): string {
  return (['a', 'b', 'c', 'd'].find((answer) => answer !== correct) ?? 'a')
}

function weakInitialAttempt(): QuizAttempt {
  const answers = Object.fromEntries(
    chapter2PremiumQuizQuestions.map((question) => [
      question.id,
      wrongAnswer(question.correct_answer),
    ]),
  )

  return {
    id: 'attempt-ch2-initial-weak',
    user_id: 'student-ch2',
    quiz_id: 'quiz-2',
    score: 0,
    total_questions: chapter2PremiumQuizQuestions.length,
    percentage: 0,
    answers_json: answers,
    completed_at: '2026-09-13T18:00:00.000Z',
  }
}

class HandoffDb implements IDetectionOrchestratorDbClient {
  readonly created: Array<{ id: string; conceptId: ConceptId; assignmentCount: number }> = []
  private active = new Map<string, { id: string }>()

  async getQuizAttemptsForUser(): Promise<QuizAttempt[]> {
    return [weakInitialAttempt()]
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
    assignments: Array<{
      assignmentType: 'content_block' | 'flashcard'
      assetId: string
      priority: number
      isPrimary: boolean
    }>
  }): Promise<string | null> {
    const id = `focus-${this.created.length + 1}`
    this.created.push({
      id,
      conceptId: data.conceptId,
      assignmentCount: data.assignments.length,
    })
    this.active.set(`${data.userId}:${data.conceptId}`, { id })
    return id
  }

  async getNextCycleNumber(): Promise<number> {
    return 1
  }
}

describe('Chapter 2 initial quiz → focus-area handoff', () => {
  it('creates targeted remediation cycles from a weak real 48-question attempt', async () => {
    expect(chapter2PremiumQuizQuestions).toHaveLength(48)

    const db = new HandoffDb()
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch2',
      'ch-2',
      'attempt-ch2-initial-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBeGreaterThan(0)
    expect(result.cycleIds).toHaveLength(result.cyclesCreated)
    expect(result.conceptsDetected).toHaveLength(result.cyclesCreated)
    expect(db.created).toHaveLength(result.cyclesCreated)

    for (const cycle of db.created) {
      expect(cycle.assignmentCount).toBeGreaterThan(0)
      expect(result.cycleIds).toContain(cycle.id)
      expect(result.conceptsDetected).toContain(cycle.conceptId)
    }
  })

  it('does not duplicate active focus areas when detection runs again', async () => {
    const db = new HandoffDb()
    const service = new DetectionOrchestratorService(db)

    const first = await service.orchestrateAfterQuizCompletion(
      'student-ch2',
      'ch-2',
      'attempt-ch2-initial-weak',
    )
    const second = await service.orchestrateAfterQuizCompletion(
      'student-ch2',
      'ch-2',
      'attempt-ch2-initial-weak',
    )

    expect(first.cyclesCreated).toBeGreaterThan(0)
    expect(second.cyclesCreated).toBe(0)
    expect(second.existingCyclesFound).toBe(first.cyclesCreated)
    expect(second.cycleIds).toEqual(first.cycleIds)
    expect(db.created).toHaveLength(first.cyclesCreated)
  })
})
