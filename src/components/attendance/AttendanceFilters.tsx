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
    <div className="bg-charcoal border border-graphite rounded-xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <Search className="w-4 h-4 text-[var(--color-brand-gold)]" />
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={onClearFilters}
            className="text-xs text-silver hover:text-white flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="attendance-search" className="text-xs text-silver uppercase tracking-wide">
          Search
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-gray" aria-hidden="true" />
          <input
            id="attendance-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Name, email, note..."
            className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-silver uppercase tracking-wide flex items-center gap-2">
          <Calendar className="w-3 h-3" />
          Date Range
        </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="w-full bg-black border border-[var(--color-border-secondary)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-silver uppercase tracking-wide">Status</label>
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
                    ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border-[var(--color-brand-gold)]/40'
                    : 'text-silver bg-graphite border-[var(--color-border-secondary)] hover:bg-[var(--color-border-secondary)] hover:text-white'
                }`}
              >
                {status}
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs text-silver uppercase tracking-wide">Students</label>
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
                    ? 'bg-[var(--color-brand-gold)]/10 text-[var(--color-brand-gold)] border border-[var(--color-brand-gold)]/20'
                    : 'text-light-gray hover:bg-graphite border border-transparent'
                }`}
              >
                <span className="truncate">{student.full_name}</span>
                {active && <span className="text-[var(--color-brand-gold)] text-xs">✓</span>}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
