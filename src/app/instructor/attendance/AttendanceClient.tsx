'use client'

import { useState, useMemo, useEffect } from 'react'
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
import { RefreshCw, ClipboardCheck } from 'lucide-react'

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
  const [todayInitialized, setTodayInitialized] = useState(false)

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

  useEffect(() => {
    if (todayInitialized || loading || records.some((record) => record.date === defaultDate)) return
    setTodayInitialized(true)
    void handleEnsureToday()
    // Initialize today's roll once; advanced history remains available below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayInitialized, loading, records, defaultDate])

  const todayRecords = records.filter((record) => record.date === defaultDate)
  const todayRecordByStudent = new Map(todayRecords.map((record) => [record.userId, record]))

  const markToday = async (studentId: string, status: AttendanceStatus) => {
    let record = todayRecordByStudent.get(studentId)
    if (!record) {
      await ensureTodayRecords()
      await refresh()
      record = records.find((item) => item.userId === studentId && item.date === defaultDate)
    }
    if (record) await updateStatus(record.id, status)
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    exportData(format, { from: dateFrom, to: dateTo })
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Attendance Management</h1>
            <p className="text-silver">
              {schoolName} — Track, correct, and export student attendance
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              <ClipboardCheck className="w-4 h-4" />
              Today's roll is ready below
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-graphite hover:bg-[var(--color-border-secondary)] text-white rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <ExportButton onExport={handleExport} disabled={loading || exporting || filteredRecords.length === 0} />
          </div>
        </div>

        <section className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)] p-4 md:p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-white">Take Today's Attendance</h2>
            <p className="text-silver mt-1">Tap one status for each student. Changes save immediately.</p>
          </div>
          <div className="space-y-3">
            {students.map((student) => {
              const record = todayRecordByStudent.get(student.id)
              const current = record?.status
              return (
                <div key={student.id} className="rounded-xl border border-[var(--color-border-secondary)] p-4">
                  <div className="font-semibold text-white mb-3">{student.full_name}</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['Present', 'Tardy', 'Absent', 'Excused'] as AttendanceStatus[]).map((status) => (
                      <button
                        key={status}
                        type="button"
                        disabled={loading || !record}
                        onClick={() => markToday(student.id, status)}
                        className={`min-h-12 rounded-lg border px-3 py-2 font-medium transition-colors disabled:opacity-50 ${current === status ? 'border-gold bg-gold/15 text-gold' : 'border-[var(--color-border-secondary)] bg-black text-silver hover:text-white'}`}
                      >
                        {status}{current === status ? ' ✓' : ''}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <details className="rounded-2xl border border-[var(--color-border-primary)] bg-[var(--color-surface-primary)]">
          <summary className="cursor-pointer p-4 md:p-6 text-lg font-semibold text-white">Attendance history, filters & export</summary>
          <div className="px-4 pb-4 md:px-6 md:pb-6">
            <AttendanceSummary records={filteredRecords} />

        {error && (
          <div className="bg-silver/10 border border-silver/20 rounded-lg p-4 text-silver">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
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
              <div className="text-sm text-silver">
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
        </details>
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
          key={auditRecord.id}
          record={auditRecord}
          student={studentMap.get(auditRecord.userId)}
          onClose={() => setAuditRecord(null)}
          fetchAuditHistory={getAuditHistory}
        />
      )}
    </div>
  )
}
