import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'
import PilotCheckpointReport from '@/components/pilot-measurement/PilotCheckpointReport'
import type { PilotCheckpointType } from '@/lib/pilot-measurement/resolver'

const valid = new Set<PilotCheckpointType>(['baseline','day_30','day_60','day_90'])

export default async function SchoolPilotReportPage({
  params,
}: {
  params: Promise<{ checkpoint: string }>
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

  if (!profile || !(isAdmin(profile.role) || isSchoolAdmin(profile.role)) || !profile.school_id) {
    redirect('/dashboard')
  }

  return <PilotCheckpointReport schoolId={profile.school_id} checkpointType={checkpoint as PilotCheckpointType} />
}
