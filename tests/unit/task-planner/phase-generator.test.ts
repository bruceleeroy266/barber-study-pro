/**
 * PhaseGenerator — Unit Tests
 *
 * Verifies deterministic phase generation.
 */

import { describe, it, expect } from 'vitest'
import { PhaseGenerator } from '../../../src/lib/task-planner/phase-generator'
import { InitialPlanGenerator } from '../../../src/lib/task-planner/initial-plan-generator'
import { mockTaskPlannerRequest } from './fixtures'

describe('PhaseGenerator', () => {
  const planGenerator = new InitialPlanGenerator()
  const phaseGenerator = new PhaseGenerator()

  it('generates phases based on complexity level', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    // Medium complexity = 2 phases
    expect(plan.phases.length).toBe(2)
  })

  it('generates "Preparation" as first phase for Medium complexity', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.phases[0].name).toBe('Preparation')
  })

  it('generates "Implementation" as second phase for Medium complexity', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.phases[1].name).toBe('Implementation')
  })

  it('generates a phase with order 0', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.phases[0].order).toBe(0)
  })

  it('generates phases with correct IDs', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.phases[0].id).toBe('phase-1-preparation')
    expect(plan.phases[1].id).toBe('phase-2-implementation')
  })

  it('generates a phase with an empty steps array', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.phases[0].steps).toEqual([])
    expect(plan.phases[0].steps.length).toBe(0)
  })

  it('includes phase metadata', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    const phase = plan.phases[0]
    expect(phase.metadata).toBeDefined()
    expect(phase.metadata?.generatedBy).toBe('PhaseGenerator')
    expect(phase.metadata?.plannerVersion).toBe('1.4.1')
    expect(phase.metadata?.phaseType).toBe('complexity_based')
    expect(phase.metadata?.generatedAt).toBeDefined()
  })

  it('includes phase generation metadata in plan', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    const phaseGen = plan.metadata?.phaseGeneration as Record<string, unknown> | undefined
    expect(phaseGen).toBeDefined()
    expect(phaseGen?.generatedBy).toBe('PhaseGenerator')
    expect(phaseGen?.phaseCount).toBe(2)
    expect(phaseGen?.strategy).toBe('complexity_based')
  })

  it('preserves skeleton plan properties', () => {
    const skeleton = planGenerator.generate(mockTaskPlannerRequest)
    const plan = phaseGenerator.generate(mockTaskPlannerRequest, skeleton)

    expect(plan.id).toBe(skeleton.id)
    expect(plan.name).toBe(skeleton.name)
  })
})
