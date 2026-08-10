'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logBoundaryError } from '@/lib/error-logging'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logBoundaryError(error, { componentStack: error.digest }, 'global-error')
  }, [error])

  return (
    <html lang="en">
      <body className="antialiased bg-black text-white min-h-screen">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-charcoal to-black p-4">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-3xl">✂️</span>
              <span className="font-bold text-white text-xl">ASCYN PRO</span>
            </div>

            <div className="bg-charcoal/50 border border-graphite rounded-2xl p-8 space-y-6">
              <div className="text-5xl mb-4">⚠️</div>

              <h1 className="text-2xl font-bold text-white">
                Something went wrong
              </h1>

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

            <p className="text-silver-gray text-sm">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
