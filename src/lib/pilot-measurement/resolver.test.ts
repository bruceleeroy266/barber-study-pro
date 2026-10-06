import { describe, expect, it } from 'vitest'
import type { Profile } from '@/types'
import { buildPilotCheckpointWindow, resolvePilotMeasurement } from '@/lib/pilot-measurement/resolver'

const profile = (id: string, included = true): Profile => ({
  id,
  email: `${id}@example.com`,
  full_name: id,
  role: 'student',
  school_id: 'school-1',
  barber_shop_name: null,
  mentor_name: null,
  avatar_url: null,
  approval_status: 'approved',
  is_disabled: false,
  include_in_school_metrics: included,
  approved_by: null,
  approved_at: null,
  requires_password_change: false,
  created_at: '2026-10-01T00:00:00.000Z',
  updated_at: '2026-10-01T00:00:00.000Z',
})

describe('PO-1E.1 pilot measurement resolver', () => {
  it('builds deterministic baseline/30/60/90 target dates', () => {
    expect(buildPilotCheckpointWindow('2026-10-10', 'baseline').targetDate).toBe('2026-10-10')
    expect(buildPilotCheckpointWindow('2026-10-10', 'day_30').targetDate).toBe('2026-11-09')
    expect(buildPilotCheckpointWindow('2026-10-10', 'day_60').targetDate).toBe('2026-12-09')
    expect(buildPilotCheckpointWindow('2026-10-10', 'day_90').targetDate).toBe('2027-01-08')
  })

  it('keeps excluded learners visible but out of aggregate metrics', () => {
    const snapshot = resolvePilotMeasurement({
      schoolId: 'school-1',
      students: [profile('included'), profile('excluded', false)],
      progress: [],
      quizAttempts: [],
      remediation: [],
      studyActivity: [
        { user_id: 'included', study_date: '2026-10-10', active_seconds: 600, last_active_at: '2026-10-10T10:00:00Z' },
        { user_id: 'excluded', study_date: '2026-10-10', active_seconds: 3600, last_active_at: '2026-10-10T10:00:00Z' },
      ],
      examAttempts: [
        { id:'e1', user_id:'included', status:'completed', started_at:'2026-10-10T09:00:00Z', completed_at:'2026-10-10T10:00:00Z', attempt_number:1, percentage:80, passed:true, domain_breakdown:null, elapsed_seconds:3600, unanswered_at_submit:0 },
        { id:'e2', user_id:'excluded', status:'completed', started_at:'2026-10-10T09:00:00Z', completed_at:'2026-10-10T10:00:00Z', attempt_number:1, percentage:100, passed:true, domain_breakdown:null, elapsed_seconds:3600, unanswered_at_submit:0 },
      ],
      window: buildPilotCheckpointWindow('2026-10-10', 'baseline'),
    })

    expect(snapshot.learners).toHaveLength(2)
    expect(snapshot.includedStudentCount).toBe(1)
    expect(snapshot.excludedStudentCount).toBe(1)
    expect(snapshot.metrics.totalActiveStudySeconds).toBe(600)
    expect(snapshot.metrics.averageLatestExamPercentage).toBe(80)
    expect(snapshot.coverage.examReady).toEqual({ measured: 1, total: 1 })
  })

  it('uses latest completed Exam Ready attempt at or before cutoff', () => {
    const snapshot = resolvePilotMeasurement({
      schoolId: 'school-1',
      students: [profile('s1')],
      progress: [],
      quizAttempts: [],
      remediation: [],
      studyActivity: [],
      examAttempts: [
        { id:'e1', user_id:'s1', status:'completed', started_at:'2026-10-01T09:00:00Z', completed_at:'2026-10-01T10:00:00Z', attempt_number:1, percentage:60, passed:false, domain_breakdown:null, elapsed_seconds:3600, unanswered_at_submit:2 },
        { id:'e2', user_id:'s1', status:'completed', started_at:'2026-10-09T09:00:00Z', completed_at:'2026-10-09T10:00:00Z', attempt_number:2, percentage:82, passed:true, domain_breakdown:null, elapsed_seconds:3500, unanswered_at_submit:0 },
        { id:'future', user_id:'s1', status:'completed', started_at:'2026-10-12T09:00:00Z', completed_at:'2026-10-12T10:00:00Z', attempt_number:3, percentage:99, passed:true, domain_breakdown:null, elapsed_seconds:3000, unanswered_at_submit:0 },
      ],
      window: buildPilotCheckpointWindow('2026-10-10', 'baseline'),
    })

    expect(snapshot.learners[0].latestExam?.id).toBe('e2')
    expect(snapshot.metrics.averageLatestExamPercentage).toBe(82)
  })

  it('reports missing evidence as null/coverage rather than false zero performance', () => {
    const snapshot = resolvePilotMeasurement({
      schoolId: 'school-1',
      students: [profile('s1')],
      progress: [],
      quizAttempts: [],
      remediation: [],
      studyActivity: [],
      examAttempts: [],
      window: buildPilotCheckpointWindow('2026-10-10', 'baseline'),
    })

    expect(snapshot.metrics.averageLatestExamPercentage).toBeNull()
    expect(snapshot.metrics.averageReadinessScore).toBeNull()
    expect(snapshot.metrics.averageOverallProgress).toBeNull()
    expect(snapshot.coverage.examReady).toEqual({ measured: 0, total: 1 })
  })

  it('honors instructor authorization scope before aggregation', () => {
    const snapshot = resolvePilotMeasurement({
      schoolId: 'school-1',
      students: [profile('assigned'), profile('unassigned')],
      progress: [],
      quizAttempts: [],
      remediation: [],
      studyActivity: [
        { user_id:'assigned', study_date:'2026-10-10', active_seconds:300, last_active_at:'2026-10-10T10:00:00Z' },
        { user_id:'unassigned', study_date:'2026-10-10', active_seconds:900, last_active_at:'2026-10-10T10:00:00Z' },
      ],
      examAttempts: [],
      allowedStudentIds: new Set(['assigned']),
      window: buildPilotCheckpointWindow('2026-10-10', 'baseline'),
    })

    expect(snapshot.learners.map((row) => row.studentId)).toEqual(['assigned'])
    expect(snapshot.includedStudentCount).toBe(1)
    expect(snapshot.metrics.totalActiveStudySeconds).toBe(300)
  })
})
