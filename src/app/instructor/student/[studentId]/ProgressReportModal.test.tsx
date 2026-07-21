import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react'
import ProgressReportModal from './ProgressReportModal'
import type { Profile, StudentProgress, QuizAttempt } from '@/types'

const student: Profile = {
  id: 'student-1',
  email: 'student@ascyn-smoke.test',
  full_name: 'Smoke Test Student',
  role: 'student',
  school_id: 'school-1',
  approval_status: 'approved',
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  is_disabled: false,
  approved_by: null,
  approved_at: null,
  requires_password_change: false,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

describe('ProgressReportModal', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    cleanup()
  })

  function renderModal(props?: { lastActivityAt?: string | null }) {
    return render(
      <ProgressReportModal
        student={student}
        lastActivityAt={props?.lastActivityAt ?? null}
        overallProgress={75}
        avgQuizScore={80}
        readiness={{ label: 'Almost Ready', score: 78 }}
        boardRisk={{ label: 'Moderate Risk' }}
        chapters={[{ id: 'ch-1', chapter_number: 1, title: 'History' }]}
        progressRecords={[
          {
            id: 'p-1',
            user_id: student.id,
            chapter_id: 'ch-1',
            flashcards_completed: true,
            quiz_completed: true,
            best_quiz_score: 83,
            progress_percentage: 100,
            last_studied_at: '2026-07-21T00:00:00Z',
            updated_at: '2026-07-21T00:00:00Z',
          } as StudentProgress,
        ]}
        attemptRecords={[
          {
            id: 'a-1',
            user_id: student.id,
            quiz_id: 'quiz-1',
            score: 25,
            total_questions: 30,
            percentage: 83,
            answers_json: {},
            completed_at: '2026-07-21T00:00:00Z',
            created_at: '2026-07-21T00:00:00Z',
          } as QuizAttempt,
        ]}
        hasEnoughQuizData
        weakAreas={[]}
        noteRecords={[]}
      />
    )
  }

  it('displays the canonical student identity from the profile', async () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /View Progress Report/i }))

    expect(await screen.findByText(/Generated/)).toBeInTheDocument()

    expect(screen.getByText(student.full_name)).toBeInTheDocument()
    expect(screen.getByText(student.email)).toBeInTheDocument()
  })

  it('opens and closes via the X button', async () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /View Progress Report/i }))

    expect(await screen.findByText(/Generated/)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close'))
    await waitFor(() => expect(screen.queryByText(/Generated/)).not.toBeInTheDocument())
  })

  it('closes when Escape is pressed', async () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /View Progress Report/i }))

    expect(await screen.findByText(/Generated/)).toBeInTheDocument()

    fireEvent.keyDown(document, { key: 'Escape' })
    await waitFor(() => expect(screen.queryByText(/Generated/)).not.toBeInTheDocument())
  })

  it('closes when the backdrop is clicked', async () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: /View Progress Report/i }))

    expect(await screen.findByText(/Generated/)).toBeInTheDocument()

    const backdrop = document.querySelector('[role="presentation"]')
    fireEvent.click(backdrop!)
    await waitFor(() => expect(screen.queryByText(/Generated/)).not.toBeInTheDocument())
  })

  it('returns focus to the open button after closing', async () => {
    renderModal()
    const openButton = screen.getByRole('button', { name: /View Progress Report/i })
    openButton.focus()

    fireEvent.click(openButton)
    expect(await screen.findByText(/Generated/)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText('Close'))
    await waitFor(() => expect(screen.queryByText(/Generated/)).not.toBeInTheDocument())

    expect(document.activeElement).toBe(openButton)
  })
})
