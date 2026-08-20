'use client'

/**
 * Phase 6C-4 — Escalation Badge Component
 *
 * Displays a count indicator for pending escalations.
 * Used in the instructor navigation to alert instructors
 * when students need attention.
 */

import { useEffect, useState, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'

interface EscalationBadgeProps {
  className?: string
}

export default function EscalationBadge({ className = '' }: EscalationBadgeProps) {
  const [pendingCount, setPendingCount] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCount = useCallback(async () => {
    try {
      const response = await fetch('/api/instructor/escalations')
      if (!response.ok) return

      const data = await response.json()
      const pending = (data.escalations ?? []).filter(
        (e: { status: string }) => e.status === 'pending'
      ).length
      setPendingCount(pending)
    } catch {
      // Silently fail — badge is non-critical
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCount()

    // Refresh every 60 seconds
    const interval = setInterval(fetchCount, 60_000)
    return () => clearInterval(interval)
  }, [fetchCount])

  if (isLoading || pendingCount === 0) return null

  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 ${className}`}
      role="status"
      aria-label={`${pendingCount} pending escalation${pendingCount !== 1 ? 's' : ''}`}
    >
      <AlertTriangle className="w-3 h-3" aria-hidden="true" />
      {pendingCount}
    </span>
  )
}
