import { describe, expect, it } from 'vitest'
import {
  comparePilotCheckpoints,
  previousCheckpointType,
  type FinalizedPilotCheckpoint,
} from '@/lib/pilot-measurement/report-comparisons'

const checkpoint = (
  type: FinalizedPilotCheckpoint['checkpoint_type'],
  overrides: Partial<FinalizedPilotCheckpoint['metrics']> = {},
): FinalizedPilotCheckpoint => ({
  id: type,
  checkpoint_type: type,
  target_date: '2026-10-10',
  cutoff_at: '2026-10-10T23:59:59Z',
  generated_at: '2026-10-11T00:00:00Z',
  finalized_at: '2026-10-11T00:00:00Z',
  included_student_count: 10,
  excluded_student_count: 2,
  coverage: {
    activity: { measured: 8, total: 10 },
    examReady: { measured: 8, total: 10 },
    chapterQuiz: { measured: 8, total: 10 },
    readiness: { measured: 8, total: 10 },
  },
  metrics: {
    totalActiveStudySeconds: 6000,
    averageActiveStudySeconds: 600,
    activeLearnerCount: 8,
    noActivityLearnerCount: 2,
    averageLatestExamPercentage: 70,
    examPassingRate: 50,
    averageExamElapsedSeconds: 3600,
    averageExamUnanswered: 2,
    examDomainPercentages: {},
    averageOverallProgress: 40,
    averageReadinessScore: 60,
    needsAttentionCount: 5,
    activeRemediationLearnerCount: 3,
    ...overrides,
  },
  schema_version: 'po1e-1',
})

describe('PO-1E.5 checkpoint report comparison semantics', () => {
  it('calculates percentage-point, time, and count deltas correctly', () => {
    const base = checkpoint('baseline')
    const current = checkpoint('day_30', {
      averageLatestExamPercentage: 76,
      examPassingRate: 62,
      averageReadinessScore: 67,
      averageOverallProgress: 55,
      averageActiveStudySeconds: 900,
      activeLearnerCount: 9,
      needsAttentionCount: 3,
    })
    expect(comparePilotCheckpoints(current, base)).toEqual({
      examReadyPercentagePoints: 6,
      examPassingPercentagePoints: 12,
      readinessPercentagePoints: 7,
      progressPercentagePoints: 15,
      averageStudySeconds: 300,
      activeLearnerCount: 1,
      needsAttentionCount: -2,
    })
  })

  it('does not invent deltas when either checkpoint lacks evidence', () => {
    const base = checkpoint('baseline', { averageLatestExamPercentage: null })
    const current = checkpoint('day_30', { averageLatestExamPercentage: 80 })
    expect(comparePilotCheckpoints(current, base)?.examReadyPercentagePoints).toBeNull()
  })

  it('resolves immediate prior checkpoints deterministically', () => {
    expect(previousCheckpointType('baseline')).toBeNull()
    expect(previousCheckpointType('day_30')).toBe('baseline')
    expect(previousCheckpointType('day_60')).toBe('day_30')
    expect(previousCheckpointType('day_90')).toBe('day_60')
  })
})
