/**
 * ATTENDANCE PDF EXPORT
 * ASCYN PRO / ASCYN PRO V2
 *
 * Exports filtered attendance records to PDF using jspdf-autotable.
 */

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import { AttendanceRecord, Profile } from '@/types'

function formatTime(iso: string | null | undefined): string {
  if (!iso) return '—'
  try {
    const date = new Date(iso)
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  } catch {
    return iso
  }
}

function formatDuration(minutes: number | null | undefined): string {
  if (minutes === null || minutes === undefined) return '—'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h}h ${m}m`
}

export function exportAttendanceToPdf(
  records: AttendanceRecord[],
  students: Profile[],
  options: {
    title?: string
    schoolName?: string
    dateRange?: string
    filename?: string
  } = {}
): void {
  const {
    title = 'Attendance Report',
    schoolName = 'ASCYN PRO',
    dateRange = '',
    filename = 'attendance-report.pdf',
  } = options

  const doc = new jsPDF({ orientation: 'landscape' })
  const pageWidth = doc.internal.pageSize.getWidth()

  // Header
  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.text(title, 14, 20)

  doc.setFontSize(11)
  doc.setTextColor(100, 100, 100)
  doc.text(schoolName, 14, 28)
  if (dateRange) {
    doc.text(dateRange, 14, 35)
  }

  const generatedAt = `Generated: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}`
  const generatedWidth = doc.getTextWidth(generatedAt)
  doc.text(generatedAt, pageWidth - generatedWidth - 14, 28)

  const totalStudents = new Set(records.map((r) => r.userId)).size
  const presentCount = records.filter((r) => r.status === 'Present').length
  const absentCount = records.filter((r) => r.status === 'Absent').length
  const tardyCount = records.filter((r) => r.status === 'Tardy').length
  const excusedCount = records.filter((r) => r.status === 'Excused').length

  doc.setFontSize(10)
  doc.setTextColor(50, 50, 50)
  doc.text(
    `Total Records: ${records.length}  |  Students: ${totalStudents}  |  Present: ${presentCount}  |  Absent: ${absentCount}  |  Tardy: ${tardyCount}  |  Excused: ${excusedCount}`,
    14,
    dateRange ? 42 : 36
  )

  const body = records.map((record) => {
    const student = students.find((s) => s.id === record.userId)
    return [
      record.date,
      student?.full_name || 'Unknown',
      student?.email || '—',
      record.status,
      formatTime(record.clockedInAt),
      formatTime(record.clockedOutAt),
      formatDuration(record.minutesPresent),
      record.note || '—',
    ]
  })

  autoTable(doc, {
    startY: dateRange ? 48 : 42,
    head: [['Date', 'Student', 'Email', 'Status', 'Clock In', 'Clock Out', 'Duration', 'Note']],
    body,
    theme: 'grid',
    headStyles: {
      fillColor: [212, 175, 55],
      textColor: [31, 41, 55],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
      overflow: 'linebreak',
    },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 40 },
      2: { cellWidth: 50 },
      3: { cellWidth: 25 },
      4: { cellWidth: 25 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 },
      7: { cellWidth: 'auto' },
    },
  })

  doc.save(filename)
}
