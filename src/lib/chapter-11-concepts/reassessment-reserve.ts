import type { Chapter11ConceptFamilyId } from './types'
import type { Chapter11Difficulty } from './grading'

export type Chapter11ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter11ReassessmentQuestion {
  id: `r11-${string}`
  conceptFamilyId: Chapter11ConceptFamilyId
  difficulty: Exclude<Chapter11Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter11ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter11ReassessmentQuestion['id'],
  conceptFamilyId: Chapter11ConceptFamilyId,
  difficulty: Chapter11ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter11ReassessmentAnswer,
  explanation: string,
): Chapter11ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter11ReassessmentReserve: readonly Chapter11ReassessmentQuestion[] = [
  q('r11-shampoo-001','ch11-shampoo-draping-service','application','Which cape best fits a wet shampoo service?','Waterproof shampoo cape','Dry haircutting cape only','No cape','Paper neck strip only','a','Wet services use a waterproof shampoo cape.'),
  q('r11-shampoo-002','ch11-shampoo-draping-service','scenario','A client cannot comfortably recline for shampooing. What should the barber do?','Cancel automatically','Ask how the client can be positioned safely and comfortably','Force the reclined method','Skip draping','b','Chapter 11 supports safe, comfortable client accommodation.'),
  q('r11-shampoo-003','ch11-shampoo-draping-service','application','What should happen before water contacts the scalp?','Add product first','Increase water temperature','Test the water temperature','Massage first','c','Water temperature should be tested before shampooing.'),
  q('r11-shampoo-004','ch11-shampoo-draping-service','understanding','Which shampoo method is most common?','Inclined','Dry','Standing','Reclined','d','The reclined method is the most common.'),
  q('r11-shampoo-005','ch11-shampoo-draping-service','scenario','Water reaches the client’s face and the barber scrapes the scalp. How should this be judged?','Both are service faults','Only face wetting is a fault','Only scraping is a fault','Neither is a fault','a','Both are listed shampoo-service faults.'),

  q('r11-analysis-001','ch11-analysis-product-selection','understanding','Which factor belongs in Chapter 11 hair/scalp analysis?','Eye color','Porosity','Shoe size','Face shape only','b','Porosity is one of the source-listed analysis factors.'),
  q('r11-analysis-002','ch11-analysis-product-selection','application','Which product direction matches coarse hair?','Volumizing only','Protein only','Moisturizing products and leave-in conditioners','No conditioner','c','The Chapter 11 table pairs coarse hair with moisturizing products and leave-ins.'),
  q('r11-analysis-003','ch11-analysis-product-selection','scenario','A client has dry, damaged hair. Which plan best matches Chapter 11?','Strong cleansing only','Skip analysis','Use the oily-hair plan','Gentle cleansing with deep moisturizing and protein/moisturizing repair options','d','That plan matches the Chapter 11 product table.'),
  q('r11-analysis-004','ch11-analysis-product-selection','application','Why review texture, density, porosity, and elasticity?','To guide product and treatment selection','To diagnose disease','To determine cape color','To replace consultation','a','These analysis findings guide cosmetic product and treatment selection.'),
  q('r11-analysis-005','ch11-analysis-product-selection','scenario','Which step should occur before choosing a treatment product?','Steam first','Consultation and analysis','Electric massage first','Hair tonic first','b','Consultation and analysis come first.'),

  q('r11-massage-001','ch11-scalp-massage','understanding','Which set contains the three Chapter 11 massage movements?','Kneading, tapping, pinching','Percussion, vibration, pulling','Rotary, sliding, back-and-forth','Rolling, pressing, lifting','c','Chapter 11 identifies rotary, sliding, and back-and-forth movements.'),
  q('r11-massage-002','ch11-scalp-massage','application','Which movement uses overlapping circular motion?','Sliding','Back-and-forth','Tapping','Rotary','d','Rotary movement uses overlapping circular motions.'),
  q('r11-massage-003','ch11-scalp-massage','application','Which technique best follows Chapter 11 massage guidance?','Slow rhythmic motion with controlled pressure','Abrupt pulling','Maximum pressure throughout','One-hand tapping only','a','The source supports rhythmic, controlled movement without pulling.'),
  q('r11-massage-004','ch11-scalp-massage','scenario','From behind the ears toward the crown, which movements fit the Chapter 11 table?','Back-and-forth only','Rotary and sliding','Tapping only','Pulling and rolling','b','Rotary and sliding movements are used in that area.'),
  q('r11-massage-005','ch11-scalp-massage','understanding','Where should the massage sequence begin?','Crown','Nape','Hairline','Ear only','c','Chapter 11 directs the sequence to begin at the hairline.'),

  q('r11-treatment-001','ch11-scalp-hair-treatments','understanding','What two principles are essential to hair/scalp treatment?','Heat and color','Cutting and styling','Steam and drying','Cleanliness and stimulation','d','Chapter 11 identifies cleanliness and stimulation.'),
  q('r11-treatment-002','ch11-scalp-hair-treatments','application','Which sequence matches the hair-tonic treatment?','Tonic, massage, steam, massage again, comb into style','Cut, tonic, rinse, steam','Steam, cut, shampoo, tonic','Massage, color, steam, rinse','a','This is the source-supported sequence.'),
  q('r11-treatment-003','ch11-scalp-hair-treatments','understanding','What is a general purpose of hair/scalp treatments?','Diagnose disease','Preserve health and appearance within cosmetic scope','Guarantee regrowth','Replace analysis','b','The source frames treatment as cosmetic care that supports health and appearance.'),
  q('r11-treatment-004','ch11-scalp-hair-treatments','scenario','Which choice stays within Chapter 11 treatment scope?','Prescribe medication','Diagnose the scalp condition','Choose a cosmetic treatment based on analysis','Promise a cure','c','Cosmetic treatment selection based on analysis stays within scope.'),
  q('r11-treatment-005','ch11-scalp-hair-treatments','application','When should treatment selection be changed?','Never','Only after styling','Only by price','When analysis indicates a different cosmetic need or contraindication','d','Analysis and safety findings guide treatment choice.'),

  q('r11-equipment-001','ch11-treatment-equipment','understanding','What may substitute for a scalp steamer?','Hot towel or hot-towel series','Cold dry towel','Haircutting cape','Blow dryer on maximum','a','Hot towels may substitute for a scalp steamer.'),
  q('r11-equipment-002','ch11-treatment-equipment','application','Which variables must be controlled with an electric massager?','Hair color and length','Intensity, duration, and pressure','Cape type and bowl height','Product price and scent','b','Chapter 11 directs control of intensity, duration, and pressure.'),
  q('r11-equipment-003','ch11-treatment-equipment','scenario','Where should the electric massager be adjusted before use?','On the scalp','Around the wrist','On the back of the hand with thumb/fingers free','In a closed palm','c','The source places the massager on the back of the hand.'),
  q('r11-equipment-004','ch11-treatment-equipment','understanding','What is one source-supported effect of scalp steam?','Permanent texture change','Medical diagnosis','Removal of all scalp oil','Softening scalp/hair and preparing for treatment','d','Steam prepares the scalp and hair for massage/treatment.'),
  q('r11-equipment-005','ch11-treatment-equipment','scenario','A client reports discomfort during electric massage. What is the best response?','Reduce or stop the stimulation and reassess comfort','Increase intensity','Ignore discomfort','Add more pressure','a','Intensity and pressure must remain controlled and comfortable.'),

  q('r11-condition-001','ch11-scalp-condition-recognition','understanding','Which organism does the source summary associate with dandruff?','Staphylococcus','Malassezia','A virus','A parasite','b','The Chapter 11 summary associates dandruff with Malassezia.'),
  q('r11-condition-002','ch11-scalp-condition-recognition','application','What does Chapter 11 associate with oily scalp?','Low density','Poor elasticity','Overactive sebaceous glands','Reduced oil-gland activity','c','Oily scalp is associated with overactive sebaceous glands.'),
  q('r11-condition-003','ch11-scalp-condition-recognition','application','What does Chapter 11 associate with dry scalp?','Overactive glands','High density','Steam exposure','Reduced oil-gland activity','d','Dry scalp is associated with reduced oil-gland activity.'),
  q('r11-condition-004','ch11-scalp-condition-recognition','scenario','Why note abrasions or disorders before treatment?','They can change whether a cosmetic service is safe or appropriate','They determine haircut length','They replace consultation','They determine cape color','a','These findings can change the service decision.'),
  q('r11-condition-005','ch11-scalp-condition-recognition','scenario','A scalp finding appears outside routine cosmetic care. What is the appropriate approach?','Diagnose it','Make a safe cosmetic-service decision and refer as appropriate','Prescribe a product','Continue every service','b','Observation, safe service decisions, and referral stay within scope.'),

  q('r11-safety-001','ch11-service-safety-referral','scenario','A parasitic scalp disorder is observed. What should the barber do?','Treat with stronger shampoo','Continue with steam','Do not treat the disorder; refer to a physician','Massage first','c','Parasitic scalp disorders are outside barber treatment scope.'),
  q('r11-safety-002','ch11-service-safety-referral','scenario','A scalp condition appears consistent with a staphylococcal infection. What should happen?','Continue with antiseptic','Proceed with consent','Massage only','Do not treat it as a barber; refer to a physician','d','Staphylococcal scalp infections are outside barber treatment scope.'),
  q('r11-safety-003','ch11-service-safety-referral','application','Which action stays within barbering scope?','Describe observable findings and refer when appropriate','Diagnose the disorder','Prescribe medication','Promise treatment success','a','Barbers observe, make service decisions, and refer without diagnosing or prescribing.'),
  q('r11-safety-004','ch11-service-safety-referral','scenario','A scalp condition makes the planned service uncertain. What is the safest choice?','Continue by client request','Pause or modify the service and refer when needed','Use stronger product','Diagnose first','b','Uncertain or out-of-scope findings require a safer service decision.'),
  q('r11-safety-005','ch11-service-safety-referral','scenario','Which combined response best matches Chapter 11 safety boundaries?','Treat first, refer later','Diagnose and prescribe','Avoid inappropriate treatment, stay in cosmetic scope, and refer appropriately','Ignore findings without pain','c','This preserves the source-supported service and referral boundary.'),

  q('r11-client-001','ch11-client-care-professional-practice','application','What makes a home-care recommendation appropriate?','It is tied to analyzed needs and product directions','It promises a cure','It replaces referral','It is always the most expensive option','a','Home-care guidance should match analysis and product directions.'),
  q('r11-client-002','ch11-client-care-professional-practice','scenario','A client asks for a product instead of medical evaluation for an out-of-scope condition. What should the barber do?','Sell the strongest product','Explain the boundary and refer appropriately','Double product use','Use massage to test it','b','Referral is appropriate when the concern is outside cosmetic scope.'),
  q('r11-client-003','ch11-client-care-professional-practice','application','What is the best basis for a professional product recommendation?','Sales goal','Package size','Observed hair/scalp needs and Chapter 11 matching guidance','Fragrance only','c','Recommendations should connect to analyzed client needs.'),
  q('r11-client-004','ch11-client-care-professional-practice','scenario','A client needs an altered shampoo position for comfort. What reflects professional care?','Use the normal position anyway','Skip all service','Choose what is fastest','Adapt positioning safely and communicate with the client','d','Individual attention and safe accommodation are part of professional care.'),
  q('r11-client-005','ch11-client-care-professional-practice','application','Which statement best reflects Chapter 11 professional practice?','Analyze, communicate clearly, stay within scope, and refer when needed','Diagnose before recommending products','Promise medical results','Ignore product directions','a','Professional practice combines analysis, communication, scope, and referral.')
]

export function getChapter11ReassessmentReserve(
  conceptFamilyId: Chapter11ConceptFamilyId,
): readonly Chapter11ReassessmentQuestion[] {
  return chapter11ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
