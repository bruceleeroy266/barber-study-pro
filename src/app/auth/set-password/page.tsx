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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
        <div className="text-gray-400">Verifying invitation...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-white mb-2">Create Your Password</h1>
            <p className="text-gray-400">Choose a strong password to activate your account.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-3 rounded-lg text-sm">
                Password created. Redirecting you to the platform...
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  At least {MIN_PASSWORD_LENGTH} characters with uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-colors"
                  placeholder="••••••••"
                  minLength={MIN_PASSWORD_LENGTH}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#D4AF37] hover:bg-[#B8962E] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Creating password...' : 'Create Password'}
              </button>

              <div className="text-center text-sm">
                <Link href="/login" className="text-[#D4AF37] hover:text-[#B8962E] transition-colors">
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
