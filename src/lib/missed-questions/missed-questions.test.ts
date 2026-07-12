import { describe, it, expect, vi } from 'vitest'

// Mock Supabase before importing the module so the singleton is not created.
vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({ eq: vi.fn(() => ({ order: vi.fn() })) })),
      upsert: vi.fn(() => ({ error: null })),
      update: vi.fn(() => ({ eq: vi.fn(() => ({ eq: vi.fn(() => ({ error: null })) })) })),
    })),
  },
}))

vi.mock('@/lib/demo-helpers', () => ({
  isSupabaseConfigured: vi.fn(() => true),
}))

import {
  filterMissedQuestions,
  getUniqueCategories,
  getUniqueChapters,
  buildWeakAreaQuiz,
} from './index'
import type { MissedQuestion } from '@/types'

describe('missed-questions helpers', () => {
  const sampleQuestions: MissedQuestion[] = [
    {
      id: '1',
      userId: 'u1',
      questionId: 'q1',
      quizId: 'quiz-16',
      question: 'What is the primary goal of a consultation?',
      correctAnswer: 'A. Confirm client goals',
      studentAnswer: 'B. Start cutting immediately',
      explanation: 'Consultations set expectations.',
      chapterId: 'ch-16',
      chapterNumber: 16,
      category: 'State Board Prep',
      missedAt: '2026-07-12T10:00:00Z',
      retakenAt: null,
      timesMissed: 1,
    },
    {
      id: '2',
      userId: 'u1',
      questionId: 'q2',
      quizId: 'quiz-17',
      question: 'What is a key shop management principle?',
      correctAnswer: 'A. Track inventory',
      studentAnswer: 'B. Ignore expenses',
      explanation: 'Inventory tracking prevents waste.',
      chapterId: 'ch-17',
      chapterNumber: 17,
      category: 'Barbershop Management',
      missedAt: '2026-07-12T11:00:00Z',
      retakenAt: null,
      timesMissed: 2,
    },
  ]

  it('filters by chapter number', () => {
    const result = filterMissedQuestions(sampleQuestions, { chapterNumber: 17 })
    expect(result).toHaveLength(1)
    expect(result[0].questionId).toBe('q2')
  })

  it('filters by category', () => {
    const result = filterMissedQuestions(sampleQuestions, { category: 'State Board Prep' })
    expect(result).toHaveLength(1)
    expect(result[0].questionId).toBe('q1')
  })

  it('filters by search term', () => {
    const result = filterMissedQuestions(sampleQuestions, { search: 'consultation' })
    expect(result).toHaveLength(1)
    expect(result[0].questionId).toBe('q1')
  })

  it('returns unique categories sorted', () => {
    const result = getUniqueCategories(sampleQuestions)
    expect(result).toEqual(['Barbershop Management', 'State Board Prep'])
  })

  it('returns unique chapters sorted', () => {
    const result = getUniqueChapters(sampleQuestions)
    expect(result).toEqual([
      { number: 16, title: 'Chapter 16' },
      { number: 17, title: 'Chapter 17' },
    ])
  })

  it('builds weak-area quiz from missed questions', () => {
    const quiz = buildWeakAreaQuiz(sampleQuestions, 20)
    expect(quiz).toHaveLength(2)
    expect(quiz[0].id).toBe('weak-q1')
    expect(quiz[0].correct_answer).toBe('a')
    expect(quiz[0].answer_a).toBe(sampleQuestions[0].correctAnswer)
    expect(quiz[0].answer_b).toBe(sampleQuestions[0].studentAnswer)
  })
})
