import { chapter15QuizQuestionConceptMappings } from '@/lib/chapter-15-concepts/mappings'
import { chapter15ReassessmentReserve } from '@/lib/chapter-15-concepts/reassessment-reserve'
import {
  ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS,
  chapter15ConceptFamilies,
} from '@/lib/chapter-15-concepts/concepts'
import { chapter15PremiumQuizQuestions } from '@/lib/chapter-15-premium-quiz'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptDetectionInput,
} from '@/lib/concept-detection/engine'
import type {
  Chapter15ConceptFamilyId,
  Chapter15LearningObjectiveId,
} from '@/lib/chapter-15-concepts/types'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId, QuizQuestionId } from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../provider-registry'

export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>

export interface Chapter15DetectionProviderConfig {
  fetchQuizAttempts: FetchQuizAttemptsCallback
}

const concepts = chapter15ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter15LearningObjectiveId,
  status: concept.status,
}))

const questionMappings = [
  ...chapter15QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId as string,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter15ReassessmentReserve.map((question) => ({
    questionId: question.id as string,
    conceptId: question.conceptFamilyId,
  })),
]

const correctAnswers = new Map<string, string>([
  ...chapter15PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter15ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const input: ConceptDetectionInput<Chapter15ConceptFamilyId, Chapter15LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export class Chapter15DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-15'
  private readonly conceptToQuestionsMap = new Map<ConceptId, Set<QuizQuestionId>>()
  private readonly validConceptIds = new Set<ConceptId>(
    ACTIVE_CHAPTER15_CONCEPT_FAMILY_IDS as readonly string[],
  )

  constructor(private readonly config: Chapter15DetectionProviderConfig) {
    for (const mapping of questionMappings) {
      const set = this.conceptToQuestionsMap.get(mapping.conceptId) ?? new Set<QuizQuestionId>()
      set.add(mapping.questionId)
      this.conceptToQuestionsMap.set(mapping.conceptId, set)
    }
  }

  async detectConceptState(conceptId: ConceptId, evidenceIds: string[]): Promise<ConceptDetectionResult | null> {
    if (!this.validConceptIds.has(conceptId)) return null
    const attempts = await this.config.fetchQuizAttempts(evidenceIds)
    if (!attempts.length) return null

    const allowed = this.conceptToQuestionsMap.get(conceptId)
    if (!allowed?.size) return null

    const filtered = attempts.map((attempt) => ({
      ...attempt,
      answers_json: Object.fromEntries(
        Object.entries(attempt.answers_json).filter(([questionId]) => allowed.has(questionId)),
      ),
    }))

    const evidence = buildConceptEvidence(
      conceptId as Chapter15ConceptFamilyId,
      filtered,
      input,
    )
    const result = detectConceptState(evidence, input)

    return {
      conceptId: result.conceptId,
      state: result.state,
      confidence: result.confidence,
      evidence: result.evidence,
    }
  }

  isValidConcept(conceptId: ConceptId) {
    return this.validConceptIds.has(conceptId)
  }
}

export function createChapter15DetectionProvider(config: Chapter15DetectionProviderConfig) {
  return new Chapter15DetectionProvider(config)
}
