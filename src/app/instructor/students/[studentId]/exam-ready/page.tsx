import CoachingSearch from '@/components/instructor/CoachingSearch'
import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'

type CoachingItem = {
  position: number
  domain: string
  prompt: string
  options: Record<string, string>
  correctOption: string
  selectedOption: string | null
  explanation: string | null
  isScored: boolean
}

export const dynamic = 'force-dynamic'

type ExamAttemptSummary = {
  attemptId: string
  attemptNumber: number
  status: string
  completedAt: string | null
  scoredCorrect: number | null
  scoredTotal: number
  percentage: number | null
  passed: boolean | null
  domainBreakdown: Record<string, { correct: number; total: number; percentage: number }>
}

const labels: Record<string, string> = {
  scientific_concepts: 'Scientific Concepts',
  implements_equipment: 'Implements & Equipment',
  hair_care_services: 'Hair Care Services',
  facial_hair_skin_care_services: 'Facial Hair & Skin Care',
}

export default async function InstructorExamReadyResults({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(studentId)) notFound()

  const { data, error } = await supabase.rpc('get_assigned_student_comprehensive_exam_results', {
    p_student_id: studentId,
  })
  if (error) notFound()

  const { data: liveStatus } = await supabase.rpc('get_assigned_student_exam_live_status', { p_student_id: studentId })
  const live = (liveStatus && typeof liveStatus === 'object' && !Array.isArray(liveStatus) ? liveStatus : null) as null | {
    status: string; answeredCount: number; totalQuestions: number;
    remainingSeconds: number; lastAnsweredPosition: number | null
  }

  const attempts = (Array.isArray(data) ? data : []) as ExamAttemptSummary[]
  const coaching = await Promise.all(attempts.map(async (attempt) => {
    const response = await supabase.rpc('get_assigned_student_exam_coaching', {
      p_student_id: studentId,
      p_attempt_id: attempt.attemptId,
    })
    return { attemptId: attempt.attemptId, items: (!response.error && Array.isArray(response.data) ? response.data : []) as CoachingItem[] }
  }))

  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 space-y-5 px-3 py-5 sm:space-y-6 sm:px-6 sm:py-8 lg:px-8">
      <div>
        <h1 className="break-words text-xl font-bold sm:text-2xl">Exam Ready results</h1>
        <p className="text-sm text-gray-400">Read-only results from scored comprehensive exam attempts. These do not change chapter grades.</p>
      </div>
      <section className="space-y-2 rounded-xl border border-blue-500/40 p-3 sm:p-5" aria-label="Live Exam Monitor">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Live Exam Monitor</h2>
          <a href={`/instructor/students/${studentId}/exam-ready`} className="rounded-lg border px-4 py-2 text-sm">Refresh status</a>
        </div>
        {live ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <p>Exam status: <strong>{live.status}</strong></p>
            <p>Answered: <strong>{live.answeredCount}/{live.totalQuestions}</strong></p>
            <p>Time remaining: <strong>{Math.floor(live.remainingSeconds / 60)}m {live.remainingSeconds % 60}s</strong></p>
            <p className="sm:col-span-3 text-sm text-gray-400">Last answered question: {live.lastAnsweredPosition ?? 'None yet'}. This is not necessarily the question currently on screen. No live answer keys are shown.</p>
          </div>
        ) : <p className="text-sm text-gray-400">No active exam. Finalized exam results appear below.</p>}
      </section>
      <p className="text-sm text-gray-400">Instructor coaching is available only after a student completes an exam. Do not share answer keys during an active attempt. Hints below are general prompts and require academic review before broad use.</p>
      {attempts.length === 0 && <p>No completed practice exams recorded.</p>}
      {attempts.map((attempt) => (
        <section key={attempt.attemptId} className="min-w-0 space-y-3 overflow-hidden rounded-lg border p-3 sm:p-5">
          <h2 className="font-semibold">Attempt {attempt.attemptNumber}: {attempt.percentage ?? '—'}%</h2>
          <p className="text-sm">Scored: {attempt.scoredCorrect ?? '—'} / {attempt.scoredTotal} · {attempt.passed ? 'Passing' : 'Review recommended'} · {attempt.status}</p>
          <p className="text-xs text-gray-400">{attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString() : 'Date unavailable'}</p>
          <ul className="space-y-1">
            {Object.entries(attempt.domainBreakdown ?? {}).map(([domain, score]) => (
              <li key={domain} className="text-sm">{labels[domain] ?? domain}: {score.correct}/{score.total} ({score.percentage}%)</li>
            ))}
          </ul>
        </section>
      ))}
      <CoachingSearch attempts={coaching} />
    </main>
  )
}
