/**
 * QuizClient Chapter 3 Focused-Review Handoff (C3-2)
 *
 * Component coverage for the Chapter 3 detection handoff through the generic
 * pipeline:
 *   - fail overall + concept gap → focused review is the primary action
 *   - pass overall + concept gap → focus area stays visible alongside continue
 *   - detection failure remains non-blocking to quiz completion
 *   - the handoff POST carries chapterId 'ch-3' + the exact persisted attempt
 *     ID (deterministic binding) and Chapter 3 concept attribution is rendered
 */

import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import QuizClient from './QuizClient'
import type { Quiz, QuizQuestion } from '@/types'

const mocks = vi.hoisted(() => {
  const maybeSingle = vi.fn().mockResolvedValue({ data: null })
  const eq2 = vi.fn().mockReturnValue({ maybeSingle })
  const eq = vi.fn().mockReturnValue({ eq: eq2, maybeSingle })
  const select = vi.fn().mockReturnValue({ eq })
  const single = vi.fn().mockResolvedValue({ data: { id: 'attempt-ch3-1' }, error: null })
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
  id: 'quiz-3',
  chapter_id: 'ch-3',
  title: 'Chapter 3 Quiz',
  description: 'Professional Image',
  is_active: true,
  passing_score: 80,
}

const question: QuizQuestion = {
  id: 'qq-3-001',
  quiz_id: 'quiz-3',
  question: 'Which habit best supports a healthful daily routine?',
  answer_a: 'Correct response',
  answer_b: 'Incorrect response',
  answer_c: 'Another incorrect response',
  answer_d: 'Another incorrect response',
  correct_answer: 'a',
  explanation: 'Build the habit into your daily routine.',
  difficulty: 'easy',
  order_index: 1,
}

function makeFiveQuestions(): QuizQuestion[] {
  return Array.from({ length: 5 }, (_, index) => ({
    ...question,
    id: `qq-3-pass-${index + 1}`,
    question: `Chapter 3 concept check ${index + 1}?`,
    order_index: index + 1,
  }))
}

describe('QuizClient Chapter 3 focused-review handoff', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.spyOn(Math, 'random').mockReturnValue(0.99)

    const single = vi.fn().mockResolvedValue({ data: { id: 'attempt-ch3-1' }, error: null })
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
          cycleIds: ['cycle-ch3-focus-1'],
          conceptsDetected: ['ch3-healthful-habits'],
        }),
      })
    )
  })

  it('offers the newly created focus area directly from a failed Chapter 3 result', async () => {
    render(
      <QuizClient
        quiz={quiz}
        questions={[question]}
        chapterId="ch-3"
        chapterNumber={3}
        nextChapterNumber={4}
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
    expect(focusLink).toHaveAttribute('href', '/dashboard/remediation/cycle-ch3-focus-1')
    expect(screen.getByText(/A focused review is ready for you/i)).toBeInTheDocument()
  })

  it('keeps a detected concept gap visible even when the overall Chapter 3 score passes', async () => {
    const questions = makeFiveQuestions()

    render(
      <QuizClient
        quiz={quiz}
        questions={questions}
        chapterId="ch-3"
        chapterNumber={3}
        nextChapterNumber={4}
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
    expect(focusLink).toHaveAttribute('href', '/dashboard/remediation/cycle-ch3-focus-1')
    expect(screen.getByRole('link', { name: /Continue to Chapter 4/i })).toHaveAttribute(
      'href',
      '/dashboard/chapters/4'
    )
  })

  it('posts the Chapter 3 chapter ID and exact persisted attempt ID to the detection endpoint', async () => {
    render(
      <QuizClient
        quiz={quiz}
        questions={[question]}
        chapterId="ch-3"
        chapterNumber={3}
        nextChapterNumber={4}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    fireEvent.click(screen.getByText(/A\./))
    fireEvent.click(screen.getByRole('button', { name: /Submit & Finish Quiz/i }))

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/remediation/detect',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ chapterId: 'ch-3', quizAttemptId: 'attempt-ch3-1' }),
        })
      )
    })
  })

  it('completes the quiz normally when detection orchestration fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('network down'))
    )

    render(
      <QuizClient
        quiz={quiz}
        questions={[question]}
        chapterId="ch-3"
        chapterNumber={3}
        nextChapterNumber={4}
        userId="user-1"
        bestAttempt={null}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Start Quiz/i }))
    fireEvent.click(screen.getByText(/A\./))
    fireEvent.click(screen.getByRole('button', { name: /Submit & Finish Quiz/i }))

    // Detection failure must not block or corrupt quiz completion.
    expect(await screen.findByText('100%')).toBeInTheDocument()
    expect(screen.getByText(/Quiz Passed!/i)).toBeInTheDocument()
    expect(
      screen.queryByRole('link', { name: /Review Focus Area|Start Focused Review/i })
    ).not.toBeInTheDocument()
  })
})
