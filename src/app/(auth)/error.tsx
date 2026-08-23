'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logBoundaryError } from '@/lib/error-logging'

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logBoundaryError(error, { componentStack: error.digest }, 'auth-error')
  }, [error])

  return (
    <div className="w-full text-center space-y-6">
      <div className="text-5xl mb-4">⚠️</div>

      <h2 className="text-2xl font-bold text-white">
        Something went wrong
      </h2>

      <p className="text-silver leading-relaxed">
        We&apos;re sorry. An unexpected error occurred while loading this page.
        Please try again.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <button
          onClick={reset}
          className="flex-1 px-6 py-3 bg-[var(--color-brand-gold)] text-black font-semibold rounded-xl hover:bg-[var(--color-brand-gold-light)] transition-all shadow-lg shadow-gold/20"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="flex-1 px-6 py-3 bg-graphite text-white font-semibold rounded-xl hover:bg-[var(--color-border-secondary)] transition-all border border-[var(--color-border-secondary)] text-center"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
