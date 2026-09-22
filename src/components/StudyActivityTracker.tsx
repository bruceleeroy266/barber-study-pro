'use client'

import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { calculateStudyHeartbeatSeconds } from '@/lib/study-activity-heartbeat'

const HEARTBEAT_MS = 60_000
const ACTIVE_WINDOW_MS = 90_000

export default function StudyActivityTracker() {
  const lastInteractionAt = useRef(Date.now())
  const lastHeartbeatAt = useRef(Date.now())

  useEffect(() => {
    const markActive = () => {
      lastInteractionAt.current = Date.now()
    }

    // Reset the heartbeat clock whenever visibility changes. Browsers may
    // throttle/suspend intervals in background tabs; without this reset, a
    // delayed callback could claim a full minute immediately after returning.
    const handleVisibilityChange = () => {
      lastHeartbeatAt.current = Date.now()
    }

    const events: Array<keyof WindowEventMap> = ['pointerdown', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) => window.addEventListener(event, markActive, { passive: true }))
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const heartbeat = window.setInterval(async () => {
      const now = Date.now()
      const previousHeartbeatAt = lastHeartbeatAt.current
      lastHeartbeatAt.current = now

      if (document.visibilityState !== 'visible') return
      if (now - lastInteractionAt.current > ACTIVE_WINDOW_MS) return

      const seconds = calculateStudyHeartbeatSeconds(previousHeartbeatAt, now)
      if (seconds <= 0) return

      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
      const { error } = await supabase.rpc('record_study_activity', {
        p_seconds: seconds,
        p_timezone: timezone,
      })
      if (error) console.error('[StudyActivityTracker] heartbeat failed:', error.message)
    }, HEARTBEAT_MS)

    return () => {
      window.clearInterval(heartbeat)
      events.forEach((event) => window.removeEventListener(event, markActive))
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return null
}
