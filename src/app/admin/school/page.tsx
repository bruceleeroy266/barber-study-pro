import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { isAdmin } from '@/lib/auth-helpers'
import { Profile, AttendanceRecord, HourLog, QuizAttempt, StudentProgress, Grade, GradeCategory, Assessment, Notification } from '@/types'
import {
  demoStudents,
  demoInstructorProfile,
  demoAttendanceRecords,
  demoHourLogs,
  demoQuizAttempts,
  demoStudentProgress,
  demoGrades,
  demoGradeCategories,
  demoAssessments,
  demoNotifications,
} from '@/lib/demo-data'
import { isDemoFallbackEnabled } from '@/lib/demo-helpers'
import {
  buildSchoolOverviewMetrics,
  buildStudentPerformanceRows,
  buildInstructorPerformanceRows,
  buildSchoolHealthScore,
  buildSchoolAlerts,
  buildSchoolAnalyticsSnapshot,
  generateSchoolReport,
} from '@/lib/school-owner/school-analytics'
import { buildStudentCompliance, generateComplianceReport } from '@/lib/compliance'
import SchoolOverviewMetrics from '@/components/school-owner/SchoolOverviewMetrics'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import SchoolHealthScore from '@/components/school-owner/SchoolHealthScore'
import StudentPerformancePanel from '@/components/school-owner/StudentPerformancePanel'
import InstructorPerformancePanel from '@/components/school-owner/InstructorPerformancePanel'
import SchoolAnalyticsCharts from '@/components/school-owner/SchoolAnalyticsCharts'
import AlertsCenter from '@/components/school-owner/AlertsCenter'
import ReportingCenter from '@/components/school-owner/ReportingCenter'

