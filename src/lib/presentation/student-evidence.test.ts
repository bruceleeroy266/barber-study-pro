/**
 * Tier 1 Presentation — Student Evidence Translation Tests
 *
 * Proves: exact phrasing, low-evidence null behavior, cycle-step derivation
 * for all 10 student states, and the copy firewall (no diagnostic terms).
 */

import { describe, it, expect } from 'vitest'
import {
  buildFocusReason,
  formatLastActivity,
  deriveCycleStep,
  buildCompletionGuidance,
} from './student-evidence'
import type { ConceptEvidence } from '@/lib/chapter-2-concepts/detection'
import type { StudentRemediationState } from '@/lib/remediation/student-service'

function makeEvidence(overrides: Partial<ConceptEvidence> = {}): ConceptEvidence {
  return {
    conceptId: 'C-2-15',
    learningObjectiveId: 'LO-2-08',
    totalObservations: 3,
    uniqueQuestions: 3,
    uniqueQuestionsMissed: 2,
    misses: 2,
    correct: 1,
    missRate: 2 / 3,
    consecutiveRecentCorrect: 0,
    consecutiveRecentMisses: 2,
    pattern: 'consistent',
    hasHistoricalWeakness: true,
    firstAttemptAt: '2026-08-30T10:00:00Z',
    lastAttemptAt: '2026-09-08T10:00:00Z',
    ...overrides,
  } as ConceptEvidence
}

describe('buildFocusReason', () => {
  it('uses plural phrasing for multiple missed questions', () => {
    expect(buildFocusReason(makeEvidence())).toBe(
      "You've missed 2 of the 3 questions you've tried on this topic.",
    )
  })

  it('uses singular phrasing for exactly one missed question', () => {
    expect(
      buildFocusReason(makeEvidence({ uniqueQuestionsMissed: 1, uniqueQuestions: 4 })),
    ).toBe("You missed 1 of the 4 questions you've tried on this topic.")
  })

  it('returns null when evidence is too thin to state counts honestly', () => {
    expect(buildFocusReason(makeEvidence({ uniqueQuestions: 0 }))).toBeNull()
    expect(buildFocusReason(makeEvidence({ totalObservations: 1 }))).toBeNull()
    expect(buildFocusReason(makeEvidence({ uniqueQuestionsMissed: 0 }))).toBeNull()
    expect(buildFocusReason(null)).toBeNull()
    expect(buildFocusReason(undefined)).toBeNull()
  })
})

describe('formatLastActivity', () => {
  it('formats a real date', () => {
    expect(formatLastActivity('2026-09-08T10:00:00Z')).toBe(
      'Last quiz activity: September 8, 2026',
    )
  })

  it('returns null for missing or invalid dates', () => {
    expect(formatLastActivity(null)).toBeNull()
    expect(formatLastActivity(undefined)).toBeNull()
    expect(formatLastActivity('not-a-date')).toBeNull()
  })
})

describe('deriveCycleStep', () => {
  it('maps every student state to the correct step', () => {
    const expected: Record<StudentRemediationState, 1 | 2 | 3> = {
      targeted_review: 1,
      review_in_progress: 1,
      pending_more_evidence: 1,
      review_completed: 2,
      reassessment_in_progress: 2,
      pending_evaluation: 2,
      successful: 3,
      unsuccessful: 3,
      pool_exhausted: 3,
      already_completed: 3,
    }
    for (const [state, step] of Object.entries(expected)) {
      expect(deriveCycleStep(state as StudentRemediationState), state).toBe(step)
    }
  })
})

describe('buildCompletionGuidance', () => {
  it('returns guidance for every step and never empty', () => {
    for (const step of [1, 2, 3] as const) {
      expect(buildCompletionGuidance(step, 'targeted_review').length).toBeGreaterThan(20)
    }
  })

  it('celebrates completion only for successful/completed states', () => {
    expect(buildCompletionGuidance(3, 'successful')).toContain('complete')
    expect(buildCompletionGuidance(3, 'already_completed')).toContain('complete')
    expect(buildCompletionGuidance(3, 'unsuccessful')).toContain('instructor')
    expect(buildCompletionGuidance(3, 'pool_exhausted')).toContain('instructor')
  })
})

describe('copy firewall — no diagnostic vocabulary reaches students', () => {
  const FORBIDDEN = /weakness|detection|confidence|mastery|repeated|emerging|diagnos|state machine|outcome matrix/i

  it('focus reasons never contain diagnostic terms', () => {
    const samples = [
      buildFocusReason(makeEvidence()),
      buildFocusReason(makeEvidence({ uniqueQuestionsMissed: 1 })),
    ]
    for (const s of samples) {
      expect(s).not.toBeNull()
      expect(FORBIDDEN.test(s!)).toBe(false)
    }
  })

  it('guidance copy never contains diagnostic terms', () => {
    const states: StudentRemediationState[] = [
      'targeted_review',
      'review_in_progress',
      'review_completed',
      'reassessment_in_progress',
      'pending_evaluation',
      'pending_more_evidence',
      'successful',
      'unsuccessful',
      'pool_exhausted',
      'already_completed',
    ]
    for (const s of states) {
      const copy = buildCompletionGuidance(deriveCycleStep(s), s)
      expect(FORBIDDEN.test(copy), `${s}: ${copy}`).toBe(false)
    }
  })
})
