import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { chapter2Concepts } from './chapter-2-concepts/concepts'
import { chapter2KeyTerms } from './chapter-2-key-terms'

const activeFiles = [
  'src/lib/chapter-2-concepts/concepts.ts',
  'src/lib/chapter-2-key-terms.ts',
  'src/lib/chapter-2-instructor-notes.ts',
]

describe('Chapter 2 content provenance firewall', () => {
  it('does not expose publisher-specific provenance in active Chapter 2 files', () => {
    for (const file of activeFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/Milady|Pivot Point|CIMA|DIRECT MILADY|MILADY_SUPPORTED_EXPANSION/i)
      expect(source, file).not.toMatch(/Textbook LO\d|TEXTBOOK_DERIVED/i)
    }
  })

  it('uses neutral subject-matter provenance for non-original Chapter 2 concepts', () => {
    for (const concept of chapter2Concepts) {
      expect(['INDUSTRY_STANDARD_SUBJECT_MATTER', 'ASCYN_ORIGINAL']).toContain(concept.sourceProvenance)
    }
  })

  it('uses neutral subject-matter provenance for non-original Chapter 2 key terms', () => {
    for (const term of chapter2KeyTerms) {
      expect(['INDUSTRY_STANDARD_SUBJECT_MATTER', 'ASCYN_ORIGINAL']).toContain(term.sourceProvenance)
    }
  })
})
