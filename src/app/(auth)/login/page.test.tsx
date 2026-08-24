import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import LoginPage from './page'
import { supabase } from '@/lib/supabase'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => ({ get: () => null }),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(),
  },
}))

vi.mock('@/lib/demo-helpers', () => ({
  isExplicitDemoMode: () => false,
  isSupabaseConfigured: () => true,
}))

vi.mock('@/lib/rate-limit', () => ({
  checkLoginRateLimit: () => ({ allowed: true }),
  recordLoginAttempt: vi.fn(),
}))

vi.mock('../actions', () => ({ logFailedLogin: vi.fn() }))

vi.mock('@/components/brand', () => ({
  Logo: () => <div data-testid="logo" />,
}))

describe('LoginPage credential safety', () => {
  it('initializes both credential fields empty', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText(/email address/i)).toHaveValue('')
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('')
  })

  it('does not render known smoke-test credentials', () => {
    const { container } = render(<LoginPage />)

    expect(container.innerHTML).not.toContain('instructor@ascyn-smoke.test')
    expect(screen.getByLabelText(/^password$/i)).toHaveValue('')
  })

  it('provides password-manager semantics and an accessible visibility control', () => {
    render(<LoginPage />)

    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('autocomplete', 'username')
    const password = screen.getByLabelText(/^password$/i)
    expect(password).toHaveAttribute('autocomplete', 'current-password')
    expect(password).toHaveAttribute('type', 'password')

    fireEvent.change(password, { target: { value: 'unchanged-secret' } })
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(password).toHaveAttribute('type', 'text')
    expect(password).toHaveValue('unchanged-secret')

    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(password).toHaveAttribute('type', 'password')
    expect(password).toHaveValue('unchanged-secret')
    expect(supabase.auth.signInWithPassword).not.toHaveBeenCalled()
  })

  it('announces and focuses a prominent invalid-credentials error', async () => {
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValueOnce({
      data: { user: null, session: null },
      error: new Error('Invalid login credentials'),
    } as never)

    render(<LoginPage />)
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: 'invalid@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: 'invalid-password' },
    })
    fireEvent.submit(screen.getByRole('button', { name: /sign in/i }).closest('form')!)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Sign-in failed')
    expect(alert).toHaveTextContent('Invalid email or password')
    await waitFor(() => expect(alert).toHaveFocus())
    expect(screen.getByLabelText(/email address/i)).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByLabelText(/^password$/i)).toHaveAttribute('aria-describedby', 'login-error')
  })
})
