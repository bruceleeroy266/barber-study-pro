/**
 * Repository — Repository Execution Coordinator
 *
 * Deterministic coordinator that prepares and tracks execution state for
 * repository change plans. Coordination is informational only — it does NOT
 * execute operations, inspect source code, or modify the repository.
 *
 * The coordinator:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT execute operations.
 * - does NOT inspect repository contents.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 10.0.1: repository execution coordination only.
 */

import { RepositoryChangeExecutionPlan } from './repository-change-execution-plan'
import { RepositoryExecutionSession } from './repository-execution-session'
import { requireNonNull, requireProperty, combineGuards } from '../execution/execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in session metadata. */
const COORDINATOR_VERSION = 'repository-execution-coordinator@10.0.1'

// ============================================================================
// REPOSITORY EXECUTION COORDINATOR
// ============================================================================

/**
 * Deterministic coordinator for repository execution sessions.
 *
 * Creates an immutable execution session from a RepositoryChangeExecutionPlan.
 * Never throws. Never modifies the repository.
 */
export class RepositoryExecutionCoordinator {
  /**
   * Creates an execution session from the given execution plan.
   *
   * @param executionPlan - The RepositoryChangeExecutionPlan to coordinate.
   * @returns An immutable RepositoryExecutionSession.
   */
  coordinate(
    executionPlan: RepositoryChangeExecutionPlan
  ): RepositoryExecutionSession {
    // Input validation guard
    const guard = combineGuards(
      requireNonNull(executionPlan, 'RepositoryChangeExecutionPlan'),
      requireProperty(executionPlan, 'executionPlanId', 'RepositoryChangeExecutionPlan'),
      requireProperty(executionPlan, 'status', 'RepositoryChangeExecutionPlan')
    )

    if (!guard.passed) {
      return this.buildGuardFailedSession(executionPlan, guard.message)
    }

    if (executionPlan.status === 'Blocked') {
      return this.buildBlockedSession(executionPlan)
    }

    return this.buildReadySession(executionPlan)
  }

  /**
   * Builds a guard-failed session when input validation fails.
   */
  private buildGuardFailedSession(
    executionPlan: RepositoryChangeExecutionPlan | null | undefined,
    reason: string
  ): RepositoryExecutionSession {
    return {
      sessionId: `session-guard-failed-${executionPlan?.executionPlanId ?? 'unknown'}`,
      sessionVersion: COORDINATOR_VERSION,
      executionPlanId: executionPlan?.executionPlanId ?? 'unknown',
      status: 'Blocked',
      currentStage: null,
      completedOperations: 0,
      remainingOperations: 0,
      metadata: {
        coordinatorVersion: COORDINATOR_VERSION,
        executionPlanId: executionPlan?.executionPlanId ?? 'unknown',
        createdAt: new Date().toISOString(),
        status: 'Blocked',
        guardFailed: true,
        guardReason: reason,
      },
    }
  }

  /**
   * Builds a blocked session for a blocked execution plan.
   */
  private buildBlockedSession(
    executionPlan: RepositoryChangeExecutionPlan
  ): RepositoryExecutionSession {
    return {
      sessionId: `session-${executionPlan.executionPlanId}`,
      sessionVersion: COORDINATOR_VERSION,
      executionPlanId: executionPlan.executionPlanId,
      status: 'Blocked',
      currentStage: null,
      completedOperations: 0,
      remainingOperations: 0,
      metadata: {
        coordinatorVersion: COORDINATOR_VERSION,
        executionPlanId: executionPlan.executionPlanId,
        createdAt: new Date().toISOString(),
        status: 'Blocked',
      },
    }
  }

  /**
   * Builds a ready session for a planned execution plan.
   */
  private buildReadySession(
    executionPlan: RepositoryChangeExecutionPlan
  ): RepositoryExecutionSession {
    const firstStage = executionPlan.stages.length > 0
      ? executionPlan.stages[0]
      : null

    return {
      sessionId: `session-${executionPlan.executionPlanId}`,
      sessionVersion: COORDINATOR_VERSION,
      executionPlanId: executionPlan.executionPlanId,
      status: 'Ready',
      currentStage: firstStage,
      completedOperations: 0,
      remainingOperations: executionPlan.estimatedOperations,
      metadata: {
        coordinatorVersion: COORDINATOR_VERSION,
        executionPlanId: executionPlan.executionPlanId,
        createdAt: new Date().toISOString(),
        status: 'Ready',
        stageCount: executionPlan.stages.length,
        estimatedOperations: executionPlan.estimatedOperations,
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default execution coordinator instance. Stateless and safe to share.
 */
export const repositoryExecutionCoordinator = new RepositoryExecutionCoordinator()
