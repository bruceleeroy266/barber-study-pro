/**
 * Chapter 3 Reassessment Reserve Tests (C3-3)
 *
 * Proves the reserve bank's integrity contract:
 *   - exactly 60 original questions, sequential IDs qq-3-045..104
 *   - 15 per locked family, exactly one family per question
 *   - 6E/6M/3H difficulty per family; A/B/C/D positions balanced 15/15/15/15
 *   - zero overlap with the locked 30-question initial bank
 *   - the initial quiz serving path is untouched (still serves only the 30)
 *   - the detection binding counts reserve answers as legitimate evidence
 */

import { describe, it, expect } from 'vitest'
import { chapter3ReassessmentQuestions } from './chapter-3-reassessment-questions'
import { chapter3PremiumQuizQuestions } from './chapter-3-premium-quiz'
import { chapter3ReassessmentQuestionConceptMappings } from './chapter-3-concepts/mappings'
import { CHAPTER3_CONCEPT_FAMILY_IDS } from './chapter-3-concepts/concepts'
import { buildConceptEvidence } from './chapter-3-concepts/detection'
import { allQuizQuestions } from './quiz-data'
import type { QuizAttempt } from '@/types'

const FAMILIES = CHAPTER3_CONCEPT_FAMILY_IDS
const FAMILY_OF: Record<string, string> = {
  ...Object.fromEntries(
    chapter3ReassessmentQuestionConceptMappings.map((m) => [m.questionId, m.conceptFamilyId]),
  ),
}

describe('Chapter 3 reassessment reserve — bank shape', () => {
  it('contains exactly 60 questions', () => {
    expect(chapter3ReassessmentQuestions).toHaveLength(60)
  })

  it('uses unique sequential IDs qq-3-045 through qq-3-104', () => {
    const ids = chapter3ReassessmentQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(60)
    const expected = Array.from(
      { length: 60 },
      (_, i) => `qq-3-${String(45 + i).padStart(3, '0')}`,
    )
    expect(ids).toEqual(expected)
  })

  it('shares quiz_id quiz-3 with the chapter and never enters the initial serving path', () => {
    for (const q of chapter3ReassessmentQuestions) {
      expect(q.quiz_id).toBe('quiz-3')
    }
    // Initial serving registry still serves exactly the locked 30.
    const served = allQuizQuestions['quiz-3']
    expect(served).toHaveLength(30)
    const servedIds = new Set(served.map((q) => q.id))
    for (const q of chapter3ReassessmentQuestions) {
      expect(servedIds.has(q.id), `${q.id} leaked into initial serving path`).toBe(false)
    }
  })

  it('every question has 4 distinct non-empty options, a valid key, substantive explanation, valid difficulty', () => {
    for (const q of chapter3ReassessmentQuestions) {
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      for (const opt of options) {
        expect(opt.trim().length, `${q.id} empty option`).toBeGreaterThan(0)
      }
      expect(new Set(options).size, `${q.id} duplicate options`).toBe(4)
      expect(['a', 'b', 'c', 'd'], `${q.id} bad key`).toContain(q.correct_answer)
      expect(
        q.explanation?.trim().length ?? 0,
        `${q.id} thin explanation`,
      ).toBeGreaterThan(40)
      expect(['easy', 'medium', 'hard'], `${q.id} bad difficulty`).toContain(q.difficulty)
    }
  })
})

