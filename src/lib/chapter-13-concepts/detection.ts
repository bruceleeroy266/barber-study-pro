/**
 * Chapter 13 concept-level learning-gap detection.
 * C13-1 binds the existing initial assessment to the shared chapter-independent engine.
 * C13-7 will extend this binding with the fresh reassessment reserve.
 */
import type { Chapter13ConceptFamilyId, Chapter13LearningObjectiveId } from './types'
import { chapter13ConceptFamilies } from './concepts'
import { chapter13QuizQuestionConceptMappings } from './mappings'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter13ConceptFamilyId, Chapter13LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter13ConceptFamilyId, Chapter13LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter13ConceptFamilyId, Chapter13LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter13ConceptFamilyId>[] =
  chapter13QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter13PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter13ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter13LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter13ConceptFamilyId, Chapter13LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter13ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter13ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter13ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter13ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter13LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
