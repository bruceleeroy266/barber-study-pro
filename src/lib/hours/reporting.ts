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
}

export interface HoursPeriodTotals {
  weekMinutes: number
  monthMinutes: number
  yearMinutes: number
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
      .reduce((sum, log) => sum + log.minutes, 0)

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
