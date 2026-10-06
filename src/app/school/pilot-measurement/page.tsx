import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import StaffPilotMeasurementView from '@/components/pilot-measurement/StaffPilotMeasurementView'

export const dynamic = 'force-dynamic'

export default async function SchoolPilotMeasurementPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) {
    redirect('/dashboard')
  }
  if (!profile.school_id) redirect('/dashboard')

  return (
    <div className="mx-auto max-w-7xl">
      <StaffPilotMeasurementView schoolId={profile.school_id} viewer="school_admin" />
    </div>
  )
}
