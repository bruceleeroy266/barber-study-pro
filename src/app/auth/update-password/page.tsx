'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) throw updateError

      setSuccess(true)
      // Redirect to login after a short delay so the user sees the success message.
      setTimeout(() => {
        router.push('/login')
      }, 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-charcoal to-black flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-charcoal/80 backdrop-blur-sm border border-graphite rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
            <p className="text-silver">Enter your new password below</p>
          </div>

          {error && (
            <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          {success ? (
            <div className="space-y-6">
              <div className="bg-gold/10 border border-gold/20 text-gold px-4 py-3 rounded-lg text-sm">
                Your password has been updated. Redirecting you to sign in...
              </div>
              <Link
                href="/login"
                className="block w-full py-3 px-4 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg transition-colors text-center"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-light-gray mb-2">
                  New Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-graphite border border-[var(--color-border-secondary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-light-gray mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-graphite border border-[var(--color-border-secondary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
                  placeholder="••••••••"
                  minLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold)] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-lg transition-colors"
              >
                {loading ? 'Updating...' : 'Update Password'}
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
