import { getCurrentUtmContext, type UtmParams } from './utm'

/**
 * Safe analytics event tracking helper for ASCYN PRO.
 *
 * Sends events to:
 * - Vercel Analytics (track) when available
 * - Google Analytics 4 (gtag('event', ...)) when available
 *
 * No personal information is included in events. UTM parameters are attached
 * only when present so traffic can be attributed to specific campaigns.
 */

export interface TrackingEventProps extends Record<string, unknown> {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

function getGtag(): Gtag.Gtag | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as { gtag?: Gtag.Gtag }).gtag ?? null
}

function safeTrackVercel(eventName: string, properties?: Record<string, unknown>): void {
  try {
    const va = (window as unknown as { va?: { track?: (name: string, props?: Record<string, unknown>) => void } }).va
    if (va?.track) {
      va.track(eventName, properties)
    }
  } catch {
    // Ignore Vercel Analytics errors so they never break the UI.
  }
}

function safeTrackGa4(eventName: string, properties?: Record<string, unknown>): void {
  const gtag = getGtag()
  if (gtag) {
    try {
      gtag('event', eventName, properties)
    } catch {
      // Ignore GA4 errors.
    }
  }
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return

  const utm = getCurrentUtmContext()
  const props: TrackingEventProps = { ...properties }

  if (utm.utm_source) props.utm_source = utm.utm_source
  if (utm.utm_medium) props.utm_medium = utm.utm_medium
  if (utm.utm_campaign) props.utm_campaign = utm.utm_campaign

  safeTrackVercel(eventName, props)
  safeTrackGa4(eventName, props)
}

/**
 * Track a page view with optional UTM context.
 */
export function trackPageView(pageName: string, properties?: Record<string, unknown>): void {
  trackEvent(`${pageName}_page_view`, properties)
}

/**
 * Track a button/link click with optional UTM context.
 */
export function trackClick(eventName: string, properties?: Record<string, unknown>): void {
  trackEvent(eventName, properties)
}
