import { createClient } from '@supabase/supabase-js'
import type { Profile } from '@/types'
import type { InstructorEscalation, InstructorEscalationEvent } from '@/lib/escalation/types'
import type { InterventionHistoryItem, IInstructorDatabaseClient } from './types'

interface SupabaseInstructorClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export class SupabaseInstructorDatabaseClient implements IInstructorDatabaseClient {
  private readonly supabase

  constructor(config: SupabaseInstructorClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  async getProfileById(userId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null
    return data as Profile
  }

  async getStudentById(studentId: string): Promise<Profile | null> {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', studentId)
      .in('role', ['student', 'apprentice'])
      .single()

    if (error || !data) return null
    return data as Profile
  }

  async listEscalationsForSchool(schoolId: string) {
    const { data, error } = await this.supabase
      .from('instructor_escalations')
      .select('*, student:profiles!instructor_escalations_user_id_fkey(*), acknowledgedByProfile:profiles!instructor_escalations_acknowledged_by_fkey(*)')
      .eq('school_id', schoolId)
      .order('created_at', { ascending: false })

    if (error || !data) return []

    return data.map((row: Record<string, unknown>) => ({
      ...this.mapEscalationRow(row),
      student: row.student as Profile,
      acknowledgedByProfile: (row.acknowledgedByProfile as Profile | null) ?? null,
    }))
  }

  async getEscalationForSchool(escalationId: string, schoolId: string) {
    const { data, error } = await this.supabase
      .from('instructor_escalations')
      .select('*, student:profiles!instructor_escalations_user_id_fkey(*), acknowledgedByProfile:profiles!instructor_escalations_acknowledged_by_fkey(*)')
      .eq('id', escalationId)
      .eq('school_id', schoolId)
      .single()

    if (error || !data) return null

    return {
      ...this.mapEscalationRow(data),
      student: data.student as Profile,
      acknowledgedByProfile: (data.acknowledgedByProfile as Profile | null) ?? null,
    }
  }

  async acknowledgeEscalationForSchool(escalationId: string, schoolId: string, instructorId: string) {
    const { data: existing, error: fetchError } = await this.supabase
      .from('instructor_escalations')
      .select('id, status, acknowledged_by')
      .eq('id', escalationId)
      .eq('school_id', schoolId)
      .single()

    if (fetchError || !existing) {
      return { success: false, error: 'Escalation not found' }
    }

    if (existing.acknowledged_by) {
      return {
        success: false,
        error: existing.acknowledged_by === instructorId
          ? 'Escalation already acknowledged by this instructor'
          : 'Escalation already acknowledged by another instructor',
        alreadyAcknowledged: true,
      }
    }

    const { error } = await this.supabase
      .from('instructor_escalations')
      .update({
        status: 'acknowledged',
        acknowledged_by: instructorId,
        acknowledged_at: new Date().toISOString(),
      })
      .eq('id', escalationId)
      .eq('school_id', schoolId)
      .eq('status', 'pending')
      .is('acknowledged_by', null)

    if (error) {
      return { success: false, error: error.message }
    }

    await this.supabase
      .from('instructor_escalation_events')
      .insert({
        escalation_id: escalationId,
        event_type: 'acknowledged',
        event_data: {
          acknowledged_by: instructorId,
          acknowledged_at: new Date().toISOString(),
        },
        actor_id: instructorId,
      })

    return { success: true }
  }

  async getInterventionHistoryForStudent(studentId: string, schoolId: string): Promise<InterventionHistoryItem[]> {
    const { data: cycles, error: cyclesError } = await this.supabase
      .from('remediation_cycles')
      .select('*')
      .eq('user_id', studentId)
      .order('targeted_at', { ascending: false })

    if (cyclesError || !cycles) return []

    const cycleIds = cycles.map((cycle) => cycle.id)
    const conceptIds = Array.from(new Set(cycles.map((cycle) => cycle.concept_id)))

    const [{ data: events }, { data: evaluations }, { data: escalations }] = await Promise.all([
      this.supabase
        .from('remediation_cycle_events')
        .select('*')
        .in('cycle_id', cycleIds.length > 0 ? cycleIds : ['__none__'])
        .order('created_at', { ascending: true }),
      this.supabase
        .from('remediation_cycle_evaluations')
        .select('*')
        .in('cycle_id', cycleIds.length > 0 ? cycleIds : ['__none__']),
      this.supabase
        .from('instructor_escalations')
        .select('*, acknowledgedByProfile:profiles!instructor_escalations_acknowledged_by_fkey(*)')
        .eq('school_id', schoolId)
        .eq('user_id', studentId)
        .in('concept_id', conceptIds.length > 0 ? conceptIds : ['__none__']),
    ])

    return cycles.map((cycle) => {
      const cycleEvents = (events ?? []).filter((event) => event.cycle_id === cycle.id)
      const terminalEvaluation = (evaluations ?? [])
        .filter((evaluation) => evaluation.cycle_id === cycle.id && evaluation.outcome !== 'pending')
        .sort((a, b) => new Date(b.evaluated_at).getTime() - new Date(a.evaluated_at).getTime())[0]
      const escalation = (escalations ?? []).find((item) => item.concept_id === cycle.concept_id)

      return {
        cycleId: cycle.id,
        conceptId: cycle.concept_id,
        chapterId: cycle.chapter_id,
        status: cycle.status,
        outcome: cycle.outcome,
        targetedAt: cycle.targeted_at,
        reviewCompletedAt: cycle.review_completed_at,
        reassessmentCompletedAt: cycle.reassessment_completed_at,
        evaluatedAt: cycle.evaluated_at,
        detectionSummary: mapDetectionSummary(cycle.detection_state, cycle.detection_confidence),
        evaluationSummary: terminalEvaluation ? mapEvaluationSummary(terminalEvaluation.outcome) : null,
        escalation: escalation
          ? {
              id: escalation.id,
              status: escalation.status,
              acknowledgedByName: (escalation.acknowledgedByProfile as Profile | null)?.full_name ?? null,
              acknowledgedAt: escalation.acknowledged_at,
            }
          : null,
        events: cycleEvents.map((event) => ({
          type: event.event_type,
          timestamp: event.created_at,
          summary: mapEventSummary(event.event_type),
        })),
      }
    })
  }

  private mapEscalationRow(row: Record<string, unknown>): InstructorEscalation {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      conceptId: row.concept_id as string,
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
}

function mapDetectionSummary(state: string, confidence: string): string {
  if (state === 'repeated_weakness') return `Persistent learning gap identified (${confidence} evidence)`
  if (state === 'emerging_weakness') return `Early signs of difficulty (${confidence} evidence)`
  return `Learning gap identified (${confidence} evidence)`
}

function mapEvaluationSummary(outcome: string): string {
  if (outcome === 'successful') return 'Gap resolved'
  if (outcome === 'unsuccessful') return 'Gap persists — needs attention'
  return 'Additional evidence required'
}

function mapEventSummary(eventType: string): string {
  switch (eventType) {
    case 'targeted':
      return 'Gap identified'
    case 'review_started':
      return 'Review started'
    case 'content_viewed':
      return 'Review content viewed'
    case 'flashcard_reviewed':
      return 'Flashcard reviewed'
    case 'review_completed':
      return 'Review completed'
    case 'reassessment_started':
      return 'Knowledge check started'
    case 'reassessment_completed':
      return 'Knowledge check completed'
    case 'evaluated':
      return 'Evaluation completed'
    case 'escalated':
      return 'Instructor escalation created'
    case 'reset':
      return 'Progress reset after sustained performance'
    default:
      return eventType.replaceAll('_', ' ')
  }
}

export function createSupabaseInstructorClient(): SupabaseInstructorDatabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  return new SupabaseInstructorDatabaseClient({ url, anonKey, serviceRoleKey })
}
