import { describe, it, expect } from 'vitest'
import { chapter5PremiumQuizQuestions } from '@/lib/chapter-5-premium-quiz'
import { chapter5ContentConceptMappings, chapter5FlashcardConceptMappings } from '@/lib/chapter-5-concepts/mappings'
import { DetectionOrchestratorService, type IDetectionOrchestratorDbClient } from '@/lib/remediation/detection-orchestrator'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId } from '@/lib/reassessment/types'
import type { ConceptEvidence, DetectionConfidence, DetectionState } from '@/lib/concept-detection/engine'

type Assignment = { assignmentType: 'content_block' | 'flashcard'; assetId: string; priority: number; isPrimary: boolean }
type Cycle = { conceptId: ConceptId; chapterId: ChapterId; assignments: Assignment[] }
class DisposableAssignments implements IDetectionOrchestratorDbClient {
  cycles: Cycle[] = []
  active = new Map<string, string>()
  constructor(private attempts: QuizAttempt[]) {}
  async getQuizAttemptsForUser(): Promise<QuizAttempt[]> { return this.attempts }
  async getActiveCycleForConcept(userId: string, conceptId: ConceptId) {
    const id = this.active.get(userId + ':' + conceptId)
    return id ? { id } : null
  }
  async getNextCycleNumber() { return 1 }
  async createRemediationCycleWithAssignments(data: {
    userId: string; conceptId: ConceptId; chapterId: ChapterId; cycleNumber: number
    detectionState: DetectionState; detectionConfidence: DetectionConfidence
    detectionEvidence: ConceptEvidence; status: 'targeted'; assignments: Assignment[]
  }) {
    const id = 'qa174-cycle-' + (this.cycles.length + 1)
    this.cycles.push({ conceptId: data.conceptId, chapterId: data.chapterId, assignments: data.assignments })
    this.active.set(data.userId + ':' + data.conceptId, id)
    return id
  }
}

describe('QA-174 Chapter 5 automatic targeted assignment handoff', () => {
  it('creates mapping-backed review and flashcard assignments without duplicate cycles', async () => {
    const attempt: QuizAttempt = {
      id: 'qa174-attempt', user_id: 'qa174-disposable', quiz_id: 'quiz-5',
      score: 0, total_questions: 50, percentage: 0,
      answers_json: Object.fromEntries(chapter5PremiumQuizQuestions.map(q => [
        q.id, ['a','b','c','d'].find(key => key !== q.correct_answer)!,
      ])),
      completed_at: '2026-10-27T12:00:00.000Z',
    }
    const db = new DisposableAssignments([attempt])
    const service = new DetectionOrchestratorService(db)
    const first = await service.orchestrateAfterQuizCompletion('qa174-disposable', 'ch-5', attempt.id)
    expect(first.success).toBe(true)
    expect(db.cycles.length).toBeGreaterThan(0)
    for (const cycle of db.cycles) {
      expect(cycle.chapterId).toBe('ch-5')
      const expectedContent = chapter5ContentConceptMappings.filter(m => m.conceptFamilyId === cycle.conceptId).map(m => m.contentBlockId)
      const expectedCards = chapter5FlashcardConceptMappings.filter(m => m.conceptFamilyId === cycle.conceptId).map(m => m.flashcardId)
      expect(cycle.assignments.filter(a => a.assignmentType === 'content_block').map(a => a.assetId)).toEqual(expectedContent)
      expect(cycle.assignments.filter(a => a.assignmentType === 'flashcard').map(a => a.assetId)).toEqual(expectedCards)
      expect(expectedContent.length).toBeGreaterThan(0)
      expect(expectedCards.length).toBeGreaterThan(0)
    }
    const count = db.cycles.length
    const again = await service.orchestrateAfterQuizCompletion('qa174-disposable', 'ch-5', attempt.id)
    expect(again.success).toBe(true)
    expect(db.cycles).toHaveLength(count)
    expect(again.cyclesCreated).toBe(0)
  })
})
