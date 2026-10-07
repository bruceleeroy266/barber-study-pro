'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase-server'
import { isPlatformAdminProfile } from '@/lib/auth-helpers'
import {
  buildPilotCheckpointWindow,
  resolvePilotMeasurement,
  type PilotCheckpointType,
  type PilotExamAttemptRow,
  type PilotRemediationRow,
  type PilotStudyActivityRow,
} from '@/lib/pilot-measurement/resolver'
import type { Profile, QuizAttempt, StudentProgress } from '@/types'

export interface CheckpointPreviewResult {
  success: boolean
  error?: string
  data?: {
    checkpointType: PilotCheckpointType
    targetDate: string
    cutoffAt: string
    eligibleToFinalize: boolean
    alreadyFinalized: boolean
    includedStudentCount: number
    excludedStudentCount: number
    coverage: {
      activity: { measured: number; total: number }
      examReady: { measured: number; total: number }
      chapterQuiz: { measured: number; total: number }
      readiness: { measured: number; total: number }
    }
    metrics: {
      totalActiveStudySeconds: number
      averageActiveStudySeconds: number | null
      activeLearnerCount: number
      noActivityLearnerCount: number
      averageLatestExamPercentage: number | null
      examPassingRate: number | null
      averageExamElapsedSeconds: number | null
      averageExamUnanswered: number | null
      examDomainPercentages: Record<string, number | null>
      averageOverallProgress: number | null
      averageReadinessScore: number | null
      needsAttentionCount: number
      activeRemediationLearnerCount: number
    }
  }
}

export interface CheckpointFinalizeResult {
  success: boolean
  error?: string
  checkpointId?: string
}

async function requirePlatformAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false as const, error: 'Authentication required.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role,school_id')
    .eq('id', user.id)
    .single()

  if (!profile || !isPlatformAdminProfile(profile)) {
    return { ok: false as const, error: 'Platform administrator access required.' }
  }

  return { ok: true as const, supabase, user }
}

async function loadCheckpointSnapshot(
  schoolId: string,
  checkpointType: PilotCheckpointType,
) {
  const auth = await requirePlatformAdmin()
  if (!auth.ok) return { ok: false as const, error: auth.error }

  const { supabase } = auth

  const { data: school } = await supabase
    .from('schools')
    .select('id,is_active,deleted_at')
    .eq('id', schoolId)
    .maybeSingle()

  if (!school || !school.is_active || school.deleted_at) {
    return { ok: false as const, error: 'The selected school is not active or does not exist.' }
  }

  const { data: period } = await supabase
    .from('pilot_measurement_periods')
    .select('id,school_id,status,pilot_start_date,pilot_end_date,timezone')
    .eq('school_id', schoolId)
    .in('status', ['active', 'completed'])
    .order('pilot_start_date', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!period) {
    return { ok: false as const, error: 'No active or completed pilot measurement period exists for this school.' }
  }

  const window = buildPilotCheckpointWindow(period.pilot_start_date, checkpointType, undefined, period.timezone)
  const now = new Date()
  const targetCutoff = new Date(window.cutoffAt)
  const previewCutoff = now < targetCutoff ? now.toISOString() : window.cutoffAt

  const { data: studentRows } = await supabase
    .from('profiles')
    .select('*')
    .eq('school_id', schoolId)
    .in('role', ['student', 'apprentice'])

  const students = (studentRows ?? []) as Profile[]
  const studentIds = students.map((student) => student.id)
  const ids = studentIds.length > 0 ? studentIds : ['__none__']

  const [
    progressResult,
    quizResult,
    activityResult,
    examResult,
    remediationResult,
    finalizedResult,
  ] = await Promise.all([
    supabase.from('student_progress').select('*').in('user_id', ids),
    supabase.from('quiz_attempts').select('*').in('user_id', ids),
    supabase
      .from('trusted_study_activity_days')
      .select('user_id,study_date,active_seconds,last_active_at')
      .in('user_id', ids),
    supabase
      .from('comprehensive_exam_attempts')
      .select('id,user_id,status,started_at,completed_at,attempt_number,percentage,passed,domain_breakdown,elapsed_seconds,unanswered_at_submit')
      .eq('school_id', schoolId)
      .in('user_id', ids),
    supabase
      .from('remediation_cycles')
      .select('user_id,status,outcome,created_at')
      .in('user_id', ids),
    supabase
      .from('pilot_measurement_checkpoints')
      .select('id')
      .eq('pilot_period_id', period.id)
      .eq('checkpoint_type', checkpointType)
      .eq('status', 'finalized')
      .maybeSingle(),
  ])

  const snapshot = resolvePilotMeasurement({
    schoolId,
    students,
    progress: (progressResult.data ?? []) as StudentProgress[],
    quizAttempts: (quizResult.data ?? []) as QuizAttempt[],
    studyActivity: (activityResult.data ?? []) as PilotStudyActivityRow[],
    examAttempts: (examResult.data ?? []) as PilotExamAttemptRow[],
    remediation: (remediationResult.data ?? []) as PilotRemediationRow[],
    window: buildPilotCheckpointWindow(period.pilot_start_date, checkpointType, previewCutoff, period.timezone),
  })

  const includedStudentIds = snapshot.learners
    .filter((learner) => learner.includedInAggregate)
    .map((learner) => learner.studentId)
  const excludedStudentIds = snapshot.learners
    .filter((learner) => !learner.includedInAggregate)
    .map((learner) => learner.studentId)

  return {
    ok: true as const,
    supabase,
    period,
    window,
    snapshot,
    includedStudentIds,
    excludedStudentIds,
    eligibleToFinalize: now >= targetCutoff,
    alreadyFinalized: Boolean(finalizedResult.data),
  }
}

