/**
 * Task Planner — Task Classification Model
 *
 * Immutable models representing the deterministic classification of the type
 * of work described by an ExecutionAssessment.
 *
 * It carries no planning behavior changes, no adaptive logic, and no
 * execution strategy — it is purely a classification attached to the plan.
 *
 * Milestone 1.5.1: classification model only.
 */

// ============================================================================
// TASK TYPE
// ============================================================================

/**
 * The deterministic classification of a task.
 */
export enum TaskType {
  /** No classification rule matched. */
  Unknown = 'unknown',

  /** General code change. */
  CodeChange = 'code_change',

  /** Fixing a defect. */
  BugFix = 'bug_fix',

  /** Restructuring existing code without changing behavior. */
  Refactor = 'refactor',

  /** Adding or modifying tests. */
  Test = 'test',

  /** Writing or updating documentation. */
  Documentation = 'documentation',

  /** Changing configuration or environment settings. */
  Configuration = 'configuration',

  /** Database schema or migration work. */
  Database = 'database',

  /** Deployment or release work. */
  Deployment = 'deployment',
}

// ============================================================================
// CLASSIFICATION RULE MATCH
// ============================================================================

/**
 * A single rule that matched during classification.
 */
export interface ClassificationRuleMatch {
  /** Stable identifier for the rule. */
  readonly ruleId: string

  /** The keywords that triggered the match. */
  readonly matchedKeywords: readonly string[]
}

// ============================================================================
// TASK CLASSIFICATION
// ============================================================================

/**
 * The result of classifying a task.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface TaskClassification {
  /** The classified task type. */
  readonly taskType: TaskType

  /** Confidence in the classification (0–100). */
  readonly confidence: number

  /** The rules that matched during classification. */
  readonly matchedRules: readonly ClassificationRuleMatch[]

  /** Human-readable rationale for the classification. */
  readonly rationale: string

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
