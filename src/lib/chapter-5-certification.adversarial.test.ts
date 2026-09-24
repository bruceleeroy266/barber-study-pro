import { describe, expect, it } from 'vitest'
import { chapter5PremiumContent } from './chapter-5-premium'
import { chapter5PremiumFlashcards } from './chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from './chapter-5-premium-quiz'
import { chapter5ReassessmentQuestions } from './chapter-5-reassessment-questions'
import { chapter5ConceptFamilies } from './chapter-5-concepts/concepts'
import {
  chapter5ContentConceptMappings,
  chapter5FlashcardConceptMappings,
  chapter5QuizQuestionConceptMappings,
  chapter5ReassessmentQuestionConceptMappings,
} from './chapter-5-concepts/mappings'
import { getLocalFlashcards, getLocalQuizQuestions } from './local-data'
import { getChapterContentProvider } from './remediation/content-provider-registry'
import { createChapter5DetectionProvider } from './reassessment/adapters/chapter-5-detection-provider'
import { createReassessmentService } from './reassessment/reassessment-service'
import {
  buildCoachingRecommendation,
  resolveConceptName,
  summarizeObservation,
} from './presentation/instructor-diagnostics'
import type { IExclusionDatabaseClient } from './reassessment/types'
import type { QuizAttempt } from '@/types'

