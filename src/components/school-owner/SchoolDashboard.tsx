import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
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
import { buildStudentCompliance, generateComplianceReport, thresholdsWithRequiredHours, ComplianceRuleThresholds } from '@/lib/compliance'
import { resolveProgramRequirementsForStudents } from '@/lib/programs/requirements'
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

  // Resolve required training hours independently for every student. This keeps
  // mixed-program schools accurate and prevents a class-wide hours requirement.
  const programRequirementsByStudent = await resolveProgramRequirementsForStudents(
    supabase,
    schoolId,
    students.map((student) => student.id),
  )
  const requiredHoursByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      programRequirementsByStudent.get(student.id)?.requiredHours ?? 1500,
    ]),
  )
  const thresholdsByStudentId = new Map<string, ComplianceRuleThresholds>(
    students.map((student) => [
      student.id,
      thresholdsWithRequiredHours(requiredHoursByStudentId[student.id]),
    ]),
  )

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
    requiredHoursByStudentId,
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
      thresholds: thresholdsByStudentId.get(student.id),
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
  }, thresholdsByStudentId)

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
    }, thresholdsByStudentId),
    graduation_readiness: generateComplianceReport('graduation_readiness', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }, thresholdsByStudentId),
    board_eligibility: generateComplianceReport('board_eligibility', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }, thresholdsByStudentId),
    instructor_compliance: generateComplianceReport('instructor_compliance', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }, thresholdsByStudentId),
    school_compliance: generateComplianceReport('school_compliance', {
      students,
      attendanceRecords,
      hourLogs,
      quizAttempts,
      progress,
      grades,
      gradeCategories,
      assessments,
    }, thresholdsByStudentId),
  }

  return (
    <div className="min-h-screen min-w-0 bg-black p-0 sm:p-2 lg:p-4">
      <div className="mx-auto min-w-0 max-w-7xl space-y-6 sm:space-y-8">
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
          <div className="bg-charcoal border border-[var(--color-brand-gold)]/30 rounded-xl p-6 lg:p-8">
            <div className="mb-6">
              <p className="text-[var(--color-brand-gold)] text-sm font-semibold uppercase tracking-wide mb-2">Pilot Launch</p>
              <h2 className="text-2xl font-semibold text-white mb-2">Welcome to ASCYN PRO</h2>
              <p className="text-silver max-w-2xl">
                Your school is ready. Complete these four steps in order so your instructors and students know exactly what to do next.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Invite instructor', body: 'Send your instructor an ASCYN PRO setup invitation.', href: '/admin/users', cta: 'Invite instructor' },
                { step: '2', title: 'Invite students', body: 'Add the students participating in your pilot.', href: '/admin/users', cta: 'Invite students' },
                { step: '3', title: 'Enroll students', body: 'Place each student into the Barbering program.', href: '/admin/users', cta: 'Manage enrollment' },
                { step: '4', title: 'Begin pilot', body: 'Confirm everyone can sign in, then start using ASCYN PRO with your class.', href: '/school', cta: 'Return to dashboard' },
              ].map((item) => (
                <div key={item.step} className="rounded-xl border border-graphite bg-black p-5">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-brand-gold)] text-black font-bold flex items-center justify-center mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-silver text-sm mb-4">{item.body}</p>
                  <Link href={item.href} className="text-[var(--color-brand-gold)] text-sm font-semibold hover:underline">
                    {item.cta} →
                  </Link>
                </div>
              ))}
            </div>

            <p className="text-silver-gray text-xs mt-5">
              This launch guide is shown while your school has no active instructors or students. Your analytics will populate automatically as the pilot begins.
            </p>
          </div>
        )}

        <SchoolHealthScore health={health} />

        <SchoolOverviewMetrics metrics={metrics} />

        <Link
          href="/school/hours"
          className="block rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-5 transition-colors hover:bg-[var(--color-brand-gold)]/15"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Individual Student Hours</h2>
              <p className="text-sm text-silver">
                Enter daily school hours and track accumulated and remaining hours for each student separately.
              </p>
            </div>
            <span className="font-semibold text-[var(--color-brand-gold)]">Manage Hours →</span>
          </div>
        </Link>

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

        <div id="performance" className="grid grid-cols-1 xl:grid-cols-3 gap-6 scroll-mt-24">
          <div className="xl:col-span-2">
            <StudentPerformancePanel rows={studentRows} />
          </div>
          <div>
            <AlertsCenter alerts={alerts} />
          </div>
        </div>

        <InstructorPerformancePanel rows={instructorRows} />

        <SchoolAnalyticsCharts snapshot={snapshot} />

        <div id="reports-compliance" className="scroll-mt-24 space-y-8">
          <ComplianceReportingCenter reports={complianceReports} />
          <ReportingCenter reports={reports} />
        </div>
      </div>
    </div>
  )
}
