/**
 * Phase 6C-2d — Supabase Database Client for Evaluation
 *
 * Implementation of IEvaluationDatabaseClient using Supabase.
 * Handles all database interactions for reassessment evaluation.
 */

import { createClient } from '@supabase/supabase-js'
import type {
  EvaluateCycleParams,
  EvaluateCycleResult,
  EvidenceValidationResult,
  IEvaluationDatabaseClient,
  RemediationCycleEvaluation,
} from './types'

// ───────────────────────────────────────────────
// Supabase Client Configuration
// ───────────────────────────────────────────────

export interface SupabaseEvaluationClientConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

// ───────────────────────────────────────────────
// Supabase Database Client
// ───────────────────────────────────────────────

export class SupabaseEvaluationDatabaseClient implements IEvaluationDatabaseClient {
  private readonly supabase

  constructor(config: SupabaseEvaluationClientConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  // ───────────────────────────────────────────────
  // Evaluation Operations
  // ───────────────────────────────────────────────

  async evaluateCycle(params: EvaluateCycleParams): Promise<EvaluateCycleResult> {
    const { data, error } = await this.supabase.rpc('evaluate_remediation_cycle', {
      p_cycle_id: params.cycleId,
      p_detection_state: params.detectionState,
      p_confidence: params.confidence,
      p_concept_evidence: params.conceptEvidence,
      p_evidence_ids: params.evidenceIds,
      p_idempotency_key: params.idempotencyKey,
    })

    if (error) {
      // Check if error is due to idempotency conflict
      if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
        // Fetch existing evaluation
        const existing = await this.getEvaluationByIdempotencyKey(params.idempotencyKey)
        if (existing) {
          return {
            success: true,
            evaluationId: existing.id,
            outcome: existing.outcome,
            alreadyEvaluated: true,
          }
        }
      }

      // Check if error is due to evidence validation failure (CORRECTION 1)
      if (error.message.includes('Evidence validation failed')) {
        return {
          success: false,
          error: `Evidence validation failed: ${error.message}`,
        }
      }

      // Check if error is due to terminal outcome already exists (CORRECTION 2)
      if (error.message.includes('already has terminal outcome')) {
        return {
          success: false,
          error: `Cycle already has terminal outcome: ${error.message}`,
        }
      }

      return {
        success: false,
        error: `Failed to evaluate cycle: ${error.message}`,
      }
    }

    // Fetch the created evaluation to get the outcome
    const evaluation = await this.getEvaluation(data)

    return {
      success: true,
      evaluationId: data,
      outcome: evaluation?.outcome,
      alreadyEvaluated: false,
    }
  }

  async getEvaluation(evaluationId: string): Promise<RemediationCycleEvaluation | null> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_evaluations')
      .select('*')
      .eq('id', evaluationId)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapEvaluationRow(data)
  }

  async getTerminalEvaluationByCycleId(cycleId: string): Promise<RemediationCycleEvaluation | null> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_evaluations')
      .select('*')
      .eq('cycle_id', cycleId)
      .in('outcome', ['successful', 'unsuccessful'])
      .single()

    if (error || !data) {
      return null
    }

    return this.mapEvaluationRow(data)
  }

  async getAllEvaluationsByCycleId(cycleId: string): Promise<RemediationCycleEvaluation[]> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_evaluations')
      .select('*')
      .eq('cycle_id', cycleId)
      .order('evaluated_at', { ascending: true })

    if (error || !data) {
      return []
    }

    return data.map((row) => this.mapEvaluationRow(row))
  }

  async isCycleTerminallyEvaluated(cycleId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('remediation_cycles')
      .select('outcome')
      .eq('id', cycleId)
      .single()

    if (error || !data) {
      return false
    }

    return data.outcome === 'successful' || data.outcome === 'unsuccessful'
  }

  async validateEvidence(cycleId: string, evidenceIds: string[]): Promise<EvidenceValidationResult[]> {
    const { data, error } = await this.supabase.rpc('validate_evaluation_evidence', {
      p_cycle_id: cycleId,
      p_evidence_ids: evidenceIds,
    })

    if (error || !data) {
      // Return all as invalid if validation call fails
      return evidenceIds.map((id) => ({
        evidenceId: id,
        isValid: false,
        failureReason: `Validation call failed: ${error?.message || 'Unknown error'}`,
      }))
    }

    return data.map((row: Record<string, unknown>) => ({
      evidenceId: row.evidence_id as string,
      isValid: row.is_valid as boolean,
      failureReason: row.failure_reason as string | undefined,
    }))
  }

  async getEvaluationByIdempotencyKey(idempotencyKey: string): Promise<RemediationCycleEvaluation | null> {
    const { data, error } = await this.supabase
      .from('remediation_cycle_evaluations')
      .select('*')
      .eq('evaluation_idempotency_key', idempotencyKey)
      .single()

    if (error || !data) {
      return null
    }

    return this.mapEvaluationRow(data)
  }

  // ───────────────────────────────────────────────
  // Row Mappers
  // ───────────────────────────────────────────────

  private mapEvaluationRow(row: Record<string, unknown>): RemediationCycleEvaluation {
    return {
      id: row.id as string,
      cycleId: row.cycle_id as string,
      evaluationConfidence: row.evaluation_confidence as RemediationCycleEvaluation['evaluationConfidence'],
      evaluationEvidenceIds: row.evaluation_evidence_ids as string[],
      evaluationIdempotencyKey: row.evaluation_idempotency_key as string,
      evaluationVersion: row.evaluation_version as number,
      detectionState: row.detection_state as RemediationCycleEvaluation['detectionState'],
      outcome: row.outcome as RemediationCycleEvaluation['outcome'],
      conceptEvidence: row.concept_evidence as RemediationCycleEvaluation['conceptEvidence'],
      evaluatedAt: new Date(row.evaluated_at as string),
      createdAt: new Date(row.created_at as string),
    }
  }
}

// ───────────────────────────────────────────────
// Factory Function
// ───────────────────────────────────────────────

/**
 * Create a Supabase evaluation database client from environment variables.
 */
export function createSupabaseEvaluationClient(): SupabaseEvaluationDatabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  return new SupabaseEvaluationDatabaseClient({
    url,
    anonKey,
    serviceRoleKey,
  })
}
