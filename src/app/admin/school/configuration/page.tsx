import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoSchoolConfiguration } from '@/lib/demo-data'
import { createDefaultSchoolConfiguration } from '@/lib/school-config/defaults'
import { SchoolConfiguration } from '@/types'
import SchoolConfigurationClient from '@/components/admin/school-config/SchoolConfigurationClient'
import BackButton from '@/components/ui/BackButton'

export default async function SchoolConfigurationPage() {
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

  const isDemo = isDemoFallbackEnabled()

  if (isDemo) {
    return (
      <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
        <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
        <div className="mt-6">
          <SchoolConfigurationClient initialConfig={demoSchoolConfiguration} isDemo={true} />
        </div>
      </div>
    )
  }

  // Production path: load the actual school and its settings.
  const [{ data: school }, { data: settingsRow, error: settingsError }] = await Promise.all([
    supabase.from('schools').select('*').eq('id', profile.school_id).single(),
    supabase
      .from('school_settings')
      .select('settings')
      .eq('school_id', profile.school_id)
      .maybeSingle(),
  ])

  if (settingsError && !isMissingTableError(settingsError)) {
    console.error('[SchoolConfiguration] Failed to load school_settings:', settingsError.message)
  }

  let configuration: SchoolConfiguration

  if (school && settingsRow?.settings && isSchoolConfiguration(settingsRow.settings)) {
    configuration = settingsRow.settings as SchoolConfiguration
  } else if (school) {
    // No saved settings yet — use production defaults derived from the real school.
    configuration = createDefaultSchoolConfiguration(school)
  } else {
    // School record missing; this should not happen for a properly assigned admin.
    // Show demo defaults with demo flag so the UI explains persistence is unavailable.
    return <SchoolConfigurationClient initialConfig={demoSchoolConfiguration} isDemo={true} />
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <BackButton fallbackHref="/admin" label="Back to admin dashboard" />
      <div className="mt-6">
        <SchoolConfigurationClient initialConfig={configuration} isDemo={false} />
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
