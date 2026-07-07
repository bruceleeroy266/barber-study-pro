'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

function VerifyEmailForm() {
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resent, setResent] = useState(false)

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResent(false)

    try {
      if (!email) {
        throw new Error('No email address provided. Please return to sign up and try again.')
      }

      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (resendError) throw resendError

      setResent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to resend verification email')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400 mb-6">
            We sent a verification link to{' '}
            <span className="text-white font-medium">{email || 'your email address'}</span>.
            Please click the link to activate your account.
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm text-left">
              {error}
            </div>
          )}

          {resent && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm">
              Verification email resent. Check your inbox and spam folder.
            </div>
          )}

          <form onSubmit={handleResend} className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <div className="text-sm">
              <Link href="/login" className="text-[#D4AF37] hover:text-[#B8962E] transition-colors">
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
        <div className="text-gray-400">Loading...</div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
