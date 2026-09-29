import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter14PremiumContent } from '../chapter-14-premium'
import { chapter14PremiumFlashcards } from '../chapter-14-premium-flashcards'
import { chapter14PremiumQuizQuestions } from '../chapter-14-premium-quiz'
import { CHAPTER14_CONCEPT_FAMILY_IDS, chapter14ConceptFamilies } from './concepts'
import {
  chapter14ContentConceptMappings,
  chapter14FlashcardConceptMappings,
  chapter14QuizQuestionConceptMappings,
} from './mappings'
import { chapter14MicroChecks, buildChapter14MicroCheckEvidence } from './micro-checks'
import {
  getFlashcardEvidenceInventory,
  getScenarioEvidenceInventory,
  getScenarioEvidenceConcept,
} from '@/lib/concept-mastery/activity-evidence-registry'
import { evaluateChapter14SafetyIntervention } from './safety-intervention'
import {
  buildChapter14ReassessmentEvidence,
  buildChapter14TargetedRemediationPlan,
  calculateChapter14RecoveredMastery,
  scoreChapter14ReassessmentCycle,
  selectChapter14ReassessmentQuestions,
} from './targeted-remediation'
import { chapter14ReassessmentReserve, getChapter14ReassessmentReserve } from './reassessment-reserve'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import { buildChapter14InstructorDiagnostics } from './instructor-diagnostics'
import { buildLiveInstructorChapterGrade } from '@/lib/concept-mastery/live-instructor-grade'
import type { Chapter14EvidenceRecord } from './grading'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((answer) => answer !== correct) ?? 'a'
}

