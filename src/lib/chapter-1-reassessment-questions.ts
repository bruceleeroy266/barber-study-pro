import type { QuizQuestion } from '@/types'

type Fact={cue:string;correct:string;distractors:[string,string,string]}
type Family={facts:readonly Fact[]}
const families:readonly Family[]=[
{facts:[
{cue:'the origin of the word barber',correct:'The word comes from the Latin barba, meaning beard.',distractors:['It comes from a Greek word meaning scissors.','It comes from a French word meaning surgeon.','It comes from a Roman word meaning shop.']},
{cue:'early haircutting implements',correct:'Early people used sharpened flints, shells, bone, and other simple cutting materials.',distractors:['Electric clippers were the earliest haircutting tool.','Steel shears were used in the Glacial Age.','Bronze razors were the only prehistoric cutting tool.']},
{cue:'ancient Egyptian grooming',correct:'Egyptian priests practiced regular ritual body shaving as part of religious purification.',distractors:['Egyptian priests were forbidden to remove hair.','Only soldiers were permitted to shave in Egypt.','Egyptian shaving was performed only for medical surgery.']},
{cue:'Alexander the Great and shaving',correct:'Alexander ordered soldiers to shave so enemies could not grab their beards in combat.',distractors:['He ordered shaving to identify priests.','He ordered shaving because beards were taxed.','He ordered shaving to copy Roman barbers.']},
{cue:'historical hair beliefs',correct:'Hair often carried spiritual, social, or cultural meaning in ancient societies.',distractors:['Ancient societies treated hair as purely decorative.','Hair customs had no connection to identity or belief.','Only modern cultures attach meaning to hair.']},
]},
{facts:[
{cue:'the Council of Tours and barber-surgeons',correct:'Restrictions on clergy performing blood-related procedures helped shift surgical duties toward barbers.',distractors:['The council banned barbering in Europe.','The council created the first electric clipper company.','The council ended all surgical work immediately.']},
{cue:'barber-surgeon services',correct:'Barber-surgeons historically performed services such as bloodletting, tooth extraction, and other minor procedures.',distractors:['They performed only hair styling.','They were restricted to cosmetics and perfumes.','They never handled medical procedures.']},
{cue:'the separation of surgeons and barbers',correct:'The formal separation is associated with 1745 in England.',distractors:['The separation occurred in 1163.','The separation occurred in 1897.','The separation occurred in 1929.']},
{cue:'traditional barber-pole symbolism',correct:'Red and white are tied to blood and bandages, with blue commonly linked to veins or American patriotic symbolism.',distractors:['The colors originally represented haircut lengths.','The colors identify clipper guard sizes.','The colors were chosen only for decoration.']},
{cue:'tonsure',correct:'Tonsure was a religious shaving practice associated with clergy.',distractors:['Tonsure was an electric clipper technique.','Tonsure was a barber licensing exam.','Tonsure was a Roman barbershop tax.']},
]},
{facts:[
{cue:'the evolution of cutting tools',correct:'Barbering tools progressed from primitive cutting materials to metal shears, razors, and powered clippers.',distractors:['Powered clippers existed before metal cutting tools.','Tool development stopped after the Bronze Age.','Modern razors predate primitive stone tools.']},
{cue:'early electric clippers',correct:'Leo J. Wahl is associated with the first practical electric hair clippers and early Wahl development.',distractors:['NABBA invented electric clippers.','The Council of Tours invented electric clippers.','Pythagoras founded the first clipper company.']},
{cue:'major clipper manufacturers',correct:'Wahl, Andis, and Oster became major names in electric clipper development.',distractors:['Gillette, NABBA, and Moler were the three main clipper manufacturers.','Mena, Hadrian, and Wahl were the three main clipper manufacturers.','Only one company ever manufactured electric clippers.']},
{cue:'scissors and shears',correct:'Metalworking advances allowed scissors and shears to become more durable and precise over time.',distractors:['Modern shears are identical to prehistoric flint tools.','Scissors were invented after electric clippers.','Shears never changed after the ancient world.']},
{cue:'razor development',correct:'Razor technology evolved from early metal blades to straight razors, safety razors, electric razors, and modern systems.',distractors:['Safety razors existed before metal blades.','Straight razors were invented after electric razors.','Razor design has never changed.']},
]},
{facts:[
{cue:'the first U.S. barber licensing law',correct:'Minnesota passed the first barber licensing law in 1897.',distractors:['Oklahoma passed the first law in 1745.','New York passed the first law in 1163.','California passed the first law in 1929.']},
{cue:'the purpose of licensing',correct:'Licensing protects the public by setting education, sanitation, safety, and competency requirements.',distractors:['Licensing exists mainly to control haircut prices.','Licensing replaces infection-control training.','Licensing applies only to shop decoration.']},
{cue:'NABBA',correct:'NABBA supports cooperation among barber boards and professional licensing standards.',distractors:['NABBA is an electric clipper manufacturer.','NABBA is a medieval surgeon guild.','NABBA regulates only hair color products.']},
{cue:'display of the barber pole',correct:'Use of the barber pole can be restricted by state law to properly licensed barber establishments or professionals.',distractors:['Anyone may always display a barber pole regardless of state law.','The barber pole is regulated only by clipper manufacturers.','The barber pole has no connection to professional regulation.']},
{cue:'professional standards',correct:'Modern barber regulation emphasizes public health, safe practice, education, and accountability.',distractors:['Modern regulation focuses only on historical trivia.','Modern regulation removes sanitation requirements.','Modern standards eliminate the need for competency testing.']},
]},
{facts:[
{cue:'why barbering history matters today',correct:'History helps explain professional identity, symbols, standards, and the evolution of modern barbering.',distractors:['History has no relationship to modern professional practice.','History matters only to museum workers.','History replaces current safety standards.']},
{cue:'the changing barbershop',correct:'Barbershops have changed with fashion, technology, licensing, and consumer-service trends.',distractors:['Barbershops have remained unchanged for centuries.','Only licensing affects barbershop change.','Technology has never affected barbering.']},
{cue:'professional identity',correct:'Modern barbering combines technical skill, public-service responsibility, and a long professional tradition.',distractors:['Modern barbering has no professional standards.','Professional identity depends only on shop décor.','Technical skill and public safety are unrelated to barbering.']},
{cue:'the decline of some traditional barbershops',correct:'Changing hairstyles, unisex salons, and broader service trends contributed to decline in some periods.',distractors:['The decline was caused only by electric clippers.','Licensing laws eliminated all barbershops.','Traditional barbershops disappeared permanently worldwide.']},
{cue:'historical legacy and modern standards',correct:'Historical development helps explain why today’s profession emphasizes competency, sanitation, regulation, and client trust.',distractors:['Historical development proves regulation is unnecessary.','Modern standards are unrelated to public protection.','Client trust has no connection to professional standards.']},
]},
]

