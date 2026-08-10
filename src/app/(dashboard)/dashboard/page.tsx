import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { QuizAttempt, StudentProgress, AttendanceRecord, Grade, GradeCategory, Assessment } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { demoAttendanceRecords, getDemoNotificationsForUser, getDemoThreadsForUser, getDemoAnnouncementsForSchool, demoAnnouncements, demoGrades, demoGradeCategories, demoAssessments } from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { calculateAttendanceSummary, getTodayAttendanceStatus, getStatusColorClass } from '@/lib/attendance'
import { formatMessageTime, getThreadDisplayName, priorityColorClasses } from '@/lib/messaging'
import BoardReadinessCard from '@/components/BoardReadinessCard'
import WeakAreaAnalytics from '@/components/WeakAreaAnalytics'
import StudyRecommendations from '@/components/StudyRecommendations'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import AnnouncementBanner from '@/components/messaging/AnnouncementBanner'
import UnreadBadge from '@/components/messaging/UnreadBadge'
import StudentGradeWidget from '@/components/gradebook/StudentGradeWidget'
import AssessmentList from '@/components/assessments/AssessmentList'
import { calculateStudentGradePerformance } from '@/lib/gradebook'
import { mapAttendanceRecordsFromDb, mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'
import { getRoleBasedRedirect, validateLoginAccess } from '@/lib/auth-access'

// Phase 4 Design System Components
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card'
import { MetricCard } from '@/components/ui/MetricCard'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login?redirect=/dashboard')
  }

  // Get user profile (for apprentice null-school handling)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, barber_shop_name, mentor_name, approval_status, is_disabled, full_name')
    .eq('id', user.id)
    .single()

  // Enforce approval, disabled, and known-role checks before rendering.
  const access = validateLoginAccess(profile)
  if (!access.ok) {
    redirect(`/login?error=${access.errorKey ?? 'unknown'}`)
  }

  // Route users to the correct home based on role and school approval state.
  if (profile.role === 'instructor') {
    if (profile.school_id) {
      const { data: school } = await supabase
        .from('schools')
        .select('is_active')
        .eq('id', profile.school_id)
        .single()
      if (school && !school.is_active) {
        redirect('/pending-approval')
      }
    } else {
      redirect('/pending-approval')
    }
  }

  if (profile.role !== 'student' && profile.role !== 'apprentice') {
    redirect(getRoleBasedRedirect(profile.role))
  }

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
    .eq('user_id', user.id)
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
  const { status: todayStatus } = getTodayAttendanceStatus(attendanceRecords, user.id)

  // Phase 9 — gradebook & assessments data
  const gradesQuery = supabase.from('grades').select('*').eq('student_id', user.id)
  if (profile?.school_id) {
    gradesQuery.eq('school_id', profile.school_id)
  }
  const { data: gradesData } = await gradesQuery
  let gradeRecords: Grade[] = mapGradesFromDb(gradesData || []) || []

  let categoriesQuery = supabase.from('grade_categories').select('*')
  if (profile?.school_id) {
    categoriesQuery = categoriesQuery.or(`school_id.eq.${profile.school_id},school_id.is.null`)
  } else {
    categoriesQuery = categoriesQuery.is('school_id', null)
  }
  const { data: categoriesData } = await categoriesQuery
  let gradeCategories: GradeCategory[] = mapGradeCategoriesFromDb(categoriesData || []) || []

  if ((gradeRecords.length === 0 || gradeCategories.length === 0) && isDemoFallbackEnabled()) {
    gradeRecords = demoGrades.filter((g) => g.studentId === user.id)
    gradeCategories = demoGradeCategories
  }

  const assessmentsQuery = supabase.from('assessments').select('*').eq('student_id', user.id)
  if (profile?.school_id) {
    assessmentsQuery.eq('school_id', profile.school_id)
  }
  const { data: assessmentsData } = await assessmentsQuery
  let assessmentRecords: Assessment[] = mapAssessmentsFromDb(assessmentsData || []) || []
  if (assessmentRecords.length === 0 && isDemoFallbackEnabled()) {
    assessmentRecords = demoAssessments.filter((a) => a.studentId === user.id)
  }

  const missingAssignmentCount = gradeCategories.filter((c) => {
    return gradeRecords.filter((g) => g.categoryId === c.id && !g.isExcused).length === 0
  }).length

  const gradePerformance = calculateStudentGradePerformance(
    user.id,
    gradeRecords,
    gradeCategories,
    assessmentRecords,
    missingAssignmentCount
  )

  const recentFailedAssessments = assessmentRecords.filter((a) => !a.isPassed).slice(0, 3)

  // Phase 8A messaging demo data
  const demoNotifications = isDemoFallbackEnabled() ? getDemoNotificationsForUser(user.id) : []
  const demoThreads = isDemoFallbackEnabled() ? getDemoThreadsForUser(user.id) : []
  const demoAnnouncementsForSchool = isDemoFallbackEnabled()
    ? getDemoAnnouncementsForSchool(profile?.school_id || 'demo-school')
    : []
  const fallbackAnnouncements = demoAnnouncementsForSchool.length > 0
    ? demoAnnouncementsForSchool
    : demoAnnouncements.slice(0, 1)
  const unreadNotifications = demoNotifications.filter((n) => !n.read)
  const unreadThreads = demoThreads.filter((t) => t.unreadCount > 0)

  // Calculate stats
  const totalChapters = chapters.length
  const progress: StudentProgress[] = progressData || []
  const attempts: QuizAttempt[] = attemptsData || []
  const completedChapters = progress.filter(p => p.progress_percentage === 100).length || 0
  const inProgressChapters = progress.filter(p => p.progress_percentage > 0 && p.progress_percentage < 100).length || 0
  const totalProgressSum = progress.reduce((acc, p) => acc + p.progress_percentage, 0) || 0
  const averageProgress = totalChapters > 0
    ? Math.round(totalProgressSum / totalChapters)
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
    streakDays: analytics.averageScore > 0 ? 5 : 0,
  })

  // Derive missed questions; fall back to demo data when none exist
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

  // Find continue chapter (first incomplete)
  const continueChapter = chapters?.find(chapter => {
    const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
    return !chapterProgress || chapterProgress.progress_percentage < 100
  })

  const continueProgress = continueChapter
    ? progress?.find(p => p.chapter_id === continueChapter.id)?.progress_percentage || 0
    : 0
  const continueTitle = continueProgress > 0 ? 'Continue Studying' : 'Start Studying'
  const continueButton = continueProgress > 0 ? 'Continue Chapter' : 'Start Chapter'

  // Get user display name
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Student'

  return (
    <div className="space-y-8">
      {/* ZONE 1: ORIENTATION — Where am I? */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {displayName}</h1>
          <p className="text-[var(--color-text-muted)] mt-1">Track your progress through all 21 chapters</p>
          {profile?.role === 'apprentice' && (
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="gold" size="sm">Apprentice</Badge>
              {profile.barber_shop_name && (
                <Badge variant="default" size="sm">{profile.barber_shop_name}</Badge>
              )}
              {profile.mentor_name && (
                <Badge variant="default" size="sm">Mentor: {profile.mentor_name}</Badge>
              )}
            </div>
          )}
        </div>

        {/* Announcement Banner — Critical info only */}
        {fallbackAnnouncements.length > 0 && (
          <AnnouncementBanner announcements={fallbackAnnouncements} />
        )}

        {/* Current Chapter Card — Primary orientation */}
        {continueChapter && (
          <Card variant="elevated" padding="lg" className="border-l-4 border-l-[var(--color-brand-gold)]">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="gold" size="sm">Current Chapter</Badge>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    Chapter {continueChapter.chapter_number} of {totalChapters}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {continueChapter.title}
                </h2>
                <p className="text-[var(--color-text-muted)] text-sm mb-3">
                  {continueChapter.description}
                </p>
                <ProgressBar
                  value={continueProgress}
                  max={100}
                  size="md"
                  showLabel
                  label="Chapter Progress"
                />
              </div>
              <div className="shrink-0">
                <Link
                  href={`/dashboard/chapters/${continueChapter.chapter_number}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-brand-gold)] text-black font-semibold rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
                >
                  {continueButton}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* ZONE 2: KEY METRICS — How am I doing? */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Your Progress</h2>
          <p className="text-sm text-[var(--color-text-muted)]">Key metrics at a glance</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Board Readiness — Primary metric */}
          <Card variant="elevated" padding="md" className="text-center col-span-2 md:col-span-1">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-light-gray"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className={readiness.score >= 90 ? 'text-gold' : readiness.score >= 80 ? 'text-warm-bronze' : readiness.score >= 70 ? 'text-silver' : 'text-silver'}
                    strokeDasharray={`${readiness.score}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-white">{readiness.score}</span>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-[var(--color-text-muted)]">Board Readiness</p>
                <Badge
                  variant={readiness.score >= 90 ? 'success' : readiness.score >= 80 ? 'warning' : readiness.score >= 70 ? 'info' : 'error'}
                  size="sm"
                  className="mt-1"
                >
                  {readiness.level}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Overall Progress */}
          <MetricCard
            label="Overall Progress"
            value={`${averageProgress}%`}
            variant="default"
          />

          {/* Study Streak */}
          <MetricCard
            label="Study Streak"
            value={analytics.averageScore > 0 ? '5 days' : '0 days'}
            variant="warning"
          />

          {/* Attendance */}
          <MetricCard
            label="Attendance"
            value={`${attendanceSummary.attendancePercentage}%`}
            variant={attendanceSummary.attendancePercentage >= 80 ? 'success' : attendanceSummary.attendancePercentage >= 70 ? 'warning' : 'error'}
          />
        </div>
      </div>

      {/* ZONE 3: DETAIL CONTENT — What should I do next? */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recommendations + Weak Areas */}
        <div className="lg:col-span-2 space-y-6">
          {/* Study Recommendations */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Recommended Next Steps</h2>
              <p className="text-sm text-[var(--color-text-muted)]">Personalized study plan</p>
            </div>
            <StudyRecommendations recommendations={recommendations} />
          </div>

          {/* Weak Areas Preview */}
          {analytics.weakAreas.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Focus Areas</h2>
                <p className="text-sm text-[var(--color-text-muted)]">Topics needing attention</p>
              </div>
              <Card variant="default" padding="md">
                <div className="space-y-3">
                  {analytics.weakAreas.slice(0, 3).map((area) => (
                    <div
                      key={area.id}
                      className="flex items-center justify-between p-3 bg-charcoal/20 border border-silver/30 rounded-lg"
                    >
                      <div>
                        <p className="text-white font-medium">{area.name}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{area.attempts} attempts</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-silver">{area.score}%</p>
                        <Link
                          href={`/dashboard/chapters/${area.chapterNumber}`}
                          className="text-xs text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)]"
                        >
                          Review →
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                {analytics.weakAreas.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link
                      href="/dashboard/progress"
                      className="text-sm text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)]"
                    >
                      View all {analytics.weakAreas.length} focus areas →
                    </Link>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions + Notifications */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
            </div>
            <Card variant="default" padding="md">
              <div className="space-y-3">
                <Link
                  href="/dashboard/missed-questions"
                  className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)]/50 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📝</span>
                    <div>
                      <p className="text-white font-medium">Missed Questions</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{missedQuestions.length} to review</p>
                    </div>
                  </div>
                  <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]">→</span>
                </Link>

                <Link
                  href="/dashboard/progress"
                  className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)]/50 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <div>
                      <p className="text-white font-medium">Full Analytics</p>
                      <p className="text-xs text-[var(--color-text-muted)]">Detailed progress</p>
                    </div>
                  </div>
                  <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]">→</span>
                </Link>

                <Link
                  href="/dashboard/grades"
                  className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)]/50 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🎓</span>
                    <div>
                      <p className="text-white font-medium">My Grades</p>
                      <p className="text-xs text-[var(--color-text-muted)]">View gradebook</p>
                    </div>
                  </div>
                  <span className="text-[var(--color-text-muted)] group-hover:text-[var(--color-brand-gold)]">→</span>
                </Link>
              </div>
            </Card>
          </div>

          {/* Notifications Preview */}
          {(unreadThreads.length > 0 || unreadNotifications.length > 0) && (
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Notifications</h2>
              </div>
              <Card variant="default" padding="md">
                <div className="space-y-3">
                  {unreadThreads.length > 0 && (
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)]/50 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">💬</span>
                        <div>
                          <p className="text-white font-medium">Messages</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{unreadThreads.length} unread</p>
                        </div>
                      </div>
                      <UnreadBadge count={unreadThreads.length} />
                    </Link>
                  )}

                  {unreadNotifications.length > 0 && (
                    <Link
                      href="/dashboard/messages"
                      className="flex items-center justify-between p-3 bg-[var(--color-background-secondary)]/50 rounded-lg hover:bg-[var(--color-background-secondary)] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🔔</span>
                        <div>
                          <p className="text-white font-medium">Notifications</p>
                          <p className="text-xs text-[var(--color-text-muted)]">{unreadNotifications.length} unread</p>
                        </div>
                      </div>
                      <UnreadBadge count={unreadNotifications.length} />
                    </Link>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* Performance Alert */}
          {gradePerformance.isAtRisk && (
            <Card variant="outlined" padding="md" className="border-silver/30 bg-charcoal/10">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <h3 className="text-lg font-semibold text-silver mb-1">Performance Alert</h3>
                  <p className="text-sm text-[var(--color-text-secondary)]">
                    Your overall grade is below the passing threshold. Schedule a check-in with your instructor.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Chapter Grid — Below the fold */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">All Chapters</h2>
            <p className="text-sm text-[var(--color-text-muted)]">Your learning journey</p>
          </div>
          <Link
            href="/dashboard/chapters"
            className="text-sm text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)]"
          >
            View all →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters?.slice(0, 6).map((chapter) => {
            const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
            const progressPercent = chapterProgress?.progress_percentage || 0
            const isCompleted = progressPercent === 100
            const isStarted = progressPercent > 0

            return (
              <Link
                key={chapter.id}
                href={`/dashboard/chapters/${chapter.chapter_number}`}
                className="group"
              >
                <Card variant="default" padding="md" hover className="h-full">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl font-bold text-[var(--color-brand-gold)]">
                      {String(chapter.chapter_number).padStart(2, '0')}
                    </span>
                    <Badge
                      variant={isCompleted ? 'success' : isStarted ? 'info' : 'default'}
                      size="sm"
                    >
                      {isCompleted ? 'Completed' : isStarted ? 'In Progress' : 'Not Started'}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-white mb-2 line-clamp-1 group-hover:text-[var(--color-brand-gold)] transition-colors">
                    {chapter.title}
                  </h3>

                  <p className="text-sm text-[var(--color-text-muted)] mb-4 line-clamp-2">
                    {chapter.description}
                  </p>

                  <ProgressBar
                    value={progressPercent}
                    max={100}
                    size="sm"
                    showLabel
                  />
                </Card>
              </Link>
            )
          })}
        </div>

        {chapters && chapters.length > 6 && (
          <div className="text-center mt-6">
            <Link
              href="/dashboard/chapters"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-background-secondary)] text-white font-semibold rounded-lg hover:bg-[var(--color-border-secondary)] transition-colors"
            >
              View All {chapters.length} Chapters
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
