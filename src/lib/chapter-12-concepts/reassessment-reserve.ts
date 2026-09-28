import type { Chapter12ConceptFamilyId } from './types'
import type { Chapter12Difficulty } from './grading'

export type Chapter12ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter12ReassessmentQuestion {
  id: `r12-${string}`
  conceptFamilyId: Chapter12ConceptFamilyId
  difficulty: Exclude<Chapter12Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter12ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter12ReassessmentQuestion['id'],
  conceptFamilyId: Chapter12ConceptFamilyId,
  difficulty: Chapter12ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter12ReassessmentAnswer,
  explanation: string,
): Chapter12ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter12ReassessmentReserve: readonly Chapter12ReassessmentQuestion[] = [
  q('r12-anatomy-001','ch12-facial-anatomy-neurovascular','understanding','Which muscle is a major muscle of mastication?','Frontalis','Masseter','Orbicularis oculi','Trapezius','b','The masseter is a major chewing muscle.'),
  q('r12-anatomy-002','ch12-facial-anatomy-neurovascular','application','Which structures return blood from the head, face, and neck toward the heart?','Carotid arteries','Facial muscles','Internal and external jugular veins','Cranial nerves','c','The jugular veins are major venous-return pathways for the head, face, and neck.'),
  q('r12-anatomy-003','ch12-facial-anatomy-neurovascular','understanding','Which muscle closes the eyelid?','Orbicularis oculi','Masseter','Buccinator','Platysma','a','Orbicularis oculi surrounds the eye and closes the eyelid.'),
  q('r12-anatomy-004','ch12-facial-anatomy-neurovascular','application','Which nerve is associated with facial sensation and motor control for chewing?','Optic nerve','Accessory nerve','Vagus nerve','Trigeminal nerve','d','The trigeminal nerve is the chief sensory nerve of the face and provides motor function related to chewing.'),
  q('r12-anatomy-005','ch12-facial-anatomy-neurovascular','scenario','A student is reviewing forehead movement. Which muscle should be associated with drawing the scalp forward and wrinkling the forehead?','Masseter','Frontalis','Trapezius','Orbicularis oris','b','The frontalis draws the scalp forward and produces horizontal forehead wrinkles.'),

  q('r12-massage-001','ch12-massage-principles-manipulations','understanding','Which manipulation is a light continuous stroking movement?','Effleurage','Petrissage','Tapotement','Friction','a','Effleurage is the light, continuous stroking movement.'),
  q('r12-massage-002','ch12-massage-principles-manipulations','application','Which manipulation uses kneading with controlled pressure?','Vibration','Effleurage','Petrissage','Feathering-off','c','Petrissage is the kneading manipulation.'),
  q('r12-massage-003','ch12-massage-principles-manipulations','scenario','A client reports discomfort during a facial massage movement. What should happen?','Continue to complete the planned time','Increase pressure gradually','Switch to percussion','Stop or modify the movement and reassess the service','d','Client comfort and contraindications control whether a massage movement remains appropriate.'),
  q('r12-massage-004','ch12-massage-principles-manipulations','understanding','What does feathering-off mean?','Increasing pressure at the end','Gradually reducing pressure as the hands leave the face','Switching from massage to steam','Using only fingertips','b','Feathering-off is the gradual reduction of pressure as the hands leave the client.'),
  q('r12-massage-005','ch12-massage-principles-manipulations','application','Which variables should guide massage technique?','Movement, pressure, direction, and duration','Client gender and product price','Only duration','Only pressure','a','Chapter 12 emphasizes movement, pressure, direction, and duration as technique variables.'),

  q('r12-equipment-001','ch12-equipment-electrotherapy','application','How should electrical facial-equipment settings be determined?','One universal setting','The previous client\'s setting','Manufacturer directions, training, and applicable rules','The strongest comfortable setting','c','Electrical settings depend on the specific device guidance, training, and applicable rules.'),
  q('r12-equipment-002','ch12-equipment-electrotherapy','scenario','A disclosed client factor is not addressed clearly enough in the device guidance to establish safe use. What should the barber do?','Test the lowest setting','Defer the modality until safe guidance is established','Ask the client to choose','Ignore it if the skin looks normal','b','If safe use cannot be established, the modality should be deferred rather than tested on the client.'),
  q('r12-equipment-003','ch12-equipment-electrotherapy','understanding','What is a facial steamer?','A device that produces moist steam for a cosmetic facial service','A dry-heat sterilizer','A permanent-hair-removal device','A galvanic electrode','a','A facial steamer produces moist steam for a cosmetic facial service.'),
  q('r12-equipment-004','ch12-equipment-electrotherapy','understanding','What does a galvanic machine provide for the source-presented facial methods?','Ultraviolet light','Mechanical exfoliation only','Alternating vibration','Direct current','d','The source presents galvanic equipment as providing direct current.'),
  q('r12-equipment-005','ch12-equipment-electrotherapy','scenario','A client experiences an unsafe response while an electrical modality is in use. What is the best immediate action?','Finish the timed cycle','Stop the modality and reassess safety','Increase product','Change electrodes without stopping','b','Unsafe client responses require stopping and reassessing rather than completing the planned cycle.'),

  q('r12-analysis-001','ch12-skin-analysis-product-selection','understanding','Which set lists the four basic Chapter 12 skin types?','Dry, normal, combination, oily','Sensitive, mature, dehydrated, acne-prone','Fair, medium, olive, dark','Smooth, rough, tight, loose','a','The Chapter 12 framework uses dry, normal, combination, and oily.'),
  q('r12-analysis-002','ch12-skin-analysis-product-selection','scenario','A client has a more oily T-zone and drier cheeks. Which pattern best fits?','Normal','Dry','Combination','Oily','c','Different characteristics by area, including an oily T-zone and drier cheeks, fit combination skin.'),
  q('r12-analysis-003','ch12-skin-analysis-product-selection','application','What is the best basis for selecting a facial cleanser?','Gender','Strongest formulation','Brand popularity','Observable needs, sensitivities, service plan, and product directions','d','Product choice should follow observation, consultation, service needs, and manufacturer directions.'),
  q('r12-analysis-004','ch12-skin-analysis-product-selection','application','How should toner or astringent selection be handled?','Choose from client analysis and the product label','Use the highest-alcohol formula','Promise pore closure','Use one formula for every client','a','Formulations vary; selection should follow the client analysis and product label.'),
  q('r12-analysis-005','ch12-skin-analysis-product-selection','scenario','The skin is visibly irritated after recent exfoliation. What is the safest decision about another exfoliating step?','Use stronger pressure','Avoid or defer the exfoliating step and follow product guidance','Continue because exfoliation is cosmetic','Use a second exfoliant to balance the first','b','Irritated or recently exfoliated skin may be unsuitable for another exfoliating step.'),

  q('r12-procedure-001','ch12-facial-treatment-procedures','application','What should happen before choosing the detailed facial-service sequence?','Consultation and skin analysis','Massage first','Strong exfoliation first','Product sales discussion first','a','Consultation and analysis come before selecting the detailed service sequence.'),
  q('r12-procedure-002','ch12-facial-treatment-procedures','scenario','A client asks whether beard oil will medically treat a persistent skin disorder. What is the appropriate response?','Promise treatment with consistent use','Diagnose the disorder before recommending a product','Keep recommendations cosmetic and refer when the concern is outside routine cosmetic care','Apply extra oil as a test','c','Beard products are cosmetic; out-of-scope concerns require referral rather than treatment claims or diagnosis.'),
  q('r12-procedure-003','ch12-facial-treatment-procedures','application','How should finishing products be chosen?','Always use the same toner','Use the strongest product','Choose by fragrance only','Match client analysis, service plan, product directions, and comfort','d','Finishing products should fit the client analysis and service plan and follow manufacturer directions.'),
  q('r12-procedure-004','ch12-facial-treatment-procedures','scenario','A warm towel becomes uncomfortable for the client. What should happen?','Remove it and reassess comfort and safety','Leave it until the planned time ends','Add another warm towel','Cover the airway to retain heat','a','Warm-towel service requires comfortable warmth, unobstructed breathing, monitoring, and removal when discomfort occurs.'),
  q('r12-procedure-005','ch12-facial-treatment-procedures','understanding','Which statement best describes the basic facial-service approach?','Every client receives every step','The sequence is selected from consultation, analysis, and the planned cosmetic service','Massage determines skin type','Electrical service is always required','b','The detailed sequence should be selected from consultation, analysis, and the appropriate service plan.'),

  q('r12-sanitation-001','ch12-sanitation-infection-control','application','How should product be dispensed from a jar during service?','With bare fingers','With the applicator already used on the client','With a clean dispensing method and no double-dipping','By returning unused product to the jar','c','Clean dispensing and avoiding double-dipping reduce contamination risk.'),
  q('r12-sanitation-002','ch12-sanitation-infection-control','scenario','Blood or body-fluid exposure occurs during a facial service. What should happen first?','Finish the current step','Stop the service and follow the applicable exposure-control procedure','Cover it with product','Wait until cleanup at the end','b','Exposure requires stopping the service and following the applicable exposure-control procedure.'),
  q('r12-sanitation-003','ch12-sanitation-infection-control','application','What should happen to reusable tools and service surfaces between clients?','Clean and disinfect as required, then protect from recontamination','Rinse with water only','Wipe with a dry towel','Store immediately if they look clean','a','Reusable items and surfaces must be processed according to applicable rules and product directions.'),
  q('r12-sanitation-004','ch12-sanitation-infection-control','scenario','A clean applicator touches the client and more product is needed from the original jar. What is the correct action?','Dip the same applicator back into the jar','Use fingers instead','Pour product back into the jar','Use a new clean dispensing applicator','d','A new clean applicator prevents double-dipping and product contamination.'),
  q('r12-sanitation-005','ch12-sanitation-infection-control','application','Why are clean linens and contamination prevention part of the service plan?','They replace client consultation','They help prevent transfer of contaminants between clients and service items','They allow tools to skip disinfection','They make exposure-control rules unnecessary','b','Clean linens and contamination-prevention practices reduce transfer risk during service.'),

  q('r12-safety-001','ch12-contraindications-service-safety','scenario','A client presents with an active or potentially contagious facial condition. What should the barber do?','Proceed with gloves','Diagnose the condition','Defer contact when unsafe and refer appropriately without diagnosing','Use a stronger cleanser','c','When contact may be unsafe, the facial service should be deferred without diagnosis or prescribing.'),
  q('r12-safety-002','ch12-contraindications-service-safety','scenario','During a facial the client reports burning and dizziness. What is the immediate response?','Stop the service and reassess safety','Lower intensity and continue automatically','Finish the current step','Add heat','a','Burning and dizziness require stopping and reassessing before proceeding.'),
  q('r12-safety-003','ch12-contraindications-service-safety','scenario','An implanted device is disclosed and safe use of the planned electrical modality cannot be established from device guidance and training. What should happen?','Use the lowest setting','Ask the client to accept the risk','Switch to another electrical modality','Defer the electrical service until safe guidance is established','d','Uncertain electrical-device suitability requires deferral rather than testing on the client.'),
  q('r12-safety-004','ch12-contraindications-service-safety','application','Which statement stays within barbering scope?','Diagnose the condition before deciding','Observe, make a cosmetic service-safety decision, and refer when appropriate','Prescribe a treatment product','Promise a cure','b','The barber observes and makes cosmetic service decisions without diagnosing, prescribing, or medically treating.'),
  q('r12-safety-005','ch12-contraindications-service-safety','scenario','A recent procedure and medication change create uncertainty about service safety. What is the best decision?','Proceed with a waiver','Use the shortest possible service','Defer or modify only when safe guidance is clear and recommend appropriate evaluation when needed','Diagnose the likely reaction','c','When safety cannot be established, the service should be deferred rather than guessed through medical interpretation.'),

  q('r12-client-001','ch12-client-care-professional-practice','application','How should product preferences be discussed with a client?','Ask about individual fragrance, texture, finish, routine, and packaging preferences','Assume preferences from gender','Choose the highest-price option','Use one recommendation for every client','a','Individual consultation should guide product preferences rather than demographic assumptions.'),
  q('r12-client-002','ch12-client-care-professional-practice','scenario','A client asks for medical treatment advice during a cosmetic facial consultation. What should the barber do?','Diagnose the problem','Stay within cosmetic scope and refer appropriately when the concern is outside scope','Recommend prescription medication','Guarantee a cosmetic product will treat it','b','Professional practice requires staying within cosmetic scope and referring when a concern is outside that scope.'),
  q('r12-client-003','ch12-client-care-professional-practice','application','What should guide a professional service plan?','Only service price','Only the barber\'s usual routine','Consultation, observable needs, comfort, contraindications, and product/device directions','Gender-based assumptions','c','The service plan should combine consultation, observation, comfort, safety, and applicable directions.'),
  q('r12-client-004','ch12-client-care-professional-practice','scenario','A client expresses discomfort with the planned position for a facial step. What reflects professional care?','Ignore it if the step is brief','End every service automatically','Ask another client what they prefer','Adjust safely, communicate, and preserve comfort and service safety','d','Client communication and safe accommodation are part of professional care.'),
  q('r12-client-005','ch12-client-care-professional-practice','application','Which approach best reflects Chapter 12 professional practice?','Consult, observe, communicate, stay within scope, and refer when needed','Diagnose before every service','Use the same products for all clients','Promise therapeutic results','a','Professional practice combines consultation, observation, communication, scope, and referral boundaries.'),
]

export function getChapter12ReassessmentReserve(
  conceptFamilyId: Chapter12ConceptFamilyId,
): readonly Chapter12ReassessmentQuestion[] {
  return chapter12ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
