import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile, StudentProgress, QuizAttempt } from '@/types'
import { localChapters } from '@/lib/local-data'
import { isInstructorOrAdmin } from '@/lib/auth-helpers'
import { demoStudents, demoStudentProgress, demoStudentQuizAttempts } from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { calculateBoardReadiness, getReadinessColorClass } from '@/lib/readiness'
import { analyzePerformance } from '@/lib/analytics'
import { allQuizQuestions } from '@/lib/quiz-data'
import StudentIdentity from '@/components/StudentIdentity'

interface RosterStudent extends Profile {
  overallProgress: number
  lastStudiedAt: string | null
  avgQuizScore: number
  quizzesTaken: number
  completedChapters: number
  daysSinceActive: number | null
  readinessScore: number
  readinessLevel: string
  weakestCategory: string | null
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

function readinessBadgeClasses(level: string): string {
  switch (level) {
    case 'Ready':
      return 'bg-gold/20 text-gold border-gold/30'
    case 'Nearly Ready':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'Needs Review':
      return 'bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30'
    case 'At Risk':
      return 'bg-silver/20 text-silver border-silver/30'
    default:
      return 'bg-[var(--color-border-secondary)] text-[var(--color-text-secondary)] border-silver-gray'
  }
}

export default async function InstructorStudentsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id, full_name, schools(*)')
    .eq('id', user.id)
    .single()

