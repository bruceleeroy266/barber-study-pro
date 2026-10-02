import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import BulletinManager, {
  type BulletinAudienceOption,
} from '@/components/messaging/BulletinManager'
import { loadManagedBulletins } from '@/app/communications/bulletin-actions'
import { isAdmin, isSchoolAdmin } from '@/lib/auth-helpers'

interface NamedRow {
  id: string
  name?: string
  full_name?: string
}

export const dynamic = 'force-dynamic'

export default async function AdminBulletinsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, school_id, role')
    .eq('id', user.id)
    .single()

  if (
    !profile ||
    !(isAdmin(profile.role) || isSchoolAdmin(profile.role)) ||
    !profile.school_id
  ) {
    redirect('/admin')
  }

  const managedResult = await loadManagedBulletins()
  const initialBulletins = managedResult.success ? managedResult.data : []

  const [studentsResult, programsResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('school_id', profile.school_id)
      .in('role', ['student', 'apprentice']),
    supabase
      .from('programs')
      .select('id, name')
      .eq('school_id', profile.school_id),
  ])

  const studentOptions: BulletinAudienceOption[] = (
    (studentsResult.data || []) as NamedRow[]
  ).map((student) => ({
    id: student.id,
    name: student.full_name || 'Student',
    kind: 'student',
  }))

  const programOptions: BulletinAudienceOption[] = (
    (programsResult.data || []) as NamedRow[]
  ).map((program) => ({
    id: program.id,
    name: program.name || 'Program',
    kind: 'program',
  }))

  return (
    <div className="p-6 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Bulletins</h1>
          <p className="text-silver">
            Publish school, program, or selected-student announcements.
          </p>
        </div>

        <BulletinManager
          role={profile.role === 'school_admin' ? 'school_admin' : 'admin'}
          initialBulletins={initialBulletins}
          audienceOptions={[...programOptions, ...studentOptions]}
        />
      </div>
    </div>
  )
}
