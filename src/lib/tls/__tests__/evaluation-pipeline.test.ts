import { describe, expect, it } from 'vitest'
import { evaluateTLSChapter } from '../evaluation-pipeline'
import type { TLSChapterEvidenceSnapshot } from '../evidence-adapter'

const snapshot = (
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

describe('TLS-1B.3 evaluation pipeline', () => {
  it('composes the evidence adapter and status resolver into one deterministic snapshot', () => {
    const input = snapshot()
    expect(evaluateTLSChapter(input)).toEqual(evaluateTLSChapter(input))
  })

  it('preserves the existing chapter score as the output score', () => {
    expect(
      evaluateTLSChapter(snapshot({ chapterPerformancePercent: 83.5 })).result.score,
    ).toBe(83.5)
  })

  it('returns no mastery status when certified evidence is insufficient', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: null,
          overallConfidence: 'insufficient_evidence',
        }),
      ).result,
    ).toMatchObject({
      status: null,
      reason: 'not_enough_evidence',
      recommendedAction: 'keep_learning',
    })
  })

  it('carries safety precedence through the complete pipeline', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 96,
          unresolvedSafetyRequirement: true,
        }),
      ).result,
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'unresolved_safety',
      recommendedAction: 'complete_safety_recovery',
    })
  })

  it('carries compliance precedence through the complete pipeline', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 94,
          unresolvedComplianceRequirement: true,
        }),
      ).result,
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'unresolved_compliance',
      recommendedAction: 'complete_compliance_recovery',
    })
  })

  it('does not overreact to a single isolated weakness signal', () => {
    const result = evaluateTLSChapter(
      snapshot({
        chapterPerformancePercent: 91,
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

    expect(result.input.weaknessState).toBe('single_signal')
    expect(result.result.status).toBe('strong')
  })

  it('routes repeated weakness to Needs Attention when no recovery is active', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 91,
          concepts: [
            {
              conceptName: 'Disinfection',
              mastery: 71,
              confidence: 'developing',
              observations: 6,
              initialMisses: 2,
              reassessmentCorrect: 0,
              mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
            },
          ],
        }),
      ).result,
    ).toMatchObject({
      status: 'needs_attention',
      reason: 'significant_or_repeated_weakness',
      primaryFocus: 'Disinfection',
    })
  })

  it('routes active remediation to Improving', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 74,
          concepts: [
            {
              conceptName: 'Disinfection',
              mastery: 69,
              confidence: 'developing',
              observations: 6,
              initialMisses: 2,
              reassessmentCorrect: 0,
              mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
            },
          ],
          remediationCycles: [{ status: 'in_review', outcome: null }],
        }),
      ).result,
    ).toMatchObject({
      status: 'improving',
      reason: 'recovery_in_progress',
      recommendedAction: 'complete_targeted_recovery',
    })
  })

  it('keeps successful recovery Improving until fresh independent confirmation exists', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 86,
          remediationCycles: [{ status: 'evaluated', outcome: 'successful' }],
        }),
      ).result,
    ).toMatchObject({
      status: 'improving',
      reason: 'recovered_awaiting_confirmation',
    })
  })

  it('promotes recovered learning to Strong after fresh independent confirmation at 80 or above', () => {
    expect(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 86,
          remediationCycles: [{ status: 'evaluated', outcome: 'successful' }],
          freshIndependentPostRecoveryEvidence: {
            exists: true,
            percent: 84,
            observedAt: '2026-10-01T13:00:00Z',
          },
        }),
      ).result,
    ).toMatchObject({
      status: 'strong',
      reason: 'strong_current_evidence',
    })
  })

  it('does not expose or require chapter-specific identifiers', () => {
    const result = evaluateTLSChapter(snapshot())
    expect(result).not.toHaveProperty('chapterId')
    expect(JSON.stringify(result)).not.toMatch(/ch-\d+/)
  })
})
