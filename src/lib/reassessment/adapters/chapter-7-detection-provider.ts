import {
  chapter7QuizQuestionConceptMappings,
  chapter7ReassessmentQuestionConceptMappings,
} from '@/lib/chapter-7-concepts/mappings'
import {
  ACTIVE_CHAPTER7_CONCEPT_FAMILY_IDS,
  chapter7ConceptFamilies,
} from '@/lib/chapter-7-concepts/concepts'
import { chapter7PremiumQuizQuestions } from '@/lib/chapter-7-premium-quiz'
import { chapter7ReassessmentQuestions } from '@/lib/chapter-7-reassessment-questions'
import {
  buildConceptEvidence,
  detectConceptState,
  type ConceptDetectionInput,
} from '@/lib/concept-detection/engine'
import type { Chapter7ConceptFamilyId, Chapter7LearningObjectiveId } from '@/lib/chapter-7-concepts/types'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId, QuizQuestionId } from '../types'
import type { IConceptDetectionProvider, ConceptDetectionResult } from '../provider-registry'

export type FetchQuizAttemptsCallback = (attemptIds: string[]) => Promise<QuizAttempt[]>

export interface Chapter7DetectionProviderConfig {
  fetchQuizAttempts: FetchQuizAttemptsCallback
}

const concepts = chapter7ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter7LearningObjectiveId,
  status: concept.status,
}))

const questionMappings = [
  ...chapter7QuizQuestionConceptMappings,
  ...chapter7ReassessmentQuestionConceptMappings,
].map((mapping) => ({
  questionId: mapping.questionId as string,
  conceptId: mapping.conceptFamilyId,
}))

const correctAnswers = new Map<string, string>([
  ...chapter7PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter7ReassessmentQuestions.map((question) => [question.id, question.correct_answer] as const),
])

const input: ConceptDetectionInput<Chapter7ConceptFamilyId, Chapter7LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export class Chapter7DetectionProvider implements IConceptDetectionProvider {
  readonly chapterId: ChapterId = 'ch-7'
  private readonly conceptToQuestionsMap = new Map<ConceptId, Set<QuizQuestionId>>()
  private readonly validConceptIds = new Set<ConceptId>(
    ACTIVE_CHAPTER7_CONCEPT_FAMILY_IDS as readonly string[],
  )

  constructor(private readonly config: Chapter7DetectionProviderConfig) {
    for (const mapping of questionMappings) {
      const set = this.conceptToQuestionsMap.get(mapping.conceptId) ?? new Set<QuizQuestionId>()
      set.add(mapping.questionId)
      this.conceptToQuestionsMap.set(mapping.conceptId, set)
    }
  }

  async detectConceptState(
    conceptId: ConceptId,
    evidenceIds: string[],
  ): Promise<ConceptDetectionResult | null> {
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
      conceptId as Chapter7ConceptFamilyId,
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

export function createChapter7DetectionProvider(config: Chapter7DetectionProviderConfig) {
  return new Chapter7DetectionProvider(config)
}
