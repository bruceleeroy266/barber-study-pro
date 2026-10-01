import { describe, expect, it } from 'vitest'
import { buildCertifiedDiagnosticAudienceBundle } from '../audience-snapshot-bundle'

const summary = () => ({
  chapterGrade: {
    finalGrade: 78,
  },
  overallConfidence: 'developing' as const,
  concepts: [
    {
      conceptName: 'Disinfection',
      mastery: 68,
      confidence: 'developing' as const,
      observations: 7,
      mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
      initialMisses: 2,
      reassessmentCorrect: 0,
    },
    {
      conceptName: 'Client Protection',
      mastery: 74,
      confidence: 'developing' as const,
      observations: 6,
      mostRecentEvidenceAt: '2026-10-01T12:05:00Z',
      initialMisses: 1,
      reassessmentCorrect: 0,
    },
  ],
})

describe('TLS-1C.3 audience snapshot bundle', () => {
  it('builds student and instructor snapshots from one certified summary', () => {
    const result = buildCertifiedDiagnosticAudienceBundle({
      summary: summary(),
    })

    expect(result.student.audience).toBe('student')
    expect(result.instructor.audience).toBe('instructor')
  })

  it('keeps score, status, and recommended action synchronized across audiences', () => {
    const result = buildCertifiedDiagnosticAudienceBundle({
      summary: summary(),
    })

    expect(result.student.score).toBe(78)
    expect(result.instructor.score).toBe(78)
    expect(result.student.status).toBe(result.instructor.status)
    expect(result.student.action).toBe(result.instructor.action)
  })

  it('preserves the student low-detail boundary while allowing instructor focus detail', () => {
    const result = buildCertifiedDiagnosticAudienceBundle({
      summary: summary(),
    })

    expect(result.student).not.toHaveProperty('primaryFocus')
    expect(result.student).not.toHaveProperty('additionalAreaCount')
    expect(result.instructor.primaryFocus).toBe('Disinfection')
    expect(result.instructor.additionalAreaCount).toBe(1)
  })

  it('propagates already-resolved safety state consistently without deriving it', () => {
    const result = buildCertifiedDiagnosticAudienceBundle({
      summary: summary(),
      integrationState: {
        unresolvedSafetyRequirement: true,
      },
    })

    expect(result.student.status).toBe('needs_attention')
    expect(result.instructor.status).toBe('needs_attention')
    expect(result.student.action).toBe('complete_safety_review')
    expect(result.instructor.action).toBe('complete_safety_review')
  })

  it('does not expose raw concept or remediation evidence through either public snapshot', () => {
    const result = buildCertifiedDiagnosticAudienceBundle({
      summary: summary(),
      integrationState: {
        remediationCycles: [
          {
            status: 'in_review',
            outcome: null,
          },
        ],
      },
    })

    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('initialMisses')
    expect(serialized).not.toContain('reassessmentCorrect')
    expect(serialized).not.toContain('remediationCycles')
    expect(serialized).not.toContain('observations')
  })

  it('does not mutate the certified diagnostic input or integration state', () => {
    const certifiedSummary = summary()
    const integrationState = {
      remediationCycles: [
        {
          status: 'in_review' as const,
          outcome: null,
        },
      ],
    }
    const before = JSON.stringify({ certifiedSummary, integrationState })

    buildCertifiedDiagnosticAudienceBundle({
      summary: certifiedSummary,
      integrationState,
    })

    expect(JSON.stringify({ certifiedSummary, integrationState })).toBe(before)
  })

  it('is deterministic for the same certified inputs', () => {
    const input = {
      summary: summary(),
      integrationState: {
        unresolvedComplianceRequirement: true,
      },
    }

    expect(buildCertifiedDiagnosticAudienceBundle(input)).toEqual(
      buildCertifiedDiagnosticAudienceBundle(input),
    )
  })
})
