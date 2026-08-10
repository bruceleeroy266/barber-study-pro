'use client'

import { useState } from 'react'
import { ComplianceReport, ComplianceReportType } from '@/types'
import { FileText, Download, UserCheck, GraduationCap, Award, Users, School } from 'lucide-react'

interface Props {
  reports: Record<ComplianceReportType, ComplianceReport>
}

const reportMeta: { type: ComplianceReportType; label: string; icon: React.ElementType }[] = [
  { type: 'student_compliance', label: 'Student Compliance', icon: UserCheck },
  { type: 'graduation_readiness', label: 'Graduation Readiness', icon: GraduationCap },
  { type: 'board_eligibility', label: 'Board Eligibility', icon: Award },
  { type: 'instructor_compliance', label: 'Instructor Compliance', icon: Users },
  { type: 'school_compliance', label: 'School Compliance', icon: School },
]

function exportCsv(report: ComplianceReport) {
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

export default function ComplianceReportingCenter({ reports }: Props) {
  const [active, setActive] = useState<ComplianceReportType>('school_compliance')
  const report = reports[active]

  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-4 border-b border-graphite">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-[var(--color-brand-gold)]" />
          Audit Preparation Center
        </h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border-b border-graphite">
        {reportMeta.map((meta) => {
          const Icon = meta.icon
          return (
            <button
              key={meta.type}
              onClick={() => setActive(meta.type)}
              className={`p-3 text-sm font-medium flex flex-col items-center gap-1 transition-colors ${
                active === meta.type
                  ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-b-2 border-[var(--color-brand-gold)]'
                  : 'text-silver hover:bg-graphite hover:text-white'
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
            <p className="text-sm text-silver">{report.summary}</p>
            <p className="text-xs text-silver-gray mt-1">Generated: {new Date(report.generatedAt).toLocaleString()}</p>
          </div>
          <button
            onClick={() => exportCsv(report)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-brand-gold)] text-black text-sm font-semibold rounded-lg hover:bg-[var(--color-brand-gold-light)] transition-colors"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-black text-left">
              <tr>
                {report.rows.length > 0 &&
                  Object.keys(report.rows[0]).map((key) => (
                    <th key={key} className="px-4 py-2 text-xs font-medium text-silver">
                      {key}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-graphite">
              {report.rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-graphite/30">
                  {Object.entries(row).map(([key, value]) => (
                    <td key={key} className="px-4 py-2 text-light-gray">
                      {String(value)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {report.rows.length === 0 && <p className="p-4 text-center text-silver-gray">No rows for this report.</p>}
        </div>
      </div>
    </div>
  )
}
