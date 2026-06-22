import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt } from '@/types'
import { localChapters } from '@/lib/local-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts } from '@/lib/demo-data'

interface RosterStudent extends Profile {
  overallProgress: number
  lastStudiedAt: string | null
  avgQuizScore: number
  quizzesTaken: number
  completedChapters: number
  daysSinceActive: number | null
  readinessScore: number
  readinessLabel: string
}

interface ChapterClassScore {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  avgScore: number
  studentCount: number
}

interface InstructorDashboardProps {
  searchParams: Promise<{ q?: string }>
}

const ACTIVE_DAYS = 7

function computeStudentStats(
  students: Profile[],
  allProgress: StudentProgress[],
  allAttempts: QuizAttempt[],
  chaptersCount: number
): RosterStudent[] {
  return students.map((student) => {
    const progress = allProgress.filter((p) => p.user_id === student.id)
    const attempts = allAttempts.filter((a) => a.user_id === student.id)

    const completedChapters = progress.filter((p) => p.progress_percentage === 100).length
    const totalProgressSum = progress.reduce((sum, p) => sum + p.progress_percentage, 0)
    const overallProgress = chaptersCount > 0 ? Math.round(totalProgressSum / chaptersCount) : 0

    const avgQuizScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0

    const lastStudiedDates = progress
      .map((p) => p.last_studied_at)
      .filter((d): d is string => !!d)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const lastStudiedAt = lastStudiedDates[0] || null

    const daysSinceActive = lastStudiedAt
      ? Math.floor((Date.now() - new Date(lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24))
      : null

    const readinessScore = Math.round(overallProgress * 0.5 + avgQuizScore * 0.5)
    const readinessLabel =
      readinessScore >= 85 ? 'Board Ready' :
      readinessScore >= 70 ? 'Almost Ready' :
      readinessScore >= 50 ? 'On Track' :
      readinessScore >= 25 ? 'Needs Review' : 'Getting Started'

    return {
      ...student,
      overallProgress,
      lastStudiedAt,
      avgQuizScore,
      quizzesTaken: attempts.length,
      completedChapters,
      daysSinceActive,
      readinessScore,
      readinessLabel,
    }
  })
}

function computeChapterClassScores(
  chapters: { id: string; chapter_number: number; title: string }[],
  progressRecords: StudentProgress[]
): ChapterClassScore[] {
  return chapters
    .map((chapter) => {
      const chapterProgress = progressRecords.filter((p) => p.chapter_id === chapter.id)
      const attempted = chapterProgress.filter((p) => p.best_quiz_score !== null && p.best_quiz_score > 0)
      const avgScore = attempted.length > 0
        ? Math.round(attempted.reduce((sum, p) => sum + (p.best_quiz_score ?? 0), 0) / attempted.length)
        : 0
      return {
        chapterId: chapter.id,
        chapterNumber: chapter.chapter_number,
        chapterTitle: chapter.title,
        avgScore,
        studentCount: attempted.length,
      }
    })
    .filter((c) => c.studentCount > 0)
}

function isDemoFallbackEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') return true
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const configured =
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20
  return !configured
}

