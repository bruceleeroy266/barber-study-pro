import { describe, expect, it } from 'vitest'
import { chapter9PremiumQuizQuestions } from '@/lib/chapter-9-premium-quiz'
import { chapter9ReassessmentReserve } from './reassessment-reserve'
import {
  ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS,
  chapter9ConceptFamilies,
} from './concepts'
import {
  chapter9ContentConceptMappings,
  chapter9FlashcardConceptMappings,
  chapter9QuizQuestionConceptMappings,
} from './mappings'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import {
  DetectionOrchestratorService,
  type IDetectionOrchestratorDbClient,
} from '@/lib/remediation'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import { buildChapter9InstructorDiagnostics } from './instructor-diagnostics'
import type { QuizAttempt } from '@/types'
import type {
  ChapterId,
  ConceptId,
  IExclusionDatabaseClient,
  HistoricalQuizAttempt,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'
import type {
  ConceptEvidence,
  DetectionConfidence,
  DetectionState,
} from '@/lib/concept-detection/engine'

function wrongAnswer(correct: string): string {
  return ['a', 'b', 'c', 'd'].find((answer) => answer !== correct) ?? 'a'
}

function weakInitialAttempt(): QuizAttempt {
  return {
    id: 'attempt-ch9-weak',
    user_id: 'student-ch9',
    quiz_id: 'quiz-9',
    score: 0,
    total_questions: chapter9PremiumQuizQuestions.length,
    percentage: 0,
    answers_json: Object.fromEntries(
      chapter9PremiumQuizQuestions.map((question) => [
        question.id,
        wrongAnswer(question.correct_answer),
      ]),
    ),
    completed_at: '2026-09-27T12:00:00.000Z',
  }
}

interface CreatedCycle {
  id: string
  conceptId: ConceptId
  chapterId: ChapterId
  assignments: Array<{
    assignmentType: 'content_block' | 'flashcard'
    assetId: string
    priority: number
    isPrimary: boolean
  }>
  detectionState: DetectionState
  detectionConfidence: DetectionConfidence
}

class HandoffDb implements IDetectionOrchestratorDbClient {
  readonly created: CreatedCycle[] = []
  private readonly active = new Map<string, { id: string }>()

  constructor(private readonly attempts: QuizAttempt[]) {}

  async getQuizAttemptsForUser() {
    return this.attempts
  }

  async getActiveCycleForConcept(userId: string, conceptId: ConceptId) {
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
  }) {
    const id = `c9-cycle-${this.created.length + 1}`
    this.created.push({
      id,
      conceptId: data.conceptId,
      chapterId: data.chapterId,
      assignments: data.assignments,
      detectionState: data.detectionState,
      detectionConfidence: data.detectionConfidence,
    })
    this.active.set(`${data.userId}:${data.conceptId}`, { id })
    return id
  }

  async getNextCycleNumber() {
    return 1
  }
}

class ExclusionDb implements IExclusionDatabaseClient {
  constructor(private readonly attempts: HistoricalQuizAttempt[]) {}

  async getHistoricalQuizAttempts() {
    return this.attempts
  }

  async getReassessmentQuestionHistory(): Promise<ReassessmentQuestionHistoryRecord[]> {
    return []
  }

  async recordQuestionAttempt() {
    return 'history-1'
  }

  async checkAndRecordPoolExhaustion() {
    return 'exhaustion-1'
  }
}

