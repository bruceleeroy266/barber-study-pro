import { describe, expect, it } from 'vitest'
import { mapCertifiedDiagnosticSummaryToTLS } from '../certified-diagnostic-summary-mapper'

const summary = () => ({
  chapterGrade: {
    baseGrade: 84,
    finalGrade: 88,
    recoveryApplied: true,
    componentWeights: {
      micro_check: 0.2,
      flashcard: 0.1,
      chapter_assessment: 0.4,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    },
  },
  overallMastery: 86,
  overallConfidence: 'proficient' as const,
  chapterAssessmentPercent: 85,
  microCheckPercent: 90,
  remediationReassessmentPercent: 100,
  strongestConcepts: [],
  weakestConcepts: [],
  concepts: [
    {
      conceptName: 'Infection Control',
      mastery: 91,
      confidence: 'proficient' as const,
      observations: 8,
      mostRecentEvidenceAt: '2026-10-01T12:00:00Z',
      initialMisses: 0,
      reassessmentCorrect: 0,
    },
  ],
  remediationStatus: 'No active remediation',
  latestReassessment: 'Passed',
  evidenceCount: 8,
})

describe('TLS-1C.2 certified diagnostic summary mapper', () => {
  it('uses chapterGrade.finalGrade as the only authoritative TLS score', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: summary(),
    })

    expect(result.score).toBe(88)
    expect(result.score).not.toBe(84)
    expect(result.score).not.toBe(86)
  })

  it('maps certified concept diagnostics without requiring chapter-specific IDs', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: summary(),
    })

    expect(result).toMatchObject({
      audience: 'instructor',
      status: 'strong',
      action: 'continue_learning',
    })
    expect(result).not.toHaveProperty('chapterId')
  })

  it('keeps raw chapter grading components out of the public TLS result', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: summary(),
    })

    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('componentWeights')
    expect(serialized).not.toContain('chapterAssessmentPercent')
    expect(serialized).not.toContain('microCheckPercent')
    expect(serialized).not.toContain('remediationReassessmentPercent')
  })

  it('does not infer safety from the diagnostic summary', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: summary(),
    })

    expect(result.status).toBe('strong')
  })

  it('accepts already-resolved safety state explicitly', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: summary(),
      integrationState: {
        unresolvedSafetyRequirement: true,
      },
    })

    expect(result).toMatchObject({
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('accepts already-resolved remediation state explicitly', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'student',
      summary: {
        ...summary(),
        chapterGrade: {
          ...summary().chapterGrade,
          finalGrade: 74,
        },
      },
      integrationState: {
        remediationCycles: [
          { status: 'in_review', outcome: null },
        ],
      },
    })

    expect(result).toMatchObject({
      status: 'improving',
      action: 'finish_focused_review',
    })
  })

  it('preserves student low-detail output', () => {
    const result = mapCertifiedDiagnosticSummaryToTLS({
      audience: 'student',
      summary: {
        ...summary(),
        chapterGrade: {
          ...summary().chapterGrade,
          finalGrade: 70,
        },
        concepts: [
          {
            conceptName: 'Disinfection',
            mastery: 65,
            confidence: 'developing',
            observations: 6,
            mostRecentEvidenceAt: null,
            initialMisses: 2,
            reassessmentCorrect: 0,
          },
        ],
      },
    })

    expect(JSON.stringify(result)).not.toContain('Disinfection')
    expect(result).not.toHaveProperty('primaryFocus')
  })

  it('does not mutate the certified diagnostic summary', () => {
    const input = summary()
    const before = JSON.stringify(input)

    mapCertifiedDiagnosticSummaryToTLS({
      audience: 'instructor',
      summary: input,
    })

    expect(JSON.stringify(input)).toBe(before)
  })

  it('is deterministic for the same certified summary', () => {
    const input = {
      audience: 'instructor' as const,
      summary: summary(),
    }

    expect(mapCertifiedDiagnosticSummaryToTLS(input)).toEqual(
      mapCertifiedDiagnosticSummaryToTLS(input),
    )
  })
})