export default async function SchoolOwnerDashboard() {
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

  if (!profile || !isAdmin(profile.role)) {
    redirect('/dashboard')
  }

  if (!profile.school_id) {
    redirect('/dashboard')
  }

  const schoolId = profile.school_id

  // Multi-school isolation: every query is scoped to the admin's assigned school.
  // Instructors without a school cannot view production data for any school.
  const { data: studentsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  const { data: instructorsData } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .eq('role', 'instructor')

  const studentIds = ((studentsData as Profile[]) || []).map((s) => s.id)
  const instructorIds = ((instructorsData as Profile[]) || []).map((i) => i.id)
  const schoolUserIds = studentIds.length > 0 || instructorIds.length > 0
    ? [...studentIds, ...instructorIds]
    : ['__none__']

  const { data: attendanceData } = await supabase
    .from('attendance_records')
    .select('*')
    .in('user_id', schoolUserIds)
  const { data: hoursData } = await supabase
    .from('hour_logs')
    .select('*')
    .in('user_id', schoolUserIds)
  const { data: attemptsData } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', schoolUserIds)
  const { data: progressData } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', schoolUserIds)
  const { data: gradesData } = await supabase
    .from('grades')
    .select('*')
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])
  const { data: categoriesData } = await supabase
    .from('grade_categories')
    .select('*')
    .eq('school_id', schoolId)
  const { data: assessmentsData } = await supabase
    .from('assessments')
    .select('*')
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])
  const { data: notificationsData } = await supabase
    .from('notifications')
    .select('*')
    .in('user_id', schoolUserIds)

  const useDemo = isDemoFallbackEnabled()

  const students: Profile[] =
    (studentsData as Profile[])?.length > 0
      ? (studentsData as Profile[])
      : useDemo
      ? demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
      : []

  const instructors: Profile[] =
    (instructorsData as Profile[])?.length > 0
      ? (instructorsData as Profile[])
      : useDemo
      ? [demoInstructorProfile].filter((i) => i.school_id === schoolId || !schoolId)
      : []

  const scopedStudentIds = new Set(students.map((s) => s.id))

  const attendanceRecords: AttendanceRecord[] =
    (attendanceData as AttendanceRecord[])?.length > 0
      ? (attendanceData as AttendanceRecord[])
      : useDemo
      ? demoAttendanceRecords.filter((a) => scopedStudentIds.has(a.userId))
      : []

  const hourLogs: HourLog[] =
    (hoursData as HourLog[])?.length > 0
      ? (hoursData as HourLog[])
      : useDemo
      ? demoHourLogs.filter((h) => scopedStudentIds.has(h.user_id))
      : []

  const quizAttempts: QuizAttempt[] =
    (attemptsData as QuizAttempt[])?.length > 0
      ? (attemptsData as QuizAttempt[])
      : useDemo
      ? demoQuizAttempts.filter((a) => scopedStudentIds.has(a.user_id))
      : []

  const progress: StudentProgress[] =
    (progressData as StudentProgress[])?.length > 0
      ? (progressData as StudentProgress[])
      : useDemo
      ? demoStudentProgress.filter((p) => scopedStudentIds.has(p.user_id))
      : []

  const grades: Grade[] =
    (gradesData as unknown as Grade[])?.length > 0
      ? (gradesData as unknown as Grade[])
      : useDemo
      ? demoGrades.filter((g) => scopedStudentIds.has(g.studentId))
      : []

  const gradeCategories: GradeCategory[] =
    (categoriesData as unknown as GradeCategory[])?.length > 0
      ? (categoriesData as unknown as GradeCategory[])
      : useDemo
      ? demoGradeCategories.filter((c) => c.schoolId === schoolId || !c.schoolId)
      : []

  const assessments: Assessment[] =
    (assessmentsData as unknown as Assessment[])?.length > 0
      ? (assessmentsData as unknown as Assessment[])
      : useDemo
      ? demoAssessments.filter((a) => scopedStudentIds.has(a.studentId))
      : []

  const notifications: Notification[] =
    (notificationsData as Notification[])?.length > 0
      ? (notificationsData as Notification[])
      : useDemo
      ? demoNotifications.filter((n) => scopedStudentIds.has(n.userId))
      : []

  const inputs = {
    students,
    instructors,
    attendanceRecords,
    hourLogs,
    quizAttempts,
    progress,
    grades,
    gradeCategories,
    assessments,
    notifications,
  }

  const metrics = buildSchoolOverviewMetrics(inputs)
  const health = buildSchoolHealthScore(inputs)
  const studentRows = buildStudentPerformanceRows(inputs)
  const instructorRows = buildInstructorPerformanceRows(inputs)
  const alerts = buildSchoolAlerts(inputs)
  const snapshot = buildSchoolAnalyticsSnapshot(inputs)

  const reports = {
    attendance: generateSchoolReport('attendance', inputs),
    readiness: generateSchoolReport('readiness', inputs),
    grade: generateSchoolReport('grade', inputs),
    hours: generateSchoolReport('hours', inputs),
    assessment: generateSchoolReport('assessment', inputs),
    school_summary: generateSchoolReport('school_summary', inputs),
  }

  // Phase 11 — State Board Compliance integration
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

  const complianceReport = generateComplianceReport('school_compliance', {
    students,
    attendanceRecords,
    hourLogs,
    quizAttempts,
    progress,
    grades,
    gradeCategories,
    assessments,
  })

  const avgComplianceScore =
    studentCompliances.length > 0
      ? Math.round(studentCompliances.reduce((sum, c) => sum + c.complianceScore.score, 0) / studentCompliances.length)
      : 0
  const eligibleStudents = studentCompliances.filter((c) => c.boardEligibility.status === 'eligible').length
  const nearEligibleStudents = studentCompliances.filter((c) => c.boardEligibility.status === 'near_eligible').length
  const complianceAtRisk = studentCompliances.filter((c) => c.complianceScore.score < 70).length

  const complianceReports = {
    student_compliance: generateComplianceReport('student_compliance', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }),
    graduation_readiness: generateComplianceReport('graduation_readiness', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }),
    board_eligibility: generateComplianceReport('board_eligibility', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }),
    instructor_compliance: generateComplianceReport('instructor_compliance', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }),
    school_compliance: generateComplianceReport('school_compliance', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }),
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">School Owner Dashboard</h1>
          <p className="text-gray-400">Executive visibility into school performance, students, and instructors</p>
        </div>

        <SchoolHealthScore health={health} />

        <SchoolOverviewMetrics metrics={metrics} />

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">State Board Compliance</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">School Compliance Rate</p>
              <p className="text-2xl font-bold text-white">{avgComplianceScore}%</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Eligible Students</p>
              <p className="text-2xl font-bold text-green-400">{eligibleStudents}</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">Near Eligibility</p>
              <p className="text-2xl font-bold text-yellow-400">{nearEligibleStudents}</p>
            </div>
            <div className="bg-gray-950 border border-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-400">At-Risk Students</p>
              <p className="text-2xl font-bold text-red-400">{complianceAtRisk}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-400">{complianceReport.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <StudentPerformancePanel rows={studentRows} />
          </div>
          <div>
            <AlertsCenter alerts={alerts} />
          </div>
        </div>

        <InstructorPerformancePanel rows={instructorRows} />

        <SchoolAnalyticsCharts snapshot={snapshot} />

        <ComplianceReportingCenter reports={complianceReports} />

        <ReportingCenter reports={reports} />
      </div>
    </div>
  )
}
