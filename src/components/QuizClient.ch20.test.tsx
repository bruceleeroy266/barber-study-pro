/**
 * ASCYN PRO — Chapter 20 QuizClient Tests
 *
 * Validates quiz flow using the actual Chapter 20 premium question bank:
 * loading, navigation, scoring, explanations, passing, and retake behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuizClient from './QuizClient'
import { chapter20PremiumQuizQuestions } from '@/lib/chapter-20-premium-quiz'
import type { Quiz, QuizAttempt } from '@/types'

const quiz: Quiz = {
  id: 'quiz-20',
  chapter_id: 'ch-20',
  title: 'Chapter 20 Quiz',
  description: 'Test your knowledge of working behind the chair.',
  is_active: true,
  passing_score: 80,
}

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null })
  const eq2 = vi.fn().mockReturnValue({ maybeSingle })
  const eq = vi.fn().mockReturnValue({ eq: eq2, maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const insert = vi.fn().mockResolvedValue({ error: null })
  const upsert = vi.fn().mockResolvedValue({ error: null })

  return {
    insert,
    select,
    eq,
    eq2,
    maybeSingle,
    upsert,
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'quiz_attempts') {
        return { insert }
      }
      if (table === 'student_progress') {
        return { select, upsert }
      }
      return {}
    }),
    saveMissedQuestions: vi.fn().mockResolvedValue({ ok: true }),
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null }) },
    from: mocks.from,
  },
}))

vi.mock('@/lib/missed-questions', () => ({
  saveMissedQuestions: mocks.saveMissedQuestions,
}))

vi.mock('@/lib/demo-helpers', () => ({
  isSupabaseConfigured: () => true,
}))

function mockShuffleDeterministic() {
  // A value near 1 makes Fisher-Yates keep every element in place,
  // so question order and option labels match the original keys.
  vi.spyOn(Math, 'random').mockReturnValue(0.9999)
}

function renderQuiz(props?: { nextChapterNumber?: number | null; bestAttempt?: QuizAttempt | null }) {
  return render(
    <QuizClient
      quiz={quiz}
      questions={chapter20PremiumQuizQuestions}
      chapterId="ch-20"
      chapterNumber={20}
      nextChapterNumber={props?.nextChapterNumber ?? null}
      userId="user-1"
      bestAttempt={props?.bestAttempt ?? null}
      remediation={[]}
      competencies={[]}
    />
  )
}

function getWrongAnswerKey(correct: string): string {
  return (['a', 'b', 'c', 'd'] as const).find((o) => o !== correct)!
}

function clickOption(key: string) {
  fireEvent.click(screen.getByRole('button', { name: new RegExp(`^${key.toUpperCase()}\\.`) }))
}

async function completeQuiz(answerCorrectly: boolean[]) {
  renderQuiz()

  fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

  for (let i = 0; i < chapter20PremiumQuizQuestions.length; i++) {
    const question = chapter20PremiumQuizQuestions[i]
    const isCorrect = answerCorrectly[i] ?? true
    const answerKey = isCorrect ? question.correct_answer : getWrongAnswerKey(question.correct_answer)

    clickOption(answerKey)
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))

    if (i < chapter20PremiumQuizQuestions.length - 1) {
      fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
    }
  }

  fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

  await waitFor(() => {
    expect(mocks.insert).toHaveBeenCalled()
  })
}

describe('QuizClient — Chapter 20', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    mockShuffleDeterministic()
    mocks.insert.mockResolvedValue({ error: null })
    mocks.upsert.mockResolvedValue({ error: null })
    mocks.saveMissedQuestions.mockResolvedValue({ ok: true })
  })

  it('loads all 17 questions', () => {
    renderQuiz()
    expect(screen.getByText(/17 questions/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Quiz/i })).toBeInTheDocument()
  })

  it('shows passing score of 80% before starting', () => {
    renderQuiz()
    expect(screen.getByText(/Passing: 80%/i)).toBeInTheDocument()
  })

  it('navigates through questions and displays explanations', () => {
    renderQuiz()
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    const firstQuestion = chapter20PremiumQuizQuestions[0]
    clickOption(firstQuestion.correct_answer)
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))

    expect(screen.getByText(/Explanation/i)).toBeInTheDocument()
    expect(screen.getByText(firstQuestion.explanation!)).toBeInTheDocument()
  })

  it('passes when 15 of 17 answers are correct (88%)', async () => {
    const answers = Array(17).fill(false)
    answers.fill(true, 0, 15)
    await completeQuiz(answers)

    expect(await screen.findByText('PASS', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText('88%')).toBeInTheDocument()
  })

  it('fails when fewer than 14 answers are correct', async () => {
    const answers = Array(17).fill(false)
    answers.fill(true, 0, 13)
    await completeQuiz(answers)

    expect(await screen.findByText(/Review the flashcards/i, {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Review and Retake Quiz/i })).toBeInTheDocument()
  })

  it('passes with 82% when 14 of 17 answers are correct', async () => {
    const answers = Array(17).fill(false)
    answers.fill(true, 0, 14)
    await completeQuiz(answers)

    expect(await screen.findByText('PASS', {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText('82%')).toBeInTheDocument()
  })

  it('offers retake after passing', async () => {
    const answers = Array(17).fill(true)
    await completeQuiz(answers)

    expect(await screen.findByRole('button', { name: /Retake Quiz/i }, { timeout: 2000 })).toBeInTheDocument()
  })

  it('creates exactly one quiz_attempts record per submission', async () => {
    const answers = Array(17).fill(true)
    await completeQuiz(answers)

    await waitFor(() => {
      expect(mocks.insert).toHaveBeenCalledTimes(1)
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          quiz_id: 'quiz-20',
          total_questions: 17,
        })
      )
    })
  })

  it('preserves the best score across attempts', async () => {
    const bestAttempt: QuizAttempt = {
      id: 'attempt-1',
      user_id: 'user-1',
      quiz_id: 'quiz-20',
      score: 17,
      total_questions: 17,
      percentage: 100,
      answers_json: {},
      completed_at: '2026-07-01T00:00:00Z',
    }

    renderQuiz({ bestAttempt })

    expect(screen.getByText(/Your Best Score/i)).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }))

    for (let i = 0; i < chapter20PremiumQuizQuestions.length; i++) {
      const question = chapter20PremiumQuizQuestions[i]
      clickOption(getWrongAnswerKey(question.correct_answer))
      fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))
      if (i < chapter20PremiumQuizQuestions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
      }
    }
    fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

    await waitFor(() => {
      expect(mocks.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ best_quiz_score: 100 }),
        expect.anything()
      )
    })
  })

  it('returns to dashboard on the final chapter when there is no next chapter', async () => {
    renderQuiz({ nextChapterNumber: null })

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    for (let i = 0; i < chapter20PremiumQuizQuestions.length; i++) {
      const question = chapter20PremiumQuizQuestions[i]
      clickOption(question.correct_answer)
      fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))
      if (i < chapter20PremiumQuizQuestions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
      }
    }
    fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Return to Dashboard/i })).toHaveAttribute('href', '/dashboard')
    })
  })
})
