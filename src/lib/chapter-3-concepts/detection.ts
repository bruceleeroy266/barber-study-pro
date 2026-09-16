/**
 * Chapter 3 Concept-Level Learning-Gap Detection (C3-2)
 *
 * Thin Chapter 3 binding over the shared chapter-independent detection
 * engine (src/lib/concept-detection/engine.ts). Supplies the locked C3-1
 * canonical assets — the four concept families, the canonical
 * question→concept mappings, and the 30-question bank's correct answers —
 * and exposes the same detection semantics Chapter 2 uses.
 *
 * Canonical data discipline: question→concept mappings are PROJECTED from
 * chapter-3-concepts/mappings.ts at module load. Nothing is duplicated or
 * restated. Chapter 3 has no reassessment reserve yet (C3-3), so the
 * correct-answer map contains only the canonical 30-question bank.
 *
 * Scope: Detection only. No remediation routing, no reassessment,
 * no mastery policy, no instructor UI, no student-facing labels.
 */

import type {
  Chapter3ConceptFamilyId,
  Chapter3LearningObjectiveId,
} from './types'
import { chapter3ConceptFamilies } from './concepts'
import {
  chapter3QuizQuestionConceptMappings,
  chapter3ReassessmentQuestionConceptMappings,
} from './mappings'
import { chapter3PremiumQuizQuestions } from '../chapter-3-premium-quiz'
import { chapter3ReassessmentQuestions } from '../chapter-3-reassessment-questions'
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
  Chapter3ConceptFamilyId,
  Chapter3LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  Chapter3ConceptFamilyId,
  Chapter3LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<
    Chapter3ConceptFamilyId,
    Chapter3LearningObjectiveId
  >

// ───────────────────────────────────────────────
// Chapter 3 Detection Input (canonical data binding)
// ───────────────────────────────────────────────

// Project the canonical question→concept-family mappings into the engine's
// input shape. Post-lock additive (C3-3): the reassessment reserve mappings
// are unioned so reserve questions count as detection/evaluation evidence —
// exactly mirroring Chapter 2's binding. Initial-quiz detection is unchanged:
// reserve IDs never appear in initial-quiz answers_json.
const chapter3QuestionMappings: readonly engine.DetectionQuestionMapping<Chapter3ConceptFamilyId>[] =
  [...chapter3QuizQuestionConceptMappings, ...chapter3ReassessmentQuestionConceptMappings].map(
    (m) => ({
      questionId: m.questionId,
      conceptId: m.conceptFamilyId,
    }),
  )

// Correct answers come from the canonical 30-question bank plus the
// reassessment reserve (C3-3), unknown IDs are skipped by the engine.
const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter3PremiumQuizQuestions, ...chapter3ReassessmentQuestions].map((q) => [
    q.id,
    q.correct_answer,
  ]),
)

const chapter3DetectionInput: engine.ConceptDetectionInput<
  Chapter3ConceptFamilyId,
  Chapter3LearningObjectiveId
> = {
  concepts: chapter3ConceptFamilies,
  questionMappings: chapter3QuestionMappings,
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
  conceptFamilyId: Chapter3ConceptFamilyId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(
    conceptFamilyId,
    quizAttempts,
    chapter3DetectionInput,
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
  return engine.detectConceptState(evidence, chapter3DetectionInput)
}

// ───────────────────────────────────────────────
// Batch Detection
// ───────────────────────────────────────────────

/**
 * Detect learning gaps for all four locked Chapter 3 concept families.
 */
export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<Chapter3ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter3DetectionInput)
}

/**
 * Detect learning gaps for concept families with evidence only.
 */
export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<Chapter3ConceptFamilyId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(
    quizAttempts,
    chapter3DetectionInput,
  )
}

// ───────────────────────────────────────────────
// Learning Objective Rollup
// ───────────────────────────────────────────────

/**
 * Roll up concept-family detection to learning objectives (1:1 for Ch3).
 */
export function rollupToLearningObjectives(
  conceptResults: Map<Chapter3ConceptFamilyId, ConceptDetectionResult>,
): Map<Chapter3LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
