import {
  calculateChapter7ConceptMastery,
  type Chapter7Confidence,
  type Chapter7EvidenceRecord,
} from './grading'
import {
  CHAPTER7_CONCEPT_FAMILY_IDS,
  getChapter7ConceptFamily,
} from './concepts'
import type { Chapter7ConceptFamilyId } from './types'

export type Chapter7InterventionFlagType =
  | 'persistent_weakness'
  | 'remediation_failure'
  | 'repeated_safety_misses'
  | 'declining_mastery'
  | 'completion_mastery_mismatch'

export type Chapter7InterventionSeverity = 'advisory' | 'priority' | 'urgent'

export interface Chapter7MasterySnapshot {
  conceptFamilyId: Chapter7ConceptFamilyId
  mastery: number
  confidence: Chapter7Confidence
  timestamp: string
}

export interface Chapter7RemediationCycleSummary {
  conceptFamilyId: Chapter7ConceptFamilyId
  cycleId: string
  completed: boolean
  questionCount: number
  correctCount: number
  completedAt: string | null
}

export interface Chapter7PreviousActiveFlag {
  type: Chapter7InterventionFlagType
  conceptFamilyId?: Chapter7ConceptFamilyId
}

export interface Chapter7InterventionInput {
  evidence: readonly Chapter7EvidenceRecord[]
  referenceTime: string
  completionPercent: number
  overallMasteryPercent: number
  remediationCycles?: readonly Chapter7RemediationCycleSummary[]
  masterySnapshots?: readonly Chapter7MasterySnapshot[]
  previousActiveFlags?: readonly Chapter7PreviousActiveFlag[]
}

export interface Chapter7InterventionFlag {
  key: string
  type: Chapter7InterventionFlagType
  severity: Chapter7InterventionSeverity
  scope: 'concept' | 'chapter'
  conceptFamilyId?: Chapter7ConceptFamilyId
  conceptName?: string
  reason: string
  evidenceCount: number
  firstObservedAt: string | null
  mostRecentObservedAt: string | null
}

export const CHAPTER7_INTERVENTION_THRESHOLDS = {
  persistentWeakness: {
    triggerMasteryAtOrBelow: 60,
    clearMasteryAtOrAbove: 75,
    minObservations: 5,
    minUniqueItems: 4,
    minSourceTypes: 2,
  },
  remediationFailure: {
    formalQuestionCount: 5,
    passPercent: 80,
  },
  safetyMisses: {
    reviewWindow: 4,
    triggerMisses: 2,
    minUniqueItems: 3,
    minHardObservations: 2,
    clearConsecutiveCorrect: 4,
  },
  decliningMastery: {
    minSnapshots: 3,
    minSpanDays: 7,
    minDropPoints: 15,
    latestMasteryAtOrBelow: 65,
    clearMasteryAtOrAbove: 75,
    clearRecoveryPoints: 10,
  },
  completionMasteryMismatch: {
    triggerCompletionAtOrAbove: 85,
    triggerMasteryAtOrBelow: 65,
    clearMasteryAtOrAbove: 75,
    minEvidenceObservations: 8,
    minConceptFamilies: 3,
  },
} as const

const CONFIDENCE_RANK: Record<Chapter7Confidence, number> = {
  insufficient_evidence: 0,
  emerging: 1,
  developing: 2,
  proficient: 3,
  strong: 4,
}

function clampPercent(value: number): number {
  return Math.max(0, Math.min(100, value))
}

function toTime(value: string): number {
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : 0
}

function latestTimestamp(records: readonly { timestamp?: string; completedAt?: string | null }[]): string | null {
  const timestamps = records
    .map((record) => record.timestamp ?? record.completedAt ?? null)
    .filter((value): value is string => !!value)
    .sort((a, b) => toTime(a) - toTime(b))
  return timestamps.at(-1) ?? null
}

function earliestTimestamp(records: readonly { timestamp?: string; completedAt?: string | null }[]): string | null {
  const timestamps = records
    .map((record) => record.timestamp ?? record.completedAt ?? null)
    .filter((value): value is string => !!value)
    .sort((a, b) => toTime(a) - toTime(b))
  return timestamps[0] ?? null
}

function previousFlagActive(
  previous: readonly Chapter7PreviousActiveFlag[],
  type: Chapter7InterventionFlagType,
  conceptFamilyId?: Chapter7ConceptFamilyId,
): boolean {
  return previous.some(
    (flag) =>
      flag.type === type &&
      (flag.conceptFamilyId ?? null) === (conceptFamilyId ?? null),
  )
}

