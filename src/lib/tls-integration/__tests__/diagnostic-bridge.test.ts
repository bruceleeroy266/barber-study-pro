import { describe, expect, it } from 'vitest'
import {
  buildTLSReadOnlyRequest,
  evaluateTLSReadOnlyDiagnostic,
} from '../diagnostic-bridge'

const base = () => ({
  audience: 'instructor' as const,
  chapterPerformancePercent: 88,
  overallConfidence: 'proficient' as const,
  concepts: [
    {
      conceptName: 'Infection Control',
      mastery: 91,
      confidence: 'proficient' as const,
      observations: 8,
      initialMisses: 0,
      reassessmentCorrect: 0,
      mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
    },
  ],
})

describe('TLS-1C.1 read-only diagnostic bridge', () => {
  it('builds the certified public TLS request shape without recalculating grade', () => {
    const request = buildTLSReadOnlyRequest(base())

    expect(request).toMatchObject({
      audience: 'instructor',
      evidence: {
        chapterPerformancePercent: 88,
        overallConfidence: 'proficient',
        unresolvedSafetyRequirement: false,
        unresolvedComplianceRequirement: false,
      },
    })
  })

  it('preserves the authoritative chapter percentage end to end', () => {
    expect(evaluateTLSReadOnlyDiagnostic(base()).score).toBe(88)
  })

  it('passes existing safety state through instead of deriving it from raw answers', () => {
    expect(
      evaluateTLSReadOnlyDiagnostic({
        ...base(),
        chapterPerformancePercent: 99,
        unresolvedSafetyRequirement: true,
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('passes existing compliance state through instead of deriving it from raw answers', () => {
    expect(
      evaluateTLSReadOnlyDiagnostic({
        ...base(),
        chapterPerformancePercent: 98,
        unresolvedComplianceRequirement: true,
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_required_review',
    })
  })

  it('passes remediation state through to the certified core', () => {
    expect(
      evaluateTLSReadOnlyDiagnostic({
        ...base(),
        chapterPerformancePercent: 74,
        remediationCycles: [{ status: 'in_review', outcome: null }],
      }),
    ).toMatchObject({
      status: 'improving',
      action: 'finish_focused_review',
    })
  })

  it('supports fresh post-recovery evidence without changing history', () => {
    expect(
      evaluateTLSReadOnlyDiagnostic({
        ...base(),
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
    ).toMatchObject({
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('copies arrays so the bridge does not mutate caller-owned diagnostic input', () => {
    const input = base()
    const request = buildTLSReadOnlyRequest(input)

    expect(request.evidence.concepts).not.toBe(input.concepts)
    expect(request.evidence.concepts[0]).not.toBe(input.concepts[0])
  })

  it('keeps student output free of instructor diagnostic focus details', () => {
    const result = evaluateTLSReadOnlyDiagnostic({
      ...base(),
      audience: 'student',
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
    })

    expect(JSON.stringify(result)).not.toContain('Disinfection')
    expect(result).not.toHaveProperty('primaryFocus')
  })

  it('remains read-only and requires no chapter identifier', () => {
    const request = buildTLSReadOnlyRequest(base())

    expect(request.evidence).not.toHaveProperty('chapterId')
    expect(request.evidence).not.toHaveProperty('answers_json')
    expect(request.evidence).not.toHaveProperty('studentId')
  })

  it('is deterministic for identical integrated diagnostics', () => {
    expect(evaluateTLSReadOnlyDiagnostic(base())).toEqual(
      evaluateTLSReadOnlyDiagnostic(base()),
    )
  })
})
