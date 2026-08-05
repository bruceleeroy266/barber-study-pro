/**
 * PingOS Memory Manager — Category Registry
 *
 * Central registry for memory categories and their associated types.
 * Provides the mapping between MemoryType and MemoryCategory, and
 * defines which types belong to which categories.
 *
 * Extensible: add new categories and types here, then update the
 * classifier to handle them.
 */

import { MemoryCategory, MemoryType } from './types'

// ============================================================================
// CATEGORY DEFINITIONS
// ============================================================================

/**
 * Metadata and configuration for each memory category.
 */
export interface CategoryDefinition {
  /** Human-readable name. */
  label: string

  /** Description of what belongs in this category. */
  description: string

  /** Default retention policy (for future use). */
  defaultRetentionDays?: number

  /** Whether this category is active or archived. */
  isActive: boolean
}

/**
 * Registry of all memory categories with their definitions.
 */
export const CategoryRegistry: Record<MemoryCategory, CategoryDefinition> = {
  [MemoryCategory.Identity]: {
    label: 'Identity',
    description: 'Core persona, user profile, and relationship memories.',
    isActive: true,
  },
  [MemoryCategory.Project]: {
    label: 'Project',
    description: 'Project-specific memories including features, architecture, and milestones.',
    isActive: true,
  },
  [MemoryCategory.Engineering]: {
    label: 'Engineering',
    description: 'Technical decisions, code patterns, bug fixes, and optimizations.',
    isActive: true,
  },
  [MemoryCategory.Decision]: {
    label: 'Decision',
    description: 'Strategic and tactical decisions with rationale and alternatives.',
    isActive: true,
  },
  [MemoryCategory.Workspace]: {
    label: 'Workspace',
    description: 'File locations, tool configurations, and environment state.',
    isActive: true,
  },
  [MemoryCategory.Archive]: {
    label: 'Archive',
    description: 'Historical records, superseded specs, and reference materials.',
    isActive: true,
  },
}

// ============================================================================
// TYPE → CATEGORY MAPPING
// ============================================================================

/**
 * Maps each MemoryType to its parent MemoryCategory.
 * Used by the classifier to route memories correctly.
 */
export const TypeToCategoryMap: Record<MemoryType, MemoryCategory> = {
  // Identity
  [MemoryType.Persona]: MemoryCategory.Identity,
  [MemoryType.UserProfile]: MemoryCategory.Identity,
  [MemoryType.Relationship]: MemoryCategory.Identity,
  [MemoryType.Preference]: MemoryCategory.Identity,

  // Project
  [MemoryType.ProjectOverview]: MemoryCategory.Project,
  [MemoryType.FeatureSpec]: MemoryCategory.Project,
  [MemoryType.ArchitectureDecision]: MemoryCategory.Project,
  [MemoryType.Milestone]: MemoryCategory.Project,

  // Engineering
  [MemoryType.CodePattern]: MemoryCategory.Engineering,
  [MemoryType.BugFix]: MemoryCategory.Engineering,
  [MemoryType.Refactor]: MemoryCategory.Engineering,
  [MemoryType.PerformanceOptimization]: MemoryCategory.Engineering,
  [MemoryType.SecurityHardening]: MemoryCategory.Engineering,

  // Decision
  [MemoryType.StrategicDecision]: MemoryCategory.Decision,
  [MemoryType.TacticalDecision]: MemoryCategory.Decision,
  [MemoryType.TradeoffAnalysis]: MemoryCategory.Decision,

  // Workspace
  [MemoryType.FileLocation]: MemoryCategory.Workspace,
  [MemoryType.ToolConfig]: MemoryCategory.Workspace,
  [MemoryType.EnvironmentState]: MemoryCategory.Workspace,
  [MemoryType.Dependency]: MemoryCategory.Workspace,

  // Archive
  [MemoryType.HistoricalRecord]: MemoryCategory.Archive,
  [MemoryType.SupersededSpec]: MemoryCategory.Archive,
  [MemoryType.ReferenceMaterial]: MemoryCategory.Archive,
}

// ============================================================================
// CATEGORY HELPERS
// ============================================================================

/**
 * Returns all MemoryTypes that belong to a given category.
 */
export function getTypesForCategory(category: MemoryCategory): MemoryType[] {
  return Object.entries(TypeToCategoryMap)
    .filter(([, cat]) => cat === category)
    .map(([type]) => type as MemoryType)
}

/**
 * Returns the category for a given memory type.
 * Throws if the type is not recognized.
 */
export function getCategoryForType(type: MemoryType): MemoryCategory {
  const category = TypeToCategoryMap[type]
  if (!category) {
    throw new Error(`Unknown memory type: ${type}`)
  }
  return category
}

/**
 * Returns all active categories.
 */
export function getActiveCategories(): MemoryCategory[] {
  return Object.entries(CategoryRegistry)
    .filter(([, def]) => def.isActive)
    .map(([cat]) => cat as MemoryCategory)
}

/**
 * Returns the definition for a category.
 */
export function getCategoryDefinition(category: MemoryCategory): CategoryDefinition {
  return CategoryRegistry[category]
}
