import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt, InstructorNote, HourLog, HourStatus, AttendanceRecord, InstructorAttendanceNote } from '@/types'
import { localChapters, getLocalQuiz } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts, demoInstructorNotes, demoHourLogs, demoAttendanceRecords, demoInstructorAttendanceNotes } from '@/lib/demo-data'
import { isDemoDataAllowed } from '@/lib/demo-helpers'
import DemoDataBanner from '@/components/DemoDataBanner'
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
import StudentIdentity from '@/components/StudentIdentity'
import { AddNoteForm } from './AddNoteForm'
import { PrintButton } from './PrintButton'
import ProgressReportModal from './ProgressReportModal'
import BackButton from '@/components/ui/BackButton'
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
      return 'bg-gold/20 text-gold border-gold/30'
    case 'pending':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'rejected':
      return 'bg-silver/20 text-silver border-silver/30'
    default:
      return 'bg-[var(--color-border-secondary)] text-light-gray border-silver-gray'
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

  if (score >= 85) return { label: 'Board Ready', score, color: 'text-gold' }
  if (score >= 70) return { label: 'Almost Ready', score, color: 'text-silver' }
  if (score >= 50) return { label: 'On Track', score, color: 'text-warm-bronze' }
  if (score >= 25) return { label: 'Needs Review', score, color: 'text-warm-bronze' }
  return { label: 'Getting Started', score, color: 'text-silver' }
}

interface ChapterScore {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  score: number
  attempted: boolean
  passingScore: number
}

function getPassingScoreByQuizId(quizId: string): number {
  const chapterId = quizId.replace('quiz-', 'ch-')
  return getLocalQuiz(chapterId)?.passing_score ?? 80
}

