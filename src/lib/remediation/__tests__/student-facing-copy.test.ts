import { describe, expect, it } from 'vitest'
import { STUDENT_STATE_DESCRIPTIONS } from '../student-service'

describe('student remediation copy', () => {
  it('does not claim an instructor was notified when the reassessment pool is exhausted', () => {
    const description = STUDENT_STATE_DESCRIPTIONS.pool_exhausted

    expect(description).toContain('check in with your instructor')
    expect(description.toLowerCase()).not.toContain('has been notified')
  })
})
