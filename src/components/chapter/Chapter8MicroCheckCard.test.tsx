import { useState } from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import Chapter8MicroCheckCard from './Chapter8MicroCheckCard'
import { chapter8PremiumTheme } from '@/lib/chapter-8-premium'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import type { Chapter8MicroCheckAttemptRow } from '@/lib/chapter-8-concepts/micro-check-persistence'

const mocks = vi.hoisted(() => {
  const single = vi.fn()
  const select = vi.fn().mockReturnValue({ single })
  const insert = vi.fn().mockReturnValue({ select })
  const maybeSingle = vi.fn()
  const eqQuestion = vi.fn().mockReturnValue({ maybeSingle })
  const eqChapter = vi.fn().mockReturnValue({ eq: eqQuestion })
  const eqUser = vi.fn().mockReturnValue({ eq: eqChapter })
  const selectExisting = vi.fn().mockReturnValue({ eq: eqUser })

  return {
    single,
    select,
    insert,
    maybeSingle,
    eqQuestion,
    eqChapter,
    eqUser,
    selectExisting,
  }
})

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: mocks.insert,
      select: mocks.selectExisting,
    })),
  },
}))

function Harness() {
  const [attempts, setAttempts] = useState<Chapter8MicroCheckAttemptRow[]>([])
  return (
    <Chapter8MicroCheckCard
      check={chapter8MicroChecks[0]}
      userId="student-8"
      theme={chapter8PremiumTheme}
      attempts={attempts}
      onAttemptPersisted={(row) => setAttempts((previous) => [...previous, row])}
    />
  )
}

describe('C8-6 Chapter 8 micro-check UI/persistence regression', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.insert.mockReturnValue({ select: mocks.select })
    mocks.select.mockReturnValue({ single: mocks.single })
    mocks.single.mockResolvedValue({
      data: {
        id: 'attempt-1',
        user_id: 'student-8',
        chapter_id: 'ch-8',
        check_id: 'mc-8-01',
        question_id: 'mcq-8-001',
        concept_id: 'ch8-electricity-circuits',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: true,
        answered_at: '2026-09-26T15:10:00.000Z',
        created_at: '2026-09-26T15:10:00.000Z',
      },
      error: null,
    })
  })

  it('renders a Chapter 8 lesson micro-check, persists the first attempt, and locks the saved evidence into the UI', async () => {
    render(<Harness />)

    expect(screen.getByRole('heading', { name: 'Circuit Safety Check' })).toBeInTheDocument()
    expect(screen.getByText('0 of 2 first-attempt answers recorded')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /a\.The complete path for current has been interrupted/i }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Lock First Attempt' })[0])

    await waitFor(() => {
      expect(mocks.insert).toHaveBeenCalledWith({
        user_id: 'student-8',
        chapter_id: 'ch-8',
        check_id: 'mc-8-01',
        question_id: 'mcq-8-001',
        concept_id: 'ch8-electricity-circuits',
        difficulty: 'application',
        selected_answer: 'a',
        is_correct: true,
        answered_at: expect.any(String),
      })
    })

    await waitFor(() => {
      expect(screen.getByText('1 of 2 first-attempt answers recorded')).toBeInTheDocument()
      expect(screen.getByText('✓ Correct')).toBeInTheDocument()
    })

    const savedChoice = screen.getByRole('button', { name: /a\.The complete path for current has been interrupted/i })
    expect(savedChoice).toBeDisabled()
    expect(screen.getAllByRole('button', { name: 'Lock First Attempt' })).toHaveLength(1)
  })
})