describe('C5 final adversarial end-to-end certification', () => {
  it('serves the locked lesson, canonical 90-card deck, and 50-question initial quiz', () => {
    expect(chapter5PremiumContent.sections.length).toBeGreaterThan(15)
    expect(chapter5ContentConceptMappings.length).toBeGreaterThan(6)

    expect(chapter5PremiumFlashcards).toHaveLength(90)
    expect(chapter5FlashcardConceptMappings).toHaveLength(90)
    expect(getLocalFlashcards('ch-5')).toHaveLength(90)
    expect(getLocalFlashcards('ch-5').map((c) => c.id)).toEqual(
      chapter5PremiumFlashcards.map((c) => c.id),
    )

    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
    expect(chapter5QuizQuestionConceptMappings).toHaveLength(50)
    expect(getLocalQuizQuestions('quiz-5')).toHaveLength(50)
    expect(getLocalQuizQuestions('quiz-5').map((q) => q.id)).toEqual(
      chapter5PremiumQuizQuestions.map((q) => q.id),
    )
  })

  it('detects an initial-quiz weakness and serves targeted lesson + flashcard remediation', async () => {
    const conceptId = 'ch5-razors'
    const mapped = chapter5QuizQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .slice(0, 5)

    const wrongAnswers: Record<string, string> = {}
    for (const m of mapped) {
      const q = chapter5PremiumQuizQuestions.find((item) => item.id === m.questionId)!
      wrongAnswers[q.id] = q.correct_answer === 'a' ? 'b' : 'a'
    }

    const attempt: QuizAttempt = {
      id: 'c5-e2e-initial',
      user_id: 'student-1',
      quiz_id: 'quiz-5',
      score: 0,
      total_questions: mapped.length,
      percentage: 0,
      answers_json: wrongAnswers,
      completed_at: '2026-09-24T12:00:00.000Z',
    }

    const detection = createChapter5DetectionProvider({
      fetchQuizAttempts: async () => [attempt],
    })
    const result = await detection.detectConceptState(conceptId, [attempt.id])
    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe(conceptId)
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.misses).toBe(5)
    expect(['emerging_weakness', 'repeated_weakness']).toContain(result!.state)

    const contentProvider = getChapterContentProvider('ch-5')!
    const bundle = contentProvider.buildRemediationContentBundle(conceptId)
    expect(bundle.conceptId).toBe(conceptId)
    expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(2)
    expect(bundle.flashcardCount).toBeGreaterThanOrEqual(3)
    expect(bundle.hasSufficientMaterial).toBe(true)
    expect(bundle.contentBlocks.every((block) =>
      chapter5ContentConceptMappings.some((m) =>
        m.conceptFamilyId === conceptId &&
        (m.contentBlockId === block.id ||
          (block.type === 'tabbed' && 'tabs' in block && block.tabs.some((tab) => tab.id === m.contentBlockId)))
      )
    )).toBe(true)
    expect(bundle.flashcards.every((card) =>
      chapter5FlashcardConceptMappings.some((m) => m.flashcardId === card.id && m.conceptFamilyId === conceptId)
    )).toBe(true)
  })

  it('selects unseen concept-targeted reserve questions instead of recycling the initial 50', async () => {
    const conceptId = 'ch5-razors'
    const initialIds = chapter5QuizQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .map((m) => m.questionId)

    const answersJson = Object.fromEntries(initialIds.map((id) => [id, 'a']))
    const reserved: string[] = []

    const db: IExclusionDatabaseClient = {
      async getHistoricalQuizAttempts() {
        return [{
          id: 'hist-1',
          userId: 'student-1',
          quizId: 'quiz-5',
          answersJson,
          completedAt: new Date('2026-09-24T12:00:00Z'),
        }]
      },
      async getReassessmentQuestionHistory() {
        return reserved.map((questionId, index) => ({
          id: `rh-${index}`,
          userId: 'student-1',
          conceptId,
          questionId,
          quizAttemptId: `ra-${index}`,
          cycleId: 'cycle-1',
          isCorrect: false,
          attemptedAt: new Date('2026-09-24T13:00:00Z'),
        }))
      },
      async recordQuestionAttempt(_userId, _conceptId, questionId) {
        reserved.push(questionId)
        return `reservation-${reserved.length}`
      },
      async checkAndRecordPoolExhaustion() { return 'exhaustion-1' },
    }

    const service = createReassessmentService(db, 'ch-5')
    const selected: string[] = []
    for (let i = 0; i < 5; i += 1) {
      const result = await service.selectAndReserveQuestion(
        'student-1', conceptId, 'cycle-1', `reassess-${i}`,
      )
      expect(result.success).toBe(true)
      expect(result.questionId).toBeDefined()
      selected.push(result.questionId!)
    }

    const initial = new Set(chapter5PremiumQuizQuestions.map((q) => q.id))
    const razorReserve = new Set(
      chapter5ReassessmentQuestionConceptMappings
        .filter((m) => m.conceptFamilyId === conceptId)
        .map((m) => m.questionId),
    )
    expect(new Set(selected).size).toBe(5)
    for (const id of selected) {
      expect(initial.has(id), `${id} recycled from initial quiz`).toBe(false)
      expect(razorReserve.has(id), `${id} is not in the razor reserve`).toBe(true)
      expect(getChapterContentProvider('ch-5')!.getQuizQuestionById(id)).not.toBeNull()
    }
  })

  it('accepts reserve evidence in detection and translates it into instructor-safe diagnostics', async () => {
    const conceptId = 'ch5-razors'
    const reserveMappings = chapter5ReassessmentQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .slice(0, 5)

    const answers: Record<string, string> = {}
    for (const m of reserveMappings) {
      const q = chapter5ReassessmentQuestions.find((item) => item.id === m.questionId)!
      answers[q.id] = q.correct_answer
    }

    const attempt: QuizAttempt = {
      id: 'c5-e2e-reassess',
      user_id: 'student-1',
      quiz_id: 'quiz-5',
      score: 5,
      total_questions: 5,
      percentage: 100,
      answers_json: answers,
      completed_at: '2026-09-24T14:00:00.000Z',
    }

    const detection = createChapter5DetectionProvider({
      fetchQuizAttempts: async () => [attempt],
    })
    const result = await detection.detectConceptState(conceptId, [attempt.id])
    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.correct).toBe(5)
    expect(result!.state).toBe('currently_performing_well')

    expect(resolveConceptName(conceptId)).toBe('Razors, Honing & Stropping')
    const summary = summarizeObservation(result!.evidence)
    expect(summary).not.toBeNull()
    expect(summary!.stateLabel).toBe('Performing well')
    expect(summary!.confidenceLabel).toContain('Evidence strength:')

    const coaching = buildCoachingRecommendation(conceptId)
    expect(coaching.confusions[0]?.topic).toBe('Razors, Honing & Stropping')
    expect(coaching.chapterGuidance).toContain('Chapter 5')
    expect(coaching.chapterGuidance).toContain('Knowledge Check')
  })

  it('keeps every family connected across lesson, flashcards, initial quiz, reserve, remediation, and instructor names', () => {
    const provider = getChapterContentProvider('ch-5')!
    for (const family of chapter5ConceptFamilies) {
      expect(chapter5ContentConceptMappings.some((m) => m.conceptFamilyId === family.id)).toBe(true)
      expect(chapter5FlashcardConceptMappings.some((m) => m.conceptFamilyId === family.id)).toBe(true)
      expect(chapter5QuizQuestionConceptMappings.some((m) => m.conceptFamilyId === family.id)).toBe(true)
      expect(chapter5ReassessmentQuestionConceptMappings.filter((m) => m.conceptFamilyId === family.id)).toHaveLength(15)
      expect(provider.buildRemediationContentBundle(family.id).hasSufficientMaterial).toBe(true)
      expect(resolveConceptName(family.id)).toBe(family.name)
    }
  })

  it('keeps the initial and reserve banks disjoint and the complete Chapter 5 pool internally unique', () => {
    const initialIds = new Set(chapter5PremiumQuizQuestions.map((q) => q.id))
    const reserveIds = new Set(chapter5ReassessmentQuestions.map((q) => q.id))
    expect(initialIds.size).toBe(50)
    expect(reserveIds.size).toBe(90)
    for (const id of reserveIds) expect(initialIds.has(id)).toBe(false)

    const allIds = [...initialIds, ...reserveIds]
    expect(new Set(allIds).size).toBe(140)
    expect(new Set(chapter5ReassessmentQuestions.map((q) => q.question.trim().toLowerCase())).size).toBe(90)
  })
})
