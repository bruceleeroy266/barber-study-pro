/**
 * Tier 1 Presentation — Student Evidence Translation
 *
 * Translates stored detection evidence into plain, supportive student-facing
 * language for the remediation page ("Why am I here?").
 *
 * HARD RULES (enforced by tests):
 *   - Never expose detection states, confidence levels, diagnostic terms,
 *     numeric scores, or mastery percentages to students.
 *   - Counts come verbatim from the persisted ConceptEvidence snapshot —
 *     never recomputed, never fabricated.
 *   - Low/zero evidence yields null so callers render the fallback copy
 *     instead of invented numbers.
 */

import type { ConceptEvidence } from '@/lib/chapter-2-concepts/detection'
import type { StudentRemediationState } from '@/lib/remediation/student-service'

/** Cycle steps for the student-facing 3-step map. */
export type CycleStep = 1 | 2 | 3

/**
 * Build the plain-language reason a student is seeing this focus area.
 * Returns null when evidence is too thin to state counts honestly.
 */
export function buildFocusReason(
  evidence: ConceptEvidence | null | undefined,
): string | null {
  if (!evidence) return null
  const { uniqueQuestions, uniqueQuestionsMissed, totalObservations } = evidence
  if (!uniqueQuestions || uniqueQuestions < 1 || totalObservations < 2) {
    return null
  }
  if (uniqueQuestionsMissed < 1) return null
  if (uniqueQuestionsMissed === 1) {
    return `You missed 1 of the ${uniqueQuestions} questions you've tried on this topic.`
  }
  return `You've missed ${uniqueQuestionsMissed} of the ${uniqueQuestions} questions you've tried on this topic.`
}

/**
 * Format the student's last quiz activity date for display.
 * Returns null when no attempt date exists (line is then omitted).
 */
export function formatLastActivity(
  lastAttemptAt: string | null | undefined,
): string | null {
  if (!lastAttemptAt) return null
  const date = new Date(lastAttemptAt)
  if (Number.isNaN(date.getTime())) return null
  return `Last quiz activity: ${date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })}`
}

/**
 * Map a student remediation state to the 3-step cycle position.
 *   Step 1 Review — assigned or working through review (incl. keep-practicing)
 *   Step 2 Knowledge Check — review done, check available/in progress/evaluating
 *   Step 3 Complete — any terminal or already-completed state
 */
export function deriveCycleStep(state: StudentRemediationState): CycleStep {
  switch (state) {
    case 'targeted_review':
    case 'review_in_progress':
    case 'pending_more_evidence':
      return 1
    case 'review_completed':
    case 'reassessment_in_progress':
    case 'pending_evaluation':
      return 2
    case 'successful':
    case 'unsuccessful':
    case 'pool_exhausted':
    case 'already_completed':
      return 3
  }
}

/**
 * Plain guidance telling the student what finishing this focus area means.
 * Fixed copy set — reviewed and approved at spec time.
 */
export function buildCompletionGuidance(
  step: CycleStep,
  state: StudentRemediationState,
): string {
  if (step === 1) {
    return 'Finish each review activity below. When everything is complete, a knowledge check unlocks.'
  }
  if (step === 2) {
    return "Answer the knowledge-check question. It's a fresh question you haven't seen before."
  }
  // Step 3 — terminal states
  if (state === 'successful' || state === 'already_completed') {
    return 'You did it — this focus area is complete.'
  }
  return "You've done the available practice. Your instructor can see your work and will follow up."
}
