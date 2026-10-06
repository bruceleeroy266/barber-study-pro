import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import PlatformSchoolSelector from '@/components/admin/PlatformSchoolSelector'
import StaffPilotMeasurementView from '@/components/pilot-measurement/StaffPilotMeasurementView'

interface AdminPilotMeasurementPageProps {
  searchParams: Promise<{ school?: string }>
}

export const dynamic = 'force-dynamic'

export default async function AdminPilotMeasurementPage({
  searchParams,
}: AdminPilotMeasurementPageProps) {
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

  if (!isPlatformAdminProfile(profile)) {
    if (!profile.school_id) redirect('/dashboard')
    return (
      <div className="min-h-screen bg-black p-6 md:p-8">
        <div className="mx-auto max-w-7xl">
          <StaffPilotMeasurementView schoolId={profile.school_id} viewer="school_admin" />
        </div>
      </div>
    )
  }

  const { school: requestedSchoolId } = await searchParams
  const { data: schools } = await supabase
    .from('schools')
    .select('id,name')
    .eq('is_active', true)
    .is('deleted_at', null)
    .order('name')

  const schoolList: Array<{ id: string; name: string }> = schools ?? []
  const selected = requestedSchoolId
    ? schoolList.find((school) => school.id === requestedSchoolId) ?? null
    : null

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <PlatformSchoolSelector
          schools={schoolList}
          selectedId={selected?.id}
          basePath="/admin/school/pilot-measurement"
          title={selected ? `Pilot Measurement: ${selected.name}` : 'Select a school for pilot measurement'}
          description="Platform-admin school selection is validated server-side before measurement data is loaded."
        />
        {requestedSchoolId && !selected && (
          <div role="alert" className="rounded-lg border border-red-500/20 bg-red-500/10 p-4">
            <p className="text-sm text-red-300">The selected school is not available.</p>
          </div>
        )}
        {selected && (
          <StaffPilotMeasurementView schoolId={selected.id} viewer="platform_admin" />
        )}
      </div>
    </div>
  )
}
