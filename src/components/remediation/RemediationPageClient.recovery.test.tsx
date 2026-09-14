import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import RemediationPageClient from './RemediationPageClient'

const push = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push,
    refresh: vi.fn(),
  }),
}))

describe('RemediationPageClient recovery states', () => {
  const contentBundle = {
    conceptId: 'C-2-05' as const,
    conceptName: 'Positive Professional Attitude',
    contentBlocks: [],
    flashcards: [],
    hasSufficientMaterial: true,
    contentBlockCount: 0,
    flashcardCount: 0,
  }

  it('renders a usable pending-more-evidence state after reload even without transient outcome data', () => {
    render(
      <RemediationPageClient
        cycleId="cycle-1"
        studentState="pending_more_evidence"
        contentBundle={contentBundle}
        assignments={[]}
        progress={{ completed: 0, total: 0, percentage: 0 }}
      />,
    )

    expect(screen.getByText('Keep Practicing')).toBeInTheDocument()
    expect(screen.getByText(/previous knowledge check is saved/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Try Another Knowledge Check/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Return to Dashboard/i })).toBeInTheDocument()
  })

  it('Return to Dashboard actually navigates to the dashboard', () => {
    push.mockClear()

    render(
      <RemediationPageClient
        cycleId="cycle-1"
        studentState="successful"
        contentBundle={contentBundle}
        assignments={[]}
        progress={{ completed: 0, total: 0, percentage: 0 }}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /Return to Dashboard/i }))
    expect(push).toHaveBeenCalledWith('/dashboard')
  })
})
