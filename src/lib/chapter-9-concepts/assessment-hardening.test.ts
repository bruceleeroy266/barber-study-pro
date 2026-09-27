import { describe, expect, it } from 'vitest'
import { chapter9PremiumQuizQuestions } from '@/lib/chapter-9-premium-quiz'
import { chapter9QuizQuestionConceptMappings } from './mappings'

const allText = chapter9PremiumQuizQuestions
  .map((q) => [q.question, q.answer_a, q.answer_b, q.answer_c, q.answer_d, q.explanation].join('\n'))
  .join('\n')

describe('C9-4 hardened Chapter 9 assessment', () => {
  it('preserves exactly 30 unique ordered questions', () => {
    expect(chapter9PremiumQuizQuestions).toHaveLength(30)
    expect(new Set(chapter9PremiumQuizQuestions.map((q) => q.id)).size).toBe(30)
    expect(chapter9PremiumQuizQuestions.map((q) => q.order_index)).toEqual(
      Array.from({ length: 30 }, (_, i) => i + 1)
    )
  })

  it('maps every assessment question to exactly one canonical concept family', () => {
    expect(chapter9QuizQuestionConceptMappings).toHaveLength(30)
    const mappedIds = chapter9QuizQuestionConceptMappings.map((m) => m.questionId)
    expect(new Set(mappedIds).size).toBe(30)
    expect(new Set(mappedIds)).toEqual(new Set(chapter9PremiumQuizQuestions.map((q) => q.id)))
  })

  it('removes easy questions and keeps the bank predominantly hard', () => {
    expect(chapter9PremiumQuizQuestions.some((q) => q.difficulty === 'easy')).toBe(false)
    const hardCount = chapter9PremiumQuizQuestions.filter((q) => q.difficulty === 'hard').length
    expect(hardCount).toBeGreaterThanOrEqual(18)
  })

  it('keeps answer positions varied instead of creating a predictable key pattern', () => {
    const counts = { a: 0, b: 0, c: 0, d: 0 }
    for (const q of chapter9PremiumQuizQuestions) counts[q.correct_answer as keyof typeof counts] += 1
    expect(Math.min(...Object.values(counts))).toBeGreaterThanOrEqual(5)
    expect(Math.max(...Object.values(counts)) - Math.min(...Object.values(counts))).toBeLessThanOrEqual(4)
  })

  it('removes unsupported exam certainty and stale high-risk statistics', () => {
    const banned = [
      'BOARD EXAM ALERT',
      'EVERY board exam',
      '50% of the body',
      '80% of cases',
      '20% of cases',
      '100% fatal',
      '99% 5-year',
      '27%',
      'license suspension',
      'same condition with different names',
    ]
    for (const phrase of banned) {
      expect(allText.toLowerCase()).not.toContain(phrase.toLowerCase())
    }
  })

  it('certifies the corrected high-risk concepts', () => {
    const byId = new Map(chapter9PremiumQuizQuestions.map((q) => [q.id, q]))

    expect(byId.get('q9-003')?.explanation).toContain('Blood flow supports nourishment')
    expect(byId.get('q9-015')?.explanation).toContain('does not by itself prove a specific diagnosis')
    expect(byId.get('q9-020')?.explanation).toContain('different conditions')
    expect(byId.get('q9-028')?.explanation).toContain('least common but most dangerous')
    expect(byId.get('q9-030')?.explanation).toContain('Medical diagnosis and treatment belong to qualified professionals')
  })

  it('keeps every answer key valid', () => {
    for (const q of chapter9PremiumQuizQuestions) {
      expect(['a', 'b', 'c', 'd']).toContain(q.correct_answer)
      const answer = q[`answer_${q.correct_answer}` as keyof typeof q]
      expect(typeof answer).toBe('string')
      expect((answer as string).trim().length).toBeGreaterThan(0)
    }
  })
})
