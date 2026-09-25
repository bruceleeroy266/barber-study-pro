import type { ConceptEvidence } from '@/lib/concept-detection/engine'

export type ConceptMasteryBand =
  | 'Needs intensive support'
  | 'Developing'
  | 'Approaching proficiency'
  | 'Strong'
  | 'Mastery demonstrated'

export interface ConceptMasteryScore {
  score: number
  band: ConceptMasteryBand
  provisional: boolean
  accuracyPercent: number
  evidenceWeight: number
  recentAdjustment: number
}

/**
 * Instructor-only evidence-adjusted 0–100 concept mastery score.
 *
 * Design goals:
 * - accuracy remains the primary signal;
 * - small samples are pulled toward a neutral 50 instead of looking definitive;
 * - independent-question diversity increases trust in the score;
 * - recent improvement/deterioration moves the score only modestly;
 * - alternating right/wrong patterns are penalized because they may reflect guessing.
 *
 * This does not replace the detection state/confidence engine and must not be
 * presented to students as an official exam score.
 */
export function calculateConceptMastery(
  evidence: ConceptEvidence | null | undefined,
): ConceptMasteryScore | null {
  if (!evidence || evidence.totalObservations <= 0) return null

  const accuracyPercent = Math.round(
    (evidence.correct / evidence.totalObservations) * 100,
  )

  const observationFactor = Math.min(1, evidence.totalObservations / 7)
  const diversityFactor = Math.min(1, evidence.uniqueQuestions / 3)
  const evidenceWeight = Math.sqrt(observationFactor * diversityFactor)

  // Shrink limited evidence toward neutral (50) instead of overstating mastery.
  const evidenceAdjustedAccuracy =
    50 + (accuracyPercent - 50) * evidenceWeight

  let recentAdjustment = 0
  if (evidence.consecutiveRecentCorrect >= 3) recentAdjustment += 8
  else if (evidence.consecutiveRecentCorrect >= 2) recentAdjustment += 5

  if (evidence.consecutiveRecentMisses >= 3) recentAdjustment -= 8
  else if (evidence.consecutiveRecentMisses >= 2) recentAdjustment -= 5

  if (evidence.pattern === 'trending_up') recentAdjustment += 3
  if (evidence.pattern === 'trending_down') recentAdjustment -= 3
  if (evidence.pattern === 'alternating') recentAdjustment -= 4

  const score = Math.round(
    Math.max(0, Math.min(100, evidenceAdjustedAccuracy + recentAdjustment)),
  )

  const provisional =
    evidence.totalObservations < 7 ||
    evidence.uniqueQuestions < 3 ||
    evidence.pattern === 'alternating'

  const band: ConceptMasteryBand =
    score >= 90 && !provisional
      ? 'Mastery demonstrated'
      : score >= 75
        ? 'Strong'
        : score >= 60
          ? 'Approaching proficiency'
          : score >= 40
            ? 'Developing'
            : 'Needs intensive support'

  return {
    score,
    band,
    provisional,
    accuracyPercent,
    evidenceWeight: Number(evidenceWeight.toFixed(3)),
    recentAdjustment,
  }
}
