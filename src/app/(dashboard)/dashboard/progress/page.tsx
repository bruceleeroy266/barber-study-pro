import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Chapter, StudentProgress, QuizAttempt } from '@/types'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get all chapters
  const { data: chapters } = await supabase
    .from('chapters')
    .select('*')
    .eq('is_active', true)
    .order('chapter_number', { ascending: true }) as { data: Chapter[] | null; error: any }

  // Get user progress
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', user?.id) as { data: StudentProgress[] | null; error: any }

  // Get quiz attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*, quizzes(chapter_id)')
    .eq('user_id', user?.id)
    .order('completed_at', { ascending: false }) as { data: QuizAttempt[] | null; error: any }

  // Calculate stats
  const totalChapters = chapters?.length || 0
  const completedChapters = progress?.filter(p => p.progress_percentage === 100).length || 0
  const flashcardsCompleted = progress?.filter(p => p.flashcards_completed).length || 0
  const quizzesCompleted = progress?.filter(p => p.quiz_completed).length || 0
  const averageQuizScore = attempts?.length
    ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
    : 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">My Progress</h1>
        <p className="text-gray-400">Track your learning journey</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-[#D4AF37] mb-1">
            {Math.round(((completedChapters / totalChapters) * 100) || 0)}%
          </div>
          <div className="text-sm text-gray-400">Overall Progress</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-blue-400 mb-1">{flashcardsCompleted}</div>
          <div className="text-sm text-gray-400">Flashcards Done</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-green-400 mb-1">{quizzesCompleted}</div>
          <div className="text-sm text-gray-400">Quizzes Passed</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
          <div className="text-3xl font-bold text-purple-400 mb-1">{averageQuizScore}%</div>
          <div className="text-sm text-gray-400">Avg Quiz Score</div>
        </div>
      </div>

      {/* Chapter Progress */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6">Chapter Progress</h2>
        
        <div className="space-y-4">
          {chapters?.map((chapter) => {
            const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
            const progressPercent = chapterProgress?.progress_percentage || 0
            
            return (
              <div key={chapter.id} className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500 w-8">
                  {String(chapter.chapter_number).padStart(2, '0')}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{chapter.title}</span>
                    <span className="text-gray-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2">
                    <div
                      className="bg-[#D4AF37] h-2 rounded-full transition-all"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  {chapterProgress?.flashcards_completed && (
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 rounded">Flashcards</span>
                  )}
                  {chapterProgress?.quiz_completed && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded">Quiz</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Quiz Attempts */}
      {attempts && attempts.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Recent Quiz Attempts</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Score</th>
                  <th className="pb-3">Percentage</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {attempts.slice(0, 10).map((attempt) => (
                  <tr key={attempt.id} className="border-b border-gray-800/50">
                    <td className="py-3 text-gray-300">
                      {new Date(attempt.completed_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 text-white">
                      {attempt.score}/{attempt.total_questions}
                    </td>
                    <td className="py-3">
                      <span className={`font-medium ${
                        attempt.percentage >= 70 ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {attempt.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
