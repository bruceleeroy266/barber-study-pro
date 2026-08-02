'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[GlobalError]', error)
  }, [error])

  return (
    <html lang="en">
      <body className="antialiased bg-gray-950 text-white min-h-screen">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4">
          <div className="w-full max-w-md text-center space-y-8">
            <div className="flex items-center justify-center gap-2 mb-8">
              <span className="text-3xl">✂️</span>
              <span className="font-bold text-white text-xl">ASCYN PRO</span>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 space-y-6">
              <div className="text-5xl mb-4">⚠️</div>

              <h1 className="text-2xl font-bold text-white">
                Something went wrong
              </h1>

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

            <p className="text-gray-600 text-sm">
              If this problem persists, please contact support.
            </p>
          </div>
        </div>
      </body>
    </html>
  )
}
