/**
 * Phase 6C-3 — Student Remediation Page
 *
 * Route: /dashboard/remediation/[cycleId]
 *
 * Student-facing remediation experience for a single remediation cycle.
 * Server-side authorization: authenticated student must own the cycle.
 * cycleId is treated as an opaque identifier.
 */

import { createClient } from '@/lib/supabase-server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createSupabaseStudentRemediationClient } from '@/lib/remediation/supabase-client'
import { createStudentRemediationService } from '@/lib/remediation/student-service'
import { buildRemediationContentBundle } from '@/lib/remediation/content-filter'
import { STUDENT_STATE_LABELS, STUDENT_STATE_DESCRIPTIONS } from '@/lib/remediation/student-service'
import type { ConceptId } from '@/lib/chapter-2-concepts/types'
import RemediationPageClient from '@/components/remediation/RemediationPageClient'

interface RemediationPageProps {
  params: Promise<{
    cycleId: string
  }>
}

export default async function RemediationPage({ params }: RemediationPageProps) {
  const { cycleId } = await params

  // Authenticate
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/dashboard/remediation/' + cycleId)
  }

  // Create service
  const dbClient = createSupabaseStudentRemediationClient()
  const service = createStudentRemediationService(dbClient)

  // Fetch cycle with authorization
  const result = await service.getCycleForStudent(cycleId, user.id)

  if ('error' in result) {
    if (result.error === 'Access denied') {
      redirect('/dashboard')
    }
    notFound()
  }

  const { cycle, assignments } = result

  // Derive student-facing state
  const studentState = service.deriveStudentState(cycle)

  // Build content bundle
  const contentBundle = buildRemediationContentBundle(cycle.conceptId as ConceptId)

  // Get review progress
  const progressResult = await service.getReviewProgress(cycleId, user.id)
  const progress = 'error' in progressResult
    ? { completed: 0, total: 0, percentage: 0 }
    : progressResult

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-silver">
        <Link href="/dashboard" className="hover:text-[var(--color-brand-gold)] transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-white">Focus Area</span>
      </div>

      {/* Back to Dashboard */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-silver hover:text-[var(--color-brand-gold)] transition-colors"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Remediation Header */}
      <div className="bg-charcoal border border-graphite rounded-2xl p-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Focus Area: {contentBundle.conceptName}
            </h1>
            <p className="text-silver mt-2">
              {STUDENT_STATE_DESCRIPTIONS[studentState]}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-gold/10 text-gold text-sm rounded-full">
              {STUDENT_STATE_LABELS[studentState]}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {progress.total > 0 && (
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-silver mb-2">
              <span>Review Progress</span>
              <span>{progress.completed} of {progress.total} activities completed</span>
            </div>
            <div className="w-full bg-graphite rounded-full h-2">
              <div
                className="bg-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Client-Side Interactive Content */}
      <RemediationPageClient
        cycleId={cycleId}
        studentState={studentState}
        contentBundle={contentBundle}
        assignments={assignments}
        progress={progress}
      />
    </div>
  )
}
