import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const activeChapter19Files = [
  'src/lib/chapter-19-premium-content.ts',
  'src/lib/chapter-19-premium-remediation.ts',
  'src/lib/chapter-19-premium-flashcards.ts',
]

const chapter19FlashcardFiles = [
  'src/lib/chapter-19-premium-flashcards.ts',
]

describe('Chapter 19 content provenance firewall', () => {
  it('does not expose publisher branding in active learner/remediation content', () => {
    for (const file of activeChapter19Files) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/Milady|Pivot Point|CIMA/i)
    }
  })

  it('does not rely on textbook page-number citations in active chapter content', () => {
    for (const file of activeChapter19Files) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/Textbook Pages|\bpp\.\s*\d+|sourcePages:\s*['"]\d+/i)
    }
  })

  it('removes textbook page-number citations from active Chapter 19 flashcards', () => {
    for (const file of chapter19FlashcardFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/\(p{1,2}\.\s*\d+/i)
      expect(source, file).not.toMatch(/Textbook Pages|sourcePages:\s*['"]\d+/i)
    }
  })

  it('states independence and official-source verification in the learner lesson', () => {
    const source = readFileSync(
      resolve(process.cwd(), 'src/lib/chapter-19-premium-content.ts'),
      'utf-8'
    )
    expect(source).toMatch(/independent supplemental learning platform/i)
    expect(source).toMatch(/official licensing/i)
    expect(source).toMatch(/authorized exam provider/i)
  })
})
