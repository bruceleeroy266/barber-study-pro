import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import QuizApprovalQueueClient, { type QuizApprovalRequestRow } from './QuizApprovalQueueClient'
import { setQuizApprovalSettings } from './actions'

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

  const studentIds = Array.from(new Set((requests || []).map((request) => request.student_id)))
  const { data: students } = studentIds.length
    ? await supabase.from('profiles').select('id, full_name').in('id', studentIds)
    : { data: [] as Array<{ id: string; full_name: string }> }

  const nameById = new Map((students || []).map((student) => [student.id, student.full_name]))
  const rows: QuizApprovalRequestRow[] = (requests || []).map((request) => ({
    id: request.id,
    studentId: request.student_id,
    studentName: nameById.get(request.student_id) || 'Student',
    quizId: request.quiz_id,
    chapterId: request.chapter_id,
    status: request.status,
    requestedAt: request.requested_at,
    readiness: request.readiness_snapshot || {},
  }))

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
        <QuizApprovalQueueClient requests={rows} />
      </section>
    </div>
  )
}
