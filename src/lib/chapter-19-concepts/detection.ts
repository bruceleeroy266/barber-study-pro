import type {
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId,
} from './types'
import { chapter19ConceptFamilies } from './concepts'
import {
  chapter19QuizQuestionConceptMappings,
  chapter19FlashcardConceptMappings,
} from './mappings'
import { chapter19PremiumQuizQuestions } from '../chapter-19-premium-quiz'
import type { QuizAttempt } from '@/types'
import { chapter19MicroChecks } from './micro-checks'
import * as engine from '../concept-detection/engine'

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>
export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>
export type LearningObjectiveDetectionResult = engine.LearningObjectiveDetectionResult<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
>

const questionMappings: readonly engine.DetectionQuestionMapping<Chapter19ConceptFamilyId>[] =
  chapter19QuizQuestionConceptMappings.map((mapping) => ({
    questionId: mapping.questionId,
    conceptId: mapping.conceptFamilyId,
  }))

const correctAnswers: ReadonlyMap<string, string> = new Map(
  chapter19PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
)

const concepts = chapter19ConceptFamilies.map((concept) => ({
  id: concept.id,
  learningObjectiveId:
    concept.learningObjectiveIds[0] as Chapter19LearningObjectiveId,
  status: concept.status,
}))

const input: engine.ConceptDetectionInput<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
> = {
  concepts,
  questionMappings,
  correctAnswers,
}


const combinedQuestionMappings: readonly engine.DetectionQuestionMapping<Chapter19ConceptFamilyId>[] = [
  ...questionMappings,
  ...chapter19MicroChecks.flatMap((check) =>
    check.questions.map((question) => ({
      questionId: question.id,
      conceptId: question.conceptFamilyId,
    })),
  ),
  ...chapter19FlashcardConceptMappings.map((mapping) => ({
    questionId: mapping.flashcardId,
    conceptId: mapping.conceptFamilyId,
  })),
]

const combinedCorrectAnswers: ReadonlyMap<string, string> = new Map([
  ...chapter19PremiumQuizQuestions.map(
    (question) => [question.id, question.correct_answer] as const,
  ),
  ...chapter19MicroChecks.flatMap((check) =>
    check.questions.map(
      (question) => [question.id, question.correctAnswer] as const,
    ),
  ),
  ...chapter19FlashcardConceptMappings.map(
    (mapping) => [mapping.flashcardId, '__correct__'] as const,
  ),
])

const combinedInput: engine.ConceptDetectionInput<
  Chapter19ConceptFamilyId,
  Chapter19LearningObjectiveId
> = {
  concepts,
  questionMappings: combinedQuestionMappings,
  correctAnswers: combinedCorrectAnswers,
}

export interface Chapter19CombinedMicroCheckRow {
  question_id: string
  selected_answer: string
  answered_at: string
}

export interface Chapter19CombinedActivityRow {
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
    user_id: 'server-derived-ch19-evidence',
    quiz_id: 'quiz-19-combined-evidence',
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

export function detectAllChapter19CombinedConceptGaps(
  quizAttempts: QuizAttempt[],
  microCheckRows: readonly Chapter19CombinedMicroCheckRow[],
  activityRows: readonly Chapter19CombinedActivityRow[],
): Map<Chapter19ConceptFamilyId, ConceptDetectionResult> {
  const validMicroQuestionIds = new Set(
    chapter19MicroChecks.flatMap((check) =>
      check.questions.map((question) => question.id),
    ),
  )
  const validFlashcardIds = new Set(
    chapter19FlashcardConceptMappings.map((mapping) => mapping.flashcardId),
  )

  const syntheticMicroAttempts = microCheckRows
    .filter((row) => validMicroQuestionIds.has(row.question_id as never))
    .map((row, index) =>
      syntheticEvidenceAttempt(
        `ch19-micro-${index}-${row.question_id}`,
        row.question_id,
        row.selected_answer,
        row.answered_at,
      ),
    )

  const syntheticActivityAttempts = activityRows
    .filter(
      (row) =>
        row.source === 'flashcard' &&
        validFlashcardIds.has(row.item_id as never),
    )
    .map((row, index) =>
      syntheticEvidenceAttempt(
        `ch19-activity-${index}-${row.item_id}`,
        row.item_id,
        row.is_correct ? '__correct__' : '__incorrect__',
        row.answered_at,
      ),
    )

  return engine.detectAllConceptGaps(
    [...quizAttempts, ...syntheticMicroAttempts, ...syntheticActivityAttempts],
    combinedInput,
  )
}

export function buildConceptEvidence(
  conceptFamilyId: Chapter19ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(conceptFamilyId, quizAttempts, input)
}

export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, input)
}

export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter19ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, input)
}

export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter19ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(quizAttempts, input)
}

export function rollupToLearningObjectives(
  conceptResults: Map<Chapter19ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter19LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
