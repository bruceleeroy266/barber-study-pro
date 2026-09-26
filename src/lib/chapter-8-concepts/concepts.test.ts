import { describe, expect, it } from 'vitest'
import {
  ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS,
  CHAPTER8_CONCEPT_FAMILY_IDS,
  chapter8ConceptFamilies,
  chapter8LearningObjectives,
  getChapter8ConceptFamily,
  isChapter8ConceptFamilyId,
} from './concepts'

describe('Chapter 8 C8-0 concept architecture', () => {
  it('defines six source-grounded learning objectives', () => {
    expect(chapter8LearningObjectives).toHaveLength(6)
    expect(new Set(chapter8LearningObjectives.map((objective) => objective.id)).size).toBe(6)
  })

  it('defines ten stable canonical concept families', () => {
    expect(chapter8ConceptFamilies).toHaveLength(10)
    expect(CHAPTER8_CONCEPT_FAMILY_IDS).toHaveLength(10)
    expect(ACTIVE_CHAPTER8_CONCEPT_FAMILY_IDS).toEqual(CHAPTER8_CONCEPT_FAMILY_IDS)
    expect(new Set(CHAPTER8_CONCEPT_FAMILY_IDS).size).toBe(10)
  })

  it('maps every learning objective to valid concept families', () => {
    for (const objective of chapter8LearningObjectives) {
      expect(objective.conceptFamilyIds.length).toBeGreaterThan(0)
      for (const conceptId of objective.conceptFamilyIds) {
        expect(isChapter8ConceptFamilyId(conceptId)).toBe(true)
      }
    }
  })

  it('keeps safety, electrotherapy, and light-therapy families explicit', () => {
    expect(getChapter8ConceptFamily('ch8-equipment-safety').importance).toBe('core')
    expect(getChapter8ConceptFamily('ch8-electrotherapy-terminology').examRelevance).toBe('DIRECT_VERIFIED')
    expect(getChapter8ConceptFamily('ch8-light-therapy-safety').sourceProvenance).toBe('OFFICIAL_EXAM_GUIDE')
  })

  it('keeps all concept names human-readable and production-safe', () => {
    for (const concept of chapter8ConceptFamilies) {
      expect(concept.name.length).toBeGreaterThan(5)
      expect(concept.description.length).toBeGreaterThan(20)
      expect(concept.name.toLowerCase()).not.toContain('milady')
      expect(concept.description.toLowerCase()).not.toContain('milady')
    }
  })
})
