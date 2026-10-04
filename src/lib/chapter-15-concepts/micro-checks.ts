import type { Chapter15ConceptFamilyId } from './types'
import type { Chapter15Difficulty, Chapter15EvidenceRecord } from './grading'
import { chapter15MicroCheckPlacements } from './mappings'

export type Chapter15MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter15MicroCheckQuestion {
  id: `mcq-15-${string}`
  conceptFamilyId: Chapter15ConceptFamilyId
  difficulty: Exclude<Chapter15Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter15MicroCheckAnswer
  explanation: string
}

export interface Chapter15MicroCheck {
  id: `mc-15-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter15ConceptFamilyId
  title: string
  questions: readonly Chapter15MicroCheckQuestion[]
}

const q = (
  id: Chapter15MicroCheckQuestion['id'],
  conceptFamilyId: Chapter15ConceptFamilyId,
  difficulty: Chapter15MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter15MicroCheckAnswer,
  explanation: string,
): Chapter15MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter15MicroChecks: readonly Chapter15MicroCheck[] = [
  {
    id: 'mc-15-01',
    afterSectionId: 'marketing-challenge',
    conceptFamilyId: 'ch15-client-consultation-ethics-marketing',
    title: 'Consultation, Ethics & Marketing Check',
    questions: [
      q('mcq-15-001','ch15-client-consultation-ethics-marketing','application',
        'A client is nervous about discussing hair loss while other clients are nearby. What is the best response?',
        'Lower your voice and continue at the station if nearby clients are not directly involved in the conversation','Move the conversation to a setting that protects privacy and dignity','Move slightly away from others and ask a trusted coworker to join the discussion if the client seems unsure','Keep the consultation brief at the station and let the client review system choices privately afterward',
        'b','Sensitive hair-loss details should be discussed in a setting that protects the client’s privacy and dignity.'),
      q('mcq-15-002','ch15-client-consultation-ethics-marketing','scenario',
        'You want to post a before-and-after image of a longtime friend who is also a client. What should happen first?',
        'Use the image if the client verbally agrees during the appointment because the existing friendship supports consent','Use the photo without separate permission if identifying features are cropped from the final post','Obtain documented permission that meets applicable privacy and advertising requirements','Post the image after showing the client the draft, unless the client specifically objects before it goes live',
        'c','A personal relationship does not replace appropriate documented permission for client-image use.'),
    ],
  },
  {
    id: 'mc-15-02',
    afterSectionId: 'scope-scenario',
    conceptFamilyId: 'ch15-alternatives-scope-referral',
    title: 'Alternatives, Scope & Referral Check',
    questions: [
      q('mcq-15-003','ch15-alternatives-scope-referral','application',
        'A client asks which Minoxidil formulation and dosing schedule they should use. What is the best barber response?',
        'Explain that stronger formulations may be more effective and suggest starting with the commonly used strength.','Use the client’s age and hair-loss pattern to explain which dosing schedule is most commonly selected.','Explain that products differ and refer individualized guidance to labeling and an appropriate licensed healthcare professional','Limit the conversation to cosmetic systems and avoid mentioning medication options because they are outside barber scope.',
        'c','A barber can provide general education without choosing an individualized medication formulation or dosing schedule.'),
      q('mcq-15-004','ch15-alternatives-scope-referral','scenario',
        'A client asks whether hair transplantation is right for them. What should the barber do?',
        'Explain whether the visible hair-loss pattern appears consistent with common transplant candidates, then recommend consultation.','Compare common transplant techniques and suggest which one generally fits the client’s budget and downtime goals.','Discuss the option generally and refer the medical decision to an appropriately licensed professional','Recommend a nonsurgical hair-replacement trial as a way to determine whether transplantation would be worthwhile.',
        'c','Hair transplantation is a medical procedure. The barber’s role is general education and appropriate referral, not diagnosis or surgical selection.'),
    ],
  },
  {
    id: 'mc-15-03',
    afterSectionId: 'manufacturer-evaluation',
    conceptFamilyId: 'ch15-hair-materials-base-construction',
    title: 'Materials & Base Construction Check',
    questions: [
      q('mcq-15-005','ch15-hair-materials-base-construction','understanding',
        'Why are combination bases used in hair replacement systems?',
        'To lower cost by pairing a durable center material with a less expensive edge material','To combine material characteristics such as edge appearance, airflow, durability, and attachment compatibility','To combine multiple base materials so each attachment method can be used on the same system','To balance ventilation and durability, with edge appearance determined mostly by the hair density selected',
        'b','Combination bases use different materials in selected zones to balance multiple performance characteristics.'),
      q('mcq-15-006','ch15-hair-materials-base-construction','application',
        'A client reports a sensitivity to an animal-derived fiber. What is the best material-selection step?',
        'Use the material category on the product label as enough evidence unless the client has reacted to that exact brand before.','Verify the system’s fiber composition and avoid materials that may trigger the reported sensitivity','Suggest the client ask about allergy medication so they can continue using the preferred fiber if symptoms stay mild.','Choose a base that minimizes skin contact and keep the preferred hair fiber if the sensitivity is limited to the scalp.',
        'b','When a client reports an allergy or sensitivity, verify material composition rather than relying on a generic category label.'),
    ],
  },
  {
    id: 'mc-15-04',
    afterSectionId: 'template-creation',
    conceptFamilyId: 'ch15-system-selection-measurement-template',
    title: 'System Selection, Measurement & Template Check',
    questions: [
      q('mcq-15-007','ch15-system-selection-measurement-template','application',
        'A client needs a system quickly and has common size and color needs. Which option is usually the better starting point?',
        'A stock system that can be fitted and customized','A custom system because precise fit matters more than speed.','A custom mold because precise fitting can reduce later adjustments.','A stock system after a mold confirms standard sizing.',
        'a','Stock systems are intended for standard size/color needs and can be customized after fitting, while custom systems require additional fabrication time.'),
      q('mcq-15-008','ch15-system-selection-measurement-template','scenario',
        'What is the safest way to record dimensions for a custom order?',
        'Estimate minor dimensions and measure the main length and width.','Use a standard orientation and convert the measurements later if needed.','Record accurate measurements using the manufacturer’s required format and units','Round small differences to the nearest standard size.',
        'c','Accurate measurement matters, and ordering format/orientation should follow the manufacturer’s instructions.'),
    ],
  },
  {
    id: 'mc-15-05',
    afterSectionId: 'attachment-scenario',
    conceptFamilyId: 'ch15-attachment-methods-bonding',
    title: 'Attachment, Bonding & Cure Check',
    questions: [
      q('mcq-15-009','ch15-attachment-methods-bonding','application',
        'What determines when a newly bonded system can be shampooed or exposed to water?',
        'Use a 24-hour cure time for most liquid adhesives unless the client plans heavy water exposure.','Use 48 hours as the safer default when the adhesive instructions do not state a water-exposure time.','The adhesive manufacturer’s cure and water-exposure instructions','Choose water exposure based on the client’s normal shampoo routine as long as the bond feels firm.',
        'c','Cure time and water exposure are product-specific and should follow the adhesive manufacturer’s instructions.'),
      q('mcq-15-010','ch15-attachment-methods-bonding','scenario',
        'A competitive swimmer expects frequent water exposure. What is the best attachment approach?',
        'Choose a waterproof-labeled adhesive and use the standard cure time regardless of how often the client swims','Use tape for frequent swimming because tapes generally tolerate repeated water exposure better than liquid adhesives','Choose a system and attachment product rated for the expected exposure and follow its preparation and cure instructions','Select the strongest available adhesive and shorten cure time if the system feels secure before the client enters water',
        'c','Attachment choice should be based on the specific system, product rating, cure requirements, and manufacturer guidance.'),
    ],
  },
  {
    id: 'mc-15-06',
    afterSectionId: 'memory-anchor-floating',
    conceptFamilyId: 'ch15-cleaning-maintenance-chemical-care',
    title: 'Cleaning, Maintenance & Chemical Care Check',
    questions: [
      q('mcq-15-011','ch15-cleaning-maintenance-chemical-care','application',
        'What determines whether a chemical service is appropriate for a hair replacement system?',
        'Use natural-hair compatibility as the starting point, then adjust mainly for the system’s fiber type.','Fiber type, base construction, prior processing, and manufacturer approval','Proceed with the chemical service if the client understands that color or texture changes may shorten system life.','Treat products sold for professional use as compatible unless the system manufacturer lists a specific restriction.',
        'b','Chemical-service compatibility depends on the specific system, not on natural-hair assumptions.'),
      q('mcq-15-012','ch15-cleaning-maintenance-chemical-care','scenario',
        'The source gives a one-week initial cleaning and then roughly three-to-four-week maintenance interval. How should that be used in practice?',
        'Use the one-week and three-to-four-week intervals as the standard unless the client reports discomfort or early loosening','As a study baseline that is adjusted to manufacturer guidance and actual wear conditions','Apply the schedule to human-hair systems, while synthetic systems can remain installed until attachment loosens','Use the schedule for full-head bonded systems, but extend it for partial systems because less scalp is covered',
        'b','The interval is a study baseline; real maintenance timing depends on the system, attachment, manufacturer guidance, and wear conditions.'),
    ],
  },
  {
    id: 'mc-15-07',
    afterSectionId: 'common-mistakes',
    conceptFamilyId: 'ch15-cutting-blending-customization',
    title: 'Cutting, Blending & Customization Check',
    questions: [
      q('mcq-15-013','ch15-cutting-blending-customization','application',
        'What is the safest principle when removing length or density from a stock system?',
        'Remove extra hair aggressively to save time','Work conservatively and reduce length or bulk gradually','Use one guard length over the entire system','Thin the base itself to reduce weight',
        'b','Hair removed from the system cannot be restored, so conservative, progressive customization protects the final result.'),
      q('mcq-15-014','ch15-cutting-blending-customization','scenario',
        'The transition between system hair and natural hair looks obvious after the first pass. What should the barber evaluate next?',
        'Whether more careful tapering, thinning, and blending can soften the transition','Reinforce the edge attachment first, because a flatter base can make the transition appear softer.','Reduce overall length evenly so the difference between system density and natural hair is less noticeable.','Replace the transition-zone hair with a different fiber if blending does not improve after the first pass.',
        'a','Natural-looking results depend on careful blending and density/length transitions rather than attachment strength alone.'),
    ],
  },
]

export interface Chapter15MicroCheckResponse {
  questionId: Chapter15MicroCheckQuestion['id']
  selectedAnswer: Chapter15MicroCheckAnswer
}

export function buildChapter15MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter15MicroCheckResponse[],
  timestamp: string,
): Chapter15EvidenceRecord[] {
  const questionMap = new Map(
    chapter15MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter15EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-15',
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

export function mergeChapter15EvidenceWithoutContamination(
  existing: readonly Chapter15EvidenceRecord[],
  incoming: readonly Chapter15EvidenceRecord[],
): Chapter15EvidenceRecord[] {
  const merged = [...existing]
  const keys = new Set(existing.map((record) =>
    [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|'),
  ))

  for (const record of incoming) {
    const key = [record.studentId, record.chapterId, record.source, record.attemptPhase, record.itemId].join('|')
    if (keys.has(key)) continue
    keys.add(key)
    merged.push(record)
  }
  return merged
}

export function validateChapter15MicroCheckPlacements(): boolean {
  if (chapter15MicroChecks.length !== chapter15MicroCheckPlacements.length) return false
  return chapter15MicroChecks.every((check) => {
    const placement = chapter15MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
