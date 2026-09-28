import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter12PremiumContent } from '../chapter-12-premium'

const root = process.cwd()
const lesson = readFileSync(join(root, 'src/lib/chapter-12-premium.ts'), 'utf8')
const sourceAnalysis = readFileSync(join(root, 'CHAPTER-12-COMPREHENSIVE-ANALYSIS.md'), 'utf8')

describe('C12-2 source-grounded lesson hardening', () => {
  it('retains the repository source basis without pretending it is a fresh textbook verification', () => {
    expect(sourceAnalysis).toContain('MATERIAL COVERAGE: 20+ PAGES (305-325+)')
    expect(sourceAnalysis).toContain('Never diagnose skin conditions')
    expect(sourceAnalysis).toContain('Follow manufacturer guidelines for all equipment')
    expect(lesson).toContain('The Chapter 12 repository source supports these subject areas')
    expect(lesson).toContain('does not independently verify a current licensing blueprint')
  })

  it('removes unsupported board-exam certainty from the student lesson', () => {
    expect(lesson).not.toContain('BOARD EXAM ALERT')
    expect(lesson).not.toContain('appear on every state board exam')
    expect(lesson).not.toContain('Miss them, and you fail')
    expect(lesson).not.toContain('fastest way to fail a state board practical exam')
    expect(lesson).toContain('Exam content varies by jurisdiction and provider')
  })

  it('removes the flagged unsupported numeric and physiological claims', () => {
    expect(lesson).not.toContain('approximately 25% thicker')
    expect(lesson).not.toContain('120-140°F')
    expect(lesson).not.toContain('1000x its weight in water')
    expect(lesson).not.toContain('removes toxins')
    expect(lesson).not.toContain('therapy your clients will pay for')
  })

  it('removes unsafe universal medical-condition rules and keeps diagnosis outside barbering scope', () => {
    expect(lesson).not.toContain('Diabetes is a relative contraindication')
    expect(lesson).not.toContain('Accutane (isotretinoin) — skin is extremely thin and sensitive')
    expect(lesson).not.toContain('Uncontrolled high blood pressure — massage can elevate it further')
    expect(lesson).not.toContain('require doctor clearance')
    expect(lesson).toContain('should not diagnose disease, prescribe treatment, or interpret a medication or medical condition')
    expect(lesson).toContain('defer the service and recommend appropriate professional evaluation')
  })

  it('uses manufacturer directions and client comfort instead of universal heat/product rules', () => {
    expect(lesson).toContain('manufacturer directions')
    expect(lesson).toContain('comfortable warmth')
    expect(lesson).toContain('monitor the client continuously')
    expect(lesson).toContain('Do not rely on a universal temperature or timing rule')
  })

  it('preserves the current Chapter 12 lesson architecture while hardening content', () => {
    const ids = chapter12PremiumContent.sections.map((section) => section.id)
    expect(ids).toHaveLength(18)
    expect(new Set(ids).size).toBe(18)
    expect(ids).toContain('contraindications-safety')
    expect(ids).toContain('board-exam-alerts')
    expect(ids).toContain('hot-towel-safety')
  })
})
