import {describe,it,expect} from 'vitest'
import {canonicalMicroEvidence,summarizeMicroConcepts} from './canonical-micro-evidence'
const row=(n:number,ok:boolean,user='student-A')=>({
 user_id:user,chapter_id:'ch-4',question_id:'q-'+n,concept_id:'blood-exposure',is_correct:ok,answered_at:'2026-10-20T12:00:00Z'
})
describe('canonical micro evidence',()=>{
 it('counts incorrect records and labels weak evidence as limited',()=>{
  const e=canonicalMicroEvidence({rows:[row(1,false),row(2,true)],studentId:'student-A',chapterId:'ch-4'})
  expect(summarizeMicroConcepts(e)[0]).toMatchObject({correct:1,incorrect:1,percent:50,evidenceStatus:'limited'})
 })
 it('rejects cross-student records even after a caller query error',()=>{
  expect(()=>canonicalMicroEvidence({rows:[row(1,true,'student-B')],studentId:'student-A',chapterId:'ch-4'})).toThrow(/out-of-scope/)
 })
 it('does not count duplicate first-attempt question evidence twice',()=>{
  expect(()=>canonicalMicroEvidence({rows:[row(1,true),row(1,false)],studentId:'student-A',chapterId:'ch-4'})).toThrow(/Duplicate/)
 })
})