function conceptKey(
  type: Chapter7InterventionFlagType,
  conceptFamilyId?: Chapter7ConceptFamilyId,
): string {
  return conceptFamilyId ? `${type}:${conceptFamilyId}` : type
}

function conceptEvidence(
  allEvidence: readonly Chapter7EvidenceRecord[],
  conceptFamilyId: Chapter7ConceptFamilyId,
): Chapter7EvidenceRecord[] {
  return allEvidence
    .filter((record) => record.conceptFamilyId === conceptFamilyId)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
}

function shouldTriggerPersistentWeakness(
  evidence: readonly Chapter7EvidenceRecord[],
  referenceTime: string,
): boolean {
  const mastery = calculateChapter7ConceptMastery(evidence, referenceTime)
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.persistentWeakness
  return (
    mastery.confidence !== 'insufficient_evidence' &&
    mastery.mastery <= t.triggerMasteryAtOrBelow &&
    mastery.observationCount >= t.minObservations &&
    mastery.uniqueItemCount >= t.minUniqueItems &&
    mastery.sourceTypeCount >= t.minSourceTypes
  )
}

function shouldClearPersistentWeakness(
  evidence: readonly Chapter7EvidenceRecord[],
  referenceTime: string,
): boolean {
  const mastery = calculateChapter7ConceptMastery(evidence, referenceTime)
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.persistentWeakness
  return (
    mastery.mastery >= t.clearMasteryAtOrAbove &&
    CONFIDENCE_RANK[mastery.confidence] >= CONFIDENCE_RANK.developing
  )
}

function latestCompletedFormalCycle(
  cycles: readonly Chapter7RemediationCycleSummary[],
  conceptFamilyId: Chapter7ConceptFamilyId,
): Chapter7RemediationCycleSummary | null {
  const minCount = CHAPTER7_INTERVENTION_THRESHOLDS.remediationFailure.formalQuestionCount
  const completed = cycles
    .filter(
      (cycle) =>
        cycle.conceptFamilyId === conceptFamilyId &&
        cycle.completed &&
        cycle.completedAt &&
        cycle.questionCount >= minCount,
    )
    .sort((a, b) => toTime(a.completedAt ?? '') - toTime(b.completedAt ?? ''))
  return completed.at(-1) ?? null
}

function remediationPercent(cycle: Chapter7RemediationCycleSummary): number {
  if (cycle.questionCount <= 0) return 0
  return (cycle.correctCount / cycle.questionCount) * 100
}

function shouldTriggerRemediationFailure(cycle: Chapter7RemediationCycleSummary | null): boolean {
  if (!cycle) return false
  return remediationPercent(cycle) < CHAPTER7_INTERVENTION_THRESHOLDS.remediationFailure.passPercent
}

function shouldClearRemediationFailure(cycle: Chapter7RemediationCycleSummary | null): boolean {
  if (!cycle) return false
  return remediationPercent(cycle) >= CHAPTER7_INTERVENTION_THRESHOLDS.remediationFailure.passPercent
}

function safetyQualifyingEvidence(
  evidence: readonly Chapter7EvidenceRecord[],
): Chapter7EvidenceRecord[] {
  return evidence
    .filter(
      (record) =>
        record.conceptFamilyId === 'ch7-chemical-safety' &&
        (record.difficulty === 'application' || record.difficulty === 'scenario'),
    )
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
}

function shouldTriggerSafetyMisses(
  evidence: readonly Chapter7EvidenceRecord[],
): boolean {
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.safetyMisses
  const qualifying = safetyQualifyingEvidence(evidence)
  const window = qualifying.slice(-t.reviewWindow)
  const uniqueItems = new Set(window.map((record) => record.itemId)).size
  const misses = window.filter((record) => !record.correct).length
  return (
    window.length >= t.minUniqueItems &&
    uniqueItems >= t.minUniqueItems &&
    window.length >= t.minHardObservations &&
    misses >= t.triggerMisses
  )
}

function shouldClearSafetyMisses(
  evidence: readonly Chapter7EvidenceRecord[],
): boolean {
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.safetyMisses
  const qualifying = safetyQualifyingEvidence(evidence)
  const recent = qualifying.slice(-t.clearConsecutiveCorrect)
  return (
    recent.length === t.clearConsecutiveCorrect &&
    recent.every((record) => record.correct)
  )
}

