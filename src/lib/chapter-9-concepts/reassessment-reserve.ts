import type { Chapter9ConceptFamilyId } from './types'
import type { Chapter9Difficulty } from './grading'

export type Chapter9ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter9ReassessmentQuestion {
  id: `r9-${string}`
  conceptFamilyId: Chapter9ConceptFamilyId
  difficulty: Exclude<Chapter9Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter9ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter9ReassessmentQuestion['id'],
  conceptFamilyId: Chapter9ConceptFamilyId,
  difficulty: Chapter9ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter9ReassessmentAnswer,
  explanation: string,
): Chapter9ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter9ReassessmentReserve: readonly Chapter9ReassessmentQuestion[] = [
  q('r9-epidermis-001','ch9-epidermis-skin-barrier','application','A superficial scrape does not bleed. Which explanation best fits the Chapter 9 skin structure model?','The epidermis has no blood vessels.','The epidermis contains sealed capillaries.','Only sweat glands can bleed.','Melanin prevents bleeding.','a','The epidermis is avascular; bleeding generally requires injury deep enough to reach vascular tissue.'),
  q('r9-epidermis-002','ch9-epidermis-skin-barrier','application','A question asks which layer continuously produces new epidermal cells and contains melanocytes. Which is best?','Stratum corneum','Stratum germinativum','Stratum lucidum','Dermis','b','The stratum germinativum is the basal layer where new epidermal cells are generated and melanocytes are found.'),
  q('r9-epidermis-003','ch9-epidermis-skin-barrier','understanding','Which statement best distinguishes the epidermis from the dermis?','The epidermis is the vascular support layer.','The epidermis is the outer avascular layer; the dermis contains vessels and support structures.','Both layers contain the same structures.','The epidermis lies beneath subcutaneous tissue.','b','The epidermis is outer and avascular; the dermis is deeper and contains vessels, nerves, glands, follicles, and connective tissue.'),
  q('r9-epidermis-004','ch9-epidermis-skin-barrier','application','Cells move upward, accumulate keratin, and become part of the protective surface. What process is being described?','Melanogenesis','Keratinization','Perspiration','Vasodilation','b','Keratinization is the maturation process by which epidermal cells become keratin-filled surface cells.'),
  q('r9-epidermis-005','ch9-epidermis-skin-barrier','scenario','A student says the outer skin barrier is supplied directly by epidermal blood vessels. What correction is most accurate?','Correct; the epidermis contains most cutaneous vessels.','Incorrect; the epidermis is nourished from deeper vascular tissue rather than containing its own blood vessels.','Correct only on the scalp.','Incorrect because skin has no blood supply.','b','The epidermis itself is avascular and depends on deeper tissue support.'),

  q('r9-dermis-001','ch9-dermis-subcutaneous-support','application','Which layer contains follicles, glands, nerves, vessels, collagen, and elastin?','Epidermis','Dermis','Stratum corneum','Acid mantle','b','Those structures are characteristic of the dermis.'),
  q('r9-dermis-002','ch9-dermis-subcutaneous-support','application','Which pairing best explains skin strength and recoil?','Collagen—strength; elastin—elasticity','Melanin—strength; keratin—recoil','Sebum—strength; sweat—elasticity','Lymph—strength; blood—recoil','a','Collagen contributes structural strength while elastin contributes elasticity.'),
  q('r9-dermis-003','ch9-dermis-subcutaneous-support','understanding','What is a major role of lymph in skin support?','Producing melanin','Moving waste and excess fluid','Creating keratin','Secreting sebum','b','Lymph helps transport waste and excess fluid away from tissues.'),
  q('r9-dermis-004','ch9-dermis-subcutaneous-support','scenario','A client feels touch and temperature at the skin surface. Which deeper support system makes that possible?','Sensory nerve fibers in the dermal region','Sebaceous glands only','Keratinized surface cells only','Melanocytes only','a','Sensory nerve structures in deeper skin support sensation.'),
  q('r9-dermis-005','ch9-dermis-subcutaneous-support','application','What best describes subcutaneous tissue in relation to the skin?','A deeper support layer containing fatty tissue beneath the dermis','The outermost epidermal layer','A gland inside the epidermis','A primary lesion','a','Subcutaneous tissue lies beneath the dermis and provides cushioning, insulation, and support.'),

  q('r9-functions-001','ch9-skin-functions-glands','application','A client perspires during a warm service. Which gland and function pairing is correct?','Sebaceous—secretion of sebum','Sudoriferous—heat regulation through sweat','Sebaceous—heat regulation through keratin','Sudoriferous—melanin production','b','Sudoriferous glands produce sweat, which contributes to heat regulation.'),
  q('r9-functions-002','ch9-skin-functions-glands','application','Oil lubricating the hair and skin is produced by which gland?','Sudoriferous','Sebaceous','Lymphatic','Endocrine','b','Sebaceous glands secrete sebum.'),
  q('r9-functions-003','ch9-skin-functions-glands','understanding','Which skin function is demonstrated when nerve endings detect pressure or temperature?','Sensation','Excretion','Secretion','Absorption','a','Sensory receptors support the skin function of sensation.'),
  q('r9-functions-004','ch9-skin-functions-glands','application','Sweat carries small amounts of waste to the surface. Which function is most directly involved?','Excretion','Pigmentation','Keratinization','Elasticity','a','Excretion is removal of certain wastes through sweat.'),
  q('r9-functions-005','ch9-skin-functions-glands','scenario','A student says sweat and sebum come from the same gland. What correction is best?','Both come from sebaceous glands.','Sebaceous glands produce sebum; sudoriferous glands produce sweat.','Both come from sudoriferous glands.','Neither is produced by skin glands.','b','Chapter 9 distinguishes sebaceous oil production from sudoriferous sweat production.'),

  q('r9-primary-001','ch9-primary-lesions','application','A flat discolored spot with no texture change is best classified as what?','Macule','Pustule','Nodule','Wheal','a','A macule is flat discoloration without a change in surface texture.'),
  q('r9-primary-002','ch9-primary-lesions','application','Which lesion is a small clear-fluid blister?','Vesicle','Papule','Macule','Nodule','a','A vesicle is a small blister containing clear fluid.'),
  q('r9-primary-003','ch9-primary-lesions','application','Which lesion is a larger fluid-filled blister?','Wheal','Bulla','Pustule','Tumor','b','A bulla is a large blister containing watery fluid.'),
  q('r9-primary-004','ch9-primary-lesions','scenario','A raised lesion contains pus. Which observation is appropriate without diagnosing its cause?','It is a pustule.','It proves a bacterial disease.','It is always harmless.','It should be opened before service.','a','Pustule is an observable lesion term; it does not establish a medical diagnosis.'),
  q('r9-primary-005','ch9-primary-lesions','application','Which distinction is most useful when comparing a papule with a pustule?','A pustule contains pus; a papule does not.','A papule is always contagious.','A pustule is always flat.','A papule always contains clear fluid.','a','Presence of pus is a key distinguishing feature of a pustule.'),

  q('r9-secondary-001','ch9-secondary-lesions','application','A primary lesion dries and forms a crust. Why is the crust secondary?','It developed from change in a preexisting lesion.','All crusts begin as tumors.','Secondary lesions are always contagious.','Crust is a gland disorder.','a','Secondary lesions arise from progression, damage, accumulation, or healing of earlier lesions.'),
  q('r9-secondary-002','ch9-secondary-lesions','application','Which secondary lesion is an open sore with loss of skin depth?','Ulcer','Macule','Wheal','Papule','a','An ulcer is an open lesion involving loss of skin depth.'),
  q('r9-secondary-003','ch9-secondary-lesions','application','A thick raised scar develops from excessive fibrous tissue after injury. Which term fits?','Keloid','Vesicle','Pustule','Macule','a','A keloid is an excessive fibrous scar.'),
  q('r9-secondary-004','ch9-secondary-lesions','scenario','An open secondary lesion lies directly in a shave path. What is the safest service decision?','Shave lightly over it.','Avoid direct service over the open area and use appropriate referral/sanitation judgment.','Diagnose the cause first.','Open the lesion to clean it.','b','Compromised open skin should not receive direct razor or tool work.'),
  q('r9-secondary-005','ch9-secondary-lesions','understanding','What best distinguishes secondary from primary lesions?','Secondary lesions reflect evolution or alteration of an existing skin problem or injury.','Secondary lesions are always larger.','Primary lesions are always infectious.','Secondary lesions occur only after shaving.','a','Secondary lesions describe changes associated with progression, damage, accumulation, or healing.'),

  q('r9-glands-001','ch9-sebaceous-sudoriferous-disorders','application','A client cannot sweat and begins overheating. What is the safest immediate barbering response?','Add more heat.','Stop heat exposure and recognize the heat-regulation risk.','Diagnose the exact gland disease.','Apply medication.','b','Absent perspiration with overheating is a safety concern; stop additional heat and stay within referral scope.'),
  q('r9-glands-002','ch9-sebaceous-sudoriferous-disorders','understanding','Which term describes deficient or absent perspiration?','Hyperhidrosis','Anhidrosis','Seborrhea','Rosacea','b','Anhidrosis means deficient or absent perspiration.'),
  q('r9-glands-003','ch9-sebaceous-sudoriferous-disorders','understanding','Which term describes excessive perspiration?','Hyperhidrosis','Anhidrosis','Keratoma','Comedo','a','Hyperhidrosis refers to excessive perspiration.'),
  q('r9-glands-004','ch9-sebaceous-sudoriferous-disorders','application','Which statement best distinguishes a sebaceous cyst from a steatoma in the hardened Chapter 9 content?','They are interchangeable.','A sebaceous cyst is sebum-related; a steatoma is a subcutaneous fatty tumor.','A steatoma is always an infected cyst.','Both are sweat-gland disorders.','b','The hardened Chapter 9 content treats them as distinct conditions.'),
  q('r9-glands-005','ch9-sebaceous-sudoriferous-disorders','application','Why can inability to perspire be more than a cosmetic observation?','It may impair normal heat regulation.','It always proves infection.','It causes melanin loss.','It guarantees dehydration.','a','Sweating is part of heat regulation, so absent perspiration can become a safety concern.'),

  q('r9-inflammatory-001','ch9-inflammatory-infectious-conditions','scenario','An active cold sore is in the facial shave area. What is the best decision?','Shave over it with gloves.','Pause direct service over the active lesion and follow sanitation/referral guidance.','Diagnose the viral strain.','Apply medication and continue.','b','Active herpes lesions are contagious; direct service should be avoided without diagnosing or treating.'),
  q('r9-inflammatory-002','ch9-inflammatory-infectious-conditions','application','Which statement about psoriasis best matches Chapter 9?','It is noncontagious and affected skin should be handled gently.','It is always contagious.','It should be scraped away before service.','It should be medically graded by the barber.','a','Psoriasis is presented as chronic and noncontagious; barbering should focus on gentle service judgment.'),
  q('r9-inflammatory-003','ch9-inflammatory-infectious-conditions','scenario','A condition appears inflamed, but the barber cannot determine its cause. What is the best scope decision?','Assign the most likely diagnosis.','Describe observable signs, avoid unsafe service if needed, and refer when appropriate.','Recommend prescription treatment.','Ignore it and proceed.','b','Observation and safe service decisions are within scope; medical diagnosis and prescribing are not.'),
  q('r9-inflammatory-004','ch9-inflammatory-infectious-conditions','application','Which finding most strongly changes service planning because of transmission risk?','An active contagious lesion in the direct service area','A healed flat scar','Normal skin texture','A stable freckle','a','Active potentially contagious lesions require stronger infection-control and service decisions.'),
  q('r9-inflammatory-005','ch9-inflammatory-infectious-conditions','scenario','A client asks whether a visible rash is definitely infectious. What should the barber do?','Confirm the diagnosis from appearance.','Explain observable concerns and service implications without diagnosing; refer if needed.','Prescribe a topical product.','Test the lesion during the service.','b','Barbers should not make medical diagnoses from appearance.'),

  q('r9-pigment-001','ch9-pigmentation-hypertrophies','application','A lighter patch has reduced pigment compared with surrounding skin. Which term fits?','Hyperpigmentation','Hypopigmentation','Keratoma','Verruca','b','Hypopigmentation means decreased pigment.'),
  q('r9-pigment-002','ch9-pigmentation-hypertrophies','application','A darker area contains more pigment than surrounding skin. Which term fits?','Hypopigmentation','Hyperpigmentation','Anhidrosis','Keloid','b','Hyperpigmentation means increased pigment.'),
  q('r9-pigment-003','ch9-pigmentation-hypertrophies','application','A thickened area develops from repeated pressure or friction. Which term best fits?','Keratoma','Macule','Vesicle','Ulcer','a','A keratoma is a thickening commonly associated with pressure or friction.'),
  q('r9-pigment-004','ch9-pigmentation-hypertrophies','scenario','A wart-like infectious growth sits directly in the razor path. What is the best decision?','Shave through it carefully.','Avoid traumatizing or directly servicing it and recommend qualified evaluation if treatment/removal is needed.','Remove it with a sharp tool.','Diagnose the exact viral strain.','b','An infectious growth should not be traumatized or removed by the barber.'),
  q('r9-pigment-005','ch9-pigmentation-hypertrophies','understanding','Why does removing surface callus tissue not address the underlying cause?','Continued pressure or friction can recreate the thickening.','Calluses are always viral.','Pigment causes all calluses.','Calluses are fluid-filled lesions.','a','A callus is a protective thickening that tends to recur if pressure or friction continues.'),

  q('r9-cancer-001','ch9-skin-cancer-recognition','application','A mole changes shape and color over time. Which ABCDE feature most directly captures the change over time?','Asymmetry','Border','Diameter','Evolution','d','Evolution refers to change over time.'),
  q('r9-cancer-002','ch9-skin-cancer-recognition','understanding','Which statement best matches the hardened Chapter 9 qualitative comparison?','Basal cell is most common/least severe; squamous is more serious; melanoma is least common/most dangerous.','Melanoma is most common and least severe.','All three have identical risk.','Squamous never spreads.','a','The hardened content uses qualitative distinctions rather than unsupported prevalence statistics.'),
  q('r9-cancer-003','ch9-skin-cancer-recognition','scenario','A changing lesion shows several ABCDE warning signs. What should the barber conclude?','The lesion is definitely melanoma.','The changes warrant qualified medical evaluation, but ABCDE is an observation guide rather than a diagnosis.','The lesion is harmless if painless.','The barber should recommend a medication.','b','ABCDE supports recognition and referral, not diagnosis.'),
  q('r9-cancer-004','ch9-skin-cancer-recognition','application','Which ABCDE feature refers to irregular or poorly defined edges?','Asymmetry','Border','Color','Evolution','b','Border refers to edge irregularity.'),
  q('r9-cancer-005','ch9-skin-cancer-recognition','application','Which professional action best follows recognition of a concerning changing lesion in the service area?','Describe the observation, avoid unsafe direct service, and recommend qualified evaluation.','Name the likely cancer type.','Remove the lesion before service.','Guarantee it is benign if small.','a','Recognition should lead to safe service judgment and referral without diagnosis.'),

  q('r9-safety-001','ch9-service-safety-referral','scenario','A changing lesion lies directly where a razor would pass. What is the best response?','Diagnose it first.','Describe the change, pause unsafe direct service, and recommend qualified evaluation.','Ignore it unless it bleeds.','Apply medication.','b','Barber scope supports observation, safe service decisions, and referral—not diagnosis or treatment.'),
  q('r9-safety-002','ch9-service-safety-referral','scenario','An open draining lesion is in the planned service area. What is the safest action?','Work around it with extra pressure.','Avoid direct service, follow sanitation requirements, and refer when appropriate.','Open it further to clean it.','Diagnose the infection.','b','Open or draining areas require service-safety and sanitation decisions without medical diagnosis.'),
  q('r9-safety-003','ch9-service-safety-referral','application','Which statement best defines the barber-versus-medical boundary?','A barber may describe observable signs and service implications but may not diagnose, prescribe, or medically treat.','Client consent permits diagnosis.','A barber may prescribe nonprescription medicine.','Only cancer-related observations require scope limits.','a','Observation and safe service decisions are within barber scope; medical diagnosis and treatment are not.'),
  q('r9-safety-004','ch9-service-safety-referral','scenario','A client asks what medication to use for an unfamiliar lesion. What should the barber do?','Recommend a medication based on appearance.','Stay within scope, explain the service concern, and recommend qualified evaluation.','Open the lesion to inspect it.','Guarantee it is not serious.','b','Medication advice for an unknown medical condition is outside barber scope.'),
  q('r9-safety-005','ch9-service-safety-referral','scenario','A student sees a potentially infectious lesion but says gloves make direct service automatically safe. What is the best correction?','Gloves eliminate every transmission risk.','PPE does not override the need to avoid unsafe direct contact, follow sanitation procedures, and refer when appropriate.','Only bare hands create risk.','Diagnosis is required before stopping service.','b','PPE is one control; it does not make direct service over a potentially infectious lesion automatically appropriate.'),
]

export function getChapter9ReassessmentReserve(
  conceptFamilyId: Chapter9ConceptFamilyId,
): readonly Chapter9ReassessmentQuestion[] {
  return chapter9ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
