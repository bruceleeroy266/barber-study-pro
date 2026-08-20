/**
 * Phase 6C-3 — Supabase Database Client for Student Remediation
 *
 * Implementation of IStudentRemediationDbClient using Supabase.
 * Handles all database interactions for the student remediation experience.
 */

import { createClient } from '@supabase/supabase-js'
import type {
  IStudentRemediationDbClient,
  RemediationCycle,
  RemediationAssignment,
  RemediationCycleEvent,
  RemediationCycleStatus,
} from './student-service'

// ───────────────────────────────────────────────
// Supabase Client Configuration
// ───────────────────────────────────────────────

export interface SupabaseStudentRemediationClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// ───────────────────────────────────────────────
// Supabase Database Client
// ───────────────────────────────────────────────

export class SupabaseStudentRemediationDbClient implements IStudentRemediationDbClient {
  private readonly supabase

  constructor(config: SupabaseStudentRemediationClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  // ───────────────────────────────────────────────
  // Cycle Operations
  // ───────────────────────────────────────────────

  async getCycleById(cycleId: string): Promise<RemediationCycle | null> {
    const { data, error } = await this.supabase
      .from('remediation_cycles')
      .select('*')
      .eq('id', cycleId)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapCycleRow(data)
  }

  async getCycleAssignments(cycleId: string): Promise<RemediationAssignment[]> {
    const { data, error } = await this.supabase
      .from('remediation_assignments')
      .select('*')
      .eq('cycle_id', cycleId)
      .order('priority', { ascending: true })

    if (error || !data) {
      return []
    }

    return data.map((row) => this.mapAssignmentRow(row))
  }

  async getCycleEvents(cycleId: string): Promise<RemediationCycleEvent[]> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_events')
      .select('*')
      .eq('cycle_id', cycleId)
      .order('created_at', { ascending: true })

    if (error || !data) {
      return []
    }

    return data.map((row) => this.mapEventRow(row))
  }

  async updateCycleStatus(
    cycleId: string,
    status: RemediationCycleStatus,
    fields?: Partial<RemediationCycle>
  ): Promise<boolean> {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (fields?.reviewStartedAt) {
      updateData.review_started_at = fields.reviewStartedAt.toISOString()
    }
    if (fields?.reviewCompletedAt) {
      updateData.review_completed_at = fields.reviewCompletedAt.toISOString()
    }
    if (fields?.reassessmentStartedAt) {
      updateData.reassessment_started_at = fields.reassessmentStartedAt.toISOString()
    }
    if (fields?.reassessmentCompletedAt) {
      updateData.reassessment_completed_at = fields.reassessmentCompletedAt.toISOString()
    }
    if (fields?.evaluatedAt) {
      updateData.evaluated_at = fields.evaluatedAt.toISOString()
    }
    if (fields?.outcome) {
      updateData.outcome = fields.outcome
    }

    const { error } = await this.supabase
      .from('remediation_cycles')
      .update(updateData)
      .eq('id', cycleId)

    return !error
  }

  async recordCycleEvent(
    cycleId: string,
    eventType: string,
    eventData: Record<string, unknown> = {}
  ): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_events')
      .insert({
        cycle_id: cycleId,
        event_type: eventType,
        event_data: eventData,
      })
      .select('id')
      .single()

    if (error || !data) {
      return null
    }

