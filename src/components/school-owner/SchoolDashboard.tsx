import { createClient } from '@/lib/supabase-server'
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
import SchoolOverviewMetrics from './SchoolOverviewMetrics'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import SchoolHealthScore from './SchoolHealthScore'
import StudentPerformancePanel from './StudentPerformancePanel'
import InstructorPerformancePanel from './InstructorPerformancePanel'
import SchoolAnalyticsCharts from './SchoolAnalyticsCharts'
import AlertsCenter from './AlertsCenter'
import ReportingCenter from './ReportingCenter'
import { mapAttendanceRecordsFromDb, mapHourLogsFromDb, mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'

interface SchoolDashboardProps {
  schoolId: string
}

export default async function SchoolDashboard({ schoolId }: SchoolDashboardProps) {
  const supabase = await createClient()
  const queryErrors: string[] = []

  const { data: studentsData, error: studentsError } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])
  if (studentsError) queryErrors.push('Failed to load students')

  const { data: instructorsData, error: instructorsError } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .eq('role', 'instructor')
  if (instructorsError) queryErrors.push('Failed to load instructors')

  const studentIds = ((studentsData as Profile[]) || []).map((s) => s.id)
  const instructorIds = ((instructorsData as Profile[]) || []).map((i) => i.id)
  const schoolUserIds = studentIds.length > 0 || instructorIds.length > 0
    ? [...studentIds, ...instructorIds]
    : ['__none__']

  const { data: attendanceData, error: attendanceError } = await supabase
    .from('attendance_records')
    .select('*')
    .eq('school_id', schoolId)
    .in('user_id', schoolUserIds)
  if (attendanceError) queryErrors.push('Failed to load attendance records')

  const { data: hoursData, error: hoursError } = await supabase
    .from('hour_logs')
    .select('*')
    .eq('school_id', schoolId)
    .in('user_id', schoolUserIds)
  if (hoursError) queryErrors.push('Failed to load hour logs')

  const { data: attemptsData, error: attemptsError } = await supabase
    .from('quiz_attempts')
    .select('*')
    .in('user_id', schoolUserIds)
  if (attemptsError) queryErrors.push('Failed to load quiz attempts')

  const { data: progressData, error: progressError } = await supabase
    .from('student_progress')
    .select('*')
    .in('user_id', schoolUserIds)
  if (progressError) queryErrors.push('Failed to load student progress')

  const { data: gradesData, error: gradesError } = await supabase
    .from('grades')
    .select('*')
    .eq('school_id', schoolId)
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])
  if (gradesError) queryErrors.push('Failed to load grades')

  const { data: categoriesData, error: categoriesError } = await supabase
    .from('grade_categories')
    .select('*')
    .or(`school_id.eq.${schoolId},school_id.is.null`)
  if (categoriesError) queryErrors.push('Failed to load grade categories')

  const { data: assessmentsData, error: assessmentsError } = await supabase
    .from('assessments')
    .select('*')
    .eq('school_id', schoolId)
    .in('student_id', studentIds.length > 0 ? studentIds : ['__none__'])
  if (assessmentsError) queryErrors.push('Failed to load assessments')

  const { data: notificationsData, error: notificationsError } = await supabase
    .from('notifications')
    .select('*')
    .in('user_id', schoolUserIds)
  if (notificationsError) queryErrors.push('Failed to load notifications')

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
    mapAttendanceRecordsFromDb(attendanceData || [])?.length > 0
      ? mapAttendanceRecordsFromDb(attendanceData || [])
      : useDemo
      ? demoAttendanceRecords.filter((a) => scopedStudentIds.has(a.userId))
      : []

  const hourLogs: HourLog[] =
    mapHourLogsFromDb(hoursData || [])?.length > 0
      ? mapHourLogsFromDb(hoursData || [])
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
    mapGradesFromDb(gradesData || [])?.length > 0
      ? mapGradesFromDb(gradesData || [])
      : useDemo
      ? demoGrades.filter((g) => scopedStudentIds.has(g.studentId))
      : []

  const gradeCategories: GradeCategory[] =
    mapGradeCategoriesFromDb(categoriesData || [])?.length > 0
      ? mapGradeCategoriesFromDb(categoriesData || [])
      : useDemo
      ? demoGradeCategories.filter((c) => c.schoolId === schoolId || !c.schoolId)
      : []

  const assessments: Assessment[] =
    mapAssessmentsFromDb(assessmentsData || [])?.length > 0
      ? mapAssessmentsFromDb(assessmentsData || [])
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
    <div className="min-h-screen bg-black p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">School Dashboard</h1>
          <p className="text-silver">Overview of school performance, students, and instructors</p>
        </div>

        {queryErrors.length > 0 && (
          <div role="alert" aria-live="polite" className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 font-medium mb-1">Some data could not be loaded</p>
            <ul className="text-red-400/80 text-sm list-disc list-inside">
              {queryErrors.map((err) => (
                <li key={err}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        {students.length === 0 && instructors.length === 0 && queryErrors.length === 0 && (
          <div className="bg-charcoal border border-graphite rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-3">Welcome to your School Dashboard</h2>
            <p className="text-silver mb-4">Get started by setting up your school:</p>
            <ol className="text-silver text-sm space-y-2 text-left max-w-md mx-auto list-decimal list-inside">
              <li>Configure your school profile and programs in <span className="text-[var(--color-brand-gold)]">School Settings</span></li>
              <li>Invite instructors to join your school</li>
              <li>Invite or create student accounts</li>
              <li>Enroll students in programs</li>
            </ol>
            <p className="text-silver-gray text-xs mt-4">Once students and instructors are active, this dashboard will show performance metrics, compliance status, and analytics.</p>
          </div>
        )}

        <SchoolHealthScore health={health} />

        <SchoolOverviewMetrics metrics={metrics} />

        <div className="bg-charcoal border border-graphite rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">License Requirements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">School Compliance Rate</p>
              <p className="text-2xl font-bold text-white">{avgComplianceScore}%</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">Eligible Students</p>
              <p className="text-2xl font-bold text-gold">{eligibleStudents}</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">Near Eligibility</p>
              <p className="text-2xl font-bold text-warm-bronze">{nearEligibleStudents}</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">At-Risk Students</p>
              <p className="text-2xl font-bold text-silver">{complianceAtRisk}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-silver">{complianceReport.summary}</p>
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
