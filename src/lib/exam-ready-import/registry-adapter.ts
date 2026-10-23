/** Stage 4B: pure, read-only adapter for the private comprehensive-exam registry.
 * Never import this module into client components or student-facing API responses.
 */
import { examReadyQuestions, EXAM_READY_EXPECTED_COUNT } from './index'
import { validateExamReadyBank, type ExamReadySourceQuestion } from './source-bank'

export const EXAM_READY_CONTENT_VERSION = 'exam-ready-573-v1' as const
export const EXAM_READY_SOURCE_PREFIX = 'exam-ready:' as const

export type RegistryDomain =
  | 'scientific_concepts'
  | 'implements_equipment'
  | 'hair_care_services'
  | 'facial_hair_skin_care_services'
export type RegistryOption = 'a' | 'b' | 'c' | 'd'
export type RegistryQuestionInsert = {
  source_question_id: string
  source_kind: 'comprehensive_bank'
  source_chapter_id: null
  domain: RegistryDomain
  prompt: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_option: RegistryOption
  explanation: string
  content_version: typeof EXAM_READY_CONTENT_VERSION
  provenance: {
    origin: 'exam-ready'
    originalQuestionId: string
    subject: string
    competency: string
    reasoningType: ExamReadySourceQuestion['type']
    difficulty: ExamReadySourceQuestion['difficulty']
    sourceBasis: string[]
  }
  status: 'active'
}

const DOMAINS: Record<string, RegistryDomain> = {
  'Scientific Concepts': 'scientific_concepts',
  'Implements & Equipment': 'implements_equipment',
  'Hair Care Services': 'hair_care_services',
  'Facial Hair & Skin Care': 'facial_hair_skin_care_services',
}

export const EXAM_READY_SCORED_DOMAIN_QUOTAS: Record<RegistryDomain, number> = {
  scientific_concepts: 35,
  implements_equipment: 10,
  hair_care_services: 40,
  facial_hair_skin_care_services: 15,
}

/** Throws on any unmappable question; does not write to Supabase. */
export function mapExamReadyQuestion(question: ExamReadySourceQuestion): RegistryQuestionInsert {
  const issues = validateExamReadyBank([question])
  if (issues.length) throw new Error(`Invalid Exam Ready question ${question.id}: ${issues.map(i => i.issue).join(', ')}`)
  const domain = DOMAINS[question.domain]
  if (!domain) throw new Error(`Unmapped Exam Ready domain for ${question.id}: ${question.domain}`)
  const options = new Map(question.options.map(option => [option.id, option.text]))
  const keys = ['a', 'b', 'c', 'd'] as const
  if (options.size !== 4 || keys.some(key => !options.get(key))) {
    throw new Error(`Exam Ready ${question.id}: expected answer option ids a,b,c,d`)
  }
  if (!keys.some(key => key === question.correctOptionId)) {
    throw new Error(`Exam Ready ${question.id}: invalid correct option id`)
  }
  const correct_option = question.correctOptionId as RegistryOption
  return {
    source_question_id: `${EXAM_READY_SOURCE_PREFIX}${question.id}`,
    source_kind: 'comprehensive_bank',
    source_chapter_id: null,
    domain,
    prompt: question.prompt,
    option_a: options.get('a')!,
    option_b: options.get('b')!,
    option_c: options.get('c')!,
    option_d: options.get('d')!,
    correct_option,
    explanation: question.explanation,
    content_version: EXAM_READY_CONTENT_VERSION,
    provenance: {
      origin: 'exam-ready',
      originalQuestionId: question.id,
      subject: question.subject,
      competency: question.competency,
      reasoningType: question.type,
      difficulty: question.difficulty,
      sourceBasis: [...question.sourceBasis],
    },
    status: 'active',
  }
}

export type RegistryMappingReport = {
  rows: RegistryQuestionInsert[]
  counts: Record<RegistryDomain, number>
  scoredQuotaEligible: boolean
}

/** All-or-nothing in-memory preparation; no SQL, auth client or DB side effects. */
export function prepareExamReadyRegistryRows(
  questions: readonly ExamReadySourceQuestion[] = examReadyQuestions,
  existingSourceIds: Iterable<string> = [],
): RegistryMappingReport {
  if (questions.length !== EXAM_READY_EXPECTED_COUNT) {
    throw new Error(`Expected ${EXAM_READY_EXPECTED_COUNT} questions; received ${questions.length}`)
  }
  const issues = validateExamReadyBank(questions)
  if (issues.length) throw new Error(`Exam Ready bank invalid: ${JSON.stringify(issues.slice(0, 10))}`)
  const existing = new Set(existingSourceIds)
  const rows = questions.map(mapExamReadyQuestion)
  const ids = rows.map(row => row.source_question_id)
  if (new Set(ids).size !== rows.length) throw new Error('Mapped source IDs are not unique')
  const collisions = ids.filter(id => existing.has(id))
  if (collisions.length) throw new Error(`Registry source ID collision: ${collisions.slice(0, 10).join(', ')}`)
  const counts: Record<RegistryDomain, number> = {
    scientific_concepts: 0,
    implements_equipment: 0,
    hair_care_services: 0,
    facial_hair_skin_care_services: 0,
  }
  for (const row of rows) counts[row.domain]++
  const scoredQuotaEligible = (Object.keys(EXAM_READY_SCORED_DOMAIN_QUOTAS) as RegistryDomain[])
    .every(domain => counts[domain] >= EXAM_READY_SCORED_DOMAIN_QUOTAS[domain])
  if (!scoredQuotaEligible) throw new Error('Insufficient questions for scored-domain quotas')
  return { rows, counts, scoredQuotaEligible }
}