    return data.id
  }

  async updateAssignmentStatus(
    assignmentId: string,
    status: 'started' | 'completed'
  ): Promise<boolean> {
    const updateData: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }

    if (status === 'started') {
      updateData.started_at = new Date().toISOString()
    } else if (status === 'completed') {
      updateData.completed_at = new Date().toISOString()
    }

    const { error } = await this.supabase
      .from('remediation_assignments')
      .update(updateData)
      .eq('id', assignmentId)

    return !error
  }

  // ───────────────────────────────────────────────
  // Quiz Attempt Operations
  // ───────────────────────────────────────────────

  async createQuizAttempt(
    userId: string,
    quizId: string,
    answersJson: Record<string, string>,
    score: number,
    totalQuestions: number
  ): Promise<string | null> {
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0

    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .insert({
        user_id: userId,
        quiz_id: quizId,
        answers_json: answersJson,
        score,
        total_questions: totalQuestions,
        percentage,
        completed_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error || !data) {
      return null
    }

    return data.id
  }

  async getQuizAttemptById(attemptId: string): Promise<{
    id: string
    userId: string
    quizId: string
    answersJson: Record<string, unknown>
    completedAt: string
  } | null> {
    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .select('id, user_id, quiz_id, answers_json, completed_at')
      .eq('id', attemptId)
      .single()

    if (error || !data) {
      return null
    }

    return {
      id: data.id,
      userId: data.user_id,
      quizId: data.quiz_id,
      answersJson: data.answers_json as Record<string, unknown>,
      completedAt: data.completed_at,
    }
  }

  // ───────────────────────────────────────────────
  // Reassessment Question History
  // ───────────────────────────────────────────────

  async updateReassessmentQuestionHistory(
    reservationId: string,
    isCorrect: boolean
  ): Promise<boolean> {
    const { error } = await this.supabase
      .from('reassessment_question_history')
      .update({ is_correct: isCorrect })
      .eq('id', reservationId)

    return !error
  }

  // ───────────────────────────────────────────────
  // Row Mappers
  // ───────────────────────────────────────────────

  private mapCycleRow(row: Record<string, unknown>): RemediationCycle {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      conceptId: row.concept_id as RemediationCycle['conceptId'],
      chapterId: row.chapter_id as RemediationCycle['chapterId'],
      cycleNumber: row.cycle_number as number,
      detectionState: row.detection_state as RemediationCycle['detectionState'],
      detectionConfidence: row.detection_confidence as RemediationCycle['detectionConfidence'],
      detectionEvidence: row.detection_evidence as RemediationCycle['detectionEvidence'],
      status: row.status as RemediationCycle['status'],
      targetedAt: new Date(row.targeted_at as string),
      reviewStartedAt: row.review_started_at ? new Date(row.review_started_at as string) : null,
      reviewCompletedAt: row.review_completed_at ? new Date(row.review_completed_at as string) : null,
      reassessmentStartedAt: row.reassessment_started_at ? new Date(row.reassessment_started_at as string) : null,
      reassessmentCompletedAt: row.reassessment_completed_at ? new Date(row.reassessment_completed_at as string) : null,
      evaluatedAt: row.evaluated_at ? new Date(row.evaluated_at as string) : null,
      outcome: row.outcome as RemediationCycle['outcome'],
      postRemediationState: row.post_remediation_state as string | null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }
  }

  private mapAssignmentRow(row: Record<string, unknown>): RemediationAssignment {
    return {
      id: row.id as string,
      cycleId: row.cycle_id as string,
      assignmentType: row.assignment_type as RemediationAssignment['assignmentType'],
      assetId: row.asset_id as string,
      priority: row.priority as number,
      isPrimary: row.is_primary as boolean,
      status: row.status as RemediationAssignment['status'],
      startedAt: row.started_at ? new Date(row.started_at as string) : null,
      completedAt: row.completed_at ? new Date(row.completed_at as string) : null,
      createdAt: new Date(row.created_at as string),
      updatedAt: new Date(row.updated_at as string),
    }
  }

  private mapEventRow(row: Record<string, unknown>): RemediationCycleEvent {
    return {
      id: row.id as string,
      cycleId: row.cycle_id as string,
      eventType: row.event_type as string,
      eventData: row.event_data as Record<string, unknown>,
      createdAt: new Date(row.created_at as string),
    }
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a Supabase student remediation database client from environment variables.
 */
export function createSupabaseStudentRemediationClient(): SupabaseStudentRemediationDbClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  return new SupabaseStudentRemediationDbClient({
    url,
    anonKey,
    serviceRoleKey,
  })
}
