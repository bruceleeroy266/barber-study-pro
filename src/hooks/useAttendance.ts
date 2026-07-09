/**
 * useAttendance
 * ASCYN PRO / ASCYN PRO V2
 *
 * Manages attendance records, selection, bulk updates, and corrections.
 * Phase 13E.1D: surfaces production errors instead of swallowing them.
 */

'use client'

import { useState, useCallback } from 'react'
import {
  AttendanceRecord,
  AttendanceStatus,
  Profile,
  AttendanceFilterState,
  AttendanceCorrection,
  AttendanceAuditEntry,
} from '@/types'
import {
  getAttendanceRecords,
  updateAttendanceRecord,
  bulkUpdateAttendance,
  createAttendanceRecord,
  submitCorrection,
  getCorrectionHistory,
  logAuditEntry,
  getAuditHistory,
} from '@/lib/attendance'

export interface UseAttendanceOptions {
  initialRecords: AttendanceRecord[]
  students: Profile[]
  currentUser: Profile
  schoolId?: string | null
  defaultDate?: string
}

export interface UseAttendanceReturn {
  records: AttendanceRecord[]
  loading: boolean
  error: string | null
  selectedIds: Set<string>
  isAllSelected: boolean
  toggleSelection: (id: string) => void
  toggleAll: () => void
  clearSelection: () => void
  updateStatus: (id: string, status: AttendanceStatus, reason?: string) => Promise<void>
  bulkUpdateStatus: (ids: string[], status: AttendanceStatus) => Promise<void>
  addNote: (id: string, note: string) => Promise<void>
  submitCorrection: (recordId: string, newStatus: AttendanceStatus, reason: string) => Promise<void>
  getCorrections: (recordId: string) => Promise<AttendanceCorrection[]>
  getAuditHistory: (recordId: string) => Promise<AttendanceAuditEntry[]>
  refresh: (filters?: AttendanceFilterState) => Promise<void>
  getRecordForStudentAndDate: (studentId: string, date: string) => AttendanceRecord | undefined
  ensureTodayRecords: () => Promise<void>
  clearError: () => void
}

export function useAttendance({
  initialRecords,
  students,
  currentUser,
  schoolId,
  defaultDate,
}: UseAttendanceOptions): UseAttendanceReturn {
  const [records, setRecords] = useState<AttendanceRecord[]>(initialRecords)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const refresh = useCallback(async (filters?: AttendanceFilterState) => {
    setLoading(true)
    setError(null)
    try {
      const fresh = await getAttendanceRecords(
        {
          ...filters,
          schoolId,
        },
        students
      )
      setRecords(fresh)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }, [schoolId, students])

  const toggleSelection = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const toggleAll = useCallback(() => {
    setSelectedIds((prev) => {
      if (prev.size === records.length && records.length > 0) {
        return new Set()
      }
      return new Set(records.map((r) => r.id))
    })
  }, [records])

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set())
  }, [])

  const updateStatus = useCallback(
    async (id: string, status: AttendanceStatus, reason?: string) => {
      const original = records.find((r) => r.id === id)
      if (!original) return

      try {
        const updated = await updateAttendanceRecord(id, { status })

        await logAuditEntry({
          schoolId,
          recordId: id,
          action: 'update',
          changedFields: {
            status: { old: original.status, new: updated.status },
          },
          userId: currentUser.id,
          userName: currentUser.full_name,
          reason,
        })

        setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)))
        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to update attendance status')
      }
    },
    [records, currentUser, schoolId]
  )

  const bulkUpdateStatus = useCallback(
    async (ids: string[], status: AttendanceStatus) => {
      const originals = records.filter((r) => ids.includes(r.id))
      try {
        await bulkUpdateAttendance(ids, status)

        for (const original of originals) {
          await logAuditEntry({
            schoolId,
            recordId: original.id,
            action: 'update',
            changedFields: {
              status: { old: original.status, new: status },
            },
            userId: currentUser.id,
            userName: currentUser.full_name,
          })
        }

        setRecords((prev) =>
          prev.map((r) => (ids.includes(r.id) ? { ...r, status, updatedAt: new Date().toISOString() } : r))
        )
        clearSelection()
        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to bulk update attendance')
      }
    },
    [records, currentUser, clearSelection, schoolId]
  )

  const addNote = useCallback(
    async (id: string, note: string) => {
      const original = records.find((r) => r.id === id)
      if (!original) return

      try {
        const updated = await updateAttendanceRecord(id, { note })

        await logAuditEntry({
          schoolId,
          recordId: id,
          action: 'update',
          changedFields: {
            note: { old: original.note, new: updated.note },
          },
          userId: currentUser.id,
          userName: currentUser.full_name,
        })

        setRecords((prev) => prev.map((r) => (r.id === id ? updated : r)))
        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to add attendance note')
      }
    },
    [records, currentUser, schoolId]
  )

  const submitCorrectionLocal = useCallback(
    async (recordId: string, newStatus: AttendanceStatus, reason: string) => {
      const original = records.find((r) => r.id === recordId)
      if (!original) return

      try {
        await submitCorrection({
          schoolId: schoolId ?? '',
          attendanceRecordId: recordId,
          originalStatus: original.status,
          newStatus,
          reason,
          correctedBy: currentUser.id,
        })

        const updated = await updateAttendanceRecord(recordId, { status: newStatus })

        await logAuditEntry({
          schoolId,
          recordId,
          action: 'correct',
          changedFields: {
            status: { old: original.status, new: newStatus },
          },
          userId: currentUser.id,
          userName: currentUser.full_name,
          reason,
        })

        setRecords((prev) => prev.map((r) => (r.id === recordId ? updated : r)))
        setError(null)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to submit correction')
      }
    },
    [records, currentUser, schoolId]
  )

  const getCorrections = useCallback(
    async (recordId: string) => {
      try {
        return await getCorrectionHistory(recordId)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load corrections')
        return []
      }
    },
    []
  )

  const getAuditHistoryLocal = useCallback(
    async (recordId: string) => {
      try {
        return await getAuditHistory(recordId)
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to load audit history')
        return []
      }
    },
    []
  )

  const getRecordForStudentAndDate = useCallback(
    (studentId: string, date: string) => {
      return records.find((r) => r.userId === studentId && r.date === date)
    },
    [records]
  )

  const ensureTodayRecords = useCallback(async () => {
    const date = defaultDate || new Date().toISOString().split('T')[0]
    const changed: AttendanceRecord[] = []

    try {
      for (const student of students) {
        const existing = getRecordForStudentAndDate(student.id, date)
        if (!existing) {
          const created = await createAttendanceRecord({
            userId: student.id,
            schoolId: schoolId ?? null,
            date,
            status: 'Absent',
            clockedInAt: null,
            clockedOutAt: null,
            minutesPresent: null,
            note: null,
            verifiedBy: currentUser.id,
          })
          changed.push(created)

          await logAuditEntry({
            schoolId,
            recordId: created.id,
            action: 'create',
            changedFields: {
              status: { old: null, new: created.status },
            },
            userId: currentUser.id,
            userName: currentUser.full_name,
          })
        }
      }

      if (changed.length > 0) {
        setRecords((prev) => [...prev, ...changed])
      }
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create today\'s attendance records')
    }
  }, [defaultDate, students, schoolId, currentUser, getRecordForStudentAndDate])

  const isAllSelected = records.length > 0 && selectedIds.size === records.length

  return {
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
    submitCorrection: submitCorrectionLocal,
    getCorrections,
    getAuditHistory: getAuditHistoryLocal,
    refresh,
    getRecordForStudentAndDate,
    ensureTodayRecords,
    clearError,
  }
}
