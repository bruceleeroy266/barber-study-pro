'use client'

/**
 * Phase 6C-4 — Escalation Detail Component
 *
 * Full escalation detail view with acknowledge action.
 * Double-click protection and loading states included.
 */

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, Badge, Button, AlertPanel } from '@/components/ui'
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  ArrowLeft,
  BookOpen,
  FileText,
} from 'lucide-react'

interface EscalationDetailProps {
  escalation: {
    id: string
    studentName: string
    studentEmail: string
    studentId: string
    conceptId: string
    chapterId: string
    status: string
    unsuccessfulCycleCount: number
    triggeringCycleIds: string[]
    createdAt: string
    acknowledgedBy: string | null
    acknowledgedByName: string | null
    acknowledgedAt: string | null
    instructorNotes: string | null
    interventionPlan: string | null
    resolutionSummary: string | null
    followUpRequired: boolean | null
  }
  currentUserId: string
}

function statusBadgeVariant(status: string): 'warning' | 'info' | 'success' | 'default' {
  switch (status) {
    case 'pending': return 'warning'
    case 'acknowledged': return 'info'
    case 'in_progress': return 'info'
    case 'resolved': return 'success'
    default: return 'default'
  }
}

function statusLabel(status: string): string {
  switch (status) {
    case 'pending': return 'Needs Attention'
    case 'acknowledged': return 'Acknowledged'
    case 'in_progress': return 'In Progress'
    case 'resolved': return 'Resolved'
    case 'auto_cleared': return 'Auto-Cleared'
    case 'expired': return 'Expired'
    default: return status
  }
}

export default function EscalationDetail({ escalation, currentUserId }: EscalationDetailProps) {
  const router = useRouter()
  const [isAcknowledging, setIsAcknowledging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const canAcknowledge = escalation.status === 'pending' && !escalation.acknowledgedBy
  const isAcknowledgedByMe = escalation.acknowledgedBy === currentUserId

  const handleAcknowledge = useCallback(async () => {
    if (isAcknowledging) return // Double-click protection

    setIsAcknowledging(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/instructor/escalations/${escalation.id}/acknowledge`,
        { method: 'POST' }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to acknowledge escalation')
      }

      if (data.alreadyAcknowledged) {
        setSuccessMessage('This escalation was already acknowledged.')
      } else {
        setSuccessMessage('Escalation acknowledged. You now own this intervention.')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAcknowledging(false)
    }
  }, [isAcknowledging, escalation.id, router])

  return (
    <div className="space-y-6">
      {/* Back navigation */}
      <Link
        href="/instructor/escalations"
        className="inline-flex items-center gap-2 text-silver hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to Escalations
      </Link>

      {/* Alerts */}
      {error && (
        <AlertPanel
          title="Error"
          description={error}
          variant="error"
          dismissible
          onDismiss={() => setError(null)}
        />
      )}
      {successMessage && (
        <AlertPanel
          title="Success"
          description={successMessage}
          variant="success"
          dismissible
          onDismiss={() => setSuccessMessage(null)}
        />
      )}

      {/* Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-orange-500" aria-hidden="true" />
              <h1 className="text-xl font-bold text-white">Escalation Detail</h1>
            </div>
            <Badge variant={statusBadgeVariant(escalation.status)} size="lg">
              {statusLabel(escalation.status)}
            </Badge>
          </div>
          {canAcknowledge && (
            <Button
              variant="primary"
              onClick={handleAcknowledge}
              disabled={isAcknowledging}
              loading={isAcknowledging}
            >
              {isAcknowledging ? 'Acknowledging...' : 'Acknowledge'}
            </Button>
          )}
          {isAcknowledgedByMe && (
            <Badge variant="info" size="sm">
              Acknowledged by you
            </Badge>
          )}
        </div>
      </Card>

      {/* Student Info */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5" aria-hidden="true" />
          Student Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-silver-gray">Name</p>
            <p className="text-white font-medium">{escalation.studentName}</p>
          </div>
          <div>
            <p className="text-sm text-silver-gray">Email</p>
            <p className="text-white">{escalation.studentEmail}</p>
          </div>
        </div>
        <div className="mt-4">
          <Link
            href={`/instructor/students/${escalation.studentId}/intervention-history`}
            className="text-gold hover:text-gold-light text-sm transition-colors"
          >
            View full intervention history →
          </Link>
        </div>
      </Card>

      {/* Escalation Details */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" aria-hidden="true" />
          Learning Gap Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-silver-gray">Concept</p>
            <p className="text-white font-medium">{escalation.conceptId}</p>
          </div>
          <div>
            <p className="text-sm text-silver-gray">Chapter</p>
            <p className="text-white">{escalation.chapterId}</p>
          </div>
          <div>
            <p className="text-sm text-silver-gray">Unsuccessful Attempts</p>
            <p className="text-white">{escalation.unsuccessfulCycleCount}</p>
          </div>
          <div>
            <p className="text-sm text-silver-gray">Escalated</p>
            <p className="text-white">
              {new Date(escalation.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-sm text-silver-gray">Triggering Cycles</p>
          <p className="text-white text-sm">
            {escalation.triggeringCycleIds.length} remediation cycle{escalation.triggeringCycleIds.length !== 1 ? 's' : ''}
          </p>
        </div>
      </Card>

      {/* Acknowledgement Info */}
      {escalation.acknowledgedByName && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
            Acknowledgement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-silver-gray">Acknowledged By</p>
              <p className="text-white">{escalation.acknowledgedByName}</p>
            </div>
            <div>
              <p className="text-sm text-silver-gray">Acknowledged At</p>
              <p className="text-white">
                {escalation.acknowledgedAt
                  ? new Date(escalation.acknowledgedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })
                  : '—'}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Notes & Plans */}
      {(escalation.instructorNotes || escalation.interventionPlan || escalation.resolutionSummary) && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" aria-hidden="true" />
            Notes & Plans
          </h2>
          {escalation.instructorNotes && (
            <div className="mb-4">
              <p className="text-sm text-silver-gray mb-1">Instructor Notes</p>
              <p className="text-white whitespace-pre-wrap">{escalation.instructorNotes}</p>
            </div>
          )}
          {escalation.interventionPlan && (
            <div className="mb-4">
              <p className="text-sm text-silver-gray mb-1">Intervention Plan</p>
              <p className="text-white whitespace-pre-wrap">{escalation.interventionPlan}</p>
            </div>
          )}
          {escalation.resolutionSummary && (
            <div>
              <p className="text-sm text-silver-gray mb-1">Resolution Summary</p>
              <p className="text-white whitespace-pre-wrap">{escalation.resolutionSummary}</p>
            </div>
          )}
        </Card>
      )}
    </div>
  )
}
