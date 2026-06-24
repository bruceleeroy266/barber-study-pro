'use client'

import { AttendanceStatus, Profile } from '@/types'
import { X, Search, Calendar } from 'lucide-react'
import { VALID_STATUSES } from '@/hooks/useAttendanceFilters'

interface AttendanceFiltersProps {
  students: Profile[]
  dateFrom: string
  dateTo: string
  searchQuery: string
  selectedStatuses: AttendanceStatus[]
  selectedStudentIds: string[]
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onSearchChange: (value: string) => void
  onToggleStatus: (status: AttendanceStatus) => void
  onToggleStudent: (studentId: string) => void
  onClearFilters: () => void
  activeFilterCount: number
}

export default function AttendanceFilters({
  students,
  dateFrom,
  dateTo,
  searchQuery,
  selectedStatuses,
  selectedStudentIds,
  onDateFromChange,
  onDateToChange,
  onSearchChange,
  onToggleStatus,
  onToggleStudent,
  onClearFilters,
  activeFilterCount,
}: AttendanceFiltersProps) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Search className="w-4 h-4 text-[#D4AF37]" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Search</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Name, email, note..."
            className="w-full bg-gray-950 border border-gray-700 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          Date Range
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Status</label>
        <div className="flex flex-wrap gap-2">
          {VALID_STATUSES.map((status) => {
            const active = selectedStatuses.includes(status)
            return (
              <button
                key={status}
                type="button"
                onClick={() => onToggleStatus(status)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
                  active
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border-[#D4AF37]/40'
                    : 'text-gray-400 bg-gray-800 border-gray-700 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wide">Students</label>
        <div className="max-h-48 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          {students.map((student) => {
            const active = selectedStudentIds.includes(student.id)
            return (
              <button
                key={student.id}
                type="button"
                onClick={() => onToggleStudent(student.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                  active
                    ? 'bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20'
                    : 'text-gray-300 hover:bg-gray-800 border border-transparent'
                }`}
              >
                <span className="truncate">{student.full_name}</span>
                {active && <span className="text-[#D4AF37] text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
