/**
 * Phase 6C-2c — Sustained-Performance Reset Service
 *
 * Application-layer service for managing sustained-performance tracking
 * and deterministic reset execution.
 *
 * Binding Rules (from Phase 6C-1 §3.4.1):
 *   - 30 consecutive days in currently_performing_well required
 *   - Clock starts at most recent evidence-supported transition into CPW
 *   - Any transition out restarts the clock
 *   - Inactivity alone cannot qualify
 *   - At least one additional concept-mapped assessment required
 *   - Successful reset clears cycle counter, unsuccessful counter, and lockout
 *   - Non-owned escalations may be auto-cleared; instructor-owned protected
 */

import type {
  ConceptId,
  DetectionTransitionParams,
  DetectionTransitionResult,
  ExecuteResetResult,
  IEscalationDatabaseClient,
  RecordFollowUpEvidenceParams,
  RecordFollowUpEvidenceResult,
  ResetEligibilityResult,
  SustainedPerformanceTracking,
} from './types'
import type { ICanonicalMappingProvider } from '../reassessment/types'

// ───────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────

/** Required consecutive days in CPW for reset eligibility (30 per Phase 6C-1 §3.4.1) */
const REQUIRED_CPW_DAYS = 30

/** Minimum follow-up evidence count for reset eligibility (1 per Phase 6C-1 §3.4.1) */
const MIN_FOLLOW_UP_EVIDENCE = 1

// ───────────────────────────────────────────────
// Sustained-Performance Service
// ───────────────────────────────────────────────

export class SustainedPerformanceService {
  constructor(
    private readonly dbClient: IEscalationDatabaseClient,
    private readonly mappingProvider?: ICanonicalMappingProvider,
  ) {}

  /**
   * Record a detection state transition from the Phase 6B-3 detection engine.
   *
   * This method manages the sustained_performance_tracking lifecycle:
   *   - Transition into CPW: starts new tracking period
   *   - Continued CPW: updates last_verified_at
   *   - Transition out of CPW: breaks continuity, ends tracking period
   *
   * NOTE: This method does NOT record follow-up evidence. Use
   * recordFollowUpEvidence() for that purpose, which performs
   * authoritative verification before recording.
   *
   * @param params - Detection transition parameters
   * @returns Result with tracking state information
   */
  async recordDetectionTransition(
    params: DetectionTransitionParams
  ): Promise<DetectionTransitionResult> {
    return this.dbClient.recordDetectionTransition(params)
  }

  /**
   * Record verified follow-up assessment evidence.
   *
   * This method performs two-layer verification:
   *   1. Application layer: verifies canonical question→concept mapping
   *      using the registered ICanonicalMappingProvider
   *   2. Database layer: verifies attempt exists, belongs to student,
   *      completed after CPW entry, has answers, and is not a duplicate
   *
   * A caller-controlled boolean is NOT sufficient to establish qualifying
   * evidence. The application layer MUST independently verify the mapping
   * before calling this method.
   *
   * @param params - Follow-up evidence parameters including the quiz attempt ID
   * @param quizAttemptAnswers - The answers_json from the quiz attempt (for mapping verification)
   * @returns Result with evidence ID or error
   */
  async recordFollowUpEvidence(
    params: Omit<RecordFollowUpEvidenceParams, 'canonicalMappingVerified' | 'mappedQuestionCount'>,
    quizAttemptAnswers: Record<string, unknown>,
  ): Promise<RecordFollowUpEvidenceResult> {
    // ───────────────────────────────────────────────
    // Application-layer verification: canonical mapping
    // ───────────────────────────────────────────────
    if (!this.mappingProvider) {
      return {
        success: false,
        error: 'No canonical mapping provider configured. Cannot verify question→concept mapping.',
      }
    }

    // Count questions in the attempt that map to the target concept
    const questionIds = Object.keys(quizAttemptAnswers)
    let mappedQuestionCount = 0

    for (const questionId of questionIds) {
      if (this.mappingProvider.isQuestionMappedToConcept(questionId, params.conceptId)) {
        mappedQuestionCount++
      }
    }

    if (mappedQuestionCount === 0) {
      return {
        success: false,
        error: `No questions in quiz attempt ${params.quizAttemptId} are canonically mapped to concept ${params.conceptId}`,
      }
    }

    // ───────────────────────────────────────────────
    // Database-layer verification: authoritative persisted evidence
    // ───────────────────────────────────────────────
    return this.dbClient.recordFollowUpEvidence({
      ...params,
      canonicalMappingVerified: true,
      mappedQuestionCount,
    })
  }

