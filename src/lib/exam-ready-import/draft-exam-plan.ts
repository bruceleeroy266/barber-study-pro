/** Stage 4C — offline draft manifest and deterministic selection policy.
 * No database clients, SQL, active-config mutations, or client-facing imports.
 */
import { prepareExamReadyRegistryRows, EXAM_READY_CONTENT_VERSION, EXAM_READY_SCORED_DOMAIN_QUOTAS, type RegistryDomain, type RegistryQuestionInsert } from './registry-adapter'

export const EXAM_READY_DRAFT_CONFIG = {
  slug: 'nic-barber-theory-exam-ready',
  version: 1,
  title: 'NIC Barber Theory Exam Ready',
  status: 'draft',
  blueprint_version: 'exam-ready-573-blueprint-v1',
  question_bank_version: EXAM_READY_CONTENT_VERSION,
  scoring_policy_version: 'po1c-scoring-v1',
  time_limit_seconds: 5400,
  passing_percentage: 70,
  scored_question_count: 100,
  unscored_question_count: 10,
} as const

export const EXPERIMENTAL_QUOTAS: Record<RegistryDomain, number> = {
  scientific_concepts: 4,
  implements_equipment: 1,
  hair_care_services: 4,
  facial_hair_skin_care_services: 1,
}

export type DraftConfigDomain = {
  domain: RegistryDomain
  weight_percent: number
  scored_question_count: number
}
export type DraftConfigQuestion = {
  source_question_id: string
  scored_eligible: true
  unscored_eligible: true
  is_active: true
}
export type DraftExamPlan = {
  config: typeof EXAM_READY_DRAFT_CONFIG
  domains: DraftConfigDomain[]
  questions: DraftConfigQuestion[]
  inventory: RegistryQuestionInsert[]
}
export type SelectedExamItem = {
  source_question_id: string
  domain: RegistryDomain
  is_scored: boolean
}

/** Seeded RNG is injected for repeatable certification; runtime randomness remains server-owned. */
export type RandomNumber = () => number
function shuffle<T>(items: readonly T[], random: RandomNumber): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const r = random()
    if (!Number.isFinite(r) || r < 0 || r >= 1) throw new Error('Invalid random source')
    const j = Math.floor(r * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

const domains = Object.keys(EXAM_READY_SCORED_DOMAIN_QUOTAS) as RegistryDomain[]

export function buildDraftExamPlan(existingSourceIds: Iterable<string> = []): DraftExamPlan {
  const { rows } = prepareExamReadyRegistryRows(undefined, existingSourceIds)
  const domainRows = domains.map(domain => ({
    domain,
    weight_percent: EXAM_READY_SCORED_DOMAIN_QUOTAS[domain],
    scored_question_count: EXAM_READY_SCORED_DOMAIN_QUOTAS[domain],
  }))
  const links = rows.map(row => ({
    source_question_id: row.source_question_id,
    scored_eligible: true as const,
    unscored_eligible: true as const,
    is_active: true as const,
  }))
  return { config: { ...EXAM_READY_DRAFT_CONFIG }, domains: domainRows, questions: links, inventory: rows }
}

/** In-memory reference policy only. Does not replace PO-1C3 SQL selection runtime. */
export function selectDraftExam(plan: DraftExamPlan, random: RandomNumber): SelectedExamItem[] {
  if (plan.config.status !== 'draft' || plan.config.scored_question_count !== 100 || plan.config.unscored_question_count !== 10) {
    throw new Error('Unexpected draft exam configuration')
  }
  if (plan.domains.length !== domains.length || plan.questions.length !== plan.inventory.length) {
    throw new Error('Invalid draft plan dimensions')
  }
  const links = new Map(plan.questions.map(link => [link.source_question_id, link]))
  if (links.size !== plan.questions.length) throw new Error('Duplicate config-question link')
  if (plan.inventory.length !== 573 || new Set(plan.inventory.map(row => row.source_question_id)).size !== 573) {
    throw new Error('Invalid inventory')
  }
  const domainMap = new Map(plan.domains.map(row => [row.domain, row]))
  if (domainMap.size !== domains.length || domains.some(domain =>
    domainMap.get(domain)?.scored_question_count !== EXAM_READY_SCORED_DOMAIN_QUOTAS[domain] ||
    domainMap.get(domain)?.weight_percent !== EXAM_READY_SCORED_DOMAIN_QUOTAS[domain]
  )) throw new Error('Invalid scored-domain blueprint')
  const selected: SelectedExamItem[] = []
  for (const domain of domains) {
    const pool = plan.inventory.filter(row => row.domain === domain && row.status === 'active' && links.get(row.source_question_id)?.is_active)
    const scoredPool = shuffle(pool.filter(row => links.get(row.source_question_id)?.scored_eligible), random)
    const scored = scoredPool.slice(0, EXAM_READY_SCORED_DOMAIN_QUOTAS[domain])
    if (scored.length !== EXAM_READY_SCORED_DOMAIN_QUOTAS[domain]) throw new Error(`Insufficient scored inventory: ${domain}`)
    const used = new Set(scored.map(row => row.source_question_id))
    const experimentalPool = shuffle(pool.filter(row => !used.has(row.source_question_id) && links.get(row.source_question_id)?.unscored_eligible), random)
    const experimental = experimentalPool.slice(0, EXPERIMENTAL_QUOTAS[domain])
    if (experimental.length !== EXPERIMENTAL_QUOTAS[domain]) throw new Error(`Insufficient experimental inventory: ${domain}`)
    selected.push(...scored.map(row => ({ source_question_id: row.source_question_id, domain, is_scored: true })))
    selected.push(...experimental.map(row => ({ source_question_id: row.source_question_id, domain, is_scored: false })))
  }
  if (selected.length !== 110 || new Set(selected.map(row => row.source_question_id)).size !== 110 ||
      selected.filter(row => row.is_scored).length !== 100 || selected.filter(row => !row.is_scored).length !== 10) {
    throw new Error('Invalid exam selection')
  }
  return shuffle(selected, random)
}
