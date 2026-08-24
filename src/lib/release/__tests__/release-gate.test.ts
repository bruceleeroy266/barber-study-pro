import { describe, expect, it } from 'vitest'
import { RELEASE_GATE_FAILURE_POLICY, RELEASE_PIPELINE_CONTRACT } from '../release-gate'

describe('release-gate', () => {
  it('requires production account-integrity and auth smoke gates before release go', () => {
    expect(RELEASE_PIPELINE_CONTRACT).toContain('PRODUCTION ACCOUNT-INTEGRITY GATE')
    expect(RELEASE_PIPELINE_CONTRACT).toContain('PRODUCTION AUTHENTICATION SMOKE GATE')
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION ACCOUNT-INTEGRITY GATE')).toBeLessThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('FINAL RELEASE GO')
    )
    expect(RELEASE_PIPELINE_CONTRACT.indexOf('PRODUCTION AUTHENTICATION SMOKE GATE')).toBeLessThan(
      RELEASE_PIPELINE_CONTRACT.indexOf('FINAL RELEASE GO')
    )
    expect(RELEASE_GATE_FAILURE_POLICY).toBe('FAIL_CLOSED')
  })
})
