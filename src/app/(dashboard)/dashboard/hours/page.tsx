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
    .select('id, user_id, date, minutes, status')
    .eq('user_id', user.id)

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
    minutes: number
    status: 'pending' | 'approved' | 'rejected'
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
    </div>
  )
}
