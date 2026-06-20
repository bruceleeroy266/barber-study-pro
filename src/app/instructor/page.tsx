import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt } from '@/types'
import { localChapters } from '@/lib/local-data'

// ── At-Risk Criteria ──
const RISK_LOW_PROGRESS = 50        // progress % below this is a risk factor
const RISK_LOW_QUIZ_SCORE = 60      // avg quiz % below this is a risk factor
const RISK_INACTIVE_DAYS = 14       // no activity in this many days is a risk factor
const ACTIVE_DAYS = 7               // "active" if studied within this window
const STRUGGLING_THRESHOLD = 70     // below this % = struggling student (intentionally lower than 75% quiz pass threshold for early warning)

interface ChapterFocusArea {
  chapterId: string
  chapterNumber: number
  chapterTitle: string
  avgQuizScore: number
  avgCompletion: number
  strugglingCount: number
  neverAttemptedCount: number
  totalStudents: number
  difficultyScore: number
  status: 'healthy' | 'attention' | 'critical'
}

interface StudentStat extends Profile {
  completedChapters: number
  avgQuizScore: number
  quizzesTaken: number
  totalChapters: number
  overallProgress: number
  lastStudiedAt: string | null
  riskFactors: string[]
  riskLevel: 'none' | 'low' | 'medium' | 'high'
  healthScore: number
  healthCategory: 'excellent' | 'healthy' | 'watch' | 'intervention' | 'critical'
  activityScore: number
  consistencyScore: number
  daysSinceActive: number | null
  insight: string | null
}

