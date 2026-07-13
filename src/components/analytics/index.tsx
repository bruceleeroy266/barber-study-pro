'use client'

import { VercelAnalytics } from './VercelAnalytics'
import { GoogleAnalytics } from './GoogleAnalytics'
import { Clarity } from './Clarity'

/**
 * Global analytics providers.
 *
 * Render this once in the root layout. It includes:
 * - Vercel Web Analytics
 * - Vercel Speed Insights
 * - Optional Google Analytics 4 (via NEXT_PUBLIC_GA_MEASUREMENT_ID)
 * - Optional Microsoft Clarity (via NEXT_PUBLIC_CLARITY_PROJECT_ID)
 */
export function AnalyticsProviders() {
  return (
    <>
      <VercelAnalytics />
      <GoogleAnalytics />
      <Clarity />
    </>
  )
}
