/**
 * Phase 6C-2c — Supabase Database Client for Escalation & Reset
 *
 * Implementation of IEscalationDatabaseClient using Supabase.
 * Handles all database interactions for instructor escalation and
 * sustained-performance reset services.
 */

import { createClient } from '@supabase/supabase-js'
import type {
  AcknowledgeEscalationParams,
  AcknowledgeEscalationResult,
  ConceptId,
  CreateEscalationParams,
  CreateEscalationResult,
  DetectionTransitionParams,
  DetectionTransitionResult,
  EscalationEventType,
  ExecuteResetResult,
  IEscalationDatabaseClient,
  InstructorEscalation,
  RecordFollowUpEvidenceParams,
  RecordFollowUpEvidenceResult,
  ResetEligibilityResult,
  SustainedPerformanceTracking,
} from './types'

// ───────────────────────────────────────────────
// Supabase Client Configuration
// ───────────────────────────────────────────────

export interface SupabaseEscalationClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// ───────────────────────────────────────────────
// Supabase Database Client
// ───────────────────────────────────────────────

export class SupabaseEscalationDatabaseClient implements IEscalationDatabaseClient {
  private readonly supabase

  constructor(config: SupabaseEscalationClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  // ───────────────────────────────────────────────
  // Escalation Operations
  // ───────────────────────────────────────────────

  async createEscalation(params: CreateEscalationParams): Promise<CreateEscalationResult> {
    const { data, error } = await this.supabase.rpc('create_instructor_escalation', {
      p_user_id: params.userId,
      p_concept_id: params.conceptId,
      p_chapter_id: params.chapterId,
      p_school_id: params.schoolId,
      p_triggering_cycle_ids: params.triggeringCycleIds,
      p_unsuccessful_cycle_count: params.unsuccessfulCycleCount,
      p_detection_evidence: params.detectionEvidence,
    })

    if (error) {
      return {
        success: false,
        error: `Failed to create escalation: ${error.message}`,
      }
    }

    // Record the 'created' event
    if (data) {
      await this.recordEscalationEvent(data, 'created', {
        triggering_cycle_ids: params.triggeringCycleIds,
        unsuccessful_cycle_count: params.unsuccessfulCycleCount,
        detection_evidence: params.detectionEvidence,
      })
    }

    return {
      success: true,
      escalationId: data,
    }
  }

  async getEscalation(escalationId: string): Promise<InstructorEscalation | null> {
    const { data, error } = await this.supabase
      .from('instructor_escalations')
      .select('*')
      .eq('id', escalationId)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapEscalationRow(data)
  }

  async getActiveEscalation(
    userId: string,
    conceptId: ConceptId
  ): Promise<InstructorEscalation | null> {
    const { data, error } = await this.supabase
      .from('instructor_escalations')
      .select('*')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .in('status', ['pending', 'acknowledged', 'in_progress'])
      .single()

    if (error || !data) {
      return null
    }

    return this.mapEscalationRow(data)
  }

  async acknowledgeEscalation(
    params: AcknowledgeEscalationParams
  ): Promise<AcknowledgeEscalationResult> {
    const { error } = await this.supabase
      .from('instructor_escalations')
      .update({
        status: 'acknowledged',
        acknowledged_by: params.instructorId,
        acknowledged_at: new Date().toISOString(),
        instructor_notes: params.notes ?? null,
      })
      .eq('id', params.escalationId)
      .eq('status', 'pending') // Optimistic concurrency: only update if still pending
      .is('acknowledged_by', null) // Extra safety: only if not already acknowledged

    if (error) {
      return {
        success: false,
        error: `Failed to acknowledge escalation: ${error.message}`,
      }
    }

    // Record the 'acknowledged' event
    await this.recordEscalationEvent(
      params.escalationId,
      'acknowledged',
      {
        acknowledged_by: params.instructorId,
        acknowledged_at: new Date().toISOString(),
        instructor_notes: params.notes,
      },
      params.instructorId
    )

    return { success: true }
  }

  async recordEscalationEvent(
    escalationId: string,
    eventType: EscalationEventType,
    eventData: Record<string, unknown>,
    actorId?: string
  ): Promise<void> {
    const { error } = await this.supabase
      .from('instructor_escalation_events')
      .insert({
        escalation_id: escalationId,
        event_type: eventType,
        event_data: eventData,
        actor_id: actorId ?? null,
      })

    if (error) {
      throw new Error(`Failed to record escalation event: ${error.message}`)
    }
  }

  // ───────────────────────────────────────────────
  // Sustained-Performance Operations
  // ───────────────────────────────────────────────

  async recordDetectionTransition(
    params: DetectionTransitionParams
  ): Promise<DetectionTransitionResult> {
    const { error } = await this.supabase.rpc('record_detection_state_transition', {
      p_user_id: params.userId,
      p_concept_id: params.conceptId,
      p_chapter_id: params.chapterId,
      p_new_state: params.newState,
      p_evidence: params.evidence,
    })

    if (error) {
      return {
        success: false,
        error: `Failed to record detection transition: ${error.message}`,
      }
    }

    // Get the current tracking state to return
    const tracking = await this.getTrackingState(params.userId, params.conceptId)

    return {
      success: true,
      trackingId: tracking?.id,
      isNewTrackingPeriod: tracking?.enteredCpwAt.getTime() === tracking?.lastVerifiedAt.getTime(),
      continuityBroken: tracking?.continuityBrokenAt !== null,
    }
  }

  async recordFollowUpEvidence(
    params: RecordFollowUpEvidenceParams
  ): Promise<RecordFollowUpEvidenceResult> {
    const { data, error } = await this.supabase.rpc('record_follow_up_evidence', {
      p_user_id: params.userId,
      p_concept_id: params.conceptId,
      p_chapter_id: params.chapterId,
      p_quiz_attempt_id: params.quizAttemptId,
      p_canonical_mapping_verified: params.canonicalMappingVerified,
      p_mapped_question_count: params.mappedQuestionCount,
    })

    if (error) {
      return {
        success: false,
        error: `Failed to record follow-up evidence: ${error.message}`,
      }
    }

    return {
      success: true,
      evidenceId: data,
    }
  }

  async getTrackingState(
    userId: string,
    conceptId: ConceptId
  ): Promise<SustainedPerformanceTracking | null> {
    const { data, error } = await this.supabase
      .from('sustained_performance_tracking')
      .select('*')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .eq('is_active', true)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapTrackingRow(data)
  }

  async checkResetEligibility(
    userId: string,
    conceptId: ConceptId
  ): Promise<ResetEligibilityResult> {
    const { data, error } = await this.supabase.rpc(
      'check_sustained_performance_reset_eligibility',
      {
        p_user_id: userId,
        p_concept_id: conceptId,
      }
    )

    if (error) {
      return {
        isEligible: false,
        blockingReason: 'no_follow_up_evidence', // Default
      }
    }

    if (!data || data.length === 0) {
      return {
        isEligible: false,
        blockingReason: 'no_follow_up_evidence',
      }
    }

    const row = data[0]
    return {
      isEligible: row.is_eligible,
      enteredCpwAt: row.entered_cpw_at ? new Date(row.entered_cpw_at) : undefined,
      daysInCpw: row.days_in_cpw,
      followUpEvidenceCount: row.follow_up_evidence_count,
      continuityBroken: row.continuity_broken,
      blockingReason: row.blocking_reason,
    }
  }

  async executeReset(
    userId: string,
    conceptId: ConceptId,
    executedBy?: string
  ): Promise<ExecuteResetResult> {
    const { data, error } = await this.supabase.rpc('execute_sustained_performance_reset', {
      p_user_id: userId,
      p_concept_id: conceptId,
      p_executed_by: executedBy ?? null,
    })

    if (error) {
      // Check if error is due to already-executed reset (idempotency)
      if (error.message.includes('No active sustained performance tracking')) {
        return {
          success: true,
          alreadyExecuted: true,
        }
      }
      return {
        success: false,
        error: `Failed to execute reset: ${error.message}`,
      }
    }

    return {
      success: true,
      resetId: data,
    }
  }

  // ───────────────────────────────────────────────
  // Cycle Queries
  // ───────────────────────────────────────────────

  async getUnsuccessfulCycleCount(
    userId: string,
    conceptId: ConceptId,
    windowDays: number = 30
  ): Promise<number> {
    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - windowDays)

    const { count, error } = await this.supabase
      .from('remediation_cycles')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .eq('outcome', 'unsuccessful')
      .gte('evaluated_at', windowStart.toISOString())
      .eq('reset_by_sustained_performance', false)

    if (error) {
      throw new Error(`Failed to count unsuccessful cycles: ${error.message}`)
    }

    return count ?? 0
  }

