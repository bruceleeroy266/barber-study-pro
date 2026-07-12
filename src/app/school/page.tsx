import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import SchoolDashboard from '@/components/school-owner/SchoolDashboard'

export default async function SchoolAdminPage() {
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

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/dashboard')
  }

  return <SchoolDashboard schoolId={profile.school_id} />
}
