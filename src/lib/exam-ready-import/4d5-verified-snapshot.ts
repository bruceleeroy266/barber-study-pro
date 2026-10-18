/** 4D-5 fail-closed review of a registry snapshot, no DB access or writes. */
import { buildDraftExamPlan } from './draft-exam-plan'
import type { ExistingQuestion } from './4d4-registry-reconciliation'
import type { RegistryQuestionInsert } from './registry-adapter'

const keys: (keyof RegistryQuestionInsert)[] = ['source_question_id','source_kind','domain','prompt','option_a','option_b','option_c','option_d','correct_option','explanation','content_version','status']
/** Explicit projection prevents JSON field-order and extra database-column false mismatches. */
function equalContent(a: RegistryQuestionInsert,b: RegistryQuestionInsert): boolean {
  return keys.every(k=>a[k]===b[k])
}
export type VerifiedRegistrySnapshot = { rows: readonly ExistingQuestion[]; consistent: boolean; complete: boolean; snapshotId: string }
/** The snapshot must originate from a single consistent database read, not uncoordinated pages. */
export function verifyImportSnapshot(snapshot: VerifiedRegistrySnapshot) {
  if (!snapshot.consistent || !snapshot.complete || !snapshot.snapshotId.trim()) throw new Error('Unverified consistent complete registry snapshot')
  const plan=buildDraftExamPlan()
  const bySource=new Map<string,ExistingQuestion>()
  const byId=new Set<string>()
  for(const row of snapshot.rows){
    if(!row.id || !row.source_question_id || byId.has(row.id) || bySource.has(row.source_question_id)) throw new Error('Duplicate or incomplete registry identity')
    byId.add(row.id); bySource.set(row.source_question_id,row)
  }
  let reused=0
  for(const row of plan.inventory){
    const existing=bySource.get(row.source_question_id)
    if(existing){
      if(!equalContent(existing,row)) throw new Error('Registry content collision: '+row.source_question_id)
      reused++
    }
  }
  return {expected:573,reused,toInsert:573-reused,snapshotId:snapshot.snapshotId}
}
