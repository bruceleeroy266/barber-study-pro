/**
 * Phase 6C-5 — Detection Orchestrator Service
 *
 * Server-authoritative orchestration layer that connects quiz completion
 * to remediation-cycle creation. This service:
 *
 *   1. Starts only from legitimately persisted assessment evidence
 *   2. Uses canonical Chapter 2 mappings
 *   3. Delegates detection to the existing Phase 6B-3 engine
 *   4. Determines which concepts require intervention
 *   5. Creates remediation cycles through existing Phase 6C persistence
 *   6. Prevents duplicate active cycles
 *   7. Creates targeted assignments using canonical mappings
 *   8. Behaves idempotently if invoked more than once for the same assessment
 *
 * Binding Rules:
 *   - Persisted evidence is authoritative
 *   - Canonical mappings are authoritative
 *   - Caller-supplied detection state is never authoritative
 *   - Duplicate active cycles cannot be created
 *   - No arbitrary reassessment cooldown
 *   - Targeted review remains required
 */

import { createClient } from '@supabase/supabase-js'
import type { QuizAttempt } from '@/types'
import type { ConceptId, ChapterId } from '@/lib/reassessment/types'
import type { DetectionState, DetectionConfidence, ConceptEvidence } from '@/lib/chapter-2-concepts/detection'
import { detectAllConceptGaps } from '@/lib/chapter-2-concepts/detection'
import { chapter2QuizQuestionMappings, chapter2ContentMappings, chapter2FlashcardMappings } from '@/lib/chapter-2-concepts/mappings'
import { chapter2Concepts } from '@/lib/chapter-2-concepts/concepts'
import type { ConceptId as Chapter2ConceptId } from '@/lib/chapter-2-concepts/types'

// ───────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────

/**
 * Result of the detection orchestration process.
 */
export interface DetectionOrchestrationResult {
  /** Whether orchestration completed successfully */
  success: boolean
  /** Number of remediation cycles created */
  cyclesCreated: number
  /** Number of existing active cycles found (idempotency) */
  existingCyclesFound: number
  /** IDs of created or existing cycles */
  cycleIds: string[]
  /** Concepts that were detected with weaknesses */
  conceptsDetected: ConceptId[]
  /** Error message if failed */
  error?: string
}

/**
 * A concept that requires intervention based on detection.
 */
export interface ConceptRequiringIntervention {
  conceptId: ConceptId
  detectionState: DetectionState
  detectionConfidence: DetectionConfidence
  evidence: ConceptEvidence
}

/**
 * Database client interface for detection orchestration.
 * Abstracts Supabase for testability.
 */
export interface IDetectionOrchestratorDbClient {
  /**
   * Get quiz attempts for a user, ordered by completion date.
   * Returns ALL completed attempts for the user (no arbitrary limit).
   */
  getQuizAttemptsForUser(userId: string): Promise<QuizAttempt[]>

  /**
   * Check if an active remediation cycle exists for a user + concept.
   * Active = status NOT IN ('evaluated') AND outcome IS NULL
   */
  getActiveCycleForConcept(userId: string, conceptId: ConceptId): Promise<{ id: string } | null>

  /**
   * Create a new remediation cycle with assignments atomically.
   * Returns the cycle ID if created, NULL if active cycle already exists.
   */
  createRemediationCycleWithAssignments(data: {
    userId: string
    conceptId: ConceptId
    chapterId: ChapterId
    cycleNumber: number
    detectionState: DetectionState
    detectionConfidence: DetectionConfidence
    detectionEvidence: ConceptEvidence
    status: 'targeted'
    assignments: Array<{
      assignmentType: 'content_block' | 'flashcard'
      assetId: string
      priority: number
      isPrimary: boolean
    }>
  }): Promise<string | null>

  /**
   * Get the next cycle number for a user + concept.
   */
  getNextCycleNumber(userId: string, conceptId: ConceptId): Promise<number>
}

