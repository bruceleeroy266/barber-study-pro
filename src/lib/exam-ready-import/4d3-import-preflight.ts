/** Stage 4D-3: pure, fail-closed import preflight. Never writes to a database. */
import { buildDraftExamPlan } from './draft-exam-plan'
import { EXAM_READY_CONTENT_VERSION, EXAM_READY_SCORED_DOMAIN_QUOTAS, type RegistryDomain } from './registry-adapter'

export type ExistingRegistryRow = { source_question_id: string; content_version: string }
export type ImportPreflight = ReturnType<typeof buildDraftExamPlan> & { expectedNewQuestions: number }

/** Pass a COMPLETE snapshot of registry IDs and versions, not a partial page. */
export function prepareImportPreflight(existingRows: readonly ExistingRegistryRow[], snapshotComplete: boolean): ImportPreflight {
  if (!snapshotComplete) throw new Error('Registry snapshot must be complete before preflight')
  const seen = new Set<string>()
  for (const row of existingRows) {
    if (!row.source_question_id || !row.content_version || seen.has(row.source_question_id)) {
      throw new Error('Registry snapshot contains missing or duplicate identifiers')
    }
    seen.add(row.source_question_id)
  }
  const plan = buildDraftExamPlan(seen)
  if (plan.config.status !== 'draft' || plan.config.question_bank_version !== EXAM_READY_CONTENT_VERSION) {
    throw new Error('Import configuration must remain versioned and draft')
  }
  if (plan.inventory.length !== 573 || plan.questions.length !== 573) throw new Error('Incomplete import inventory')
  for (const domain of Object.keys(EXAM_READY_SCORED_DOMAIN_QUOTAS) as RegistryDomain[]) {
    const available = plan.inventory.filter(row => row.domain === domain).length
    const scored = EXAM_READY_SCORED_DOMAIN_QUOTAS[domain]
    const experimental = ({ scientific_concepts: 4, implements_equipment: 1, hair_care_services: 4, facial_hair_skin_care_services: 1 } as Record<RegistryDomain,number>)[domain]
    if (available < scored + experimental) throw new Error('Insufficient per-domain inventory for disjoint selection')
  }
  for (const row of plan.inventory) {
    if (row.content_version !== EXAM_READY_CONTENT_VERSION || row.status !== 'active' || !row.prompt.trim() || !row.explanation.trim()) {
      throw new Error('Invalid registry row content or version')
    }
  }
  return { ...plan, expectedNewQuestions: 573 }
}
