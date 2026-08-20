/**
 * Phase 6C-4 — Read-Only Intervention History Page
 *
 * Displays the full remediation journey for a student:
 * gap/cycle → targeted review → reassessment → evaluation → escalation/intervention.
 *
 * Authorization: instructor/admin from the same school as the student.
 * Read-only: no editing capabilities.
 */

import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { createSupabaseInstructorClient } from '@/lib/instructor/supabase-client'
import InterventionHistoryView from '@/components/instructor/InterventionHistoryView'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ studentId: string }>
}

export default async function InterventionHistoryPage({ params }: PageProps) {
  const { studentId } = await params
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

  // Verify student exists and belongs to same school
  const student = await instructorClient.getStudentById(studentId)

  if (!student) {
    notFound()
  }

  if (student.school_id !== profile.school_id) {
    redirect('/instructor')
  }

  const history = await instructorClient.getInterventionHistoryForStudent(
    studentId,
    profile.school_id
  )

  return (
    <div className="space-y-6">
      <InterventionHistoryView
        studentName={student.full_name}
        studentEmail={student.email}
        history={history}
      />
    </div>
  )
}
