import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Profile, AttendanceRecord, HourLog, QuizAttempt, StudentProgress, Grade, GradeCategory, Assessment } from '@/types'
import {
  demoStudents,
  demoAttendanceRecords,
  demoHourLogs,
  demoQuizAttempts,
  demoStudentProgress,
  demoGrades,
  demoGradeCategories,
  demoAssessments,
} from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import { buildStudentCompliance, buildComplianceAlerts } from '@/lib/compliance'
import ComplianceScoreWidget from '@/components/compliance/ComplianceScoreWidget'
import BoardEligibilityWidget from '@/components/compliance/BoardEligibilityWidget'
import GraduationReadinessWidget from '@/components/compliance/GraduationReadinessWidget'
import ComplianceAlertsPanel from '@/components/compliance/ComplianceAlertsPanel'

export default async function StudentComplianceDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const useDemo = isDemoFallbackEnabled()
  const currentProfile: Profile | undefined = profile as Profile | undefined

  // If logged-in student exists, use them; otherwise fall back to first demo student.
  const student: Profile =
    currentProfile && (currentProfile.role === 'student' || currentProfile.role === 'apprentice')
      ? currentProfile
      : useDemo
      ? demoStudents[0]
      : ({} as Profile)

  if (!student?.id) {
    redirect('/dashboard')
  }

  const [attendanceRes, hoursRes, attemptsRes, progressRes, gradesRes, categoriesRes, assessmentsRes] =
    await Promise.all([
      supabase.from('attendance_records').select('*').eq('userId', student.id),
      supabase.from('hour_logs').select('*').eq('user_id', student.id),
      supabase.from('quiz_attempts').select('*').eq('user_id', student.id),
      supabase.from('student_progress').select('*').eq('user_id', student.id),
      supabase.from('grades').select('*').eq('studentId', student.id),
      supabase.from('grade_categories').select('*'),
      supabase.from('assessments').select('*').eq('studentId', student.id),
    ])

  const attendanceRecords: AttendanceRecord[] =
    (attendanceRes.data as AttendanceRecord[])?.length > 0
      ? (attendanceRes.data as AttendanceRecord[])
      : useDemo
      ? demoAttendanceRecords
      : []

  const hourLogs: HourLog[] =
    (hoursRes.data as HourLog[])?.length > 0 ? (hoursRes.data as HourLog[]) : useDemo ? demoHourLogs : []

  const quizAttempts: QuizAttempt[] =
    (attemptsRes.data as QuizAttempt[])?.length > 0
      ? (attemptsRes.data as QuizAttempt[])
      : useDemo
      ? demoQuizAttempts
      : []

  const progress: StudentProgress[] =
    (progressRes.data as StudentProgress[])?.length > 0
      ? (progressRes.data as StudentProgress[])
      : useDemo
      ? demoStudentProgress
      : []

  const grades: Grade[] =
    (gradesRes.data as unknown as Grade[])?.length > 0
      ? (gradesRes.data as unknown as Grade[])
      : useDemo
      ? demoGrades
      : []

  const gradeCategories: GradeCategory[] =
    (categoriesRes.data as unknown as GradeCategory[])?.length > 0
      ? (categoriesRes.data as unknown as GradeCategory[])
      : useDemo
      ? demoGradeCategories
      : []

  const assessments: Assessment[] =
    (assessmentsRes.data as unknown as Assessment[])?.length > 0
      ? (assessmentsRes.data as unknown as Assessment[])
      : useDemo
      ? demoAssessments
      : []

  const inputs = {
    student,
    attendanceRecords,
    hourLogs,
    quizAttempts,
    progress,
    grades,
    gradeCategories,
    assessments,
  }

  const compliance = buildStudentCompliance(inputs)
  const alerts = buildComplianceAlerts(inputs)

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">State Board Compliance</h1>
          <p className="text-gray-400">Track your licensing readiness and graduation requirements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ComplianceScoreWidget score={compliance.complianceScore} />
          <BoardEligibilityWidget eligibility={compliance.boardEligibility} />
          <GraduationReadinessWidget readiness={compliance.graduationReadiness} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ComplianceAlertsPanel alerts={alerts} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>
            <ul className="space-y-3">
              {compliance.graduationReadiness.remainingItems.length === 0 ? (
                <li className="text-sm text-green-400 flex items-start gap-2">
                  <span>✓</span> All requirements met. Schedule your board exam.
                </li>
              ) : (
                compliance.graduationReadiness.remainingItems.slice(0, 5).map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    {item}
                  </li>
                ))
              )}
              {compliance.attendanceSummary.isAtRisk && (
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  Improve attendance to avoid licensing delays.
                </li>
              )}
              {compliance.readiness.score < 70 && (
                <li className="text-sm text-gray-300 flex items-start gap-2">
                  <span className="text-[#D4AF37]">•</span>
                  Review missed questions and weak areas to boost readiness.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
