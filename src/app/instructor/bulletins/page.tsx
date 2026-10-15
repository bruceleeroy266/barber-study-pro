import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import BulletinManager, {
  type BulletinAudienceOption,
} from '@/components/messaging/BulletinManager'
import { loadManagedBulletins } from '@/app/communications/bulletin-actions'
import BackButton from '@/components/ui/BackButton'
import { resolveSupportAccessContext } from '@/lib/support-access'

interface AssignmentRow {
  student_id: string
}

interface StudentRow {
  id: string
  full_name: string
}

export const dynamic = 'force-dynamic'

export default async function InstructorBulletinsPage() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (profile.role !== 'instructor' || !profile.school_id) {
    redirect(context.supportActive ? '/admin/support-access' : '/instructor')
  }

  const managedResult = await loadManagedBulletins()
  const initialBulletins = managedResult.success ? managedResult.data : []

  const { data: assignments } = await supabase
    .from('student_instructor_assignments')
    .select('student_id')
    .eq('school_id', profile.school_id)
    .eq('instructor_id', profile.id)
    .eq('is_active', true)
    .is('ended_at', null)

  const studentIds = (assignments || []).map(
    (assignment: AssignmentRow) => assignment.student_id
  )

  let students: StudentRow[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('profiles')
      .select('id, full_name')
      .eq('school_id', profile.school_id)
      .in('id', studentIds)

    students = (data || []) as StudentRow[]
  }

  const audienceOptions: BulletinAudienceOption[] = students.map((student) => ({
    id: student.id,
    name: student.full_name,
    kind: 'student',
  }))

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
      <div className="max-w-6xl mx-auto mt-6 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">Communications</h1>
            <p className="text-silver">Publish one-way bulletins to your assigned students.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/instructor/messages" className="rounded-lg border border-graphite px-4 py-2 text-sm text-silver">
              Messages
            </Link>
            <Link href="/instructor/bulletins" className="rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 text-sm font-semibold text-black">
              Bulletins
            </Link>
          </div>
        </div>

        <BulletinManager
          role="instructor"
          initialBulletins={initialBulletins}
          audienceOptions={audienceOptions}
        />
      </div>
    </div>
  )
}
