/**
 * Task Planner — Planning Strategy Model
 *
 * Immutable models representing the deterministic recommendation for which
 * planning strategy should eventually be used, based on the TaskClassification.
 *
 * It carries no strategy execution, no adaptive planning, and no behavior
 * changes — it is purely a recommendation attached to the plan.
 *
 * Milestone 1.5.2: strategy recommendation model only.
 */

import { TaskType } from './task-classification'

// ============================================================================
// PLANNING STRATEGY
// ============================================================================

/**
 * The recommended planning strategy.
 */
export enum PlanningStrategy {
  /** Default strategy for unclassified tasks. */
  Generic = 'generic',

  /** Strategy for general code changes. */
  CodeChange = 'code_change',

  /** Strategy for bug fixes. */
  BugFix = 'bug_fix',

  /** Strategy for refactoring work. */
  Refactor = 'refactor',

  /** Strategy for testing work. */
  Testing = 'testing',

  /** Strategy for documentation work. */
  Documentation = 'documentation',

  /** Strategy for configuration work. */
  Configuration = 'configuration',

  /** Strategy for database work. */
  Database = 'database',

  /** Strategy for deployment work. */
  Deployment = 'deployment',
}

// ============================================================================
// PLANNING STRATEGY RECOMMENDATION
// ============================================================================

/**
 * The result of recommending a planning strategy.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface PlanningStrategyRecommendation {
  /** The recommended planning strategy. */
  readonly strategy: PlanningStrategy

  /** Confidence in the recommendation (0–100). */
  readonly confidence: number

  /** Human-readable rationale for the recommendation. */
  readonly rationale: string

  /** The task type that produced this recommendation. */
  readonly sourceTaskType: TaskType

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
