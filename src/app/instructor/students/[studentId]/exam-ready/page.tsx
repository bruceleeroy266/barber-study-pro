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

const coachingPrompts: Record<string, string[]> = {
  scientific_concepts: ['Which scientific principle applies here?', 'What safety or biological process should you recall?', 'Explain the underlying concept without choosing an option.'],
  implements_equipment: ['What is the main purpose of the tool?', 'Which usage or sanitation precaution applies?', 'Talk through the safest professional technique.'],
  hair_care_services: ['Which hair characteristic or service step matters?', 'What could go wrong if the procedure is incorrect?', 'Explain the safest sequence of service steps.'],
  facial_hair_skin_care_services: ['Which skin or facial-hair concern matters?', 'What does client safety require here?', 'Describe the safe service principle in your own words.'],
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

  const attempts = (Array.isArray(data) ? data : []) as ExamAttemptSummary[]
  const coaching = await Promise.all(attempts.map(async (attempt) => {
    const response = await supabase.rpc('get_assigned_student_exam_coaching', {
      p_student_id: studentId,
      p_attempt_id: attempt.attemptId,
    })
    return { attemptId: attempt.attemptId, items: (!response.error && Array.isArray(response.data) ? response.data : []) as CoachingItem[] }
  }))

  return (
    <main className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Exam Ready results</h1>
        <p className="text-sm text-gray-400">Read-only results from scored comprehensive exam attempts. These do not change chapter grades.</p>
      </div>
      <p className="text-sm text-gray-400">Instructor coaching is available only after a student completes an exam. Do not share answer keys during an active attempt. Hints below are general prompts and require academic review before broad use.</p>
      {attempts.length === 0 && <p>No completed practice exams recorded.</p>}
      {attempts.map((attempt) => (
        <section key={attempt.attemptId} className="space-y-3 rounded-lg border p-4">
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