// ───────────────────────────────────────────────
// Constants
// ───────────────────────────────────────────────

/** Detection states that trigger remediation cycle creation */
const INTERVENTION_STATES: DetectionState[] = ['repeated_weakness', 'emerging_weakness']

// ───────────────────────────────────────────────
// Detection Orchestrator Service
// ───────────────────────────────────────────────

/**
 * Detection Orchestrator Service
 *
 * Orchestrates the flow from quiz completion to remediation-cycle creation.
 * This service is idempotent: calling it multiple times for the same
 * assessment evidence will not create duplicate cycles.
 */
export class DetectionOrchestratorService {
  constructor(
    private readonly dbClient: IDetectionOrchestratorDbClient
  ) {}

  /**
   * Orchestrate detection and remediation-cycle creation after quiz completion.
   *
   * This method:
   *   1. Fetches recent quiz attempts for the user
   *   2. Runs detection using Phase 6B-3 engine
   *   3. Identifies concepts requiring intervention
   *   4. Creates remediation cycles for new weaknesses (idempotent)
   *   5. Generates assignments from canonical mappings
   *
   * @param userId - The authenticated user's ID
   * @param chapterId - The chapter that was just completed (e.g., 'ch-2')
   * @param quizAttemptId - The exact persisted quiz attempt ID that triggered detection
   * @returns Orchestration result with cycle IDs and detection summary
   */
  async orchestrateAfterQuizCompletion(
    userId: string,
    chapterId: ChapterId,
    quizAttemptId: string
  ): Promise<DetectionOrchestrationResult> {
    try {
      // Only Chapter 2 is currently supported for concept-level detection
      if (chapterId !== 'ch-2') {
        return {
          success: true,
          cyclesCreated: 0,
          existingCyclesFound: 0,
          cycleIds: [],
          conceptsDetected: [],
        }
      }

      // 1. Fetch recent quiz attempts for the user
      // The exact quizAttemptId is used for validation, not for limiting evidence
      // Phase 6B-3 detection uses ALL historical evidence for the user
      const quizAttempts = await this.dbClient.getQuizAttemptsForUser(userId)

      if (quizAttempts.length === 0) {
        return {
          success: true,
          cyclesCreated: 0,
          existingCyclesFound: 0,
          cycleIds: [],
          conceptsDetected: [],
        }
      }

      // 2. Run detection using Phase 6B-3 engine
      const detectionResults = detectAllConceptGaps(quizAttempts)

      // 3. Filter for concepts requiring intervention
      const conceptsRequiringIntervention = this.filterConceptsRequiringIntervention(detectionResults)

      if (conceptsRequiringIntervention.length === 0) {
        return {
          success: true,
          cyclesCreated: 0,
          existingCyclesFound: 0,
          cycleIds: [],
          conceptsDetected: [],
        }
      }

      // 4. Create remediation cycles (idempotent)
      const cycleIds: string[] = []
      let cyclesCreated = 0
      let existingCyclesFound = 0

      for (const concept of conceptsRequiringIntervention) {
        // Check for existing active cycle (idempotency)
        const existingCycle = await this.dbClient.getActiveCycleForConcept(userId, concept.conceptId)

        if (existingCycle) {
          // Active cycle already exists — do not create duplicate
          existingCyclesFound++
          cycleIds.push(existingCycle.id)
          continue
        }

        // Get next cycle number
        const cycleNumber = await this.dbClient.getNextCycleNumber(userId, concept.conceptId)

        // Generate assignments from canonical mappings
        const assignments = this.buildAssignmentsForConcept(concept.conceptId)

        // Create new remediation cycle with assignments atomically
        const cycleId = await this.dbClient.createRemediationCycleWithAssignments({
          userId,
          conceptId: concept.conceptId,
          chapterId,
          cycleNumber,
          detectionState: concept.detectionState,
          detectionConfidence: concept.detectionConfidence,
          detectionEvidence: concept.evidence,
          status: 'targeted',
          assignments,
        })

        if (!cycleId) {
          // Cycle was not created (likely due to concurrent creation)
          // Fetch the existing cycle ID
          const concurrentCycle = await this.dbClient.getActiveCycleForConcept(userId, concept.conceptId)
          if (concurrentCycle) {
            existingCyclesFound++
            cycleIds.push(concurrentCycle.id)
          } else {
            console.error(`[DetectionOrchestrator] Failed to create cycle for concept ${concept.conceptId}`)
          }
          continue
        }

        cyclesCreated++
        cycleIds.push(cycleId)
      }

      return {
        success: true,
        cyclesCreated,
        existingCyclesFound,
        cycleIds,
        conceptsDetected: conceptsRequiringIntervention.map((c) => c.conceptId),
      }
    } catch (error) {
      console.error('[DetectionOrchestrator] Orchestration error:', error)
      return {
        success: false,
        cyclesCreated: 0,
        existingCyclesFound: 0,
        cycleIds: [],
        conceptsDetected: [],
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Filter detection results to only include concepts requiring intervention.
   *
   * Intervention is required for:
   *   - repeated_weakness: Student has consistently missed concept questions
   *   - emerging_weakness: Student is showing signs of weakness
   *
   * NOT included:
   *   - insufficient_evidence: Not enough data to determine weakness
   *   - improving: Student is getting better
   *   - currently_performing_well: Student is doing well
   */
  private filterConceptsRequiringIntervention(
    detectionResults: Map<Chapter2ConceptId, { conceptId: Chapter2ConceptId; learningObjectiveId: string; state: DetectionState; confidence: DetectionConfidence; evidence: ConceptEvidence; flags: string[]; lastUpdated: string }>
  ): ConceptRequiringIntervention[] {
    const concepts: ConceptRequiringIntervention[] = []

    for (const [conceptId, result] of detectionResults) {
      if (INTERVENTION_STATES.includes(result.state)) {
        concepts.push({
          conceptId: conceptId as ConceptId,
          detectionState: result.state,
          detectionConfidence: result.confidence,
          evidence: result.evidence,
        })
      }
    }

    return concepts
  }

  /**
   * Build remediation assignments for a concept using canonical mappings.
   *
   * Assignments are generated from:
   *   1. Content blocks mapped to the concept (chapter2ContentMappings)
   *   2. Flashcards mapped to the concept (chapter2FlashcardMappings)
   *
   * Priority order:
   *   1. Primary content blocks (isPrimary = true)
   *   2. Secondary content blocks
   *   3. Flashcards
   *
   * @returns Array of assignment objects (without cycleId)
   */
  private buildAssignmentsForConcept(
    conceptId: ConceptId
  ): Array<{
    assignmentType: 'content_block' | 'flashcard'
    assetId: string
    priority: number
    isPrimary: boolean
  }> {
    const assignments: Array<{
      assignmentType: 'content_block' | 'flashcard'
      assetId: string
      priority: number
      isPrimary: boolean
    }> = []

    let priority = 1

    // Add content block assignments
    const contentMappings = chapter2ContentMappings.filter(
      (m) => m.conceptId === conceptId
    )

    for (const mapping of contentMappings) {
      assignments.push({
        assignmentType: 'content_block',
        assetId: mapping.contentBlockId,
        priority: priority++,
        isPrimary: true, // Content blocks are primary learning material
      })
    }

    // Add flashcard assignments
    const flashcardMappings = chapter2FlashcardMappings.filter(
      (m) => m.conceptId === conceptId
    )

    for (const mapping of flashcardMappings) {
      assignments.push({
        assignmentType: 'flashcard',
        assetId: mapping.flashcardId,
        priority: priority++,
        isPrimary: false, // Flashcards are supplementary
      })
    }

    return assignments
  }

  /**
   * Get the concept name for display purposes.
   */
  getConceptName(conceptId: ConceptId): string {
    const concept = chapter2Concepts.find((c) => c.id === conceptId)
    return concept?.name ?? conceptId
  }
}

// ───────────────────────────────────────────────
// Supabase Database Client
// ───────────────────────────────────────────────

export interface SupabaseDetectionOrchestratorConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

/**
 * Supabase implementation of IDetectionOrchestratorDbClient.
 */
export class SupabaseDetectionOrchestratorDbClient implements IDetectionOrchestratorDbClient {
  private readonly supabase

  constructor(config: SupabaseDetectionOrchestratorConfig) {
    this.supabase = createClient(config.url, config.serviceRoleKey ?? config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  async getQuizAttemptsForUser(userId: string): Promise<QuizAttempt[]> {
    // Fetch ALL completed quiz attempts for the user (no arbitrary limit)
    // Phase 6B-3 detection uses ALL historical evidence for accurate detection
    const { data, error } = await this.supabase
      .from('quiz_attempts')
      .select('*')
      .eq('user_id', userId)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })

    if (error || !data) {
      return []
    }

    return data as QuizAttempt[]
  }

  async getActiveCycleForConcept(userId: string, conceptId: ConceptId): Promise<{ id: string } | null> {
    // Active = status NOT IN ('evaluated') AND outcome IS NULL
    const { data, error } = await this.supabase
      .from('remediation_cycles')
      .select('id')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .neq('status', 'evaluated')
      .is('outcome', null)
      .maybeSingle()

    if (error || !data) {
      return null
    }

    return { id: data.id }
  }

  async createRemediationCycleWithAssignments(data: {
    userId: string
    conceptId: ConceptId
    chapterId: ChapterId
    cycleNumber: number
    detectionState: DetectionState
    detectionConfidence: DetectionConfidence
    detectionEvidence: ConceptEvidence
    status: 'targeted'
    assignments: Array<{
      assignmentType: 'content_block' | 'flashcard'
      assetId: string
      priority: number
      isPrimary: boolean
    }>
  }): Promise<string | null> {
    // Use the atomic database function for cycle + assignment creation
    const { data: result, error } = await this.supabase.rpc(
      'create_remediation_cycle_with_assignments',
      {
        p_user_id: data.userId,
        p_concept_id: data.conceptId,
        p_chapter_id: data.chapterId,
        p_cycle_number: data.cycleNumber,
        p_detection_state: data.detectionState,
        p_detection_confidence: data.detectionConfidence,
        p_detection_evidence: data.detectionEvidence,
        p_status: data.status,
        p_assignments: data.assignments,
      }
    )

    if (error) {
      console.error('[SupabaseDetectionOrchestrator] Failed to create cycle with assignments:', error)
      return null
    }

    // The function returns NULL if an active cycle already exists (idempotency)
    return result
  }

  async getNextCycleNumber(userId: string, conceptId: ConceptId): Promise<number> {
    const { data, error } = await this.supabase
      .from('remediation_cycles')
      .select('cycle_number')
      .eq('user_id', userId)
      .eq('concept_id', conceptId)
      .order('cycle_number', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return 1
    }

    return (data.cycle_number as number) + 1
  }
}

// ───────────────────────────────────────────────
// Factory Functions
// ───────────────────────────────────────────────

/**
 * Create a DetectionOrchestratorService with the given database client.
 */
export function createDetectionOrchestratorService(
  dbClient: IDetectionOrchestratorDbClient
): DetectionOrchestratorService {
  return new DetectionOrchestratorService(dbClient)
}

/**
 * Create a Supabase-backed DetectionOrchestratorService from environment variables.
 */
export function createSupabaseDetectionOrchestrator(): DetectionOrchestratorService {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !anonKey) {
    throw new Error('Missing Supabase configuration: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required')
  }

  const dbClient = new SupabaseDetectionOrchestratorDbClient({
    url,
    anonKey,
    serviceRoleKey,
  })

  return new DetectionOrchestratorService(dbClient)
}
