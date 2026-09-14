import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import RemediationOutcome from './RemediationOutcome'

describe('RemediationOutcome successful state', () => {
  it('describes concept-level recovery without claiming overall readiness mastery', () => {
    render(
      <RemediationOutcome
        isCorrect={true}
        outcome="successful"
        studentState="successful"
      />
    )

    // Exact badge text — a substring match also hits the "strong understanding
    // of this topic" sentence in the message body.
    expect(screen.getByText('Strong Understanding')).toBeInTheDocument()
    expect(screen.getByText(/strong understanding in this focus area/i)).toBeInTheDocument()
    expect(screen.queryByText(/overall progress shows mastery/i)).not.toBeInTheDocument()
  })

  it('keeps restored terminal success messaging scoped to the resolved focus area', () => {
    render(
      <RemediationOutcome
        isCorrect={null}
        outcome="successful"
        studentState="successful"
      />
    )

    expect(screen.getByText(/this focus area is now resolved/i)).toBeInTheDocument()
  })
})
