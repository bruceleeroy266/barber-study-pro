import { describe, expect, it } from 'vitest'
import { chapter11PremiumContent } from '../chapter-11-premium'
import {
  ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS,
} from './concepts'
import {
  chapter11ContentConceptMappings,
} from './mappings'

function flatten(value: unknown): string {
  if (Array.isArray(value)) return value.map(flatten).join(' ')
  if (!value || typeof value !== 'object') return typeof value === 'string' ? value : ''
  return Object.values(value as Record<string, unknown>).map(flatten).join(' ')
}

describe('C11-2 source-grounded lesson hardening', () => {
  it('fills the two C11-1 lesson coverage gaps without changing the concept registry', () => {
    expect(ACTIVE_CHAPTER11_CONCEPT_FAMILY_IDS).toHaveLength(8)

    const mappedConcepts = new Set(
      chapter11ContentConceptMappings.map((mapping) => mapping.conceptFamilyId),
    )

    expect(mappedConcepts.has('ch11-shampoo-draping-service')).toBe(true)
    expect(mappedConcepts.has('ch11-treatment-equipment')).toBe(true)
    expect(
      chapter11ContentConceptMappings.some(
        (mapping) =>
          mapping.contentBlockId === 'draping-shampoo-service' &&
          mapping.conceptFamilyId === 'ch11-shampoo-draping-service',
      ),
    ).toBe(true)
    expect(
      chapter11ContentConceptMappings.some(
        (mapping) =>
          mapping.contentBlockId === 'treatment-equipment-steam-hot-towels' &&
          mapping.conceptFamilyId === 'ch11-treatment-equipment',
      ),
    ).toBe(true)
  })

  it('preserves source-supported Chapter 11 lesson anchors', () => {
    const runtime = flatten(chapter11PremiumContent).toLowerCase()

    for (const phrase of [
      'reclined method',
      'inclined method',
      'test water temperature',
      'texture',
      'density',
      'porosity',
      'elasticity',
      'rotary',
      'sliding',
      'back-and-forth',
      'blood and lymph flow',
      'hot towels may substitute',
      'electric massager',
      'avoid excessive pressure',
      'once a week for several weeks',
      'parasitic',
      'staphylococcal',
    ]) {
      expect(runtime).toContain(phrase)
    }
  })

  it('removes unsupported or overbroad legacy claims from the Chapter 11 lesson', () => {
    const runtime = flatten(chapter11PremiumContent).toLowerCase()

    for (const phrase of [
      'every state board exam',
      'nearly every state board exam',
      'miss them, and you fail',
      'healing practitioner',
      'master healer',
      'healing hands',
      'dormant follicles',
      'awakening dormant',
      '40%',
      'patch test',
      '24-48',
      'endorphins',
      'serotonin',
      'hygral fatigue',
      'protein overload',
      'pyrithione zinc',
      'ketoconazole',
      'selenium sulfide',
      'coal tar',
      'peppermint oil',
      'rosemary extract',
      'bond builders',
      'repair disulfide',
      'cool water seals the cuticle',
      'hot water opens it',
    ]) {
      expect(runtime).not.toContain(phrase)
    }
  })

  it('keeps medical diagnosis and treatment outside the barber role', () => {
    const runtime = flatten(chapter11PremiumContent).toLowerCase()

    expect(runtime).toContain('rather than diagnosing or medically treating them')
    expect(runtime).toContain('do not convert visual observation into a medical diagnosis')
    expect(runtime).toContain('do not diagnose medical conditions or promise medical outcomes')
    expect(runtime).toContain('refer conditions that require medical care')
  })
})
