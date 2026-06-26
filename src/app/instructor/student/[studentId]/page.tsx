import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt, InstructorNote, HourLog, HourStatus, AttendanceRecord, InstructorAttendanceNote } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts, demoInstructorNotes, demoHourLogs, demoAttendanceRecords, demoInstructorAttendanceNotes } from '@/lib/demo-data'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { calculateAttendanceSummary, getRecentAttendance, getStatusColorClass } from '@/lib/attendance'
import BoardReadinessCard from '@/components/BoardReadinessCard'
import WeakAreaAnalytics from '@/components/WeakAreaAnalytics'
import StudyRecommendations from '@/components/StudyRecommendations'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import MissedQuestionBank from '@/components/MissedQuestionBank'
import { AddNoteForm } from './AddNoteForm'
import { PrintButton } from './PrintButton'
import { getInstructorNotes } from './actions'
import { mapHourLogsFromDb, mapAttendanceRecordsFromDb, mapAttendanceNotesFromDb } from '@/lib/mappers/operational-data-mappers'

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

function formatMinutes(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  return `${h}h ${m}m`
}

function statusBadgeClasses(status: HourStatus): string {
  switch (status) {
    case 'approved':
      return 'bg-green-500/20 text-green-400 border-green-500/30'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    case 'rejected':
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    default:
      return 'bg-gray-700 text-gray-300 border-gray-600'
  }
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
    .single()

  const typedStudent = student as Profile | null

  // Demo fallback: if real data is unavailable, check demo students
  let resolvedStudent: Profile | null = typedStudent
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
    .eq('user_id', studentId)

  // Get quiz attempts
  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', studentId)
    .order('completed_at', { ascending: false })

  // Get instructor notes
  const notesResult = await getInstructorNotes(studentId, instructorProfile.school_id)
  let noteRecords: InstructorNote[] = notesResult.success ? notesResult.data : []
  const notesError: string | null = notesResult.success ? null : notesResult.message

  // Demo fallback for progress, attempts, and notes
  let progressRecords: StudentProgress[] = (progress as StudentProgress[]) || []
  let attemptRecords: QuizAttempt[] = (attempts as QuizAttempt[]) || []
  if (progressRecords.length === 0 && attemptRecords.length === 0) {
    progressRecords = demoStudentProgress.filter((p) => p.user_id === studentId)
    attemptRecords = demoStudentQuizAttempts.filter((a) => a.user_id === studentId)
    attemptRecords.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
  }
  if (noteRecords.length === 0 && !notesError) {
    noteRecords = demoInstructorNotes.filter((n) => n.student_id === studentId)
  }

  // Get hour logs
  const { data: hourLogs } = await supabase
    .from('hour_logs')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('user_id', studentId)
    .order('date', { ascending: false })

  let hourLogRecords: HourLog[] = mapHourLogsFromDb(hourLogs || []) || []
  if (hourLogRecords.length === 0) {
    hourLogRecords = demoHourLogs.filter((h) => h.user_id === studentId)
    hourLogRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  // Get attendance records
  const { data: attendance } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('user_id', studentId)
    .order('date', { ascending: false })

  const { data: attendanceNotes } = await supabase
    .from('attendance_notes')
    .select('*')
    .eq('school_id', instructorProfile.school_id)
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })

  let attendanceRecords: AttendanceRecord[] = mapAttendanceRecordsFromDb(attendance || []) || []
  let attendanceNoteRecords: InstructorAttendanceNote[] = mapAttendanceNotesFromDb(attendanceNotes || []) || []
  if (attendanceRecords.length === 0) {
    attendanceRecords = demoAttendanceRecords.filter((a) => a.userId === studentId)
  }
  if (attendanceNoteRecords.length === 0) {
    attendanceNoteRecords = demoInstructorAttendanceNotes.filter((n) => n.studentId === studentId)
  }

  const attendanceSummary = calculateAttendanceSummary(studentId, attendanceRecords)
  const recentAttendance = getRecentAttendance(attendanceRecords, studentId, 14)

  const REQUIRED_MINUTES = 1500 * 60
  const approvedMinutes = hourLogRecords
    .filter((h) => h.status === 'approved')
    .reduce((sum, h) => sum + h.minutes, 0)
  const pendingMinutes = hourLogRecords
    .filter((h) => h.status === 'pending')
    .reduce((sum, h) => sum + h.minutes, 0)
  const remainingMinutes = Math.max(0, REQUIRED_MINUTES - approvedMinutes)
  const completionPercentage = REQUIRED_MINUTES > 0
    ? Math.round((approvedMinutes / REQUIRED_MINUTES) * 100)
    : 0

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

  // Phase 5 analytics
  const questions = Object.values(allQuizQuestions).flat()
  const analytics = analyzePerformance({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })

  const boardReadiness = calculateBoardReadiness({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    totalChapters,
  })

  const { buildMissedQuestions } = await import('@/lib/analytics')
  let missedQuestions = buildMissedQuestions({
    userId: studentId,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })
  if (missedQuestions.length === 0) {
    missedQuestions = getDemoMissedQuestionsForUser(studentId)
  }

  const recommendations = generateStudyPlan({
    userId: studentId,
    readiness: boardReadiness,
    weakAreas: analytics.weakAreas,
    strongAreas: analytics.strongAreas,
    missedQuestions,
    totalChapters,
  })

  // Weak area analytics (legacy)
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

        {/* Student Progress Report */}
        <section id="student-report" className="report-section bg-white text-black rounded-xl p-8 shadow-lg print:shadow-none">
          {/* Print styles scoped to this report section */}
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .report-section, .report-section * { visibility: visible; }
              .report-section { position: absolute; left: 0; top: 0; width: 100%; padding: 0.5in !important; }
              .report-section button { display: none !important; }
            }
          `}</style>

          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Student Progress Report</h2>
              <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <PrintButton />
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">{resolvedStudent.full_name}</h3>
            <p className="text-gray-600">{resolvedStudent.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {resolvedStudent.role}</p>
            <p className="text-sm text-gray-500">Joined: {formatDate(resolvedStudent.created_at)}</p>
            {lastActivityAt && (
              <p className="text-sm text-gray-500">Last active: {formatDaysAgo(lastActivityAt)}</p>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{overallProgress}%</div>
              <div className="text-xs text-gray-500">Overall Progress</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}</div>
              <div className="text-xs text-gray-500">Quiz Average</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{readiness.label}</div>
              <div className="text-xs text-gray-500">Board Readiness ({readiness.score})</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{boardRisk.label}</div>
              <div className="text-xs text-gray-500">Board Exam Risk</div>
            </div>
          </div>

          {/* Chapter Progress */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Chapter Progress</h3>
            {chapters.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Chapter</th>
                    <th className="py-2 pr-4">Progress</th>
                    <th className="py-2 pr-4">Flashcards</th>
                    <th className="py-2 pr-4">Quiz</th>
                    <th className="py-2">Best Score</th>
                  </tr>
                </thead>
                <tbody>
                  {chapters.map((chapter) => {
                    const chapterProgress = progressRecords.find((p) => p.chapter_id === chapter.id)
                    return (
                      <tr key={chapter.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">
                          <span className="font-medium">{chapter.chapter_number}. {chapter.title}</span>
                        </td>
                        <td className="py-2 pr-4">{chapterProgress?.progress_percentage || 0}%</td>
                        <td className="py-2 pr-4">{chapterProgress?.flashcards_completed ? 'Done' : '—'}</td>
                        <td className="py-2 pr-4">{chapterProgress?.quiz_completed ? 'Passed' : '—'}</td>
                        <td className="py-2">{chapterProgress?.best_quiz_score !== null && chapterProgress?.best_quiz_score !== undefined ? `${chapterProgress.best_quiz_score}%` : '—'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No chapter data available.</p>
            )}
          </div>

          {/* Recent Quiz Attempts */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Recent Quiz Attempts</h3>
            {attemptRecords.length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Quiz</th>
                    <th className="py-2 pr-4">Score</th>
                    <th className="py-2 pr-4">Percentage</th>
                    <th className="py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {attemptRecords.slice(0, 10).map((attempt) => (
                    <tr key={attempt.id} className="border-b border-gray-100">
                      <td className="py-2 pr-4">{attempt.quiz_id}</td>
                      <td className="py-2 pr-4">{attempt.score} / {attempt.total_questions}</td>
                      <td className="py-2 pr-4">{attempt.percentage}%</td>
                      <td className="py-2">{formatDate(attempt.completed_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No quiz attempts yet.</p>
            )}
          </div>

          {/* Weak Areas */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Weak Areas & Study Focus</h3>
            {!hasEnoughQuizData ? (
              <p className="text-gray-500">Not enough quiz data yet.</p>
            ) : weakAreas.length > 0 ? (
              <div className="space-y-2">
                {weakAreas.map((area) => (
                  <div key={area.chapterId} className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                    <span className="font-medium">Ch.{area.chapterNumber} — {area.chapterTitle}</span>
                    <span className="font-bold">{area.score}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No weak areas found.</p>
            )}
          </div>

          {/* Instructor Notes */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Instructor Notes</h3>
            {noteRecords.length > 0 ? (
              <div className="space-y-3">
                {noteRecords.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                        {note.note_type}
                      </span>
                      <span className="text-xs text-gray-500">by {note.instructor_name} • {formatDate(note.created_at)}</span>
                    </div>
                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{note.note_text}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No instructor notes yet.</p>
            )}
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
            Barber Study Pro — Student Progress Report
          </div>
        </section>

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

        {/* Phase 5 — Board Readiness & Analytics */}
        <BoardReadinessCard readiness={boardReadiness} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <WeakAreaAnalytics weakAreas={analytics.weakAreas} strongAreas={analytics.strongAreas} />
          </div>
          <div>
            <StudyRecommendations recommendations={recommendations} />
          </div>
        </div>

        <AnalyticsCharts
          readinessScore={boardReadiness.score}
          categoryPerformance={analytics.categoryPerformance}
          chapterPerformance={analytics.chapterPerformance}
          missedQuestionTrend={analytics.missedQuestionTrend}
        />

        {/* Missed Question Statistics */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Missed Question Bank</h2>
              <p className="text-sm text-gray-400 mt-1">
                {missedQuestions.length} missed question{missedQuestions.length === 1 ? '' : 's'} recorded
              </p>
            </div>
            <Link
              href={`/instructor/student/${studentId}`}
              className="text-sm text-[#D4AF37] hover:text-[#F4E4A6] font-medium"
            >
              View full report →
            </Link>
          </div>
          <div className="p-6">
            {missedQuestions.length > 0 ? (
              <MissedQuestionBank questions={missedQuestions.slice(0, 10)} />
            ) : (
              <div className="text-center text-gray-400 py-8">
                No missed questions yet.
              </div>
            )}
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

        {/* Attendance Summary */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Attendance Summary</h2>
            <p className="text-sm text-gray-400 mt-1">Last 11 school days</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className={`text-xl font-bold ${attendanceSummary.attendancePercentage >= 80 ? 'text-green-400' : attendanceSummary.attendancePercentage >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
                {attendanceSummary.attendancePercentage}%
              </div>
              <div className="text-xs text-gray-400 mt-1">Attendance Rate</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-green-400">{attendanceSummary.presentDays}</div>
              <div className="text-xs text-gray-400 mt-1">Present</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-red-400">{attendanceSummary.absentDays}</div>
              <div className="text-xs text-gray-400 mt-1">Absent</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-yellow-400">{attendanceSummary.tardyDays}</div>
              <div className="text-xs text-gray-400 mt-1">Tardy</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-blue-400">{attendanceSummary.excusedDays}</div>
              <div className="text-xs text-gray-400 mt-1">Excused</div>
            </div>
          </div>

          {attendanceSummary.isAtRisk && (
            <div className="p-4 bg-red-950/20 border-b border-red-900/30">
              <div className="flex items-start gap-3">
                <span className="text-red-400 text-lg">⚠️</span>
                <div>
                  <h3 className="text-sm font-semibold text-red-400">Attendance Concern</h3>
                  <p className="text-sm text-gray-300">{attendanceSummary.riskReason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-gray-800">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Recent History</h3>
            {recentAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="p-3">Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Clock In</th>
                      <th className="p-3">Clock Out</th>
                      <th className="p-3">Minutes</th>
                      <th className="p-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {recentAttendance.slice(0, 10).map((record) => (
                      <tr key={record.id} className="border-b border-gray-800 last:border-0">
                        <td className="p-3 text-gray-300">{formatDate(record.date)}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColorClass(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-3 text-gray-400">
                          {record.clockedInAt ? new Date(record.clockedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-gray-400">
                          {record.clockedOutAt ? new Date(record.clockedOutAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-gray-400">
                          {record.minutesPresent !== null ? `${record.minutesPresent} min` : '—'}
                        </td>
                        <td className="p-3 text-gray-400 truncate max-w-[200px]">
                          {record.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No attendance records found.</p>
            )}
          </div>

          {attendanceNoteRecords.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Attendance Notes</h3>
              <div className="space-y-3">
                {attendanceNoteRecords.map((note) => (
                  <div key={note.id} className="p-3 bg-gray-950 border border-gray-800 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{formatDate(note.date)}</span>
                      <span className="text-xs text-gray-500">by {note.instructorName}</span>
                    </div>
                    <p className="text-sm text-gray-300">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructor Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Instructor Notes</h2>
          </div>

          {notesError && (
            <div className="mx-6 mt-6 bg-red-950/30 border border-red-900/50 text-red-400 rounded-lg p-4">
              {notesError}
            </div>
          )}

          <div className="p-6">
            <AddNoteForm studentId={studentId} />
          </div>

          {noteRecords.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {noteRecords.map((note) => (
                <div key={note.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        note.note_type === 'coaching' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        note.note_type === 'remediation' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        note.note_type === 'readiness' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        'bg-gray-700 text-gray-300 border border-gray-600'
                      }`}>
                        {note.note_type}
                      </span>
                      <span className="text-sm text-gray-400">by {note.instructor_name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(note.created_at)}</span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">{note.note_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No instructor notes yet.
              <p className="text-sm text-gray-500 mt-2">
                Use the form above to add coaching, remediation, readiness, or general notes.
              </p>
            </div>
          )}
        </div>

        {/* Hour Tracker */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Hour Tracker</h2>
            <p className="text-sm text-gray-400 mt-1">
              Only instructor-approved hours count toward official completed hours.
            </p>
          </div>

          {/* Hour Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-gray-800">
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-green-400">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-gray-400 mt-1">Approved Hours</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-yellow-400">{formatMinutes(pendingMinutes)}</div>
              <div className="text-xs text-gray-400 mt-1">Pending Approval</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-[#D4AF37]">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-gray-400 mt-1">Required Hours</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-blue-400">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-gray-400 mt-1">Remaining Hours</div>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-4">
              <div className="text-xl font-bold text-purple-400">{completionPercentage}%</div>
              <div className="text-xs text-gray-400 mt-1">Completion</div>
            </div>
          </div>

          {/* Daily Hour Log */}
          <div className="p-6 border-b border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Hour Log</h3>
            {hourLogRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Minutes</th>
                      <th className="p-4">Display</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {hourLogRecords.map((log) => (
                      <tr key={log.id} className="border-b border-gray-800/50">
                        <td className="p-4 text-white">{formatDate(log.date)}</td>
                        <td className="p-4 text-gray-300">{log.category}</td>
                        <td className="p-4 text-gray-300">{log.minutes}</td>
                        <td className="p-4 text-white font-medium">{formatMinutes(log.minutes)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${statusBadgeClasses(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{log.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                No hour logs yet.
                <p className="text-sm text-gray-500 mt-2">Daily logs will appear here once submitted.</p>
              </div>
            )}
          </div>

          {/* Rejected Logs */}
          {hourLogRecords.some((h) => h.status === 'rejected') && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rejected Logs</h3>
              <p className="text-sm text-gray-500 mb-3">
                These logs do not count toward official hours and may need to be resubmitted.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                      <th className="p-4">Date</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Hours</th>
                      <th className="p-4">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {hourLogRecords
                      .filter((h) => h.status === 'rejected')
                      .map((log) => (
                        <tr key={log.id} className="border-b border-gray-800/50">
                          <td className="p-4 text-white">{formatDate(log.date)}</td>
                          <td className="p-4 text-gray-300">{log.category}</td>
                          <td className="p-4 text-white">{formatMinutes(log.minutes)}</td>
                          <td className="p-4 text-gray-500">{log.notes || '—'}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Board Hours Summary Report */}
        <section id="board-hours-report" className="report-hours-section bg-white text-black rounded-xl p-8 shadow-lg print:shadow-none">
          <style>{`
            @media print {
              body * { visibility: hidden; }
              .report-hours-section, .report-hours-section * { visibility: visible; }
              .report-hours-section { position: absolute; left: 0; top: 0; width: 100%; padding: 0.5in !important; }
              .report-hours-section button { display: none !important; }
            }
          `}</style>

          <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Board Hours Summary Report</h2>
              <p className="text-sm text-gray-500">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <PrintButton />
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900">{resolvedStudent.full_name}</h3>
            <p className="text-gray-600">{resolvedStudent.email}</p>
            <p className="text-sm text-gray-500 capitalize">Role: {resolvedStudent.role}</p>
            <p className="text-sm text-gray-500">Program: Barbering</p>
            <p className="text-sm text-gray-500">State: Oklahoma</p>
          </div>

          {/* Official Hour Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-900">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-gray-500">Required Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-gray-500">Approved Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-gray-500">Remaining Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">{completionPercentage}%</div>
              <div className="text-xs text-gray-500">Completion</div>
            </div>
          </div>

          {/* Approved Daily Logs */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Approved Daily Hour Logs</h3>
            {hourLogRecords.filter((h) => h.status === 'approved').length > 0 ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Category</th>
                    <th className="py-2 pr-4">Hours</th>
                    <th className="py-2">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {hourLogRecords
                    .filter((h) => h.status === 'approved')
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((log) => (
                      <tr key={log.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4">{formatDate(log.date)}</td>
                        <td className="py-2 pr-4">{log.category}</td>
                        <td className="py-2 pr-4">{formatMinutes(log.minutes)}</td>
                        <td className="py-2">{log.notes || '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No approved hours yet.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <span className="font-semibold">Disclaimer:</span> Verify state-specific submission requirements before submitting to a licensing board. This report is a summary of approved hours only and is not an official state board form.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 mt-8 pt-4 border-t border-gray-200">
            Barber Study Pro — Board Hours Summary Report
          </div>
        </section>
      </div>
    </div>
  )
}
