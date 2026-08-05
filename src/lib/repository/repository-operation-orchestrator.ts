/**
 * Repository — Repository Operation Orchestrator
 *
 * Deterministic orchestrator that converts an execution session into an
 * ordered operation queue. Flattens execution stages into a single queue
 * without executing operations or modifying the repository.
 *
 * The orchestrator:
 * - uses deterministic rules only — no AI, no semantic analysis.
 * - does NOT execute operations.
 * - does NOT inspect repository contents.
 * - does NOT modify the repository.
 * - never throws.
 *
 * Milestone 10.1.1: repository operation orchestration only.
 */

import { RepositoryChangeExecutionPlan } from './repository-change-execution-plan'
import { RepositoryExecutionSession } from './repository-execution-session'
import {
  RepositoryOperationQueue,
  RepositoryQueuedOperation,
} from './repository-operation-queue'
import { hashString } from '../execution/execution-guards'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in queue metadata. */
const ORCHESTRATOR_VERSION = 'repository-operation-orchestrator@10.1.1'

// ============================================================================
// REPOSITORY OPERATION ORCHESTRATOR
// ============================================================================

/**
 * Deterministic orchestrator for repository operation queues.
 *
 * Converts an execution session into an immutable operation queue by
 * flattening execution stages. Never throws. Never modifies the repository.
 */
export class RepositoryOperationOrchestrator {
  /**
   * Creates an operation queue from the given session and execution plan.
   *
   * @param session - The RepositoryExecutionSession to orchestrate.
   * @param executionPlan - The RepositoryChangeExecutionPlan to flatten.
   * @returns An immutable RepositoryOperationQueue.
   */
  orchestrate(
    session: RepositoryExecutionSession,
    executionPlan: RepositoryChangeExecutionPlan
  ): RepositoryOperationQueue {
    if (session.status === 'Blocked') {
      return this.buildBlockedQueue(session)
    }

    if (executionPlan.stages.length === 0) {
      return this.buildEmptyQueue(session)
    }

    return this.buildReadyQueue(session, executionPlan)
  }

  /**
   * Builds a blocked queue for a blocked session.
   */
  private buildBlockedQueue(
    session: RepositoryExecutionSession
  ): RepositoryOperationQueue {
    return {
      queueId: `queue-${session.sessionId}`,
      queueVersion: ORCHESTRATOR_VERSION,
      sessionId: session.sessionId,
      status: 'Blocked',
      operations: [],
      totalOperations: 0,
      metadata: {
        orchestratorVersion: ORCHESTRATOR_VERSION,
        sessionId: session.sessionId,
        createdAt: new Date().toISOString(),
        status: 'Blocked',
      },
    }
  }

  /**
   * Builds an empty queue for a plan with no stages.
   */
  private buildEmptyQueue(
    session: RepositoryExecutionSession
  ): RepositoryOperationQueue {
    return {
      queueId: `queue-${session.sessionId}`,
      queueVersion: ORCHESTRATOR_VERSION,
      sessionId: session.sessionId,
      status: 'Empty',
      operations: [],
      totalOperations: 0,
      metadata: {
        orchestratorVersion: ORCHESTRATOR_VERSION,
        sessionId: session.sessionId,
        createdAt: new Date().toISOString(),
        status: 'Empty',
      },
    }
  }

  /**
   * Builds a ready queue by flattening execution stages.
   */
  private buildReadyQueue(
    session: RepositoryExecutionSession,
    executionPlan: RepositoryChangeExecutionPlan
  ): RepositoryOperationQueue {
    const operations = this.flattenStages(executionPlan)

    return {
      queueId: `queue-${session.sessionId}`,
      queueVersion: ORCHESTRATOR_VERSION,
      sessionId: session.sessionId,
      status: 'Ready',
      operations,
      totalOperations: operations.length,
      metadata: {
        orchestratorVersion: ORCHESTRATOR_VERSION,
        sessionId: session.sessionId,
        createdAt: new Date().toISOString(),
        status: 'Ready',
        stageCount: executionPlan.stages.length,
        totalOperations: operations.length,
      },
    }
  }

  /**
   * Flattens execution stages into a single ordered operation queue.
   */
  private flattenStages(
    executionPlan: RepositoryChangeExecutionPlan
  ): readonly RepositoryQueuedOperation[] {
    const operations: RepositoryQueuedOperation[] = []
    let order = 1

    for (const stage of executionPlan.stages) {
      for (const operation of stage.operations) {
        operations.push({
          queuedOperationId: `queued-op-${order}-${hashString(operation.operationId)}`,
          order,
          stageName: stage.name,
          action: operation.action,
          target: operation.target,
        })
        order++
      }
    }

    return operations
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default operation orchestrator instance. Stateless and safe to share.
 */
export const repositoryOperationOrchestrator = new RepositoryOperationOrchestrator()
