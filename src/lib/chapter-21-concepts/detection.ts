import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'
import { chapter21PremiumQuizQuestions } from '../chapter-21-premium-quiz'
import { chapter21ConceptFamilies } from './concepts'
import { chapter21MicroChecks } from './micro-checks'
import {
  chapter21FlashcardConceptMappings,
  chapter21QuizQuestionConceptMappings,
} from './mappings'
import type {
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId,
} from './types'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId
>
export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId
>
export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter21ConceptFamilyId,
    Chapter21LearningObjectiveId
  >

const assessmentMappings: readonly engine.DetectionQuestionMapping<Chapter21ConceptFamilyId>[] =
  chapter21QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const assessmentCorrectAnswers = new Map(
  chapter21PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
)

const concepts = chapter21ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId:
    concept.learningObjectiveIds[0] as Chapter21LearningObjectiveId,
  status: concept.status,
}))

const assessmentInput: engine.ConceptDetectionInput<
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId
> = {
  concepts,
  questionMappings: assessmentMappings,
  correctAnswers: assessmentCorrectAnswers,
}

export const chapter21ScenarioEvidenceMappings = [
  { itemId: 'ch21-kc1:0', conceptFamilyId: 'ch21-business-entry-paths' },
  { itemId: 'ch21-kc1:1', conceptFamilyId: 'ch21-shop-opening-planning' },
  { itemId: 'ch21-kc2:0', conceptFamilyId: 'ch21-ownership-legal-structures' },
  { itemId: 'ch21-kc2:1', conceptFamilyId: 'ch21-ownership-legal-structures' },
  { itemId: 'ch21-kc3:0', conceptFamilyId: 'ch21-business-plan-financial-planning' },
  { itemId: 'ch21-kc3:1', conceptFamilyId: 'ch21-business-plan-financial-planning' },
  { itemId: 'ch21-kc4:0', conceptFamilyId: 'ch21-recordkeeping-financial-compliance' },
  { itemId: 'ch21-kc4:1', conceptFamilyId: 'ch21-booth-rental-independent-business-responsibilities' },
  { itemId: 'ch21-real-shop-scenarios:0', conceptFamilyId: 'ch21-business-entry-paths' },
  { itemId: 'ch21-real-shop-scenarios:1', conceptFamilyId: 'ch21-shop-operations-management' },
  { itemId: 'ch21-real-shop-scenarios:2', conceptFamilyId: 'ch21-recordkeeping-financial-compliance' },
  { itemId: 'ch21-real-shop-scenarios:3', conceptFamilyId: 'ch21-booth-rental-independent-business-responsibilities' },
  { itemId: 'ch21-real-shop-scenarios:4', conceptFamilyId: 'ch21-advertising-marketing-client-consent' },
] as const satisfies readonly {
  itemId: string
  conceptFamilyId: Chapter21ConceptFamilyId
}[]

const combinedMappings: readonly engine.DetectionQuestionMapping<Chapter21ConceptFamilyId>[] = [
  ...assessmentMappings,
  ...chapter21MicroChecks.flatMap((check) =>
    check.questions.map((question) => ({
      questionId: question.id,
      conceptId: question.conceptFamilyId,
    })),
  ),
  ...chapter21FlashcardConceptMappings.map((mapping) => ({
    questionId: mapping.flashcardId,
    conceptId: mapping.conceptFamilyId,
  })),
  ...chapter21ScenarioEvidenceMappings.map((mapping) => ({
    questionId: mapping.itemId,
    conceptId: mapping.conceptFamilyId,
  })),
]

const combinedCorrectAnswers = new Map<string, string>([
  ...chapter21PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
  ...chapter21MicroChecks.flatMap((check) =>
    check.questions.map(
      (question) => [question.id, question.correctAnswer] as const,
    ),
  ),
  ...chapter21FlashcardConceptMappings.map(
    (mapping) => [mapping.flashcardId, '__correct__'] as const,
  ),
  ...chapter21ScenarioEvidenceMappings.map(
    (mapping) => [mapping.itemId, '__correct__'] as const,
  ),
])

const combinedInput: engine.ConceptDetectionInput<
  Chapter21ConceptFamilyId,
  Chapter21LearningObjectiveId
> = {
  concepts,
  questionMappings: combinedMappings,
  correctAnswers: combinedCorrectAnswers,
}

export interface Chapter21CombinedMicroCheckRow {
  question_id: string
  selected_answer: string
  answered_at: string
}

export interface Chapter21CombinedActivityRow {
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
    user_id: 'server-derived-ch21-evidence',
    quiz_id: 'quiz-21-combined-evidence',
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

export function detectAllChapter21CombinedConceptGaps(
  quizAttempts: QuizAttempt[],
  microCheckRows: readonly Chapter21CombinedMicroCheckRow[],
  activityRows: readonly Chapter21CombinedActivityRow[],
): Map<Chapter21ConceptFamilyId, ConceptDetectionResult> {
  const validMicroIds = new Set(
    chapter21MicroChecks.flatMap((check) =>
      check.questions.map((question) => question.id),
    ),
  )
  const validFlashcardIds = new Set(
    chapter21FlashcardConceptMappings.map((mapping) => mapping.flashcardId),
  )
  const validScenarioIds = new Set(
    chapter21ScenarioEvidenceMappings.map((mapping) => mapping.itemId),
  )

  const microAttempts = microCheckRows
    .filter((row) => validMicroIds.has(row.question_id as never))
    .map((row, index) =>
      syntheticEvidenceAttempt(
        `ch21-micro-${index}-${row.question_id}`,
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
        `ch21-activity-${index}-${row.item_id}`,
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
  conceptFamilyId: Chapter21ConceptFamilyId,
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
): Map<Chapter21ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, assessmentInput)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter21ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter21LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
