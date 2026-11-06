import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-server'

/**
 * Elevate-only, read-only shared barber progress.
 * This is deliberately separate from canonical instructor assignments:
 * assignments continue to gate student detail, edits and communications.
 */
const ELEVATE_SCHOOL_ID = '289a29f8-123f-4d71-b99d-a1bf6c15853c'

export default async function ElevateBarberProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: staff, error: staffError } = await supabase
    .from('profiles')
    .select('id, role, school_id, approval_status, is_disabled')
    .eq('id', user.id)
    .single()

  // No cross-school, unapproved or disabled access. No support-mode impersonation.
  if (
    staffError || !staff ||
    staff.school_id !== ELEVATE_SCHOOL_ID ||
    !['instructor', 'school_admin', 'admin'].includes(staff.role) ||
    staff.approval_status !== 'approved' ||
    staff.is_disabled
  ) redirect('/dashboard')

  // Use active BARBER enrollments, never school-wide profiles: Elevate also
  // teaches cosmetology. A student with both programs may appear appropriately.
  const { data: programs, error: programError } = await supabase
    .from('programs')
    .select('id, name')
    .eq('school_id', ELEVATE_SCHOOL_ID)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (programError) throw new Error('Unable to load Elevate programs')
  const barberProgramIds = ((programs ?? []) as Array<{ id: string; name: string }>)
    .filter((program) => /barber/i.test(program.name))
    .map((program) => program.id)

  const { data: studentRecords, error: studentsError } = await supabase
    .from('students')
    .select('id, profile_id')
    .eq('school_id', ELEVATE_SCHOOL_ID)
    .eq('is_active', true)
    .is('deleted_at', null)

  if (studentsError) throw new Error('Unable to load Elevate students')
  const studentRecordIds = ((studentRecords ?? []) as Array<{ id: string; profile_id: string | null }>).map((student) => student.id)
  const { data: enrollments, error: enrollmentError } = barberProgramIds.length && studentRecordIds.length
    ? await supabase
        .from('enrollments')
        .select('student_id')
        .in('student_id', studentRecordIds)
        .in('program_id', barberProgramIds)
        .eq('is_active', true)
        .eq('status', 'active')
        .is('deleted_at', null)
    : { data: [], error: null }

  if (enrollmentError) throw new Error('Unable to load active barber enrollments')
  const enrolledRecordIds = new Set(((enrollments ?? []) as Array<{ student_id: string }>).map((row) => row.student_id))
  const profileIds = [...new Set(
    ((studentRecords ?? []) as Array<{ id: string; profile_id: string | null }>)
      .filter((student) => enrolledRecordIds.has(student.id))
      .map((student) => student.profile_id)
      .filter((id): id is string => typeof id === 'string')
  )]

  const { data: profiles, error: profilesError } = profileIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, role, school_id, is_disabled, approval_status')
        .in('id', profileIds)
        .eq('school_id', ELEVATE_SCHOOL_ID)
        .in('role', ['student', 'apprentice'])
        .eq('approval_status', 'approved')
        .eq('is_disabled', false)
    : { data: [], error: null }

  if (profilesError) throw new Error('Unable to load barber learner profiles')
  const learners = ((profiles ?? []) as Array<{ id: string; full_name: string | null; role: string; school_id: string; is_disabled: boolean; approval_status: string }>).sort((a, b) =>
    (a.full_name ?? '').localeCompare(b.full_name ?? '')
  )
  const ids = learners.map((learner) => learner.id)

  const { data: progress, error: progressError } = ids.length
    ? await supabase.from('student_progress')
        .select('user_id, chapter_id, progress_percentage, quiz_completed, best_quiz_score, last_studied_at')
        .in('user_id', ids)
    : { data: [], error: null }
  const { data: attempts, error: attemptsError } = ids.length
    ? await supabase.from('quiz_attempts')
        .select('user_id, quiz_id, percentage, completed_at')
        .in('user_id', ids)
    : { data: [], error: null }

  // Do not silently display misleading zeros if data retrieval fails.
  if (progressError || attemptsError) throw new Error('Unable to load learning metrics')

  const rows = learners.map((learner) => {
    const chapters = ((progress ?? []) as Array<{ user_id: string; chapter_id: string; progress_percentage: number | null; quiz_completed: boolean; best_quiz_score: number | null; last_studied_at: string | null }>).filter((row) => row.user_id === learner.id)
    const quizzes = ((attempts ?? []) as Array<{ user_id: string; quiz_id: string; percentage: number | null; completed_at: string | null }>).filter((row) => row.user_id === learner.id)
    const gradedQuizzes = quizzes.filter((row) => typeof row.percentage === 'number')
    const quizAverage = gradedQuizzes.length
      ? Math.round(gradedQuizzes.reduce((sum, row) => sum + (typeof row.percentage === 'number' ? row.percentage : 0), 0) / gradedQuizzes.length)
      : null
    const completed = chapters.filter((row) => row.progress_percentage === 100).length
    const latest = [
      ...chapters.map((row) => row.last_studied_at),
      ...quizzes.map((row) => row.completed_at),
    ].filter((date): date is string => typeof date === 'string').sort().at(-1) ?? null

    return { ...learner, completed, quizAverage, attempts: quizzes.length, latest }
  })

  return (
    <main className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <Link href="/instructor/students" className="text-sm text-gold hover:underline">
          ← Back to Students
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-white">Elevate Barber Progress</h1>
          <p className="mt-2 text-[var(--color-text-muted)]">
            Shared, read-only progress for active Elevate barber enrollments.
            Primary instructor assignments and management permissions are unchanged.
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border-primary)] p-4 text-sm text-white">
          {rows.length} active barber learners · Shared progress view
        </div>
        <div className="overflow-x-auto rounded-xl border border-[var(--color-border-primary)]">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-[var(--color-background-secondary)] text-white">
              <tr>
                <th className="p-4">Student</th>
                <th className="p-4">Completed chapters</th>
                <th className="p-4">Quiz attempts</th>
                <th className="p-4">Average quiz score</th>
                <th className="p-4">Last learning evidence</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-[var(--color-border-primary)] text-white">
                  <td className="p-4 font-medium">{row.full_name || 'Unnamed student'}</td>
                  <td className="p-4">{row.completed}</td>
                  <td className="p-4">{row.attempts}</td>
                  <td className="p-4">{row.quizAverage === null ? 'No graded attempts' : `${row.quizAverage}%`}</td>
                  <td className="p-4">{row.latest ? new Date(row.latest).toLocaleDateString('en-US', { timeZone: 'America/Chicago' }) : 'No evidence'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr><td colSpan={5} className="p-6 text-[var(--color-text-muted)]">No active barber enrollments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
