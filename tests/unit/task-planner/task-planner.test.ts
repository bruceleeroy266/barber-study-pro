/**
 * InitialTaskPlanner — Unit Tests
 *
 * Verifies the complete planning pipeline.
 */

import { describe, it, expect } from 'vitest'
import { InitialTaskPlanner } from '../../../src/lib/task-planner/task-planner-engine'
import { mockTaskPlannerRequest } from './fixtures'

describe('InitialTaskPlanner', () => {
  const planner = new InitialTaskPlanner()

  it('returns a successful result', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    expect(result.success).toBe(true)
  })

  it('returns a TaskPlan', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    expect(result.taskPlan).toBeDefined()
    expect(result.taskPlan?.id).toBeDefined()
    expect(result.taskPlan?.name).toBeDefined()
  })

  it('returns a plan with phases matching Medium complexity', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    // Medium complexity = 2 phases
    expect(result.taskPlan?.phases.length).toBe(2)
  })

  it('returns a plan with steps matching complexity-based strategy', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    const totalSteps = result.taskPlan?.phases.reduce(
      (count, phase) => count + phase.steps.length,
      0
    )
    // Medium complexity: Preparation (1 step) + Implementation (2 steps) = 3 steps
    expect(totalSteps).toBe(3)
  })

  it('returns a populated summary', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    expect(result.summary).toBeDefined()
    expect(result.summary.length).toBeGreaterThan(0)
    expect(result.summary).toContain('Task plan created')
    expect(result.summary).toContain('Phases: 2')
    expect(result.summary).toContain('Steps: 3')
  })

  it('includes result metadata', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    expect(result.metadata).toBeDefined()
    expect(result.metadata?.plannerVersion).toBe('1.3.5')
    expect(result.metadata?.generatedBy).toBe('InitialTaskPlanner')
    expect(result.metadata?.phaseCount).toBe(2)
    expect(result.metadata?.stepCount).toBe(3)
  })

  it('validates request exists', () => {
    const result = planner.plan(null as unknown as typeof mockTaskPlannerRequest)

    expect(result.success).toBe(false)
    expect(result.summary).toContain('request is required')
    expect(result.taskPlan).toBeUndefined()
  })

  it('validates request is not undefined', () => {
    const result = planner.plan(undefined as unknown as typeof mockTaskPlannerRequest)

    expect(result.success).toBe(false)
    expect(result.summary).toContain('request is required')
  })

  it('returns plan with correct structure', () => {
    const result = planner.plan(mockTaskPlannerRequest)

    const plan = result.taskPlan
    expect(plan).toBeDefined()

    // Plan level
    expect(plan?.id).toMatch(/^plan-\d+-\d+$/)
    expect(plan?.name).toBe('Implement user authentication')

    // Phase level — Medium complexity produces Preparation + Implementation
    const phase = plan?.phases[0]
    expect(phase?.id).toBe('phase-1-preparation')
    expect(phase?.name).toBe('Preparation')
    expect(phase?.order).toBe(0)

    const phase2 = plan?.phases[1]
    expect(phase2?.id).toBe('phase-2-implementation')
    expect(phase2?.name).toBe('Implementation')
    expect(phase2?.order).toBe(1)

    // Step level — Preparation phase gets "Prepare Environment"
    const step = phase?.steps[0]
    expect(step?.id).toBe('phase-1-preparation-step-1')
    expect(step?.name).toBe('Prepare Environment')
    expect(step?.description).toBe('Set up the working environment.')

    // Implementation phase gets "Prepare Work" and "Execute Work"
    const implStep1 = phase2?.steps[0]
    expect(implStep1?.id).toBe('phase-2-implementation-step-1')
    expect(implStep1?.name).toBe('Prepare Work')

    const implStep2 = phase2?.steps[1]
    expect(implStep2?.id).toBe('phase-2-implementation-step-2')
    expect(implStep2?.name).toBe('Execute Work')
  })
})
