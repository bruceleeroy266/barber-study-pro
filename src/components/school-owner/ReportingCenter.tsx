'use client'

import { useState } from 'react'
import { SchoolReport, SchoolReportType } from '@/types'
import { FileText, Download, CalendarCheck, Target, Calculator, Clock, ClipboardCheck, School } from 'lucide-react'

interface Props {
  reports: Record<SchoolReportType, SchoolReport>
}

const reportMeta: { type: SchoolReportType; label: string; icon: React.ElementType }[] = [
  { type: 'attendance', label: 'Attendance Report', icon: CalendarCheck },
  { type: 'readiness', label: 'Readiness Report', icon: Target },
  { type: 'grade', label: 'Grade Report', icon: Calculator },
  { type: 'hours', label: 'Hours Report', icon: Clock },
  { type: 'assessment', label: 'Assessment Report', icon: ClipboardCheck },
  { type: 'school_summary', label: 'School Summary', icon: School },
]

function exportCsv(report: SchoolReport) {
  if (report.rows.length === 0) return
  const headers = Object.keys(report.rows[0])
  const csv = [
    headers.join(','),
    ...report.rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h]
          const str = String(val ?? '')
          return str.includes(',') ? `"${str}"` : str
        })
        .join(',')
    ),
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${report.type}-report.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportingCenter({ reports }: Props) {
  const [active, setActive] = useState<SchoolReportType>('school_summary')
  const report = reports[active]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#D4AF37]" />
          Reporting Center
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 border-b border-gray-800">
        {reportMeta.map((meta) => {
          const Icon = meta.icon
          return (
            <button
              key={meta.type}
              onClick={() => setActive(meta.type)}
              className={`p-3 text-sm font-medium flex flex-col items-center gap-1 transition-colors ${
                active === meta.type
                  ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-b-2 border-[#D4AF37]'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {meta.label}
            </button>
          )
        })}
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{report.title}</h3>
            <p className="text-sm text-gray-400">{report.summary}</p>
            <p className="text-xs text-gray-500 mt-1">Generated: {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => exportCsv(report)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[#D4AF37] text-gray-950 text-sm font-semibold rounded-lg hover:bg-[#F4E4A6] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-950 text-left">
              <tr>
                {report.rows.length > 0 &&
                  Object.keys(report.rows[0]).map((key) => (
                    <th key={key} className="px-4 py-2 text-xs font-medium text-gray-400">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {report.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-800/30">
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} className="px-4 py-2 text-gray-300">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {report.rows.length === 0 && (
            <p className="p-4 text-center text-gray-500">No rows for this report.</p>
          )}
        </div>
      </div>
    </div>
  )
}