describe('G3-2 Chapter 9 end-to-end shared runtime certification', () => {
  it('registers all 10 Chapter 9 concepts for live quiz-completion detection and targeted remediation', () => {
    expect(isConceptDetectionSupported('ch-9')).toBe(true)

    const provider = getChapterContentProvider('ch-9')
    expect(provider).toBeDefined()

    for (const concept of chapter9ConceptFamilies) {
      const bundle = provider!.buildRemediationContentBundle(concept.id)
      expect(bundle.conceptId).toBe(concept.id)
      expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(1)
      expect(
        provider!.filterFlashcardsByConcept(concept.id).every((card) => card.is_active),
      ).toBe(true)
    }
  })

  it('turns a fully missed initial Chapter 9 assessment into concept-specific remediation cycles', async () => {
    const db = new HandoffDb([weakInitialAttempt()])
    const service = new DetectionOrchestratorService(db)

    const result = await service.orchestrateAfterQuizCompletion(
      'student-ch9',
      'ch-9',
      'attempt-ch9-weak',
    )

    expect(result.success).toBe(true)
    expect(result.cyclesCreated).toBe(ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS.length)
    expect(result.conceptsDetected.sort()).toEqual(
      [...ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS].sort(),
    )

    for (const cycle of db.created) {
      expect(cycle.chapterId).toBe('ch-9')
      expect(['emerging_weakness', 'repeated_weakness']).toContain(cycle.detectionState)

      const expectedContent = chapter9ContentConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === cycle.conceptId)
        .map((mapping) => mapping.contentBlockId)
      const expectedCards = chapter9FlashcardConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === cycle.conceptId)
        .map((mapping) => mapping.flashcardId)

      expect(cycle.assignments.map((assignment) => assignment.assetId)).toEqual([
        ...expectedContent,
        ...expectedCards,
      ])
    }
  })

  it('selects fresh Chapter 9 reserve questions instead of reusing initial assessment questions', async () => {
    const target = 'ch9-primary-lesions'
    const initialIds = chapter9QuizQuestionConceptMappings
      .filter((mapping) => mapping.conceptFamilyId === target)
      .map((mapping) => mapping.questionId)

    const attempt: HistoricalQuizAttempt = {
      id: 'hist-9-1',
      userId: 'student-ch9',
      quizId: 'quiz-9',
      answersJson: Object.fromEntries(initialIds.map((id) => [id, 'a'])),
      completedAt: new Date('2026-09-27T12:00:00.000Z'),
    }

    const engine = createHistoricalExclusionEngine(new ExclusionDb([attempt]), 'ch-9')
    const selected = await engine.selectReassessmentQuestion(
      'student-ch9',
      target,
      'cycle-9-1',
    )

    expect(selected.success).toBe(true)
    expect(selected.selectedQuestionId).toBe('r9-primary-001')
    expect(initialIds.every((id) => selected.exclusionSet.combinedExclusionSet.has(id))).toBe(true)
  })

  it('preserves original misses and shows five-question recovery in instructor diagnostics', () => {
    const target = 'ch9-primary-lesions'
    const initialQuestions = chapter9PremiumQuizQuestions.filter((question) =>
      chapter9QuizQuestionConceptMappings.some(
        (mapping) =>
          mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )

    const initialAttempt = {
      quiz_id: 'quiz-9',
      percentage: 0,
      answers_json: Object.fromEntries(
        initialQuestions.map((question) => [
          question.id,
          wrongAnswer(question.correct_answer),
        ]),
      ),
      completed_at: '2026-09-27T12:00:00.000Z',
      is_reassessment: false,
      target_concept_id: null,
    }

    const before = buildChapter9InstructorDiagnostics({
      studentId: 'student-ch9',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [initialAttempt],
      referenceTime: '2026-09-27T13:00:00.000Z',
    })

    const reserve = chapter9ReassessmentReserve.filter(
      (question) => question.conceptFamilyId === target,
    )
    expect(reserve).toHaveLength(5)

    const reassessmentAttempt = {
      quiz_id: 'quiz-9',
      percentage: 100,
      answers_json: Object.fromEntries(
        reserve.map((question) => [question.id, question.correctAnswer]),
      ),
      completed_at: '2026-09-27T12:30:00.000Z',
      is_reassessment: true,
      target_concept_id: target,
    }

    const after = buildChapter9InstructorDiagnostics({
      studentId: 'student-ch9',
      completionPercent: 75,
      microCheckRows: [],
      quizAttempts: [initialAttempt, reassessmentAttempt],
      referenceTime: '2026-09-27T13:00:00.000Z',
    })

    const beforeConcept = before.concepts.find(
      (concept) => concept.conceptName === 'Primary Skin Lesions',
    )!
    const afterConcept = after.concepts.find(
      (concept) => concept.conceptName === 'Primary Skin Lesions',
    )!

    expect(beforeConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.initialMisses).toBe(initialQuestions.length)
    expect(afterConcept.reassessmentCorrect).toBe(5)
    expect(afterConcept.mastery).toBeGreaterThan(beforeConcept.mastery)
    expect(after.latestReassessment).toContain('100%')
    expect(after.latestReassessment).toContain('Primary Skin Lesions')
    expect(after.chapterGrade.finalGrade).toBeGreaterThanOrEqual(after.chapterGrade.baseGrade)
  })
})
