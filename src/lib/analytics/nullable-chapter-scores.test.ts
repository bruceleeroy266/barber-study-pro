import { describe, expect, it } from 'vitest'
import { buildNullableChapterAcademicScores } from './nullable-chapter-scores'
import type { QuizAttempt } from '@/types'
const chapters=[{id:'ch-4',chapter_number:4,title:'Infection Control'},{id:'ch-5',chapter_number:5,title:'Tools'}]
const attempt=(id:string,correct:number,date:string)=>({id,quiz_id:'quiz-4',score:correct,total_questions:10,percentage:correct*10,completed_at:date,answers_json:{}}) as QuizAttempt
describe('student and instructor nullable reporting contract',()=>{
  it('returns unassessed rather than 100% when a chapter has no attempt',()=>{
    const result=buildNullableChapterAcademicScores(chapters,[])
    expect(result[0]).toMatchObject({state:'unassessed',latestPercent:null,bestPercent:null})
  })
  it('preserves latest and best scores separately, independent of chapter completion',()=>{
    const records=[attempt('old',9,'2026-10-01T00:00:00Z'),attempt('new',7,'2026-10-02T00:00:00Z')]
    const student=buildNullableChapterAcademicScores(chapters,records)
    const instructor=buildNullableChapterAcademicScores(chapters,[...records].reverse())
    expect(student).toEqual(instructor)
    expect(student[0]).toMatchObject({latestPercent:70,bestPercent:90,firstPercent:90,latestCorrect:7,latestTotal:10,attemptCount:2})
    expect(student[1].state).toBe('unassessed')
  })
})
