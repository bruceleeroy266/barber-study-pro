import { describe, expect, it, vi } from 'vitest'

describe('Synthetic publisher marker injection for 21 remediation chapter providers', () => {
  it('filters publisher names through every provider', async () => {
    vi.resetModules()
    const chapters = await Promise.all(Array.from({ length: 21 }, (_, i) => i + 1).map(async n => {
      const mod = await import(`@/lib/chapter-${n}-concepts/concepts`)
      const families = (mod[`chapter${n}ConceptFamilies`] ?? mod[`chapter${n}Concepts`]) as Array<{id:string;name:string}> | undefined
      return { n, families }
    }))
    const originalNames: Array<{ obj: {name:string}; name:string }> = []
    try {
      for (const { n, families } of chapters) {
        expect(families, `Chapter ${n} concepts must exist`).toBeDefined()
        const first = families![0]
        expect(first).toBeDefined()
        originalNames.push({ obj: first, name: first.name })
        first.name = `Milady synthetic injected chapter ${n}`
      }
      const { getChapterContentProvider } = await import('@/lib/remediation/content-provider-registry')
      for (const { n, families } of chapters) {
        const provider = getChapterContentProvider(`ch-${n}` as never)
        expect(provider, `chapter ${n} provider`).toBeDefined()
        expect(provider!.getConceptName(families![0].id as never)).toBe('Content under review')
      }
    } finally {
      for (const { obj, name } of originalNames) obj.name = name
      vi.resetModules()
    }
  })
})
