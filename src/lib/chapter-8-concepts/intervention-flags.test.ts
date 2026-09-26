import { describe, expect, it } from 'vitest'
import type { Chapter8EvidenceRecord } from './grading'
import { CHAPTER8_GRADE_WEIGHTS } from './grading'
import {
  CHAPTER8_INTERVENTION_GRADE_WEIGHTS,
  evaluateChapter8InterventionFlags,
} from './intervention-flags'

function evidence(
  conceptFamilyId: Chapter8EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  difficulty: Chapter8EvidenceRecord['difficulty'] = 'scenario',
  timestamp = '2026-09-26T12:00:00.000Z',
): Chapter8EvidenceRecord {
  return {
    studentId: 'student-1',
    chapterId: 'ch-8',
    conceptFamilyId,
    source: 'micro_check',
    itemId,
    difficulty,
    correct,
    attemptPhase: 'initial',
    timestamp,
  }
}

describe('C8-6 Chapter 8 safety intervention flags', () => {
  it('creates a priority instructor-review flag after one scenario-level equipment-safety miss', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [evidence('ch8-equipment-safety', 'mcq-8-007', false)],
    })
    expect(flags).toHaveLength(1)
    expect(flags[0].conceptFamilyId).toBe('ch8-equipment-safety')
    expect(flags[0].severity).toBe('priority')
    expect(flags[0].requiresInstructorReview).toBe(true)
    expect(flags[0].requiresFormalReassessment).toBe(false)
  })

  it('escalates repeated distinct equipment-safety misses to urgent formal reassessment', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [
        evidence('ch8-equipment-safety', 'mcq-8-007', false, 'scenario', '2026-09-24T12:00:00.000Z'),
        evidence('ch8-equipment-safety', 'mcq-8-009', true, 'application', '2026-09-25T12:00:00.000Z'),
        evidence('ch8-equipment-safety', 'qq-8-002', false, 'scenario', '2026-09-26T12:00:00.000Z'),
      ],
    })
    const flag = flags[0]
    expect(flag.severity).toBe('urgent')
    expect(flag.recentMissCount).toBe(2)
    expect(flag.requiresInstructorReview).toBe(true)
    expect(flag.requiresFormalReassessment).toBe(true)
  })

  it('applies the same urgent behavior independently to light-therapy safety', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [
        evidence('ch8-light-therapy-safety', 'mcq-8-020', false, 'scenario', '2026-09-25T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'mcq-8-021', false, 'scenario', '2026-09-26T12:00:00.000Z'),
      ],
    })
    expect(flags).toHaveLength(1)
    expect(flags[0].conceptFamilyId).toBe('ch8-light-therapy-safety')
    expect(flags[0].severity).toBe('urgent')
    expect(flags[0].requiresFormalReassessment).toBe(true)
  })

  it('keeps equipment and light safety as separate intervention flags', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [
        evidence('ch8-equipment-safety', 'e1', false),
        evidence('ch8-equipment-safety', 'e2', false),
        evidence('ch8-light-therapy-safety', 'l1', false),
        evidence('ch8-light-therapy-safety', 'l2', false),
      ],
    })
    expect(flags).toHaveLength(2)
    expect(new Set(flags.map((flag) => flag.conceptFamilyId))).toEqual(
      new Set(['ch8-equipment-safety', 'ch8-light-therapy-safety']),
    )
  })

  it('does not contaminate unrelated Chapter 8 concepts', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [
        evidence('ch8-electromagnetic-spectrum', 'x1', false),
        evidence('ch8-electromagnetic-spectrum', 'x2', false),
      ],
    })
    expect(flags).toEqual([])
  })

  it('clears a prior active flag after five consecutive correct hard safety observations', () => {
    const flags = evaluateChapter8InterventionFlags({
      evidence: [
        evidence('ch8-light-therapy-safety', 'x1', false, 'scenario', '2026-09-20T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'x2', false, 'scenario', '2026-09-21T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'c1', true, 'application', '2026-09-22T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'c2', true, 'scenario', '2026-09-23T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'c3', true, 'application', '2026-09-24T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'c4', true, 'scenario', '2026-09-25T12:00:00.000Z'),
        evidence('ch8-light-therapy-safety', 'c5', true, 'scenario', '2026-09-26T12:00:00.000Z'),
      ],
      previousActiveFlags: [
        { type: 'repeated_safety_misses', conceptFamilyId: 'ch8-light-therapy-safety' },
      ],
    })
    expect(flags).toEqual([])
  })

  it('does not change the shared Chapter 8 grading formula', () => {
    expect(CHAPTER8_INTERVENTION_GRADE_WEIGHTS).toBe(CHAPTER8_GRADE_WEIGHTS)
    expect(CHAPTER8_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
  })
})
