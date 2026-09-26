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
import { RefreshCw, ClipboardCheck, ChevronDown } from 'lucide-react'
import type { DailyScheduleExpectation } from '@/lib/schedules/daily-expectations'
import DailyAttendanceTimeEditor from './DailyAttendanceTimeEditor'
import { calculateAttendedMinutes, isoToLocalTime, zonedLocalTimeToIso } from '@/lib/schedules/attendance-time'

interface AttendanceClientProps {
  initialRecords: AttendanceRecord[]
  students: Profile[]
  currentUser: Profile
  schoolId: string | null
  schoolName: string
  defaultDate: string
  dailyScheduleExpectations: DailyScheduleExpectation[]
  schoolTimeZone: string
}

interface DailyDraft {
  status: AttendanceStatus | null
  arrival: string
  departure: string
  breakMinutes: number
}

function createInitialDrafts(
  students: Profile[],
  records: AttendanceRecord[],
  expectations: DailyScheduleExpectation[],
  date: string,
  schoolTimeZone: string,
): Record<string, DailyDraft> {
  const expectationByStudent = new Map(expectations.map((item) => [item.studentId, item]))
  const recordByStudent = new Map(
    records.filter((record) => record.date === date).map((record) => [record.userId, record]),
  )

  return Object.fromEntries(
    students.map((student) => {
      const record = recordByStudent.get(student.id)
      const expectation = expectationByStudent.get(student.id)
      return [
        student.id,
        {
          status: record?.status ?? null,
          arrival: record?.clockedInAt
            ? isoToLocalTime(record.clockedInAt, schoolTimeZone)
            : expectation?.startTime?.slice(0, 5) || '',
          departure: record?.clockedOutAt
            ? isoToLocalTime(record.clockedOutAt, schoolTimeZone)
            : expectation?.endTime?.slice(0, 5) || '',
          breakMinutes: expectation?.breakMinutes ?? 0,
        },
      ]
    }),
  )
}

