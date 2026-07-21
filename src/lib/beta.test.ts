import { describe, it, expect } from 'vitest'
import {
  BETA_AGREEMENT_VERSION,
  BETA_AGREEMENT_STORAGE_KEY,
  BETA_AGREEMENT_NEXT_PATH,
} from './beta'

describe('beta agreement constants', () => {
  it('has a stable version', () => {
    expect(BETA_AGREEMENT_VERSION).toBe('v1.0')
  })

  it('uses a stable localStorage key', () => {
    expect(BETA_AGREEMENT_STORAGE_KEY).toBe('ascyn_beta_agreement_v1')
  })

  it('routes to the beta checklist after acceptance', () => {
    expect(BETA_AGREEMENT_NEXT_PATH).toBe('/dashboard/beta-checklist')
  })
})
