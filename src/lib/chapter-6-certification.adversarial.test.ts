/**
 * C6-7 — Final Chapter 6 Certification & Adversarial Audit
 *
 * Cross-layer certification of the complete Chapter 6 chain:
 * lesson → flashcards → initial assessment → detection → targeted remediation
 * → unseen reassessment → recovery detection → instructor presentation.
 *
 * This suite intentionally tests isolation and failure boundaries rather than
 * repeating only happy-path count assertions from C6-1..C6-6.
 */

import { describe, expect, it } from 'vitest'
import type { QuizAttempt } from '@/types'
import type {
  ConceptId,
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  ReassessmentQuestionHistoryRecord,
} from '@/lib/reassessment/types'
import { chapter6PremiumContent } from '@/lib/chapter-6-premium'
import { chapter6PremiumFlashcards } from '@/lib/chapter-6-premium-flashcards'
import { getLocalFlashcards, getLocalQuiz, getLocalQuizQuestions } from '@/lib/local-data'
import { getChapterContent } from '@/lib/chapter-content'
import { chapter6PremiumQuizQuestions } from '@/lib/chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '@/lib/chapter-6-reassessment-questions'
import {
  ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS,
  chapter6ConceptFamilies,
  chapter6LearningObjectives,
} from '@/lib/chapter-6-concepts/concepts'
import {
  chapter6ContentConceptMappings,
  chapter6FlashcardConceptMappings,
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-6-concepts/mappings'
import { detectAllConceptGaps } from '@/lib/chapter-6-concepts/detection'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import {
  DetectionOrchestratorService,
  type IDetectionOrchestratorDbClient,
} from '@/lib/remediation/detection-orchestrator'
import { createHistoricalExclusionEngine } from '@/lib/reassessment/exclusion-engine'
import {
  getCanonicalMappingProvider,
  initializeChapterDetectionProvider,
} from '@/lib/reassessment/provider-registry'
import {
  buildCoachingRecommendation,
  resolveChapterTitle,
  resolveConceptName,
  summarizeObservation,
  translateStoredDetectionSummary,
} from '@/lib/presentation/instructor-diagnostics'
import type {
  ConceptEvidence,
  DetectionConfidence,
  DetectionState,
} from '@/lib/concept-detection/engine'

function wrongAnswer(correct: string): string {
  return ['a', 'b', 'c', 'd'].find((answer) => answer !== correct) ?? 'a'
}

function selectiveInitialAttempt(targetConceptId: ConceptId, id = 'initial-selective'): QuizAttempt {
  const answers = Object.fromEntries(chapter6PremiumQuizQuestions.map((question) => {
    const mapped = chapter6QuizQuestionConceptMappings.find((m) => m.questionId === question.id)
    const answer = mapped?.conceptFamilyId === targetConceptId
      ? wrongAnswer(question.correct_answer)
      : question.correct_answer
    return [question.id, answer]
  }))

  const correct = Object.entries(answers).filter(([questionId, answer]) => {
    return chapter6PremiumQuizQuestions.find((q) => q.id === questionId)?.correct_answer === answer
  }).length

  return {
    id,
    user_id: 'student-c6-cert',
    quiz_id: 'quiz-6',
    score: correct,
    total_questions: 50,
    percentage: (correct / 50) * 100,
    answers_json: answers,
    completed_at: '2026-09-24T04:00:00.000Z',
  }
}

function correctReassessmentAttempt(targetConceptId: ConceptId, id = 'reassess-recovery'): QuizAttempt {
  const mappedIds = chapter6ReassessmentQuestionConceptMappings
    .filter((m) => m.conceptFamilyId === targetConceptId)
    .slice(0, 5)
    .map((m) => m.questionId)

  return {
    id,
    user_id: 'student-c6-cert',
    quiz_id: 'quiz-6',
    score: 5,
    total_questions: 5,
    percentage: 100,
    answers_json: Object.fromEntries(mappedIds.map((questionId) => {
      const question = chapter6ReassessmentQuestions.find((q) => q.id === questionId)!
      return [questionId, question.correct_answer]
    })),
    completed_at: '2026-09-24T04:10:00.000Z',
  }
}

interface CreatedCycle {
  id: string
  conceptId: ConceptId
  chapterId: string
  assignments: Array<{
    assignmentType: 'content_block' | 'flashcard'
    assetId: string
    priority: number
    isPrimary: boolean
  }>
  detectionState: DetectionState
  detectionConfidence: DetectionConfidence
  detectionEvidence: ConceptEvidence
}

class IsolationHandoffDb implements IDetectionOrchestratorDbClient {
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
    chapterId: string
    cycleNumber: number
    detectionState: DetectionState
    detectionConfidence: DetectionConfidence
    detectionEvidence: ConceptEvidence
    status: 'targeted'
    assignments: CreatedCycle['assignments']
  }) {
    const id = `cert-cycle-${this.created.length + 1}`
    this.created.push({
      id,
      conceptId: data.conceptId,
      chapterId: data.chapterId,
      assignments: data.assignments,
      detectionState: data.detectionState,
      detectionConfidence: data.detectionConfidence,
      detectionEvidence: data.detectionEvidence,
    })
    this.active.set(`${data.userId}:${data.conceptId}`, { id })
    return id
  }

  async getNextCycleNumber() {
    return 1
  }
}

