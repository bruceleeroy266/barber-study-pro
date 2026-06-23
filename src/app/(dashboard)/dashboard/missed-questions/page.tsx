import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { QuizAttempt, StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { analyzePerformance } from '@/lib/analytics'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import MissedQuestionBank from '@/components/MissedQuestionBank'
import { AlertCircle } from 'lucide-react'

export default async function MissedQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const chapters = localChapters
  const questions = Object.values(allQuizQuestions).flat()

  // Fetch attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false }) as { data: QuizAttempt[] | null; error: any }

  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', user.id) as { data: StudentProgress[] | null; error: any }

  const attemptRecords = attempts || []
  const progressRecords = progress || []

  // Derive missed questions from attempts
  const analytics = analyzePerformance({
    userId: user.id,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })

  let missedQuestions = analytics.missedQuestionTrend.length > 0
    ? analytics.missedQuestionTrend as unknown as typeof analytics.missedQuestionTrend
    : []

  // Wait, we need the actual missed questions, not just trend.
  // Re-derive explicitly.
  const { buildMissedQuestions } = await import('@/lib/analytics')
  let missed = buildMissedQuestions({
    userId: user.id,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })

  // Demo fallback
  if (missed.length === 0) {
    missed = getDemoMissedQuestionsForUser(user.id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Missed Question Bank</h1>
        <p className="text-gray-400">
          Review questions you missed, filter by chapter or category, and retest your weak areas.
        </p>
      </div>

      <div className="bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[#D4AF37] shrink-0 mt-0.5" />
        <div>
          <p className="text-white font-medium">How this works</p>
          <p className="text-sm text-gray-400">
            Every time you complete a quiz, missed questions are added here. Use the filters to focus
            on specific chapters, then click “Retest Weak Areas” to practice only the questions you
            got wrong.
          </p>
        </div>
      </div>

      <MissedQuestionBank questions={missed} />
    </div>
  )
}
