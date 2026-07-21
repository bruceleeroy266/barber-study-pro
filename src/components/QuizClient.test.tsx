import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import QuizClient from './QuizClient'
import type { Quiz, QuizQuestion, QuizAttempt } from '@/types'

const sampleQuestions: QuizQuestion[] = [
  {
    id: 'q-1',
    quiz_id: 'quiz-1',
    question: 'What is the capital of France?',
    answer_a: 'London',
    answer_b: 'Paris',
    answer_c: 'Berlin',
    answer_d: 'Madrid',
    correct_answer: 'b',
    explanation: 'Paris is the capital of France.',
    difficulty: 'easy',
    order_index: 1,
  },
  {
    id: 'q-2',
    quiz_id: 'quiz-1',
    question: 'What is 2 + 2?',
    answer_a: '3',
    answer_b: '4',
    answer_c: '5',
    answer_d: '6',
    correct_answer: 'b',
    explanation: 'Two plus two equals four.',
    difficulty: 'easy',
    order_index: 2,
  },
]

const quiz: Quiz = {
  id: 'quiz-1',
  chapter_id: 'ch-1',
  title: 'Chapter 1 Quiz',
  description: 'Test your knowledge.',
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
  // Make shuffle a no-op so option labels match original keys.
  vi.spyOn(Math, 'random').mockReturnValue(0.99)
}

function renderQuiz(props?: { nextChapterNumber?: number | null; bestAttempt?: QuizAttempt | null }) {
  return render(
    <QuizClient
      quiz={quiz}
      questions={sampleQuestions}
      chapterId="ch-1"
      chapterNumber={1}
      nextChapterNumber={props?.nextChapterNumber ?? 2}
      userId="user-1"
      bestAttempt={props?.bestAttempt ?? null}
    />
  )
}

async function completeQuiz(correctCount: number) {
  renderQuiz()

  fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

  for (let i = 0; i < sampleQuestions.length; i++) {
    const isCorrect = i < correctCount
    const question = sampleQuestions[i]
    const correctOption = question.correct_answer
    const wrongOption = Object.keys({ a: '', b: '', c: '', d: '' }).find((k) => k !== correctOption) as string
    const answerKey = isCorrect ? correctOption : wrongOption

    fireEvent.click(screen.getByText(new RegExp(`${answerKey.toUpperCase()}\\.`)))
    fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))

    if (i < sampleQuestions.length - 1) {
      fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
    }
  }

  fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

  await waitFor(() => {
    expect(mocks.insert).toHaveBeenCalled()
  })
}

