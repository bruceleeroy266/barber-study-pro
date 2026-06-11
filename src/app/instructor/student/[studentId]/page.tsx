import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt } from '@/types'
import { localChapters } from '@/lib/local-data'

interface StudentDetailPageProps {
  params: Promise<{
    studentId: string
  }>
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify instructor
  const { data: instructorProfile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  if (!instructorProfile || (instructorProfile.role !== 'instructor' && instructorProfile.role !== 'admin')) {
    redirect('/dashboard')
  }

  // Get student — must belong to same school
  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .eq('school_id', instructorProfile.school_id)
    .eq('role', 'student')
    .single() as { data: Profile | null; error: any }

  if (!student) {
    notFound()
  }

  // Use local chapters (not Supabase)
  const chapters = localChapters

  // Get student progress
  const { data: progress } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', studentId) as { data: StudentProgress[] | null; error: any }

  // Get quiz attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', studentId)
    .order('completed_at', { ascending: false }) as { data: QuizAttempt[] | null; error: any }

  const totalChapters = chapters?.length || 0
  const completedChapters = progress?.filter((p) => p.progress_percentage === 100).length || 0
  const avgQuizScore = attempts && attempts.length > 0
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
    : 0

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/instructor" className="hover:text-[#D4AF37] transition-colors">
            Instructor Dashboard
          </Link>
          <span>/</span>
          <span className="text-white">{student.full_name}</span>
        </div>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{student.full_name}</h1>
          <p className="text-gray-400">{student.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#D4AF37]">{completedChapters}</div>
            <div className="text-sm text-gray-400">Chapters Completed</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{totalChapters - completedChapters}</div>
            <div className="text-sm text-gray-400">Remaining</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className={`text-3xl font-bold ${avgQuizScore >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>
              {avgQuizScore}%
            </div>
            <div className="text-sm text-gray-400">Avg Quiz Score</div>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-purple-400">{attempts?.length || 0}</div>
            <div className="text-sm text-gray-400">Quiz Attempts</div>
          </div>
        </div>

        {/* Chapter Progress */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Chapter Progress</h2>
          </div>
          {chapters && chapters.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {chapters.map((chapter) => {
                const chapterProgress = progress?.find((p) => p.chapter_id === chapter.id)
                const pct = chapterProgress?.progress_percentage || 0
                const flashDone = chapterProgress?.flashcards_completed
                const quizDone = chapterProgress?.quiz_completed
                const bestScore = chapterProgress?.best_quiz_score

                return (
                  <div key={chapter.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#D4AF37] w-8">
                        {String(chapter.chapter_number).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-white font-medium">{chapter.title}</p>
                        <div className="flex gap-3 text-xs text-gray-400 mt-1">
                          <span className={flashDone ? 'text-green-400' : ''}>
                            {flashDone ? '✓ Flashcards' : '○ Flashcards'}
                          </span>
                          <span className={quizDone ? 'text-green-400' : ''}>
                            {quizDone ? '✓ Quiz' : '○ Quiz'}
                          </span>
                          {bestScore !== null && bestScore !== undefined && (
                            <span className={bestScore >= 75 ? 'text-green-400' : 'text-yellow-400'}>
                              Best: {bestScore}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-48">
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className="bg-[#D4AF37] h-2 rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-400 w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">No chapters available.</div>
          )}
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
          </div>
          {attempts && attempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Quiz</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Percentage</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-800/50">
                      <td className="p-4 text-white">{attempt.quiz_id}</td>
                      <td className="p-4 text-gray-300">
                        {attempt.score} / {attempt.total_questions}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            attempt.percentage >= 75 ? 'text-green-400' : 'text-yellow-400'
                          }`}
                        >
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">No quiz attempts yet.</div>
          )}
        </div>
      </div>
    </div>
  )
}
