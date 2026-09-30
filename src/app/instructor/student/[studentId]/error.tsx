'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { logBoundaryError } from '@/lib/error-logging'

export default function StudentDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    logBoundaryError(error, { componentStack: error.digest }, 'instructor-student-detail-error')
  }, [error])

  return (
    <div className="min-h-screen bg-black p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-xl border border-graphite bg-charcoal p-6 text-center space-y-5">
        <h2 className="text-xl font-bold text-white">Student details could not be loaded</h2>
        <p className="text-sm text-silver">
          No student progress or diagnostic evidence was changed. Retry this view, or return to the student roster.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button type="button" onClick={reset} className="min-h-11 flex-1 rounded-lg bg-[var(--color-brand-gold)] px-4 py-3 font-semibold text-black">
            Try Again
          </button>
          <Link href="/instructor/students" className="min-h-11 flex-1 rounded-lg border border-graphite px-4 py-3 font-semibold text-white">
            Student Roster
          </Link>
        </div>
      </div>
    </div>
  )
}
