/**
 * Phase 6C-2d — Reassessment Evaluation Module
 *
 * Chapter-agnostic evaluation service with deterministic outcome mapping,
 * idempotency, and concurrency safety.
 */

// Types
export type {
  EvaluationOutcome,
  EvaluationMetadata,
  RemediationCycleEvaluation,
  EvaluateCycleParams,
  EvaluateCycleResult,
  EvidenceValidationResult,
  IEvaluationDatabaseClient,
} from './types'

export { OUTCOME_MATRIX } from './types'

// Outcome Mapper (SINGLE AUTHORITATIVE implementation)
export {
  mapDetectionToOutcome,
  isPendingOutcome,
  isUnsuccessfulOutcome,
  isSuccessfulOutcome,
  isLegitimateOutcome,
  getAllOutcomeMatrixEntries,
  generateIdempotencyKey,
} from './outcome-mapper'

// Evaluation Service
export { EvaluationService, createEvaluationService } from './evaluation-service'

// Supabase Client
export {
  SupabaseEvaluationDatabaseClient,
  createSupabaseEvaluationClient,
  type SupabaseEvaluationClientConfig,
} from './supabase-client'
