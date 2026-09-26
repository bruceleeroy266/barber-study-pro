import type { Chapter7ConceptFamilyId } from './types'
import type {
  Chapter7Difficulty,
  Chapter7EvidenceRecord,
} from './grading'
import { chapter7MicroCheckPlacements } from './mappings'

export type Chapter7MicroCheckAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter7MicroCheckQuestion {
  id: `mcq-7-${string}`
  conceptFamilyId: Chapter7ConceptFamilyId
  difficulty: Exclude<Chapter7Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter7MicroCheckAnswer
  explanation: string
}

export interface Chapter7MicroCheck {
  id: `mc-7-${string}`
  afterSectionId: string
  conceptFamilyId: Chapter7ConceptFamilyId
  title: string
  questions: readonly Chapter7MicroCheckQuestion[]
}

const q = (
  id: Chapter7MicroCheckQuestion['id'],
  conceptFamilyId: Chapter7ConceptFamilyId,
  difficulty: Chapter7MicroCheckQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter7MicroCheckAnswer,
  explanation: string,
): Chapter7MicroCheckQuestion => ({
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

export const chapter7MicroChecks: readonly Chapter7MicroCheck[] = [
  {
    id: 'mc-7-01',
    afterSectionId: 'organic-inorganic',
    conceptFamilyId: 'ch7-organic-inorganic',
    title: 'Organic vs Inorganic Check',
    questions: [
      q('mcq-7-001','ch7-organic-inorganic','understanding','Which statement is the strongest way to classify organic chemistry?','It focuses on carbon-containing substances and compounds.','It includes only substances that came from living organisms.','It includes every substance that can burn.','It excludes synthetic materials.','a','Organic chemistry is organized around carbon-containing substances and compounds, not living-origin or flammability shortcuts.'),
      q('mcq-7-002','ch7-organic-inorganic','application','A product is mostly water and mineral salts. Which conclusion is most defensible?','It contains important inorganic substances.','It must be organic because it is used on hair.','It must be flammable because all chemistry products burn.','It is safe because inorganic products cannot irritate tissue.','a','Water and mineral salts are common inorganic examples. Hazard still depends on the specific product and exposure.')
    ],
  },
  {
    id: 'mc-7-02',
    afterSectionId: 'building-blocks',
    conceptFamilyId: 'ch7-matter-structure',
    title: 'Matter & Structure Check',
    questions: [
      q('mcq-7-003','ch7-matter-structure','understanding','Which description best defines an element?','Matter made of one type of atom.','Two or more substances physically mixed.','Different elements chemically joined in a fixed proportion.','Particles dispersed in a liquid that settle.','a','An element is a basic form of matter made of one type of atom.'),
      q('mcq-7-004','ch7-matter-structure','application','A molecule contains hydrogen and oxygen atoms chemically joined in a fixed ratio. How should it be classified?','A compound.','An element.','A suspension.','A physical mixture.','a','A compound contains different elements chemically joined in definite proportions.')
    ],
  },
  {
    id: 'mc-7-03',
    afterSectionId: 'changes-grid',
    conceptFamilyId: 'ch7-properties-changes',
    title: 'Properties & Changes Check',
    questions: [
      q('mcq-7-005','ch7-properties-changes','application','Ice melts while an oxidation haircolor develops. Which comparison is correct?','Melting is physical; color development is chemical.','Both are physical because appearance changes.','Melting is chemical; color development is physical.','Both are chemical because energy is involved.','a','Melting changes physical state without creating a new substance; oxidation haircolor involves a chemical reaction.'),
      q('mcq-7-006','ch7-properties-changes','application','A student says a change is chemical only because it is difficult to reverse. What is the better test?','Whether chemical composition changes or a new chemical substance forms.','Whether the change happens quickly.','Whether the product is alkaline.','Whether heat is released.','a','Chemical change is defined by changed chemical composition, not reversibility alone.')
    ],
  },
  {
    id: 'mc-7-04',
    afterSectionId: 'redox-reactions',
    conceptFamilyId: 'ch7-redox-reactions',
    title: 'Redox Check',
    questions: [
      q('mcq-7-007','ch7-redox-reactions','understanding','Which change describes oxidation in this chapter?','Gain of oxygen or loss of hydrogen.','Loss of oxygen or gain of hydrogen.','Gain of water only.','Loss of minerals only.','a','Oxidation can involve gaining oxygen or losing hydrogen.'),
      q('mcq-7-008','ch7-redox-reactions','application','During permanent waving, which sequence is correct?','Reduction changes disulfide bonds, then oxidation helps reform them.','Oxidation breaks the bonds, then acid-alkali neutralization reforms them.','Only reduction occurs.','Only oxidation occurs.','a','Permanent waving uses reduction followed by oxidation during neutralization.'),
      q('mcq-7-009','ch7-redox-reactions','scenario','A chemical service becomes unexpectedly hot. What is the best response?','Stop and follow the product safety directions.','Continue because heat always proves proper processing.','Add water to every formula automatically.','Cover the product to trap the heat.','a','Exothermic reactions release heat, but unexpected or excessive heat requires product-specific safety action.')
    ],
  },
  {
    id: 'mc-7-05',
    afterSectionId: 'mixtures',
    conceptFamilyId: 'ch7-mixtures',
    title: 'Mixtures Check',
    questions: [
      q('mcq-7-010','ch7-mixtures','understanding','Which mixture is stable and uniform with dissolved material that does not settle?','Solution.','Suspension.','Emulsion.','Element.','a','A solution is stable and uniform, with dissolved material remaining distributed.'),
      q('mcq-7-011','ch7-mixtures','application','A product can separate while standing and the label tells the barber to redistribute it. Which behavior is most consistent?','Suspension-like settling.','A pure element changing state.','A fixed-composition compound.','Acid-alkali neutralization.','a','Suspensions can contain dispersed particles that settle; the label controls handling.')
    ],
  },
  {
    id: 'mc-7-06',
    afterSectionId: 'ph-mastery',
    conceptFamilyId: 'ch7-water-ph',
    title: 'Water & pH Check',
    questions: [
      q('mcq-7-012','ch7-water-ph','understanding','Which statement correctly describes the standard pH scale?','Below 7 is acidic, 7 is neutral, above 7 is alkaline.','Below 7 is alkaline, 7 is acidic, above 7 is neutral.','Only 4.5–5.5 has meaningful pH.','pH measures product thickness.','a','The standard pH scale places acids below 7, neutral at 7, and alkalis above 7.'),
      q('mcq-7-013','ch7-water-ph','application','What effect can increasing alkalinity have on hair?','Increase swelling and porosity as the cuticle opens.','Automatically neutralize the hair.','Always contract and harden the hair.','Convert the hair into a pure substance.','a','Increasing alkalinity can swell hair and increase porosity; the exact effect depends on product strength and correct use.'),
      q('mcq-7-014','ch7-water-ph','scenario','A student treats permanent-wave neutralization and acid-alkali neutralization as the same reaction. Which correction is best?','Permanent-wave neutralization is an oxidation step; acid-alkali neutralization forms water and a salt.','They are identical because both use the word neutralize.','Both are physical changes.','Both always produce pH 7 hair.','a','These are different chemical processes and must not be treated as interchangeable.')
    ],
  },
  {
    id: 'mc-7-07',
    afterSectionId: 'shampoo-types',
    conceptFamilyId: 'ch7-shampoos',
    title: 'Shampoo Selection Check',
    questions: [
      q('mcq-7-015','ch7-shampoos','application','A client has mineral and product buildup but also reports dryness. Which choice best applies Chapter 7 reasoning?','Consider a clarifying or chelating cleanser when buildup is present, but avoid a fixed schedule and account for hair condition.','Use clarifying shampoo daily.','Use medicated shampoo because it is stronger.','Any shampoo will perform the same.','a','Clarifying or chelating products may address buildup, but use should match client condition and directions.'),
      q('mcq-7-016','ch7-shampoos','application','A client wants a less-stripping cleanser for color-treated hair. What category is most relevant to consider?','A sulfate-free or otherwise gentler cleansing formula appropriate for the client.','A depilatory.','A styptic.','The most alkaline shampoo available.','a','A gentler or sulfate-free cleanser may be appropriate when the formula fits the client and service goal.')
    ],
  },
  {
    id: 'mc-7-08',
    afterSectionId: 'conditioner-types',
    conceptFamilyId: 'ch7-conditioners',
    title: 'Conditioner Selection Check',
    questions: [
      q('mcq-7-017','ch7-conditioners','understanding','Which list contains Chapter 7 conditioner categories?','Instant/rinse-out, treatment/repair, and leave-in.','Organic, inorganic, and elemental.','Acid, alkali, and salt.','Solution, suspension, and emulsion.','a','Chapter 7 includes instant/rinse-out, treatment/repair, and leave-in conditioner categories.'),
      q('mcq-7-018','ch7-conditioners','application','A conditioner contains several ingredient families. How should its effect be predicted?','Evaluate the whole formula, intended purpose, and hair condition.','Assume one protein ingredient repairs all damage.','Assume every silicone guarantees heat protection.','Ignore the formula because all conditioners are equivalent.','a','Conditioner performance depends on the full formula and hair condition, not one ingredient name.')
    ],
  },
  {
    id: 'mc-7-09',
    afterSectionId: 'other-preparations',
    conceptFamilyId: 'ch7-other-preparations',
    title: 'Cosmetic Preparations Check',
    questions: [
      q('mcq-7-019','ch7-other-preparations','understanding','Which ingredient-purpose pairing is correct?','Glycerin — humectant.','Alum — surfactant.','Petrolatum — oxidizing agent.','Witch hazel — reducing agent.','a','Glycerin is commonly used as a humectant in cosmetic preparations.'),
      q('mcq-7-020','ch7-other-preparations','application','A barber is choosing between a styling aid, massage cream, astringent, and moisturizer. What should drive the choice?','Service purpose, client condition, formula, and product directions.','Strongest fragrance.','Highest pH regardless of use.','Organic labeling because organic always means safer.','a','Cosmetic preparations have different purposes; selection should match the service and client.')
    ],
  },
  {
    id: 'mc-7-10',
    afterSectionId: 'safety',
    conceptFamilyId: 'ch7-chemical-safety',
    title: 'Chemical Safety Check',
    questions: [
      q('mcq-7-021','ch7-chemical-safety','application','Before using an unfamiliar chemical product, what should the barber prioritize?','Product label and manufacturer directions, plus the SDS when applicable.','A social-media comment.','Container color.','A rule from an unrelated product.','a','Product-specific safety information should drive chemical use.'),
      q('mcq-7-022','ch7-chemical-safety','scenario','Two chemicals are available, but neither label authorizes mixing them. What is the safest choice?','Do not mix them; verify manufacturer information first.','Mix a small amount because small quantities are safe.','Combine them if the colors match.','Add water because dilution makes any combination safe.','a','Do not combine chemicals unless product directions or manufacturer guidance permit it.'),
      q('mcq-7-023','ch7-chemical-safety','scenario','A chemical splashes into a client’s eye. Which immediate response is best?','Begin flushing with clean water and follow label/SDS emergency directions; do not neutralize with another chemical.','Apply the opposite-pH product.','Wait for redness.','Cover the eye and finish the service.','a','Immediate flushing and product-specific emergency directions are appropriate; adding another chemical can worsen injury.')
    ],
  },
]

export interface Chapter7MicroCheckResponse {
  questionId: Chapter7MicroCheckQuestion['id']
  selectedAnswer: Chapter7MicroCheckAnswer
}

export interface Chapter7MicroCheckScore {
  correct: number
  total: number
  percent: number
}

export function scoreChapter7MicroChecks(
  responses: readonly Chapter7MicroCheckResponse[],
): Chapter7MicroCheckScore {
  const answerMap = new Map(
    chapter7MicroChecks.flatMap((check) =>
      check.questions.map((question) => [question.id, question.correctAnswer] as const),
    ),
  )
  let correct = 0
  let total = 0
  const seen = new Set<string>()
  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const expected = answerMap.get(response.questionId)
    if (!expected) continue
    seen.add(response.questionId)
    total += 1
    if (response.selectedAnswer === expected) correct += 1
  }
  return {
    correct,
    total,
    percent: total > 0 ? Math.round((correct / total) * 10000) / 100 : 0,
  }
}

export function buildChapter7MicroCheckEvidence(
  studentId: string,
  responses: readonly Chapter7MicroCheckResponse[],
  timestamp: string,
): Chapter7EvidenceRecord[] {
  const questionMap = new Map(
    chapter7MicroChecks.flatMap((check) => check.questions.map((question) => [question.id, question] as const)),
  )
  const seen = new Set<string>()
  const records: Chapter7EvidenceRecord[] = []

  for (const response of responses) {
    if (seen.has(response.questionId)) continue
    const question = questionMap.get(response.questionId)
    if (!question) continue
    seen.add(response.questionId)
    records.push({
      studentId,
      chapterId: 'ch-7',
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

export function validateChapter7MicroCheckPlacements(): boolean {
  if (chapter7MicroChecks.length !== chapter7MicroCheckPlacements.length) return false
  return chapter7MicroChecks.every((check) => {
    const placement = chapter7MicroCheckPlacements.find((item) => item.id === check.id)
    return !!placement &&
      placement.afterSectionId === check.afterSectionId &&
      placement.conceptFamilyId === check.conceptFamilyId &&
      placement.plannedQuestionCount === check.questions.length
  })
}
