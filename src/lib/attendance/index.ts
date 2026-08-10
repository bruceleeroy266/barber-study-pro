/**
 * ATTENDANCE UTILITIES
 * ASCYN PRO / ASCYN PRO V2
 *
 * Reusable attendance helpers for dashboards, instructor views, and reporting.
 */

export * from './attendance-summary'
export * from './attendance-risk'
export * from './attendance-service'
export * from './attendance-correction'
export * from './attendance-audit'
export * from './export-csv'
export * from './export-pdf'

import { AttendanceRecord, AttendanceStatus } from '@/types'

export function getTodayAttendanceStatus(
  records: AttendanceRecord[],
  userId: string,
  today = new Date().toISOString().split('T')[0]
): { status: AttendanceStatus | null; record: AttendanceRecord | null } {
  const record = records.find((r) => r.userId === userId && r.date === today) || null
  return { status: record?.status || null, record }
}

export function formatAttendancePercentage(value: number): string {
  return `${value}%`
}

export function getStatusColorClass(status: AttendanceStatus | null): string {
  switch (status) {
    case 'Present':
      return 'text-gold bg-gold/10 border-gold/20'
    case 'Absent':
      return 'text-silver bg-silver/10 border-silver/20'
    case 'Tardy':
      return 'text-warm-bronze bg-warm-bronze/10 border-warm-bronze/20'
    case 'Excused':
      return 'text-silver bg-silver/10 border-silver/20'
    case 'Clocked In':
      return 'text-gold bg-gold/10 border-gold/20'
    case 'Clocked Out':
      return 'text-silver bg-silver-gray/10 border-silver-gray/20'
    default:
      return 'text-silver bg-graphite border-[var(--color-border-secondary)]'
  }
}

export function isActiveClockIn(record: AttendanceRecord | null): boolean {
  return record?.status === 'Clocked In' || record?.status === 'Present' || record?.status === 'Tardy'
}
