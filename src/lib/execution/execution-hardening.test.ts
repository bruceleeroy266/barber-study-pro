/**
 * Execution Hardening — Integration Tests
 *
 * Verifies that input validation guards produce safe, diagnostic-bearing
 * outputs when given invalid inputs, and that valid inputs still work
 * correctly (backward compatibility).
 *
 * Run with: npx tsx --test src/lib/execution/execution-hardening.test.ts
 */

import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { ExecutionEngine } from './execution-engine'
import { ExecutionContextBuilder } from './execution-context-builder'
import { ExecutionQueueBuilder } from './execution-queue-builder'
import { ExecutionProgressBuilder } from './execution-progress-builder'
import { ExecutionQueueUpdater } from './execution-queue-updater'
import { ExecutionProgressUpdater } from './execution-progress-updater'
import { ExecutionLifecycleCoordinator } from './execution-lifecycle-coordinator'
import { ExecutionContext } from './execution-context'
import { ExecutionSession } from './execution-session'
import { ExecutionQueue } from './execution-queue'
import { ExecutionProgress } from './execution-progress'
import { ExecutionOutcome } from './execution-outcome'
import { TaskPlan } from '../task-planner/task-plan'

// ============================================================================
// FIXTURES
// ============================================================================

function buildValidTaskPlan(): TaskPlan {
  return {
    id: 'plan-1',
    name: 'Test Plan',
    phases: [
      {
        id: 'phase-1',
        name: 'Phase 1',
        order: 1,
        steps: [
          { id: 'step-1', name: 'Step 1', priority: 'High', constraint: 'None', dependsOn: [] },
          { id: 'step-2', name: 'Step 2', priority: 'Medium', constraint: 'None', dependsOn: [] },
        ],
      },
    ],
    metadata: {
      planningTemplate: { templateId: 'tmpl-1' },
      planningPolicy: { policyId: 'pol-1' },
      resourceRequirements: { estimatedDuration: '1h' },
      taskClassification: { type: 'development' },
      planningValidation: { status: 'Valid' },
    },
  } as unknown as TaskPlan
}

function buildValidContext(): ExecutionContext {
  const builder = new ExecutionContextBuilder()
  return builder.build(buildValidTaskPlan())
}

function buildValidSession(): ExecutionSession {
  const engine = new ExecutionEngine()
  return engine.start(buildValidContext())
}

// ============================================================================
// EXECUTION ENGINE GUARD TESTS
// ============================================================================

describe('ExecutionEngine hardening', () => {
  it('should return Failed session for null context', () => {
    const engine = new ExecutionEngine()
    const session = engine.start(null as unknown as ExecutionContext)

    assert.strictEqual(session.status, 'Failed')
    assert.strictEqual(session.metadata?.blocked, true)
    assert.strictEqual(typeof session.metadata?.blockReason, 'string')
    assert.strictEqual(typeof session.metadata?.blockGuard, 'string')
  })

  it('should return Failed session for context missing taskPlan', () => {
    const engine = new ExecutionEngine()
    const badContext = { contextId: 'ctx-1' } as ExecutionContext
    const session = engine.start(badContext)

    assert.strictEqual(session.status, 'Failed')
    assert.strictEqual(session.metadata?.blocked, true)
  })

  it('should return valid session for valid context', () => {
    const engine = new ExecutionEngine()
    const session = engine.start(buildValidContext())

    assert.strictEqual(session.status, 'Pending')
    assert.strictEqual(session.metadata?.blocked, undefined)
    assert.ok(session.sessionId.startsWith('session-'))
  })

  it('should return null from executeNext for null session', () => {
    const engine = new ExecutionEngine()
    const result = engine.executeNext(null as unknown as ExecutionSession)
    assert.strictEqual(result, null)
  })

  it('should return null from executeNext for session without queue', () => {
    const engine = new ExecutionEngine()
    const session: ExecutionSession = {
      sessionId: 'test-session',
      sessionVersion: 'test',
      executionContext: buildValidContext(),
      status: 'Pending',
      metadata: {},
    }
    const result = engine.executeNext(session)
    assert.strictEqual(result, null)
  })

  it('should execute successfully with valid session', () => {
    const engine = new ExecutionEngine()
    const session = buildValidSession()
    const outcome = engine.executeNext(session)

    assert.notStrictEqual(outcome, null)
    assert.ok(outcome!.outcomeId.startsWith('outcome-'))
    assert.ok(outcome!.executionResult)
    assert.ok(outcome!.executionQueue)
    assert.ok(outcome!.executionProgress)
  })
})

