import { describe, expect, it } from 'vitest'
import {
  buildMicroCheckEvidence,
  calculateInitialMicroCheckPercent,
  initialMicroCheckEvidence,
  mergeMicroCheckEvidence,
  remediationMicroCheckEvidence,
  type MicroCheckEvidenceContext,
} from '@/lib/micro-checks/evidence'
import type { MicroCheckAttemptSnapshot } from '@/lib/micro-checks/attempt-state'

const context: MicroCheckEvidenceContext = {
  studentId: 'student-1',
  chapterId: 'ch-4',
  conceptFamilyId: 'ch4-disinfection-sterilization',
  itemId: 'mcq-4-004',
  difficulty: 'scenario',
}

describe('MC-R1F.3 micro-check evidence adapter', () => {
  it('emits one immutable initial record after a first-attempt miss', () => {
    const snapshot: MicroCheckAttemptSnapshot = {
      state: 'initial_incorrect_hint',
      initialCorrect: false,
      remediationCorrect: null,
    }

    const records = buildMicroCheckEvidence({
      context,
      snapshot,
      timestamps: { initial: '2026-10-04T22:30:00.000Z' },
    })

    expect(records).toEqual([
      expect.objectContaining({
        itemId: 'mcq-4-004',
        source: 'micro_check',
        correct: false,
        attemptPhase: 'initial',
      }),
    ])
  })

  it('keeps the initial miss and emits a separate remediation success', () => {
    const snapshot: MicroCheckAttemptSnapshot = {
      state: 'remediation_complete',
      initialCorrect: false,
      remediationCorrect: true,
    }

    const records = buildMicroCheckEvidence({
      context,
      snapshot,
      timestamps: {
        initial: '2026-10-04T22:30:00.000Z',
        remediation: '2026-10-04T22:31:00.000Z',
      },
    })

    expect(records).toHaveLength(2)
    expect(records[0]).toEqual(
      expect.objectContaining({
        correct: false,
        attemptPhase: 'initial',
        timestamp: '2026-10-04T22:30:00.000Z',
      }),
    )
    expect(records[1]).toEqual(
      expect.objectContaining({
        correct: true,
        attemptPhase: 'remediation',
        timestamp: '2026-10-04T22:31:00.000Z',
      }),
    )
  })

  it('does not let remediation success inflate the ordinary first-attempt score', () => {
    const snapshot: MicroCheckAttemptSnapshot = {
      state: 'remediation_complete',
      initialCorrect: false,
      remediationCorrect: true,
    }

    const records = buildMicroCheckEvidence({
      context,
      snapshot,
      timestamps: {
        initial: '2026-10-04T22:30:00.000Z',
        remediation: '2026-10-04T22:31:00.000Z',
      },
    })

    expect(calculateInitialMicroCheckPercent(records)).toBe(0)
  })

  it('calculates the ordinary score from initial records only across items', () => {
    const missedThenLearned = buildMicroCheckEvidence({
      context,
      snapshot: {
        state: 'remediation_complete',
        initialCorrect: false,
        remediationCorrect: true,
      },
      timestamps: {
        initial: '2026-10-04T22:30:00.000Z',
        remediation: '2026-10-04T22:31:00.000Z',
      },
    })

    const second = buildMicroCheckEvidence({
      context: {
        ...context,
        itemId: 'mcq-4-003',
      },
      snapshot: {
        state: 'initial_correct',
        initialCorrect: true,
        remediationCorrect: null,
      },
      timestamps: { initial: '2026-10-04T22:32:00.000Z' },
    })

    const records = [...missedThenLearned, ...second]

    expect(initialMicroCheckEvidence(records)).toHaveLength(2)
    expect(remediationMicroCheckEvidence(records)).toHaveLength(1)
    expect(calculateInitialMicroCheckPercent(records)).toBe(50)
  })

  it('deduplicates the same phase without collapsing initial and remediation together', () => {
    const records = buildMicroCheckEvidence({
      context,
      snapshot: {
        state: 'remediation_complete',
        initialCorrect: false,
        remediationCorrect: true,
      },
      timestamps: {
        initial: '2026-10-04T22:30:00.000Z',
        remediation: '2026-10-04T22:31:00.000Z',
      },
    })

    const merged = mergeMicroCheckEvidence(records, records)

    expect(merged).toHaveLength(2)
    expect(initialMicroCheckEvidence(merged)).toHaveLength(1)
    expect(remediationMicroCheckEvidence(merged)).toHaveLength(1)
  })

  it('rejects remediation evidence without initial evidence', () => {
    expect(() =>
      buildMicroCheckEvidence({
        context,
        snapshot: {
          state: 'remediation_complete',
          initialCorrect: null,
          remediationCorrect: true,
        },
        timestamps: {
          initial: '',
          remediation: '2026-10-04T22:31:00.000Z',
        },
      }),
    ).toThrow('Remediation evidence cannot exist without initial evidence.')
  })

  it('requires a separate remediation timestamp', () => {
    expect(() =>
      buildMicroCheckEvidence({
        context,
        snapshot: {
          state: 'remediation_complete',
          initialCorrect: false,
          remediationCorrect: true,
        },
        timestamps: {
          initial: '2026-10-04T22:30:00.000Z',
        },
      }),
    ).toThrow('Remediation micro-check evidence requires a timestamp.')
  })

  it('returns null for the ordinary micro-check score before any initial evidence exists', () => {
    expect(calculateInitialMicroCheckPercent([])).toBeNull()
  })
})
