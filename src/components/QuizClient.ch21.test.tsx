/**
 * ASCYN PRO — Chapter 21 QuizClient Tests
 *
 * Validates quiz flow using the actual chapter 21 premium question bank:
 * loading, navigation, scoring, explanations, passing, and retake behavior.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuizClient from './QuizClient'
import { chapter21PremiumQuizQuestions } from '@/lib/chapter-21-premium-quiz'
import type { Quiz, QuizAttempt } from '@/types'

const quiz: Quiz = {
  id: 'quiz-21',
  chapter_id: 'ch-21',
  title: 'Chapter 21 Quiz',
  description: 'Test your knowledge of the business of barbering.',
  is_active: true,
  passing_score: 80,
}

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null })
  const eq2 = vi.fn().mockReturnValue({ maybeSingle })
  const eq = vi.fn().mockReturnValue({ eq: eq2, maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  
  // Mock for quiz_attempts insert with .select('id').single() chain
  const single = vi.fn().mockResolvedValue({ data: { id: 'mock-attempt-id-123' }, error: null })
  const selectAfterInsert = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select: selectAfterInsert })
  
  const upsert = vi.fn().mockResolvedValue({ error: null })

  return {
    insert,
    select,
    eq,
    eq2,
    maybeSingle,
    upsert,
    single,
    selectAfterInsert,
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
      questions={chapter21PremiumQuizQuestions}
      chapterId="ch-21"
      chapterNumber={21}
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

  for (let i = 0; i < chapter21PremiumQuizQuestions.length; i++) {
    const question = chapter21PremiumQuizQuestions[i]
    const isCorrect = answerCorrectly[i] ?? true
    const answerKey = isCorrect ? question.correct_answer : getWrongAnswerKey(question.correct_answer)

    clickOption(answerKey)
    const isLast = i === chapter21PremiumQuizQuestions.length - 1
    fireEvent.click(
      screen.getByRole('button', { name: isLast ? /Submit & Finish Quiz/i : /Submit Answer/i })
    )
  }

  await waitFor(() => {
    expect(mocks.insert).toHaveBeenCalled()
  })
}

describe('QuizClient — chapter 21', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    mockShuffleDeterministic()
    // Reset the insert mock to support .select('id').single() chain
    const single = vi.fn().mockResolvedValue({ data: { id: 'mock-attempt-id-123' }, error: null })
    const selectAfterInsert = vi.fn().mockReturnValue({ single })
    mocks.insert.mockReturnValue({ select: selectAfterInsert })
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

  it('does not display explanations or correctness during the attempt', () => {
    renderQuiz()
    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    const firstQuestion = chapter21PremiumQuizQuestions[0]
    clickOption(firstQuestion.correct_answer)
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))

    // End-of-quiz feedback: no explanation or correctness reveal mid-quiz.
    expect(screen.queryByText(/Explanation/i)).not.toBeInTheDocument()
    expect(screen.queryByText(firstQuestion.explanation!)).not.toBeInTheDocument()
    expect(screen.queryByText(/Score:/i)).not.toBeInTheDocument()
  })

  it('displays explanations in the end-of-quiz answer review', async () => {
    const answers = Array(17).fill(true)
    await completeQuiz(answers)

    expect(await screen.findByText(/Answer Review \(17 questions\)/i, {}, { timeout: 2000 })).toBeInTheDocument()
    expect(screen.getByText(chapter21PremiumQuizQuestions[0].explanation!)).toBeInTheDocument()
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
          quiz_id: 'quiz-21',
          total_questions: 17,
        })
      )
    })
  })

  it('preserves the best score across attempts', async () => {
    const bestAttempt: QuizAttempt = {
      id: 'attempt-1',
      user_id: 'user-1',
      quiz_id: 'quiz-21',
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

    for (let i = 0; i < chapter21PremiumQuizQuestions.length; i++) {
      const question = chapter21PremiumQuizQuestions[i]
      clickOption(getWrongAnswerKey(question.correct_answer))
      const isLast = i === chapter21PremiumQuizQuestions.length - 1
      fireEvent.click(
        screen.getByRole('button', { name: isLast ? /Submit & Finish Quiz/i : /Submit Answer/i })
      )
    }

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

    for (let i = 0; i < chapter21PremiumQuizQuestions.length; i++) {
      const question = chapter21PremiumQuizQuestions[i]
      clickOption(question.correct_answer)
      const isLast = i === chapter21PremiumQuizQuestions.length - 1
      fireEvent.click(
        screen.getByRole('button', { name: isLast ? /Submit & Finish Quiz/i : /Submit Answer/i })
      )
    }

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Return to Dashboard/i })).toHaveAttribute('href', '/dashboard')
    })
  })
})
