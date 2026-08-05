/**
 * Task Complexity Analyzer — Complexity Factors
 *
 * The independent dimensions used to evaluate a task's complexity. Each factor
 * is a descriptive axis only — it carries an identifier, display metadata, and
 * a reference to its default weight. No scoring or evaluation logic lives here.
 *
 * Factors reference their default weight by the same identifier used in
 * `complexity-weights.ts`, keeping weights centralized in one place.
 *
 * Milestone 1: foundation only — no logic, no scoring.
 */

import type { ComplexityWeightKey } from './complexity-weights'

// ============================================================================
// COMPLEXITY FACTOR IDENTIFIER
// ============================================================================

/**
 * Stable identifier for each independent complexity dimension.
 */
export enum ComplexityFactor {
  FilesAffected = 'filesAffected',
  ApiImpact = 'apiImpact',
  DependencyDepth = 'dependencyDepth',
  ArchitectureImpact = 'architectureImpact',
  TestingEffort = 'testingEffort',
  DocumentationEffort = 'documentationEffort',
  Ambiguity = 'ambiguity',
  Refactoring = 'refactoring',
  ExternalIntegrations = 'externalIntegrations',
  EstimatedExecutionTime = 'estimatedExecutionTime',
}

// ============================================================================
// COMPLEXITY FACTOR DEFINITION
// ============================================================================

/**
 * Descriptive metadata for a single complexity factor.
 */
export interface ComplexityFactorDefinition {
  /** Stable identifier. */
  id: ComplexityFactor

  /** Human-readable name for display. */
  displayName: string

  /** What this dimension measures. */
  description: string

  /**
   * Reference to this factor's default weight, keyed into the centralized
   * weight configuration in `complexity-weights.ts`. This is a reference
   * only — the actual numeric weight lives in the weight configuration.
   */
  defaultWeightKey: ComplexityWeightKey
}

// ============================================================================
// COMPLEXITY FACTOR REGISTRY
// ============================================================================

/**
 * Central registry of all complexity factors, keyed by identifier.
 * Single source of truth — no factor metadata is hardcoded elsewhere.
 */
export const ComplexityFactorRegistry: Record<ComplexityFactor, ComplexityFactorDefinition> = {
  [ComplexityFactor.FilesAffected]: {
    id: ComplexityFactor.FilesAffected,
    displayName: 'Files Affected',
    description: 'How many files the task is expected to touch.',
    defaultWeightKey: ComplexityFactor.FilesAffected,
  },
  [ComplexityFactor.ApiImpact]: {
    id: ComplexityFactor.ApiImpact,
    displayName: 'API Impact',
    description: 'Whether the task changes public or internal API surfaces.',
    defaultWeightKey: ComplexityFactor.ApiImpact,
  },
  [ComplexityFactor.DependencyDepth]: {
    id: ComplexityFactor.DependencyDepth,
    displayName: 'Dependency Depth',
    description: 'How deep in the dependency graph the affected code sits.',
    defaultWeightKey: ComplexityFactor.DependencyDepth,
  },
  [ComplexityFactor.ArchitectureImpact]: {
    id: ComplexityFactor.ArchitectureImpact,
    displayName: 'Architecture Impact',
    description: 'How much the task alters structures, boundaries, or patterns.',
    defaultWeightKey: ComplexityFactor.ArchitectureImpact,
  },
  [ComplexityFactor.TestingEffort]: {
    id: ComplexityFactor.TestingEffort,
    displayName: 'Testing Effort',
    description: 'How much testing work the task requires to verify safely.',
    defaultWeightKey: ComplexityFactor.TestingEffort,
  },
  [ComplexityFactor.DocumentationEffort]: {
    id: ComplexityFactor.DocumentationEffort,
    displayName: 'Documentation Effort',
    description: 'How much documentation the task requires to stay maintainable.',
    defaultWeightKey: ComplexityFactor.DocumentationEffort,
  },
  [ComplexityFactor.Ambiguity]: {
    id: ComplexityFactor.Ambiguity,
    displayName: 'Ambiguity',
    description: 'How unclear or open to interpretation the task requirements are.',
    defaultWeightKey: ComplexityFactor.Ambiguity,
  },
  [ComplexityFactor.Refactoring]: {
    id: ComplexityFactor.Refactoring,
    displayName: 'Refactoring',
    description: 'How much existing code must be restructured to complete the task.',
    defaultWeightKey: ComplexityFactor.Refactoring,
  },
  [ComplexityFactor.ExternalIntegrations]: {
    id: ComplexityFactor.ExternalIntegrations,
    displayName: 'External Integrations',
    description: 'How many external systems or services the task interacts with.',
    defaultWeightKey: ComplexityFactor.ExternalIntegrations,
  },
  [ComplexityFactor.EstimatedExecutionTime]: {
    id: ComplexityFactor.EstimatedExecutionTime,
    displayName: 'Estimated Execution Time',
    description: 'How long the task is expected to take to complete.',
    defaultWeightKey: ComplexityFactor.EstimatedExecutionTime,
  },
}

// ============================================================================
// HELPERS (lookup only — no scoring)
// ============================================================================

/**
 * Returns the definition for a complexity factor.
 */
export function getComplexityFactorDefinition(factor: ComplexityFactor): ComplexityFactorDefinition {
  return ComplexityFactorRegistry[factor]
}

/**
 * Returns all complexity factors.
 */
export function getComplexityFactors(): ComplexityFactorDefinition[] {
  return Object.values(ComplexityFactorRegistry)
}
