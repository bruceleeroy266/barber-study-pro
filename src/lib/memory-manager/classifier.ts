/**
 * PingOS Memory Manager — Classifier / Router
 *
 * Routes memory objects to the correct category based on their type.
 * Designed to be extensible: new rules can be added without changing
 * the core routing logic.
 *
 * Phase 1: Simple rule-based classification only.
 * Future phases may add AI-assisted classification, confidence scoring,
 * and automatic category suggestion.
 */

import { MemoryCategory, MemoryType, isMemoryCategory, isMemoryType } from './types'
import { getCategoryForType, TypeToCategoryMap } from './categories'

// ============================================================================
// CLASSIFICATION RESULT
// ============================================================================

/**
 * Result of classifying a memory object.
 */
export interface ClassificationResult {
  /** The determined category. */
  category: MemoryCategory

  /** Confidence in the classification (0.0 to 1.0). */
  confidence: number

  /** Human-readable explanation of why this category was chosen. */
  reason: string

  /** Whether the classification was automatic or manual. */
  method: 'automatic' | 'manual' | 'fallback'
}

// ============================================================================
// CLASSIFIER
// ============================================================================

/**
 * Classifies a memory object and returns the correct category.
 *
 * Routing logic:
 * 1. If the memory already has a valid category, use it (manual override).
 * 2. If the memory has a valid type, look up its category from the registry.
 * 3. If neither is available, fall back to Archive with low confidence.
 *
 * @param memory - The memory object to classify (partial or complete).
 * @returns ClassificationResult with category, confidence, and reason.
 */
export function classifyMemory(memory: {
  type?: string
  category?: string
  tags?: string[]
  title?: string
  content?: string
}): ClassificationResult {
  // Rule 1: Manual override — if category is explicitly set and valid, use it.
  if (memory.category && isMemoryCategory(memory.category)) {
    return {
      category: memory.category,
      confidence: 1.0,
      reason: `Manual override: category explicitly set to "${memory.category}".`,
      method: 'manual',
    }
  }

  // Rule 2: Type-based routing — look up category from the type registry.
  if (memory.type && isMemoryType(memory.type)) {
    const category = getCategoryForType(memory.type)
    return {
      category,
      confidence: 0.95,
      reason: `Type-based routing: type "${memory.type}" maps to category "${category}".`,
      method: 'automatic',
    }
  }

  // Rule 3: Tag-based heuristics — simple keyword matching for common patterns.
  if (memory.tags && memory.tags.length > 0) {
    const tagCategory = inferCategoryFromTags(memory.tags)
    if (tagCategory) {
      return {
        category: tagCategory,
        confidence: 0.7,
        reason: `Tag-based heuristic: tags [${memory.tags.join(', ')}] suggest category "${tagCategory}".`,
        method: 'automatic',
      }
    }
  }

  // Rule 4: Content-based heuristics — simple keyword matching in title/content.
  if (memory.title || memory.content) {
    const contentCategory = inferCategoryFromContent(memory.title ?? '', memory.content ?? '')
    if (contentCategory) {
      return {
        category: contentCategory,
        confidence: 0.6,
        reason: `Content-based heuristic: title/content suggests category "${contentCategory}".`,
        method: 'automatic',
      }
    }
  }

  // Fallback: Archive with low confidence.
  return {
    category: MemoryCategory.Archive,
    confidence: 0.1,
    reason: 'No valid type, category, or heuristic match found. Defaulting to Archive.',
    method: 'fallback',
  }
}

// ============================================================================
// HEURISTIC HELPERS
// ============================================================================

/**
 * Infers category from tags using simple keyword matching.
 * Returns undefined if no confident match is found.
 */
function inferCategoryFromTags(tags: string[]): MemoryCategory | undefined {
  const tagSet = new Set(tags.map((t) => t.toLowerCase()))

  // Identity indicators
  if (tagSet.has('persona') || tagSet.has('identity') || tagSet.has('profile')) {
    return MemoryCategory.Identity
  }

  // Project indicators
  if (tagSet.has('project') || tagSet.has('feature') || tagSet.has('milestone')) {
    return MemoryCategory.Project
  }

  // Engineering indicators
  if (tagSet.has('code') || tagSet.has('bug') || tagSet.has('refactor') || tagSet.has('security')) {
    return MemoryCategory.Engineering
  }

  // Decision indicators
  if (tagSet.has('decision') || tagSet.has('strategy') || tagSet.has('tradeoff')) {
    return MemoryCategory.Decision
  }

  // Workspace indicators
  if (tagSet.has('file') || tagSet.has('config') || tagSet.has('environment') || tagSet.has('tool')) {
    return MemoryCategory.Workspace
  }

  // Archive indicators
  if (tagSet.has('archive') || tagSet.has('historical') || tagSet.has('reference') || tagSet.has('superseded')) {
    return MemoryCategory.Archive
  }

  return undefined
}

/**
 * Infers category from title/content using simple keyword matching.
 * Returns undefined if no confident match is found.
 */
function inferCategoryFromContent(title: string, content: string): MemoryCategory | undefined {
  const text = `${title} ${content}`.toLowerCase()

  // Identity indicators
  if (/\b(persona|identity|who am i|user profile|preference)\b/.test(text)) {
    return MemoryCategory.Identity
  }

  // Project indicators
  if (/\b(project|feature|milestone|architecture|roadmap|spec)\b/.test(text)) {
    return MemoryCategory.Project
  }

  // Engineering indicators
  if (/\b(code|bug|fix|refactor|performance|security|optimization|pattern)\b/.test(text)) {
    return MemoryCategory.Engineering
  }

  // Decision indicators
  if (/\b(decision|chose|because|tradeoff|alternative|strategy)\b/.test(text)) {
    return MemoryCategory.Decision
  }

  // Workspace indicators
  if (/\b(file|path|config|environment|tool|dependency|setup)\b/.test(text)) {
    return MemoryCategory.Workspace
  }

  // Archive indicators
  if (/\b(archive|historical|old|superseded|deprecated|reference)\b/.test(text)) {
    return MemoryCategory.Archive
  }

  return undefined
}

// ============================================================================
// BATCH CLASSIFICATION
// ============================================================================

/**
 * Classifies multiple memory objects in batch.
 * Returns results in the same order as input.
 */
export function classifyMemories(
  memories: Array<{
    type?: string
    category?: string
    tags?: string[]
    title?: string
    content?: string
  }>
): ClassificationResult[] {
  return memories.map(classifyMemory)
}

// ============================================================================
// VALIDATION
// ============================================================================

/**
 * Validates that a memory object has a consistent type and category.
 * Returns true if the type maps to the category, false otherwise.
 */
export function validateTypeCategoryConsistency(type: MemoryType, category: MemoryCategory): boolean {
  return TypeToCategoryMap[type] === category
}
