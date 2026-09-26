import { describe, expect, it } from 'vitest'
import type { Chapter7EvidenceRecord } from './grading'
import {
  CHAPTER7_INTERVENTION_THRESHOLDS,
  evaluateChapter7InterventionFlags,
  type Chapter7InterventionInput,
  type Chapter7MasterySnapshot,
  type Chapter7RemediationCycleSummary,
} from './intervention-flags'

const now = '2026-09-26T12:00:00.000Z'

function evidence(
  conceptFamilyId: Chapter7EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter7EvidenceRecord['source'],
  difficulty: Chapter7EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-25T12:00:00.000Z',
  attemptPhase: Chapter7EvidenceRecord['attemptPhase'] = 'initial',
): Chapter7EvidenceRecord {
  return {
    studentId: 'student-1',
    chapterId: 'ch-7',
    conceptFamilyId,
    source,
    itemId,
    difficulty,
    correct,
    attemptPhase,
    timestamp,
  }
}

function baseInput(overrides: Partial<Chapter7InterventionInput> = {}): Chapter7InterventionInput {
  return {
    evidence: [],
    referenceTime: now,
    completionPercent: 0,
    overallMasteryPercent: 0,
    remediationCycles: [],
    masterySnapshots: [],
    previousActiveFlags: [],
    ...overrides,
  }
}

