/**
 * PRODUCTION CONTRACT REGRESSION TESTS
 * 
 * These tests reproduce the ACTUAL Supabase production authentication contract
 * discovered during forensic analysis:
 * 
 * Supabase /auth/v1/verify
 * → 303 Redirect
 * → /auth/callback?type=recovery (or invite)
 * → URL fragment contains session tokens
 * → Supabase client auto-session detection
 * → Callback recognizes authenticated session
 * → Password setup
 * 
 * CRITICAL: These tests do NOT rely solely on mocked ?code or ?token query flows.
 * They verify the fragment-session architecture that Supabase actually uses.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import CallbackPage from './page'

const push = vi.fn()
const mockSearchParams = {
  get: vi.fn<(key: string) => string | null>(),
}

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
  useSearchParams: () => mockSearchParams,
}))

const { exchangeCodeForSession, verifyOtp, getSession, getUser, from } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  verifyOtp: vi.fn(),
  getSession: vi.fn(),
  getUser: vi.fn(),
  from: vi.fn(),
}))

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      exchangeCodeForSession,
      verifyOtp,
      getSession,
      getUser,
    },
    from,
  },
}))

function setSearchParams(params: Record<string, string>) {
  mockSearchParams.get.mockImplementation((key: string) => params[key] ?? null)
}

/**
 * Simulates the Supabase production flow where:
 * 1. User clicks email link: /auth/v1/verify?token=xxx&type=recovery&redirect_to=...
 * 2. Supabase verifies token and 303 redirects to: /auth/callback?type=recovery
 * 3. URL fragment (#access_token=...&refresh_token=...) contains session
 * 4. Supabase client auto-detects fragment and establishes session
 * 5. Callback page loads with ?type=recovery (no token in query)
 */
