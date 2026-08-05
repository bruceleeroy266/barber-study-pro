/**
 * StepGenerator — Unit Tests
 *
 * Verifies deterministic step generation.
 */

import { describe, it, expect } from 'vitest'
import { StepGenerator } from '../../../src/lib/task-planner/step-generator'
import { PhaseGenerator } from '../../../src/lib/task-planner/phase-generator'
import { InitialPlanGenerator } from '../../../src/lib/task-planner/initial-plan-generator'
import { ComplexityLevel } from '../../../src/lib/complexity-model/complexity-level'
import { mockTaskPlannerRequest } from './fixtures'

describe('StepGenerator', () => {
  const planGenerator = new InitialPlanGenerator()
  const phaseGenerator = new PhaseGenerator()
  const stepGenerator = new StepGenerator()

  function createPlanWithPhase() {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    return phaseGenerator.generate(mockTaskPlannerRequest, skeleton)
  }

  it('generates steps based on phase type and complexity', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    // Medium complexity: Preparation phase gets 1 step, Implementation phase gets 2 steps
    expect(plan.phases[0].steps.length).toBe(1) // Preparation
    expect(plan.phases[1].steps.length).toBe(2) // Implementation
  })

  it('generates "Prepare Environment" for Preparation phase', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[0].steps[0].name).toBe('Prepare Environment')
  })

  it('generates "Prepare Work" and "Execute Work" for Implementation phase', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[1].steps[0].name).toBe('Prepare Work')
    expect(plan.phases[1].steps[1].name).toBe('Execute Work')
  })

  it('generates steps with correct descriptions', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[0].steps[0].description).toBe('Set up the working environment.')
    expect(plan.phases[1].steps[0].description).toBe('Prepare for execution.')
    expect(plan.phases[1].steps[1].description).toBe('Execute the task.')
  })

  it('generates a step with estimatedComplexity Medium', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[0].steps[0].estimatedComplexity).toBe(ComplexityLevel.Medium)
  })

  it('generates a step with estimatedFiles 0', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[0].steps[0].estimatedFiles).toBe(0)
  })

  it('generates a step with estimatedRuntime 0', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    expect(plan.phases[0].steps[0].estimatedRuntime).toBe(0)
  })

  it('generates a step with a valid ID derived from phase ID', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    const phase = plan.phases[0]
    const step = phase.steps[0]
    expect(step.id).toBe(`${phase.id}-step-1`)
  })

  it('includes step metadata', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    const step = plan.phases[0].steps[0]
    expect(step.metadata).toBeDefined()
    expect(step.metadata?.generatedBy).toBe('StepGenerator')
    expect(step.metadata?.plannerVersion).toBe('1.4.5')
    expect(step.metadata?.stepType).toBe('complexity_based')
    expect(step.metadata?.generatedAt).toBeDefined()
  })

  it('includes parent phase context in step metadata', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    const step = plan.phases[0].steps[0]
    const parentPhase = step.metadata?.parentPhase as Record<string, unknown> | undefined
    expect(parentPhase).toBeDefined()
    expect(parentPhase?.id).toBe(plan.phases[0].id)
    expect(parentPhase?.name).toBe(plan.phases[0].name)
  })

  it('includes step generation metadata in plan', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    const stepGen = plan.metadata?.stepGeneration as Record<string, unknown> | undefined
    expect(stepGen).toBeDefined()
    expect(stepGen?.generatedBy).toBe('StepGenerator')
    expect(stepGen?.stepCount).toBe(3)
    expect(stepGen?.strategy).toBe('complexity_based')
  })

  it('preserves phase properties after adding steps', () => {
    const planWithPhase = createPlanWithPhase()
    const plan = stepGenerator.generate(mockTaskPlannerRequest, planWithPhase)

    const originalPhase = planWithPhase.phases[0]
    const updatedPhase = plan.phases[0]

    expect(updatedPhase.id).toBe(originalPhase.id)
    expect(updatedPhase.name).toBe(originalPhase.name)
    expect(updatedPhase.order).toBe(originalPhase.order)
  })
})
