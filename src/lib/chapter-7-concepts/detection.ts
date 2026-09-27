/**
 * Chapter 7 Concept-Level Learning-Gap Detection (C6-5)
 *
 * Thin Chapter 7 binding over the shared chapter-independent detection engine.
 * Uses the ten locked concept families, the hardened initial assessment, and
 * the C6-5 reassessment reserve without changing shared detection semantics.
 */

import type { Chapter7ConceptFamilyId, Chapter7LearningObjectiveId } from './types'
import { chapter7ConceptFamilies } from './concepts'
import {
  chapter7QuizQuestionConceptMappings,
  chapter7ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter7PremiumQuizQuestions } from '../chapter-7-premium-quiz'
import { chapter7ReassessmentQuestions } from '../chapter-7-reassessment-questions'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter7ConceptFamilyId,
  Chapter7LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter7ConceptFamilyId,
  Chapter7LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter7ConceptFamilyId,
    Chapter7LearningObjectiveId
  >

const chapter7QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter7ConceptFamilyId>[] = [
  ...chapter7QuizQuestionConceptMappings,
  ...chapter7ReassessmentQuestionConceptMappings,
].map((mapping) => ({
  questionId: mapping.questionId,
  conceptId: mapping.conceptFamilyId,
}))

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter7PremiumQuizQuestions, ...chapter7ReassessmentQuestions].map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const chapter7DetectionInput: engine.ConceptDetectionInput<
  Chapter7ConceptFamilyId,
  Chapter7LearningObjectiveId
> = {
  concepts: chapter7ConceptFamilies.map((family) => ({
    ...family,
    learningObjectiveId: family.learningObjectiveIds[0],
  })),
  questionMappings: chapter7QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter7ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter7DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter7DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter7ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter7DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter7ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter7DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter7ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter7LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
