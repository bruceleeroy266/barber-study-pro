/**
 * PingOS Memory Admission Controller — Built-in Rules
 *
 * Modular admission rules that evaluate incoming memories before storage.
 * Each rule is a pure function that returns an AdmissionResult if it triggers,
 * or undefined if it does not apply.
 *
 * Rules are evaluated in order; the first rule that returns a result
 * short-circuits the pipeline.
 *
 * Extensible: add new rules here and register them in the controller,
 * or pass custom rules via AdmissionConfig.
 */

import { MemoryCategory, MemoryType, ConfidenceLevel, isMemoryCategory, isMemoryType } from './types'
import { getCategoryForType } from './categories'
import {
  AdmissionDecision,
  AdmissionResult,
  AdmissionRule,
  AdmissionContext,
  Priority,
} from './admission-types'

// ============================================================================
// HELPER: Create result shorthand
// ============================================================================

function result(
  decision: AdmissionDecision,
  priority: Priority,
  reason: string,
  triggeredRule: string,
  warnings: string[] = [],
  normalizedMemory?: AdmissionContext['memory']
): AdmissionResult {
  return { decision, priority, reason, warnings, normalizedMemory, triggeredRule }
}

// ============================================================================
// RULE 1: Required Fields
// ============================================================================

/**
 * Validates that all required fields are present and non-empty.
 * Rejects immediately if any required field is missing or blank.
 */
export const requiredFieldsRule: AdmissionRule = {
  id: 'required-fields',
  description: 'Validates that title, content, type, category, and source are present and non-empty.',

  evaluate(context: AdmissionContext): AdmissionResult | undefined {
    const { memory } = context
    const errors: string[] = []

    if (!memory.title || memory.title.trim().length === 0) {
      errors.push('title is required and cannot be empty')
    }
    if (!memory.content || memory.content.trim().length === 0) {
      errors.push('content is required and cannot be empty')
    }
    if (!memory.type) {
      errors.push('type is required')
    }
    if (!memory.category) {
      errors.push('category is required')
    }
    if (!memory.source || !memory.source.origin || memory.source.origin.trim().length === 0) {
      errors.push('source.origin is required and cannot be empty')
    }

    if (errors.length > 0) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        `Missing or empty required fields: ${errors.join('; ')}.`,
        'required-fields'
      )
    }

    return undefined
  },
}

// ============================================================================
// RULE 2: Schema Validation
// ============================================================================

/**
 * Validates that type and category are valid enum values.
 * Rejects if either is unrecognized.
 */
export const schemaValidationRule: AdmissionRule = {
  id: 'schema-validation',
  description: 'Validates that type and category are valid enum values.',

  evaluate(context: AdmissionContext): AdmissionResult | undefined {
    const { memory } = context
    const errors: string[] = []

    if (!isMemoryType(memory.type)) {
      errors.push(`Invalid memory type: "${memory.type}"`)
    }
    if (!isMemoryCategory(memory.category)) {
      errors.push(`Invalid memory category: "${memory.category}"`)
    }

    if (errors.length > 0) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        `Schema validation failed: ${errors.join('; ')}.`,
        'schema-validation'
      )
    }

    return undefined
  },
}

// ============================================================================
// RULE 3: Size Limits
// ============================================================================

/**
 * Validates that title, content, and tags do not exceed configured limits.
 * Rejects if any limit is exceeded.
 */
export function createSizeLimitsRule(config: {
  maxTitleLength: number
  maxContentLength: number
  maxTags: number
}): AdmissionRule {
  return {
    id: 'size-limits',
    description: `Validates that title <= ${config.maxTitleLength} chars, content <= ${config.maxContentLength} chars, tags <= ${config.maxTags}.`,

    evaluate(context: AdmissionContext): AdmissionResult | undefined {
      const { memory } = context
      const errors: string[] = []

      if (memory.title.length > config.maxTitleLength) {
        errors.push(`title exceeds maximum length of ${config.maxTitleLength} characters (got ${memory.title.length})`)
      }
      if (memory.content.length > config.maxContentLength) {
        errors.push(`content exceeds maximum length of ${config.maxContentLength} characters (got ${memory.content.length})`)
      }
      if (memory.tags && memory.tags.length > config.maxTags) {
        errors.push(`tags exceed maximum count of ${config.maxTags} (got ${memory.tags.length})`)
      }

      if (errors.length > 0) {
        return result(
          AdmissionDecision.Reject,
          Priority.P4,
          `Size limit exceeded: ${errors.join('; ')}.`,
          'size-limits'
        )
      }

      return undefined
    },
  }
}

