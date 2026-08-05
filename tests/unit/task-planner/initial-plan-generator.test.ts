/**
 * InitialPlanGenerator — Unit Tests
 *
 * Verifies deterministic skeleton plan generation.
 */

import { describe, it, expect } from 'vitest'
import { InitialPlanGenerator } from '../../../src/lib/task-planner/initial-plan-generator'
import { mockTaskPlannerRequest, mockTaskPlannerRequestSingleLine } from './fixtures'

describe('InitialPlanGenerator', () => {
  const generator = new InitialPlanGenerator()

  it('returns a valid TaskPlan', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    expect(plan).toBeDefined()
    expect(plan.id).toBeDefined()
    expect(plan.name).toBeDefined()
    expect(plan.phases).toBeDefined()
  })

  it('generates a plan ID', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    expect(plan.id).toMatch(/^plan-\d+-\d+$/)
  })

  it('extracts task name from first line of description', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    expect(plan.name).toBe('Implement user authentication')
  })

  it('truncates long task names to 50 characters', () => {
    const longDescription = 'A'.repeat(60)
    const request = { ...mockTaskPlannerRequest, taskDescription: longDescription }
    const plan = generator.generate(request)

    expect(plan.name).toBe('A'.repeat(47) + '...')
    expect(plan.name.length).toBe(50)
  })

  it('handles single-line descriptions', () => {
    const plan = generator.generate(mockTaskPlannerRequestSingleLine)

    expect(plan.name).toBe('Fix login bug')
  })

  it('returns an empty phases array', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    expect(plan.phases).toEqual([])
    expect(plan.phases.length).toBe(0)
  })

  it('includes metadata', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    expect(plan.metadata).toBeDefined()
    expect(plan.metadata?.generatedBy).toBe('InitialPlanGenerator')
    expect(plan.metadata?.skeleton).toBe(true)
    expect(plan.metadata?.plannerVersion).toBe('1.3.3')
    expect(plan.metadata?.createdAt).toBeDefined()
  })

  it('includes source request summary in metadata', () => {
    const plan = generator.generate(mockTaskPlannerRequest)

    const sourceRequest = plan.metadata?.sourceRequest as Record<string, unknown> | undefined
    expect(sourceRequest).toBeDefined()
    expect(sourceRequest?.taskDescription).toBe(mockTaskPlannerRequest.taskDescription)
    expect(sourceRequest?.complexityLevel).toBe(mockTaskPlannerRequest.complexityReport.level)
  })

  it('generates deterministic IDs for same input', () => {
    const plan1 = generator.generate(mockTaskPlannerRequest)
    const plan2 = generator.generate(mockTaskPlannerRequest)

    // IDs contain timestamps, so they won't be identical
    // But the hash portion should be consistent
    const hash1 = plan1.id.split('-')[1]
    const hash2 = plan2.id.split('-')[1]
    expect(hash1).toBe(hash2)
  })
})