// ============================================================================
// CONTEXT BUILDER GUARD TESTS
// ============================================================================

describe('ExecutionContextBuilder hardening', () => {
  it('should return blocked context for null plan', () => {
    const builder = new ExecutionContextBuilder()
    const context = builder.build(null as unknown as TaskPlan)

    assert.strictEqual(context.metadata?.blocked, true)
    assert.strictEqual(typeof context.metadata?.blockReason, 'string')
  })

  it('should return blocked context for plan without metadata', () => {
    const builder = new ExecutionContextBuilder()
    const badPlan = { id: 'plan-1', name: 'Test', phases: [] } as unknown as TaskPlan
    const context = builder.build(badPlan)

    assert.strictEqual(context.metadata?.blocked, true)
  })

  it('should return valid context for valid plan', () => {
    const builder = new ExecutionContextBuilder()
    const context = builder.build(buildValidTaskPlan())

    assert.strictEqual(context.metadata?.blocked, undefined)
    assert.ok(context.contextId.startsWith('context-'))
    assert.ok(context.readiness)
  })
})

// ============================================================================
// QUEUE BUILDER GUARD TESTS
// ============================================================================

describe('ExecutionQueueBuilder hardening', () => {
  it('should return blocked queue for null session', () => {
    const builder = new ExecutionQueueBuilder()
    const queue = builder.build(null as unknown as ExecutionSession)

    assert.strictEqual(queue.items.length, 0)
    assert.strictEqual(queue.metadata?.blocked, true)
    assert.strictEqual(typeof queue.metadata?.blockReason, 'string')
  })

  it('should return blocked queue for session without taskPlan', () => {
    const builder = new ExecutionQueueBuilder()
    const badSession = {
      sessionId: 'sess-1',
      executionContext: {},
    } as unknown as ExecutionSession
    const queue = builder.build(badSession)

    assert.strictEqual(queue.items.length, 0)
    assert.strictEqual(queue.metadata?.blocked, true)
  })

  it('should return valid queue for valid session', () => {
    const builder = new ExecutionQueueBuilder()
    const session = buildValidSession()
    const queue = builder.build(session)

    assert.strictEqual(queue.items.length, 2)
    assert.strictEqual(queue.metadata?.blocked, undefined)
    assert.strictEqual(queue.items[0].status, 'Pending')
    assert.strictEqual(queue.items[1].status, 'Pending')
  })
})

// ============================================================================
// PROGRESS BUILDER GUARD TESTS
// ============================================================================

describe('ExecutionProgressBuilder hardening', () => {
  it('should return blocked progress for null queue', () => {
    const builder = new ExecutionProgressBuilder()
    const progress = builder.build(null as unknown as ExecutionQueue)

    assert.strictEqual(progress.totalItems, 0)
    assert.strictEqual(progress.metadata?.blocked, true)
    assert.strictEqual(typeof progress.metadata?.blockReason, 'string')
  })

  it('should return valid progress for valid queue', () => {
    const queueBuilder = new ExecutionQueueBuilder()
    const progressBuilder = new ExecutionProgressBuilder()
    const session = buildValidSession()
    const queue = queueBuilder.build(session)
    const progress = progressBuilder.build(queue)

    assert.strictEqual(progress.totalItems, 2)
    assert.strictEqual(progress.completedItems, 0)
    assert.strictEqual(progress.remainingItems, 2)
    assert.strictEqual(progress.percentComplete, 0)
    assert.strictEqual(progress.status, 'NotStarted')
    assert.strictEqual(progress.metadata?.blocked, undefined)
  })
})

// ============================================================================
// QUEUE UPDATER GUARD TESTS
// ============================================================================

