import {describe,it,expect} from 'vitest'
import {buildDraftExamPlan} from './draft-exam-plan'
import {verifyImportSnapshot} from './4d5-verified-snapshot'

describe('4D-5 snapshot reconciliation boundary',()=>{
 const rows=buildDraftExamPlan().inventory.map((r,i)=>({...r,id:'synthetic-'+i}))
 it('fails closed on incomplete or inconsistent snapshots',()=>{
  expect(()=>verifyImportSnapshot({rows,complete:false,consistent:true,snapshotId:'s1'})).toThrow()
  expect(()=>verifyImportSnapshot({rows,complete:true,consistent:false,snapshotId:'s1'})).toThrow()
  expect(()=>verifyImportSnapshot({rows,complete:true,consistent:true,snapshotId:''})).toThrow()
 })
 it('reuses all exact rows despite extra DB fields and differing key order',()=>{
  const shuffled=rows.map(r=>({id:r.id,status:r.status,source_question_id:r.source_question_id,...r,created_at:'synthetic'}))
  expect(verifyImportSnapshot({rows:shuffled,complete:true,consistent:true,snapshotId:'s1'})).toMatchObject({expected:573,reused:573,toInsert:0})
 })
 it('rejects changed answer key and duplicate identities',()=>{
  expect(()=>verifyImportSnapshot({rows:[{...rows[0],correct_option:'changed'}],complete:true,consistent:true,snapshotId:'s1'})).toThrow(/collision/)
  expect(()=>verifyImportSnapshot({rows:[rows[0],rows[0]],complete:true,consistent:true,snapshotId:'s1'})).toThrow(/Duplicate/)
 })
})
