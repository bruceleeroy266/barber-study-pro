import { describe, expect, it } from 'vitest'
import { getMappingProviderRegistry } from '../provider-registry'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapterRemediationProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { SHARED_GRADE_WEIGHTS } from '@/lib/concept-mastery/shared-grading'
import { chapter1MicroChecks } from '@/lib/chapter-1-concepts/micro-checks'
import { chapter2MicroChecks } from '@/lib/chapter-2-concepts/micro-checks'
import { chapter3MicroChecks } from '@/lib/chapter-3-concepts/micro-checks'
import { chapter4MicroChecks } from '@/lib/chapter-4-concepts/micro-checks'
import { chapter5MicroChecks } from '@/lib/chapter-5-concepts/micro-checks'
import { chapter6MicroChecks } from '@/lib/chapter-6-concepts/micro-checks'
import { chapter7MicroChecks } from '@/lib/chapter-7-concepts/micro-checks'
import { chapter8MicroChecks } from '@/lib/chapter-8-concepts/micro-checks'
import { chapter9MicroChecks } from '@/lib/chapter-9-concepts/micro-checks'
import { chapter10MicroChecks } from '@/lib/chapter-10-concepts/micro-checks'
import { chapter11MicroChecks } from '@/lib/chapter-11-concepts/micro-checks'
import { chapter12MicroChecks } from '@/lib/chapter-12-concepts/micro-checks'
import { chapter13MicroChecks } from '@/lib/chapter-13-concepts/micro-checks'
import { chapter14MicroChecks } from '@/lib/chapter-14-concepts/micro-checks'
import { chapter15MicroChecks } from '@/lib/chapter-15-concepts/micro-checks'
import { chapter16MicroChecks } from '@/lib/chapter-16-concepts/micro-checks'
import { chapter17MicroChecks } from '@/lib/chapter-17-concepts/micro-checks'
import { chapter18MicroChecks } from '@/lib/chapter-18-concepts/micro-checks'


const CHAPTERS = Array.from({ length: 18 }, (_, index) => index + 1)
const chapterId = (chapter: number) => `ch-${chapter}` as const
const MICRO_CHECKS = [chapter1MicroChecks, chapter2MicroChecks, chapter3MicroChecks, chapter4MicroChecks, chapter5MicroChecks, chapter6MicroChecks, chapter7MicroChecks, chapter8MicroChecks, chapter9MicroChecks, chapter10MicroChecks, chapter11MicroChecks, chapter12MicroChecks, chapter13MicroChecks, chapter14MicroChecks, chapter15MicroChecks, chapter16MicroChecks, chapter17MicroChecks, chapter18MicroChecks] as const


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

  it('locks the shared 20/10/40/15/15 grading identifiers', () => {
    expect(SHARED_GRADE_WEIGHTS).toEqual({
      micro_check: 0.20,
      flashcard: 0.10,
      chapter_assessment: 0.40,
      scenario_application: 0.15,
      remediation_reassessment: 0.15,
    })
    expect(Object.values(SHARED_GRADE_WEIGHTS).reduce((sum, weight) => sum + weight, 0)).toBe(1)
  })

  it('keeps micro-check/check-question IDs chapter-namespaced and collision-free', () => {
    const seen = new Set<string>()
    MICRO_CHECKS.forEach((checks, index) => {
      const chapter = index + 1
      for (const check of checks) {
        expect(check.id, `Chapter ${chapter} check ${check.id}`).toMatch(new RegExp(`^mc-${chapter}-`))
        expect(seen.has(check.id), `duplicate micro-check ID ${check.id}`).toBe(false)
        seen.add(check.id)
        for (const question of check.questions) {
          expect(question.id, `Chapter ${chapter} micro question ${question.id}`).toMatch(new RegExp(`^mcq-${chapter}-`))
          expect(seen.has(question.id), `duplicate micro-check question ID ${question.id}`).toBe(false)
          seen.add(question.id)
        }
      }
    })
  })

  it('builds remediation assignments only from the owning chapter canonical assets', () => {
    const registry = getMappingProviderRegistry()
    for (const chapter of CHAPTERS) {
      const id = chapterId(chapter)
      const mapping = registry.getProvider(id)!
      const content = getChapterContentProvider(id)!
      const remediation = getChapterRemediationProvider(id)
      expect(remediation, `Chapter ${chapter} remediation provider`).toBeDefined()

      for (const conceptId of mapping.getAllConceptIds()) {
        const assignments = remediation!.buildAssignments(conceptId)
        expect(assignments.length, `Chapter ${chapter} concept ${conceptId} assignments`).toBeGreaterThan(0)
        for (const assignment of assignments) {
          if (assignment.assignmentType === 'content_block') {
            expect(content.getContentBlockIdsForConcept(conceptId)).toContain(assignment.assetId)
          } else {
            expect(content.getFlashcardIdsForConcept(conceptId)).toContain(assignment.assetId)
          }
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
