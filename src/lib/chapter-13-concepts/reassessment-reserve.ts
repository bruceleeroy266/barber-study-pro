import type { Chapter13ConceptFamilyId } from './types'
import type { Chapter13Difficulty } from './grading'

export type Chapter13ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter13ReassessmentQuestion {
  id: `r13-${string}`
  conceptFamilyId: Chapter13ConceptFamilyId
  difficulty: Exclude<Chapter13Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter13ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter13ReassessmentQuestion['id'],
  conceptFamilyId: Chapter13ConceptFamilyId,
  difficulty: Chapter13ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter13ReassessmentAnswer,
  explanation: string,
): Chapter13ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter13ReassessmentReserve: readonly Chapter13ReassessmentQuestion[] = [
  q('r13-prep-001','ch13-consultation-service-preparation','application','A client has a coarse beard and mildly sensitive skin. What should guide preparation?','Use maximum heat because the beard is coarse','Skip lather and use dry strokes','Adjust towel warmth, lather, and preparation to beard texture and skin tolerance','Use strong astringent before shaving','c','Preparation should match both beard characteristics and the client’s observable skin tolerance.'),
  q('r13-prep-002','ch13-consultation-service-preparation','scenario','A client reports that the warm towel feels uncomfortable. What should the barber do?','Leave it until the planned time ends','Remove or modify the towel and reassess comfort','Add a second towel','Increase pressure on the towel','b','Preparation must remain comfortable and safe; heat should be reduced or stopped when the client is uncomfortable.'),
  q('r13-prep-003','ch13-consultation-service-preparation','understanding','Why is beard-growth analysis part of preparation?','It predicts hair color','It helps select stroke direction and identify grain changes','It determines haircut length','It replaces skin inspection','b','Growth analysis helps the barber plan safe stroke direction and adapt to grain changes.'),
  q('r13-prep-004','ch13-consultation-service-preparation','application','When should a retained mustache be shaped relative to the facial shave?','Before the shave so finish work respects the intended outline','Only after the client leaves','Never during the same appointment','Only after powder is applied','a','Establishing the mustache shape first helps the shave preserve the intended design.'),
  q('r13-prep-005','ch13-consultation-service-preparation','scenario','A client has visibly irritated skin before preparation. What is the best first response?','Increase towel temperature','Analyze the area and modify or defer preparation as appropriate','Use a stronger lather','Begin against the grain','b','Observable irritation should change the service plan before heat, lather, or razor work begins.'),

  q('r13-growth-001','ch13-hair-growth-ingrown-prevention','understanding','What does beard grain describe?','Hair color','Direction of hair growth as it emerges and lies','Hair diameter only','Number of follicles','b','Grain is the direction of beard growth and guides stroke planning.'),
  q('r13-growth-002','ch13-hair-growth-ingrown-prevention','application','A mapped shaving area contains a visible grain change. What should the barber do?','Keep the same stroke direction across the whole area','Re-check the local growth and adjust the stroke','Increase pressure','Switch automatically to against-grain shaving','b','The client’s actual grain takes priority over a generic area diagram.'),
  q('r13-growth-003','ch13-hair-growth-ingrown-prevention','scenario','Which choice best reduces ingrown-hair risk for tightly curved beard growth?','Repeated very-close passes','Heavy pressure across the grain','Conservative technique that respects the observed growth pattern','Dry shaving','c','Curved beard hair can re-enter the skin, so conservative grain-aware technique helps reduce avoidable risk.'),
  q('r13-growth-004','ch13-hair-growth-ingrown-prevention','application','A client has inflamed ingrown-hair bumps. What stays within barbering scope?','Diagnose folliculitis','Open the bumps','Observe the area, defer unsafe work, and refer when appropriate','Prescribe medication','c','Barbers may observe and make safe service decisions but should not diagnose or medically treat the condition.'),
  q('r13-growth-005','ch13-hair-growth-ingrown-prevention','understanding','What is a grain change?','A change in beard color','A place where neighboring hair changes growth direction','A permanent change in texture','A shaved area with no lather','b','A grain change is a directional transition in beard growth.'),

  q('r13-area-001','ch13-shaving-areas-body-positioning','understanding','How many training areas are used in the Chapter 13 first-pass map?','7','10','14','21','c','The source uses 14 training areas to organize the first-time-over shave.'),
  q('r13-area-002','ch13-shaving-areas-body-positioning','application','What is the best use of the 14-area map?','Follow it without checking individual growth','Use it as an organizing guide while adapting to actual grain','Use it only for close shaving','Ignore it when the beard is coarse','b','The map organizes the service but does not replace client-specific grain analysis.'),
  q('r13-area-003','ch13-shaving-areas-body-positioning','understanding','For a right-handed barber, which areas are associated with the behind-right-shoulder position?','1, 4, 12','2, 3, 6, 8','7, 9','5, 10, 13, 14','d','The behind-right-shoulder position supports the reverse-freehand areas 5, 10, 13, and 14.'),
  q('r13-area-004','ch13-shaving-areas-body-positioning','application','Why should the barber reposition the body instead of overreaching?','To keep controlled alignment and reduce awkward razor movement','To make the shave faster at any cost','To avoid using the support hand','To eliminate skin stretching','a','Stable body positioning supports controlled razor movement and safer reach.'),
  q('r13-area-005','ch13-shaving-areas-body-positioning','scenario','A left-handed barber uses the 14-area system. What should happen to the right-handed reference positions?','They must be followed exactly','They should be mirrored appropriately','They should be ignored completely','Only the neck positions change','b','The reference model is mirrored for a left-handed barber while preserving the same control principles.'),

  q('r13-razor-001','ch13-razor-handling-stretching-technique','application','Why is a shallow razor angle used?','To improve cutting control and reduce scraping','To make every shave against the grain','To eliminate skin stretching','To increase pressure','a','A shallow working angle supports controlled cutting and helps avoid scraping.'),
  q('r13-razor-002','ch13-razor-handling-stretching-technique','scenario','Skin begins bunching in front of the blade. What should the barber correct?','Increase pressure','Improve skin support and controlled tension','Lengthen the stroke','Use a steeper blade angle','b','A stable, properly stretched surface prevents skin from bunching ahead of the blade.'),
  q('r13-razor-003','ch13-razor-handling-stretching-technique','understanding','Which three razor positions are primarily used for the facial 14-area shave?','Freehand, backhand, reverse freehand','Freehand, reverse backhand, overhand','Backhand, overhand, underhand','Reverse backhand only','a','The primary facial positions are freehand, backhand, and reverse freehand.'),
  q('r13-razor-004','ch13-razor-handling-stretching-technique','application','Why are most shaving strokes kept relatively short?','To keep the blade close to the controlled stretch area','Because long strokes are illegal','Because lather lasts only a few inches','To avoid repositioning the body','a','Short strokes keep cutting close to the support point and improve control.'),
  q('r13-razor-005','ch13-razor-handling-stretching-technique','scenario','The nondominant fingertips become slippery with lather. What should the barber do before continuing?','Use more pressure','Dry the support hand and restore controlled skin grip','Ignore it','Switch to a longer stroke','b','A dry support hand improves grip and controlled stretching.'),

  q('r13-proc-001','ch13-professional-shave-procedure','understanding','What are the three broad stages of the professional shave?','Preparation, shaving, finishing','Cutting, shampooing, styling','Consultation, color, waxing','Steam, clipper, blow-dry','a','Chapter 13 organizes the professional shave into preparation, shaving, and finishing.'),
  q('r13-proc-002','ch13-professional-shave-procedure','application','After the first pass, a few rough areas remain. What is the best second-time-over approach?','Repeat every stroke whether needed or not','Re-moisten and address only remaining areas with appropriate direction','Shave dry against the grain','Skip inspection','b','The second-time-over should target remaining roughness rather than repeat the entire service automatically.'),
  q('r13-proc-003','ch13-professional-shave-procedure','understanding','What best describes a once-over shave?','A single-lather service using selected across-grain work without intentionally becoming a close shave','A shave on one side only','A dry shave','A mandatory against-grain pass','a','The once-over is a more efficient single-lather service with selected across-grain work.'),
  q('r13-proc-004','ch13-professional-shave-procedure','scenario','A client requests an against-grain close shave and has a history of ingrown hairs. What should the barber do?','Perform it automatically','Evaluate skin, growth, risk, training, and local rules before deciding','Use more pressure','Skip consultation','b','Close shaving should be a client-specific decision because against-grain work can increase irritation and ingrown-hair risk.'),
  q('r13-proc-005','ch13-professional-shave-procedure','application','What should guide final finishing-product selection?','The same product for every client','Observable skin needs, client comfort, and product directions','Highest alcohol content','Fragrance only','b','Finishing choices should fit the client and the product’s intended use.'),

  q('r13-design-001','ch13-facial-hair-design','application','What should guide mustache and beard design?','One fixed face-shape rule','Client preference, proportions, natural growth, density, texture, and maintenance needs','The barber’s favorite style','Trend popularity alone','b','Facial-hair design should adapt proportion principles to the individual client.'),
  q('r13-design-002','ch13-facial-hair-design','scenario','A client wants a much shorter beard. What is the safest trimming strategy?','Cut immediately to the shortest length','Start slightly longer and shorten gradually while checking balance','Remove natural outlines first','Use the razor before evaluating density','b','Starting longer preserves control and allows gradual balancing.'),
  q('r13-design-003','ch13-facial-hair-design','understanding','Why are face-shape examples better treated as guides than fixed rules?','Because clients vary in growth, proportion, symmetry, and preference','Because proportions never matter','Because beards should not be shaped','Because every client needs the same style','a','Professional design adapts examples to the client rather than forcing one preset style.'),
  q('r13-design-004','ch13-facial-hair-design','application','Why should natural beard density influence the planned outline?','Sparse areas may not support the same shape or fullness as dense areas','Density changes legal scope','Density determines skin diagnosis','Density replaces client preference','a','Natural growth and density affect what shapes can be maintained successfully.'),
  q('r13-design-005','ch13-facial-hair-design','scenario','One side of a beard grows more densely than the other. What should the barber do?','Ignore the difference','Balance the design using the actual growth while confirming the client’s preference','Remove both sides completely','Copy a diagram exactly','b','Design should account for real asymmetry and growth rather than forcing artificial symmetry without consultation.'),

  q('r13-safety-001','ch13-infection-control-service-safety','scenario','A razor nick produces visible blood. What is the first required response?','Continue and clean later','Stop and follow standard precautions and the applicable exposure procedure','Apply a shared product directly','Cover it with lather','b','Visible blood requires an immediate pause and proper exposure-control procedure.'),
  q('r13-safety-002','ch13-infection-control-service-safety','scenario','Visible pustules or signs of active infection are present in the planned shave area. What should the barber do?','Shave through them carefully','Defer the affected area and follow appropriate infection-control/referral procedure','Use more lather','Apply extra heat','b','Unsafe skin findings require a service decision that protects the client rather than shaving through the area.'),
  q('r13-safety-003','ch13-infection-control-service-safety','application','How should a used replaceable razor blade be handled?','Wrapped in tissue and placed in regular trash','Placed directly in an approved sharps container','Rinsed and reused','Left on the workstation','b','Used replaceable blades are sharps and require approved disposal.'),
  q('r13-safety-004','ch13-infection-control-service-safety','scenario','A client’s skin is blistered and poorly tolerant of heat. What should happen with hot-towel preparation?','Increase heat slowly','Avoid or modify the hot-towel step','Use two towels','Apply strong astringent first','b','Compromised or heat-intolerant skin requires the heat step to be avoided or modified.'),
  q('r13-safety-005','ch13-infection-control-service-safety','application','Why must current local rules be checked for razor type and glove use?','Requirements may vary by jurisdiction','One national rule controls every shop','Manufacturers set legal scope','Those practices are never regulated','a','Legal and regulatory requirements can vary by jurisdiction, so current applicable rules govern practice.'),

  q('r13-care-001','ch13-client-care-professional-practice','application','Which combination best supports client satisfaction during a shave?','Clean equipment, controlled technique, comfortable temperature, inspection, and professional communication','Maximum heat and pressure','Speed only','Identical technique for every client','a','Service quality depends on comfort, cleanliness, control, inspection, and communication.'),
  q('r13-care-002','ch13-client-care-professional-practice','scenario','A client requests a service choice that conflicts with safe technique or current local rules. What should the barber do?','Perform it because the client asked','Explain the boundary and offer an appropriate alternative','Ignore the rule with a waiver','Let another student decide','b','Professional practice requires clear communication and a safe, permitted alternative.'),
  q('r13-care-003','ch13-client-care-professional-practice','application','Why should the barber inspect the completed shave before finishing the service?','To identify missed or uneven areas while maintaining client comfort','To diagnose skin disease','To make every shave closer','To avoid client feedback','a','Final inspection helps correct service-quality issues before the client leaves.'),
  q('r13-care-004','ch13-client-care-professional-practice','understanding','What is an important part of professional client communication during shaving?','Setting expectations and checking comfort','Avoiding all questions','Promising a perfect result','Using technical terms the client cannot understand','a','Clear expectations and comfort checks are part of professional client care.'),
  q('r13-care-005','ch13-client-care-professional-practice','scenario','The client reports discomfort during a shaving step. What should the barber do?','Continue to finish the planned sequence','Pause, reassess technique or preparation, and adjust safely','Increase pressure to finish faster','Ignore the complaint','b','Client discomfort should trigger reassessment and a safe service adjustment.')
]

export function getChapter13ReassessmentReserve(
  conceptFamilyId: Chapter13ConceptFamilyId,
): readonly Chapter13ReassessmentQuestion[] {
  return chapter13ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
