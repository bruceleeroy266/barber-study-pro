import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'
import { chapter20PremiumQuizQuestions } from '../chapter-20-premium-quiz'
import { chapter20ConceptFamilies } from './concepts'
import { chapter20MicroChecks } from './micro-checks'
import {
  chapter20FlashcardConceptMappings,
  chapter20QuizQuestionConceptMappings,
} from './mappings'
import type {
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId,
} from './types'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId
>
export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId
>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId
>

const assessmentMappings: readonly engine.DetectionQuestionMapping<Chapter20ConceptFamilyId>[] =
  chapter20QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const assessmentCorrectAnswers = new Map(
  chapter20PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
)

const concepts = chapter20ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId:
    concept.learningObjectiveIds[0] as Chapter20LearningObjectiveId,
  status: concept.status,
}))

const assessmentInput: engine.ConceptDetectionInput<
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId
> = {
  concepts,
  questionMappings: assessmentMappings,
  correctAnswers: assessmentCorrectAnswers,
}

export const chapter20ScenarioEvidenceMappings = [
  { itemId: 'ch20-kc1:0', conceptFamilyId: 'ch20-professional-transition-workplace-expectations' },
  { itemId: 'ch20-kc1:1', conceptFamilyId: 'ch20-professional-transition-workplace-expectations' },
  { itemId: 'ch20-kc3:0', conceptFamilyId: 'ch20-employment-classification-compensation' },
  { itemId: 'ch20-kc3:1', conceptFamilyId: 'ch20-employment-classification-compensation' },
  { itemId: 'ch20-kc4:0', conceptFamilyId: 'ch20-financial-responsibility-income-reporting' },
  { itemId: 'ch20-kc4:1', conceptFamilyId: 'ch20-financial-responsibility-income-reporting' },
  { itemId: 'ch20-kc5:0', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { itemId: 'ch20-kc5:1', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { itemId: 'ch20-real-shop-scenarios:0', conceptFamilyId: 'ch20-teamwork-workplace-relationships' },
  { itemId: 'ch20-real-shop-scenarios:1', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { itemId: 'ch20-real-shop-scenarios:2', conceptFamilyId: 'ch20-financial-responsibility-income-reporting' },
  { itemId: 'ch20-real-shop-scenarios:3', conceptFamilyId: 'ch20-ethical-selling-retailing' },
  { itemId: 'ch20-real-shop-scenarios:4', conceptFamilyId: 'ch20-employment-classification-compensation' },
] as const satisfies readonly {
  itemId: string
  conceptFamilyId: Chapter20ConceptFamilyId
}[]

const combinedMappings: readonly engine.DetectionQuestionMapping<Chapter20ConceptFamilyId>[] = [
  ...assessmentMappings,
  ...chapter20MicroChecks.flatMap((check) =>
    check.questions.map((question) => ({
      questionId: question.id,
      conceptId: question.conceptFamilyId,
    })),
  ),
  ...chapter20FlashcardConceptMappings.map((mapping) => ({
    questionId: mapping.flashcardId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter20ScenarioEvidenceMappings.map((mapping) => ({
    questionId: mapping.itemId,
    conceptId: mapping.conceptFamilyId,
  })),
]

const combinedCorrectAnswers = new Map<string, string>([
  ...chapter20PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
  ...chapter20MicroChecks.flatMap((check) =>
    check.questions.map(
      (question) => [question.id, question.correctAnswer] as const,
    ),
  ),
  ...chapter20FlashcardConceptMappings.map(
    (mapping) => [mapping.flashcardId, '__correct__'] as const,
  ),
  ...chapter20ScenarioEvidenceMappings.map(
    (mapping) => [mapping.itemId, '__correct__'] as const,
  ),
])

const combinedInput: engine.ConceptDetectionInput<
  Chapter20ConceptFamilyId,
  Chapter20LearningObjectiveId
> = {
  concepts,
  questionMappings: combinedMappings,
  correctAnswers: combinedCorrectAnswers,
}

export interface Chapter20CombinedMicroCheckRow {
  question_id: string
  selected_answer: string
  answered_at: string
}

export interface Chapter20CombinedActivityRow {
  source: 'flashcard' | 'scenario_application'
  item_id: string
  is_correct: boolean
  answered_at: string
}

function syntheticEvidenceAttempt(
  id: string,
  itemId: string,
  answer: string,
  completedAt: string,
): QuizAttempt {
  return {
    id,
    user_id: 'server-derived-ch20-evidence',
    quiz_id: 'quiz-20-combined-evidence',
    score: answer === '__correct__' ? 1 : 0,
    total_questions: 1,
    percentage: answer === '__correct__' ? 100 : 0,
    answers_json: { [itemId]: answer },
    completed_at: completedAt,
    is_reassessment: false,
    remediation_cycle_id: null,
    target_concept_id: null,
  }
}

export function detectAllChapter20CombinedConceptGaps(
  quizAttempts: QuizAttempt[],
  microCheckRows: readonly Chapter20CombinedMicroCheckRow[],
  activityRows: readonly Chapter20CombinedActivityRow[],
): Map<Chapter20ConceptFamilyId, ConceptDetectionResult> {
  const validMicroIds = new Set(
    chapter20MicroChecks.flatMap((check) =>
      check.questions.map((question) => question.id),
    ),
  )
  const validFlashcardIds = new Set(
    chapter20FlashcardConceptMappings.map((mapping) => mapping.flashcardId),
  )
  const validScenarioIds = new Set(
    chapter20ScenarioEvidenceMappings.map((mapping) => mapping.itemId),
  )

  const microAttempts = microCheckRows
    .filter((row) => validMicroIds.has(row.question_id as never))
    .map((row, index) =>
      syntheticEvidenceAttempt(
        `ch20-micro-${index}-${row.question_id}`,
        row.question_id,
        row.selected_answer,
        row.answered_at,
      ),
    )

  const activityAttempts = activityRows
    .filter((row) =>
      row.source === 'flashcard'
        ? validFlashcardIds.has(row.item_id as never)
        : validScenarioIds.has(row.item_id as never),
    )
    .map((row, index) =>
      syntheticEvidenceAttempt(
        `ch20-activity-${index}-${row.item_id}`,
        row.item_id,
        row.is_correct ? '__correct__' : '__incorrect__',
        row.answered_at,
      ),
    )

  return engine.detectAllConceptGaps(
    [...quizAttempts, ...microAttempts, ...activityAttempts],
    combinedInput,
  )
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter20ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(
    conceptFamilyId,
    quizAttempts,
    assessmentInput,
  )
}

export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, assessmentInput)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter20ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, assessmentInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter20ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter20LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
