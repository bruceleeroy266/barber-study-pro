import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import QuizApprovalQueueClient, { type QuizApprovalRequestRow } from './QuizApprovalQueueClient'

const requests: QuizApprovalRequestRow[] = [
  {
    id: 'r1',
    studentId: 's1',
    studentName: 'Alex Barber',
    quizId: 'quiz-7',
    chapterId: 'ch-7',
    status: 'pending',
    requestedAt: '2026-09-26T00:00:00.000Z',
    programIds: ['p1'],
    readiness: { ready: true },
  },
  {
    id: 'r2',
    studentId: 's2',
    studentName: 'Jordan Cosmo',
    quizId: 'quiz-10',
    chapterId: 'ch-10',
    status: 'pending',
    requestedAt: '2026-09-26T00:01:00.000Z',
    programIds: ['p2'],
    readiness: { ready: false },
  },
]

describe('QuizApprovalQueueClient filters', () => {
  it('filters by chapter, class/program, and student', () => {
    render(
      <QuizApprovalQueueClient
        requests={requests}
        chapters={[
          { id: 'ch-7', number: 7, title: 'Basics' },
          { id: 'ch-10', number: 10, title: 'Hair and Scalp' },
        ]}
        programs={[
          { id: 'p1', name: 'Barbering' },
          { id: 'p2', name: 'Cosmetology' },
        ]}
        students={[
          { id: 's1', name: 'Alex Barber' },
          { id: 's2', name: 'Jordan Cosmo' },
        ]}
      />
    )

    fireEvent.change(screen.getByLabelText('Filter by chapter'), { target: { value: 'ch-7' } })
    expect(screen.getByText('Alex Barber')).toBeInTheDocument()
    expect(screen.queryByText('Jordan Cosmo')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Approve all filtered pending \(1\)/ })).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Filter by chapter'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Filter by class or program'), { target: { value: 'p2' } })
    expect(screen.getByText('Jordan Cosmo')).toBeInTheDocument()
    expect(screen.queryByText('Alex Barber')).not.toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Filter by class or program'), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText('Filter by student'), { target: { value: 's1' } })
    expect(screen.getByText('Alex Barber')).toBeInTheDocument()
    expect(screen.queryByText('Jordan Cosmo')).not.toBeInTheDocument()
  })
})
