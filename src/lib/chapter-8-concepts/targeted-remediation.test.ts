import { describe, expect, it } from 'vitest'
import type { Chapter8EvidenceRecord } from './grading'
import {
  appendChapter8ReassessmentEvidence,
  buildChapter8TargetedRemediationPlan,
  CHAPTER8_REMEDIATION_RULES,
} from './targeted-remediation'

function evidence(
  conceptFamilyId: Chapter8EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter8EvidenceRecord['source'] = 'chapter_assessment',
  difficulty: Chapter8EvidenceRecord['difficulty'] = 'application',
  timestamp = '2026-09-26T12:00:00.000Z',
  attemptPhase: Chapter8EvidenceRecord['attemptPhase'] = 'initial',
): Chapter8EvidenceRecord {
  return {
    studentId: 'student-8',
    chapterId: 'ch-8',
    conceptFamilyId,
    source,
    itemId,
    difficulty,
    correct,
    attemptPhase,
    timestamp,
  }
}

describe('C8-7 targeted remediation planner', () => {
  it('targets ordinary concept gaps without rewriting first-attempt evidence', () => {
    const original = [
      evidence('ch8-electrical-measurements', 'q1', false, 'micro_check'),
      evidence('ch8-electrical-measurements', 'q2', false, 'chapter_assessment'),
      evidence('ch8-electrical-measurements', 'q3', true, 'chapter_assessment'),
    ] as const

    const plan = buildChapter8TargetedRemediationPlan(original, '2026-09-26T12:00:00.000Z')

    expect(plan.preservedInitialEvidence).toBe(original)
    expect(plan.preservedInitialEvidence).toEqual(original)
    expect(plan.targets[0].conceptFamilyId).toBe('ch8-electrical-measurements')
    expect(plan.targets[0].requiresFormalReassessment).toBe(true)
    expect(plan.targets[0].reassessmentQuestionCount).toBe(5)
    expect(plan.targets[0].reassessmentPassPercent).toBe(80)
  })

  it('prioritizes repeated equipment-safety misses and requires a perfect five-question reassessment', () => {
    const records = [
      evidence('ch8-equipment-safety', 's1', false, 'micro_check', 'scenario', '2026-09-24T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's2', true, 'chapter_assessment', 'application', '2026-09-25T12:00:00.000Z'),
      evidence('ch8-equipment-safety', 's3', false, 'scenario_application', 'scenario', '2026-09-26T12:00:00.000Z'),
    ]

    const plan = buildChapter8TargetedRemediationPlan(records, '2026-09-26T12:00:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch8-equipment-safety')

    expect(target?.priority).toBe('urgent')
    expect(target?.safetyEscalation).toBe('urgent')
    expect(target?.requiresFormalReassessment).toBe(true)
    expect(target?.reassessmentQuestionCount).toBe(5)
    expect(target?.reassessmentPassPercent).toBe(100)
  })

  it('uses watch status for a single scenario-level safety miss without prematurely forcing formal reassessment when mastery is otherwise above the ordinary gap threshold', () => {
    const records = [
      evidence('ch8-light-therapy-safety', 'l1', true, 'chapter_assessment', 'scenario', '2026-09-22T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'l2', true, 'scenario_application', 'scenario', '2026-09-23T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'l3', true, 'chapter_assessment', 'application', '2026-09-24T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'l4', true, 'micro_check', 'application', '2026-09-25T12:00:00.000Z'),
      evidence('ch8-light-therapy-safety', 'l5', false, 'micro_check', 'scenario', '2026-09-26T12:00:00.000Z'),
    ]

    const plan = buildChapter8TargetedRemediationPlan(records, '2026-09-26T12:00:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch8-light-therapy-safety')

    expect(target?.priority).toBe('priority')
    expect(target?.safetyEscalation).toBe('watch')
    expect(target?.requiresFormalReassessment).toBe(false)
  })

  it('appends reassessment evidence while preserving original first-attempt records unchanged', () => {
    const original = [
      evidence('ch8-current-conversion', 'q1', false, 'chapter_assessment'),
      evidence('ch8-current-conversion', 'q2', true, 'micro_check'),
    ]
    const snapshot = JSON.stringify(original)
    const recovery = [
      evidence(
        'ch8-current-conversion',
        'r8-current-001',
        true,
        'remediation_reassessment',
        'application',
        '2026-09-27T12:00:00.000Z',
        'reassessment',
      ),
    ]

    const combined = appendChapter8ReassessmentEvidence(original, recovery)

    expect(JSON.stringify(original)).toBe(snapshot)
    expect(combined.slice(0, original.length)).toEqual(original)
    expect(combined.at(-1)?.attemptPhase).toBe('reassessment')
    expect(combined.at(-1)?.source).toBe('remediation_reassessment')
  })

  it('rejects evidence that could masquerade as first-attempt reassessment data', () => {
    const invalid = [
      evidence('ch8-current-conversion', 'bad-r1', true, 'chapter_assessment', 'application', undefined, 'initial'),
    ]
    expect(() => appendChapter8ReassessmentEvidence([], invalid)).toThrow(
      'Reassessment evidence must use Chapter 8 remediation_reassessment / reassessment semantics.',
    )
  })

  it('locks ordinary and stricter safety reassessment rules', () => {
    expect(CHAPTER8_REMEDIATION_RULES.ordinaryTargetMasteryAtOrBelow).toBe(70)
    expect(CHAPTER8_REMEDIATION_RULES.ordinaryMinInitialMisses).toBe(2)
    expect(CHAPTER8_REMEDIATION_RULES.ordinaryReassessmentQuestionCount).toBe(5)
    expect(CHAPTER8_REMEDIATION_RULES.ordinaryReassessmentPassPercent).toBe(80)
    expect(CHAPTER8_REMEDIATION_RULES.safetyReassessmentQuestionCount).toBe(5)
    expect(CHAPTER8_REMEDIATION_RULES.safetyReassessmentPassPercent).toBe(100)
  })
})
