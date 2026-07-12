'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import { checkLoginRateLimit, recordLoginAttempt } from '@/lib/rate-limit'
import { logFailedLogin } from '../actions'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'
import { canAccessRoute } from '@/lib/auth-helpers'

type LoginError =
  | 'invalid_credentials'
  | 'not_approved'
  | 'disabled'
  | 'missing_profile'
  | 'invalid_role'
  | 'unknown'

const ERROR_MESSAGES: Record<LoginError, string> = {
  invalid_credentials: 'Invalid email or password. Please try again.',
  not_approved:
    'Your account is pending approval. You will receive access once an administrator approves your request.',
  disabled: 'Your account has been disabled. Contact your administrator.',
  missing_profile: 'Account profile not found. Please contact support.',
  invalid_role: 'Your account has an unrecognized role. Please contact support.',
  unknown: 'Something went wrong. Please try again.',
}

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/dashboard'
  const urlError = searchParams.get('error') as LoginError | null

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<LoginError | null>(urlError)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const rateLimit = checkLoginRateLimit(email)
    if (!rateLimit.allowed) {
      setError('unknown')
      // Override message via state would be cleaner, but we keep it simple.
      setLoading(false)
      return
    }

    try {
      const demoMode = isExplicitDemoMode()
      const supabaseConfigured = isSupabaseConfigured()

      // Phase 13C.1: auth bypass is only allowed in a safe local demo
      // environment (explicit demo mode + no real Supabase project).
      if (demoMode && !supabaseConfigured) {
        router.push(redirect)
        router.refresh()
        return
      }

      // If demo mode is enabled but a real Supabase project is configured,
      // treat this as a misconfiguration and force real authentication.
      if (demoMode && supabaseConfigured) {
        console.warn(
          '[Login] Demo mode is enabled but Supabase is configured. Enforcing real authentication.'
        )
      }

      console.log('[Login] Attempting signInWithPassword for', email)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error('[Login] signInWithPassword error:', signInError)
        recordLoginAttempt(email, false)
        throw signInError
      }

      console.log('[Login] signInWithPassword success, user:', data.user?.id)
      recordLoginAttempt(email, true)

      // Check if email is verified (if email confirmation is required)
      if (data.user && data.user.email_confirmed_at === null) {
        console.log('[Login] Email not confirmed, redirecting to verify-email')
        await supabase.auth.signOut()
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.user.email || '')}`)
        return
      }

      // Load profile and enforce approval / disabled checks.
      console.log('[Login] Fetching profile for', data.user.id)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        console.error('[Login] Profile error:', profileError, 'profile:', profile)
        await supabase.auth.signOut()
        setError('missing_profile')
        setLoading(false)
        return
      }

      console.log('[Login] Profile fetched, validating access')
      const access = validateLoginAccess(profile)
      if (!access.ok) {
        console.error('[Login] Access denied:', access)
        await supabase.auth.signOut()
        setError((access.errorKey as LoginError) ?? 'unknown')
        setLoading(false)
        return
      }

      // Force password change on first login for seeded/invited accounts.
      if (profile.requires_password_change) {
        console.log('[Login] Password change required')
        router.push('/update-password?reason=required')
        return
      }

      // Redirect by role. The role portal is the default destination so
      // instructors/admins are never left on /dashboard. Only honor the
      // original `redirect` param when it points to a specific allowed route
      // other than the generic dashboard landing page.
      const roleRedirect = getRoleBasedRedirect(profile.role)
      const target =
        redirect && redirect !== '/dashboard' && canAccessRoute(profile.role, redirect)
          ? redirect
          : roleRedirect
      console.log('[Login] Redirecting to', target)
      router.push(target)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to sign in'
      console.error('[Login] Caught error during login:', err)
      if (
        message.toLowerCase().includes('invalid login credentials')
      ) {
        setError('invalid_credentials')
      } else if (message.toLowerCase().includes('rate limit')) {
        setError('unknown')
      } else if (message.toLowerCase().includes('email not confirmed')) {
        setError('unknown')
      } else {
        setError('unknown')
      }
      // Best-effort security audit log; never block the user on logging failure.
      try {
        await logFailedLogin(email, message)
      } catch {
        // ignore
      }
    } finally {
      setLoading(false)
    }
  }

  const errorMessage = error ? ERROR_MESSAGES[error] : null

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">✂️</div>
        <h1 className="text-2xl font-bold text-white mb-2">Pilot Login</h1>
        <p className="text-gray-400">Sign in to your approved ASCYN PRO account</p>
      </div>

      {errorMessage && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div className="flex items-center justify-end text-sm">
          <Link
            href="/reset-password"
            className="text-[#D4AF37] hover:text-[#F4E4A6] transition-colors"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[#D4AF37] to-[#B8941F] text-gray-950 font-semibold rounded-lg hover:from-[#F4E4A6] hover:to-[#D4AF37] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Need access?{' '}
        <Link
          href="/pilot"
          className="text-[#D4AF37] hover:text-[#F4E4A6] font-medium transition-colors"
        >
          Request Pilot Access
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-800 text-center">
        <Link
          href="/"
          className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center">
            <div className="text-5xl mb-4">✂️</div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Pilot Login
            </h1>
            <p className="text-gray-400">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
