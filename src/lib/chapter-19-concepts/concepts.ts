import type {
  Chapter19ConceptFamily,
  Chapter19ConceptFamilyId,
  Chapter19LearningObjective,
} from './types'

const sourceBasis =
  'Current ASCYN PRO Chapter 19 runtime lesson shell, 60 flashcards, and 15-question chapter assessment at the C19-0 baseline. C19-1 defines canonical architecture and mappings only; it does not independently source-certify inherited licensing, examination, employment-law, contract, safety, or jurisdiction-specific wording.'

export const chapter19LearningObjectives: readonly Chapter19LearningObjective[] = [
  { id: 'LO-19-01', statement: 'Verify the licensing path and current requirements using applicable official sources.', sourceBasis, conceptFamilyIds: ['ch19-licensing-requirements-verification'] },
  { id: 'LO-19-02', statement: 'Apply effective written/theory examination preparation and test-reasoning strategies.', sourceBasis, conceptFamilyIds: ['ch19-exam-preparation-test-reasoning'] },
  { id: 'LO-19-03', statement: 'Prepare for practical/skills testing while applying infection-control and service-safety expectations.', sourceBasis, conceptFamilyIds: ['ch19-practical-exam-safety-readiness'] },
  { id: 'LO-19-04', statement: 'Evaluate personal strengths, professional behaviors, and transferable skills for employment readiness.', sourceBasis, conceptFamilyIds: ['ch19-employment-readiness-professionalism'] },
  { id: 'LO-19-05', statement: 'Build accurate, professional résumé, portfolio, cover-letter, and application materials.', sourceBasis, conceptFamilyIds: ['ch19-resume-portfolio-application-materials'] },
  { id: 'LO-19-06', statement: 'Research employers, network, prepare for interviews, and apply professional interview/follow-up practices.', sourceBasis, conceptFamilyIds: ['ch19-job-search-shop-research-interview'] },
  { id: 'LO-19-07', statement: 'Recognize employment-law boundaries and review workplace agreements/terms carefully before accepting obligations.', sourceBasis, conceptFamilyIds: ['ch19-employment-law-contracts-compliance'] },
] as const

export const chapter19ConceptFamilies: readonly Chapter19ConceptFamily[] = [
  {
    id: 'ch19-licensing-requirements-verification',
    name: 'Licensing Requirements & Official Verification',
    learningObjectiveIds: ['LO-19-01'],
    description: 'Jurisdiction-specific licensing paths, applications, eligibility, current requirements, official licensing sources, and authorized exam-provider verification.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'Incorrect licensing information can create legal or professional consequences, but it is not itself a bodily-safety hazard. C19-6 must keep compliance review distinct from urgent safety escalation.',
  },
  {
    id: 'ch19-exam-preparation-test-reasoning',
    name: 'Exam Preparation & Test Reasoning',
    learningObjectiveIds: ['LO-19-02'],
    description: 'Study planning, written/theory exam preparation, question stems, qualifiers, elimination, deductive reasoning, pacing, and other test-taking strategies.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch19-practical-exam-safety-readiness',
    name: 'Practical Exam, Infection Control & Safety Readiness',
    learningObjectiveIds: ['LO-19-03'],
    description: 'Practical or skills examination readiness, equipment preparation, infection-control expectations, procedural safety, and safe performance under examination conditions.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: true,
    complianceLegalCritical: false,
    criticalityRationale: 'This is the only Chapter 19 family eligible for the urgent-safety pathway because misses can involve infection-control or service-safety hazards during practical work.',
  },
  {
    id: 'ch19-employment-readiness-professionalism',
    name: 'Employment Readiness & Professionalism',
    learningObjectiveIds: ['LO-19-04'],
    description: 'Self-inventory, integrity, work ethic, motivation, career mindset, transferable skills, and professional behaviors that support job readiness.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch19-resume-portfolio-application-materials',
    name: 'Résumé, Portfolio & Application Materials',
    learningObjectiveIds: ['LO-19-05'],
    description: 'Résumé construction, accomplishments, transferable skills as application evidence, portfolios, cover letters, and employment application materials.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch19-job-search-shop-research-interview',
    name: 'Job Search, Shop Research & Interview Practice',
    learningObjectiveIds: ['LO-19-06'],
    description: 'Employer research, networking, shop visits, job-search timing, interview preparation, professional presentation, interview etiquette, questions, and follow-up.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: false,
  },
  {
    id: 'ch19-employment-law-contracts-compliance',
    name: 'Employment Law, Contracts & Professional Compliance',
    learningObjectiveIds: ['LO-19-07'],
    description: 'Interview-law boundaries, disability and work-authorization awareness, employment agreements, noncompete/confidentiality provisions, and careful review of workplace terms.',
    importance: 'core',
    professionalRelevance: 'CORE',
    examRelevance: 'INDIRECT_REFERENCE_ONLY',
    sourceProvenance: 'INDUSTRY_STANDARD_SUBJECT_MATTER',
    status: 'active',
    safetyCritical: false,
    complianceLegalCritical: true,
    criticalityRationale: 'These concepts can carry legal or economic consequences, but they must remain separate from the urgent bodily-safety pathway.',
  },
] as const

export const CHAPTER19_CONCEPT_FAMILY_IDS =
  chapter19ConceptFamilies.map((concept) => concept.id) as readonly Chapter19ConceptFamilyId[]

export const ACTIVE_CHAPTER19_CONCEPT_FAMILY_IDS = CHAPTER19_CONCEPT_FAMILY_IDS

export const CHAPTER19_SAFETY_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter19ConceptFamilies.filter((concept) => concept.safetyCritical).map((concept) => concept.id) as readonly Chapter19ConceptFamilyId[]

export const CHAPTER19_COMPLIANCE_LEGAL_CRITICAL_CONCEPT_FAMILY_IDS =
  chapter19ConceptFamilies.filter((concept) => concept.complianceLegalCritical).map((concept) => concept.id) as readonly Chapter19ConceptFamilyId[]

export const isChapter19ConceptFamilyId = (value: string): value is Chapter19ConceptFamilyId =>
  (CHAPTER19_CONCEPT_FAMILY_IDS as readonly string[]).includes(value)

export function getChapter19ConceptFamily(id: Chapter19ConceptFamilyId): Chapter19ConceptFamily {
  const concept = chapter19ConceptFamilies.find((item) => item.id === id)
  if (!concept) throw new Error(`Unknown Chapter 19 concept family: ${id}`)
  return concept
}
