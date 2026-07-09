/**
 * ATTENDANCE SERVICE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Client-side attendance CRUD with demo fallback and Supabase support.
 * Phase 13E.1B: converted to snake_case Supabase queries and explicit mappers.
 */

import { AttendanceRecord, AttendanceStatus, AttendanceFilterState, Profile } from '@/types'
import { supabase } from '@/lib/supabase'
import { demoAttendanceRecords } from '@/lib/demo-data'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import {
  mapAttendanceRecordFromDb,
  mapAttendanceRecordsFromDb,
  mapAttendanceRecordToDb,
} from '@/lib/mappers/operational-data-mappers'

// In-memory mutable store for demo mode (does not persist to disk)
let mutableDemoRecords: AttendanceRecord[] | null = null

function getDemoRecords(): AttendanceRecord[] {
  if (!mutableDemoRecords) {
    mutableDemoRecords = [...demoAttendanceRecords]
  }
  return mutableDemoRecords
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

function isDemoFallback(): boolean {
  // Phase 13C.1: demo fallback is only allowed in explicit safe demo mode.
  return isExplicitDemoMode() && !isSupabaseConfigured()
}

export interface AttendanceServiceFilters extends AttendanceFilterState {
  schoolId?: string | null
}

function matchesFilters(record: AttendanceRecord, students: Profile[], filters: AttendanceServiceFilters): boolean {
  if (filters.dateFrom && record.date < filters.dateFrom) return false
  if (filters.dateTo && record.date > filters.dateTo) return false
  if (filters.studentIds && filters.studentIds.length > 0 && !filters.studentIds.includes(record.userId)) return false
  if (filters.statuses && filters.statuses.length > 0 && !filters.statuses.includes(record.status)) return false
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase()
    const student = students.find((s) => s.id === record.userId)
    const fullName = student?.full_name.toLowerCase() || ''
    const email = student?.email.toLowerCase() || ''
    const note = record.note?.toLowerCase() || ''
    if (!fullName.includes(query) && !email.includes(query) && !note.includes(query)) return false
  }
  return true
}

export async function getAttendanceRecords(
  filters: AttendanceServiceFilters = {},
  students: Profile[] = []
): Promise<AttendanceRecord[]> {
  if (isDemoFallback()) {
    const records = getDemoRecords()
    return records
      .filter((r) => matchesFilters(r, students, filters))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  let query = supabase.from('attendance_records').select('*')

  if (filters.schoolId) {
    query = query.eq('school_id', filters.schoolId)
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo)
  }
  if (filters.studentIds && filters.studentIds.length > 0) {
    query = query.in('user_id', filters.studentIds)
  }
  if (filters.statuses && filters.statuses.length > 0) {
    query = query.in('status', filters.statuses)
  }

  const { data, error } = await query.order('date', { ascending: false })
  if (error) {
    console.error('[AttendanceService] getAttendanceRecords error:', error)
    throw error
  }

  let records = mapAttendanceRecordsFromDb(data || [])
  if (filters.searchQuery) {
    records = records.filter((r) => matchesFilters(r, students, filters))
  }
  return records
}

export async function createAttendanceRecord(
  record: Omit<AttendanceRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<AttendanceRecord> {
  const now = new Date().toISOString()
  const newRecord: AttendanceRecord = {
    ...record,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  }

  if (isDemoFallback()) {
    const records = getDemoRecords()
    records.push(newRecord)
    return newRecord
  }

  const payload = {
    ...mapAttendanceRecordToDb(newRecord),
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceService] createAttendanceRecord error:', error)
    throw error
  }

  return mapAttendanceRecordFromDb(data)
}

export async function updateAttendanceRecord(
  id: string,
  updates: Partial<AttendanceRecord>
): Promise<AttendanceRecord> {
  const now = new Date().toISOString()

  if (isDemoFallback()) {
    const records = getDemoRecords()
    const index = records.findIndex((r) => r.id === id)
    if (index === -1) {
      throw new Error(`Attendance record ${id} not found`)
    }
    records[index] = { ...records[index], ...updates, updatedAt: now }
    return records[index]
  }

  const payload = {
    ...mapAttendanceRecordToDb(updates),
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceService] updateAttendanceRecord error:', error)
    throw error
  }

  return mapAttendanceRecordFromDb(data)
}

export async function bulkUpdateAttendance(
  ids: string[],
  status: AttendanceStatus
): Promise<AttendanceRecord[]> {
  const now = new Date().toISOString()

  if (isDemoFallback()) {
    const records = getDemoRecords()
    const updated: AttendanceRecord[] = []
    for (const id of ids) {
      const index = records.findIndex((r) => r.id === id)
      if (index !== -1) {
        records[index] = { ...records[index], status, updatedAt: now }
        updated.push(records[index])
      }
    }
    return updated
  }

  const { data, error } = await supabase
    .from('attendance_records')
    .update({ status, updated_at: now })
    .in('id', ids)
    .select()

  if (error) {
    console.error('[AttendanceService] bulkUpdateAttendance error:', error)
    throw error
  }

  return mapAttendanceRecordsFromDb(data || [])
}

export function resetDemoAttendanceRecords(): void {
  mutableDemoRecords = [...demoAttendanceRecords]
}
