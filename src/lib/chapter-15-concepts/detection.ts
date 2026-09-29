/**
 * Chapter 15 concept-level learning-gap detection.
 * C15-6 binds the certified initial assessment to the shared detection engine.
 * Combined immutable evidence from micro-checks, flashcards, scenarios, and
 * assessment is handled by targeted-remediation.ts for mastery-based targeting.
 */
import type { Chapter15ConceptFamilyId, Chapter15LearningObjectiveId } from './types'
import { chapter15ConceptFamilies } from './concepts'
import { chapter15QuizQuestionConceptMappings } from './mappings'
import { chapter15PremiumQuizQuestions } from '../chapter-15-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter15ConceptFamilyId, Chapter15LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter15ConceptFamilyId, Chapter15LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter15ConceptFamilyId, Chapter15LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter15ConceptFamilyId>[] =
  chapter15QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter15PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter15ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter15LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter15ConceptFamilyId, Chapter15LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter15ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter15ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter15ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter15ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter15LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
