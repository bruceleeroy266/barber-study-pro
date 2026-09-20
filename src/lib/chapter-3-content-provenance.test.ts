import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { chapter3ConceptFamilies } from './chapter-3-concepts/concepts'
import { chapter3KeyTerms } from './chapter-3-key-terms'

const activeFiles = [
  'src/lib/chapter-3-concepts/types.ts',
  'src/lib/chapter-3-concepts/concepts.ts',
  'src/lib/chapter-3-key-terms.ts',
  'src/lib/chapter-3-premium-flashcards.ts',
]

describe('Chapter 3 content provenance firewall', () => {
  it('does not expose publisher-specific provenance language in active Chapter 3 files', () => {
    for (const file of activeFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/Milady|Pivot Point|CIMA|DIRECT MILADY|MILADY_SUPPORTED_EXPANSION/i)
      expect(source, file).not.toMatch(/local Milady|Textbook LO\d|TEXTBOOK_DERIVED/i)
    }
  })

  it('uses neutral subject-matter provenance for all active concept families', () => {
    for (const concept of chapter3ConceptFamilies) {
      expect(concept.sourceProvenance).toBe('INDUSTRY_STANDARD_SUBJECT_MATTER')
    }
  })

  it('uses neutral subject-matter provenance for all Chapter 3 key terms', () => {
    for (const term of chapter3KeyTerms) {
      expect(term.sourceProvenance).toBe('INDUSTRY_STANDARD_SUBJECT_MATTER')
    }
  })
})
