import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt } from '@/types'
import { localChapters } from '@/lib/local-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts } from '@/lib/demo-data'

interface StudentDetailPageProps {
  params: Promise<{
    studentId: string
  }>
}

function formatDate(dateString: string | null): string {
  if (!dateString) return 'Never'
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatDaysAgo(dateString: string | null): string {
  if (!dateString) return 'Never'
  const days = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24))
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  return `${days} days ago`
}

function getReadinessEstimate(overallProgress: number, avgQuizScore: number): {
  label: string
  score: number
  color: string
} {
  // Weighted readiness score: 50% chapter completion + 50% quiz performance
  const score = Math.round(overallProgress * 0.5 + avgQuizScore * 0.5)

  if (score >= 85) return { label: 'Board Ready', score, color: 'text-green-400' }
  if (score >= 70) return { label: 'Almost Ready', score, color: 'text-blue-400' }
  if (score >= 50) return { label: 'On Track', score, color: 'text-yellow-400' }
  if (score >= 25) return { label: 'Needs Review', score, color: 'text-orange-400' }
  return { label: 'Getting Started', score, color: 'text-red-400' }
}

interface ChapterScore {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  score: number
  attempted: boolean
}

function computeChapterScores(
  chapters: { id: string; chapter_number: number; title: string }[],
  progressRecords: StudentProgress[]
): ChapterScore[] {
  return chapters.map((chapter) => {
    const progress = progressRecords.find((p) => p.chapter_id === chapter.id)
    const score = progress?.best_quiz_score ?? 0
    return {
      chapterId: chapter.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      score,
      attempted: score > 0,
    }
  })
}

function getBoardRisk(attemptedChapters: ChapterScore[]): {
  label: string
  color: string
  description: string
} {
  if (attemptedChapters.length === 0) {
    return {
      label: 'No Data',
      color: 'text-gray-400',
      description: 'Not enough quiz data to assess board readiness risk.',
    }
  }

  const anyCritical = attemptedChapters.some((c) => c.score < 60)
  const passingCount = attemptedChapters.filter((c) => c.score >= 75).length
  const passingRate = passingCount / attemptedChapters.length

  if (anyCritical || passingRate < 0.5) {
    return {
      label: 'High Risk',
      color: 'text-red-400',
      description: 'Multiple weak areas may affect board exam performance.',
    }
  }

  if (passingRate < 0.8 || attemptedChapters.some((c) => c.score < 75)) {
    return {
      label: 'Moderate Risk',
      color: 'text-yellow-400',
      description: 'Some topics need additional review before the board exam.',
    }
  }

  return {
    label: 'Low Risk',
    color: 'text-green-400',
    description: 'Strong quiz performance across attempted chapters.',
  }
}

