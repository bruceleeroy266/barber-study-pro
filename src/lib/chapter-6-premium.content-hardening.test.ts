import { describe, expect, it } from 'vitest'
import { chapter6PremiumContent } from './chapter-6-premium'

describe('Chapter 6 lesson content hardening', () => {
  const serialized = JSON.stringify(chapter6PremiumContent)

  it('keeps direction-first cardiovascular wording', () => {
    expect(serialized).toContain('arteries (away from heart)')
    expect(serialized).toContain('veins (toward heart)')
  })

  it('prevents known inaccurate or brittle absolutes from returning', () => {
    const forbidden = [
      'connected to EVERY hair follicle',
      'controls all other endocrine glands',
      'THEY APPEAR ON EVERY EXAM',
      '37 trillion cells',
      'Completely replaces itself every 27-30 days',
      'all cells reproduce this way',
      'Never fatigues',
      'Nutrition directly impacts hair quality and skin health',
      'Lungs provide oxygen to all cells',
    ]

    for (const phrase of forbidden) {
      expect(serialized).not.toContain(phrase)
    }
  })

  it('prevents diagnosis-adjacent and out-of-scope barber claims from returning', () => {
    const forbidden = [
      'dry, itchy skin can signal kidney issues',
      'Stress increases CORTISOL — this causes acne',
      'Recommend stress-management to clients with these issues',
      'Immediately stop, elevate their feet',
      'they heal, they protect',
    ]

    for (const phrase of forbidden) {
      expect(serialized).not.toContain(phrase)
    }
  })

  it('preserves explicit scope and referral boundaries', () => {
    expect(serialized).toContain('Barbers are not diagnosticians')
    expect(serialized).toContain('avoid diagnosing a cause')
    expect(serialized).toContain('recommend appropriate medical evaluation')
  })

  it('qualifies endocrine and skin claims instead of presenting them as universal', () => {
    expect(serialized).toContain('does not control every endocrine gland')
    expect(serialized).toContain('Epidermal renewal occurs over several weeks and varies')
    expect(serialized).toContain('Some sebaceous glands open directly onto the skin rather than into a follicle')
  })
})
