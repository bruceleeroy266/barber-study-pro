/**
 * Execution — Recovery Engine
 *
 * Deterministic engine that executes RecoveryPlans using placeholder
 * implementations. Execution is informational only — it does NOT perform
 * real retries, real rollback, or external notifications.
 *
 * The engine:
 * - uses deterministic placeholder implementations only.
 * - does NOT modify the RecoveryPlan.
 * - does NOT perform real retries or rollback.
 * - does NOT notify external systems.
 * - never throws.
 *
 * Milestone 8.2.2: recovery plan execution with placeholders only.
 */

import { RecoveryAction, RecoveryPlan } from './recovery-plan'
import {
  ExecutedAction,
  ExecutedActionStatus,
  RecoveryResult,
  RecoveryResultStatus,
} from './recovery-result'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in result metadata. */
const ENGINE_VERSION = 'recovery-engine@8.2.2'

// ============================================================================
// RECOVERY ENGINE
// ============================================================================

/**
 * Deterministic executor for RecoveryPlans.
 *
 * Executes each action in order using placeholder implementations. Every
 * action is marked as successfully executed. Never throws. Never modifies
 * the input plan.
 */
export class RecoveryEngine {
  /**
   * Executes the given RecoveryPlan using placeholder implementations.
   *
   * @param plan - The RecoveryPlan to execute.
   * @returns An immutable RecoveryResult.
   */
  execute(plan: RecoveryPlan): RecoveryResult {
    const executedActions: ExecutedAction[] = []

    for (const action of plan.actions) {
      const executed = this.executeAction(action)
      executedActions.push(executed)
    }

    const allSucceeded = executedActions.every((a) => a.status === 'Success')
    const status: RecoveryResultStatus = allSucceeded ? 'Success' : 'Failed'

    return {
      resultId: `result-${plan.planId}`,
      resultVersion: ENGINE_VERSION,
      planId: plan.planId,
      executedActions,
      status,
      metadata: {
        engineVersion: ENGINE_VERSION,
        planId: plan.planId,
        executedAt: new Date().toISOString(),
        totalActions: executedActions.length,
        successfulActions: executedActions.filter((a) => a.status === 'Success').length,
        failedActions: executedActions.filter((a) => a.status === 'Failed').length,
      },
    }
  }

  /**
   * Executes a single RecoveryAction using a deterministic placeholder.
   *
   * This is a placeholder implementation only. It does NOT perform real
   * retries, real rollback, or external notifications. It simply marks the
   * action as successfully executed.
   *
   * @param action - The RecoveryAction to execute.
   * @returns An immutable ExecutedAction with status Success.
   */
  private executeAction(action: RecoveryAction): ExecutedAction {
    // Placeholder implementation: deterministic success for all action types.
    // Real retry/rollback/notification logic is explicitly out of scope.
    const status: ExecutedActionStatus = 'Success'

    return {
      actionId: action.actionId,
      actionType: action.type,
      status,
      completedAt: new Date().toISOString(),
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default recovery engine instance. Stateless and safe to share.
 */
export const recoveryEngine = new RecoveryEngine()
