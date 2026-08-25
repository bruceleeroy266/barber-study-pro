'use client'

import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/brand'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
      })

      if (error) throw error

      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send reset email')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[var(--color-background-primary)]/80 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <Logo variant="compact" size="xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          We&apos;ve sent a password reset link to <strong>{email}</strong>.
          Please check your inbox and follow the instructions.
        </p>
        <Link
          href="/login"
          className="inline-block px-6 py-3 bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
        >
          Back to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-background-primary)]/80 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo variant="compact" size="xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Reset Password</h1>
        <p className="text-[var(--color-text-muted)]">Enter your email to receive a reset link</p>
      </div>

      {error && (
        <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleReset} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:from-[var(--color-brand-gold-light)] hover:to-[var(--color-brand-gold)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
        Remember your password?{' '}
        <Link href="/login" className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] font-medium transition-colors">
          Sign in
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-[var(--color-border-primary)] text-center">
        <Link href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors">
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
