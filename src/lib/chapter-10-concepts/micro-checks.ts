import type { Chapter10ConceptFamilyId } from './types'
import type { Chapter10Difficulty, Chapter10EvidenceRecord } from './grading'
import { chapter10MicroCheckPlacements } from './mappings'

export type Chapter10MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter10MicroCheckQuestion {
  id: `mcq-10-${string}`
  conceptFamilyId: Chapter10ConceptFamilyId
  difficulty: Exclude<Chapter10Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter10MicroCheckAnswer
  explanation: string
}

export interface Chapter10MicroCheck {
  id: `mc-10-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter10ConceptFamilyId
  title: string
  questions: readonly Chapter10MicroCheckQuestion[]
}

const q = (
  id: Chapter10MicroCheckQuestion['id'],
  conceptFamilyId: Chapter10ConceptFamilyId,
  difficulty: Chapter10MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter10MicroCheckAnswer,
  explanation: string,
): Chapter10MicroCheckQuestion => ({
  id,
  conceptFamilyId,
  difficulty,
  question,
  answer_a,
  answer_b,
  answer_c,
  answer_d,
  correctAnswer,
  explanation,
})

export const chapter10MicroChecks: readonly Chapter10MicroCheck[] = [
  {
    id: 'mc-10-01',
    afterSectionId: 'medulla',
    conceptFamilyId: 'ch10-hair-anatomy-structure',
    title: 'Hair Structure Check',
    questions: [
      q(
        'mcq-10-001',
        'ch10-hair-anatomy-structure',
        'application',
        'A question asks which shaft layer contains pigment and the side bonds most involved in chemical-service changes. Which layer is being tested?',
        'Cuticle',
        'Cortex',
        'Medulla',
        'Hair bulb',
        'b',
        'The cortex contains pigment and side bonds and is central to many chemical-service effects.',
      ),
      q(
        'mcq-10-002',
        'ch10-hair-anatomy-structure',
        'understanding',
        'Which root structure provides the blood and nerve supply associated with hair growth?',
        'Sebaceous gland',
        'Arrector pili',
        'Dermal papilla',
        'Cuticle',
        'c',
        'The dermal papilla is located at the base of the follicle and provides blood and nerve support associated with growth.',
      ),
    ],
  },
  {
    id: 'mc-10-02',
    afterSectionId: 'keratinization-cohns',
    conceptFamilyId: 'ch10-hair-chemistry-bonds',
    title: 'Hair Chemistry & Bond Check',
    questions: [
      q(
        'mcq-10-003',
        'ch10-hair-chemistry-bonds',
        'application',
        'Hair changes shape when wet or heated and then reforms as it dries. Which side bond best explains this temporary change?',
        'Disulfide bond',
        'Peptide bond',
        'Salt bond',
        'Hydrogen bond',
        'd',
        'Hydrogen bonds are weak physical side bonds broken by water or heat and re-form as the hair dries.',
      ),
      q(
        'mcq-10-004',
        'ch10-hair-chemistry-bonds',
        'application',
        'A permanent wave changes a strong chemical side bond that is later re-formed by the neutralizer. Which bond is involved?',
        'Disulfide bond',
        'Hydrogen bond',
        'Salt bond',
        'Peptide bond',
        'a',
        'Chapter 10 describes disulfide bonds as strong chemical side bonds broken during permanent waving and re-formed by neutralization.',
      ),
    ],
  },
  {
    id: 'mc-10-03',
    afterSectionId: 'growth-patterns',
    conceptFamilyId: 'ch10-pigment-wave-growth-patterns',
    title: 'Pigment, Wave & Growth Pattern Check',
    questions: [
      q(
        'mcq-10-005',
        'ch10-pigment-wave-growth-patterns',
        'understanding',
        'Which pigment pairing is correct?',
        'Eumelanin—red/yellow; pheomelanin—brown/black',
        'Eumelanin—brown/black; pheomelanin—red/ginger/yellow',
        'Eumelanin—gray only; pheomelanin—white only',
        'Both pigments produce the same tones',
        'b',
        'Eumelanin is associated with brown/black tones; pheomelanin with red, ginger, and yellow tones.',
      ),
      q(
        'mcq-10-006',
        'ch10-pigment-wave-growth-patterns',
        'application',
        'A strand has an elliptical cross section. Which wave pattern does Chapter 10 associate with that shape?',
        'Straight',
        'No natural pattern',
        'Extremely curly',
        'Only slightly wavy',
        'c',
        'Chapter 10 associates an elliptical cross section with extremely curly hair.',
      ),
    ],
  },
  {
    id: 'mc-10-04',
    afterSectionId: 'growth-cycle',
    conceptFamilyId: 'ch10-growth-cycle-hair-types',
    title: 'Growth Cycle Check',
    questions: [
      q(
        'mcq-10-007',
        'ch10-growth-cycle-hair-types',
        'understanding',
        'Which statement correctly distinguishes anagen from telogen?',
        'Anagen is 2–10 years of active growth; telogen is about 3–6 months of resting/shedding',
        'Anagen is the resting phase; telogen is the active growth phase',
        'Both phases are short transition periods',
        'Both phases describe hair-shaft disorders',
        'a',
        'The source record gives anagen as about 2–10 years of active growth and telogen as about 3–6 months of resting/shedding.',
      ),
      q(
        'mcq-10-008',
        'ch10-growth-cycle-hair-types',
        'scenario',
        'A client is concerned about shedding about 80 hairs in one day. Which Chapter 10 fact is most relevant?',
        'Any daily shedding is abnormal alopecia',
        'Normal shedding is fewer than 10 hairs per day',
        'Normal shedding occurs only during anagen',
        'Normal shedding is about 75–100 hairs per day',
        'd',
        'Chapter 10 gives normal daily shedding as about 75–100 hairs.',
      ),
    ],
  },
  {
    id: 'mc-10-05',
    afterSectionId: 'elasticity',
    conceptFamilyId: 'ch10-analysis-properties',
    title: 'Hair & Scalp Analysis Check',
    questions: [
      q(
        'mcq-10-009',
        'ch10-analysis-properties',
        'scenario',
        'Wet hair breaks easily instead of stretching and returning. What does that finding indicate?',
        'High density',
        'Low or poor elasticity',
        'Resistant porosity',
        'Normal elasticity',
        'b',
        'Low or poor elasticity means the hair is brittle and breaks more easily instead of stretching and returning normally.',
      ),
      q(
        'mcq-10-010',
        'ch10-analysis-properties',
        'application',
        'Hair feels rough when dry strands are slid between the fingers toward the scalp. Which property is being evaluated?',
        'Porosity',
        'Density',
        'Growth rate',
        'Pigment',
        'a',
        'The chapter’s porosity test uses the feel of the cuticle surface; greater roughness indicates greater porosity.',
      ),
    ],
  },
  {
    id: 'mc-10-06',
    afterSectionId: 'other',
    conceptFamilyId: 'ch10-alopecia-hair-loss',
    title: 'Alopecia Recognition Check',
    questions: [
      q(
        'mcq-10-011',
        'ch10-alopecia-hair-loss',
        'application',
        'A client has complete loss of scalp hair but still has body hair. Which term best matches Chapter 10?',
        'Alopecia universalis',
        'Androgenic alopecia',
        'Alopecia totalis',
        'Alopecia areata',
        'c',
        'Alopecia totalis means complete scalp hair loss; alopecia universalis means complete body hair loss.',
      ),
      q(
        'mcq-10-012',
        'ch10-alopecia-hair-loss',
        'scenario',
        'A client develops sudden round bald patches that may progress to complete scalp hair loss. Which condition best fits the source record?',
        'Alopecia areata',
        'Normal telogen shedding',
        'Canities',
        'Pityriasis',
        'a',
        'Chapter 10 describes alopecia areata as autoimmune hair loss with sudden bald patches that can progress to totalis.',
      ),
    ],
  },
  {
    id: 'mc-10-07',
    afterSectionId: 'non-contagious-disorders',
    conceptFamilyId: 'ch10-hair-shaft-disorders',
    title: 'Hair-Shaft Disorder Check',
    questions: [
      q(
        'mcq-10-013',
        'ch10-hair-shaft-disorders',
        'application',
        'A strand has splitting at the ends. Which Chapter 10 term matches this finding?',
        'Monilethrix',
        'Canities',
        'Ringed hair',
        'Trichoptilosis',
        'd',
        'Trichoptilosis is the Chapter 10 term for split ends.',
      ),
      q(
        'mcq-10-014',
        'ch10-hair-shaft-disorders',
        'application',
        'A hair strand has a beaded appearance and breaks easily. Which disorder best matches?',
        'Trichoptilosis',
        'Monilethrix',
        'Canities',
        'Pityriasis',
        'b',
        'Chapter 10 describes monilethrix as beaded hair that breaks easily.',
      ),
    ],
  },
  {
    id: 'mc-10-08',
    afterSectionId: 'contagious-disorders',
    conceptFamilyId: 'ch10-infectious-parasitic-scalp',
    title: 'Contagious & Parasitic Condition Check',
    questions: [
      q(
        'mcq-10-015',
        'ch10-infectious-parasitic-scalp',
        'scenario',
        'A client has severe scalp itching and nits attached to hair strands. Which condition best matches Chapter 10?',
        'Tinea favosa',
        'Pityriasis',
        'Pediculosis capitis',
        'Canities',
        'c',
        'Pediculosis capitis is head-lice infestation; Chapter 10 notes severe itching and nits attached to hair strands.',
      ),
      q(
        'mcq-10-016',
        'ch10-infectious-parasitic-scalp',
        'understanding',
        'Which tinea condition is ringworm of the scalp?',
        'Tinea capitis',
        'Tinea barbae',
        'Tinea favosa',
        'Pseudofolliculitis barbae',
        'a',
        'Chapter 10 identifies tinea capitis as ringworm of the scalp.',
      ),
    ],
  },
  {
    id: 'mc-10-09',
    afterSectionId: 'scalp-analysis-rules',
    conceptFamilyId: 'ch10-service-safety-referral',
    title: 'Service Safety & Referral Check',
    questions: [
      q(
        'mcq-10-017',
        'ch10-service-safety-referral',
        'scenario',
        'Live parasites are found during pre-service scalp analysis. What is the correct next step?',
        'Continue if only disposable tools are used',
        'Do not begin the service; follow cleaning/disinfection and referral guidance',
        'Proceed with a haircut but avoid chemical products',
        'Diagnose the infestation before deciding',
        'b',
        'Chapter 10 states that a service should not begin when parasites are present.',
      ),
      q(
        'mcq-10-018',
        'ch10-service-safety-referral',
        'scenario',
        'Irritation or abrasions are present before a planned chemical service. What does Chapter 10 support?',
        'Proceed if the client signs a waiver',
        'Reduce processing time and continue',
        'Avoid diagnosis but continue the chemical service',
        'Do not proceed with the chemical service while those conditions are present',
        'd',
        'The Chapter 10 source record states that chemical services should not proceed when irritation or abrasions are present.',
      ),
      q(
        'mcq-10-019',
        'ch10-service-safety-referral',
        'application',
        'Which statement stays within barbering scope when an unusual scalp condition is observed?',
        'Describe observable signs, make a service-safety decision, and refer when appropriate without diagnosing',
        'Assign the most likely medical diagnosis before service',
        'Recommend prescription treatment based on appearance',
        'Continue every service unless the client reports pain',
        'a',
        'Chapter 10 keeps the barber role focused on observation, service safety, sanitation, communication, and referral rather than medical diagnosis or prescribing.',
      ),
    ],
  },
]

export interface Chapter10MicroCheckResponse {
  questionId: Chapter10MicroCheckQuestion['id']
  selectedAnswer: Chapter10MicroCheckAnswer
}

export function buildChapter10MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter10MicroCheckResponse[],
  timestamp: string,
): Chapter10EvidenceRecord[] {
  const questionMap = new Map(
    chapter10MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter10EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-10',
      conceptFamilyId: question.conceptFamilyId,
      source: 'micro_check',
      itemId: question.id,
      difficulty: question.difficulty,
      correct: response.selectedAnswer === question.correctAnswer,
      attemptPhase: 'initial',
      timestamp,
    })
  }

  return records
}

export function mergeChapter10EvidenceWithoutContamination(
  existing: readonly Chapter10EvidenceRecord[],
  incoming: readonly Chapter10EvidenceRecord[],
): Chapter10EvidenceRecord[] {
  const merged = [...existing]
  const keys = new Set(
    existing.map((record) =>
      [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|'),
    ),
  )

  for (const record of incoming) {
    const key = [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|')
    if (keys.has(key)) continue
    keys.add(key)
    merged.push(record)
  }

  return merged
}

export function validateChapter10MicroCheckPlacements(): boolean {
  if (chapter10MicroChecks.length !== chapter10MicroCheckPlacements.length) return false

  return chapter10MicroChecks.every((check) => {
    const placement = chapter10MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
