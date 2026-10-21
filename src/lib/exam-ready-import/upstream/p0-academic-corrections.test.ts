import { describe, expect, it } from 'vitest'
import { hairScalpDisorderQuestions } from './hair-scalp-disorders-bank'
import { scientificConceptGapQuestions } from './scientific-concepts-gap'

describe('P0 academic corrections: student-facing assembled questions', () => {
  it('HS-023 asks an answerable androgenetic hair-loss question with coherent options', () => {
    const q = hairScalpDisorderQuestions.find(item => item.id === 'HS-023')
    expect(q).toBeDefined()
    expect(q!.prompt).toMatch(/androgenetic.*hair loss/i)
    expect(q!.prompt).not.toMatch(/Milady|Cengage/i)
    expect(q!.correctOptionId).toBe('a')
    const answer = q!.options.find(o => o.id === q!.correctOptionId)?.text
    expect(answer).toMatch(/genetics.*age.*hormonal/i)
    expect(answer).not.toMatch(/service decision|scalp assessment/i)
    expect(q!.explanation).toMatch(/inherited|androgen/i)
    // Protect public-facing wording only. Keep sourceBasis as restricted audit provenance.
    const publicFields = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
    expect(publicFields).not.toMatch(/\\b(?:Milady|Cengage)\\b|sourceBasis|sourceProvenance/i)
    expect(q!.options).toHaveLength(4)
  })

  it('HS-021/022 remove publisher branding from visible question fields', () => {
    for (const id of ['HS-021', 'HS-022']) {
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q).toBeDefined()
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible).not.toMatch(/\\b(?:Milady|Cengage)\\b/i)
      expect(q!.correctOptionId).toBe('a')
    }
  })

  it('HS-024 through HS-027 have publisher-neutral assembled student wording', () => {
    for (const id of ['HS-024', 'HS-025', 'HS-026', 'HS-027']) {
      const q = hairScalpDisorderQuestions.find(item => item.id === id)
      expect(q, id).toBeDefined()
      expect(q!.correctOptionId, id).toBe('a')
      expect(q!.options, id).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(o => o.text)].join(' ')
      expect(visible, id).not.toMatch(/\b(?:Milady|Cengage)\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('HS-028/029 and SCG-007–012 present publisher-neutral learner text', () => {
    const targets = [
      ...['HS-028', 'HS-029'].map(id => hairScalpDisorderQuestions.find(q => q.id === id)),
      ...['SCG-007', 'SCG-008', 'SCG-009', 'SCG-010', 'SCG-011', 'SCG-012'].map(id => scientificConceptGapQuestions.find(q => q.id === id)),
    ]
    for (const q of targets) {
      expect(q).toBeDefined()
      expect(q!.correctOptionId).toBe('a')
      expect(q!.options).toHaveLength(4)
      const visible = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
      expect(visible).not.toMatch(/\\b(?:Milady|Cengage)\\b|sourceBasis|sourceProvenance/i)
    }
  })

  it('SCG-015 defines redox by oxidation-number change instead of mandatory oxygen gain', () => {
    const q = scientificConceptGapQuestions.find(item => item.id === 'SCG-015')
    expect(q).toBeDefined()
    expect(q!.correctOptionId).toBe('a')
    expect(q!.prompt).toMatch(/oxidation and reduction/i)
    const answer = q!.options.find(o => o.id === 'a')?.text ?? ''
    expect(answer).toMatch(/increases oxidation number.*decreases oxidation number/i)
    expect(q!.explanation).toMatch(/oxygen transfer.*not a requirement/i)
    // Protect public-facing wording only. Keep sourceBasis as restricted audit provenance.
    const publicFields = [q!.prompt, q!.explanation, ...q!.options.map(option => option.text)].join(' ')
    expect(publicFields).not.toMatch(/\\b(?:Milady|Cengage)\\b|sourceBasis|sourceProvenance/i)
    expect(q!.options).toHaveLength(4)
  })
})