describe('QuizClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    mockShuffleDeterministic()
    mocks.insert.mockResolvedValue({ error: null })
    mocks.upsert.mockResolvedValue({ error: null })
    mocks.saveMissedQuestions.mockResolvedValue({ ok: true })
  })

  it('shows the textbook notice and 80% passing score before the quiz starts', () => {
    renderQuiz()
    expect(screen.getByText(/Some questions may require information from your assigned textbook/i)).toBeInTheDocument()
    expect(screen.getByText(/Passing: 80%/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start Quiz/i })).toBeInTheDocument()
  })

  it('shows the failing guidance and primary retake action when score is below 80%', async () => {
    await completeQuiz(0)

    await waitFor(() => {
      expect(screen.getByText(/Review the flashcards and the corresponding textbook chapter, then retake the quiz/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Review and Retake Quiz/i })).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /Continue to Chapter/i })).not.toBeInTheDocument()
    })
  })

  it('shows the passing guidance when score is exactly 80%', async () => {
    const fiveQuestions: QuizQuestion[] = Array.from({ length: 5 }, (_, i) => ({
      ...sampleQuestions[0],
      id: `q-${i + 1}`,
      question: `Question ${i + 1}?`,
      answer_a: 'Wrong',
      answer_b: 'Correct',
      answer_c: 'Wrong',
      answer_d: 'Wrong',
      correct_answer: 'b',
    }))

    render(
      <QuizClient
        quiz={quiz}
        questions={fiveQuestions}
        chapterId="ch-1"
        chapterNumber={1}
        nextChapterNumber={2}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    for (let i = 0; i < fiveQuestions.length; i++) {
      // Answer first 4 correctly, last one incorrectly to get 4/5 = 80%.
      const isCorrect = i < 4
      const answerKey = isCorrect ? 'b' : 'a'
      fireEvent.click(screen.getByText(new RegExp(`${answerKey.toUpperCase()}\\.`)))
      fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))
      if (i < fiveQuestions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
      }
    }

    fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

    await waitFor(() => {
      expect(mocks.insert).toHaveBeenCalled()
    })

    expect(screen.getByText(/Quiz passed\. Review your missed questions/i)).toBeInTheDocument()
    expect(screen.getByText('80%')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Continue to Chapter 2/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Retake Quiz/i })).toBeInTheDocument()
  })

  it('shows the passing guidance when score is above 80%', async () => {
    await completeQuiz(2)

    expect(await screen.findByText(/Quiz passed. Review your missed questions/i, {}, { timeout: 2000 })).toBeInTheDocument()
    expect(await screen.findByRole('link', { name: /Continue to Chapter 2/i }, { timeout: 2000 })).toBeInTheDocument()
  })

  it('shows the missed-questions review link when questions were missed', async () => {
    await completeQuiz(1)

    expect(await screen.findByRole('link', { name: /Review Missed Questions/i }, { timeout: 2000 })).toBeInTheDocument()
  })

  it('offers optional retake after passing', async () => {
    await completeQuiz(2)

    expect(await screen.findByRole('button', { name: /Retake Quiz/i }, { timeout: 2000 })).toBeInTheDocument()
  })

  it('links to the next chapter when one exists', async () => {
    await completeQuiz(2)

    const link = await screen.findByRole('link', { name: /Continue to Chapter 2/i }, { timeout: 2000 })
    expect(link).toHaveAttribute('href', '/dashboard/chapters/2')
  })

  it('returns to dashboard on the final available chapter', async () => {
    render(
      <QuizClient
        quiz={quiz}
        questions={sampleQuestions}
        chapterId="ch-21"
        chapterNumber={21}
        nextChapterNumber={null}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    for (let i = 0; i < sampleQuestions.length; i++) {
      const question = sampleQuestions[i]
      fireEvent.click(screen.getByText(new RegExp(`${question.correct_answer.toUpperCase()}\\.`)))
      fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))
      if (i < sampleQuestions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
      }
    }

    fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /Return to Dashboard/i })).toHaveAttribute('href', '/dashboard')
    })
  })

  it('preserves the best score across attempts', async () => {
    const bestAttempt: QuizAttempt = {
      id: 'attempt-1',
      user_id: 'user-1',
      quiz_id: 'quiz-1',
      score: 2,
      total_questions: 2,
      percentage: 100,
      answers_json: {},
      completed_at: '2026-07-01T00:00:00Z',
    }

    renderQuiz({ bestAttempt })

    expect(screen.getByText(/Your Best Score/i)).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()

    // Complete with a lower score.
    fireEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }))
    for (let i = 0; i < sampleQuestions.length; i++) {
      const question = sampleQuestions[i]
      const wrongOption = Object.keys({ a: '', b: '', c: '', d: '' }).find((k) => k !== question.correct_answer) as string
      fireEvent.click(screen.getByText(new RegExp(`${wrongOption.toUpperCase()}\\.`)))
      fireEvent.click(screen.getByRole('button', { name: /Submit Answer/i }))
      if (i < sampleQuestions.length - 1) {
        fireEvent.click(screen.getByRole('button', { name: /Next Question/i }))
      }
    }
    fireEvent.click(screen.getByRole('button', { name: /Finish Quiz/i }))

    await waitFor(() => {
      // Upsert should keep the higher best score.
      expect(mocks.upsert).toHaveBeenCalledWith(
        expect.objectContaining({ best_quiz_score: 100 }),
        expect.anything()
      )
    })
  })

  it('creates exactly one quiz_attempts record per submission', async () => {
    await completeQuiz(2)

    await waitFor(() => {
      expect(mocks.insert).toHaveBeenCalledTimes(1)
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          user_id: 'user-1',
          quiz_id: 'quiz-1',
          total_questions: 2,
        })
      )
    })
  })
})
