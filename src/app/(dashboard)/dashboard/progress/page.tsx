import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { StudentProgress, QuizAttempt, AttendanceRecord } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { demoAttendanceRecords } from '@/lib/demo-data'
import { calculateAttendanceSummary } from '@/lib/attendance'
import BoardReadinessCard from '@/components/BoardReadinessCard'
import WeakAreaAnalytics from '@/components/WeakAreaAnalytics'
import StudyRecommendations from '@/components/StudyRecommendations'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import { mapAttendanceRecordsFromDb } from '@/lib/mappers/operational-data-mappers'

// Phase 4 Design System Components
import { Card } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'

export default async function ProgressPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('school_id')
    .eq('id', user.id)
    .single()

  // Use local chapters (not Supabase)
  const chapters = localChapters

  // Get user progress
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('*')
    .eq('user_id', user?.id)

  // Get quiz attempts
  const { data: attemptsData } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', user?.id)
    .order('completed_at', { ascending: false })

  // Get attendance records
  const attendanceQuery = supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
  if (profile?.school_id) {
    attendanceQuery.eq('school_id', profile.school_id)
  }
  const { data: attendanceData } = await attendanceQuery

  let attendanceRecords: AttendanceRecord[] = mapAttendanceRecordsFromDb(attendanceData || []) || []
  if (attendanceRecords.length === 0) {
    attendanceRecords = demoAttendanceRecords.filter((a) => a.userId === user.id)
  }

  const attendanceSummary = calculateAttendanceSummary(user.id, attendanceRecords)

  // Calculate stats
  const progress: StudentProgress[] = progressData || []
  const attempts: QuizAttempt[] = attemptsData || []
  const totalChapters = chapters?.length || 0
  const completedChapters = progress.filter(p => p.progress_percentage === 100).length || 0
  const flashcardsCompleted = progress.filter(p => p.flashcards_completed).length || 0
  const quizzesCompleted = progress.filter(p => p.quiz_completed).length || 0
  const averageQuizScore = attempts.length
    ? Math.round(attempts.reduce((acc, a) => acc + a.percentage, 0) / attempts.length)
    : 0

  // Phase 5 analytics
  const attemptRecords = attempts
  const progressRecords = progress
  const questions = Object.values(allQuizQuestions).flat()

  const analytics = analyzePerformance({
    userId: user.id,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })

  const readiness = calculateBoardReadiness({
    userId: user.id,
    attempts: attemptRecords,
    progress: progressRecords,
    totalChapters,
  })

  const { buildMissedQuestions } = await import('@/lib/analytics')
  let missedQuestions = buildMissedQuestions({
    userId: user.id,
    attempts: attemptRecords,
    progress: progressRecords,
    chapters,
    questions,
  })
  if (missedQuestions.length === 0) {
    missedQuestions = getDemoMissedQuestionsForUser(user.id)
  }

  const recommendations = generateStudyPlan({
    userId: user.id,
    readiness,
    weakAreas: analytics.weakAreas,
    strongAreas: analytics.strongAreas,
    missedQuestions,
    totalChapters,
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">My Progress</h1>
        <p className="text-[var(--color-text-muted)] mt-1">Track your learning journey and identify areas for improvement</p>
      </div>

      {/* ZONE 1: Key Metrics */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Overview</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Your learning statistics</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard
            label="Overall Progress"
            value={`${Math.round(((completedChapters / totalChapters) * 100) || 0)}%`}
            variant="default"
          />
          
          <MetricCard
            label="Flashcards Done"
            value={flashcardsCompleted}
            variant="info"
          />
          
          <MetricCard
            label="Quizzes Passed"
            value={quizzesCompleted}
            variant="success"
          />
          
          <MetricCard
            label="Avg Quiz Score"
            value={`${averageQuizScore}%`}
            variant="warning"
          />

          <MetricCard
            label="Attendance"
            value={`${attendanceSummary.attendancePercentage}%`}
            variant={attendanceSummary.attendancePercentage >= 80 ? 'success' : attendanceSummary.attendancePercentage >= 70 ? 'warning' : 'error'}
          />
        </div>
      </div>

      {/* ZONE 2: Board Readiness */}
      <BoardReadinessCard readiness={readiness} />

      {/* ZONE 3: Detailed Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <WeakAreaAnalytics weakAreas={analytics.weakAreas} strongAreas={analytics.strongAreas} />
        </div>
        <div>
          <StudyRecommendations recommendations={recommendations} />
        </div>
      </div>

      {/* Analytics Charts */}
      <AnalyticsCharts
        readinessScore={readiness.score}
        categoryPerformance={analytics.categoryPerformance}
        chapterPerformance={analytics.chapterPerformance}
        missedQuestionTrend={analytics.missedQuestionTrend}
      />

      {/* Chapter Progress Detail */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Chapter Progress</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Detailed breakdown by chapter</p>
        </div>
        
        <Card variant="default" padding="lg">
          <div className="space-y-4">
            {chapters?.map((chapter) => {
              const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
              const progressPercent = chapterProgress?.progress_percentage || 0
              
              return (
                <div key={chapter.id} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-[var(--color-text-muted)] w-8">
                    {String(chapter.chapter_number).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white">{chapter.title}</span>
                      <span className="text-[var(--color-text-muted)]">{progressPercent}%</span>
                    </div>
                    <ProgressBar
                      value={progressPercent}
                      max={100}
                      size="sm"
                    />
                  </div>
                  <div className="flex gap-2">
                    {chapterProgress?.flashcards_completed && (
                      <Badge variant="success" size="sm">Flashcards</Badge>
                    )}
                    {chapterProgress?.quiz_completed && (
                      <Badge variant="info" size="sm">Quiz</Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* Recent Quiz Attempts */}
      {attempts && attempts.length > 0 && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent Quiz Attempts</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Your latest quiz results</p>
          </div>
          
          <Card variant="default" padding="lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Score</th>
                    <th className="pb-3">Percentage</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {attempts.slice(0, 10).map((attempt) => (
                    <tr key={attempt.id} className="border-b border-[var(--color-border-primary)]/50">
                      <td className="py-3 text-[var(--color-text-secondary)]">
                        {new Date(attempt.completed_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 text-white">
                        {attempt.score}/{attempt.total_questions}
                      </td>
                      <td className="py-3">
                        <span className={`font-medium ${
                          attempt.percentage >= 80 ? 'text-gold' : 'text-warm-bronze'
                        }`}>
                          {attempt.percentage}%
                        </span>
                      </td>
                      <td className="py-3">
                        <Badge
                          variant={attempt.percentage >= 80 ? 'success' : 'warning'}
                          size="sm"
                        >
                          {attempt.percentage >= 80 ? 'Passed' : 'Review'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