export default async function InstructorDashboard({ searchParams }: InstructorDashboardProps) {
  const { q } = await searchParams
  const searchQuery = (q || '').trim().toLowerCase()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify instructor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, full_name, schools(*)')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  const schoolId = profile.school_id
  const schoolName = (profile.schools as { name?: string } | null)?.name || 'Your School'

  // Fetch students in the same school
  const { data: students, error: studentsError } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice']) as { data: Profile[] | null; error: any }

  let rosterStudents: Profile[] = students || []

  // Demo fallback: if no real student data is available, show safe demo roster
  if (rosterStudents.length === 0 && isDemoFallbackEnabled()) {
    rosterStudents = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = rosterStudents.map((s) => s.id)

  // Fetch progress and attempts for these students
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: StudentProgress[] | null; error: any }

  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: QuizAttempt[] | null; error: any }

  // Use local chapters as the source of truth for chapter count
  const chapters = localChapters
  const totalChapters = chapters.length

  // Build demo fallback for progress/attempts when real tables are empty
  let progressRecords = allProgress || []
  let attemptRecords = allAttempts || []
  if (rosterStudents.length > 0 && progressRecords.length === 0 && attemptRecords.length === 0 && isDemoFallbackEnabled()) {
    progressRecords = demoStudentProgress.filter((p) => studentIds.includes(p.user_id))
    attemptRecords = demoStudentQuizAttempts.filter((a) => studentIds.includes(a.user_id))
  }

  const studentStats = computeStudentStats(rosterStudents, progressRecords, attemptRecords, totalChapters)

  // Filter by search query (name, email, or role)
  const filteredStudents = searchQuery
    ? studentStats.filter(
        (s) =>
          s.full_name.toLowerCase().includes(searchQuery) ||
          s.email.toLowerCase().includes(searchQuery) ||
          s.role.toLowerCase().includes(searchQuery)
      )
    : studentStats

  // Sort by name for stable roster order
  filteredStudents.sort((a, b) => a.full_name.localeCompare(b.full_name))

  const totalStudents = studentStats.length
  const activeStudents = studentStats.filter((s) => {
    if (s.daysSinceActive === null) return false
    return s.daysSinceActive <= ACTIVE_DAYS
  }).length

  const classAvgProgress = totalStudents > 0
    ? Math.round(studentStats.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
    : 0

  const studentsWithQuizzes = studentStats.filter((s) => s.avgQuizScore > 0)
  const classAvgQuiz = studentsWithQuizzes.length > 0
    ? Math.round(studentsWithQuizzes.reduce((sum, s) => sum + s.avgQuizScore, 0) / studentsWithQuizzes.length)
    : 0

  const studentsWithReadiness = studentStats.filter((s) => s.readinessScore > 0)
  const classAvgReadiness = studentsWithReadiness.length > 0
    ? Math.round(studentsWithReadiness.reduce((sum, s) => sum + s.readinessScore, 0) / studentsWithReadiness.length)
    : 0

  // At-risk students: low progress, low quiz avg, low readiness, or inactive > 14 days
  const atRiskStudents = studentStats.filter((s) => {
    const lowProgress = s.overallProgress < 50
    const lowQuiz = s.avgQuizScore > 0 && s.avgQuizScore < 70
    const highRisk = s.readinessScore > 0 && s.readinessScore < 50
    const inactive = s.daysSinceActive !== null && s.daysSinceActive > 14
    return lowProgress || lowQuiz || highRisk || inactive
  })

  // Chapter-level class analytics
  const chapterClassScores = computeChapterClassScores(chapters, progressRecords)
  const weakestChapters = [...chapterClassScores].sort((a, b) => a.avgScore - b.avgScore).slice(0, 5)
  const strongestChapters = [...chapterClassScores].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5)

  // Recommended instructor actions
  const recommendedActions: string[] = []
  if (weakestChapters.length > 0 && weakestChapters[0].avgScore < 70) {
    recommendedActions.push(`Reteach Chapter ${weakestChapters[0].chapterNumber} — ${weakestChapters[0].chapterTitle} (class avg ${weakestChapters[0].avgScore}%)`)
  }
  if (classAvgQuiz > 0 && classAvgQuiz < 75) {
    recommendedActions.push('Assign a review quiz to reinforce concepts across the class.')
  }
  const inactiveStudents = studentStats.filter((s) => s.daysSinceActive !== null && s.daysSinceActive > 14)
  if (inactiveStudents.length > 0) {
    recommendedActions.push(`Follow up with ${inactiveStudents.length} inactive student${inactiveStudents.length === 1 ? '' : 's'}.`)
  }
  if (atRiskStudents.length > 0) {
    recommendedActions.push(`Schedule check-ins with ${atRiskStudents.length} at-risk student${atRiskStudents.length === 1 ? '' : 's'}.`)
  }
  if (recommendedActions.length === 0 && studentStats.length > 0) {
    recommendedActions.push('Class is on track. Continue current study plan and monitor progress.')
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
          <p className="text-gray-400">
            {schoolName} — Student roster and progress overview
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-[#D4AF37]">{totalStudents}</div>
            <div className="text-xs text-gray-400 mt-1">Total Students</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-2xl font-bold text-blue-400">{activeStudents}</div>
            <div className="text-xs text-gray-400 mt-1">Active This Week</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              classAvgProgress >= 75 ? 'text-green-400' :
              classAvgProgress >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {classAvgProgress}%
            </div>
            <div className="text-xs text-gray-400 mt-1">Class Avg Progress</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              classAvgQuiz >= 75 ? 'text-green-400' :
              classAvgQuiz >= 60 ? 'text-yellow-400' :
              classAvgQuiz > 0 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {classAvgQuiz > 0 ? `${classAvgQuiz}%` : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Class Avg Quiz Score</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              classAvgReadiness >= 85 ? 'text-green-400' :
              classAvgReadiness >= 70 ? 'text-blue-400' :
              classAvgReadiness >= 50 ? 'text-yellow-400' :
              classAvgReadiness > 0 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {classAvgReadiness > 0 ? classAvgReadiness : '—'}
            </div>
            <div className="text-xs text-gray-400 mt-1">Avg Board Readiness</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className={`text-2xl font-bold ${atRiskStudents.length > 0 ? 'text-red-400' : 'text-green-400'}`}>
              {atRiskStudents.length}
            </div>
            <div className="text-xs text-gray-400 mt-1">At-Risk Students</div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <form action="/instructor" method="GET" className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <label htmlFor="student-search" className="sr-only">Search students</label>
              <input
                id="student-search"
                name="q"
                type="search"
                defaultValue={q || ''}
                placeholder="Search by name, email, or role..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors"
              >
                Search
              </button>
              {searchQuery && (
                <Link
                  href="/instructor"
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                >
                  Clear
                </Link>
              )}
            </div>
          </form>
        </div>

        {/* School Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students At Risk */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Students At Risk</h2>
              <p className="text-sm text-gray-400 mt-1">
                Low progress, low quiz scores, low readiness, or inactive 14+ days
              </p>
            </div>
            {atRiskStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="p-4">Student</th>
                      <th className="p-4">Risk Factors</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {atRiskStudents.map((student) => {
                      const factors: string[] = []
                      if (student.overallProgress < 50) factors.push('Low progress')
                      if (student.avgQuizScore > 0 && student.avgQuizScore < 70) factors.push('Low quiz avg')
                      if (student.readinessScore > 0 && student.readinessScore < 50) factors.push('High board risk')
                      if (student.daysSinceActive !== null && student.daysSinceActive > 14) factors.push('Inactive')
                      return (
                        <tr key={student.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                          <td className="p-4">
                            <div className="text-white font-medium">{student.full_name}</div>
                            <div className="text-gray-500 text-xs">{student.email}</div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {factors.map((factor) => (
                                <span key={factor} className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs">
                                  {factor}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-4">
                            <Link
                              href={`/instructor/student/${student.id}`}
                              className="text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No at-risk students.
                <p className="text-sm text-gray-500 mt-2">Great job — your class is on track.</p>
              </div>
            )}
          </div>

          {/* Recommended Actions */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Recommended Instructor Actions</h2>
            </div>
            {recommendedActions.length > 0 ? (
              <div className="p-6">
                <ol className="space-y-3">
                  {recommendedActions.map((action, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold shrink-0">
                        {idx + 1}
                      </span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No recommendations yet.
                <p className="text-sm text-gray-500 mt-2">Add more student progress data for tailored actions.</p>
              </div>
            )}
          </div>

          {/* Weakest Chapters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Weakest Chapters</h2>
              <p className="text-sm text-gray-400 mt-1">Lowest class average quiz scores</p>
            </div>
            {weakestChapters.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {weakestChapters.map((chapter) => (
                  <div key={chapter.chapterId} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Ch.{chapter.chapterNumber} — {chapter.chapterTitle}
                      </p>
                      <p className="text-xs text-gray-500">{chapter.studentCount} student{chapter.studentCount === 1 ? '' : 's'} attempted</p>
                    </div>
                    <div className={`text-2xl font-bold ${
                      chapter.avgScore >= 75 ? 'text-green-400' :
                      chapter.avgScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {chapter.avgScore}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No chapter quiz data yet.
                <p className="text-sm text-gray-500 mt-2">Students need to complete quizzes for chapter analytics to appear.</p>
              </div>
            )}
          </div>

          {/* Strongest Chapters */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Strongest Chapters</h2>
              <p className="text-sm text-gray-400 mt-1">Highest class average quiz scores</p>
            </div>
            {strongestChapters.length > 0 ? (
              <div className="divide-y divide-gray-800">
                {strongestChapters.map((chapter) => (
                  <div key={chapter.chapterId} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">
                        Ch.{chapter.chapterNumber} — {chapter.chapterTitle}
                      </p>
                      <p className="text-xs text-gray-500">{chapter.studentCount} student{chapter.studentCount === 1 ? '' : 's'} attempted</p>
                    </div>
                    <div className="text-2xl font-bold text-green-400">{chapter.avgScore}%</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No chapter quiz data yet.
                <p className="text-sm text-gray-500 mt-2">Students need to complete quizzes for chapter analytics to appear.</p>
              </div>
            )}
          </div>
        </div>

        {/* Student Roster */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Student Roster</h2>
              <p className="text-sm text-gray-400 mt-1">
                {searchQuery
                  ? `Showing ${filteredStudents.length} of ${totalStudents} students`
                  : `${totalStudents} student${totalStudents === 1 ? '' : 's'} in your school`}
              </p>
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Student</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Overall Progress</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4">Quiz Average</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                      <td className="p-4">
                        <div className="text-white font-medium">{student.full_name}</div>
                        <div className="text-gray-500 text-xs">{student.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-gray-300">{student.role}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-gray-800 rounded-full h-2 w-24">
                            <div
                              className={`h-2 rounded-full ${
                                student.overallProgress >= 75 ? 'bg-green-500' :
                                student.overallProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${student.overallProgress}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-xs w-10 text-right">{student.overallProgress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-400">
                        {student.daysSinceActive !== null ? `${student.daysSinceActive}d ago` : 'Never'}
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${
                          student.avgQuizScore >= 75 ? 'text-green-400' :
                          student.avgQuizScore >= 60 ? 'text-yellow-400' :
                          student.avgQuizScore > 0 ? 'text-red-400' : 'text-gray-500'
                        }`}>
                          {student.avgQuizScore > 0 ? `${student.avgQuizScore}%` : '—'}
                        </span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/instructor/student/${student.id}`}
                          className="text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
                        >
                          View →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              {searchQuery ? (
                <>
                  No students match &quot;{q}&quot;.
                  <p className="text-sm text-gray-500 mt-2">
                    Try a different name, email, or role.
                  </p>
                </>
              ) : (
                <>
                  No students found in your school yet.
                  <p className="text-sm text-gray-500 mt-2">
                    Students will appear here once they sign up and select &quot;{schoolName}&quot;.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Instructor Tips</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• Students must select your school name during signup to appear here.</li>
            <li>• Click &quot;View&quot; on any student to see detailed chapter-by-chapter progress.</li>
            <li>• Quiz averages below 75% suggest a student may need additional review.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
