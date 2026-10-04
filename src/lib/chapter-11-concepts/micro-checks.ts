import type { Chapter11ConceptFamilyId } from './types'
import type { Chapter11Difficulty, Chapter11EvidenceRecord } from './grading'
import { chapter11MicroCheckPlacements } from './mappings'

export type Chapter11MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter11MicroCheckQuestion {
  id: `mcq-11-${string}`
  conceptFamilyId: Chapter11ConceptFamilyId
  difficulty: Exclude<Chapter11Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter11MicroCheckAnswer
  explanation: string
}

export interface Chapter11MicroCheck {
  id: `mc-11-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter11ConceptFamilyId
  title: string
  questions: readonly Chapter11MicroCheckQuestion[]
}

const q = (
  id: Chapter11MicroCheckQuestion['id'],
  conceptFamilyId: Chapter11ConceptFamilyId,
  difficulty: Chapter11MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter11MicroCheckAnswer,
  explanation: string,
): Chapter11MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d,
  correctAnswer, explanation,
})

export const chapter11MicroChecks: readonly Chapter11MicroCheck[] = [
  {
    id: 'mc-11-01',
    afterSectionId: 'draping-shampoo-service',
    conceptFamilyId: 'ch11-shampoo-draping-service',
    title: 'Draping & Shampoo Service Check',
    questions: [
      q('mcq-11-001','ch11-shampoo-draping-service','application',
        'A client is receiving a wet shampoo service. Which draping choice best matches Chapter 11?',
        'Use a dry haircutting cape only','Use a waterproof shampoo cape','Skip draping if the service is brief','Use only a neck strip',
        'b','Chapter 11 identifies a waterproof shampoo cape for wet or chemical services.'),
      q('mcq-11-002','ch11-shampoo-draping-service','scenario',
        'A wheelchair-bound client is uncomfortable in the usual shampoo position. What should the barber do?',
        'Require the reclined method','Skip the shampoo service','Ask how the client can be positioned safely and comfortably','Use the inclined method without asking',
        'c','Chapter 11 supports adapting the shampoo method to the client’s safe and comfortable positioning needs.'),
    ],
  },
  {
    id: 'mc-11-02',
    afterSectionId: 'product-selection-system',
    conceptFamilyId: 'ch11-analysis-product-selection',
    title: 'Analysis & Product Selection Check',
    questions: [
      q('mcq-11-003','ch11-analysis-product-selection','application',
        'Which group contains Chapter 11 analysis factors used before product selection?',
        'Condition, texture, density, porosity, and elasticity','Hair color, growth pattern, face shape, density, and service price','Porosity, density, fragrance preference, brand loyalty, and budget','Condition, texture, haircut shape, styling frequency, and age',
        'a','Chapter 11 uses condition, texture, density, porosity, elasticity, and scalp findings to guide product selection.'),
      q('mcq-11-004','ch11-analysis-product-selection','scenario',
        'A client has dry, damaged hair. Which product direction best matches Chapter 11?',
        'Use a clarifying shampoo followed by a lightweight conditioner to remove buildup before adding moisture','Use a pH-balanced cleanser without added protein, since damaged hair should avoid protein','Use a heavy oil treatment first, then choose shampoo based on how much residue remains','Gentle cleansing with deep moisturizing and protein/moisturizing repair options',
        'd','The Chapter 11 product table pairs dry/damaged hair with gentle cleansing, deep moisturizing, and repair options.'),
    ],
  },
  {
    id: 'mc-11-03',
    afterSectionId: 'massage-techniques',
    conceptFamilyId: 'ch11-scalp-massage',
    title: 'Scalp Massage Technique Check',
    questions: [
      q('mcq-11-005','ch11-scalp-massage','understanding',
        'Which three massage manipulations are identified in Chapter 11?',
        'Tapping, pinching, pulling','Rotary, sliding, and back-and-forth','Kneading, percussion, vibration','Pressing, rolling, stretching',
        'b','Chapter 11 identifies rotary, sliding, and back-and-forth scalp-massage movements.'),
      q('mcq-11-006','ch11-scalp-massage','scenario',
        'While working from behind the ears toward the crown, which movement choice matches the Chapter 11 table?',
        'Rotary and sliding','Back-and-forth only','Tapping and pulling','Sliding only',
        'a','The Chapter 11 massage table assigns rotary and sliding movements to this area.'),
    ],
  },
  {
    id: 'mc-11-04',
    afterSectionId: 'treatment-procedure',
    conceptFamilyId: 'ch11-scalp-hair-treatments',
    title: 'Hair & Scalp Treatment Check',
    questions: [
      q('mcq-11-007','ch11-scalp-hair-treatments','understanding',
        'What two principles does Chapter 11 identify as essential for hair and scalp treatment?',
        'Heat and chemical action','Color and texture change','Cleanliness and stimulation','Cutting and styling',
        'c','Chapter 11 identifies cleanliness and stimulation as essential treatment principles.'),
      q('mcq-11-008','ch11-scalp-hair-treatments','application',
        'Which sequence best matches the Chapter 11 hair-tonic treatment?',
        'Steam, cut, tonic, rinse, style','Apply tonic, massage, apply steam, massage again, comb into style','Shampoo, color, steam, condition, cut','Massage, rinse, tonic, cut, steam',
        'b','The source sequence is tonic application, massage, steam, massage again, then comb into the desired style.'),
    ],
  },
  {
    id: 'mc-11-05',
    afterSectionId: 'treatment-equipment-steam-hot-towels',
    conceptFamilyId: 'ch11-treatment-equipment',
    title: 'Treatment Equipment Check',
    questions: [
      q('mcq-11-009','ch11-treatment-equipment','application',
        'What may be used as a substitute for a scalp steamer?',
        'A hot towel or series of hot-towel applications','A hood dryer set to low heat with the scalp covered by a damp towel','A warm mist spray applied continuously while the treatment processes','A series of warm compresses applied to the hair lengths rather than the scalp',
        'a','Chapter 11 states that hot towels may substitute for a scalp steamer.'),
      q('mcq-11-010','ch11-treatment-equipment','scenario',
        'A barber is using an electric massager. Which control set is required?',
        'Hair length, haircut shape, and shampoo brand','Temperature, cape type, and bowl height','Intensity, duration, and pressure','Hair color, density, and product scent',
        'c','Chapter 11 directs the barber to regulate intensity and duration and avoid excessive pressure.'),
    ],
  },
  {
    id: 'mc-11-06',
    afterSectionId: 'dandruff',
    conceptFamilyId: 'ch11-scalp-condition-recognition',
    title: 'Scalp Condition Recognition Check',
    questions: [
      q('mcq-11-011','ch11-scalp-condition-recognition','understanding',
        'Which organism does the Chapter 11 source summary associate with dandruff?',
        'Staphylococcus','Malassezia','A parasitic mite','A virus',
        'b','The Chapter 11 source summary associates dandruff with Malassezia.'),
      q('mcq-11-012','ch11-scalp-condition-recognition','application',
        'Which condition does Chapter 11 associate with oily scalp?',
        'Reduced oil-gland activity','Low elasticity','Overactive sebaceous glands','Low density',
        'c','The source associates oily scalp with overactive sebaceous glands.'),
    ],
  },
  {
    id: 'mc-11-07',
    afterSectionId: 'board-exam-alerts',
    conceptFamilyId: 'ch11-service-safety-referral',
    title: 'Service Safety & Referral Check',
    questions: [
      q('mcq-11-013','ch11-service-safety-referral','scenario',
        'A parasitic scalp disorder is observed during analysis. What should the barber do?',
        'Treat it with a stronger shampoo','Continue with extra disinfectant','Do not treat the disorder and refer the client to a physician','Use steam first and reassess',
        'c','Chapter 11 places parasitic scalp disorders outside barber treatment and directs referral.'),
      q('mcq-11-014','ch11-service-safety-referral','scenario',
        'A scalp condition appears consistent with a staphylococcal infection. What is the correct service decision?',
        'Do not treat the disorder as a barber; refer the client to a physician','Avoid massage and chemical services, but continue with a haircut if the affected area can be covered','Use a cosmetic antiseptic first and proceed if redness decreases','Postpone the service until symptoms improve, then resume without referral if the scalp looks normal',
        'a','Chapter 11 specifically places staphylococcal scalp infections outside the barber’s treatment scope.'),
      q('mcq-11-015','ch11-service-safety-referral','application',
        'Which statement stays within Chapter 11 barbering scope?',
        'Diagnose the condition from appearance before service','Prescribe a medicated treatment if cosmetic care fails','Continue every service unless pain is reported','Describe observable findings, make a service-safety decision, and refer when appropriate without diagnosing',
        'd','Chapter 11 supports observation, cosmetic service decisions, and referral rather than medical diagnosis or prescribing.'),
    ],
  },
  {
    id: 'mc-11-08',
    afterSectionId: 'home-care-system',
    conceptFamilyId: 'ch11-client-care-professional-practice',
    title: 'Client Care & Professional Practice Check',
    questions: [
      q('mcq-11-016','ch11-client-care-professional-practice','application',
        'What makes a Chapter 11 home-care recommendation appropriate?',
        'It is tied to the client’s analyzed hair/scalp needs and product directions','It promises a medical cure','It is the most expensive product available','It replaces referral for medical concerns',
        'a','Chapter 11 home-care guidance should follow analysis, product directions, and barbering scope.'),
      q('mcq-11-017','ch11-client-care-professional-practice','scenario',
        'A client asks the barber to recommend a cosmetic product instead of seeking medical care for an out-of-scope scalp condition. What should the barber do?',
        'Recommend the strongest product available','Explain the cosmetic-service boundary and refer appropriately','Use massage to test whether the condition improves','Sell a product but advise double use',
        'b','When a condition is outside routine cosmetic maintenance, referral is more appropriate than substituting a product recommendation for medical care.'),
    ],
  },
]

export interface Chapter11MicroCheckResponse {
  questionId: Chapter11MicroCheckQuestion['id']
  selectedAnswer: Chapter11MicroCheckAnswer
}

export function buildChapter11MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter11MicroCheckResponse[],
  timestamp: string,
): Chapter11EvidenceRecord[] {
  const questionMap = new Map(
    chapter11MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter11EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-11',
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

export function mergeChapter11EvidenceWithoutContamination(
  existing: readonly Chapter11EvidenceRecord[],
  incoming: readonly Chapter11EvidenceRecord[],
): Chapter11EvidenceRecord[] {
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

export function validateChapter11MicroCheckPlacements(): boolean {
  if (chapter11MicroChecks.length !== chapter11MicroCheckPlacements.length) return false

  return chapter11MicroChecks.every((check) => {
    const placement = chapter11MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
