import { describe, expect, it } from 'vitest'
import { publicConceptDetails, publicDisplayText } from './public-content-boundary'

describe('publisher-safe presentation boundary', () => {
  it('keeps ordinary student-facing terminology intact', () => {
    expect(publicDisplayText('Hair shaft structure')).toBe('Hair shaft structure')
  })
  it('blocks publisher markers in rendered text regardless of case', () => {
    expect(publicDisplayText('Milady Chapter 5')).toBe('Content under review')
    expect(publicDisplayText('A CENGAGE citation')).toBe('Content under review')
  })
  it('projects allowlisted fields, excluding internal provenance', () => {
    const source = {
      name: 'Barbering anatomy',
      description: 'Identify the muscle',
      sourceBasis: 'Milady Standard Barbering p. 10',
      sourceProvenance: 'MILADY_SUPPORTED_EXPANSION',
      restrictedAuditMetadata: { publisher: 'Milady' },
    }
    const projected = publicConceptDetails(source)
    expect(projected).toEqual({ name: 'Barbering anatomy', description: 'Identify the muscle' })
    expect(JSON.stringify(projected)).not.toMatch(/milady|cengage|sourceBasis|sourceProvenance/i)
  })
  it('fails closed if display fields accidentally contain a publisher reference', () => {
    const projected = publicConceptDetails({ name: 'Milady chapter', description: 'Cengage content' })
    expect(projected).toEqual({ name: 'Content under review', description: 'Content under review' })
  })
})
