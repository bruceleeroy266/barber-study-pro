import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { getRoleBasedRedirect } from '@/lib/auth-access'
import {
  defaultProgramRequirements,
  resolveStudentProgramRequirements,
} from '@/lib/programs/requirements'
import { getTodayAttendanceStatus } from '@/lib/attendance'
import { mapAttendanceRecordsFromDb } from '@/lib/mappers/operational-data-mappers'
import type { AttendanceRecord, AttendanceStatus } from '@/types'

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

  let hourQuery = supabase
    .from('hour_logs')
    .select('id, user_id, date, category, minutes, status, source_type, resubmission_of_hour_log_id, created_at')
    .eq('user_id', user.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false })

  let attendanceQuery = supabase
    .from('attendance_records')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  if (schoolId) {
    hourQuery = hourQuery.eq('school_id', schoolId)
    attendanceQuery = attendanceQuery.eq('school_id', schoolId)
  }

  const [{ data: hourRows }, { data: attendanceRows }] = await Promise.all([
    hourQuery,
    attendanceQuery,
  ])

  const hours = (hourRows ?? []) as Array<{
    id: string
    user_id: string
    date: string
    category: string
    minutes: number
    status: 'pending' | 'approved' | 'rejected'
    source_type: 'manual' | 'attendance'
    resubmission_of_hour_log_id: string | null
    created_at: string | null
  }>

  const approvedMinutes = hours
    .filter((row) => row.status === 'approved')
    .reduce((sum, row) => sum + row.minutes, 0)
  const pendingMinutes = hours
    .filter((row) => row.status === 'pending')
    .reduce((sum, row) => sum + row.minutes, 0)

  const requiredMinutes = requirements.requiredHours * 60
  const remainingMinutes = Math.max(0, requiredMinutes - approvedMinutes)
  const completionPercentage =
    requiredMinutes > 0 ? Math.min(100, Math.round((approvedMinutes / requiredMinutes) * 100)) : 0

  const attendanceRecords: AttendanceRecord[] =
    mapAttendanceRecordsFromDb(attendanceRows ?? []) ?? []
  const { status: todayStatus } = getTodayAttendanceStatus(
    attendanceRecords,
    user.id,
    localToday,
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Attendance & Hours</h1>
        <p className="mt-1 text-[var(--color-text-muted)]">
          Your approved school hours are official. Pending hours are waiting for administrator review.
        </p>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border border-[var(--color-brand-gold)]/30 bg-[var(--color-brand-gold)]/10 p-5">
          <div className="text-sm text-silver">Approved Hours</div>
          <div className="mt-2 text-2xl font-bold text-[var(--color-brand-gold)]">
            {formatMinutes(approvedMinutes)}
          </div>
          <div className="mt-1 text-xs text-silver">Counts toward your official total</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-5">
          <div className="text-sm text-silver">Pending Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(pendingMinutes)}</div>
          <div className="mt-1 text-xs text-silver">Waiting for administrator approval</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-5">
          <div className="text-sm text-silver">Remaining Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{formatMinutes(remainingMinutes)}</div>
          <div className="mt-1 text-xs text-silver">Based on approved hours only</div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-5">
          <div className="text-sm text-silver">Required Hours</div>
          <div className="mt-2 text-2xl font-bold text-white">{requirements.requiredHours}h</div>
          <div className="mt-1 text-xs text-silver">
            {requirements.programName ?? 'Configured school requirement'}
          </div>
        </div>

        <div className="rounded-xl border border-graphite bg-charcoal p-5">
          <div className="text-sm text-silver">Today&apos;s Attendance</div>
          <div
            className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${attendanceStatusClass(todayStatus)}`}
          >
            {attendanceLabel(todayStatus)}
          </div>
          <div className="mt-2 text-xs text-silver">{localToday}</div>
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

        <div className="mt-4 h-3 overflow-hidden rounded-full bg-black">
          <div
            className="h-full rounded-full bg-[var(--color-brand-gold)]"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <div className="mt-3 text-sm text-silver">
          {formatMinutes(approvedMinutes)} approved of {requirements.requiredHours}h required
        </div>
      </section>

      <section className="rounded-xl border border-graphite bg-charcoal p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Attendance History</h2>
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
      </section>

      <section className="rounded-xl border border-graphite bg-charcoal p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-white">Hour History</h2>
          <p className="mt-1 text-sm text-silver">
            Your most recent hour entries. Approved entries count toward your official total; pending and rejected entries do not.
          </p>
        </div>

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
                    <span className="text-lg font-semibold text-white">{formatMinutes(entry.minutes)}</span>
                    <span className="inline-flex rounded-full border border-silver/30 bg-white/5 px-2.5 py-1 text-xs font-medium text-light-gray">
                      {hourSourceLabel(entry.source_type)}
                    </span>
                    {entry.resubmission_of_hour_log_id && (
                      <span className="inline-flex rounded-full border border-warm-bronze/40 bg-warm-bronze/10 px-2.5 py-1 text-xs font-semibold text-warm-bronze">
                        Corrected resubmission
                      </span>
                    )}
                  </div>
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
                    <th className="px-3 py-3 font-medium">Correction</th>
                  </tr>
                </thead>
                <tbody>
                  {hours.slice(0, 30).map((entry) => (
                    <tr key={entry.id} className="border-b border-graphite/70 last:border-0">
                      <td className="px-3 py-3 font-medium text-white">{entry.date}</td>
                      <td className="px-3 py-3 text-light-gray">{entry.category}</td>
                      <td className="px-3 py-3 font-medium text-white">{formatMinutes(entry.minutes)}</td>
                      <td className="px-3 py-3">
                        <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${hourStatusClass(entry.status)}`}>
                          {hourStatusLabel(entry.status)}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-light-gray">{hourSourceLabel(entry.source_type)}</td>
                      <td className="px-3 py-3 text-light-gray">
                        {entry.resubmission_of_hour_log_id ? 'Corrected resubmission' : '—'}
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
      </section>
    </div>
  )
}
