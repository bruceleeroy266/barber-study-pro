/**
 * Export Utilities
 * 
 * Functions for exporting data to CSV and PDF formats
 */

export interface ExportColumn {
  key: string
  label: string
  format?: (value: any) => string
}

/**
 * Convert data to CSV format
 */
export function convertToCSV(data: Record<string, unknown>[], columns: ExportColumn[]): string {
  // Header row
  const headers = columns.map((col) => col.label).join(',')
  
  // Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        const value = row[col.key]
        const formatted = col.format ? col.format(value) : value
        
        // Escape commas and quotes
        if (formatted === null || formatted === undefined) return ''
        const stringValue = String(formatted)
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      .join(',')
  })
  
  return [headers, ...rows].join('\n')
}

/**
 * Download CSV file
 */
export function downloadCSV(csv: string, filename: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * Export data to CSV
 */
export function exportToCSV(data: Record<string, unknown>[], columns: ExportColumn[], filename: string): void {
  const csv = convertToCSV(data, columns)
  downloadCSV(csv, filename)
}

/**
 * Format date for export
 */
export function formatDateForExport(date: string | Date | null): string {
  if (!date) return ''
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

/**
 * Format percentage for export
 */
export function formatPercentageForExport(value: number | null): string {
  if (value === null || value === undefined) return ''
  return `${value}%`
}

/**
 * Format minutes to hours for export
 */
export function formatMinutesForExport(minutes: number | null): string {
  if (minutes === null || minutes === undefined) return ''
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

/**
 * Student roster export columns
 */
export const studentRosterColumns: ExportColumn[] = [
  { key: 'full_name', label: 'Student Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'overallProgress', label: 'Progress %', format: formatPercentageForExport },
  { key: 'avgQuizScore', label: 'Avg Quiz Score', format: formatPercentageForExport },
  { key: 'readinessScore', label: 'Readiness Score' },
  { key: 'readinessLevel', label: 'Readiness Level' },
  { key: 'completedChapters', label: 'Chapters Completed' },
  { key: 'quizzesTaken', label: 'Quizzes Taken' },
  { key: 'daysSinceActive', label: 'Days Since Active' },
  { key: 'lastStudiedAt', label: 'Last Activity', format: formatDateForExport },
]

/**
 * Gradebook export columns
 */
export const gradebookColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'category', label: 'Category' },
  { key: 'score', label: 'Score' },
  { key: 'maxScore', label: 'Max Score' },
  { key: 'percentage', label: 'Percentage', format: formatPercentageForExport },
  { key: 'date', label: 'Date', format: formatDateForExport },
  { key: 'isExcused', label: 'Excused', format: (v) => (v ? 'Yes' : 'No') },
]

/**
 * Attendance export columns
 */
export const attendanceColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'date', label: 'Date', format: formatDateForExport },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

/**
 * Assessment export columns
 */
export const assessmentColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'assessmentType', label: 'Assessment Type' },
  { key: 'score', label: 'Score' },
  { key: 'maxScore', label: 'Max Score' },
  { key: 'percentage', label: 'Percentage', format: formatPercentageForExport },
  { key: 'isPassed', label: 'Passed', format: (v) => (v ? 'Yes' : 'No') },
  { key: 'assessmentDate', label: 'Date', format: formatDateForExport },
]

/**
 * Hour logs export columns
 */
export const hourLogsColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'date', label: 'Date', format: formatDateForExport },
  { key: 'category', label: 'Category' },
  { key: 'minutes', label: 'Hours', format: formatMinutesForExport },
  { key: 'status', label: 'Status' },
  { key: 'notes', label: 'Notes' },
]

/**
 * Compliance export columns
 */
export const complianceColumns: ExportColumn[] = [
  { key: 'studentName', label: 'Student Name' },
  { key: 'complianceScore', label: 'Compliance Score' },
  { key: 'attendancePercentage', label: 'Attendance %', format: formatPercentageForExport },
  { key: 'completedHours', label: 'Completed Hours', format: formatMinutesForExport },
  { key: 'assessmentPassRate', label: 'Assessment Pass Rate', format: formatPercentageForExport },
  { key: 'practicalPassRate', label: 'Practical Pass Rate', format: formatPercentageForExport },
  { key: 'readinessScore', label: 'Readiness Score' },
  { key: 'boardEligibility', label: 'Board Eligibility' },
]
