/**
 * Execution — Recovery Assessor
 *
 * Deterministic assessor that evaluates the recoverability of a
 * VerificationAnalysis. Assessment is informational only — it does NOT
 * perform recovery, retry execution, or repair failures.
 *
 * The assessor:
 * - uses deterministic rules only — no AI, no repository inspection.
 * - does NOT modify the analysis.
 * - does NOT retry or repair failures.
 * - never throws.
 *
 * Milestone 8.1.3: recovery assessment only.
 */

import { VerificationAnalysis, VerificationAnalysisSeverity } from './verification-analysis'
import { RecoveryAssessment, RecommendedAction } from './recovery-assessment'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Identifier recorded in assessment metadata. */
const ASSESSOR_VERSION = 'recovery-assessor@8.1.3'

/**
 * Deterministic mapping from severity to recommended action.
 */
const SEVERITY_TO_ACTION: Readonly<Record<VerificationAnalysisSeverity, RecommendedAction>> = {
  Critical: 'ManualReview',
  High: 'Retry',
  Medium: 'Retry',
  Low: 'None',
}

/**
 * Deterministic mapping from severity to recoverability.
 */
const SEVERITY_TO_RECOVERABLE: Readonly<Record<VerificationAnalysisSeverity, boolean>> = {
  Critical: false,
  High: true,
  Medium: true,
  Low: true,
}

// ============================================================================
// RECOVERY ASSESSOR
// ============================================================================

/**
 * Deterministic assessor for VerificationAnalysis recoverability.
 *
 * Evaluates whether a verification failure is recoverable based solely on
 * the analysis severity. Never throws. Never modifies the input.
 */
export class RecoveryAssessor {
  /**
   * Assesses the recoverability of the given VerificationAnalysis.
   *
   * @param analysis - The VerificationAnalysis to assess.
   * @returns An immutable RecoveryAssessment.
   */
  assess(analysis: VerificationAnalysis): RecoveryAssessment {
    const severity = analysis.severity
    const recommendedAction = SEVERITY_TO_ACTION[severity]
    const recoverable = SEVERITY_TO_RECOVERABLE[severity]

    return {
      assessmentId: `assessment-${analysis.analysisId}`,
      assessmentVersion: ASSESSOR_VERSION,
      analysisId: analysis.analysisId,
      recoverable,
      recommendedAction,
      metadata: {
        assessorVersion: ASSESSOR_VERSION,
        analysisId: analysis.analysisId,
        severity,
        assessedAt: new Date().toISOString(),
      },
    }
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

/**
 * Default assessor instance. Stateless and safe to share.
 */
export const recoveryAssessor = new RecoveryAssessor()
