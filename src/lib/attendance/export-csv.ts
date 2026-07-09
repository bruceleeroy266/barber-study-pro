/**
 * ATTENDANCE CSV EXPORT
 * ASCYN PRO / ASCYN PRO V2
 *
 * Exports filtered attendance records to CSV with BOM for Excel.
 */

import { AttendanceRecord, Profile } from '@/types'

function escapeCsvCell(value: string): string {
  const escaped = value.replace(/"/g, '""')
  if (escaped.includes(',') || escaped.includes('"') || escaped.includes('\n')) {
    return `"${escaped}"`
  }
  return escaped
}

function formatTime(iso: string | null | undefined): string {
  if (!iso) return ''
  try {
    const date = new Date(iso)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch {
    return iso
  }
}

function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return ''
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function exportAttendanceToCsv(
  records: AttendanceRecord[],
  students: Profile[],
  filename = 'attendance-report.csv'
): void {
  const headers = ['Date', 'Student Name', 'Email', 'Status', 'Clock In', 'Clock Out', 'Duration', 'Note', 'Verified By']
  const rows = records.map((record) => {
    const student = students.find((s) => s.id === record.userId)
    return [
      record.date,
      student?.full_name || 'Unknown',
      student?.email || '',
      record.status,
      formatTime(record.clockedInAt),
      formatTime(record.clockedOutAt),
      formatDuration(record.minutesPresent),
      record.note || '',
      record.verifiedBy || '',
    ]
  })

  const csvContent = [headers, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\r\n')

  // BOM for Excel UTF-8 support
  const bom = '\uFEFF'
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
