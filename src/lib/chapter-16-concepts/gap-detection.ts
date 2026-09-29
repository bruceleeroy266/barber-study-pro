import { CHAPTER16_CONCEPT_FAMILY_IDS, getChapter16ConceptFamily } from './concepts'
import { calculateChapter16ConceptMastery, type Chapter16EvidenceRecord } from './grading'
import { evaluateChapter16SafetyIntervention } from './safety-intervention'
import type { Chapter16ConceptFamilyId } from './types'

export interface Chapter16Gap {
  conceptFamilyId: Chapter16ConceptFamilyId
  conceptName: string
  mastery: number
  confidence: ReturnType<typeof calculateChapter16ConceptMastery>['confidence']
  observationCount: number
  sourceTypeCount: number
  initialMissCount: number
  priority: 'standard' | 'priority' | 'urgent'
  safetyEscalation: 'review' | 'urgent' | null
  reason: string
}

export const CHAPTER16_GAP_RULES = {
  targetMasteryAtOrBelow: 70,
  minInitialMisses: 2,
  minimumEvidenceForMasteryTarget: 2,
} as const

export function combineChapter16Evidence(
  ...sources: ReadonlyArray<readonly Chapter16EvidenceRecord[]>
): Chapter16EvidenceRecord[] {
  const combined: Chapter16EvidenceRecord[] = []
  const keys = new Set<string>()
  for (const records of sources) {
    for (const record of records) {
      if (record.chapterId !== 'ch-16') continue
      const key = [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|')
      if (keys.has(key)) continue
      keys.add(key)
      combined.push(record)
    }
  }
  return combined
}

export function detectChapter16EvidenceGaps(
  evidence: readonly Chapter16EvidenceRecord[],
  referenceTime: string,
): Chapter16Gap[] {
  const safety = evaluateChapter16SafetyIntervention(evidence)
  const gaps: Chapter16Gap[] = []

  for (const conceptFamilyId of CHAPTER16_CONCEPT_FAMILY_IDS) {
    const conceptEvidence = evidence.filter((record) => record.conceptFamilyId === conceptFamilyId)
    if (conceptEvidence.length === 0) continue
    const mastery = calculateChapter16ConceptMastery(conceptEvidence, referenceTime)
    const ordinary =
      (
        mastery.observationCount >= CHAPTER16_GAP_RULES.minimumEvidenceForMasteryTarget &&
        mastery.mastery <= CHAPTER16_GAP_RULES.targetMasteryAtOrBelow
      ) ||
      mastery.initialMissCount >= CHAPTER16_GAP_RULES.minInitialMisses
    const urgent = safety.level === 'urgent' && safety.affectedConceptFamilyIds.includes(conceptFamilyId)
    const priority = safety.level === 'review' && safety.conceptFamilyId === conceptFamilyId
    if (!ordinary && !urgent && !priority) continue

    const concept = getChapter16ConceptFamily(conceptFamilyId)
    gaps.push({
      conceptFamilyId,
      conceptName: concept.name,
      mastery: mastery.mastery,
      confidence: mastery.confidence,
      observationCount: mastery.observationCount,
      sourceTypeCount: mastery.sourceTypeCount,
      initialMissCount: mastery.initialMissCount,
      priority: urgent ? 'urgent' : priority ? 'priority' : 'standard',
      safetyEscalation: urgent ? 'urgent' : priority ? 'review' : null,
      reason: urgent
        ? concept.name + ' is part of the current urgent Chapter 16 safety intervention.'
        : priority
          ? concept.name + ' contains the current safety-sensitive miss and requires immediate review.'
          : concept.name + ' is weak across combined preserved evidence.',
    })
  }

  const rank = { urgent: 0, priority: 1, standard: 2 } as const
  return gaps.sort((a, b) => rank[a.priority] - rank[b.priority] || a.mastery - b.mastery)
}
