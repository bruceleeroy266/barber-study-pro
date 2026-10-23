import {describe,it,expect} from 'vitest'
import { selectCanonicalQuizAttempts, type SelectableQuizAttempt } from './select-quiz-attempt'
const a=(id:string,score:number,time:string,extras:Partial<SelectableQuizAttempt>={}):SelectableQuizAttempt=>({
  id,quiz_id:'quiz-4',score,total_questions:10,percentage:score*10,completed_at:time,...extras
})
describe('canonical quiz selection',()=>{
  it('separates most recent, first and highest grade regardless of input ordering',()=>{
    const rows=[a('second',6,'2026-10-02T00:00:00Z'),a('first',9,'2026-10-01T00:00:00Z'),a('third',8,'2026-10-03T00:00:00Z')]
    const result=selectCanonicalQuizAttempts(rows,'quiz-4')
    expect(result).toMatchObject({first:{id:'first'},best:{id:'first'},latest:{id:'third'},count:3})
  })
  it('excludes other quiz IDs and reassessments',()=>{
    const result=selectCanonicalQuizAttempts([a('wrong',10,'2026-10-02T00:00:00Z',{quiz_id:'quiz-5'}),a('reassessment',10,'2026-10-02T00:00:00Z',{is_reassessment:true}),a('initial',7,'2026-10-01T00:00:00Z')],'quiz-4')
    expect(result).toMatchObject({count:1,latest:{id:'initial'}})
  })
  it('marks no attempt as unavailable',()=>expect(selectCanonicalQuizAttempts([],'quiz-4')).toEqual({first:null,best:null,latest:null,count:0}))
  it('rejects inconsistent raw scores instead of treating recorded percentage as authoritative',()=> {
    expect(()=>selectCanonicalQuizAttempts([a('bad',7,'2026-10-02T00:00:00Z',{percentage:100})],'quiz-4')).toThrow(/contradicts/)
  })
  it('rejects duplicate attempt IDs',()=>{
    const duplicate=a('same',9,'2026-10-02T00:00:00Z')
    expect(()=>selectCanonicalQuizAttempts([duplicate,duplicate],'quiz-4')).toThrow(/Duplicate/)
  })
})
