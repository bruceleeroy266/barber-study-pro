import { describe, expect, it } from 'vitest'
import { calculateStudyHeartbeatSeconds } from './study-activity-heartbeat'

describe('calculateStudyHeartbeatSeconds', () => {
  it('credits only actual elapsed seconds', () => {
    expect(calculateStudyHeartbeatSeconds(1_000, 31_000)).toBe(30)
  })

  it('caps delayed timers at one heartbeat minute', () => {
    expect(calculateStudyHeartbeatSeconds(1_000, 301_000)).toBe(60)
  })

  it('does not credit immediate or backward timer calls', () => {
    expect(calculateStudyHeartbeatSeconds(1_000, 1_000)).toBe(0)
    expect(calculateStudyHeartbeatSeconds(2_000, 1_000)).toBe(0)
  })
})
