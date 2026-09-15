/**
 * Chapter 2 Concept-Level Learning-Gap Detection
 *
 * Phase 6B-3: Evidence-calibrated detection of concept-level learning gaps
 * using the Phase 6B-2 typed concept runtime architecture.
 *
 * Governing documents:
 *   - ASCYN_PRO_CH02_PHASE6B3_CONCEPT_GAP_DETECTION_REVIEW.md
 *   - ASCYN_PRO_CH02_PHASE6B3_THRESHOLD_STRESS_TEST.md
 *
 * Scope: Detection only. No remediation routing, no reassessment,
 * no mastery policy, no instructor UI, no student-facing labels.
 *
 * C3-2 Slice 1: This module is now a thin Chapter 2 binding over the shared
 * chapter-independent detection engine (src/lib/concept-detection/engine.ts).
 * The algorithm, thresholds, and state semantics live in the engine and are
 * unchanged; this file only supplies the canonical Chapter 2 data (concepts,
 * question mappings, and the question-bank correct-answer map, including the
 * reassessment reserve) and preserves the established export surface.
 */

import type {
  ConceptId,
  LearningObjectiveId,
} from './types'
import { chapter2Concepts } from './concepts'
import { chapter2QuizQuestionMappings } from './mappings'
import { chapter2PremiumQuizQuestions } from '../chapter-2-premium-quiz'
import { chapter2ReassessmentQuestions } from '../chapter-2-reassessment-questions'
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
  ConceptId,
  LearningObjectiveId
>

export type ConceptDetectionResult = engine.ConceptDetectionResult<
  ConceptId,
  LearningObjectiveId
>

export type LearningObjectiveDetectionResult =
  engine.LearningObjectiveDetectionResult<ConceptId, LearningObjectiveId>

// ───────────────────────────────────────────────
// Chapter 2 Detection Input (canonical data binding)
// ───────────────────────────────────────────────

// Post-lock additive: union the reassessment reserve so reserve answers
// count as detection/evaluation evidence (unknown IDs are skipped by the
// engine when building evidence).
const questionCorrectAnswerMap: ReadonlyMap<string, string> = new Map(
  [...chapter2PremiumQuizQuestions, ...chapter2ReassessmentQuestions].map(
    (q) => [q.id, q.correct_answer],
  ),
)

const chapter2DetectionInput: engine.ConceptDetectionInput<
  ConceptId,
  LearningObjectiveId
> = {
  concepts: chapter2Concepts,
  questionMappings: chapter2QuizQuestionMappings,
  correctAnswers: questionCorrectAnswerMap,
}

// ───────────────────────────────────────────────
// Evidence Building
// ───────────────────────────────────────────────

/**
 * Build concept-level evidence from quiz attempts.
 *
 * Uses quiz_attempts.answers_json as the authoritative historical source.
 * Does NOT use missed_questions.times_missed for historical reconstruction.
 */
export function buildConceptEvidence(
  conceptId: ConceptId,
  quizAttempts: QuizAttempt[],
): ConceptEvidence {
  return engine.buildConceptEvidence(
    conceptId,
    quizAttempts,
    chapter2DetectionInput,
  )
}

// ───────────────────────────────────────────────
// Detection Logic
// ───────────────────────────────────────────────

/**
 * Detect concept-level learning gap state and confidence.
 *
 * Implements the refined stress-tested thresholds from Phase 6B-3.
 */
export function detectConceptState(
  evidence: ConceptEvidence,
): ConceptDetectionResult {
  return engine.detectConceptState(evidence, chapter2DetectionInput)
}

// ───────────────────────────────────────────────
// Batch Detection
// ───────────────────────────────────────────────

/**
 * Detect learning gaps for all Chapter 2 concepts.
 */
export function detectAllConceptGaps(
  quizAttempts: QuizAttempt[],
): Map<ConceptId, ConceptDetectionResult> {
  return engine.detectAllConceptGaps(quizAttempts, chapter2DetectionInput)
}

/**
 * Detect learning gaps for concepts with evidence only.
 */
export function detectConceptGapsWithEvidence(
  quizAttempts: QuizAttempt[],
): Map<ConceptId, ConceptDetectionResult> {
  return engine.detectConceptGapsWithEvidence(
    quizAttempts,
    chapter2DetectionInput,
  )
}

// ───────────────────────────────────────────────
// Learning Objective Rollup
// ───────────────────────────────────────────────

/**
 * Roll up concept-level detection to learning objectives.
 */
export function rollupToLearningObjectives(
  conceptResults: Map<ConceptId, ConceptDetectionResult>,
): Map<LearningObjectiveId, LearningObjectiveDetectionResult> {
  return engine.rollupToLearningObjectives(conceptResults)
}
