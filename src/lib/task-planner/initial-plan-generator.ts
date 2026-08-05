/**
 * Task Planner — Initial Plan Generator
 *
 * Deterministic generator that produces a valid TaskPlan skeleton from a
 * TaskPlannerRequest. This milestone creates ONLY the planning skeleton —
 * no phases, no steps, no decomposition, no estimation.
 *
 * Milestone 3: initial skeleton generation only.
 */

import { TaskPlan } from './task-plan'
import { TaskPlannerRequest } from './task-planner-request'

// ============================================================================
// INITIAL PLAN GENERATOR
// ============================================================================

/**
 * Generates an initial TaskPlan skeleton from a planner request.
 *
 * The generated plan contains:
 * - A stable, deterministic ID derived from the request content
 * - The task name (from the task description)
 * - An empty phases array (to be populated by future milestones)
 * - Metadata indicating this is an initial skeleton
 *
 * This generator is deterministic: the same request always produces the same
 * plan ID and structure.
 */
export class InitialPlanGenerator {
  /**
   * Generates an initial TaskPlan skeleton.
   *
   * @param request - The complete planning input.
   * @returns A TaskPlan with empty phases, ready for future decomposition.
   */
  generate(request: TaskPlannerRequest): TaskPlan {
    const id = this.generatePlanId(request.taskDescription)
    const name = this.extractTaskName(request.taskDescription)

    return {
      id,
      name,
      phases: [],
      metadata: {
        createdAt: new Date().toISOString(),
        plannerVersion: '1.3.3',
        generatedBy: 'InitialPlanGenerator',
        skeleton: true,
        sourceRequest: {
          taskDescription: request.taskDescription,
          complexityLevel: request.complexityReport.level,
          budgetDecision: request.budgetDecision.decision,
          readinessStatus: request.executionReadiness.status,
        },
      },
    }
  }

  /**
   * Generates a stable, deterministic plan ID from the task description.
   * Uses a simple hash function to ensure the same input always produces
   * the same ID.
   */
  private generatePlanId(taskDescription: string): string {
    let hash = 0
    for (let i = 0; i < taskDescription.length; i++) {
      const char = taskDescription.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    const timestamp = Date.now()
    return `plan-${Math.abs(hash)}-${timestamp}`
  }

  /**
   * Extracts a concise task name from the description.
   * Takes the first 50 characters or up to the first newline, whichever is
   * shorter.
   */
  private extractTaskName(taskDescription: string): string {
    const firstLine = taskDescription.split('\n')[0]
    return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine
  }
}
