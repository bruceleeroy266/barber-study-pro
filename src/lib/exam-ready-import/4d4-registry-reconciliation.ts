/** 4D-4: pure complete-registry reconciliation; no Supabase client or writes. */
import { buildDraftExamPlan, type DraftExamPlan } from './draft-exam-plan'
import type { RegistryQuestionInsert } from './registry-adapter'

export type ExistingQuestion = RegistryQuestionInsert & { id: string }
export type Reconciliation = {
  plan: DraftExamPlan
  inserts: RegistryQuestionInsert[]
  reused: ExistingQuestion[]
  expectedTotal: 573
}
const stable = (row: RegistryQuestionInsert) => JSON.stringify(row)
/** The caller must attest that pagination is exhausted and the snapshot is from one consistent read. */
export function reconcileRegistry(existing: readonly ExistingQuestion[], snapshotComplete: boolean): Reconciliation {
  if (!snapshotComplete) throw new Error('Complete consistent registry snapshot required')
  const bySource = new Map<string, ExistingQuestion>()
  const ids = new Set<string>()
  for (const row of existing) {
    if (!row.id || !row.source_question_id || ids.has(row.id) || bySource.has(row.source_question_id)) {
      throw new Error('Incomplete or duplicate registry identity')
    }
    ids.add(row.id)
    bySource.set(row.source_question_id, row)
  }
  const plan = buildDraftExamPlan()
  const inserts: RegistryQuestionInsert[] = []
  const reused: ExistingQuestion[] = []
  for (const row of plan.inventory) {
    const found = bySource.get(row.source_question_id)
    if (!found) { inserts.push(row); continue }
    const { id: _id, ...saved } = found
    if (stable(saved) !== stable(row)) throw new Error('Registry collision with changed content: ' + row.source_question_id)
    reused.push(found)
  }
  if (inserts.length + reused.length !== 573) throw new Error('Reconciliation count mismatch')
  return { plan, inserts, reused, expectedTotal: 573 }
}
