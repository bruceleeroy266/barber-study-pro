/**
 * ASCYN PRO — Chapter 2 Instructor Notes Dataset Tests (Phase 2B)
 *
 * Guards required sections, reference integrity, enrichment labeling,
 * and the provenance/board-claim boundaries.
 */

import { describe, it, expect } from 'vitest'
import { chapter2InstructorNotes, chapterInstructorNotes } from './chapter-2-instructor-notes'
import {
  chapter2Concepts,
  ACTIVE_CONCEPT_IDS,
  LEARNING_OBJECTIVE_IDS,
} from './chapter-2-concepts/concepts'

const notes = chapter2InstructorNotes
const allText = JSON.stringify(notes)

describe('Chapter 2 Instructor Notes — required sections', () => {
  it('is registered for chapter 2 only', () => {
    expect(chapterInstructorNotes[2]).toBe(notes)
    expect(Object.keys(chapterInstructorNotes)).toEqual(['2'])
  })

  it('has all required sections present and non-empty', () => {
    expect(notes.purpose.length).toBeGreaterThan(40)
    expect(notes.learningObjectiveIds).toHaveLength(14)
    expect(notes.teachingEmphasis.length).toBeGreaterThan(0)
    expect(notes.commonConfusions.length).toBeGreaterThan(0)
    expect(notes.discussionPrompts.length).toBeGreaterThan(0)
    expect(notes.classroomActivities.length).toBeGreaterThan(0)
    expect(notes.practicalConnections.length).toBeGreaterThan(0)
    expect(notes.misconceptions.length).toBeGreaterThan(0)
    expect(notes.remediationGuidance.length).toBeGreaterThan(40)
    expect(notes.assessmentGuidance.length).toBeGreaterThan(40)
    expect(notes.enrichmentIdentification.length).toBeGreaterThan(0)
    expect(notes.provenanceBoundaries.length).toBeGreaterThan(40)
    expect(notes.boardRelevanceBoundaries.length).toBeGreaterThan(40)
  })
})

describe('Chapter 2 Instructor Notes — reference integrity', () => {
  it('references exactly the 14 approved learning objectives, each resolving', () => {
    expect(notes.learningObjectiveIds).toHaveLength(14)
    for (const id of notes.learningObjectiveIds) {
      expect(LEARNING_OBJECTIVE_IDS).toContain(id)
    }
  })

  it('every referenced concept resolves to an active concept (no C-2-22)', () => {
    const referenced = new Set<string>()
    for (const c of notes.commonConfusions) c.conceptIds.forEach((id) => referenced.add(id))
    for (const a of notes.classroomActivities) a.conceptIds.forEach((id) => referenced.add(id))
    for (const e of notes.enrichmentIdentification) referenced.add(e.conceptId)
    expect(referenced.size).toBeGreaterThan(0)
    for (const id of referenced) {
      expect(ACTIVE_CONCEPT_IDS).toContain(id)
    }
  })

  it('enrichment concept names match the canonical concept runtime', () => {
    const nameById = new Map(chapter2Concepts.map((c) => [c.id, c.name]))
    for (const e of notes.enrichmentIdentification) {
      expect(nameById.get(e.conceptId)).toBe(e.conceptName)
    }
  })
})

describe('Chapter 2 Instructor Notes — boundaries', () => {
  it('explicitly identifies C-2-20, C-2-21, and C-2-25 as ASCYN ENRICHMENT', () => {
    for (const conceptId of ['C-2-20', 'C-2-21', 'C-2-25']) {
      const entry = notes.enrichmentIdentification.find((e) => e.conceptId === conceptId)
      expect(entry, `missing enrichment identification for ${conceptId}`).toBeDefined()
      expect(entry!.identification).toMatch(/ASCYN ENRICHMENT/)
    }
  })

  it('makes no DIRECT_VERIFIED board-relevance claims anywhere', () => {
    expect(allText).not.toMatch(/DIRECT_VERIFIED/i)
  })

  it('assessment guidance references the 48-question quiz and 80% threshold without calling it an official board exam', () => {
    expect(notes.assessmentGuidance).toMatch(/48 questions/)
    expect(notes.assessmentGuidance).toMatch(/80%/)
    // No affirmative claim that the quiz IS an official board exam
    expect(notes.assessmentGuidance).not.toMatch(/it is an official board exam|is the official board exam|this is (an|the) official board exam|simulates the (state )?board/i)
    expect(allText).not.toMatch(/this is (an|the) official board exam/i)
    // It must explicitly disclaim board-exam presentation
    expect(notes.assessmentGuidance).toMatch(/do not present/i)
  })

  it('states all three provenance classes in the boundaries section', () => {
    expect(notes.provenanceBoundaries).toMatch(/DIRECT MILADY/)
    expect(notes.provenanceBoundaries).toMatch(/MILADY-SUPPORTED ASCYN EXPANSION/)
    expect(notes.provenanceBoundaries).toMatch(/ASCYN ENRICHMENT/)
  })

  it('contains no publisher prose markers', () => {
    expect(allText).not.toMatch(/©|copyright|reprinted|reproduced with permission/i)
  })
})
