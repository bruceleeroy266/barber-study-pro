import type { Chapter10ConceptFamilyId } from './types'
import type { Chapter10Difficulty } from './grading'

export type Chapter10ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter10ReassessmentQuestion {
  id: `r10-${string}`
  conceptFamilyId: Chapter10ConceptFamilyId
  difficulty: Exclude<Chapter10Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter10ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter10ReassessmentQuestion['id'],
  conceptFamilyId: Chapter10ConceptFamilyId,
  difficulty: Chapter10ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter10ReassessmentAnswer,
  explanation: string,
): Chapter10ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter10ReassessmentReserve: readonly Chapter10ReassessmentQuestion[] = [
  q('r10-anatomy-001','ch10-hair-anatomy-structure','application','A question asks for the shaft layer that protects the inner hair and consists of overlapping scales. Which layer is it?','Cuticle','Cortex','Medulla','Dermal papilla','a','The cuticle is the outer protective layer made of overlapping scales.'),
  q('r10-anatomy-002','ch10-hair-anatomy-structure','application','Which shaft layer contains most of the hair weight, pigment, and much of its strength and elasticity?','Medulla','Cortex','Cuticle','Hair bulb','b','The cortex is the middle layer and contains most of the hair weight, pigment, strength, and elasticity.'),
  q('r10-anatomy-003','ch10-hair-anatomy-structure','understanding','Which statement about the medulla is supported by Chapter 10?','It is the outer protective layer.','It may be absent in fine or blond hair.','It supplies blood to the follicle.','It produces sebum.','b','The medulla is the innermost layer and may be absent in fine or blond hair.'),
  q('r10-anatomy-004','ch10-hair-anatomy-structure','scenario','A student identifies the structure at the base of the follicle that supplies blood and nerve support. Which structure is correct?','Arrector pili','Sebaceous gland','Dermal papilla','Cuticle','c','The dermal papilla provides blood and nerve supply associated with hair growth.'),
  q('r10-anatomy-005','ch10-hair-anatomy-structure','application','Which root-associated structure contracts to produce goose bumps?','Arrector pili','Dermal papilla','Medulla','Cuticle','a','The arrector pili muscle contracts and produces goose bumps.'),

  q('r10-chemistry-001','ch10-hair-chemistry-bonds','application','Water temporarily changes the hair shape during wet setting. Which side bond is primarily involved?','Disulfide','Hydrogen','Peptide','Melanin','b','Hydrogen bonds are weak physical side bonds broken by water or heat and re-form as hair dries.'),
  q('r10-chemistry-002','ch10-hair-chemistry-bonds','application','A pH change affects which weak physical side bond?','Salt','Disulfide','Peptide','Keratin','a','Salt bonds are weak physical side bonds affected by changes in pH.'),
  q('r10-chemistry-003','ch10-hair-chemistry-bonds','scenario','A permanent wave breaks a strong chemical side bond and neutralization reforms it. Which bond is involved?','Hydrogen','Salt','Disulfide','Peptide','c','Permanent waving breaks disulfide bonds and neutralization reforms them.'),
  q('r10-chemistry-004','ch10-hair-chemistry-bonds','understanding','What do peptide bonds do in hair protein structure?','Join amino acids into polypeptide chains','Create pigment','Measure porosity','Produce sebum','a','Peptide bonds join amino acids into polypeptide chains.'),
  q('r10-chemistry-005','ch10-hair-chemistry-bonds','application','Which COHNS element is associated with disulfide side bonds?','Oxygen','Sulfur','Hydrogen','Nitrogen','b','Sulfur is associated with strong disulfide side bonds.'),

  q('r10-pigment-001','ch10-pigment-wave-growth-patterns','understanding','Which pigment pairing is correct?','Eumelanin—brown/black; pheomelanin—red/ginger/yellow','Eumelanin—red/yellow; pheomelanin—brown/black','Both produce only gray','Neither contributes to hair color','a','Eumelanin is associated with brown/black tones and pheomelanin with red/ginger/yellow tones.'),
  q('r10-pigment-002','ch10-pigment-wave-growth-patterns','application','Hair turns gray as pigment becomes absent or reduced. What does Chapter 10 describe replacing pigment?','Sebum','Air spaces','Blood vessels','Peptide bonds','b','Gray hair is described as lacking pigment, with air spaces replacing pigment.'),
  q('r10-pigment-003','ch10-pigment-wave-growth-patterns','application','Which cross section is associated with straight hair?','Round','Elliptical','Flat','Triangular','a','Chapter 10 associates a round cross section with straight hair.'),
  q('r10-pigment-004','ch10-pigment-wave-growth-patterns','application','Which cross section is associated with extremely curly hair?','Round','Elliptical','Perfectly square','No cross section pattern','b','Chapter 10 associates an elliptical cross section with extremely curly hair.'),
  q('r10-pigment-005','ch10-pigment-wave-growth-patterns','scenario','A barber plans around a cowlick. What kind of Chapter 10 concept is being considered?','Natural growth pattern','Hair-loss disorder','Parasitic condition','Porosity level','a','Cowlicks are natural hair-growth patterns.'),

  q('r10-growth-001','ch10-growth-cycle-hair-types','understanding','Which phase is active growth lasting about 2–10 years?','Anagen','Catagen','Telogen','Canities','a','Anagen is the active growth phase lasting about 2–10 years.'),
  q('r10-growth-002','ch10-growth-cycle-hair-types','application','The follicle shrinks and active growth stops before the resting phase. Which phase is this?','Telogen','Catagen','Anagen','Pityriasis','b','Catagen is the transition phase in which the follicle shrinks and active growth stops.'),
  q('r10-growth-003','ch10-growth-cycle-hair-types','understanding','Which statement about telogen is supported?','It lasts about 3–6 months and includes less than 10% of scalp hair.','It is the 2–10 year active-growth phase.','It is the pigment-production phase.','It is a contagious scalp condition.','a','Telogen is the resting/shedding phase lasting about 3–6 months and includes less than 10% of scalp hair.'),
  q('r10-growth-004','ch10-growth-cycle-hair-types','scenario','A client reports shedding about 90 hairs in a day. Which source fact is most relevant?','Normal shedding is about 75–100 hairs per day.','Any shedding proves alopecia.','Normal shedding is under 10 hairs per day.','Shedding occurs only in anagen.','a','Chapter 10 gives normal shedding as about 75–100 hairs per day.'),
  q('r10-growth-005','ch10-growth-cycle-hair-types','application','What average scalp-hair growth rate does Chapter 10 give?','About 1/2 inch per month','About 2 inches per week','About 1 inch per day','No average is given','a','The source record gives average scalp-hair growth as about one-half inch per month.'),

  q('r10-analysis-001','ch10-analysis-properties','scenario','Wet hair breaks instead of stretching and returning. Which property is poor?','Elasticity','Density','Pigment','Growth rate','a','Poor elasticity means hair breaks easily or fails to return after stretching.'),
  q('r10-analysis-002','ch10-analysis-properties','application','Dry strands feel rough when slid toward the scalp. Which property is being evaluated?','Porosity','Density','Wave pattern','Growth cycle','a','The tactile slide test is used to assess porosity.'),
  q('r10-analysis-003','ch10-analysis-properties','understanding','Which hair texture has the smallest diameter and is generally more fragile?','Coarse','Medium','Fine','Dense','c','Fine hair has the smallest diameter and is generally more fragile.'),
  q('r10-analysis-004','ch10-analysis-properties','application','What does hair density measure?','Hairs per square inch','Hair-shaft diameter','Moisture absorption','Stretch and return','a','Density describes the number of hairs per square inch.'),
  q('r10-analysis-005','ch10-analysis-properties','scenario','Before a chemical service, which scalp finding means the chemical service should not proceed?','Natural cowlick','Irritation or abrasions','Medium density','Round cross section','b','Chapter 10 states that chemical services should not proceed when irritation or abrasions are present.'),

  q('r10-alopecia-001','ch10-alopecia-hair-loss','application','Complete scalp hair loss with body hair remaining best matches which term?','Alopecia totalis','Alopecia universalis','Androgenic alopecia','Canities','a','Alopecia totalis means complete scalp hair loss.'),
  q('r10-alopecia-002','ch10-alopecia-hair-loss','application','Complete body hair loss best matches which term?','Alopecia areata','Alopecia universalis','Alopecia totalis','Pityriasis','b','Alopecia universalis means complete body hair loss.'),
  q('r10-alopecia-003','ch10-alopecia-hair-loss','scenario','Sudden round bald patches that may progress to totalis best match which condition?','Alopecia areata','Androgenic alopecia','Canities','Monilethrix','a','Chapter 10 describes alopecia areata as autoimmune hair loss with sudden bald patches that may progress to totalis.'),
  q('r10-alopecia-004','ch10-alopecia-hair-loss','understanding','Which factors does Chapter 10 associate with androgenic alopecia?','Heredity, age, and hormonal factors','Parasites only','Porosity and elasticity','Tinea and scabies','a','The source record associates androgenic alopecia with heredity, age, and hormonal factors.'),
  q('r10-alopecia-005','ch10-alopecia-hair-loss','scenario','A barber notices hair loss that seems unusual. Which response stays within scope?','Observe and communicate without diagnosing; recommend qualified evaluation when appropriate','Diagnose the type of alopecia','Prescribe treatment','Guarantee regrowth','a','The barber role is observation, communication, safe service decisions, and referral rather than diagnosis or prescribing.'),

  q('r10-shaft-001','ch10-hair-shaft-disorders','application','Splitting at the ends of the hair shaft is called what?','Trichoptilosis','Monilethrix','Canities','Pityriasis','a','Trichoptilosis is split ends.'),
  q('r10-shaft-002','ch10-hair-shaft-disorders','application','A beaded hair shaft that breaks easily best matches which disorder?','Canities','Monilethrix','Tinea capitis','Alopecia totalis','b','Monilethrix is described as beaded hair that breaks easily.'),
  q('r10-shaft-003','ch10-hair-shaft-disorders','understanding','Which disorder is characterized by brittle, nodular hair?','Trichorrhexis nodosa','Pediculosis','Scabies','Canities','a','Trichorrhexis nodosa is a brittle nodular hair-shaft disorder.'),
  q('r10-shaft-004','ch10-hair-shaft-disorders','application','Alternating gray and pigmented bands along the strand best match which condition?','Ringed hair','Hypertrichosis','Tinea barbae','Pityriasis steatoides','a','Ringed hair shows alternating gray and pigmented bands.'),
  q('r10-shaft-005','ch10-hair-shaft-disorders','understanding','Which condition means abnormal terminal hair growth in unusual areas?','Hypertrichosis','Canities','Trichoptilosis','Monilethrix','a','Hypertrichosis is abnormal terminal hair growth in unusual areas.'),

  q('r10-infectious-001','ch10-infectious-parasitic-scalp','scenario','Severe scalp itching with nits attached to hair strands best matches which condition?','Pediculosis capitis','Pityriasis','Canities','Trichoptilosis','a','Pediculosis capitis is head-lice infestation with itching and nits attached to hair strands.'),
  q('r10-infectious-002','ch10-infectious-parasitic-scalp','scenario','Intense itching with a suspected mite infestation best matches which condition?','Scabies','Tinea favosa','Canities','Monilethrix','a','Scabies is a contagious parasitic condition caused by mites.'),
  q('r10-infectious-003','ch10-infectious-parasitic-scalp','application','Which tinea condition is ringworm of the scalp?','Tinea capitis','Tinea barbae','Tinea favosa','Pseudofolliculitis barbae','a','Tinea capitis is ringworm of the scalp.'),
  q('r10-infectious-004','ch10-infectious-parasitic-scalp','scenario','Dry sulfur-yellow honeycomb-like crusts with a musty odor best match which tinea condition?','Tinea barbae','Tinea favosa','Tinea capitis','Pityriasis simplex','b','Tinea favosa is described with dry sulfur-yellow honeycomb-like crusts and a musty odor.'),
  q('r10-infectious-005','ch10-infectious-parasitic-scalp','application','Which condition is associated with ingrown hairs and chronic inflammation rather than a fungal infection?','Pseudofolliculitis barbae','Tinea capitis','Pediculosis capitis','Scabies','a','Pseudofolliculitis barbae is associated with ingrown hairs and chronic inflammation.'),

  q('r10-safety-001','ch10-service-safety-referral','scenario','Live head lice are found before service. What should the barber do?','Do not begin the service; follow cleaning/disinfection and referral guidance','Continue with disposable tools','Shampoo and continue','Diagnose the infestation first','a','Chapter 10 states that service should not begin when parasites are present.'),
  q('r10-safety-002','ch10-service-safety-referral','scenario','A barber suspects tinea during scalp analysis. Which response fits Chapter 10?','Apply antifungal treatment','Continue if there is no pain','Avoid the affected service and refer to a physician','Shave the area and disinfect afterward','c','Tinea is contagious and the source record directs physician referral rather than barber treatment.'),
  q('r10-safety-003','ch10-service-safety-referral','scenario','Irritation or abrasions are present before a chemical service. What should happen?','Proceed with reduced processing time','Do not proceed with the chemical service','Continue after client consent','Cover the area and continue','b','Chemical services should not proceed when irritation or abrasions are present.'),
  q('r10-safety-004','ch10-service-safety-referral','application','Which response stays within barbering scope when an unusual scalp condition is observed?','Assign a diagnosis','Recommend a prescription','Describe observable signs, make a safe service decision, and refer when appropriate','Treat the condition before service','c','Chapter 10 keeps the barber role within observation, service safety, sanitation, communication, and referral.'),
  q('r10-safety-005','ch10-service-safety-referral','scenario','A contagious or parasitic condition is suspected in the service area. Which combined response is most appropriate?','Continue service and clean afterward','Avoid the affected service, follow sanitation procedures, and use referral guidance without diagnosing','Diagnose the condition and recommend medication','Ignore it unless the client reports pain','b','The Chapter 10 safety boundary combines service avoidance, sanitation, referral, and no diagnosis/treatment overreach.'),
]

export function getChapter10ReassessmentReserve(
  conceptFamilyId: Chapter10ConceptFamilyId,
): readonly Chapter10ReassessmentQuestion[] {
  return chapter10ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
