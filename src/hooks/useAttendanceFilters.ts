/**
 * useAttendanceFilters
 * ASCYN PRO / Barber Study Pro V2
 *
 * Manages attendance filter state for the instructor attendance page.
 */

'use client'

import { useState, useCallback, useMemo } from 'react'
import { AttendanceFilterState, AttendanceStatus } from '@/types'

const VALID_STATUSES: AttendanceStatus[] = ['Present', 'Absent', 'Tardy', 'Excused']

export interface UseAttendanceFiltersReturn {
  filters: AttendanceFilterState
  dateFrom: string
  dateTo: string
  searchQuery: string
  selectedStatuses: AttendanceStatus[]
  selectedStudentIds: string[]
  setDateFrom: (value: string) => void
  setDateTo: (value: string) => void
  setSearchQuery: (value: string) => void
  toggleStatus: (status: AttendanceStatus) => void
  toggleStudentId: (studentId: string) => void
  clearFilters: () => void
  hasActiveFilters: boolean
  activeFilterCount: number
}

export function useAttendanceFilters(initial?: Partial<AttendanceFilterState>): UseAttendanceFiltersReturn {
  const [dateFrom, setDateFrom] = useState(initial?.dateFrom || '')
  const [dateTo, setDateTo] = useState(initial?.dateTo || '')
  const [searchQuery, setSearchQuery] = useState(initial?.searchQuery || '')
  const [selectedStatuses, setSelectedStatuses] = useState<AttendanceStatus[]>(initial?.statuses || [])
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>(initial?.studentIds || [])

  const toggleStatus = useCallback((status: AttendanceStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }, [])

  const toggleStudentId = useCallback((studentId: string) => {
    setSelectedStudentIds((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setDateFrom('')
    setDateTo('')
    setSearchQuery('')
    setSelectedStatuses([])
    setSelectedStudentIds([])
  }, [])

  const filters = useMemo<AttendanceFilterState>(
    () => ({
      dateFrom: dateFrom || null,
      dateTo: dateTo || null,
      studentIds: selectedStudentIds.length > 0 ? selectedStudentIds : undefined,
      statuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
      searchQuery: searchQuery || null,
    }),
    [dateFrom, dateTo, selectedStudentIds, selectedStatuses, searchQuery]
  )

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (dateFrom) count++
    if (dateTo) count++
    if (searchQuery) count++
    if (selectedStatuses.length > 0) count++
    if (selectedStudentIds.length > 0) count++
    return count
  }, [dateFrom, dateTo, searchQuery, selectedStatuses.length, selectedStudentIds.length])

  const hasActiveFilters = activeFilterCount > 0

  return {
    filters,
    dateFrom,
    dateTo,
    searchQuery,
    selectedStatuses,
    selectedStudentIds,
    setDateFrom,
    setDateTo,
    setSearchQuery,
    toggleStatus,
    toggleStudentId,
    clearFilters,
    hasActiveFilters,
    activeFilterCount,
  }
}

export { VALID_STATUSES }
