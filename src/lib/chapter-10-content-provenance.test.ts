import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const activeFiles = [
  'src/lib/chapter-10-premium.ts',
  'src/lib/chapter-10-premium-flashcards.ts',
  'src/lib/chapter-10-premium-quiz.ts',
]

describe('Chapter 10 content provenance firewall', () => {
  it('does not expose publisher branding in active Chapter 10 learning content', () => {
    for (const file of activeFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/Milady|Pivot Point|CIMA/i)
    }
  })

  it('does not present unsupported board-exam certainty labels', () => {
    for (const file of activeFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/BOARD EXAM ALERT|Board Exam Alert/i)
    }
  })

  it('does not describe active content as generated from textbook images', () => {
    for (const file of activeFiles) {
      const source = readFileSync(resolve(process.cwd(), file), 'utf-8')
      expect(source, file).not.toMatch(/generated from textbook images|gaps (?:found )?from textbook review/i)
    }
  })
})
