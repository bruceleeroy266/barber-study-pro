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
        'Reduce pressure and continue briefly to see whether the discomfort resolves',
        'Change to a different massage manipulation while maintaining the planned service time',
        'Pause the massage and substitute another nonmanual treatment step without reassessing the cause',
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
        'Use the lowest preset that previously worked well for a similar client',
        'Follow the specific device manufacturer directions, training, and applicable rules',
        'Choose settings mainly from the client’s comfort level, then adjust if redness develops',
        'Use the previous client’s setting as a starting point when skin type appears similar',
        'b',
        'Chapter 12 rejects universal equipment settings; operation depends on the specific device guidance, training, and applicable rules.',
      ),
      q(
        'mcq-12-006',
        'ch12-equipment-electrotherapy',
        'scenario',
        'A device label does not clearly establish safe use for a client factor disclosed during consultation. What is the best decision?',
        'Perform a short test at the lowest setting and proceed if there is no immediate reaction',
        'Explain the uncertainty and let the client select the intensity they feel comfortable trying',
        'Defer the electrical service until safe guidance is established',
        'Proceed if the disclosed factor is not producing visible symptoms on the day of service',
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
        'Skin type category alone, without considering the planned treatment or product directions',
        'The most active formula the client has previously tolerated well',
        'The brand used most often in the shop when the client has no known sensitivity',
        'a',
        'The hardened Chapter 12 lesson ties cosmetic product choice to observation, consultation, service needs, and product directions.',
      ),
      q(
        'mcq-12-008',
        'ch12-skin-analysis-product-selection',
        'scenario',
        'A client has an oily forehead, nose, and chin with noticeably drier cheeks. Which Chapter 12 skin-type pattern best fits?',
        'Mostly normal',
        'Mostly dry',
        'Mostly oily',
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
        'Use a standard cleanser, exfoliant, massage step, mask, and moisturizer unless the client objects',
        'Consult and analyze first, then select appropriate cleansing, treatment, and finishing steps',
        'Begin with cleansing and massage, then reassess whether stronger treatment steps are appropriate',
        'Start with exfoliation to reveal skin condition before choosing the remaining facial steps',
        'b',
        'The Chapter 12 protocol begins with consultation and analysis before selecting service steps and products.',
      ),
      q(
        'mcq-12-010',
        'ch12-facial-treatment-procedures',
        'scenario',
        'A client asks whether a beard product will treat a persistent skin disorder. What should the barber do?',
        'Recommend the product as likely to improve the disorder if the client uses it consistently',
        'Identify the likely skin condition from appearance, then choose the matching cosmetic treatment',
        'Keep the recommendation cosmetic and defer or refer when the concern is outside routine cosmetic care',
        'Increase frequency or amount of product use before deciding that referral is necessary',
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
        'Use clean hands to remove enough product for a single application, then avoid touching the jar again',
        'Use the same applicator for the same client throughout the service if it does not touch visibly soiled skin',
        'Dispense extra product onto a clean surface and return what remains if it did not touch the client',
        'a',
        'Chapter 12 sanitation guidance requires contamination-prevention practices such as clean dispensing and no double-dipping.',
      ),
      q(
        'mcq-12-012',
        'ch12-sanitation-infection-control',
        'scenario',
        'Blood or another body-fluid exposure occurs during service. What should happen next?',
        'Pause after completing the current application stroke, then begin the exposure-control procedure',
        'Control the visible fluid with clean material and continue if the client wants to finish the service',
        'Complete the service with gloves, then perform enhanced disinfection on all contacted surfaces',
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
        'Avoid direct contact with the affected area and continue the facial on unaffected skin',
        'Defer the facial service when contact would be unsafe, without diagnosing or prescribing',
        'Proceed with gloves and disposable supplies if the condition can be isolated from direct contact',
        'Identify whether the condition appears infectious before deciding whether to continue the service',
        'b',
        'Chapter 12 requires a service-safety decision without medical diagnosis or prescribing.',
      ),
      q(
        'mcq-12-014',
        'ch12-contraindications-service-safety',
        'scenario',
        'During a facial, the client reports burning and dizziness. What is the correct immediate response?',
        'Pause the service, lower intensity or product strength, and resume if symptoms improve quickly',
        'Complete the current product-removal step, then reassess before continuing the rest of the facial',
        'Stop the service and reassess safety before doing anything further',
        'Remove the irritating step and use a cool or warm towel before deciding whether to continue',
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
        'Use common preferences for the client’s age group as a starting point, then adjust if they object',
        'Recommend the most premium option that matches the service goal unless the client gives a budget',
        'Ask about the individual client\'s fragrance, texture, finish, routine, and packaging preferences',
        'Use the shop’s standard product sequence unless the client reports a sensitivity or preference',
        'c',
        'The hardened Chapter 12 guidance uses individual consultation rather than demographic assumptions.',
      ),
      q(
        'mcq-12-016',
        'ch12-client-care-professional-practice',
        'scenario',
        'A client reports a recent procedure and medication change, and the barber cannot establish whether the planned service is safe. What should the barber do?',
        'Defer or modify only when safe guidance is clear and recommend appropriate evaluation when safety is uncertain',
        'Explain the uncertainty, obtain written acknowledgment, and proceed with the mildest version of the service',
        'Identify the most likely medication or procedure reaction so the service can be modified safely',
        'Use a shorter service with a more concentrated product to reduce total exposure time',
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
