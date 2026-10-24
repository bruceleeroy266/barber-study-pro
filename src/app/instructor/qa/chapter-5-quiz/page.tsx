import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { getLocalQuizQuestions } from '@/lib/local-data'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const targetIds = ['qq-5-002', 'qq-5-003', 'qq-5-023', 'qq-5-026', 'qq-5-030'] as const
const choices = ['a', 'b', 'c', 'd'] as const

/**
 * Staff-only, read-only inspection of the canonical Chapter 5 premium bank.
 * No student impersonation, grade calculation, attempt/session creation,
 * client-side answer mutations, or database writes occur in this route.
 */
export default async function Chapter5QuizQaPreview() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role, school_id, is_disabled, approval_status')
    .eq('id', user.id)
    .single()
  if (error || !profile || !profile.school_id || profile.is_disabled ||
      profile.approval_status !== 'approved' || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const bank = getLocalQuizQuestions('quiz-5')
  const questions = targetIds.map(id => bank.find(q => q.id === id))
  if (questions.some(q => !q)) {
    throw new Error('Chapter 5 QA preview bank integrity check failed')
  }

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
      <header className="rounded-xl border border-yellow-600/40 bg-neutral-900 p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-yellow-400">Staff QA · Read-only</p>
        <h1 className="mt-2 text-2xl font-bold text-white">Chapter 5 Premium Quiz — Source Preview</h1>
        <p className="mt-2 text-sm text-neutral-300">
          Canonical quiz-5 bank · {bank.length} questions · displaying five PR #450 corrections.
          This view does not begin a quiz, change scores, or record answers.
        </p>
      </header>
      {questions.map(question => question && (
        <section key={question.id} data-testid={`qa-preview-${question.id}`} className="rounded-xl border border-neutral-700 bg-neutral-900 p-6">
          <p className="text-xs font-mono text-yellow-400">{question.id} · order {question.order_index}</p>
          <h2 className="mt-2 text-lg font-semibold text-white">{question.question}</h2>
          <ol className="mt-4 space-y-2">
            {choices.map(letter => (
              <li key={letter} className={`rounded-md border p-3 text-sm ${letter === question.correct_answer ? 'border-green-500 text-green-200' : 'border-neutral-700 text-neutral-200'}`}>
                <strong>{letter.toUpperCase()}.</strong> {question[`answer_${letter}`]}
                {letter === question.correct_answer ? <span className="ml-2 text-green-300">(source key)</span> : null}
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm text-neutral-300"><strong>Explanation:</strong> {question.explanation}</p>
        </section>
      ))}
    </main>
  )
}
