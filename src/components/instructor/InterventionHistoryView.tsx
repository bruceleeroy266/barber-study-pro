'use client'

/**
 * Phase 6C-4 — Read-Only Intervention History View
 *
 * Renders the full remediation journey for a student from authoritative
 * persisted data. Read-only — no editing capabilities.
 *
 * Journey: gap/cycle → targeted review → reassessment → evaluation → escalation/intervention
 */

import Link from 'next/link'
import { Card, Badge, EmptyState } from '@/components/ui'
import {
  ArrowLeft,
  Target,
  BookOpen,
  ClipboardCheck,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  RotateCcw,
} from 'lucide-react'
import type { InterventionHistoryItem } from '@/lib/instructor/types'

interface InterventionHistoryViewProps {
  studentName: string
  studentEmail: string
  history: InterventionHistoryItem[]
}

function outcomeBadge(outcome: string | null) {
  switch (outcome) {
    case 'successful':
      return <Badge variant="success">Resolved</Badge>
    case 'unsuccessful':
      return <Badge variant="warning">Gap Persists</Badge>
    case 'pending':
      return <Badge variant="info">In Progress</Badge>
    default:
      return <Badge variant="default">No Outcome</Badge>
  }
}

function statusBadge(status: string) {
  switch (status) {
    case 'targeted':
      return <Badge variant="info">Targeted</Badge>
    case 'in_review':
      return <Badge variant="info">In Review</Badge>
    case 'review_completed':
      return <Badge variant="info">Review Done</Badge>
    case 'reassessment_in_progress':
      return <Badge variant="info">Reassessment</Badge>
    case 'evaluated':
      return <Badge variant="success">Evaluated</Badge>
    case 'escalated':
      return <Badge variant="warning">Escalated</Badge>
    case 'reset':
      return <Badge variant="default">Reset</Badge>
    default:
      return <Badge variant="default">{status.replaceAll('_', ' ')}</Badge>
  }
}

function escalationStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Needs Attention</Badge>
    case 'acknowledged':
      return <Badge variant="info">Acknowledged</Badge>
    case 'in_progress':
      return <Badge variant="info">In Progress</Badge>
    case 'resolved':
      return <Badge variant="success">Resolved</Badge>
    case 'auto_cleared':
      return <Badge variant="default">Auto-Cleared</Badge>
    case 'expired':
      return <Badge variant="default">Expired</Badge>
    default:
      return <Badge variant="default">{status}</Badge>
  }
}

function eventIcon(type: string) {
  switch (type) {
    case 'targeted':
      return <Target className="w-4 h-4 text-blue-400" aria-hidden="true" />
    case 'review_started':
    case 'content_viewed':
    case 'flashcard_reviewed':
      return <BookOpen className="w-4 h-4 text-blue-300" aria-hidden="true" />
    case 'review_completed':
      return <CheckCircle className="w-4 h-4 text-green-400" aria-hidden="true" />
    case 'reassessment_started':
    case 'reassessment_completed':
      return <ClipboardCheck className="w-4 h-4 text-purple-400" aria-hidden="true" />
    case 'evaluated':
      return <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
    case 'escalated':
      return <AlertTriangle className="w-4 h-4 text-orange-500" aria-hidden="true" />
    case 'reset':
      return <RotateCcw className="w-4 h-4 text-silver" aria-hidden="true" />
    default:
      return <Clock className="w-4 h-4 text-silver" aria-hidden="true" />
  }
}

function formatDate(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function InterventionHistoryView({
  studentName,
  studentEmail,
  history,
}: InterventionHistoryViewProps) {
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Intervention History</h1>
        <p className="text-silver mt-1">
          {studentName} ({studentEmail})
        </p>
        <p className="text-sm text-silver-gray mt-1">
          Read-only view of the student&apos;s remediation journey.
        </p>
      </div>

      {/* History */}
      {history.length === 0 ? (
        <EmptyState
          title="No intervention history"
          description="This student has no remediation cycles yet. Cycles are created automatically when a learning gap is detected."
        />
      ) : (
        <div className="space-y-6" role="list" aria-label="Remediation cycles">
          {history.map((item) => (
            <Card key={item.cycleId} className="p-6" role="listitem">
              {/* Cycle header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {item.conceptId}
                    </h2>
                    {statusBadge(item.status)}
                    {item.outcome && outcomeBadge(item.outcome)}
                  </div>
                  <p className="text-sm text-silver mt-1">
                    Chapter: {item.chapterId} &middot; Cycle: {item.cycleId.slice(0, 8)}…
                  </p>
                </div>
              </div>

              {/* Journey timeline */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-graphite/50 rounded-lg p-3">
                  <p className="text-xs text-silver-gray uppercase tracking-wide">Gap Identified</p>
                  <p className="text-sm text-white mt-1">{formatDate(item.targetedAt)}</p>
                  <p className="text-xs text-silver mt-1">{item.detectionSummary}</p>
                </div>
                <div className="bg-graphite/50 rounded-lg p-3">
                  <p className="text-xs text-silver-gray uppercase tracking-wide">Review Completed</p>
                  <p className="text-sm text-white mt-1">{formatDate(item.reviewCompletedAt)}</p>
                </div>
                <div className="bg-graphite/50 rounded-lg p-3">
                  <p className="text-xs text-silver-gray uppercase tracking-wide">Reassessment</p>
                  <p className="text-sm text-white mt-1">{formatDate(item.reassessmentCompletedAt)}</p>
                </div>
                <div className="bg-graphite/50 rounded-lg p-3">
                  <p className="text-xs text-silver-gray uppercase tracking-wide">Evaluated</p>
                  <p className="text-sm text-white mt-1">{formatDate(item.evaluatedAt)}</p>
                  {item.evaluationSummary && (
                    <p className="text-xs text-silver mt-1">{item.evaluationSummary}</p>
                  )}
                </div>
              </div>

              {/* Escalation info */}
              {item.escalation && (
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" aria-hidden="true" />
                    <span className="text-sm font-medium text-white">Escalation</span>
                    {escalationStatusBadge(item.escalation.status)}
                  </div>
                  {item.escalation.acknowledgedByName && (
                    <p className="text-xs text-silver">
                      Acknowledged by {item.escalation.acknowledgedByName}
                      {item.escalation.acknowledgedAt && ` on ${formatDate(item.escalation.acknowledgedAt)}`}
                    </p>
                  )}
                  <Link
                    href={`/instructor/escalations/${item.escalation.id}`}
                    className="text-xs text-gold hover:text-gold-light transition-colors mt-1 inline-block"
                  >
                    View escalation details →
                  </Link>
                </div>
              )}

              {/* Event timeline */}
              {item.events.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-silver-gray mb-2">Timeline</h3>
                  <div className="space-y-2">
                    {item.events.map((event, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {eventIcon(event.type)}
                        <span className="text-silver">{event.summary}</span>
                        <span className="text-xs text-silver-gray ml-auto">
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
