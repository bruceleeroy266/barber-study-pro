/**
 * Phase 6C-2b — Reassessment Service
 *
 * Minimum reusable service for reassessment question selection and recording.
 * Establishes the integrity boundary for Phase 6C-2b without implementing
 * remediation UI or other Phase 6C features.
 *
 * This service orchestrates:
 *   1. Exclusion set computation
 *   2. Question selection
 *   3. Concurrent-safe recording
 */

import type {
  ChapterId,
  ConceptId,
  ExclusionSet,
  IExclusionDatabaseClient,
  PoolExhaustionState,
  QuizQuestionId,
} from './types'
import { HistoricalExclusionEngine } from './exclusion-engine'
import { getCanonicalMappingProvider } from './provider-registry'

// ───────────────────────────────────────────────
// Reassessment Service Types
// ───────────────────────────────────────────────

export interface ReassessmentQuestionSelection {
  /** Whether selection was successful */
  success: boolean
  /** The selected question ID (if successful) */
  questionId?: QuizQuestionId
  /** Pool exhaustion state (if exhausted) */
  poolExhaustion?: PoolExhaustionState
  /** Error message (if failed) */
  error?: string
  /** The exclusion set used for selection */
  exclusionSet: ExclusionSet
}

export interface RecordAttemptResult {
  /** Whether recording was successful */
  success: boolean
  /** The recorded attempt ID (if successful) */
  attemptId?: string
  /** Whether the attempt was already recorded (concurrent) */
  alreadyRecorded?: boolean
  /** Error message (if failed) */
  error?: string
}

/**
 * Result of a combined select-and-reserve operation.
 * Guarantees that the returned question has been successfully reserved
 * in reassessment_question_history before being returned to the caller.
 */
export interface SelectAndReserveResult {
  /** Whether a question was successfully selected AND reserved */
  success: boolean
  /** The selected and reserved question ID (only present if success=true and reservation confirmed) */
  questionId?: QuizQuestionId
  /** The reservation attempt ID from reassessment_question_history (only present if success=true) */
  reservationId?: string
  /** Pool exhaustion state (if exhausted after all retries) */
  poolExhaustion?: PoolExhaustionState
  /** Error message (if failed) */
  error?: string
  /** The final exclusion set used (after all retries) */
  exclusionSet: ExclusionSet
  /** Number of reservation attempts made (1 = first try succeeded, >1 = conflicts occurred) */
  reservationAttempts: number
}

/** Maximum number of select-and-reserve retry attempts before giving up */
const MAX_RESERVATION_ATTEMPTS = 50

// ───────────────────────────────────────────────
// Reassessment Service
// ───────────────────────────────────────────────

export class ReassessmentService {
  private readonly exclusionEngine: HistoricalExclusionEngine

  constructor(
    private readonly dbClient: IExclusionDatabaseClient,
    private readonly chapterId: ChapterId
  ) {
    this.exclusionEngine = new HistoricalExclusionEngine(dbClient, chapterId)
  }

  /**
   * ⚠️ INTERNAL USE ONLY — NOT PRESENTATION-SAFE.
   *
   * Select an eligible reassessment question for a student + concept.
   *
   * This method:
   *   1. Computes the exclusion set (historical + reassessment history)
   *   2. Filters eligible questions from the canonical pool
   *   3. Returns NULL with explicit exhaustion state if pool is exhausted
   *
   * ⚠️ WARNING: This method does NOT reserve the question. The caller MUST
   * call recordAttempt() separately, which creates a race condition window.
   * For presentation-safe question selection, use selectAndReserveQuestion().
   *
   * This method is retained for internal/testing purposes only.
   * Do NOT use this as the normal reassessment path.
   *
   * @internal
   */
  private async selectQuestionInternal(
    userId: string,
    conceptId: ConceptId,
    cycleId: string
  ): Promise<ReassessmentQuestionSelection> {
    const result = await this.exclusionEngine.selectReassessmentQuestion(
      userId,
      conceptId,
      cycleId
    )

    return {
      success: result.success,
      questionId: result.selectedQuestionId,
      poolExhaustion: result.poolExhaustion,
      error: result.error,
      exclusionSet: result.exclusionSet,
    }
  }