const stems=[
 (cue:string)=>`Which statement BEST applies to ${cue}?`,
 (cue:string)=>`A student is reviewing ${cue}. Which correction is MOST accurate?`,
 (cue:string)=>`On a difficult Chapter 1 item about ${cue}, which option should remain after eliminating the inaccurate choices?`,
]
function rotate(correct:string,distractors:readonly string[],index:number){
 const pos=index%4; const answers=[...distractors]; answers.splice(pos,0,correct)
 return {answers,correct:['a','b','c','d'][pos] as 'a'|'b'|'c'|'d'}
}
const questions:QuizQuestion[]=[]
let sequence=31
for(const family of families){
 for(let variant=0;variant<3;variant++){
  for(const fact of family.facts){
   const r=rotate(fact.correct,fact.distractors,sequence)
   questions.push({id:`qq-1-${String(sequence).padStart(3,'0')}`,quiz_id:'quiz-1',question:stems[variant](fact.cue),answer_a:r.answers[0],answer_b:r.answers[1],answer_c:r.answers[2],answer_d:r.answers[3],correct_answer:r.correct,explanation:`Read carefully. Identify the historical concept in the stem, eliminate choices that conflict with the Chapter 1 lesson, and choose the best remaining answer: ${fact.correct}`,difficulty:'hard',order_index:sequence})
   sequence++
  }
 }
}
export const chapter1ReassessmentQuestions:QuizQuestion[]=questions
if(chapter1ReassessmentQuestions.length!==75) throw new Error(`Chapter 1 reassessment reserve must contain 75 questions; got ${chapter1ReassessmentQuestions.length}`)
