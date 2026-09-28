/**
 * Chapter 14 concept-level learning-gap detection.
 */
import type { Chapter14ConceptFamilyId, Chapter14LearningObjectiveId } from './types'
import { chapter14ConceptFamilies } from './concepts'
import { chapter14QuizQuestionConceptMappings } from './mappings'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter14ConceptFamilyId, Chapter14LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter14ConceptFamilyId, Chapter14LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter14ConceptFamilyId, Chapter14LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter14ConceptFamilyId>[] =
  chapter14QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter14PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter14ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter14LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter14ConceptFamilyId, Chapter14LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter14ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter14ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter14ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter14ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter14LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
