import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getRoleBasedRedirect } from '@/lib/auth-access'
import {
  defaultProgramRequirements,
  resolveStudentProgramRequirements,
} from '@/lib/programs/requirements'
import { calculateAttendanceSummary, getTodayAttendanceStatus } from '@/lib/attendance'
import { mapAttendanceRecordsFromDb } from '@/lib/mappers/operational-data-mappers'
import { calculateApprovedPeriodTotals } from '@/lib/hours/reporting'
import type { HoursReportLog } from '@/lib/hours/reporting'
import { calculateAdaptiveStudentHours } from '@/lib/hours/adaptive-student-hours'
import { loadEnrollmentHourContractForStudent } from '@/lib/hours/adaptive-student-hours-data'
import type { AttendanceRecord, AttendanceStatus, HourCategory } from '@/types'

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  return remainder === 0 ? `${hours}h` : `${hours}h ${remainder}m`
}

function attendanceLabel(status: AttendanceStatus | null): string {
  return status ?? 'Not recorded'
}

function formatAttendanceDuration(minutes: number | null): string {
  if (minutes === null) return '—'
  if (minutes === 0) return '0m'
  return formatMinutes(minutes)
}

function formatAttendanceTime(value: string | null, timeZone: string): string {
  if (!value) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return '—'
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: 'numeric',
    minute: '2-digit',
  }).format(parsed)
}


function hourStatusClass(status: 'pending' | 'approved' | 'rejected'): string {
  switch (status) {
    case 'approved':
      return 'border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)]'
    case 'pending':
      return 'border-silver/30 bg-white/5 text-light-gray'
    case 'rejected':
      return 'border-warm-bronze/40 bg-warm-bronze/10 text-warm-bronze'
  }
}

function hourStatusLabel(status: 'pending' | 'approved' | 'rejected'): string {
  return status.charAt(0).toUpperCase() + status.slice(1)
}

function hourSourceLabel(sourceType: 'manual' | 'attendance'): string {
  return sourceType === 'attendance' ? 'Attendance-generated' : 'Manual entry'
}


const scheduleDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function formatScheduleTime(value: string | null): string {
  if (!value) return '—'
  const [hours, minutes] = value.slice(0, 5).split(':').map(Number)
  const suffix = hours >= 12 ? 'PM' : 'AM'
  const displayHour = hours % 12 || 12
  return `${displayHour}:${String(minutes).padStart(2, '0')} ${suffix}`
}

function scheduleOverrideLabel(type: 'scheduled' | 'off' | 'makeup'): string {
  if (type === 'off') return 'Day Off'
  if (type === 'makeup') return 'Makeup / Extra Session'
  return 'Changed Schedule'
}

function attendanceStatusClass(status: AttendanceStatus | null): string {
  switch (status) {
    case 'Present':
    case 'Clocked In':
      return 'border-[var(--color-brand-gold)]/40 bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)]'
    case 'Tardy':
      return 'border-warm-bronze/40 bg-warm-bronze/10 text-warm-bronze'
    case 'Absent':
    case 'Excused':
    case 'Clocked Out':
      return 'border-silver/30 bg-white/5 text-light-gray'
    default:
      return 'border-graphite bg-black text-silver'
  }
}

