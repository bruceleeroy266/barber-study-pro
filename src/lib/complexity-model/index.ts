/**
 * Task Complexity Analyzer — Public API
 *
 * Re-exports the complexity model foundation: levels, factors, and weights.
 *
 * Milestone 1: foundation only — no scoring, calculators, or analyzers.
 *
 * Usage:
 *   import { ComplexityLevel, ComplexityFactor, DEFAULT_COMPLEXITY_WEIGHTS } from '@/lib/complexity-model'
 */

// Complexity Levels
export { ComplexityLevel, getComplexityLevelDefinition, getComplexityLevelsByRank } from './complexity-level'
export type { ComplexityLevelDefinition } from './complexity-level'

// Complexity Factors
export { ComplexityFactor, getComplexityFactorDefinition, getComplexityFactors } from './complexity-factors'
export type { ComplexityFactorDefinition } from './complexity-factors'

// Complexity Weights
export { DEFAULT_COMPLEXITY_WEIGHTS, getDefaultWeight } from './complexity-weights'
export type { ComplexityWeightKey, ComplexityWeights } from './complexity-weights'

// Complexity Request (input model)
export type { ComplexityRequest, FactorRawValues } from './complexity-request'

// Complexity Breakdown (per-factor contribution)
export type { ComplexityFactorBreakdown, ComplexityBreakdown } from './complexity-breakdown'

// Complexity Report (result model)
export type { ComplexityReport, ComplexityReportMetadata } from './complexity-report'

// Complexity Calculator
export { ComplexityCalculator, complexityCalculator } from './complexity-calculator'

// Complexity Confidence
export { ConfidenceLevel } from './complexity-confidence'
export type { ComplexityConfidence } from './complexity-confidence'
export {
  ConfidenceCalculator,
  confidenceCalculator,
  CONFIDENCE_DEDUCTION_RULES,
} from './complexity-confidence-calculator'
export type { ConfidenceDeductionRule } from './complexity-confidence-calculator'
