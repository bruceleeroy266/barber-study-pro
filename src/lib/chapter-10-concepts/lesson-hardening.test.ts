import { describe, expect, it } from 'vitest'
import { chapter10PremiumContent } from '../chapter-10-premium'

const lesson = JSON.stringify(chapter10PremiumContent)

const collectIds = (value: unknown): string[] => {
  if (Array.isArray(value)) return value.flatMap(collectIds)
  if (!value || typeof value !== 'object') return []
  const record = value as Record<string, unknown>
  const ownId = typeof record.id === 'string' ? [record.id] : []
  return [
    ...ownId,
    ...Object.entries(record)
      .filter(([key]) => key !== 'id')
      .flatMap(([, child]) => collectIds(child)),
  ]
}

describe('C10-2 source-grounded Chapter 10 lesson hardening', () => {
  it('removes unsupported exam-frequency, pseudo-credential, and medical-authority framing', () => {
    const banned = [
      'BOARD EXAM CRITICAL ALERTS',
      'EVERY state board exam',
      'license suspension',
      'diagnostic instrument',
      'diagnostic credentials',
      'Master Trichologist',
      'Trichology Authority',
      'early detection of skin cancer',
      'Documentation protects you professionally',
      'No exceptions.',
    ]

    for (const phrase of banned) {
      expect(lesson).not.toContain(phrase)
    }
  })

  it('keeps the barber role framed as observation, service safety, sanitation, and referral rather than diagnosis', () => {
    expect(lesson).toContain('without making a medical diagnosis')
    expect(lesson).toContain('outside barbering scope')
    expect(lesson).toContain('without diagnosing or prescribing treatment')
    expect(lesson).toContain('follow sanitation requirements')
  })

  it('preserves the source-covered Chapter 10 core lesson domains', () => {
    for (const phrase of [
      'HAIR FOLLICLE',
      'CUTICLE',
      'CORTEX',
      'MEDULLA',
      'HYDROGEN BOND',
      'SALT BOND',
      'DISULFIDE BOND',
      'ANAGEN',
      'CATAGEN',
      'TELOGEN',
      'POROSITY',
      'ELASTICITY',
      'ALOPECIA',
      'TINEA',
      'PEDICULOSIS',
      'SCABIES',
    ]) {
      expect(lesson).toContain(phrase)
    }
  })

  it('preserves all 47 lesson content IDs while hardening wording only', () => {
    const ids = collectIds(chapter10PremiumContent.sections)
    expect(ids).toHaveLength(47)
    expect(new Set(ids).size).toBe(47)
  })
})
