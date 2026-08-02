'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[DashboardError]', error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="text-5xl mb-4">⚠️</div>

        <h2 className="text-2xl font-bold text-white">
          Something went wrong
        </h2>

        <p className="text-gray-400 leading-relaxed">
          We&apos;re sorry. An unexpected error occurred while loading this page.
          Please try again.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="flex-1 px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-xl hover:bg-[#F4E4A6] transition-all shadow-lg shadow-[#D4AF37]/20"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl hover:bg-gray-700 transition-all border border-gray-700 text-center"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
