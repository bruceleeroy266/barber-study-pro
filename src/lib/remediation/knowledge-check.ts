/**
 * Knowledge Check Sequencing (C3-3 Stages 5–6)
 *
 * Turns the atomic single-question reservation/submission transaction into a
 * controlled per-chapter question sequence:
 *
 *   Chapter 2: 1 question  (preserves the established production flow exactly)
 *   Chapter 3: 5 questions (the C3-3 Knowledge Check)
 *
 * All sequencing state is derived from PERSISTED data only:
 *   - answered evidence = quiz_attempts rows with remediation_cycle_id set
 *     and is_reassessment = true (server-generated, validated by 6C-2d)
 *   - open reservation = reassessment_question_history row for the cycle
 *     whose quiz_attempt_id is not (yet) a real quiz_attempts row
 *
 * That gives reload-safe recovery, replay idempotency (including the
 * wrong-answer duplicate-consumption hole the DB function cannot see), and
 * exact "Question N of M" progress — with no schema changes.
 */

import { createClient } from '@supabase/supabase-js'
import type { ChapterId } from '@/lib/reassessment/types'

// ───────────────────────────────────────────────
// Per-chapter sequence lengths
// ───────────────────────────────────────────────

/**
 * Knowledge-check length per chapter. Chapter 2 stays at 1 (established
 * behavior); Chapter 3 uses the C3-3 five-question Knowledge Check.
 * Unsupported chapters fall back to 1; chapter support itself is gated by
 * the mapping/content/detection provider registries (fail-closed).
 */
const KNOWLEDGE_CHECK_LENGTHS: Readonly<Record<string, number>> = {
  'ch-2': 1,
  'ch-3': 5,
}

export function getKnowledgeCheckLength(chapterId: ChapterId): number {
  return KNOWLEDGE_CHECK_LENGTHS[chapterId] ?? 1
}

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

export interface ReassessmentAttemptRow {
  id: string
  completed_at: string | null
}

export interface ReassessmentReservationRow {
  id: string
  question_id: string
  quiz_attempt_id: string | null
  is_correct: boolean | null
  created_at: string
}

export interface IKnowledgeCheckDbClient {
  /** The cycle's persisted reassessment evidence, oldest first. */
  getReassessmentAttemptsForCycle(
    cycleId: string,
    userId: string
  ): Promise<ReassessmentAttemptRow[]>

  /** The cycle's reservation history, oldest first. */
  getReassessmentReservationsForCycle(
    cycleId: string,
    userId: string
  ): Promise<ReassessmentReservationRow[]>

  /** Whether a quiz_attempts row exists with this ID. */
  quizAttemptExists(attemptId: string): Promise<boolean>
}

export interface KnowledgeCheckProgress {
  /** Persisted reassessment attempt IDs for the cycle, oldest first. */
  answeredAttemptIds: string[]
  answeredCount: number
  requiredCount: number
  /** True when answeredCount >= requiredCount. */
  isComplete: boolean
  /**
   * The open (reserved-but-not-consumed) reservation for the cycle, if any.
   * Detected by the reservation's quiz_attempt_id not being a real
   * quiz_attempts row (placeholder UUID) — works for both correct and
   * incorrect prior answers.
   */
  openReservation: { reservationId: string; questionId: string } | null
}

// ───────────────────────────────────────────────
// Progress derivation (persisted state only)
// ───────────────────────────────────────────────

export async function getKnowledgeCheckProgress(
  db: IKnowledgeCheckDbClient,
  cycleId: string,
  userId: string,
  requiredCount: number
): Promise<KnowledgeCheckProgress> {
  const attempts = await db.getReassessmentAttemptsForCycle(cycleId, userId)
  const answeredAttemptIds = attempts.map((a) => a.id)
  const answeredSet = new Set(answeredAttemptIds)

  const reservations = await db.getReassessmentReservationsForCycle(cycleId, userId)

  // The open reservation is the LATEST reservation whose quiz_attempt_id is
  // not a real persisted attempt (placeholder, or never consumed).
  let openReservation: KnowledgeCheckProgress['openReservation'] = null
  for (let i = reservations.length - 1; i >= 0; i--) {
    const r = reservations[i]
    if (!r.quiz_attempt_id || !answeredSet.has(r.quiz_attempt_id)) {
      openReservation = { reservationId: r.id, questionId: r.question_id }
      break
    }
  }

  const answeredCount = answeredAttemptIds.length

  return {
    answeredAttemptIds,
    answeredCount,
    requiredCount,
    isComplete: answeredCount >= requiredCount,
    openReservation,
  }
}

/**
 * Idempotent consumption check: if the given reservation has already been
 * consumed (its quiz_attempt_id is a real quiz_attempts row), return that
 * persisted attempt ID instead of consuming again. Returns null when the
 * reservation is still open (placeholder ID or missing attempt).
 *
 * This closes the duplicate-consumption hole for INCORRECT answers at the
 * application layer: the database function treats is_correct=false rows as
 * unconsumed, but a consumed wrong answer still has a real attempt ID here.
 */
export async function getConsumedAttemptId(
  db: IKnowledgeCheckDbClient,
  reservations: ReassessmentReservationRow[],
  reservationId: string
): Promise<string | null> {
  const reservation = reservations.find((r) => r.id === reservationId)
  if (!reservation?.quiz_attempt_id) {
    return null
  }
  return (await db.quizAttemptExists(reservation.quiz_attempt_id))
    ? reservation.quiz_attempt_id
    : null
}

// ───────────────────────────────────────────────
// Supabase implementation
// ───────────────────────────────────────────────

export interface SupabaseKnowledgeCheckClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export class SupabaseKnowledgeCheckClient implements IKnowledgeCheckDbClient {
  private readonly supabase

  constructor(config: SupabaseKnowledgeCheckClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  async getReassessmentAttemptsForCycle(
    cycleId: string,
    userId: string
  ): Promise<ReassessmentAttemptRow[]> {
    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .select('id, completed_at')
      .eq('remediation_cycle_id', cycleId)
      .eq('user_id', userId)
      .eq('is_reassessment', true)
      .order('completed_at', { ascending: true })

    if (error || !data) {
      return []
    }
    return data as ReassessmentAttemptRow[]
  }

  async getReassessmentReservationsForCycle(
    cycleId: string,
    userId: string
  ): Promise<ReassessmentReservationRow[]> {
    const { data, error } = await this.supabase
      .from('reassessment_question_history')
      .select('id, question_id, quiz_attempt_id, is_correct, created_at')
      .eq('cycle_id', cycleId)
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    if (error || !data) {
      return []
    }
    return data as ReassessmentReservationRow[]
  }

  async quizAttemptExists(attemptId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .select('id')
      .eq('id', attemptId)
      .maybeSingle()

    return !error && !!data
  }
}

/**
 * Create a Supabase-backed knowledge-check client from environment variables.
 */
export function createSupabaseKnowledgeCheckClient(): SupabaseKnowledgeCheckClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required'
    )
  }

  return new SupabaseKnowledgeCheckClient({ url, anonKey, serviceRoleKey })
}
