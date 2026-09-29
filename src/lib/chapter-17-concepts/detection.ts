/**
 * Chapter 17 concept-level learning-gap detection.
 * C17-6 binds the certified initial assessment to the shared detection engine.
 * Combined immutable evidence from micro-checks, flashcards, scenarios, and
 * assessment is handled by targeted-remediation.ts for mastery-based targeting.
 */
import type { Chapter17ConceptFamilyId, Chapter17LearningObjectiveId } from './types'
import { chapter17ConceptFamilies } from './concepts'
import { chapter17QuizQuestionConceptMappings } from './mappings'
import { chapter17PremiumQuizQuestions } from '../chapter-17-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter17ConceptFamilyId, Chapter17LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter17ConceptFamilyId, Chapter17LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter17ConceptFamilyId, Chapter17LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter17ConceptFamilyId>[] =
  chapter17QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter17PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter17ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter17LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter17ConceptFamilyId, Chapter17LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter17ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter17ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter17ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter17ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter17LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
