/**
 * ATTENDANCE UTILITIES
 * ASCYN PRO / Barber Study Pro V2
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
      return 'text-green-400 bg-green-500/10 border-green-500/20'
    case 'Absent':
      return 'text-red-400 bg-red-500/10 border-red-500/20'
    case 'Tardy':
      return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
    case 'Excused':
      return 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    case 'Clocked In':
      return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    case 'Clocked Out':
      return 'text-gray-400 bg-gray-500/10 border-gray-500/20'
    default:
      return 'text-gray-400 bg-gray-800 border-gray-700'
  }
}

export function isActiveClockIn(record: AttendanceRecord | null): boolean {
  return record?.status === 'Clocked In' || record?.status === 'Present' || record?.status === 'Tardy'
}
