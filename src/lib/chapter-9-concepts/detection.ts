/**
 * Chapter 9 Concept-Level Learning-Gap Detection (G3)
 *
 * Thin Chapter 9 binding over the shared chapter-independent detection engine.
 * Uses the canonical Chapter 9 concept families, initial assessment, and
 * locked reassessment reserve without changing shared detection semantics.
 */

import type { Chapter9ConceptFamilyId, Chapter9LearningObjectiveId } from './types'
import { chapter9ConceptFamilies } from './concepts'
import { chapter9QuizQuestionConceptMappings } from './mappings'
import { chapter9ReassessmentReserve } from './reassessment-reserve'
import { chapter9PremiumQuizQuestions } from '../chapter-9-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter9ConceptFamilyId,
  Chapter9LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter9ConceptFamilyId,
  Chapter9LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter9ConceptFamilyId,
    Chapter9LearningObjectiveId
  >

const chapter9QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter9ConceptFamilyId>[] = [
  ...chapter9QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter9ReassessmentReserve.map((question) => ({
    questionId: question.id,
    conceptId: question.conceptFamilyId,
  })),
]

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map([
  ...chapter9PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter9ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const detectionConcepts = chapter9ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter9LearningObjectiveId,
  status: concept.status,
}))

const chapter9DetectionInput: engine.ConceptDetectionInput<
  Chapter9ConceptFamilyId,
  Chapter9LearningObjectiveId
> = {
  concepts: detectionConcepts,
  questionMappings: chapter9QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter9ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter9DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter9DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter9ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter9DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter9ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter9DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter9ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter9LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
