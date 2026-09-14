import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import QuizClient from './QuizClient'
import type { Quiz, QuizQuestion } from '@/types'

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null })
  const eq2 = vi.fn().mockReturnValue({ maybeSingle })
  const eq = vi.fn().mockReturnValue({ eq: eq2, maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const single = vi.fn().mockResolvedValue({ data: { id: 'attempt-ch2-1' }, error: null })
  const selectAfterInsert = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select: selectAfterInsert })
  const upsert = vi.fn().mockResolvedValue({ error: null })

  return {
    maybeSingle,
    eq2,
    eq,
    select,
    single,
    selectAfterInsert,
    insert,
    upsert,
    saveMissedQuestions: vi.fn().mockResolvedValue({ ok: true }),
    from: vi.fn().mockImplementation((table: string) => {
      if (table === 'quiz_attempts') return { insert }
      if (table === 'student_progress') return { select, upsert }
      return {}
    }),
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

const quiz: Quiz = {
  id: 'quiz-2',
  chapter_id: 'ch-2',
  title: 'Chapter 2 Quiz',
  description: 'Life Skills',
  is_active: true,
  passing_score: 80,
}

const question: QuizQuestion = {
  id: 'qq-2-001',
  quiz_id: 'quiz-2',
  question: 'Which response best demonstrates effective life skills?',
  answer_a: 'Correct response',
  answer_b: 'Incorrect response',
  answer_c: 'Another incorrect response',
  answer_d: 'Another incorrect response',
  correct_answer: 'a',
  explanation: 'Practice the targeted skill before reassessment.',
  difficulty: 'medium',
  order_index: 1,
}

function makeFiveQuestions(): QuizQuestion[] {
  return Array.from({ length: 5 }, (_, index) => ({
    ...question,
    id: `qq-2-pass-${index + 1}`,
    question: `Chapter 2 concept check ${index + 1}?`,
    order_index: index + 1,
  }))
}

describe('QuizClient Chapter 2 focused-review handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.spyOn(Math, 'random').mockReturnValue(0.99)

    const single = vi.fn().mockResolvedValue({ data: { id: 'attempt-ch2-1' }, error: null })
    const selectAfterInsert = vi.fn().mockReturnValue({ single })
    mocks.insert.mockReturnValue({ select: selectAfterInsert })
    mocks.upsert.mockResolvedValue({ error: null })
    mocks.saveMissedQuestions.mockResolvedValue({ ok: true })

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({
          success: true,
          cyclesCreated: 1,
          existingCyclesFound: 0,
          cycleIds: ['cycle-focus-123'],
          conceptsDetected: ['C-2-01'],
        }),
      })
    )
  })

  it('offers the newly created focus area directly from a failed Chapter 2 result', async () => {
    render(
      <QuizClient
        quiz={quiz}
        questions={[question]}
        chapterId="ch-2"
        chapterNumber={2}
        nextChapterNumber={3}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    fireEvent.click(screen.getByText(/B\./))
    fireEvent.click(screen.getByRole('button', { name: /Submit & Finish Quiz/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/remediation/detect',
        expect.objectContaining({ method: 'POST' })
      )
    })

    const focusLink = await screen.findByRole('link', { name: /Start Focused Review/i })
    expect(focusLink).toHaveAttribute('href', '/dashboard/remediation/cycle-focus-123')
    expect(screen.getByText(/A focused review is ready for you/i)).toBeInTheDocument()
  })

  it('keeps a detected concept gap visible even when the overall Chapter 2 score passes', async () => {
    const questions = makeFiveQuestions()

    render(
      <QuizClient
        quiz={quiz}
        questions={questions}
        chapterId="ch-2"
        chapterNumber={2}
        nextChapterNumber={3}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))

    for (let index = 0; index < questions.length; index++) {
      const answerLabel = index < 4 ? /A\./ : /B\./
      fireEvent.click(screen.getByText(answerLabel))
      fireEvent.click(
        screen.getByRole('button', {
          name: index === questions.length - 1 ? /Submit & Finish Quiz/i : /Submit Answer/i,
        })
      )
    }

    expect(await screen.findByText('80%')).toBeInTheDocument()
    expect(screen.getByText(/You passed, and there is still one area worth strengthening/i)).toBeInTheDocument()

    const focusLink = screen.getByRole('link', { name: /Review Focus Area/i })
    expect(focusLink).toHaveAttribute('href', '/dashboard/remediation/cycle-focus-123')
    expect(screen.getByRole('link', { name: /Continue to Chapter 3/i })).toHaveAttribute(
      'href',
      '/dashboard/chapters/3'
    )
  })
})