// ============================================================================
// RULE 4: Transient / Debug Content Detection
// ============================================================================

/**
 * Detects and rejects memories that are clearly transient debug output,
 * console logs, stack traces, or generated timestamps with no contextual value.
 */
export const transientContentRule: AdmissionRule = {
  id: 'transient-content',
  description: 'Rejects debug output, console logs, stack traces, and transient timestamps.',

  evaluate(context: AdmissionContext): AdmissionResult | undefined {
    const { memory } = context
    const text = `${memory.title} ${memory.content}`.toLowerCase()

    // Console log patterns
    if (/\b(console\.(log|warn|error|debug|info|trace))\b/.test(text)) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        'Rejected: contains console log output with no contextual value.',
        'transient-content'
      )
    }

    // Stack trace patterns
    if (/\b(at\s+\w+\s+\(|\.js:\d+:\d+|\.ts:\d+:\d+|node_modules|error:\s+\w+error)\b/.test(text)) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        'Rejected: contains stack trace or error output with no contextual value.',
        'transient-content'
      )
    }

    // Debug output patterns
    if (/\b(debug\s*[:=]|console\s*[:=]|log\s*[:=]|trace\s*[:=])\b/.test(text)) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        'Rejected: contains debug output with no contextual value.',
        'transient-content'
      )
    }

    // Generated timestamp with no context (e.g., "2026-07-29T01:00:00Z" as entire content)
    const isoTimestampOnly = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/
    if (
      (isoTimestampOnly.test(memory.content.trim()) || dateOnly.test(memory.content.trim())) &&
      memory.title.trim().length <= 10
    ) {
      return result(
        AdmissionDecision.Reject,
        Priority.P4,
        'Rejected: generated timestamp with no contextual value.',
        'transient-content'
      )
    }

    // Temporary file patterns
    if (/\b(tmp|temp|scratch|draft|todo|fixme|hack|xxx)\b/.test(text) && memory.tags?.includes('temporary')) {
      return result(
        AdmissionDecision.ArchiveImmediately,
        Priority.P4,
        'Archived: temporary content flagged for immediate archive.',
        'transient-content'
      )
    }

    return undefined
  },
}

// ============================================================================
// RULE 5: Duplicate Detection
// ============================================================================

/**
 * Detects duplicate memories by comparing title, content, and source.
 * Uses exact matching and similarity heuristics.
 */
export function createDuplicateDetectionRule(config: {
  rejectDuplicates: boolean
  similarityThreshold: number
}): AdmissionRule {
  return {
    id: 'duplicate-detection',
    description: `Detects duplicate memories (threshold: ${config.similarityThreshold}).`,

    evaluate(context: AdmissionContext): AdmissionResult | undefined {
      if (!config.rejectDuplicates) return undefined

      const { memory, existingMemories } = context

      for (const existing of existingMemories) {
        // Exact title + content match
        if (
          existing.title.toLowerCase() === memory.title.toLowerCase() &&
          existing.content.toLowerCase() === memory.content.toLowerCase()
        ) {
          return result(
            AdmissionDecision.Reject,
            Priority.P4,
            `Rejected: exact duplicate of existing memory "${existing.id}" (same title and content).`,
            'duplicate-detection'
          )
        }

        // Same source reference + similar title (only if both have references)
        if (
          existing.source.reference &&
          memory.source.reference &&
          existing.source.reference === memory.source.reference &&
          existing.title.toLowerCase() === memory.title.toLowerCase()
        ) {
          return result(
            AdmissionDecision.Reject,
            Priority.P4,
            `Rejected: duplicate of existing memory "${existing.id}" (same source reference and title).`,
            'duplicate-detection'
          )
        }

        // High similarity on content (simple word overlap heuristic)
        // Trigger if content similarity is very high, OR if content similarity is high AND titles are similar
        const similarity = calculateSimilarity(memory.content, existing.content)
        const titleSimilarity = calculateSimilarity(memory.title, existing.title)
        
        // Very high content similarity alone is enough (near-duplicates)
        if (similarity >= 0.95) {
          return result(
            AdmissionDecision.Reject,
            Priority.P4,
            `Rejected: near-duplicate content (${(similarity * 100).toFixed(1)}% similar) to existing memory "${existing.id}".`,
            'duplicate-detection'
          )
        }
        
        // High content similarity + some title similarity
        if (similarity >= config.similarityThreshold && titleSimilarity >= 0.3) {
          return result(
            AdmissionDecision.Reject,
            Priority.P4,
            `Rejected: high similarity (${(similarity * 100).toFixed(1)}%) to existing memory "${existing.id}".`,
            'duplicate-detection'
          )
        }
      }

      return undefined
    },
  }
}

