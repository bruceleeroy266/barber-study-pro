import { createClient } from '@/lib/supabase-server'
import { createServiceRoleClient } from '@/lib/supabase-service-role'
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
import { buildStudentCompliance, generateComplianceReport, thresholdsWithRequiredHours, ComplianceRuleThresholds, DEFAULT_COMPLIANCE_THRESHOLDS } from '@/lib/compliance'
import { resolveProgramRequirementsForStudents } from '@/lib/programs/requirements'
import { loadEnrollmentHourContractsForStudents } from '@/lib/hours/adaptive-student-hours-data'
import SchoolOverviewMetrics from './SchoolOverviewMetrics'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import SchoolHealthScore from './SchoolHealthScore'
import StudentPerformancePanel from './StudentPerformancePanel'
import InstructorPerformancePanel from './InstructorPerformancePanel'
import SchoolAnalyticsCharts from './SchoolAnalyticsCharts'
import AlertsCenter from './AlertsCenter'
import ReportingCenter from './ReportingCenter'
import { mapAttendanceRecordsFromDb, mapHourLogsFromDb, mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'
import { loadActiveStudentInstructorAssignments } from '@/lib/instructor/assignments'
import { loadSchoolOnboardingStatus } from '@/lib/onboarding'
import SchoolSetupCenter from './SchoolSetupCenter'

interface SchoolDashboardProps {
  schoolId: string
  privilegedRead?: boolean
}

export default async function SchoolDashboard({ schoolId, privilegedRead = false }: SchoolDashboardProps) {
  // Platform-admin support access is validated by the parent route before this
  // privileged read mode is enabled. Ordinary school-admin views remain bound
  // to the caller's RLS-scoped Supabase client.
  const supabase = privilegedRead ? createServiceRoleClient() : await createClient()
  const queryErrors: string[] = []
  const onboardingStatus = await loadSchoolOnboardingStatus(supabase, schoolId)

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
    .from('effective_hour_logs')
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

  const instructorAssignments = await loadActiveStudentInstructorAssignments(supabase, schoolId)

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
  const [programRequirementsByStudent, hourContractsByStudent] = await Promise.all([
    resolveProgramRequirementsForStudents(
      supabase,
      schoolId,
      students.map((student) => student.id),
    ),
    loadEnrollmentHourContractsForStudents(
      supabase,
      schoolId,
      students.map((student) => student.id),
    ),
  ])
  const requiredHoursByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      programRequirementsByStudent.get(student.id)?.requiredHours ?? DEFAULT_COMPLIANCE_THRESHOLDS.requiredHours,
    ]),
  )
  const priorCreditMinutesByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      hourContractsByStudent.get(student.id)?.priorCreditMinutes ?? 0,
    ]),
  )
  const requirementOverrideMinutesByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      hourContractsByStudent.get(student.id)?.requirementOverrideMinutes ?? null,
    ]),
  )
  const requiredAssessmentsByStudentId = Object.fromEntries(
    students.map((student) => [
      student.id,
      programRequirementsByStudent.get(student.id)?.requiredAssessments ?? DEFAULT_COMPLIANCE_THRESHOLDS.requiredAssessments,
    ]),
  )
  const thresholdsByStudentId = new Map<string, ComplianceRuleThresholds>(
    students.map((student) => [
      student.id,
      {
        ...thresholdsWithRequiredHours(requiredHoursByStudentId[student.id]),
        requiredAssessments: requiredAssessmentsByStudentId[student.id],
        requiredPracticals:
          programRequirementsByStudent.get(student.id)?.requiredPracticals ??
          DEFAULT_COMPLIANCE_THRESHOLDS.requiredPracticals,
      },
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
    priorCreditMinutesByStudentId,
    requirementOverrideMinutesByStudentId,
    requiredAssessmentsByStudentId,
    instructorAssignments,
  }

  const metricStudents = students.filter((student) => student.include_in_school_metrics !== false)
  const metricStudentIds = new Set(metricStudents.map((student) => student.id))
  const metricComplianceInputs = {
    students: metricStudents,
    attendanceRecords: attendanceRecords.filter((record) => metricStudentIds.has(record.userId)),
    hourLogs: hourLogs.filter((record) => metricStudentIds.has(record.user_id)),
    quizAttempts: quizAttempts.filter((record) => metricStudentIds.has(record.user_id)),
    progress: progress.filter((record) => metricStudentIds.has(record.user_id)),
    grades: grades.filter((record) => metricStudentIds.has(record.studentId)),
    gradeCategories,
    assessments: assessments.filter((record) => metricStudentIds.has(record.studentId)),
    priorCreditMinutesByStudentId,
    requirementOverrideMinutesByStudentId,
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
      priorCreditMinutes: priorCreditMinutesByStudentId[student.id] ?? 0,
      requirementOverrideMinutes: requirementOverrideMinutesByStudentId[student.id] ?? null,
    })
  )

  const metricStudentCompliances = studentCompliances.filter((compliance) =>
    metricStudentIds.has(compliance.studentId)
  )
  const complianceReport = generateComplianceReport(
    'school_compliance',
    metricComplianceInputs,
    thresholdsByStudentId
  )

  const avgComplianceScore =
    metricStudentCompliances.length > 0
      ? Math.round(metricStudentCompliances.reduce((sum, c) => sum + c.complianceScore.score, 0) / metricStudentCompliances.length)
      : 0
  const eligibleStudents = metricStudentCompliances.filter((c) => c.boardEligibility.status === 'eligible').length
  const nearEligibleStudents = metricStudentCompliances.filter((c) => c.boardEligibility.status === 'near_eligible').length
  const complianceAtRisk = metricStudentCompliances.filter((c) => c.complianceScore.score < 70).length

  const complianceReports = {
    student_compliance: generateComplianceReport('student_compliance', metricComplianceInputs, thresholdsByStudentId),
    graduation_readiness: generateComplianceReport('graduation_readiness', metricComplianceInputs, thresholdsByStudentId),
    board_eligibility: generateComplianceReport('board_eligibility', metricComplianceInputs, thresholdsByStudentId),
    instructor_compliance: generateComplianceReport('instructor_compliance', metricComplianceInputs, thresholdsByStudentId),
    school_compliance: generateComplianceReport('school_compliance', metricComplianceInputs, thresholdsByStudentId),
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

        <SchoolSetupCenter status={onboardingStatus} />

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
          <h2 className="text-lg font-semibold text-white mb-1">Program Requirement Tracking</h2>
          <p className="mb-4 text-xs text-silver-gray">Internal ASCYN PRO tracking based on school-configured requirements; not a licensing or state-board determination.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">ASCYN Tracking Score</p>
              <p className="text-2xl font-bold text-white">{avgComplianceScore}%</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">Tracked Requirements Met</p>
              <p className="text-2xl font-bold text-gold">{eligibleStudents}</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">Nearly Complete</p>
              <p className="text-2xl font-bold text-warm-bronze">{nearEligibleStudents}</p>
            </div>
            <div className="bg-black border border-graphite rounded-lg p-4">
              <p className="text-sm text-silver">Needs Attention</p>
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
