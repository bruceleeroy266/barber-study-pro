import { describe, expect, it } from 'vitest'
import { buildTLSPresentation } from '../presentation-model'
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

describe('TLS-1B.4 presentation model', () => {
  it('preserves the existing chapter score instead of creating a TLS score', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(snapshot({ chapterPerformancePercent: 83.5 })),
      'student',
    )

    expect(view.score).toBe(83.5)
  })

  it('shows Strong with one student action', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(snapshot()),
      'student',
    )

    expect(view).toMatchObject({
      status: 'strong',
      statusLabel: 'Strong',
      action: 'continue_normal_learning',
      actionLabel: 'Continue to the next learning activity',
    })
  })

  it('shows Keep Learning rather than inventing a fourth mastery status', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: null,
          overallConfidence: 'insufficient_evidence',
        }),
      ),
      'student',
    )

    expect(view.status).toBeNull()
    expect(view.statusLabel).toBe('Keep Learning')
    expect(view.actionLabel).toBe('Keep learning')
  })

  it('does not expose diagnostic focus or extra weak-area counts to the student view', () => {
    const evaluation = evaluateTLSChapter(
      snapshot({
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
      }),
    )

    const student = buildTLSPresentation(evaluation, 'student')
    expect(student.primaryFocus).toBeNull()
    expect(student.additionalAreaCount).toBe(0)
    expect(student.supportingText).not.toContain('Disinfection')
  })

  it('provides the instructor one primary focus plus additional-area count', () => {
    const evaluation = evaluateTLSChapter(
      snapshot({
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
      }),
    )

    const instructor = buildTLSPresentation(evaluation, 'instructor')
    expect(instructor.primaryFocus).toBe('Disinfection')
    expect(instructor.additionalAreaCount).toBe(1)
    expect(instructor.actionLabel).toBe('Intervene on the primary weak concept')
  })

  it('keeps active remediation low-stress for the student', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 74,
          remediationCycles: [{ status: 'in_review', outcome: null }],
        }),
      ),
      'student',
    )

    expect(view).toMatchObject({
      status: 'improving',
      statusLabel: 'Improving',
      actionLabel: 'Finish your focused review',
    })
    expect(view.supportingText).toContain('making progress')
  })

  it('uses explicit safety wording for instructor action without exposing raw answers', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 96,
          unresolvedSafetyRequirement: true,
        }),
      ),
      'instructor',
    )

    expect(view).toMatchObject({
      status: 'needs_attention',
      statusLabel: 'Needs Attention',
      actionLabel: 'Require safety recovery before progression',
    })
    expect(JSON.stringify(view)).not.toMatch(/answers_json|questionId|itemId/)
  })

  it('keeps recovery confirmation visible as Improving until fresh independent evidence exists', () => {
    const view = buildTLSPresentation(
      evaluateTLSChapter(
        snapshot({
          chapterPerformancePercent: 86,
          remediationCycles: [{ status: 'evaluated', outcome: 'successful' }],
        }),
      ),
      'instructor',
    )

    expect(view).toMatchObject({
      status: 'improving',
      actionLabel: 'Collect fresh independent evidence',
    })
    expect(view.supportingText).toContain('fresh independent evidence')
  })

  it('is deterministic for the same evaluation and audience', () => {
    const evaluation = evaluateTLSChapter(snapshot())
    expect(buildTLSPresentation(evaluation, 'student')).toEqual(
      buildTLSPresentation(evaluation, 'student'),
    )
  })
})
