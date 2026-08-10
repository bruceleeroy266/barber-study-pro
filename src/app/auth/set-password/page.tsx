'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { getRoleBasedRedirect } from '@/lib/auth-access'

const MIN_PASSWORD_LENGTH = 8

function isStrongPassword(password: string): boolean {
  if (password.length < MIN_PASSWORD_LENGTH) return false
  const hasUpper = /[A-Z]/.test(password)
  const hasLower = /[a-z]/.test(password)
  const hasDigit = /\d/.test(password)
  return hasUpper && hasLower && hasDigit
}

export default function SetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (cancelled) return

        if (sessionError || !session) {
          setError('This invitation link is invalid or has expired. Please ask your administrator to resend the invitation.')
        }
      } catch {
        if (!cancelled) {
          setError('Unable to verify your invitation. Please try again or contact support.')
        }
      } finally {
        if (!cancelled) {
          setCheckingSession(false)
        }
      }
    }

    checkSession()

    return () => {
      cancelled = true
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (!isStrongPassword(password)) {
      setError(
        `Password must be at least ${MIN_PASSWORD_LENGTH} characters and include an uppercase letter, a lowercase letter, and a number`
      )
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) throw updateError

      setSuccess(true)

      // Determine the correct portal based on the user's profile role.
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
      router.push(redirectPath)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to set password')
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
        <div className="text-silver">Verifying invitation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-charcoal/80 backdrop-blur-sm border border-graphite rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Password</h1>
            <p className="text-silver">Choose a strong password to activate your account.</p>
          </div>

          {error && (
            <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/20 text-gold px-4 py-3 rounded-lg text-sm">
                Password created. Redirecting you to the platform...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-light-gray mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-graphite border border-[var(--color-border-secondary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
                <p className="text-xs text-silver-gray mt-1">
                  At least {MIN_PASSWORD_LENGTH} characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-gray mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-graphite border border-[var(--color-border-secondary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Creating password...' : 'Create Password'}
              </button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold)] transition-colors">
                  Back to sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