  /**
   * Check if a concept is eligible for sustained-performance reset.
   *
   * Per Phase 6C-1 §3.4.1, eligibility requires:
   *   1. 30+ consecutive days in currently_performing_well
   *   2. At least 1 follow-up concept-mapped assessment during the period
   *   3. No continuity break (transition out of CPW)
   *
   * @param userId - Student user ID
   * @param conceptId - Concept ID to check
   * @returns Eligibility result with blocking reason if not eligible
   */
  async checkResetEligibility(
    userId: string,
    conceptId: ConceptId
  ): Promise<ResetEligibilityResult> {
    return this.dbClient.checkResetEligibility(userId, conceptId)
  }

  /**
   * Execute a sustained-performance reset.
   *
   * This method is idempotent: if a reset has already been executed for
   * the current tracking period, the existing reset ID is returned.
   *
   * On successful reset:
   *   - remediation_cycles counters are cleared (via reset flag)
   *   - automated lockout is cleared
   *   - non-owned instructor escalations are auto-cleared
   *   - instructor-owned escalations remain untouched
   *
   * @param userId - Student user ID
   * @param conceptId - Concept ID to reset
   * @param executedBy - Optional user ID executing the reset (NULL for system)
   * @returns Result with reset ID or error
   */
  async executeReset(
    userId: string,
    conceptId: ConceptId,
    executedBy?: string
  ): Promise<ExecuteResetResult> {
    // Verify eligibility first
    const eligibility = await this.checkResetEligibility(userId, conceptId)

    if (!eligibility.isEligible) {
      return {
        success: false,
        error: `Reset not eligible: ${eligibility.blockingReason}`,
      }
    }

    return this.dbClient.executeReset(userId, conceptId, executedBy)
  }

  /**
   * Get the current tracking state for a user/concept.
   *
   * @param userId - Student user ID
   * @param conceptId - Concept ID
   * @returns Current tracking state or null if not tracking
   */
  async getTrackingState(
    userId: string,
    conceptId: ConceptId
  ): Promise<SustainedPerformanceTracking | null> {
    return this.dbClient.getTrackingState(userId, conceptId)
  }

  /**
   * Check if a tracking period is active and continuity is maintained.
   *
   * @param tracking - The tracking record to check
   * @returns true if actively tracking with no continuity break
   */
  isActivelyTracking(tracking: SustainedPerformanceTracking): boolean {
    return tracking.isActive && tracking.continuityBrokenAt === null
  }

  /**
   * Calculate days elapsed in the current CPW period.
   *
   * @param tracking - The tracking record
   * @returns Days elapsed since entering CPW
   */
  getDaysInCpw(tracking: SustainedPerformanceTracking): number {
    const now = new Date()
    const entered = new Date(tracking.enteredCpwAt)
    const diffMs = now.getTime() - entered.getTime()
    return Math.floor(diffMs / (1000 * 60 * 60 * 24))
  }

  /**
   * Check if a tracking period meets the follow-up evidence requirement.
   *
   * @param tracking - The tracking record to check
   * @returns true if follow-up evidence requirement is met
   */
  hasFollowUpEvidence(tracking: SustainedPerformanceTracking): boolean {
    return tracking.followUpEvidenceCount >= MIN_FOLLOW_UP_EVIDENCE
  }

  /**
   * Check if a tracking period meets the 30-day requirement.
   *
   * @param tracking - The tracking record to check
   * @returns true if 30-day requirement is met
   */
  meetsDayRequirement(tracking: SustainedPerformanceTracking): boolean {
    return this.getDaysInCpw(tracking) >= REQUIRED_CPW_DAYS
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a sustained-performance service instance.
 *
 * @param dbClient - The escalation database client
 * @param mappingProvider - Optional canonical mapping provider for follow-up evidence verification
 */
export function createSustainedPerformanceService(
  dbClient: IEscalationDatabaseClient,
  mappingProvider?: ICanonicalMappingProvider,
): SustainedPerformanceService {
  return new SustainedPerformanceService(dbClient, mappingProvider)
}
