/**
 * ASCYN PRO — Chapter 20 RemediationPanel Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RemediationPanel from './RemediationPanel'
import { chapter20PremiumContent } from '@/lib/chapter-20-premium-content'

describe('RemediationPanel — Chapter 20', () => {
  const remediation = chapter20PremiumContent.remediation ?? []
  const competencies = chapter20PremiumContent.competencies ?? []
  const theme = chapter20PremiumContent.theme
  const missedQuestionIds = ['qq-20-01', 'qq-20-04', 'qq-20-07']

  it('renders nothing when missed questions do not match any remediation paths', () => {
    const { container } = render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={['qq-99-01']}
        chapterNumber={20}
        theme={theme}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders all remediation as a review guide when no missed questions are provided', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        chapterNumber={20}
        theme={theme}
      />
    )
    expect(screen.getByText('Remediation Review')).toBeInTheDocument()
    for (const c of competencies) {
      expect(screen.getByText(c.title)).toBeInTheDocument()
    }
  })

  it('renders remediation for missed questions', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={20}
        theme={theme}
      />
    )

    expect(screen.getByText('Remediation Review')).toBeInTheDocument()
    expect(screen.getByText('Transition from School to Work')).toBeInTheDocument()
    expect(screen.getByText('Habits of a Good Barbershop Team Player')).toBeInTheDocument()
    expect(screen.getByText('Employment Classifications and Compensation')).toBeInTheDocument()
  })

  it('shows coaching guidance for each weak competency', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={20}
        theme={theme}
      />
    )

    expect(screen.getAllByText('Coaching Guidance').length).toBeGreaterThan(0)
    expect(screen.getByText(/Review the differences between school culture/i)).toBeInTheDocument()
  })

  it('shows lesson recommendations and flashcard counts', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={20}
        theme={theme}
      />
    )

    expect(screen.getAllByText('Recommended Review').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Suggested Flashcards').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/10 flashcards to study/i).length).toBeGreaterThan(0)
  })

  it('links back to the chapter review page', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={20}
        theme={theme}
      />
    )

    const reviewLink = screen.getByRole('link', { name: /Review Chapter/i })
    expect(reviewLink).toHaveAttribute('href', '/dashboard/chapters/20')
  })

  it('calls onRetryQuiz when retake button is clicked', () => {
    const onRetryQuiz = vi.fn()
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={20}
        theme={theme}
        onRetryQuiz={onRetryQuiz}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }))
    expect(onRetryQuiz).toHaveBeenCalledTimes(1)
  })
})
