/**
 * Execution — Execution Verifier
 *
 * Deterministic verifier that evaluates the structural integrity of an
 * ExecutionOutcome. Reports results without modifying the outcome, retrying,
 * or repairing.
 *
 * The verifier:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT modify the outcome.
 * - does NOT retry or repair failures.
 * - never throws.
 *
 * Milestone 8.1.1: execution verification only.
 */

import { ExecutionOutcome } from './execution-outcome'
import { ExecutionQueueItemStatus } from './execution-queue'
import {
  ExecutionVerification,
  ExecutionVerificationCheck,
  ExecutionVerificationStatus,
} from './execution-verification'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in verification metadata. */
const VERIFIER_VERSION = 'execution-verifier@8.1.1'

// ============================================================================
// EXECUTION VERIFIER
// ============================================================================

/**
 * Deterministic verifier for ExecutionOutcome structural integrity.
 *
 * Runs a fixed set of checks against the outcome. All checks are returned
 * regardless of pass/fail status. No exceptions are thrown. No repairs.
 */
export class ExecutionVerifier {
  /**
   * Verifies the structural integrity of the given ExecutionOutcome.
   *
   * @param outcome - The ExecutionOutcome to verify.
   * @returns An immutable ExecutionVerification with all check results.
   */
  verify(outcome: ExecutionOutcome): ExecutionVerification {
    const checks: ExecutionVerificationCheck[] = [
      this.checkExecutionResultExists(outcome),
      this.checkExecutionQueueExists(outcome),
      this.checkExecutionProgressExists(outcome),
      this.checkOutcomeIdExists(outcome),
      this.checkProgressTotalsConsistent(outcome),
      this.checkQueueCountMatchesProgress(outcome),
      this.checkQueueItemStatusesValid(outcome),
    ]

    const allPassed = checks.every((c) => c.passed)
    const status: ExecutionVerificationStatus = allPassed ? 'Passed' : 'Failed'

    return {
      verificationId: `verification-${outcome.outcomeId}`,
      verificationVersion: VERIFIER_VERSION,
      outcomeId: outcome.outcomeId,
      status,
      checks,
      metadata: {
        verifierVersion: VERIFIER_VERSION,
        outcomeId: outcome.outcomeId,
        verifiedAt: new Date().toISOString(),
        totalChecks: checks.length,
        passedChecks: checks.filter((c) => c.passed).length,
        failedChecks: checks.filter((c) => !c.passed).length,
      },
    }
  }

  // ==========================================================================
  // INDIVIDUAL CHECKS
  // ==========================================================================

  private checkExecutionResultExists(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const exists = outcome.executionResult != null
    return {
      checkId: 'check-result-exists',
      name: 'ExecutionResult exists',
      passed: exists,
      message: exists
        ? 'ExecutionResult is present.'
        : 'ExecutionResult is missing.',
    }
  }

  private checkExecutionQueueExists(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const exists = outcome.executionQueue != null
    return {
      checkId: 'check-queue-exists',
      name: 'ExecutionQueue exists',
      passed: exists,
      message: exists
        ? 'ExecutionQueue is present.'
        : 'ExecutionQueue is missing.',
    }
  }

  private checkExecutionProgressExists(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const exists = outcome.executionProgress != null
    return {
      checkId: 'check-progress-exists',
      name: 'ExecutionProgress exists',
      passed: exists,
      message: exists
        ? 'ExecutionProgress is present.'
        : 'ExecutionProgress is missing.',
    }
  }

  private checkOutcomeIdExists(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const exists = outcome.outcomeId != null && outcome.outcomeId.length > 0
    return {
      checkId: 'check-outcome-id-exists',
      name: 'OutcomeId exists',
      passed: exists,
      message: exists
        ? `OutcomeId '${outcome.outcomeId}' is present.`
        : 'OutcomeId is missing or empty.',
    }
  }

  private checkProgressTotalsConsistent(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const progress = outcome.executionProgress
    if (!progress) {
      return {
        checkId: 'check-progress-totals',
        name: 'Progress totals are internally consistent',
        passed: false,
        message: 'ExecutionProgress is missing — cannot verify totals.',
      }
    }

    const sumMatches = progress.completedItems + progress.remainingItems === progress.totalItems
    const percentValid = progress.totalItems === 0
      ? progress.percentComplete === 100
      : progress.percentComplete === Math.floor((progress.completedItems / progress.totalItems) * 100)

    const passed = sumMatches && percentValid
    return {
      checkId: 'check-progress-totals',
      name: 'Progress totals are internally consistent',
      passed,
      message: passed
        ? 'Progress totals are consistent.'
        : `Progress totals inconsistent: completed=${progress.completedItems}, remaining=${progress.remainingItems}, total=${progress.totalItems}, percent=${progress.percentComplete}.`,
    }
  }

  private checkQueueCountMatchesProgress(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const queue = outcome.executionQueue
    const progress = outcome.executionProgress

    if (!queue || !progress) {
      return {
        checkId: 'check-queue-progress-match',
        name: 'Queue item count matches progress totals',
        passed: false,
        message: 'Queue or progress missing — cannot verify count match.',
      }
    }

    const queueCount = queue.items.length
    const progressTotal = progress.totalItems
    const passed = queueCount === progressTotal

    return {
      checkId: 'check-queue-progress-match',
      name: 'Queue item count matches progress totals',
      passed,
      message: passed
        ? `Queue count (${queueCount}) matches progress total (${progressTotal}).`
        : `Queue count (${queueCount}) does not match progress total (${progressTotal}).`,
    }
  }

  private checkQueueItemStatusesValid(outcome: ExecutionOutcome): ExecutionVerificationCheck {
    const queue = outcome.executionQueue

    if (!queue) {
      return {
        checkId: 'check-queue-statuses-valid',
        name: 'Every queue item contains a valid ExecutionQueueItemStatus',
        passed: false,
        message: 'ExecutionQueue is missing — cannot verify item statuses.',
      }
    }

    const validStatuses: readonly ExecutionQueueItemStatus[] = [
      'Pending',
      'Waiting',
      'Completed',
      'Failed',
      'Skipped',
    ]

    const invalidItems = queue.items.filter(
      (item) => !validStatuses.includes(item.status)
    )

    const passed = invalidItems.length === 0

    return {
      checkId: 'check-queue-statuses-valid',
      name: 'Every queue item contains a valid ExecutionQueueItemStatus',
      passed,
      message: passed
        ? `All ${queue.items.length} queue item(s) have valid statuses.`
        : `${invalidItems.length} queue item(s) have invalid statuses.`,
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default verifier instance. Stateless and safe to share.
 */
export const executionVerifier = new ExecutionVerifier()