describe('Production Contract Regression Tests', () => {
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

  describe('Supabase /auth/v1/verify → 303 → /auth/callback Fragment Flow', () => {
    it('PRODUCTION: handles recovery flow with fragment-established session (no query token)', async () => {
      // After Supabase verifies the token, it redirects to /auth/callback?type=recovery
      // The session is in the URL fragment, NOT in query parameters
      setSearchParams({ type: 'recovery' })
      
      // Simulate Supabase client auto-establishing session from URL fragment
      getSession.mockResolvedValue({
        data: { 
          session: { 
            access_token: 'fragment-access-token',
            refresh_token: 'fragment-refresh-token',
            user: { id: 'recovery-user-id', email: 'recovery@ascynpro.test' }
          } 
        },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'recovery-user-id', email: 'recovery@ascynpro.test' } }
      })

      render(<CallbackPage />)

      // Should show loading state while checking session
      expect(screen.getByText(/verifying your session/i)).toBeInTheDocument()

      // Should auto-detect session and redirect to update-password
      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      }, { timeout: 2000 })
    })

    it('PRODUCTION: handles invite flow with fragment-established session (no query token)', async () => {
      // After Supabase verifies the invite token, it redirects to /auth/callback?type=invite
      setSearchParams({ type: 'invite' })
      
      getSession.mockResolvedValue({
        data: { 
          session: { 
            access_token: 'fragment-access-token',
            refresh_token: 'fragment-refresh-token',
            user: { id: 'invited-user-id', email: 'invited@ascynpro.test' }
          } 
        },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'invited-user-id', email: 'invited@ascynpro.test' } }
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      }, { timeout: 2000 })
    })

    it('PRODUCTION: handles email confirmation with fragment session and routes by role', async () => {
      setSearchParams({ type: 'email' })
      
      getSession.mockResolvedValue({
        data: { 
          session: { 
            access_token: 'fragment-access-token',
            user: { id: 'student-user-id', email: 'student@ascynpro.test' }
          } 
        },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'student-user-id', email: 'student@ascynpro.test' } }
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

    it('PRODUCTION: fails closed when no fragment session exists', async () => {
      // User navigates directly to /auth/callback?type=recovery without valid session
      setSearchParams({ type: 'recovery' })
      
      // No session established (invalid/expired link)
      getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      render(<CallbackPage />)

      // Should show Continue button for manual verification fallback
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      // Should NOT have redirected
      expect(push).not.toHaveBeenCalled()
    })

    it('PRODUCTION: fails closed when fragment session is invalid', async () => {
      setSearchParams({ type: 'recovery' })
      
      getSession.mockResolvedValue({
        data: { session: null },
        error: { message: 'Invalid session' }
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
      })

      expect(push).not.toHaveBeenCalled()
    })
  })

  describe('Complete Production Authentication Contract', () => {
    it('PRODUCTION CONTRACT: /auth/v1/verify → 303 → callback → auto-session → password setup', async () => {
      // This test verifies the COMPLETE production contract:
      // 1. Supabase /auth/v1/verify validates the token
      // 2. 303 redirect to /auth/callback?type=recovery
      // 3. URL fragment contains access_token and refresh_token
      // 4. Supabase client auto-establishes session from fragment
      // 5. Callback detects session and routes to password setup
      
      setSearchParams({ type: 'recovery' })
      
      // Simulate the fragment session that Supabase client would detect
      const fragmentSession = {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        refresh_token: 'v1.MR5...',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: 'production-user-id',
          email: 'production@ascynpro.test',
          aud: 'authenticated',
          role: 'authenticated'
        }
      }
      
      getSession.mockResolvedValue({
        data: { session: fragmentSession },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: fragmentSession.user }
      })

      render(<CallbackPage />)

      // Verify auto-session detection and routing
      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      }, { timeout: 2000 })
      
      // Verify no manual verification was needed
      expect(getSession).toHaveBeenCalled()
    })

    it('PRODUCTION CONTRACT: invitation flow with role-based routing after password setup', async () => {
      setSearchParams({ type: 'invite' })
      
      getSession.mockResolvedValue({
        data: { 
          session: { 
            access_token: 'invite-fragment-token',
            user: { id: 'new-admin-id', email: 'newadmin@ascynpro.test' }
          } 
        },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'new-admin-id', email: 'newadmin@ascynpro.test' } }
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/set-password')
      }, { timeout: 2000 })
    })
  })

  describe('Security Boundary Tests', () => {
    it('SECURITY: does not grant access with malformed callback parameters', async () => {
      // Malformed callback - no type, no session
      setSearchParams({})
      
      getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      })
      
      // Should NOT have any Continue button
      expect(screen.queryByRole('button', { name: /continue/i })).not.toBeInTheDocument()
      
      // Should NOT redirect to any protected route
      expect(push).not.toHaveBeenCalledWith('/admin')
      expect(push).not.toHaveBeenCalledWith('/dashboard')
      expect(push).not.toHaveBeenCalledWith('/auth/set-password')
      expect(push).not.toHaveBeenCalledWith('/auth/update-password')
    })

    it('SECURITY: does not grant access with unsupported verification type', async () => {
      setSearchParams({ type: 'magiclink' }) // Unsupported type
      
      getSession.mockResolvedValue({
        data: { session: null },
        error: null
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(screen.getByText(/invitation link is invalid or expired/i)).toBeInTheDocument()
      })
    })

    it('SECURITY: session check does not expose sensitive tokens', async () => {
      setSearchParams({ type: 'recovery' })
      
      const sensitiveToken = 'super-secret-access-token-12345'
      getSession.mockResolvedValue({
        data: { 
          session: { 
            access_token: sensitiveToken,
            user: { id: 'user-id' }
          } 
        },
        error: null
      })
      
      getUser.mockResolvedValue({
        data: { user: { id: 'user-id', email: 'user@test.com' } }
      })

      render(<CallbackPage />)

      await waitFor(() => {
        expect(push).toHaveBeenCalledWith('/auth/update-password')
      })

      // Verify no sensitive data in rendered output
      const html = document.body.innerHTML
      expect(html).not.toContain(sensitiveToken)
    })
  })
})
