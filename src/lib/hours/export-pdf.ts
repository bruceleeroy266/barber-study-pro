'use client'

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { HoursReportLog, HoursReportStudent } from './reporting'
import { calculateApprovedPeriodTotals, formatHourMinutes } from './reporting'

export interface HoursPdfOptions {
  schoolName: string
  timeZone: string
  students: HoursReportStudent[]
  logs: HoursReportLog[]
  studentId?: string
}

function safeFilename(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function exportHoursStateBoardPdf(options: HoursPdfOptions): void {
  const { schoolName, timeZone, studentId } = options
  const students = studentId
    ? options.students.filter((student) => student.id === studentId)
    : options.students
  const studentIds = new Set(students.map((student) => student.id))
  const logs = options.logs.filter((log) => studentIds.has(log.user_id))
  const approved = logs.filter((log) => log.status === 'approved')

  const doc = new jsPDF({ orientation: 'landscape' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const generated = new Date()

  doc.setFontSize(18)
  doc.setTextColor(31, 41, 55)
  doc.text('Student Training Hours Report', 14, 18)

  doc.setFontSize(11)
  doc.setTextColor(90, 90, 90)
  doc.text(schoolName, 14, 26)
  doc.text('ASCYN PRO — State Board Hours Record', 14, 33)

  const generatedLabel = `Generated ${generated.toLocaleDateString('en-US')}`
  doc.text(generatedLabel, pageWidth - doc.getTextWidth(generatedLabel) - 14, 26)

  const summaryBody = students.map((student) => {
    const studentLogs = logs.filter((log) => log.user_id === student.id)
    const approvedMinutes = studentLogs
      .filter((log) => log.status === 'approved')
      .reduce((sum, log) => sum + log.minutes, 0)
    const pendingMinutes = studentLogs
      .filter((log) => log.status === 'pending')
      .reduce((sum, log) => sum + log.minutes, 0)
    const remainingMinutes = Math.max(0, student.requiredHours * 60 - approvedMinutes)
    const periods = calculateApprovedPeriodTotals(studentLogs, generated, timeZone)

    return [
      student.full_name,
      student.email,
      formatHourMinutes(periods.weekMinutes),
      formatHourMinutes(periods.monthMinutes),
      formatHourMinutes(periods.yearMinutes),
      formatHourMinutes(approvedMinutes),
      `${student.requiredHours}h`,
      formatHourMinutes(remainingMinutes),
      formatHourMinutes(pendingMinutes),
    ]
  })

  autoTable(doc, {
    startY: 40,
    head: [[
      'Student',
      'Email',
      'Week',
      'Month',
      'Year',
      'Approved Total',
      'Required',
      'Remaining',
      'Pending',
    ]],
    body: summaryBody,
    theme: 'grid',
    headStyles: { fillColor: [212, 175, 55], textColor: [31, 41, 55], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [249, 250, 251] },
    styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
  })

  const detailBody = approved
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((log) => {
      const student = students.find((entry) => entry.id === log.user_id)
      return [
        log.date,
        student?.full_name ?? 'Unknown',
        log.category,
        formatHourMinutes(log.minutes),
        log.notes ?? '—',
        log.reviewed_at ? new Date(log.reviewed_at).toLocaleString('en-US') : '—',
      ]
    })

  const lastTable = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
  autoTable(doc, {
    startY: (lastTable?.finalY ?? 40) + 10,
    head: [['Date', 'Student', 'Category', 'Approved Hours', 'Notes', 'Approved At']],
    body: detailBody,
    theme: 'grid',
    headStyles: { fillColor: [31, 41, 55], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2.5, overflow: 'linebreak' },
  })

  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(
    'Only approved hours are included in official accumulated totals. Pending and rejected entries do not count toward completion.',
    14,
    doc.internal.pageSize.getHeight() - 8,
  )

  const scope = studentId && students[0] ? safeFilename(students[0].full_name) : 'school-group'
  doc.save(`student-hours-${scope}-${generated.toISOString().slice(0, 10)}.pdf`)
}
