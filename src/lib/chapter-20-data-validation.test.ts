/**
 * ASCYN PRO — Chapter 20 Data Validation Tests
 *
 * Verifies internal consistency across learning objectives, competencies,
 * scenarios, taskings, flashcards, quiz questions, remediation, and mastery.
 */

import { describe, it, expect } from 'vitest'
import { chapter20PremiumContent } from './chapter-20-premium-content'
import { chapter20PremiumFlashcards } from './chapter-20-premium-flashcards'
import { chapter20PremiumQuizQuestions } from './chapter-20-premium-quiz'

describe('Chapter 20 — Data Validation', () => {
  const content = chapter20PremiumContent
  const flashcards = chapter20PremiumFlashcards
  const quizQuestions = chapter20PremiumQuizQuestions

  const { sections, learningObjectives, competencies, remediation, mastery } = content
  if (!learningObjectives || !competencies || !remediation || !mastery) {
    throw new Error('Chapter 20 content is missing required metadata')
  }

  const sectionIds = new Set(sections.map((s) => s.id))
  const flashcardIds = new Set(flashcards.map((f) => f.id))
  const quizQuestionIds = new Set(quizQuestions.map((q) => q.id))
  const competencyIds = new Set(competencies.map((c) => c.id))
  const learningObjectiveIds = new Set(learningObjectives.map((lo) => lo.id))

  it('has the expected chapter metadata', () => {
    expect(content.chapterNumber).toBe(20)
    expect(content.title).toBe('Working Behind the Chair')
    expect(content.subtitle).toBeDefined()
    expect(content.theme).toBeDefined()
  })

  it('has six learning objectives and six competencies', () => {
    expect(learningObjectives).toHaveLength(6)
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

  it('covers every learning objective with at least one quiz question', () => {
    const covered = new Set(quizQuestions.map((q) => q.learningObjective))
    for (const lo of learningObjectives) {
      expect(covered.has(lo.id)).toBe(true)
    }
  })

  it('covers every learning objective with at least one flashcard', () => {
    const covered = new Set(flashcards.map((f) => f.category))
    expect(covered.size).toBeGreaterThanOrEqual(6)
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

  it('has knowledge check sections with required fields', () => {
    const kcs = sections.filter((s) => s.id?.startsWith('ch20-kc'))
    expect(kcs.length).toBe(6)
    for (const kc of kcs) {
      expect(kc.title).toBeTruthy()
    }
  })

  it('has study guide sections', () => {
    const studySections = sections.filter((s) => s.id?.startsWith('ch20-study-'))
    expect(studySections.length).toBeGreaterThan(0)
    const titles = studySections.map((s) => s.title)
    expect(titles).toContain('Premium Study Guide')
  })

  it('has instructor notes', () => {
    const notes = sections.find((s) => s.id === 'ch20-instructor-notes')
    expect(notes).toBeDefined()
    expect(notes?.title).toBe('Instructor Notes')
  })

  it('has no duplicate standard IDs across quiz questions', () => {
    const standardIds = quizQuestions.map((q) => q.standardId)
    expect(new Set(standardIds).size).toBe(standardIds.length)
  })

  it('has no duplicate standard IDs across flashcards', () => {
    const standardIds = flashcards.map((f) => f.standardId)
    expect(new Set(standardIds).size).toBe(standardIds.length)
  })
})
