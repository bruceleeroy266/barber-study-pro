/**
 * Task Planner — Resource Requirements Model
 *
 * Immutable models representing the deterministic estimation of resources
 * required to complete a task.
 *
 * It carries no allocation, no scheduling, and no execution logic — it is
 * purely an estimation attached to the plan.
 *
 * Milestone 1.5.3: resource estimation model only.
 */

import { ComplexityLevel } from '../complexity-model/complexity-level'

// ============================================================================
// RESOURCE LEVEL
// ============================================================================

/**
 * Qualitative resource level (LOW, MEDIUM, HIGH).
 */
export enum ResourceLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
}

// ============================================================================
// RESOURCE REQUIREMENTS
// ============================================================================

/**
 * The result of estimating resource requirements.
 *
 * Immutable: consumers should treat instances as read-only.
 */
export interface ResourceRequirements {
  /** Estimated number of files the task will touch. */
  readonly estimatedFiles: number

  /** Estimated runtime in minutes. */
  readonly estimatedRuntimeMinutes: number

  /** Estimated qualitative complexity. */
  readonly estimatedComplexity: ComplexityLevel

  /** Estimated memory usage level. */
  readonly estimatedMemoryUsage: ResourceLevel

  /** Estimated risk level. */
  readonly estimatedRisk: ResourceLevel

  /** Generic extensible metadata. */
  readonly metadata?: Record<string, unknown>
}
