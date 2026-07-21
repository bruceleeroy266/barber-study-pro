import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import CallbackPage from './page'

const push = vi.fn()
const mockSearchParams: { get: Mock<(key: string) => string | null> } = {
  get: vi.fn(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => mockSearchParams,
}))

const { exchangeCodeForSession, getUser, from } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      exchangeCodeForSession,
      getUser,
    },
    from,
  },
}))

function setSearchParams(params: Record<string, string>) {
  mockSearchParams.get.mockImplementation((key: string) => params[key] ?? null)
}

describe('CallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    exchangeCodeForSession.mockResolvedValue({ error: null })
    getUser.mockResolvedValue({ data: { user: null } })
    from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    })
  })

  it('renders a confirmation button and does not exchange the code automatically', () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    expect(exchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('redirects invited users to /auth/set-password after confirming', async () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(exchangeCodeForSession).toHaveBeenCalledWith('test-auth-code')
      expect(push).toHaveBeenCalledWith('/auth/set-password')
    })
  })

  it('redirects password-recovery users to /auth/update-password', async () => {
    setSearchParams({ code: 'recovery-code', type: 'recovery' })
    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/auth/update-password')
    })
  })

  it('redirects instructors to /instructor for non-invite callbacks', async () => {
    setSearchParams({ code: 'generic-code' })

    getUser.mockResolvedValue({
      data: { user: { id: 'instructor-id', email: 'instructor@ascynpro.test' } },
    })
    from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { role: 'instructor' },
              error: null,
            }),
        }),
      }),
    })

    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/instructor')
    })
  })

  it('shows an error when the code is missing', () => {
    setSearchParams({})
    render(<CallbackPage />)

    expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
  })

  it('shows an error when the exchange fails (used or expired code)', async () => {
    setSearchParams({ code: 'used-code', type: 'invite' })
    exchangeCodeForSession.mockResolvedValue({ error: { message: 'Code is expired' } })

    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired/i)).toBeInTheDocument()
    })
    expect(push).not.toHaveBeenCalled()
  })

  it('rejects external redirect targets and falls back to /dashboard', async () => {
    setSearchParams({ code: 'generic-code', next: 'https://evil.com/phish' })

    getUser.mockResolvedValue({
      data: { user: { id: 'student-id', email: 'student@ascynpro.test' } },
    })
    from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () =>
            Promise.resolve({
              data: { role: 'student' },
              error: null,
            }),
        }),
      }),
    })

    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/dashboard')
    })
  })
})
