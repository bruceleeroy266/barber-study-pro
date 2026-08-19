/**
 * Phase 6C-2d — Deterministic Outcome Mapping
 *
 * SINGLE AUTHORITATIVE implementation of the approved outcome matrix.
 * Do not duplicate or reinterpret this logic elsewhere in runtime code.
 *
 * The matrix is stress-tested and approved:
 *
 * Detection State          Low        Medium     High
 * -----------------------  ---------  ---------  ---------
 * insufficient_evidence    pending    pending    pending
 * emerging_weakness        pending    pending    pending
 * repeated_weakness        unsuccessful unsuccessful unsuccessful
 * improving                pending    pending    pending
 * currently_performing_well successful successful successful
 */

import type { DetectionState, DetectionConfidence, EvaluationOutcome } from './types'
import { OUTCOME_MATRIX } from './types'

// Re-export OUTCOME_MATRIX for convenience
export { OUTCOME_MATRIX }

// ───────────────────────────────────────────────
// Outcome Mapping Function
// ───────────────────────────────────────────────

/**
 * Map detection state and confidence to deterministic outcome.
 *
 * This is the SINGLE AUTHORITATIVE implementation of the outcome matrix.
 * All runtime code must use this function; do not duplicate the matrix logic.
 *
 * @param detectionState - The detection state from Phase 6B-3
 * @param confidence - The confidence level from Phase 6B-3
 * @returns The deterministic outcome
 * @throws Error if detection state or confidence is invalid
 */
export function mapDetectionToOutcome(
  detectionState: DetectionState,
  confidence: DetectionConfidence
): EvaluationOutcome {
  // Validate detection state
  if (!isValidDetectionState(detectionState)) {
    throw new Error(`Invalid detection state: ${detectionState}`)
  }

  // Validate confidence
  if (!isValidConfidence(confidence)) {
    throw new Error(`Invalid confidence level: ${confidence}`)
  }

  // Return outcome from matrix
  return OUTCOME_MATRIX[detectionState][confidence]
}

/**
 * Check if an outcome is 'pending'.
 *
 * Pending outcomes:
 * - Do NOT increment unsuccessful-cycle counts
 * - Do NOT trigger instructor escalation
 * - Are NOT treated as successful
 * - Preserve the cycle for future legitimate evidence/evaluation
 */
export function isPendingOutcome(outcome: EvaluationOutcome): boolean {
  return outcome === 'pending'
}

/**
 * Check if an outcome is 'unsuccessful'.
 *
 * Unsuccessful outcomes:
 * - May ONLY result from repeated_weakness detection state
 * - Increment unsuccessful-cycle counts
 * - May trigger instructor escalation (2 in 30 days)
 */
export function isUnsuccessfulOutcome(outcome: EvaluationOutcome): boolean {
  return outcome === 'unsuccessful'
}

/**
 * Check if an outcome is 'successful'.
 *
 * Successful outcomes:
 * - May ONLY result from currently_performing_well detection state
 * - Do NOT increment unsuccessful-cycle counts
 * - Do NOT trigger instructor escalation
 */
export function isSuccessfulOutcome(outcome: EvaluationOutcome): boolean {
  return outcome === 'successful'
}

/**
 * Validate that an outcome was produced by a legitimate detection state.
 *
 * This enforces the binding rules:
 * - unsuccessful may only result from repeated_weakness
 * - successful may only result from currently_performing_well
 *
 * @param outcome - The outcome to validate
 * @param detectionState - The detection state that produced it
 * @returns true if the outcome is legitimate for the detection state
 */
export function isLegitimateOutcome(
  outcome: EvaluationOutcome,
  detectionState: DetectionState
): boolean {
  const expectedOutcome = mapDetectionToOutcome(detectionState, 'low') // confidence doesn't matter for validation
  return outcome === expectedOutcome
}

// ───────────────────────────────────────────────
// Validation Helpers
// ───────────────────────────────────────────────

const VALID_DETECTION_STATES: readonly DetectionState[] = [
  'insufficient_evidence',
  'emerging_weakness',
  'repeated_weakness',
  'improving',
  'currently_performing_well',
]

const VALID_CONFIDENCE_LEVELS: readonly DetectionConfidence[] = [
  'low',
  'medium',
  'high',
]

function isValidDetectionState(state: string): state is DetectionState {
  return VALID_DETECTION_STATES.includes(state as DetectionState)
}

function isValidConfidence(confidence: string): confidence is DetectionConfidence {
  return VALID_CONFIDENCE_LEVELS.includes(confidence as DetectionConfidence)
}

// ───────────────────────────────────────────────
// Idempotency Key Generation
// ───────────────────────────────────────────────

/**
 * Generate an idempotency key for cycle evaluation.
 *
 * Format: {cycle_id}:{detection_state}:{confidence}:{evidence_hash}
 *
 * The evidence hash is a simple hash of the sorted evidence IDs to ensure
 * the same evidence set produces the same key.
 */
export function generateIdempotencyKey(
  cycleId: string,
  detectionState: DetectionState,
  confidence: DetectionConfidence,
  evidenceIds: string[]
): string {
  const sortedIds = [...evidenceIds].sort()
  const evidenceHash = simpleHash(sortedIds.join(','))
  return `${cycleId}:${detectionState}:${confidence}:${evidenceHash}`
}

/**
 * Simple hash function for evidence IDs.
 * Uses a basic string hash algorithm.
 */
function simpleHash(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// ───────────────────────────────────────────────
// Matrix Verification (for testing)
// ───────────────────────────────────────────────

/**
 * Get all 15 detection-state × confidence combinations with expected outcomes.
 * Used for comprehensive testing of the outcome matrix.
 */
export function getAllOutcomeMatrixEntries(): Array<{
  detectionState: DetectionState
  confidence: DetectionConfidence
  expectedOutcome: EvaluationOutcome
}> {
  const entries: Array<{
    detectionState: DetectionState
    confidence: DetectionConfidence
    expectedOutcome: EvaluationOutcome
  }> = []

  for (const detectionState of VALID_DETECTION_STATES) {
    for (const confidence of VALID_CONFIDENCE_LEVELS) {
      entries.push({
        detectionState,
        confidence,
        expectedOutcome: OUTCOME_MATRIX[detectionState][confidence],
      })
    }
  }

  return entries
}
