import { describe, expect, it } from 'vitest'
import {
  ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS,
  CHAPTER9_CONCEPT_FAMILY_IDS,
  chapter9ConceptFamilies,
  chapter9LearningObjectives,
} from './concepts'

describe('C9-1 Chapter 9 canonical concept architecture', () => {
  it('locks eight current learning objectives and ten stable concept families', () => {
    expect(chapter9LearningObjectives).toHaveLength(8)
    expect(chapter9ConceptFamilies).toHaveLength(10)
    expect(CHAPTER9_CONCEPT_FAMILY_IDS).toHaveLength(10)
    expect(new Set(CHAPTER9_CONCEPT_FAMILY_IDS).size).toBe(10)
    expect(ACTIVE_CHAPTER9_CONCEPT_FAMILY_IDS).toEqual(CHAPTER9_CONCEPT_FAMILY_IDS)
  })

  it('keeps every concept active and linked to at least one current Chapter 9 objective', () => {
    const objectiveIds = new Set(chapter9LearningObjectives.map((objective) => objective.id))
    for (const concept of chapter9ConceptFamilies) {
      expect(concept.status).toBe('active')
      expect(concept.learningObjectiveIds.length).toBeGreaterThan(0)
      expect(concept.learningObjectiveIds.every((id) => objectiveIds.has(id))).toBe(true)
    }
  })

  it('keeps every learning objective connected to valid concepts', () => {
    const conceptIds = new Set(CHAPTER9_CONCEPT_FAMILY_IDS)
    for (const objective of chapter9LearningObjectives) {
      expect(objective.conceptFamilyIds.length).toBeGreaterThan(0)
      expect(objective.conceptFamilyIds.every((id) => conceptIds.has(id))).toBe(true)
    }
  })

  it('does not claim direct exam verification before Chapter 9 exam-blueprint verification occurs', () => {
    expect(chapter9ConceptFamilies.every(
      (concept) => concept.examRelevance !== 'DIRECT_VERIFIED',
    )).toBe(true)
  })
})
