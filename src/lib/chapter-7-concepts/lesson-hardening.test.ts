import { describe, expect, it } from 'vitest'
import { chapter7PremiumContent } from '../chapter-7-premium'
import { CHAPTER7_CONCEPT_FAMILY_IDS } from './concepts'
import { chapter7ContentConceptMappings } from './mappings'

function lessonText(): string {
  return JSON.stringify(chapter7PremiumContent)
}

describe('Chapter 7 lesson content hardening', () => {
  it('keeps all canonical concept families represented in lesson mapping', () => {
    const mapped = new Set(chapter7ContentConceptMappings.map((m) => m.conceptFamilyId))
    for (const conceptId of CHAPTER7_CONCEPT_FAMILY_IDS) {
      expect(mapped.has(conceptId)).toBe(true)
    }
  })

  it('removes unsupported organic/inorganic shortcuts', () => {
    const text = lessonText()
    expect(text).not.toContain('If it was alive or came from something alive')
    expect(text).not.toContain("title:'BURNS?'")
    expect(text).not.toContain('Organic chemistry = carbon-containing substances. If it was alive')
    expect(text).toContain('living-versus-nonliving shortcut')
  })

  it('does not define physical versus chemical change only by reversibility', () => {
    const text = lessonText()
    expect(text).not.toContain('Physical changes are reversible')
    expect(text).not.toContain('Chemical changes are permanent')
    expect(text).toContain('without producing a new chemical substance')
    expect(text).toContain('produces a substance with different chemical properties')
  })

  it('keeps permanent-wave oxidation neutralization separate from acid-alkali balancing', () => {
    const text = lessonText()
    expect(text).not.toContain('Always use neutralizing shampoo after perms')
    expect(text).toContain('Acid-alkali neutralization is not the same reaction as oxidation neutralization in permanent waving')
    expect(text).toContain('hair is oxidized as hydrogen is removed')
  })

  it('keeps pH teaching source-aligned and avoids universal damage claims', () => {
    const text = lessonText()
    expect(text).toContain('pH means potential hydrogen')
    expect(text).toContain('Hair and skin are typically about pH 4.5–5.5')
    expect(text).not.toContain('Products outside this range cause damage over time')
  })

  it('removes unsupported universal testing and exam claims', () => {
    const text = lessonText()
    expect(text).not.toContain('EVERY state board exam')
    expect(text).not.toContain('patch tests are required before chemical services in most states')
    expect(text).not.toContain('Skipping them is negligence')
    expect(text).toContain('applicable rules')
    expect(text).toContain('NIC chemistry emphasis')
  })

  it('does not expose publisher/source names in runtime lesson copy', () => {
    expect(lessonText().toLowerCase()).not.toContain('milady')
  })
})