export default function AttendanceClient({
  initialRecords,
  students,
  currentUser,
  schoolId,
  schoolName,
  defaultDate,
  dailyScheduleExpectations,
  schoolTimeZone,
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
    submitDailyAttendance,
    submitCorrection,
    getAuditHistory,
    refresh,
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
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(null)
  const [dailyDrafts, setDailyDrafts] = useState<Record<string, DailyDraft>>(() =>
    createInitialDrafts(
      students,
      initialRecords,
      dailyScheduleExpectations,
      defaultDate,
      schoolTimeZone,
    ),
  )
  const [dailySubmitMessage, setDailySubmitMessage] = useState<string | null>(null)

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

  const todayRecords = records.filter((record) => record.date === defaultDate)
  const todayRecordByStudent = new Map(todayRecords.map((record) => [record.userId, record]))

  const updateDraft = (studentId: string, patch: Partial<DailyDraft>) => {
    setDailySubmitMessage(null)
    setDailyDrafts((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {
          status: null,
          arrival: '',
          departure: '',
          breakMinutes: 0,
        }),
        ...patch,
      },
    }))
  }

  const markToday = (studentId: string, status: AttendanceStatus) => {
    updateDraft(studentId, { status })
  }

  const markAllPresent = () => {
    setDailySubmitMessage(null)
    setDailyDrafts((prev) => {
      const next = { ...prev }
      for (const student of students) {
        const expectation = expectationMap.get(student.id)
        if (!expectation?.isScheduled) continue
        next[student.id] = {
          ...(next[student.id] || {
            arrival: expectation.startTime?.slice(0, 5) || '',
            departure: expectation.endTime?.slice(0, 5) || '',
            breakMinutes: expectation.breakMinutes,
          }),
          status: 'Present',
        }
      }
      return next
    })
  }

  const scheduledStudentIds = students
    .filter((student) => expectationMap.get(student.id)?.isScheduled)
    .map((student) => student.id)
  const unmarkedScheduledCount = scheduledStudentIds.filter(
    (studentId) => !dailyDrafts[studentId]?.status,
  ).length

  const invalidTimeStudentIds = students
    .filter((student) => {
      const draft = dailyDrafts[student.id]
      if (!draft || (draft.status !== 'Present' && draft.status !== 'Tardy')) return false
      return calculateAttendedMinutes(draft.arrival, draft.departure, draft.breakMinutes) <= 0
    })
    .map((student) => student.id)

  const markedCount = students.filter((student) => dailyDrafts[student.id]?.status).length
  const submitDisabled =
    loading ||
    markedCount === 0 ||
    unmarkedScheduledCount > 0 ||
    invalidTimeStudentIds.length > 0

  const handleSubmitDay = async () => {
    if (submitDisabled) return

    const entries = students.flatMap((student) => {
      const draft = dailyDrafts[student.id]
      if (!draft?.status) return []

      if (draft.status === 'Present' || draft.status === 'Tardy') {
        const minutesPresent = calculateAttendedMinutes(
          draft.arrival,
          draft.departure,
          draft.breakMinutes,
        )
        return [{
          studentId: student.id,
          status: draft.status,
          clockedInAt: zonedLocalTimeToIso(defaultDate, draft.arrival, schoolTimeZone),
          clockedOutAt: zonedLocalTimeToIso(defaultDate, draft.departure, schoolTimeZone),
          minutesPresent,
        }]
      }

      return [{
        studentId: student.id,
        status: draft.status,
        clockedInAt: null,
        clockedOutAt: null,
        minutesPresent: 0,
      }]
    })

    const success = await submitDailyAttendance(entries)
    if (success) {
      setDailySubmitMessage(
        `Daily attendance submitted for ${entries.length} student${entries.length === 1 ? '' : 's'}. No hour logs were created.`,
      )
      setExpandedStudentId(null)
    }
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
                Review the roster, adjust exceptions, then submit the entire day once. Official hour generation starts in Segment C.
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
              const expectation = expectationMap.get(student.id)
              const draft = dailyDrafts[student.id] || {
                status: null,
                arrival: expectation?.startTime?.slice(0, 5) || '',
                departure: expectation?.endTime?.slice(0, 5) || '',
                breakMinutes: expectation?.breakMinutes ?? 0,
              }
              const current = draft.status
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
                      {(current === 'Present' || current === 'Tardy' || current === null) && (
                        <DailyAttendanceTimeEditor
                          arrival={draft.arrival}
                          departure={draft.departure}
                          breakMinutes={draft.breakMinutes}
                          disabled={loading}
                          onChange={(next) => {
                            const expectedStart = expectation?.startTime?.slice(0, 5) || null
                            const nextStatus =
                              current === 'Present' || current === 'Tardy'
                                ? expectedStart && next.arrival > expectedStart
                                  ? 'Tardy'
                                  : 'Present'
                                : current
                            updateDraft(student.id, { ...next, status: nextStatus })
                          }}
                        />
                      )}
                      <div className="mb-2 mt-4 text-sm font-medium text-silver">Attendance</div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {(['Present', 'Tardy', 'Absent', 'Excused'] as AttendanceStatus[]).map((status) => (
                          <button
                            key={status}
                            type="button"
                            disabled={loading}
                            onClick={() => {
                              markToday(student.id, status)
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

          <div className="mt-5 rounded-xl border border-[var(--color-border-secondary)] bg-black p-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="font-semibold text-white">Review &amp; Submit Day</h3>
                <p className="mt-1 text-sm text-silver">
                  {markedCount} marked · {unmarkedScheduledCount} scheduled {unmarkedScheduledCount === 1 ? 'student' : 'students'} still unmarked
                </p>
                {invalidTimeStudentIds.length > 0 && (
                  <p className="mt-1 text-sm text-red-300">
                    {invalidTimeStudentIds.length} present/tardy {invalidTimeStudentIds.length === 1 ? 'record needs' : 'records need'} valid arrival and departure times.
                  </p>
                )}
                <p className="mt-1 text-xs text-silver-gray">
                  Submit Day saves attendance status and attended minutes only. It does not create Student Hours entries.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSubmitDay}
                disabled={submitDisabled}
                className="min-h-12 rounded-lg bg-gold px-6 py-3 font-bold text-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading ? 'Submitting…' : 'Submit Day'}
              </button>
            </div>
            {dailySubmitMessage && (
              <div className="mt-3 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm font-medium text-gold">
                {dailySubmitMessage}
              </div>
            )}
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
