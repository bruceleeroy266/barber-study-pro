import { describe, expect, it } from 'vitest'
import { chapter5PremiumContent } from './chapter-5-premium'
import { chapter5ContentConceptMappings } from './chapter-5-concepts/mappings'

describe('C5 source-book lesson alignment', () => {
  it('serves every new source-aligned lesson block and maps it to a canonical Chapter 5 family', () => {
    const expected = [
      'comb-brush-source-detail',
      'shear-source-detail',
      'clipper-source-detail',
      'razor-anatomy-source-detail',
      'equipment-source-detail',
      'thermal-iron-manipulation-source',
      'hair-clippings-cleanup',
    ]
    const ids = chapter5PremiumContent.sections.map((section) => section.id)
    for (const id of expected) {
      expect(ids).toContain(id)
      expect(chapter5ContentConceptMappings.some((mapping) => mapping.contentBlockId === id)).toBe(true)
    }
  })

  it('covers the source-book lesson gaps identified in the 18-objective matrix', () => {
    const lesson = JSON.stringify(chapter5PremiumContent)
    const required = [
      'GRAPHITE',
      'TAIL COMB',
      'FRENCH STYLE',
      'GERMAN STYLE',
      'bumper',
      'DETACHABLE-BLADE',
      'moving blade',
      'carbon-steel',
      '00000',
      'CHANGEABLE-BLADE',
      'Razor Shapers / Hair Razors',
      'latherizer',
      'ELECTRIC MASSAGER',
      'ELECTRO/LIGHT THERAPY EQUIPMENT',
      'comedone extractors',
      'vacuum system',
      'THERMAL IRON MANIPULATION',
    ]
    for (const term of required) expect(lesson).toContain(term)
  })

  it('keeps the book-aligned lesson in ASCYN PRO wording rather than source-brand copy', () => {
    const lesson = JSON.stringify(chapter5PremiumContent)
    expect(lesson).not.toContain('Milady')
  })
})
