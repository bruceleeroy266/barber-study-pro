import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile } from '@/types'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoStudents } from '@/lib/demo-data'
import NewMessageClient from './NewMessageClient'
import BackButton from '@/components/ui/BackButton'

export default async function NewMessagePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const schoolId = profile.school_id

  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  let students: Profile[] = (studentsData as Profile[]) || []
  if (students.length === 0 && isDemoFallbackEnabled()) {
    students = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
      <div className="mt-6">
        <NewMessageClient students={students} />
      </div>
    </div>
  )
}
