import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import SchoolDashboard from '@/components/school-owner/SchoolDashboard'
import PlatformSchoolSelector from '@/components/admin/PlatformSchoolSelector'
import BackButton from '@/components/ui/BackButton'

interface SchoolOwnerDashboardProps {
  searchParams: Promise<{ school?: string }>
}

export default async function SchoolOwnerDashboard({ searchParams }: SchoolOwnerDashboardProps) {
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

  // Platform administrators (role='admin', school_id IS NULL) may select any
  // active school to view. The selected school id comes from the URL and is
  // validated server-side against active, non-deleted schools — an invalid or
  // unknown selection falls back to the selector (fail closed).
  if (isPlatformAdminProfile(profile)) {
    const { school: requestedSchoolId } = await searchParams

    // Active schools are readable by any authenticated user (public directory
    // policy); the list is only used for selection here.
    const { data: schools } = await supabase
      .from('schools')
      .select('id, name')
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name')

    const schoolList: Array<{ id: string; name: string }> = schools ?? []
    const selected = requestedSchoolId
      ? schoolList.find((s) => s.id === requestedSchoolId) ?? null
      : null

    if (!selected) {
      return (
        <div className="min-h-screen bg-black p-6 md:p-8">
          <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
          <div className="mt-6 max-w-7xl mx-auto space-y-6">
            {requestedSchoolId && (
              <div role="alert" className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">
                  The selected school is not available. Please choose an active school.
                </p>
              </div>
            )}
            <PlatformSchoolSelector
              schools={schoolList}
              basePath="/admin/school"
              title="Select a school to view"
              description="Choose which school's dashboard you want to administer."
            />
          </div>
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-black p-6 md:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
        <div className="mt-6 max-w-7xl mx-auto space-y-6">
          <PlatformSchoolSelector
            schools={schoolList}
            selectedId={selected.id}
            basePath="/admin/school"
            title={`Administering: ${selected.name}`}
            description="You are viewing this school as a platform administrator."
          />
          <SchoolDashboard schoolId={selected.id} />
        </div>
      </div>
    )
  }

  // School-attached administrators (school_admin, or admin assigned to a
  // school) remain strictly scoped to their own school. Unchanged behavior.
  if (!profile.school_id) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="mt-6">
        <SchoolDashboard schoolId={profile.school_id} />
      </div>
    </div>
  )
}
