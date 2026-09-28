/**
 * Chapter 12 concept-level learning-gap detection.
 * Thin Chapter 12 binding over the shared chapter-independent detection engine.
 */
import type { Chapter12ConceptFamilyId, Chapter12LearningObjectiveId } from './types'
import { chapter12ConceptFamilies } from './concepts'
import { chapter12QuizQuestionConceptMappings } from './mappings'
import { chapter12ReassessmentReserve } from './reassessment-reserve'
import { chapter12PremiumQuizQuestions } from '../chapter-12-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter12ConceptFamilyId, Chapter12LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter12ConceptFamilyId, Chapter12LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter12ConceptFamilyId, Chapter12LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter12ConceptFamilyId>[] = [
  ...chapter12QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter12ReassessmentReserve.map((question) => ({
    questionId: question.id,
    conceptId: question.conceptFamilyId,
  })),
]

const correctAnswers: ReadonlyMap<string, string> = new Map([
  ...chapter12PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter12ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const concepts = chapter12ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter12LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter12ConceptFamilyId, Chapter12LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter12ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter12ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter12ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter12ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter12LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
