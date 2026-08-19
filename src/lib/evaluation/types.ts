/**
 * Phase 6C-2d — Reassessment Evaluation Types
 *
 * Chapter-agnostic type definitions for deterministic reassessment evaluation.
 * Implements the approved outcome matrix and evaluation metadata persistence.
 */

import type { ChapterId, ConceptId } from '../reassessment/types'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '../chapter-2-concepts/detection'

// ───────────────────────────────────────────────
// Re-export for convenience
// ───────────────────────────────────────────────

export type { ChapterId, ConceptId, DetectionState, DetectionConfidence, ConceptEvidence }

// ───────────────────────────────────────────────
// Evaluation Outcome Types
// ───────────────────────────────────────────────

/**
 * Deterministic outcome from the approved outcome matrix.
 *
 * - pending: Cycle preserved, no escalation, not counted as unsuccessful
 * - unsuccessful: Only from repeated_weakness, counts toward escalation
 * - successful: Only from currently_performing_well
 */
export type EvaluationOutcome = 'pending' | 'unsuccessful' | 'successful'

/**
 * Evaluation metadata required by Phase 6C-2d.
 */
export interface EvaluationMetadata {
  /** Confidence level from Phase 6B-3 detection */
  evaluationConfidence: DetectionConfidence
  /** Array of quiz_attempt IDs used as evidence */
  evaluationEvidenceIds: string[]
  /** Unique idempotency key */
  evaluationIdempotencyKey: string
  /** Schema version (currently 1) */
  evaluationVersion: number
}

/**
 * Immutable evaluation record from remediation_cycle_evaluations table.
 */
export interface RemediationCycleEvaluation {
  id: string
  cycleId: string
  evaluationConfidence: DetectionConfidence
  evaluationEvidenceIds: string[]
  evaluationIdempotencyKey: string
  evaluationVersion: number
  detectionState: DetectionState
  outcome: EvaluationOutcome
  conceptEvidence: ConceptEvidence
  evaluatedAt: Date
  createdAt: Date
}

// ───────────────────────────────────────────────
// Evaluation Parameters and Results
// ───────────────────────────────────────────────

/**
 * Parameters for evaluating a remediation cycle.
 */
export interface EvaluateCycleParams {
  /** The remediation cycle ID to evaluate */
  cycleId: string
  /** Detection state from Phase 6B-3 */
  detectionState: DetectionState
  /** Confidence level from Phase 6B-3 */
  confidence: DetectionConfidence
  /** Full concept evidence snapshot */
  conceptEvidence: ConceptEvidence
  /** Array of quiz_attempt IDs providing evidence */
  evidenceIds: string[]
  /** Idempotency key for concurrency safety */
  idempotencyKey: string
}

/**
 * Result of a cycle evaluation.
 */
export interface EvaluateCycleResult {
  success: boolean
  /** The evaluation ID (if successful) */
  evaluationId?: string
  /** The deterministic outcome */
  outcome?: EvaluationOutcome
  /** Whether this was an idempotent return (already evaluated) */
  alreadyEvaluated?: boolean
  /** Error message (if failed) */
  error?: string
}

// ───────────────────────────────────────────────
// Outcome Matrix Types
// ───────────────────────────────────────────────

/**
 * The approved deterministic outcome matrix.
 *
 * Detection State          Low        Medium     High
 * -----------------------  ---------  ---------  ---------
 * insufficient_evidence    pending    pending    pending
 * emerging_weakness        pending    pending    pending
 * repeated_weakness        unsuccessful unsuccessful unsuccessful
 * improving                pending    pending    pending
 * currently_performing_well successful successful successful
 */
export const OUTCOME_MATRIX: Record<DetectionState, Record<DetectionConfidence, EvaluationOutcome>> = {
  insufficient_evidence: {
    low: 'pending',
    medium: 'pending',
    high: 'pending',
  },
  emerging_weakness: {
    low: 'pending',
    medium: 'pending',
    high: 'pending',
  },
  repeated_weakness: {
    low: 'unsuccessful',
    medium: 'unsuccessful',
    high: 'unsuccessful',
  },
  improving: {
    low: 'pending',
    medium: 'pending',
    high: 'pending',
  },
  currently_performing_well: {
    low: 'successful',
    medium: 'successful',
    high: 'successful',
  },
} as const

// ───────────────────────────────────────────────
// Evidence Validation Types (CORRECTION 1)
// ───────────────────────────────────────────────

/**
 * Result of validating a single evidence item against authoritative persisted data.
 */
export interface EvidenceValidationResult {
  /** The evidence (quiz_attempt) ID that was validated */
  evidenceId: string
  /** Whether the evidence item passed all validation checks */
  isValid: boolean
  /** Reason for validation failure (if invalid) */
  failureReason?: string
}

// ───────────────────────────────────────────────
// Database Client Interface
// ───────────────────────────────────────────────

/**
 * Database client interface for evaluation operations.
 */
export interface IEvaluationDatabaseClient {
  /**
   * Evaluate a remediation cycle with idempotency and concurrency safety.
   * Evidence validation is performed at the database level (CORRECTION 1).
   * Pending evaluations do NOT mark the cycle terminal (CORRECTION 2).
   */
  evaluateCycle(params: EvaluateCycleParams): Promise<EvaluateCycleResult>

  /**
   * Get an evaluation by ID.
   */
  getEvaluation(evaluationId: string): Promise<RemediationCycleEvaluation | null>

  /**
   * Get the terminal evaluation for a specific cycle.
   * Returns the successful/unsuccessful evaluation, or null if only pending exists.
   */
  getTerminalEvaluationByCycleId(cycleId: string): Promise<RemediationCycleEvaluation | null>

  /**
   * Get all evaluations for a specific cycle (including pending).
   * Multiple pending evaluations may exist for auditability.
   */
  getAllEvaluationsByCycleId(cycleId: string): Promise<RemediationCycleEvaluation[]>

  /**
   * Check if a cycle has a terminal outcome (successful or unsuccessful).
   * Pending evaluations do NOT count as terminal.
   */
  isCycleTerminallyEvaluated(cycleId: string): Promise<boolean>

  /**
   * Get evaluations by idempotency key (for idempotency checking).
   */
  getEvaluationByIdempotencyKey(idempotencyKey: string): Promise<RemediationCycleEvaluation | null>

  /**
   * Validate evidence items against authoritative persisted data.
   * Returns validation results for each evidence item.
   */
  validateEvidence(cycleId: string, evidenceIds: string[]): Promise<EvidenceValidationResult[]>
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
