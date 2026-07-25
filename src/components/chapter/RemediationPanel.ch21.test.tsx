/**
 * ASCYN PRO — Chapter 21 RemediationPanel Tests
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RemediationPanel from './RemediationPanel'
import { chapter21PremiumContent } from '@/lib/chapter-21-premium-content'

describe('RemediationPanel — Chapter 21', () => {
  const remediation = chapter21PremiumContent.remediation ?? []
  const competencies = chapter21PremiumContent.competencies ?? []
  const theme = chapter21PremiumContent.theme
  const missedQuestionIds = ['qq-21-01', 'qq-21-04', 'qq-21-07']

  it('renders nothing when missed questions do not match any remediation paths', () => {
    const { container } = render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={['qq-99-01']}
        chapterNumber={21}
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
        chapterNumber={21}
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
        chapterNumber={21}
        theme={theme}
      />
    )

    expect(screen.getByText('Remediation Review')).toBeInTheDocument()
    expect(screen.getByText('Paths Into Business and Opening Considerations')).toBeInTheDocument()
    expect(screen.getByText('Types of Barbershop Ownership')).toBeInTheDocument()
    expect(screen.getByText('Business Plan Components')).toBeInTheDocument()
  })

  it('shows coaching guidance for each weak competency', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={21}
        theme={theme}
      />
    )

    expect(screen.getAllByText('Coaching Guidance').length).toBeGreaterThan(0)
    expect(screen.getByText(/Review the two paths into business/i)).toBeInTheDocument()
  })

  it('shows lesson recommendations and flashcard counts', () => {
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={21}
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
        chapterNumber={21}
        theme={theme}
      />
    )

    const reviewLink = screen.getByRole('link', { name: /Review Chapter/i })
    expect(reviewLink).toHaveAttribute('href', '/dashboard/chapters/21')
  })

  it('calls onRetryQuiz when retake button is clicked', () => {
    const onRetryQuiz = vi.fn()
    render(
      <RemediationPanel
        remediation={remediation}
        competencies={competencies}
        missedQuestionIds={missedQuestionIds}
        chapterNumber={21}
        theme={theme}
        onRetryQuiz={onRetryQuiz}
      />
    )

    fireEvent.click(screen.getByRole('button', { name: /Retake Quiz/i }))
    expect(onRetryQuiz).toHaveBeenCalledTimes(1)
  })
})
