import { chapter12QuizQuestionConceptMappings } from '@/lib/chapter-12-concepts/mappings'
import { chapter12ReassessmentReserve } from '@/lib/chapter-12-concepts/reassessment-reserve'
import {
  ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS,
  chapter12ConceptFamilies,
} from '@/lib/chapter-12-concepts/concepts'
import { chapter12PremiumQuizQuestions } from '@/lib/chapter-12-premium-quiz'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptDetectionInput,
} from '@/lib/concept-detection/engine'
import type {
  Chapter12ConceptFamilyId,
  Chapter12LearningObjectiveId,
} from '@/lib/chapter-12-concepts/types'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId, QuizQuestionId } from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../provider-registry'

export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>

export interface Chapter12DetectionProviderConfig {
  fetchQuizAttempts: FetchQuizAttemptsCallback
}

const concepts = chapter12ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter12LearningObjectiveId,
  status: concept.status,
}))

const questionMappings = [
  ...chapter12QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId as string,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter12ReassessmentReserve.map((question) => ({
    questionId: question.id as string,
    conceptId: question.conceptFamilyId,
  })),
]

const correctAnswers = new Map<string, string>([
  ...chapter12PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter12ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const input: ConceptDetectionInput<Chapter12ConceptFamilyId, Chapter12LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export class Chapter12DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-12'
  private readonly conceptToQuestionsMap = new Map<ConceptId, Set<QuizQuestionId>>()
  private readonly validConceptIds = new Set<ConceptId>(
    ACTIVE_CHAPTER12_CONCEPT_FAMILY_IDS as readonly string[],
  )

  constructor(private readonly config: Chapter12DetectionProviderConfig) {
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
      conceptId as Chapter12ConceptFamilyId,
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

export function createChapter12DetectionProvider(config: Chapter12DetectionProviderConfig) {
  return new Chapter12DetectionProvider(config)
}
