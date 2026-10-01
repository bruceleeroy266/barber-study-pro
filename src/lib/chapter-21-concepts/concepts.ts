import type {
  Chapter21ConceptFamily,
  Chapter21ConceptFamilyId,
  Chapter21LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 21 production lesson, 60 premium flashcards, and 17-question chapter assessment at the C21-0 baseline. C21-1 defines canonical architecture and mappings only; it does not independently source-certify inherited business, legal-structure, tax, licensing, record-retention, worker-classification, financing, lease, privacy, consent, or advertising wording.'

export const chapter21LearningObjectives: readonly Chapter21LearningObjective[] = [
  {
    id: 'LO-21-01',
    statement: 'Compare practical paths for going into business as a barber and recognize the trade-offs between full shop ownership and booth or chair rental.',
    sourceBasis,
    conceptFamilyIds: ['ch21-business-entry-paths'],
  },
  {
    id: 'LO-21-02',
    statement: 'Evaluate the major planning factors involved in opening a barbershop, including location, startup resources, licensing, staffing, and client experience.',
    sourceBasis,
    conceptFamilyIds: ['ch21-shop-opening-planning'],
  },
  {
    id: 'LO-21-03',
    statement: 'Compare common business ownership and legal structures while recognizing that liability, tax treatment, governance, and filing requirements vary by facts and jurisdiction.',
    sourceBasis,
    conceptFamilyIds: ['ch21-ownership-legal-structures'],
  },
  {
    id: 'LO-21-04',
    statement: 'Identify and apply the major components of a realistic barbershop business plan, including market, operations, marketing, and financial projections.',
    sourceBasis,
    conceptFamilyIds: ['ch21-business-plan-financial-planning'],
  },
  {
    id: 'LO-21-05',
    statement: 'Use accurate financial, client, and business records to support reporting, business decisions, documentation, and compliance responsibilities.',
    sourceBasis,
    conceptFamilyIds: ['ch21-recordkeeping-financial-compliance'],
  },
  {
    id: 'LO-21-06',
    statement: 'Evaluate booth-rental and independent-business responsibilities using the actual agreement, working relationship, expenses, tax obligations, insurance, licensing, and client-management requirements.',
    sourceBasis,
    conceptFamilyIds: ['ch21-booth-rental-independent-business-responsibilities'],
  },
  {
    id: 'LO-21-07',
    statement: 'Apply effective barbershop operations and management practices involving scheduling, service quality, staffing, accountability, financial discipline, and client retention.',
    sourceBasis,
    conceptFamilyIds: ['ch21-shop-operations-management'],
  },
  {
    id: 'LO-21-08',
    statement: 'Use ethical advertising and marketing practices to grow a barbershop while respecting client consent, privacy, truthful claims, platform rules, and applicable advertising requirements.',
    sourceBasis,
    conceptFamilyIds: ['ch21-advertising-marketing-client-consent'],
  },
] as const

export const chapter21ConceptFamilies: readonly Chapter21ConceptFamily[] = [
  {
    id: 'ch21-business-entry-paths',
    name: 'Business Entry Paths',
    learningObjectiveIds: ['LO-21-01'],
    description: 'Opening or acquiring a barbershop versus booth or chair rental; differences in control, overhead, independence, risk, resources, client base, and readiness for business ownership.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch21-shop-opening-planning',
    name: 'Shop Opening & Planning',
    learningObjectiveIds: ['LO-21-02'],
    description: 'Location, visibility, startup resources, operating cash, equipment, licensing and permit considerations, staffing model, shop identity, and client-experience planning before opening.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Business registration, licensing, permits, occupancy, employment structure, and related requirements can create legal or financial consequences. These are compliance concerns, not bodily-safety emergencies.',
  },
  {
    id: 'ch21-ownership-legal-structures',
    name: 'Ownership & Legal Structures',
    learningObjectiveIds: ['LO-21-03'],
    description: 'Sole proprietorships, partnerships, LLCs, corporations, franchises, governance, liability concepts, tax-treatment considerations, agreements, and professional advice when choosing a structure.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Incorrect assumptions about entity formation, liability protection, taxes, governance, or agreements can create significant legal and financial consequences. This family requires compliance-focused remediation rather than urgent-safety escalation.',
  },
  {
    id: 'ch21-business-plan-financial-planning',
    name: 'Business Plan & Financial Planning',
    learningObjectiveIds: ['LO-21-04'],
    description: 'Executive summary, business description, market analysis, organization, services and pricing, marketing strategy, startup budget, cash-flow forecasts, break-even analysis, and realistic projections.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch21-recordkeeping-financial-compliance',
    name: 'Recordkeeping & Financial Compliance',
    learningObjectiveIds: ['LO-21-05'],
    description: 'Financial records, income and expense documentation, client records, tax and reporting support, record-retention awareness, business metrics, and documentation used for decisions or disputes.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Income reporting, tax documentation, record retention, and client-information handling can carry legal and financial consequences. These concerns remain separate from bodily safety.',
  },
  {
    id: 'ch21-booth-rental-independent-business-responsibilities',
    name: 'Booth Rental & Independent Business Responsibilities',
    learningObjectiveIds: ['LO-21-06'],
    description: 'Rental agreements, actual worker relationship, taxes, expenses, insurance, licensing, supplies, client records, pricing, scheduling, business independence, and other responsibilities that can vary by arrangement and jurisdiction.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Booth-rental labels do not by themselves determine legal status or responsibilities. Classification, tax, lease, insurance, licensing, and client-record mistakes require compliance remediation, not the urgent bodily-safety pathway.',
  },
  {
    id: 'ch21-shop-operations-management',
    name: 'Shop Operations & Management',
    learningObjectiveIds: ['LO-21-07'],
    description: 'Scheduling, customer service, cleanliness as an operational standard, staff roles, accountability, retail and service revenue, financial discipline, shop culture, performance monitoring, and client retention.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
    criticalityRationale: 'Operational cleanliness matters professionally, but Chapter 21 does not define infection-control or immediate bodily-harm procedures as a distinct concept family. True safety-critical content remains governed by the relevant safety chapters and shared safety rules.',
  },
  {
    id: 'ch21-advertising-marketing-client-consent',
    name: 'Advertising, Marketing & Client Consent',
    learningObjectiveIds: ['LO-21-08'],
    description: 'Target market, advertising channels, consistent promotion, reviews and referrals, local partnerships, social media, client images, truthful marketing, consent, privacy, and rebooking as business-growth practices.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Client images, testimonials, promotions, advertising claims, privacy, and consent can involve legal or policy obligations. These require compliance-focused review while remaining distinct from bodily-safety escalation.',
  },
] as const

export const CHAPTER21_CONCEPT_FAMILY_IDS =
  chapter21ConceptFamilies.map((concept) => concept.id) as readonly Chapter21ConceptFamilyId[]

export const ACTIVE_CHAPTER21_CONCEPT_FAMILY_IDS = CHAPTER21_CONCEPT_FAMILY_IDS

export const CHAPTER21_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter21ConceptFamilies
    .filter((concept) => concept.safetyCritical)
    .map((concept) => concept.id) as readonly Chapter21ConceptFamilyId[]

export const CHAPTER21_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter21ConceptFamilies
    .filter((concept) => concept.complianceLegalCritical)
    .map((concept) => concept.id) as readonly Chapter21ConceptFamilyId[]

export const isChapter21ConceptFamilyId = (
  value: string,
): value is Chapter21ConceptFamilyId =>
  (CHAPTER21_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter21ConceptFamily(
  id: Chapter21ConceptFamilyId,
): Chapter21ConceptFamily {
  const concept = chapter21ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 21 concept family: ${id}`)
  return concept
}
