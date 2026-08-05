/**
 * Execution — Verification Analyzer
 *
 * Deterministic analyzer that classifies failed verification checks into
 * categories and derives a severity. Analysis is informational only — it
 * does NOT modify the verification, retry, repair, or inspect anything
 * outside the provided ExecutionVerification.
 *
 * The analyzer:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT modify the verification.
 * - does NOT retry or repair failures.
 * - never throws.
 *
 * Milestone 8.1.2: verification failure analysis only.
 */

import { ExecutionVerification } from './execution-verification'
import {
  VerificationAnalysis,
  VerificationAnalysisSeverity,
  VerificationFailureCategory,
} from './verification-analysis'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in analysis metadata. */
const ANALYZER_VERSION = 'verification-analyzer@8.1.2'

/**
 * Deterministic mapping from known checkId to failure category.
 */
const CHECK_ID_TO_CATEGORY: Readonly<Record<string, VerificationFailureCategory>> = {
  'check-result-exists': 'MissingResult',
  'check-queue-exists': 'MissingQueue',
  'check-progress-exists': 'MissingProgress',
  'check-progress-totals': 'InvalidProgressTotals',
  'check-queue-progress-match': 'QueueMismatch',
  'check-queue-statuses-valid': 'InvalidQueueStatus',
}

/**
 * Deterministic severity ranking for each category.
 */
const CATEGORY_SEVERITY: Readonly<Record<VerificationFailureCategory, VerificationAnalysisSeverity>> = {
  MissingResult: 'Critical',
  MissingQueue: 'Critical',
  MissingProgress: 'Critical',
  InvalidProgressTotals: 'High',
  QueueMismatch: 'High',
  InvalidQueueStatus: 'Medium',
  Unknown: 'Low',
}

/**
 * Numeric severity rank used to pick the highest severity deterministically.
 */
const SEVERITY_RANK: Readonly<Record<VerificationAnalysisSeverity, number>> = {
  Low: 0,
  Medium: 1,
  High: 2,
  Critical: 3,
}

// ============================================================================
// VERIFICATION ANALYZER
// ============================================================================

/**
 * Deterministic analyzer for failed ExecutionVerification checks.
 *
 * Classifies every failed check into exactly one category and derives a
 * single deterministic severity. Never throws. Never modifies the input.
 */
export class VerificationAnalyzer {
  /**
   * Analyzes the given ExecutionVerification and classifies its failures.
   *
   * @param verification - The ExecutionVerification to analyze.
   * @returns An immutable VerificationAnalysis.
   */
  analyze(verification: ExecutionVerification): VerificationAnalysis {
    const failedChecks = verification.checks.filter((c) => !c.passed)

    const categories: VerificationFailureCategory[] = failedChecks.map(
      (check) => CHECK_ID_TO_CATEGORY[check.checkId] ?? 'Unknown'
    )

    const severity = this.determineSeverity(categories)

    return {
      analysisId: `analysis-${verification.verificationId}`,
      analysisVersion: ANALYZER_VERSION,
      verificationId: verification.verificationId,
      severity,
      categories,
      metadata: {
        analyzerVersion: ANALYZER_VERSION,
        verificationId: verification.verificationId,
        analyzedAt: new Date().toISOString(),
        totalChecks: verification.checks.length,
        failedChecks: failedChecks.length,
        categories,
      },
    }
  }

  /**
   * Deterministically selects the highest severity from the given categories.
   *
   * @param categories - The categories derived from failed checks.
   * @returns The highest severity, or Low when no categories exist.
   */
  private determineSeverity(
    categories: readonly VerificationFailureCategory[]
  ): VerificationAnalysisSeverity {
    if (categories.length === 0) {
      return 'Low'
    }

    let highest: VerificationAnalysisSeverity = 'Low'

    for (const category of categories) {
      const severity = CATEGORY_SEVERITY[category]
      if (SEVERITY_RANK[severity] > SEVERITY_RANK[highest]) {
        highest = severity
      }
    }

    return highest
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default analyzer instance. Stateless and safe to share.
 */
export const verificationAnalyzer = new VerificationAnalyzer()