class CapacityExclusionDb implements IExclusionDatabaseClient {
  readonly history: ReassessmentQuestionHistoryRecord[] = []
  exhausted = false

  constructor(private readonly attempts: HistoricalQuizAttempt[]) {}

  async getHistoricalQuizAttempts() {
    return this.attempts
  }

  async getReassessmentQuestionHistory(_userId: string, conceptId: ConceptId) {
    return this.history.filter((record) => record.conceptId === conceptId)
  }

  async recordQuestionAttempt() {
    return 'unused'
  }

  async checkAndRecordPoolExhaustion() {
    this.exhausted = true
    return 'cert-exhaustion'
  }

  consume(userId: string, conceptId: ConceptId, questionId: string, index: number) {
    this.history.push({
      id: `history-${conceptId}-${index}`,
      userId,
      conceptId,
      questionId,
      quizAttemptId: `reassess-attempt-${conceptId}-${index}`,
      cycleId: `cycle-${Math.floor(index / 5) + 1}`,
      isCorrect: true,
      attemptedAt: new Date(`2026-09-24T04:${String(index).padStart(2, '0')}:00.000Z`),
    })
  }
}

function extractReassessmentCue(question: string): string {
  const patterns = [
    /^Which statement BEST applies to (.+)\?$/,
    /^A student is reviewing (.+)\. Which correction is MOST accurate\?$/,
    /^On a difficult exam item about (.+), which choice should remain after eliminating the inaccurate options\?$/,
  ]
  for (const pattern of patterns) {
    const match = question.match(pattern)
    if (match) return match[1]
  }
  throw new Error(`Unrecognized Chapter 6 reassessment stem: ${question}`)
}

