/**
 * Phase 6C-2b — Reassessment Module
 *
 * Chapter-agnostic historical exclusion engine for reassessment integrity.
 *
 * Architecture: Application-layer canonical mapping (Option B)
 *   - Database: persistence and integrity only
 *   - Application: educational-semantic resolution
 *
 * Key Components:
 *   - ICanonicalMappingProvider: Chapter-specific adapter interface
 *   - HistoricalExclusionEngine: Chapter-agnostic exclusion computation
 *   - ReassessmentService: Minimum reusable service for selection/recording
 *   - SupabaseExclusionDatabaseClient: Database persistence layer
 *
 * ✅ PRESENTATION-SAFE API:
 *   Use selectAndReserveQuestion() for all reassessment question selection.
 *   This guarantees reservation before presentation.
 *
 * Usage:
 *   ```typescript
 *   import { createReassessmentService, createSupabaseExclusionClient } from '@/lib/reassessment'
 *
 *   const dbClient = createSupabaseExclusionClient()
 *   const service = createReassessmentService(dbClient, 'ch-2')
 *
 *   // ✅ PRESENTATION-SAFE: Select AND reserve atomically
 *   const result = await service.selectAndReserveQuestion(userId, conceptId, cycleId, quizAttemptId)
 *   if (result.success) {
 *     // Question is reserved and safe to present
 *     presentQuestion(result.questionId)
 *   }
 *   ```
 */

// Types
export type {
  ChapterId,
  ConceptId,
  ExclusionComputationOptions,
  ExclusionSet,
  HistoricalQuizAttempt,
  ICanonicalMappingProvider,
  IExclusionDatabaseClient,
  IHistoricalExclusionEngine,
  PoolExhaustionState,
  QuizQuestionId,
  ReassessmentQuestionHistoryRecord,
  ReassessmentSelectionResult,
} from './types'

// Engine
export { HistoricalExclusionEngine, createHistoricalExclusionEngine } from './exclusion-engine'

// Service
export type { RecordAttemptResult, SelectAndReserveResult } from './reassessment-service'
export { ReassessmentService, createReassessmentService } from './reassessment-service'

// Database Client
export type { SupabaseClientConfig } from './supabase-client'
export { SupabaseExclusionDatabaseClient, createSupabaseExclusionClient } from './supabase-client'

// Provider Registry
export {
  getCanonicalMappingProvider,
  getMappingProviderRegistry,
  hasCanonicalMappingProvider,
  resetMappingProviderRegistry,
} from './provider-registry'

// Chapter 2 Adapter (reference implementation)
export { Chapter2MappingProvider, getChapter2MappingProvider, resetChapter2MappingProvider } from './adapters/chapter-2-adapter'
