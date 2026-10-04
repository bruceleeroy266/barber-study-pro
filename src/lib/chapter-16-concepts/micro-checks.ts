import type { Chapter16ConceptFamilyId } from './types'
import type { Chapter16Difficulty, Chapter16EvidenceRecord } from './grading'
import { chapter16MicroCheckPlacements } from './mappings'

export type Chapter16MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter16MicroCheckQuestion {
  id: `mcq-16-${string}`
  conceptFamilyId: Chapter16ConceptFamilyId
  difficulty: Exclude<Chapter16Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter16MicroCheckAnswer
  explanation: string
}

export interface Chapter16MicroCheck {
  id: `mc-16-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter16ConceptFamilyId
  title: string
  questions: readonly Chapter16MicroCheckQuestion[]
}

const q = (
  id: Chapter16MicroCheckQuestion['id'],
  conceptFamilyId: Chapter16ConceptFamilyId,
  difficulty: Chapter16MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter16MicroCheckAnswer,
  explanation: string,
): Chapter16MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter16MicroChecks: readonly Chapter16MicroCheck[] = [
  {
    id: 'mc-16-01',
    afterSectionId: 'foundational-cuts-overview',
    conceptFamilyId: 'ch16-design-foundations',
    title: 'Design Foundations Check',
    questions: [
      q('mcq-16-001','ch16-design-foundations','understanding',
        'Which design element describes the angle at which hair is held away from the head before cutting?',
        'Shape','Weight','Elevation','Movement',
        'c','Elevation is the angle at which hair is held away from the head before cutting and is a major control for weight and layering.'),
      q('mcq-16-002','ch16-design-foundations','application',
        'A client wants to keep visible perimeter length while adding movement through the interior. Which foundational structure best fits that goal?',
        'Blunt cut','Graduated cut','Uniform-layered cut','Long-layered cut',
        'd','A long-layered structure is designed to preserve more perimeter length while introducing shorter interior layers and movement.'),
    ],
  },
  {
    id: 'mc-16-02',
    afterSectionId: 'blunt-cut-scenario',
    conceptFamilyId: 'ch16-blunt-cut',
    title: 'Blunt Cutting Check',
    questions: [
      q('mcq-16-003','ch16-blunt-cut','understanding',
        'What does little to no elevation primarily preserve in a blunt cut?',
        'Interior layering','Perimeter weight','Graduated stacking','Overdirection',
        'b','Keeping the hair near natural fall preserves weight at the perimeter and supports a strong one-length shape.'),
      q('mcq-16-004','ch16-blunt-cut','scenario',
        'A blunt perimeter looks even while the client is tilted forward but uneven after they sit upright. What should the barber evaluate first?',
        'Head position during cutting','Product choice','Brush diameter','Thermal-tool temperature',
        'a','Head position changes how the hair falls relative to the cutting line, so neutral positioning is important for an accurate perimeter.'),
    ],
  },
  {
    id: 'mc-16-03',
    afterSectionId: 'graduated-cut-scenario',
    conceptFamilyId: 'ch16-graduated-cut',
    title: 'Graduated Cutting Check',
    questions: [
      q('mcq-16-005','ch16-graduated-cut','understanding',
        'What visual effect is most associated with graduation?',
        'Weight buildup along a design line','Maximum weight only at the perimeter','Equal-length layers throughout','No visible shape change',
        'a','Graduation uses controlled elevation to build and shift weight through a planned area of the haircut.'),
      q('mcq-16-006','ch16-graduated-cut','application',
        'Why are narrow, controlled subsections useful when building a graduated shape?',
        'They eliminate the need for a guide','They make elevation and cutting angle easier to see and repeat','They guarantee the same result on every density','They remove all perimeter weight',
        'b','Controlled subsections improve visibility and consistency when maintaining elevation, guide control, and weight buildup.'),
    ],
  },
  {
    id: 'mc-16-04',
    afterSectionId: 'uniform-layer-scenario',
    conceptFamilyId: 'ch16-uniform-layer',
    title: 'Uniform Layering Check',
    questions: [
      q('mcq-16-007','ch16-uniform-layer','understanding',
        'Which elevation is most associated with a uniform-layered structure?',
        '0 degrees','45 degrees','90 degrees','180 degrees',
        'c','Uniform layering is built around approximately 90-degree elevation to create similar layer lengths around the head shape.'),
      q('mcq-16-008','ch16-uniform-layer','application',
        'A barber wants even layer distribution and movement without a heavy bottom line. Which structure best fits the goal?',
        'Blunt cut','Graduated cut','Uniform-layered cut','One-length perimeter only',
        'c','Uniform layering distributes weight more evenly and creates movement without concentrating weight at the bottom perimeter.'),
    ],
  },
  {
    id: 'mc-16-05',
    afterSectionId: 'long-layer-scenario',
    conceptFamilyId: 'ch16-long-layer',
    title: 'Long Layering Check',
    questions: [
      q('mcq-16-009','ch16-long-layer','understanding',
        'What is the primary design goal of long layering?',
        'Preserve more perimeter length while adding shorter interior layers','Build maximum weight at the nape','Create equal-length layers around the head','Keep all hair at natural fall',
        'a','Long layering keeps more visible length around the perimeter while using higher elevation to create interior movement.'),
      q('mcq-16-010','ch16-long-layer','scenario',
        'A client wants movement but does not want the perimeter to become noticeably shorter. Which approach best supports that goal?',
        'Use a long-layered structure with controlled high elevation','Use zero elevation throughout','Use aggressive notching at the perimeter','Cut every section to the same short guide',
        'a','Controlled high elevation can create shorter interior layers while allowing more perimeter length to remain.'),
    ],
  },
  {
    id: 'mc-16-06',
    afterSectionId: 'texture-curly-scenario',
    conceptFamilyId: 'ch16-hair-analysis-texture',
    title: 'Hair Analysis & Texture Check',
    questions: [
      q('mcq-16-011','ch16-hair-analysis-texture','understanding',
        'Which factors should be considered when adapting a haircut to the client?',
        'The inspiration photo, desired length, face shape, and the client’s usual styling products','Texture, density, growth pattern, curl behavior, and design goal','Texture, hair color, preferred styling time, and the client’s age','Density, face shape, current trend, and the barber’s preferred cutting method',
        'b','Hair analysis combines multiple characteristics so the technique can be adapted to the individual client and intended result.'),
      q('mcq-16-012','ch16-hair-analysis-texture','scenario',
        'A curly-haired client brings a photo of a style created on straight hair. What is the best professional response?',
        'Reproduce the shape as closely as possible while cutting the curly hair to the same wet lengths shown in the photo','Recommend a different style because a straight-hair reference cannot be adapted reliably to curly hair','Discuss curl behavior and likely shrinkage, then adapt the design','Match the perimeter from the photo first, then discuss shrinkage after the hair dries',
        'c','Curl behavior and shrinkage vary, so the design should be discussed and adapted rather than copied mechanically.'),
    ],
  },
  {
    id: 'mc-16-07',
    afterSectionId: 'advanced-techniques-scenario',
    conceptFamilyId: 'ch16-advanced-techniques-texturizing',
    title: 'Advanced Cutting & Texturizing Check',
    questions: [
      q('mcq-16-013','ch16-advanced-techniques-texturizing','application',
        'What should determine whether razor cutting is appropriate?',
        'Hair density alone','The barber’s preferred tool','Hair condition, texture, density, desired finish, blade condition, and technique','Whether the client has straight hair',
        'c','Razor suitability is a condition- and design-based decision rather than a universal rule tied to one hair category.'),
      q('mcq-16-014','ch16-advanced-techniques-texturizing','scenario',
        'A client wants less interior bulk while keeping most visible length. Which technique best matches that goal among the choices?',
        'Slithering','Blunt cutting','Low elevation','Stationary guide',
        'a','Slithering can reduce bulk along a section while preserving most of the visible length when used appropriately.'),
    ],
  },
  {
    id: 'mc-16-08',
    afterSectionId: 'styling-scenario',
    conceptFamilyId: 'ch16-styling-finishing-safety',
    title: 'Styling, Finishing & Safety Check',
    questions: [
      q('mcq-16-015','ch16-styling-finishing-safety','application',
        'Which thermal-styling practice best reflects the hardened Chapter 16 guidance?',
        'Use the highest heat the tool allows','Use the lowest effective heat for the hair condition and service goal','Use heated tools on damp hair regardless of labeling','Rest hot tools directly on any nearby surface',
        'b','Thermal styling should follow tool and product directions, use the lowest effective heat, and protect the client and work area.'),
      q('mcq-16-016','ch16-styling-finishing-safety','scenario',
        'A finished haircut is still wet and the barber wants to judge balance and movement. What is the best next step?',
        'Check the wet shape against the consultation and make final corrections before drying so shrinkage does not affect the evaluation','Evaluate the haircut in its intended finished state through appropriate drying and styling','Re-cut sections that appear heavy while wet, then dry after the interior balance looks even','Apply finishing product and judge balance from the wet silhouette before deciding whether drying is necessary',
        'b','Drying and styling can reveal balance, movement, and areas needing refinement that may be less visible while the hair is wet.'),
    ],
  },
]

export interface Chapter16MicroCheckResponse {
  questionId: Chapter16MicroCheckQuestion['id']
  selectedAnswer: Chapter16MicroCheckAnswer
}

export function buildChapter16MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter16MicroCheckResponse[],
  timestamp: string,
): Chapter16EvidenceRecord[] {
  const questionMap = new Map(
    chapter16MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter16EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-16',
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

export function mergeChapter16EvidenceWithoutContamination(
  existing: readonly Chapter16EvidenceRecord[],
  incoming: readonly Chapter16EvidenceRecord[],
): Chapter16EvidenceRecord[] {
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

export function validateChapter16MicroCheckPlacements(): boolean {
  if (chapter16MicroChecks.length !== chapter16MicroCheckPlacements.length) return false
  return chapter16MicroChecks.every((check) => {
    const placement = chapter16MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