  /**
   * Select AND reserve a reassessment question atomically.
   *
   * This is the ONLY presentation-safe public API for reassessment question
   * selection. It guarantees that the returned question has been successfully
   * reserved in reassessment_question_history before being returned.
   *
   * Safe sequence (per governing invariant):
   *   1. Build exclusion set
   *   2. Determine eligible questions
   *   3. Choose candidate
   *   4. Attempt DB reservation (INSERT ... ON CONFLICT DO NOTHING)
   *   5. Verify reservation success
   *   6. Return question ONLY after successful reservation
   *
   * On reservation conflict:
   *   - Do NOT return the conflicting candidate
   *   - Recompute/recheck exclusions (fresh data)
   *   - Choose another eligible candidate
   *   - Attempt reservation again
   *   - Repeat until success or verified pool exhaustion
   *
   * Pool exhaustion is only declared after recomputing eligibility
   * following any reservation conflict and confirming no legitimate
   * unseen candidate remains.
   *
   * The database UNIQUE (user_id, concept_id, question_id) constraint
   * remains the final concurrency authority. ON CONFLICT DO NOTHING
   * returning NULL is interpreted as reservation failure.
   */
  async selectAndReserveQuestion(
    userId: string,
    conceptId: ConceptId,
    cycleId: string,
    quizAttemptId: string
  ): Promise<SelectAndReserveResult> {
    let lastExclusionSet: ExclusionSet | null = null
    let reservationAttempts = 0

    for (let attempt = 0; attempt < MAX_RESERVATION_ATTEMPTS; attempt++) {
      reservationAttempts++

      // Step 1-3: Build exclusion set, determine eligible questions, choose candidate
      const selection = await this.exclusionEngine.selectReassessmentQuestion(
        userId,
        conceptId,
        cycleId
      )

      lastExclusionSet = selection.exclusionSet

      // Pool exhausted — no eligible questions remain
      if (!selection.success || !selection.selectedQuestionId) {
        return {
          success: false,
          poolExhaustion: selection.poolExhaustion,
          error: selection.error ?? 'No eligible questions available',
          exclusionSet: selection.exclusionSet,
          reservationAttempts,
        }
      }

      const candidateQuestionId = selection.selectedQuestionId

      // Step 4-5: Attempt DB reservation and verify success
      try {
        const reservationId = await this.dbClient.recordQuestionAttempt(
          userId,
          conceptId,
          candidateQuestionId,
          quizAttemptId,
          cycleId,
          false // isCorrect is unknown at reservation time; will be updated when attempt is recorded
        )

        if (reservationId === null) {
          // ON CONFLICT DO NOTHING returned NULL — reservation failed (concurrent conflict)
          // Do NOT return this candidate. Loop back to recompute exclusions.
          continue
        }

        // Step 6: Reservation successful — return the question
        return {
          success: true,
          questionId: candidateQuestionId,
          reservationId,
          exclusionSet: selection.exclusionSet,
          reservationAttempts,
        }
      } catch (error) {
        // Database error — not a conflict, but a genuine failure
        return {
          success: false,
          error: `Reservation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          exclusionSet: selection.exclusionSet,
          reservationAttempts,
        }
      }
    }

    // Exhausted all retry attempts without successful reservation
    // This should be extremely rare (indicates very high contention)
    return {
      success: false,
      error: `Failed to reserve a question after ${MAX_RESERVATION_ATTEMPTS} attempts. High contention detected.`,
      exclusionSet: lastExclusionSet!,
      reservationAttempts,
    }
  }

  /**
   * Record a reassessment question attempt with concurrency protection.
   *
   * This method uses the database's ON CONFLICT DO NOTHING protection
   * to handle race conditions where two concurrent requests select the
   * same question.
   *
   * ⚠️ INTERNAL USE ONLY — This method is used internally by
   * selectAndReserveQuestion(). It is not part of the public API
   * for presentation flows.
   *
   * Returns:
   *   - success: true, attemptId: <id> if the attempt was recorded
   *   - success: true, alreadyRecorded: true if the attempt already existed
   *   - success: false, error: <message> if recording failed
   *
   * @internal
   */
  private async recordAttemptInternal(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId,
    quizAttemptId: string,
    cycleId: string | null,
    isCorrect: boolean
  ): Promise<RecordAttemptResult> {
    try {
      const attemptId = await this.dbClient.recordQuestionAttempt(
        userId,
        conceptId,
        questionId,
        quizAttemptId,
        cycleId,
        isCorrect
      )

      if (attemptId === null) {
        // ON CONFLICT DO NOTHING returned NULL — already recorded
        return {
          success: true,
          alreadyRecorded: true,
        }
      }

      return {
        success: true,
        attemptId,
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Check if a question is eligible for reassessment.
   */
  async isQuestionEligible(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId
  ): Promise<boolean> {
    return this.exclusionEngine.isQuestionEligible(userId, conceptId, questionId)
  }

  /**
   * Get the pool exhaustion state for a student + concept.
   */
  async getPoolExhaustionState(
    userId: string,
    conceptId: ConceptId
  ): Promise<PoolExhaustionState> {
    return this.exclusionEngine.getPoolExhaustionState(userId, conceptId)
  }

  /**
   * Compute the exclusion set for a student + concept.
   * Exposed for testing and debugging.
   */
  async computeExclusionSet(
    userId: string,
    conceptId: ConceptId
  ): Promise<ExclusionSet> {
    return this.exclusionEngine.computeExclusionSet(userId, conceptId)
  }

  /**
   * Get the canonical mapping provider for this service's chapter.
   * Exposed for testing and debugging.
   */
  getMappingProvider() {
    return getCanonicalMappingProvider(this.chapterId)
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a reassessment service for a specific chapter.
 */
export function createReassessmentService(
  dbClient: IExclusionDatabaseClient,
  chapterId: ChapterId
): ReassessmentService {
  return new ReassessmentService(dbClient, chapterId)
}
