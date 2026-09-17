/**
 * Chapter 4 Detection Provider Tests (C4-3)
 *
 * Proves the Chapter 4 detection provider bridges the locked concept runtime
 * to the chapter-agnostic evaluation contract:
 *   - invalid concepts and empty evidence fail closed (null)
 *   - evidence is filtered to canonically mapped questions only
 *   - reserve questions count as legitimate concept-bound evidence
 *   - detection state/confidence come from the shared engine (5-question
 *     knowledge-check evidence can reach terminal states)
 */

import { describe, it, expect } from 'vitest'
import { createChapter4DetectionProvider } from '../adapters/chapter-4-detection-provider'
import { chapter4ReassessmentQuestions } from '@/lib/chapter-4-reassessment-questions'
import type { QuizAttempt } from '@/types'

function reserveQuestion(id: string) {
  const q = chapter4ReassessmentQuestions.find((x) => x.id === id)
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
    quiz_id: 'quiz-4',
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

/** Build a 5-attempt disinfection evidence set with the given outcomes. */
function disinfEvidence(outcomes: Array<'C' | 'M'>): QuizAttempt[] {
  // Disinfection reserve: qq-4-046, 047, 048, 049, 050 (first five of 15)
  const ids = ['qq-4-046', 'qq-4-047', 'qq-4-048', 'qq-4-049', 'qq-4-050']
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

describe('Chapter 4 detection provider — closed-world validation', () => {
  const provider = createChapter4DetectionProvider({
    fetchQuizAttempts: async () => [],
  })

  it('serves ch-4 and validates concepts against the locked taxonomy', () => {
    expect(provider.chapterId).toBe('ch-4')
    expect(provider.isValidConcept('ch4-disinfection-sterilization')).toBe(true)
    expect(provider.isValidConcept('ch3-ergonomics')).toBe(false)
    expect(provider.isValidConcept('ch4-unknown')).toBe(false)
  })

  it('returns null for invalid concept IDs', async () => {
    expect(await provider.detectConceptState('ch3-ergonomics', ['a1'])).toBeNull()
    expect(await provider.detectConceptState('ch4-unknown', ['a1'])).toBeNull()
  })

  it('returns null when no attempts are found', async () => {
    expect(await provider.detectConceptState('ch4-disinfection-sterilization', ['a1'])).toBeNull()
  })
})

describe('Chapter 4 detection provider — concept-bound evidence', () => {
  it('counts only questions canonically mapped to the target family', async () => {
    const attempts = [
      // One disinfection miss + one pathogens correct (foreign to disinfection)
      makeAttempt('att-1', { 'qq-4-046': wrongFor('qq-4-046') }, ts(1)),
      makeAttempt('att-2', { 'qq-4-031': reserveQuestion('qq-4-031').correct_answer }, ts(2)),
    ]
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) =>
        attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState('ch4-disinfection-sterilization', ['att-1', 'att-2'])
    expect(result).not.toBeNull()
    expect(result!.conceptId).toBe('ch4-disinfection-sterilization')
    expect(result!.evidence.totalObservations).toBe(1)
    expect(result!.evidence.misses).toBe(1)
    // Single observation below multi-question minimum → insufficient evidence
    expect(result!.state).toBe('insufficient_evidence')
  })

  it('returns insufficient_evidence when evidence contains no mapped questions at all', async () => {
    const attempts = [
      makeAttempt('att-1', { 'qq-4-031': reserveQuestion('qq-4-031').correct_answer }, ts(1)),
      makeAttempt('att-2', { 'qq-3-001': 'a' }, ts(2)),
    ]
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState('ch4-disinfection-sterilization', ['att-1', 'att-2'])
    expect(result).not.toBeNull()
    expect(result!.state).toBe('insufficient_evidence')
    expect(result!.evidence.totalObservations).toBe(0)
  })
})

describe('Chapter 4 detection provider — 5-question knowledge-check evidence', () => {
  it('all-correct 5-question evidence reaches currently_performing_well', async () => {
    const attempts = disinfEvidence(['C', 'C', 'C', 'C', 'C'])
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch4-disinfection-sterilization',
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
    const attempts = disinfEvidence(['M', 'C', 'C', 'M', 'C'])
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch4-disinfection-sterilization',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.misses).toBe(2)
    expect(result!.state).toBe('repeated_weakness')
  })

  it('one-miss 5-question evidence stays non-terminal (emerging → pending path)', async () => {
    const attempts = disinfEvidence(['C', 'C', 'C', 'C', 'M'])
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch4-disinfection-sterilization',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.misses).toBe(1)
    // One miss is weakness evidence but not repeated → emerging_weakness
    expect(result!.state).toBe('emerging_weakness')
  })

  it('reserve answers are scored against the reserve bank, not ignored', async () => {
    // If reserve correct answers were missing from the binding, observations
    // would be skipped — this assertion pins the union wiring from Slice 1-2.
    const attempts = disinfEvidence(['C', 'M', 'C', 'M', 'C'])
    const provider = createChapter4DetectionProvider({
      fetchQuizAttempts: async (ids) => attempts.filter((a) => ids.includes(a.id)),
    })

    const result = await provider.detectConceptState(
      'ch4-disinfection-sterilization',
      attempts.map((a) => a.id),
    )
    expect(result).not.toBeNull()
    expect(result!.evidence.totalObservations).toBe(5)
    expect(result!.evidence.correct).toBe(3)
    expect(result!.evidence.misses).toBe(2)
  })
})
