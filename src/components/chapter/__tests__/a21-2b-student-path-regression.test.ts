import fs from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { localChapters, getLocalFlashcards, getLocalQuiz, getLocalQuizQuestions } from '@/lib/local-data'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'

const chapters = Array.from({ length: 21 }, (_, i) => i + 1)
const read = (relative: string) => fs.readFileSync(path.join(process.cwd(), relative), 'utf8')

describe('A21-2B Chapters 1-21 student-path regression matrix', () => {
  it.each(chapters)('Chapter %i exposes the core learner path', (chapterNumber) => {
    const chapter = localChapters.find((item) => item.chapter_number === chapterNumber && item.is_active)
    expect(chapter, 'active chapter').toBeDefined()
    expect(getLocalFlashcards(chapter!.id).length, 'flashcards').toBeGreaterThan(0)
    const quiz = getLocalQuiz(chapter!.id)
    expect(quiz, 'assessment').toBeDefined()
    expect(getLocalQuizQuestions(quiz!.id).length, 'assessment questions').toBeGreaterThan(0)
    expect(isConceptDetectionSupported(chapter!.id), 'gap detection').toBe(true)
    expect(getChapterContentProvider(chapter!.id), 'targeted remediation/reassessment provider').toBeDefined()
  })

  it('renders and persists micro-checks for every chapter', () => {
    const source = read('src/components/chapter/ChapterContent.tsx')
    for (const chapterNumber of chapters) {
      expect(source).toContain(`Chapter${chapterNumber}MicroCheckCard`)
      expect(source).toContain(`loadChapter${chapterNumber}MicroCheckAttempts`)
    }
  })

  it('preserves learner state across flashcard and reassessment reloads', () => {
    const flashcards = read('src/components/FlashcardClient.tsx')
    expect(flashcards).toContain('localStorage.getItem(getCardIdStorageKey(chapterId))')
    expect(flashcards).toContain('localStorage.setItem(getCardIdStorageKey(chapterId), card.id)')
    const remediation = read('src/components/remediation/RemediationPageClient.tsx')
    expect(remediation).toContain("initialState === 'reassessment_in_progress'")
    expect(remediation).toContain('knowledgeCheck?.openQuestion')
  })

  it('keeps primary student surfaces mobile-safe', () => {
    const chapterPage = read('src/app/(dashboard)/dashboard/chapters/[chapterNumber]/page.tsx')
    expect(chapterPage).toContain('flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6')
    const remediationPage = read('src/app/(dashboard)/dashboard/remediation/[cycleId]/page.tsx')
    expect(remediationPage).toContain('flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between')
    const reassessment = read('src/components/remediation/ReassessmentKnowledgeCheck.tsx')
    expect(reassessment).toContain('w-full p-4 rounded-xl')
  })

  it('routes quiz misses into shared detection and focus-area cycles', () => {
    const quiz = read('src/components/QuizClient.tsx')
    expect(quiz).toContain("fetch('/api/remediation/detect'")
    expect(quiz).toContain('setFocusAreaCycleIds(cycleIds)')
    expect(quiz).toContain('isConceptDetectionSupported(chapterId)')
  })
})
