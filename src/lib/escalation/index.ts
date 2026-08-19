/**
 * Phase 6C-2c — Escalation & Sustained-Performance Reset Module
 *
 * Chapter-agnostic instructor escalation and sustained-performance reset services.
 *
 * Architecture: Application-layer canonical mapping (Option B)
 *   - Database: persistence and integrity only
 *   - Application: educational-semantic resolution
 *
 * Key Components:
 *   - EscalationService: Instructor escalation trigger and ownership management
 *   - SustainedPerformanceService: Deterministic reset eligibility and execution
 *   - SupabaseEscalationDatabaseClient: Database persistence layer
 *
 * Binding Rules (from Phase 6C-1 §3.4.1 and §3.6):
 *   - Escalation after 2 unsuccessful remediation cycles in rolling 30 days
 *   - 30 consecutive days in CPW + follow-up evidence required for reset
 *   - Instructor-owned escalations protected from automation
 *   - All audit events immutable
 *
 * Usage:
 *   ```typescript
 *   import {
 *     createEscalationService,
 *     createSustainedPerformanceService,
 *     createSupabaseEscalationClient
 *   } from '@/lib/escalation'
 *
 *   const dbClient = createSupabaseEscalationClient()
 *   const escalationService = createEscalationService(dbClient)
 *   const resetService = createSustainedPerformanceService(dbClient)
 *
 *   // Check and create escalation if threshold met
 *   if (await escalationService.shouldCreateEscalation(userId, conceptId)) {
 *     await escalationService.createEscalation(params)
 *   }
 *
 *   // Check and execute reset if eligible
 *   const eligibility = await resetService.checkResetEligibility(userId, conceptId)
 *   if (eligibility.isEligible) {
 *     await resetService.executeReset(userId, conceptId)
 *   }
 *   ```
 */

// Types
export type {
  AcknowledgeEscalationParams,
  AcknowledgeEscalationResult,
  ChapterId,
  ConceptId,
  CreateEscalationParams,
  CreateEscalationResult,
  DetectionState,
  DetectionTransitionParams,
  DetectionTransitionResult,
  EscalationEventType,
  EscalationStatus,
  ExecuteResetResult,
  FollowUpEvidence,
  IEscalationDatabaseClient,
  InstructorEscalation,
  InstructorEscalationEvent,
  RecordFollowUpEvidenceParams,
  RecordFollowUpEvidenceResult,
  ResetEligibilityResult,
  SustainedPerformanceReset,
  SustainedPerformanceTracking,
} from './types'

// Services
export { EscalationService, createEscalationService } from './escalation-service'
export { SustainedPerformanceService, createSustainedPerformanceService } from './sustained-performance-service'

// Database Client
export type { SupabaseEscalationClientConfig } from './supabase-client'
export { SupabaseEscalationDatabaseClient, createSupabaseEscalationClient } from './supabase-client'
