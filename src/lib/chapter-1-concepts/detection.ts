/**
 * Chapter 1 Concept-Level Learning-Gap Detection (C6-5)
 *
 * Thin Chapter 1 binding over the shared chapter-independent detection engine.
 * Uses the ten locked concept families, the hardened initial assessment, and
 * the C6-5 reassessment reserve without changing shared detection semantics.
 */

import type { Chapter1ConceptFamilyId, Chapter1LearningObjectiveId } from './types'
import { chapter1ConceptFamilies } from './concepts'
import {
  chapter1QuizQuestionConceptMappings,
  chapter1ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter1PremiumQuizQuestions } from '../chapter-1-premium-quiz'
import { chapter1ReassessmentQuestions } from '../chapter-1-reassessment-questions'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter1ConceptFamilyId,
  Chapter1LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter1ConceptFamilyId,
  Chapter1LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter1ConceptFamilyId,
    Chapter1LearningObjectiveId
  >

const chapter1QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter1ConceptFamilyId>[] = [
  ...chapter1QuizQuestionConceptMappings,
  ...chapter1ReassessmentQuestionConceptMappings,
].map((mapping) => ({
  questionId: mapping.questionId,
  conceptId: mapping.conceptFamilyId,
}))

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter1PremiumQuizQuestions, ...chapter1ReassessmentQuestions].map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const chapter1DetectionInput: engine.ConceptDetectionInput<
  Chapter1ConceptFamilyId,
  Chapter1LearningObjectiveId
> = {
  concepts: chapter1ConceptFamilies,
  questionMappings: chapter1QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter1ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, chapter1DetectionInput)
}

export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter1DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter1ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter1DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter1ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, chapter1DetectionInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter1ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter1LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
