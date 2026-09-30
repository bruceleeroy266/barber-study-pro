import type { Chapter18ConceptFamilyId, Chapter18LearningObjectiveId } from './types'
import { chapter18ConceptFamilies } from './concepts'
import { chapter18QuizQuestionConceptMappings } from './mappings'
import { chapter18PremiumQuizQuestions } from '../chapter-18-premium-quiz'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

export type { DetectionState, DetectionConfidence, ResponsePattern, DetectionFlag } from '../concept-detection/engine'
export type ConceptEvidence = engine.ConceptEvidence<Chapter18ConceptFamilyId, Chapter18LearningObjectiveId>
export type ConceptDetectionResult = engine.ConceptDetectionResult<Chapter18ConceptFamilyId, Chapter18LearningObjectiveId>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<Chapter18ConceptFamilyId, Chapter18LearningObjectiveId>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter18ConceptFamilyId>[] =
  chapter18QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter18PremiumQuizQuestions.map((question) => [question.id, question.correct_answer] as const),
)

const concepts = chapter18ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId: concept.learningObjectiveIds[0] as Chapter18LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<Chapter18ConceptFamilyId, Chapter18LearningObjectiveId> = {
  concepts,
  questionMappings,
  correctAnswers,
}

export function buildConceptEvidence(conceptFamilyId: Chapter18ConceptFamilyId, quizAttempts: QuizAttempt[]): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}
export function detectConceptState(evidence: ConceptEvidence): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}
export function detectAllConceptGaps(quizAttempts: QuizAttempt[]): Map<Chapter18ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}
export function detectConceptGapsWithEvidence(quizAttempts: QuizAttempt[]): Map<Chapter18ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter18ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter18LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
