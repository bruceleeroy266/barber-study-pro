import { describe, expect, it } from 'vitest'
import {
  calculatePersistedChapter4MicroCheckPercent,
  chapter4MicroCheckRowsToEvidence,
  withPersistedChapter4MicroCheckGrade,
  type Chapter4MicroCheckAttemptRow,
} from './micro-check-persistence'

const row=(questionId:string,conceptId:Chapter4MicroCheckAttemptRow['concept_id'],correct:boolean):Chapter4MicroCheckAttemptRow=>({
  id:`row-${questionId}`,user_id:'student-c4',chapter_id:'ch-4',check_id:'mc-4-test',question_id:questionId,concept_id:conceptId,difficulty:'application',selected_answer:correct?'a':'b',is_correct:correct,answered_at:'2026-09-27T17:30:00.000Z',created_at:'2026-09-27T17:30:00.000Z',
})

describe('G5-4 Chapter 4 persisted micro-check evidence adapter',()=>{
  it('converts saved rows into immutable initial evidence',()=>{
    const records=chapter4MicroCheckRowsToEvidence([row('mcq-4-005','ch4-cross-contamination',false)])
    expect(records).toEqual([expect.objectContaining({chapterId:'ch-4',conceptFamilyId:'ch4-cross-contamination',source:'micro_check',itemId:'mcq-4-005',correct:false,attemptPhase:'initial'})])
  })

  it('feeds persisted first-attempt accuracy into the shared Chapter 4 grade input',()=>{
    const rows=[row('mcq-4-005','ch4-cross-contamination',true),row('mcq-4-006','ch4-cross-contamination',false)]
    expect(calculatePersistedChapter4MicroCheckPercent(rows)).toBe(50)
    expect(withPersistedChapter4MicroCheckGrade({chapterAssessmentPercent:80},rows)).toEqual({chapterAssessmentPercent:80,microCheckPercent:50})
  })
})
