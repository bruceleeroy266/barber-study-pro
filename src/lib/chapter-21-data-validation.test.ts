/**
 * ASCYN PRO — Chapter 21 Data Validation Tests
 *
 * Verifies internal consistency across learning objectives, competencies,
 * scenarios, taskings, flashcards, quiz questions, remediation, and mastery.
 */

import { describe, it, expect } from 'vitest'
import { chapter21PremiumContent } from './chapter-21-premium-content'
import { chapter21PremiumFlashcards } from './chapter-21-premium-flashcards'
import { chapter21PremiumQuizQuestions } from './chapter-21-premium-quiz'

describe('Chapter 21 — Data Validation', () => {
  const content = chapter21PremiumContent
  const flashcards = chapter21PremiumFlashcards
  const quizQuestions = chapter21PremiumQuizQuestions

  const { sections, learningObjectives, competencies, remediation, mastery } = content
  if (!learningObjectives || !competencies || !remediation || !mastery) {
    throw new Error('Chapter 21 content is missing required metadata')
  }

  const sectionIds = new Set(sections.map((s) => s.id))
  const flashcardIds = new Set(flashcards.map((f) => f.id))
  const quizQuestionIds = new Set(quizQuestions.map((q) => q.id))
  const competencyIds = new Set(competencies.map((c) => c.id))
  const learningObjectiveIds = new Set(learningObjectives.map((lo) => lo.id))

  it('has the expected chapter metadata', () => {
    expect(content.chapterNumber).toBe(21)
    expect(content.title).toBe('The Business of Barbering')
    expect(content.subtitle).toBeDefined()
    expect(content.theme).toBeDefined()
  })

  it('has eight learning objectives, six competencies, and six remediation paths', () => {
    expect(learningObjectives).toHaveLength(8)
    expect(competencies).toHaveLength(6)
    expect(remediation).toHaveLength(6)
  })

  it('has 60 flashcards and 17 quiz questions', () => {
    expect(flashcards).toHaveLength(60)
    expect(quizQuestions).toHaveLength(17)
  })

  it('has unique section IDs', () => {
    const ids = sections.map((s) => s.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique flashcard IDs', () => {
    const ids = flashcards.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique quiz question IDs', () => {
    const ids = quizQuestions.map((q) => q.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('references only valid lesson section IDs from learning objectives', () => {
    for (const lo of learningObjectives) {
      for (const lessonId of lo.lessonIds) {
        expect(sectionIds.has(lessonId)).toBe(true)
      }
    }
  })

  it('references only valid lesson section IDs from remediation', () => {
    for (const r of remediation) {
      for (const lessonId of r.lessonIds) {
        expect(sectionIds.has(lessonId)).toBe(true)
      }
    }
  })

  it('references only valid flashcard IDs from competencies', () => {
    for (const c of competencies) {
      for (const fid of c.flashcardIds ?? []) {
        expect(flashcardIds.has(fid)).toBe(true)
      }
    }
  })

  it('references only valid flashcard IDs from learning objectives', () => {
    for (const lo of learningObjectives) {
      for (const fid of lo.flashcardIds) {
        expect(flashcardIds.has(fid)).toBe(true)
      }
    }
  })

  it('references only valid flashcard IDs from remediation', () => {
    for (const r of remediation) {
      for (const fid of r.flashcardIds) {
        expect(flashcardIds.has(fid)).toBe(true)
      }
    }
  })

  it('references only valid quiz question IDs from competencies', () => {
    for (const c of competencies) {
      for (const qid of c.quizQuestionIds ?? []) {
        expect(quizQuestionIds.has(qid)).toBe(true)
      }
    }
  })

  it('references only valid quiz question IDs from learning objectives', () => {
    for (const lo of learningObjectives) {
      for (const qid of lo.quizQuestionIds) {
        expect(quizQuestionIds.has(qid)).toBe(true)
      }
    }
  })

  it('references only valid quiz question IDs from remediation', () => {
    for (const r of remediation) {
      for (const qid of r.boardQuestionIds) {
        expect(quizQuestionIds.has(qid)).toBe(true)
      }
    }
  })

  it('references only valid competency IDs from learning objectives', () => {
    for (const lo of learningObjectives) {
      for (const cid of lo.competencyIds ?? []) {
        expect(competencyIds.has(cid)).toBe(true)
      }
    }
  })

  it('references only valid competency IDs from remediation', () => {
    for (const r of remediation) {
      expect(competencyIds.has(r.competencyId)).toBe(true)
    }
  })

  it('maps every quiz question to a valid learning objective', () => {
    for (const q of quizQuestions) {
      expect(learningObjectiveIds.has(q.learningObjective!)).toBe(true)
    }
  })

  it('covers every learning objective with at least two quiz questions', () => {
    const counts = new Map<string, number>()
    for (const q of quizQuestions) {
      counts.set(q.learningObjective!, (counts.get(q.learningObjective!) ?? 0) + 1)
    }
    for (const lo of learningObjectives) {
      expect(counts.get(lo.id) ?? 0).toBeGreaterThanOrEqual(2)
    }
  })

  it('covers every learning objective with at least one flashcard', () => {
    const covered = new Set<string>()
    for (const f of flashcards) {
      if (f.category?.includes('Paths')) covered.add('CH21-LO01')
      if (f.category?.includes('Paths') || f.category?.includes('Opening')) covered.add('CH21-LO02')
      if (f.category?.includes('Ownership')) covered.add('CH21-LO03')
      if (f.category?.includes('Business Plan')) covered.add('CH21-LO04')
      if (f.category?.includes('Record Keeping')) covered.add('CH21-LO05')
      if (f.category?.includes('Booth Rental')) covered.add('CH21-LO06')
      if (f.category?.includes('Operations')) covered.add('CH21-LO07')
      if (f.category?.includes('Advertising')) covered.add('CH21-LO08')
    }
    for (const lo of learningObjectives) {
      expect(covered.has(lo.id)).toBe(true)
    }
  })

  it('has mastery metadata with 80% passing score', () => {
    expect(mastery.passingScore).toBe(80)
    expect(mastery.remediationRequiredBelow).toBe(80)
    expect(mastery.confidenceCheck).toBe(true)
  })

  it('has practical scenarios with required fields', () => {
    const scenarios = sections.filter((s) => s.type === 'scenarioBlock')
    expect(scenarios.length).toBeGreaterThan(0)
    for (const s of scenarios) {
      expect(s.title).toBeTruthy()
      if (s.type === 'scenarioBlock') {
        expect(s.scenarios.length).toBeGreaterThan(0)
        for (const sc of s.scenarios) {
          expect(sc.id).toBeTruthy()
          expect(sc.situation).toBeTruthy()
          expect(sc.options.length).toBeGreaterThan(0)
        }
      }
    }
  })

  it('has student taskings (challenge cards) with required fields', () => {
    const challenges = sections.filter((s) => s.type === 'challengeCard')
    expect(challenges.length).toBeGreaterThan(0)
    for (const c of challenges) {
      expect(c.title).toBeTruthy()
      if (c.type === 'challengeCard') {
        expect(c.challenges.length).toBeGreaterThan(0)
        for (const ch of c.challenges) {
          expect(ch.title).toBeTruthy()
          expect(ch.description).toBeTruthy()
          expect(ch.action).toBeTruthy()
          expect(ch.difficulty).toBeTruthy()
        }
      }
    }
  })

  it('has reflection blocks with required fields', () => {
    const reflections = sections.filter((s) => s.type === 'reflectionBlock')
    expect(reflections.length).toBeGreaterThan(0)
    for (const r of reflections) {
      expect(r.title).toBeTruthy()
      if (r.type === 'reflectionBlock') {
        expect(r.questions.length).toBeGreaterThan(0)
        for (const q of r.questions) {
          expect(q.id).toBeTruthy()
          expect(q.question).toBeTruthy()
          expect(q.placeholder).toBeTruthy()
          expect(q.insight).toBeTruthy()
        }
      }
    }
  })

  it('has htmlContent lesson sections for each learning objective', () => {
    const htmlSections = sections.filter((s) => s.type === 'htmlContent')
    expect(htmlSections.length).toBeGreaterThanOrEqual(learningObjectives.length)
  })

  it('has a premium study guide section', () => {
    const studyGuide = sections.find((s) => s.id === 'ch21-study-summary')
    expect(studyGuide).toBeDefined()
    expect(studyGuide?.type).toBe('contentBlock')
  })

  it('has instructor notes section', () => {
    const notes = sections.find((s) => s.id === 'ch21-instructor-notes')
    expect(notes).toBeDefined()
  })
})
