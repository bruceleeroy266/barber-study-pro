/**
 * Phase 6C-4 — Instructor Escalation Detail Page
 *
 * Shows full escalation detail with acknowledge action.
 */

import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'
import EscalationDetail from '@/components/instructor/EscalationDetail'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EscalationDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/instructor')
  }

  const instructorClient = createSupabaseInstructorClient()
  const escalation = await instructorClient.getEscalationForSchool(id, profile.school_id)

  if (!escalation) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <EscalationDetail
        escalation={{
          id: escalation.id,
          studentName: escalation.student.full_name,
          studentEmail: escalation.student.email,
          studentId: escalation.student.id,
          conceptId: escalation.conceptId,
          chapterId: escalation.chapterId,
          status: escalation.status,
          unsuccessfulCycleCount: escalation.unsuccessfulCycleCount,
          triggeringCycleIds: escalation.triggeringCycleIds,
          createdAt: escalation.createdAt.toISOString(),
          acknowledgedBy: escalation.acknowledgedBy,
          acknowledgedByName: escalation.acknowledgedByProfile?.full_name ?? null,
          acknowledgedAt: escalation.acknowledgedAt?.toISOString() ?? null,
          instructorNotes: escalation.instructorNotes,
          interventionPlan: escalation.interventionPlan,
          resolutionSummary: escalation.resolutionSummary,
          followUpRequired: escalation.followUpRequired,
        }}
        currentUserId={user.id}
      />
    </div>
  )
}
