import { describe, expect, it } from 'vitest'
import {
  evaluateTLSPublicSnapshot,
  TLS_PUBLIC_CONTRACT_VERSION,
} from '../public'
import type { TLSPublicEvaluationRequest } from '../public'
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

const run = (
  audience: TLSPublicEvaluationRequest['audience'],
  overrides: Partial<TLSChapterEvidenceSnapshot> = {},
) =>
  evaluateTLSPublicSnapshot({
    audience,
    evidence: evidence(overrides),
  })

describe('TLS-1B.8 public contract conformance matrix', () => {
  const statusMatrix = [
    {
      name: 'insufficient evidence',
      overrides: {
        chapterPerformancePercent: null,
        overallConfidence: 'insufficient_evidence' as const,
      },
      expected: {
        score: null,
        status: 'keep_learning',
        action: 'keep_learning',
      },
    },
    {
      name: 'strong current evidence',
      overrides: {},
      expected: {
        score: 88,
        status: 'strong',
        action: 'continue_learning',
      },
    },
    {
      name: 'below standard',
      overrides: { chapterPerformancePercent: 72 },
      expected: {
        score: 72,
        status: 'needs_attention',
        action: 'review_focus_area',
      },
    },
    {
      name: 'safety precedence',
      overrides: {
        chapterPerformancePercent: 99,
        unresolvedSafetyRequirement: true,
      },
      expected: {
        score: 99,
        status: 'needs_attention',
        action: 'complete_safety_review',
      },
    },
    {
      name: 'compliance precedence',
      overrides: {
        chapterPerformancePercent: 98,
        unresolvedComplianceRequirement: true,
      },
      expected: {
        score: 98,
        status: 'needs_attention',
        action: 'complete_required_review',
      },
    },
    {
      name: 'failed recovery',
      overrides: {
        remediationCycles: [
          { status: 'evaluated' as const, outcome: 'unsuccessful' as const },
        ],
      },
      expected: {
        score: 88,
        status: 'needs_attention',
        action: 'restart_focused_review',
      },
    },
    {
      name: 'active recovery',
      overrides: {
        chapterPerformancePercent: 74,
        remediationCycles: [
          { status: 'in_review' as const, outcome: null },
        ],
      },
      expected: {
        score: 74,
        status: 'improving',
        action: 'finish_focused_review',
      },
    },
    {
      name: 'interrupted recovery',
      overrides: {
        chapterPerformancePercent: 74,
        remediationCycles: [
          {
            status: 'in_review' as const,
            outcome: null,
            isInterrupted: true,
          },
        ],
      },
      expected: {
        score: 74,
        status: 'improving',
        action: 'continue_focused_review',
      },
    },
    {
      name: 'successful recovery awaiting fresh confirmation',
      overrides: {
        chapterPerformancePercent: 86,
        remediationCycles: [
          { status: 'evaluated' as const, outcome: 'successful' as const },
        ],
      },
      expected: {
        score: 86,
        status: 'improving',
        action: 'complete_fresh_check',
      },
    },
    {
      name: 'successful recovery confirmed by fresh evidence',
      overrides: {
        chapterPerformancePercent: 86,
        remediationCycles: [
          { status: 'evaluated' as const, outcome: 'successful' as const },
        ],
        freshIndependentPostRecoveryEvidence: {
          exists: true,
          percent: 84,
          observedAt: '2026-10-01T13:00:00Z',
        },
      },
      expected: {
        score: 86,
        status: 'strong',
        action: 'continue_learning',
      },
    },
  ] as const

  for (const testCase of statusMatrix) {
    it(`conforms for ${testCase.name}`, () => {
      expect(run('student', testCase.overrides)).toMatchObject({
        version: TLS_PUBLIC_CONTRACT_VERSION,
        audience: 'student',
        ...testCase.expected,
      })
    })
  }

  it('keeps safety ahead of compliance when both are unresolved', () => {
    expect(
      run('instructor', {
        chapterPerformancePercent: 100,
        unresolvedSafetyRequirement: true,
        unresolvedComplianceRequirement: true,
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('does not let a single weak signal alone create repeated-weakness behavior', () => {
    const result = run('instructor', {
      chapterPerformancePercent: 84,
      concepts: [
        {
          conceptName: 'Sanitation',
          mastery: 76,
          confidence: 'developing',
          observations: 4,
          initialMisses: 1,
          reassessmentCorrect: 0,
          mostRecentEvidenceAt: null,
        },
      ],
    })

    expect(result.status).not.toBe('needs_attention')
  })

  it('does escalate repeated/significant weakness', () => {
    const result = run('instructor', {
      chapterPerformancePercent: 84,
      concepts: [
        {
          conceptName: 'Disinfection',
          mastery: 68,
          confidence: 'developing',
          observations: 6,
          initialMisses: 2,
          reassessmentCorrect: 0,
          mostRecentEvidenceAt: null,
        },
      ],
    })

    expect(result).toMatchObject({
      status: 'needs_attention',
      action: 'review_focus_area',
      primaryFocus: 'Disinfection',
    })
  })

  it('keeps the student public payload low-detail and low-stress', () => {
    const result = run('student', {
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

    const serialized = JSON.stringify(result)
    expect(serialized).not.toContain('Disinfection')
    expect(serialized).not.toContain('Sanitation')
    expect(result).not.toHaveProperty('primaryFocus')
    expect(result).not.toHaveProperty('additionalAreaCount')
  })

  it('keeps the instructor payload limited to one focus plus a count', () => {
    expect(
      run('instructor', {
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
    ).toMatchObject({
      audience: 'instructor',
      primaryFocus: 'Disinfection',
      additionalAreaCount: 1,
    })
  })

  it('keeps public payloads free of internal implementation fields across audiences', () => {
    for (const audience of ['student', 'instructor'] as const) {
      const serialized = JSON.stringify(
        run(audience, {
          chapterPerformancePercent: 74,
          remediationCycles: [
            { status: 'in_review', outcome: null },
          ],
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
    }
  })

  it('is deterministic across the complete matrix', () => {
    for (const testCase of statusMatrix) {
      expect(run('student', testCase.overrides)).toEqual(
        run('student', testCase.overrides),
      )
      expect(run('instructor', testCase.overrides)).toEqual(
        run('instructor', testCase.overrides),
      )
    }
  })
})
