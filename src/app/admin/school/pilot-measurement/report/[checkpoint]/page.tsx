import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAdmin, isSchoolAdmin, isPlatformAdminProfile } from '@/lib/auth-helpers'
import PilotCheckpointReport from '@/components/pilot-measurement/PilotCheckpointReport'
import type { PilotCheckpointType } from '@/lib/pilot-measurement/resolver'

const valid = new Set<PilotCheckpointType>(['baseline','day_30','day_60','day_90'])

export default async function AdminPilotReportPage({
  params,
  searchParams,
}: {
  params: Promise<{ checkpoint: string }>
  searchParams: Promise<{ school?: string }>
}) {
  const { checkpoint } = await params
  if (!valid.has(checkpoint as PilotCheckpointType)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role))) redirect('/dashboard')

  let schoolId = profile.school_id
  if (isPlatformAdminProfile(profile)) {
    const { school } = await searchParams
    if (!school) redirect('/admin/school/pilot-measurement')

    const { data: targetSchool } = await supabase
      .from('schools')
      .select('id')
      .eq('id', school)
      .eq('is_active', true)
      .is('deleted_at', null)
      .maybeSingle()

    if (!targetSchool) redirect('/admin/school/pilot-measurement')
    schoolId = targetSchool.id
  }

  if (!schoolId) redirect('/dashboard')

  return <PilotCheckpointReport schoolId={schoolId} checkpointType={checkpoint as PilotCheckpointType} />
}
