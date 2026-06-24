import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { QuizAttempt, StudentProgress } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { buildMissedQuestions } from '@/lib/analytics'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { buildWeakAreaQuiz } from '@/lib/missed-questions'
import QuizClient from '@/components/QuizClient'

export default async function RetestWeakAreasPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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

  let missed = buildMissedQuestions({
    userId: user.id,
    attempts: (attemptsData as QuizAttempt[]) || [],
    progress: (progressData as StudentProgress[]) || [],
    chapters,
    questions,
  })
  if (missed.length === 0) {
    missed = getDemoMissedQuestionsForUser(user.id)
  }

  if (missed.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">Retest Weak Areas</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-lg">No missed questions to retest.</p>
          <p className="text-sm text-gray-500 mt-2">
            Complete some quizzes first — your missed questions will appear here.
          </p>
        </div>
      </div>
    )
  }

  const quizQuestions = buildWeakAreaQuiz(missed, 20)
  const quiz = {
    id: 'weak-area-quiz',
    chapter_id: 'weak-areas',
    title: 'Weak Area Retest',
    description: 'Questions from your missed question bank',
    is_active: true,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Retest Weak Areas</h1>
        <p className="text-gray-400">
          {quizQuestions.length} question{quizQuestions.length === 1 ? '' : 's'} from your missed question bank.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <QuizClient
          quiz={quiz}
          questions={quizQuestions}
          chapterId="weak-areas"
          userId={user.id}
          bestAttempt={null}
        />
      </div>
    </div>
  )
}
