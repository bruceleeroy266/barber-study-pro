import type { Chapter16ConceptFamilyId } from './types'
import type { Chapter16Difficulty } from './grading'

export type Chapter16ReassessmentAnswer = 'a' | 'b' | 'c' | 'd'

export interface Chapter16ReassessmentQuestion {
  id: `r16-${string}`
  conceptFamilyId: Chapter16ConceptFamilyId
  difficulty: Exclude<Chapter16Difficulty, 'recall'>
  question: string
  answer_a: string
  answer_b: string
  answer_c: string
  answer_d: string
  correctAnswer: Chapter16ReassessmentAnswer
  explanation: string
}

const q = (
  id: Chapter16ReassessmentQuestion['id'],
  conceptFamilyId: Chapter16ConceptFamilyId,
  difficulty: Chapter16ReassessmentQuestion['difficulty'],
  question: string,
  answer_a: string,
  answer_b: string,
  answer_c: string,
  answer_d: string,
  correctAnswer: Chapter16ReassessmentAnswer,
  explanation: string,
): Chapter16ReassessmentQuestion => ({
  id, conceptFamilyId, difficulty, question,
  answer_a, answer_b, answer_c, answer_d, correctAnswer, explanation,
})

export const chapter16ReassessmentReserve: readonly Chapter16ReassessmentQuestion[] = [
  q('r16-design-001','ch16-design-foundations','understanding','Which design element most directly describes where visual heaviness accumulates in a haircut?','Weight','Color','Product hold','Shampoo frequency','a','Weight describes where visual heaviness or mass is concentrated in the haircut.'),
  q('r16-design-002','ch16-design-foundations','application','A client wants a strong perimeter with minimal layering. Which foundational structure best matches that goal?','Blunt','Uniform layer','Long layer','Graduated interior only','a','A blunt structure preserves a strong perimeter and visible weight line.'),
  q('r16-design-003','ch16-design-foundations','scenario','A client wants interior movement while keeping more visible length around the perimeter. Which structure is the best starting point?','Long layered','Blunt only','Zero-elevation graduation','One-length only','a','Long layering can preserve more perimeter length while adding interior movement.'),
  q('r16-design-004','ch16-design-foundations','application','What should guide selection among the four foundational haircut structures?','Client goals, hair analysis, shape, weight, and movement','The barber’s favorite technique only','The same structure for every client','Product brand','a','Structure selection should follow the client, hair analysis, and intended design.'),
  q('r16-design-005','ch16-design-foundations','understanding','Why is elevation important in haircut design?','It influences weight distribution and layering','It determines hair color','It disinfects tools','It replaces sectioning','a','Elevation changes how length and weight are distributed through the haircut.'),

  q('r16-blunt-001','ch16-blunt-cut','understanding','What is most characteristic of a blunt haircut?','A strong perimeter with little to no elevation','Equal-length layers at 90 degrees','High interior elevation only','Random weight removal','a','Blunt cutting keeps hair near natural fall and preserves perimeter weight.'),
  q('r16-blunt-002','ch16-blunt-cut','scenario','A perimeter looks uneven after the client returns to neutral head position. What should be checked first?','Head position and cutting-line control','Thermal-tool temperature','Hair color formula','Retail product price','a','Head position can change how the perimeter falls and should be controlled during blunt cutting.'),
  q('r16-blunt-003','ch16-blunt-cut','application','Why is cross-checking useful in a blunt cut?','It helps verify balance and perimeter consistency','It creates curls','It replaces the guide','It increases density','a','Cross-checking helps identify inconsistencies before finishing.'),
  q('r16-blunt-004','ch16-blunt-cut','application','What should a barber do if the blunt guide becomes difficult to see?','Reduce section size and re-establish visual control','Guess the line','Increase elevation randomly','Skip the guide','a','Controlled sections improve visibility and guide accuracy.'),
  q('r16-blunt-005','ch16-blunt-cut','understanding','What does natural fall support in a one-length design?','Perimeter weight','Interior graduation','Maximum layering','Overdirection','a','Natural fall supports a heavier perimeter and one-length appearance.'),

  q('r16-grad-001','ch16-graduated-cut','understanding','What distinguishes graduation from a blunt structure?','Controlled elevation that builds weight through a planned area','No elevation at all','Equal-length layers around the head','Only perimeter texturizing','a','Graduation uses elevation to create visible weight buildup.'),
  q('r16-grad-002','ch16-graduated-cut','application','Why are controlled subsections important in graduation?','They help repeat elevation and cutting angle','They eliminate the guide','They guarantee identical density','They replace cross-checking','a','Controlled subsections improve consistency of elevation and weight buildup.'),
  q('r16-grad-003','ch16-graduated-cut','scenario','The graduated shape is heavier on one side. What should be evaluated?','Elevation, guide control, head position, and subsection consistency','Only product choice','Only blow-dry brush size','Only cape placement','a','Asymmetry can come from inconsistent control variables during cutting.'),
  q('r16-grad-004','ch16-graduated-cut','application','What is a key purpose of the guide in a graduated cut?','Maintain planned length and weight progression','Determine hair color','Set thermal temperature','Replace consultation','a','The guide supports repeatable length and shape decisions.'),
  q('r16-grad-005','ch16-graduated-cut','understanding','What visual result is commonly associated with graduation?','Stacked or built-up weight','No visible shape','Uniform equal-length layers only','A completely weightless perimeter','a','Graduation creates deliberate weight buildup in the planned area.'),

  q('r16-uniform-001','ch16-uniform-layer','understanding','Which elevation is most associated with uniform layering?','90 degrees','0 degrees','45 degrees only','Natural fall only','a','Uniform layering is commonly built around approximately 90-degree elevation.'),
  q('r16-uniform-002','ch16-uniform-layer','application','What does consistent 90-degree elevation help create?','More even layer distribution around the head','A heavy one-length perimeter only','No movement','Maximum graduation at the nape','a','Consistent elevation supports a more even layered structure.'),
  q('r16-uniform-003','ch16-uniform-layer','scenario','One area of a uniform-layered cut looks longer than the surrounding shape. What should be checked?','Guide control, elevation, and distribution','Only hair color','Only shampoo choice','Only product hold','a','A local length inconsistency often reflects control of guide, elevation, or distribution.'),
  q('r16-uniform-004','ch16-uniform-layer','understanding','What type of guide is commonly useful for maintaining uniform layers around the head?','A traveling guide','No guide','A fixed perimeter-only guide','A color swatch','a','A traveling guide can support consistent layered length around the head shape.'),
  q('r16-uniform-005','ch16-uniform-layer','application','Which client goal best fits a uniform-layered structure?','Movement and distributed layers without a heavy bottom line','A single one-length perimeter only','No interior movement','Maximum stacked weight at the nape','a','Uniform layering distributes weight and creates movement through the shape.'),

  q('r16-long-001','ch16-long-layer','understanding','What is the main purpose of long layering?','Preserve more perimeter length while adding interior movement','Create only a one-length line','Build maximum nape weight','Remove all perimeter length','a','Long layering keeps more visible length while introducing shorter interior layers.'),
  q('r16-long-002','ch16-long-layer','application','What cutting control helps create long layers while preserving more perimeter length?','Higher elevation with deliberate guide control','Zero elevation throughout','Random notching','No sectioning','a','Higher elevation can create shorter interior lengths while preserving more perimeter.'),
  q('r16-long-003','ch16-long-layer','scenario','The finished shape lost more perimeter length than the client wanted. What should be reviewed?','Elevation, overdirection, guide placement, and section control','Only product choice','Only blow-dry direction','Only shampoo frequency','a','Those controls influence how much perimeter length remains.'),
  q('r16-long-004','ch16-long-layer','understanding','Why should the intended finished state be evaluated after a long-layer service?','Drying and styling can reveal balance and movement','Wet hair always proves the final result completely','Styling replaces cross-checking','Only product sales matter','a','The finished state can make balance and movement easier to evaluate.'),
  q('r16-long-005','ch16-long-layer','application','A client wants long visible length with softer internal movement. Which choice best fits?','Long-layered structure','Blunt-only structure','Maximum graduation','One fixed short guide for all hair','a','Long layering is designed for perimeter preservation with interior movement.'),

  q('r16-analysis-001','ch16-hair-analysis-texture','understanding','Which factors belong in haircut analysis?','Texture, density, growth pattern, curl behavior, and design goal','Only hair color','Only client age','Only product brand','a','Multiple hair characteristics and the design goal should guide technique selection.'),
  q('r16-analysis-002','ch16-hair-analysis-texture','scenario','A curly-haired client shows a straight-hair inspiration photo. What is the best response?','Discuss curl behavior and shrinkage, then adapt the design','Copy the photo exactly without discussion','Refuse automatically','Cut only to the wet pictured length','a','The design should be adapted to the client’s actual curl behavior and goals.'),
  q('r16-analysis-003','ch16-hair-analysis-texture','application','How should density affect haircut planning?','It should inform sectioning, weight removal, and design decisions','It should determine one mandatory haircut','It should be ignored','It replaces consultation','a','Density is one factor in deciding how to control weight and section the hair.'),
  q('r16-analysis-004','ch16-hair-analysis-texture','understanding','Why can apparent length change as curly hair dries?','Curl pattern and shrinkage can change the visible length and silhouette','Hair always stretches longer when dry','Color changes the length','Density disappears after drying','a','Curl behavior can change visible length and shape as hair dries.'),
  q('r16-analysis-005','ch16-hair-analysis-texture','application','What is the safest general approach to a strong growth pattern or cowlick?','Observe natural fall and adapt the design/technique','Ignore it and cut against it automatically','Use the same tension everywhere','Remove it with chemicals','a','Growth patterns should be observed and incorporated into design decisions.'),

  q('r16-advanced-001','ch16-advanced-techniques-texturizing','application','What should determine whether razor cutting is appropriate?','Hair condition, texture, density, desired finish, blade condition, and technique','Density alone','Client age alone','Tool price','a','Razor suitability depends on multiple hair and technique factors.'),
  q('r16-advanced-002','ch16-advanced-techniques-texturizing','scenario','Hair appears fragile and highly porous. What should the barber do before choosing a razor?','Reassess suitability and consider a more controlled alternative','Use heavier pressure','Assume razor cutting is always appropriate','Ignore condition if the client requests it','a','Vulnerable hair calls for greater caution and condition-based tool selection.'),
  q('r16-advanced-003','ch16-advanced-techniques-texturizing','understanding','What is the main purpose of point cutting?','Soften or break up a solid edge','Build a one-length perimeter','Change hair color','Set thermal temperature','a','Point cutting modifies the edge and can soften a solid line.'),
  q('r16-advanced-004','ch16-advanced-techniques-texturizing','application','Which technique can reduce interior bulk while preserving most visible length?','Slithering','Blunt perimeter cutting only','Zero elevation only','A stationary color guide','a','Slithering can remove bulk along a section while retaining much of the visible length.'),
  q('r16-advanced-005','ch16-advanced-techniques-texturizing','understanding','Why should advanced techniques support the haircut structure?','They refine shape and weight best when used toward a clear design goal','They replace the need for structure','They guarantee every haircut will match a photo','They remove the need for consultation','a','Advanced techniques are refinements, not substitutes for a sound structure.'),

  q('r16-style-001','ch16-styling-finishing-safety','application','Which thermal practice best reflects Chapter 16 safety guidance?','Use the lowest effective heat for the hair condition and service goal','Use the highest available heat','Hold heat in one place','Ignore tool directions','a','The lowest effective temperature and controlled heat exposure reduce unnecessary thermal stress.'),
  q('r16-style-002','ch16-styling-finishing-safety','scenario','A heated tool is not labeled for damp or wet use. What should the barber do?','Use it on dry hair according to its directions','Use it on wet hair anyway','Increase heat to speed drying','Ignore labeling','a','Thermal tools should be used according to their labeled design and manufacturer directions.'),
  q('r16-style-003','ch16-styling-finishing-safety','application','Where should a hot thermal tool rest between sections?','On a suitable heat-resistant surface','Directly on the client cape','On any plastic surface','On the client’s lap','a','A heat-resistant surface helps protect the client and work area.'),
  q('r16-style-004','ch16-styling-finishing-safety','understanding','Why is styling useful at the end of a haircut?','It can reveal balance, movement, weight distribution, and areas needing refinement','It guarantees the cut is perfect','It replaces sanitation','It removes the need for consultation','a','The intended finished state can reveal how the haircut behaves and balances.'),
  q('r16-style-005','ch16-styling-finishing-safety','application','What should happen to reusable tools after service as appropriate?','Clean and disinfect them according to applicable procedure','Store them without cleaning','Rinse only if visibly dirty','Share them immediately with the next client','a','Appropriate cleaning and disinfection are part of professional service closeout.'),
]

export function getChapter16ReassessmentReserve(
  conceptFamilyId: Chapter16ConceptFamilyId,
): readonly Chapter16ReassessmentQuestion[] {
  return chapter16ReassessmentReserve.filter((question) => question.conceptFamilyId === conceptFamilyId)
}
