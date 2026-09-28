import type { Chapter14ConceptFamilyId } from './types'
import type { Chapter14Difficulty } from './grading'

export type Chapter14ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter14ReassessmentQuestion {
  id: `r14-${string}`
  conceptFamilyId: Chapter14ConceptFamilyId
  difficulty: Exclude<Chapter14Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter14ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter14ReassessmentQuestion['id'],
  conceptFamilyId: Chapter14ConceptFamilyId,
  difficulty: Chapter14ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter14ReassessmentAnswer,
  explanation: string,
): Chapter14ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter14ReassessmentReserve: readonly Chapter14ReassessmentQuestion[] = [
  q('r14-consult-001','ch14-consultation-professional-design','scenario','A client asks for a major length change but uses vague terms. What should the barber do first?','Begin cutting conservatively without further discussion','Clarify the desired length, shape, maintenance, and visual reference before cutting','Choose the style based on face shape alone','Ask another client for an opinion','b','A clear consultation aligns expectations before irreversible cutting decisions.'),
  q('r14-consult-002','ch14-consultation-professional-design','application','Why is repeating the agreed haircut plan back to the client useful?','It confirms shared expectations before the service begins','It replaces hair analysis','It guarantees the final result','It determines tool sanitation','a','Restating the plan helps verify that barber and client understand the same goal.'),
  q('r14-consult-003','ch14-consultation-professional-design','scenario','A client brings a photo that does not match their current length and density. What is the best response?','Promise the exact photo result','Explain what elements are realistic and adapt the plan to the client’s current hair','Refuse all photo references','Ignore density and copy the outline','b','Professional planning translates inspiration into a realistic service plan.'),
  q('r14-consult-004','ch14-consultation-professional-design','understanding','What is the main purpose of a haircut consultation?','To identify client goals and build an appropriate service plan','To select the fastest tool','To diagnose scalp disease','To avoid discussing maintenance','a','Consultation connects the client’s expectations to professional planning.'),
  q('r14-consult-005','ch14-consultation-professional-design','application','When should maintenance expectations be discussed?','Only after the haircut is finished','During consultation so the design fits what the client can maintain','Only if the client complains','Never for short haircuts','b','Maintenance is part of selecting a workable design.'),

  q('r14-analysis-001','ch14-facial-head-design-analysis','application','A haircut must visually balance a narrow area of the head. What should guide the design decision?','Use the same length everywhere','Use proportion, head structure, and the desired silhouette','Ignore profile and head shape','Use only the clipper guard number','b','Design analysis uses structure and proportion to support the intended silhouette.'),
  q('r14-analysis-002','ch14-facial-head-design-analysis','scenario','A client has a prominent occipital area. What should the barber consider when planning the back shape?','How length and graduation will affect the profile','Only the front hairline','Whether the hair is wet','The client’s shoe size','a','Head shape affects how length and graduation read in profile.'),
  q('r14-analysis-003','ch14-facial-head-design-analysis','understanding','Why are reference points on the head useful?','They provide consistent landmarks for sectioning and design control','They replace consultation','They determine hair color','They guarantee symmetry without cross-checking','a','Reference points help organize sectioning and spatial decisions.'),
  q('r14-analysis-004','ch14-facial-head-design-analysis','application','What should happen when a textbook face-shape example conflicts with the client’s preference?','Force the example exactly','Use design principles as guidance while honoring the client’s informed preference','Cancel the haircut','Ignore proportion completely','b','Design guidance should be adapted to the individual, not treated as a rigid prescription.'),
  q('r14-analysis-005','ch14-facial-head-design-analysis','scenario','One sideburn area sits slightly higher naturally than the other. What is the best planning approach?','Remove both sideburns','Assess natural asymmetry and agree on the visual balance before cutting','Cut the lower side much shorter automatically','Ignore the difference','b','Natural asymmetry should be assessed and incorporated into the plan.'),

  q('r14-geometry-001','ch14-cutting-geometry-guides','understanding','What does elevation primarily influence in haircut geometry?','Weight distribution and graduation/layering','Hair color','Tool sanitation','Scalp diagnosis','a','Elevation changes how length and weight are distributed through the haircut.'),
  q('r14-geometry-002','ch14-cutting-geometry-guides','scenario','A stationary guide is used in one area. What must the barber control as sections move away from it?','Overdirection and tension','Product fragrance','Clipper battery percentage','Client posture only','a','Distance from a stationary guide changes overdirection and can change length distribution.'),
  q('r14-geometry-003','ch14-cutting-geometry-guides','application','Why is cross-checking performed in a different direction from the original cut?','To expose inconsistencies that may not appear in the original sectioning','To add color contrast','To replace the guide','To increase elevation automatically','a','Cross-checking from another direction helps reveal unevenness.'),
  q('r14-geometry-004','ch14-cutting-geometry-guides','scenario','The barber applies uneven tension from section to section. What is the likely effect?','Length can become inconsistent','The haircut becomes automatically blended','The guide becomes stationary','Hair texture changes permanently','a','Uneven tension can distort cutting length and consistency.'),
  q('r14-geometry-005','ch14-cutting-geometry-guides','application','How should natural growth pattern affect cutting control?','It should be considered when choosing sectioning, tension, and finishing decisions','It should always be cut against','It only matters during shampooing','It is irrelevant in short hair','a','Growth pattern influences control and the way hair settles after cutting.'),

  q('r14-tools-001','ch14-shear-clipper-razor-texturizing','application','When is a clipper-over-comb approach useful?','When controlled blending is needed without relying on one fixed guard length','Only for shampooing','Only for long one-length cuts','When no visual control is needed','a','Clipper-over-comb allows flexible blending and contour control.'),
  q('r14-tools-002','ch14-shear-clipper-razor-texturizing','scenario','A barber wants to remove bulk without creating a blunt perimeter. Which approach best fits?','Use an appropriate texturizing or thinning technique with controlled placement','Use maximum clipper pressure everywhere','Cut every section to the same guide','Ignore density','a','Texturizing techniques can reduce bulk while preserving the overall form.'),
  q('r14-tools-003','ch14-shear-clipper-razor-texturizing','understanding','Why must tool choice match the desired result?','Different tools and techniques create different edge, texture, and blending effects','All tools create the same finish','Tool choice only affects speed','Only clippers influence texture','a','Tool selection is part of controlling the final visual and tactile result.'),
  q('r14-tools-004','ch14-shear-clipper-razor-texturizing','application','What should guide razor use in haircutting?','Hair condition, desired texture, controlled technique, and appropriate safety','The sharpest possible movement','Maximum tension on every texture','Using the razor on every client','a','Razor work should be deliberate and appropriate to the hair and service.'),
  q('r14-tools-005','ch14-shear-clipper-razor-texturizing','scenario','A blend line remains after guard work. What is the best next step?','Identify the weight or length difference and refine it with a controlled blending technique','Push harder with the same guard everywhere','Shorten the entire haircut','Ignore the line','a','Refinement should target the actual length transition rather than remove unnecessary length.'),

  q('r14-proc-001','ch14-haircut-styles-procedures','application','Why should the haircut be checked before finish styling?','To correct shape, balance, and missed areas before styling can disguise them','To make the haircut longer','To avoid consultation','To change the client’s natural texture permanently','a','Inspection before styling helps verify the haircut itself.'),
  q('r14-proc-002','ch14-haircut-styles-procedures','scenario','A taper looks heavier on one side after drying. What should the barber do?','Reassess balance and refine only the heavier area as needed','Recut the entire head immediately','Add more product to hide it','Ignore the imbalance','a','Finish work includes reassessing balance under the final dry shape.'),
  q('r14-proc-003','ch14-haircut-styles-procedures','understanding','What is the value of following a consistent haircut procedure?','It supports control, completeness, and repeatable quality','It removes the need for adaptation','It guarantees every client gets the same haircut','It replaces cross-checking','a','A structured procedure supports consistency while still allowing client-specific adaptation.'),
  q('r14-proc-004','ch14-haircut-styles-procedures','application','What should happen before detailing the outline?','The overall shape and balance should already be established','All internal length should be ignored','The client should leave the chair','The hair must always be fully wet','a','Detailing is finish work and should follow control of the larger haircut shape.'),
  q('r14-proc-005','ch14-haircut-styles-procedures','scenario','The client asks for a classic style but wants less weight than the standard example. What should the barber do?','Adapt the procedure to the agreed result while preserving the style’s essential form','Refuse any variation','Use the example exactly','Ignore the consultation','a','Classic procedures are guides that can be adapted to client goals.'),

  q('r14-style-001','ch14-styling-volume-locks','application','What is the purpose of directing airflow during blow-drying?','To control movement, shape, and finish while managing heat','To hold heat on one spot','To eliminate sectioning','To diagnose scalp conditions','a','Airflow direction supports styling control and finish.'),
  q('r14-style-002','ch14-styling-volume-locks','scenario','A client wants more volume at the root. What should the barber adjust?','Root direction, brush/hand control, and airflow rather than simply increasing heat','Only product fragrance','Haircut length after styling is complete','Water temperature only','a','Volume is created through controlled direction and support, not excessive heat.'),
  q('r14-style-003','ch14-styling-volume-locks','understanding','Why is consistent sectioning important in cornrow work?','It supports clean pattern control and even organization','It changes hair color','It eliminates tension concerns','It makes sanitation unnecessary','a','Sectioning establishes the pattern and organization of the style.'),
  q('r14-style-004','ch14-styling-volume-locks','application','What should guide lock maintenance decisions?','The client’s existing lock structure, hair condition, and maintenance goals','A single method for every client','Maximum tension','Cutting every loose hair','a','Lock maintenance should respect the existing structure and client goals.'),
  q('r14-style-005','ch14-styling-volume-locks','scenario','A styling technique begins causing visible discomfort from tension. What should the barber do?','Reduce or modify the tension and reassess client comfort','Continue because tension is required','Increase heat','Ignore the client','a','Styling control must remain compatible with client comfort and safe technique.'),

  q('r14-safety-001','ch14-service-safety-sanitation','scenario','Broken skin is visible in the planned head-shave area. What is the safest response?','Shave carefully over it','Defer the affected area and follow appropriate service-safety procedure','Use more pressure','Cover it with styling product','b','Compromised skin should not be shaved through as though the area were normal.'),
  q('r14-safety-002','ch14-service-safety-sanitation','scenario','A blow dryer is producing uncomfortable concentrated heat at the scalp. What should the barber do?','Hold it in place until the section dries','Move the airflow, reduce heat or distance as needed, and reassess comfort','Increase heat to finish faster','Ignore the client’s response','b','Thermal styling requires controlled heat and continuous comfort monitoring.'),
  q('r14-safety-003','ch14-service-safety-sanitation','application','What should happen to reusable tools after contamination risk during a service?','Follow the required cleaning and disinfection process before reuse','Wipe them on a towel and reuse immediately','Store them with clean tools','Use them on the same client next week without processing','a','Reusable tools must be processed according to applicable infection-control requirements before reuse.'),
  q('r14-safety-004','ch14-service-safety-sanitation','application','Why must sharp implements be handled and stored deliberately?','To reduce injury and cross-contamination risk','Only to protect the tool finish','Because it changes cutting geometry','Only during state-board exams','a','Sharp-tool control is a service-safety requirement, not just an equipment-care issue.'),
  q('r14-safety-005','ch14-service-safety-sanitation','scenario','A client reports burning discomfort during thermal styling even though the hair is not yet dry. What should the barber do?','Pause and modify the heat/airflow before continuing','Finish the section first','Apply more tension','Ignore the sensation because drying is incomplete','a','Client discomfort is a signal to stop and correct the thermal technique.')
]

export function getChapter14ReassessmentReserve(
  conceptFamilyId: Chapter14ConceptFamilyId,
): readonly Chapter14ReassessmentQuestion[] {
  return chapter14ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
