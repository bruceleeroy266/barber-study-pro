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

const { exchangeCodeForSession, verifyOtp, getUser, from } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      exchangeCodeForSession,
      verifyOtp,
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
    verifyOtp.mockResolvedValue({ error: null })
    getUser.mockResolvedValue({ data: { user: null } })
    from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    })
  })

  // ============================================
  // EXISTING PKCE CODE FLOW TESTS (should pass)
  // ============================================

  it('renders a confirmation button and does not exchange the code automatically', () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    expect(exchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('redirects invited users to /auth/set-password after confirming with PKCE code', async () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(exchangeCodeForSession).toHaveBeenCalledWith('test-auth-code')
      expect(push).toHaveBeenCalledWith('/auth/set-password')
    })
  })

  it('redirects password-recovery users to /auth/update-password with PKCE code', async () => {
    setSearchParams({ code: 'recovery-code', type: 'recovery' })
    render(<CallbackPage />)

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/auth/update-password')
    })
  })

  it('redirects instructors to /instructor for non-invite callbacks with PKCE code', async () => {
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

  it('shows an error when the PKCE exchange fails (used or expired code)', async () => {
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

  // ============================================
  // NEW: TOKEN_HASH VERIFICATION TESTS
  // These tests REPRODUCE THE PRODUCTION DEFECT
  // They will FAIL against the current implementation
  // ============================================

  describe('Token Hash Verification (Reproduction Tests)', () => {
    it('REPRODUCTION: handles invitation token_hash callback with verifyOtp', async () => {
      // This is the ACTUAL format Supabase uses for invitation emails
      setSearchParams({ token: 'invitation-token-hash-abc123', type: 'invite' })
      
      render(<CallbackPage />)

      // The current implementation shows "invalid or expired" because it only looks for 'code'
      // After fix: should render the confirmation button and call verifyOtp
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        // After fix: verifyOtp should be called with token_hash and type
        expect(verifyOtp).toHaveBeenCalledWith({
          token_hash: 'invitation-token-hash-abc123',
          type: 'invite',
        })
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      })
    })

    it('REPRODUCTION: handles recovery token_hash callback with verifyOtp', async () => {
      // This is the ACTUAL format Supabase uses for password recovery emails
      setSearchParams({ token: 'recovery-token-hash-xyz789', type: 'recovery' })
      
      render(<CallbackPage />)

      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(verifyOtp).toHaveBeenCalledWith({
          token_hash: 'recovery-token-hash-xyz789',
          type: 'recovery',
        })
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      })
    })

    it('REPRODUCTION: handles email confirmation token_hash callback', async () => {
      setSearchParams({ token: 'email-confirm-token-hash', type: 'email' })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'user@ascynpro.test' } },
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
        expect(verifyOtp).toHaveBeenCalledWith({
          token_hash: 'email-confirm-token-hash',
          type: 'email',
        })
      })
    })

    it('REPRODUCTION: shows error when token_hash verification fails', async () => {
      setSearchParams({ token: 'invalid-token', type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Token is expired or invalid' } })

      render(<CallbackPage />)

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid or expired/i)).toBeInTheDocument()
      })
      expect(push).not.toHaveBeenCalled()
    })

    it('REPRODUCTION: rejects unsupported verification types', async () => {
      // Types like 'magiclink' should not be accepted for security
      setSearchParams({ token: 'some-token', type: 'magiclink' })
      
      render(<CallbackPage />)

      // After fix: should show error for unsupported type
      expect(screen.getByText(/invalid or expired|unsupported/i)).toBeInTheDocument()
    })

    it('REPRODUCTION: does not leak token in error messages', async () => {
      const sensitiveToken = 'super-secret-token-hash-12345'
      setSearchParams({ token: sensitiveToken, type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Verification failed' } })

      render(<CallbackPage />)

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        const errorText = screen.getByText(/invalid or expired/i).textContent
        expect(errorText).not.toContain(sensitiveToken)
      })
    })
  })

  // ============================================
  // EDGE CASE TESTS
  // ============================================

  describe('Edge Cases', () => {
    it('handles missing both code and token parameters', () => {
      setSearchParams({ type: 'invite' })
      render(<CallbackPage />)

      expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
    })

    it('handles empty token parameter', () => {
      setSearchParams({ token: '', type: 'invite' })
      render(<CallbackPage />)

      expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
    })

    it('handles missing type parameter with token', () => {
      setSearchParams({ token: 'some-token' })
      render(<CallbackPage />)

      // Without type, we cannot determine the verification flow
      expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
    })
  })
})
