/**
 * Instructor Diagnostics Translation
 *
 * Translates persisted engine diagnostics into professional instructor-facing
 * language. This module is instructor-only and resolves chapter-specific
 * concept/detection data without changing the underlying detection engines.
 */

import {
  detectConceptState as detectChapter2ConceptState,
} from '@/lib/chapter-2-concepts/detection'
import {
  detectConceptState as detectChapter3ConceptState,
} from '@/lib/chapter-3-concepts/detection'
import type {
  ConceptEvidence,
  DetectionState,
  DetectionConfidence,
} from '@/lib/concept-detection/engine'
import { chapter2InstructorNotes } from '@/lib/chapter-2-instructor-notes'
import { chapter3ConceptFamilies } from '@/lib/chapter-3-concepts/concepts'
import { localChapters } from '@/lib/local-data'
import { resolvePresentationConceptName, isChapter3PresentationConcept } from './concept-registry'
import type { ConceptId } from '@/lib/reassessment/types'

const chapterTitleById = new Map<string, string>(
  localChapters.map((ch) => [ch.id, `${ch.title} (Chapter ${ch.chapter_number})`]),
)

export function resolveConceptName(conceptId: string): string {
  return resolvePresentationConceptName(conceptId)
}

export function resolveChapterTitle(chapterId: string): string {
  const title = chapterTitleById.get(chapterId)
  if (title) return title
  const num = chapterId.replace(/^ch-/, '')
  return `Chapter ${num}`
}

export function translateDetectionState(state: DetectionState): string {
  switch (state) {
    case 'currently_performing_well': return 'Performing well'
    case 'improving': return 'Improving after earlier misses'
    case 'emerging_weakness': return 'Early signs of difficulty'
    case 'repeated_weakness': return 'Repeated difficulty'
    case 'insufficient_evidence': return 'Not enough evidence yet'
  }
}

export function translateConfidence(confidence: DetectionConfidence): string {
  switch (confidence) {
    case 'low': return 'low confidence — limited observations'
    case 'medium': return 'moderate confidence'
    case 'high': return 'high confidence — consistent pattern'
  }
}

function plural(n: number, singular: string, pluralForm?: string): string {
  return n === 1 ? singular : (pluralForm ?? `${singular}s`)
}

function formatShortDate(iso: string | null | undefined): string | null {
  if (!iso) return null
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return null
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
}

export function buildEvidenceSummary(
  evidence: ConceptEvidence | null | undefined,
): string | null {
  if (!evidence) return null
  const { misses, totalObservations, uniqueQuestions, firstAttemptAt, lastAttemptAt, pattern } = evidence
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

/** Re-derive the stored observation through the matching chapter binding. */
export function summarizeObservation(evidence: ConceptEvidence | null | undefined): {
  stateLabel: string
  confidenceLabel: string
} | null {
  if (!evidence) return null

  const result = isChapter3PresentationConcept(evidence.conceptId)
    ? detectChapter3ConceptState(evidence as Parameters<typeof detectChapter3ConceptState>[0])
    : detectChapter2ConceptState(evidence as Parameters<typeof detectChapter2ConceptState>[0])

  return {
    stateLabel: translateDetectionState(result.state),
    confidenceLabel: translateConfidence(result.confidence),
  }
}

export function buildTriggerReason(unsuccessfulCycleCount: number): string {
  return `Escalated automatically after ${unsuccessfulCycleCount} unsuccessful remediation ${plural(unsuccessfulCycleCount, 'cycle')} within 30 days.`
}

export interface CoachingRecommendation {
  confusions: ReadonlyArray<{ topic: string; clarification: string }>
  chapterGuidance: string
  enrichmentNote: string | null
}

export function buildCoachingRecommendation(conceptId: ConceptId): CoachingRecommendation {
  if (isChapter3PresentationConcept(conceptId)) {
    const family = chapter3ConceptFamilies.find((concept) => concept.id === conceptId)
    return {
      confusions: family
        ? [{ topic: family.name, clarification: family.description }]
        : [],
      chapterGuidance:
        'Use the student’s persisted evidence and targeted-review history to coach the specific Chapter 3 concept family, then have the student complete the assigned Knowledge Check before judging improvement.',
      enrichmentNote: null,
    }
  }

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

export function buildKnowledgeCheckTally(
  historyItems: ReadonlyArray<{ reassessmentCompletedAt: string | null; outcome: string | null }>,
): { taken: number; passed: number } {
  const taken = historyItems.filter((h) => h.reassessmentCompletedAt !== null).length
  const passed = historyItems.filter((h) => h.outcome === 'successful').length
  return { taken, passed }
}
