import type {
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId,
} from './types'
import { chapter19ConceptFamilies } from './concepts'
import { chapter19QuizQuestionConceptMappings } from './mappings'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>
export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter19ConceptFamilyId>[] =
  chapter19QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter19PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
)

const concepts = chapter19ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId:
    concept.learningObjectiveIds[0] as Chapter19LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter19ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}

export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter19ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter19ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter19ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter19LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
