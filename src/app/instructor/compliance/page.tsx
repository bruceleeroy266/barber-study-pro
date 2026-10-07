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
import BackButton from '@/components/ui/BackButton'
import { buildStudentCompliance, buildComplianceAlerts, generateComplianceReport, thresholdsWithRequiredHours, ComplianceRuleThresholds, DEFAULT_COMPLIANCE_THRESHOLDS } from '@/lib/compliance'
import { resolveProgramRequirementsForStudents } from '@/lib/programs/requirements'
import { loadEnrollmentHourContractsForStudents } from '@/lib/hours/adaptive-student-hours-data'
import ComplianceAlertsPanel from '@/components/compliance/ComplianceAlertsPanel'
import ComplianceReportingCenter from '@/components/compliance/ComplianceReportingCenter'
import { CheckCircle, AlertTriangle, Clock, Wrench, ClipboardCheck, Target } from 'lucide-react'
import { mapAttendanceRecordsFromDb, mapHourLogsFromDb, mapGradesFromDb, mapGradeCategoriesFromDb, mapAssessmentsFromDb } from '@/lib/mappers/operational-data-mappers'
import { resolveSupportAccessContext } from '@/lib/support-access'
import { loadAssignedStudentIds } from '@/lib/instructor/assignments'

export default async function InstructorComplianceDashboard() {
  const supabase = await createClient()
  const context = await resolveSupportAccessContext()
  if (!context) redirect('/login')

  const profile = context.effectiveProfile
  if (profile.role !== 'instructor' && profile.role !== 'admin' && profile.role !== 'school_admin') {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  if (!profile.school_id) {
    redirect(context.supportActive ? '/admin/support-access' : '/dashboard')
  }

  const useDemo = isDemoFallbackEnabled()
  const schoolId = profile.school_id
  const assignedStudentIds = profile.role === 'instructor'
    ? await loadAssignedStudentIds(supabase, schoolId, profile.id)
    : null

  let studentQuery = supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  if (assignedStudentIds) {
    studentQuery = studentQuery.in(
      'id',
      assignedStudentIds.length > 0 ? assignedStudentIds : ['__none__']
    )
  }

  const { data: studentsData } = await studentQuery
  let students: Profile[] = (studentsData as Profile[]) || []
  if (students.length === 0 && useDemo) {
    students = demoStudents.filter((s) => s.school_id === schoolId || !schoolId)
  }

  const studentIds = students.map((s) => s.id)
  const metricStudents = students.filter((student) => student.include_in_school_metrics !== false)
  const metricStudentIds = metricStudents.map((student) => student.id)
  const metricStudentIdSet = new Set(metricStudentIds)
  const studentIdFilter = studentIds.length > 0 ? studentIds : ['__none__']

  // Resolve each student's program requirements (programs.required_hours) so
  // compliance surfaces reflect the school's configured program, not a
  // hard-coded hours assumption. Falls back per student to the school program,
  // then to the app-wide default.
  const [programRequirements, hourContractsByStudent] = await Promise.all([
    resolveProgramRequirementsForStudents(supabase, schoolId, studentIds),
    loadEnrollmentHourContractsForStudents(supabase, schoolId, studentIds),
  ])
  const thresholdsByStudentId = new Map<string, ComplianceRuleThresholds>(
    studentIds.map((id) => {
      const requirements = programRequirements.get(id)
      return [
        id,
        {
          ...thresholdsWithRequiredHours(requirements?.requiredHours),
          requiredAssessments: requirements?.requiredAssessments ?? DEFAULT_COMPLIANCE_THRESHOLDS.requiredAssessments,
          requiredPracticals: requirements?.requiredPracticals ?? DEFAULT_COMPLIANCE_THRESHOLDS.requiredPracticals,
        },
      ]
    })
  )

  const [attendanceRes, hoursRes, attemptsRes, progressRes, gradesRes, categoriesRes, assessmentsRes] =
    await Promise.all([
      supabase.from('attendance_records').select('*').eq('school_id', schoolId).in('user_id', studentIdFilter),
      supabase.from('effective_hour_logs').select('*').eq('school_id', schoolId).in('user_id', studentIdFilter),
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
      thresholds: thresholdsByStudentId.get(student.id),
      priorCreditMinutes: hourContractsByStudent.get(student.id)?.priorCreditMinutes ?? 0,
      requirementOverrideMinutes: hourContractsByStudent.get(student.id)?.requirementOverrideMinutes ?? null,
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
      thresholds: thresholdsByStudentId.get(student.id),
      priorCreditMinutes: hourContractsByStudent.get(student.id)?.priorCreditMinutes ?? 0,
      requirementOverrideMinutes: hourContractsByStudent.get(student.id)?.requirementOverrideMinutes ?? null,
    })
  )

  const priorCreditMinutesByStudentId = Object.fromEntries(
    studentIds.map((id) => [id, hourContractsByStudent.get(id)?.priorCreditMinutes ?? 0]),
  )
  const requirementOverrideMinutesByStudentId = Object.fromEntries(
    studentIds.map((id) => [id, hourContractsByStudent.get(id)?.requirementOverrideMinutes ?? null]),
  )

  const reportInputs = {
    students: metricStudents,
    attendanceRecords: attendanceRecords.filter((record) => metricStudentIdSet.has(record.userId)),
    hourLogs: hourLogs.filter((record) => metricStudentIdSet.has(record.user_id)),
    quizAttempts: quizAttempts.filter((record) => metricStudentIdSet.has(record.user_id)),
    progress: progress.filter((record) => metricStudentIdSet.has(record.user_id)),
    grades: grades.filter((record) => metricStudentIdSet.has(record.studentId)),
    gradeCategories,
    assessments: assessments.filter((record) => metricStudentIdSet.has(record.studentId)),
    priorCreditMinutesByStudentId,
    requirementOverrideMinutesByStudentId,
  }

  const complianceReports = {
    student_compliance: generateComplianceReport('student_compliance', reportInputs, thresholdsByStudentId),
    graduation_readiness: generateComplianceReport('graduation_readiness', reportInputs, thresholdsByStudentId),
    board_eligibility: generateComplianceReport('board_eligibility', reportInputs, thresholdsByStudentId),
    instructor_compliance: generateComplianceReport('instructor_compliance', reportInputs, thresholdsByStudentId),
    school_compliance: generateComplianceReport('school_compliance', reportInputs, thresholdsByStudentId),
  }

  const metricStudentCompliances = studentCompliances.filter((compliance) =>
    metricStudentIdSet.has(compliance.studentId)
  )
  const atRiskStudents = metricStudentCompliances.filter((c) => c.complianceScore.score < 70)
  const missingHours = metricStudentCompliances.filter(
    (c) => c.completedHours < c.graduationReadiness.requiredHours * 0.5,
  )
  const missingPracticals = metricStudentCompliances.filter((c) =>
    c.graduationReadiness.requiredPracticals > 0 &&
    c.graduationReadiness.completedPracticals < c.graduationReadiness.requiredPracticals
  )
  const missingAssessments = metricStudentCompliances.filter((c) =>
    c.graduationReadiness.requiredAssessments > 0 &&
    c.graduationReadiness.completedAssessments < c.graduationReadiness.requiredAssessments
  )
  const lowReadiness = metricStudentCompliances.filter((c) =>
    c.hasReadinessEvidence && c.readiness.score < DEFAULT_COMPLIANCE_THRESHOLDS.minimumReadinessScore
  )
  const trackedRequirementsMet = metricStudentCompliances.filter((c) => c.boardEligibility.status === 'eligible')

  return (
    <div className="min-h-screen bg-[var(--color-background-primary)] p-6 lg:p-8">
        <BackButton fallbackHref="/instructor" label="Back to instructor dashboard" />
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Program Requirement Tracking</h1>
          <p className="text-[var(--color-text-muted)]">Monitor ASCYN PRO internal progress against school-configured program requirements. This does not determine licensing or state-board eligibility.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <StatCard label="Students At Risk" value={atRiskStudents.length} icon={AlertTriangle} color="text-silver" />
          <StatCard label="Missing Hours" value={missingHours.length} icon={Clock} color="text-silver" />
          <StatCard label="Missing Practicals" value={missingPracticals.length} icon={Wrench} color="text-warm-bronze" />
          <StatCard label="Missing Assessments" value={missingAssessments.length} icon={ClipboardCheck} color="text-silver" />
          <StatCard label="Low Readiness" value={lowReadiness.length} icon={Target} color="text-silver" />
          <StatCard label="Requirements Met" value={trackedRequirementsMet.length} icon={CheckCircle} color="text-gold" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <ComplianceAlertsPanel alerts={allAlerts} />
          </div>
          <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Tracked Requirements Met</h2>
            {trackedRequirementsMet.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No students currently meet every ASCYN PRO tracked program threshold.</p>
            ) : (
              <ul className="space-y-2">
                {trackedRequirementsMet.map((c) => (
                  <li key={c.studentId} className="flex items-center justify-between p-3 bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-lg">
                    <span className="text-white font-medium">{c.fullName}</span>
                    <span className="text-xs text-gold border border-gold/20 bg-gold/10 px-2 py-1 rounded">Requirements Met</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl overflow-hidden">
          <div className="p-4 border-b border-[var(--color-border-primary)]">
            <h2 className="text-lg font-semibold text-white">Student Requirement Summary</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-background-primary)] text-left">
                <tr>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Student</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Tracking Score</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Attendance</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Hours</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Assessments</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Practicals</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Readiness</th>
                  <th className="px-4 py-3 text-xs font-medium text-[var(--color-text-muted)]">Requirements Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-graphite">
                {studentCompliances.map((c) => (
                  <tr key={c.studentId} className="hover:bg-[var(--color-background-secondary)]/30">
                    <td className="px-4 py-3 text-white font-medium">{c.fullName}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${c.complianceScore.colorClass}`}>{c.complianceScore.score}</span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.hasAttendanceEvidence ? `${c.attendanceSummary.attendancePercentage}%` : '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{Math.round(c.completedHours)}/{c.graduationReadiness.requiredHours}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.graduationReadiness.requiredAssessments <= 0 ? 'N/A' : c.hasAssessmentEvidence ? `${c.assessmentPassRate}%` : '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.graduationReadiness.requiredPracticals <= 0 ? 'N/A' : c.hasAssessmentEvidence ? `${c.practicalPassRate}%` : '—'}</td>
                    <td className="px-4 py-3 text-[var(--color-text-secondary)]">{c.hasReadinessEvidence ? c.readiness.score : '—'}</td>
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
    <div className="bg-[var(--color-background-primary)] border border-[var(--color-border-primary)] rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  )
}
