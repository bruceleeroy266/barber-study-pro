/**
 * Chapter 8 Concept-Level Learning-Gap Detection (C8-7)
 *
 * Thin Chapter 8 binding over the shared chapter-independent detection engine.
 * Uses the ten canonical concept families, hardened initial assessment, and
 * the 50-question reassessment reserve without changing shared detection semantics.
 */

import type { Chapter8ConceptFamilyId, Chapter8LearningObjectiveId } from './types'
import { chapter8ConceptFamilies } from './concepts'
import { chapter8QuizQuestionConceptMappings } from './mappings'
import { chapter8ReassessmentReserve } from './reassessment-reserve'
import { chapter8PremiumQuizQuestions } from '../chapter-8-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter8ConceptFamilyId,
  Chapter8LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter8ConceptFamilyId,
  Chapter8LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter8ConceptFamilyId,
    Chapter8LearningObjectiveId
  >

const chapter8QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter8ConceptFamilyId>[] = [
  ...chapter8QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter8ReassessmentReserve.map((question) => ({
    questionId: question.id,
    conceptId: question.conceptFamilyId,
  })),
]

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map([
  ...chapter8PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter8ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const detectionConcepts = chapter8ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter8LearningObjectiveId,
  status: concept.status,
}))

const chapter8DetectionInput: engine.ConceptDetectionInput<
  Chapter8ConceptFamilyId,
  Chapter8LearningObjectiveId
> = {
  concepts: detectionConcepts,
  questionMappings: chapter8QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter8ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter8DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter8DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter8ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter8DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter8ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter8DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter8ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter8LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