  if (!profile || !isInstructorOrAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
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

  // Demo fallback
  if (rosterStudents.length === 0 && isDemoFallbackEnabled()) {
    rosterStudents = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = rosterStudents.map((s) => s.id)

  // Fetch progress and attempts
  const { data: allProgress } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  const { data: allAttempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', studentIds.length > 0 ? studentIds : ['__none__'])

  const chapters = localChapters
  const questions = Object.values(allQuizQuestions).flat()

  let progressRecords: StudentProgress[] = (allProgress as StudentProgress[]) || []
  let attemptRecords: QuizAttempt[] = (allAttempts as QuizAttempt[]) || []
  
  if (rosterStudents.length > 0 && progressRecords.length === 0 && attemptRecords.length === 0 && isDemoFallbackEnabled()) {
    progressRecords = demoStudentProgress.filter((p) => studentIds.includes(p.user_id))
    attemptRecords = demoStudentQuizAttempts.filter((a) => studentIds.includes(a.user_id))
  }

  const studentStats = computeStudentStats(rosterStudents, progressRecords, attemptRecords, chapters, questions)

  // Sort by name
  studentStats.sort((a, b) => a.full_name.localeCompare(b.full_name))

  const totalStudents = studentStats.length
  const activeStudents = studentStats.filter((s) => s.daysSinceActive !== null && s.daysSinceActive <= 7).length
  const atRiskStudents = studentStats.filter((s) => {
    const lowReadiness = s.readinessScore > 0 && s.readinessScore < 70
    const lowProgress = s.overallProgress < 50
    const lowQuiz = s.avgQuizScore > 0 && s.avgQuizScore < 70
    const inactive = s.daysSinceActive !== null && s.daysSinceActive > 14
    return lowReadiness || lowProgress || lowQuiz || inactive
  })

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Students</h1>
          <p className="text-[var(--color-text-muted)]">
            {schoolName} — Manage and monitor your student roster
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-5">
            <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{totalStudents}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Total Students</div>
          </div>
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-5">
            <div className="text-2xl font-bold text-silver">{activeStudents}</div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Active This Week</div>
          </div>
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-5">
            <div className={`text-2xl font-bold ${atRiskStudents.length > 0 ? 'text-silver' : 'text-gold'}`}>
              {atRiskStudents.length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">At-Risk Students</div>
          </div>
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-5">
            <div className="text-2xl font-bold text-gold">
              {studentStats.filter((s) => s.readinessLevel === 'Ready').length}
            </div>
            <div className="text-xs text-[var(--color-text-muted)] mt-1">Board Ready</div>
          </div>
        </div>

        {/* At-Risk Students Alert */}
        {atRiskStudents.length > 0 && (
          <div className="bg-silver/10 border border-silver/30 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-silver mb-4 flex items-center gap-2">
              <span>⚠️</span> Students Needing Attention ({atRiskStudents.length})
            </h2>
            <div className="space-y-3">
              {atRiskStudents.slice(0, 5).map((student) => {
                const factors: string[] = []
                if (student.readinessScore > 0 && student.readinessScore < 70) factors.push('Low readiness')
                if (student.overallProgress < 50) factors.push('Low progress')
                if (student.avgQuizScore > 0 && student.avgQuizScore < 70) factors.push('Low quiz avg')
                if (student.daysSinceActive !== null && student.daysSinceActive > 14) factors.push('Inactive')
                
                return (
                  <div key={student.id} className="flex items-center justify-between bg-[var(--color-background-primary)]/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <StudentIdentity student={student} />
                      <div className="flex flex-wrap gap-1">
                        {factors.map((factor) => (
                          <span key={factor} className="px-2 py-0.5 bg-silver/20 text-silver rounded text-xs">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Link
                      href={`/instructor/student/${student.id}`}
                      className="px-4 py-2 bg-[var(--color-brand-gold)] hover:bg-[var(--color-brand-gold-light)] text-black font-semibold rounded-lg transition-colors text-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                )
              })}
            </div>
            {atRiskStudents.length > 5 && (
              <p className="text-sm text-[var(--color-text-muted)] mt-4">
                +{atRiskStudents.length - 5} more at-risk students
              </p>
            )}
          </div>
        )}

        {/* Student Roster */}
        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden">
          <div className="p-6 border-b border-[var(--color-border-primary)]">
            <h2 className="text-xl font-semibold text-white">Student Roster</h2>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {totalStudents} student{totalStudents === 1 ? '' : 's'} in your school
            </p>
          </div>

          {studentStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-[var(--color-text-muted)] border-b border-[var(--color-border-primary)]">
                    <th className="p-4">Student</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Overall Progress</th>
                    <th className="p-4">Readiness</th>
                    <th className="p-4">Quiz Average</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {studentStats.map((student) => (
                    <tr key={student.id} className="border-b border-[var(--color-border-primary)]/50 hover:bg-[var(--color-background-secondary)]/30 transition-colors">
                      <td className="p-4">
                        <StudentIdentity student={student} />
                      </td>
                      <td className="p-4">
                        <span className="capitalize text-[var(--color-text-secondary)]">{student.role}</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 bg-[var(--color-background-secondary)] rounded-full h-2 w-24">
                            <div
                              className={`h-2 rounded-full ${
                                student.overallProgress >= 80 ? 'bg-gold' :
                                student.overallProgress >= 50 ? 'bg-warm-bronze' : 'bg-silver'
                              }`}
                              style={{ width: `${student.overallProgress}%` }}
                            />
                          </div>
                          <span className="text-[var(--color-text-secondary)] text-xs w-10 text-right">{student.overallProgress}%</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className={`text-lg font-bold ${getReadinessColorClass(student.readinessScore)}`}>
                            {student.readinessScore > 0 ? student.readinessScore : '—'}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold border ${readinessBadgeClasses(student.readinessLevel)}`}>
                            {student.readinessLevel}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`font-semibold ${
                          student.avgQuizScore >= 80 ? 'text-gold' :
                          student.avgQuizScore >= 60 ? 'text-warm-bronze' :
                          student.avgQuizScore > 0 ? 'text-silver' : 'text-[var(--color-text-muted)]'
                        }`}>
                          {student.avgQuizScore > 0 ? `${student.avgQuizScore}%` : '—'}
                        </span>
                      </td>
                      <td className="p-4 text-[var(--color-text-muted)]">
                        {student.daysSinceActive !== null ? `${student.daysSinceActive}d ago` : 'Never'}
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/instructor/student/${student.id}`}
                          className="text-[var(--color-brand-gold)] hover:text-[var(--color-brand-gold-light)] font-medium"
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
            <div className="p-8 text-center text-[var(--color-text-muted)]">
              No students found in your school yet.
              <p className="text-sm text-[var(--color-text-muted)] mt-2">
                Students will appear here once they sign up and select &quot;{schoolName}&quot;.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
