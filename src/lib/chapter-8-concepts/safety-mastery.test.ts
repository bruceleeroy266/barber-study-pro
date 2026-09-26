import { describe, expect, it } from 'vitest'
import type { Chapter8EvidenceRecord } from './grading'
import {
  CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS,
  CHAPTER8_SAFETY_MASTERY_RULES,
  evaluateChapter8SafetyEscalation,
} from './safety-mastery'

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
    source: 'scenario_application',
    itemId,
    difficulty,
    correct,
    attemptPhase: 'initial',
    timestamp,
  }
}

describe('C8-1 electrical/light-therapy safety mastery rules', () => {
  it('limits special escalation to the two explicit critical safety families', () => {
    expect(CHAPTER8_CRITICAL_SAFETY_CONCEPT_IDS).toEqual([
      'ch8-equipment-safety',
      'ch8-light-therapy-safety',
    ])
    expect(evaluateChapter8SafetyEscalation(
      [evidence('ch8-electromagnetic-spectrum', 'q1', false)],
      'ch8-electromagnetic-spectrum',
    )).toBeNull()
  })

  it('places a single scenario-level safety miss on instructor watch', () => {
    const result = evaluateChapter8SafetyEscalation(
      [evidence('ch8-equipment-safety', 's1', false)],
      'ch8-equipment-safety',
    )
    expect(result?.level).toBe('watch')
    expect(result?.requiresInstructorReview).toBe(true)
    expect(result?.requiresFormalReassessment).toBe(false)
  })

  it('escalates two distinct safety misses within the latest three hard observations to urgent', () => {
    const result = evaluateChapter8SafetyEscalation([
      evidence('ch8-equipment-safety', 's1', false, 'application', '2026-09-24T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's2', true, 'scenario', '2026-09-25T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's3', false, 'scenario', '2026-09-26T12:00:00.000Z'),
    ], 'ch8-equipment-safety')
    expect(result?.level).toBe('urgent')
    expect(result?.requiresInstructorReview).toBe(true)
    expect(result?.requiresFormalReassessment).toBe(true)
  })

  it('applies the same urgent behavior to light-therapy safety', () => {
    const result = evaluateChapter8SafetyEscalation([
      evidence('ch8-light-therapy-safety', 'l1', false),
      evidence('ch8-light-therapy-safety', 'l2', false),
    ], 'ch8-light-therapy-safety')
    expect(result?.level).toBe('urgent')
  })

  it('does not escalate repeated recall misses through the safety shortcut', () => {
    const result = evaluateChapter8SafetyEscalation([
      evidence('ch8-equipment-safety', 'r1', false, 'recall'),
      evidence('ch8-equipment-safety', 'r2', false, 'recall'),
    ], 'ch8-equipment-safety')
    expect(result?.level).toBe('clear')
  })

  it('requires five consecutive correct hard safety observations to clear a prior risk pattern', () => {
    const records = [
      evidence('ch8-light-therapy-safety', 'x1', false, 'scenario', '2026-09-20T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'x2', false, 'scenario', '2026-09-21T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'c1', true, 'application', '2026-09-22T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'c2', true, 'scenario', '2026-09-23T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'c3', true, 'application', '2026-09-24T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'c4', true, 'scenario', '2026-09-25T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'c5', true, 'scenario', '2026-09-26T12:00:00.000Z'),
    ]
    const result = evaluateChapter8SafetyEscalation(records, 'ch8-light-therapy-safety')
    expect(result?.level).toBe('clear')
    expect(result?.consecutiveCorrectAtEnd).toBe(5)
  })

  it('locks stricter safety thresholds without changing grade weights', () => {
    expect(CHAPTER8_SAFETY_MASTERY_RULES.reviewWindow).toBe(3)
    expect(CHAPTER8_SAFETY_MASTERY_RULES.urgentMissesInWindow).toBe(2)
    expect(CHAPTER8_SAFETY_MASTERY_RULES.clearConsecutiveCorrect).toBe(5)
    expect(CHAPTER8_SAFETY_MASTERY_RULES.formalReassessmentQuestionCount).toBe(5)
    expect(CHAPTER8_SAFETY_MASTERY_RULES.formalReassessmentPassPercent).toBe(100)
  })

  it('is deterministic', () => {
    const records = [
      evidence('ch8-equipment-safety', 's1', false),
      evidence('ch8-equipment-safety', 's2', true),
      evidence('ch8-equipment-safety', 's3', false),
    ]
    expect(evaluateChapter8SafetyEscalation(records, 'ch8-equipment-safety'))
      .toEqual(evaluateChapter8SafetyEscalation(records, 'ch8-equipment-safety'))
  })
})
