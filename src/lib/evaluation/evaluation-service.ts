/**
 * Phase 6C-2d — Reassessment Evaluation Service
 *
 * Application-layer service for evaluating remediation cycles with
 * deterministic outcome mapping, idempotency, and concurrency safety.
 *
 * Binding Rules:
 *   - Only legitimate, completed reassessment evidence may evaluate a cycle
 *   - Evidence must be for the correct student, concept, and cycle
 *   - Evaluation is idempotent and concurrency-safe
 *   - Two unsuccessful cycles in 30 days trigger instructor escalation
 *   - Pending cycles do NOT count toward escalation
 */

import type {
  ConceptId,
  DetectionState,
  DetectionConfidence,
  ConceptEvidence,
  EvaluationOutcome,
  EvaluateCycleParams,
  EvaluateCycleResult,
  RemediationCycleEvaluation,
  EvidenceValidationResult,
  IEvaluationDatabaseClient,
} from './types'
import { mapDetectionToOutcome, generateIdempotencyKey } from './outcome-mapper'
import type { IConceptDetectionProvider } from '../reassessment/provider-registry'

// ───────────────────────────────────────────────
// Evaluation Service
// ───────────────────────────────────────────────

export class EvaluationService {
  constructor(
    private readonly dbClient: IEvaluationDatabaseClient,
    private readonly detectionProvider?: IConceptDetectionProvider
  ) {}

  /**
   * Evaluate a remediation cycle with deterministic outcome mapping.
   *
   * This method:
   *   1. Validates the detection state and confidence
   *   2. Generates idempotency key if not provided
   *   3. Delegates to database client which:
   *      a. Validates evidence authority (CORRECTION 1)
   *      b. Maps detection state to outcome using the approved matrix
   *      c. Records the evaluation with idempotency protection
   *      d. Updates cycle status ONLY for terminal outcomes (CORRECTION 2)
   *      e. Triggers escalation ONLY for unsuccessful terminal outcomes
   *
   * CORRECTION 1: Evidence validation is performed at the database level
   * against authoritative persisted data. The application layer retains
   * canonical curriculum-semantic verification via the detection provider.
   *
   * CORRECTION 2: Pending evaluations do NOT mark the cycle terminal.
   * Multiple pending evaluations may exist for auditability.
   * A cycle becomes terminal only when outcome is successful or unsuccessful.
   *
   * @param params - Evaluation parameters
   * @returns Result with evaluation ID and outcome
   */
  async evaluateCycle(params: EvaluateCycleParams): Promise<EvaluateCycleResult> {
    // Validate detection state and confidence
    try {
      mapDetectionToOutcome(params.detectionState, params.confidence)
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Invalid detection state or confidence',
      }
    }

    // Generate idempotency key if not provided
    const idempotencyKey = params.idempotencyKey || generateIdempotencyKey(
      params.cycleId,
      params.detectionState,
      params.confidence,
      params.evidenceIds
    )

