'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
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
import { RefreshCw, ClipboardCheck, ChevronDown } from 'lucide-react'
import type { DailyScheduleExpectation } from '@/lib/schedules/daily-expectations'

interface AttendanceClientProps {
  initialRecords: AttendanceRecord[]
  students: Profile[]
  currentUser: Profile
  schoolId: string | null
  schoolName: string
  defaultDate: string
  dailyScheduleExpectations: DailyScheduleExpectation[]
}

export default function AttendanceClient({
  initialRecords,
  students,
  currentUser,
  schoolId,
  schoolName,
  defaultDate,
  dailyScheduleExpectations,
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
  const todayInitialized = useRef(false)
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)

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
  const expectationMap = useMemo(
    () => new Map(dailyScheduleExpectations.map((expectation) => [expectation.studentId, expectation])),
    [dailyScheduleExpectations],
  )

  const handleRefresh = async () => {
    await refresh(filters)
  }

  const handleEnsureToday = async () => {
    await ensureTodayRecords()
    await refresh(filters)
  }

  useEffect(() => {
    if (todayInitialized.current || loading || records.some((record) => record.date === defaultDate)) return
    todayInitialized.current = true
    void handleEnsureToday()
    // Initialize today's roll once; advanced history remains available below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, records, defaultDate])

  const todayRecords = records.filter((record) => record.date === defaultDate)
  const todayRecordByStudent = new Map(todayRecords.map((record) => [record.userId, record]))

  const markToday = async (studentId: string, status: AttendanceStatus) => {
    let record = todayRecordByStudent.get(studentId)
    if (!record) {
      const created = await ensureTodayRecords()
      record = created.find((item) => item.userId === studentId && item.date === defaultDate)
    }
    if (record) await updateStatus(record.id, status)
  }

  const markAllPresent = async () => {
    const created = await ensureTodayRecords()
    const recordsByStudent = new Map(todayRecords.map((record) => [record.userId, record]))
    for (const record of created) recordsByStudent.set(record.userId, record)

    const scheduledStudents = students.filter(
      (student) => expectationMap.get(student.id)?.isScheduled,
    )
    const ids = scheduledStudents
      .map((student) => recordsByStudent.get(student.id)?.id)
      .filter((id): id is string => Boolean(id))

    if (ids.length > 0) await bulkUpdateStatus(ids, 'Present')
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    exportData(format, { from: dateFrom, to: dateTo })
  }

  return (
    <div className="min-h-screen bg-black p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Daily Attendance &amp; Hours</h1>
            <p className="text-silver">
              {schoolName} — Review each student&apos;s expected schedule, attendance, and planned hours in one place
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-gold text-sm font-medium">
              <ClipboardCheck className="w-4 h-4" />
              Today&apos;s roll is ready below
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
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Today&apos;s Attendance &amp; Hours</h2>
              <p className="text-silver mt-1">
                Each student uses their own schedule. Planned hours are shown here; official hour generation starts in Segment C.
              </p>
            </div>
            <button
              type="button"
              onClick={markAllPresent}
              disabled={loading || students.length === 0}
              className="min-h-11 rounded-lg border border-gold px-4 py-2 font-semibold text-gold hover:bg-gold/10 disabled:opacity-50"
            >
              Mark Scheduled Students Present
            </button>
          </div>
          <div className="divide-y divide-[var(--color-border-secondary)] overflow-hidden rounded-xl border border-[var(--color-border-secondary)]">
            {students.map((student) => {
              const record = todayRecordByStudent.get(student.id)
              const current = record?.status
              const expectation = expectationMap.get(student.id)
              const expanded = expandedStudentId === student.id
              return (
                <div key={student.id} className="bg-black">
                  <button
                    type="button"
                    onClick={() => setExpandedStudentId(expanded ? null : student.id)}
                    className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3 text-left"
                    aria-expanded={expanded}
                  >
                    <div className="min-w-0">
                      <div className="truncate font-semibold text-white">{student.full_name}</div>
                      <div className={`text-sm ${current ? 'text-gold' : 'text-silver'}`}>
                        {current ? `Attendance: ${current} ✓` : 'Attendance: Not marked'}
                      </div>
                      <div className="mt-1 text-xs text-silver">
                        {expectation?.isScheduled
                          ? `${expectation.label} · ${expectation.startTime?.slice(0, 5)}–${expectation.endTime?.slice(0, 5)} · ${Math.floor(expectation.plannedMinutes / 60)}h ${expectation.plannedMinutes % 60}m planned`
                          : expectation?.label || 'No schedule assigned'}
                      </div>
                    </div>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-silver transition-transform ${expanded ? 'rotate-180' : ''}`} />
                  </button>
                  {expanded && (
                    <div className="border-t border-[var(--color-border-secondary)] px-4 pb-4 pt-3">
                      <div className="mb-3 rounded-lg border border-graphite bg-charcoal p-3">
                        <div className="text-sm font-semibold text-white">Expected today</div>
                        <div className="mt-1 text-sm text-silver">
                          {expectation?.isScheduled
                            ? `${expectation.startTime?.slice(0, 5)}–${expectation.endTime?.slice(0, 5)} · ${expectation.breakMinutes} min break · ${Math.floor(expectation.plannedMinutes / 60)}h ${expectation.plannedMinutes % 60}m planned`
                            : expectation?.label || 'No schedule assigned'}
                        </div>
                        {expectation?.reason && (
                          <div className="mt-1 text-xs text-silver-gray">{expectation.reason}</div>
                        )}
                      </div>
                      <div className="mb-2 text-sm font-medium text-silver">Attendance</div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(['Present', 'Tardy', 'Absent', 'Excused'] as AttendanceStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={loading}
                            onClick={async () => {
                              await markToday(student.id, status)
                              setExpandedStudentId(null)
                            }}
                            className={`min-h-12 rounded-lg border px-3 py-2 font-medium transition-colors disabled:opacity-50 ${current === status ? 'border-gold bg-gold/15 text-gold' : 'border-[var(--color-border-secondary)] bg-[var(--color-surface-primary)] text-silver hover:text-white'}`}
                          >
                            {status}{current === status ? ' ✓' : ''}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
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
