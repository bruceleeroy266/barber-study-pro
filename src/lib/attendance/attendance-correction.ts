/**
 * ATTENDANCE CORRECTION SERVICE
 * ASCYN PRO / ASCYN PRO V2
 *
 * Tracks attendance status corrections with reason and approval state.
 * Phase 13E.1D: production errors are now surfaced; silent fallbacks removed.
 */

import { AttendanceCorrection, AttendanceStatus } from '@/types'
import { isExplicitDemoMode, isSupabaseConfigured } from '@/lib/demo-helpers'
import {
  mapAttendanceCorrectionFromDb,
  mapAttendanceCorrectionsFromDb,
  mapAttendanceCorrectionToDb,
} from '@/lib/mappers/operational-data-mappers'

function isDemoFallback(): boolean {
  return isExplicitDemoMode() && !isSupabaseConfigured()
}

let mutableDemoCorrections: AttendanceCorrection[] | null = null

function getDemoCorrections(): AttendanceCorrection[] {
  if (!mutableDemoCorrections) {
    mutableDemoCorrections = []
  }
  return mutableDemoCorrections
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

export interface SubmitCorrectionInput {
  schoolId: string
  attendanceRecordId: string
  originalStatus: AttendanceStatus
  newStatus: AttendanceStatus
  reason: string
  correctedBy: string
}

export async function submitCorrection(input: SubmitCorrectionInput): Promise<AttendanceCorrection> {
  const now = new Date().toISOString()
  const correction: AttendanceCorrection = {
    id: generateId(),
    attendanceRecordId: input.attendanceRecordId,
    originalStatus: input.originalStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    correctedBy: input.correctedBy,
    correctedAt: now,
  }

  if (isDemoFallback()) {
    const corrections = getDemoCorrections()
    corrections.unshift(correction)
    return correction
  }

  const { supabase } = await import('@/lib/supabase')
  const payload = {
    ...mapAttendanceCorrectionToDb(correction),
    school_id: input.schoolId,
    created_at: now,
    updated_at: now,
  }

  const { data, error } = await supabase
    .from('attendance_corrections')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error('[AttendanceCorrection] submitCorrection error:', error)
    throw new Error(`Failed to submit correction: ${error.message}`)
  }

  return mapAttendanceCorrectionFromDb(data)
}

export async function getCorrectionHistory(recordId: string): Promise<AttendanceCorrection[]> {
  if (isDemoFallback()) {
    return getDemoCorrections()
      .filter((c) => c.attendanceRecordId === recordId)
      .sort((a, b) => new Date(b.correctedAt).getTime() - new Date(a.correctedAt).getTime())
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_corrections')
    .select('*')
    .eq('attendance_record_id', recordId)
    .order('corrected_at', { ascending: false })

  if (error) {
    console.error('[AttendanceCorrection] getCorrectionHistory error:', error)
    throw new Error(`Failed to load correction history: ${error.message}`)
  }

  return mapAttendanceCorrectionsFromDb(data || [])
}
