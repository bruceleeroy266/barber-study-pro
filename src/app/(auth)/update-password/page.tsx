'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Logo } from '@/components/brand'

export default function UpdatePasswordPage() {
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
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
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) throw error

      // Clear the forced password-change flag if it was set.
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await supabase
          .from('profiles')
          .update({ requires_password_change: false, updated_at: new Date().toISOString() })
          .eq('id', user.id)
      }

      setSuccess(true)
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="bg-[var(--color-background-primary)]/80 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-2xl p-8 shadow-2xl text-center">
        <div className="flex justify-center mb-4">
          <Logo variant="icon" theme="gold" size="xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Password Updated!</h1>
        <p className="text-[var(--color-text-muted)] mb-6">
          Your password has been successfully updated. You will be redirected to the login page in a few seconds.
        </p>
        <Link
          href="/login"
          className="inline-block py-3 px-6 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:from-[var(--color-brand-gold-light)] hover:to-[var(--color-brand-gold)] transition-all duration-200"
        >
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[var(--color-background-primary)]/80 backdrop-blur-sm border border-[var(--color-border-primary)] rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Logo variant="icon" theme="gold" size="xl" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Set New Password</h1>
        <p className="text-[var(--color-text-muted)]">Enter your new password below</p>
      </div>

      {error && (
        <div className="bg-silver/10 border border-silver/20 text-silver px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-5">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            New Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
            placeholder="••••••••"
          />
          <p className="text-xs text-[var(--color-text-muted)] mt-1">Must be at least 6 characters</p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[var(--color-background-secondary)] border border-[var(--color-border-primary)] rounded-lg text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)] focus:ring-1 focus:ring-[var(--color-brand-gold)] transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:from-[var(--color-brand-gold-light)] hover:to-[var(--color-brand-gold)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-[var(--color-border-primary)] text-center">
        <Link href="/login" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-sm transition-colors">
          ← Back to login
        </Link>
      </div>
    </div>
  )
}
