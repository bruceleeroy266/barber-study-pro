'use client'

import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

/**
 * Vercel Analytics + Speed Insights bundle.
 *
 * Imported once in the root layout so all pages are tracked automatically.
 */
export function VercelAnalytics() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  )
}
