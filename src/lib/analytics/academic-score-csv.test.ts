import {describe,it,expect} from 'vitest'
import { academicScoreCsv } from './academic-score-csv'
import { buildNullableChapterAcademicScores } from './nullable-chapter-scores'
import type { QuizAttempt } from '@/types'

describe('student/instructor/export academic parity',()=>{
 it('serializes the exact same measured scores and missing evidence',()=>{
  const chapters=[{id:'ch-4',chapter_number:4,title:'Infection, "Control"'},{id:'ch-5',chapter_number:5,title:'Shaving'}]
  const attempts=[{id:'a',quiz_id:'quiz-4',score:9,total_questions:10,percentage:90,completed_at:'2026-10-01T00:00:00Z'},
    {id:'b',quiz_id:'quiz-4',score:7,total_questions:10,percentage:70,completed_at:'2026-10-02T00:00:00Z'}] as QuizAttempt[]
  const student=buildNullableChapterAcademicScores(chapters,attempts)
  const instructor=buildNullableChapterAcademicScores(chapters,[...attempts].reverse())
  expect(student).toEqual(instructor)
  const csv=academicScoreCsv(chapters,student)
  expect(csv).toContain('"ch-4","Infection, ""Control""","70","90","90","7","10","2","assessed"')
  expect(csv).toContain('"ch-5","Shaving","Not assessed","Not assessed","Not assessed","Not assessed","Not assessed","0","unassessed"')
 })
})
