import { describe, expect, it, vi } from 'vitest'

describe('Chapter 5 publisher-marker injection — synthetic only', () => {
  it('keeps injected concept names out of remediation and instructor outputs', async () => {
    vi.resetModules()
    const concepts = await import('@/lib/chapter-5-concepts/concepts')
    const first = concepts.chapter5ConceptFamilies[0] as { name: string; id: string }
    const original = first.name
    try {
      first.name = 'Milady Synthetic Publisher Marker'
      const [{ getChapterContentProvider }, { buildChapter5InstructorDiagnostics }] = await Promise.all([
        import('@/lib/remediation/content-provider-registry'),
        import('@/lib/chapter-5-concepts/instructor-diagnostics'),
      ])
      const provider = getChapterContentProvider('ch-5')
      expect(provider).toBeDefined()
      expect(provider!.getConceptName(first.id as never)).toBe('Content under review')
      const report = buildChapter5InstructorDiagnostics({
        studentId: 'synthetic-student',
        completionPercent: 0,
        microCheckRows: [],
        quizAttempts: [],
        referenceTime: '2026-10-20T00:00:00Z',
      })
      expect(report.concepts.find((item) => item.conceptFamilyId === first.id)?.conceptName).toBe('Content under review')
      expect(JSON.stringify(report)).not.toMatch(/Milady|Cengage/i)
    } finally {
      first.name = original
      vi.resetModules()
    }
  })
})