export default async function InstructorDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is instructor or admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, full_name, schools(*)')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  const schoolId = profile.school_id
  const schoolName = profile.schools?.name || 'Your School'

  // Get students in the same school (exclude apprentices without a school)
  const { data: students } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice']) as { data: Profile[] | null; error: any }

  // Use local chapters (not Supabase)
  const chapters = localChapters

  // Get all student progress for this school
  const studentIds = students?.map((s) => s.id) || []
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: StudentProgress[] | null; error: any }

  // Get all quiz attempts for these students
  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__']) as { data: QuizAttempt[] | null; error: any }

  // Compute per-student stats
  const studentStats: StudentStat[] = (students || []).map((student) => {
    const progress = (allProgress || []).filter((p) => p.user_id === student.id)
    const attempts = (allAttempts || []).filter((a) => a.user_id === student.id)
    const completedChapters = progress.filter((p) => p.progress_percentage === 100).length
    const avgQuizScore = attempts.length > 0
      ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / attempts.length)
      : 0
    const quizzesTaken = attempts.length
    const totalChapters = chapters?.length || 0

    // Overall progress: average across all chapters (including 0% for not started)
    const totalProgressSum = progress.reduce((acc, p) => acc + p.progress_percentage, 0)
    const overallProgress = totalChapters > 0
      ? Math.round(totalProgressSum / totalChapters)
      : 0

    // Last studied: most recent last_studied_at across all progress rows
    const lastStudiedDates = progress
      .map((p) => p.last_studied_at)
      .filter((d): d is string => !!d)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
    const lastStudiedAt = lastStudiedDates[0] || null

    // ── Health Score Calculation ──
    // 40% Quiz Performance + 30% Chapter Completion + 20% Activity Level + 10% Consistency

    // Quiz Performance (40%): average quiz score, 0 if no quizzes
    const quizPerformance = avgQuizScore

    // Chapter Completion (30%): overall progress percentage
    const chapterCompletion = overallProgress

    // Activity Level (20%): based on days since last study
    const daysSinceActive = lastStudiedAt
      ? Math.floor((Date.now() - new Date(lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24))
      : null

    let activityScore = 0
    if (daysSinceActive === null) {
      activityScore = 0
    } else if (daysSinceActive === 0) {
      activityScore = 100
    } else if (daysSinceActive <= 7) {
      activityScore = 90
    } else if (daysSinceActive <= 14) {
      activityScore = 70
    } else if (daysSinceActive <= 30) {
      activityScore = 50
    } else {
      activityScore = 25
    }

    // Consistency (10%): based on quiz frequency and progress distribution
    // Simple model: more quizzes = more consistent, some progress = baseline
    let consistencyScore = 0
    if (quizzesTaken >= 10) {
      consistencyScore = 100
    } else if (quizzesTaken >= 5) {
      consistencyScore = 80
    } else if (quizzesTaken >= 2) {
      consistencyScore = 60
    } else if (quizzesTaken >= 1) {
      consistencyScore = 40
    } else if (completedChapters >= 1) {
      consistencyScore = 20
    } else {
      consistencyScore = 0
    }

    // Weighted Health Score
    const healthScore = Math.round(
      quizPerformance * 0.40 +
      chapterCompletion * 0.30 +
      activityScore * 0.20 +
      consistencyScore * 0.10
    )

    // Health Category
    let healthCategory: StudentStat['healthCategory']
    if (healthScore >= 90) healthCategory = 'excellent'
    else if (healthScore >= 75) healthCategory = 'healthy'
    else if (healthScore >= 60) healthCategory = 'watch'
    else if (healthScore >= 40) healthCategory = 'intervention'
    else healthCategory = 'critical'

    // Generate insight based on real data
    let insight: string | null = null
    if (daysSinceActive !== null && daysSinceActive > 14) {
      insight = `Inactive for ${daysSinceActive} days`
    } else if (avgQuizScore > 0 && avgQuizScore < 60 && quizzesTaken >= 3) {
      insight = 'Quiz scores declining'
    } else if (quizzesTaken === 0 && completedChapters >= 3) {
      insight = 'Progressing but no quiz attempts'
    } else if (overallProgress < 25 && quizzesTaken >= 5) {
      insight = 'Quizzing but low completion'
    }

    // Risk factors (legacy, kept for compatibility)
    const riskFactors: string[] = []
    if (overallProgress < RISK_LOW_PROGRESS) riskFactors.push('Low Progress')
    if (avgQuizScore < RISK_LOW_QUIZ_SCORE && quizzesTaken > 0) riskFactors.push('Low Quiz Scores')
    if (avgQuizScore < RISK_LOW_QUIZ_SCORE && quizzesTaken === 0) riskFactors.push('No Quizzes Taken')
    if (daysSinceActive !== null && daysSinceActive > RISK_INACTIVE_DAYS) riskFactors.push('Inactive')

    // Risk level
    let riskLevel: StudentStat['riskLevel'] = 'none'
    if (riskFactors.length >= 3 || (overallProgress < 25 && daysSinceActive !== null && daysSinceActive > RISK_INACTIVE_DAYS)) {
      riskLevel = 'high'
    } else if (riskFactors.length === 2 || overallProgress < RISK_LOW_PROGRESS) {
      riskLevel = 'medium'
    } else if (riskFactors.length === 1) {
      riskLevel = 'low'
    }

    return {
      ...student,
      completedChapters,
      avgQuizScore,
      quizzesTaken,
      totalChapters,
      overallProgress,
      lastStudiedAt,
      riskFactors,
      riskLevel,
      healthScore,
      healthCategory,
      activityScore,
      consistencyScore,
      daysSinceActive,
      insight,
    }
  })

  // ── Class Focus Areas (Per-Chapter Analysis) ──
  const chapterFocusAreas: ChapterFocusArea[] = (chapters || []).map((chapter) => {
    const chapterProgress = (allProgress || []).filter((p) => p.chapter_id === chapter.id)
    const chapterAttempts = (allAttempts || []).filter((a) => {
      // Match attempts to this chapter via quiz_id — we need to look up which quiz belongs to this chapter
      // Since quiz_attempts has quiz_id but not chapter_id directly, we'll use progress records for linking
      return true // We'll filter by user+chapter below
    })

    // Get all students who have progress records for this chapter
    const studentsWithProgress = new Set(chapterProgress.map((p) => p.user_id))

    // Calculate average quiz score for this chapter
    // We use best_quiz_score from student_progress as the authoritative per-chapter quiz score
    const quizScores = chapterProgress
      .map((p) => p.best_quiz_score)
      .filter((s): s is number => s !== null && s > 0)
    const avgQuizScore = quizScores.length > 0
      ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
      : 0

    // Calculate average completion for this chapter
    const completionValues = chapterProgress.map((p) => p.progress_percentage)
    const avgCompletion = completionValues.length > 0
      ? Math.round(completionValues.reduce((a, b) => a + b, 0) / completionValues.length)
      : 0

    // Count struggling students (below 70% on best quiz score)
    const strugglingCount = chapterProgress.filter(
      (p) => p.best_quiz_score !== null && p.best_quiz_score < STRUGGLING_THRESHOLD
    ).length

    // Count students who never attempted a quiz for this chapter
    const neverAttemptedCount = chapterProgress.filter(
      (p) => p.best_quiz_score === null || p.best_quiz_score === 0
    ).length

    const totalStudents = students?.length || 0
    const studentsWithAnyProgress = chapterProgress.length

    // Difficulty Score formula:
    // (100 - avgQuizScore) * 0.50 + (100 - avgCompletion) * 0.30 + (strugglingRate * 100) * 0.20
    const quizWeight = avgQuizScore > 0 ? (100 - avgQuizScore) * 0.50 : 50 // default 50 if no quiz data
    const completionWeight = (100 - avgCompletion) * 0.30
    const strugglingRate = studentsWithAnyProgress > 0
      ? strugglingCount / studentsWithAnyProgress
      : 0
    const strugglingWeight = strugglingRate * 100 * 0.20

    const difficultyScore = Math.round(quizWeight + completionWeight + strugglingWeight)

    // Status based on difficulty score
    let status: ChapterFocusArea['status'] = 'healthy'
    if (difficultyScore >= 50 || (avgQuizScore > 0 && avgQuizScore < 60) || strugglingCount >= 3) {
      status = 'critical'
    } else if (difficultyScore >= 35 || (avgQuizScore > 0 && avgQuizScore < 70) || strugglingCount >= 1) {
      status = 'attention'
    }

    return {
      chapterId: chapter.id,
      chapterNumber: chapter.chapter_number,
      chapterTitle: chapter.title,
      avgQuizScore,
      avgCompletion,
      strugglingCount,
      neverAttemptedCount,
      totalStudents,
      difficultyScore,
      status,
    }
  })

  // Sort by difficulty score (hardest first)
  const sortedFocusAreas = chapterFocusAreas.sort((a, b) => b.difficultyScore - a.difficultyScore)
  const topFocusAreas = sortedFocusAreas.slice(0, 5)

  // ── Class Health Aggregates ──
  const totalStudents = students?.length || 0

  const activeStudents = studentStats.filter((s) => {
    if (!s.lastStudiedAt) return false
    const days = Math.floor((Date.now() - new Date(s.lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24))
    return days <= ACTIVE_DAYS
  }).length

  const classAvgQuizScore = totalStudents > 0
    ? Math.round(studentStats.reduce((sum, s) => sum + s.avgQuizScore, 0) / totalStudents)
    : 0

  const classAvgCompletion = totalStudents > 0
    ? Math.round(studentStats.reduce((sum, s) => sum + s.overallProgress, 0) / totalStudents)
    : 0

  const atRiskCount = studentStats.filter((s) => s.riskLevel !== 'none').length

  // ── Health Score Summary ──
  const healthSummary = {
    excellent: studentStats.filter((s) => s.healthCategory === 'excellent').length,
    healthy: studentStats.filter((s) => s.healthCategory === 'healthy').length,
    watch: studentStats.filter((s) => s.healthCategory === 'watch').length,
    intervention: studentStats.filter((s) => s.healthCategory === 'intervention').length,
    critical: studentStats.filter((s) => s.healthCategory === 'critical').length,
  }

  // Sort all students by health score (lowest first)
  const studentsByHealth = [...studentStats].sort((a, b) => a.healthScore - b.healthScore)

  // ── At-Risk List (sorted by risk severity) ──
  const atRiskStudents = studentStats
    .filter((s) => s.riskLevel !== 'none')
    .sort((a, b) => {
      const levelOrder = { high: 3, medium: 2, low: 1, none: 0 }
      const diff = levelOrder[b.riskLevel] - levelOrder[a.riskLevel]
      if (diff !== 0) return diff
      return b.riskFactors.length - a.riskFactors.length
    })

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Instructor Dashboard</h1>
          <p className="text-gray-400">
            {schoolName} — Monitor your students&apos; progress
          </p>
        </div>

        {/* Class Health Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-[#D4AF37]">{totalStudents}</div>
            <div className="text-sm text-gray-400">Total Students</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className="text-3xl font-bold text-blue-400">{activeStudents}</div>
            <div className="text-sm text-gray-400">Active This Week</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className={`text-3xl font-bold ${
              classAvgQuizScore >= 75 ? 'text-green-400' :
              classAvgQuizScore >= 60 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {classAvgQuizScore}%
            </div>
            <div className="text-sm text-gray-400">Class Avg Quiz Score</div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <div className={`text-3xl font-bold ${
              classAvgCompletion >= 75 ? 'text-green-400' :
              classAvgCompletion >= 50 ? 'text-yellow-400' : 'text-red-400'
            }`}>
              {classAvgCompletion}%
            </div>
            <div className="text-sm text-gray-400">Avg Chapter Completion</div>
          </div>

          <div className="bg-gray-900 border border-red-900/40 rounded-xl p-6">
            <div className="text-3xl font-bold text-red-400">{atRiskCount}</div>
            <div className="text-sm text-red-300">At-Risk Students</div>
          </div>
        </div>

        {/* Student Health Overview */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Student Health Overview</h2>
            <p className="text-sm text-gray-400 mt-1">
              Sorted by health score — lowest first. Who needs help right now?
            </p>
          </div>

          {/* Health Summary Bar */}
          <div className="grid grid-cols-5 divide-x divide-gray-800 border-b border-gray-800">
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-green-400">{healthSummary.excellent}</div>
              <div className="text-xs text-gray-500 mt-1">Excellent</div>
              <div className="text-xs text-green-500">90–100</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-green-300">{healthSummary.healthy}</div>
              <div className="text-xs text-gray-500 mt-1">Healthy</div>
              <div className="text-xs text-green-400">75–89</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-yellow-400">{healthSummary.watch}</div>
              <div className="text-xs text-gray-500 mt-1">Watch List</div>
              <div className="text-xs text-yellow-500">60–74</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-orange-400">{healthSummary.intervention}</div>
              <div className="text-xs text-gray-500 mt-1">Intervention</div>
              <div className="text-xs text-orange-500">40–59</div>
            </div>
            <div className="p-4 text-center">
              <div className="text-xl font-bold text-red-400">{healthSummary.critical}</div>
              <div className="text-xs text-gray-500 mt-1">Critical</div>
              <div className="text-xs text-red-500">0–39</div>
            </div>
          </div>

          {studentsByHealth.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Student</th>
                    <th className="p-4">Health Score</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Completion</th>
                    <th className="p-4">Avg Quiz</th>
                    <th className="p-4">Last Active</th>
                    <th className="p-4">Insight</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {studentsByHealth.map((student) => {
                    const categoryConfig = {
                      excellent: { label: 'Excellent', color: 'bg-green-500/20 text-green-400 border-green-500/30' },
                      healthy: { label: 'Healthy', color: 'bg-green-400/20 text-green-300 border-green-400/30' },
                      watch: { label: 'Watch List', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                      intervention: { label: 'Intervention', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
                      critical: { label: 'Critical', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
                    }
                    const config = categoryConfig[student.healthCategory]
                    return (
                      <tr key={student.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                        <td className="p-4">
                          <div className="text-white font-medium">{student.full_name}</div>
                          <div className="text-gray-500 text-xs">{student.email}</div>
                        </td>
                        <td className="p-4">
                          <div className={`text-xl font-bold ${
                            student.healthScore >= 75 ? 'text-green-400' :
                            student.healthScore >= 60 ? 'text-yellow-400' :
                            student.healthScore >= 40 ? 'text-orange-400' : 'text-red-400'
                          }`}>
                            {student.healthScore}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase border ${config.color}`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-800 rounded-full h-2 w-20">
                              <div
                                className={`h-2 rounded-full ${
                                  student.overallProgress >= 75 ? 'bg-green-500' :
                                  student.overallProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${student.overallProgress}%` }}
                              />
                            </div>
                            <span className="text-gray-300 text-xs">{student.overallProgress}%</span>
                          </div>
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
                        <td className="p-4 text-gray-400">
                          {student.daysSinceActive !== null ? `${student.daysSinceActive}d ago` : 'Never'}
                        </td>
                        <td className="p-4">
                          {student.insight ? (
                            <span className="text-xs text-[#D4AF37]">{student.insight}</span>
                          ) : (
                            <span className="text-xs text-gray-600">—</span>
                          )}
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
              No students found.
            </div>
          )}
        </div>

        {/* At-Risk Students Panel */}
        {atRiskStudents.length > 0 && (
          <div className="bg-gray-900 border border-red-900/40 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-red-900/30 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <h2 className="text-xl font-semibold text-red-300">
                At-Risk Students ({atRiskStudents.length})
              </h2>
              <span className="text-sm text-red-400/70 ml-auto">
                Requires intervention
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Name</th>
                    <th className="p-4">Risk Level</th>
                    <th className="p-4">Risk Factors</th>
                    <th className="p-4">Completion</th>
                    <th className="p-4">Avg Quiz</th>
                    <th className="p-4">Last Active</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {atRiskStudents.map((student) => {
                    const daysSince = student.lastStudiedAt
                      ? Math.floor((Date.now() - new Date(student.lastStudiedAt).getTime()) / (1000 * 60 * 60 * 24))
                      : null
                    return (
                      <tr key={student.id} className="border-b border-gray-800/50 hover:bg-red-950/10 transition-colors">
                        <td className="p-4 text-white font-medium">{student.full_name}</td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                            student.riskLevel === 'high'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : student.riskLevel === 'medium'
                              ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                              : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                          }`}>
                            {student.riskLevel}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {student.riskFactors.map((factor) => (
                              <span key={factor} className="px-2 py-0.5 bg-gray-800 text-gray-300 rounded text-xs">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-gray-800 rounded-full h-2 w-24">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  student.overallProgress >= 75 ? 'bg-green-500' :
                                  student.overallProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${student.overallProgress}%` }}
                              />
                            </div>
                            <span className="text-gray-300 text-xs w-8">{student.overallProgress}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${
                            student.avgQuizScore >= 75 ? 'text-green-400' :
                            student.avgQuizScore >= 60 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {student.avgQuizScore}%
                          </span>
                        </td>
                        <td className="p-4 text-gray-400">
                          {daysSince !== null ? `${daysSince}d ago` : 'Never'}
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
          </div>
        )}

        {/* Students Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800">
            <h2 className="text-xl font-semibold text-white">Students</h2>
          </div>

          {studentStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-800">
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Chapters Done</th>
                    <th className="p-4">Avg Quiz</th>
                    <th className="p-4">Quizzes Taken</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {studentStats.map((student) => (
                    <tr key={student.id} className="border-b border-gray-800/50">
                      <td className="p-4 text-white font-medium">{student.full_name}</td>
                      <td className="p-4 text-gray-400">{student.email}</td>
                      <td className="p-4 text-gray-300">
                        {student.completedChapters} / {student.totalChapters}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            student.avgQuizScore >= 75
                              ? 'text-green-400'
                              : student.avgQuizScore >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {student.avgQuizScore}%
                        </span>
                      </td>
                      <td className="p-4 text-gray-300">{student.quizzesTaken}</td>
                      <td className="p-4 text-gray-400">
                        {new Date(student.created_at).toLocaleDateString()}
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
              No students found in your school yet.
              <p className="text-sm text-gray-500 mt-2">
                Students will appear here once they sign up and select &quot;{schoolName}&quot;.
              </p>
            </div>
          )}
        </div>

        {/* Class Focus Areas */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Class Focus Areas</h2>
              <p className="text-sm text-gray-400 mt-1">
                Chapters ranked by class difficulty — what to review next
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#D4AF37]">
                {topFocusAreas.filter((c) => c.status === 'critical').length}
              </div>
              <div className="text-xs text-red-400">Need Immediate Review</div>
            </div>
          </div>

          {topFocusAreas.length > 0 ? (
            <div className="divide-y divide-gray-800">
              {topFocusAreas.map((area) => (
                <div key={area.chapterId} className="p-5 hover:bg-gray-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-sm font-mono text-gray-500">
                          Ch.{area.chapterNumber}
                        </span>
                        <h3 className="text-white font-medium truncate">
                          {area.chapterTitle}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase shrink-0 ${
                          area.status === 'critical'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : area.status === 'attention'
                            ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 border border-green-500/30'
                        }`}>
                          {area.status === 'critical' ? 'Immediate Review' : area.status === 'attention' ? 'Needs Attention' : 'Healthy'}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Avg Quiz Score</div>
                          <div className={`text-lg font-bold ${
                            area.avgQuizScore >= 75 ? 'text-green-400' :
                            area.avgQuizScore >= 60 ? 'text-yellow-400' :
                            area.avgQuizScore > 0 ? 'text-red-400' : 'text-gray-500'
                          }`}>
                            {area.avgQuizScore > 0 ? `${area.avgQuizScore}%` : 'No data'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Avg Completion</div>
                          <div className={`text-lg font-bold ${
                            area.avgCompletion >= 75 ? 'text-green-400' :
                            area.avgCompletion >= 50 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {area.avgCompletion}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Struggling</div>
                          <div className={`text-lg font-bold ${
                            area.strugglingCount === 0 ? 'text-green-400' :
                            area.strugglingCount <= 2 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {area.strugglingCount}
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              / {area.totalStudents}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Never Attempted</div>
                          <div className={`text-lg font-bold ${
                            area.neverAttemptedCount === 0 ? 'text-green-400' :
                            area.neverAttemptedCount <= 2 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {area.neverAttemptedCount}
                            <span className="text-xs font-normal text-gray-500 ml-1">
                              / {area.totalStudents}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="hidden sm:flex flex-col items-center justify-center shrink-0">
                      <div className={`text-2xl font-bold ${
                        area.difficultyScore >= 50 ? 'text-red-400' :
                        area.difficultyScore >= 35 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {area.difficultyScore}
                      </div>
                      <div className="text-xs text-gray-500">Difficulty</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-400">
              No chapter data available yet.
              <p className="text-sm text-gray-500 mt-2">
                Students need to begin studying chapters for focus areas to appear.
              </p>
            </div>
          )}
        </div>

        {/* Recommended Review Topics */}
        {topFocusAreas.filter((a) => a.status !== 'healthy').length > 0 && (
          <div className="bg-gray-900/50 border border-[#D4AF37]/30 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-[#D4AF37] mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              Recommended Review Topics
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Based on class performance data, prioritize these chapters in your next review session:
            </p>
            <ol className="space-y-3">
              {topFocusAreas
                .filter((a) => a.status !== 'healthy')
                .slice(0, 3)
                .map((area, idx) => (
                  <li key={area.chapterId} className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-white font-medium">
                        Chapter {area.chapterNumber} — {area.chapterTitle}
                      </span>
                      <span className="text-gray-400 text-sm ml-2">
                        ({area.strugglingCount} struggling, {area.neverAttemptedCount} never attempted)
                      </span>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        )}

        {/* Quick Tips */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-2">Instructor Tips</h3>
          <ul className="text-gray-400 space-y-2 text-sm">
            <li>• Students must select your school name during signup to appear here.</li>
            <li>• Click &quot;View&quot; on any student to see detailed chapter-by-chapter progress.</li>
            <li>• Avg Quiz scores below 75% suggest a student needs additional review.</li>
            <li>• Focus Areas update automatically as students complete quizzes.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
