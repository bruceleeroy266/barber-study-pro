/**
 * Tier 2 Presentation — Instructor Diagnostics Translation
 *
 * Translates engine diagnostics into professional, readable instructor-facing
 * language for escalation surfaces. INSTRUCTOR-ONLY: this module must never be
 * imported by student-served code (enforced by a boundary test).
 *
 * Data sources are all persisted records and canonical registries:
 *   - escalation.detectionEvidence (snapshot stored at escalation creation)
 *   - detectConceptState() re-derivation over that snapshot — deterministic:
 *     the locked outcome function over the stored evidence reproduces exactly
 *     what the engine concluded at creation time
 *   - chapter2Concepts / localChapters for name resolution
 *   - chapter2InstructorNotes for coaching content
 */

import {
  detectConceptState,
  type ConceptEvidence,
  type DetectionState,
  type DetectionConfidence,
} from '@/lib/chapter-2-concepts/detection'
import { chapter2Concepts, RETIRED_CONCEPT_IDS } from '@/lib/chapter-2-concepts/concepts'
import { chapter2InstructorNotes } from '@/lib/chapter-2-instructor-notes'
import { localChapters } from '@/lib/local-data'
import type { ConceptId } from '@/lib/reassessment/types'

const conceptNameById = new Map<string, string>(
  chapter2Concepts.map((c) => [c.id as string, c.name]),
)
const retiredConceptIds = new Set<string>(RETIRED_CONCEPT_IDS as readonly string[])
const chapterTitleById = new Map<string, string>(
  localChapters.map((ch) => [ch.id, `${ch.title} (Chapter ${ch.chapter_number})`]),
)

/**
 * Resolve a concept ID to its canonical name for instructor display.
 * Unknown IDs (future/foreign chapters) degrade gracefully — never crash.
 */
export function resolveConceptName(conceptId: string): string {
  const name = conceptNameById.get(conceptId)
  if (!name) return `Unknown concept (${conceptId})`
  if (retiredConceptIds.has(conceptId)) return `${name} (retired concept)`
  return name
}

/**
 * Resolve a chapter ID to a readable title, e.g. "Life Skills (Chapter 2)".
 */
export function resolveChapterTitle(chapterId: string): string {
  const title = chapterTitleById.get(chapterId)
  if (title) return title
  const num = chapterId.replace(/^ch-/, '')
  return `Chapter ${num}`
}

/** Detection state → instructor-plain English. */
export function translateDetectionState(state: DetectionState): string {
  switch (state) {
    case 'currently_performing_well':
      return 'Performing well'
    case 'improving':
      return 'Improving after earlier misses'
    case 'emerging_weakness':
      return 'Early signs of difficulty'
    case 'repeated_weakness':
      return 'Repeated difficulty'
    case 'insufficient_evidence':
      return 'Not enough evidence yet'
  }
}

/** Confidence → instructor-plain English. */
export function translateConfidence(confidence: DetectionConfidence): string {
  switch (confidence) {
    case 'low':
      return 'low confidence — limited observations'
    case 'medium':
      return 'moderate confidence'
    case 'high':
      return 'high confidence — consistent pattern'
  }
}

function plural(n: number, singular: string, pluralForm?: string): string {
  return n === 1 ? singular : (pluralForm ?? `${singular}s`)
}

function formatShortDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  })
}

/**
 * One-line evidence summary for instructor surfaces.
 * Example: "4 misses on 5 observations across 3 questions · Aug 30 – Sep 8 · alternating right/wrong (possible guessing)"
 * Null-safe: missing dates are omitted; null evidence → null.
 */
export function buildEvidenceSummary(
  evidence: ConceptEvidence | null | undefined,
): string | null {
  if (!evidence) return null
  const { misses, totalObservations, uniqueQuestions, firstAttemptAt, lastAttemptAt, pattern } =
    evidence
  let line = `${misses} ${plural(misses, 'miss', 'misses')} on ${totalObservations} ${plural(totalObservations, 'observation')} across ${uniqueQuestions} ${plural(uniqueQuestions, 'question')}`
  const first = formatShortDate(firstAttemptAt)
  const last = formatShortDate(lastAttemptAt)
  if (first && last) {
    line += first === last ? ` · ${first}` : ` · ${first} – ${last}`
  } else if (last) {
    line += ` · last attempt ${last}`
  }
  if (pattern === 'alternating') {
    line += ' · alternating right/wrong (possible guessing)'
  }
  return line
}

/**
 * Re-derive the engine's conclusion from the stored evidence snapshot and
 * translate it. detectConceptState is deterministic over the snapshot, so the
 * labels match what the engine concluded when the snapshot was recorded.
 */
export function summarizeObservation(evidence: ConceptEvidence | null | undefined): {
  stateLabel: string
  confidenceLabel: string
} | null {
  if (!evidence) return null
  const result = detectConceptState(evidence)
  return {
    stateLabel: translateDetectionState(result.state),
    confidenceLabel: translateConfidence(result.confidence),
  }
}

/** Verbatim escalation trigger explanation. */
export function buildTriggerReason(unsuccessfulCycleCount: number): string {
  return `Escalated automatically after ${unsuccessfulCycleCount} unsuccessful remediation ${plural(unsuccessfulCycleCount, 'cycle')} within 30 days.`
}

export interface CoachingRecommendation {
  confusions: ReadonlyArray<{ topic: string; clarification: string }>
  chapterGuidance: string
  enrichmentNote: string | null
}

/**
 * Compose the suggested-coaching block for a concept from the locked
 * instructor-notes dataset: concept-specific confusions + chapter-level
 * remediation guidance + enrichment identification when applicable.
 */
export function buildCoachingRecommendation(conceptId: ConceptId): CoachingRecommendation {
  const notes = chapter2InstructorNotes
  const confusions = notes.commonConfusions
    .filter((c) => (c.conceptIds as readonly string[]).includes(conceptId))
    .map((c) => ({ topic: c.topic, clarification: c.clarification }))
  const enrichment = notes.enrichmentIdentification.find((e) => e.conceptId === conceptId)
  return {
    confusions,
    chapterGuidance: notes.remediationGuidance,
    enrichmentNote: enrichment ? enrichment.identification : null,
  }
}

/**
 * Knowledge-check tally for a student+concept from intervention history items.
 * taken  = cycles with a completed reassessment
 * passed = cycles with a successful outcome
 */
export function buildKnowledgeCheckTally(
  historyItems: ReadonlyArray<{ reassessmentCompletedAt: string | null; outcome: string | null }>,
): { taken: number; passed: number } {
  const taken = historyItems.filter((h) => h.reassessmentCompletedAt !== null).length
  const passed = historyItems.filter((h) => h.outcome === 'successful').length
  return { taken, passed }
}
