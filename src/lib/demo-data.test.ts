import { describe, it, expect } from 'vitest'
import { demoProfile, demoUser } from './demo-data'

describe('demo data safety', () => {
  it('default demo user is not an admin', () => {
    expect(demoUser.role).not.toBe('admin')
    expect(demoProfile.role).not.toBe('admin')
  })

  it('default demo user is a learner role', () => {
    expect(['student', 'apprentice']).toContain(demoProfile.role)
  })
})
