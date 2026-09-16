/**
 * Chapter 3 Detection Provider Tests (C3-3 Stage 3)
 *
 * Proves the Chapter 3 detection provider bridges the locked concept runtime
 * to the chapter-agnostic evaluation contract:
 *   - invalid concepts and empty evidence fail closed (null)
 *   - evidence is filtered to canonically mapped questions only
 *   - reserve questions count as legitimate concept-bound evidence
 *   - detection state/confidence come from the shared engine (5-question
 *     knowledge-check evidence can reach terminal states)
 */

import { describe, it, expect } from 'vitest'
import { createChapter3DetectionProvider } from '../adapters/chapter-3-detection-provider'
import { chapter3ReassessmentQuestions } from '@/lib/chapter-3-reassessment-questions'
import type { QuizAttempt } from '@/types'

function reserveQuestion(id: string) {
  const q = chapter3ReassessmentQuestions.find((x) => x.id === id)
  if (!q) throw new Error(`unknown reserve question ${id}`)
  return q
}

function wrongFor(id: string): string {
  const correct = reserveQuestion(id).correct_answer
  return correct === 'a' ? 'b' : 'a'
}

function makeAttempt(
  id: string,
  answers: Record<string, string>,
  completedAt: string,
): QuizAttempt {
  return {
    id,
    user_id: 'student-1',
    quiz_id: 'quiz-3',
    score: 0,
    total_questions: 1,
    percentage: 0,
    answers_json: answers,
    completed_at: completedAt,
  }
}

function ts(day: number): string {
  return `2026-09-${String(day).padStart(2, '0')}T12:00:00.000Z`
}

/** Build a 5-attempt ergonomics evidence set with the given outcomes. */
function ergoEvidence(outcomes: Array<'C' | 'M'>): QuizAttempt[] {
  // Ergonomics reserve: qq-3-075, 076, 077, 078, 079 (first five of 15)
  const ids = ['qq-3-075', 'qq-3-076', 'qq-3-077', 'qq-3-078', 'qq-3-079']
  return outcomes.map((outcome, i) =>
    makeAttempt(
      `att-${i + 1}`,
      {
        [ids[i]]:
          outcome === 'C'
            ? reserveQuestion(ids[i]).correct_answer
            : wrongFor(ids[i]),
      },
      ts(i + 1),
    )
  )
}

describe('Chapter 3 detection provider — closed-world validation', () => {
  const provider = createChapter3DetectionProvider({
    fetchQuizAttempts: async () => [],
  })

  it('serves ch-3 and validates concepts against the locked taxonomy', () => {
    expect(provider.chapterId).toBe('ch-3')
    expect(provider.isValidConcept('ch3-ergonomics')).toBe(true)
    expect(provider.isValidConcept('C-2-01')).toBe(false)
    expect(provider.isValidConcept('ch3-unknown')).toBe(false)
  })

  it('returns null for invalid concept IDs', async () => {
    expect(await provider.detectConceptState('C-2-01', ['a1'])).toBeNull()
    expect(await provider.detectConceptState('ch3-unknown', ['a1'])).toBeNull()
  })

  it('returns null when no attempts are found', async () => {
    expect(await provider.detectConceptState('ch3-ergonomics', ['a1'])).toBeNull()
  })
})

describe('Chapter 3 detection provider — concept-bound evidence', () => {
  it('counts only questions canonically mapped to the target family', async () => {
    const attempts = [
      // One ergonomics miss + one human-relations correct (foreign to ergonomics)
      makeAttempt('att-1', { 'qq-3-075': wrongFor('qq-3-075') }, ts(1)),
      makeAttempt('att-2', { 'qq-3-090': reserveQuestion('qq-3-090').correct_answer }, ts(2)),
    ]
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) =>
        attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState('ch3-ergonomics', ['att-1', 'att-2'])
    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe('ch3-ergonomics')
    expect(result!.evidence.totalObservations).toBe(1)
    expect(result!.evidence.misses).toBe(1)
    // Single observation below multi-question minimum → insufficient evidence
    expect(result!.state).toBe('insufficient_evidence')
  })

  it('returns insufficient_evidence when evidence contains no mapped questions at all', async () => {
    const attempts = [
      makeAttempt('att-1', { 'qq-3-090': reserveQuestion('qq-3-090').correct_answer }, ts(1)),
      makeAttempt('att-2', { 'qq-2-001': 'a' }, ts(2)),
    ]
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState('ch3-ergonomics', ['att-1', 'att-2'])
    expect(result).not.toBeNull()
    expect(result!.state).toBe('insufficient_evidence')
    expect(result!.evidence.totalObservations).toBe(0)
  })
})

describe('Chapter 3 detection provider — 5-question knowledge-check evidence', () => {
  it('all-correct 5-question evidence reaches currently_performing_well', async () => {
    const attempts = ergoEvidence(['C', 'C', 'C', 'C', 'C'])
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch3-ergonomics',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.state).toBe('currently_performing_well')
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.misses).toBe(0)
    expect(result!.evidence.uniqueQuestions).toBe(5)
    // 5 observations across 5 unique questions → medium confidence
    expect(result!.confidence).toBe('medium')
  })

  it('two-miss 5-question evidence reaches repeated_weakness', async () => {
    // M, C, C, M, C: 2 misses, non-alternating, no >=2 correct streak at the
    // end — repeated_weakness per the established engine semantics.
    const attempts = ergoEvidence(['M', 'C', 'C', 'M', 'C'])
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch3-ergonomics',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.misses).toBe(2)
    expect(result!.state).toBe('repeated_weakness')
  })

  it('one-miss 5-question evidence stays non-terminal (emerging → pending path)', async () => {
    const attempts = ergoEvidence(['C', 'C', 'C', 'C', 'M'])
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch3-ergonomics',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.misses).toBe(1)
    // One miss is weakness evidence but not repeated → emerging_weakness
    expect(result!.state).toBe('emerging_weakness')
  })

  it('reserve answers are scored against the reserve bank, not ignored', async () => {
    // If reserve correct answers were missing from the binding, observations
    // would be skipped — this assertion pins the union wiring from Stage 2.
    const attempts = ergoEvidence(['C', 'M', 'C', 'M', 'C'])
    const provider = createChapter3DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch3-ergonomics',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.correct).toBe(3)
    expect(result!.evidence.misses).toBe(2)
  })
})
