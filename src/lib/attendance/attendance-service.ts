/**
 * ATTENDANCE SERVICE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Client-side attendance CRUD with demo fallback and Supabase support.
 */

import { AttendanceRecord, AttendanceStatus, AttendanceFilterState, Profile } from '@/types'
import { supabase } from '@/lib/supabase'
import { demoAttendanceRecords } from '@/lib/demo-data'
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

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
  if (demoMode) return true
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  const configured =
    url.startsWith('https://') &&
    !url.includes('your-project') &&
    !url.includes('example.supabase.co') &&
    key.length > 20
  return !configured
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
    query = query.eq('schoolId', filters.schoolId)
  }
  if (filters.dateFrom) {
    query = query.gte('date', filters.dateFrom)
  }
  if (filters.dateTo) {
    query = query.lte('date', filters.dateTo)
  }
  if (filters.studentIds && filters.studentIds.length > 0) {
    query = query.in('userId', filters.studentIds)
  }
  if (filters.statuses && filters.statuses.length > 0) {
    query = query.in('status', filters.statuses)
  }

  const { data, error } = await query.order('date', { ascending: false })
  if (error) {
    console.error('[AttendanceService] getAttendanceRecords error:', error)
    throw error
  }

  let records = (data as AttendanceRecord[]) || []
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

  const { data, error } = await supabase
    .from('attendance_records')
    .insert(newRecord)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceService] createAttendanceRecord error:', error)
    throw error
  }

  return data as AttendanceRecord
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

  const { data, error } = await supabase
    .from('attendance_records')
    .update({ ...updates, updatedAt: now })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceService] updateAttendanceRecord error:', error)
    throw error
  }

  return data as AttendanceRecord
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
    .update({ status, updatedAt: now })
    .in('id', ids)
    .select()

  if (error) {
    console.error('[AttendanceService] bulkUpdateAttendance error:', error)
    throw error
  }

  return (data as AttendanceRecord[]) || []
}

export function resetDemoAttendanceRecords(): void {
  mutableDemoRecords = [...demoAttendanceRecords]
}
