/**
 * MISSED QUESTION BANK
 * ASCYN PRO / Barber Study Pro V2
 *
 * Utilities for storing, filtering, and retaking missed questions.
 */

import { MissedQuestion, QuizQuestion } from '@/types'

const STORAGE_KEY = 'ascyn_missed_questions'

export interface FilterOptions {
  chapterNumber?: number
  category?: string
  search?: string
}

export function loadMissedQuestions(userId: string): MissedQuestion[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`)
    if (!raw) return []
    return JSON.parse(raw) as MissedQuestion[]
  } catch {
    return []
  }
}

export function saveMissedQuestions(userId: string, questions: MissedQuestion[]): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(questions))
  } catch {
    // Ignore storage errors
  }
}

export function filterMissedQuestions(
  questions: MissedQuestion[],
  options: FilterOptions
): MissedQuestion[] {
  return questions.filter((q) => {
    if (options.chapterNumber !== undefined && q.chapterNumber !== options.chapterNumber) {
      return false
    }
    if (options.category && q.category !== options.category) {
      return false
    }
    if (options.search) {
      const term = options.search.toLowerCase()
      const match =
        q.question.toLowerCase().includes(term) ||
        q.category.toLowerCase().includes(term) ||
        q.correctAnswer.toLowerCase().includes(term)
      if (!match) return false
    }
    return true
  })
}

export function getUniqueCategories(questions: MissedQuestion[]): string[] {
  return Array.from(new Set(questions.map((q) => q.category))).sort()
}

export function getUniqueChapters(
  questions: MissedQuestion[]
): { number: number; title: string }[] {
  const map = new Map<number, string>()
  for (const q of questions) {
    if (!map.has(q.chapterNumber)) {
      map.set(q.chapterNumber, `Chapter ${q.chapterNumber}`)
    }
  }
  return Array.from(map.entries())
    .map(([number]) => ({ number, title: `Chapter ${number}` }))
    .sort((a, b) => a.number - b.number)
}

export function markMissedQuestionRetaken(
  questions: MissedQuestion[],
  questionId: string
): MissedQuestion[] {
  return questions.map((q) => {
    if (q.questionId === questionId) {
      return { ...q, retakenAt: new Date().toISOString() }
    }
    return q
  })
}

export function missedQuestionToQuizQuestion(missed: MissedQuestion): QuizQuestion {
  return {
    id: missed.questionId,
    quiz_id: missed.quizId,
    question: missed.question,
    answer_a: missed.correctAnswer,
    answer_b: missed.studentAnswer,
    answer_c: 'Option C',
    answer_d: 'Option D',
    correct_answer: 'a',
    explanation: missed.explanation,
    difficulty: 'medium',
    order_index: 1,
  }
}

export function buildWeakAreaQuiz(
  missedQuestions: MissedQuestion[],
  limit = 20
): QuizQuestion[] {
  return missedQuestions.slice(0, limit).map((m, idx) => ({
    id: `weak-${m.questionId}`,
    quiz_id: `weak-area-quiz`,
    question: m.question,
    answer_a: m.correctAnswer,
    answer_b: m.studentAnswer,
    answer_c: 'Neither',
    answer_d: 'Both',
    correct_answer: 'a',
    explanation: m.explanation,
    difficulty: 'medium',
    order_index: idx + 1,
  }))
}
