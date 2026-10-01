import type {
  Chapter20ConceptFamily,
  Chapter20ConceptFamilyId,
  Chapter20LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 20 production lesson, 60 premium flashcards, and 17-question chapter assessment at the C20-0 baseline. C20-1 defines canonical architecture and mappings only; it does not independently source-certify inherited employment, tax, compensation, sales, privacy, consent, or marketing wording.'

export const chapter20LearningObjectives: readonly Chapter20LearningObjective[] = [
  {
    id: 'LO-20-01',
    statement: 'Apply professional workplace expectations when transitioning from school to employment behind the chair.',
    sourceBasis,
    conceptFamilyIds: ['ch20-professional-transition-workplace-expectations'],
  },
  {
    id: 'LO-20-02',
    statement: 'Demonstrate constructive teamwork, communication, conflict resolution, reliability, and professional growth in the barbershop.',
    sourceBasis,
    conceptFamilyIds: ['ch20-teamwork-workplace-relationships'],
  },
  {
    id: 'LO-20-03',
    statement: 'Distinguish employment classifications and common compensation arrangements while recognizing role-specific responsibilities.',
    sourceBasis,
    conceptFamilyIds: ['ch20-employment-classification-compensation'],
  },
  {
    id: 'LO-20-04',
    statement: 'Apply responsible income tracking, reporting, budgeting, debt awareness, and financial-management practices.',
    sourceBasis,
    conceptFamilyIds: ['ch20-financial-responsibility-income-reporting'],
  },
  {
    id: 'LO-20-05',
    statement: 'Use client-centered, ethical selling and retailing practices without pressure or misrepresentation.',
    sourceBasis,
    conceptFamilyIds: ['ch20-ethical-selling-retailing'],
  },
  {
    id: 'LO-20-06',
    statement: 'Build and retain a client base through reliable service, rebooking, referrals, marketing, and appropriate client consent.',
    sourceBasis,
    conceptFamilyIds: ['ch20-client-retention-marketing-consent'],
  },
] as const

export const chapter20ConceptFamilies: readonly Chapter20ConceptFamily[] = [
  {
    id: 'ch20-professional-transition-workplace-expectations',
    name: 'Professional Transition & Workplace Expectations',
    learningObjectiveIds: ['LO-20-01'],
    description: 'Transition from school to professional work, punctuality, reliability, job descriptions, workplace expectations, continuing education, professional conduct, and career accountability.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch20-teamwork-workplace-relationships',
    name: 'Teamwork & Workplace Relationships',
    learningObjectiveIds: ['LO-20-02'],
    description: 'Service-profession teamwork, putting clients and team needs first, pitching in, sharing knowledge, resolving conflict directly, loyalty, role hierarchy, evaluations, mentoring, and maintaining a constructive workplace presence.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch20-employment-classification-compensation',
    name: 'Employment Classification & Compensation',
    learningObjectiveIds: ['LO-20-03'],
    description: 'Employee, independent-contractor, and booth-renter distinctions; compensation structures; role-specific business responsibilities; and employment/tax-document concepts represented in the inherited Chapter 20 material.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Misclassification or incorrect compensation/tax assumptions can create legal and financial consequences. This family is compliance-sensitive but is not a bodily-safety hazard and must not use the urgent-safety recovery rule.',
  },
  {
    id: 'ch20-financial-responsibility-income-reporting',
    name: 'Financial Responsibility & Income Reporting',
    learningObjectiveIds: ['LO-20-04'],
    description: 'Tracking tips and additional income, reporting income, budgeting, debt awareness, pricing decisions, income-growth strategies, professional financial advice, and barbershop technology used for financial management.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Income-reporting and tax-related mistakes can have legal and financial consequences. They require compliance-focused remediation, not urgent bodily-safety escalation.',
  },
  {
    id: 'ch20-ethical-selling-retailing',
    name: 'Ethical Selling & Retailing',
    learningObjectiveIds: ['LO-20-05'],
    description: 'Ticket upgrading, retailing, rapport, identifying client needs, soft-sell versus hard-sell behavior, ethical recommendations, demonstrations, objection handling, and closing a sale without pressure or deception.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch20-client-retention-marketing-consent',
    name: 'Client Retention, Marketing & Consent',
    learningObjectiveIds: ['LO-20-06'],
    description: 'Client retention, reliable service, referrals, local partnerships, public speaking, social-media marketing, rebooking, efficiency, client growth, and consent before using identifiable client images.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Most of this family is ordinary business-development content, but identifiable-client image use introduces privacy and consent obligations. C20-6 must keep those compliance concerns distinct from bodily safety.',
  },
] as const

export const CHAPTER20_CONCEPT_FAMILY_IDS =
  chapter20ConceptFamilies.map((concept) => concept.id) as readonly Chapter20ConceptFamilyId[]

export const ACTIVE_CHAPTER20_CONCEPT_FAMILY_IDS = CHAPTER20_CONCEPT_FAMILY_IDS

export const CHAPTER20_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter20ConceptFamilies.filter((concept) => concept.safetyCritical).map((concept) => concept.id) as readonly Chapter20ConceptFamilyId[]

export const CHAPTER20_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter20ConceptFamilies.filter((concept) => concept.complianceLegalCritical).map((concept) => concept.id) as readonly Chapter20ConceptFamilyId[]

export const isChapter20ConceptFamilyId = (value: string): value is Chapter20ConceptFamilyId =>
  (CHAPTER20_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter20ConceptFamily(id: Chapter20ConceptFamilyId): Chapter20ConceptFamily {
  const concept = chapter20ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 20 concept family: ${id}`)
  return concept
}