const ev = (
  conceptFamilyId: Chapter14EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter14EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-28T21:00:00.000Z',
): Chapter14EvidenceRecord => ({
  studentId: 'student-c14-final',
  chapterId: 'ch-14',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C14-8 final Chapter 14 end-to-end certification', () => {
  it('locks the full Chapter 14 learning inventory and seven concepts', () => {
    expect(chapter14PremiumContent.sections).toHaveLength(64)
    expect(chapter14PremiumFlashcards).toHaveLength(112)
    expect(chapter14PremiumQuizQuestions).toHaveLength(70)
    expect(chapter14MicroChecks).toHaveLength(7)
    expect(chapter14MicroChecks.flatMap((check) => check.questions)).toHaveLength(14)
    expect(chapter14ReassessmentReserve).toHaveLength(35)
    expect(chapter14ConceptFamilies).toHaveLength(7)

    expect(chapter14ContentConceptMappings).toHaveLength(64)
    expect(chapter14FlashcardConceptMappings).toHaveLength(112)
    expect(chapter14QuizQuestionConceptMappings).toHaveLength(70)

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      expect(chapter14ContentConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter14FlashcardConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter14QuizQuestionConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter14MicroChecks.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(getChapter14ReassessmentReserve(conceptId)).toHaveLength(5)
    }
  })

  it('proves durable flashcard and scenario/application evidence exists for the shared live grade', () => {
    expect(getFlashcardEvidenceInventory('ch-14')).toHaveLength(112)
    const scenarios = getScenarioEvidenceInventory('ch-14')
    expect(scenarios).toHaveLength(4)

    for (const itemId of scenarios) {
      const [sectionId, rawIndex] = itemId.split(':')
      expect(getScenarioEvidenceConcept('ch-14', sectionId, Number(rawIndex)), itemId).not.toBeNull()
    }

    const activityRows = [
      { chapter_id:'ch-14', source:'flashcard' as const, item_id:'fc-ch14-001', is_correct:true },
      { chapter_id:'ch-14', source:'scenario_application' as const, item_id:scenarios[0], is_correct:true },
    ]
    const grade = buildLiveInstructorChapterGrade({
      chapterId:'ch-14',
      microCheckPercent:100,
      chapterAssessmentPercent:100,
      remediationReassessmentPercent:100,
      activityRows,
    })
    expect(grade.grade.componentWeights).toEqual({
      micro_check:0.20,
      flashcard:0.10,
      chapter_assessment:0.40,
      scenario_application:0.15,
      remediation_reassessment:0.15,
    })
    expect(grade.grade.finalGrade).toBeGreaterThan(0)
  })

  it('registers the full weak-concept -> targeted remediation -> fresh reassessment chain', () => {
    expect(isConceptDetectionSupported('ch-14')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-14')).toBe(true)
    const detection = getChapterDetectionProvider('ch-14')!
    const content = getChapterContentProvider('ch-14')!
    expect(detection).toBeDefined()
    expect(content).toBeDefined()

    for (const conceptId of CHAPTER14_CONCEPT_FAMILY_IDS) {
      const assignments = detection.buildAssignmentsForConcept(conceptId)
      expect(assignments.some((item) => item.assignmentType === 'content_block'), conceptId).toBe(true)
      expect(assignments.some((item) => item.assignmentType === 'flashcard'), conceptId).toBe(true)

      const ids = selectChapter14ReassessmentQuestions(conceptId, chapter14ReassessmentReserve)
      expect(ids).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r14-'))).toBe(true)
      expect(ids.every((id) => content.getQuizQuestionById(id)?.id === id), conceptId).toBe(true)
    }
  })

  it('preserves immutable first-attempt micro-check evidence', () => {
    const records = buildChapter14MicroCheckEvidence(
      'student-c14-final',
      [
        { questionId:'mcq-14-013', selectedAnswer:'a' },
        { questionId:'mcq-14-013', selectedAnswer:'b' },
      ],
      '2026-09-28T21:01:00.000Z',
    )
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      source:'micro_check',
      attemptPhase:'initial',
      itemId:'mcq-14-013',
      correct:false,
    })
  })

  it('runs ordinary five-question recovery without erasing original misses', () => {
    const original = [
      ev('ch14-cutting-geometry-guides','qq-14-023',false),
      ev('ch14-cutting-geometry-guides','mcq-14-005',false,'micro_check','2026-09-28T21:01:00.000Z'),
      ev('ch14-cutting-geometry-guides','qq-14-024',true,'chapter_assessment','2026-09-28T21:02:00.000Z'),
    ]
    const snapshot = JSON.stringify(original)
    const plan = buildChapter14TargetedRemediationPlan(original,'2026-09-28T21:03:00.000Z')
    const target = plan.targets.find((item) => item.conceptFamilyId === 'ch14-cutting-geometry-guides')!
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selected = getChapter14ReassessmentReserve('ch14-cutting-geometry-guides')
    const responses = selected.map((question) => ({ questionId:question.id, correct:true }))
    expect(scoreChapter14ReassessmentCycle({
      cycleId:'c14-final-normal',
      conceptFamilyId:'ch14-cutting-geometry-guides',
      selectedQuestionIds:selected.map((question) => question.id),
      responses,
      passPercent:80,
    }).passed).toBe(true)

    const recovery = buildChapter14ReassessmentEvidence({
      studentId:'student-c14-final',
      conceptFamilyId:'ch14-cutting-geometry-guides',
      selectedQuestions:selected,
      responses,
      timestamp:'2026-09-28T21:10:00.000Z',
    })
    const result = calculateChapter14RecoveredMastery(
      original,recovery,'ch14-cutting-geometry-guides','2026-09-28T21:11:00.000Z',
    )
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
  })

  it('requires perfect 5/5 recovery for urgent safety', () => {
    const original = [
      ev('ch14-service-safety-sanitation','mcq-14-013',false,'micro_check','2026-09-28T21:00:00.000Z'),
      ev('ch14-service-safety-sanitation','qq-14-070',true,'chapter_assessment','2026-09-28T21:01:00.000Z'),
      ev('ch14-service-safety-sanitation','mcq-14-014',false,'micro_check','2026-09-28T21:02:00.000Z'),
    ]
    const safety = evaluateChapter14SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.reassessmentPassPercent).toBe(100)

    const selected = getChapter14ReassessmentReserve('ch14-service-safety-sanitation')
    const four = selected.map((question,index) => ({ questionId:question.id, correct:index < 4 }))
    const five = selected.map((question) => ({ questionId:question.id, correct:true }))

    expect(scoreChapter14ReassessmentCycle({
      cycleId:'c14-safety-fail',
      conceptFamilyId:'ch14-service-safety-sanitation',
      selectedQuestionIds:selected.map((question) => question.id),
      responses:four,
      passPercent:100,
    }).passed).toBe(false)
    expect(scoreChapter14ReassessmentCycle({
      cycleId:'c14-safety-pass',
      conceptFamilyId:'ch14-service-safety-sanitation',
      selectedQuestionIds:selected.map((question) => question.id),
      responses:five,
      passPercent:100,
    }).passed).toBe(true)
  })

  it('shows preserved misses and reassessment recovery in instructor diagnostics', () => {
    const target = 'ch14-cutting-geometry-guides'
    const initialQuestions = chapter14PremiumQuizQuestions.filter((question) =>
      chapter14QuizQuestionConceptMappings.some(
        (mapping) => mapping.questionId === question.id && mapping.conceptFamilyId === target,
      ),
    )
    const initialAttempt = {
      quiz_id:'quiz-14',
      percentage:0,
      answers_json:Object.fromEntries(initialQuestions.map((question) => [question.id, wrongAnswer(question.correct_answer)])),
      completed_at:'2026-09-28T21:00:00.000Z',
      is_reassessment:false,
      target_concept_id:null,
      remediation_cycle_id:null,
    }
    const before = buildChapter14InstructorDiagnostics({
      studentId:'student-c14-final',
      completionPercent:10,
      microCheckRows:[],
      quizAttempts:[initialAttempt],
      referenceTime:'2026-09-28T21:20:00.000Z',
    })

    const reserve = getChapter14ReassessmentReserve(target)
    const reassessmentAttempts = reserve.map((question,index) => ({
      quiz_id:'quiz-14',
      percentage:100,
      answers_json:{[question.id]:question.correctAnswer},
      completed_at:`2026-09-28T21:1${index}:00.000Z`,
      is_reassessment:true,
      target_concept_id:target,
      remediation_cycle_id:'cycle-c14-geometry-1',
    }))
    const after = buildChapter14InstructorDiagnostics({
      studentId:'student-c14-final',
      completionPercent:95,
      microCheckRows:[],
      quizAttempts:[initialAttempt,...reassessmentAttempts],
      referenceTime:'2026-09-28T21:20:00.000Z',
    })

    const name = chapter14ConceptFamilies.find((concept) => concept.id === target)!.name
    const beforeConcept = before.concepts.find((concept) => concept.conceptName === name)!
    const afterConcept = after.concepts.find((concept) => concept.conceptName === name)!
    expect(afterConcept.initialMisses).toBe(beforeConcept.initialMisses)
    expect(afterConcept.reassessmentCorrect).toBe(5)
    expect(afterConcept.mastery).toBeGreaterThan(beforeConcept.mastery)
    expect(after.latestReassessment).toContain('100%')
  })

  it('keeps completion separate from mastery and exposes the same route to instructor and school admin', () => {
    const attempt = {
      quiz_id:'quiz-14', percentage:80, answers_json:{}, completed_at:'2026-09-28T21:00:00.000Z',
      is_reassessment:false, target_concept_id:null, remediation_cycle_id:null,
    }
    const low = buildChapter14InstructorDiagnostics({
      studentId:'s', completionPercent:5, microCheckRows:[], quizAttempts:[attempt],
      referenceTime:'2026-09-28T21:20:00.000Z',
    })
    const high = buildChapter14InstructorDiagnostics({
      studentId:'s', completionPercent:100, microCheckRows:[], quizAttempts:[attempt],
      referenceTime:'2026-09-28T21:20:00.000Z',
    })
    expect(high.chapterGrade).toEqual(low.chapterGrade)
    expect(high.overallMastery).toBe(low.overallMastery)

    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c14-final')).toBe(true)

    const root=process.cwd()
    const page=readFileSync(join(root,'src/app/instructor/student/[studentId]/page.tsx'),'utf8')
    const schoolPanel=readFileSync(join(root,'src/components/school-owner/StudentPerformancePanel.tsx'),'utf8')
    expect(page).toContain("row.chapter_id === 'ch-14'")
    expect(page).toContain("attempt.quiz_id === 'quiz-14'")
    expect(page).toContain("attempt.target_concept_id?.startsWith('ch14-')")
    expect(page).toContain("buildLiveGrade('ch-14', chapter14Diagnostics)")
    expect(page).toContain('chapter14Diagnostics.safetyIntervention')
    expect(page).toContain('Chapter 14 — Men’s Haircutting and Styling')
    expect(schoolPanel).toContain('href={`/instructor/student/${row.studentId}`}')
  })
})
