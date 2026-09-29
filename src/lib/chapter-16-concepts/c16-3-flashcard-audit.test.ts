import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter16PremiumFlashcards } from '../chapter-16-premium-flashcards'
import { chapter16FlashcardConceptMappings } from './mappings'
import { CHAPTER16_GRADE_WEIGHTS } from './grading'
import { SHARED_GRADE_WEIGHTS } from '../concept-mastery/shared-grading'

const root = process.cwd()
const source = readFileSync(join(root, 'src/lib/chapter-16-premium-flashcards.ts'), 'utf8')

describe('C16-3 flashcard source audit and hardening', () => {
  it('preserves all 68 stable flashcard ids and C16-1 mappings', () => {
    const ids = chapter16PremiumFlashcards.map((card) => card.id)
    expect(ids).toHaveLength(68)
    expect(new Set(ids).size).toBe(68)
    expect(ids[0]).toBe('fc-ch16-001')
    expect(ids[67]).toBe('fc-ch16-068')
    expect(chapter16FlashcardConceptMappings).toHaveLength(68)
    expect(CHAPTER16_GRADE_WEIGHTS).toBe(SHARED_GRADE_WEIGHTS)
  })

  it('removes the unsupported absolutes narrowed by C16-2', () => {
    expect(source).not.toContain('Why must **hair analysis** be performed before cutting?')
    expect(source).not.toContain('safe, predictable result')
    expect(source).not.toContain('on which hair types is it inappropriate')
    expect(source).not.toContain('It is not appropriate for fine, fragile, or highly porous hair')
    expect(source).not.toContain('Why must **heat protectant** be applied before thermal styling?')
    expect(source).not.toContain('thermal tools never be applied to damp hair')
    expect(source).not.toContain('healthy, coarse hair can tolerate more')
    expect(source).not.toContain('rapid steam expansion inside the strand')
  })

  it('preserves individualized curl and hair-analysis guidance', () => {
    expect(source).toContain('The amount of shrinkage varies by client')
    expect(source).toContain('help the barber select techniques that fit the client and the design goal')
  })

  it('preserves condition-based razor guidance', () => {
    expect(source).toContain('Suitability depends on hair condition, texture, density, desired finish, blade sharpness, and technique')
  })

  it('anchors thermal styling to manufacturer directions and lowest effective heat', () => {
    expect(source).toContain("Follow the manufacturer\\'s directions")
    expect(source).toContain('Choose the lowest effective temperature for the hair condition and service goal')
    expect(source).toContain('unless the specific tool is designed and labeled for damp or wet use')
  })

  it('removes universal best-choice wording for haircut structures', () => {
    expect(source).not.toContain('A blunt cut is best when')
    expect(source).not.toContain('A graduated cut is best when')
    expect(source).not.toContain('A uniform-layered cut is best when')
    expect(source).toContain('A blunt cut can suit a client')
    expect(source).toContain('A graduated cut can suit a client')
    expect(source).toContain('A uniform-layered cut can suit a client')
  })

  it('keeps cleanup and advanced-technique guidance professional without unsupported absolutes', () => {
    expect(source).not.toContain('What sanitation and cleanup steps must be completed after every haircut and styling service?')
    expect(source).not.toContain('Why must advanced techniques serve the haircut structure rather than replace it?')
    expect(source).toContain('clean and disinfect reusable tools as appropriate')
    expect(source).toContain('Advanced techniques work best when they support a clear structure and design goal')
  })
})