    // Delegate to database client for atomic evaluation
    // Evidence validation happens at the database level (CORRECTION 1)
    return this.dbClient.evaluateCycle({
      ...params,
      idempotencyKey,
    })
  }

  /**
   * Evaluate a cycle using detection results from the detection provider.
   *
   * This method integrates with the Phase 6B-3 detection engine to
   * automatically determine detection state and confidence from evidence.
   *
   * @param cycleId - The remediation cycle ID
   * @param conceptId - The concept ID
   * @param evidenceIds - Array of quiz_attempt IDs providing evidence
   * @returns Result with evaluation ID and outcome
   */
  async evaluateCycleWithDetection(
    cycleId: string,
    conceptId: ConceptId,
    evidenceIds: string[]
  ): Promise<EvaluateCycleResult> {
    if (!this.detectionProvider) {
      return {
        success: false,
        error: 'No detection provider configured. Cannot auto-detect state.',
      }
    }

    // Get detection result from provider
    const detectionResult = await this.detectionProvider.detectConceptState(
      conceptId,
      evidenceIds
    )

    if (!detectionResult) {
      return {
        success: false,
        error: 'Detection provider returned no result',
      }
    }

    // Evaluate with detected state
    return this.evaluateCycle({
      cycleId,
      detectionState: detectionResult.state,
      confidence: detectionResult.confidence,
      conceptEvidence: detectionResult.evidence,
      evidenceIds,
      idempotencyKey: generateIdempotencyKey(
        cycleId,
        detectionResult.state,
        detectionResult.confidence,
        evidenceIds
      ),
    })
  }

  /**
   * Get the terminal evaluation for a specific cycle.
   *
   * CORRECTION 2: Returns the successful/unsuccessful evaluation only.
   * Pending evaluations are NOT terminal and do not mark the cycle evaluated.
   *
   * @param cycleId - The remediation cycle ID
   * @returns The terminal evaluation record or null if only pending exists
   */
  async getTerminalEvaluationByCycleId(cycleId: string): Promise<RemediationCycleEvaluation | null> {
    return this.dbClient.getTerminalEvaluationByCycleId(cycleId)
  }

  /**
   * Get all evaluations for a specific cycle (including pending).
   *
   * CORRECTION 2: Multiple pending evaluations may exist for auditability.
   *
   * @param cycleId - The remediation cycle ID
   * @returns Array of all evaluation records for the cycle
   */
  async getAllEvaluationsByCycleId(cycleId: string): Promise<RemediationCycleEvaluation[]> {
    return this.dbClient.getAllEvaluationsByCycleId(cycleId)
  }

  /**
   * Check if a cycle has a terminal outcome (successful or unsuccessful).
   *
   * CORRECTION 2: Pending evaluations do NOT count as terminal.
   * A cycle with only pending evaluations is NOT terminally evaluated.
   *
   * @param cycleId - The remediation cycle ID
   * @returns true if the cycle has a terminal outcome
   */
  async isCycleTerminallyEvaluated(cycleId: string): Promise<boolean> {
    return this.dbClient.isCycleTerminallyEvaluated(cycleId)
  }

  /**
   * Validate evidence items against authoritative persisted data.
   *
   * CORRECTION 1: This method validates that every evidence item:
   *   - exists in quiz_attempts
   *   - belongs to the same student as the remediation cycle
   *   - belongs to the correct remediation cycle/reassessment context
   *   - represents completed assessment evidence
   *   - satisfies Phase 6C-2b reassessment-integrity requirements
   *
   * @param cycleId - The remediation cycle ID
   * @param evidenceIds - Array of quiz_attempt IDs to validate
   * @returns Array of validation results for each evidence item
   */
  async validateEvidence(cycleId: string, evidenceIds: string[]): Promise<EvidenceValidationResult[]> {
    return this.dbClient.validateEvidence(cycleId, evidenceIds)
  }

  /**
   * Get an evaluation by ID.
   *
   * @param evaluationId - The evaluation ID
   * @returns The evaluation record or null
   */
  async getEvaluation(evaluationId: string): Promise<RemediationCycleEvaluation | null> {
    return this.dbClient.getEvaluation(evaluationId)
  }

  /**
   * Validate that an outcome is legitimate for a detection state.
   *
   * This enforces the binding rules:
   * - unsuccessful may only result from repeated_weakness
   * - successful may only result from currently_performing_well
   *
   * @param outcome - The outcome to validate
   * @param detectionState - The detection state that produced it
   * @returns true if the outcome is legitimate
   */
  validateOutcomeLegitimacy(
    outcome: EvaluationOutcome,
    detectionState: DetectionState
  ): boolean {
    const expectedOutcome = mapDetectionToOutcome(detectionState, 'low')
    return outcome === expectedOutcome
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create an evaluation service instance.
 *
 * @param dbClient - The evaluation database client
 * @param detectionProvider - Optional detection provider for auto-evaluation
 */
export function createEvaluationService(
  dbClient: IEvaluationDatabaseClient,
  detectionProvider?: IConceptDetectionProvider
): EvaluationService {
  return new EvaluationService(dbClient, detectionProvider)
}
