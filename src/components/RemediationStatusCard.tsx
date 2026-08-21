/**
 * Phase 6C-5 — Remediation Status Card Component
 *
 * Displays active remediation cycles on the student dashboard.
 * Shows focus areas requiring attention with clear entry points
 * to the remediation experience.
 */

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import type { StudentRemediationState } from '@/lib/remediation/student-service'

export interface ActiveRemediationCycle {
  id: string
  conceptId: string
  conceptName: string
  studentState: StudentRemediationState
  progressPercentage: number
  targetedAt: string
}

interface RemediationStatusCardProps {
  cycles: ActiveRemediationCycle[]
}

export default function RemediationStatusCard({ cycles }: RemediationStatusCardProps) {
  if (cycles.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-white">Focus Areas</h2>
        <p className="text-sm text-[var(--color-text-muted)]">
          Personalized review to strengthen your understanding
        </p>
      </div>

      <div className="space-y-3">
        {cycles.map((cycle) => (
          <Card
            key={cycle.id}
            variant="elevated"
            padding="md"
            className="border-l-4 border-l-[var(--color-brand-gold)]"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gold" size="sm">
                    {STUDENT_STATE_LABELS[cycle.studentState]}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">
                  {cycle.conceptName}
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] mb-3">
                  {STUDENT_STATE_DESCRIPTIONS[cycle.studentState]}
                </p>
                {cycle.studentState !== 'successful' && cycle.studentState !== 'unsuccessful' && (
                  <ProgressBar
                    value={cycle.progressPercentage}
                    max={100}
                    size="sm"
                    showLabel
                    label="Review Progress"
                  />
                )}
              </div>
              <div className="shrink-0">
                <Link
                  href={`/dashboard/remediation/${cycle.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
                >
                  {cycle.studentState === 'review_completed' ? 'Start Knowledge Check' : 'Continue Review'}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
