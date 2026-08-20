'use client'

/**
 * Phase 6C-4 — Escalation List Component
 *
 * Displays a list of instructor escalations with status indicators
 * and acknowledge action. Uses student-friendly language.
 */

import { useState } from 'react'
import Link from 'next/link'
import { Card, Badge, Button, EmptyState } from '@/components/ui'
import { AlertTriangle, CheckCircle, Clock, User } from 'lucide-react'

interface EscalationItem {
  id: string
  studentName: string
  studentEmail: string
  conceptId: string
  chapterId: string
  status: string
  unsuccessfulCycleCount: number
  createdAt: string
  acknowledgedByName: string | null
  acknowledgedAt: string | null
}

interface EscalationListProps {
  escalations: EscalationItem[]
}

function statusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="warning">Needs Attention</Badge>
    case 'acknowledged':
      return <Badge variant="info">Acknowledged</Badge>
    case 'in_progress':
      return <Badge variant="info">In Progress</Badge>
    case 'resolved':
      return <Badge variant="success">Resolved</Badge>
    default:
      return <Badge variant="default">{status}</Badge>
  }
}

function statusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <AlertTriangle className="w-5 h-5 text-orange-500" aria-hidden="true" />
    case 'acknowledged':
    case 'in_progress':
      return <Clock className="w-5 h-5 text-blue-500" aria-hidden="true" />
    case 'resolved':
      return <CheckCircle className="w-5 h-5 text-green-500" aria-hidden="true" />
    default:
      return <AlertTriangle className="w-5 h-5 text-silver" aria-hidden="true" />
  }
}

export default function EscalationList({ escalations }: EscalationListProps) {
  if (escalations.length === 0) {
    return (
      <EmptyState
        title="No escalations"
        description="All students are progressing well. Escalations will appear here when a student needs additional support."
      />
    )
  }

  return (
    <div className="space-y-4" role="list" aria-label="Student escalations">
      {escalations.map((esc) => (
        <Card key={esc.id} className="p-4" role="listitem">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {statusIcon(esc.status)}
              <div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-silver" aria-hidden="true" />
                  <span className="font-medium text-white">{esc.studentName}</span>
                </div>
                <p className="text-sm text-silver mt-1">
                  Concept: {esc.conceptId} &middot; Chapter: {esc.chapterId}
                </p>
                <p className="text-sm text-silver">
                  {esc.unsuccessfulCycleCount} unsuccessful attempt{esc.unsuccessfulCycleCount !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-silver-gray mt-1">
                  Created {new Date(esc.createdAt).toLocaleDateString()}
                </p>
                {esc.acknowledgedByName && (
                  <p className="text-xs text-silver-gray">
                    Acknowledged by {esc.acknowledgedByName}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              {statusBadge(esc.status)}
              <Link href={`/instructor/escalations/${esc.id}`}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
