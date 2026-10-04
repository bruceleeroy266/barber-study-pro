import type { Chapter17ConceptFamilyId } from './types'
import type { Chapter17Difficulty, Chapter17EvidenceRecord } from './grading'
import { chapter17MicroCheckPlacements } from './mappings'

export type Chapter17MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter17MicroCheckQuestion {
  id: `mcq-17-${string}`
  conceptFamilyId: Chapter17ConceptFamilyId
  difficulty: Exclude<Chapter17Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter17MicroCheckAnswer
  explanation: string
}

export interface Chapter17MicroCheck {
  id: `mc-17-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter17ConceptFamilyId
  title: string
  questions: readonly Chapter17MicroCheckQuestion[]
}

const q = (
  id: Chapter17MicroCheckQuestion['id'],
  conceptFamilyId: Chapter17ConceptFamilyId,
  difficulty: Chapter17MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter17MicroCheckAnswer,
  explanation: string,
): Chapter17MicroCheckQuestion => ({
  id, conceptFamilyId, difficulty, question, answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter17MicroChecks: readonly Chapter17MicroCheck[] = [
  {
    id: 'mc-17-01',
    afterSectionId: 'hair-analysis',
    conceptFamilyId: 'ch17-consultation-hair-analysis',
    title: 'Consultation & Hair Analysis Check',
    questions: [
      q('mcq-17-001','ch17-consultation-hair-analysis','application',
        'A client with previously lightened hair requests a permanent wave. What should guide the first service decision?',
        'Porosity alone','Hair analysis, required testing, service history, and the selected product directions','A universal acid-wave recommendation','The client’s preferred processing time',
        'b','Chemical-texture planning should use the complete hair analysis, service history, required testing, and product-specific directions rather than one characteristic alone.'),
      q('mcq-17-002','ch17-consultation-hair-analysis','scenario',
        'During consultation you notice visibly irritated and abraded scalp tissue in the planned service area. What is the safest response?',
        'Proceed with a weaker formula','Cover the area and continue','Postpone the chemical service and follow appropriate safety/referral guidance','Let the client decide whether irritation matters',
        'c','A chemical service should not be performed over visibly compromised scalp tissue. Postpone the service rather than diagnosing or casually working around the condition.'),
    ],
  },
  {
    id: 'mc-17-02',
    afterSectionId: 'bond-science',
    conceptFamilyId: 'ch17-chemistry-bond-transformation',
    title: 'Chemical Bond Transformation Check',
    questions: [
      q('mcq-17-003','ch17-chemistry-bond-transformation','understanding',
        'Which statement correctly distinguishes thio/permanent-wave chemistry from hydroxide relaxing?',
        'Both alter strong side bonds, but hydroxide relaxers finish with the same oxidation step used in thio systems','Thio systems use reduction and compatible oxidation, while hydroxide relaxers use different chemistry including lanthionization','Hydroxide relaxers soften curl mainly through temporary side-bond changes that reverse after shampooing','Both depend on heat to reshape bonds, while the chemical products mainly control pH',
        'b','The hardened Chapter 17 model separates thio reduction/oxidation chemistry from hydroxide lanthionization.'),
      q('mcq-17-004','ch17-chemistry-bond-transformation','application',
        'Why should neutralization language be tied to the product system?',
        'Most texture services can use an oxidizing neutralizer if processing time is adjusted for the product strength','Relaxers and permanent waves both use chemicals, but neutralization terminology is interchangeable between systems','Oxidizing neutralization applies to compatible thio/permanent-wave systems, while hydroxide relaxers use a different finishing sequence','Neutralization is best understood as restoring the hair to its original pH regardless of product chemistry',
        'c','Do not apply one neutralization model to all chemical texture services. The finishing chemistry depends on the product family.'),
    ],
  },
  {
    id: 'mc-17-03',
    afterSectionId: 'perm-service-check',
    conceptFamilyId: 'ch17-permanent-waving-procedures',
    title: 'Permanent Waving Procedure Check',
    questions: [
      q('mcq-17-005','ch17-permanent-waving-procedures','application',
        'How should a barber decide when a permanent wave is ready to rinse?',
        'Check one test curl from the most resistant area and use that result for the remaining rods','Use the manufacturer’s maximum processing time unless the client reports discomfort','Evaluate representative test curls at the intervals and locations directed by the product instructions and service plan','Use the client’s sensation plus elapsed time as the main signal that processing is complete',
        'c','Test-curl timing and placement should follow the selected waving system and service plan rather than a universal fixed count.'),
      q('mcq-17-006','ch17-permanent-waving-procedures','scenario',
        'A product’s directions specify a particular heat and processing procedure. What is the correct approach?',
        'Use the product’s pH category to select a standard heat and processing schedule for all clients','Follow the specific product directions while monitoring the hair and service conditions','Increase processing time on resistant hair before changing the formula or checking test curls','Add moderate heat when processing appears slow, provided the hair still feels strong',
        'b','Heat and timing are product-specific and must be controlled according to the manufacturer directions and ongoing hair assessment.'),
    ],
  },
  {
    id: 'mc-17-04',
    afterSectionId: 'relaxer-procedure',
    conceptFamilyId: 'ch17-chemical-relaxing-procedures',
    title: 'Chemical Relaxing Procedure Check',
    questions: [
      q('mcq-17-007','ch17-chemical-relaxing-procedures','application',
        'What best describes a no-base relaxer service?',
        'A no-base product generally needs protection only around the hairline and ears, not elsewhere','It does not require the same full scalp-base step as a base system, but product-specific protection directions still apply','A no-base relaxer is typically milder, so its scalp-protection requirements can be reduced','A no-base relaxer may contact mildly irritated areas if a protective cream is applied first',
        'b','No-base does not mean no protection or unrestricted scalp contact. Follow the selected product’s protection and application directions.'),
      q('mcq-17-008','ch17-chemical-relaxing-procedures','scenario',
        'A client reports burning or pain while a relaxer is processing. What should happen?',
        'Continue until the timer ends','Add more product to even the result','Stop the service and remove the product according to its safety directions','Switch to a different relaxer without rinsing',
        'c','Burning or pain requires immediate action: stop exposure and remove the product according to the safety directions rather than continuing or diagnosing the cause.'),
    ],
  },
  {
    id: 'mc-17-05',
    afterSectionId: 'curl-reformation',
    conceptFamilyId: 'ch17-curl-reformation',
    title: 'Curl Reformation Check',
    questions: [
      q('mcq-17-009','ch17-curl-reformation','application',
        'Why does curl reformation require especially careful analysis and processing control?',
        'It is a chemical reshaping service, but compatibility matters mainly when a strong relaxer was used previously','It chemically restructures the hair through multiple service stages, so compatibility and fiber condition are critical','It follows a standard curl-reformation sequence, with product directions mainly affecting timing','It is generally compatible with previously relaxed hair when the strand feels strong and elastic',
        'b','Multiple chemical stages increase the need to verify compatibility, fiber condition, prior service history, and product-system directions.'),
      q('mcq-17-010','ch17-curl-reformation','scenario',
        'Before curl reformation, the client’s prior chemical history is unclear. What is the best response?',
        'Proceed using the weakest formula','Assume all prior relaxers are compatible','Clarify the chemical history and verify compatibility before proceeding','Skip consultation if the hair feels strong',
        'c','Unknown chemical history is a compatibility concern. The service plan should not proceed until the prior chemistry and product compatibility are adequately established.'),
    ],
  },
  {
    id: 'mc-17-06',
    afterSectionId: 'common-mistakes',
    conceptFamilyId: 'ch17-safety-strand-tests-compatibility',
    title: 'Safety, Testing & Compatibility Check',
    questions: [
      q('mcq-17-011','ch17-safety-strand-tests-compatibility','scenario',
        'Hair was previously treated with a hydroxide relaxer and the client now requests a thio permanent wave. What is the safest rule?',
        'A successful strand test can justify the service even when the prior chemistry is normally considered incompatible','Waiting several months usually resolves incompatibility if the new growth is long enough to wrap','Treat the previously treated hair as incompatible unless verified product-system guidance explicitly supports the planned service','Additional neutralizer can compensate for residual hydroxide chemistry if the test curl appears stable',
        'c','A strand test does not override a known chemical incompatibility. Hydroxide/thio history requires explicit verified compatibility guidance before proceeding.'),
      q('mcq-17-012','ch17-safety-strand-tests-compatibility','application',
        'What is the role of porosity and elasticity assessments before a chemical texture service?',
        'A strong porosity result can outweigh borderline elasticity if the product is labeled for resistant hair','They contribute evidence about hair condition and product response but remain part of a broader analysis','Porosity and elasticity can establish a starting processing time that is then adjusted by observation','Current porosity and elasticity are more useful than older chemical history when the hair looks healthy',
        'b','Pre-service assessments inform the decision, but they do not replace chemical history, contraindication review, or manufacturer directions.'),
    ],
  },
  {
    id: 'mc-17-07',
    afterSectionId: 'texturizers',
    conceptFamilyId: 'ch17-texturizers-chemical-blowouts',
    title: 'Texturizers & Chemical Blowouts Check',
    questions: [
      q('mcq-17-013','ch17-texturizers-chemical-blowouts','understanding',
        'What best distinguishes a texturizing goal from a full-relaxing goal?',
        'Texturizing usually uses a lower-strength formula than full relaxing, even when the desired curl reduction is substantial','Texturizing aims to loosen or soften curl rather than maximize straightening','Texturizing is defined mainly by shorter processing time rather than by the intended finished curl pattern','Texturizing softens curl through surface conditioning and temporary bond changes instead of permanent restructuring',
        'b','The service goal is the important distinction. Do not define texturizing only by a weaker formula or shorter time.'),
      q('mcq-17-014','ch17-texturizers-chemical-blowouts','application',
        'How should the procedure for a chemical blowout be selected?',
        'Use a shortened relaxer procedure whenever the goal is reduced bulk rather than maximum straightening','Select the procedure mainly from the target finish and expected styling time, then adjust for hair condition','Use the selected product system, hair analysis, and manufacturer directions to achieve the intended reduction in curl or bulk','Process for a shorter interval than a full relaxer unless the product label specifically calls for equal timing',
        'c','The intended outcome may be reduced curl or bulk, but exact chemistry and processing depend on the selected product system and client analysis.'),
    ],
  },
]

export interface Chapter17MicroCheckResponse {
  questionId: Chapter17MicroCheckQuestion['id']
  selectedAnswer: Chapter17MicroCheckAnswer
}

export function buildChapter17MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter17MicroCheckResponse[],
  timestamp: string,
): Chapter17EvidenceRecord[] {
  const questionMap = new Map(
    chapter17MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter17EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-17',
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

export function mergeChapter17EvidenceWithoutContamination(
  existing: readonly Chapter17EvidenceRecord[],
  incoming: readonly Chapter17EvidenceRecord[],
): Chapter17EvidenceRecord[] {
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

export function validateChapter17MicroCheckPlacements(): boolean {
  if (chapter17MicroChecks.length !== chapter17MicroCheckPlacements.length) return false
  return chapter17MicroChecks.every((check) => {
    const placement = chapter17MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