function sortedSnapshots(
  snapshots: readonly Chapter7MasterySnapshot[],
  conceptFamilyId: Chapter7ConceptFamilyId,
): Chapter7MasterySnapshot[] {
  return snapshots
    .filter((snapshot) => snapshot.conceptFamilyId === conceptFamilyId)
    .sort((a, b) => toTime(a.timestamp) - toTime(b.timestamp))
}

function shouldTriggerDecliningMastery(
  snapshots: readonly Chapter7MasterySnapshot[],
): boolean {
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.decliningMastery
  if (snapshots.length < t.minSnapshots) return false

  const recent = snapshots.slice(-t.minSnapshots)
  const first = recent[0]
  const middle = recent[1]
  const latest = recent[recent.length - 1]
  const spanDays = Math.max(0, (toTime(latest.timestamp) - toTime(first.timestamp)) / 86_400_000)
  const drop = first.mastery - latest.mastery

  return (
    spanDays >= t.minSpanDays &&
    drop >= t.minDropPoints &&
    latest.mastery <= t.latestMasteryAtOrBelow &&
    first.mastery > middle.mastery &&
    middle.mastery > latest.mastery &&
    latest.confidence !== 'insufficient_evidence'
  )
}

function shouldClearDecliningMastery(
  snapshots: readonly Chapter7MasterySnapshot[],
): boolean {
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.decliningMastery
  if (snapshots.length < 2) return false

  const latest = snapshots.at(-1)!
  const prior = snapshots.at(-2)!
  return (
    latest.mastery >= t.clearMasteryAtOrAbove ||
    (
      latest.mastery - prior.mastery >= t.clearRecoveryPoints &&
      CONFIDENCE_RANK[latest.confidence] >= CONFIDENCE_RANK.developing
    )
  )
}

function shouldTriggerCompletionMismatch(input: Chapter7InterventionInput): boolean {
  const t = CHAPTER7_INTERVENTION_THRESHOLDS.completionMasteryMismatch
  const conceptCount = new Set(input.evidence.map((record) => record.conceptFamilyId)).size
  return (
    clampPercent(input.completionPercent) >= t.triggerCompletionAtOrAbove &&
    clampPercent(input.overallMasteryPercent) <= t.triggerMasteryAtOrBelow &&
    input.evidence.length >= t.minEvidenceObservations &&
    conceptCount >= t.minConceptFamilies
  )
}

function shouldClearCompletionMismatch(input: Chapter7InterventionInput): boolean {
  return clampPercent(input.overallMasteryPercent) >=
    CHAPTER7_INTERVENTION_THRESHOLDS.completionMasteryMismatch.clearMasteryAtOrAbove
}

