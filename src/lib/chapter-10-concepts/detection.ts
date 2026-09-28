/**
 * Chapter 10 concept-level learning-gap detection.
 *
 * Thin Chapter 10 binding over the shared chapter-independent detection engine.
 */
import type { Chapter10ConceptFamilyId, Chapter10LearningObjectiveId } from './types'
import { chapter10ConceptFamilies } from './concepts'
import { chapter10QuizQuestionConceptMappings } from './mappings'
import { chapter10ReassessmentReserve } from './reassessment-reserve'
import { chapter10PremiumQuizQuestions } from '../chapter-10-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter10ConceptFamilyId,
  Chapter10LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter10ConceptFamilyId,
  Chapter10LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter10ConceptFamilyId,
    Chapter10LearningObjectiveId
  >

const chapter10QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter10ConceptFamilyId>[] = [
  ...chapter10QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter10ReassessmentReserve.map((question) => ({
    questionId: question.id,
    conceptId: question.conceptFamilyId,
  })),
]

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map([
  ...chapter10PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter10ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const detectionConcepts = chapter10ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter10LearningObjectiveId,
  status: concept.status,
}))

const chapter10DetectionInput: engine.ConceptDetectionInput<
  Chapter10ConceptFamilyId,
  Chapter10LearningObjectiveId
> = {
  concepts: detectionConcepts,
  questionMappings: chapter10QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter10ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter10DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter10DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter10ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter10DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter10ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter10DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter10ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter10LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
