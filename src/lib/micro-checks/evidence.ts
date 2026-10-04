import type {
  SharedAttemptPhase,
  SharedDifficulty,
  SharedEvidenceRecord,
} from '@/lib/concept-mastery/shared-grading'
import type { MicroCheckAttemptSnapshot } from './attempt-state'

export interface MicroCheckEvidenceContext {
  studentId: string
  chapterId: string
  conceptFamilyId: string
  itemId: string
  difficulty: SharedDifficulty
}

export interface MicroCheckPhaseTimestamp {
  initial: string
  remediation?: string | null
}

export interface MicroCheckEvidenceRecord extends SharedEvidenceRecord {
  studentId: string
  chapterId: string
  conceptFamilyId: string
  source: 'micro_check'
  attemptPhase: Extract<SharedAttemptPhase, 'initial' | 'remediation'>
}

export interface MicroCheckEvidenceBuildInput {
  context: MicroCheckEvidenceContext
  snapshot: MicroCheckAttemptSnapshot
  timestamps: MicroCheckPhaseTimestamp
}

function evidenceKey(record: MicroCheckEvidenceRecord): string {
  return [
    record.studentId,
    record.chapterId,
    record.source,
    record.attemptPhase,
    record.itemId,
  ].join('|')
}

function assertValidSnapshotForEvidence(
  snapshot: MicroCheckAttemptSnapshot,
  timestamps: MicroCheckPhaseTimestamp,
): void {
  if (snapshot.initialCorrect === null) {
    if (snapshot.remediationCorrect !== null) {
      throw new Error('Remediation evidence cannot exist without initial evidence.')
    }
    return
  }

  if (!timestamps.initial.trim()) {
    throw new Error('Initial micro-check evidence requires a timestamp.')
  }

  if (
    snapshot.remediationCorrect !== null &&
    !timestamps.remediation?.trim()
  ) {
    throw new Error('Remediation micro-check evidence requires a timestamp.')
  }
}

export function buildMicroCheckEvidence(
  input: MicroCheckEvidenceBuildInput,
): MicroCheckEvidenceRecord[] {
  const { context, snapshot, timestamps } = input
  assertValidSnapshotForEvidence(snapshot, timestamps)

  if (snapshot.initialCorrect === null) return []

  const records: MicroCheckEvidenceRecord[] = [
    {
      studentId: context.studentId,
      chapterId: context.chapterId,
      conceptFamilyId: context.conceptFamilyId,
      source: 'micro_check',
      itemId: context.itemId,
      difficulty: context.difficulty,
      correct: snapshot.initialCorrect,
      attemptPhase: 'initial',
      timestamp: timestamps.initial,
    },
  ]

  if (snapshot.remediationCorrect !== null) {
    records.push({
      studentId: context.studentId,
      chapterId: context.chapterId,
      conceptFamilyId: context.conceptFamilyId,
      source: 'micro_check',
      itemId: context.itemId,
      difficulty: context.difficulty,
      correct: snapshot.remediationCorrect,
      attemptPhase: 'remediation',
      timestamp: timestamps.remediation as string,
    })
  }

  return records
}

export function mergeMicroCheckEvidence(
  existing: readonly MicroCheckEvidenceRecord[],
  incoming: readonly MicroCheckEvidenceRecord[],
): MicroCheckEvidenceRecord[] {
  const merged = [...existing]
  const seen = new Set(existing.map(evidenceKey))

  for (const record of incoming) {
    const key = evidenceKey(record)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(record)
  }

  return merged
}

export function initialMicroCheckEvidence(
  records: readonly MicroCheckEvidenceRecord[],
): MicroCheckEvidenceRecord[] {
  return records.filter((record) => record.attemptPhase === 'initial')
}

export function remediationMicroCheckEvidence(
  records: readonly MicroCheckEvidenceRecord[],
): MicroCheckEvidenceRecord[] {
  return records.filter((record) => record.attemptPhase === 'remediation')
}

export function calculateInitialMicroCheckPercent(
  records: readonly MicroCheckEvidenceRecord[],
): number | null {
  const initial = initialMicroCheckEvidence(records)
  if (initial.length === 0) return null

  const correct = initial.filter((record) => record.correct).length
  return Math.round((correct / initial.length) * 10000) / 100
}
