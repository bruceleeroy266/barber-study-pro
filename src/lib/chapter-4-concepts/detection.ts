/**
 * Chapter 4 Concept-Level Learning-Gap Detection (C4-2)
 *
 * Thin Chapter 4 binding over the shared chapter-independent detection
 * engine (src/lib/concept-detection/engine.ts). Supplies the locked C4-1
 * canonical assets — the six concept families (with their audited primary
 * learning-objective projection), the canonical question→concept mappings,
 * and the 30-question bank's correct answers — and exposes the same
 * detection semantics Chapters 2 and 3 use.
 *
 * Canonical data discipline: question→concept mappings are PROJECTED from
 * chapter-4-concepts/mappings.ts at module load. Nothing is duplicated or
 * restated. Post-lock additive (C4-3): the reassessment reserve is unioned
 * into the detection inputs so reserve questions count as detection and
 * evaluation evidence — exactly mirroring the Chapter 2/3 bindings.
 * Initial-quiz detection is unchanged: reserve IDs never appear in
 * initial-quiz answers_json.
 *
 * Scope: Detection only. No remediation routing, no reassessment,
 * no mastery policy, no instructor UI, no student-facing labels.
 */

import type {
  Chapter4ConceptFamilyId,
  Chapter4LearningObjectiveId,
} from './types'
import { chapter4ConceptFamilies } from './concepts'
import {
  chapter4QuizQuestionConceptMappings,
  chapter4ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter4PremiumQuizQuestions } from '../chapter-4-premium-quiz'
import { chapter4ReassessmentQuestions } from '../chapter-4-reassessment-questions'
import type { QuizAttempt } from '@/types'
import * as engine from '../concept-detection/engine'

// ───────────────────────────────────────────────
// Detection Types (re-exported from the shared engine)
// ───────────────────────────────────────────────

export type {
  DetectionState,
  DetectionConfidence,
  ResponsePattern,
  DetectionFlag,
} from '../concept-detection/engine'

export type ConceptEvidence = engine.ConceptEvidence<
  Chapter4ConceptFamilyId,
  Chapter4LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter4ConceptFamilyId,
  Chapter4LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter4ConceptFamilyId,
    Chapter4LearningObjectiveId
  >

// ───────────────────────────────────────────────
// Chapter 4 Detection Input (canonical data binding)
// ───────────────────────────────────────────────

// Project the canonical question→concept-family mappings into the engine's
// input shape. Only the initial 30-question bank participates — Chapter 4
// has no reassessment reserve yet (C4-3 scope).
const chapter4QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter4ConceptFamilyId>[] =
  [...chapter4QuizQuestionConceptMappings, ...chapter4ReassessmentQuestionConceptMappings].map(
    (m) => ({
      questionId: m.questionId,
      conceptId: m.conceptFamilyId,
    }),
  )

// Correct answers come from the canonical 30-question bank plus the
// reassessment reserve (C4-3); unknown IDs are skipped by the engine.
const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter4PremiumQuizQuestions, ...chapter4ReassessmentQuestions].map((q) => [
    q.id,
    q.correct_answer,
  ]),
)

const chapter4DetectionInput: engine.ConceptDetectionInput<
  Chapter4ConceptFamilyId,
  Chapter4LearningObjectiveId
> = {
  concepts: chapter4ConceptFamilies,
  questionMappings: chapter4QuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

// ───────────────────────────────────────────────
// Evidence Building
// ───────────────────────────────────────────────

/**
 * Build concept-family-level evidence from quiz attempts.
 *
 * Uses quiz_attempts.answers_json as the authoritative historical source.
 * Does NOT use missed_questions.times_missed for historical reconstruction.
 */
export function buildConceptEvidence(
  conceptFamilyId: Chapter4ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(
    conceptFamilyId,
    quizAttempts,
    chapter4DetectionInput,
  )
}

// ───────────────────────────────────────────────
// Detection Logic
// ───────────────────────────────────────────────

/**
 * Detect concept-family learning gap state and confidence.
 */
export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter4DetectionInput)
}

// ───────────────────────────────────────────────
// Batch Detection
// ───────────────────────────────────────────────

/**
 * Detect learning gaps for all six locked Chapter 4 concept families.
 */
export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter4ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter4DetectionInput)
}

/**
 * Detect learning gaps for concept families with evidence only.
 */
export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter4ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(
    quizAttempts,
    chapter4DetectionInput,
  )
}

// ───────────────────────────────────────────────
// Learning Objective Rollup
// ───────────────────────────────────────────────

/**
 * Roll up concept-family detection to learning objectives. Each family rolls
 * up to its audited primary learning objective; the full many-to-many LO
 * relationships stay canonical in concepts.ts and are not consumed here.
 */
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter4ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter4LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
