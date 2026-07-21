import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import BackButton from './BackButton'
import { useRouter } from 'next/navigation'

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('BackButton', () => {
  const mockBack = vi.fn()
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    ;(useRouter as ReturnType<typeof vi.fn>).mockReturnValue({
      back: mockBack,
      push: mockPush,
    })
  })

  it('calls router.back() when history is available', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 3 },
      writable: true,
    })

    render(<BackButton fallbackHref="/instructor" label="Back" />)
    fireEvent.click(screen.getByRole('button', { name: 'Back' }))

    expect(mockBack).toHaveBeenCalledTimes(1)
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('pushes fallback href when history is unavailable', () => {
    Object.defineProperty(window, 'history', {
      value: { length: 1 },
      writable: true,
    })

    render(<BackButton fallbackHref="/admin" label="Back to admin" />)
    fireEvent.click(screen.getByRole('button', { name: 'Back to admin' }))

    expect(mockPush).toHaveBeenCalledWith('/admin')
    expect(mockBack).not.toHaveBeenCalled()
  })

  it('renders the provided label', () => {
    render(<BackButton fallbackHref="/instructor" label="Back to roster" />)
    expect(screen.getByRole('button', { name: 'Back to roster' })).toBeInTheDocument()
  })
})
