import { describe, expect, it } from 'vitest'
import { getRemediationActionLabel } from './RemediationStatusCard'

describe('getRemediationActionLabel', () => {
  it('uses action labels that match the student state', () => {
    expect(getRemediationActionLabel('targeted_review')).toBe('Start Review')
    expect(getRemediationActionLabel('review_in_progress')).toBe('Continue Review')
    expect(getRemediationActionLabel('review_completed')).toBe('Start Knowledge Check')
    expect(getRemediationActionLabel('reassessment_in_progress')).toBe('Resume Knowledge Check')
    expect(getRemediationActionLabel('pending_evaluation')).toBe('View Status')
    expect(getRemediationActionLabel('pending_more_evidence')).toBe('Continue Practice')
    expect(getRemediationActionLabel('successful')).toBe('View Result')
    expect(getRemediationActionLabel('unsuccessful')).toBe('View Next Steps')
    expect(getRemediationActionLabel('pool_exhausted')).toBe('View Next Steps')
    expect(getRemediationActionLabel('already_completed')).toBe('View Result')
  })
})