export default async function StudentDetailPage({ params }: StudentDetailPageProps) {
  const { studentId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify instructor or admin
  const { data: instructorProfile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()

  // ── INSTRUCTOR ACCESS ENFORCEMENT (server component layer) ──
  // Defense-in-depth: verify the current user is an instructor or admin
  // before exposing any student detail data.
  if (!instructorProfile || !isInstructorOrAdmin(instructorProfile.role)) {
    redirect('/dashboard')
  }

  // Get student — must belong to same school and be a learner role
  const { data: student } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', studentId)
    .eq('school_id', instructorProfile.school_id)
    .in('role', ['student', 'apprentice'])
    .single() as { data: Profile | null; error: any }

  // Demo fallback: if real data is unavailable, check demo students
  let resolvedStudent: Profile | null = student
  if (!resolvedStudent) {
    resolvedStudent = demoStudents.find(
      (s) =>
        s.id === studentId &&
        (s.school_id === instructorProfile.school_id || !instructorProfile.school_id)
    ) || null
  }

  if (!resolvedStudent) {
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

  // Demo fallback for progress and attempts
  let progressRecords = progress || []
  let attemptRecords = attempts || []
  if (progressRecords.length === 0 && attemptRecords.length === 0) {
    progressRecords = demoStudentProgress.filter((p) => p.user_id === studentId)
    attemptRecords = demoStudentQuizAttempts.filter((a) => a.user_id === studentId)
    attemptRecords.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
  }

  const totalChapters = chapters?.length || 0
  const completedChapters = progressRecords.filter((p) => p.progress_percentage === 100).length
  const overallProgress = totalChapters > 0
    ? Math.round(progressRecords.reduce((sum, p) => sum + p.progress_percentage, 0) / totalChapters)
    : 0
  const flashcardsCompleted = progressRecords.filter((p) => p.flashcards_completed).length
  const quizzesCompleted = progressRecords.filter((p) => p.quiz_completed).length
  const avgQuizScore = attemptRecords.length > 0
    ? Math.round(attemptRecords.reduce((sum, a) => sum + a.percentage, 0) / attemptRecords.length)
    : 0

  // Last activity across all progress records
  const lastStudiedDates = progressRecords
    .map((p) => p.last_studied_at)
    .filter((d): d is string => !!d)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
  const lastActivityAt = lastStudiedDates[0] || null

  const readiness = getReadinessEstimate(overallProgress, avgQuizScore)

  // Weak area analytics
  const chapterScores = computeChapterScores(chapters, progressRecords)
  const attemptedChapters = chapterScores.filter((c) => c.attempted)
  const hasEnoughQuizData = attemptedChapters.length >= 2

  const sortedByScoreAsc = [...attemptedChapters].sort((a, b) => a.score - b.score)
  const sortedByScoreDesc = [...attemptedChapters].sort((a, b) => b.score - a.score)

  // Weak areas: bottom performers (relative weak areas)
  const weakAreaCount = Math.min(3, Math.floor(attemptedChapters.length / 2) + 1)
  const weakAreas = sortedByScoreAsc.slice(0, weakAreaCount)

  // Strong areas: top performers with score >= 80%
  const strongAreas = sortedByScoreDesc.filter((c) => c.score >= 80).slice(0, 3)

  const boardRisk = getBoardRisk(attemptedChapters)

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Back link */}
        <div>
          <Link
            href="/instructor"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#D4AF37] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to roster
          </Link>
        </div>

        {/* Student Summary Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[#D4AF37]">
                {resolvedStudent.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{resolvedStudent.full_name}</h1>
              <p className="text-gray-400">{resolvedStudent.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <span className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded capitalize">
                  {resolvedStudent.role}
                </span>
                <span className="text-gray-500">
                  Joined {formatDate(resolvedStudent.created_at)}
                </span>
                {lastActivityAt && (
                  <span className="text-gray-500">
                    Last active {formatDaysAgo(lastActivityAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              overallProgress >= 75 ? 'text-green-400' :
              overallProgress >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {overallProgress}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Overall Progress</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-[#D4AF37]">{completedChapters}</div>
            <div className="text-xs text-gray-400 mt-1">Chapters Done</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-purple-400">{flashcardsCompleted}</div>
            <div className="text-xs text-gray-400 mt-1">Flashcards Done</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-blue-400">{quizzesCompleted}</div>
            <div className="text-xs text-gray-400 mt-1">Quizzes Passed</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${avgQuizScore >= 75 ? 'text-green-400' : avgQuizScore >= 60 ? 'text-yellow-400' : avgQuizScore > 0 ? 'text-red-400' : 'text-gray-500'}`}>
              {avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Quiz Average</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${readiness.color}`}>{readiness.score}</div>
            <div className="text-xs text-gray-400 mt-1">{readiness.label}</div>
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Overall Course Progress</h2>
            <span className={`text-2xl font-bold ${
              overallProgress >= 75 ? 'text-green-400' :
              overallProgress >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {overallProgress}%
            </span>
          </div>
          <div className="bg-gray-800 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                overallProgress >= 75 ? 'bg-green-500' :
                overallProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {completedChapters} of {totalChapters} chapters completed
            {quizzesCompleted > 0 && ` • ${quizzesCompleted} quizzes passed`}
            {flashcardsCompleted > 0 && ` • ${flashcardsCompleted} flashcard decks completed`}
          </p>
        </div>

        {/* Chapter Progress */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Chapter-by-Chapter Progress</h2>
          </div>
          {chapters && chapters.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {chapters.map((chapter) => {
                const chapterProgress = progressRecords.find((p) => p.chapter_id === chapter.id)
                const pct = chapterProgress?.progress_percentage || 0
                const flashDone = chapterProgress?.flashcards_completed
                const quizDone = chapterProgress?.quiz_completed
                const bestScore = chapterProgress?.best_quiz_score

                return (
                  <div key={chapter.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-bold text-[#D4AF37] w-8 shrink-0">
                        {String(chapter.chapter_number).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{chapter.title}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-1">
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
                    <div className="flex items-center gap-3 w-full md:w-56">
                      <div className="flex-1 bg-gray-800 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= 75 ? 'bg-green-500' :
                            pct >= 50 ? 'bg-yellow-500' :
                            pct > 0 ? 'bg-[#D4AF37]' : 'bg-gray-700'
                          }`}
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

        {/* Flashcard Completion Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Flashcard Completion</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-gray-800 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${totalChapters > 0 ? (flashcardsCompleted / totalChapters) * 100 : 0}%` }}
              />
            </div>
            <span className="text-white font-semibold w-24 text-right">
              {flashcardsCompleted} / {totalChapters}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {flashcardsCompleted === 0
              ? 'No flashcard decks completed yet.'
              : flashcardsCompleted === totalChapters
              ? 'All flashcard decks completed.'
              : `${totalChapters - flashcardsCompleted} decks remaining.`}
          </p>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
            <span className="text-sm text-gray-500">{attemptRecords.length} total</span>
          </div>
          {attemptRecords.length > 0 ? (
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
                  {attemptRecords.map((attempt) => (
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
                        {formatDate(attempt.completed_at)}
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

        {/* Weak Areas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Weak Areas & Study Focus</h2>
          </div>

          {!hasEnoughQuizData ? (
            <div className="p-8 text-center text-gray-400">
              <p className="font-medium">Not enough quiz data yet</p>
              <p className="text-sm text-gray-500 mt-2">
                This student needs at least two completed chapter quizzes before weak-area analytics can be generated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {/* Board Risk Summary */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-sm text-gray-400">Board Exam Risk:</div>
                  <div className={`text-lg font-bold ${boardRisk.color}`}>{boardRisk.label}</div>
                </div>
                <p className="text-sm text-gray-500 mt-2">{boardRisk.description}</p>
              </div>

              {/* Weak Areas List */}
              {weakAreas.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-red-300 uppercase tracking-wide mb-4">
                    Weakest Areas
                  </h3>
                  <div className="space-y-3">
                    {weakAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-red-950/20 border border-red-900/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-gray-500">
                            {area.score < 75 ? 'Below passing threshold' : area.score < 80 ? 'Needs polish' : 'Lowest relative score'}
                          </p>
                        </div>
                        <div className={`text-xl font-bold ${
                          area.score >= 75 ? 'text-yellow-400' :
                          area.score >= 60 ? 'text-orange-400' : 'text-red-400'
                        }`}>
                          {area.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Strong Areas List */}
              {strongAreas.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-green-300 uppercase tracking-wide mb-4">
                    Strongest Areas
                  </h3>
                  <div className="space-y-3">
                    {strongAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-green-950/20 border border-green-900/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-gray-500">Strong performance</p>
                        </div>
                        <div className="text-xl font-bold text-green-400">{area.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Study Focus */}
              {weakAreas.length > 0 && (
                <div className="p-6 bg-[#D4AF37]/5">
                  <h3 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-wide mb-3">
                    Recommended Study Focus
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">
                    Prioritize review in these areas to improve board readiness:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-gray-300">
                    {weakAreas.slice(0, 3).map((area) => (
                      <li key={area.chapterId}>
                        <span className="font-medium text-white">
                          Chapter {area.chapterNumber} — {area.chapterTitle}
                        </span>
                        <span className="text-gray-500 ml-2">(current best: {area.score}%)</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {weakAreas.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No weak areas found — all attempted chapters are performing strongly.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
