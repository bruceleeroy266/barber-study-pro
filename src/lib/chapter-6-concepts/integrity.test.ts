import { describe,expect,it } from 'vitest'
import { chapter6AllEnhanced } from '@/lib/chapter6-enhanced-flashcards'
import { chapter6PremiumQuizQuestions } from '@/lib/chapter-6-premium-quiz'
import { chapter6PremiumContent } from '@/lib/chapter-6-premium'
import { ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS,chapter6ConceptFamilies,chapter6LearningObjectives } from './concepts'
import { CHAPTER6_MIN_DIAGNOSTIC_QUESTIONS_PER_CONCEPT,chapter6ContentConceptMappings,chapter6FlashcardConceptMappings,chapter6QuizQuestionConceptMappings,getChapter6ConceptForFlashcard,getChapter6ConceptForQuizQuestion,getChapter6FlashcardEvidenceCount,getChapter6QuizEvidenceCount } from './mappings'

describe('Chapter 6 concept architecture integrity',()=>{
  it('locks ten objectives and ten canonical concept families',()=>{
    expect(chapter6LearningObjectives).toHaveLength(10)
    expect(chapter6ConceptFamilies).toHaveLength(10)
    expect(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS).toHaveLength(10)
    expect(new Set(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS).size).toBe(10)
  })

  it('keeps objective and family references bidirectionally valid',()=>{
    const objectives=new Set(chapter6LearningObjectives.map(x=>x.id))
    const concepts=new Set(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS)
    for(const objective of chapter6LearningObjectives) for(const id of objective.conceptFamilyIds) expect(concepts.has(id)).toBe(true)
    for(const concept of chapter6ConceptFamilies){
      expect(objectives.has(concept.learningObjectiveId)).toBe(true)
      expect(concept.learningObjectiveIds).toContain(concept.learningObjectiveId)
      for(const id of concept.learningObjectiveIds) expect(chapter6LearningObjectives.find(x=>x.id===id)?.conceptFamilyIds).toContain(concept.id)
    }
  })

  it('maps each canonical lesson target to an existing content block',()=>{
    expect(chapter6ContentConceptMappings).toHaveLength(10)
    expect(new Set(chapter6ContentConceptMappings.map(x=>x.contentBlockId)).size).toBe(10)
    const servedIds=new Set(chapter6PremiumContent.sections.map(section=>section.id))
    for(const mapping of chapter6ContentConceptMappings){
      expect(servedIds.has(mapping.contentBlockId)).toBe(true)
      expect(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
  })

  it('maps all 105 existing enhanced flashcards exactly once',()=>{
    expect(chapter6AllEnhanced).toHaveLength(105)
    expect(chapter6FlashcardConceptMappings).toHaveLength(105)
    expect(new Set(chapter6FlashcardConceptMappings.map(x=>x.flashcardId)).size).toBe(105)
    for(let index=0;index<chapter6AllEnhanced.length;index++){
      const id=`fc-6-${String(index+1).padStart(3,'0')}`
      expect(getChapter6ConceptForFlashcard(id)).not.toBeNull()
    }
  })

  it('maps all 50 quiz questions exactly once with no orphan IDs',()=>{
    expect(chapter6PremiumQuizQuestions).toHaveLength(50)
    expect(chapter6QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter6QuizQuestionConceptMappings.map(x=>x.questionId)).size).toBe(50)
    const served=new Set(chapter6PremiumQuizQuestions.map(x=>x.id))
    for(const mapping of chapter6QuizQuestionConceptMappings){
      expect(served.has(mapping.questionId)).toBe(true)
      expect(ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS).toContain(mapping.conceptFamilyId)
    }
    for(const question of chapter6PremiumQuizQuestions) expect(getChapter6ConceptForQuizQuestion(question.id)).not.toBeNull()
  })

  it('keeps every concept diagnostic-ready in the rebuilt assessment bank',()=>{
    const underQuizThreshold=ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS.filter(id=>getChapter6QuizEvidenceCount(id)<CHAPTER6_MIN_DIAGNOSTIC_QUESTIONS_PER_CONCEPT)
    expect(underQuizThreshold).toEqual([])
    for(const id of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) expect(getChapter6QuizEvidenceCount(id)).toBeGreaterThanOrEqual(4)
    const noFlashcards=ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS.filter(id=>getChapter6FlashcardEvidenceCount(id)===0)
    expect(noFlashcards).toEqual([])
    for(const id of ACTIVE_CHAPTER6_CONCEPT_FAMILY_IDS) expect(getChapter6FlashcardEvidenceCount(id)).toBeGreaterThanOrEqual(7)
  })

  it('fails closed for unknown IDs',()=>{
    expect(getChapter6ConceptForFlashcard('fc-6-999')).toBeNull()
    expect(getChapter6ConceptForQuizQuestion('qq-6-999')).toBeNull()
  })
})
