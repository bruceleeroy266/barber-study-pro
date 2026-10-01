import { describe, expect, it } from 'vitest'
import { getMappingProviderRegistry } from '../provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'

const CHAPTERS = Array.from({ length: 18 }, (_, index) => index + 1)
const chapterId = (chapter: number) => `ch-${chapter}` as const

describe('HA-6 Chapters 1-18 cross-chapter consistency', () => {
  it('registers every chapter exactly once in the canonical mapping registry', () => {
    const registry = getMappingProviderRegistry()
    const registered = registry.getRegisteredChapterIds()
    for (const chapter of CHAPTERS) {
      expect(registered.filter((id) => id === chapterId(chapter)), `Chapter ${chapter}`).toHaveLength(1)
    }
  })

  it('registers every chapter in detection and remediation content providers', () => {
    for (const chapter of CHAPTERS) {
      expect(isConceptDetectionSupported(chapterId(chapter)), `Chapter ${chapter} detection`).toBe(true)
      expect(getChapterContentProvider(chapterId(chapter)), `Chapter ${chapter} content`).toBeDefined()
    }
  })

  it('keeps concept IDs chapter-namespaced with no cross-chapter leakage', () => {
    const registry = getMappingProviderRegistry()
    const seen = new Map<string, number>()
    for (const chapter of CHAPTERS) {
      const provider = registry.getProvider(chapterId(chapter))
      expect(provider).toBeDefined()
      for (const conceptId of provider!.getAllConceptIds()) {
        expect(conceptId, `Chapter ${chapter} concept ${conceptId}`).toMatch(new RegExp(`^ch${chapter}-`))
        expect(seen.has(conceptId), `duplicate concept ${conceptId}`).toBe(false)
        seen.set(conceptId, chapter)
      }
    }
  })

  it('keeps all canonical question IDs globally unique across Chapters 1-18', () => {
    const registry = getMappingProviderRegistry()
    const seen = new Map<string, number>()
    for (const chapter of CHAPTERS) {
      const provider = registry.getProvider(chapterId(chapter))!
      for (const questionId of provider.getAllQuestionIds()) {
        expect(seen.has(questionId), `question ID ${questionId} leaks from Chapter ${seen.get(questionId)} into ${chapter}`).toBe(false)
        seen.set(questionId, chapter)
      }
    }
  })

  it('keeps formal reassessment selection reserve-only and chapter-isolated', () => {
    const registry = getMappingProviderRegistry()
    for (const chapter of CHAPTERS) {
      const provider = registry.getProvider(chapterId(chapter))!
      const allIds = new Set(provider.getAllQuestionIds())
      for (const conceptId of provider.getAllConceptIds()) {
        const reserve = provider.getQuestionsForConcept(conceptId)
        expect(reserve.length, `Chapter ${chapter} concept ${conceptId} has no reassessment reserve`).toBeGreaterThanOrEqual(5)
        expect(new Set(reserve).size, `Chapter ${chapter} concept ${conceptId} duplicate reserve IDs`).toBe(reserve.length)
        for (const questionId of reserve) {
          expect(allIds.has(questionId), `Chapter ${chapter} reserve ID ${questionId} absent from canonical map`).toBe(true)
          expect(provider.getConceptForQuestion(questionId), `Chapter ${chapter} reserve mapping`).toBe(conceptId)
        }
      }
    }
  })

  it('does not let another chapter content provider resolve a foreign question ID', () => {
    const registry = getMappingProviderRegistry()
    for (const chapter of CHAPTERS) {
      const mapping = registry.getProvider(chapterId(chapter))!
      const ownContent = getChapterContentProvider(chapterId(chapter))!
      const sample = mapping.getAllQuestionIds()[0]
      expect(sample, `Chapter ${chapter} canonical bank`).toBeDefined()
      expect(ownContent.getQuizQuestionById(sample!), `Chapter ${chapter} own question resolution`).not.toBeNull()
      for (const other of CHAPTERS) {
        if (other === chapter) continue
        expect(
          getChapterContentProvider(chapterId(other))!.getQuizQuestionById(sample!),
          `Chapter ${other} resolved Chapter ${chapter} question ${sample}`,
        ).toBeNull()
      }
    }
  })
})
