/**
 * Phase 6C-2c — Instructor Escalation Service
 *
 * Application-layer service for managing instructor escalations.
 * Implements the escalation trigger logic and ownership protection rules.
 *
 * Binding Rules (from Phase 6C-1 §3.6 and Phase 6C-2c Architecture Review):
 *   - Escalation after 2 unsuccessful remediation cycles in rolling 30 days
 *   - Once instructor takes ownership, automation cannot silently clear
 *   - Duplicate escalation prevention via unique constraint
 */

import type {
  ConceptId,
  CreateEscalationParams,
  CreateEscalationResult,
  AcknowledgeEscalationParams,
  AcknowledgeEscalationResult,
  IEscalationDatabaseClient,
  InstructorEscalation,
} from './types'

// ───────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────

/** Rolling window for counting unsuccessful cycles (30 days per Phase 6C-1) */
const UNSUCCESSFUL_CYCLE_WINDOW_DAYS = 30

/** Threshold for triggering instructor escalation (2 per Phase 6C-1 §3.6) */
const ESCALATION_THRESHOLD = 2

// ───────────────────────────────────────────────
// Escalation Service
// ───────────────────────────────────────────────

export class EscalationService {
  constructor(private readonly dbClient: IEscalationDatabaseClient) {}

  /**
   * Check if an escalation should be created for a concept.
   *
   * Per Phase 6C-1 §3.6: After two unsuccessful remediation cycles for the
   * same concept, the concept is flagged for instructor review.
   *
   * @param userId - Student user ID
   * @param conceptId - Concept ID to check
   * @returns true if escalation threshold is met
   */
  async shouldCreateEscalation(
    userId: string,
    conceptId: ConceptId
  ): Promise<boolean> {
    const unsuccessfulCount = await this.dbClient.getUnsuccessfulCycleCount(
      userId,
      conceptId,
      UNSUCCESSFUL_CYCLE_WINDOW_DAYS
    )

    return unsuccessfulCount >= ESCALATION_THRESHOLD
  }

  /**
   * Create an instructor escalation for a concept.
   *
   * This method is idempotent: if an active escalation already exists for
   * the user/concept, the existing escalation ID is returned.
   *
   * @param params - Escalation creation parameters
   * @returns Result with escalation ID or error
   */
  async createEscalation(
    params: CreateEscalationParams
  ): Promise<CreateEscalationResult> {
    // Verify threshold is met
    const shouldCreate = await this.shouldCreateEscalation(
      params.userId,
      params.conceptId
    )

    if (!shouldCreate) {
      return {
        success: false,
        error: `Escalation threshold not met: requires ${ESCALATION_THRESHOLD} unsuccessful cycles in ${UNSUCCESSFUL_CYCLE_WINDOW_DAYS} days`,
      }
    }

    // Check for existing active escalation
    const existing = await this.dbClient.getActiveEscalation(
      params.userId,
      params.conceptId
    )

    if (existing) {
      return {
        success: true,
        escalationId: existing.id,
        alreadyExists: true,
      }
    }

    // Create new escalation
    return this.dbClient.createEscalation(params)
  }

  /**
   * Acknowledge an escalation (instructor takes ownership).
   *
   * Once acknowledged, the escalation is instructor-owned and automation
   * cannot silently clear, overwrite, or modify it.
   *
   * @param params - Acknowledgement parameters
   * @returns Result indicating success or error
   */
  async acknowledgeEscalation(
    params: AcknowledgeEscalationParams
  ): Promise<AcknowledgeEscalationResult> {
    const escalation = await this.dbClient.getEscalation(params.escalationId)

    if (!escalation) {
      return {
        success: false,
        error: 'Escalation not found',
      }
    }

    if (escalation.status !== 'pending') {
      return {
        success: false,
        error: `Cannot acknowledge escalation in status: ${escalation.status}`,
      }
    }

    if (escalation.acknowledgedBy !== null) {
      return {
        success: false,
        error: 'Escalation already acknowledged by another instructor',
      }
    }

    return this.dbClient.acknowledgeEscalation(params)
  }

  /**
   * Check if an escalation is instructor-owned.
   *
   * Instructor-owned escalations are protected from automated modification.
   *
   * @param escalation - The escalation to check
   * @returns true if instructor-owned
   */
  isInstructorOwned(escalation: InstructorEscalation): boolean {
    return escalation.acknowledgedBy !== null
  }

  /**
   * Check if an escalation can be auto-cleared.
   *
   * Only pending, non-owned escalations can be auto-cleared by
   * sustained-performance reset.
   *
   * @param escalation - The escalation to check
   * @returns true if eligible for auto-clear
   */
  canAutoClear(escalation: InstructorEscalation): boolean {
    return (
      escalation.status === 'pending' &&
      escalation.acknowledgedBy === null
    )
  }

  /**
   * Get the active escalation for a user/concept, if any.
   *
   * @param userId - Student user ID
   * @param conceptId - Concept ID
   * @returns Active escalation or null
   */
  async getActiveEscalation(
    userId: string,
    conceptId: ConceptId
  ): Promise<InstructorEscalation | null> {
    return this.dbClient.getActiveEscalation(userId, conceptId)
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create an escalation service instance.
 */
export function createEscalationService(
  dbClient: IEscalationDatabaseClient
): EscalationService {
  return new EscalationService(dbClient)
}
