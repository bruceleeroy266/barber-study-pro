import { describe, expect, it } from 'vitest'
import {
  TLS_PUBLIC_CONTRACT_VERSION,
  evaluateTLSPublicSnapshot,
  isTLSPublicSnapshotForAudience,
} from '../public'
import type {
  TLSPublicEvaluationRequest,
  TLSInstructorPublicSnapshot,
  TLSPublicSnapshot,
  TLSStudentPublicSnapshot,
} from '../public'

describe('TLS-1B.7 certified consumer boundary', () => {
  const request: TLSPublicEvaluationRequest = {
    audience: 'student',
    evidence: {
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
    },
  }

  it('exposes the single supported public evaluation entry point', () => {
    const result = evaluateTLSPublicSnapshot(request)

    expect(result).toMatchObject({
      version: TLS_PUBLIC_CONTRACT_VERSION,
      audience: 'student',
      score: 88,
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('supports audience narrowing through the public module only', () => {
    const result: TLSPublicSnapshot = evaluateTLSPublicSnapshot({
      ...request,
      audience: 'instructor',
    })

    expect(isTLSPublicSnapshotForAudience(result, 'instructor')).toBe(true)

    if (isTLSPublicSnapshotForAudience(result, 'instructor')) {
      const instructor: TLSInstructorPublicSnapshot = result
      expect(instructor.audience).toBe('instructor')
    }
  })

  it('supports the student public type through the boundary', () => {
    const result = evaluateTLSPublicSnapshot(request)

    if (isTLSPublicSnapshotForAudience(result, 'student')) {
      const student: TLSStudentPublicSnapshot = result
      expect(student.audience).toBe('student')
      expect(student).not.toHaveProperty('primaryFocus')
    }
  })

  it('does not expose internal resolver/evidence/presentation runtime symbols', async () => {
    const exported = await import('../public')

    for (const forbidden of [
      'resolveTLSStatus',
      'buildTLSStatusInput',
      'evaluateTLSChapter',
      'buildTLSPresentation',
      'toTLSPublicSnapshot',
    ]) {
      expect(exported).not.toHaveProperty(forbidden)
    }
  })

  it('keeps the runtime export surface intentionally small', async () => {
    const exported = await import('../public')
    expect(Object.keys(exported).sort()).toEqual(
      [
        'TLS_PUBLIC_CONTRACT_VERSION',
        'evaluateTLSPublicSnapshot',
        'isTLSPublicSnapshotForAudience',
      ].sort(),
    )
  })
})
