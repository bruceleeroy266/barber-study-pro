import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FormError } from './FormError'

describe('FormError', () => {
  it('announces, labels, and focuses newly rendered errors', () => {
    render(
      <FormError
        id="test-error"
        title="Submission failed"
        message="Please try again."
      />
    )

    const alert = screen.getByRole('alert')
    expect(alert).toHaveAttribute('id', 'test-error')
    expect(alert).toHaveAttribute('aria-live', 'assertive')
    expect(alert).toHaveTextContent('Submission failed')
    expect(alert).toHaveTextContent('Please try again.')
    expect(alert).toHaveFocus()
  })
})
