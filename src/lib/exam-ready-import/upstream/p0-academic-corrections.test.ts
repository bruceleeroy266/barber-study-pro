import { describe, expect, it } from 'vitest'
import { hairScalpDisorderQuestions } from './hair-scalp-disorders-bank'
import { scientificConceptsGapQuestions } from './scientific-concepts-gap'

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
    expect(q!.options).toHaveLength(4)
  })

  it('SCG-015 defines redox by oxidation-number change instead of mandatory oxygen gain', () => {
    const q = scientificConceptsGapQuestions.find(item => item.id === 'SCG-015')
    expect(q).toBeDefined()
    expect(q!.correctOptionId).toBe('a')
    expect(q!.prompt).toMatch(/oxidation and reduction/i)
    const answer = q!.options.find(o => o.id === 'a')?.text ?? ''
    expect(answer).toMatch(/increases oxidation number.*decreases oxidation number/i)
    expect(q!.explanation).toMatch(/oxygen transfer.*not a requirement/i)
    expect(q!.options).toHaveLength(4)
  })
})
