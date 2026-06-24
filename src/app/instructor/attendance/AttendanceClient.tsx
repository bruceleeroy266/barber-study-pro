'use client'

import { useState, useMemo } from 'react'
import { AttendanceRecord, AttendanceStatus, Profile } from '@/types'
import { useAttendance } from '@/hooks/useAttendance'
import { useAttendanceFilters } from '@/hooks/useAttendanceFilters'
import { useAttendanceExport } from '@/hooks/useAttendanceExport'
import AttendanceGrid from '@/components/attendance/AttendanceGrid'
import AttendanceFilters from '@/components/attendance/AttendanceFilters'
import AttendanceSummary from '@/components/attendance/AttendanceSummary'
import CorrectionModal from '@/components/attendance/CorrectionModal'
import AuditLog from '@/components/attendance/AuditLog'
import ExportButton from '@/components/attendance/ExportButton'
import { RefreshCw, Users } from 'lucide-react'

interface AttendanceClientProps {
  initialRecords: AttendanceRecord[]
  students: Profile[]
  currentUser: Profile
  schoolId: string | null
  schoolName: string
  defaultDate: string
}

export default function AttendanceClient({
  initialRecords,
  students,
  currentUser,
  schoolId,
  schoolName,
  defaultDate,
}: AttendanceClientProps) {
  const {
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
  } = useAttendanceFilters()

  const {
    records,
    loading,
    error,
    selectedIds,
    isAllSelected,
    toggleSelection,
    toggleAll,
    clearSelection,
    updateStatus,
    bulkUpdateStatus,
    addNote,
    submitCorrection,
    getAuditHistory,
    refresh,
    ensureTodayRecords,
  } = useAttendance({
    initialRecords,
    students,
    currentUser,
    schoolId,
    defaultDate,
  })

  const { exporting, exportData } = useAttendanceExport({ records, students, schoolName })

  const [correctionRecord, setCorrectionRecord] = useState<AttendanceRecord | null>(null)
  const [auditRecord, setAuditRecord] = useState<AttendanceRecord | null>(null)

  const filteredRecords = useMemo(() => {
    return records
      .filter((r) => {
        if (filters.dateFrom && r.date < filters.dateFrom) return false
        if (filters.dateTo && r.date > filters.dateTo) return false
        if (filters.studentIds && filters.studentIds.length > 0 && !filters.studentIds.includes(r.userId)) return false
        if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(r.status)) return false
        if (filters.searchQuery) {
          const query = filters.searchQuery.toLowerCase()
          const student = students.find((s) => s.id === r.userId)
          const fullName = student?.full_name.toLowerCase() || ''
          const email = student?.email.toLowerCase() || ''
          const note = r.note?.toLowerCase() || ''
          if (!fullName.includes(query) && !email.includes(query) && !note.includes(query)) return false
        }
        return true
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [records, filters, students])

  const studentMap = useMemo(() => new Map(students.map((s) => [s.id, s])), [students])

  const handleRefresh = async () => {
    await refresh(filters)
  }

  const handleEnsureToday = async () => {
    await ensureTodayRecords()
    await refresh(filters)
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    exportData(format, { from: dateFrom, to: dateTo })
  }

  return (
    <div className="min-h-screen bg-gray-950 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Attendance Management</h1>
            <p className="text-gray-400">
              {schoolName} — Track, correct, and export student attendance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleEnsureToday}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <Users className="w-4 h-4" />
              Ensure Today Records
            </button>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <ExportButton onExport={handleExport} disabled={loading || exporting || filteredRecords.length === 0} />
          </div>
        </div>

        <AttendanceSummary records={filteredRecords} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <AttendanceFilters
              students={students}
              dateFrom={dateFrom}
              dateTo={dateTo}
              searchQuery={searchQuery}
              selectedStatuses={selectedStatuses}
              selectedStudentIds={selectedStudentIds}
              onDateFromChange={setDateFrom}
              onDateToChange={setDateTo}
              onSearchChange={setSearchQuery}
              onToggleStatus={toggleStatus}
              onToggleStudent={toggleStudentId}
              onClearFilters={clearFilters}
              activeFilterCount={activeFilterCount}
            />
          </div>

          <div className="lg:col-span-3 space-y-4">
            {hasActiveFilters && (
              <div className="text-sm text-gray-400">
                Showing <span className="text-white font-medium">{filteredRecords.length}</span> of{' '}
                <span className="text-white font-medium">{records.length}</span> records
              </div>
            )}
            <AttendanceGrid
              records={filteredRecords}
              students={students}
              selectedIds={selectedIds}
              isAllSelected={isAllSelected}
              loading={loading}
              onToggleSelection={toggleSelection}
              onToggleAll={toggleAll}
              onStatusChange={updateStatus}
              onCorrectionClick={setCorrectionRecord}
              onAuditClick={setAuditRecord}
              onNoteChange={addNote}
              onBulkMarkStatus={(status: AttendanceStatus) => bulkUpdateStatus(Array.from(selectedIds), status)}
              onClearSelection={clearSelection}
            />
          </div>
        </div>
      </div>

      {correctionRecord && (
        <CorrectionModal
          record={correctionRecord}
          student={studentMap.get(correctionRecord.userId)}
          onClose={() => setCorrectionRecord(null)}
          onSubmit={submitCorrection}
        />
      )}

      {auditRecord && (
        <AuditLog
          record={auditRecord}
          student={studentMap.get(auditRecord.userId)}
          onClose={() => setAuditRecord(null)}
          fetchAuditHistory={getAuditHistory}
        />
      )}
    </div>
  )
}
