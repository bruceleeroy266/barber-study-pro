'use client'

import { AttendanceStatus } from '@/types'
import { getStatusColorClass } from '@/lib/attendance'

interface StatusSelectorProps {
  value: AttendanceStatus
  onChange: (status: AttendanceStatus) => void
  disabled?: boolean
  size?: 'sm' | 'md'
}

const STATUS_OPTIONS: AttendanceStatus[] = ['Present', 'Absent', 'Tardy', 'Excused']

export default function StatusSelector({
  value,
  onChange,
  disabled = false,
  size = 'md',
}: StatusSelectorProps) {
  return (
    <div className="flex flex-wrap gap-1">
      {STATUS_OPTIONS.map((status) => {
        const isActive = status === value
        const colorClass = getStatusColorClass(status)
        return (
          <button
            key={status}
            type="button"
            disabled={disabled}
            onClick={() => onChange(status)}
            className={`
              rounded-md border font-medium transition-all
              ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}
              ${isActive ? `${colorClass} ring-1 ring-offset-1 ring-offset-gray-900 ring-[#D4AF37]` : 'text-gray-400 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            title={status}
          >
            {status}
          </button>
        )
      })}
    </div>
  )
}
