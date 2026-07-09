/**
 * ATTENDANCE AUDIT LOG SERVICE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Immutable audit trail for attendance record changes.
 * Phase 13E.1D: production errors are now surfaced; silent fallbacks removed.
 */

import { AttendanceAuditEntry } from '@/types'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import {
  mapAttendanceAuditEntryFromDb,
  mapAttendanceAuditEntriesFromDb,
  mapAttendanceAuditEntryToDb,
} from '@/lib/mappers/operational-data-mappers'

function isDemoFallback(): boolean {
  return isExplicitDemoMode() && !isSupabaseConfigured()
}

let mutableDemoAuditLog: AttendanceAuditEntry[] | null = null

function getDemoAuditLog(): AttendanceAuditEntry[] {
  if (!mutableDemoAuditLog) {
    mutableDemoAuditLog = []
  }
  return mutableDemoAuditLog
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export interface LogAuditEntryInput {
  schoolId?: string | null
  recordId: string
  action: AttendanceAuditEntry['action']
  changedFields: Record<string, { old: unknown; new: unknown }>
  userId: string
  userName: string
  reason?: string | null
}

export async function logAuditEntry(input: LogAuditEntryInput): Promise<AttendanceAuditEntry> {
  const now = new Date().toISOString()
  const entry: AttendanceAuditEntry = {
    id: generateId(),
    recordId: input.recordId,
    action: input.action,
    changedFields: input.changedFields,
    userId: input.userId,
    userName: input.userName,
    timestamp: now,
    reason: input.reason || null,
  }

  if (isDemoFallback()) {
    const log = getDemoAuditLog()
    log.unshift(entry)
    return entry
  }

  const { supabase } = await import('@/lib/supabase')
  const payload = {
    ...mapAttendanceAuditEntryToDb(entry),
    school_id: input.schoolId || null,
    created_at: now,
  }

  const { data, error } = await supabase
    .from('attendance_audit_log')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceAudit] logAuditEntry error:', error)
    throw new Error(`Failed to log audit entry: ${error.message}`)
  }

  return mapAttendanceAuditEntryFromDb(data)
}

export async function getAuditHistory(recordId: string): Promise<AttendanceAuditEntry[]> {
  if (isDemoFallback()) {
    return getDemoAuditLog()
      .filter((e) => e.recordId === recordId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_audit_log')
    .select('*')
    .eq('record_id', recordId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('[AttendanceAudit] getAuditHistory error:', error)
    throw new Error(`Failed to load audit history: ${error.message}`)
  }

  return mapAttendanceAuditEntriesFromDb(data || [])
}

export async function getAllAuditHistory(): Promise<AttendanceAuditEntry[]> {
  if (isDemoFallback()) {
    return getDemoAuditLog().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_audit_log')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('[AttendanceAudit] getAllAuditHistory error:', error)
    throw new Error(`Failed to load audit history: ${error.message}`)
  }

  return mapAttendanceAuditEntriesFromDb(data || [])
}
