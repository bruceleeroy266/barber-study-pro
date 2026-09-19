/**
 * Chapter 5 Concept-Level Learning-Gap Detection (C5-3)
 *
 * Thin Chapter 5 binding over the shared chapter-independent detection engine.
 * Uses the six locked C5-1 concept families, canonical 50-question mappings,
 * and canonical Chapter 5 quiz answers. Reassessment evidence can be added
 * later without changing initial-quiz detection semantics.
 */

import type { Chapter5ConceptFamilyId, Chapter5LearningObjectiveId } from './types'
import { chapter5ConceptFamilies } from './concepts'
import { chapter5QuizQuestionConceptMappings } from './mappings'
import { chapter5PremiumQuizQuestions } from '../chapter-5-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter5ConceptFamilyId,
  Chapter5LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter5ConceptFamilyId,
  Chapter5LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter5ConceptFamilyId,
    Chapter5LearningObjectiveId
  >

const chapter5QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter5ConceptFamilyId>[] =
  chapter5QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  chapter5PremiumQuizQuestions.map((question) => [
    question.id,
    question.correct_answer,
  ]),
)

const chapter5DetectionInput: engine.ConceptDetectionInput<
  Chapter5ConceptFamilyId,
  Chapter5LearningObjectiveId
> = {
  concepts: chapter5ConceptFamilies,
  questionMappings: chapter5QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter5ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(
    conceptFamilyId,
    quizAttempts,
    chapter5DetectionInput,
  )
}

export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter5DetectionInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter5ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter5DetectionInput)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter5ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(
    quizAttempts,
    chapter5DetectionInput,
  )
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter5ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter5LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
