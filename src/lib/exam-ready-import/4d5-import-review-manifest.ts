/** Stage 4D-5: offline review manifest. No DB credentials, network, writes or CLI entrypoint. */
import { createHash } from 'node:crypto'
import { buildDraftExamPlan } from './draft-exam-plan'

export type ImportReviewManifest = {
  manifestVersion: '4d5-review-v1'
  sourceCount: 573
  sourceDigestSha256: string
  sourceIds: string[]
  domainCounts: Record<string, number>
  draftConfig: ReturnType<typeof buildDraftExamPlan>['config']
}
/** Digest includes full canonical content, including private answer keys. Do not expose raw manifest to clients. */
export function prepareImportReviewManifest(): ImportReviewManifest {
  const plan = buildDraftExamPlan()
  const rows = [...plan.inventory].sort((a,b) => a.source_question_id.localeCompare(b.source_question_id))
  if (rows.length !== 573 || new Set(rows.map(row=>row.source_question_id)).size !== 573) {
    throw new Error('Manifest must contain exactly 573 distinct questions')
  }
  const domainCounts: Record<string,number> = {}
  for (const row of rows) domainCounts[row.domain] = (domainCounts[row.domain] ?? 0) + 1
  for (const [domain, count] of Object.entries({scientific_concepts:274,implements_equipment:56,hair_care_services:173,facial_hair_skin_care_services:70})) {
    if (domainCounts[domain] !== count) throw new Error('Manifest domain count mismatch: '+domain)
  }
  const digest = createHash('sha256').update(JSON.stringify(rows)).digest('hex')
  return {
    manifestVersion:'4d5-review-v1',sourceCount:573,sourceDigestSha256:digest,
    sourceIds:rows.map(row=>row.source_question_id),domainCounts,draftConfig:plan.config,
  }
}