describe('ExecutionQueueUpdater hardening', () => {
  it('should return original queue for null result', () => {
    const updater = new ExecutionQueueUpdater()
    const queue: ExecutionQueue = {
      queueId: 'q-1',
      queueVersion: 'test',
      items: [],
    }
    const result = updater.update(queue, null as unknown as import('./execution-result').ExecutionResult)

    assert.strictEqual(result.queueId, 'q-1')
  })

  it('should return empty queue for null queue', () => {
    const updater = new ExecutionQueueUpdater()
    const result = updater.update(
      null as unknown as ExecutionQueue,
      { resultId: 'r-1', resultVersion: 'test', queueItemId: 'item-1', status: 'Success', startedAt: '', completedAt: '' }
    )

    assert.strictEqual(result.items.length, 0)
    assert.strictEqual(result.metadata?.guardFailed, true)
  })
})

// ============================================================================
// PROGRESS UPDATER GUARD TESTS
// ============================================================================

describe('ExecutionProgressUpdater hardening', () => {
  it('should return original progress for null queue', () => {
    const updater = new ExecutionProgressUpdater()
    const progress: ExecutionProgress = {
      progressId: 'p-1',
      progressVersion: 'test',
      currentItem: null,
      completedItems: 0,
      remainingItems: 0,
      totalItems: 0,
      percentComplete: 0,
      status: 'NotStarted',
    }
    const result = updater.update(progress, null as unknown as ExecutionQueue)

    assert.strictEqual(result.progressId, 'p-1')
  })

  it('should return empty progress for null progress', () => {
    const updater = new ExecutionProgressUpdater()
    const queue: ExecutionQueue = {
      queueId: 'q-1',
      queueVersion: 'test',
      items: [],
    }
    const result = updater.update(null as unknown as ExecutionProgress, queue)

    assert.strictEqual(result.metadata?.guardFailed, true)
  })
})

// ============================================================================
// LIFECYCLE COORDINATOR GUARD TESTS
// ============================================================================

describe('ExecutionLifecycleCoordinator hardening', () => {
  it('should return outcome with diagnostic metadata for null outcome', () => {
    const coordinator = new ExecutionLifecycleCoordinator()
    const result = coordinator.process(null as unknown as ExecutionOutcome)

    assert.strictEqual(result.metadata?.lifecycleBlocked, true)
    assert.strictEqual(typeof result.metadata?.lifecycleBlockReason, 'string')
    assert.strictEqual(typeof result.metadata?.lifecycleBlockGuard, 'string')
  })

  it('should return outcome with diagnostic metadata for outcome missing executionResult', () => {
    const coordinator = new ExecutionLifecycleCoordinator()
    const badOutcome = {
      outcomeId: 'out-1',
      executionQueue: {},
      executionProgress: {},
    } as unknown as ExecutionOutcome
    const result = coordinator.process(badOutcome)

    assert.strictEqual(result.metadata?.lifecycleBlocked, true)
  })

  it('should process valid outcome through full lifecycle', () => {
    const engine = new ExecutionEngine()
    const session = buildValidSession()
    const outcome = engine.executeNext(session)

    assert.notStrictEqual(outcome, null)
    assert.ok(outcome!.executionVerification)
    assert.ok(outcome!.executionVerification!.verificationAnalysis)
    assert.ok(outcome!.executionVerification!.verificationAnalysis!.recoveryAssessment)
    assert.ok(outcome!.metadata?.executionLifecycle)
  })
})

// ============================================================================
// FULL PIPELINE INTEGRATION TEST
// ============================================================================

describe('Full pipeline integration', () => {
  it('should execute all steps and produce valid outcomes', () => {
    const engine = new ExecutionEngine()
    const session = buildValidSession()
    const outcomes = engine.executeAll(session)

    assert.strictEqual(outcomes.length, 2)
    for (const outcome of outcomes) {
      assert.ok(outcome.executionResult)
      assert.ok(outcome.executionQueue)
      assert.ok(outcome.executionProgress)
      assert.ok(outcome.executionVerification)
    }

    // Final outcome should show all items completed
    const finalOutcome = outcomes[outcomes.length - 1]
    assert.strictEqual(finalOutcome.executionProgress.status, 'Complete')
    assert.strictEqual(finalOutcome.executionProgress.percentComplete, 100)
  })
})
