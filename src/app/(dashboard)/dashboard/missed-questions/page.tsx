import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { MissedQuestion, QuizAttempt, StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'

import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import MissedQuestionBank from '@/components/MissedQuestionBank'
import { AlertCircle } from 'lucide-react'

interface DbMissedQuestion {
  id: string
  user_id: string
  question_id: string
  quiz_id: string
  question_text: string
  correct_answer: string
  student_answer: string
  explanation: string | null
  chapter_id: string | null
  chapter_number: number | null
  category: string | null
  times_missed: number
  missed_at: string
  retaken_at: string | null
}

function dbToMissedQuestion(row: DbMissedQuestion): MissedQuestion {
  return {
    id: row.id,
    userId: row.user_id,
    questionId: row.question_id,
    quizId: row.quiz_id,
    question: row.question_text,
    correctAnswer: row.correct_answer,
    studentAnswer: row.student_answer,
    explanation: row.explanation,
    chapterId: row.chapter_id ?? '',
    chapterNumber: row.chapter_number ?? 0,
    category: row.category ?? 'General',
    missedAt: row.missed_at,
    retakenAt: row.retaken_at,
    timesMissed: row.times_missed,
  }
}

export default async function MissedQuestionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Primary source: persisted missed questions in Supabase.
  const { data: missedRows, error: missedError } = await supabase
    .from('missed_questions')
    .select('*')
    .eq('user_id', user.id)
    .order('missed_at', { ascending: false })

  let missed: MissedQuestion[] =
    (missedRows as DbMissedQuestion[] | null)?.map(dbToMissedQuestion) ?? []

  // Fallback 1: derive from quiz attempts if no persisted records yet.
  if (missed.length === 0) {
    const chapters = localChapters
    const questions = Object.values(allQuizQuestions).flat()

    const { data: attemptsData } = await supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    const { data: progressData } = await supabase
      .from('student_progress')
      .select('*')
      .eq('user_id', user.id)

    const attemptRecords: QuizAttempt[] = attemptsData || []
    const progressRecords: StudentProgress[] = progressData || []

    const { buildMissedQuestions } = await import('@/lib/analytics')
    missed = buildMissedQuestions({
      userId: user.id,
      attempts: attemptRecords,
      progress: progressRecords,
      chapters,
      questions,
    })
  }

  // Fallback 2: demo data for preview purposes.
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
