import type { Chapter13ConceptFamilyId } from './types'
import type { Chapter13Difficulty, Chapter13EvidenceRecord } from './grading'
import { chapter13MicroCheckPlacements } from './mappings'

export type Chapter13MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter13MicroCheckQuestion {
  id: `mcq-13-${string}`
  conceptFamilyId: Chapter13ConceptFamilyId
  difficulty: Exclude<Chapter13Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter13MicroCheckAnswer
  explanation: string
}

export interface Chapter13MicroCheck {
  id: `mc-13-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter13ConceptFamilyId
  title: string
  questions: readonly Chapter13MicroCheckQuestion[]
}

const q = (
  id: Chapter13MicroCheckQuestion['id'],
  conceptFamilyId: Chapter13ConceptFamilyId,
  difficulty: Chapter13MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter13MicroCheckAnswer,
  explanation: string,
): Chapter13MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d,
  correctAnswer, explanation,
})

export const chapter13MicroChecks: readonly Chapter13MicroCheck[] = [
  {
    id: 'mc-13-01',
    afterSectionId: 'shaving-fundamentals',
    conceptFamilyId: 'ch13-consultation-service-preparation',
    title: 'Consultation & Preparation Check',
    questions: [
      q('mcq-13-001','ch13-consultation-service-preparation','application',
        'Before selecting towel preparation and razor technique, which combination should guide the barber?',
        'Skin condition, beard texture, growth direction, and client tolerance',
        'Only beard length and color',
        'Only the client’s preferred fragrance',
        'Only whether the client wants a close shave',
        'a','Chapter 13 starts with observation of the client’s skin, beard, grain, and service tolerance.'),
      q('mcq-13-002','ch13-consultation-service-preparation','scenario',
        'A client has a coarse beard but very heat-sensitive skin. What is the best preparation choice?',
        'Use the hottest towel available because coarse hair requires maximum heat',
        'Skip all preparation and shave dry',
        'Use thorough lathering and adjust warm-towel use to the client’s tolerance',
        'Apply a strong astringent before shaving',
        'c','Coarse growth may need more preparation, but towel temperature and use must still match the client’s skin.'),
    ],
  },
  {
    id: 'mc-13-02',
    afterSectionId: 'grain-terms',
    conceptFamilyId: 'ch13-hair-growth-ingrown-prevention',
    title: 'Growth Pattern & Ingrown-Hair Check',
    questions: [
      q('mcq-13-003','ch13-hair-growth-ingrown-prevention','application',
        'A beard changes direction midway through one mapped shaving area. What should control the next stroke?',
        'The printed map even when the client’s growth differs',
        'The client’s actual grain at that location',
        'The barber’s preferred stroke every time',
        'The darkest part of the beard',
        'b','The 14-area system organizes the service, but the client’s actual growth pattern governs stroke choice.'),
      q('mcq-13-004','ch13-hair-growth-ingrown-prevention','scenario',
        'A client has inflamed ingrown-hair bumps. Which response stays within barbering scope?',
        'Diagnose folliculitis and prescribe treatment',
        'Open the bumps before shaving',
        'Shave extra close to release the hairs',
        'Avoid diagnosing, defer unsafe areas, and refer when the condition is outside barbering scope',
        'd','Barbers may observe risk and make service decisions, but medical diagnosis and treatment are outside scope.'),
    ],
  },
  {
    id: 'mc-13-03',
    afterSectionId: 'body-positions',
    conceptFamilyId: 'ch13-shaving-areas-body-positioning',
    title: 'Shaving Areas & Positioning Check',
    questions: [
      q('mcq-13-005','ch13-shaving-areas-body-positioning','understanding',
        'How many training areas does Chapter 13 use for the first-time-over facial shave?',
        '7','10','14','21','c','Chapter 13 divides the face into 14 training areas for a systematic first pass.'),
      q('mcq-13-006','ch13-shaving-areas-body-positioning','application',
        'For the right-handed reference, which areas are worked from behind the client’s right shoulder?',
        '1, 4, and 12',
        '2, 3, 6, and 8',
        '7 and 9',
        '5, 10, 13, and 14',
        'd','The behind-the-right-shoulder position supports the reverse-freehand areas 5, 10, 13, and 14.'),
    ],
  },
  {
    id: 'mc-13-04',
    afterSectionId: 'skin-stretching-tips',
    conceptFamilyId: 'ch13-razor-handling-stretching-technique',
    title: 'Razor Control & Stretching Check',
    questions: [
      q('mcq-13-007','ch13-razor-handling-stretching-technique','application',
        'Why is a shallow razor angle used during shaving?',
        'To improve cutting control and reduce scraping',
        'To remove the need for skin stretching',
        'To make every shave a close shave',
        'To place the blade perpendicular to the skin',
        'a','A shallow working angle supports a controlled cutting stroke rather than scraping.'),
      q('mcq-13-008','ch13-razor-handling-stretching-technique','scenario',
        'The skin starts bunching in front of the razor. What should the barber correct first?',
        'Increase blade pressure',
        'Improve skin support and controlled tension before continuing',
        'Lengthen the stroke across multiple areas',
        'Switch automatically to against-grain shaving',
        'b','Controlled stretching creates a stable surface and helps prevent skin from bunching ahead of the blade.'),
    ],
  },
  {
    id: 'mc-13-05',
    afterSectionId: 'shave-types',
    conceptFamilyId: 'ch13-professional-shave-procedure',
    title: 'Professional Shave Procedure Check',
    questions: [
      q('mcq-13-009','ch13-professional-shave-procedure','understanding',
        'What are the three major stages of the professional shave?',
        'Preparation, shaving, and finishing',
        'Cutting, shampooing, and styling',
        'Consultation, coloring, and waxing',
        'Steaming, clipping, and blow-drying',
        'a','Chapter 13 organizes the service into preparation, shaving, and finishing.'),
      q('mcq-13-010','ch13-professional-shave-procedure','scenario',
        'After the first pass, a few rough spots remain. What best matches a second-time-over approach?',
        'Repeat every stroke regardless of need',
        'Re-moisten and address remaining areas with appropriate with-grain or across-grain strokes',
        'Begin dry against-grain shaving everywhere',
        'Skip inspection and move directly to powder',
        'b','The second-time-over targets remaining roughness rather than automatically repeating the entire shave.'),
    ],
  },
  {
    id: 'mc-13-06',
    afterSectionId: 'beard-tips',
    conceptFamilyId: 'ch13-facial-hair-design',
    title: 'Facial-Hair Design Check',
    questions: [
      q('mcq-13-011','ch13-facial-hair-design','application',
        'What should guide mustache or beard design most directly?',
        'One fixed face-shape chart',
        'The barber’s favorite style',
        'Client preference, facial proportions, natural growth, density, texture, and maintenance needs',
        'Current social-media trends only',
        'c','Design examples are guides; professional design adapts proportion and shape to the individual client.'),
      q('mcq-13-012','ch13-facial-hair-design','scenario',
        'A client wants a much shorter beard. What is the safest first trimming strategy?',
        'Cut immediately to the shortest requested length',
        'Begin slightly longer and reduce gradually while checking balance',
        'Remove the natural cheek line first',
        'Use the razor before evaluating density',
        'b','Starting longer preserves control and leaves room to balance the design before removing more hair.'),
    ],
  },
  {
    id: 'mc-13-07',
    afterSectionId: 'safety-precautions',
    conceptFamilyId: 'ch13-infection-control-service-safety',
    title: 'Shaving Safety & Infection Control Check',
    questions: [
      q('mcq-13-013','ch13-infection-control-service-safety','scenario',
        'A razor nick produces visible blood. What should happen first?',
        'Continue shaving and clean it at the end',
        'Cover it with lather and keep working',
        'Stop and follow standard precautions and the applicable exposure incident procedure',
        'Use a shared product applicator directly on the cut',
        'c','Visible blood requires an immediate pause and the applicable exposure-control procedure.'),
      q('mcq-13-014','ch13-infection-control-service-safety','application',
        'Why must the barber verify current local rules for razor type and glove use?',
        'Because requirements can vary by jurisdiction',
        'Because one federal rule controls every barber shop identically',
        'Because manufacturers decide legal scope',
        'Because shaving rules are never regulated',
        'a','Razor and glove requirements can vary by jurisdiction, so current local requirements govern practice.'),
    ],
  },
  {
    id: 'mc-13-08',
    afterSectionId: 'satisfaction-factors',
    conceptFamilyId: 'ch13-client-care-professional-practice',
    title: 'Client Care & Professional Practice Check',
    questions: [
      q('mcq-13-015','ch13-client-care-professional-practice','application',
        'Which combination best supports client satisfaction during a shave?',
        'Controlled technique, clean equipment, comfortable temperature, complete inspection, and professional presentation',
        'Maximum heat, heavy pressure, and the closest possible shave',
        'Speed above all other factors',
        'Using the same products and technique for every client',
        'a','Client satisfaction depends on comfort, cleanliness, control, inspection, and professional service judgment.'),
      q('mcq-13-016','ch13-client-care-professional-practice','scenario',
        'A client asks for a service choice that conflicts with safe technique or current local rules. What should the barber do?',
        'Perform it because the client requested it',
        'Explain the safety or scope boundary and offer an appropriate alternative',
        'Ignore the rule if the client signs a waiver',
        'Let another student decide',
        'b','Professional practice includes communicating limits and choosing a safe, permitted alternative rather than overriding safety or scope.'),
    ],
  },
]

export interface Chapter13MicroCheckResponse {
  questionId: Chapter13MicroCheckQuestion['id']
  selectedAnswer: Chapter13MicroCheckAnswer
}

export function buildChapter13MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter13MicroCheckResponse[],
  timestamp: string,
): Chapter13EvidenceRecord[] {
  const questionMap = new Map(
    chapter13MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question] as const),
    ),
  )
  const seen = new Set<string>()
  const records: Chapter13EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-13',
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

export function mergeChapter13EvidenceWithoutContamination(
  existing: readonly Chapter13EvidenceRecord[],
  incoming: readonly Chapter13EvidenceRecord[],
): Chapter13EvidenceRecord[] {
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

export function validateChapter13MicroCheckPlacements(): boolean {
  if (chapter13MicroChecks.length !== chapter13MicroCheckPlacements.length) return false
  return chapter13MicroChecks.every((check) => {
    const placement = chapter13MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
