/**
 * ATTENDANCE CORRECTION SERVICE
 * ASCYN PRO / Barber Study Pro V2
 *
 * Tracks attendance status corrections with reason and approval state.
 */

import { AttendanceCorrection, AttendanceStatus } from '@/types'

const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

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
  attendanceRecordId: string
  originalStatus: AttendanceStatus
  newStatus: AttendanceStatus
  reason: string
  correctedBy: string
}

export async function submitCorrection(input: SubmitCorrectionInput): Promise<AttendanceCorrection> {
  const correction: AttendanceCorrection = {
    id: generateId(),
    attendanceRecordId: input.attendanceRecordId,
    originalStatus: input.originalStatus,
    newStatus: input.newStatus,
    reason: input.reason,
    correctedBy: input.correctedBy,
    correctedAt: new Date().toISOString(),
  }

  if (demoMode) {
    const corrections = getDemoCorrections()
    corrections.unshift(correction)
    return correction
  }

  // Real mode: persist to Supabase when table is available
  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_corrections')
    .insert(correction)
    .select()
    .single()

  if (error) {
    console.warn('[AttendanceCorrection] Supabase correction table not available, using in-memory store:', error.message)
    const corrections = getDemoCorrections()
    corrections.unshift(correction)
    return correction
  }

  return data as AttendanceCorrection
}

export async function getCorrectionHistory(recordId: string): Promise<AttendanceCorrection[]> {
  if (demoMode) {
    return getDemoCorrections()
      .filter((c) => c.attendanceRecordId === recordId)
      .sort((a, b) => new Date(b.correctedAt).getTime() - new Date(a.correctedAt).getTime())
  }

  const { supabase } = await import('@/lib/supabase')
  const { data, error } = await supabase
    .from('attendance_corrections')
    .select('*')
    .eq('attendanceRecordId', recordId)
    .order('correctedAt', { ascending: false })

  if (error) {
    console.warn('[AttendanceCorrection] getCorrectionHistory error:', error.message)
    return getDemoCorrections().filter((c) => c.attendanceRecordId === recordId)
  }

  return (data as AttendanceCorrection[]) || []
}
