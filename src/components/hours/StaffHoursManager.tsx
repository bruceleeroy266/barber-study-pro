import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { hasPermission } from '@/lib/auth-helpers'
import { resolveProgramRequirementsForStudents } from '@/lib/programs/requirements'
import { logStudentHours, reviewStudentHours } from '@/app/instructor/hours/actions'
import HoursPdfExports from '@/components/hours/HoursPdfExports'
import StudentHoursDropdown from '@/components/hours/StudentHoursDropdown'
import { calculateApprovedPeriodTotals, formatHourMinutes } from '@/lib/hours/reporting'
import type { HourCategory, HourStatus } from '@/types'

interface HoursRosterStudent {
  id: string
  full_name: string
  email: string
  role: string
}

interface HoursActorProfile {
  id: string
  full_name: string | null
  email: string | null
}

interface StaffHourLogRow {
  id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  notes: string | null
  rejection_reason: string | null
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string | null
  source_type: 'manual' | 'attendance'
  source_attendance_id: string | null
}

const categories: HourCategory[] = [
  'Theory',
  'Practical',
  'Clinic',
  'Sanitation',
  'Makeup Hours',
  'Other',
]

function formatHours(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}

function HourSourceBadge({ sourceType }: { sourceType: StaffHourLogRow['source_type'] }) {
  const attendanceGenerated = sourceType === 'attendance'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
        attendanceGenerated
          ? 'border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)]'
          : 'border-silver/30 bg-white/5 text-light-gray'
      }`}
      aria-label={attendanceGenerated ? 'Attendance-generated hour entry' : 'Manual hour entry'}
    >
      {attendanceGenerated ? 'Attendance-generated' : 'Manual entry'}
    </span>
  )
}

interface Props {
  returnTo: '/instructor/hours' | '/school/hours'
  backHref: '/instructor' | '/school'
  title?: string
  saved?: boolean
  error?: string | null
  highlightedStudentId?: string | null
  reviewedStatus?: string | null
  alreadyReviewedStatus?: string | null
}

export default async function StaffHoursManager({
  returnTo,
  backHref,
  title = 'Student Hours',
  saved = false,
  error = null,
  highlightedStudentId = null,
  reviewedStatus = null,
  alreadyReviewedStatus = null,
}: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: actor } = await supabase
    .from('profiles')
    .select('id, role, school_id')
    .eq('id', user.id)
    .single()

  if (!actor?.school_id || !hasPermission(actor.role, 'manage_attendance')) {
    redirect('/dashboard')
  }

  const { data: school } = await supabase
    .from('schools')
    .select('name, timezone')
    .eq('id', actor.school_id)
    .maybeSingle()

  const schoolTimeZone = typeof school?.timezone === 'string' && school.timezone
    ? school.timezone
    : 'UTC'
  const dateParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: schoolTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const datePart = (type: Intl.DateTimeFormatPartTypes) =>
    dateParts.find((part) => part.type === type)?.value ?? ''
  const today = `${datePart('year')}-${datePart('month')}-${datePart('day')}`

  const { data: studentsData } = await supabase
    .from('profiles')
    .select('id, full_name, email, role')
    .eq('school_id', actor.school_id)
    .in('role', ['student', 'apprentice'])
    .order('full_name')

  const students = (studentsData ?? []) as HoursRosterStudent[]
  const studentIds = students.map((student) => student.id)

  const { data: logsData } = studentIds.length
    ? await supabase
        .from('hour_logs')
        .select('id, user_id, date, category, minutes, status, notes, rejection_reason, submitted_by, reviewed_by, reviewed_at, created_at, source_type, source_attendance_id')
        .eq('school_id', actor.school_id)
        .in('user_id', studentIds)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
    : { data: [] }

  const logs = (logsData ?? []) as StaffHourLogRow[]
  const actorIds = Array.from(new Set(
    logs.flatMap((log) => [log.submitted_by, log.reviewed_by]).filter(Boolean),
  )) as string[]
  const { data: actorsData } = actorIds.length
    ? await supabase
        .from('profiles')
        .select('id, full_name, email')
        .in('id', actorIds)
    : { data: [] }
  const hourActors = (actorsData ?? []) as HoursActorProfile[]
  const actorNameMap = new Map<string, string>(
    hourActors.map((profile) => [
      profile.id,
      profile.full_name || profile.email || 'Staff member',
    ]),
  )

  const requirementMap = await resolveProgramRequirementsForStudents(
    supabase,
    actor.school_id,
    studentIds,
  )

  const rows = students.map((student) => {
    const studentLogs = logs.filter((log) => log.user_id === student.id)
    const approvedMinutes = studentLogs
      .filter((log) => log.status === 'approved')
      .reduce((sum, log) => sum + log.minutes, 0)
    const pendingMinutes = studentLogs
      .filter((log) => log.status === 'pending')
      .reduce((sum, log) => sum + log.minutes, 0)

    const requirements = requirementMap.get(student.id)
    const requiredHours = requirements?.requiredHours ?? 1200
    const requiredMinutes = requiredHours * 60
    const remainingMinutes = Math.max(0, requiredMinutes - approvedMinutes)
    const percentage = requiredMinutes > 0
      ? Math.min(100, Math.round((approvedMinutes / requiredMinutes) * 100))
      : 0

    return {
      ...student,
      approvedMinutes,
      pendingMinutes,
      requiredHours,
      remainingMinutes,
      percentage,
      periods: calculateApprovedPeriodTotals(studentLogs, new Date(), schoolTimeZone),
      recentLogs: studentLogs.slice(0, 5),
    }
  })

  const selectedId = highlightedStudentId && rows.some((row) => row.id === highlightedStudentId)
    ? highlightedStudentId
    : rows[0]?.id ?? ''
  const selectedStudent = rows.find((row) => row.id === selectedId) ?? null

  const errorMessage =
    error === 'missing-fields' ? 'Choose a student and date.' :
    error === 'invalid-category' ? 'Choose a valid hour category.' :
    error === 'invalid-hours' ? 'Enter more than 0 and no more than 24 hours.' :
    error === 'student-not-found' ? 'That student is not in your school.' :
    error === 'save-failed' ? 'Hours could not be saved. Please try again.' :
    error === 'instructor-only' ? 'Only instructors submit daily hours. School administrators review and approve them.' :
    error === 'invalid-review' ? 'That hour entry could not be reviewed.' :
    error === 'review-failed' ? 'The approval decision could not be saved. Please try again.' :
    error === 'rejection-reason-required' ? 'Enter a reason before rejecting an hour entry.' :
    null

  const schoolName = typeof school?.name === 'string' && school.name ? school.name : 'ASCYN PRO School'
  const isSchoolAdministrator = actor.role === 'school_admin'
  const isInstructor = actor.role === 'instructor'
  const pendingLogs = logs.filter((log) => log.status === 'pending')

  const exportStudents = rows.map((student) => ({
    id: student.id,
    full_name: student.full_name,
    email: student.email,
    requiredHours: student.requiredHours,
  }))
  const exportLogs = logs.map((log) => ({
    ...log,
    submitted_by_name: log.submitted_by ? (actorNameMap.get(log.submitted_by) ?? null) : null,
    reviewed_by_name: log.reviewed_by ? (actorNameMap.get(log.reviewed_by) ?? null) : null,
  }))

  return (
    <div className="min-h-screen bg-black p-3 sm:p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href={backHref} className="text-sm text-[var(--color-brand-gold)] hover:underline">
              ← Back
            </Link>
            <h1 className="mt-2 text-3xl font-bold text-white">{title}</h1>
            <p className="mt-1 text-silver">
              {isInstructor
                ? 'Submit each student’s daily school hours for administrator approval.'
                : 'Review instructor submissions, approve official hours, and prepare state-board records.'}
            </p>
          </div>
        </div>

        {saved && (
          <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4 text-[var(--color-brand-gold)]">
            Hours submitted for school administrator approval.
          </div>
        )}
        {reviewedStatus && ['approved', 'rejected'].includes(reviewedStatus) && (
          <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4 text-[var(--color-brand-gold)]">
            Hour entry {reviewedStatus}. Totals and the approval queue have been refreshed.
          </div>
        )}
        {alreadyReviewedStatus && ['approved', 'rejected'].includes(alreadyReviewedStatus) && (
          <div className="rounded-xl border border-silver/30 bg-white/5 p-4 text-light-gray">
            This hour entry was already {alreadyReviewedStatus}. The latest record is shown below.
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
            {errorMessage}
          </div>
        )}

        {isInstructor && (
        <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
          <h2 className="text-xl font-semibold text-white">Submit Daily Hours</h2>
          <p className="mt-1 text-sm text-silver">
            Instructor entries remain pending until a school administrator approves them.
          </p>

          <form action={logStudentHours} className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            <input type="hidden" name="returnTo" value={returnTo} />

            <label className="space-y-1 lg:col-span-2">
              <span className="text-sm text-silver">Student</span>
              <select
                name="studentId"
                defaultValue={selectedId}
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              >
                {rows.length === 0 && <option value="">No students available</option>}
                {rows.map((student) => (
                  <option key={student.id} value={student.id} className="bg-black text-white">
                    {student.full_name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Date</span>
              <input
                name="date"
                type="date"
                defaultValue={today}
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Hours</span>
              <input
                name="hours"
                type="number"
                min="0.25"
                max="24"
                step="0.25"
                placeholder="7.5"
                required
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
              />
            </label>

            <label className="space-y-1">
              <span className="text-sm text-silver">Category</span>
              <select
                name="category"
                defaultValue="Clinic"
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-black text-white">
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 md:col-span-2 lg:col-span-4">
              <span className="text-sm text-silver">Notes (optional)</span>
              <input
                name="notes"
                type="text"
                maxLength={500}
                placeholder="Example: Full school day / clinic floor"
                className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white"
              />
            </label>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={rows.length === 0}
                className="w-full rounded-lg bg-[var(--color-brand-gold)] px-4 py-3 font-semibold text-black disabled:opacity-50"
              >
                Add Hours
              </button>
            </div>
          </form>
        </section>
        )}

        {isSchoolAdministrator && (
          <section className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">Hours Approval Queue</h2>
                <p className="text-sm text-silver">
                  Pending instructor entries do not count toward official totals until approved.
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <HourSourceBadge sourceType="attendance" />
                  <HourSourceBadge sourceType="manual" />
                </div>
              </div>
              <div className="text-sm font-semibold text-[var(--color-brand-gold)]">
                {pendingLogs.length} pending
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {pendingLogs.map((log) => {
                const student = rows.find((entry) => entry.id === log.user_id)
                return (
                  <article key={log.id} className="rounded-lg border border-graphite bg-black p-4">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="font-semibold text-white">{student?.full_name ?? 'Unknown student'}</div>
                        <div className="mt-1 text-sm text-silver">
                          {log.date} · {log.category} · {formatHourMinutes(log.minutes)}
                        </div>
                        <div className="mt-2">
                          <HourSourceBadge sourceType={log.source_type} />
                        </div>
                        <div className="mt-2 text-xs text-silver">
                          Submitted by {log.submitted_by ? (actorNameMap.get(log.submitted_by) ?? 'Instructor') : 'Instructor'}
                        </div>
                        {log.notes && <div className="mt-2 text-sm text-light-gray">{log.notes}</div>}
                      </div>

                      <div className="grid grid-cols-2 gap-2 sm:flex">
                        <form action={reviewStudentHours} className="col-span-2 flex flex-col gap-2 sm:col-span-1 sm:min-w-56">
                          <input type="hidden" name="hourLogId" value={log.id} />
                          <input type="hidden" name="decision" value="rejected" />
                          <input
                            name="rejectionReason"
                            type="text"
                            maxLength={500}
                            required
                            placeholder="Reason required to reject"
                            className="w-full rounded-lg border border-graphite bg-charcoal px-3 py-2 text-sm text-white"
                          />
                          <button
                            type="submit"
                            className="w-full rounded-lg border border-warm-bronze px-4 py-2 font-semibold text-warm-bronze"
                          >
                            Reject
                          </button>
                        </form>
                        <form action={reviewStudentHours}>
                          <input type="hidden" name="hourLogId" value={log.id} />
                          <input type="hidden" name="decision" value="approved" />
                          <button
                            type="submit"
                            className="w-full rounded-lg bg-[var(--color-brand-gold)] px-4 py-2 font-semibold text-black"
                          >
                            Approve
                          </button>
                        </form>
                      </div>
                    </div>
                  </article>
                )
              })}

              {pendingLogs.length === 0 && (
                <div className="rounded-lg border border-graphite bg-black p-6 text-center text-silver">
                  No pending hour submissions.
                </div>
              )}
            </div>
          </section>
        )}

        {isSchoolAdministrator && (
          <HoursPdfExports
            schoolName={schoolName}
            timeZone={schoolTimeZone}
            students={exportStudents}
            logs={exportLogs}
          />
        )}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white">Individual Student Totals</h2>
            <p className="text-sm text-silver">
              Select a student to view their hours without loading the full roster on screen.
            </p>
          </div>

          {rows.length > 0 ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-graphite bg-charcoal p-4">
                <StudentHoursDropdown
                  students={rows.map((student) => ({
                    id: student.id,
                    full_name: student.full_name,
                    email: student.email,
                  }))}
                  selectedStudentId={selectedId}
                />
              </div>

              {selectedStudent && (
                <article
                  className={`rounded-xl border bg-charcoal p-5 ${
                    selectedStudent.id === highlightedStudentId
                      ? 'border-[var(--color-brand-gold)]'
                      : 'border-graphite'
                  }`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="break-words text-lg font-semibold text-white">{selectedStudent.full_name}</h3>
                      <p className="break-all text-sm text-silver">{selectedStudent.email}</p>
                    </div>
                    <div className="shrink-0 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 px-3 py-2 text-right">
                      <div className="text-lg font-bold text-[var(--color-brand-gold)]">{selectedStudent.percentage}%</div>
                      <div className="text-xs text-silver">complete</div>
                    </div>
                  </div>

                  {isSchoolAdministrator && (
                    <div className="mt-5 grid grid-cols-3 gap-3">
                      <div className="rounded-lg border border-graphite bg-black p-3">
                        <div className="text-xs text-silver">This Week</div>
                        <div className="mt-1 text-lg font-bold text-white">{formatHourMinutes(selectedStudent.periods.weekMinutes)}</div>
                      </div>
                      <div className="rounded-lg border border-graphite bg-black p-3">
                        <div className="text-xs text-silver">This Month</div>
                        <div className="mt-1 text-lg font-bold text-white">{formatHourMinutes(selectedStudent.periods.monthMinutes)}</div>
                      </div>
                      <div className="rounded-lg border border-graphite bg-black p-3">
                        <div className="text-xs text-silver">This Year</div>
                        <div className="mt-1 text-lg font-bold text-white">{formatHourMinutes(selectedStudent.periods.yearMinutes)}</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-lg bg-black p-3">
                      <div className="text-xs text-silver">Accumulated</div>
                      <div className="mt-1 text-xl font-bold text-white">{formatHours(selectedStudent.approvedMinutes)}</div>
                    </div>
                    <div className="rounded-lg bg-black p-3">
                      <div className="text-xs text-silver">Required</div>
                      <div className="mt-1 text-xl font-bold text-white">{selectedStudent.requiredHours}h</div>
                    </div>
                    <div className="rounded-lg bg-black p-3">
                      <div className="text-xs text-silver">Remaining</div>
                      <div className="mt-1 text-xl font-bold text-warm-bronze">{formatHours(selectedStudent.remainingMinutes)}</div>
                    </div>
                    <div className="rounded-lg bg-black p-3">
                      <div className="text-xs text-silver">Pending</div>
                      <div className="mt-1 text-xl font-bold text-silver">{formatHours(selectedStudent.pendingMinutes)}</div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-black">
                    <div
                      className="h-full rounded-full bg-[var(--color-brand-gold)]"
                      style={{ width: `${selectedStudent.percentage}%` }}
                    />
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div className="text-sm font-medium text-white">Recent hour entries</div>
                      <div className="flex flex-wrap gap-2">
                        <HourSourceBadge sourceType="attendance" />
                        <HourSourceBadge sourceType="manual" />
                      </div>
                    </div>
                    {selectedStudent.recentLogs.length === 0 ? (
                      <p className="text-sm text-silver">No hours logged yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedStudent.recentLogs.map((log) => (
                          <div key={log.id} className="flex flex-col gap-1 rounded-lg border border-graphite bg-black p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-sm text-white">
                                {log.date} · {log.category}
                              </div>
                              <div className="mt-2">
                                <HourSourceBadge sourceType={log.source_type} />
                              </div>
                              {log.notes && <div className="mt-2 text-xs text-silver">{log.notes}</div>}
                              {log.rejection_reason && (
                                <div className="text-xs text-warm-bronze">Reason: {log.rejection_reason}</div>
                              )}
                            </div>
                            <div className="text-sm font-semibold text-[var(--color-brand-gold)]">
                              {formatHours(log.minutes)} · {log.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-graphite bg-charcoal p-8 text-center text-silver">
              No students are assigned to this school yet.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
