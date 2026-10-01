import { describe, expect, it } from 'vitest'

import { buildTLSStatusInput } from '../evidence-adapter'
import { evaluateTLSChapter } from '../evaluation-pipeline'
import { buildTLSPresentation } from '../presentation-model'
import {
  TLS_PUBLIC_CONTRACT_VERSION,
  evaluateTLSPublicSnapshot,
} from '../public'
import { toTLSPublicSnapshot } from '../public-contract'
import { resolveTLSStatus } from '../status-resolver'
import type { TLSChapterEvidenceSnapshot } from '../evidence-adapter'

const evidence = (
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

describe('TLS-1B.9 core runtime final certification', () => {
  it('keeps every certified layer consistent for Strong evidence', () => {
    const source = evidence()
    const input = buildTLSStatusInput(source)
    const resolved = resolveTLSStatus(input)
    const evaluation = evaluateTLSChapter(source)
    const presentation = buildTLSPresentation(evaluation, 'student')
    const serialized = toTLSPublicSnapshot(presentation)
    const publicResult = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: source,
    })

    expect(evaluation.input).toEqual(input)
    expect(evaluation.result).toEqual(resolved)
    expect(serialized).toEqual(publicResult)
    expect(publicResult).toMatchObject({
      version: TLS_PUBLIC_CONTRACT_VERSION,
      score: 88,
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('preserves safety precedence across the complete stack', () => {
    const source = evidence({
      chapterPerformancePercent: 100,
      unresolvedSafetyRequirement: true,
      unresolvedComplianceRequirement: true,
    })

    expect(
      evaluateTLSPublicSnapshot({
        audience: 'instructor',
        evidence: source,
      }),
    ).toMatchObject({
      score: 100,
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('preserves recovery confirmation rules across the complete stack', () => {
    const awaiting = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: evidence({
        chapterPerformancePercent: 86,
        remediationCycles: [
          { status: 'evaluated', outcome: 'successful' },
        ],
      }),
    })

    const confirmed = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: evidence({
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
    })

    expect(awaiting).toMatchObject({
      status: 'improving',
      action: 'complete_fresh_check',
    })
    expect(confirmed).toMatchObject({
      status: 'strong',
      action: 'continue_learning',
    })
  })

  it('never creates a second grade', () => {
    for (const score of [0, 72, 79.9, 80, 83.5, 100]) {
      expect(
        evaluateTLSPublicSnapshot({
          audience: 'student',
          evidence: evidence({ chapterPerformancePercent: score }),
        }).score,
      ).toBe(score)
    }
  })

  it('keeps insufficient evidence outside the three mastery statuses', () => {
    const result = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: evidence({
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

  it('protects student privacy while preserving instructor focus', () => {
    const source = evidence({
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
    })

    const student = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: source,
    })
    const instructor = evaluateTLSPublicSnapshot({
      audience: 'instructor',
      evidence: source,
    })

    expect(JSON.stringify(student)).not.toContain('Disinfection')
    expect(student).not.toHaveProperty('primaryFocus')
    expect(instructor).toMatchObject({
      primaryFocus: 'Disinfection',
      additionalAreaCount: 1,
    })
  })

  it('keeps public payloads free of internal evidence and resolver structures', () => {
    const serialized = JSON.stringify(
      evaluateTLSPublicSnapshot({
        audience: 'instructor',
        evidence: evidence({
          remediationCycles: [
            { status: 'in_review', outcome: null },
          ],
        }),
      }),
    )

    for (const forbidden of [
      'reason',
      'confidence',
      'recoveryState',
      'weaknessState',
      'remediationCycles',
      'initialMisses',
      'reassessmentCorrect',
      'mostRecentEvidenceAt',
      'answers_json',
      'questionId',
      'itemId',
      'chapterId',
    ]) {
      expect(serialized).not.toContain(forbidden)
    }
  })

  it('remains chapter-agnostic at the public contract boundary', () => {
    const result = evaluateTLSPublicSnapshot({
      audience: 'student',
      evidence: evidence(),
    })

    expect(result).not.toHaveProperty('chapterId')
    expect(result).not.toHaveProperty('chapterNumber')
    expect(result).not.toHaveProperty('chapterType')
  })

  it('is deterministic end to end', () => {
    const request = {
      audience: 'instructor' as const,
      evidence: evidence({
        chapterPerformancePercent: 74,
        remediationCycles: [
          { status: 'in_review' as const, outcome: null },
        ],
      }),
    }

    expect(evaluateTLSPublicSnapshot(request)).toEqual(
      evaluateTLSPublicSnapshot(request),
    )
  })
})
