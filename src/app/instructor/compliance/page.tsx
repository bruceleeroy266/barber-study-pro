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
import { buildStudentCompliance, buildComplianceAlerts, generateComplianceReport } from '@/lib/compliance'
import ComplianceAlertsPanel from '@/components/compliance/ComplianceAlertsPanel'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import { CheckCircle, AlertTriangle, Clock, Wrench, ClipboardCheck, Target } from 'lucide-react'
import { mapAttendanceRecordsFromDb, mapHourLogsFromDb, mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'

export default async function InstructorComplianceDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, school_id')
    .eq('id', user.id)
    .single()
  if (!profile || (profile.role !== 'instructor' && profile.role !== 'admin')) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/dashboard')
  }

  const useDemo = isDemoFallbackEnabled()
  const schoolId = profile.school_id

  // Scope all student-facing data to the instructor's assigned school.
  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  let students: Profile[] = (studentsData as Profile[]) || []
  if (students.length === 0 && useDemo) {
    students = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = students.map((s) => s.id)
  const studentIdFilter = studentIds.length > 0 ? studentIds : ['__none__']

  const [attendanceRes, hoursRes, attemptsRes, progressRes, gradesRes, categoriesRes, assessmentsRes] =
    await Promise.all([
      supabase.from('attendance_records').select('*').eq('school_id', schoolId).in('user_id', studentIdFilter),
      supabase.from('hour_logs').select('*').eq('school_id', schoolId).in('user_id', studentIdFilter),
      supabase.from('quiz_attempts').select('*').in('user_id', studentIdFilter),
      supabase.from('student_progress').select('*').in('user_id', studentIdFilter),
      supabase.from('grades').select('*').eq('school_id', schoolId).in('student_id', studentIdFilter),
      supabase.from('grade_categories').select('*').or(`school_id.eq.${schoolId},school_id.is.null`),
      supabase.from('assessments').select('*').eq('school_id', schoolId).in('student_id', studentIdFilter),
    ])

  const attendanceRecords: AttendanceRecord[] =
    mapAttendanceRecordsFromDb(attendanceRes.data || [])?.length > 0
      ? mapAttendanceRecordsFromDb(attendanceRes.data || [])
      : useDemo
      ? demoAttendanceRecords.filter((a) => studentIds.includes(a.userId))
      : []

  const hourLogs: HourLog[] =
    mapHourLogsFromDb(hoursRes.data || [])?.length > 0 ? mapHourLogsFromDb(hoursRes.data || []) : useDemo ? demoHourLogs.filter((h) => studentIds.includes(h.user_id)) : []

  const quizAttempts: QuizAttempt[] =
    (attemptsRes.data as QuizAttempt[])?.length > 0
      ? (attemptsRes.data as QuizAttempt[])
      : useDemo
      ? demoQuizAttempts.filter((a) => studentIds.includes(a.user_id))
      : []

  const progress: StudentProgress[] =
    (progressRes.data as StudentProgress[])?.length > 0
      ? (progressRes.data as StudentProgress[])
      : useDemo
      ? demoStudentProgress.filter((p) => studentIds.includes(p.user_id))
      : []

  const grades: Grade[] =
    mapGradesFromDb(gradesRes.data || [])?.length > 0
      ? mapGradesFromDb(gradesRes.data || [])
      : useDemo
      ? demoGrades.filter((g) => studentIds.includes(g.studentId))
      : []

  const gradeCategories: GradeCategory[] =
    mapGradeCategoriesFromDb(categoriesRes.data || [])?.length > 0
      ? mapGradeCategoriesFromDb(categoriesRes.data || [])
      : useDemo
      ? demoGradeCategories.filter((c) => c.schoolId === schoolId || !c.schoolId)
      : []

  const assessments: Assessment[] =
    mapAssessmentsFromDb(assessmentsRes.data || [])?.length > 0
      ? mapAssessmentsFromDb(assessmentsRes.data || [])
      : useDemo
      ? demoAssessments.filter((a) => studentIds.includes(a.studentId))
      : []

  const studentCompliances = students.map((student) =>
    buildStudentCompliance({
      student,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    })
  )

  const allAlerts = students.flatMap((student) =>
    buildComplianceAlerts({
      student,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    })
  )

  const reportInputs = {
    students,
    attendanceRecords,
    hourLogs,
    quizAttempts,
    progress,
    grades,
    gradeCategories,
    assessments,
  }

  const complianceReports = {
    student_compliance: generateComplianceReport('student_compliance', reportInputs),
    graduation_readiness: generateComplianceReport('graduation_readiness', reportInputs),
    board_eligibility: generateComplianceReport('board_eligibility', reportInputs),
    instructor_compliance: generateComplianceReport('instructor_compliance', reportInputs),
    school_compliance: generateComplianceReport('school_compliance', reportInputs),
  }

  const atRiskStudents = studentCompliances.filter((c) => c.complianceScore.score < 70)
  const missingHours = studentCompliances.filter((c) => c.completedHours < 1500 * 0.5)
  const missingPracticals = studentCompliances.filter((c) => c.practicalPassRate < 80)
  const missingAssessments = studentCompliances.filter((c) => c.assessmentPassRate < 80)
  const lowReadiness = studentCompliances.filter((c) => c.readiness.score < 70)
  const eligibilityCandidates = studentCompliances.filter((c) => c.boardEligibility.status === 'eligible')

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Instructor Compliance</h1>
          <p className="text-gray-400">Monitor student compliance, graduation risk, and board eligibility</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Students At Risk" value={atRiskStudents.length} icon={AlertTriangle} color="text-red-400" />
          <StatCard label="Missing Hours" value={missingHours.length} icon={Clock} color="text-blue-400" />
          <StatCard label="Missing Practicals" value={missingPracticals.length} icon={Wrench} color="text-orange-400" />
          <StatCard label="Missing Assessments" value={missingAssessments.length} icon={ClipboardCheck} color="text-red-400" />
          <StatCard label="Low Readiness" value={lowReadiness.length} icon={Target} color="text-purple-400" />
          <StatCard label="Eligibility Candidates" value={eligibilityCandidates.length} icon={CheckCircle} color="text-green-400" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ComplianceAlertsPanel alerts={allAlerts} />
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Eligibility Candidates</h2>
            {eligibilityCandidates.length === 0 ? (
              <p className="text-sm text-gray-500">No students are currently board eligible.</p>
            ) : (
              <ul className="space-y-2">
                {eligibilityCandidates.map((c) => (
                  <li key={c.studentId} className="flex items-center justify-between p-3 bg-gray-950 border border-gray-800 rounded-lg">
                    <span className="text-white font-medium">{c.fullName}</span>
                    <span className="text-xs text-green-400 border border-green-500/20 bg-green-500/10 px-2 py-1 rounded">Eligible</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white">Student Compliance Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-950 text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Student</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Compliance</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Attendance</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Hours</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Assessments</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Practicals</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Readiness</th>
                  <th className="px-4 py-3 text-xs font-medium text-gray-400">Board Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {studentCompliances.map((c) => (
                  <tr key={c.studentId} className="hover:bg-gray-800/30">
                    <td className="px-4 py-3 text-white font-medium">{c.fullName}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${c.complianceScore.colorClass}`}>{c.complianceScore.score}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-300">{c.attendanceSummary.attendancePercentage}%</td>
                    <td className="px-4 py-3 text-gray-300">{Math.round(c.completedHours)}/1500</td>
                    <td className="px-4 py-3 text-gray-300">{c.assessmentPassRate}%</td>
                    <td className="px-4 py-3 text-gray-300">{c.practicalPassRate}%</td>
                    <td className="px-4 py-3 text-gray-300">{c.readiness.score}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${c.boardEligibility.colorClass}`}>
                        {c.boardEligibility.label}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ComplianceReportingCenter reports={complianceReports} />
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
