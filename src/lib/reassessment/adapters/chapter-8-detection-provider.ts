import { chapter8QuizQuestionConceptMappings } from '@/lib/chapter-8-concepts/mappings'
import { chapter8ReassessmentReserve } from '@/lib/chapter-8-concepts/reassessment-reserve'
import { ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS, chapter8ConceptFamilies } from '@/lib/chapter-8-concepts/concepts'
import { chapter8PremiumQuizQuestions } from '@/lib/chapter-8-premium-quiz'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptDetectionInput,
} from '@/lib/concept-detection/engine'
import type { Chapter8ConceptFamilyId, Chapter8LearningObjectiveId } from '@/lib/chapter-8-concepts/types'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId, QuizQuestionId } from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../provider-registry'

export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>
export interface Chapter8DetectionProviderConfig { fetchQuizAttempts: FetchQuizAttemptsCallback }

const concepts = chapter8ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter8LearningObjectiveId,
  status: concept.status,
}))

const questionMappings = [
  ...chapter8QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId as string,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter8ReassessmentReserve.map((question) => ({
    questionId: question.id as string,
    conceptId: question.conceptFamilyId,
  })),
]

const correctAnswers = new Map<string, string>([
  ...chapter8PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter8ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const input: ConceptDetectionInput<Chapter8ConceptFamilyId, Chapter8LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export class Chapter8DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-8'
  private readonly conceptToQuestionsMap = new Map<ConceptId, Set<QuizQuestionId>>()
  private readonly validConceptIds = new Set<ConceptId>(ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS as readonly string[])

  constructor(private readonly config: Chapter8DetectionProviderConfig) {
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

    const evidence = buildConceptEvidence(conceptId as Chapter8ConceptFamilyId, filtered, input)
    const result = detectConceptState(evidence, input)

    return {
      conceptId: result.conceptId,
      state: result.state,
      confidence: result.confidence,
      evidence: result.evidence,
    }
  }
}

export function createChapter8DetectionProvider(config: Chapter8DetectionProviderConfig) {
  return new Chapter8DetectionProvider(config)
}
