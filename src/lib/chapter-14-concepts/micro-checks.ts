import type { Chapter14ConceptFamilyId } from './types'
import type { Chapter14Difficulty, Chapter14EvidenceRecord } from './grading'
import { chapter14MicroCheckPlacements } from './mappings'

export type Chapter14MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter14MicroCheckQuestion {
  id: `mcq-14-${string}`
  conceptFamilyId: Chapter14ConceptFamilyId
  difficulty: Exclude<Chapter14Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter14MicroCheckAnswer
  explanation: string
}

export interface Chapter14MicroCheck {
  id: `mc-14-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter14ConceptFamilyId
  title: string
  questions: readonly Chapter14MicroCheckQuestion[]
}

const q = (
  id: Chapter14MicroCheckQuestion['id'],
  conceptFamilyId: Chapter14ConceptFamilyId,
  difficulty: Chapter14MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter14MicroCheckAnswer,
  explanation: string,
): Chapter14MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter14MicroChecks: readonly Chapter14MicroCheck[] = [
  {
    id: 'mc-14-01',
    afterSectionId: 'trim-warning',
    conceptFamilyId: 'ch14-consultation-professional-design',
    title: 'Consultation & Design Planning Check',
    questions: [
      q('mcq-14-001','ch14-consultation-professional-design','application',
        'A client says, “Just a trim.” What should the barber do before cutting?',
        'Choose a standard amount to remove','Clarify the desired length and result visually','Begin at the nape and adjust later','Use the previous client’s haircut as a guide',
        'b','“Trim” can mean different things. Clarifying the desired length, outline, taper, and overall result reduces guesswork.'),
      q('mcq-14-002','ch14-consultation-professional-design','scenario',
        'A requested style conflicts with the client’s stated maintenance routine. What is the best professional response?',
        'Follow the reference photo closely and explain the maintenance after the haircut is complete','Decline the requested style if it appears incompatible with the client’s current routine','Explain the maintenance demands and agree on a realistic design','Recommend a lower-maintenance version based on the barber’s preferred design approach',
        'c','Consultation should connect the desired result with hair characteristics, lifestyle, maintenance, and client expectations.'),
    ],
  },
  {
    id: 'mc-14-02',
    afterSectionId: 'head-sections',
    conceptFamilyId: 'ch14-facial-head-design-analysis',
    title: 'Facial & Head Design Analysis Check',
    questions: [
      q('mcq-14-003','ch14-facial-head-design-analysis','understanding',
        'What is the apex?',
        'The widest point of the head','The highest point on top of the head','The protrusion at the base of the skull','The natural part line',
        'b','The apex is the highest point on top of the head and is used as a haircutting reference point.'),
      q('mcq-14-004','ch14-facial-head-design-analysis','application',
        'A client has a longer-looking neck and wants better visual balance. Which choice best supports that goal?',
        'Reduce most nape fullness so the neck appears cleaner and more defined','Raise the neckline slightly to create a shorter visual transition at the back','Leave more fullness at the nape while respecting the natural hairline','Use a very short taper to reduce contrast between the neckline and the rest of the haircut',
        'c','Leaving more fullness at the nape and respecting the natural hairline can help avoid visually exaggerating neck length.'),
    ],
  },
  {
    id: 'mc-14-03',
    afterSectionId: 'tension-control',
    conceptFamilyId: 'ch14-cutting-geometry-guides',
    title: 'Cutting Geometry & Guide Control Check',
    questions: [
      q('mcq-14-005','ch14-cutting-geometry-guides','understanding',
        'What does a traveling guide do?',
        'Stays fixed while later sections return','Moves with each newly cut section','Moves along the perimeter while interior stays fixed','Moves with clipper sections, fixed with shears',
        'b','A traveling guide progresses along the head shape so each newly cut section guides the next.'),
      q('mcq-14-006','ch14-cutting-geometry-guides','scenario',
        'A barber wants to verify a section cut in one direction. Which action best represents cross-checking?',
        'Recheck the section using the same partings with lighter tension','Check with subsections taken in an opposing direction','Increase tension and recut the guide so uneven lengths become easier to see','Verify the section with a different tool while keeping the same cutting direction',
        'b','Cross-checking verifies accuracy by checking the haircut from a different or opposing parting/cutting direction.'),
    ],
  },
  {
    id: 'mc-14-04',
    afterSectionId: 'thinning-texturizing',
    conceptFamilyId: 'ch14-shear-clipper-razor-texturizing',
    title: 'Cutting Tools & Technique Check',
    questions: [
      q('mcq-14-007','ch14-shear-clipper-razor-texturizing','application',
        'How should a barber determine the cutting length of a detachable clipper blade?',
        'Use the blade number as the cutting length because detachable systems follow a standard numbering convention','Match the blade number to an equivalent guard size from the same clipper brand','Check the manufacturer’s blade chart for the clipper system','Estimate the length from tooth spacing and blade width when the chart is unavailable',
        'c','Blade numbering and resulting lengths can vary by manufacturer, so the correct reference is the blade chart for the system in use.'),
      q('mcq-14-008','ch14-shear-clipper-razor-texturizing','scenario',
        'When is razor cutting an appropriate choice for blending or tapering?',
        'When the client wants a softer finish, regardless of texture or prior chemical condition','When the hair, service plan, and tool choice suit a softer tapered result','When the hair is straight or slightly wavy, because razor cutting should be avoided on curlier textures','When clipper work would create too much weight, even if the hair condition is fragile',
        'b','Razor cutting can create softer tapered ends, but its use should fit the hair, service plan, and selected technique.'),
    ],
  },
  {
    id: 'mc-14-05',
    afterSectionId: 'finish-work',
    conceptFamilyId: 'ch14-haircut-styles-procedures',
    title: 'Haircut Procedures & Finish Work Check',
    questions: [
      q('mcq-14-009','ch14-haircut-styles-procedures','understanding',
        'Which description best fits a fade?',
        'A short uniform cut that becomes slightly longer toward the crown while keeping the perimeter even','A design that transitions to very short or skin-close hair near the perimeter','A tapered cut that keeps visible weight at the perimeter and removes length mainly through the interior','A graduated cut created primarily with shears and a stationary guide near the perimeter',
        'b','A fade transitions from longer hair toward very short or skin-close hair near the perimeter.'),
      q('mcq-14-010','ch14-haircut-styles-procedures','application',
        'What should determine which finish work is performed after a haircut?',
        'The haircut category and shop standard should determine the finish bundle so clients receive consistent service','The service plan, client preference, scope, and appropriate local practice','The barber’s normal finishing routine should guide the choice unless the client requests something different','The client’s requested finish should control the choice as long as it does not add significant service time',
        'b','Finish work should fit the agreed service and client needs rather than be treated as one universal bundle.'),
    ],
  },
  {
    id: 'mc-14-06',
    afterSectionId: 'cornrow-procedure',
    conceptFamilyId: 'ch14-styling-volume-locks',
    title: 'Styling, Volume & Locks Check',
    questions: [
      q('mcq-14-011','ch14-styling-volume-locks','application',
        'What is the main purpose of a diffuser during blow-dry styling of wavy or curly hair?',
        'Focus airflow near the roots to build lift while using lower heat through the ends','Maintain natural texture while dispersing airflow','Stretch and smooth the curl pattern while keeping airflow broad and controlled','Reduce reliance on styling products by distributing airflow more evenly',
        'b','A diffuser disperses airflow to help maintain natural wave or curl pattern while styling.'),
      q('mcq-14-012','ch14-styling-volume-locks','scenario',
        'A client asks exactly how long their locks will take to develop. What is the best answer?',
        'Use the average development time for the chosen method as the client’s expected completion date','Estimate a timeline mainly from hair texture and density, then adjust it after the first maintenance visit','Development varies with hair characteristics, method, maintenance, and time','Give a range based on the locking method because maintenance affects appearance more than development speed',
        'c','The hardened Chapter 14 guidance avoids a universal lock-development timeline because multiple client and maintenance factors affect the process.'),
    ],
  },
  {
    id: 'mc-14-07',
    afterSectionId: 'sharps-warning',
    conceptFamilyId: 'ch14-service-safety-sanitation',
    title: 'Service Safety & Sanitation Check',
    questions: [
      q('mcq-14-013','ch14-service-safety-sanitation','scenario',
        'During a head-shave consultation, the barber observes broken skin in the planned shave area. What is the safest response?',
        'Shave around it and continue','Cover it with product and proceed','Defer the affected service until it is safe to perform','Let the client decide whether infection risk matters',
        'c','Broken or compromised skin in the service area is a safety concern; the affected service should be deferred rather than worked around casually.'),
      q('mcq-14-014','ch14-service-safety-sanitation','application',
        'What is the safest blow-drying practice near the scalp?',
        'Hold high heat in one spot until fully dry','Keep the dryer and hair moving and monitor client comfort','Use the highest setting for every client','Place the nozzle directly against the scalp',
        'b','Keeping airflow moving and monitoring comfort helps reduce the risk of excessive localized heat.'),
    ],
  },
]

export interface Chapter14MicroCheckResponse {
  questionId: Chapter14MicroCheckQuestion['id']
  selectedAnswer: Chapter14MicroCheckAnswer
}

export function buildChapter14MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter14MicroCheckResponse[],
  timestamp: string,
): Chapter14EvidenceRecord[] {
  const questionMap = new Map(
    chapter14MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter14EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-14',
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

export function mergeChapter14EvidenceWithoutContamination(
  existing: readonly Chapter14EvidenceRecord[],
  incoming: readonly Chapter14EvidenceRecord[],
): Chapter14EvidenceRecord[] {
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

export function validateChapter14MicroCheckPlacements(): boolean {
  if (chapter14MicroChecks.length !== chapter14MicroCheckPlacements.length) return false
  return chapter14MicroChecks.every((check) => {
    const placement = chapter14MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
