'use client'

import { useState, useMemo } from 'react'
import { StudentPerformanceRow } from '@/types'
import { ArrowUpDown, Search, AlertTriangle, Trophy } from 'lucide-react'

type SortKey = 'fullName' | 'attendancePercentage' | 'readinessScore' | 'overallGrade' | 'completedHours' | 'assessmentPassRate'
type FilterKey = 'all' | 'atRisk' | 'lowAttendance' | 'lowReadiness' | 'missingHours' | 'failedAssessment'

interface Props {
  rows: StudentPerformanceRow[]
}

function SortHeader({ label, sortKey, onSort }: {
  label: string
  sortKey: SortKey
  onSort: (key: SortKey) => void
}) {
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs font-medium text-silver hover:text-white"
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  )
}

export default function StudentPerformancePanel({ rows }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('overallGrade')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [filter, setFilter] = useState<FilterKey>('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let data = [...rows]
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter((r) => r.fullName.toLowerCase().includes(q))
    }
    switch (filter) {
      case 'atRisk':
        data = data.filter((r) => r.isAtRisk)
        break
      case 'lowAttendance':
        data = data.filter((r) => r.attendancePercentage < 80)
        break
      case 'lowReadiness':
        data = data.filter((r) => r.readinessScore < 70)
        break
      case 'missingHours':
        data = data.filter((r) => r.completedHours < r.requiredHours * 0.5)
        break
      case 'failedAssessment':
        data = data.filter((r) => r.assessmentPassRate < 80)
        break
    }
    data.sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal as string) : (bVal as string).localeCompare(aVal)
      }
      return sortDir === 'asc' ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number)
    })
    return data
  }, [rows, sortKey, sortDir, filter, search])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  return (
    <div className="bg-charcoal border border-graphite rounded-xl overflow-hidden">
      <div className="p-4 border-b border-graphite flex flex-col md:flex-row md:items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Student Performance</h2>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-silver-gray" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-black border border-graphite rounded-lg text-sm text-white placeholder-silver-gray focus:outline-none focus:border-[var(--color-brand-gold)]/50"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterKey)}
            className="px-3 py-1.5 bg-black border border-graphite rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-brand-gold)]/50"
          >
            <option value="all">All Students</option>
            <option value="atRisk">At Risk</option>
            <option value="lowAttendance">Low Attendance</option>
            <option value="lowReadiness">Low Readiness</option>
            <option value="missingHours">Missing Hours</option>
            <option value="failedAssessment">Failed Assessments</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-left">
            <tr>
              <th className="px-4 py-3"><SortHeader label="Student" sortKey="fullName" onSort={handleSort} /></th>
              <th className="px-4 py-3"><SortHeader label="Attendance" sortKey="attendancePercentage" onSort={handleSort} /></th>
              <th className="px-4 py-3"><SortHeader label="Readiness" sortKey="readinessScore" onSort={handleSort} /></th>
              <th className="px-4 py-3"><SortHeader label="Grade" sortKey="overallGrade" onSort={handleSort} /></th>
              <th className="px-4 py-3"><SortHeader label="Hours" sortKey="completedHours" onSort={handleSort} /></th>
              <th className="px-4 py-3"><SortHeader label="Assessments" sortKey="assessmentPassRate" onSort={handleSort} /></th>
              <th className="px-4 py-3">Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-graphite">
            {filtered.map((row) => (
              <tr key={row.studentId} className="hover:bg-graphite/30">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{row.fullName}</div>
                  {row.riskReasons.length > 0 && (
                    <div className="text-xs text-silver-gray mt-0.5">{row.riskReasons.join(', ')}</div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.attendancePercentage >= 80 ? 'text-gold' : row.attendancePercentage >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.attendancePercentage}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.readinessScore >= 80 ? 'text-gold' : row.readinessScore >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.readinessScore}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.overallGrade >= 80 ? 'text-gold' : row.overallGrade >= 70 ? 'text-warm-bronze' : 'text-silver'}`}>
                    {row.overallGrade}%
                  </span>
                </td>
                <td className="px-4 py-3 text-light-gray">
                  {row.completedHours}/{row.requiredHours}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-medium ${row.assessmentPassRate >= 80 ? 'text-gold' : 'text-silver'}`}>
                    {row.assessmentPassRate}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  {row.isAtRisk ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-silver/10 text-silver border border-silver/20">
                      <AlertTriangle className="w-3 h-3" /> At Risk
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gold/10 text-gold border border-gold/20">
                      <Trophy className="w-3 h-3" /> On Track
                    </span>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-silver-gray">
                  No students match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
