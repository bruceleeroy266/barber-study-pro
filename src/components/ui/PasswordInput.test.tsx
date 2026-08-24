import type React from 'react'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import { PasswordInput } from './PasswordInput'

describe('PasswordInput', () => {
  it('reveals and hides the password without changing its value', () => {
    render(<PasswordInput id="password" aria-label="Password" defaultValue="keep-me-secret" />)
    const input = screen.getByLabelText('Password')

    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveAttribute('spellcheck', 'false')
    expect(input).toHaveAttribute('autocapitalize', 'none')
    expect(input).toHaveAttribute('autocorrect', 'off')
    expect(input).toHaveValue('keep-me-secret')

    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(input).toHaveAttribute('type', 'text')
    expect(input).toHaveValue('keep-me-secret')
    expect(screen.getByRole('button', { name: 'Hide password' })).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(input).toHaveAttribute('type', 'password')
    expect(input).toHaveValue('keep-me-secret')
    expect(screen.getByRole('button', { name: 'Show password' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('uses a non-submit button and does not submit its containing form', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    render(
      <form onSubmit={onSubmit}>
        <PasswordInput id="password" aria-label="Password" />
      </form>
    )

    const toggle = screen.getByRole('button', { name: 'Show password' })
    expect(toggle).toHaveAttribute('type', 'button')
    toggle.focus()
    expect(toggle).toHaveFocus()
    fireEvent.click(toggle)
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
