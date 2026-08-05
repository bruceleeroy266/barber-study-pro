/**
 * Task Complexity Analyzer — Complexity Weights
 *
 * Centralized, configurable default weights for each complexity factor.
 * This module holds numeric configuration only — no calculation logic.
 * Scoring and weight application live in a later milestone.
 *
 * Weights are keyed by the same identifiers used in `complexity-factors.ts`,
 * so each factor's `defaultWeightKey` resolves here. To tune the model, edit
 * `DEFAULT_COMPLEXITY_WEIGHTS` (or supply an override) — nothing else changes.
 *
 * Milestone 1: foundation only — no logic, no scoring.
 */

import { ComplexityFactor } from './complexity-factors'

// ============================================================================
// WEIGHT KEY
// ============================================================================

/**
 * The set of valid weight keys. Derived from the factor identifiers so the
 * weight configuration and the factor registry can never drift apart.
 */
export type ComplexityWeightKey = ComplexityFactor

// ============================================================================
// WEIGHT CONFIGURATION
// ============================================================================

/**
 * A complete set of weights, one per complexity factor.
 * Values are unitless relative importances; interpretation is deferred to the
 * scoring engine (Milestone 2+).
 */
export type ComplexityWeights = Record<ComplexityWeightKey, number>

// ============================================================================
// DEFAULT WEIGHTS
// ============================================================================

/**
 * Default weight for each complexity factor.
 *
 * Centralized on purpose: this is the single place to tune how much each
 * dimension contributes. Weights are relative, not normalized — the scoring
 * engine is responsible for any normalization.
 */
export const DEFAULT_COMPLEXITY_WEIGHTS: ComplexityWeights = {
  [ComplexityFactor.FilesAffected]: 1.0,
  [ComplexityFactor.ApiImpact]: 2.0,
  [ComplexityFactor.DependencyDepth]: 1.5,
  [ComplexityFactor.ArchitectureImpact]: 2.5,
  [ComplexityFactor.TestingEffort]: 1.5,
  [ComplexityFactor.DocumentationEffort]: 1.0,
  [ComplexityFactor.Ambiguity]: 2.0,
  [ComplexityFactor.Refactoring]: 2.0,
  [ComplexityFactor.ExternalIntegrations]: 1.5,
  [ComplexityFactor.EstimatedExecutionTime]: 1.0,
}

// ============================================================================
// HELPERS (lookup only — no calculation)
// ============================================================================

/**
 * Returns the default weight for a given factor.
 */
export function getDefaultWeight(key: ComplexityWeightKey): number {
  return DEFAULT_COMPLEXITY_WEIGHTS[key]
}
