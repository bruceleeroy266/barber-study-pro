import { describe,expect,it } from 'vitest'
import { chapter5PremiumFlashcards } from '@/lib/chapter-5-premium-flashcards'
import { chapter5PremiumQuizQuestions } from '@/lib/chapter-5-premium-quiz'
import { ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS,chapter5ConceptFamilies,chapter5LearningObjectives } from './concepts'
import { chapter5FlashcardConceptMappings,chapter5QuizQuestionConceptMappings,getChapter5ConceptForFlashcard,getChapter5ConceptForQuizQuestion } from './mappings'

describe('Chapter 5 concept architecture integrity',()=>{
  it('locks six objectives and six canonical concept families',()=>{
    expect(chapter5LearningObjectives).toHaveLength(6)
    expect(chapter5ConceptFamilies).toHaveLength(6)
    expect(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS).toHaveLength(6)
    expect(new Set(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS).size).toBe(6)
  })
  it('keeps objective and family references bidirectionally valid',()=>{
    const objectives=new Set(chapter5LearningObjectives.map(x=>x.id))
    const concepts=new Set(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS)
    for(const o of chapter5LearningObjectives) for(const id of o.conceptFamilyIds) expect(concepts.has(id)).toBe(true)
    for(const c of chapter5ConceptFamilies){
      expect(objectives.has(c.learningObjectiveId)).toBe(true)
      expect(c.learningObjectiveIds).toContain(c.learningObjectiveId)
      for(const id of c.learningObjectiveIds) expect(chapter5LearningObjectives.find(x=>x.id===id)?.conceptFamilyIds).toContain(c.id)
    }
  })
  it('maps all 70 served flashcards exactly once with no orphans',()=>{
    expect(chapter5PremiumFlashcards).toHaveLength(70)
    expect(chapter5FlashcardConceptMappings).toHaveLength(70)
    expect(new Set(chapter5FlashcardConceptMappings.map(x=>x.flashcardId)).size).toBe(70)
    const served=new Set(chapter5PremiumFlashcards.map(x=>x.id))
    for(const m of chapter5FlashcardConceptMappings){expect(served.has(m.flashcardId)).toBe(true);expect(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS).toContain(m.conceptFamilyId)}
    for(const c of chapter5PremiumFlashcards) expect(getChapter5ConceptForFlashcard(c.id)).not.toBeNull()
  })
  it('maps all 50 served quiz questions exactly once with no orphans',()=>{
    expect(chapter5PremiumQuizQuestions).toHaveLength(50)
    expect(chapter5QuizQuestionConceptMappings).toHaveLength(50)
    expect(new Set(chapter5QuizQuestionConceptMappings.map(x=>x.questionId)).size).toBe(50)
    const served=new Set(chapter5PremiumQuizQuestions.map(x=>x.id))
    for(const m of chapter5QuizQuestionConceptMappings){expect(served.has(m.questionId)).toBe(true);expect(ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS).toContain(m.conceptFamilyId)}
    for(const q of chapter5PremiumQuizQuestions) expect(getChapter5ConceptForQuizQuestion(q.id)).not.toBeNull()
  })
  it('gives every family assessment evidence and fails closed for unknown ids',()=>{
    for(const id of ACTIVE_CHAPTER5_CONCEPT_FAMILY_IDS){
      expect(chapter5FlashcardConceptMappings.some(x=>x.conceptFamilyId===id)).toBe(true)
      expect(chapter5QuizQuestionConceptMappings.some(x=>x.conceptFamilyId===id)).toBe(true)
    }
    expect(getChapter5ConceptForFlashcard('fc-5-999')).toBeNull()
    expect(getChapter5ConceptForQuizQuestion('qq-5-999')).toBeNull()
  })

  it('guards Chapter 5 against audited unsupported absolutes and stale claims',()=>{
    const corpus=[
      JSON.stringify(chapter5PremiumFlashcards),
      JSON.stringify(chapter5PremiumQuizQuestions),
    ].join(' ')
    const forbidden=[
      '90% of haircutting',
      '20-40 count',
      '3 drops across blade',
      'SIDES OF NECK ONLY',
      'RESTRICTED to sides of neck only',
      'NEVER use reverse backhand on the face',
      'fails the exam',
      'Japanese steel is premium',
      'Palming is tested on practical exams',
      'under 2 seconds',
      'styptic powder or pencil stops',
      'superior edge retention and craftsmanship',
    ]
    for(const phrase of forbidden) expect(corpus.toLowerCase()).not.toContain(phrase.toLowerCase())
  })
})
