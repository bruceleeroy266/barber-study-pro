/**
 * Execution — Recovery Planner
 *
 * Deterministic planner that generates an immutable RecoveryPlan from a
 * RecoveryAssessment. Planning is informational only — it does NOT execute
 * retries, perform rollback, or repair failures.
 *
 * The planner:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT modify the assessment.
 * - does NOT execute actions.
 * - never throws.
 *
 * Milestone 8.2.1: recovery plan generation only.
 */

import { RecoveryAssessment, RecommendedAction } from './recovery-assessment'
import {
  RecoveryAction,
  RecoveryActionType,
  RecoveryPlan,
  RecoveryStrategy,
} from './recovery-plan'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in plan metadata. */
const PLANNER_VERSION = 'recovery-planner@8.2.1'

/**
 * Deterministic mapping from recommended action to recovery strategy.
 */
const ACTION_TO_STRATEGY: Readonly<Record<RecommendedAction, RecoveryStrategy>> = {
  None: 'None',
  Retry: 'Retry',
  Rollback: 'Rollback',
  ManualReview: 'ManualReview',
}

/**
 * Deterministic mapping from recommended action to action type.
 */
const ACTION_TO_ACTION_TYPE: Readonly<Record<RecommendedAction, RecoveryActionType | null>> = {
  None: null,
  Retry: 'RetryExecution',
  Rollback: 'RollbackExecution',
  ManualReview: 'NotifyManualReview',
}

// ============================================================================
// RECOVERY PLANNER
// ============================================================================

/**
 * Deterministic planner for RecoveryAssessment recovery plans.
 *
 * Generates an immutable sequence of recovery actions based solely on the
 * assessment's recommended action. Never throws. Never modifies the input.
 */
export class RecoveryPlanner {
  /**
   * Generates a RecoveryPlan from the given RecoveryAssessment.
   *
   * @param assessment - The RecoveryAssessment to plan for.
   * @returns An immutable RecoveryPlan.
   */
  plan(assessment: RecoveryAssessment): RecoveryPlan {
    const recommendedAction = assessment.recommendedAction
    const strategy = ACTION_TO_STRATEGY[recommendedAction]
    const actions = this.buildActions(assessment.assessmentId, recommendedAction)

    return {
      planId: `plan-${assessment.assessmentId}`,
      planVersion: PLANNER_VERSION,
      assessmentId: assessment.assessmentId,
      strategy,
      actions,
      metadata: {
        plannerVersion: PLANNER_VERSION,
        assessmentId: assessment.assessmentId,
        recommendedAction,
        plannedAt: new Date().toISOString(),
        actionCount: actions.length,
      },
    }
  }

  /**
   * Builds the deterministic action list for the given recommended action.
   *
   * @param assessmentId - The assessment identifier for action IDs.
   * @param recommendedAction - The recommended action from the assessment.
   * @returns An immutable array of RecoveryActions.
   */
  private buildActions(
    assessmentId: string,
    recommendedAction: RecommendedAction
  ): readonly RecoveryAction[] {
    const actionType = ACTION_TO_ACTION_TYPE[recommendedAction]

    if (actionType === null) {
      return []
    }

    const action: RecoveryAction = {
      actionId: `action-${assessmentId}-1`,
      order: 1,
      type: actionType,
      description: this.getActionDescription(actionType),
    }

    return [action]
  }

  /**
   * Returns the human-readable description for an action type.
   *
   * @param actionType - The action type.
   * @returns The description string.
   */
  private getActionDescription(actionType: RecoveryActionType): string {
    switch (actionType) {
      case 'RetryExecution':
        return 'Retry the failed execution step.'
      case 'RollbackExecution':
        return 'Rollback the execution to a previous stable state.'
      case 'NotifyManualReview':
        return 'Notify an administrator for manual review and intervention.'
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default planner instance. Stateless and safe to share.
 */
export const recoveryPlanner = new RecoveryPlanner()
