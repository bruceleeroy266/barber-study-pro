/**
 * Task Planner — Planning Strategy Engine
 *
 * Deterministic engine that maps a TaskClassification to a recommended
 * PlanningStrategy. The mapping is centralized in a lookup table — no
 * branching, no AI, no repository inspection.
 *
 * The engine:
 * - does NOT execute strategies or change planning behavior.
 * - is deterministic — the same classification always produces the same
 *   recommendation.
 *
 * Milestone 1.5.2: strategy recommendation only.
 */

import { TaskClassification, TaskType } from './task-classification'
import {
  PlanningStrategy,
  PlanningStrategyRecommendation,
} from './planning-strategy'

// ============================================================================
// STRATEGY MAPPING TABLE
// ============================================================================

/**
 * Centralized mapping from TaskType to PlanningStrategy.
 * Single source of truth — no branching beyond this table.
 */
const TASK_TYPE_TO_STRATEGY: Readonly<Record<TaskType, PlanningStrategy>> = {
  [TaskType.Unknown]: PlanningStrategy.Generic,
  [TaskType.CodeChange]: PlanningStrategy.CodeChange,
  [TaskType.BugFix]: PlanningStrategy.BugFix,
  [TaskType.Refactor]: PlanningStrategy.Refactor,
  [TaskType.Test]: PlanningStrategy.Testing,
  [TaskType.Documentation]: PlanningStrategy.Documentation,
  [TaskType.Configuration]: PlanningStrategy.Configuration,
  [TaskType.Database]: PlanningStrategy.Database,
  [TaskType.Deployment]: PlanningStrategy.Deployment,
}

// ============================================================================
// PLANNING STRATEGY ENGINE
// ============================================================================

export class PlanningStrategyEngine {
  /**
   * Recommends a planning strategy from the given task classification.
   *
   * @param classification - The task classification to map.
   * @returns An immutable PlanningStrategyRecommendation.
   */
  recommend(classification: TaskClassification): PlanningStrategyRecommendation {
    const strategy = TASK_TYPE_TO_STRATEGY[classification.taskType]

    return {
      strategy,
      confidence: classification.confidence,
      rationale: this.buildRationale(classification.taskType, strategy),
      sourceTaskType: classification.taskType,
      metadata: {
        engineVersion: 'planning-strategy-engine@1.5.2',
      },
    }
  }

  /**
   * Builds a human-readable rationale for the recommendation.
   */
  private buildRationale(taskType: TaskType, strategy: PlanningStrategy): string {
    return `Task type ${taskType} maps to planning strategy ${strategy}.`
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default strategy engine instance. Stateless and safe to share.
 */
export const planningStrategyEngine = new PlanningStrategyEngine()
