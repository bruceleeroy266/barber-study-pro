/**
 * Phase 6C-4 — Instructor Escalation List Page
 *
 * Displays all pending and acknowledged escalations for the
 * authenticated instructor's school. Read-only list with
 * acknowledge action.
 */

import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'
import EscalationList from '@/components/instructor/EscalationList'

export const dynamic = 'force-dynamic'

export default async function InstructorEscalationsPage() {
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
    return (
      <div className="text-center py-12">
        <p className="text-silver">No school association found for your account.</p>
      </div>
    )
  }

  const instructorClient = createSupabaseInstructorClient()
  const escalations = await instructorClient.listEscalationsForSchool(profile.school_id)

  const items = escalations.map((esc) => ({
    id: esc.id,
    studentName: esc.student.full_name,
    studentEmail: esc.student.email,
    conceptId: esc.conceptId,
    chapterId: esc.chapterId,
    status: esc.status,
    unsuccessfulCycleCount: esc.unsuccessfulCycleCount,
    createdAt: esc.createdAt.toISOString(),
    acknowledgedByName: esc.acknowledgedByProfile?.full_name ?? null,
    acknowledgedAt: esc.acknowledgedAt?.toISOString() ?? null,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Escalations</h1>
        <p className="text-silver mt-1">
          Students who need additional support based on their learning progress.
        </p>
      </div>

      <EscalationList escalations={items} />
    </div>
  )
}
