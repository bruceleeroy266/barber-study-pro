import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { demoSchoolConfiguration } from '@/lib/demo-data'
import { SchoolConfiguration } from '@/types'
import SchoolConfigurationClient from '@/components/admin/school-config/SchoolConfigurationClient'

export default async function SchoolConfigurationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const isDemo = isDemoFallbackEnabled()

  // Phase 12 uses demo configuration until school_settings table is available.
  const configuration: SchoolConfiguration = demoSchoolConfiguration

  return <SchoolConfigurationClient initialConfig={configuration} isDemo={isDemo} />
}
