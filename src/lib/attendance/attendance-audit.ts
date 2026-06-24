/**
 * ATTENDANCE AUDIT LOG SERVICE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Immutable audit trail for attendance record changes.
 */

import { AttendanceAuditEntry } from '@/types'

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

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
  recordId: string
  action: AttendanceAuditEntry['action']
  changedFields: Record<string, { old: any; new: any }>
  userId: string
  userName: string
  reason?: string | null
}

export async function logAuditEntry(input: LogAuditEntryInput): Promise<AttendanceAuditEntry> {
  const entry: AttendanceAuditEntry = {
    id: generateId(),
    recordId: input.recordId,
    action: input.action,
    changedFields: input.changedFields,
    userId: input.userId,
    userName: input.userName,
    timestamp: new Date().toISOString(),
    reason: input.reason || null,
  }

  if (demoMode) {
    const log = getDemoAuditLog()
    log.unshift(entry)
    return entry
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_audit_log')
    .insert(entry)
    .select()
    .single()

  if (error) {
    console.warn('[AttendanceAudit] Supabase audit table not available, using in-memory store:', error.message)
    const log = getDemoAuditLog()
    log.unshift(entry)
    return entry
  }

  return data as AttendanceAuditEntry
}

export async function getAuditHistory(recordId: string): Promise<AttendanceAuditEntry[]> {
  if (demoMode) {
    return getDemoAuditLog()
      .filter((e) => e.recordId === recordId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_audit_log')
    .select('*')
    .eq('recordId', recordId)
    .order('timestamp', { ascending: false })

  if (error) {
    console.warn('[AttendanceAudit] getAuditHistory error:', error.message)
    return getDemoAuditLog().filter((e) => e.recordId === recordId)
  }

  return (data as AttendanceAuditEntry[]) || []
}

export async function getAllAuditHistory(): Promise<AttendanceAuditEntry[]> {
  if (demoMode) {
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
    console.warn('[AttendanceAudit] getAllAuditHistory error:', error.message)
    return getDemoAuditLog()
  }

  return (data as AttendanceAuditEntry[]) || []
}
