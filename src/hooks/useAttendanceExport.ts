/**
 * useAttendanceExport
 * ASCYN PRO / Barber Study Pro V2
 *
 * Handles CSV and PDF export for attendance records.
 */

'use client'

import { useCallback, useState } from 'react'
import { AttendanceRecord, Profile } from '@/types'
import { exportAttendanceToCsv } from '@/lib/attendance/export-csv'
import { exportAttendanceToPdf } from '@/lib/attendance/export-pdf'

export type ExportFormat = 'csv' | 'pdf'

export interface UseAttendanceExportOptions {
  records: AttendanceRecord[]
  students: Profile[]
  schoolName?: string
}

export interface UseAttendanceExportReturn {
  exporting: boolean
  exportData: (format: ExportFormat, dateRange?: { from?: string; to?: string }) => void
}

export function useAttendanceExport({
  records,
  students,
  schoolName = 'ASCYN PRO',
}: UseAttendanceExportOptions): UseAttendanceExportReturn {
  const [exporting, setExporting] = useState(false)

  const exportData = useCallback(
    (format: ExportFormat, dateRange?: { from?: string; to?: string }) => {
      setExporting(true)
      try {
        const dateRangeLabel =
          dateRange?.from && dateRange?.to
            ? `${dateRange.from} to ${dateRange.to}`
            : dateRange?.from
            ? `From ${dateRange.from}`
            : dateRange?.to
            ? `Through ${dateRange.to}`
            : 'All dates'

        const filenameBase = `attendance-report-${new Date().toISOString().split('T')[0]}`

        if (format === 'csv') {
          exportAttendanceToCsv(records, students, `${filenameBase}.csv`)
        } else {
          exportAttendanceToPdf(records, students, {
            title: 'Attendance Report',
            schoolName,
            dateRange: dateRangeLabel,
            filename: `${filenameBase}.pdf`,
          })
        }
      } finally {
        // Allow UI to render exporting state briefly
        setTimeout(() => setExporting(false), 300)
      }
    },
    [records, students, schoolName]
  )

  return { exporting, exportData }
}
