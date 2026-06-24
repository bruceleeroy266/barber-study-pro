'use client'

import { AttendanceRecord } from '@/types'

interface AttendanceSummaryProps {
  records: AttendanceRecord[]
}

export default function AttendanceSummary({ records }: AttendanceSummaryProps) {
  const total = records.length
  const present = records.filter((r) => r.status === 'Present').length
  const absent = records.filter((r) => r.status === 'Absent').length
  const tardy = records.filter((r) => r.status === 'Tardy').length
  const excused = records.filter((r) => r.status === 'Excused').length

  const countable = total - excused
  const percentage = countable > 0 ? Math.round((present / countable) * 100) : 0

  const cards = [
    { label: 'Total Records', value: total, color: 'text-white', border: 'border-gray-700' },
    { label: 'Present', value: present, color: 'text-green-400', border: 'border-green-900/30' },
    { label: 'Absent', value: absent, color: 'text-red-400', border: 'border-red-900/30' },
    { label: 'Tardy', value: tardy, color: 'text-yellow-400', border: 'border-yellow-900/30' },
    { label: 'Excused', value: excused, color: 'text-blue-400', border: 'border-blue-900/30' },
    { label: 'Attendance %', value: `${percentage}%`, color: percentage >= 80 ? 'text-green-400' : percentage >= 60 ? 'text-yellow-400' : 'text-red-400', border: 'border-[#D4AF37]/30' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-gray-900 border ${card.border} rounded-xl p-5 text-center`}
        >
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-gray-400 mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