export default async function StudentHoursPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login?redirect=/dashboard/hours')

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role, school_id, full_name')
    .eq('id', user.id)
    .single()

  if (!profile || (profile.role !== 'student' && profile.role !== 'apprentice')) {
    redirect(getRoleBasedRedirect(profile?.role))
  }

  const schoolId = profile.school_id as string | null
  const { data: school } = schoolId
    ? await supabase
        .from('schools')
        .select('timezone')
        .eq('id', schoolId)
        .maybeSingle()
    : { data: null }

  const schoolTimeZone =
    typeof school?.timezone === 'string' && school.timezone ? school.timezone : 'UTC'

  const todayParts = new Intl.DateTimeFormat('en-CA', {
    timeZone: schoolTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const datePart = (type: Intl.DateTimeFormatPartTypes) =>
    todayParts.find((part) => part.type === type)?.value ?? ''
  const localToday = `${datePart('year')}-${datePart('month')}-${datePart('day')}`

  const requirements = schoolId
    ? await resolveStudentProgramRequirements(supabase, schoolId, user.id)
    : defaultProgramRequirements()

  const hourContract = schoolId
    ? await loadEnrollmentHourContractForStudent(supabase, schoolId, user.id)
    : {
        enrollmentId: null,
        priorCreditMinutes: 0,
        requirementOverrideMinutes: null,
        contractVersion: 0,
      }

  let hourQuery = supabase
    .from('effective_hour_logs')
    .select('id, user_id, date, category, minutes, effective_minutes, integrity_status, status, source_type, resubmission_of_hour_log_id, rejection_reason, reviewed_at, created_at')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  let scheduleProfilesQuery = supabase
    .from('student_schedule_profiles')
    .select('id, name, effective_from, effective_to, source_template_id, is_active')
    .eq('student_id', user.id)
    .eq('is_active', true)
    .order('effective_from', { ascending: false })

  let scheduleOverridesQuery = supabase
    .from('student_schedule_overrides')
    .select('id, override_date, override_type, start_time, end_time, break_minutes, reason')
    .eq('student_id', user.id)
    .order('override_date', { ascending: false })
    .limit(20)

  let attendanceQuery = supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (schoolId) {
    hourQuery = hourQuery.eq('school_id', schoolId)
    attendanceQuery = attendanceQuery.eq('school_id', schoolId)
    scheduleProfilesQuery = scheduleProfilesQuery.eq('school_id', schoolId)
    scheduleOverridesQuery = scheduleOverridesQuery.eq('school_id', schoolId)
  }

  const [
    { data: hourRows },
    { data: attendanceRows },
    { data: scheduleProfileRows },
    { data: scheduleOverrideRows },
  ] = await Promise.all([
    hourQuery,
    attendanceQuery,
    scheduleProfilesQuery,
    scheduleOverridesQuery,
  ])

  const hours = (hourRows ?? []) as Array<{
    id: string
    user_id: string
    date: string
    category: string
    minutes: number
    effective_minutes: number | null
    integrity_status: 'not_approved' | 'valid_unadjusted' | 'valid_adjusted' | 'invalid'
    status: 'pending' | 'approved' | 'rejected'
    source_type: 'manual' | 'attendance'
    resubmission_of_hour_log_id: string | null
    rejection_reason: string | null
    reviewed_at: string | null
    created_at: string | null
  }>


  const scheduleProfiles = (scheduleProfileRows ?? []) as Array<{
    id: string
    name: string
    effective_from: string
    effective_to: string | null
    source_template_id: string | null
    is_active: boolean
  }>

  const scheduleOverrides = (scheduleOverrideRows ?? []) as Array<{
    id: string
    override_date: string
    override_type: 'scheduled' | 'off' | 'makeup'
    start_time: string | null
    end_time: string | null
    break_minutes: number
    reason: string | null
  }>

  const currentScheduleProfile = scheduleProfiles.find(
    (profile) =>
      profile.effective_from <= localToday &&
      (!profile.effective_to || profile.effective_to >= localToday),
  ) ?? null

  const { data: scheduleDayRows } = currentScheduleProfile
    ? await supabase
        .from('student_schedule_days')
        .select('day_of_week, is_scheduled, start_time, end_time, break_minutes')
        .eq('schedule_profile_id', currentScheduleProfile.id)
        .order('day_of_week')
    : { data: [] }

  const scheduleDays = (scheduleDayRows ?? []) as Array<{
    day_of_week: number
    is_scheduled: boolean
    start_time: string | null
    end_time: string | null
    break_minutes: number
  }>

  const reportingHours: HoursReportLog[] = hours.map((row) => ({
    id: row.id,
    user_id: row.user_id,
    date: row.date,
    category: row.category as HourCategory,
    minutes: row.minutes,
    effective_minutes: row.effective_minutes,
    integrity_status: row.integrity_status,
    status: row.status,
    notes: null,
    rejection_reason: row.rejection_reason,
    submitted_by: null,
    reviewed_by: null,
    reviewed_at: row.reviewed_at,
    created_at: row.created_at,
  }))

  const adaptiveHours = calculateAdaptiveStudentHours(reportingHours, {
    programRequiredHours: requirements.requiredHours,
    priorCreditMinutes: hourContract.priorCreditMinutes,
    requirementOverrideMinutes: hourContract.requirementOverrideMinutes,
    contractVersion: hourContract.contractVersion,
  })
  const approvedMinutes = adaptiveHours.earnedApprovedMinutes
  const pendingMinutes = reportingHours
    .filter((log) => log.status === 'pending')
    .reduce((sum, log) => sum + log.minutes, 0)
  const requiredMinutes = adaptiveHours.effectiveRequiredMinutes
  const remainingMinutes = adaptiveHours.remainingMinutes
  const completionPercentage = adaptiveHours.completionPercentage

  const approvedPeriods = calculateApprovedPeriodTotals(
    reportingHours,
    new Date(),
    schoolTimeZone,
  )

  const attendanceRecords: AttendanceRecord[] =
    mapAttendanceRecordsFromDb(attendanceRows ?? []) ?? []
  const attendanceSummary = calculateAttendanceSummary(user.id, attendanceRecords)
  const { status: todayStatus } = getTodayAttendanceStatus(
    attendanceRecords,
    user.id,
    localToday,
  )
  const currentAttendanceStatus = todayStatus ?? attendanceSummary.currentStatus

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-1 pb-8 sm:space-y-8 sm:px-0">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance & Hours</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Your approved school hours are official. Pending hours are waiting for administrator review.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-xl border border-graphite bg-charcoal p-4 text-sm text-silver sm:grid-cols-3" aria-label="Hour status guide">
        <div><span className="font-semibold text-[var(--color-brand-gold)]">Approved</span> · counts toward official hours</div>
        <div><span className="font-semibold text-light-gray">Pending</span> · waiting for administrator review</div>
        <div><span className="font-semibold text-warm-bronze">Rejected</span> · does not count toward official hours</div>
      </div>

      <section aria-labelledby="hours-summary-heading" className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-6">
        <h2 id="hours-summary-heading" className="sr-only">Hours summary</h2>
        <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4 sm:p-5">
          <div className="text-sm text-silver">Approved Hours</div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-brand-gold)]">
            {formatMinutes(approvedMinutes)}
          </div>
          <div className="mt-1 text-xs text-silver">Counts toward your official total</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-5">
          <div className="text-sm text-silver">Prior / Transfer Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(adaptiveHours.priorCreditMinutes)}</div>
          <div className="mt-1 text-xs text-silver">Accepted by your school from prior training</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-5">
          <div className="text-sm text-silver">Pending Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(pendingMinutes)}</div>
          <div className="mt-1 text-xs text-silver">Waiting for administrator approval</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-5">
          <div className="text-sm text-silver">Remaining Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(remainingMinutes)}</div>
          <div className="mt-1 text-xs text-silver">Based on approved hours only</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-5">
          <div className="text-sm text-silver">Required Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(requiredMinutes)}</div>
          <div className="mt-1 text-xs text-silver">
            {adaptiveHours.requirementSource === 'student_override'
              ? 'Student-specific requirement'
              : (requirements.programName ?? 'Configured school requirement')}
          </div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-5">
          <div className="text-sm text-silver">Today&apos;s Attendance</div>
          <div
            aria-label={`Today's attendance status: ${attendanceLabel(todayStatus)}`}
            className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${attendanceStatusClass(todayStatus)}`}
          >
            {attendanceLabel(todayStatus)}
          </div>
          <div className="mt-2 text-xs text-silver">{localToday}</div>
        </div>
      </section>

      <section aria-labelledby="attendance-summary-heading" className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="attendance-summary-heading" className="text-lg font-semibold text-white">Attendance Summary</h2>
            <p className="mt-1 text-sm text-silver">
              Calculated from the same attendance rules used across ASCYN PRO.
            </p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-xs text-silver">Current Status</div>
            <div className={`mt-1 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${attendanceStatusClass(currentAttendanceStatus)}`}>
              {attendanceLabel(currentAttendanceStatus)}
            </div>
            {todayStatus === null && attendanceSummary.lastAttendanceDate && (
              <div className="mt-1 text-xs text-silver">
                Latest recorded: {attendanceSummary.lastAttendanceDate}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
          <div className="col-span-2 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4 sm:col-span-1">
            <div className="text-xs text-silver">Attendance</div>
            <div className="mt-1 text-2xl font-bold text-[var(--color-brand-gold)]">
              {attendanceSummary.attendancePercentage}%
            </div>
            <div className="mt-1 text-xs text-silver">Excused days are excluded from the denominator</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">Present Days</div>
            <div className="mt-1 text-xl font-bold text-white">{attendanceSummary.presentDays}</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">Tardy Days</div>
            <div className="mt-1 text-xl font-bold text-white">{attendanceSummary.tardyDays}</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">Absent Days</div>
            <div className="mt-1 text-xl font-bold text-white">{attendanceSummary.absentDays}</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">Excused Days</div>
            <div className="mt-1 text-xl font-bold text-white">{attendanceSummary.excusedDays}</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-graphite bg-charcoal p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Approved Hour Totals</h2>
          <p className="mt-1 text-sm text-silver">
            These period totals include approved hours only. Pending hours remain separate until administrator approval.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">This Week</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMinutes(approvedPeriods.weekMinutes)}</div>
            <div className="mt-1 text-xs text-silver">Approved</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">This Month</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMinutes(approvedPeriods.monthMinutes)}</div>
            <div className="mt-1 text-xs text-silver">Approved</div>
          </div>
          <div className="rounded-lg border border-graphite bg-black p-4">
            <div className="text-xs text-silver">This Year</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMinutes(approvedPeriods.yearMinutes)}</div>
            <div className="mt-1 text-xs text-silver">Approved</div>
          </div>
          <div className="rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4">
            <div className="text-xs text-silver">Overall</div>
            <div className="mt-1 text-xl font-bold text-[var(--color-brand-gold)]">{formatMinutes(approvedMinutes)}</div>
            <div className="mt-1 text-xs text-silver">Official approved total</div>
          </div>
          <div className="rounded-lg border border-silver/20 bg-white/5 p-4">
            <div className="text-xs text-silver">Pending</div>
            <div className="mt-1 text-xl font-bold text-white">{formatMinutes(pendingMinutes)}</div>
            <div className="mt-1 text-xs text-silver">Not included above</div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-graphite bg-charcoal p-5 sm:p-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Official Hour Progress</h2>
            <p className="mt-1 text-sm text-silver">
              Pending hours do not increase this progress until a school administrator approves them.
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[var(--color-brand-gold)]">{completionPercentage}%</div>
            <div className="text-xs text-silver">complete</div>
          </div>
        </div>

        <div
          className="mt-4 h-3 overflow-hidden rounded-full bg-black"
          role="progressbar"
          aria-label="Official hour progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={completionPercentage}
        >
          <div
            className="h-full rounded-full bg-[var(--color-brand-gold)]"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="mt-3 text-sm text-silver">
          {formatMinutes(adaptiveHours.creditedAndEarnedMinutes)} counted toward {formatMinutes(requiredMinutes)} required
          {adaptiveHours.priorCreditMinutes > 0
            ? ` · includes ${formatMinutes(adaptiveHours.priorCreditMinutes)} prior / transfer credit`
            : ''}
        </div>
      </section>

      <details className="rounded-xl border border-graphite bg-charcoal" open>
        <summary className="cursor-pointer list-none p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">My Schedule</h2>
              <p className="mt-1 text-sm text-silver">
                Current weekly schedule and one-day exceptions.
              </p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-brand-gold)]">Show / hide</span>
          </div>
        </summary>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <p className="text-sm text-silver">
            Schedule changes do not change official hours by themselves.
          </p>

        {currentScheduleProfile ? (
          <>
            <div className="mt-4 rounded-lg border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="font-semibold text-white">{currentScheduleProfile.name}</div>
                  <div className="mt-1 text-sm text-silver">
                    Effective {currentScheduleProfile.effective_from} → {currentScheduleProfile.effective_to ?? 'ongoing'}
                  </div>
                </div>
                <div className="text-xs text-silver">
                  {currentScheduleProfile.source_template_id ? 'Template-based schedule' : 'Custom schedule'}
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-7">
              {scheduleDayNames.map((dayName, dayOfWeek) => {
                const day = scheduleDays.find((entry) => entry.day_of_week === dayOfWeek)
                const isScheduled = Boolean(day?.is_scheduled)

                return (
                  <div key={dayName} className="rounded-lg border border-graphite bg-black p-4">
                    <div className="text-sm font-semibold text-white">{dayName}</div>
                    {isScheduled && day ? (
                      <>
                        <div className="mt-2 text-sm text-light-gray">
                          {formatScheduleTime(day.start_time)}–{formatScheduleTime(day.end_time)}
                        </div>
                        <div className="mt-1 text-xs text-silver">{day.break_minutes} min break</div>
                      </>
                    ) : (
                      <div className="mt-2 text-sm text-silver">Not scheduled</div>
                    )}
                  </div>
                )
              })}
            </div>
          </>
        ) : (
          <div className="mt-4 rounded-lg border border-graphite bg-black p-6 text-center text-silver">
            No current weekly schedule is assigned.
          </div>
        )}

        <div className="mt-6">
          <h3 className="text-base font-semibold text-white">One-Day Overrides</h3>
          <p className="mt-1 text-sm text-silver">
            Days off, changed schedules, and makeup sessions are listed here without changing your recurring weekly schedule.
          </p>

          {scheduleOverrides.length === 0 ? (
            <div className="mt-3 rounded-lg border border-graphite bg-black p-4 text-sm text-silver">
              No one-day overrides recorded.
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {scheduleOverrides.map((override) => (
                <article key={override.id} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="font-semibold text-white">{override.override_date}</div>
                      <div className="mt-1 text-sm text-light-gray">{scheduleOverrideLabel(override.override_type)}</div>
                    </div>
                    {override.override_type !== 'off' && (
                      <div className="text-sm text-light-gray sm:text-right">
                        <div>{formatScheduleTime(override.start_time)}–{formatScheduleTime(override.end_time)}</div>
                        <div className="mt-1 text-xs text-silver">{override.break_minutes} min break</div>
                      </div>
                    )}
                  </div>
                  {override.reason && (
                    <div className="mt-3 text-sm text-silver">{override.reason}</div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
        </div>
      </details>

      <details className="rounded-xl border border-graphite bg-charcoal">
        <summary className="cursor-pointer list-none p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Attendance History</h2>
              <p className="mt-1 text-sm text-silver">Recent attendance records and actual attended time.</p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-brand-gold)]">Show / hide</span>
          </div>
        </summary>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div>
          <p className="mt-1 text-sm text-silver">
            Your most recent attendance records, including actual arrival, departure, and attended time.
          </p>
        </div>

        {attendanceRecords.length === 0 ? (
          <div className="mt-4 rounded-lg border border-graphite bg-black p-6 text-center text-silver">
            No attendance records yet.
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3 md:hidden">
              {attendanceRecords.slice(0, 30).map((record) => (
                <article key={record.id} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{record.date}</div>
                      <div className="mt-1 text-xs text-silver">School attendance record</div>
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${attendanceStatusClass(record.status)}`}>
                      {record.status}
                    </span>
                  </div>

                  <dl className="mt-4 grid grid-cols-3 gap-3">
                    <div>
                      <dt className="text-xs text-silver">Arrival</dt>
                      <dd className="mt-1 text-sm font-medium text-white">
                        {formatAttendanceTime(record.clockedInAt, schoolTimeZone)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-silver">Departure</dt>
                      <dd className="mt-1 text-sm font-medium text-white">
                        {formatAttendanceTime(record.clockedOutAt, schoolTimeZone)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-silver">Attended</dt>
                      <dd className="mt-1 text-sm font-medium text-white">
                        {formatAttendanceDuration(record.minutesPresent)}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-graphite text-silver">
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Arrival</th>
                    <th className="px-3 py-3 font-medium">Departure</th>
                    <th className="px-3 py-3 font-medium">Attended</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.slice(0, 30).map((record) => (
                    <tr key={record.id} className="border-b border-graphite/70 last:border-0">
                      <td className="px-3 py-3 font-medium text-white">{record.date}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${attendanceStatusClass(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-light-gray">
                        {formatAttendanceTime(record.clockedInAt, schoolTimeZone)}
                      </td>
                      <td className="px-3 py-3 text-light-gray">
                        {formatAttendanceTime(record.clockedOutAt, schoolTimeZone)}
                      </td>
                      <td className="px-3 py-3 font-medium text-white">
                        {formatAttendanceDuration(record.minutesPresent)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {attendanceRecords.length > 30 && (
              <div className="mt-3 text-center text-xs text-silver">
                Showing the 30 most recent attendance records.
              </div>
            )}
          </>
        )}
        </div>
      </details>

      <details className="rounded-xl border border-graphite bg-charcoal">
        <summary className="cursor-pointer list-none p-4 sm:p-6 [&::-webkit-details-marker]:hidden">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-white">Hour History</h2>
              <p className="mt-1 text-sm text-silver">Approved, pending, rejected, and corrected hour entries.</p>
              <p className="sr-only">Your most recent hour entries. Approved entries count toward your official total; pending and rejected entries do not.</p>
            </div>
            <span className="text-xs font-semibold text-[var(--color-brand-gold)]">Show / hide</span>
          </div>
        </summary>
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">

        {hours.length === 0 ? (
          <div className="mt-4 rounded-lg border border-graphite bg-black p-6 text-center text-silver">
            No hour entries yet.
          </div>
        ) : (
          <>
            <div className="mt-4 space-y-3 md:hidden">
              {hours.slice(0, 30).map((entry) => (
                <article key={entry.id} className="rounded-lg border border-graphite bg-black p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-white">{entry.date}</div>
                      <div className="mt-1 text-sm text-silver">{entry.category}</div>
                    </div>
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${hourStatusClass(entry.status)}`}>
                      {hourStatusLabel(entry.status)}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-lg font-semibold text-white">{formatMinutes(entry.status === 'approved' ? (entry.effective_minutes ?? entry.minutes) : entry.minutes)}</span>
                    <span className="inline-flex rounded-full border border-silver/30 bg-white/5 px-2.5 py-1 text-xs font-medium text-light-gray">
                      {hourSourceLabel(entry.source_type)}
                    </span>
                    {entry.resubmission_of_hour_log_id && (
                      <span className="inline-flex rounded-full border border-warm-bronze/40 bg-warm-bronze/10 px-2.5 py-1 text-xs font-semibold text-warm-bronze">
                        Corrected resubmission
                      </span>
                    )}
                  </div>

                  {entry.status === 'rejected' && entry.rejection_reason && (
                    <div className="mt-4 rounded-lg border border-warm-bronze/30 bg-warm-bronze/10 p-3">
                      <div className="text-xs font-semibold uppercase tracking-wide text-warm-bronze">Rejection reason</div>
                      <p className="mt-1 text-sm text-light-gray">{entry.rejection_reason}</p>
                      <p className="mt-2 text-xs text-silver">
                        Rejected hours do not count toward your official total. Your instructor or school must correct and resubmit the record.
                      </p>
                    </div>
                  )}

                  {entry.resubmission_of_hour_log_id && (
                    <div className="mt-3 rounded-lg border border-silver/20 bg-white/5 p-3 text-sm text-light-gray">
                      {entry.status === 'pending'
                        ? 'A corrected version of a previously rejected entry has been resubmitted and is waiting for administrator review.'
                        : entry.status === 'approved'
                          ? 'This corrected version was approved and now counts toward your official total.'
                          : 'This is a corrected resubmission linked to a prior rejected entry.'}
                    </div>
                  )}
                </article>
              ))}
            </div>

            <div className="mt-4 hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-graphite text-silver">
                    <th className="px-3 py-3 font-medium">Date</th>
                    <th className="px-3 py-3 font-medium">Category</th>
                    <th className="px-3 py-3 font-medium">Hours</th>
                    <th className="px-3 py-3 font-medium">Status</th>
                    <th className="px-3 py-3 font-medium">Source</th>
                    <th className="px-3 py-3 font-medium">Correction / Review</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.slice(0, 30).map((entry) => (
                    <tr key={entry.id} className="border-b border-graphite/70 last:border-0">
                      <td className="px-3 py-3 font-medium text-white">{entry.date}</td>
                      <td className="px-3 py-3 text-light-gray">{entry.category}</td>
                      <td className="px-3 py-3 font-medium text-white">{formatMinutes(entry.status === 'approved' ? (entry.effective_minutes ?? entry.minutes) : entry.minutes)}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${hourStatusClass(entry.status)}`}>
                          {hourStatusLabel(entry.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-light-gray">{hourSourceLabel(entry.source_type)}</td>
                      <td className="px-3 py-3 text-light-gray">
                        {entry.status === 'rejected' && entry.rejection_reason ? (
                          <div className="max-w-sm">
                            <div className="font-medium text-warm-bronze">Rejected: {entry.rejection_reason}</div>
                            <div className="mt-1 text-xs text-silver">Does not count toward official hours.</div>
                          </div>
                        ) : entry.resubmission_of_hour_log_id ? (
                          <div className="max-w-sm">
                            <div className="font-medium text-light-gray">Corrected resubmission</div>
                            <div className="mt-1 text-xs text-silver">
                              {entry.status === 'pending'
                                ? 'Waiting for administrator review.'
                                : entry.status === 'approved'
                                  ? 'Approved and included in official hours.'
                                  : 'Linked to a prior rejected entry.'}
                            </div>
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {hours.length > 30 && (
              <div className="mt-3 text-center text-xs text-silver">
                Showing the 30 most recent hour entries.
              </div>
            )}
          </>
        )}
        </div>
      </details>
    </div>
  )
}
