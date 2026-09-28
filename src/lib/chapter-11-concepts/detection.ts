/**
 * Chapter 11 concept-level learning-gap detection.
 * Thin Chapter 11 binding over the shared chapter-independent detection engine.
 */
import type { Chapter11ConceptFamilyId, Chapter11LearningObjectiveId } from './types'
import { chapter11ConceptFamilies } from './concepts'
import { chapter11QuizQuestionConceptMappings } from './mappings'
import { chapter11ReassessmentReserve } from './reassessment-reserve'
import { chapter11PremiumQuizQuestions } from '../chapter-11-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter11ConceptFamilyId, Chapter11LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter11ConceptFamilyId, Chapter11LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter11ConceptFamilyId, Chapter11LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter11ConceptFamilyId>[] = [
  ...chapter11QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter11ReassessmentReserve.map((question) => ({
    questionId: question.id,
    conceptId: question.conceptFamilyId,
  })),
]

const correctAnswers: ReadonlyMap<string, string> = new Map([
  ...chapter11PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
  ...chapter11ReassessmentReserve.map((question) => [question.id, question.correctAnswer] as const),
])

const concepts = chapter11ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter11LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter11ConceptFamilyId, Chapter11LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter11ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter11ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter11ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter11ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter11LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
