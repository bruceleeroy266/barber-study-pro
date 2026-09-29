import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter15PremiumContent } from '../chapter-15-premium'

const root = process.cwd()
const lesson = readFileSync(join(root, 'src/lib/chapter-15-premium.ts'), 'utf8')

describe('C15-2 source-grounded lesson hardening', () => {
  it('preserves the existing 54-section lesson architecture', () => {
    const ids = chapter15PremiumContent.sections.map((section) => section.id)
    expect(ids).toHaveLength(54)
    expect(new Set(ids).size).toBe(54)
    expect(ids).toContain('scope-of-practice')
    expect(ids).toContain('attachment-methods')
    expect(ids).toContain('perm-color-systems')
    expect(ids).toContain('chapter-summary')
  })

  it('removes unsupported market-ranking and medical-effectiveness claims', () => {
    expect(lesson).not.toContain('second fastest-growing category in barbering')
    expect(lesson).not.toContain('Moderately effective for about 50% of men after 4 months')
    expect(lesson).not.toContain('More effective and convenient than Minoxidil')
    expect(lesson).not.toContain('Potential side effects include weight gain and loss of sexual function')
    expect(lesson).toContain('Product strength, directions, benefits, risks, and suitability are medical questions')
  })

  it('narrows scope-of-practice language to jurisdiction-aware guidance', () => {
    expect(lesson).not.toContain('State boards love to test')
    expect(lesson).not.toContain('Only physicians prescribe')
    expect(lesson).toContain('Barbering scope varies by jurisdiction')
    expect(lesson).toContain('appropriately licensed healthcare professional')
  })

  it('removes unsupported universal lace and cure-time absolutes', () => {
    expect(lesson).not.toContain('NEVER apply tape directly to lace')
    expect(lesson).not.toContain('It is always 24 to 48 hours')
    expect(lesson).not.toContain('State boards frequently test this timeline')
    expect(lesson).toContain('Follow the system and adhesive manufacturer instructions for lace-front attachment')
    expect(lesson).toContain("follow the adhesive manufacturer's instructions")
  })

  it('repairs the contradictory chemical-service guidance', () => {
    expect(lesson).not.toContain('Lightening and cold-waving are never performed on systems')
    expect(lesson).not.toContain('they destroy the base material')
    expect(lesson).toContain('For systems specifically approved for permanent waving')
    expect(lesson).toContain('Chemical-service limits depend on the system')
    expect(lesson).toContain('manufacturer does not explicitly support the service, do not perform it')
  })

  it('removes broad board-exam certainty from the lesson', () => {
    expect(lesson).not.toContain("title: 'Board Exam Alert:")
    expect(lesson).not.toContain("title: 'Board Exam Checkpoint:")
    expect(lesson).not.toContain('the board exam will test this')
    expect(lesson).toContain("title: 'Chapter 15 Knowledge Checkpoint'")
  })

  it('does not alter flashcard or assessment source files in this phase', () => {
    expect(readFileSync(join(root, 'src/lib/chapter-15-premium-flashcards.ts'), 'utf8')).toContain('fc-ch15-090')
    expect(readFileSync(join(root, 'src/lib/chapter-15-premium-quiz.ts'), 'utf8')).toContain('qq-15-072')
  })
})
