import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoSchoolConfiguration } from '@/lib/demo-data'
import { createDefaultSchoolConfiguration } from '@/lib/school-config/defaults'
import { SchoolConfiguration } from '@/types'
import SchoolConfigurationClient from '@/components/admin/school-config/SchoolConfigurationClient'
import PlatformSchoolSelector from '@/components/admin/PlatformSchoolSelector'
import BackButton from '@/components/ui/BackButton'

interface SchoolConfigurationPageProps {
  searchParams: Promise<{ school?: string }>
}

export default async function SchoolConfigurationPage({ searchParams }: SchoolConfigurationPageProps) {
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

  const isDemo = isDemoFallbackEnabled()

  if (isDemo) {
    return (
      <div className="min-h-screen bg-black p-6 lg:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
        <div className="mt-6">
          <SchoolConfigurationClient initialConfig={demoSchoolConfiguration} isDemo={true} />
        </div>
      </div>
    )
  }

  // Resolve the school this page administers.
  // - Platform admin (role='admin', school_id IS NULL): selects any active
  //   school via ?school=<id>; the selection is validated server-side and an
  //   unknown/inactive selection fails closed back to the selector.
  // - School-attached admin / school_admin: strictly their own school. The
  //   client can never choose a school (unchanged).
  let effectiveSchoolId: string
  let platformSelector: { schools: { id: string; name: string }[]; selectedName: string | null } | null =
    null

  if (isPlatformAdminProfile(profile)) {
    const { school: requestedSchoolId } = await searchParams

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
        <div className="min-h-screen bg-black p-6 lg:p-8">
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
              basePath="/admin/school/configuration"
              title="Select a school to configure"
              description="Choose which school's settings you want to administer."
            />
          </div>
        </div>
      )
    }

    effectiveSchoolId = selected.id
    platformSelector = { schools: schoolList, selectedName: selected.name }
  } else {
    if (!profile.school_id) {
      redirect('/dashboard')
    }
    effectiveSchoolId = profile.school_id
  }

  // Production path: load the actual school and its settings.
  const [{ data: school }, { data: settingsRow, error: settingsError }] = await Promise.all([
    supabase.from('schools').select('*').eq('id', effectiveSchoolId).single(),
    supabase
      .from('school_settings')
      .select('settings')
      .eq('school_id', effectiveSchoolId)
      .maybeSingle(),
  ])

  if (settingsError && !isMissingTableError(settingsError)) {
    console.error('[SchoolConfiguration] Failed to load school_settings:', settingsError.message)
  }

  let configuration: SchoolConfiguration

  if (school && settingsRow?.settings && isSchoolConfiguration(settingsRow.settings)) {
    // Merge saved settings with school data to ensure all fields are present
    const savedConfig = settingsRow.settings as SchoolConfiguration
    configuration = {
      ...savedConfig,
      school: {
        ...savedConfig.school,
        // Ensure all new fields have values from the school record or defaults
        city: savedConfig.school.city ?? school.city ?? '',
        state: savedConfig.school.state ?? school.state ?? '',
        postal_code: savedConfig.school.postal_code ?? school.postal_code ?? '',
        contact_phone: savedConfig.school.contact_phone ?? school.contact_phone ?? '',
        website: savedConfig.school.website ?? school.website ?? '',
        timezone: savedConfig.school.timezone ?? school.timezone ?? 'America/Chicago',
        license_number: savedConfig.school.license_number ?? school.license_number ?? '',
        accreditation: savedConfig.school.accreditation ?? school.accreditation ?? '',
        school_type: savedConfig.school.school_type ?? school.school_type ?? 'barber',
      },
      branding: {
        ...savedConfig.branding,
        secondaryColor: savedConfig.branding.secondaryColor ?? 'var(--color-brand-graphite)',
      },
      studentDefaults: savedConfig.studentDefaults ?? {
        passingPercentage: 70,
        maxQuizAttempts: 3,
        requiredAttendancePercentage: 80,
      },
      instructorDefaults: savedConfig.instructorDefaults ?? {
        canApproveHours: true,
        canManageStudents: true,
        canViewReports: true,
        requireApprovalForGrades: false,
      },
    }
  } else if (school) {
    // No saved settings yet — use production defaults derived from the real school.
    configuration = createDefaultSchoolConfiguration(school)
  } else {
    // School record missing; this should not happen for a properly assigned admin.
    // Show demo defaults with demo flag so the UI explains persistence is unavailable.
    return <SchoolConfigurationClient initialConfig={demoSchoolConfiguration} isDemo={true} />
  }

  return (
    <div className="min-h-screen bg-black p-6 lg:p-8">
      <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="mt-6 space-y-6">
        {platformSelector && (
          <div className="max-w-7xl mx-auto">
            <PlatformSchoolSelector
              schools={platformSelector.schools}
              selectedId={effectiveSchoolId}
              basePath="/admin/school/configuration"
              title={`Configuring: ${platformSelector.selectedName}`}
              description="You are administering this school as a platform administrator."
            />
          </div>
        )}
        <SchoolConfigurationClient
          initialConfig={configuration}
          isDemo={false}
          targetSchoolId={platformSelector ? effectiveSchoolId : undefined}
        />
      </div>
    </div>
  )
}

function isMissingTableError(error: { message?: string; code?: string }): boolean {
  return Boolean(
    error.message?.includes('relation') ||
      error.message?.includes('does not exist') ||
      error.code === '42P01'
  )
}

function isSchoolConfiguration(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    'school' in value &&
    'branding' in value &&
    'programs' in value &&
    'attendancePolicy' in value &&
    'hoursPolicy' in value &&
    'gradebookConfig' in value &&
    'assessmentDefaults' in value
  )
}
