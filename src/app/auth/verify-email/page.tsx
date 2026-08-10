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
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-charcoal/80 backdrop-blur-sm border border-graphite rounded-2xl p-8 shadow-2xl text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-silver mb-6">
            We sent a verification link to{' '}
            <span className="text-white font-medium">{email || 'your email address'}</span>.
            Please click the link to activate your account.
          </p>

          {error && (
            <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm text-left">
              {error}
            </div>
          )}

          {resent && (
            <div className="bg-gold/10 border border-gold/20 text-gold px-4 py-3 rounded-lg mb-6 text-sm">
              Verification email resent. Check your inbox and spam folder.
            </div>
          )}

          <form onSubmit={handleResend} className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <div className="text-sm">
              <Link href="/login" className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors">
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
      <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
        <div className="text-silver">Loading...</div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  )
}