export async function previewPilotCheckpoint(
  schoolId: string,
  checkpointType: PilotCheckpointType,
): Promise<CheckpointPreviewResult> {
  const result = await loadCheckpointSnapshot(schoolId, checkpointType)
  if (!result.ok) return { success: false, error: result.error }

  return {
    success: true,
    data: {
      checkpointType,
      targetDate: result.window.targetDate,
      cutoffAt: result.eligibleToFinalize ? result.window.cutoffAt : new Date().toISOString(),
      eligibleToFinalize: result.eligibleToFinalize,
      alreadyFinalized: result.alreadyFinalized,
      includedStudentCount: result.snapshot.includedStudentCount,
      excludedStudentCount: result.snapshot.excludedStudentCount,
      coverage: result.snapshot.coverage,
      metrics: result.snapshot.metrics,
    },
  }
}

export async function finalizePilotCheckpoint(
  schoolId: string,
  checkpointType: PilotCheckpointType,
): Promise<CheckpointFinalizeResult> {
  const result = await loadCheckpointSnapshot(schoolId, checkpointType)
  if (!result.ok) return { success: false, error: result.error }

  if (result.alreadyFinalized) {
    return { success: true }
  }

  if (!result.eligibleToFinalize) {
    return {
      success: false,
      error: `${result.window.targetDate} has not reached its checkpoint cutoff yet.`,
    }
  }

  const { data: checkpointId, error: draftError } = await result.supabase.rpc(
    'create_pilot_measurement_checkpoint_draft',
    {
      p_period_id: result.period.id,
      p_checkpoint_type: checkpointType,
      p_cutoff_at: result.window.cutoffAt,
      p_included_student_ids: result.includedStudentIds,
      p_excluded_student_ids: result.excludedStudentIds,
      p_coverage: result.snapshot.coverage,
      p_metrics: result.snapshot.metrics,
      p_notes: {
        source: 'platform_admin_checkpoint_control',
        generated_from: 'canonical_pilot_measurement_resolver',
      },
      p_schema_version: 'po1e-1',
    },
  )

  if (draftError || !checkpointId) {
    return { success: false, error: draftError?.message ?? 'Failed to create checkpoint draft.' }
  }

  const { error: finalizeError } = await result.supabase.rpc(
    'finalize_pilot_measurement_checkpoint',
    { p_checkpoint_id: checkpointId },
  )

  if (finalizeError) {
    return { success: false, error: finalizeError.message }
  }

  revalidatePath('/admin/school/pilot-measurement')
  revalidatePath('/school/pilot-measurement')
  revalidatePath('/instructor/pilot-measurement')

  return { success: true, checkpointId: String(checkpointId) }
}