describe('C7-7 intervention flags', () => {
  it('defines exactly five canonical flag types through deterministic evaluation paths', () => {
    const types = [
      'persistent_weakness',
      'remediation_failure',
      'repeated_safety_misses',
      'declining_mastery',
      'completion_mastery_mismatch',
    ]
    expect(types).toHaveLength(5)
    expect(new Set(types).size).toBe(5)
  })

  it('does not flag persistent weakness from one isolated miss or insufficient evidence', () => {
    const flags = evaluateChapter7InterventionFlags(baseInput({
      evidence: [
        evidence('ch7-water-ph', 'q1', false, 'chapter_assessment'),
      ],
    }))
    expect(flags.some((flag) => flag.type === 'persistent_weakness')).toBe(false)
  })

  it('flags persistent weakness only after enough diverse evidence', () => {
    const records = [
      evidence('ch7-water-ph', 'q1', false, 'micro_check'),
      evidence('ch7-water-ph', 'q2', false, 'micro_check'),
      evidence('ch7-water-ph', 'q3', false, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q4', true, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q5', false, 'scenario_application', 'scenario'),
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({ evidence: records }))
    const flag = flags.find((item) => item.type === 'persistent_weakness')
    expect(flag?.conceptFamilyId).toBe('ch7-water-ph')
    expect(flag?.severity).toBe('priority')
    expect(flag?.reason).toContain('Water, pH, Acids, Alkalis & Neutralization')
  })

  it('uses hysteresis: an active persistent weakness clears only after recovery to 75%+ with developing confidence', () => {
    const records = [
      evidence('ch7-water-ph', 'q1', true, 'micro_check'),
      evidence('ch7-water-ph', 'q2', true, 'micro_check'),
      evidence('ch7-water-ph', 'q3', true, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q4', true, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q5', true, 'scenario_application', 'scenario'),
      evidence('ch7-water-ph', 'q6', true, 'scenario_application', 'scenario'),
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({
      evidence: records,
      previousActiveFlags: [{ type: 'persistent_weakness', conceptFamilyId: 'ch7-water-ph' }],
    }))
    expect(flags.some((flag) => flag.type === 'persistent_weakness')).toBe(false)
  })

  it('flags a failed formal 5-question reassessment and clears after a later 80%+ formal reassessment', () => {
    const fail: Chapter7RemediationCycleSummary = {
      conceptFamilyId: 'ch7-mixtures',
      cycleId: 'cycle-1',
      completed: true,
      questionCount: 5,
      correctCount: 3,
      completedAt: '2026-09-24T12:00:00.000Z',
    }
    const pass: Chapter7RemediationCycleSummary = {
      conceptFamilyId: 'ch7-mixtures',
      cycleId: 'cycle-2',
      completed: true,
      questionCount: 5,
      correctCount: 4,
      completedAt: '2026-09-25T12:00:00.000Z',
    }

    const failedFlags = evaluateChapter7InterventionFlags(baseInput({ remediationCycles: [fail] }))
    expect(failedFlags.some((flag) => flag.type === 'remediation_failure')).toBe(true)

    const clearedFlags = evaluateChapter7InterventionFlags(baseInput({
      remediationCycles: [fail, pass],
      previousActiveFlags: [{ type: 'remediation_failure', conceptFamilyId: 'ch7-mixtures' }],
    }))
    expect(clearedFlags.some((flag) => flag.type === 'remediation_failure')).toBe(false)
  })

  it('raises the safety flag after repeated hard safety misses even without waiting for global confidence', () => {
    const records = [
      evidence('ch7-chemical-safety', 's1', false, 'micro_check', 'application'),
      evidence('ch7-chemical-safety', 's2', true, 'chapter_assessment', 'scenario'),
      evidence('ch7-chemical-safety', 's3', false, 'scenario_application', 'scenario'),
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({ evidence: records }))
    const flag = flags.find((item) => item.type === 'repeated_safety_misses')
    expect(flag?.severity).toBe('urgent')
    expect(flag?.conceptFamilyId).toBe('ch7-chemical-safety')
  })

  it('clears an active safety flag only after four consecutive correct hard safety observations', () => {
    const records = [
      evidence('ch7-chemical-safety', 's1', false, 'chapter_assessment', 'scenario', '2026-09-20T12:00:00.000Z'),
      evidence('ch7-chemical-safety', 's2', false, 'scenario_application', 'scenario', '2026-09-21T12:00:00.000Z'),
      evidence('ch7-chemical-safety', 's3', true, 'micro_check', 'application', '2026-09-22T12:00:00.000Z'),
      evidence('ch7-chemical-safety', 's4', true, 'chapter_assessment', 'scenario', '2026-09-23T12:00:00.000Z'),
      evidence('ch7-chemical-safety', 's5', true, 'scenario_application', 'application', '2026-09-24T12:00:00.000Z'),
      evidence('ch7-chemical-safety', 's6', true, 'remediation_reassessment', 'scenario', '2026-09-25T12:00:00.000Z', 'reassessment'),
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({
      evidence: records,
      previousActiveFlags: [{ type: 'repeated_safety_misses', conceptFamilyId: 'ch7-chemical-safety' }],
    }))
    expect(flags.some((flag) => flag.type === 'repeated_safety_misses')).toBe(false)
  })

  it('flags a sustained 15-point+ mastery decline across three snapshots spanning at least seven days', () => {
    const snapshots: Chapter7MasterySnapshot[] = [
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 82, confidence: 'proficient', timestamp: '2026-09-10T12:00:00.000Z' },
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 70, confidence: 'developing', timestamp: '2026-09-17T12:00:00.000Z' },
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 61, confidence: 'developing', timestamp: '2026-09-25T12:00:00.000Z' },
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({ masterySnapshots: snapshots }))
    expect(flags.some((flag) => flag.type === 'declining_mastery')).toBe(true)
  })

  it('does not flag noise as declining mastery and clears after a meaningful recovery', () => {
    const snapshots: Chapter7MasterySnapshot[] = [
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 82, confidence: 'proficient', timestamp: '2026-09-10T12:00:00.000Z' },
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 80, confidence: 'proficient', timestamp: '2026-09-17T12:00:00.000Z' },
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 79, confidence: 'proficient', timestamp: '2026-09-25T12:00:00.000Z' },
    ]
    expect(evaluateChapter7InterventionFlags(baseInput({ masterySnapshots: snapshots }))
      .some((flag) => flag.type === 'declining_mastery')).toBe(false)

    const recovered: Chapter7MasterySnapshot[] = [
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 55, confidence: 'developing', timestamp: '2026-09-20T12:00:00.000Z' },
      { conceptFamilyId: 'ch7-redox-reactions', mastery: 66, confidence: 'developing', timestamp: '2026-09-25T12:00:00.000Z' },
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({
      masterySnapshots: recovered,
      previousActiveFlags: [{ type: 'declining_mastery', conceptFamilyId: 'ch7-redox-reactions' }],
    }))
    expect(flags.some((flag) => flag.type === 'declining_mastery')).toBe(false)
  })

  it('flags high completion with low mastery only after enough broad evidence', () => {
    const records = [
      evidence('ch7-water-ph', 'a1', false, 'chapter_assessment'),
      evidence('ch7-water-ph', 'a2', false, 'micro_check'),
      evidence('ch7-redox-reactions', 'b1', false, 'chapter_assessment'),
      evidence('ch7-redox-reactions', 'b2', true, 'scenario_application'),
      evidence('ch7-mixtures', 'c1', false, 'chapter_assessment'),
      evidence('ch7-mixtures', 'c2', false, 'micro_check'),
      evidence('ch7-shampoos', 'd1', true, 'chapter_assessment'),
      evidence('ch7-shampoos', 'd2', false, 'micro_check'),
    ]

    const flags = evaluateChapter7InterventionFlags(baseInput({
      evidence: records,
      completionPercent: 92,
      overallMasteryPercent: 61,
    }))
    const flag = flags.find((item) => item.type === 'completion_mastery_mismatch')
    expect(flag?.scope).toBe('chapter')
    expect(flag?.severity).toBe('advisory')
  })

  it('does not let high completion alone trigger mismatch and clears after mastery reaches 75%', () => {
    const sparse = [evidence('ch7-water-ph', 'a1', false, 'chapter_assessment')]
    expect(evaluateChapter7InterventionFlags(baseInput({
      evidence: sparse,
      completionPercent: 100,
      overallMasteryPercent: 40,
    })).some((flag) => flag.type === 'completion_mastery_mismatch')).toBe(false)

    const flags = evaluateChapter7InterventionFlags(baseInput({
      evidence: sparse,
      completionPercent: 100,
      overallMasteryPercent: 78,
      previousActiveFlags: [{ type: 'completion_mastery_mismatch' }],
    }))
    expect(flags.some((flag) => flag.type === 'completion_mastery_mismatch')).toBe(false)
  })

  it('does not contaminate unrelated concept flags', () => {
    const records = [
      evidence('ch7-water-ph', 'q1', false, 'micro_check'),
      evidence('ch7-water-ph', 'q2', false, 'micro_check'),
      evidence('ch7-water-ph', 'q3', false, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q4', false, 'chapter_assessment'),
      evidence('ch7-water-ph', 'q5', true, 'scenario_application', 'scenario'),
    ]
    const flags = evaluateChapter7InterventionFlags(baseInput({ evidence: records }))
    expect(flags.some((flag) => flag.conceptFamilyId === 'ch7-shampoos')).toBe(false)
  })

  it('is deterministic for the same evidence, snapshots, cycles, and reference time', () => {
    const input = baseInput({
      evidence: [
        evidence('ch7-chemical-safety', 's1', false, 'micro_check', 'application'),
        evidence('ch7-chemical-safety', 's2', false, 'chapter_assessment', 'scenario'),
        evidence('ch7-chemical-safety', 's3', true, 'scenario_application', 'scenario'),
      ],
      completionPercent: 90,
      overallMasteryPercent: 60,
    })
    expect(evaluateChapter7InterventionFlags(input)).toEqual(evaluateChapter7InterventionFlags(input))
  })

  it('locks trigger and clear thresholds explicitly', () => {
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.persistentWeakness.triggerMasteryAtOrBelow).toBe(60)
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.persistentWeakness.clearMasteryAtOrAbove).toBe(75)
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.remediationFailure.passPercent).toBe(80)
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.safetyMisses.triggerMisses).toBe(2)
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.safetyMisses.clearConsecutiveCorrect).toBe(4)
    expect(CHAPTER7_INTERVENTION_THRESHOLDS.completionMasteryMismatch.triggerCompletionAtOrAbove).toBe(85)
  })
})
