import { describe, expect, it } from 'vitest'
import { chapter4PremiumContent } from './chapter-4-premium'
import { chapter4PremiumFlashcards } from './chapter-4-premium-flashcards'
import { chapter4PremiumQuizQuestions } from './chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from './chapter-4-reassessment-questions'
import { chapter4ConceptFamilies } from './chapter-4-concepts/concepts'
import {
  chapter4ContentConceptMappings,
  chapter4FlashcardConceptMappings,
  chapter4QuizQuestionConceptMappings,
  chapter4ReassessmentQuestionConceptMappings,
} from './chapter-4-concepts/mappings'
import { getLocalFlashcards, getLocalQuizQuestions } from './local-data'
import { getChapterContentProvider } from './remediation/content-provider-registry'
import { createChapter4DetectionProvider } from './reassessment/adapters/chapter-4-detection-provider'
import { createReassessmentService } from './reassessment/reassessment-service'
import {
  buildCoachingRecommendation,
  resolveConceptName,
  summarizeObservation,
} from './presentation/instructor-diagnostics'
import type { IExclusionDatabaseClient } from './reassessment/types'
import type { QuizAttempt } from '@/types'

describe('C4 final adversarial end-to-end certification', () => {
  it('serves the hardened lesson, canonical 70-card deck, 30-question initial quiz, and 90-question reserve', () => {
    expect(chapter4PremiumContent.sections.length).toBeGreaterThan(15)
    expect(chapter4ContentConceptMappings.length).toBeGreaterThan(6)

    expect(chapter4PremiumFlashcards).toHaveLength(70)
    expect(chapter4FlashcardConceptMappings).toHaveLength(70)
    expect(getLocalFlashcards('ch-4')).toHaveLength(70)
    expect(getLocalFlashcards('ch-4').map((c) => c.id)).toEqual(
      chapter4PremiumFlashcards.map((c) => c.id),
    )

    expect(chapter4PremiumQuizQuestions).toHaveLength(30)
    expect(chapter4QuizQuestionConceptMappings).toHaveLength(30)
    expect(getLocalQuizQuestions('quiz-4')).toHaveLength(30)
    expect(getLocalQuizQuestions('quiz-4').map((q) => q.id)).toEqual(
      chapter4PremiumQuizQuestions.map((q) => q.id),
    )

    expect(chapter4ReassessmentQuestions).toHaveLength(90)
    expect(chapter4ReassessmentQuestionConceptMappings).toHaveLength(90)
  })

  it('detects an initial-quiz weakness and serves targeted lesson + flashcard remediation', async () => {
    const conceptId = 'ch4-disinfection-sterilization'
    const mapped = chapter4QuizQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .slice(0, 5)

    expect(mapped).toHaveLength(5)

    const wrongAnswers: Record<string, string> = {}
    for (const m of mapped) {
      const q = chapter4PremiumQuizQuestions.find((item) => item.id === m.questionId)!
      wrongAnswers[q.id] = q.correct_answer === 'a' ? 'b' : 'a'
    }

    const attempt: QuizAttempt = {
      id: 'c4-e2e-initial',
      user_id: 'student-1',
      quiz_id: 'quiz-4',
      score: 0,
      total_questions: mapped.length,
      percentage: 0,
      answers_json: wrongAnswers,
      completed_at: '2026-09-25T08:00:00.000Z',
    }

    const detection = createChapter4DetectionProvider({
      fetchQuizAttempts: async () => [attempt],
    })
    const result = await detection.detectConceptState(conceptId, [attempt.id])

    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe(conceptId)
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.misses).toBe(5)
    expect(['emerging_weakness', 'repeated_weakness']).toContain(result!.state)

    const contentProvider = getChapterContentProvider('ch-4')!
    const bundle = contentProvider.buildRemediationContentBundle(conceptId)
    expect(bundle.conceptId).toBe(conceptId)
    expect(bundle.contentBlockCount).toBeGreaterThanOrEqual(2)
    expect(bundle.flashcardCount).toBeGreaterThanOrEqual(3)
    expect(bundle.hasSufficientMaterial).toBe(true)

    expect(bundle.contentBlocks.every((block) =>
      chapter4ContentConceptMappings.some((m) =>
        m.conceptFamilyId === conceptId &&
        (m.contentBlockId === block.id ||
          (block.type === 'tabbed' && 'tabs' in block && block.tabs.some((tab) => tab.id === m.contentBlockId)))
      )
    )).toBe(true)

    expect(bundle.flashcards.every((card) =>
      chapter4FlashcardConceptMappings.some((m) =>
        m.flashcardId === card.id && m.conceptFamilyId === conceptId
      )
    )).toBe(true)
  })

  it('selects five unseen concept-targeted reserve questions without recycling the initial quiz', async () => {
    const conceptId = 'ch4-disinfection-sterilization'
    const initialIds = chapter4QuizQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .map((m) => m.questionId)

    const answersJson = Object.fromEntries(initialIds.map((id) => [id, 'a']))
    const reserved: string[] = []

    const db: IExclusionDatabaseClient = {
      async getHistoricalQuizAttempts() {
        return [{
          id: 'hist-1',
          userId: 'student-1',
          quizId: 'quiz-4',
          answersJson,
          completedAt: new Date('2026-09-25T08:00:00Z'),
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
          attemptedAt: new Date('2026-09-25T09:00:00Z'),
        }))
      },
      async recordQuestionAttempt(_userId, _conceptId, questionId) {
        reserved.push(questionId)
        return `reservation-${reserved.length}`
      },
      async checkAndRecordPoolExhaustion() { return 'exhaustion-1' },
    }

    const service = createReassessmentService(db, 'ch-4')
    const selected: string[] = []

    for (let i = 0; i < 5; i += 1) {
      const result = await service.selectAndReserveQuestion(
        'student-1',
        conceptId,
        'cycle-1',
        `reassess-${i}`,
      )
      expect(result.success).toBe(true)
      expect(result.questionId).toBeDefined()
      selected.push(result.questionId!)
    }

    const initial = new Set(chapter4PremiumQuizQuestions.map((q) => q.id))
    const reserve = new Set<string>(
      chapter4ReassessmentQuestionConceptMappings
        .filter((m) => m.conceptFamilyId === conceptId)
        .map((m) => m.questionId),
    )

    expect(new Set(selected).size).toBe(5)
    for (const id of selected) {
      expect(initial.has(id), `${id} recycled from initial quiz`).toBe(false)
      expect(reserve.has(id), `${id} is not in the target reserve`).toBe(true)
      expect(getChapterContentProvider('ch-4')!.getQuizQuestionById(id as `qq-4-${string}`)).not.toBeNull()
    }
  })

  it('accepts reassessment evidence and translates the result into instructor-safe diagnostics', async () => {
    const conceptId = 'ch4-disinfection-sterilization'
    const reserveMappings = chapter4ReassessmentQuestionConceptMappings
      .filter((m) => m.conceptFamilyId === conceptId)
      .slice(0, 5)

    const answers: Record<string, string> = {}
    for (const m of reserveMappings) {
      const q = chapter4ReassessmentQuestions.find((item) => item.id === m.questionId)!
      answers[q.id] = q.correct_answer
    }

    const attempt: QuizAttempt = {
      id: 'c4-e2e-reassess',
      user_id: 'student-1',
      quiz_id: 'quiz-4',
      score: 5,
      total_questions: 5,
      percentage: 100,
      answers_json: answers,
      completed_at: '2026-09-25T10:00:00.000Z',
    }

    const detection = createChapter4DetectionProvider({
      fetchQuizAttempts: async () => [attempt],
    })
    const result = await detection.detectConceptState(conceptId, [attempt.id])

    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.correct).toBe(5)
    expect(result!.state).toBe('currently_performing_well')

    const family = chapter4ConceptFamilies.find((item) => item.id === conceptId)!
    expect(resolveConceptName(conceptId)).toBe(family.name)

    const summary = summarizeObservation(result!.evidence)
    expect(summary).not.toBeNull()
    expect(summary!.stateLabel).toBe('Performing well')
    expect(summary!.confidenceLabel).toContain('Evidence strength:')
    expect(summary!.stateLabel).not.toContain(conceptId)

    const coaching = buildCoachingRecommendation(conceptId)
    expect(coaching.confusions[0]?.topic).toBe(family.name)
    expect(coaching.chapterGuidance).toContain('Chapter 4')
    expect(coaching.chapterGuidance).toContain('Knowledge Check')
    expect(coaching.chapterGuidance).not.toContain(conceptId)
  })

  it('keeps every Chapter 4 family connected across lesson, flashcards, initial quiz, reserve, remediation, and instructor presentation', () => {
    const provider = getChapterContentProvider('ch-4')!

    for (const family of chapter4ConceptFamilies) {
      expect(chapter4ContentConceptMappings.some((m) => m.conceptFamilyId === family.id), family.id).toBe(true)
      expect(chapter4FlashcardConceptMappings.some((m) => m.conceptFamilyId === family.id), family.id).toBe(true)
      expect(chapter4QuizQuestionConceptMappings.some((m) => m.conceptFamilyId === family.id), family.id).toBe(true)
      expect(
        chapter4ReassessmentQuestionConceptMappings.filter((m) => m.conceptFamilyId === family.id),
      ).toHaveLength(15)
      expect(provider.buildRemediationContentBundle(family.id).hasSufficientMaterial, family.id).toBe(true)
      expect(resolveConceptName(family.id)).toBe(family.name)
    }
  })

  it('keeps the initial and reserve banks disjoint and the complete Chapter 4 question pool internally unique', () => {
    const initialIds = new Set(chapter4PremiumQuizQuestions.map((q) => q.id))
    const reserveIds = new Set(chapter4ReassessmentQuestions.map((q) => q.id))

    expect(initialIds.size).toBe(30)
    expect(reserveIds.size).toBe(90)
    for (const id of reserveIds) expect(initialIds.has(id)).toBe(false)

    const allIds = [...initialIds, ...reserveIds]
    expect(new Set(allIds).size).toBe(120)
    expect(new Set(chapter4ReassessmentQuestions.map((q) => q.question.trim().toLowerCase())).size).toBe(90)
  })
})
