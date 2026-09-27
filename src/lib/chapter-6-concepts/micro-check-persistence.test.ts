import { describe, expect, it } from 'vitest'
import {
  calculatePersistedChapter6MicroCheckPercent,
  chapter6MicroCheckRowsToEvidence,
  withPersistedChapter6MicroCheckGrade,
  type Chapter6MicroCheckAttemptRow,
} from './micro-check-persistence'

const row=(questionId:string,conceptId:Chapter6MicroCheckAttemptRow['concept_id'],correct:boolean):Chapter6MicroCheckAttemptRow=>({
  id:`row-${questionId}`,user_id:'student-c6',chapter_id:'ch-6',check_id:'mc-6-test',question_id:questionId,concept_id:conceptId,difficulty:'application',selected_answer:correct?'a':'b',is_correct:correct,answered_at:'2026-09-27T17:30:00.000Z',created_at:'2026-09-27T17:30:00.000Z',
})

describe('G5-6 Chapter 6 persisted micro-check evidence adapter',()=>{
  it('converts saved rows into immutable initial evidence',()=>{
    const records=chapter6MicroCheckRowsToEvidence([row('mcq-6-014','ch6-lymphatic',false)])
    expect(records).toEqual([expect.objectContaining({chapterId:'ch-6',conceptFamilyId:'ch6-lymphatic',source:'micro_check',itemId:'mcq-6-014',correct:false,attemptPhase:'initial'})])
  })

  it('feeds persisted first-attempt accuracy into the shared Chapter 6 grade input',()=>{
    const rows=[row('mcq-6-013','ch6-lymphatic',true),row('mcq-6-014','ch6-lymphatic',false)]
    expect(calculatePersistedChapter6MicroCheckPercent(rows)).toBe(50)
    expect(withPersistedChapter6MicroCheckGrade({chapterAssessmentPercent:80},rows)).toEqual({chapterAssessmentPercent:80,microCheckPercent:50})
  })
})
