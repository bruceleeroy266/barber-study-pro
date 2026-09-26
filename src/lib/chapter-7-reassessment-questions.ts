/**
 * Chapter 7 Reassessment Reserve (C7-9)
 *
 * 150 unseen questions: 15 per canonical concept family.
 * The initial qq-7-001..050 assessment bank is never reused for formal
 * remediation knowledge checks. Five questions per cycle × three cycles =
 * 15-question reserve capacity per family.
 */

import type { QuizQuestion } from '@/types'

type Fact = {
  cue: string
  correct: string
  distractors: [string, string, string]
}

type Family = {
  facts: readonly Fact[]
}

const families: readonly Family[] = [
  {
    facts: [
      { cue:'organic versus inorganic classification', correct:'Classify by chemical composition rather than living origin or flammability.', distractors:['Anything from a plant is automatically safe and organic.','Anything inorganic cannot burn or irritate tissue.','Professional use determines whether a substance is organic.'] },
      { cue:'carbon-containing substances', correct:'Organic chemistry focuses on carbon-containing substances and compounds.', distractors:['Organic chemistry includes only natural ingredients.','Organic chemistry excludes synthetic carbon compounds.','Organic chemistry is defined by product fragrance.'] },
      { cue:'water and mineral salts', correct:'Water and many mineral salts are important inorganic substances.', distractors:['Water is organic because hair contains water.','Mineral salts are organic if used in cosmetics.','Water and salts cannot participate in product chemistry.'] },
      { cue:'hazard from classification alone', correct:'Organic or inorganic classification alone does not establish hazard.', distractors:['All organic products are more hazardous.','All inorganic products are safer.','Classification alone determines required PPE.'] },
      { cue:'safe product comparison', correct:'Use the label, concentration, pH, ingredients, and exposure guidance to compare risk.', distractors:['Use organic/inorganic labels as the only safety test.','Choose the product with the stronger fragrance.','Assume equal risk whenever products share a color.'] },
    ],
  },
  {
    facts: [
      { cue:'matter', correct:'Matter has mass and occupies space.', distractors:['Matter includes only visible solids.','Matter must react chemically to exist.','Matter excludes gases.'] },
      { cue:'element', correct:'An element is made of one type of atom.', distractors:['An element is any physical mixture.','An element contains different atoms in fixed proportions.','An element is a suspension that does not settle.'] },
      { cue:'compound', correct:'A compound contains different elements chemically joined in definite proportions.', distractors:['A compound is any variable physical mixture.','A compound contains only one type of atom.','A compound forms only when a product is alkaline.'] },
      { cue:'molecule', correct:'A molecule contains two or more chemically joined atoms.', distractors:['A molecule must contain different elements.','A molecule is always a mixture.','A molecule is a physical state of matter.'] },
      { cue:'pure substance versus mixture', correct:'A pure substance has fixed composition; a mixture can vary in composition.', distractors:['A mixture always has fixed composition.','A pure substance must contain several ingredients.','Mixtures require a chemical reaction to form.'] },
    ],
  },
  {
    facts: [
      { cue:'physical property', correct:'A physical property can be observed without changing chemical identity.', distractors:['A physical property always creates a new substance.','Physical properties exist only in solids.','A physical property is defined by reversibility alone.'] },
      { cue:'chemical property', correct:'A chemical property describes how a substance behaves during chemical reaction.', distractors:['A chemical property is only color or texture.','A chemical property cannot involve another substance.','Chemical properties are the same as physical states.'] },
      { cue:'physical change', correct:'A physical change alters form or state without creating a new chemical substance.', distractors:['A physical change always changes composition.','A physical change is defined only by being reversible.','Any temperature change proves a chemical change.'] },
      { cue:'chemical change', correct:'A chemical change alters chemical composition through a reaction.', distractors:['A chemical change means only a visible color change.','Chemical changes are identified solely by permanence.','Chemical changes never involve energy.'] },
      { cue:'melting versus oxidation color', correct:'Melting is physical while oxidation haircolor development is chemical.', distractors:['Both are physical because appearance changes.','Both are chemical because energy is involved.','Melting is chemical and oxidation haircolor is physical.'] },
    ],
  },
  {
    facts: [
      { cue:'oxidation', correct:'Oxidation can involve gain of oxygen or loss of hydrogen.', distractors:['Oxidation is loss of oxygen or gain of hydrogen.','Oxidation always means lowering pH.','Oxidation is the same as dissolving a solid.'] },
      { cue:'reduction', correct:'Reduction can involve loss of oxygen or gain of hydrogen.', distractors:['Reduction is gain of oxygen or loss of hydrogen.','Reduction is identical to acid-alkali neutralization.','Reduction always releases heat.'] },
      { cue:'redox pairing', correct:'Oxidation and reduction occur together in a redox reaction.', distractors:['Oxidation occurs without any paired process.','Reduction and oxidation cannot occur in one service.','Redox means only a pH change.'] },
      { cue:'permanent-wave chemistry', correct:'Reduction changes disulfide bonds first; oxidation helps reform them in the new shape.', distractors:['Oxidation breaks bonds first and acid neutralization reforms them.','Only reduction occurs during the whole service.','Permanent waving is only a physical change.'] },
      { cue:'unexpected heat', correct:'Unexpected or excessive heat requires stopping and following product safety directions.', distractors:['Continue because all reaction heat is normal.','Add water automatically to every formula.','Cover the product to intensify the heat.'] },
    ],
  },
  {
    facts: [
      { cue:'solution', correct:'A solution is stable and uniform, with dissolved material that does not settle out.', distractors:['A solution must always be clear.','A solution is defined by visible settling.','A solution always contains oil droplets.'] },
      { cue:'suspension', correct:'A suspension can contain dispersed particles that settle over time.', distractors:['A suspension is always uniform and never settles.','A suspension is a pure compound.','Any product labeled shake well must be a suspension.'] },
      { cue:'emulsion', correct:'An emulsion disperses one normally immiscible liquid through another with help from an emulsifier or surfactant.', distractors:['An emulsion is only a dissolved salt solution.','An emulsion contains no continuous phase.','Emulsions require no stabilizing ingredient.'] },
      { cue:'oil-in-water', correct:'In an oil-in-water emulsion, water is continuous and oil is dispersed.', distractors:['Oil is always the continuous phase.','Both liquids become one pure substance.','The dispersed phase must be a solid.'] },
      { cue:'surfactant function', correct:'A surfactant lowers surface tension and helps water interact with oily soil.', distractors:['A surfactant functions primarily as a styptic.','A surfactant raises surface tension to trap oil.','A surfactant is the same as a mineral deposit.'] },
    ],
  },
  {
    facts: [
      { cue:'standard pH scale', correct:'Below 7 is acidic, 7 is neutral, and above 7 is alkaline.', distractors:['Below 7 is alkaline and above 7 is acidic.','Only pH 4.5–5.5 is meaningful.','pH measures product thickness.'] },
      { cue:'hair and skin pH', correct:'Hair and skin are commonly associated with a slightly acidic range around 4.5–5.5.', distractors:['Hair and skin are always exactly pH 7.','Hair and skin are normally strongly alkaline.','Their pH never varies with conditions.'] },
      { cue:'alkaline effect on hair', correct:'Increasing alkalinity can swell hair and increase porosity as the cuticle opens.', distractors:['Alkalinity always contracts and hardens hair.','Alkalinity automatically neutralizes every service.','Alkalinity has no effect on hair structure.'] },
      { cue:'acid-alkali neutralization', correct:'An acid and alkali can react to form water and a salt.', distractors:['Acid-alkali neutralization is identical to permanent-wave oxidation neutralization.','Neutralization always means pH 7 hair.','Neutralization is a physical state change only.'] },
      { cue:'strong pH extremes', correct:'Very strong acids and very strong alkalis can severely damage hair.', distractors:['Only alkalis can damage hair.','Any acid is safe because hair is slightly acidic.','pH makes label directions unnecessary.'] },
    ],
  },
  {
    facts: [
      { cue:'shampoo purpose', correct:'Shampoo primarily cleanses hair and scalp by helping remove oil, soil, debris, and buildup.', distractors:['Shampoo permanently changes natural texture.','Shampoo replaces all conditioners.','Shampoo is primarily an implement disinfectant.'] },
      { cue:'clarifying or chelating use', correct:'Consider clarifying or chelating products when actual buildup is present and match frequency to condition and directions.', distractors:['Use clarifying shampoo daily whenever buildup once existed.','Use medicated shampoo for all mineral buildup.','All shampoos remove buildup equally.'] },
      { cue:'sulfate-free selection', correct:'A sulfate-free or gentler formula may fit when a less-stripping cleansing approach is appropriate.', distractors:['Sulfate-free automatically means best for every client.','Sulfate-free products cannot cleanse.','Only alkaline shampoo can cleanse color-treated hair.'] },
      { cue:'dry or powder shampoo', correct:'Dry or powder shampoo can be considered when a wet shampoo is not appropriate or practical.', distractors:['Dry shampoo replaces all wet cleansing permanently.','Dry shampoo is a permanent-wave neutralizer.','Dry shampoo is a styptic product.'] },
      { cue:'balancing cleanser after chemical service', correct:'Use a balancing or neutralizing cleanser only when the specific product system directs it, and do not confuse it with permanent-wave oxidation neutralization.', distractors:['Any neutralizing shampoo replaces a permanent-wave neutralizer.','Every chemical service requires the same balancing cleanser.','Balancing cleansers make pH irrelevant.'] },
    ],
  },
  {
    facts: [
      { cue:'conditioner categories', correct:'Chapter 7 includes instant/rinse-out, treatment/repair, and leave-in conditioner categories.', distractors:['The categories are organic, inorganic, and elemental.','The categories are acid, base, and salt only.','The categories are solution, suspension, and gas.'] },
      { cue:'instant conditioner', correct:'An instant/rinse-out conditioner is used briefly and rinsed according to directions.', distractors:['It must remain on the hair indefinitely.','It is a dry shampoo.','It permanently changes disulfide bonds.'] },
      { cue:'acidic conditioner', correct:'An acidic conditioner formula can help contract and smooth the hair surface depending on formula and condition.', distractors:['Any acidic conditioner dissolves the cuticle.','Acidic conditioner permanently reforms disulfide bonds.','Acidic conditioner always works identically on all hair.'] },
      { cue:'ingredient interpretation', correct:'Evaluate the whole conditioner formula and hair condition instead of treating one ingredient as a universal guarantee.', distractors:['Any protein repairs all hair damage.','Every silicone guarantees heat protection.','All conditioners have identical effects.'] },
      { cue:'conditioner selection', correct:'Select conditioner type by hair condition, service goal, formula, and directions.', distractors:['Choose only by fragrance.','Always choose the product with the lowest pH.','Use the same conditioner for every client.'] },
    ],
  },
  {
    facts: [
      { cue:'USP terminology', correct:'USP refers to recognized standards for identity, strength, quality, or purity of certain ingredients and preparations.', distractors:['USP guarantees a product is right for every client.','USP requires all products to have pH 7.','USP means the ingredient is organic.'] },
      { cue:'glycerin', correct:'Glycerin is commonly used as a humectant to help attract and retain moisture.', distractors:['Glycerin is primarily an oxidizing agent.','Glycerin is a styptic salt.','Glycerin is a chelating mineral.'] },
      { cue:'alkanolamines', correct:'Alkanolamines are alkaline ingredients used in some formulations to adjust pH or neutralize acids.', distractors:['Alkanolamines are always surfactants.','Alkanolamines are pigments only.','Alkanolamines make label directions unnecessary.'] },
      { cue:'petrolatum', correct:'Petrolatum is an oily protective ingredient used in some creams, ointments, pomades, and barrier preparations.', distractors:['Petrolatum is an oxidizer used to develop haircolor.','Petrolatum is a reducing agent for permanent waving.','Petrolatum is a mineral-removing chelator.'] },
      { cue:'product preparation selection', correct:'Select styling aids, massage creams, astringents, or moisturizers by intended purpose, client condition, formula, and directions.', distractors:['Choose by strongest fragrance.','Choose the highest-pH product regardless of purpose.','Organic labeling alone proves suitability.'] },
    ],
  },
  {
    facts: [
      { cue:'unfamiliar chemical product', correct:'Prioritize the product label, manufacturer directions, and SDS when applicable.', distractors:['Rely on social-media instructions.','Use container color as the safety guide.','Apply rules from an unrelated product.'] },
      { cue:'mixing chemicals', correct:'Do not mix products unless the label or manufacturer guidance permits it.', distractors:['Small amounts can always be mixed safely.','Matching colors prove compatibility.','Adding water makes any combination safe.'] },
      { cue:'pre-service testing', correct:'Determine required testing and timing from the product label, manufacturer directions, and applicable rules.', distractors:['Use the same patch test and timing for every chemical service.','Skip testing after prior product use.','Choose the test from product fragrance.'] },
      { cue:'eye exposure', correct:'Begin flushing with clean water and follow label or SDS emergency directions; do not neutralize with another chemical.', distractors:['Apply an opposite-pH chemical to the eye.','Wait for visible redness before acting.','Cover the eye and finish the service.'] },
      { cue:'PPE and ventilation', correct:'Use the PPE and ventilation specified for the product and service.', distractors:['Experience allows PPE to be skipped.','One PPE item replaces all others.','Increase processing time to compensate for ventilation.'] },
    ],
  },
]

