/**
 * Chapter 6 Concept-Level Learning-Gap Detection (C6-5)
 *
 * Thin Chapter 6 binding over the shared chapter-independent detection engine.
 * Uses the ten locked concept families, the hardened initial assessment, and
 * the C6-5 reassessment reserve without changing shared detection semantics.
 */

import type { Chapter6ConceptFamilyId, Chapter6LearningObjectiveId } from './types'
import { chapter6ConceptFamilies } from './concepts'
import {
  chapter6QuizQuestionConceptMappings,
  chapter6ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter6PremiumQuizQuestions } from '../chapter-6-premium-quiz'
import { chapter6ReassessmentQuestions } from '../chapter-6-reassessment-questions'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter6ConceptFamilyId,
  Chapter6LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter6ConceptFamilyId,
  Chapter6LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter6ConceptFamilyId,
    Chapter6LearningObjectiveId
  >

const chapter6QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter6ConceptFamilyId>[] = [
  ...chapter6QuizQuestionConceptMappings,
  ...chapter6ReassessmentQuestionConceptMappings,
].map((mapping) => ({
  questionId: mapping.questionId,
  conceptId: mapping.conceptFamilyId,
}))

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter6PremiumQuizQuestions, ...chapter6ReassessmentQuestions].map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const chapter6DetectionInput: engine.ConceptDetectionInput<
  Chapter6ConceptFamilyId,
  Chapter6LearningObjectiveId
> = {
  concepts: chapter6ConceptFamilies,
  questionMappings: chapter6QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter6ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter6DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter6DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter6ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter6DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter6ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter6DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter6ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter6LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
