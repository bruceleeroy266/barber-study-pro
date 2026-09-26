'use client'

import { useState } from 'react'
import { FileDown } from 'lucide-react'
import { exportHoursStateBoardPdf } from '@/lib/hours/export-pdf'
import type { HoursReportLog, HoursReportStudent } from '@/lib/hours/reporting'

interface Props {
  schoolName: string
  timeZone: string
  students: HoursReportStudent[]
  logs: HoursReportLog[]
}

export default function HoursPdfExports({ schoolName, timeZone, students, logs }: Props) {
  const [studentId, setStudentId] = useState(students[0]?.id ?? '')

  return (
    <div className="rounded-xl border border-graphite bg-charcoal p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-white">State Board PDF Exports</h2>
      <p className="mt-1 text-sm text-silver">
        Export approved student hours for school records, audits, or state-board documentation.
      </p>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
        <select
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          className="w-full rounded-lg border border-graphite bg-black px-3 py-3 text-white [color-scheme:dark]"
        >
          {students.map((student) => (
            <option key={student.id} value={student.id} className="bg-black text-white">
              {student.full_name}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!studentId}
          onClick={() => exportHoursStateBoardPdf({ schoolName, timeZone, students, logs, studentId })}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-brand-gold)] px-4 py-3 font-semibold text-[var(--color-brand-gold)] disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" />
          Individual PDF
        </button>

        <button
          type="button"
          disabled={students.length === 0}
          onClick={() => exportHoursStateBoardPdf({ schoolName, timeZone, students, logs })}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--color-brand-gold)] px-4 py-3 font-semibold text-black disabled:opacity-50"
        >
          <FileDown className="h-4 w-4" />
          Group PDF
        </button>
      </div>
    </div>
  )
}
