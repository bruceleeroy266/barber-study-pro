'use client'

import { AttendanceStatus } from '@/types'

interface BulkActionsProps {
  selectedCount: number
  onMarkStatus: (status: AttendanceStatus) => void
  onClear: () => void
  disabled?: boolean
}

const BULK_OPTIONS: { status: AttendanceStatus; label: string; color: string }[] = [
  { status: 'Present', label: 'Mark Present', color: 'bg-green-600 hover:bg-green-500' },
  { status: 'Absent', label: 'Mark Absent', color: 'bg-red-600 hover:bg-red-500' },
  { status: 'Excused', label: 'Mark Excused', color: 'bg-blue-600 hover:bg-blue-500' },
]

export default function BulkActions({ selectedCount, onMarkStatus, onClear, disabled = false }: BulkActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-950/50 border border-gray-800 rounded-lg">
      <div className="text-sm text-gray-300">
        <span className="font-semibold text-white">{selectedCount}</span> selected
      </div>
      <div className="flex flex-wrap gap-2">
        {BULK_OPTIONS.map(({ status, label, color }) => (
          <button
            key={status}
            type="button"
            disabled={disabled || selectedCount === 0}
            onClick={() => onMarkStatus(status)}
            className={`px-3 py-1.5 text-xs font-medium text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${color}`}
          >
            {label}
          </button>
        ))}
      </div>
      {selectedCount > 0 && (
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-md transition-colors disabled:opacity-50"
        >
          Clear
        </button>
      )}
    </div>
  )
}
