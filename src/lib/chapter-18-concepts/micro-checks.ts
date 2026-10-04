import type { Chapter18ConceptFamilyId } from './types'
import type { Chapter18Difficulty, Chapter18EvidenceRecord } from './grading'
import { chapter18MicroCheckPlacements } from './mappings'

export type Chapter18MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter18MicroCheckQuestion {
  id: `mcq-18-${string}`
  conceptFamilyId: Chapter18ConceptFamilyId
  difficulty: Exclude<Chapter18Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter18MicroCheckAnswer
  explanation: string
}

export interface Chapter18MicroCheck {
  id: `mc-18-${string}`
  afterSectionId: 'chapter-18-lesson'
  conceptFamilyId: Chapter18ConceptFamilyId
  title: string
  questions: readonly Chapter18MicroCheckQuestion[]
}

const q = (
  id: Chapter18MicroCheckQuestion['id'],
  conceptFamilyId: Chapter18ConceptFamilyId,
  difficulty: Chapter18MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter18MicroCheckAnswer,
  explanation: string,
): Chapter18MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter18MicroChecks: readonly Chapter18MicroCheck[] = [
  {
    id: 'mc-18-01',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-analysis-structure',
    title: 'Hair Analysis & Structure Check',
    questions: [
      q('mcq-18-001','ch18-analysis-structure','application',
        'A client has visibly porous, sensitized mids and ends but healthier new growth. What should happen before choosing one formula for the entire head?',
        'Increase developer strength on the porous lengths','Analyze the condition differences and use a strand test when appropriate','Ignore porosity if the desired shade is darker','Use the same processing time because density is the only concern',
        'b','Porosity and integrity can vary across the head. Analyze those differences and use strand testing when appropriate instead of automatically increasing developer strength.'),
      q('mcq-18-002','ch18-analysis-structure','understanding',
        'Which statement best describes elasticity in a haircolor consultation?',
        'It determines the exact developer volume','It describes how well hair stretches and returns without breaking','It is another name for natural level','It measures the number of hairs per square inch',
        'b','Elasticity is evidence about hair integrity. Reduced elasticity can signal compromised hair, but it does not by itself determine developer strength or processing time.'),
    ],
  },
  {
    id: 'mc-18-02',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-color-theory',
    title: 'Color Theory & Neutralization Check',
    questions: [
      q('mcq-18-003','ch18-color-theory','application',
        'A pre-lightened section shows unwanted yellow warmth and the target is a cooler result. Which color-wheel relationship should guide the tonal adjustment?',
        'Use violet as the complementary direction to yellow','Add more yellow to cancel the warmth','Use orange because it is adjacent to yellow','Choose developer volume instead of considering tone',
        'a','Violet is complementary to yellow in traditional haircolor theory. The exact toner or formula still depends on level, condition, target tone, and the product system.'),
      q('mcq-18-004','ch18-color-theory','understanding',
        'What does “level” describe in professional haircolor?',
        'Only whether a tone is warm or cool','The relative lightness or darkness of the color','The developer volume','The amount of gray coverage promised',
        'b','Level describes relative lightness or darkness. Numbering and shade names can vary by manufacturer.'),
    ],
  },
  {
    id: 'mc-18-03',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-color-products',
    title: 'Haircolor Product Classes Check',
    questions: [
      q('mcq-18-005','ch18-color-products','understanding',
        'Which description best fits many demipermanent systems?',
        'Direct-dye deposit color that uses an activator mainly to improve penetration rather than oxidation','Oxidative deposit-focused color using a dedicated low-strength developer or activator','Low-lift oxidative color that uses standard permanent-color developer but is removed sooner','Surface-deposit color that uses a weak developer but is designed to shampoo out within several washes',
        'b','Many demipermanent systems use oxidative dye chemistry with a dedicated low-strength developer or activator. Exact use and longevity remain product-specific.'),
      q('mcq-18-006','ch18-color-products','application',
        'A client asks whether a semipermanent color will always last exactly six to eight shampoos. What is the best response?',
        'Six to eight shampoos is a reasonable fixed estimate when the hair is healthy and the same brand is used consistently','No; longevity varies by formula, hair condition, use, and manufacturer guidance','Longevity is mainly determined by porosity, so manufacturer guidance matters less once the hair condition is known','Semipermanent color lasts a predictable number of shampoos if no heat or clarifying products are used',
        'b','Semipermanent longevity is not one fixed wash-count rule. Product formula, hair condition, use, and manufacturer claims matter.'),
    ],
  },
  {
    id: 'mc-18-04',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-developers-lighteners-toners',
    title: 'Developers, Lighteners & Toners Check',
    questions: [
      q('mcq-18-007','ch18-developers-lighteners-toners','application',
        'How should developer strength be selected for a professional color or lightener service?',
        'Use a fixed 10/20/30/40 lift chart for every brand','Use the highest volume whenever more lift is desired','Use only strengths and ratios permitted by the specific product system','Choose solely from hair texture',
        'c','Volume describes peroxide strength, but allowed developer, lift, ratio, scalp use, and timing are product-system specific.'),
      q('mcq-18-008','ch18-developers-lighteners-toners','scenario',
        'A lightener says it is off-scalp only. The client wants faster lift at the roots. What is the correct response?',
        'Apply it on the scalp with lower developer','Add heat and continue','Follow the off-scalp restriction and choose an appropriate manufacturer-approved system for the service area','Mix it with shampoo to make scalp use safer',
        'c','Application-area restrictions are product-specific safety limits. Do not improvise on-scalp use, heat, or mixing outside the manufacturer directions.'),
    ],
  },
  {
    id: 'mc-18-05',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-application-consultation-procedures',
    title: 'Consultation & Application Procedures Check',
    questions: [
      q('mcq-18-009','ch18-application-consultation-procedures','application',
        'A client returns for a lightener retouch with previously lightened mids and ends. Where should fresh lightener generally be placed?',
        'Apply to new growth first, then refresh mids and ends with the same lightener for the last few minutes if the target level is uniform','Target new growth and avoid unapproved overlap onto previously lightened or sensitized hair','Apply through the previously lightened lengths at a weaker mixture so the whole head processes evenly','Apply to new growth and overlap slightly onto the old lightened area to avoid a visible band',
        'b','Retouches generally target new growth while avoiding unnecessary or unapproved overlap onto previously lightened or sensitized hair.'),
      q('mcq-18-010','ch18-application-consultation-procedures','scenario',
        'A client cannot clearly describe previous home color or chemical services. What is the best consultation response before proceeding?',
        'Assume the history is compatible if the hair feels strong','Clarify the history and use manufacturer-supported compatibility or strand testing before committing to the service','Use stronger developer to overcome unknown color','Skip the history if the target shade is darker',
        'b','Unknown chemical history can change compatibility and predictability. Clarify what can be established and use appropriate product-supported testing before proceeding.'),
    ],
  },
  {
    id: 'mc-18-06',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-correction-gray-porosity',
    title: 'Corrective Color, Gray Coverage & Porosity Check',
    questions: [
      q('mcq-18-011','ch18-correction-gray-porosity','application',
        'Previously lightened, porous lengths are being tinted darker. What is the best first planning step?',
        'Choose a low-volume developer and apply the target shade directly because porous hair absorbs pigment quickly','Use the same formula from roots through ends so the final tone develops uniformly','Assess the hair and choose a manufacturer-supported tint-back, filler, or equalization strategy','Select a shade slightly lighter than the target to compensate for the darker result common on porous lengths',
        'c','Tint-back on porous hair may need replacement tone, filler, or equalization, but the correct approach depends on analysis and the product system.'),
      q('mcq-18-012','ch18-correction-gray-porosity','application',
        'A client wants durable gray coverage. What should determine the formulation plan?',
        'A universal percentage rule for all demipermanent color','Developer volume alone','The color system’s stated gray-coverage capability, shade guidance, developer, ratio, and timing','The client’s age',
        'c','Gray-coverage capability is product-specific. Use the manufacturer’s technical guidance rather than a fixed percentage rule.'),
    ],
  },
  {
    id: 'mc-18-07',
    afterSectionId: 'chapter-18-lesson',
    conceptFamilyId: 'ch18-service-safety-chemical-handling',
    title: 'Service Safety & Chemical Handling Check',
    questions: [
      q('mcq-18-013','ch18-service-safety-chemical-handling','scenario',
        'The scalp in the planned color area is visibly irritated and sunburned. What is the safest action?',
        'Proceed with a weaker developer','Apply a barrier and continue','Postpone the haircolor service rather than applying color to compromised scalp tissue','Let the client waive the risk',
        'c','FDA safety guidance warns against coloring irritated, sunburned, or damaged scalp tissue. A waiver does not replace safety instructions.'),
      q('mcq-18-014','ch18-service-safety-chemical-handling','scenario',
        'A client requests beard color using a product labeled only for scalp hair. What should the barber do?',
        'Use it if petroleum jelly is applied first','Use it for half the listed processing time','Do not adapt it to facial hair; use only a product expressly permitted for the intended beard or mustache application','Mix it with conditioner to reduce irritation',
        'c','Do not transfer scalp-hair directions to facial hair by assumption. Facial-hair use must be expressly permitted by the manufacturer.'),
    ],
  },
]

export interface Chapter18MicroCheckResponse {
  questionId: Chapter18MicroCheckQuestion['id']
  selectedAnswer: Chapter18MicroCheckAnswer
}

export function buildChapter18MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter18MicroCheckResponse[],
  timestamp: string,
): Chapter18EvidenceRecord[] {
  const questionMap = new Map(
    chapter18MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter18EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-18',
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

export function mergeChapter18EvidenceWithoutContamination(
  existing: readonly Chapter18EvidenceRecord[],
  incoming: readonly Chapter18EvidenceRecord[],
): Chapter18EvidenceRecord[] {
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

export function validateChapter18MicroCheckPlacements(): boolean {
  if (chapter18MicroChecks.length !== chapter18MicroCheckPlacements.length) return false
  return chapter18MicroChecks.every((check) => {
    const placement = chapter18MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
