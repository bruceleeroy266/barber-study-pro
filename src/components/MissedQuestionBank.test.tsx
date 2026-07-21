import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MissedQuestionBank from './MissedQuestionBank'
import type { MissedQuestion } from '@/types'

const question: MissedQuestion = {
  id: 'mq-1',
  userId: 'student-1',
  questionId: 'q-1',
  quizId: 'quiz-1',
  question: 'What is the primary muscle targeted by a basic haircut?',
  correctAnswer: 'The occipitalis',
  studentAnswer: 'The frontalis',
  explanation: 'The occipitalis is at the back of the skull.',
  chapterId: 'ch-1',
  chapterNumber: 1,
  category: 'Anatomy',
  missedAt: '2026-07-21T00:00:00Z',
  retakenAt: null,
  timesMissed: 2,
}

describe('MissedQuestionBank', () => {
  it('links to the student dashboard in student context', () => {
    render(<MissedQuestionBank questions={[question]} />)

    expect(screen.getByRole('link', { name: /Retest Weak Areas/i })).toHaveAttribute(
      'href',
      '/dashboard/missed-questions/retest'
    )

    fireEvent.click(screen.getByText(question.question))
    expect(screen.getByRole('link', { name: /Study Chapter 1/i })).toHaveAttribute(
      'href',
      '/dashboard/chapters/1'
    )
  })

  it('keeps the instructor in the portal and labels student-only actions', () => {
    render(<MissedQuestionBank questions={[question]} instructorView />)

    expect(screen.queryByRole('link', { name: /Retest Weak Areas/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Study Chapter 1/i })).not.toBeInTheDocument()

    expect(screen.getByText(/Retest Weak Areas \(student preview\)/i)).toBeInTheDocument()

    fireEvent.click(screen.getByText(question.question))
    expect(screen.getByText(/Study Chapter 1 \(student preview\)/i)).toBeInTheDocument()
  })
})