export function evaluateChapter7InterventionFlags(
  input: Chapter7InterventionInput,
): Chapter7InterventionFlag[] {
  const previous = input.previousActiveFlags ?? []
  const cycles = input.remediationCycles ?? []
  const snapshots = input.masterySnapshots ?? []
  const flags: Chapter7InterventionFlag[] = []

  for (const conceptFamilyId of CHAPTER7_CONCEPT_FAMILY_IDS) {
    const evidence = conceptEvidence(input.evidence, conceptFamilyId)
    const concept = getChapter7ConceptFamily(conceptFamilyId)
    const mastery = calculateChapter7ConceptMastery(evidence, input.referenceTime)

    const persistentWasActive = previousFlagActive(previous, 'persistent_weakness', conceptFamilyId)
    const persistentActive = persistentWasActive
      ? !shouldClearPersistentWeakness(evidence, input.referenceTime)
      : shouldTriggerPersistentWeakness(evidence, input.referenceTime)

    if (persistentActive) {
      flags.push({
        key: conceptKey('persistent_weakness', conceptFamilyId),
        type: 'persistent_weakness',
        severity: 'priority',
        scope: 'concept',
        conceptFamilyId,
        conceptName: concept.name,
        reason: `${concept.name} remains weak at ${mastery.mastery}% mastery across ${mastery.observationCount} evidence observations with ${mastery.confidence.replaceAll('_', ' ')} confidence.`,
        evidenceCount: evidence.length,
        firstObservedAt: earliestTimestamp(evidence),
        mostRecentObservedAt: latestTimestamp(evidence),
      })
    }

    const latestCycle = latestCompletedFormalCycle(cycles, conceptFamilyId)
    const remediationWasActive = previousFlagActive(previous, 'remediation_failure', conceptFamilyId)
    const remediationActive = remediationWasActive
      ? !shouldClearRemediationFailure(latestCycle)
      : shouldTriggerRemediationFailure(latestCycle)

    if (remediationActive && latestCycle) {
      flags.push({
        key: conceptKey('remediation_failure', conceptFamilyId),
        type: 'remediation_failure',
        severity: 'priority',
        scope: 'concept',
        conceptFamilyId,
        conceptName: concept.name,
        reason: `Latest formal reassessment for ${concept.name} was ${Math.round(remediationPercent(latestCycle))}%, below the 80% recovery threshold.`,
        evidenceCount: latestCycle.questionCount,
        firstObservedAt: latestCycle.completedAt,
        mostRecentObservedAt: latestCycle.completedAt,
      })
    }

    const conceptSnapshots = sortedSnapshots(snapshots, conceptFamilyId)
    const declineWasActive = previousFlagActive(previous, 'declining_mastery', conceptFamilyId)
    const declineActive = declineWasActive
      ? !shouldClearDecliningMastery(conceptSnapshots)
      : shouldTriggerDecliningMastery(conceptSnapshots)

    if (declineActive) {
      const recent = conceptSnapshots.slice(-CHAPTER7_INTERVENTION_THRESHOLDS.decliningMastery.minSnapshots)
      const first = recent[0]
      const latest = recent.at(-1)
      flags.push({
        key: conceptKey('declining_mastery', conceptFamilyId),
        type: 'declining_mastery',
        severity: 'priority',
        scope: 'concept',
        conceptFamilyId,
        conceptName: concept.name,
        reason: first && latest
          ? `${concept.name} declined from ${Math.round(first.mastery)}% to ${Math.round(latest.mastery)}% across recent mastery snapshots.`
          : `${concept.name} shows a sustained decline in recent mastery evidence.`,
        evidenceCount: recent.length,
        firstObservedAt: first?.timestamp ?? null,
        mostRecentObservedAt: latest?.timestamp ?? null,
      })
    }
  }

  const safetyEvidence = conceptEvidence(input.evidence, 'ch7-chemical-safety')
  const safetyWasActive = previousFlagActive(previous, 'repeated_safety_misses', 'ch7-chemical-safety')
  const safetyActive = safetyWasActive
    ? !shouldClearSafetyMisses(safetyEvidence)
    : shouldTriggerSafetyMisses(safetyEvidence)

  if (safetyActive) {
    const qualifying = safetyQualifyingEvidence(safetyEvidence)
    const recent = qualifying.slice(-CHAPTER7_INTERVENTION_THRESHOLDS.safetyMisses.reviewWindow)
    const misses = recent.filter((record) => !record.correct).length
    const concept = getChapter7ConceptFamily('ch7-chemical-safety')
    flags.push({
      key: conceptKey('repeated_safety_misses', 'ch7-chemical-safety'),
      type: 'repeated_safety_misses',
      severity: 'urgent',
      scope: 'concept',
      conceptFamilyId: 'ch7-chemical-safety',
      conceptName: concept.name,
      reason: `${misses} of the most recent ${recent.length} high-priority safety/application observations were missed.`,
      evidenceCount: recent.length,
      firstObservedAt: earliestTimestamp(recent),
      mostRecentObservedAt: latestTimestamp(recent),
    })
  }

  const mismatchWasActive = previousFlagActive(previous, 'completion_mastery_mismatch')
  const mismatchActive = mismatchWasActive
    ? !shouldClearCompletionMismatch(input)
    : shouldTriggerCompletionMismatch(input)

  if (mismatchActive) {
    flags.push({
      key: conceptKey('completion_mastery_mismatch'),
      type: 'completion_mastery_mismatch',
      severity: 'advisory',
      scope: 'chapter',
      reason: `Chapter completion is ${Math.round(clampPercent(input.completionPercent))}% while overall mastery is ${Math.round(clampPercent(input.overallMasteryPercent))}%, indicating participation is outpacing demonstrated mastery.`,
      evidenceCount: input.evidence.length,
      firstObservedAt: earliestTimestamp(input.evidence),
      mostRecentObservedAt: latestTimestamp(input.evidence),
    })
  }

  return flags.sort((a, b) => {
    const severityRank: Record<Chapter7InterventionSeverity, number> = {
      urgent: 0,
      priority: 1,
      advisory: 2,
    }
    return (
      severityRank[a.severity] - severityRank[b.severity] ||
      a.key.localeCompare(b.key)
    )
  })
}