describe('C6-7 final Chapter 6 certification', () => {
  it('locks one coherent canonical chain with no orphaned or duplicate assets', () => {
    expect(chapter6LearningObjectives).toHaveLength(10)
    expect(chapter6ConceptFamilies).toHaveLength(10)
    expect(chapter6PremiumContent.sections.length).toBeGreaterThan(10)
    expect(chapter6PremiumFlashcards).toHaveLength(105)
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    expect(chapter6ReassessmentQuestions).toHaveLength(150)

    const contentIds = new Set(chapter6PremiumContent.sections.map((section) => section.id))
    const flashcardIds = chapter6PremiumFlashcards.map((card) => card.id)
    const initialIds = chapter6PremiumQuizQuestions.map((question) => question.id)
    const reserveIds = chapter6ReassessmentQuestions.map((question) => question.id)

    expect(new Set(flashcardIds).size).toBe(105)
    expect(new Set(initialIds).size).toBe(50)
    expect(new Set(reserveIds).size).toBe(150)
    expect(initialIds.some((id) => reserveIds.includes(id))).toBe(false)

    for (const familyId of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const content = chapter6ContentConceptMappings.filter((m) => m.conceptFamilyId === familyId)
      const cards = chapter6FlashcardConceptMappings.filter((m) => m.conceptFamilyId === familyId)
      const initial = chapter6QuizQuestionConceptMappings.filter((m) => m.conceptFamilyId === familyId)
      const reserve = chapter6ReassessmentQuestionConceptMappings.filter((m) => m.conceptFamilyId === familyId)

      expect(content).toHaveLength(1)
      expect(contentIds.has(content[0].contentBlockId)).toBe(true)
      expect(cards.length).toBeGreaterThanOrEqual(7)
      expect(initial.length).toBeGreaterThanOrEqual(4)
      expect(reserve).toHaveLength(15)

      expect(cards.every((m) => flashcardIds.includes(m.flashcardId))).toBe(true)
      expect(initial.every((m) => initialIds.includes(m.questionId))).toBe(true)
      expect(reserve.every((m) => reserveIds.includes(m.questionId))).toBe(true)
    }
  })

  it('serves the certified lesson, 105-card deck, and 50-question quiz through the normal student path', () => {
    const content = getChapterContent(6)
    const quiz = getLocalQuiz('ch-6')
    const questions = quiz ? getLocalQuizQuestions(quiz.id) : []
    const served = getLocalFlashcards('ch-6')

    expect(content).toBe(chapter6PremiumContent)
    expect(quiz?.id).toBe('quiz-6')
    expect(quiz?.passing_score).toBe(80)
    expect(questions).toHaveLength(50)
    expect(questions.map((question) => question.id)).toEqual(
      chapter6PremiumQuizQuestions.map((question) => question.id),
    )
    expect(served).toHaveLength(105)
    expect(served.map((card) => card.id)).toEqual(chapter6PremiumFlashcards.map((card) => card.id))
    expect(served.map((card) => card.front)).toEqual(chapter6PremiumFlashcards.map((card) => card.front))
    expect(served.every((card) => /^fc-6-\d{3}$/.test(card.id))).toBe(true)
    expect(served.some((card) => card.id.startsWith('fc-6o-'))).toBe(false)
  })

  it('keeps both assessment banks difficult, complete, strategy-guided, and internally unique', () => {
    const allQuestions = [...chapter6PremiumQuizQuestions, ...chapter6ReassessmentQuestions]
    expect(allQuestions).toHaveLength(200)
    expect(new Set(allQuestions.map((q) => q.id)).size).toBe(200)

    for (const question of allQuestions) {
      expect(question.difficulty).toBe('hard')
      expect(['a', 'b', 'c', 'd']).toContain(question.correct_answer)
      expect([question.answer_a, question.answer_b, question.answer_c, question.answer_d].every(Boolean)).toBe(true)
      expect(new Set([question.answer_a, question.answer_b, question.answer_c, question.answer_d]).size).toBe(4)
      expect(question.explanation).toContain('Read carefully')
      expect(question.explanation).toMatch(/Identify the keyword/i)
      expect(question.explanation).toMatch(/Eliminate/i)
      expect(question.explanation).toMatch(/safety\/procedure logic/i)
      expect(question.explanation).toMatch(/best remaining/i)
    }

    expect(new Set(chapter6PremiumQuizQuestions.map((q) => q.question)).size).toBe(50)
    expect(new Set(chapter6ReassessmentQuestions.map((q) => q.question)).size).toBe(150)
  })

  it('proves single-family misses never contaminate any of the other nine concept families', async () => {
    for (const target of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const attempt = selectiveInitialAttempt(target, `selective-${target}`)
      const results = detectAllConceptGaps([attempt])

      expect(results.get(target)?.state).toBe('repeated_weakness')
      expect(results.get(target)?.evidence.misses).toBe(
        chapter6QuizQuestionConceptMappings.filter((m) => m.conceptFamilyId === target).length,
      )

      for (const other of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS.filter((id) => id !== target)) {
        expect(results.get(other)?.state).toBe('currently_performing_well')
        expect(results.get(other)?.evidence.misses).toBe(0)
      }

      const db = new IsolationHandoffDb([attempt])
      const orchestration = await new DetectionOrchestratorService(db)
        .orchestrateAfterQuizCompletion('student-c6-cert', 'ch-6', attempt.id)

      expect(orchestration.success).toBe(true)
      expect(orchestration.cyclesCreated).toBe(1)
      expect(orchestration.conceptsDetected).toEqual([target])
      expect(db.created).toHaveLength(1)
      expect(db.created[0].conceptId).toBe(target)

      const expectedAssets = [
        ...chapter6ContentConceptMappings.filter((m) => m.conceptFamilyId === target).map((m) => m.contentBlockId),
        ...chapter6FlashcardConceptMappings.filter((m) => m.conceptFamilyId === target).map((m) => m.flashcardId),
      ]
      expect(db.created[0].assignments.map((a) => a.assetId)).toEqual(expectedAssets)
    }
  })

  it('serves only concept-targeted lesson and flashcard remediation assets', () => {
    const provider = getChapterContentProvider('ch-6')
    expect(provider).toBeDefined()

    for (const familyId of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const foreignCardIds = new Set<string>(
        chapter6FlashcardConceptMappings
          .filter((m) => m.conceptFamilyId !== familyId)
          .map((m) => m.flashcardId),
      )
      const bundle = provider!.buildRemediationContentBundle(familyId)

      expect(bundle.conceptId).toBe(familyId)
      expect(bundle.contentBlockCount).toBe(1)
      expect(bundle.flashcardCount).toBeGreaterThanOrEqual(7)
      expect(bundle.flashcards.some((card) => foreignCardIds.has(card.id))).toBe(false)
      expect(provider!.getQuizQuestionById(
        chapter6ReassessmentQuestionConceptMappings.find((m) => m.conceptFamilyId === familyId)!.questionId,
      )).not.toBeNull()
    }
  })

  it('gives every five-question reassessment cycle five distinct factual targets', () => {
    for (const familyId of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const ids = chapter6ReassessmentQuestionConceptMappings
        .filter((mapping) => mapping.conceptFamilyId === familyId)
        .map((mapping) => mapping.questionId)

      expect(ids).toHaveLength(15)

      for (let cycle = 0; cycle < 3; cycle++) {
        const cycleQuestions = ids
          .slice(cycle * 5, cycle * 5 + 5)
          .map((id) => chapter6ReassessmentQuestions.find((question) => question.id === id)!)

        const cues = cycleQuestions.map((question) => extractReassessmentCue(question.question))
        expect(new Set(cues).size).toBe(5)
      }
    }
  })

  it('preserves concept identity through reassessment and recognizes five correct unseen answers as recovery', async () => {
    const mappingProvider = getCanonicalMappingProvider('ch-6')
    const detectionProvider = initializeChapterDetectionProvider('ch-6', {
      fetchQuizAttempts: async () => [],
    })
    expect(detectionProvider).toBeDefined()

    for (const target of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const initial = selectiveInitialAttempt(target, `initial-${target}`)
      const recovery = correctReassessmentAttempt(target, `recovery-${target}`)
      const targetReserveIds = Object.keys(recovery.answers_json)

      expect(targetReserveIds).toHaveLength(5)
      for (const questionId of targetReserveIds) {
        expect(mappingProvider.getConceptForQuestion(questionId)).toBe(target)
        expect(mappingProvider.isQuestionMappedToConcept(questionId, target)).toBe(true)
      }

      const results = detectAllConceptGaps([initial, recovery])
      const recovered = results.get(target)
      expect(recovered?.state).toBe('currently_performing_well')
      expect(recovered?.evidence.correct).toBe(5)
      expect(recovered?.evidence.consecutiveRecentCorrect).toBe(3)

      for (const other of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS.filter((id) => id !== target)) {
        expect(results.get(other)?.evidence.misses).toBe(0)
      }
    }
  })

  it('provides exactly three five-question unseen cycles per family before explicit pool exhaustion', async () => {
    const userId = 'student-c6-capacity'

    for (const target of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) {
      const initialIds = chapter6QuizQuestionConceptMappings
        .filter((m) => m.conceptFamilyId === target)
        .map((m) => m.questionId)

      const historical: HistoricalQuizAttempt = {
        id: `history-${target}`,
        userId,
        quizId: 'quiz-6',
        answersJson: Object.fromEntries(initialIds.map((id) => [id, 'a'])),
        completedAt: new Date('2026-09-24T04:00:00.000Z'),
      }

      const db = new CapacityExclusionDb([historical])
      const engine = createHistoricalExclusionEngine(db, 'ch-6')
      const selected: string[] = []

      for (let i = 0; i < 15; i++) {
        const result = await engine.selectReassessmentQuestion(userId, target, `cycle-${Math.floor(i / 5) + 1}`)
        expect(result.success).toBe(true)
        expect(result.selectedQuestionId).toBeDefined()
        const questionId = result.selectedQuestionId!
        expect(chapter6ReassessmentQuestionConceptMappings.find((m) => m.questionId === questionId)?.conceptFamilyId).toBe(target)
        expect(initialIds).not.toContain(questionId)
        expect(selected).not.toContain(questionId)
        selected.push(questionId)
        db.consume(userId, target, questionId, i)
      }

      expect(selected).toHaveLength(15)
      expect(new Set(selected).size).toBe(15)

      const exhausted = await engine.selectReassessmentQuestion(userId, target, 'cycle-4')
      expect(exhausted.success).toBe(false)
      expect(exhausted.poolExhaustion?.isExhausted).toBe(true)
      expect(db.exhausted).toBe(true)
    }
  })

  it('keeps instructor presentation readable, scope-safe, and free of Chapter 6 engine identifiers', () => {
    expect(resolveChapterTitle('ch-6')).toBe('General Anatomy and Physiology (Chapter 6)')

    for (const family of chapter6ConceptFamilies) {
      const attempt = selectiveInitialAttempt(family.id, `presentation-${family.id}`)
      const result = detectAllConceptGaps([attempt]).get(family.id)!
      const observation = summarizeObservation(result.evidence)
      const coaching = buildCoachingRecommendation(family.id)
      const state = translateStoredDetectionSummary(result.state)
      const conceptName = resolveConceptName(family.id)

      expect(conceptName).toBe(family.name)
      expect(observation).not.toBeNull()
      expect(observation!.stateLabel).toBe('Repeated difficulty')
      expect(observation!.confidenceLabel).toContain('Evidence strength:')
      expect(observation!.confidenceLabel).not.toContain('confidence')
      expect(state).toBe('Repeated difficulty')
      expect(coaching.chapterGuidance).toContain('without diagnosing')

      const renderedText = JSON.stringify({
        conceptName,
        chapterTitle: resolveChapterTitle('ch-6'),
        state,
        observation,
        coaching,
      })
      expect(renderedText).not.toContain(family.id)
      expect(renderedText).not.toContain('repeated_weakness')
      expect(renderedText).not.toContain('qq-6-')
      expect(renderedText).not.toContain('fc-6-')
    }
  })
})
