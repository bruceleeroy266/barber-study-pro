/**
 * PingOS Memory Admission Controller — Core Controller
 *
 * The AdmissionController is the single gateway into PingOS memory.
 * Every memory — manual, imported, AI-generated, or learned — must pass
 * through this controller before being stored.
 *
 * Design principles:
 * - Single entry point: `admit(memory)` is the only public method.
 * - Modular rules: New rules can be added without modifying existing logic.
 * - Configurable: Limits, thresholds, and rule behavior are customizable.
 * - Audit trail: Every decision includes the triggered rule and reasoning.
 *
 * Phase 3: Admission control only — no persistence, embeddings, or AI.
 *
 * Usage:
 *   const controller = new AdmissionController(memoryManager)
 *   const result = controller.admit({
 *     title: 'RBAC permissions pattern',
 *     type: MemoryType.CodePattern,
 *     category: MemoryCategory.Engineering,
 *     source: { origin: 'code-review' },
 *     content: 'All permissions are centralized...',
 *   })
 *
 *   if (result.decision === AdmissionDecision.Accept) {
 *     manager.create(result.normalizedMemory!)
 *   }
 */

import { CreateMemoryInput } from './types'
import { MemoryLookup } from './memory-lookup'
import {
  AdmissionDecision,
  AdmissionResult,
  AdmissionRule,
  AdmissionConfig,
  AdmissionContext,
  Priority,
  DEFAULT_ADMISSION_CONFIG,
} from './admission-types'
import { getDefaultRules } from './admission-rules'

// ============================================================================
// ADMISSION CONTROLLER
// ============================================================================

export class AdmissionController {
  private readonly rules: AdmissionRule[]
  private readonly config: Required<Omit<AdmissionConfig, 'customRules' | 'postRules'>>
  private readonly memoryLookup: MemoryLookup

  /**
   * Creates a new AdmissionController.
   *
   * @param memoryLookup - Read-only interface for querying existing memories (used for duplicate detection).
   * @param config - Optional configuration overrides.
   */
  constructor(memoryLookup: MemoryLookup, config: AdmissionConfig = {}) {
    this.memoryLookup = memoryLookup

    // Merge config with defaults
    this.config = {
      ...DEFAULT_ADMISSION_CONFIG,
      ...config,
    }

    // Build rule pipeline: custom rules → default rules → post rules
    const defaultRules = getDefaultRules(this.config)
    const customRules = config.customRules ?? []
    const postRules = config.postRules ?? []

    this.rules = [...customRules, ...defaultRules, ...postRules]
  }

  /**
   * Evaluates a memory through the admission pipeline.
   *
   * @param memory - The memory input to evaluate.
   * @returns AdmissionResult with decision, priority, reason, and warnings.
   */
  admit(memory: CreateMemoryInput): AdmissionResult {
    // Build context for rules
    const context: AdmissionContext = {
      memory,
      existingMemories: this.memoryLookup.getAll().map((m) => ({
        id: m.id,
        title: m.title,
        type: m.type,
        category: m.category,
        tags: m.tags,
        content: m.content,
        source: m.source,
      })),
    }

    // Evaluate rules in order
    for (const rule of this.rules) {
      const result = rule.evaluate(context)
      if (result !== undefined) {
        return result
      }
    }

    // Fallback: should never reach here if priority-assignment rule is last
    // But if it does, accept with default priority
    return {
      decision: AdmissionDecision.Accept,
      priority: Priority.P3,
      reason: 'Accepted: fallback — no rule triggered.',
      warnings: ['No admission rule triggered; using fallback acceptance.'],
      normalizedMemory: memory,
      triggeredRule: 'fallback',
    }
  }

  /**
   * Returns the current rule pipeline (for inspection and debugging).
   */
  getRules(): readonly AdmissionRule[] {
    return this.rules
  }

  /**
   * Returns the current configuration (for inspection and debugging).
   */
  getConfig(): Readonly<Required<Omit<AdmissionConfig, 'customRules' | 'postRules'>>> {
    return this.config
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default singleton instance for convenience.
 * Prefer dependency injection for testability in production code.
 *
 * Note: Requires a MemoryLookup instance. In production, create explicitly:
 *   const controller = new AdmissionController(memoryLookup)
 */
export function createAdmissionController(
  memoryLookup: MemoryLookup,
  config?: AdmissionConfig
): AdmissionController {
  return new AdmissionController(memoryLookup, config)
}
