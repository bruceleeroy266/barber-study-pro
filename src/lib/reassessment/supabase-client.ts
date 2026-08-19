/**
 * Phase 6C-2b — Supabase Database Client
 *
 * Implementation of IExclusionDatabaseClient using Supabase.
 * Handles all database interactions for the historical exclusion engine.
 */

import { createClient } from '@supabase/supabase-js'
import type {
  ChapterId,
  ConceptId,
  HistoricalQuizAttempt,
  IExclusionDatabaseClient,
  QuizQuestionId,
  ReassessmentQuestionHistoryRecord,
} from './types'

// ───────────────────────────────────────────────
// Supabase Client Configuration
// ───────────────────────────────────────────────

export interface SupabaseClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// ───────────────────────────────────────────────
// Supabase Database Client
// ───────────────────────────────────────────────

export class SupabaseExclusionDatabaseClient implements IExclusionDatabaseClient {
  private readonly supabase

  constructor(config: SupabaseClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  /**
   * Get historical quiz attempts for a user.
   *
   * Fetches all completed quiz attempts with answers_json.
   * The application layer will resolve question→concept mappings.
   */
  async getHistoricalQuizAttempts(
    userId: string,
    options?: { completedOnly?: boolean }
  ): Promise<HistoricalQuizAttempt[]> {
    let query = this.supabase
      .from('quiz_attempts')
      .select('id, user_id, quiz_id, answers_json, completed_at, is_reassessment, target_concept_id, remediation_cycle_id')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (options?.completedOnly) {
      query = query.not('completed_at', 'is', null)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch historical quiz attempts: ${error.message}`)
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      quizId: row.quiz_id,
      answersJson: row.answers_json ?? {},
      completedAt: new Date(row.completed_at),
      isReassessment: row.is_reassessment ?? false,
      targetConceptId: row.target_concept_id ?? undefined,
      remediationCycleId: row.remediation_cycle_id ?? undefined,
    }))
  }

  /**
   * Get reassessment question history for a user + concept.
   *
   * This queries the persisted reassessment_question_history table only.
   * It does NOT include historical normal-quiz evidence (that's handled
   * by the application layer via answers_json processing).
   */
  async getReassessmentQuestionHistory(
    userId: string,
    conceptId: ConceptId
  ): Promise<ReassessmentQuestionHistoryRecord[]> {
    const { data, error } = await this.supabase
      .from('reassessment_question_history')
      .select('id, user_id, concept_id, question_id, quiz_attempt_id, cycle_id, is_correct, attempted_at')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .order('attempted_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch reassessment question history: ${error.message}`)
    }

    return (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      conceptId: row.concept_id,
      questionId: row.question_id,
      quizAttemptId: row.quiz_attempt_id,
      cycleId: row.cycle_id,
      isCorrect: row.is_correct,
      attemptedAt: new Date(row.attempted_at),
    }))
  }

  /**
   * Record a question attempt with concurrency protection.
   *
   * Uses the database function record_question_attempt() which implements
   * INSERT ... ON CONFLICT DO NOTHING for race-condition safety.
   *
   * Returns the record ID if inserted, NULL if already exists (concurrent insert).
   */
  async recordQuestionAttempt(
    userId: string,
    conceptId: ConceptId,
    questionId: QuizQuestionId,
    quizAttemptId: string,
    cycleId: string | null,
    isCorrect: boolean
  ): Promise<string | null> {
    const { data, error } = await this.supabase.rpc('record_question_attempt', {
      p_user_id: userId,
      p_concept_id: conceptId,
      p_question_id: questionId,
      p_quiz_attempt_id: quizAttemptId,
      p_cycle_id: cycleId,
      p_is_correct: isCorrect,
    })

    if (error) {
      throw new Error(`Failed to record question attempt: ${error.message}`)
    }

    return data ?? null
  }

  /**
   * Check and record pool exhaustion atomically.
   *
   * Uses the database function check_and_record_pool_exhaustion().
   * Returns the exhaustion record ID if pool is exhausted, NULL otherwise.
   */
  async checkAndRecordPoolExhaustion(
    userId: string,
    conceptId: ConceptId,
    chapterId: ChapterId,
    cycleId: string,
    totalQuestionsInPool: number
  ): Promise<string | null> {
    const { data, error } = await this.supabase.rpc('check_and_record_pool_exhaustion', {
      p_user_id: userId,
      p_concept_id: conceptId,
      p_chapter_id: chapterId,
      p_cycle_id: cycleId,
      p_total_questions_in_pool: totalQuestionsInPool,
    })

    if (error) {
      throw new Error(`Failed to check and record pool exhaustion: ${error.message}`)
    }

    return data ?? null
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a Supabase exclusion database client from environment variables.
 */
export function createSupabaseExclusionClient(): SupabaseExclusionDatabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  return new SupabaseExclusionDatabaseClient({
    url,
    anonKey,
    serviceRoleKey,
  })
}
