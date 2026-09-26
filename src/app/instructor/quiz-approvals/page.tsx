import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import QuizApprovalQueueClient, { type QuizApprovalRequestRow } from './QuizApprovalQueueClient'
import { setQuizApprovalSettings } from './actions'
import { localChapters } from '@/lib/local-data'

export default async function QuizApprovalsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!profile?.school_id || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const [{ data: settings }, { data: requests }] = await Promise.all([
    supabase
      .from('quiz_approval_settings')
      .select('require_approval, auto_approve_when_ready')
      .eq('school_id', profile.school_id)
      .maybeSingle(),
    supabase
      .from('quiz_access_requests')
      .select('id, student_id, quiz_id, chapter_id, status, readiness_snapshot, requested_at')
      .eq('school_id', profile.school_id)
      .order('requested_at', { ascending: false })
      .limit(100),
  ])

  const requestRecords = (requests || []) as Array<{
    id: string
    student_id: string
    quiz_id: string
    chapter_id: string
    status: 'pending' | 'approved' | 'denied'
    readiness_snapshot: QuizApprovalRequestRow['readiness'] | null
    requested_at: string
  }>
  const studentIds = Array.from(new Set(requestRecords.map((request) => request.student_id)))
  const [{ data: students }, { data: studentRows }, { data: programs }] = await Promise.all([
    studentIds.length
      ? supabase.from('profiles').select('id, full_name').in('id', studentIds)
      : Promise.resolve({ data: [] as Array<{ id: string; full_name: string }> }),
    studentIds.length
      ? supabase
          .from('students')
          .select('id, profile_id')
          .eq('school_id', profile.school_id)
          .in('profile_id', studentIds)
      : Promise.resolve({ data: [] as Array<{ id: string; profile_id: string }> }),
    supabase
      .from('programs')
      .select('id, name')
      .eq('school_id', profile.school_id)
      .eq('is_active', true)
      .is('deleted_at', null)
      .order('name'),
  ])

  const studentRecords = (students || []) as Array<{ id: string; full_name: string }>
  const schoolStudentRows = (studentRows || []) as Array<{ id: string; profile_id: string }>
  const schoolStudentIds = schoolStudentRows.map((student) => student.id)

  const { data: enrollments } = schoolStudentIds.length
    ? await supabase
        .from('enrollments')
        .select('student_id, program_id')
        .in('student_id', schoolStudentIds)
        .eq('is_active', true)
        .is('deleted_at', null)
    : { data: [] as Array<{ student_id: string; program_id: string }> }

  const studentRowByProfile = new Map(
    schoolStudentRows.map((student) => [student.profile_id, student.id])
  )
  const programIdsByStudentRow = new Map<string, string[]>()
  for (const enrollment of (enrollments || []) as Array<{ student_id: string; program_id: string }>) {
    const current = programIdsByStudentRow.get(enrollment.student_id) || []
    current.push(enrollment.program_id)
    programIdsByStudentRow.set(enrollment.student_id, current)
  }

  const nameById = new Map(studentRecords.map((student) => [student.id, student.full_name]))
  const rows: QuizApprovalRequestRow[] = requestRecords.map((request) => {
    const studentRowId = studentRowByProfile.get(request.student_id)
    return {
      id: request.id,
      studentId: request.student_id,
      studentName: nameById.get(request.student_id) || 'Student',
      quizId: request.quiz_id,
      chapterId: request.chapter_id,
      status: request.status,
      requestedAt: request.requested_at,
      readiness: request.readiness_snapshot || {},
      programIds: studentRowId ? programIdsByStudentRow.get(studentRowId) || [] : [],
    }
  })

  const chapterOptions = localChapters
    .filter((chapter) => chapter.is_active)
    .sort((a, b) => a.chapter_number - b.chapter_number)
    .map((chapter) => ({
      id: chapter.id,
      number: chapter.chapter_number,
      title: chapter.title,
    }))

  const programOptions = ((programs || []) as Array<{ id: string; name: string }>).map((program) => ({
    id: program.id,
    name: program.name,
  }))

  const studentOptions = studentRecords
    .map((student) => ({ id: student.id, name: student.full_name }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-graphite bg-charcoal p-6 md:p-8">
        <p className="text-xs font-bold uppercase tracking-wide text-gold">Instructor Control</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Quiz Approvals</h1>
        <p className="mt-3 max-w-3xl text-silver">
          Require students to receive staff approval before opening chapter quizzes. Requests remain
          pending until approved or denied.
        </p>
      </section>

      <form action={setQuizApprovalSettings} className="rounded-2xl border border-graphite bg-charcoal p-6">
        <h2 className="text-lg font-semibold text-white">Approval Settings</h2>
        <div className="mt-4 space-y-4">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="requireApproval"
              defaultChecked={settings?.require_approval ?? false}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-medium text-white">Require instructor approval</span>
              <span className="text-sm text-silver">Locks chapter quizzes until access is approved.</span>
            </span>
          </label>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              name="autoApproveWhenReady"
              defaultChecked={settings?.auto_approve_when_ready ?? false}
              className="mt-1 h-4 w-4"
            />
            <span>
              <span className="block font-medium text-white">Auto-approve when ready</span>
              <span className="text-sm text-silver">
                Automatically approves a request when lesson, flashcards, and knowledge checks are complete.
              </span>
            </span>
          </label>
        </div>
        <button className="mt-5 rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black">
          Save settings
        </button>
      </form>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Student Requests</h2>
          <p className="text-sm text-silver">Approve individually, select several students, or approve the full pending queue.</p>
        </div>
        <QuizApprovalQueueClient
          requests={rows}
          chapters={chapterOptions}
          programs={programOptions}
          students={studentOptions}
        />
      </section>
    </div>
  )
}
