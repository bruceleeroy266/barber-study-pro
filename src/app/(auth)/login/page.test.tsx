import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import LoginPage from './page'

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
})
