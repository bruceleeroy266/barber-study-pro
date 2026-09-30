import type { Chapter16ConceptFamilyId, Chapter16LearningObjectiveId } from './types'
import { chapter16ConceptFamilies } from './concepts'
import { chapter16QuizQuestionConceptMappings } from './mappings'
import { chapter16PremiumQuizQuestions } from '../chapter-16-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter16ConceptFamilyId, Chapter16LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter16ConceptFamilyId, Chapter16LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter16ConceptFamilyId, Chapter16LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter16ConceptFamilyId>[] =
  chapter16QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter16PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter16ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter16LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter16ConceptFamilyId, Chapter16LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter16ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter16ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter16ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter16ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter16LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