/**
 * Simple word-overlap similarity heuristic (Jaccard similarity).
 * Returns a value between 0.0 and 1.0.
 */
function calculateSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.toLowerCase().split(/\s+/).filter((w) => w.length > 3))
  const wordsB = new Set(b.toLowerCase().split(/\s+/).filter((w) => w.length > 3))

  if (wordsA.size === 0 || wordsB.size === 0) return 0

  const intersection = new Set([...wordsA].filter((w) => wordsB.has(w)))
  const union = new Set([...wordsA, ...wordsB])

  return intersection.size / union.size
}

// ============================================================================
// RULE 6: Type/Category Consistency
// ============================================================================

/**
 * Checks that the memory type maps to the assigned category.
 * Warns (or rejects if configured) on mismatch.
 */
export function createTypeCategoryConsistencyRule(config: {
  rejectOnMismatch: boolean
}): AdmissionRule {
  return {
    id: 'type-category-consistency',
    description: 'Validates that memory type maps to the assigned category.',

    evaluate(context: AdmissionContext): AdmissionResult | undefined {
      const { memory } = context

      if (!isMemoryType(memory.type) || !isMemoryCategory(memory.category)) {
        return undefined // Schema validation rule will catch this
      }

      const expectedCategory = getCategoryForType(memory.type)
      if (expectedCategory !== memory.category) {
        const warning = `Type "${memory.type}" typically belongs to category "${expectedCategory}", but was assigned to "${memory.category}".`

        if (config.rejectOnMismatch) {
          return result(
            AdmissionDecision.Reject,
            Priority.P4,
            `Rejected: ${warning}`,
            'type-category-consistency'
          )
        }

        // Warn but allow — return undefined and let the pipeline continue
        // The warning will be collected by the controller
        return undefined
      }

      return undefined
    },
  }
}

// ============================================================================
// RULE 7: Confidence Threshold
// ============================================================================

/**
 * Rejects memories below a minimum confidence threshold.
 * Default: Unverified (all memories accepted).
 */
export function createConfidenceThresholdRule(config: {
  minConfidence: ConfidenceLevel
}): AdmissionRule {
  const order = [ConfidenceLevel.Unverified, ConfidenceLevel.Low, ConfidenceLevel.Medium, ConfidenceLevel.High]

  return {
    id: 'confidence-threshold',
    description: `Rejects memories below confidence level "${config.minConfidence}".`,

    evaluate(context: AdmissionContext): AdmissionResult | undefined {
      const { memory } = context
      const memoryIndex = order.indexOf(memory.confidence ?? ConfidenceLevel.Unverified)
      const minIndex = order.indexOf(config.minConfidence)

      if (memoryIndex < minIndex) {
        return result(
          AdmissionDecision.Reject,
          Priority.P4,
          `Rejected: confidence level "${memory.confidence ?? 'unverified'}" is below minimum required "${config.minConfidence}".`,
          'confidence-threshold'
        )
      }

      return undefined
    },
  }
}

// ============================================================================
// RULE 8: Priority Assignment
// ============================================================================

/**
 * Assigns a priority level based on category, type, and verification status.
 * This rule always triggers and should be the last rule in the pipeline.
 */
