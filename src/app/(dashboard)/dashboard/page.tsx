import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { QuizAttempt, StudentProgress, AttendanceRecord, Notification } from '@/types'
import { localChapters } from '@/lib/local-data'
import { allQuizQuestions } from '@/lib/quiz-data'
import { calculateBoardReadiness } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { generateStudyPlan } from '@/lib/recommendations'
import { getDemoMissedQuestionsForUser } from '@/lib/demo-analytics'
import { demoAttendanceRecords, getDemoNotificationsForUser, getDemoThreadsForUser, getDemoAnnouncementsForSchool, demoAnnouncements } from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { calculateAttendanceSummary, getTodayAttendanceStatus, getStatusColorClass } from '@/lib/attendance'
import { formatMessageTime, getThreadDisplayName, priorityColorClasses } from '@/lib/messaging'
import BoardReadinessCard from '@/components/BoardReadinessCard'
import WeakAreaAnalytics from '@/components/WeakAreaAnalytics'
import StudyRecommendations from '@/components/StudyRecommendations'
import AnalyticsCharts from '@/components/AnalyticsCharts'
import AnnouncementBanner from '@/components/messaging/AnnouncementBanner'
import UnreadBadge from '@/components/messaging/UnreadBadge'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  // Get user profile (for apprentice null-school handling)
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, barber_shop_name, mentor_name')
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
    .eq('user_id', user.id)
    .order('completed_at', { ascending: false })

  // Get attendance records
  const { data: attendanceData } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  let attendanceRecords: AttendanceRecord[] = (attendanceData as AttendanceRecord[]) || []
  if (attendanceRecords.length === 0) {
    attendanceRecords = demoAttendanceRecords.filter((a) => a.userId === user.id)
  }

  const attendanceSummary = calculateAttendanceSummary(user.id, attendanceRecords)
  const { status: todayStatus } = getTodayAttendanceStatus(attendanceRecords, user.id)
  const lastAttendanceNote = attendanceRecords.find((r) => r.note)?.note || null

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
  // Overall progress = average across ALL chapters (including 0% for not started)
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
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-gray-400">Track your progress through all 21 chapters</p>
        {profile?.role === 'apprentice' && (
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
              Apprentice
            </span>
            {profile.barber_shop_name && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full">
                {profile.barber_shop_name}
              </span>
            )}
            {profile.mentor_name && (
              <span className="px-2 py-1 bg-gray-800 text-gray-400 rounded-full">
                Mentor: {profile.mentor_name}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Announcement Banner */}
      <AnnouncementBanner announcements={fallbackAnnouncements} />

      {/* Notification Summary + Unread Badge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/messages"
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Messages</p>
              <p className="text-2xl font-bold text-white mt-1">
                {unreadThreads.length} unread
              </p>
            </div>
            <UnreadBadge count={unreadThreads.length} />
          </div>
          <p className="text-xs text-gray-500 mt-2">View inbox</p>
        </Link>

        <Link
          href="/dashboard/messages"
          className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-[#D4AF37]/30 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">Notifications</p>
              <p className="text-2xl font-bold text-white mt-1">
                {unreadNotifications.length} unread
              </p>
            </div>
            <UnreadBadge count={unreadNotifications.length} />
          </div>
          <p className="text-xs text-gray-500 mt-2">View notification center</p>
        </Link>
      </div>

      {/* Recent Messages Widget */}
      {demoThreads.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Messages</h2>
            <Link
              href="/dashboard/messages"
              className="text-sm text-[#D4AF37] hover:text-[#F4E4A6]"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-800">
            {demoThreads.slice(0, 3).map((thread) => (
              <li key={thread.id}>
                <Link
                  href="/dashboard/messages"
                  className="flex items-center justify-between p-4 hover:bg-gray-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-white truncate">
                      {getThreadDisplayName(thread, user.id)}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{thread.subject}</p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {thread.lastMessagePreview}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs text-gray-500 block">
                      {formatMessageTime(thread.lastMessageAt)}
                    </span>
                    {thread.unreadCount > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full mt-1">
                        {thread.unreadCount}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Latest Notifications */}
      {demoNotifications.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Latest Notifications</h2>
            <Link
              href="/dashboard/messages"
              className="text-sm text-[#D4AF37] hover:text-[#F4E4A6]"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-gray-800">
            {demoNotifications.slice(0, 3).map((notification) => (
              <li
                key={notification.id}
                className={`p-4 ${notification.read ? 'bg-gray-900/50' : 'bg-gray-800/30'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium border ${priorityColorClasses(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className="text-xs text-gray-500">{formatMessageTime(notification.createdAt)}</span>
                    </div>
                    <p className={`font-medium ${notification.read ? 'text-gray-300' : 'text-white'}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{notification.body}</p>
                  </div>
                  {!notification.read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-2" />}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">📚</div>
          <div className="text-3xl font-bold text-white">{totalChapters}</div>
          <div className="text-sm text-gray-400">Total Chapters</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-3xl font-bold text-[#D4AF37]">{completedChapters}</div>
          <div className="text-sm text-gray-400">Completed</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">🔄</div>
          <div className="text-3xl font-bold text-blue-400">{inProgressChapters}</div>
          <div className="text-sm text-gray-400">In Progress</div>
        </div>
        
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-3xl font-bold text-green-400">{averageProgress}%</div>
          <div className="text-sm text-gray-400">Overall Progress</div>
        </div>

        {/* Attendance Snapshot Card */}
        <div className={`bg-gray-900 border rounded-xl p-6 ${attendanceSummary.isAtRisk ? 'border-red-900/50' : 'border-gray-800'}`}>
          <div className="text-3xl mb-2">⏰</div>
          <div className={`text-3xl font-bold ${attendanceSummary.attendancePercentage >= 80 ? 'text-green-400' : attendanceSummary.attendancePercentage >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>
            {attendanceSummary.attendancePercentage}%
          </div>
          <div className="text-sm text-gray-400">Attendance</div>
          <div className="mt-2 flex items-center gap-2">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${getStatusColorClass(todayStatus)}`}>
              {todayStatus || 'Not marked'}
            </span>
          </div>
          {attendanceSummary.isAtRisk && (
            <p className="mt-2 text-xs text-red-400">{attendanceSummary.riskReason}</p>
          )}
        </div>
      </div>

      {/* Board Readiness */}
      <BoardReadinessCard readiness={readiness} />

      {/* Weak / Strong Areas + Recommendations */}
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

      {/* Continue Studying */}
      {continueChapter && (
        <div className="bg-gradient-to-r from-[#D4AF37]/10 to-transparent border border-[#D4AF37]/20 rounded-xl p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">{continueTitle}</h2>
              <p className="text-gray-400">Chapter {continueChapter.chapter_number}: {continueChapter.title}</p>
            </div>
            <Link
              href={`/dashboard/chapters/${continueChapter.chapter_number}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-gray-950 font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
            >
              {continueButton}
            </Link>
          </div>
        </div>
      )}

      {/* Chapter Grid */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">All Chapters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters?.map((chapter) => {
            const chapterProgress = progress?.find(p => p.chapter_id === chapter.id)
            const progressPercent = chapterProgress?.progress_percentage || 0
            
            return (
              <Link
                key={chapter.id}
                href={`/dashboard/chapters/${chapter.chapter_number}`}
                className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-[#D4AF37]/30 transition-all card-hover"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl font-bold text-[#D4AF37]">
                    {String(chapter.chapter_number).padStart(2, '0')}
                  </span>
                  {progressPercent === 100 && (
                    <span className="text-green-400 text-xl">✓</span>
                  )}
                </div>
                
                <h3 className="font-semibold text-white mb-2 group-hover:text-[#D4AF37] transition-colors">
                  {chapter.title}
                </h3>
                
                <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                  {chapter.description}
                </p>
                
                {/* Progress bar */}
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="bg-[#D4AF37] h-2 rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <div className="text-right text-xs text-gray-500 mt-1">
                  {progressPercent}%
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}


