'use client'

import { Suspense, useCallback, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getRoleBasedRedirect, isSafeRedirectPath } from '@/lib/auth-access'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const rawNext = searchParams.get('next')
  const next = isSafeRedirectPath(rawNext) ? rawNext : '/dashboard'

  const [isExchanging, setIsExchanging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeSignIn = useCallback(async () => {
    if (!code) {
      setError('This invitation link is invalid or has expired.')
      return
    }

    setIsExchanging(true)
    setError(null)

    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      setIsExchanging(false)
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
  }, [code, next, router, type])

  if (!code) {
    return (
      <div className="w-full max-w-md text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-4">Invitation link is invalid or expired</h1>
        <p className="text-gray-400 mb-6">
          The link may have already been used, expired, or was opened by an email security scanner. Please
          request a new invitation.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-[#D4AF37] hover:bg-[#B8962E] text-black font-semibold rounded-lg transition-colors"
        >
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-white mb-2">Complete your account setup</h1>
        <p className="text-gray-400 mb-6">
          Click below to confirm your invitation and create your password.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={completeSignIn}
          disabled={isExchanging}
          className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors mb-4"
        >
          {isExchanging ? 'Verifying...' : 'Continue'}
        </button>

        <div className="text-center text-sm">
          <Link href="/login" className="text-[#D4AF37] hover:text-[#B8962E] transition-colors">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function CallbackPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="text-gray-400">
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
