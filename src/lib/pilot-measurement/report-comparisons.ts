import type { PilotCheckpointType } from '@/lib/pilot-measurement/resolver'

export interface PilotCheckpointCoverage {
  activity: { measured: number; total: number }
  examReady: { measured: number; total: number }
  chapterQuiz: { measured: number; total: number }
  readiness: { measured: number; total: number }
}

export interface PilotCheckpointMetrics {
  totalActiveStudySeconds: number
  averageActiveStudySeconds: number | null
  activeLearnerCount: number
  noActivityLearnerCount: number
  averageLatestExamPercentage: number | null
  examPassingRate: number | null
  averageExamElapsedSeconds: number | null
  averageExamUnanswered: number | null
  examDomainPercentages: Record<string, number | null>
  averageOverallProgress: number | null
  averageReadinessScore: number | null
  needsAttentionCount: number
  activeRemediationLearnerCount: number
}

export interface FinalizedPilotCheckpoint {
  id: string
  checkpoint_type: PilotCheckpointType
  target_date: string
  cutoff_at: string
  generated_at: string
  finalized_at: string
  included_student_count: number
  excluded_student_count: number
  coverage: PilotCheckpointCoverage
  metrics: PilotCheckpointMetrics
  schema_version: string
}

export interface PilotCheckpointDelta {
  examReadyPercentagePoints: number | null
  examPassingPercentagePoints: number | null
  readinessPercentagePoints: number | null
  progressPercentagePoints: number | null
  averageStudySeconds: number | null
  activeLearnerCount: number
  needsAttentionCount: number
}

function difference(current: number | null, reference: number | null): number | null {
  if (current === null || reference === null) return null
  return Math.round((current - reference) * 10) / 10
}

export function comparePilotCheckpoints(
  current: FinalizedPilotCheckpoint,
  reference: FinalizedPilotCheckpoint | null,
): PilotCheckpointDelta | null {
  if (!reference) return null

  return {
    examReadyPercentagePoints: difference(
      current.metrics.averageLatestExamPercentage,
      reference.metrics.averageLatestExamPercentage,
    ),
    examPassingPercentagePoints: difference(
      current.metrics.examPassingRate,
      reference.metrics.examPassingRate,
    ),
    readinessPercentagePoints: difference(
      current.metrics.averageReadinessScore,
      reference.metrics.averageReadinessScore,
    ),
    progressPercentagePoints: difference(
      current.metrics.averageOverallProgress,
      reference.metrics.averageOverallProgress,
    ),
    averageStudySeconds: difference(
      current.metrics.averageActiveStudySeconds,
      reference.metrics.averageActiveStudySeconds,
    ),
    activeLearnerCount:
      current.metrics.activeLearnerCount - reference.metrics.activeLearnerCount,
    needsAttentionCount:
      current.metrics.needsAttentionCount - reference.metrics.needsAttentionCount,
  }
}

export function previousCheckpointType(type: PilotCheckpointType): PilotCheckpointType | null {
  if (type === 'baseline') return null
  if (type === 'day_30') return 'baseline'
  if (type === 'day_60') return 'day_30'
  return 'day_60'
}
