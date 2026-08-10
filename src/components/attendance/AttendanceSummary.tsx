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
    { label: 'Total Records', value: total, color: 'text-white', border: 'border-[var(--color-border-secondary)]' },
    { label: 'Present', value: present, color: 'text-gold', border: 'border-gold/30' },
    { label: 'Absent', value: absent, color: 'text-silver', border: 'border-silver/30' },
    { label: 'Tardy', value: tardy, color: 'text-warm-bronze', border: 'border-warm-bronze/30' },
    { label: 'Excused', value: excused, color: 'text-silver', border: 'border-silver/30' },
    { label: 'Attendance %', value: `${percentage}%`, color: percentage >= 80 ? 'text-gold' : percentage >= 60 ? 'text-warm-bronze' : 'text-silver', border: 'border-[var(--color-brand-gold)]/30' },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className={`bg-charcoal border ${card.border} rounded-xl p-5 text-center`}
        >
          <div className={`text-2xl font-bold ${card.color}`}>{card.value}</div>
          <div className="text-xs text-silver mt-1">{card.label}</div>
        </div>
      ))}
    </div>
  )
}