  async getCyclesInWindow(
    userId: string,
    conceptId: ConceptId,
    windowDays: number = 30
  ): Promise<Array<{ id: string; outcome: string | null; evaluatedAt: Date | null }>> {
    const windowStart = new Date()
    windowStart.setDate(windowStart.getDate() - windowDays)

    const { data, error } = await this.supabase
      .from('remediation_cycles')
      .select('id, outcome, evaluated_at')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .gte('evaluated_at', windowStart.toISOString())
      .eq('reset_by_sustained_performance', false)
      .order('evaluated_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch cycles: ${error.message}`)
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      outcome: row.outcome,
      evaluatedAt: row.evaluated_at ? new Date(row.evaluated_at) : null,
    }))
  }

  // ───────────────────────────────────────────────
  // Row Mappers
  // ───────────────────────────────────────────────

  private mapEscalationRow(row: Record<string, unknown>): InstructorEscalation {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      conceptId: row.concept_id as ConceptId,
      chapterId: row.chapter_id as string,
      schoolId: row.school_id as string,
      triggeringCycleIds: row.triggering_cycle_ids as string[],
      unsuccessfulCycleCount: row.unsuccessful_cycle_count as number,
      detectionEvidence: row.detection_evidence as InstructorEscalation['detectionEvidence'],
      status: row.status as InstructorEscalation['status'],
      acknowledgedBy: row.acknowledged_by as string | null,
      acknowledgedAt: row.acknowledged_at ? new Date(row.acknowledged_at as string) : null,
      instructorNotes: row.instructor_notes as string | null,
      interventionPlan: row.intervention_plan as string | null,
      resolutionSummary: row.resolution_summary as string | null,
      followUpRequired: row.follow_up_required as boolean | null,
      autoClearedAt: row.auto_cleared_at ? new Date(row.auto_cleared_at as string) : null,
      autoClearedByResetId: row.auto_cleared_by_reset_id as string | null,
      expiredAt: row.expired_at ? new Date(row.expired_at as string) : null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }
  }

  private mapTrackingRow(row: Record<string, unknown>): SustainedPerformanceTracking {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      conceptId: row.concept_id as ConceptId,
      chapterId: row.chapter_id as string,
      enteredCpwAt: new Date(row.entered_cpw_at as string),
      lastVerifiedAt: new Date(row.last_verified_at as string),
      continuityBrokenAt: row.continuity_broken_at ? new Date(row.continuity_broken_at as string) : null,
      followUpEvidenceCount: row.follow_up_evidence_count as number,
      followUpEvidenceIds: row.follow_up_evidence_ids as string[],
      isActive: row.is_active as boolean,
      resetAt: row.reset_at ? new Date(row.reset_at as string) : null,
      resetId: row.reset_id as string | null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a Supabase escalation database client from environment variables.
 */
export function createSupabaseEscalationClient(): SupabaseEscalationDatabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  return new SupabaseEscalationDatabaseClient({
    url,
    anonKey,
    serviceRoleKey,
  })
}
