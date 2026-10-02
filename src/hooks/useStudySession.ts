'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { StudySurfaceType } from '@/lib/study-telemetry/surfaces'

const HEARTBEAT_MS = 60_000
const ACTIVE_WINDOW_MS = 5 * 60_000

interface UseStudySessionOptions {
  surfaceType: StudySurfaceType
  surfaceId?: string | null
  enabled?: boolean
}

export function useStudySession({
  surfaceType,
  surfaceId = null,
  enabled = true,
}: UseStudySessionOptions) {
  const sessionIdRef = useRef<string | null>(null)
  const lastQualifyingAtRef = useRef<number | null>(null)
  const startingRef = useRef<Promise<string | null> | null>(null)

  const ensureSession = useCallback(async () => {
    if (!enabled) return null
    if (sessionIdRef.current) return sessionIdRef.current
    if (startingRef.current) return startingRef.current

    startingRef.current = fetch('/api/study-sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ surfaceType, surfaceId }),
    })
      .then(async (response) => {
        if (!response.ok) return null
        const data = await response.json()
        const sessionId = typeof data.sessionId === 'string' ? data.sessionId : null
        sessionIdRef.current = sessionId
        return sessionId
      })
      .catch((error) => {
        console.error('[StudyTelemetry] start request failed:', error)
        return null
      })
      .finally(() => {
        startingRef.current = null
      })

    return startingRef.current
  }, [enabled, surfaceId, surfaceType])

  const sendActivity = useCallback(async (eventType: 'qualifying_activity' | 'heartbeat') => {
    const sessionId = await ensureSession()
    if (!sessionId) return false

    try {
      const response = await fetch('/api/study-sessions/activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, eventType }),
      })
      return response.ok
    } catch (error) {
      console.error('[StudyTelemetry] activity request failed:', error)
      return false
    }
  }, [ensureSession])

  const recordActivity = useCallback(async () => {
    lastQualifyingAtRef.current = Date.now()
    return sendActivity('qualifying_activity')
  }, [sendActivity])

  const linkQuizAttempt = useCallback(async (quizAttemptId: string) => {
    const sessionId = await ensureSession()
    if (!sessionId) return false
    try {
      const response = await fetch('/api/study-sessions/link-quiz-attempt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, quizAttemptId }),
      })
      return response.ok
    } catch (error) {
      console.error('[StudyTelemetry] quiz-link request failed:', error)
      return false
    }
  }, [ensureSession])

  const endSession = useCallback(async () => {
    const sessionId = sessionIdRef.current
    if (!sessionId) return
    sessionIdRef.current = null
    lastQualifyingAtRef.current = null
    try {
      await fetch('/api/study-sessions/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
        keepalive: true,
      })
    } catch {
      // An abandoned tail is safely capped server-side by the idle contract.
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    const heartbeat = window.setInterval(() => {
      const lastQualifyingAt = lastQualifyingAtRef.current
      if (!lastQualifyingAt) return
      if (document.visibilityState !== 'visible') return
      if (Date.now() - lastQualifyingAt > ACTIVE_WINDOW_MS) return
      void sendActivity('heartbeat')
    }, HEARTBEAT_MS)

    return () => {
      window.clearInterval(heartbeat)
      void endSession()
    }
  }, [enabled, endSession, ensureSession, sendActivity])

  return { recordActivity, linkQuizAttempt, endSession }
}