function rotateAnswers(correct: string, distractors: readonly string[], index: number) {
  const position = index % 4
  const answers = [...distractors]
  answers.splice(position, 0, correct)
  return { answers, correct: ['a', 'b', 'c', 'd'][position] as 'a' | 'b' | 'c' | 'd' }
}

const stems = [
  (cue: string) => `Which statement BEST applies to ${cue}?`,
  (cue: string) => `A student is reviewing ${cue}. Which correction is MOST accurate?`,
  (cue: string) => `On an exam-style item about ${cue}, which choice should remain after eliminating the inaccurate options?`,
]

const questions: QuizQuestion[] = []
let sequence = 51

for (const family of families) {
  for (let variant = 0; variant < 3; variant++) {
    for (const fact of family.facts) {
      const { answers, correct } = rotateAnswers(fact.correct, fact.distractors, sequence)
      questions.push({
        id: `qq-7-${String(sequence).padStart(3, '0')}`,
        quiz_id: 'quiz-7',
        question: stems[variant](fact.cue),
        answer_a: answers[0],
        answer_b: answers[1],
        answer_c: answers[2],
        answer_d: answers[3],
        correct_answer: correct,
        explanation: `Read carefully. Identify the keyword or service condition. Eliminate choices that conflict with Chapter 7 chemistry or product-safety logic. Apply the safest supported procedure, then choose the best remaining answer: ${fact.correct}`,
        difficulty: 'hard',
        order_index: sequence,
      })
      sequence++
    }
  }
}

export const chapter7ReassessmentQuestions: QuizQuestion[] = questions

if (chapter7ReassessmentQuestions.length !== 150) {
  throw new Error(`Chapter 7 reassessment reserve must contain 150 questions; got ${chapter7ReassessmentQuestions.length}`)
}