function computeChapterScores(
  chapters: { id: string; chapter_number: number; title: string }[],
  progressRecords: StudentProgress[]
): ChapterScore[] {
  return chapters.map((chapter) => {
    const progress = progressRecords.find((p) => p.chapter_id === chapter.id)
    const score = progress?.best_quiz_score ?? 0
    const quiz = getLocalQuiz(chapter.id)
    return {
      chapterId: chapter.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      score,
      attempted: score > 0,
      passingScore: quiz?.passing_score ?? 80,
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
      color: 'text-silver',
      description: 'Not enough quiz data to assess board readiness risk.',
    }
  }

  const anyCritical = attemptedChapters.some((c) => c.score < 60)
  const passingCount = attemptedChapters.filter((c) => c.score >= c.passingScore).length
  const passingRate = passingCount / attemptedChapters.length

  if (anyCritical || passingRate < 0.5) {
    return {
      label: 'High Risk',
      color: 'text-silver',
      description: 'Multiple weak areas may affect board exam performance.',
    }
  }

  if (passingRate < 0.8 || attemptedChapters.some((c) => c.score < c.passingScore)) {
    return {
      label: 'Moderate Risk',
      color: 'text-warm-bronze',
      description: 'Some topics need additional review before the board exam.',
    }
  }

  return {
    label: 'Low Risk',
    color: 'text-gold',
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

  // Demo fallback: if real data is unavailable, check demo students.
  // Phase 6B-1 R-3: demo data is NEVER substituted in production.
  const demoAllowed = isDemoDataAllowed()
  let usingDemoData = false
  let resolvedStudent: Profile | null = typedStudent
  if (!resolvedStudent && demoAllowed) {
    resolvedStudent = demoStudents.find(
      (s) =>
        s.id === studentId &&
        (s.school_id === instructorProfile.school_id || !instructorProfile.school_id)
    ) || null
    if (resolvedStudent) usingDemoData = true
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
  if (progressRecords.length === 0 && attemptRecords.length === 0 && demoAllowed) {
    progressRecords = demoStudentProgress.filter((p) => p.user_id === studentId)
    attemptRecords = demoStudentQuizAttempts.filter((a) => a.user_id === studentId)
    attemptRecords.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
  }
  if (noteRecords.length === 0 && !notesError && demoAllowed) {
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
  if (hourLogRecords.length === 0 && demoAllowed) {
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
  if (attendanceRecords.length === 0 && demoAllowed) {
    attendanceRecords = demoAttendanceRecords.filter((a) => a.userId === studentId)
  }
  if (attendanceNoteRecords.length === 0 && demoAllowed) {
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
  if (missedQuestions.length === 0 && demoAllowed) {
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
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {usingDemoData && <DemoDataBanner />}
        {/* Back navigation */}
        <BackButton fallbackHref="/instructor" label="Back to roster" />

        {/* Student Summary Card */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="w-16 h-16 rounded-full bg-[var(--color-brand-gold)]/20 flex items-center justify-center shrink-0">
              <span className="text-2xl font-bold text-[var(--color-brand-gold)]">
                {resolvedStudent.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{resolvedStudent.full_name}</h1>
              <p className="text-silver">{resolvedStudent.email}</p>
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm">
                <span className="px-2 py-0.5 bg-graphite text-light-gray rounded capitalize">
                  {resolvedStudent.role}
                </span>
                <span className="text-silver-gray">
                  Joined {formatDate(resolvedStudent.created_at)}
                </span>
                {lastActivityAt && (
                  <span className="text-silver-gray">
                    Last active {formatDaysAgo(lastActivityAt)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Student Progress Report (modal popup) */}
        <ProgressReportModal
          student={resolvedStudent}
          lastActivityAt={lastActivityAt}
          overallProgress={overallProgress}
          avgQuizScore={avgQuizScore}
          readiness={readiness}
          boardRisk={boardRisk}
          chapters={chapters}
          progressRecords={progressRecords}
          attemptRecords={attemptRecords}
          hasEnoughQuizData={hasEnoughQuizData}
          weakAreas={weakAreas}
          noteRecords={noteRecords}
        />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${
              overallProgress >= 80 ? 'text-gold' :
              overallProgress >= 50 ? 'text-warm-bronze' : 'text-silver'
            }`}>
              {overallProgress}%
            </div>
            <div className="text-xs text-silver mt-1">Overall Progress</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{completedChapters}</div>
            <div className="text-xs text-silver mt-1">Chapters Done</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-silver">{flashcardsCompleted}</div>
            <div className="text-xs text-silver mt-1">Flashcards Done</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className="text-2xl font-bold text-silver">{quizzesCompleted}</div>
            <div className="text-xs text-silver mt-1">Quizzes Passed</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${avgQuizScore >= 80 ? 'text-gold' : avgQuizScore >= 60 ? 'text-warm-bronze' : avgQuizScore > 0 ? 'text-silver' : 'text-silver-gray'}`}>
              {avgQuizScore > 0 ? `${avgQuizScore}%` : '—'}
            </div>
            <div className="text-xs text-silver mt-1">Quiz Average</div>
          </div>

          <div className="bg-charcoal border border-graphite rounded-xl p-5">
            <div className={`text-2xl font-bold ${readiness.color}`}>{readiness.score}</div>
            <div className="text-xs text-silver mt-1">{readiness.label}</div>
          </div>
        </div>

        {/* Phase 5 — Board Readiness & Analytics */}
        <BoardReadinessCard readiness={boardReadiness} />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <WeakAreaAnalytics weakAreas={analytics.weakAreas} strongAreas={analytics.strongAreas} />
          </div>
          <div>
            <StudyRecommendations recommendations={recommendations} studentId={studentId} instructorView />
          </div>
        </div>

        <AnalyticsCharts
          readinessScore={boardReadiness.score}
          categoryPerformance={analytics.categoryPerformance}
          chapterPerformance={analytics.chapterPerformance}
          missedQuestionTrend={analytics.missedQuestionTrend}
        />

        {/* Missed Question Statistics */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Missed Question Bank</h2>
              <p className="text-sm text-silver mt-1">
                {missedQuestions.length} missed question{missedQuestions.length === 1 ? '' : 's'} recorded
              </p>
            </div>
            <Link
              href={`/instructor/student/${studentId}`}
              className="text-sm text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] font-medium"
            >
              View full report →
            </Link>
          </div>
          <div className="p-6">
            {missedQuestions.length > 0 ? (
              <MissedQuestionBank questions={missedQuestions.slice(0, 10)} instructorView />
            ) : (
              <div className="text-center text-silver py-8">
                No missed questions yet.
              </div>
            )}
          </div>
        </div>

        {/* Overall Progress Bar */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-white">Overall Course Progress</h2>
            <span className={`text-2xl font-bold ${
              overallProgress >= 80 ? 'text-gold' :
              overallProgress >= 50 ? 'text-warm-bronze' : 'text-silver'
            }`}>
              {overallProgress}%
            </span>
          </div>
          <div className="bg-graphite rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                overallProgress >= 80 ? 'bg-gold' :
                overallProgress >= 50 ? 'bg-warm-bronze' : 'bg-silver'
              }`}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-sm text-silver-gray mt-3">
            {completedChapters} of {totalChapters} chapters completed
            {quizzesCompleted > 0 && ` • ${quizzesCompleted} quizzes passed`}
            {flashcardsCompleted > 0 && ` • ${flashcardsCompleted} flashcard decks completed`}
          </p>
        </div>

        {/* Chapter Progress */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Chapter-by-Chapter Progress</h2>
          </div>
          {chapters && chapters.length > 0 ? (
            <div className="divide-y divide-graphite">
              {chapters.map((chapter) => {
                const chapterProgress = progressRecords.find((p) => p.chapter_id === chapter.id)
                const pct = chapterProgress?.progress_percentage || 0
                const flashDone = chapterProgress?.flashcards_completed
                const quizDone = chapterProgress?.quiz_completed
                const bestScore = chapterProgress?.best_quiz_score
                const chapterPassingScore = getLocalQuiz(chapter.id)?.passing_score ?? 80

                return (
                  <div key={chapter.id} className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg font-bold text-[var(--color-brand-gold)] w-8 shrink-0">
                        {String(chapter.chapter_number).padStart(2, '0')}
                      </span>
                      <div className="min-w-0">
                        <p className="text-white font-medium truncate">{chapter.title}</p>
                        <div className="flex flex-wrap gap-3 text-xs text-silver mt-1">
                          <span className={flashDone ? 'text-gold' : ''}>
                            {flashDone ? '✓ Flashcards' : '○ Flashcards'}
                          </span>
                          <span className={quizDone ? 'text-gold' : ''}>
                            {quizDone ? '✓ Quiz' : '○ Quiz'}
                          </span>
                          {bestScore !== null && bestScore !== undefined && (
                            <span className={bestScore >= chapterPassingScore ? 'text-gold' : 'text-warm-bronze'}>
                              Best: {bestScore}% (pass: {chapterPassingScore}%)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-56">
                      <div className="flex-1 bg-graphite rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            pct >= chapterPassingScore ? 'bg-gold' :
                            pct >= 50 ? 'bg-warm-bronze' :
                            pct > 0 ? 'bg-[var(--color-brand-gold)]' : 'bg-[var(--color-border-secondary)]'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-silver w-10 text-right">{pct}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-silver">No chapters available.</div>
          )}
        </div>

        {/* Flashcard Completion Summary */}
        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Flashcard Completion</h2>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-graphite rounded-full h-3">
              <div
                className="bg-silver h-3 rounded-full transition-all"
                style={{ width: `${totalChapters > 0 ? (flashcardsCompleted / totalChapters) * 100 : 0}%` }}
              />
            </div>
            <span className="text-white font-semibold w-24 text-right">
              {flashcardsCompleted} / {totalChapters}
            </span>
          </div>
          <p className="text-sm text-silver-gray mt-3">
            {flashcardsCompleted === 0
              ? 'No flashcard decks completed yet.'
              : flashcardsCompleted === totalChapters
              ? 'All flashcard decks completed.'
              : `${totalChapters - flashcardsCompleted} decks remaining.`}
          </p>
        </div>

        {/* Recent Quiz Attempts */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
            <span className="text-sm text-silver-gray">{attemptRecords.length} total</span>
          </div>
          {attemptRecords.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-silver border-b border-graphite">
                    <th className="p-4">Quiz</th>
                    <th className="p-4">Score</th>
                    <th className="p-4">Percentage</th>
                    <th className="p-4">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {attemptRecords.map((attempt) => {
                    const attemptPassingScore = getPassingScoreByQuizId(attempt.quiz_id)
                    return (
                      <tr key={attempt.id} className="border-b border-graphite/50">
                        <td className="p-4 text-white">{attempt.quiz_id}</td>
                        <td className="p-4 text-light-gray">
                          {attempt.score} / {attempt.total_questions}
                        </td>
                        <td className="p-4">
                          <span
                            className={`font-semibold ${
                              attempt.percentage >= attemptPassingScore ? 'text-gold' : 'text-warm-bronze'
                            }`}
                          >
                            {attempt.percentage}%
                          </span>
                        </td>
                        <td className="p-4 text-silver">
                          {formatDate(attempt.completed_at)}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-silver">No quiz attempts yet.</div>
          )}
        </div>

        {/* Weak Areas */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Weak Areas & Study Focus</h2>
          </div>

          {!hasEnoughQuizData ? (
            <div className="p-8 text-center text-silver">
              <p className="font-medium">Not enough quiz data yet</p>
              <p className="text-sm text-silver-gray mt-2">
                This student needs at least two completed chapter quizzes before weak-area analytics can be generated.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-graphite">
              {/* Board Risk Summary */}
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="text-sm text-silver">Board Exam Risk:</div>
                  <div className={`text-lg font-bold ${boardRisk.color}`}>{boardRisk.label}</div>
                </div>
                <p className="text-sm text-silver-gray mt-2">{boardRisk.description}</p>
              </div>

              {/* Weak Areas List */}
              {weakAreas.length > 0 && (
                <div className="p-6">
                  <h3 className="text-sm font-semibold text-silver uppercase tracking-wide mb-4">
                    Weakest Areas
                  </h3>
                  <div className="space-y-3">
                    {weakAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-charcoal/20 border border-silver/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-silver-gray">
                            {area.score < area.passingScore ? `Below passing threshold (${area.passingScore}%)` : area.score < 80 ? 'Needs polish' : 'Lowest relative score'}
                          </p>
                        </div>
                        <div className={`text-xl font-bold ${
                          area.score >= area.passingScore ? 'text-warm-bronze' :
                          area.score >= 60 ? 'text-warm-bronze' : 'text-silver'
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
                  <h3 className="text-sm font-semibold text-gold-light uppercase tracking-wide mb-4">
                    Strongest Areas
                  </h3>
                  <div className="space-y-3">
                    {strongAreas.map((area) => (
                      <div
                        key={area.chapterId}
                        className="flex items-center justify-between p-3 bg-charcoal/20 border border-gold/30 rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">
                            Ch.{area.chapterNumber} — {area.chapterTitle}
                          </p>
                          <p className="text-xs text-silver-gray">Strong performance</p>
                        </div>
                        <div className="text-xl font-bold text-gold">{area.score}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Study Focus */}
              {weakAreas.length > 0 && (
                <div className="p-6 bg-[var(--color-brand-gold)]/5">
                  <h3 className="text-sm font-semibold text-[var(--color-brand-gold)] uppercase tracking-wide mb-3">
                    Recommended Study Focus
                  </h3>
                  <p className="text-sm text-silver mb-3">
                    Prioritize review in these areas to improve board readiness:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-light-gray">
                    {weakAreas.slice(0, 3).map((area) => (
                      <li key={area.chapterId}>
                        <span className="font-medium text-white">
                          Chapter {area.chapterNumber} — {area.chapterTitle}
                        </span>
                        <span className="text-silver-gray ml-2">(current best: {area.score}%)</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {weakAreas.length === 0 && (
                <div className="p-8 text-center text-silver">
                  No weak areas found — all attempted chapters are performing strongly.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Attendance Summary</h2>
            <p className="text-sm text-silver mt-1">Last 11 school days</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-graphite">
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className={`text-xl font-bold ${attendanceSummary.attendancePercentage >= 80 ? 'text-gold' : attendanceSummary.attendancePercentage >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                {attendanceSummary.attendancePercentage}%
              </div>
              <div className="text-xs text-silver mt-1">Attendance Rate</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-gold">{attendanceSummary.presentDays}</div>
              <div className="text-xs text-silver mt-1">Present</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{attendanceSummary.absentDays}</div>
              <div className="text-xs text-silver mt-1">Absent</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-warm-bronze">{attendanceSummary.tardyDays}</div>
              <div className="text-xs text-silver mt-1">Tardy</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{attendanceSummary.excusedDays}</div>
              <div className="text-xs text-silver mt-1">Excused</div>
            </div>
          </div>

          {attendanceSummary.isAtRisk && (
            <div className="p-4 bg-charcoal/20 border-b border-silver/30">
              <div className="flex items-start gap-3">
                <span className="text-silver text-lg">⚠️</span>
                <div>
                  <h3 className="text-sm font-semibold text-silver">Attendance Concern</h3>
                  <p className="text-sm text-light-gray">{attendanceSummary.riskReason}</p>
                </div>
              </div>
            </div>
          )}

          <div className="p-6 border-b border-graphite">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Recent History</h3>
            {recentAttendance.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
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
                      <tr key={record.id} className="border-b border-graphite last:border-0">
                        <td className="p-3 text-light-gray">{formatDate(record.date)}</td>
                        <td className="p-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColorClass(record.status)}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="p-3 text-silver">
                          {record.clockedInAt ? new Date(record.clockedInAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-silver">
                          {record.clockedOutAt ? new Date(record.clockedOutAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-silver">
                          {record.minutesPresent !== null ? `${record.minutesPresent} min` : '—'}
                        </td>
                        <td className="p-3 text-silver truncate max-w-[200px]">
                          {record.note || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-silver text-sm">No attendance records found.</p>
            )}
          </div>

          {attendanceNoteRecords.length > 0 && (
            <div className="p-6">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">Attendance Notes</h3>
              <div className="space-y-3">
                {attendanceNoteRecords.map((note) => (
                  <div key={note.id} className="p-3 bg-black border border-graphite rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-silver-gray">{formatDate(note.date)}</span>
                      <span className="text-xs text-silver-gray">by {note.instructorName}</span>
                    </div>
                    <p className="text-sm text-light-gray">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Instructor Notes */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Instructor Notes</h2>
          </div>

          {notesError && (
            <div className="mx-6 mt-6 bg-charcoal/30 border border-silver/50 text-silver rounded-lg p-4">
              {notesError}
            </div>
          )}

          <div className="p-6">
            <AddNoteForm studentId={studentId} />
          </div>

          {noteRecords.length > 0 ? (
            <div className="divide-y divide-graphite">
              {noteRecords.map((note) => (
                <div key={note.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        note.note_type === 'coaching' ? 'bg-silver/20 text-silver border border-silver/30' :
                        note.note_type === 'remediation' ? 'bg-silver/20 text-silver border border-silver/30' :
                        note.note_type === 'readiness' ? 'bg-gold/20 text-gold border border-gold/30' :
                        'bg-[var(--color-border-secondary)] text-light-gray border border-silver-gray'
                      }`}>
                        {note.note_type}
                      </span>
                      <span className="text-sm text-silver">by {note.instructor_name}</span>
                    </div>
                    <span className="text-xs text-silver-gray">{formatDate(note.created_at)}</span>
                  </div>
                  <p className="text-light-gray text-sm whitespace-pre-wrap">{note.note_text}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-silver">
              No instructor notes yet.
              <p className="text-sm text-silver-gray mt-2">
                Use the form above to add coaching, remediation, readiness, or general notes.
              </p>
            </div>
          )}
        </div>

        {/* Hour Tracker */}
        <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
          <div className="p-6 border-b border-graphite">
            <h2 className="text-xl font-semibold text-white">Hour Tracker</h2>
            <p className="text-sm text-silver mt-1">
              Only instructor-approved hours count toward official completed hours.
            </p>
          </div>

          {/* Hour Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-6 border-b border-graphite">
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-gold">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-silver mt-1">Approved Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-warm-bronze">{formatMinutes(pendingMinutes)}</div>
              <div className="text-xs text-silver mt-1">Pending Approval</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-[var(--color-brand-gold)]">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-silver mt-1">Required Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-silver mt-1">Remaining Hours</div>
            </div>
            <div className="bg-black border border-graphite rounded-xl p-4">
              <div className="text-xl font-bold text-silver">{completionPercentage}%</div>
              <div className="text-xs text-silver mt-1">Completion</div>
            </div>
          </div>

          {/* Daily Hour Log */}
          <div className="p-6 border-b border-graphite">
            <h3 className="text-lg font-semibold text-white mb-4">Daily Hour Log</h3>
            {hourLogRecords.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
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
                      <tr key={log.id} className="border-b border-graphite/50">
                        <td className="p-4 text-white">{formatDate(log.date)}</td>
                        <td className="p-4 text-light-gray">{log.category}</td>
                        <td className="p-4 text-light-gray">{log.minutes}</td>
                        <td className="p-4 text-white font-medium">{formatMinutes(log.minutes)}</td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase border ${statusBadgeClasses(log.status)}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="p-4 text-silver-gray">{log.notes || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-silver">
                No hour logs yet.
                <p className="text-sm text-silver-gray mt-2">Daily logs will appear here once submitted.</p>
              </div>
            )}
          </div>

          {/* Rejected Logs */}
          {hourLogRecords.some((h) => h.status === 'rejected') && (
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Rejected Logs</h3>
              <p className="text-sm text-silver-gray mb-3">
                These logs do not count toward official hours and may need to be resubmitted.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-silver border-b border-graphite">
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
                        <tr key={log.id} className="border-b border-graphite/50">
                          <td className="p-4 text-white">{formatDate(log.date)}</td>
                          <td className="p-4 text-light-gray">{log.category}</td>
                          <td className="p-4 text-white">{formatMinutes(log.minutes)}</td>
                          <td className="p-4 text-silver-gray">{log.notes || '—'}</td>
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
              <h2 className="text-2xl font-bold text-white">Board Hours Summary Report</h2>
              <p className="text-sm text-silver-gray">Generated {new Date().toLocaleDateString()}</p>
            </div>
            <PrintButton />
          </div>

          {/* Student Info */}
          <div className="mb-6">
            <StudentIdentity student={resolvedStudent} variant="light" showRole />
            <p className="text-sm text-silver-gray mt-2">Program: Barbering</p>
            <p className="text-sm text-silver-gray">State: Oklahoma</p>
          </div>

          {/* Official Hour Totals */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-white">{formatMinutes(REQUIRED_MINUTES)}</div>
              <div className="text-xs text-silver-gray">Required Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-gold">{formatMinutes(approvedMinutes)}</div>
              <div className="text-xs text-silver-gray">Approved Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-silver">{formatMinutes(remainingMinutes)}</div>
              <div className="text-xs text-silver-gray">Remaining Hours</div>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="text-2xl font-bold text-silver">{completionPercentage}%</div>
              <div className="text-xs text-silver-gray">Completion</div>
            </div>
          </div>

          {/* Approved Daily Logs */}
          <div className="mb-6 print-break-inside">
            <h3 className="text-lg font-bold text-white mb-3">Approved Daily Hour Logs</h3>
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
              <p className="text-silver-gray">No approved hours yet.</p>
            )}
          </div>

          {/* Disclaimer */}
          <div className="bg-off-white border border-warm-bronze rounded-lg p-4 mb-6">
            <p className="text-sm text-warm-bronze">
              <span className="font-semibold">Disclaimer:</span> Verify state-specific submission requirements before submitting to a licensing board. This report is a summary of approved hours only and is not an official state board form.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-silver mt-8 pt-4 border-t border-gray-200">
            ASCYN PRO — Board Hours Summary Report
          </div>
        </section>
      </div>
    </div>
  )
}
