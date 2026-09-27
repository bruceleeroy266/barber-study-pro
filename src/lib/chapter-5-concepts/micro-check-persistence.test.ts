import { describe, expect, it } from 'vitest'
import {
  calculatePersistedChapter5MicroCheckPercent,
  chapter5MicroCheckRowsToEvidence,
  withPersistedChapter5MicroCheckGrade,
  type Chapter5MicroCheckAttemptRow,
} from './micro-check-persistence'

const row=(questionId:string,conceptId:Chapter5MicroCheckAttemptRow['concept_id'],correct:boolean):Chapter5MicroCheckAttemptRow=>({
  id:`row-${questionId}`,user_id:'student-c5',chapter_id:'ch-5',check_id:'mc-5-test',question_id:questionId,concept_id:conceptId,difficulty:'application',selected_answer:correct?'a':'b',is_correct:correct,answered_at:'2026-09-27T17:30:00.000Z',created_at:'2026-09-27T17:30:00.000Z',
})

describe('G5-5 Chapter 5 persisted micro-check evidence adapter',()=>{
  it('converts saved rows into immutable initial evidence',()=>{
    const records=chapter5MicroCheckRowsToEvidence([row('mcq-5-005','ch5-clippers-trimmers',false)])
    expect(records).toEqual([expect.objectContaining({chapterId:'ch-5',conceptFamilyId:'ch5-clippers-trimmers',source:'micro_check',itemId:'mcq-5-005',correct:false,attemptPhase:'initial'})])
  })

  it('feeds persisted first-attempt accuracy into the shared Chapter 5 grade input',()=>{
    const rows=[row('mcq-5-005','ch5-clippers-trimmers',true),row('mcq-5-006','ch5-clippers-trimmers',false)]
    expect(calculatePersistedChapter5MicroCheckPercent(rows)).toBe(50)
    expect(withPersistedChapter5MicroCheckGrade({chapterAssessmentPercent:80},rows)).toEqual({chapterAssessmentPercent:80,microCheckPercent:50})
  })
})
