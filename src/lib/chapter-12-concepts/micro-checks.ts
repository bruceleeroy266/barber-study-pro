import type { Chapter12ConceptFamilyId } from './types'
import type { Chapter12Difficulty, Chapter12EvidenceRecord } from './grading'
import { chapter12MicroCheckPlacements } from './mappings'

export type Chapter12MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter12MicroCheckQuestion {
  id: `mcq-12-${string}`
  conceptFamilyId: Chapter12ConceptFamilyId
  difficulty: Exclude<Chapter12Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter12MicroCheckAnswer
  explanation: string
}

export interface Chapter12MicroCheck {
  id: `mc-12-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter12ConceptFamilyId
  title: string
  questions: readonly Chapter12MicroCheckQuestion[]
}

const q = (
  id: Chapter12MicroCheckQuestion['id'],
  conceptFamilyId: Chapter12ConceptFamilyId,
  difficulty: Chapter12MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter12MicroCheckAnswer,
  explanation: string,
): Chapter12MicroCheckQuestion => ({
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

export const chapter12MicroChecks: readonly Chapter12MicroCheck[] = [
  {
    id: 'mc-12-01',
    afterSectionId: 'memory-tricks',
    conceptFamilyId: 'ch12-facial-anatomy-neurovascular',
    title: 'Facial Anatomy & Neurovascular Check',
    questions: [
      q(
        'mcq-12-001',
        'ch12-facial-anatomy-neurovascular',
        'understanding',
        'Which structure is the primary chewing muscle in Chapter 12 anatomy?',
        'Frontalis',
        'Masseter',
        'Orbicularis oculi',
        'Trapezius',
        'b',
        'The masseter is a major muscle involved in chewing.',
      ),
      q(
        'mcq-12-002',
        'ch12-facial-anatomy-neurovascular',
        'application',
        'A student is tracing venous return from the head, face, and neck. Which vessels should they identify?',
        'Common carotid arteries',
        'Superficial temporal arteries',
        'Internal and external jugular veins',
        'Cervical nerves',
        'c',
        'The internal and external jugular veins are identified as major venous return pathways from the head, face, and neck.',
      ),
    ],
  },
  {
    id: 'mc-12-02',
    afterSectionId: 'massage-movements',
    conceptFamilyId: 'ch12-massage-principles-manipulations',
    title: 'Massage Principles & Manipulations Check',
    questions: [
      q(
        'mcq-12-003',
        'ch12-massage-principles-manipulations',
        'understanding',
        'Which manipulation is a light, continuous stroking movement?',
        'Effleurage',
        'Petrissage',
        'Tapotement',
        'Friction',
        'a',
        'Effleurage is the source-covered light, continuous stroking movement.',
      ),
      q(
        'mcq-12-004',
        'ch12-massage-principles-manipulations',
        'scenario',
        'A massage movement begins causing discomfort and increasing irritation. What should the barber do?',
        'Continue until the planned time is complete',
        'Increase pressure so the client adapts',
        'Switch immediately to electrical stimulation',
        'Stop or modify the movement and reassess whether the service remains appropriate',
        'd',
        'Client response and contraindications control whether a massage movement remains appropriate.',
      ),
    ],
  },
  {
    id: 'mc-12-03',
    afterSectionId: 'hot-towel-safety',
    conceptFamilyId: 'ch12-equipment-electrotherapy',
    title: 'Equipment & Electrotherapy Check',
    questions: [
      q(
        'mcq-12-005',
        'ch12-equipment-electrotherapy',
        'application',
        'How should a barber determine time, distance, or intensity for electrical facial equipment?',
        'Use one universal setting for every device',
        'Follow the specific device manufacturer directions, training, and applicable rules',
        'Use the longest setting the client will tolerate',
        'Copy the setting used on the previous client',
        'b',
        'Chapter 12 rejects universal equipment settings; operation depends on the specific device guidance, training, and applicable rules.',
      ),
      q(
        'mcq-12-006',
        'ch12-equipment-electrotherapy',
        'scenario',
        'A device label does not clearly establish safe use for a client factor disclosed during consultation. What is the best decision?',
        'Use the lowest setting as a test',
        'Let the client choose the setting',
        'Defer the electrical service until safe guidance is established',
        'Ignore the factor if the skin looks normal',
        'c',
        'When equipment safety cannot be established from the device guidance and training, the service should be deferred rather than tested on the client.',
      ),
    ],
  },
  {
    id: 'mc-12-04',
    afterSectionId: 'product-selection-skin-type',
    conceptFamilyId: 'ch12-skin-analysis-product-selection',
    title: 'Skin Analysis & Product Selection Check',
    questions: [
      q(
        'mcq-12-007',
        'ch12-skin-analysis-product-selection',
        'application',
        'What is the best basis for selecting a facial cleanser?',
        'Observable skin needs, client sensitivities, the planned service, and manufacturer directions',
        'The client\'s gender',
        'The strongest formulation available',
        'The barber\'s favorite brand',
        'a',
        'The hardened Chapter 12 lesson ties cosmetic product choice to observation, consultation, service needs, and product directions.',
      ),
      q(
        'mcq-12-008',
        'ch12-skin-analysis-product-selection',
        'scenario',
        'A client has an oily forehead, nose, and chin with noticeably drier cheeks. Which Chapter 12 skin-type pattern best fits?',
        'Normal',
        'Dry',
        'Oily',
        'Combination',
        'd',
        'Combination skin presents different characteristics in different facial areas, commonly including a more oily T-zone and drier outer areas.',
      ),
    ],
  },
  {
    id: 'mc-12-05',
    afterSectionId: 'facial-treatments-masks',
    conceptFamilyId: 'ch12-facial-treatment-procedures',
    title: 'Facial Treatment Procedure Check',
    questions: [
      q(
        'mcq-12-009',
        'ch12-facial-treatment-procedures',
        'application',
        'Which sequence principle best matches the hardened Chapter 12 facial protocol?',
        'Use every product category on every client',
        'Consult and analyze first, then select appropriate cleansing, treatment, and finishing steps',
        'Massage first, then decide whether the service is appropriate',
        'Begin with the strongest exfoliant',
        'b',
        'The Chapter 12 protocol begins with consultation and analysis before selecting service steps and products.',
      ),
      q(
        'mcq-12-010',
        'ch12-facial-treatment-procedures',
        'scenario',
        'A client asks whether a beard product will treat a persistent skin disorder. What should the barber do?',
        'Promise the product will treat the condition',
        'Diagnose the condition and select a treatment product',
        'Keep the recommendation cosmetic and defer or refer when the concern is outside routine cosmetic care',
        'Use more product until the condition improves',
        'c',
        'Beard products are cosmetic. Out-of-scope concerns require appropriate referral rather than diagnosis or treatment claims.',
      ),
    ],
  },
  {
    id: 'mc-12-06',
    afterSectionId: 'sanitation-infection-control',
    conceptFamilyId: 'ch12-sanitation-infection-control',
    title: 'Sanitation & Infection Control Check',
    questions: [
      q(
        'mcq-12-011',
        'ch12-sanitation-infection-control',
        'application',
        'How should product be removed from a jar during a facial service?',
        'Use a clean dispensing method such as a clean spatula and avoid double-dipping',
        'Use bare fingers after handwashing',
        'Reuse the applicator that touched the client',
        'Return unused product to the jar',
        'a',
        'Chapter 12 sanitation guidance requires contamination-prevention practices such as clean dispensing and no double-dipping.',
      ),
      q(
        'mcq-12-012',
        'ch12-sanitation-infection-control',
        'scenario',
        'Blood or another body-fluid exposure occurs during service. What should happen next?',
        'Finish the current step first',
        'Cover the area with product and continue',
        'Use extra disinfectant after the service',
        'Stop the service and follow the applicable exposure-control procedure',
        'd',
        'The hardened infection-control section requires stopping the service and following the applicable exposure-control procedure.',
      ),
    ],
  },
  {
    id: 'mc-12-07',
    afterSectionId: 'absolute-contraindications',
    conceptFamilyId: 'ch12-contraindications-service-safety',
    title: 'Contraindications & Service Safety Check',
    questions: [
      q(
        'mcq-12-013',
        'ch12-contraindications-service-safety',
        'scenario',
        'A client has an active or potentially contagious facial condition. What is the best service decision?',
        'Work around the area and continue',
        'Defer the facial service when contact would be unsafe, without diagnosing or prescribing',
        'Proceed if gloves are worn',
        'Diagnose the condition before deciding',
        'b',
        'Chapter 12 requires a service-safety decision without medical diagnosis or prescribing.',
      ),
      q(
        'mcq-12-014',
        'ch12-contraindications-service-safety',
        'scenario',
        'During a facial, the client reports burning and dizziness. What is the correct immediate response?',
        'Continue at a lower intensity',
        'Finish the current step',
        'Stop the service and reassess safety before doing anything further',
        'Add heat to improve comfort',
        'c',
        'Burning, dizziness, or another unsafe response requires the barber to stop and reassess the service.',
      ),
    ],
  },
  {
    id: 'mc-12-08',
    afterSectionId: 'client-consultation',
    conceptFamilyId: 'ch12-client-care-professional-practice',
    title: 'Client Care & Professional Practice Check',
    questions: [
      q(
        'mcq-12-015',
        'ch12-client-care-professional-practice',
        'application',
        'How should a barber discuss product preferences with a client?',
        'Assume preferences from gender or age',
        'Choose the most expensive product',
        'Ask about the individual client\'s fragrance, texture, finish, routine, and packaging preferences',
        'Use the same product routine for everyone',
        'c',
        'The hardened Chapter 12 guidance uses individual consultation rather than demographic assumptions.',
      ),
      q(
        'mcq-12-016',
        'ch12-client-care-professional-practice',
        'scenario',
        'A client reports a recent procedure and medication change, and the barber cannot establish whether the planned service is safe. What should the barber do?',
        'Defer or modify only when safe guidance is clear and recommend appropriate evaluation when safety is uncertain',
        'Proceed if the client signs a waiver',
        'Diagnose the likely reaction',
        'Use a stronger product to shorten the service',
        'a',
        'Professional practice requires staying within cosmetic-service scope and deferring when safe service cannot be established.',
      ),
    ],
  },
]

export interface Chapter12MicroCheckResponse {
  questionId: Chapter12MicroCheckQuestion['id']
  selectedAnswer: Chapter12MicroCheckAnswer
}

export function buildChapter12MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter12MicroCheckResponse[],
  timestamp: string,
): Chapter12EvidenceRecord[] {
  const questionMap = new Map(
    chapter12MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter12EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-12',
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

export function mergeChapter12EvidenceWithoutContamination(
  existing: readonly Chapter12EvidenceRecord[],
  incoming: readonly Chapter12EvidenceRecord[],
): Chapter12EvidenceRecord[] {
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

export function validateChapter12MicroCheckPlacements(): boolean {
  if (chapter12MicroChecks.length !== chapter12MicroCheckPlacements.length) return false

  return chapter12MicroChecks.every((check) => {
    const placement = chapter12MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
