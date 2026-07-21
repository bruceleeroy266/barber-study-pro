import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StudyRecommendations from './StudyRecommendations'
import { StudyRecommendation } from '@/types'

const sampleRecommendations: StudyRecommendation[] = [
  {
    id: 'rec-1',
    type: 'study',
    title: 'Review Chapter 3',
    description: 'Focus on infection control basics.',
    priority: 'high',
    estimatedMinutes: 15,
    chapterNumber: 3,
  },
  {
    id: 'rec-2',
    type: 'review',
    title: 'Missed Questions',
    description: 'Retest weak areas.',
    chapterNumber: null,
    priority: 'medium',
    estimatedMinutes: 20,
  },
]

describe('StudyRecommendations', () => {
  it('links to the student dashboard in student context', () => {
    render(<StudyRecommendations recommendations={sampleRecommendations} />)

    const chapterLink = screen.getByRole('link', { name: /Review Chapter 3/i })
    expect(chapterLink).toHaveAttribute('href', '/dashboard/chapters/3')

    const reviewLink = screen.getByRole('link', { name: /Missed Questions/i })
    expect(reviewLink).toHaveAttribute('href', '/dashboard/missed-questions')
  })

  it('remains instructor-scoped and does not link to the student dashboard', () => {
    render(
      <StudyRecommendations
        recommendations={sampleRecommendations}
        studentId="student-123"
        instructorView
      />
    )

    expect(screen.queryByRole('link', { name: /Review Chapter 3/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Missed Questions/i })).not.toBeInTheDocument()

    expect(screen.getByText('Review Chapter 3')).toBeInTheDocument()
    expect(screen.getByText('Missed Questions')).toBeInTheDocument()
  })

  it('renders empty state when no recommendations are provided', () => {
    render(<StudyRecommendations recommendations={[]} />)
    expect(screen.getByText('Complete a quiz to generate personalized study recommendations.')).toBeInTheDocument()
  })
})
