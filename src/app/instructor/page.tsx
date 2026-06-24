import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt, HourLog, ReadinessLevel, AttendanceRecord, Grade, GradeCategory, Assessment } from '@/types'
import { localChapters } from '@/lib/local-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts, demoHourLogs, demoAttendanceRecords, getDemoNotificationsForUser, getDemoThreadsForUser, demoGrades, demoGradeCategories, demoAssessments } from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { calculateBoardReadiness, getReadinessColorClass } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { getAttendanceConcerns, getStatusColorClass } from '@/lib/attendance'
import { calculateStudentGradePerformance, getGradeColorClass } from '@/lib/gradebook'
import AssessmentList from '@/components/assessments/AssessmentList'
import { allQuizQuestions } from '@/lib/quiz-data'
import { getThreadDisplayName, formatMessageTime, priorityColorClasses } from '@/lib/messaging'
import UnreadBadge from '@/components/messaging/UnreadBadge'

interface RosterStudent extends Profile {
  overallProgress: number
  lastStudiedAt: string | null
  avgQuizScore: number
  quizzesTaken: number
  completedChapters: number
  daysSinceActive: number | null
  readinessScore: number
  readinessLevel: ReadinessLevel
  weakestCategory: string | null
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

function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

function readinessBadgeClasses(level: ReadinessLevel): string {
  switch (level) {
    case 'Ready':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'Nearly Ready':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'Needs Review':
      return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    case 'At Risk':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600'
  }
}

function computeStudentStats(
  students: Profile[],
  allProgress: StudentProgress[],
  allAttempts: QuizAttempt[],
  chapters: { id: string; chapter_number: number; title: string }[],
  questions: import('@/types').QuizQuestion[]
): RosterStudent[] {
  const totalChapters = chapters.length

  return students.map((student) => {
    const progress = allProgress.filter((p) => p.user_id === student.id)
    const attempts = allAttempts.filter((a) => a.user_id === student.id)

    const completedChapters = progress.filter((p) => p.progress_percentage === 100).length
    const totalProgressSum = progress.reduce((sum, p) => sum + p.progress_percentage, 0)
    const overallProgress = totalChapters > 0 ? Math.round(totalProgressSum / totalChapters) : 0

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

    const readiness = calculateBoardReadiness({
      userId: student.id,
      attempts,
      progress,
      totalChapters,
    })

    // Determine weakest category from analytics
    const analytics = analyzePerformance({
      userId: student.id,
      attempts,
      progress,
      chapters,
      questions,
    })
    const weakestCategory = analytics.weakAreas[0]?.category || null

    return {
      ...student,
      overallProgress,
      lastStudiedAt,
      avgQuizScore,
      quizzesTaken: attempts.length,
      completedChapters,
      daysSinceActive,
      readinessScore: readiness.score,
      readinessLevel: readiness.level,
      weakestCategory,
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
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  let rosterStudents: Profile[] = (students as Profile[]) || []

  // Demo fallback: if no real student data is available, show safe demo roster
  if (rosterStudents.length === 0 && isDemoFallbackEnabled()) {
    rosterStudents = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = rosterStudents.map((s) => s.id)

  // Fetch progress and attempts for these students
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  // Use local chapters as the source of truth for chapter count
  const chapters = localChapters
  const questions = Object.values(allQuizQuestions).flat()

  // Build demo fallback for progress/attempts when real tables are empty
  let progressRecords: StudentProgress[] = (allProgress as StudentProgress[]) || []
  let attemptRecords: QuizAttempt[] = (allAttempts as QuizAttempt[]) || []
  if (rosterStudents.length > 0 && progressRecords.length === 0 && attemptRecords.length === 0 && isDemoFallbackEnabled()) {
    progressRecords = demoStudentProgress.filter((p) => studentIds.includes(p.user_id))
    attemptRecords = demoStudentQuizAttempts.filter((a) => studentIds.includes(a.user_id))
  }

  // Fetch hour logs for pending approval queue
  const { data: allHourLogs } = await supabase
    .from('hour_logs')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  let hourLogRecords: HourLog[] = (allHourLogs as HourLog[]) || []
  if (hourLogRecords.length === 0 && isDemoFallbackEnabled()) {
    hourLogRecords = demoHourLogs.filter((h) => studentIds.includes(h.user_id))
  }

  // Fetch attendance records
  const { data: allAttendance } = await supabase
    .from('attendance_records')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  let attendanceRecords: AttendanceRecord[] = (allAttendance as AttendanceRecord[]) || []
  if (attendanceRecords.length === 0 && isDemoFallbackEnabled()) {
    attendanceRecords = demoAttendanceRecords.filter((a) => studentIds.includes(a.userId))
  }

  // Phase 9 — fetch grades and assessments for class overview
  const { data: allGrades } = await supabase
    .from('grades')
    .select('*')
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])

  let gradeRecords: Grade[] = (allGrades as unknown as Grade[]) || []
  if (gradeRecords.length === 0 && isDemoFallbackEnabled()) {
    gradeRecords = demoGrades.filter((g) => studentIds.includes(g.studentId))
  }

  const { data: allCategories } = await supabase.from('grade_categories').select('*')

  let gradeCategories: GradeCategory[] = (allCategories as unknown as GradeCategory[]) || []
  if (gradeCategories.length === 0 && isDemoFallbackEnabled()) {
    gradeCategories = demoGradeCategories
  }

  const { data: allAssessments } = await supabase
    .from('assessments')
    .select('*')
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])

  let assessmentRecords: Assessment[] = (allAssessments as unknown as Assessment[]) || []
  if (assessmentRecords.length === 0 && isDemoFallbackEnabled()) {
    assessmentRecords = demoAssessments.filter((a) => studentIds.includes(a.studentId))
  }

  const classPerformances = rosterStudents.map((student) => {
    const missingCount = gradeCategories.filter((c) => {
      return gradeRecords.filter((g) => g.studentId === student.id && g.categoryId === c.id && !g.isExcused).length === 0
    }).length
    return calculateStudentGradePerformance(student.id, gradeRecords, gradeCategories, assessmentRecords, missingCount)
  })

  const classAvgGrade = classPerformances.length > 0
    ? Math.round((classPerformances.reduce((sum, p) => sum + p.overallGrade, 0) / classPerformances.length) * 10) / 10
    : 0

  const gradeAtRiskCount = classPerformances.filter((p) => p.isAtRisk).length
  const topPerformers = [...classPerformances]
    .sort((a, b) => b.overallGrade - a.overallGrade)
    .slice(0, 3)
    .map((p) => rosterStudents.find((s) => s.id === p.studentId))
    .filter(Boolean) as Profile[]

  const recentAssessments = [...assessmentRecords]
    .sort((a, b) => new Date(b.assessmentDate).getTime() - new Date(a.assessmentDate).getTime())
    .slice(0, 5)

  const assessmentQueue = assessmentRecords.filter((a) => !a.isPassed).slice(0, 5)

  const today = new Date().toISOString().split('T')[0]
  const todayRecords = attendanceRecords.filter((a) => a.date === today)
  const presentToday = todayRecords.filter((a) => a.status === 'Present').length
  const absentToday = todayRecords.filter((a) => a.status === 'Absent').length
  const tardyToday = todayRecords.filter((a) => a.status === 'Tardy').length
  const excusedToday = todayRecords.filter((a) => a.status === 'Excused').length
  const notMarkedToday = rosterStudents.length - todayRecords.length

  const attendanceConcerns = getAttendanceConcerns(rosterStudents, attendanceRecords)

  // Phase 8A messaging demo data
  const demoNotifications = isDemoFallbackEnabled() ? getDemoNotificationsForUser(user.id) : []
  const demoThreads = isDemoFallbackEnabled() ? getDemoThreadsForUser(user.id) : []
  const unreadThreadCount = demoThreads.reduce((sum, t) => sum + t.unreadCount, 0)
  const unreadNotificationCount = demoNotifications.filter((n) => !n.read).length
  const threadsNeedingResponse = demoThreads.filter((t) => t.unreadCount > 0)

  const pendingHourLogs = hourLogRecords.filter((h) => h.status === 'pending')
  const pendingByStudent = pendingHourLogs.reduce<Record<string, number>>((acc, log) => {
    acc[log.user_id] = (acc[log.user_id] || 0) + log.minutes
    return acc
  }, {})

  const studentStats = computeStudentStats(rosterStudents, progressRecords, attemptRecords, chapters, questions)

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

  // At-risk students: readiness below 70, low progress, low quiz avg, or inactive > 14 days
  const atRiskStudents = studentStats.filter((s) => {
    const lowReadiness = s.readinessScore > 0 && s.readinessScore < 70
    const lowProgress = s.overallProgress < 50
    const lowQuiz = s.avgQuizScore > 0 && s.avgQuizScore < 70
    const inactive = s.daysSinceActive !== null && s.daysSinceActive > 14
    return lowReadiness || lowProgress || lowQuiz || inactive
  })

  // Chapter-level class analytics
  const chapterClassScores = computeChapterClassScores(chapters, progressRecords)
  const weakestChapters = [...chapterClassScores].sort((a, b) => a.avgScore - b.avgScore).slice(0, 5)
  const strongestChapters = [...chapterClassScores].sort((a, b) => b.avgScore - a.avgScore).slice(0, 5)

  // Board readiness overview counts
  const readyCount = studentStats.filter((s) => s.readinessLevel === 'Ready').length
  const nearlyReadyCount = studentStats.filter((s) => s.readinessLevel === 'Nearly Ready').length
  const needsReviewCount = studentStats.filter((s) => s.readinessLevel === 'Needs Review').length
  const atRiskCount = studentStats.filter((s) => s.readinessLevel === 'At Risk').length

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
              classAvgReadiness >= 90 ? 'text-green-400' :
              classAvgReadiness >= 80 ? 'text-yellow-400' :
              classAvgReadiness >= 70 ? 'text-orange-400' :
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

        {/* Messaging Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/instructor/messages"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Unread Messages</p>
                <p className="text-2xl font-bold text-white mt-1">{unreadThreadCount}</p>
              </div>
              <UnreadBadge count={unreadThreadCount} />
            </div>
            <p className="text-xs text-gray-500 mt-2">Open messaging center</p>
          </Link>

          <Link
            href="/instructor/messages"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Unread Alerts</p>
                <p className="text-2xl font-bold text-white mt-1">{unreadNotificationCount}</p>
              </div>
              <UnreadBadge count={unreadNotificationCount} />
            </div>
            <p className="text-xs text-gray-500 mt-2">View notification panel</p>
          </Link>

          <Link
            href="/instructor/messages"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Announcements</p>
                <p className="text-2xl font-bold text-white mt-1">Manage</p>
              </div>
              <span className="text-2xl">📢</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Post school-wide updates</p>
          </Link>
        </div>

        {/* Phase 11 — Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/instructor/compliance"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">State Board Compliance</p>
                <p className="text-2xl font-bold text-white mt-1">Monitor</p>
              </div>
              <span className="text-2xl">📋</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Track licensing readiness</p>
          </Link>

          <Link
            href="/instructor/compliance"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Eligibility Candidates</p>
                <p className="text-2xl font-bold text-white mt-1">Review</p>
              </div>
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Students ready for board exam</p>
          </Link>

          <Link
            href="/instructor/compliance"
            className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Compliance Alerts</p>
                <p className="text-2xl font-bold text-white mt-1">View</p>
              </div>
              <span className="text-2xl">🚨</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Missing hours, assessments, practicals</p>
          </Link>
        </div>

        {/* Phase 9 — Gradebook Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Gradebook Overview</h2>
              <p className="text-sm text-gray-400 mt-1">Class grade averages and at-risk students</p>
            </div>
            <Link
              href="/instructor/gradebook"
              className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors text-sm"
            >
              Open Gradebook →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className={`text-3xl font-bold ${getGradeColorClass(classAvgGrade)}`}>{classAvgGrade}%</div>
              <div className="text-xs text-gray-400 mt-1">Class Avg Grade</div>
            </div>
            <div className="bg-gray-950 border border-red-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{gradeAtRiskCount}</div>
              <div className="text-xs text-gray-400 mt-1">At-Risk Students</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{assessmentRecords.length}</div>
              <div className="text-xs text-gray-400 mt-1">Total Assessments</div>
            </div>
            <div className="bg-gray-950 border border-yellow-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{assessmentQueue.length}</div>
              <div className="text-xs text-gray-400 mt-1">Assessment Queue</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Top Performers</h3>
              {topPerformers.length > 0 ? (
                <div className="space-y-2">
                  {topPerformers.map((student, idx) => {
                    const perf = classPerformances.find((p) => p.studentId === student.id)
                    return (
                      <div
                        key={student.id}
                        className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold">
                            {idx + 1}
                          </span>
                          <div>
                            <div className="text-white font-medium">{student.full_name}</div>
                            <div className="text-xs text-gray-500">{student.email}</div>
                          </div>
                        </div>
                        <div className={`font-bold ${getGradeColorClass(perf?.overallGrade || 0)}`}>
                          {perf?.overallGrade || 0}%
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No grade data yet.</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Recent Assessments</h3>
              {recentAssessments.length > 0 ? (
                <AssessmentList assessments={recentAssessments} students={rosterStudents} showStudentName />
              ) : (
                <p className="text-sm text-gray-500">No recent assessments.</p>
              )}
            </div>
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

        {/* Today's Attendance Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Today&apos;s Attendance Overview</h2>
              <p className="text-sm text-gray-400 mt-1">{today} — Present / Absent / Tardy / Excused</p>
            </div>
            <div className="flex items-center gap-4">
              {notMarkedToday > 0 && (
                <span className="text-sm text-yellow-400">{notMarkedToday} not marked</span>
              )}
              <Link
                href="/instructor/attendance"
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#F4E4A6] text-gray-950 font-semibold rounded-lg transition-colors text-sm"
              >
                Manage Attendance →
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-950 border border-green-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{presentToday}</div>
              <div className="text-xs text-gray-400 mt-1">Present</div>
            </div>
            <div className="bg-gray-950 border border-red-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{absentToday}</div>
              <div className="text-xs text-gray-400 mt-1">Absent</div>
            </div>
            <div className="bg-gray-950 border border-yellow-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{tardyToday}</div>
              <div className="text-xs text-gray-400 mt-1">Tardy</div>
            </div>
            <div className="bg-gray-950 border border-blue-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-blue-400">{excusedToday}</div>
              <div className="text-xs text-gray-400 mt-1">Excused</div>
            </div>
            <div className="bg-gray-950 border border-gray-700 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-gray-400">{rosterStudents.length}</div>
              <div className="text-xs text-gray-400 mt-1">Total Roster</div>
            </div>
          </div>

          {attendanceConcerns.length > 0 ? (
            <div className="p-6 border-b border-gray-800">
              <h3 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
                <span>⚠️</span> Students Needing Attention
              </h3>
              <div className="space-y-2">
                {attendanceConcerns.slice(0, 5).map((concern) => (
                  <div
                    key={concern.userId}
                    className="flex items-center justify-between bg-gray-950 border border-red-900/20 rounded-lg p-3"
                  >
                    <div>
                      <Link
                        href={`/instructor/student/${concern.userId}`}
                        className="font-medium text-white hover:text-[#D4AF37] transition-colors"
                      >
                        {concern.fullName}
                      </Link>
                      <p className="text-sm text-gray-400">{concern.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-400">{concern.attendancePercentage}%</div>
                      <div className="text-xs text-gray-500">attendance</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 border-b border-gray-800">
              <p className="text-green-400 text-sm">✅ No attendance concerns today.</p>
            </div>
          )}

          <div className="p-6">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Attendance Queue</h3>
            <p className="text-sm text-gray-400">
              Mark attendance one student at a time. Full self clock-in workflow coming in a future phase.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {studentStats.slice(0, 6).map((student) => {
                const todayRecord = todayRecords.find((r) => r.userId === student.id)
                return (
                  <div
                    key={student.id}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium ${
                      todayRecord
                        ? getStatusColorClass(todayRecord.status)
                        : 'text-gray-400 bg-gray-800 border-gray-700'
                    }`}
                  >
                    <span className="truncate max-w-[120px]">{student.full_name}</span>
                    <span>{todayRecord ? todayRecord.status : 'Not marked'}</span>
                  </div>
                )
              })}
              {studentStats.length > 6 && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-full border border-gray-700 text-gray-400 text-xs">
                  +{studentStats.length - 6} more
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Messages Requiring Response */}
        {threadsNeedingResponse.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span>📬</span> Messages Requiring Response
              </h2>
            </div>
            <ul className="divide-y divide-gray-800">
              {threadsNeedingResponse.map((thread) => (
                <li key={thread.id}>
                  <Link
                    href="/instructor/messages"
                    className="flex items-center justify-between p-5 hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-white">
                        {getThreadDisplayName(thread, user.id)}
                      </p>
                      <p className="text-sm text-gray-400">{thread.subject}</p>
                      <p className="text-xs text-gray-500 truncate mt-0.5">
                        {thread.lastMessagePreview}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs text-gray-500 block">
                        {formatMessageTime(thread.lastMessageAt)}
                      </span>
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full mt-1">
                        {thread.unreadCount}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recent Notifications Panel */}
        {demoNotifications.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Notifications</h2>
              <Link
                href="/instructor/messages"
                className="text-sm text-[#D4AF37] hover:text-[#F4E4A6]"
              >
                View all
              </Link>
            </div>
            <ul className="divide-y divide-gray-800">
              {demoNotifications.slice(0, 4).map((notification) => (
                <li
                  key={notification.id}
                  className={`p-5 ${notification.read ? 'bg-gray-900/50' : 'bg-gray-800/30'}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColorClasses(notification.priority)}`}>
                          {notification.priority}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatMessageTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{notification.body}</p>
                      {notification.actionUrl && (
                        <Link
                          href={notification.actionUrl}
                          className="inline-block mt-1 text-xs text-[#D4AF37] hover:text-[#F4E4A6]"
                        >
                          View details →
                        </Link>
                      )}
                    </div>
                    {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Board Readiness Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Board Readiness Overview</h2>
            <p className="text-sm text-gray-400 mt-1">At-a-glance board exam readiness across your roster</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-950 border border-green-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-green-400">{readyCount}</div>
              <div className="text-xs text-gray-400 mt-1">Ready</div>
            </div>
            <div className="bg-gray-950 border border-yellow-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-yellow-400">{nearlyReadyCount}</div>
              <div className="text-xs text-gray-400 mt-1">Nearly Ready</div>
            </div>
            <div className="bg-gray-950 border border-orange-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-orange-400">{needsReviewCount}</div>
              <div className="text-xs text-gray-400 mt-1">Needs Review</div>
            </div>
            <div className="bg-gray-950 border border-red-900/30 rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-red-400">{atRiskCount}</div>
              <div className="text-xs text-gray-400 mt-1">At Risk</div>
            </div>
          </div>

          {filteredStudents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Student</th>
                    <th className="p-4">Readiness Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Weakest Category</th>
                    <th className="p-4">Last Activity</th>
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
                        <span className={`text-xl font-bold ${getReadinessColorClass(student.readinessScore)}`}>
                          {student.readinessScore > 0 ? student.readinessScore : '—'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold border ${readinessBadgeClasses(student.readinessLevel)}`}>
                          {student.readinessLevel}
                        </span>
                      </td>
                      <td className="p-4 text-gray-400">
                        {student.weakestCategory || '—'}
                      </td>
                      <td className="p-4 text-gray-400">
                        {student.daysSinceActive !== null ? `${student.daysSinceActive}d ago` : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No students match your search.
            </div>
          )}
        </div>

        {/* Hours Pending Approval Queue Placeholder */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Hours Pending Approval</h2>
            <p className="text-sm text-gray-400 mt-1">Approval workflow coming soon</p>
          </div>
          {Object.keys(pendingByStudent).length > 0 ? (
            <div className="divide-y divide-gray-800">
              {Object.entries(pendingByStudent).map(([userId, minutes]) => {
                const student = rosterStudents.find((s) => s.id === userId)
                if (!student) return null
                return (
                  <div key={userId} className="p-5 flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{student.full_name}</p>
                      <p className="text-xs text-gray-500">{student.email}</p>
                    </div>
                    <div className="text-xl font-bold text-yellow-400">{formatMinutes(minutes)}</div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No hours pending approval.
            </div>
          )}
        </div>

        {/* School Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Students At Risk */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
              <h2 className="text-xl font-semibold text-white">Students At Risk</h2>
              <p className="text-sm text-gray-400 mt-1">
                Readiness below 70, low progress, low quiz scores, or inactive 14+ days
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
                      if (student.readinessScore > 0 && student.readinessScore < 70) factors.push('Low readiness')
                      if (student.overallProgress < 50) factors.push('Low progress')
                      if (student.avgQuizScore > 0 && student.avgQuizScore < 70) factors.push('Low quiz avg')
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
