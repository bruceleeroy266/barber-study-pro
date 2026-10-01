import { describe, expect, it } from 'vitest'
import type { TLSChapterEvidenceSnapshot } from '../evidence-adapter'
import { evaluateTLSPublicSnapshot } from '../public-evaluation'

const baseEvidence = (
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

describe('TLS-1B.6 public evaluation facade', () => {
  it('runs the full certified TLS chain through one public entry point', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'student',
        evidence: baseEvidence(),
      }),
    ).toMatchObject({
      version: '1',
      audience: 'student',
      score: 88,
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('preserves the authoritative chapter score end to end', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'instructor',
        evidence: baseEvidence({ chapterPerformancePercent: 83.5 }),
      }).score,
    ).toBe(83.5)
  })

  it('preserves safety precedence through the full public path', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'instructor',
        evidence: baseEvidence({
          chapterPerformancePercent: 99,
          unresolvedSafetyRequirement: true,
        }),
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('preserves compliance precedence through the full public path', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'instructor',
        evidence: baseEvidence({
          chapterPerformancePercent: 97,
          unresolvedComplianceRequirement: true,
        }),
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_required_review',
    })
  })

  it('keeps successful recovery Improving until fresh independent confirmation', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'student',
        evidence: baseEvidence({
          chapterPerformancePercent: 86,
          remediationCycles: [
            { status: 'evaluated', outcome: 'successful' },
          ],
        }),
      }),
    ).toMatchObject({
      status: 'improving',
      action: 'complete_fresh_check',
    })
  })

  it('allows Strong after successful recovery and fresh independent confirmation', () => {
    expect(
      evaluateTLSPublicSnapshot({
        audience: 'student',
        evidence: baseEvidence({
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
      }),
    ).toMatchObject({
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('returns insufficient evidence as Keep Learning without creating a second grade', () => {
    const result = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: baseEvidence({
        chapterPerformancePercent: null,
        overallConfidence: 'insufficient_evidence',
      }),
    })

    expect(result).toMatchObject({
      score: null,
      status: 'keep_learning',
      action: 'keep_learning',
    })
  })

  it('keeps student output free of diagnostic internals', () => {
    const result = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: baseEvidence({
        chapterPerformancePercent: 70,
        concepts: [
          {
            conceptName: 'Disinfection',
            mastery: 65,
            confidence: 'developing',
            observations: 6,
            initialMisses: 2,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
        ],
      }),
    })

    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('Disinfection')
    expect(serialized).not.toContain('primaryFocus')
    expect(serialized).not.toContain('initialMisses')
    expect(serialized).not.toContain('confidence')
    expect(serialized).not.toContain('reason')
  })

  it('keeps instructor output limited to one focus plus additional-area count', () => {
    const result = evaluateTLSPublicSnapshot({
      audience: 'instructor',
      evidence: baseEvidence({
        chapterPerformancePercent: 70,
        concepts: [
          {
            conceptName: 'Disinfection',
            mastery: 65,
            confidence: 'developing',
            observations: 6,
            initialMisses: 2,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
          {
            conceptName: 'Sanitation',
            mastery: 72,
            confidence: 'developing',
            observations: 5,
            initialMisses: 1,
            reassessmentCorrect: 0,
            mostRecentEvidenceAt: null,
          },
        ],
      }),
    })

    expect(result).toMatchObject({
      audience: 'instructor',
      primaryFocus: 'Disinfection',
      additionalAreaCount: 1,
    })

    expect(result).not.toHaveProperty('concepts')
  })

  it('is deterministic for identical requests', () => {
    const request = {
      audience: 'student' as const,
      evidence: baseEvidence(),
    }

    expect(evaluateTLSPublicSnapshot(request)).toEqual(
      evaluateTLSPublicSnapshot(request),
    )
  })
})
