'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/**
 * Prevents back-button access to protected pages after logout.
 * Detects when user navigates back to a protected page without a session
 * and redirects them to the home page.
 *
 * Uses the Supabase browser client (cookie-based SSR auth) to check for an
 * active session. This is compatible with @supabase/ssr createBrowserClient.
 */
export default function BackButtonPrevention() {
  const router = useRouter()

  useEffect(() => {
    let cancelled = false

    // Check if we have an active Supabase session
    const checkSession = async () => {
      if (typeof window === 'undefined') return

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!cancelled && !session) {
        // No session, redirect to home
        window.location.href = '/'
      }
    }

    // Check on mount
    checkSession()

    // Listen for popstate (back/forward button)
    const handlePopState = () => {
      checkSession()
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      cancelled = true
      window.removeEventListener('popstate', handlePopState)
    }
  }, [router])

  return null
}
