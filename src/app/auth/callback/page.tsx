'use client'

import { Suspense, useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getRoleBasedRedirect, isSafeRedirectPath } from '@/lib/auth-access'

/**
 * Supported email verification types for token_hash verification.
 * These match Supabase's EmailOtpType but are explicitly allowlisted
 * to prevent accepting arbitrary verification types.
 */
const SUPPORTED_VERIFICATION_TYPES = ['invite', 'recovery', 'email', 'signup'] as const
type SupportedVerificationType = (typeof SUPPORTED_VERIFICATION_TYPES)[number]

function isSupportedVerificationType(type: string | null): type is SupportedVerificationType {
  return type !== null && SUPPORTED_VERIFICATION_TYPES.includes(type as SupportedVerificationType)
}

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // PKCE flow parameters
  const code = searchParams.get('code')
  
  // Token hash verification parameters (from Supabase email templates)
  const token = searchParams.get('token')
  const type = searchParams.get('type')
  
  const rawNext = searchParams.get('next')
  const next = isSafeRedirectPath(rawNext) ? rawNext : '/dashboard'

  const [isExchanging, setIsExchanging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasVerificationError, setHasVerificationError] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [autoSessionDetected, setAutoSessionDetected] = useState(false)

  // Determine which flow to use based on available parameters
  const hasPkceCode = Boolean(code)
  const hasTokenHash = Boolean(token && type)
  const isValidTokenHashFlow = hasTokenHash && isSupportedVerificationType(type)
  
  // PRODUCTION CONTRACT: Also check for fragment-session flow where only type is present
  // After Supabase /auth/v1/verify redirects, the callback may only have ?type=xxx
  // with the session in the URL fragment (auto-detected by Supabase client)
  // Note: This is ONLY for the fragment flow - empty token string is treated as invalid
  const hasTypeOnly = Boolean(type && token === null && code === null)
  const isValidFragmentFlow = hasTypeOnly && isSupportedVerificationType(type)
  const shouldCheckAutoSession = hasPkceCode || isValidTokenHashFlow || isValidFragmentFlow

  // SYSTEMIC CORRECTION: Check for auto-established session on page load
  // Supabase may automatically verify the token when the page loads, establishing
  // a session before the user clicks Continue. We must detect this and route
  // appropriately WITHOUT requiring the user to click Continue again.
  useEffect(() => {
    let cancelled = false

    async function checkAutoSession() {
      // Only check for auto-session if we have valid callback parameters
      if (!shouldCheckAutoSession) {
        setIsCheckingSession(false)
        return
      }

      try {
        // Small delay to allow Supabase client to process URL fragment
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (cancelled) return

        if (sessionError || !session) {
          // No auto-session established - user must click Continue to verify manually
          setIsCheckingSession(false)
          return
        }

        // Auto-session detected! Route based on flow type
        setAutoSessionDetected(true)
        
        // Get user profile for role-based routing
        const { data: { user } } = await supabase.auth.getUser()
        
        if (cancelled) return
        
        if (!user) {
          setIsCheckingSession(false)
          return
        }

        // Route based on verification type
        if (type === 'invite') {
          router.push('/auth/set-password')
          return
        }
        
        if (type === 'recovery') {
          router.push('/auth/update-password')
          return
        }

        // For other types (email confirmation, etc.), route by profile role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (cancelled) return

        const redirectPath = getRoleBasedRedirect(profile?.role)
        router.push(redirectPath.startsWith('/login') ? next : redirectPath)
        return
      } catch {
        if (!cancelled) {
          setIsCheckingSession(false)
        }
      }
    }

    checkAutoSession()

    return () => {
      cancelled = true
    }
  }, [shouldCheckAutoSession, type, next, router])

  const completeSignIn = useCallback(async () => {
    // Handle PKCE code exchange flow
    if (hasPkceCode) {
      setIsExchanging(true)
      setError(null)

      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        setIsExchanging(false)
        setHasVerificationError(true)
        
        // Check if a session already exists (e.g., from auto-verification on page load)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Session exists - redirect to password setup instead of showing error
          if (type === 'invite') {
            router.push('/auth/set-password')
            return
          }
          if (type === 'recovery') {
            router.push('/auth/update-password')
            return
          }
          // For other types, redirect to role-based dashboard
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          const redirectPath = getRoleBasedRedirect(profile?.role)
          router.push(redirectPath.startsWith('/login') ? next : redirectPath)
          return
        }
        
        setError('This invitation link is invalid or expired. Please request a new invitation.')
        return
      }

      // Password recovery flows go straight to the update-password page.
      if (type === 'recovery') {
        router.push('/auth/update-password')
        return
      }

      // Invited users must set a password before accessing the platform.
      if (type === 'invite') {
        router.push('/auth/set-password')
        return
      }

      // For any other authenticated callback, route by profile role.
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const redirectPath = getRoleBasedRedirect(profile?.role)
      router.push(redirectPath.startsWith('/login') ? next : redirectPath)
      return
    }

    // Handle token hash verification flow (from Supabase email templates)
    if (isValidTokenHashFlow) {
      setIsExchanging(true)
      setError(null)

      const { error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as SupportedVerificationType,
      })

      if (verifyError) {
        setIsExchanging(false)
        setHasVerificationError(true)
        
        // Check if a session already exists (e.g., from auto-verification on page load)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          // Session exists - redirect to password setup instead of showing error
          if (type === 'invite') {
            router.push('/auth/set-password')
            return
          }
          if (type === 'recovery') {
            router.push('/auth/update-password')
            return
          }
          // For other types, redirect to role-based dashboard
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()
          const redirectPath = getRoleBasedRedirect(profile?.role)
          router.push(redirectPath.startsWith('/login') ? next : redirectPath)
          return
        }
        
        setError('This invitation link is invalid or expired. Please request a new invitation.')
        return
      }

      // Route based on verification type
      if (type === 'recovery') {
        router.push('/auth/update-password')
        return
      }

      if (type === 'invite') {
        router.push('/auth/set-password')
        return
      }

      // For email confirmation and other types, route by profile role
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const redirectPath = getRoleBasedRedirect(profile?.role)
      router.push(redirectPath.startsWith('/login') ? next : redirectPath)
      return
    }

    // Neither flow has valid parameters
    setError('This invitation link is invalid or has expired.')
    setHasVerificationError(true)
  }, [code, token, type, next, router, hasPkceCode, isValidTokenHashFlow])

  // Show loading state while checking for auto-established session
  if (isCheckingSession) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <div className="text-silver">Verifying your session...</div>
      </div>
    )
  }

  // Show error state if no valid auth parameters are present
  // Note: For fragment flow (type only), we show Continue button as fallback
  // in case auto-session detection didn't find a session
  if (!hasPkceCode && !isValidTokenHashFlow && !isValidFragmentFlow) {
    return (
      <div className="w-full max-w-md text-center" role="alert" aria-live="assertive">
        <div className="text-5xl mb-4" aria-hidden="true">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-4">Invitation link is invalid or expired</h1>
        <p className="text-silver mb-6">
          The link may have already been used, expired, or was opened by an email security scanner. Please
          request a new invitation.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  // If auto-session was detected and routed, this component will unmount
  // Show a brief confirmation if still rendering
  if (autoSessionDetected) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">✓</div>
        <div className="text-silver">Session verified. Redirecting...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-charcoal/80 backdrop-blur-sm border border-graphite rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Complete your account setup</h1>
        <p className="text-silver mb-6">
          Click below to confirm your invitation and create your password.
        </p>

        {error && (
          <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={completeSignIn}
          disabled={isExchanging || hasVerificationError}
          className="w-full py-3 px-4 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors mb-4"
        >
          {isExchanging ? 'Verifying...' : hasVerificationError ? 'Verification Failed' : 'Continue'}
        </button>

        <div className="text-center text-sm">
          <Link href="/login" className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-silver">
            <div className="text-5xl mb-4">🔒</div>
            Loading...
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