export const priorityAssignmentRule: AdmissionRule = {
  id: 'priority-assignment',
  description: 'Assigns priority level based on category, type, and verification status.',

  evaluate(context: AdmissionContext): AdmissionResult | undefined {
    const { memory } = context
    const warnings: string[] = []

    // Check for type/category mismatch warning
    if (isMemoryType(memory.type) && isMemoryCategory(memory.category)) {
      const expectedCategory = getCategoryForType(memory.type)
      if (expectedCategory !== memory.category) {
        warnings.push(
          `Type "${memory.type}" typically belongs to category "${expectedCategory}", but was assigned to "${memory.category}".`
        )
      }
    }

    // P0 — Permanent: Identity, mission, engineering principles
    if (memory.category === MemoryCategory.Identity) {
      return result(
        AdmissionDecision.Accept,
        Priority.P0,
        'Accepted: Identity memory — permanent priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P1 — Long-term: Architecture, project decisions
    if (
      memory.type === MemoryType.ArchitectureDecision ||
      memory.type === MemoryType.StrategicDecision ||
      memory.type === MemoryType.ProjectOverview
    ) {
      return result(
        AdmissionDecision.Accept,
        Priority.P1,
        `Accepted: ${memory.type} — long-term priority.`,
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P2 — Important: Engineering solutions, verified bugs
    if (
      memory.category === MemoryCategory.Engineering &&
      (memory.verified || memory.confidence === ConfidenceLevel.High)
    ) {
      return result(
        AdmissionDecision.Accept,
        Priority.P2,
        'Accepted: Verified engineering memory — important priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P2 — Important: Decision memories
    if (memory.category === MemoryCategory.Decision) {
      return result(
        AdmissionDecision.Accept,
        Priority.P2,
        'Accepted: Decision memory — important priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P3 — Temporary: Workspace, current sprint, active tasks
    if (memory.category === MemoryCategory.Workspace) {
      return result(
        AdmissionDecision.Accept,
        Priority.P3,
        'Accepted: Workspace memory — temporary priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P3 — Temporary: Unverified engineering memories
    if (memory.category === MemoryCategory.Engineering && !memory.verified) {
      return result(
        AdmissionDecision.Accept,
        Priority.P3,
        'Accepted: Unverified engineering memory — temporary priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // P4 — Ephemeral: Archive, historical, reference
    if (memory.category === MemoryCategory.Archive) {
      return result(
        AdmissionDecision.ArchiveImmediately,
        Priority.P4,
        'Archived: Archive memory — ephemeral priority.',
        'priority-assignment',
        warnings,
        memory
      )
    }

    // Default: P3 — Temporary
    return result(
      AdmissionDecision.Accept,
      Priority.P3,
      'Accepted: Default temporary priority.',
      'priority-assignment',
      warnings,
      memory
    )
  },
}

// ============================================================================
// DEFAULT RULE PIPELINE
// ============================================================================

/**
 * Returns the default set of admission rules in evaluation order.
 *
 * Order matters:
 * 1. Required fields (fast fail)
 * 2. Schema validation (fast fail)
 * 3. Size limits (fast fail)
 * 4. Transient content detection (reject debug/logs)
 * 5. Duplicate detection (reject duplicates)
 * 6. Type/category consistency (warn or reject)
 * 7. Confidence threshold (reject low confidence)
 * 8. Priority assignment (always triggers — assigns priority)
 */
export function getDefaultRules(config: {
  maxTitleLength: number
  maxContentLength: number
  maxTags: number
  rejectDuplicates: boolean
  duplicateSimilarityThreshold: number
  rejectOnTypeCategoryMismatch: boolean
  minConfidenceForAcceptance: ConfidenceLevel
}): AdmissionRule[] {
  return [
    requiredFieldsRule,
    schemaValidationRule,
    createSizeLimitsRule({
      maxTitleLength: config.maxTitleLength,
      maxContentLength: config.maxContentLength,
      maxTags: config.maxTags,
    }),
    transientContentRule,
    createDuplicateDetectionRule({
      rejectDuplicates: config.rejectDuplicates,
      similarityThreshold: config.duplicateSimilarityThreshold,
    }),
    createTypeCategoryConsistencyRule({
      rejectOnMismatch: config.rejectOnTypeCategoryMismatch,
    }),
    createConfidenceThresholdRule({
      minConfidence: config.minConfidenceForAcceptance,
    }),
    priorityAssignmentRule,
  ]
}
