import { describe, expect, it } from 'vitest'
import { isChapter3PresentationConcept, resolvePresentationConceptName } from './concept-registry'

describe('concept presentation registry', () => {
  it('resolves all four locked Chapter 3 concept families', () => {
    expect(resolvePresentationConceptName('ch3-healthful-habits')).toBe('Healthful Habits')
    expect(resolvePresentationConceptName('ch3-professional-image')).toBe('Professional Image & Grooming')
    expect(resolvePresentationConceptName('ch3-ergonomics')).toBe('Ergonomics & Body Mechanics')
    expect(resolvePresentationConceptName('ch3-human-relations')).toBe('Human Relations & Communication')
  })

  it('identifies Chapter 3 presentation concepts without treating unknown IDs as Chapter 3', () => {
    expect(isChapter3PresentationConcept('ch3-ergonomics')).toBe(true)
    expect(isChapter3PresentationConcept('unknown-concept')).toBe(false)
  })

  it('fails visibly rather than inventing a name for unknown concepts', () => {
    expect(resolvePresentationConceptName('future-concept')).toBe('Unknown concept (future-concept)')
  })
})
