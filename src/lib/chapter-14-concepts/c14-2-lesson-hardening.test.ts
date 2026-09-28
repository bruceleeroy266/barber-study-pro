import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumContent } from '../chapter-14-premium'

const root = process.cwd()
const lesson = readFileSync(join(root, 'src/lib/chapter-14-premium.ts'), 'utf8')

describe('C14-2 source-grounded lesson hardening', () => {
  it('preserves the existing 64-section lesson architecture', () => {
    const ids = chapter14PremiumContent.sections.map((section) => section.id)
    expect(ids).toHaveLength(64)
    expect(new Set(ids).size).toBe(64)
    expect(ids).toContain('guards-vs-blades')
    expect(ids).toContain('locks')
    expect(ids).toContain('board-exam-checkpoint')
  })

  it('removes unsupported universal practical-exam guard claims', () => {
    expect(lesson).not.toContain('Guards are NOT acceptable for state board practical exams')
    expect(lesson).not.toContain('typically NOT acceptable for state board practical examinations')
    expect(lesson).not.toContain('Students must demonstrate true freehand clipper control without guard attachments for licensing exams')
    expect(lesson).toContain('Practical-exam rules vary by jurisdiction and testing provider')
    expect(lesson).toContain('candidate bulletin and instructor guidance')
  })

  it('keeps guard terminology educational without presenting a universal licensing rule', () => {
    expect(lesson).toContain('Guards (attachment combs) are plastic or hard-rubber comb attachments')
    expect(lesson).toContain('Freehand clipper cutting and guard-assisted cutting are different techniques')
    expect(lesson).toContain('detachable blades, guards, and freehand clipper technique')
  })

  it('removes unsupported universal lock timing, permanence, and product absolutes', () => {
    expect(lesson).not.toContain('The process takes 6 months to 1 year to fully complete')
    expect(lesson).not.toContain('Locks take 6–12 months to form and are permanent')
    expect(lesson).not.toContain('Use only non-petroleum-based oils')
    expect(lesson).toContain('Development varies by hair characteristics, technique, maintenance, and time')
    expect(lesson).toContain('product choices that minimize buildup')
  })

  it('narrows broad razor and design absolutes while preserving instructional value', () => {
    expect(lesson).not.toContain('Razor cutting is considered the best method for blending and tapering')
    expect(lesson).toContain('Razor cutting can be useful for blending and tapering')
    expect(lesson).not.toContain('leave hair fuller at the nape and never cut above the natural hairline')
    expect(lesson).toContain('respecting the natural hairline can help avoid exaggerating length')
  })

  it('does not promise board-exam mastery in the lesson framing', () => {
    expect(lesson).not.toContain('Blueprint your way to board-exam mastery')
    expect(lesson).not.toContain("title: 'Board Exam Checkpoint: Chapter 14 Mastery'")
    expect(lesson).toContain('Blueprint your way to haircutting mastery')
    expect(lesson).toContain("title: 'Chapter 14 Knowledge Checkpoint'")
  })
})
