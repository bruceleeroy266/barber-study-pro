import { describe, expect, it } from 'vitest'
import { buildTLSStatusInput } from '../evidence-adapter'
import { resolveTLSStatus } from '../status-resolver'
import type { TLSChapterEvidenceSnapshot } from '../evidence-adapter'

const base = (
  overrides: Partial<TLSChapterEvidenceSnapshot> = {},
): TLSChapterEvidenceSnapshot => ({
  chapterPerformancePercent: 88,
  overallConfidence: 'proficient',
  concepts: [
    {
      conceptName: 'Infection Control',
      mastery: 91,
      confidence: 'proficient',
      observations: 8,
      initialMisses: 0,
      reassessmentCorrect: 0,
      mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
    },
  ],
  remediationCycles: [],
  unresolvedSafetyRequirement: false,
  unresolvedComplianceRequirement: false,
  freshIndependentPostRecoveryEvidence: null,
  ...overrides,
})

describe('TLS-1B.2 evidence adapter / input builder', () => {
  it('passes through the authoritative chapter percentage instead of recalculating a TLS grade', () => {
    expect(buildTLSStatusInput(base()).chapterPerformancePercent).toBe(88)
  })

  it('marks evidence insufficient when the certified confidence is insufficient', () => {
    expect(
      buildTLSStatusInput(
        base({ overallConfidence: 'insufficient_evidence' }),
      ).evidenceSufficiency,
    ).toBe('insufficient')
  })

  it('does not treat one isolated miss as significant or repeated weakness', () => {
    const input = buildTLSStatusInput(
      base({
        concepts: [
          {
            conceptName: 'Sanitation',
            mastery: 78,
            confidence: 'developing',
            observations: 4,
            initialMisses: 1,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
          },
        ],
      }),
    )

    expect(input.weaknessState).toBe('single_signal')
  })

  it('detects repeated weakness from two initial misses in one concept', () => {
    const input = buildTLSStatusInput(
      base({
        concepts: [
          {
            conceptName: 'Sanitation',
            mastery: 72,
            confidence: 'developing',
            observations: 6,
            initialMisses: 2,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
          },
        ],
      }),
    )

    expect(input.weaknessState).toBe('significant_or_repeated')
  })

  it('detects significant weakness across multiple weak concepts without inventing chapter-specific rules', () => {
    const input = buildTLSStatusInput(
      base({
        concepts: [
          {
            conceptName: 'A',
            mastery: 76,
            confidence: 'developing',
            observations: 5,
            initialMisses: 1,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
          },
          {
            conceptName: 'B',
            mastery: 74,
            confidence: 'developing',
            observations: 5,
            initialMisses: 1,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: '2026-10-01T12:01:00Z',
          },
        ],
      }),
    )

    expect(input.weaknessState).toBe('significant_or_repeated')
  })

  it('maps targeted remediation to assigned', () => {
    expect(
      buildTLSStatusInput(
        base({
          remediationCycles: [
            { status: 'targeted', outcome: null },
          ],
        }),
      ).recoveryState,
    ).toBe('assigned')
  })

  it('maps active review/reassessment states to in progress', () => {
    for (const status of ['in_review', 'review_completed', 'reassessed'] as const) {
      expect(
        buildTLSStatusInput(
          base({
            remediationCycles: [{ status, outcome: null }],
          }),
        ).recoveryState,
      ).toBe('in_progress')
    }
  })

  it('preserves an explicitly identified interrupted cycle without guessing from time alone', () => {
    expect(
      buildTLSStatusInput(
        base({
          remediationCycles: [
            { status: 'in_review', outcome: null, isInterrupted: true },
          ],
        }),
      ).recoveryState,
    ).toBe('interrupted')
  })

  it('maps unsuccessful recovery to failed', () => {
    expect(
      buildTLSStatusInput(
        base({
          remediationCycles: [
            { status: 'evaluated', outcome: 'unsuccessful' },
          ],
        }),
      ).recoveryState,
    ).toBe('failed')
  })

  it('keeps successful recovery awaiting confirmation instead of instantly declaring Strong', () => {
    const input = buildTLSStatusInput(
      base({
        remediationCycles: [
          { status: 'evaluated', outcome: 'successful' },
        ],
      }),
    )

    expect(input.recoveryState).toBe('recovered_awaiting_confirmation')
    expect(resolveTLSStatus(input).status).toBe('improving')
  })

  it('passes fresh independent post-recovery evidence through for resolver confirmation', () => {
    const input = buildTLSStatusInput(
      base({
        chapterPerformancePercent: 86,
        remediationCycles: [
          { status: 'evaluated', outcome: 'successful' },
        ],
        freshIndependentPostRecoveryEvidence: {
          exists: true,
          percent: 84,
          observedAt: '2026-10-01T13:00:00Z',
        },
      }),
    )

    expect(input.hasFreshIndependentPostRecoveryEvidence).toBe(true)
    expect(input.freshIndependentPostRecoveryPercent).toBe(84)
    expect(resolveTLSStatus(input).status).toBe('strong')
  })

  it('passes safety and compliance requirements through without re-deriving them from raw answers', () => {
    const input = buildTLSStatusInput(
      base({
        unresolvedSafetyRequirement: true,
        unresolvedComplianceRequirement: true,
      }),
    )

    expect(input.unresolvedSafetyRequirement).toBe(true)
    expect(input.unresolvedComplianceRequirement).toBe(true)
  })

  it('chooses one primary focus and counts additional weak areas', () => {
    const input = buildTLSStatusInput(
      base({
        concepts: [
          {
            conceptName: 'A',
            mastery: 68,
            confidence: 'developing',
            observations: 6,
            initialMisses: 2,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
          {
            conceptName: 'B',
            mastery: 75,
            confidence: 'developing',
            observations: 5,
            initialMisses: 1,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
          {
            conceptName: 'C',
            mastery: 92,
            confidence: 'proficient',
            observations: 7,
            initialMisses: 0,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
        ],
      }),
    )

    expect(input.primaryFocus).toBe('A')
    expect(input.additionalAreaCount).toBe(1)
  })
})
