'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

const HEARTBEAT_MS = 60_000
const ACTIVE_WINDOW_MS = 90_000

export default function StudyActivityTracker() {
  const lastInteractionAt = useRef(Date.now())

  useEffect(() => {
    const markActive = () => { lastInteractionAt.current = Date.now() }
    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, markActive, { passive: true }))

    const heartbeat = window.setInterval(async () => {
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastInteractionAt.current > ACTIVE_WINDOW_MS) return

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      const { error } = await supabase.rpc('record_study_activity', {
        p_seconds: 60,
        p_timezone: timezone,
      })
      if (error) console.error('[StudyActivityTracker] heartbeat failed:', error.message)
    }, HEARTBEAT_MS)

    return () => {
      window.clearInterval(heartbeat)
      events.forEach((event) => window.removeEventListener(event, markActive))
    }
  }, [])

  return null
}
