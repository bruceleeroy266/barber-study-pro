import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { chapter13PremiumContent } from '../chapter-13-premium'
import { chapter13PremiumFlashcards } from '../chapter-13-premium-flashcards'
import { chapter13PremiumQuizQuestions } from '../chapter-13-premium-quiz'
import { CHAPTER13_CONCEPT_FAMILY_IDS, chapter13ConceptFamilies } from './concepts'
import {
  chapter13ContentConceptMappings,
  chapter13FlashcardConceptMappings,
  chapter13QuizQuestionConceptMappings,
} from './mappings'
import { chapter13MicroChecks, buildChapter13MicroCheckEvidence } from './micro-checks'
import { evaluateChapter13SafetyIntervention } from './safety-intervention'
import {
  buildChapter13ReassessmentEvidence,
  buildChapter13TargetedRemediationPlan,
  calculateChapter13RecoveredMastery,
  scoreChapter13ReassessmentCycle,
  selectChapter13ReassessmentQuestions,
} from './targeted-remediation'
import { chapter13ReassessmentReserve, getChapter13ReassessmentReserve } from './reassessment-reserve'
import { getChapterContentProvider } from '@/lib/remediation/content-provider-registry'
import { getChapterDetectionProvider, isConceptDetectionSupported } from '@/lib/remediation/chapter-registry'
import { hasCanonicalMappingProvider } from '@/lib/reassessment/provider-registry'
import { buildChapter13InstructorDiagnostics } from './instructor-diagnostics'
import type { Chapter13EvidenceRecord } from './grading'
import { canAccessRoute, isInstructorOrAdmin } from '@/lib/security/permissions'

function wrongAnswer(correct: string): 'a' | 'b' | 'c' | 'd' {
  return (['a','b','c','d'] as const).find((a) => a !== correct) ?? 'a'
}

const ev = (
  conceptFamilyId: Chapter13EvidenceRecord['conceptFamilyId'],
  itemId: string,
  correct: boolean,
  source: Chapter13EvidenceRecord['source'] = 'chapter_assessment',
  timestamp = '2026-09-28T17:00:00.000Z',
): Chapter13EvidenceRecord => ({
  studentId: 'student-c13-final',
  chapterId: 'ch-13',
  conceptFamilyId,
  source,
  itemId,
  difficulty: 'scenario',
  correct,
  attemptPhase: 'initial',
  timestamp,
})

