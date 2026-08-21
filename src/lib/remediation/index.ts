/**
 * Phase 6C-3 — Student Remediation Module
 *
 * Student-facing remediation experience built on Phase 6C-2 infrastructure.
 *
 * Key Components:
 *   - StudentRemediationService: Orchestrates the student remediation flow
 *   - ContentFilter: Filters Chapter 2 content by concept
 *   - SupabaseStudentRemediationDbClient: Database persistence layer
 *
 * Binding Rules:
 *   - Server-side authorization: authenticated student must own the cycle
 *   - Targeted review completion required before reassessment
 *   - No clock-based cooldown
 *   - Reservation before presentation (selectAndReserveQuestion)
 *   - Never reinterpret the locked 6C-2d outcome matrix
 *   - Never expose internal detection-state terminology to students
 */

// Types
export type {
  RemediationCycle,
  RemediationAssignment,
  RemediationCycleEvent,
  RemediationCycleStatus,
  StudentRemediationState,
  RemediationContentBundle,
  ReassessmentStartResult,
  ReassessmentSubmitResult,
  IStudentRemediationDbClient,
} from './student-service'

export {
  STUDENT_STATE_LABELS,
  STUDENT_STATE_DESCRIPTIONS,
  StudentRemediationService,
  createStudentRemediationService,
} from './student-service'

// Content Filter
export {
  getConceptName,
  getContentBlockIdsForConcept,
  getFlashcardIdsForConcept,
  filterContentByConcept,
  filterFlashcardsByConcept,
  buildRemediationContentBundle,
  getQuizQuestionById,
  getConceptQuestionCount,
} from './content-filter'

// Database Client
export type { SupabaseStudentRemediationClientConfig } from './supabase-client'
export {
  SupabaseStudentRemediationDbClient,
  createSupabaseStudentRemediationClient,
} from './supabase-client'

// Detection Orchestrator (Phase 6C-5)
export type {
  DetectionOrchestrationResult,
  ConceptRequiringIntervention,
  IDetectionOrchestratorDbClient,
  SupabaseDetectionOrchestratorConfig,
} from './detection-orchestrator'
export {
  DetectionOrchestratorService,
  SupabaseDetectionOrchestratorDbClient,
  createDetectionOrchestratorService,
  createSupabaseDetectionOrchestrator,
} from './detection-orchestrator'
