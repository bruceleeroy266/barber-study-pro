import { describe, expect, it } from 'vitest'
import { evaluateTLSChapter } from '../evaluation-pipeline'
import type { TLSChapterEvidenceSnapshot } from '../evidence-adapter'
import { buildTLSPresentation } from '../presentation-model'
import {
  TLS_PUBLIC_CONTRACT_VERSION,
  isTLSPublicSnapshotForAudience,
  toTLSPublicSnapshot,
} from '../public-contract'

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

const publicView = (
  audience: 'student' | 'instructor',
  overrides: Partial<TLSChapterEvidenceSnapshot> = {},
) =>
  toTLSPublicSnapshot(
    buildTLSPresentation(evaluateTLSChapter(snapshot(overrides)), audience),
  )

describe('TLS-1B.5 stable public contract', () => {
  it('versions the public payload explicitly', () => {
    expect(publicView('student').version).toBe(TLS_PUBLIC_CONTRACT_VERSION)
    expect(TLS_PUBLIC_CONTRACT_VERSION).toBe('1')
  })

  it('preserves one authoritative chapter score', () => {
    expect(
      publicView('student', { chapterPerformancePercent: 83.5 }).score,
    ).toBe(83.5)
  })

  it('maps insufficient evidence to keep_learning without creating a fourth internal mastery status', () => {
    expect(
      publicView('student', {
        chapterPerformancePercent: null,
        overallConfidence: 'insufficient_evidence',
      }),
    ).toMatchObject({
      status: 'keep_learning',
      statusLabel: 'Keep Learning',
      action: 'keep_learning',
    })
  })

  it('maps internal safety recovery wording into a stable public action', () => {
    expect(
      publicView('instructor', {
        chapterPerformancePercent: 96,
        unresolvedSafetyRequirement: true,
      }),
    ).toMatchObject({
      status: 'needs_attention',
      action: 'complete_safety_review',
    })
  })

  it('keeps the student payload free of diagnostic focus data', () => {
    const student = publicView('student', {
      chapterPerformancePercent: 72,
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

    expect(student).not.toHaveProperty('primaryFocus')
    expect(student).not.toHaveProperty('additionalAreaCount')
    expect(JSON.stringify(student)).not.toContain('Disinfection')
  })

  it('keeps instructor focus data limited to one focus and a count', () => {
    const instructor = publicView('instructor', {
      chapterPerformancePercent: 72,
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
        {
          conceptName: 'Sanitation',
          mastery: 74,
          confidence: 'developing',
          observations: 5,
          initialMisses: 1,
          reassessmentCorrect: 0,
          mostRecentEvidenceAt: null,
        },
      ],
    })

    expect(instructor).toMatchObject({
      audience: 'instructor',
      primaryFocus: 'Disinfection',
      additionalAreaCount: 1,
    })
    expect(instructor).not.toHaveProperty('concepts')
  })

  it('does not expose resolver or evidence internals', () => {
    const serialized = JSON.stringify(
      publicView('instructor', {
        remediationCycles: [{ status: 'in_review', outcome: null }],
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

  it('provides a stable public action for each presentation action', () => {
    const cases = [
      [{ chapterPerformancePercent: null, overallConfidence: 'insufficient_evidence' as const }, 'keep_learning'],
      [{ unresolvedSafetyRequirement: true }, 'complete_safety_review'],
      [{ unresolvedComplianceRequirement: true }, 'complete_required_review'],
      [{ remediationCycles: [{ status: 'evaluated' as const, outcome: 'unsuccessful' as const }] }, 'restart_focused_review'],
      [{ remediationCycles: [{ status: 'in_review' as const, outcome: null }] }, 'finish_focused_review'],
      [{
        remediationCycles: [{ status: 'in_review' as const, outcome: null, isInterrupted: true }],
      }, 'continue_focused_review'],
      [{
        chapterPerformancePercent: 70,
        concepts: [{
          conceptName: 'A',
          mastery: 65,
          confidence: 'developing' as const,
          observations: 6,
          initialMisses: 2,
          reassessmentCorrect: 0,
          mostRecentEvidenceAt: null,
        }],
      }, 'review_focus_area'],
      [{
        remediationCycles: [{ status: 'evaluated' as const, outcome: 'successful' as const }],
      }, 'complete_fresh_check'],
      [{}, 'continue_learning'],
    ] as const

    for (const [overrides, action] of cases) {
      expect(publicView('student', overrides).action).toBe(action)
    }
  })

  it('narrows snapshots by audience without changing runtime data', () => {
    const instructor = publicView('instructor')
    expect(isTLSPublicSnapshotForAudience(instructor, 'instructor')).toBe(true)
    expect(isTLSPublicSnapshotForAudience(instructor, 'student')).toBe(false)
  })

  it('is deterministic and JSON-serializable', () => {
    const first = publicView('student')
    const second = publicView('student')

    expect(first).toEqual(second)
    expect(JSON.parse(JSON.stringify(first))).toEqual(first)
  })
})
