import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import {
  isExplicitDemoMode,
  isSupabaseConfigured,
} from '@/lib/demo-helpers'
import { demoStudents } from '@/lib/demo-data'
import NewMessageClient from './NewMessageClient'
import BackButton from '@/components/ui/BackButton'
import { resolveSupportAccessContext } from '@/lib/support-access'

export default async function NewMessagePage() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (!isInstructorOrAdmin(profile.role)) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  const isSafeDemo = isExplicitDemoMode() && !isSupabaseConfigured()

  // COM-1D.3 production compose lives inside the assignment-safe message center.
  // Keep the historical multi-recipient composer available only in safe demo mode.
  if (!isSafeDemo) {
    redirect('/instructor/messages')
  }

  const schoolId = profile.school_id

  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  let students: Profile[] = (studentsData as Profile[]) || []
  if (students.length === 0) {
    students = demoStudents.filter(
      (student) => student.school_id === schoolId || !schoolId
    )
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <BackButton
        fallbackHref="/instructor"
        label="Back to instructor dashboard"
      />
      <div className="mt-6">
        <NewMessageClient students={students} />
      </div>
    </div>
  )
}