describe('C13-8 final Chapter 13 end-to-end certification', () => {
  it('locks inventory and all eight concept families', () => {
    expect(chapter13PremiumContent.sections).toHaveLength(33)
    expect(chapter13PremiumFlashcards).toHaveLength(90)
    expect(chapter13PremiumQuizQuestions).toHaveLength(45)
    expect(chapter13MicroChecks.flatMap((check) => check.questions)).toHaveLength(16)
    expect(chapter13ReassessmentReserve).toHaveLength(40)
    expect(chapter13ConceptFamilies).toHaveLength(8)

    for (const conceptId of CHAPTER13_CONCEPT_FAMILY_IDS) {
      expect(chapter13ContentConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter13FlashcardConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter13QuizQuestionConceptMappings.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(chapter13MicroChecks.some((m) => m.conceptFamilyId === conceptId), conceptId).toBe(true)
      expect(getChapter13ReassessmentReserve(conceptId)).toHaveLength(5)
    }
  })

  it('registers the full live detection -> remediation -> fresh reassessment chain', () => {
    expect(isConceptDetectionSupported('ch-13')).toBe(true)
    expect(hasCanonicalMappingProvider('ch-13')).toBe(true)
    const detection = getChapterDetectionProvider('ch-13')!
    const content = getChapterContentProvider('ch-13')!
    expect(detection).toBeDefined()
    expect(content).toBeDefined()

    for (const concept of chapter13ConceptFamilies) {
      const assignments = detection.buildAssignmentsForConcept(concept.id)
      expect(assignments.some((x) => x.assignmentType === 'content_block'), concept.id).toBe(true)
      expect(assignments.some((x) => x.assignmentType === 'flashcard'), concept.id).toBe(true)
      const ids = selectChapter13ReassessmentQuestions(concept.id, chapter13ReassessmentReserve)
      expect(ids).toHaveLength(5)
      expect(ids.every((id) => id.startsWith('r13-'))).toBe(true)
      expect(ids.every((id) => content.getQuizQuestionById(id)?.id === id)).toBe(true)
    }
  })

  it('preserves immutable first-attempt micro-check evidence', () => {
    const records = buildChapter13MicroCheckEvidence(
      'student-c13-final',
      [
        { questionId: 'mcq-13-013', selectedAnswer: 'a' },
        { questionId: 'mcq-13-013', selectedAnswer: 'c' },
      ],
      '2026-09-28T17:01:00.000Z',
    )
    expect(records).toHaveLength(1)
    expect(records[0]).toMatchObject({
      source: 'micro_check',
      attemptPhase: 'initial',
      itemId: 'mcq-13-013',
      correct: false,
    })
  })

  it('runs ordinary remediation through five fresh questions and mastery recovery without erasing misses', () => {
    const original = [
      ev('ch13-facial-hair-design','qq-13-043',false),
      ev('ch13-facial-hair-design','mcq-13-011',false,'micro_check','2026-09-28T17:01:00.000Z'),
      ev('ch13-facial-hair-design','qq-13-044',true,'chapter_assessment','2026-09-28T17:02:00.000Z'),
    ]
    const snapshot = JSON.stringify(original)
    const plan = buildChapter13TargetedRemediationPlan(original,'2026-09-28T17:03:00.000Z')
    const target = plan.targets.find((x) => x.conceptFamilyId === 'ch13-facial-hair-design')!
    expect(target.reassessmentQuestionCount).toBe(5)
    expect(target.reassessmentPassPercent).toBe(80)

    const selected = getChapter13ReassessmentReserve('ch13-facial-hair-design')
    const responses = selected.map((q) => ({ questionId: q.id, correct: true }))
    expect(scoreChapter13ReassessmentCycle({
      cycleId:'c13-final-normal',
      conceptFamilyId:'ch13-facial-hair-design',
      selectedQuestionIds:selected.map((q)=>q.id),
      responses,
      passPercent:80,
    }).passed).toBe(true)

    const recovery = buildChapter13ReassessmentEvidence({
      studentId:'student-c13-final',
      conceptFamilyId:'ch13-facial-hair-design',
      selectedQuestions:selected,
      responses,
      timestamp:'2026-09-28T17:10:00.000Z',
    })
    const result = calculateChapter13RecoveredMastery(
      original,recovery,'ch13-facial-hair-design','2026-09-28T17:11:00.000Z',
    )
    expect(JSON.stringify(original)).toBe(snapshot)
    expect(result.originalEvidencePreserved).toBe(true)
    expect(result.after.initialMissCount).toBe(2)
    expect(result.after.reassessmentCorrectCount).toBe(5)
    expect(result.after.mastery).toBeGreaterThan(result.before.mastery)
  })

  it('requires perfect 5/5 recovery for urgent safety', () => {
    const original = [
      ev('ch13-infection-control-service-safety','qq-13-006',false,'chapter_assessment','2026-09-28T17:00:00.000Z'),
      ev('ch13-infection-control-service-safety','qq-13-007',true,'chapter_assessment','2026-09-28T17:01:00.000Z'),
      ev('ch13-infection-control-service-safety','qq-13-010',false,'chapter_assessment','2026-09-28T17:02:00.000Z'),
    ]
    const safety = evaluateChapter13SafetyIntervention(original)
    expect(safety.level).toBe('urgent')
    expect(safety.reassessmentPassPercent).toBe(100)

    const selected = getChapter13ReassessmentReserve('ch13-infection-control-service-safety')
    const four = selected.map((q,i)=>({questionId:q.id,correct:i<4}))
    const five = selected.map((q)=>({questionId:q.id,correct:true}))
    expect(scoreChapter13ReassessmentCycle({
      cycleId:'c13-safety-fail', conceptFamilyId:'ch13-infection-control-service-safety',
      selectedQuestionIds:selected.map(q=>q.id), responses:four, passPercent:100,
    }).passed).toBe(false)
    expect(scoreChapter13ReassessmentCycle({
      cycleId:'c13-safety-pass', conceptFamilyId:'ch13-infection-control-service-safety',
      selectedQuestionIds:selected.map(q=>q.id), responses:five, passPercent:100,
    }).passed).toBe(true)
  })

  it('shows preserved misses and reassessment recovery in Chapter 13 instructor diagnostics', () => {
    const target = 'ch13-facial-hair-design'
    const initialQuestions = chapter13PremiumQuizQuestions.filter((question) =>
      chapter13QuizQuestionConceptMappings.some((m) => m.questionId === question.id && m.conceptFamilyId === target),
    )
    const initialAttempt = {
      quiz_id:'quiz-13', percentage:0,
      answers_json:Object.fromEntries(initialQuestions.map((q)=>[q.id,wrongAnswer(q.correct_answer)])),
      completed_at:'2026-09-28T17:00:00.000Z',
      is_reassessment:false, target_concept_id:null, remediation_cycle_id:null,
    }
    const before = buildChapter13InstructorDiagnostics({
      studentId:'student-c13-final', completionPercent:10, microCheckRows:[],
      quizAttempts:[initialAttempt], referenceTime:'2026-09-28T17:20:00.000Z',
    })
    const reserve = getChapter13ReassessmentReserve(target)
    const reassessmentAttempts = reserve.map((q,i)=>({
      quiz_id:'quiz-13', percentage:100, answers_json:{[q.id]:q.correctAnswer},
      completed_at:`2026-09-28T17:1${i}:00.000Z`, is_reassessment:true,
      target_concept_id:target, remediation_cycle_id:'cycle-c13-design-1',
    }))
    const after = buildChapter13InstructorDiagnostics({
      studentId:'student-c13-final', completionPercent:95, microCheckRows:[],
      quizAttempts:[initialAttempt,...reassessmentAttempts], referenceTime:'2026-09-28T17:20:00.000Z',
    })
    const name=chapter13ConceptFamilies.find((c)=>c.id===target)!.name
    const b=before.concepts.find((c)=>c.conceptName===name)!
    const a=after.concepts.find((c)=>c.conceptName===name)!
    expect(a.initialMisses).toBe(b.initialMisses)
    expect(a.reassessmentCorrect).toBe(5)
    expect(a.mastery).toBeGreaterThan(b.mastery)
    expect(after.latestReassessment).toContain('100%')
  })

  it('keeps completion separate from academic mastery', () => {
    const attempt={quiz_id:'quiz-13',percentage:80,answers_json:{},completed_at:'2026-09-28T17:00:00.000Z',is_reassessment:false,target_concept_id:null,remediation_cycle_id:null}
    const low=buildChapter13InstructorDiagnostics({studentId:'s',completionPercent:5,microCheckRows:[],quizAttempts:[attempt],referenceTime:'2026-09-28T17:20:00.000Z'})
    const high=buildChapter13InstructorDiagnostics({studentId:'s',completionPercent:100,microCheckRows:[],quizAttempts:[attempt],referenceTime:'2026-09-28T17:20:00.000Z'})
    expect(high.chapterGrade).toEqual(low.chapterGrade)
    expect(high.overallMastery).toBe(low.overallMastery)
  })

  it('uses the same authorized student-detail evidence route for instructor and school-admin visibility', () => {
    const root=process.cwd()
    const page=readFileSync(join(root,'src/app/instructor/student/[studentId]/page.tsx'),'utf8')
    const schoolPanel=readFileSync(join(root,'src/components/school-owner/StudentPerformancePanel.tsx'),'utf8')
    expect(isInstructorOrAdmin('instructor')).toBe(true)
    expect(isInstructorOrAdmin('school_admin')).toBe(true)
    expect(canAccessRoute('school_admin','/instructor/student/student-c13-final')).toBe(true)
    expect(page).toContain("'ch-13'")
    expect(page).toContain("row.chapter_id === 'ch-13'")
    expect(page).toContain('buildChapter13InstructorDiagnostics({')
    expect(page).toContain("attempt.quiz_id === 'quiz-13'")
    expect(page).toContain("attempt.target_concept_id?.startsWith('ch13-')")
    expect(page).toContain('chapter13Diagnostics.safetyIntervention')
    expect(page).toContain('Chapter 13 — Shaving and Facial-Hair Design')
    expect(schoolPanel).toContain('href={`/instructor/student/${row.studentId}`}')
  })
})
