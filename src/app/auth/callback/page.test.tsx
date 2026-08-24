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

const { exchangeCodeForSession, verifyOtp, getUser, getSession, from } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
  getUser: vi.fn(),
  getSession: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      exchangeCodeForSession,
      verifyOtp,
      getUser,
      getSession,
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
    getSession.mockResolvedValue({ data: { session: null }, error: null })
    from.mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    })
  })

  // ============================================
  // AUTO-SESSION DETECTION TESTS (SYSTEMIC CORRECTION)
  // These tests verify the callback detects Supabase's
  // automatic session establishment from URL fragments
  // ============================================

  describe('Auto-Session Detection (Systemic Correction)', () => {
    it('AUTO-SESSION: detects auto-established session for invite flow and redirects to set-password', async () => {
      // Simulate Supabase auto-verification establishing a session on page load
      setSearchParams({ token: 'auto-verified-token', type: 'invite' })
      getSession.mockResolvedValue({ 
        data: { session: { access_token: 'valid-token', user: { id: 'user-id' } } }, 
        error: null 
      })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'user-id', email: 'invited@ascynpro.test' } } 
      })

      render(<CallbackPage />)

      // Should show loading state initially
      expect(screen.getByText(/verifying your session/i)).toBeInTheDocument()

      // Wait for auto-session detection and redirect
      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      }, { timeout: 2000 })
    })

    it('AUTO-SESSION: detects auto-established session for recovery flow and redirects to update-password', async () => {
      setSearchParams({ token: 'auto-recovery-token', type: 'recovery' })
      getSession.mockResolvedValue({ 
        data: { session: { access_token: 'valid-token', user: { id: 'user-id' } } }, 
        error: null 
      })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'user-id', email: 'recovery@ascynpro.test' } } 
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      }, { timeout: 2000 })
    })

    it('AUTO-SESSION: detects auto-established session for email confirmation and routes by role', async () => {
      setSearchParams({ token: 'email-confirm-token', type: 'email' })
      getSession.mockResolvedValue({ 
        data: { session: { access_token: 'valid-token', user: { id: 'student-id' } } }, 
        error: null 
      })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'student-id', email: 'student@ascynpro.test' } } 
      })
      from.mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { role: 'student' }, error: null }),
          }),
        }),
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/dashboard')
      }, { timeout: 2000 })
    })

    it('AUTO-SESSION: falls back to manual verification when no auto-session exists', async () => {
      setSearchParams({ token: 'manual-token', type: 'invite' })
      getSession.mockResolvedValue({ data: { session: null }, error: null })

      render(<CallbackPage />)

      // Should show Continue button after loading
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      // Click Continue to trigger manual verification
      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(verifyOtp).toHaveBeenCalledWith({
          token_hash: 'manual-token',
          type: 'invite',
        })
      })
    })

    it('AUTO-SESSION: handles PKCE code flow with auto-session detection', async () => {
      setSearchParams({ code: 'pkce-code', type: 'invite' })
      getSession.mockResolvedValue({ 
        data: { session: { access_token: 'valid-token', user: { id: 'user-id' } } }, 
        error: null 
      })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'user-id', email: 'pkce@ascynpro.test' } } 
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      }, { timeout: 2000 })
    })

    it('AUTO-SESSION: does not redirect when session check fails', async () => {
      setSearchParams({ token: 'invalid-token', type: 'invite' })
      getSession.mockResolvedValue({ 
        data: { session: null }, 
        error: { message: 'Session check failed' } 
      })

      render(<CallbackPage />)

      // Should show Continue button after loading
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      // Should not have redirected
      expect(push).not.toHaveBeenCalled()
    })
  })

  // ============================================
  // EXISTING PKCE CODE FLOW TESTS (should pass)
  // ============================================

  it('renders a confirmation button and does not exchange the code automatically', async () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)
    
    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })
    expect(exchangeCodeForSession).not.toHaveBeenCalled()
  })

  it('redirects invited users to /auth/set-password after confirming with PKCE code', async () => {
    setSearchParams({ code: 'test-auth-code', type: 'invite' })
    render(<CallbackPage />)

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(exchangeCodeForSession).toHaveBeenCalledWith('test-auth-code')
      expect(push).toHaveBeenCalledWith('/auth/set-password')
    })
  })

  it('redirects password-recovery users to /auth/update-password with PKCE code', async () => {
    setSearchParams({ code: 'recovery-code', type: 'recovery' })
    render(<CallbackPage />)

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

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

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/instructor')
    })
  })

  it('shows an error when the code is missing', async () => {
    setSearchParams({})
    render(<CallbackPage />)

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
    })
    expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
  })

  it('shows an error when the PKCE exchange fails (used or expired code)', async () => {
    setSearchParams({ code: 'used-code', type: 'invite' })
    exchangeCodeForSession.mockResolvedValue({ error: { message: 'Code is expired' } })

    render(<CallbackPage />)

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

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

    // Wait for session check to complete
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
    })

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

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })
      
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

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })
      
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

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

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

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

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

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByText(/invalid or expired|unsupported/i)).toBeInTheDocument()
      })
    })

    it('REPRODUCTION: does not leak token in error messages', async () => {
      const sensitiveToken = 'super-secret-token-hash-12345'
      setSearchParams({ token: sensitiveToken, type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Verification failed' } })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        const errorText = screen.getByText(/invalid or expired/i).textContent
        expect(errorText).not.toContain(sensitiveToken)
      })
    })
  })

  // ============================================
  // REGRESSION TESTS: ACCOUNT SETUP STATE MISMATCH
  // These tests reproduce the exact production defect
  // where Continue allowed access despite error display
  // ============================================

  describe('Account Setup State Mismatch (Regression)', () => {
    it('REGRESSION: disables Continue button after verification error', async () => {
      setSearchParams({ token: 'invalid-token', type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Token expired' } })
      getUser.mockResolvedValue({ data: { user: null } })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      // Initially, Continue should be enabled
      const continueButton = screen.getByRole('button', { name: /continue/i })
      expect(continueButton).not.toBeDisabled()

      fireEvent.click(continueButton)

      await waitFor(() => {
        expect(screen.getByText(/invalid or expired/i)).toBeInTheDocument()
      })

      // After error, Continue should be disabled
      await waitFor(() => {
        const buttonAfterError = screen.getByRole('button', { name: /verification failed/i })
        expect(buttonAfterError).toBeDisabled()
      })
    })

    it('REGRESSION: redirects to set-password when session exists despite token error', async () => {
      // This reproduces Gabriel's exact scenario:
      // Token verification fails BUT session was already established
      setSearchParams({ token: 'used-token', type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Token already used' } })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'gabriel-id', email: 'ascynproofficial@gmail.com' } } 
      })
      from.mockReturnValue({
        select: () => ({
          eq: () => ({
            single: () => Promise.resolve({ data: { role: 'admin' }, error: null }),
          }),
        }),
      })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        // Should redirect to set-password, NOT to /admin
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      })
    })

    it('REGRESSION: redirects to update-password when session exists for recovery flow', async () => {
      setSearchParams({ token: 'used-recovery-token', type: 'recovery' })
      verifyOtp.mockResolvedValue({ error: { message: 'Token already used' } })
      getUser.mockResolvedValue({ 
        data: { user: { id: 'user-id', email: 'user@ascynpro.test' } } 
      })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      })
    })

    it('REGRESSION: shows error and disables button when no session exists', async () => {
      setSearchParams({ token: 'invalid-token', type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Invalid token' } })
      getUser.mockResolvedValue({ data: { user: null } })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        expect(screen.getByText(/invalid or expired/i)).toBeInTheDocument()
        expect(push).not.toHaveBeenCalled()
      })
    })

    it('REGRESSION: prevents unauthenticated access via Continue with no token', async () => {
      setSearchParams({}) // No token, no code
      
      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      })
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
      
      // Should only show Sign In link
      expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    })

    it('REGRESSION: prevents unauthenticated access via Continue with invalid token and no session', async () => {
      setSearchParams({ token: 'malicious-token', type: 'invite' })
      verifyOtp.mockResolvedValue({ error: { message: 'Invalid token' } })
      getUser.mockResolvedValue({ data: { user: null } })

      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      fireEvent.click(screen.getByRole('button', { name: /continue/i }))

      await waitFor(() => {
        // Should NOT redirect to any protected route
        expect(push).not.toHaveBeenCalledWith('/admin')
        expect(push).not.toHaveBeenCalledWith('/dashboard')
        expect(push).not.toHaveBeenCalledWith('/instructor')
        expect(push).not.toHaveBeenCalledWith('/school')
      })
    })
  })

  // ============================================
  // EDGE CASE TESTS
  // ============================================

  describe('Edge Cases', () => {
    it('handles missing both code and token parameters with type only (fragment flow)', async () => {
      setSearchParams({ type: 'invite' })
      render(<CallbackPage />)

      // Wait for session check to complete - should show Continue button for fragment flow fallback
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })
    })

    it('handles empty token parameter', async () => {
      setSearchParams({ token: '', type: 'invite' })
      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      })
    })

    it('handles missing type parameter with token', async () => {
      setSearchParams({ token: 'some-token' })
      render(<CallbackPage />)

      // Wait for session check to complete
      await waitFor(() => {
        expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      })
    })
  })
})