describe('Chapter 3 reassessment reserve — position and pattern integrity', () => {
  it('correct-answer positions are exactly A=15, B=15, C=15, D=15', () => {
    const tally = { a: 0, b: 0, c: 0, d: 0 }
    for (const q of chapter3ReassessmentQuestions) {
      tally[q.correct_answer as keyof typeof tally]++
    }
    expect(tally).toEqual({ a: 15, b: 15, c: 15, d: 15 })
  })

  it('no strong correct-is-longest pattern exists in the reserve', () => {
    let correctIsLongest = 0
    for (const q of chapter3ReassessmentQuestions) {
      const options = [q.answer_a, q.answer_b, q.answer_c, q.answer_d]
      const correctText = options['abcd'.indexOf(q.correct_answer)]
      const maxLen = Math.max(...options.map((o) => o.length))
      const longestCount = options.filter((o) => o.length === maxLen).length
      // Only count as a signal when the correct option is UNIQUELY longest.
      if (correctText.length === maxLen && longestCount === 1) {
        correctIsLongest++
      }
    }
    expect(correctIsLongest).toBeLessThanOrEqual(24) // <= 40% of the bank
  })

  it('difficulty per family is exactly 6 easy / 6 medium / 3 hard', () => {
    for (const family of FAMILIES) {
      const questions = chapter3ReassessmentQuestions.filter(
        (q) => FAMILY_OF[q.id] === family,
      )
      expect(questions).toHaveLength(15)
      const tally = { easy: 0, medium: 0, hard: 0 }
      for (const q of questions) tally[q.difficulty]++
      expect(tally, family).toEqual({ easy: 6, medium: 6, hard: 3 })
    }
  })
})

describe('Chapter 3 reassessment reserve — concept coverage', () => {
  it('assigns exactly 15 reserve questions to each of the four locked families', () => {
    expect(chapter3ReassessmentQuestionConceptMappings).toHaveLength(60)
    for (const family of FAMILIES) {
      const count = chapter3ReassessmentQuestionConceptMappings.filter(
        (m) => m.conceptFamilyId === family,
      ).length
      expect(count, family).toBe(15)
    }
  })

  it('every reserve question maps to exactly one locked family and resolves to a real question', () => {
    const bankIds = new Set(chapter3ReassessmentQuestions.map((q) => q.id))
    const seen = new Set<string>()
    for (const m of chapter3ReassessmentQuestionConceptMappings) {
      expect(FAMILIES, m.questionId).toContain(m.conceptFamilyId)
      expect(bankIds.has(m.questionId), `orphan mapping ${m.questionId}`).toBe(true)
      expect(seen.has(m.questionId), `${m.questionId} mapped twice`).toBe(false)
      seen.add(m.questionId)
    }
    expect(seen.size).toBe(60)
  })

  it('initial-quiz questions never enter the reassessment reserve', () => {
    const initialIds = new Set(chapter3PremiumQuizQuestions.map((q) => q.id))
    for (const q of chapter3ReassessmentQuestions) {
      expect(initialIds.has(q.id), `${q.id} duplicates an initial-quiz ID`).toBe(false)
    }
  })
})

describe('Chapter 3 reassessment reserve — detection evidence wiring', () => {
  it('counts reserve answers as legitimate concept evidence', () => {
    const attempt: QuizAttempt = {
      id: 'att-reserve-1',
      user_id: 'student-1',
      quiz_id: 'quiz-3',
      score: 0,
      total_questions: 1,
      percentage: 0,
      answers_json: { 'qq-3-075': wrongAnswerFor('qq-3-075') },
      completed_at: '2026-09-16T12:00:00.000Z',
    }
    const evidence = buildConceptEvidence('ch3-ergonomics', [attempt])
    expect(evidence.totalObservations).toBe(1)
    expect(evidence.misses).toBe(1)
    expect(evidence.uniqueQuestions).toBe(1)
  })

  it('ignores reserve questions mapped to other families (attribution)', () => {
    const attempt: QuizAttempt = {
      id: 'att-reserve-2',
      user_id: 'student-1',
      quiz_id: 'quiz-3',
      score: 0,
      total_questions: 1,
      percentage: 0,
      answers_json: { 'qq-3-090': correctAnswerFor('qq-3-090') },
      completed_at: '2026-09-16T12:00:00.000Z',
    }
    // qq-3-090 belongs to human-relations — ergonomics evidence must stay empty.
    const evidence = buildConceptEvidence('ch3-ergonomics', [attempt])
    expect(evidence.totalObservations).toBe(0)
  })
})

function correctAnswerFor(questionId: string): string {
  const q = chapter3ReassessmentQuestions.find((x) => x.id === questionId)
  if (!q) throw new Error(`unknown reserve question ${questionId}`)
  return q.correct_answer
}

function wrongAnswerFor(questionId: string): string {
  const correct = correctAnswerFor(questionId)
  return correct === 'a' ? 'b' : 'a'
}
