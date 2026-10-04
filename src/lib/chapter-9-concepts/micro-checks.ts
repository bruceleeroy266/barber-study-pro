import type { Chapter9ConceptFamilyId } from './types'
import type { Chapter9Difficulty, Chapter9EvidenceRecord } from './grading'
import { chapter9MicroCheckPlacements } from './mappings'

export type Chapter9MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter9MicroCheckQuestion {
  id: `mcq-9-${string}`
  conceptFamilyId: Chapter9ConceptFamilyId
  difficulty: Exclude<Chapter9Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter9MicroCheckAnswer
  explanation: string
}

export interface Chapter9MicroCheck {
  id: `mc-9-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter9ConceptFamilyId
  title: string
  questions: readonly Chapter9MicroCheckQuestion[]
}

const q = (
  id: Chapter9MicroCheckQuestion['id'],
  conceptFamilyId: Chapter9ConceptFamilyId,
  difficulty: Chapter9MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter9MicroCheckAnswer,
  explanation: string,
): Chapter9MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter9MicroChecks: readonly Chapter9MicroCheck[] = [
  {
    id: 'mc-9-01', afterSectionId: 'epidermis-layers', conceptFamilyId: 'ch9-epidermis-skin-barrier', title: 'Subcutaneous tissue & Barrier Check',
    questions: [
      q('mcq-9-001','ch9-epidermis-skin-barrier','application','A superficial abrasion remains within the epidermis. Which fact best explains why bleeding may not occur until deeper tissue is reached?','The epidermis contains no blood vessels.','Tiny capillaries exist in the epidermis.','Surface capillaries close under normal conditions.','Vessels exist in the deepest epidermal layers.','a','The epidermis is avascular; blood vessels are located in the dermis.'),
      q('mcq-9-002','ch9-epidermis-skin-barrier','understanding','Which epidermal layer contains melanocytes that produce melanin?','Deep epidermis','Stratum lucidum','Stratum germinativum','Stratum granulosum','c','Melanocytes are found in the stratum germinativum, also called the basal cell layer.')
    ],
  },
  {
    id: 'mc-9-02', afterSectionId: 'skin-characteristics', conceptFamilyId: 'ch9-dermis-subcutaneous-support', title: 'Dermis & Support Check',
    questions: [
      q('mcq-9-003','ch9-dermis-subcutaneous-support','scenario','A question describes the layer containing vessels, nerves, glands, follicles, collagen, and elastin. Which layer is being tested?','Corneum','Dermis','Epidermis','Hypodermis','b','The dermis contains the skin’s vascular, neural, glandular, follicular, and connective-support structures.'),
      q('mcq-9-004','ch9-dermis-subcutaneous-support','application','Aging skin loses both structural strength and recoil. Which pairing best explains those changes?','Keratin—strength; melanin—recoil','Sebum—strength; sweat—recoil','Elastin—strength; collagen—pigment','Collagen—strength; elastin—elasticity','d','Collagen supports strength and structure; elastin supports elasticity and flexibility.')
    ],
  },
  {
    id: 'mc-9-03', afterSectionId: 'skin-functions', conceptFamilyId: 'ch9-skin-functions-glands', title: 'Skin Function & Gland Check',
    questions: [
      q('mcq-9-005','ch9-skin-functions-glands','application','A client has an oily scalp while also perspiring. Which gland pairing is correct?','Sebaceous—sweat; sudoriferous—sebum','Sebaceous—sebum; sudoriferous—sweat','Both produce sebum','Both produce sweat','b','Sebaceous glands produce sebum; sudoriferous glands produce sweat.'),
      q('mcq-9-006','ch9-skin-functions-glands','application','Sebum is released to lubricate skin and hair. Which skin function is being demonstrated?','Sensation','Absorption','Secretion','Heat regulation','c','Release of sebum from sebaceous glands is a secretion function.')
    ],
  },
  {
    id: 'mc-9-04', afterSectionId: 'primary-lesions', conceptFamilyId: 'ch9-primary-lesions', title: 'Primary Lesion Check',
    questions: [
      q('mcq-9-007','ch9-primary-lesions','scenario','A flat discolored spot has no change in skin texture. Which primary lesion best fits?','Macule','Nodule','Pustule','Wheal','a','A macule is flat discoloration without a change in skin texture.'),
      q('mcq-9-008','ch9-primary-lesions','application','One lesion is a large watery blister and another is a much smaller clear-fluid blister. Which pairing is correct?','Pustule and papule','Nodule and macule','Wheal and fissure','Bulla and vesicle','d','A bulla is a large fluid-filled blister; a vesicle is a small clear-fluid blister.')
    ],
  },
  {
    id: 'mc-9-05', afterSectionId: 'secondary-lesions', conceptFamilyId: 'ch9-secondary-lesions', title: 'Secondary Lesion Check',
    questions: [
      q('mcq-9-009','ch9-secondary-lesions','application','A vesicle breaks and dries into a crust. Why is the crust considered secondary?','It developed from a preexisting primary lesion.','A crust forms when fluid from a primary lesion dries.','Secondary lesions are defined by deeper tissue damage.','A crust appears after a primary lesion opens or changes.','a','Secondary lesions develop from primary lesions through progression, damage, accumulation, or healing.'),
      q('mcq-9-010','ch9-secondary-lesions','scenario','An open lesion with loss of skin depth lies directly in the planned shave path. What is the safest conclusion?','Shave around it using very light pressure if the razor does not pass directly through the open center.','Apply protective product over the lesion and use a shallow razor angle to reduce irritation.','Avoid direct service over the compromised area and stay within referral scope.','Identify whether the lesion appears traumatic or infectious, then decide whether direct service is acceptable.','c','An ulcer is an open lesion with loss of skin depth; direct service over compromised skin should be avoided.')
    ],
  },
  {
    id: 'mc-9-06', afterSectionId: 'sudoriferous-disorders', conceptFamilyId: 'ch9-sebaceous-sudoriferous-disorders', title: 'Gland Disorder Check',
    questions: [
      q('mcq-9-011','ch9-sebaceous-sudoriferous-disorders','application','A client cannot perspire and begins overheating during a heat-based service. Which disorder is most relevant?','Hyperhidrosis','Anhidrosis','Rosacea','Keratoma','b','Anhidrosis is deficient or absent perspiration and can interfere with heat regulation.'),
      q('mcq-9-012','ch9-sebaceous-sudoriferous-disorders','understanding','Which statement correctly distinguishes a sebaceous cyst from a steatoma in this chapter?','Both terms describe sebum-filled growths, but steatoma is generally the larger form.','A sebaceous cyst contains trapped sebum, while a steatoma is a chronic inflammation of the sebaceous gland.','A sebaceous cyst is sebum-related; a steatoma is a subcutaneous fatty tumor.','A sebaceous cyst is a fatty tumor under the skin, while a steatoma is a blocked sebaceous duct.','c','Chapter 9 treats sebaceous cyst and steatoma as different conditions; steatoma is a subcutaneous fatty tumor.')
    ],
  },
  {
    id: 'mc-9-07', afterSectionId: 'inflammations', conceptFamilyId: 'ch9-inflammatory-infectious-conditions', title: 'Inflammation & Infection Check',
    questions: [
      q('mcq-9-013','ch9-inflammatory-infectious-conditions','scenario','A client has chronic red patches with coarse silvery scales identified as psoriasis. Which statement is correct?','Psoriasis is noncontagious; handle affected skin gently.','Psoriasis is noncontagious, but active scaling means direct service should be avoided.','The barber may classify the flare for service planning and suggest over-the-counter care.','Services should be refused whenever visible plaques are present.','a','Psoriasis is noncontagious; barbering decisions should focus on gentle handling and scope.'),
      q('mcq-9-014','ch9-inflammatory-infectious-conditions','scenario','An active cold sore lies in the facial shave area. What is the best service decision?','Use gloves and a disposable razor to reduce exposure while avoiding repeated passes over the lesion.','Cover the lesion with a barrier and continue the shave around it if the barrier stays intact.','Pause direct service over the active lesion and follow sanitation/referral guidance.','Confirm that the lesion is consistent with herpes before deciding whether to defer direct service.','c','Active herpes lesions are contagious; avoid direct service and follow sanitation and referral requirements.')
    ],
  },
  {
    id: 'mc-9-08', afterSectionId: 'hypertrophies', conceptFamilyId: 'ch9-pigmentation-hypertrophies', title: 'Pigmentation & Hypertrophy Check',
    questions: [
      q('mcq-9-015','ch9-pigmentation-hypertrophies','understanding','A patch is lighter than the surrounding skin because pigment is reduced. Which term applies?','Hyperpigmentation','Hypopigmentation','Keratoma','Verruca','b','Hypopigmentation means decreased pigment and lighter areas of skin.'),
      q('mcq-9-016','ch9-pigmentation-hypertrophies','application','A thickened area forms from repeated pressure or friction. Which description best fits?','A keratoma is a protective thickening that can recur if pressure continues.','A keratoma is a localized thickening caused mainly by infection and usually persists even after pressure is removed.','A keratoma is a fluid-filled lesion that develops when repeated friction separates skin layers.','A keratoma is an inflammatory swelling that forms around a damaged sweat gland.','a','A keratoma is thickened skin produced by pressure or friction; calluses are a common example.')
    ],
  },
  {
    id: 'mc-9-09', afterSectionId: 'abcde-melanoma', conceptFamilyId: 'ch9-skin-cancer-recognition', title: 'Skin Cancer Recognition Check',
    questions: [
      q('mcq-9-017','ch9-skin-cancer-recognition','application','A mole changes in shape and color over several months. Which ABCDE feature most directly captures change over time?','Asymmetry','Border','Diameter','Evolution','d','Evolution refers to change over time in a lesion’s size, shape, color, or other characteristics.'),
      q('mcq-9-018','ch9-skin-cancer-recognition','understanding','Which sequence best matches the chapter’s qualitative distinction among the three major skin cancers?','Basal cell least common/least severe; squamous most common; melanoma most dangerous','Basal cell most common/least severe; squamous more serious; melanoma least common/most dangerous','Basal and squamous occur at similar rates, while melanoma is more severe but otherwise comparable','Basal cell most common; melanoma more common than squamous and carries the highest risk','b','The chapter distinguishes basal cell as most common/least severe, squamous as more serious, and melanoma as least common/most dangerous.')
    ],
  },
  {
    id: 'mc-9-10', afterSectionId: 'skin-health', conceptFamilyId: 'ch9-service-safety-referral', title: 'Service Safety & Referral Check',
    questions: [
      q('mcq-9-019','ch9-service-safety-referral','scenario','A changing lesion is located directly where a razor would pass. What is the most professional response?','Identify the lesion type visually so the client receives specific guidance before the service is changed.','Proceed around the lesion unless it shows bleeding, ulceration, or another sign of active injury.','Describe the observation, avoid unsafe direct service, and recommend qualified evaluation.','Suggest a nonprescription skin product while advising the client to seek evaluation if the lesion continues changing.','c','Barbers should observe without diagnosing, protect the service area, and refer concerning findings.'),
      q('mcq-9-020','ch9-service-safety-referral','scenario','A raised lesion contains pus in the planned service area. Which statement stays within barber scope?','A pustule usually indicates a bacterial infection, so the barber can identify the likely cause without naming a disease.','Recognize the pustule, avoid direct service if open/draining or potentially infectious, and follow sanitation/referral requirements.','Drain the pustule using clean technique so the surrounding area can be serviced without pressure.','Apply a topical antiseptic, wait for the area to calm, and proceed if drainage stops.','b','A pustule is an observable lesion; it does not by itself establish a medical diagnosis.'),
      q('mcq-9-021','ch9-service-safety-referral','application','Which principle best separates barber observation from medical diagnosis?','A barber may identify a likely disorder when the signs match a condition taught in the curriculum, as long as no treatment is prescribed.','A barber may name a condition after asking the client about symptoms and medical history, but should refer for confirmation.','A barber should avoid diagnosis mainly when signs suggest an infectious condition; noninfectious conditions can be identified for service planning.','Describe observable signs and service implications without assigning a medical diagnosis.','d','Professional scope allows observation and safe service decisions, not medical diagnosis.')
    ],
  },
]

export interface Chapter9MicroCheckResponse {
  questionId: Chapter9MicroCheckQuestion['id']
  selectedAnswer: Chapter9MicroCheckAnswer
}

export function buildChapter9MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter9MicroCheckResponse[],
  timestamp: string,
): Chapter9EvidenceRecord[] {
  const questionMap = new Map(
    chapter9MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter9EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-9',
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

export function mergeChapter9EvidenceWithoutContamination(
  existing: readonly Chapter9EvidenceRecord[],
  incoming: readonly Chapter9EvidenceRecord[],
): Chapter9EvidenceRecord[] {
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

export function validateChapter9MicroCheckPlacements(): boolean {
  if (chapter9MicroChecks.length !== chapter9MicroCheckPlacements.length) return false
  return chapter9MicroChecks.every((check) => {
    const placement = chapter9MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
