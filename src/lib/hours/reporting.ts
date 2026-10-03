import type { HourCategory, HourStatus } from '@/types'

export interface HoursReportStudent {
  id: string
  full_name: string
  email: string
  requiredHours: number
}

export interface HoursReportLog {
  id: string
  user_id: string
  date: string
  category: HourCategory
  minutes: number
  status: HourStatus
  notes: string | null
  rejection_reason?: string | null
  submitted_by: string | null
  reviewed_by: string | null
  reviewed_at: string | null
  created_at: string | null
  submitted_by_name?: string | null
  reviewed_by_name?: string | null
  effective_minutes?: number | null
  integrity_status?: 'not_approved' | 'valid_unadjusted' | 'valid_adjusted' | 'invalid'
}

export interface HoursPeriodTotals {
  weekMinutes: number
  monthMinutes: number
  yearMinutes: number
}

/**
 * Canonical official-minutes read contract for downstream surfaces.
 * Production callers should supply rows from effective_hour_logs. Legacy/demo
 * rows that predate H&A have no effective fields and safely retain their
 * original approved value.
 */
export function getOfficialMinutes(
  log: Pick<HoursReportLog, 'id' | 'status' | 'minutes' | 'effective_minutes' | 'integrity_status'>,
): number {
  if (log.status !== 'approved') return 0

  if (log.integrity_status === 'invalid' || log.effective_minutes === null) {
    throw new Error(`Official hour value unavailable for ${log.id}: invalid adjustment chain`)
  }

  return log.effective_minutes ?? log.minutes
}

export function calculateOfficialApprovedMinutes(logs: HoursReportLog[]): number {
  return logs.reduce((sum, log) => sum + getOfficialMinutes(log), 0)
}

export interface HoursProgressSummary {
  approvedMinutes: number
  pendingMinutes: number
  requiredHours: number
  requiredMinutes: number
  remainingMinutes: number
  completionPercentage: number
}

/**
 * ADM-1E canonical student-hours parity contract.
 *
 * Approved hours always come from the official effective-hour chain.
 * Pending hours are informational only and never reduce remaining hours or
 * increase completion percentage.
 */
export function calculateHoursProgressSummary(
  logs: HoursReportLog[],
  requiredHours: number,
): HoursProgressSummary {
  const safeRequiredHours =
    Number.isFinite(requiredHours) && requiredHours > 0 ? requiredHours : 0
  const requiredMinutes = safeRequiredHours * 60
  const approvedMinutes = calculateOfficialApprovedMinutes(logs)
  const pendingMinutes = logs
    .filter((log) => log.status === 'pending')
    .reduce((sum, log) => sum + log.minutes, 0)
  const remainingMinutes = Math.max(0, requiredMinutes - approvedMinutes)
  const completionPercentage = requiredMinutes > 0
    ? Math.min(100, Math.max(0, Math.round((approvedMinutes / requiredMinutes) * 100)))
    : 0

  return {
    approvedMinutes,
    pendingMinutes,
    requiredHours: safeRequiredHours,
    requiredMinutes,
    remainingMinutes,
    completionPercentage,
  }
}

function toDateKey(date: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

export function getCurrentReportingWindows(now: Date, timeZone: string) {
  const todayKey = toDateKey(now, timeZone)
  const [year, month, day] = todayKey.split('-').map(Number)
  const localMiddayUtc = new Date(Date.UTC(year, month - 1, day, 12))
  const weekday = localMiddayUtc.getUTCDay()
  const daysSinceMonday = (weekday + 6) % 7
  const weekStart = new Date(localMiddayUtc)
  weekStart.setUTCDate(weekStart.getUTCDate() - daysSinceMonday)

  return {
    today: todayKey,
    weekStart: toDateKey(weekStart, timeZone),
    monthStart: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`,
    yearStart: `${String(year).padStart(4, '0')}-01-01`,
  }
}

export function calculateApprovedPeriodTotals(
  logs: HoursReportLog[],
  now: Date,
  timeZone: string,
): HoursPeriodTotals {
  const windows = getCurrentReportingWindows(now, timeZone)
  const approved = logs.filter((log) => log.status === 'approved')

  const sumFrom = (start: string) =>
    approved
      .filter((log) => log.date >= start && log.date <= windows.today)
      .reduce((sum, log) => sum + getOfficialMinutes(log), 0)

  return {
    weekMinutes: sumFrom(windows.weekStart),
    monthMinutes: sumFrom(windows.monthStart),
    yearMinutes: sumFrom(windows.yearStart),
  }
}

export function formatHourMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins === 0 ? `${hours}h` : `${hours}h ${mins}m`
}
